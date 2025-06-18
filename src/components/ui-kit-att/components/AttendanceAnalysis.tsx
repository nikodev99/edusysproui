import {AttendanceCommonAnalysis} from "../../common/AttendanceCommonAnalysis.tsx";
import {useAttendanceRepo} from "../../../hooks/useAttendanceRepo.ts";
import {text} from "../../../core/utils/text_display.ts";
import {AttendanceSummary} from "../../../core/utils/interfaces.ts";
import Datetime from "../../../core/datetime.ts";
import {AttendanceTable} from "./AttendanceTable.tsx";
import {useRef} from "react";
import {isObjectEmpty} from "../../../core/utils/utils.ts";
import {Button, Flex} from "antd";
import {redirectTo} from "../../../context/RedirectContext.ts";

export const AttendanceAnalysis = (
    {academicYear}: {
        academicYear?: string
    }
) => {

    const today = useRef(Datetime.now());

    const {
        useGetSchoolAttendanceStatPerStatus,
        useGetSchoolStudentRanking,
        useGetSchoolAttendanceCount
    } = useAttendanceRepo()

    const {data: recentCount} = useGetSchoolAttendanceStatPerStatus(text.schoolID, academicYear as string)

    const {data: goodStudents} = useGetSchoolStudentRanking(text.schoolID, academicYear as string)
    const {data: worstStudents} = useGetSchoolStudentRanking(text.schoolID, academicYear as string, true)

    const attendanceStatusCount = useGetSchoolAttendanceCount(academicYear as string, today.current.toDate())

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
                            date={today.current}
                            todayAttendanceData={attendanceStatusCount}
                            academicYear={academicYear}
                        />
                    ): (
                        <Flex justify='center' align='center'>
                            <Button type={'primary'} style={{marginTop: 50, padding: '30px'}} onClick={() => redirectTo(text.att.group.add.href)}>
                                Ajouter des données de présence du {today.current.fullDay()}
                            </Button>
                        </Flex>
                    )
                }
            ]}
        />
    )
}