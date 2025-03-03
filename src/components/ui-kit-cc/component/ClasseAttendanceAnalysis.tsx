import {
    AttendanceRecentCount,
    AttendanceSummary,
    Color,
    GenderCounted,
    InfoPageProps,
    WidgetItem
} from "../../../utils/interfaces.ts";
import {Classe} from "../../../entity";
import {useClasseAttendance} from "../../../hooks/useClasseAttendance.ts";
import {useSchoolAttendance} from "../../../hooks/useSchoolAttendance.ts";
import {text} from "../../../utils/text_display.ts";
import Responsive from "../../ui/layout/Responsive.tsx";
import Grid from "../../ui/layout/Grid.tsx";
import {Widgets} from "../../ui/layout/Widgets.tsx";
import {AttendanceStatus, countStatus, getColors} from "../../../entity/enums/attendanceStatus.ts";
import {LineChart} from "../../graph/LineChart.tsx";
import {useFetch, useRawFetch} from "../../../hooks/useFetch.ts";
import {useEffect, useState} from "react";
import {
    getClasseGoodStudentAttendanceRanking,
    getClasseRecentAttendanceStatus,
    getClasseWorstStudentAttendanceRanking
} from "../../../data/repository/attendanceRepository.ts";
import {ATTENDANCE_STATUS_COLORS, findPercent, setFirstName} from "../../../utils/utils.ts";
import {Card, List, Progress, Tooltip} from "antd";
import {BarChart} from "../../graph/BarChart.tsx";
import VoidData from "../../view/VoidData.tsx";
import {Avatar} from "../../ui/layout/Avatar.tsx";
import {ClasseAttendanceTable} from "./ClasseAttendanceTable.tsx";
import {StickyTabs} from "../../ui/layout/StickyTabs.tsx";

type AnalysisProps = InfoPageProps<Classe> & {studentCount?: GenderCounted[] | null}

