import {Assignment, Individual, Score, Student} from "@/entity";
import {useStudentRepo} from "@/hooks/actions/useStudentRepo.ts";
import {useForm, useWatch} from "react-hook-form";
import {scoreSchema, ScoreSchema} from "@/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Alert, Button, Flex, Form, TableColumnsType} from "antd";
import {Table} from "@/components/ui/layout/Table.tsx";
import PageWrapper from "@/components/view/PageWrapper.tsx";
import {AvatarTitle} from "@/components/ui/layout/AvatarTitle.tsx";
import TextInput from "@/components/ui/form/TextInput.tsx";
import {useEffect, useState} from "react";
import {LoadingButton} from "@/components/ui/layout/LoadingButton.tsx";
import {catchError} from "@/data/action/error_catch.ts";
import {useQueryPost} from "@/hooks/usePost.ts";
import {saveAllScores, updateAllScores} from "@/data/repository/scoreRepository.ts";
import {ValidationAlert} from "@/components/ui/form/ValidationAlert.tsx";
import {PatchUpdate} from "@/core/PatchUpdate.ts";
import {UpdateType} from "@/core/shared/sharedEnums.ts";
import {useQueryUpdate} from "@/hooks/useUpdate.ts";
import {getUniqueness} from "@/core/utils/utils.ts";
import SelectInput from "@/components/ui/form/SelectInput.tsx";

