import TabItem from "./TabItem.tsx";
import {Attendance, Enrollment} from "../../entity";
import {fDate, setFirstName, startsWithVowel} from "../../utils/utils.ts";
import {Select, Table, TableColumnsType, Tag} from "antd";
import {ReactNode, useEffect, useState} from "react";
import AttendanceAnalysis from "./AttendanceAnalysis.tsx";
import {LuEye} from "react-icons/lu";
import {Link} from "react-router-dom";
import {useFetch} from "../../hooks/useFetch.ts";
import {getStudentAttendances} from "../../data/repository/attendanceRepository.ts";
import {attendanceTag} from "../../entity/domain/attendance.ts";
import PageError from "../../pages/PageError.tsx";

interface AttendanceRecord {
    id: number
    date: string
    classe: string
    section: string
    status: ReactNode
}

const StudentAttendance = ({enrolledStudent}: {enrolledStudent: Enrollment}) => {

    const {
        academicYear: {id, academicYear},
        student,
        student: {firstName, lastName, enrollments}
    } = enrolledStudent

    const [academicYearId, setAcademicYearId] = useState<string>(id)
    const [attendances, setAttendances] = useState<Attendance[]>([])
    const {data, error, isLoading, isSuccess, refetch} = useFetch('attendance-list', getStudentAttendances, [
        student.id, {page: 0, size: 10}, academicYearId
    ])

    useEffect(() => {
        if (academicYearId) {
            refetch().then(r => r.data)
        }
        if (isSuccess && !isLoading && data && 'content' in data) {
            setAttendances(data.content as Attendance[])
        }
    }, [isSuccess, isLoading, data, academicYearId, refetch])

    if(error) return <PageError />

    const studentName = `${setFirstName(lastName)} ${setFirstName(firstName)}`

    console.log(student.id)
    console.log(attendances)

    const academicYears = [
        ...[{value: id, label: academicYear}],
        enrollments.map(e => ({
            value: e.academicYear.id,
            label: e.academicYear.academicYear
        }))
    ]

    const handleAcademicYearIdValue = (value: string) => {
        setAcademicYearId(value)
    }

    const columns: TableColumnsType<AttendanceRecord> = [
        {
            title: "Date",
            dataIndex: 'date',
            key: 'date',
            align: 'left',
            responsive: ['md']
        },
        {
            title: "Classe",
            dataIndex: 'classe',
            key: 'classe',
            align: 'center',
            responsive: ['md']
        },
        {
            title: "Section",
            dataIndex: 'section',
            key: 'section',
            align: 'center',
            responsive: ['md'],
        },
        {
            title: "Status",
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            responsive: ['md']
        },
        {
            title: (<LuEye size={15} />),
            dataIndex: 'id',
            key: 'attendanceId',
            align: 'right',
            width: '50px',
            //TODO redirect to the day record link
            render: (text) => <Link to={`/${text}`}>Voir</Link>
        }
    ];

    const dataSource: AttendanceRecord[] = attendances.map(att => {
        const [tagColor, tagText] = attendanceTag(att.status)
        return {
            id: att.id,
            date: setFirstName(fDate(att.attendanceDate)),
            classe: `${att.classe.name}, ${att.classe.category}`,
            section: att.classe.grade.section as string,
            status: <Tag color={tagColor}>{tagText?.toLowerCase()}</Tag>
        }
    })

    return(
        <TabItem
            title={`Suivis de présence d${startsWithVowel(lastName) ? "'" : 'e '}${studentName}`}
            selects={[
                (
                    <Select
                        className='select-control'
                        defaultValue={id}
                        options={academicYears}
                        onChange={handleAcademicYearIdValue}
                        variant='borderless'
                    />
                )
            ]}
            items={[
                {key: '1', label: 'Données de présence', children: (
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        size='small'
                        scroll={{y: 500}}
                        pagination={false}
                    />
                )},
                {key: '2', label: 'Etude Analytique', children: (
                    <AttendanceAnalysis />
                )}
            ]}
        />
    )
}

export default StudentAttendance;