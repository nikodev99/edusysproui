import {Table} from "../../ui/layout/Table.tsx";
import PageWrapper from "../../view/PageWrapper.tsx";
import Datetime from "../../../core/datetime.ts";
import {useAttendanceRepo} from "../../../hooks/useAttendanceRepo.ts";
import {useStudentRepo} from "../../../hooks/useStudentRepo.ts";
import {Button, Flex, Form, TableColumnsType} from "antd";
import {Attendance, Individual} from "../../../entity";
import {AvatarTitle} from "../../ui/layout/AvatarTitle.tsx";
import RadioInput from "../../ui/form/RadioInput.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {attendanceSchema, AttendanceSchema} from "../../../schema";
import {
    AttendanceStatus,
    AttendanceStatusLiteral,
    statusToLiteral
} from "../../../entity/enums/attendanceStatus.ts";
import {useColumnSearch} from "../../../hooks/useColumnSearch.tsx";
import {useEffect, useRef, useState} from "react";
import {enumToObjectArray, getUniqueness} from "../../../core/utils/utils.ts";
import {redirectTo} from "../../../context/RedirectContext.ts";
import {text} from "../../../core/utils/text_display.ts";
import {LoadingButton} from "../../ui/layout/LoadingButton.tsx";
import {ValidationAlert} from "../../ui/form/ValidationAlert.tsx";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";

interface AttendanceInsertingProps {
    academicYear: string
    classeId: number
    date: Datetime
}

export const AttendanceInserting = (
    {academicYear, classeId, date}: AttendanceInsertingProps
) => {
    const [attendances, setAttendances] = useState<Attendance[]>([])
    const [isEmpty, setIsEmpty] = useState<boolean>(true)
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const classeName = useRef<string | undefined>(undefined);

    const {useGetClasseStudents} = useStudentRepo()
    const {useGetAllStudentClasseAttendanceOfTheDay, useInsertAttendances} = useAttendanceRepo()
    const {data: fetchedStudents} = useGetClasseStudents(classeId, academicYear)
    const {data: studentAttendances, isSuccess} = useGetAllStudentClasseAttendanceOfTheDay(classeId, academicYear, date.toDate())
    const {insert, isLoading: isInsertLoading} = useInsertAttendances()

    const {getColumnSearchProps} = useColumnSearch()

    const {control, formState: {errors, submitCount, isSubmitting, isLoading, isValidating}, reset, setValue, handleSubmit} = useForm<AttendanceSchema>({
        resolver: zodResolver(attendanceSchema),
        defaultValues: {attendance: {}}
    })

    useEffect(() => {
        if (isSuccess) {
            let arr: Attendance[] = []
            let empty = true
            if (studentAttendances && studentAttendances?.length > 0) {
                classeName.current = studentAttendances[0]?.classe?.name
                arr = studentAttendances
                empty = false
            }else {
                if (fetchedStudents && fetchedStudents?.length > 0) {
                    classeName.current = fetchedStudents[0]?.classe?.name
                    const students = getUniqueness(fetchedStudents, f => f.student, s => s.id)
                    const individuals = getUniqueness(students, s => s.personalInfo, p => p?.id as number)
                    
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
                        setValue(`attendance.${attendance.individual.id as number}.academicYear.id`, academicYear)
                        setValue(`attendance.${attendance.individual.id as number}.individual.id`, attendance.individual?.id as number)
                        setValue(`attendance.${attendance.individual.id as number}.classe.id`, classeId)
                        setValue(`attendance.${attendance.individual.id as number}.attendanceDate`, date.toDate())
                    }
                })
            }else {
                arr.forEach(attendance => {
                    if (attendance.individual?.id) {
                        setValue(
                            `attendance.${attendance.individual.id as number}.status`,
                            attendance.status ? statusToLiteral(attendance.status) : 0
                        )
                    }
                })
            }

        }
    }, [academicYear, isEmpty, classeId, date, fetchedStudents, isSuccess, reset, setValue, studentAttendances]);

    const options = enumToObjectArray(AttendanceStatus, true, AttendanceStatusLiteral)

    console.log('ERRORS: ', errors)
    console.log('SUBMIT COUNT: ', submitCount)
    console.log('ATTENDANCE ', {attendances, date: date.fullDay(), classeId, studentAttendances})

    const columns: TableColumnsType<Attendance> = [
        {
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

        if (isEmpty) {
            if (date.isBefore(Datetime.now().toDate())) {
                insert(data, [classeId, date.toDate()])
                    .then(response => {
                        if (response.success) {
                            setSuccessMessage(`Les données de présence de la classe ${classeName} à la date du ${date.fDate()} ont bien été mis à jour`)
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

    return(
        <PageWrapper>
            {successMessage && (<FormSuccess message={successMessage} isNotif />)}
            {errorMessage && (<FormError message={errorMessage} isNotif />)}
            {errors && Object.keys(errors).length > 0 && <ValidationAlert alertMessage='Erreur rencontrées'/>}

            <Form>
                <Table tableProps={{
                    dataSource: attendances,
                    columns: columns,
                    rowKey: a => a?.individual?.id,
                    size: 'middle',
                    loading: isSubmitting || isLoading || isValidating
                }} />
                <Flex align='center' justify='end' gap={10} style={{marginTop: '20px'}}>
                    <Button variant='solid' color='danger' onChange={() => redirectTo(text.att.label)}>Annulé</Button>
                    {
                        isEmpty && (
                            <LoadingButton
                                isDisabled={isInsertLoading}
                                buttonText='Mise à jour'
                                onConfirm={() => handleSubmit(handleOnSubmit)()}
                            />
                        )
                    }
                </Flex>
            </Form>
        </PageWrapper>
    )
}