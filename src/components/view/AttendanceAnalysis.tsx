import Responsive from "../ui/layout/Responsive.tsx";
import Grid from "../ui/layout/Grid.tsx";
import Widget from "../ui/layout/Widget.tsx";
import {AttendanceRecord} from "../../utils/interfaces.ts";
import {useEffect, useState} from "react";
import {Attendance, Enrollment} from "../../entity";
import {getAllStudentAttendances} from "../../data/repository/attendanceRepository.ts";
import {fDate, setDayJsDate} from "../../utils/utils.ts";
import {useRawFetch} from "../../hooks/useFetch.ts";
import {Calendar, Card, Skeleton} from "antd";
import {attendanceTag, countAttendanceStatuses} from "../../entity/enums/attendanceStatus.ts";

interface AnalysisProps {
    enrollment: Enrollment;
    academicYear: string
}

const AttendanceAnalysis = ({enrollment, academicYear}: AnalysisProps) => {
    
    const {student} = enrollment

    const [attendances, setAttendances] = useState<Attendance[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [allRecord, setAllRecord] = useState<number>(0)

    const fetch = useRawFetch()

    useEffect(() => {
        fetch(getAllStudentAttendances, [student.id, academicYear])
            .then(resp => {
                setIsLoading(resp.isLoading as boolean)
                if (resp.isSuccess && Array.isArray(resp.data)) {
                    setAttendances(resp.data as Attendance[])
                    setAllRecord(resp.data?.length ?? 1)
                }
            })
    }, [academicYear, fetch, student.id]);

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
    console.log('Status count: ', counts)

    return (
        <Responsive gutter={[16, 16]} className='attendance-analysis'>
            <Grid xs={24} md={24} lg={24}>
                <Responsive gutter={[16, 16]}>
                    {isLoading ?
                        <Skeleton loading={isLoading} active={isLoading} paragraph={{rows: 4}} /> :
                        (<>
                            {dataSource.length > 0 && (<>
                                <Grid xs={24} md={8} lg={6}>
                                    <Widget title='Total Jours Present' value={counts.present} progress={{
                                        active: true,
                                        percent: Math.round((counts.present/allRecord) * 100),
                                        color: '#28a745'
                                    }} />
                                </Grid>
                                <Grid xs={24} md={8} lg={6}>
                                    <Widget title='Total Jours Absent' value={counts.absent} progress={{
                                        active: true,
                                        percent: Math.round((counts.absent/allRecord) * 100),
                                        color: '#dc3545'
                                    }} />
                                </Grid>
                                <Grid xs={24} md={8} lg={6}>
                                    <Widget title='Total Jours en retard' value={counts.late} progress={{
                                        active: true,
                                        percent: Math.round((counts.late/allRecord) * 100),
                                        color: '#ffc107'
                                    }} />
                                </Grid>
                                <Grid xs={24} md={8} lg={6}>
                                    <Widget title='Total Jours excusé' value={counts.excused} progress={{
                                        active: true,
                                        percent: Math.round((counts.excused/allRecord) * 100),
                                        color: '#17a2b8'
                                    }} />
                                </Grid>
                            </>)}
                        </>)
                    }
                </Responsive>
            </Grid>
            <Grid xs={24} md={12} lg={8}>
                <Card >
                    <Calendar fullscreen={false} cellRender={dateCellRender} />
                </Card>
            </Grid>
            <Grid xs={24} md={12} lg={8}>3</Grid>
            <Grid xs={24} md={12} lg={8}>4</Grid>
            <Grid xs={24} md={12} lg={8}>5</Grid>
            <Grid xs={24} md={12} lg={8}>6</Grid>
            <Grid xs={24} md={12} lg={8}>7</Grid>
            <Grid xs={24} md={12} lg={8}>8</Grid>
        </Responsive>
    )
}

export default AttendanceAnalysis