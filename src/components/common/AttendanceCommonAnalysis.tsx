import {ReactNode} from "react";
import {
    AttendanceRecentCount,
    AttendanceSummary,
    Color,
    WidgetItem
} from "../../core/utils/interfaces.ts";
import {text} from "../../core/utils/text_display.ts";
import {AttendanceStatus, getColors} from "../../entity/enums/attendanceStatus.ts";
import {ATTENDANCE_STATUS_COLORS, findPercent, setFirstName, sumObjectValues} from "../../core/utils/utils.ts";
import Responsive from "../ui/layout/Responsive.tsx";
import Grid from "../ui/layout/Grid.tsx";
import {Widgets} from "../ui/layout/Widgets.tsx";
import {StickyTabs} from "../ui/layout/StickyTabs.tsx";
import {Card, List, Progress, Tooltip} from "antd";
import {BarChart} from "../graph/BarChart.tsx";
import {LineChart} from "../graph/LineChart.tsx";
import VoidData from "../view/VoidData.tsx";
import {Avatar} from "../ui/layout/Avatar.tsx";
import {useAttendanceRepo} from "../../hooks/useAttendanceRepo.ts";
import {AttendanceDaySummary} from "../ui-kit-att";

interface AttendanceAnalysisProps {
    recentCount: AttendanceRecentCount[]
    worstStudents?:  AttendanceSummary[]
    goodStudent?: AttendanceSummary[]
    classeId?: number
    academicYear?: string
    prefixTabElement?: { label: ReactNode, children: ReactNode }[]
    suffixTabElement?: { label: ReactNode, children: ReactNode }[]
    lineLoading?: boolean
    setIndividual?: (individual: AttendanceSummary) => string
    sections?: ReactNode[]
}