const ClasseAttendanceAnalysis = ({infoData, academicYear, studentCount, color}: AnalysisProps) => {

    const [recentCount, setRecentCount] = useState<AttendanceRecentCount[]>([])
    const [worstStudent, setWorstStudent] = useState<AttendanceSummary[]>([])
    const [goodStudent, setGoodStudent] = useState<AttendanceSummary[]>([])
    const {classeAttendances} = useClasseAttendance(infoData?.id, academicYear as string)
    const {schoolAttendances} = useSchoolAttendance(text.schoolID, academicYear as string)
    
    const {data, isSuccess} = useFetch<AttendanceRecentCount, unknown>(['attendance-stat'], getClasseRecentAttendanceStatus, [infoData?.id, academicYear as string])
    const fetchWorstStudents = useRawFetch()
    const fetchGoodStudents = useRawFetch()

    const allClasse = classeAttendances?.reduce((sum, record) => sum + record.count, 0)
    const allSchool = schoolAttendances?.reduce((sum, record) => sum + record.count, 0)
    const allStudents = studentCount?.reduce((sum, record) => sum + record.count, 0)

    const totalDays = allStudents && allClasse ? Math.round(allClasse/allStudents) : 0

    useEffect(() => {
        fetchGoodStudents(getClasseGoodStudentAttendanceRanking, [infoData?.id, academicYear as string])
            .then(resp => {
                if (resp.isSuccess) {
                    setGoodStudent(resp.data as AttendanceSummary[])
                }
            })
        
        fetchWorstStudents(getClasseWorstStudentAttendanceRanking, [infoData?.id, academicYear as string])
            .then(resp => {
                if (resp.isSuccess) {
                    setWorstStudent(resp.data as AttendanceSummary[])
                }
            })
        
       if (infoData.id || isSuccess) {
           setRecentCount(data as AttendanceRecentCount[])
       }
    }, [academicYear, data, fetchGoodStudents, fetchWorstStudents, infoData.id, isSuccess])

    const classe = countStatus(classeAttendances)
    const school = countStatus(schoolAttendances)

    const processChartData = (data: AttendanceRecentCount[]) => {
        const dateMap: unknown[] = []
        data?.forEach(d => {
            const total = d ? d.present + d.absent + d.late + d.excused : 0
            dateMap.push({
                date: d.date,
                [AttendanceStatus.PRESENT]: findPercent(d.present, total),
                [AttendanceStatus.ABSENT]: findPercent(d.absent, total),
                [AttendanceStatus.LATE]: findPercent(d.late, total),
                [AttendanceStatus.EXCUSED]: findPercent(d.excused, total)
            })
        })
        return dateMap
    }

    const classePercent = findPercent(classe.present, allClasse)

    const composeData = [
        {
            name: AttendanceStatus.PRESENT as string,
            classe: findPercent(classe.present, school.present),
            total: findPercent(school.present, allSchool)
        },
        {
            name: AttendanceStatus.ABSENT as string,
            classe: findPercent(classe.absent, school.absent),
            total: findPercent(school.absent, allSchool)
        },
        {
            name: AttendanceStatus.LATE as string,
            classe: findPercent(classe.late, school.late),
            total: findPercent(school.late, allSchool)
        },
        {
            name: AttendanceStatus.EXCUSED as string,
            classe: findPercent(classe.excused, school.excused),
            total: findPercent(school.excused, allSchool)
        }
    ];

    const widgetItems: WidgetItem[] = [
        {
            title: 'Taux de présence',
            value: classe.present,
            progress: { active: true, percent: classePercent as number, color: getColors(AttendanceStatus.PRESENT) }
        },
        {
            title: 'Taux d\'absence',
            value: classe.absent,
            progress: { active: true, percent: findPercent(classe.absent, allClasse) as number, color: getColors(AttendanceStatus.ABSENT) }
        },
        {
            title: 'Taux de retard',
            value: classe.late,
            progress: { active: true, percent: findPercent(classe.late, allClasse) as number, color: getColors(AttendanceStatus.LATE) }
        },
        {
            title: 'Taux d\'excuse',
            value: classe.excused,
            progress: { active: true, percent: findPercent(classe.excused, allClasse) as number, color: getColors(AttendanceStatus.EXCUSED) }
        }
    ]

    return(
        <Responsive gutter={[16, 16]}>
            <Grid xs={24} md={24} lg={24}>
                <Widgets items={widgetItems} hasShadow={true} />
            </Grid>
            <Grid xs={24} md={24} lg={24}>
                <StickyTabs centered items={[
                    {key: '1', label: 'Taux de présence', children: <Responsive gutter={[16, 16]}>
                        <Grid xs={24} md={24} lg={6}>
                            <Card size="small" title='Taux de présence classe vs école'>
                                <BarChart
                                    data={composeData}
                                    dataKey={['classe', "total"]}
                                    legend='name'
                                    eachBarColor={true}
                                    isPercent={true}
                                    barSize={20}
                                    minHeight={350}
                                    layout='vertical'
                                    showLegend
                                    margins={{
                                        left: 0,
                                    }}
                                />
                            </Card>
                        </Grid>
                        <Grid xs={24} md={24} lg={18}>
                            <Card size='small' title='Présence au Fil du Temps' style={{height: 410}}>
                                <LineChart
                                    height={350}
                                    data={processChartData(recentCount) as []}
                                    legend='date'
                                    dataKey={Object.values(AttendanceStatus)}
                                    isPercent={true}
                                    type='monotone'
                                    color={ATTENDANCE_STATUS_COLORS}
                                    showLegend
                                />
                            </Card>
                        </Grid>
                            <Grid xs={24} md={24} lg={12}>
                                <Card size='small' title={`${text.student.label}s les plus présent`}>
                                    {goodStudent && goodStudent.length > 0
                                        ? <StudentList
                                            data={goodStudent}
                                            total={classe?.present as number}
                                            totalDays={totalDays}
                                            prePercent={classePercent as number}
                                        />
                                        : <VoidData />
                                    }
                                </Card>
                            </Grid>
                            <Grid xs={24} md={24} lg={12}>
                                <Card size='small' title={`${text.student.label}s à risque`}>
                                    {worstStudent && worstStudent.length > 0
                                        ? <StudentList
                                            data={worstStudent}
                                            total={classe?.absent}
                                            color={ATTENDANCE_STATUS_COLORS[1]}
                                            totalDays={totalDays}
                                            prePercent={classePercent as number}
                                        />
                                        : <VoidData />
                                    }
                                </Card>
                            </Grid>
                    </Responsive>},
                    {
                        key: '2',
                        label: 'Table de Présence',
                        children: <ClasseAttendanceTable
                            classeTotal={classe}
                            classeId={infoData?.id}
                            academicYear={academicYear}
                            color={color}
                        />
                    }
                ]} />
            </Grid>
        </Responsive>
    )
}

const StudentList = (
    {data, total, color, totalDays, prePercent}: {
        data: AttendanceSummary[],
        total: number,
        color?: Color,
        totalDays?: number,
        prePercent?: number,
    }
) => {
    return(
        <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => {
                const fullName = setFirstName(`${item?.individual?.lastName} ${item?.individual?.firstName}`);
                const attendanceCount = item?.statusCount[0].count || 0;
                const percentage = findPercent(attendanceCount, total)

                return (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar
                                firstText={item?.individual?.firstName}
                                lastText={item?.individual?.lastName}
                                image={item?.individual?.image}
                            />}
                            title={fullName}
                            description={
                                <Tooltip title={'Taux de présence par rapport à la classe: ' + percentage + '%'}>
                                    <Progress
                                        status='active'
                                        strokeColor='#ccc'
                                        percent={prePercent ? (prePercent + (percentage as number)) : percentage as number}
                                        showInfo
                                        success={{percent: percentage as number, strokeColor: color ?? ATTENDANCE_STATUS_COLORS[0]}}
                                        format={() => `${attendanceCount}/${totalDays} ${attendanceCount as number > 1 ? ' Jours' : 'Jour'}`}
                                    />
                                </Tooltip>
                            }
                        />
                    </List.Item>
                );
            }}
        />
    )
}

export { ClasseAttendanceAnalysis }