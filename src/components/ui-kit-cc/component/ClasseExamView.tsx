import {useEffect, useLayoutEffect, useMemo, useState} from "react";
import {Assignment, Course, Enrollment, Exam, Student} from "@/entity";
import {Badge, Card, Segmented, TableColumnsType, Tag as AntTag, Typography} from "antd";
import VoidData from "@/components/view/VoidData.tsx";
import Responsive from "@/components/ui/layout/Responsive.tsx";
import Grid from "@/components/ui/layout/Grid.tsx";
import Datetime from "@/core/datetime.ts";
import {Widgets} from "@/components/ui/layout/Widgets.tsx";
import {getAssignmentBarData} from "@/core/utils/utils.ts";
import {BarChart} from "@/components/graph/BarChart.tsx";
import {AssignmentTypeLiteral, typeColors} from "@/entity/enums/assignmentType.ts";
import {Table} from "@/components/ui/layout/Table.tsx";
import {AvatarTitle} from "@/components/ui/layout/AvatarTitle.tsx";
import {InitMarkType} from "@/core/utils/tsxUtils.tsx";
import {text} from "@/core/utils/text_display.ts";
import {redirectTo} from "@/context/RedirectContext.ts";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {useExamRepo} from "@/hooks/actions/useExamRepo.ts";
import {ExamView, NestedExamView, TypedAssignment} from "@/entity/domain/exam.ts";
import {LineChart} from "@/components/graph/LineChart.tsx";

const markAverage = (totalMarks?: number, totalAssignments?: number): number => {
    if (!totalMarks || !totalAssignments) return 0
    return (totalMarks / totalAssignments)
}

const ExamDescription = (
    {classeId, academicYear, examId, uniqueStudent}: {classeId: number, academicYear: string, examId: number, uniqueStudent?: Enrollment},
) => {

    const {Link, Title} = Typography

    const [loading, setLoading] = useState<boolean>(true)
    const {toViewStudent} = useRedirect()
    const {useGetExamAssignments, useGetStudentExamProgress} = useExamRepo()

    const {data, isSuccess, isPending, isFetching, isRefetching, isLoading, refetch} = useGetExamAssignments(
        examId, classeId, academicYear, uniqueStudent ? uniqueStudent?.student?.id : undefined
    )

    const progress = useGetStudentExamProgress(uniqueStudent?.student?.id as string, classeId, academicYear)
    
    const {assignments, statistics, examView} = useMemo(() => {
        const examViewData: ExamView[] = (uniqueStudent ? data?.examView?.map(e => ({
            ...e,
            student: uniqueStudent?.student
        })) : data?.examView) ?? []
        return {
            assignments: data?.assignments || [],
            statistics: data?.statistics ?? null,
            examView: examViewData
        }
    }, [data?.assignments, data?.examView, data?.statistics, uniqueStudent])
    
    useEffect(() => {
        if (examId || academicYear || classeId)
            refetch().then()
    }, [academicYear, classeId, data, examId, isSuccess, refetch])


    useEffect(() => {
        if (!isPending && !isFetching && !isRefetching && !isLoading) {
            setLoading(false)
        }
    }, [isFetching, isLoading, isPending, isRefetching])

    const lineData = progress?.map(p => ({
        moyenne: p.average,
        examen: p.examName,
        date: Datetime.of(p.examDate).format("DD/MM/YYYY")
    })) ?? []
    const barData = getAssignmentBarData(assignments)

    const uniqueAssignmentTypes = useMemo(() => {
        return Array.from(new Set(assignments?.map(a => a?.type)))
    }, [assignments])

    const assignmentsColumns: TableColumnsType<Assignment> = [
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
                personalInfo={student?.personalInfo}
                toView={() => toViewStudent(student?.id, student?.personalInfo)}
                size={40}
            />
        },
        ...(uniqueAssignmentTypes && uniqueAssignmentTypes.length > 0 ? uniqueAssignmentTypes.map(type => ({
            align:'center' as 'start',
            title: AssignmentTypeLiteral[type as unknown as keyof typeof AssignmentTypeLiteral],
            dataIndex: 'typeAverages',
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
        ...(!uniqueStudent ? [{
            title: 'Position',
            dataIndex: 'rank',
            key: 'rank',
            align: "center" as "start",
            render: (rank: number) => rank
        }] : []),
        {
            title: 'Appréciation',
            dataIndex: 'totalAverage',
            key: 'app',
            align: "center",
            render: (totalAverage: number) => totalAverage ? <InitMarkType av={totalAverage} /> : '-'
        }
    ]

    const getMaxAssignmentsForType = (type: AssignmentTypeLiteral): number => {
        if (!examView || !examView[0] || !examView[0].nested) {
            return 0;
        }

        return Math.max(...examView.map((student) => {
            const nested = student.nested || []
            return Math.max(...nested.map((n) => {
                const assignments = n.assignments || []
                return assignments.filter((a) => a.type === type).length
            }), 0)
        }), 0)
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
            dataIndex: 'subjectAverage',
            key: 'subject-averages',
            align: 'center',
            render: (subjectAverage: number) => subjectAverage ? subjectAverage.toFixed(2) : '-'
        }
    ]

    return(
        <>
            {assignments && assignments.length ?
                (
                    <Responsive gutter={[16, 16]}>
                        <Widgets items={[
                            {title: 'Nombre totale des dévoirs', value: statistics?.totalAssignments ?? 0},
                            {title: 'Nombre totale de points', value: statistics?.totalMarks ?? 0},
                            ...(uniqueStudent
                                ? [{title: 'Moyenne des notes', value: markAverage(statistics?.totalMarks, statistics?.totalAssignments).toFixed(2)}]
                                : [{title: 'Taux de réussite', value: statistics?.successRate ?? 0.0, suffix: '%'}]),
                            {title: 'Moyenne médiane', value: statistics?.medianAverage?.toFixed(2) ?? 0.0},
                        ]} responsiveness hasShadow />
                        {uniqueStudent ? (
                            <>
                                <Grid xs={24} md={12} lg={12}>
                                    {lineData && <Card size='small'>
                                        <Card.Meta title={"Progression"} />
                                        <LineChart
                                            data={lineData}
                                            dataKey={['moyenne', 'examen']}
                                            height={300}
                                            minHeight={300}
                                            legend='date'
                                            type='step'
                                            showLegend
                                        />
                                    </Card>}
                                </Grid>
                                <Grid xs={24} md={12} lg={12}>
                                    {barData && <Card size='small'>
                                        <Card.Meta title="Nombre de devoirs par matières" />
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
                            </>
                        ) : (
                            <>
                                <Grid xs={24} md={12} lg={16}>
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
                                <Grid xs={24} md={12} lg={8}>
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
                            </>
                        )}
                        <Grid xs={24} md={24} lg={24}>
                            <Table
                                tableProps={{
                                    columns: averageColumns as [],
                                    dataSource: examView,
                                    scroll: {y: 700},
                                    loading: loading,
                                    rowKey: 'studentId',
                                    expandable: {
                                        expandedRowRender: (record) => (
                                            <Table tableProps={{
                                                columns: nestedTableColumns,
                                                dataSource: record.nested,
                                                rowKey: (record) => {
                                                    const s = record?.subject
                                                    return s && typeof s === 'object' ? `@nested-${s['id']}` : `@nested-${s}`
                                                },
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