import {
    AttendanceRecentCount,
    InfoPageProps
} from "../../../core/utils/interfaces.ts";
import {Classe} from "../../../entity";
import {useEffect, useState} from "react";
import {ClasseAttendanceTable} from "./ClasseAttendanceTable.tsx";
import {useAttendanceRepo} from "../../../hooks/actions/useAttendanceRepo.ts";
import {AttendanceCommonAnalysis} from "../../common/AttendanceCommonAnalysis.tsx";

type AnalysisProps = InfoPageProps<Classe>

const ClasseAttendanceAnalysis = ({infoData, academicYear, color}: AnalysisProps) => {

    const [recentCount, setRecentCount] = useState<AttendanceRecentCount[]>([])
    const {useGetClasseAttendanceCount} = useAttendanceRepo()
    const {data: classeAttendances} = useGetClasseAttendanceCount(infoData?.id, academicYear as string)
    
    const {useGetClasseAttendanceStatPerStatus, useGetClasseStudentRankingAttendances} = useAttendanceRepo()
    const {data, isSuccess} = useGetClasseAttendanceStatPerStatus(infoData?.id, academicYear as string)
    
    const {data: worstStudent} = useGetClasseStudentRankingAttendances(infoData?.id, academicYear as string, true)
    const {data: goodStudent} = useGetClasseStudentRankingAttendances(infoData?.id, academicYear as string)

    useEffect(() => {
       if (isSuccess) {
           setRecentCount(data as AttendanceRecentCount[])
       }
    }, [data, isSuccess])

    return(
        <AttendanceCommonAnalysis
            recentCount={recentCount}
            worstStudents={worstStudent}
            goodStudent={goodStudent}
            classeId={infoData?.id}
            academicYear={academicYear}
            suffixTabElement={[
                {
                    label: 'Table de Présence',
                    children: <ClasseAttendanceTable
                        classeTotal={classeAttendances?.statusCount}
                        classeId={infoData?.id}
                        academicYear={academicYear}
                        color={color}
                    />
                }
            ]}
        />
    )
}

export { ClasseAttendanceAnalysis }
