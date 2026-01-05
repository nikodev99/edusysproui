import {useEffect, useLayoutEffect, useMemo, useState} from "react";
import {Assignment, Course, Enrollment, Exam, Student} from "@/entity";
import {Badge, Card, Segmented, TableColumnsType, Tag as AntTag, Typography} from "antd";
import VoidData from "@/components/view/VoidData.tsx";
import Responsive from "@/components/ui/layout/Responsive.tsx";
import Grid from "@/components/ui/layout/Grid.tsx";
import Datetime from "@/core/datetime.ts";
import {Widgets} from "@/components/ui/layout/Widgets.tsx";
import {
    calculateGlobalAverage,
    calculateSubjectsAverage, calculateTotalMarks,
    calculeMarkAverage, findPercent,
    getAssignmentBarData, getGoodAverageMedian,
    getUniqueness, zeroFormat,
} from "@/core/utils/utils.ts";
import {BarChart} from "@/components/graph/BarChart.tsx";
import {AssignmentTypeLiteral, typeColors} from "@/entity/enums/assignmentType.ts";
import {ExamView, NestedExamView, TypedAssignment} from "@/core/utils/interfaces.ts";
import {Table} from "@/components/ui/layout/Table.tsx";
import {AvatarTitle} from "@/components/ui/layout/AvatarTitle.tsx";
import {InitMarkType} from "@/core/utils/tsxUtils.tsx";
import {text} from "@/core/utils/text_display.ts";
import {redirectTo} from "@/context/RedirectContext.ts";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {useExamRepo} from "@/hooks/actions/useExamRepo.ts";
import {useStudentRepo} from "@/hooks/actions/useStudentRepo.ts";