export const ExamInsertScores = (
    {assignment, onClose, marks, load, loadMessage}: {
        assignment: Assignment,
        onClose?: (key?: string) => void,
        marks?: Score[],
        load?: (value: boolean) => void
        loadMessage?: (message: {success?: string, error?: string}) => void
    }
) => {
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const [scores, setScores] = useState<Score[]>([])
    const {useGetClasseStudents} = useStudentRepo()

    const {control, formState: {errors}, setValue, handleSubmit, reset} = useForm<ScoreSchema>({
        resolver: zodResolver(scoreSchema)
    })

    const watchedScores = useWatch({ control, name: 'scores' })

    const {mutate, isPending} = useQueryPost<ScoreSchema, [number]>(scoreSchema as never)
    const {mutate: updateMutate, isPending: updatePending} = useQueryUpdate<ScoreSchema, unknown[]>(scoreSchema as never)

    const {data, isSuccess, isLoading, isFetching} = useGetClasseStudents(
        assignment?.classe?.id as number,
        assignment?.semester?.academicYear?.id as string
    )

    const maxScale = assignment?.classe?.grade?.gradingScaleMax

    useEffect(() => {
        if (scores && scores?.length > 0) {
            scores.forEach((s, i) => {
                setValue(`scores.${i}.student.id`, s?.student?.id as string)
                setValue(`scores.${i}.assignment.id`, assignment?.id as number)
                setValue(`scores.${i}.id`, s?.id as number)
            })
        }
    }, [assignment?.id, reset, scores, setValue])

    useEffect(() => {
        if (marks && marks?.length > 0) {
            const sortedScores = [...marks].sort((a, b) => b.obtainedMark - a.obtainedMark)
            setScores(sortedScores)
        }else {
            if (isSuccess) {
                const fetchedStudents = getUniqueness(data, e => e.student, s => s.id)
                const generatedScores = fetchedStudents?.map(student => ({
                    student: student
                })) ?? [] as Score[]
                setScores(generatedScores as Score[])
            }
        }
    }, [data, isSuccess, marks]);

    const columns: TableColumnsType<Score> = [
        {
            title: 'Noms & Prénoms',
            dataIndex: ['student', 'personalInfo'],
            key: 'students',
            width: '30%',
            render: (info: Individual, record) =>  <AvatarTitle
                size={35}
                firstName={info?.firstName}
                lastName={info?.lastName}
                reference={record?.student?.personalInfo?.reference}
                image={info?.image}
            />
        },
        {
            title: 'Devoir',
            key: 'assignment',
            width: '30%',
            render: () => assignment?.examName
        },
        {
            title: 'Présence',
            dataIndex: 'student',
            key: 'attendance',
            width: '20%',
            render: (student: Student, _record, index) => {
                const score = scores && scores?.length > 0 ? scores?.find(s => s?.student?.id === student?.id) : null
                return <div style={{width: '100%'}}>
                    <SelectInput
                        key={index}
                        control={control}
                        name={`scores.${index}.isPresent`}
                        defaultValue={score?.isPresent ?? 1}
                        help={errors?.scores?.[index]?.isPresent ? errors?.scores?.[index]?.isPresent?.message : ''}
                        validateStatus={errors?.scores?.[index]?.isPresent ? 'error' : ''}
                        options={[
                            {label: 'Présent', value: 1, style: {background: '#D4F4DD', color: '#1a421d'}},
                            {label: 'Absent', value: 0, style: {background: '#FCD6D6', color: '#421111'}}
                        ]}
                    />
                </div>
            }
        },
        {
            title: 'Note',
            dataIndex: 'student',
            key: 'obtainedMark',
            width: '20%',
            render: (student: Student, _record, index) => {
                const score = scores && scores?.length > 0 ? scores?.find(s => s?.student?.id === student?.id) : null
                const isPresent = watchedScores?.[index]?.isPresent ?? score?.isPresent ?? true
                return <TextInput.Number
                    control={control}
                    name={`scores.${index}.obtainedMark`}
                    defaultValue={score?.obtainedMark || 0}
                    help={errors?.scores?.[index]?.obtainedMark ? errors?.scores?.[index]?.obtainedMark?.message : ''}
                    validateStatus={errors?.scores?.[index]?.obtainedMark ? 'error' : ''}
                    required
                    min={0}
                    max={maxScale}
                    disabled={!isPresent}
                />
            }
        }
    ]

    const handleCloseTab = (key?: string) => {
        onClose && onClose(key)
    }

    const onAssignmentPatch = async () => {
        await PatchUpdate.set(
            'passed',
            {passed: true},
            assignment?.id as number,
            () => {
                loadMessage?.({success: "Les notes ont étés ajoutés avec succès et le devoir a été traité avec succès"})
                handleCloseTab()
            },
            (msg: string | undefined) => loadMessage?.({error: msg}),
            UpdateType.ASSIGNMENT
        )
    }

    const flushMark = (data: ScoreSchema): void => {
        data?.scores?.forEach((d, i) => {
            if (!d.isPresent) {
                setValue(`scores.${i}.obtainedMark`, 0)
            }
            if (d.isPresent === undefined || d.isPresent === null) {
                setValue(`scores.${i}.isPresent`, true)
            }
        })
    }

    const onSubmit = (data: ScoreSchema, isPatch: boolean = false) => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)

        flushMark(data)

        data?.scores?.forEach((d, i) => {
            if (!d.obtainedMark) {
                setValue(`scores.${i}.obtainedMark`, 0)
            }
            if (d.isPresent === undefined || d.isPresent === null) {
                setValue(`scores.${i}.isPresent`, true)
            }
        })

        mutate({postFn: saveAllScores as never, data: data, params: [assignment?.id as number]}, {
            onSuccess: async (response) => {
                if (response.status === 200) {
                    if (isPatch) {
                        await onAssignmentPatch()
                    }else {
                        setSuccessMessage('Les notes ont étés ajoutés avec succès.')
                        load && load(true)
                    }
                }
            },
            onError: error => setErrorMessage(catchError(error) as string)
        })
    }

    const onModify = (data: ScoreSchema, isPatch: boolean = false) => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)

        flushMark(data)

        const newData: ScoreSchema = {scores: []}
        if (data?.scores) {
            newData.scores = data.scores?.filter(score => {
                const originalScore = scores?.find(s => s.id === score.id)
                return originalScore?.isPresent !== score?.isPresent || originalScore?.obtainedMark !== score?.obtainedMark
            })
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        updateMutate({putFn: updateAllScores, data: newData, id: [assignment?.id as number]}, {
            onSuccess: async (response) => {
                if (response.status === 200) {
                    if (isPatch) {
                        await onAssignmentPatch()
                    }else {
                        setSuccessMessage('Les notes ont étés ajoutés avec succès.')
                        load && load(true)
                    }
                }
            },
            onError: error => setErrorMessage(catchError(error) as string)
        })
    }

    const handleOnSubmit = (data: ScoreSchema) => {
        onSubmit(data)

    }

    const handleSubmitWithPatch = (data: ScoreSchema) => {
        onSubmit(data, true)
    }

    const handleOnModifying = (data: ScoreSchema) => {
        onModify(data)
    }

    const handleModifyingWithPatch = (data: ScoreSchema) => {
        onModify(data, true)
    }

    console.log("ERRORS: ", errors)

    return (
        <PageWrapper>
            {successMessage && (<Alert message={successMessage} type="success" showIcon style={{marginBottom: '10px'}}/>)}
            {errorMessage && (<Alert message={errorMessage} type="error" showIcon style={{marginBottom: '10px'}}/>)}
            {errors && Object.keys(errors).length > 0 && <ValidationAlert alertMessage='Erreur rencontrées'/>}
            <Form>
                <Table tableProps={{
                    columns: columns as [],
                    dataSource: scores,
                    pagination: false,
                    rowKey: record => record?.student?.id as string,
                    size: 'middle',
                    loading: isLoading || isFetching
                }} />
                <Flex align='center' justify='flex-end' gap='10px' style={{marginTop: '20px'}}>
                    <Button color='danger' variant='solid' onClick={handleCloseTab as () => void}>Annulé</Button>
                    {
                        marks && marks?.length > 0 ? (
                            <LoadingButton
                                isDisabled={updatePending}
                                buttonText='Mise à Jour'
                                onConfirm={() => handleSubmit(handleOnModifying)()}
                            />
                        ) : (
                            <LoadingButton
                                isDisabled={isPending}
                                buttonText='Noté'
                                onConfirm={() => handleSubmit(handleOnSubmit)()}
                            />
                        )
                    }
                    {
                        marks && marks?.length > 0 ? (
                            <LoadingButton
                                isDisabled={updatePending}
                                buttonText='Mise à Jour & Traité'
                                onConfirm={() => handleSubmit(handleModifyingWithPatch)()}
                            />
                        ) : (
                            <LoadingButton
                                isDisabled={isPending}
                                buttonText='Noté & Traité'
                                onConfirm={() => handleSubmit(handleSubmitWithPatch)()}
                            />
                        )
                    }
                </Flex>
            </Form>
        </PageWrapper>
    )
}