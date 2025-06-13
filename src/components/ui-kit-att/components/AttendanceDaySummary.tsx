import PageWrapper from "../../view/PageWrapper.tsx";
import Responsive from "../../ui/layout/Responsive.tsx";
import Grid from "../../ui/layout/Grid.tsx";
import {Card} from "antd";
import PieChart from "../../graph/PieChart.tsx";
import {useMemo} from "react";
import {AttendanceStatus, getColors} from "../../../entity/enums/attendanceStatus.ts";
import {ATTENDANCE_STATUS_COLORS, findPercent, setFirstName, sumObjectValues} from "../../../core/utils/utils.ts";
import {BarChart} from "../../graph/BarChart.tsx";
import {SectionType} from "../../../entity/enums/section.ts";
import {Gender} from "../../../entity/enums/gender.tsx";
import {UseQueryResult} from "@tanstack/react-query";
import {AttendanceStatusCountResponse} from "../../../core/utils/interfaces.ts";

export const AttendanceDaySummary = ({data}: {
    data: UseQueryResult<AttendanceStatusCountResponse, unknown>
}) => {

    const {data: attendanceSummary, isLoading: pieChartLoading} = data

    const allData = sumObjectValues(attendanceSummary?.statusCount)

    const statusGraphData = useMemo(() => {
        const status = attendanceSummary?.statusCount
        return status ? Object.entries(status).map(([key, value]) => ({
            name: AttendanceStatus[key as unknown as keyof typeof AttendanceStatus],
            value: value,
            color: getColors(AttendanceStatus[key as unknown as keyof typeof AttendanceStatus])
        })) : []
    }, [attendanceSummary?.statusCount])

    const sectionGraphData = useMemo(() => {
        const section = attendanceSummary?.sectionStatusCount
        return section ? Object.entries(section).map(([sec, stats]) => ({
            name: setFirstName(SectionType[sec as unknown as keyof typeof SectionType]),
            présent: findPercent(stats?.PRESENT, allData),
            absent: findPercent(stats?.ABSENT, allData),
            "en-retard": findPercent(stats?.LATE, allData),
            excusé: findPercent(stats?.EXCUSED, allData),
        })): []
    }, [attendanceSummary?.sectionStatusCount, allData])

    const genderGraphData = useMemo(() => {
        const gender = attendanceSummary?.genderStatusCount
        return gender ? Object.entries(gender).map(([key, stat]) => ({
            name: setFirstName(Gender[key as unknown as keyof typeof Gender]),
            présent: findPercent(stat?.PRESENT, allData),
            absent: findPercent(stat?.ABSENT, allData),
            "en-retard": findPercent(stat?.LATE, allData),
            excusé: findPercent(stat?.EXCUSED, allData),
        })) : []
    }, [attendanceSummary?.genderStatusCount, allData])

    console.log("ATTENDANCE SUMMARY", genderGraphData)

    return (
        <PageWrapper>
            <Responsive gutter={[16, 16]}>
                <Grid xs={24} md={12} lg={8}>
                    <Card style={{height: 350}}>
                        <PieChart
                            data={statusGraphData as []}
                            height={280}
                            hasLegend={true}
                            hasLabel={true}
                            innerRadius={0}
                            outerRadius={100}
                            isLoading={pieChartLoading}
                        />
                    </Card>
                </Grid>
                <Grid xs={24} md={12} lg={8}>
                    <Card style={{height: 350}}>
                        <BarChart
                            data={sectionGraphData || []}
                            legend='name'
                            color={ATTENDANCE_STATUS_COLORS}
                            minHeight={280}
                            isPercent={true}
                            stackId='b'
                            stackBars={4}
                            stackKeys={['présent', 'absent', 'en-retard', 'excusé']}
                            showYAxis={false}
                        />
                    </Card>
                </Grid>
                <Grid xs={24} md={12} lg={8}>
                    <Card style={{height: 350}}>
                        <BarChart
                            data={genderGraphData || []}
                            legend='name'
                            color={ATTENDANCE_STATUS_COLORS}
                            minHeight={280}
                            isPercent={true}
                            dataKey={['présent', 'absent', 'en-retard', 'excusé']}
                        />
                    </Card>
                </Grid>
            </Responsive>
        </PageWrapper>
    )
}