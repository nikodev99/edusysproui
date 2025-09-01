import {Table} from "../../ui/layout/Table.tsx";
import PageWrapper from "../../view/PageWrapper.tsx";
import Datetime from "../../../core/datetime.ts";
import {useAttendanceRepo} from "../../../hooks/useAttendanceRepo.ts";
import {useStudentRepo} from "../../../hooks/useStudentRepo.ts";
import {Alert, Button, Flex, Form, TableColumnsType} from "antd";
import {Attendance, Classe, Individual, Student} from "../../../entity";
import {AvatarTitle} from "../../ui/layout/AvatarTitle.tsx";
import RadioInput from "../../ui/form/RadioInput.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {attendanceSchema, AttendanceSchema} from "../../../schema";
import {
    AttendanceStatus,
    AttendanceStatusLiteral, compareAttendanceStatus,
    statusToLiteral
} from "../../../entity/enums/attendanceStatus.ts";
import {useColumnSearch} from "../../../hooks/useColumnSearch.tsx";
import {useEffect, useState} from "react";
import {enumToObjectArray, getUniqueness} from "../../../core/utils/utils.ts";
import {redirectTo} from "../../../context/RedirectContext.ts";
import {text} from "../../../core/utils/text_display.ts";
import {LoadingButton} from "../../ui/layout/LoadingButton.tsx";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {AttendanceSelects} from "../../common/AttendanceSelects.tsx";

interface AttendanceInsertingProps {
    edit?: boolean
}