export const AttendanceCommonAnalysis = (
    {recentCount, goodStudent, worstStudents, classeId, academicYear, suffixTabElement, prefixTabElement, lineLoading, setIndividual = undefined, sections}: AttendanceAnalysisProps
) => {
    const {useGetClasseAttendanceCount, useGetSchoolAttendanceCount} = useAttendanceRepo()
    const classeAttendances = useGetClasseAttendanceCount(classeId as number, academicYear as string)
    const schoolAttendances = useGetSchoolAttendanceCount(academicYear as string)

    const allClasse = sumObjectValues(classeAttendances?.data?.statusCount)
    const allSchool = sumObjectValues(schoolAttendances?.data?.statusCount)

    const classe = classeAttendances ? classeAttendances?.data?.statusCount : null
    const school = schoolAttendances ? schoolAttendances?.data?.statusCount : null

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

    const presentPercent = classe ?
        findPercent(classe.PRESENT, allClasse ?? 0) : school ?
        findPercent(school.PRESENT, allSchool) : 0;

    const composeData = [
        {
            name: AttendanceStatus.PRESENT as string,
            ...(classe ? {classe: findPercent(classe?.PRESENT, school?.PRESENT as number)} : undefined),
            total: findPercent(school?.PRESENT as number, allSchool)
        },
        {
            name: AttendanceStatus.ABSENT as string,
            ...(classe ? {classe: findPercent(classe?.ABSENT, school?.ABSENT as number)} : undefined),
            total: findPercent(school?.ABSENT as number, allSchool)
        },
        {
            name: AttendanceStatus.LATE as string,
            ...(classe ? {classe: findPercent(classe?.LATE, school?.LATE as number)} : undefined),
            total: findPercent(school?.LATE as number, allSchool)
        },
        {
            name: AttendanceStatus.EXCUSED as string,
            ...(classe ? {classe: findPercent(classe.EXCUSED, school?.EXCUSED as number)} : undefined),
            total: findPercent(school?.EXCUSED as number, allSchool)
        }
    ];

    console.log('Composed Data: ', {composeData, classe})

    const widgetItems: WidgetItem[] = [
        {
            title: 'Taux de présence',
            value: classe ? classe.PRESENT : school ? school.PRESENT : 0,
            progress: {
                active: true,
                percent: presentPercent as number,
                color: getColors(AttendanceStatus.PRESENT)
            }
        },
        {
            title: 'Taux d\'absence',
            value: classe ? classe.ABSENT : school ? school.ABSENT : 0,
            progress: {
                active: true,
                percent: classe ?
                    findPercent(classe.ABSENT, allClasse ?? 0) as number : school ?
                    findPercent(school.ABSENT, allSchool) as number : 0,
                color: getColors(AttendanceStatus.ABSENT)
            }
        },
        {
            title: 'Taux de retard',
            value: classe ? classe.LATE : school ? school.LATE : 0,
            progress: {
                active: true,
                percent: classe ?
                    findPercent(classe.LATE, allClasse ?? 0) as number : school ?
                    findPercent(school.LATE, allSchool) as number : 0,
                color: getColors(AttendanceStatus.LATE)
            }
        },
        {
            title: 'Taux d\'excuse',
            value: classe ? classe.EXCUSED : school ? school.EXCUSED : 0,
            progress: {
                active: true,
                percent: classe ?
                    findPercent(classe.EXCUSED, allClasse ?? 0) as number : school ?
                    findPercent(school.EXCUSED, allSchool) as number : 0,
                color: getColors(AttendanceStatus.EXCUSED)
            }
        }
    ]

    const title = `${classe ? 'Taux de présence classe vs école' : 'Pourcentage en taux de présence'}`
    const dataKey = [...(classe ? ['classe', 'total'] : ['total'])]

    return(
        <Responsive gutter={[16, 16]}>
            <Grid xs={24} md={24} lg={24}>
                <Widgets items={widgetItems} hasShadow={true} />
            </Grid>
            <Grid xs={24} md={24} lg={24}>
                <StickyTabs centered items={[
                    ...(prefixTabElement && prefixTabElement.length > 0 ? prefixTabElement.map((tab, index) => ({
                        key: `prefix-${index + 2}`,
                        label: tab.label,
                        children: tab.children
                    })) : []),
                    {key: '1', label: 'Taux de présence', children: <Responsive gutter={[16, 16]}>
                        <Grid xs={24} md={24} lg={6}>
                            <Card size="small" title={title}>
                                <BarChart
                                    data={composeData}
                                    dataKey={dataKey as []}
                                    legend='name'
                                    eachBarColor={true}
                                    isPercent={true}
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
                                    isLoading={lineLoading}
                                />
                            </Card>
                        </Grid>

                        <Grid xs={24} md={24} lg={24}>
                            <AttendanceDaySummary data={classeId ? classeAttendances : schoolAttendances} />
                        </Grid>

                        <Grid xs={24} md={24} lg={24}>
                            {(sections && sections.length > 0 ? sections.map((section, index) => (
                                <section key={`section-${index}`}>{section}</section>
                            )) : null)}
                        </Grid>

                        <Grid xs={24} md={24} lg={12}>
                            <Card size='small' title={`${text.student.label}s les plus présent`}>
                                {goodStudent && goodStudent.length > 0
                                    ? <StudentList
                                        data={goodStudent}
                                        total={classe ? classe?.PRESENT : school ? school.PRESENT : 0}
                                        prePercent={presentPercent as number}
                                        setIndividual={setIndividual}
                                    />
                                    : <VoidData />
                                }
                            </Card>
                        </Grid>
                        <Grid xs={24} md={24} lg={12}>
                            <Card size='small' title={`${text.student.label}s à risque`}>
                                {worstStudents && worstStudents.length > 0
                                    ? <StudentList
                                        data={worstStudents}
                                        total={classe ? classe?.ABSENT : school ? school.ABSENT : 0}
                                        color={ATTENDANCE_STATUS_COLORS[1]}
                                        prePercent={presentPercent as number}
                                        setIndividual={setIndividual}
                                    />
                                    : <VoidData />
                                }
                            </Card>
                        </Grid>
                    </Responsive>},
                    ...(suffixTabElement && suffixTabElement.length > 0 ? suffixTabElement.map((tab, index) => ({
                        key: `suffix-${index + 2}`,
                        label: tab.label,
                        children: tab.children
                    })) : [])
                ]} />
            </Grid>
        </Responsive>
    )
}

const StudentList = (
    {data, total, color, prePercent, setIndividual}: {
        data: AttendanceSummary[],
        total: number,
        color?: Color,
        prePercent?: number,
        setIndividual?: (individual: AttendanceSummary) => string,
    }
) => {
    return(
        <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => {
                const fullName = setIndividual ?
                    setIndividual(item) :
                    setFirstName(`${item?.individual?.lastName} ${item?.individual?.firstName}`);
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
                                        format={() => `${attendanceCount}/${item?.totalDays} ${attendanceCount as number > 1 ? ' Jours' : 'Jour'}`}
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