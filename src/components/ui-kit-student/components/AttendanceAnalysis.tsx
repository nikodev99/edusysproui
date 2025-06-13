import Responsive from "../../ui/layout/Responsive.tsx";
import Grid from "../../ui/layout/Grid.tsx";
import {AttendanceRecord} from "../../../core/utils/interfaces.ts";
import {useEffect, useState} from "react";
import {Attendance, Enrollment} from "../../../entity";
import {getAllStudentAttendances} from "../../../data/repository/attendanceRepository.ts";
import {fDate, setDayJsDate, sumObjectValues} from "../../../core/utils/utils.ts";
import {useRawFetch} from "../../../hooks/useFetch.ts";
import {Calendar, Card, Skeleton} from "antd";
import {
    AttendanceStatus,
    attendanceTag,
    countAttendanceStatuses,
    getColors
} from "../../../entity/enums/attendanceStatus.ts";
import {Dayjs} from "dayjs";
import {Widgets} from "../../ui/layout/Widgets.tsx";
import {SuperWord} from "../../../core/utils/tsxUtils.tsx";
import {BarChart} from "../../graph/BarChart.tsx";
import {useAttendanceRepo} from "../../../hooks/useAttendanceRepo.ts";

interface AnalysisProps {
    enrollment: Enrollment;
    academicYear: string
}

export const AttendanceAnalysis = ({enrollment, academicYear}: AnalysisProps) => {
    
    const {student, classe} = enrollment

    const [attendances, setAttendances] = useState<Attendance[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [allRecord, setAllRecord] = useState<number>(0)
    const {useGetClasseAttendanceCount} = useAttendanceRepo()

    const {data: classeAttendances} = useGetClasseAttendanceCount(classe?.id, academicYear)

    const fetch = useRawFetch()

    useEffect(() => {
        fetch(getAllStudentAttendances, [student?.personalInfo?.id, academicYear])
            .then(resp => {
                setIsLoading(resp.isLoading as boolean)
                if (resp.isSuccess && Array.isArray(resp.data)) {
                    setAttendances(resp.data as Attendance[])
                    setAllRecord(resp.data?.length ?? 1)
                }
            })
    }, [academicYear, fetch, student?.personalInfo?.id]);

    const dataSource: AttendanceRecord[] = attendances.map(att => ({
        id: att.id,
        date: fDate(att.attendanceDate),
        status: att.status,
        classe: '',
        section: ''
    })) as AttendanceRecord[]

    const dateCellRender = (currentDate: Dayjs, info: {type: string}) => {
        if (info.type === 'date') {
            const attendance = attendances.find(att => setDayJsDate(att.attendanceDate)?.isSame(currentDate, 'day'))
            if (attendance) {
                const [tagColor] = attendanceTag(attendance.status)
                return(
                    <div className={`date-wrapper ${tagColor}`}>
                        {currentDate.date() < 10 ? `0${currentDate.date()}` : currentDate.date()}
                    </div>
                )
            }
        }
    }

    const counts = countAttendanceStatuses(dataSource)
    const classeCount = classeAttendances?.statusCount
    const allClasse = sumObjectValues(classeCount)

    const composeData = classeCount ? [
        {
            name: AttendanceStatus.PRESENT as string,
            valeur: Math.round((counts.present/classeCount?.PRESENT) * 100),
            classe: Math.round((classeCount?.PRESENT/allClasse) * 100)
        },
        {
            name: AttendanceStatus.ABSENT as string,
            valeur: Math.round((counts.absent/classeCount.ABSENT) * 100),
            classe: Math.round((classeCount.ABSENT/allClasse) * 100)
        },
        {
            name: AttendanceStatus.LATE as string,
            valeur: Math.round((counts.late/classeCount.LATE) * 100),
            classe: Math.round((classeCount.LATE/allClasse) * 100)
        },
        {
            name: AttendanceStatus.EXCUSED as string,
            valeur: Math.round((counts.excused/classeCount.EXCUSED) * 100),
            classe: Math.round((classeCount.EXCUSED/allClasse) * 100)
        }
    ]: [];

    return (
        <Responsive gutter={[16, 16]} className='attendance-analysis'>
            <Grid xs={24} md={24} lg={24}>
                <Responsive gutter={[16, 16]}>
                    {isLoading ?
                        <Skeleton loading={isLoading} active={isLoading} paragraph={{rows: 4}} /> :
                        (<>
                            {dataSource.length > 0 && <Widgets hasShadow={true} responsiveness={true} items={[
                                {title: 'Taux de présence', value: counts.present, progress: {
                                    active: true,
                                    percent: Math.round((counts.present/allRecord) * 100),
                                    color: getColors(AttendanceStatus.PRESENT)
                                }},
                                {title: 'Taux d\'absence', value: counts.absent, progress: {
                                    active: true,
                                    percent: Math.round((counts.absent/allRecord) * 100),
                                    color: getColors(AttendanceStatus.ABSENT)
                                }},
                                {title: 'Taux de retard', value: counts.late, progress: {
                                        active: true,
                                        percent: Math.round((counts.late/allRecord) * 100),
                                        color: getColors(AttendanceStatus.LATE)
                                }},
                                {title: 'Taux d\'excuse', value: counts.excused, progress: {
                                        active: true,
                                        percent: Math.round((counts.excused/allRecord) * 100),
                                        color: getColors(AttendanceStatus.EXCUSED)
                                }}
                            ]} />}
                        </>)
                    }
                </Responsive>
            </Grid>
            <Grid xs={24} md={12} lg={12}>
                <Card>
                    <Calendar fullscreen={false} cellRender={dateCellRender} />
                </Card>
            </Grid>
            <Grid xs={24} md={12} lg={12}>
                <Card size='small' title={<SuperWord input={`Taux de présence: ${student?.personalInfo?.lastName} vs ${classe?.name}`}/>}>
                    <BarChart
                        data={composeData}
                        dataKey={['valeur', "classe"]}
                        legend='name'
                        eachBarColor={true}
                        isPercent={true}
                        barSize={30}
                        minHeight={310}
                    />
                </Card>
            </Grid>
        </Responsive>
    )
}