export const AttendanceInserting = (
    {edit}: AttendanceInsertingProps
) => {
    const [academicYear, setAcademicYear] = useState<string>('')
    const [classe, setClasse] = useState<Classe>()

    const [classeId, setClasseId] = useState<number>(0)
    const [date, setDate] = useState<Datetime>(Datetime.now())

    const [attendances, setAttendances] = useState<Attendance[]>([])
    const [isEmpty, setIsEmpty] = useState<boolean>(true)
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const {useGetClasseStudents} = useStudentRepo()
    const {useGetAllStudentClasseAttendanceOfTheDay, useInsertAttendances, useUpdateAttendances} = useAttendanceRepo()
    const {data: fetchedStudents} = useGetClasseStudents(classeId, academicYear)
    const {data: studentAttendances, isSuccess} = useGetAllStudentClasseAttendanceOfTheDay(classeId, academicYear, date.toDate())
    const {insert, isLoading: isInsertLoading} = useInsertAttendances()
    const {update, isLoading: isUpdateLoading} = useUpdateAttendances()

    const {getColumnSearchProps} = useColumnSearch()

    const {
        control,
        formState: {errors, submitCount, isSubmitting, isLoading, isValidating},
        reset,
        setValue,
        handleSubmit
    } = useForm<AttendanceSchema>({
        resolver: zodResolver(attendanceSchema),
        defaultValues: {attendance: {}}
    })

    useEffect(() => {
        if (isSuccess) {
            let arr: Attendance[] = []
            let empty = true
            if (studentAttendances && studentAttendances?.length > 0) {
                arr = studentAttendances
                empty = false
            }else {
                if (fetchedStudents && fetchedStudents?.length > 0) {
                    const students = getUniqueness(fetchedStudents, f => f.student, s => s.id)
                    const individuals = getUniqueness(students as Student[], s => s.personalInfo, p => p?.id as number)
                    
                    arr = individuals?.map(individual => ({
                        individual: individual
                    })) as Attendance[]
                }
            }
            setAttendances(arr)
            setIsEmpty(empty)

            // This is the crucial addition: reset the form and set new values
            reset({ attendance: {} }) // Clear the form first

            // Then set the correct values for the new data
            if (isEmpty) {
                arr.forEach(attendance => {
                    if (attendance.individual?.id) {
                        setValue(`attendance.${attendance?.individual?.id as number}.academicYear.id`, academicYear)
                        setValue(`attendance.${attendance?.individual?.id as number}.individual.id`, attendance.individual?.id as number)
                        setValue(`attendance.${attendance?.individual?.id as number}.classe.id`, classeId)
                        setValue(`attendance.${attendance?.individual?.id as number}.attendanceDate`, date.toDate())
                    }
                })
            }else {
                arr.forEach(attendance => {
                    if (attendance.individual?.id) {
                        if (edit) {
                            setValue(`attendance.${attendance?.individual?.id}.id`, attendance.id)
                            setValue(`attendance.${attendance?.individual?.id as number}.individual.id`, attendance.individual?.id as number)
                            setValue(`attendance.${attendance?.individual?.id as number}.classe.id`, classeId)
                        }
                        setValue(
                            `attendance.${attendance.individual.id as number}.status`,
                            attendance.status ? statusToLiteral(attendance.status) : 0
                        )
                    }
                })
            }

        }
    }, [academicYear, isEmpty, classeId, date, fetchedStudents, isSuccess, reset, edit, setValue, studentAttendances]);

    const options = enumToObjectArray(AttendanceStatus, true, AttendanceStatusLiteral)

    //console.log('ATTENDANCE ', {attendances, date: date.fullDay(), classeId, studentAttendances})

    const columns: TableColumnsType<Attendance> = [
        {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            title: 'Nom(s), Prénom(s)',
            ...getColumnSearchProps(['individual', 'lastName'] as never),
            dataIndex: 'individual',
            key: 'individuals',
            render: (individual: Individual) => <AvatarTitle
                firstName={individual?.firstName}
                lastName={individual?.lastName}
                image={individual?.image}
                size={35}
            />,
        },
        {
            title: 'Date',
            key:'attendanceDate',
            render: () => date.fullDay()
        },
        {
            title: 'Status de présence',
            dataIndex: 'individual',
            key: 'status',
            render: (_ind: Individual, record) => {
                return (
                    <RadioInput
                        control={control}
                        name={`attendance.${record?.individual?.id}.status` as never}
                        radioOptions={ options as []}
                        defaultValue={
                            record?.status ? statusToLiteral(record?.status) : AttendanceStatusLiteral.PRESENT
                        }
                        optionType='button'
                    />
                )
            }
        }
    ]

    const handleOnSubmit = (data: AttendanceSchema) => {

        setErrorMessage(undefined)
        setSuccessMessage(undefined)

        Object.values(data.attendance).forEach(attendance => {
            if (!attendance.status) {
                setValue(`attendance.${attendance?.individual?.id}.status`, AttendanceStatusLiteral.PRESENT)
            }
        })

        if (submitCount <= 0 && isEmpty) {
            if (date.isBefore(Datetime.now().toDate())) {
                insert(data, [classeId, date.toDate()])
                    .then(response => {
                        if (response.success) {
                            setSuccessMessage(`Les données de présence de la classe ${classe?.name} à la date du ${date.fDate()} ont bien été mis à jour`)
                        }
                        if (response.error) {
                            setErrorMessage(`${response.status} - ${response.error}`)
                        }
                    })
            }else {
                setErrorMessage(`Impossible de mettre à jour les données du futur: ${date.fDate()}`)
            }
        }else {
            setErrorMessage(`A la date du ${date.fDate()} les données de présence existent déjà`)
        }
    }

    console.log("ERRORS ", errors)

    function handleOnUpdate(data: AttendanceSchema) {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)

        const newData: AttendanceSchema = {attendance: {}}
        if (data.attendance) {
            attendances?.forEach(attendance => {
                const studentId: number = attendance?.individual?.id as number
                if (studentId && attendance.status) {
                    const oldStatus = attendance.status
                    const newStatus = data.attendance[studentId]?.status

                    console.log('STUDENT_ID ', {studentId, oldStatus, newStatus})

                    if (!compareAttendanceStatus(oldStatus, newStatus)) {
                        newData.attendance[studentId] = data?.attendance[studentId]
                    }
                }
            })
        }

        console.log('NEW DATA ', newData)

        if (submitCount <= 0 && !isEmpty) {
            if (date.isBefore(Datetime.now().toDate())) {
                update(newData)
                    .then(response => {
                        if (response.success) {
                            setSuccessMessage(`Les données de présence de la classe ${classe?.name} à la date du ${date.fDate()} ont bien été mis à jour`)
                        }
                        if (response.error) {
                            setErrorMessage(`${response.status} - ${response.error}`)
                        }
                    })
            }else {
                setErrorMessage(`Impossible d'éditer les données du futur: ${date.fDate()}`)
            }
        }else {
            setErrorMessage(`${submitCount > 0 
                ? 'Courant mis à jour déjà effectif'
                :`A la date du ${date.fDate()} les données de présence n'existent pas`}`)
        }
    }

    return(
        <>
            <AttendanceSelects
                setAcademicYear={setAcademicYear}
                setClasseId={setClasseId}
                getDate={setDate}
                getClasse={setClasse}
            />
            <PageWrapper>
                {successMessage && (<FormSuccess message={successMessage} isNotif />)}
                {errorMessage && (<FormError message={errorMessage} isNotif />)}
                {successMessage && (<Alert message={successMessage} type="success" showIcon style={{marginBottom: '10px'}} closable />)}
                {errorMessage && (<Alert message={errorMessage} type="error" showIcon style={{marginBottom: '10px'}} closable />)}

                <Form>
                    <Table tableProps={{
                    dataSource: attendances,
                    columns: columns,
                    rowKey: a => a?.individual?.id,
                    size: 'middle',
                    loading: isSubmitting || isLoading || isValidating
                }} />
                    <Flex align='center' justify='end' gap={10} style={{marginTop: '20px'}}>
                        <Button variant='solid' color='danger' onClick={() => redirectTo(text.att.href)}>Annulé</Button>
                        {
                            !edit && isEmpty && (
                                <LoadingButton
                                    isDisabled={isInsertLoading}
                                    buttonText='Mise à jour'
                                    onConfirm={() => handleSubmit(handleOnSubmit)()}
                                />
                            )
                        }
                        {
                            edit && !isEmpty && (
                                <LoadingButton
                                    isDisabled={isUpdateLoading}
                                    buttonText='Mise à jour'
                                    onConfirm={() => handleSubmit(handleOnUpdate)()}
                                />
                            )
                        }
                    </Flex>
                </Form>
            </PageWrapper>
        </>
    )
}