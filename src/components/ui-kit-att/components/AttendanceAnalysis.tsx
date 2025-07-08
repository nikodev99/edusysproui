import {AttendanceCommonAnalysis} from "../../common/AttendanceCommonAnalysis.tsx";
import {useAttendanceRepo} from "../../../hooks/useAttendanceRepo.ts";
import {text} from "../../../core/utils/text_display.ts";
import {AttendanceSummary} from "../../../core/utils/interfaces.ts";
import Datetime from "../../../core/datetime.ts";
import {AttendanceTable} from "./AttendanceTable.tsx";
import {isObjectEmpty} from "../../../core/utils/utils.ts";
import {Button, Flex} from "antd";
import {redirectTo} from "../../../context/RedirectContext.ts";

export const AttendanceAnalysis = (
    {academicYear, date}: {
        academicYear?: string,
        date?: Datetime,
    }
) => {

    const today = date || Datetime.now();

    console.log('DATE DANS ATTENDANCE ANALYSIS', today.DAY)

    const {
        useGetSchoolAttendanceStatPerStatus,
        useGetSchoolStudentRanking,
        useGetSchoolAttendanceCount
    } = useAttendanceRepo()

    const {data: recentCount} = useGetSchoolAttendanceStatPerStatus(academicYear as string)

    const {data: goodStudents} = useGetSchoolStudentRanking(academicYear as string)
    const {data: worstStudents} = useGetSchoolStudentRanking(academicYear as string, true)

    const attendanceStatusCount = useGetSchoolAttendanceCount(academicYear as string, today.toDate())

    const {data} = attendanceStatusCount

    return (
        <AttendanceCommonAnalysis
            recentCount={recentCount as []}
            goodStudent={goodStudents}
            worstStudents={worstStudents}
            academicYear={academicYear}
            setIndividual={
                (info: AttendanceSummary) =>
                    `${info?.individual?.firstName} ${info?.individual?.lastName} - ${info?.classe}`
            }
            prefixTabElement={[
                {
                    label: Datetime.now().fullDay(),
                    children: data && !isObjectEmpty(data?.statusCount) ? (
                        <AttendanceTable
                            date={today}
                            todayAttendanceData={attendanceStatusCount}
                            academicYear={academicYear}
                        />
                    ): (
                        <Flex justify='center' align='center'>
                            <Button
                                type={'primary'}
                                style={{marginTop: 50, padding: '30px', color: '#ccc'}}
                                onClick={() => redirectTo(text.att.group.add.href)}
                                disabled={today.DAY === 0}
                            >
                                Ajouter des données de présence du {today.fullDay()}
                            </Button>
                        </Flex>
                    )
                }
            ]}
        />
    )
}