const ExamDescription = (
    {classeId, academicYear, examId, uniqueStudent}: {classeId: number, academicYear: string, examId: number, uniqueStudent?: Enrollment},
) => {

    const {Link, Title} = Typography

    const [students, setStudents] = useState<Enrollment[] | null>(null)
    const [assignments, setAssignments] = useState<Assignment[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [totalMarks, setTotalMarks] = useState<number>(0)
    const {toViewStudent} = useRedirect()
    const {useGetExamAssignments} = useExamRepo()
    const {useGetClasseStudents} = useStudentRepo()

    const {data, isSuccess, isPending, isFetching, isRefetching, isLoading, refetch} = useGetExamAssignments(
        examId, classeId, academicYear, uniqueStudent ? uniqueStudent?.student?.id : undefined
    )

    console.log("ASSIGNMENTS DATA: ", data)

    const {data: classeStudents} = useGetClasseStudents(classeId, academicYear, {enable: !uniqueStudent})
    
    useEffect(() => {
        if (examId || academicYear || classeId)
            refetch().then()
        
        if (isSuccess) {
            setAssignments('assignments' in data ? data.assignments as Assignment[] : null)
        }
    }, [academicYear, classeId, data, examId, isSuccess, refetch])

    useEffect(() => {
        if (!uniqueStudent && classeStudents) {
            setStudents(classeStudents)
        }else {
            setStudents([uniqueStudent as Enrollment])
        }
    }, [classeStudents, uniqueStudent])

    useEffect(() => {
        if (!isPending && !isFetching && !isRefetching && !isLoading) {
            setLoading(false)
        }
        
        if (assignments && assignments?.length)
            setTotalMarks(calculateTotalMarks(assignments))
            
    }, [assignments, isFetching, isLoading, isPending, isRefetching])

    const barData = getAssignmentBarData(assignments)

    const uniqueAssignmentTypes = useMemo(() => {
        return Array.from(new Set(assignments?.map(a => a?.type)))
    }, [assignments])
    
    const uniqueCourses = useMemo(() => {
        return assignments && assignments.length ? getUniqueness(assignments, a => a?.subject, s => s?.id as number) : []
    }, [assignments])
    
    const uniqueExamName = useMemo(() => {
        return Array.from(new Set(assignments?.map(a => a?.examName)))
    }, [assignments])

    const examView = useMemo(() => {
        return students?.map(s => {
            const studentAssignments = assignments?.map(a => ({
                ...a,
                marks: a?.marks?.filter(score => score?.student?.id === s?.student?.id)
            })) as Assignment[]

            const typesWithAverage: TypedAssignment[] = []
            const nested: NestedExamView[] = []

            uniqueAssignmentTypes?.forEach(type => {
                const filteredAssignment = studentAssignments?.filter(a => {
                    return a?.type === type
                })
                const average = calculateGlobalAverage(filteredAssignment)
                typesWithAverage.push({type: type as AssignmentTypeLiteral, average: average})
            })

            const courseAverages = calculateSubjectsAverage(studentAssignments)
            const totalAverage = calculeMarkAverage(courseAverages)

            if (uniqueCourses && uniqueCourses?.length) {
                uniqueCourses?.forEach(course => {
                    const filteredAssignment = studentAssignments?.filter(a => a?.subject?.id === course?.id)
                    nested?.push({
                        subject: course,
                        assignments: filteredAssignment,
                    })
                })
            }else {
                uniqueExamName?.forEach(examName => {
                    const filteredAssignment = studentAssignments?.filter(a => a?.examName == examName)
                    nested?.push({
                        subject: examName,
                        assignments: filteredAssignment,
                    })
                })
            }

            return {
                id: s?.student?.id,
                student: s?.student,
                type: typesWithAverage,
                totalAverage,
                rank: 0,
                nested: nested
            }
        }) ?? []
    }, [assignments, students, uniqueAssignmentTypes, uniqueCourses, uniqueExamName])

    const view = getGoodAverageMedian(examView as [])

    const assignmentsColumns: TableColumnsType<Assignment> = [
        {
            title: '',
            dataIndex: 'id',
            align: 'right',
            width: '8%',
            render: (text, record) => <Link onClick={() => redirectTo(text.exam.group.view.href + record?.id)} strong>
                {`#${zeroFormat(text)}`}
            </Link>
        },
        {
            title: 'Designation',
            dataIndex: 'examName',
            width: '30%',
            render: (value, record) => <Link onClick={() => redirectTo(text.exam.group.view.href + record?.id)}>
                {value}
            </Link>
        },
        {
            title: 'Matière',
            dataIndex: ['subject', 'course'],
            width: '20%',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            responsive: ['md'],
            width: '10%',
            render: (value: AssignmentTypeLiteral) => {
                const type = AssignmentTypeLiteral[value as unknown as keyof typeof AssignmentTypeLiteral]
                return (<AntTag color={typeColors(type) as string}>{type}</AntTag>)
            }
        },
        {
            title: 'Date',
            dataIndex: 'examDate',
            width: '15%',
            render: text => Datetime.of(text).fDate()
        }
    ]

    const averageColumns: TableColumnsType<ExamView> = [
        {
            title: 'Nom(s), prénoms(s)',
            dataIndex: 'student',
            key: 'student',
            align: "left",
            width: '30%',
            render: (student: Student) => <AvatarTitle
                lastName={student?.personalInfo?.lastName}
                firstName={student?.personalInfo?.firstName}
                image={student?.personalInfo?.image}
                reference={student?.personalInfo?.reference}
                toView={() => toViewStudent(student?.id, student?.personalInfo)}
                size={40}
            />
        },
        ...(uniqueAssignmentTypes && uniqueAssignmentTypes.length ? uniqueAssignmentTypes.map(type => ({
            align:'center' as 'start',
            title: AssignmentTypeLiteral[type as unknown as keyof typeof AssignmentTypeLiteral],
            dataIndex: 'type',
            key: 'assignment-type',
            render: (text: TypedAssignment[]) => {
                const match = text?.find(a => a.type === type)
                return match ? <Title level={4}>
                    {match.average?.toFixed(2)} <Badge color={match?.average >= 14 ? 'green' : match?.average >= 10 ? 'gold' : 'red' } />
                </Title> : '-'
            }
        })): []),
        {
            title: 'Moyenne',
            dataIndex: 'totalAverage',
            key: 'average',
            align: "center",
            sorter: (a, b) => (b.totalAverage ?? 0) - (a.totalAverage ?? 0),
            defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            render: (text: number) => {
                return <div>
                    {text ? <Title level={4}>
                        {text?.toFixed(2)} <Badge color={text >= 14 ? 'green' : text >= 10 ? 'gold' : 'red' } />
                    </Title> : '-'}
                </div>
            }
        },
        {
            title: 'Position',
            dataIndex: 'student',
            key: 'rank',
            align: "center",
            render: (text: Student) => {
                const sortedStudents = examView && [...examView].sort((a, b) => {
                    return (b.totalAverage ?? 0) - (a.totalAverage ?? 0);
                });
                return sortedStudents.findIndex(e => e.student?.id === text?.id) + 1
            }
        },
        {
            title: 'Appréciation',
            dataIndex: 'totalAverage',
            key: 'app',
            align: "center",
            render: (text: number) => text ? <InitMarkType av={text} /> : '-'
        }
    ]

    const getMaxAssignmentsForType = (type: AssignmentTypeLiteral): number => {
        if (!examView || !examView[0] || !examView[0].nested) {
            return 0;
        }
        const counts = examView[0].nested.map(row => {
            if (!row || !row.assignments) {
                return 0;
            }
            return row.assignments.filter(a => a?.type === type).length;
        });
        if (!counts.length) {
            return 0;
        }

        return Math.max(...counts);
    }

    const nestedTableColumns: TableColumnsType<NestedExamView> = [
        {
            title: 'Matières',
            dataIndex: 'subject',
            key: 'subject',
            width: '30%',
            render: (text: Course | string) => typeof text === 'object' ? text?.course || '-' : text || '-'
        },
        ...(uniqueAssignmentTypes && uniqueAssignmentTypes.length ? uniqueAssignmentTypes.map(type => ({
            align:'center' as 'start',
            title: AssignmentTypeLiteral[type as unknown as keyof typeof AssignmentTypeLiteral],
            dataIndex: 'assignments',
            key: 'assignment-type',
            children: Array.from({ length: getMaxAssignmentsForType(type as AssignmentTypeLiteral) }, (_, index) => ({
                title: `D${index + 1}`,
                dataIndex: 'assignments',
                key: `assignment-${type}-${index}`,
                align: 'center',
                render: (text: Assignment[] = []) => {
                    const ass = text?.filter(a => a.type === type);
                    const mark = ass[index]?.marks?.[0]?.obtainedMark
                    const coefficient = ass[index]?.coefficient || 1
                    return (mark || mark === 0) ? (mark * coefficient) : "-";
                },
            }))
        })): []),
        {
            title: 'Moyenne',
            dataIndex: 'assignments',
            key: 'subject-averages',
            align: 'center',
            render: (text: Assignment[]) => {
                return text ? calculateGlobalAverage(text)?.toFixed(2) : '-'
            }
        }
    ]

    return(
        <>
            {assignments && assignments.length ?
                (
                    <Responsive gutter={[16, 16]}>
                        <Widgets items={[
                            {title: 'Nombre totale des dévoirs', value: assignments && assignments?.length || 0},
                            {title: 'Nombre totale de points', value: totalMarks},
                            {title: 'Taux de réussite', value: findPercent(view.average, students?.length || 0, true) as string},
                            {title: 'Moyenne médiane', value: view.median?.toFixed(2)},
                        ]} responsiveness hasShadow />
                        <Grid xs={24} md={12} lg={18}>
                            <Table
                                tableProps={{
                                    columns:assignmentsColumns,
                                    dataSource:assignments as [],
                                    scroll:{y: 300},
                                    size:'small',
                                    rowKey:'id'
                                }}
                            />
                        </Grid>
                        <Grid xs={24} md={12} lg={6}>
                            {barData && <Card title='Status des matières' size='small'>
                                <BarChart
                                    data={barData as []}
                                    dataKey={['valeur']}
                                    legend='matiere'
                                    layout='vertical'
                                    minHeight={300}
                                    height={300}
                                />
                            </Card>}
                        </Grid>
                        <Grid xs={24} md={24} lg={24}>
                            <Table
                                tableProps={{
                                    columns: averageColumns as [],
                                    dataSource: examView,
                                    scroll: {y: 700},
                                    loading: loading,
                                    rowKey: 'id',
                                    expandable: {
                                        expandedRowRender: (record) => (
                                            <Table tableProps={{
                                                columns: nestedTableColumns,
                                                dataSource: record.nested,
                                                rowKey: 'id',
                                                pagination: false,
                                                bordered: true,
                                                size: 'small'
                                            }} />
                                        ),
                                        defaultExpandAllRows: !!uniqueStudent
                                    }
                                }}
                            />
                        </Grid>
                    </Responsive>
                )
                : <VoidData />
            }
        </>
    )
}

export const ClasseExamView = (
    {classeId, academicYear, uniqueStudent}: {classeId: number, academicYear: string, uniqueStudent?: Enrollment}
) => {
    const [activeExam, setActiveExam] = useState<number>(0)
    const {useGetClasseExams} = useExamRepo()

    const classeExams = useGetClasseExams(classeId, academicYear)
    
    useLayoutEffect(() => {
        if (classeExams && classeExams?.length > 0) {
            setActiveExam(classeExams[0]?.id as number)
        }
    }, [classeExams])

    const segmentData = classeExams?.map((exam: Exam) => ({
        label: exam?.examType?.name,
        value: exam?.id as number,
    }))

    const segmentChange = (value: number) => {
        setActiveExam(value)
    }

    return(
        <>
            {classeExams && classeExams?.length > 0 ? <>
                <Segmented options={segmentData as []} value={activeExam} onChange={segmentChange} block />
                <main style={{margin: '15px 10px 5px 10px'}}>
                    <ExamDescription
                        classeId={classeId}
                        academicYear={academicYear}
                        examId={activeExam}
                        uniqueStudent={uniqueStudent}
                    />
                </main></>
                : <VoidData />
            }
        </>
    )
}