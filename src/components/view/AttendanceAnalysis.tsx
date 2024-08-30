import Responsive from "../ui/layout/Responsive.tsx";
import Grid from "../ui/layout/Grid.tsx";
import Widget from "../ui/layout/Widget.tsx";
import {AttendanceRecord} from "../../utils/interfaces.ts";
import {useEffect, useMemo, useState} from "react";
import {Attendance, Enrollment} from "../../entity";
import {fetch} from "../../context/FetchContext.ts";
import {getAllStudentAttendances} from "../../data/repository/attendanceRepository.ts";
import {fDate} from "../../utils/utils.ts";

interface AnalysisProps {
    enrollment: Enrollment;
}

const AttendanceAnalysis = ({enrollment}: AnalysisProps) => {
    
    const {academicYear, student} = enrollment

    const [attendances, setAttendances] = useState<Attendance[]>([])

    useEffect(() => {
        fetch<Attendance>(getAllStudentAttendances, [student.id, academicYear.id]).then(resp => {
            if(resp.isSuccess) {
                setAttendances(resp.data as Attendance[])
            }
        })
    }, [academicYear.id, student.id]);

    const dataSource: AttendanceRecord[] = attendances.map(att => ({
        id: att.id,
        date: fDate(att.attendanceDate),
        status: att.status,
        classe: '',
        section: ''
    }))

    return (
        <Responsive gutter={[16, 16]} className='attendance-analysis'>
            <Grid xs={24} md={24} lg={24}>
                <Responsive gutter={[16, 16]}>
                    <Grid xs={24} md={8} lg={6}>
                        <Widget title='Total Jours Present' data={dataSource} />
                    </Grid>
                    <Grid xs={24} md={8} lg={6}><Widget /></Grid>
                    <Grid xs={24} md={8} lg={6}><Widget /></Grid>
                    <Grid xs={24} md={8} lg={6}><Widget /></Grid>
                </Responsive>
            </Grid>
            <Grid xs={24} md={12} lg={8}>2</Grid>
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