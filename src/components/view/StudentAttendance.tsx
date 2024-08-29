import TabItem from "./TabItem.tsx";
import {Attendance, Enrollment} from "../../entity";
import {fDate, firstLetter, setFirstName, startsWithVowel} from "../../utils/utils.ts";
import {Select, Table, TableColumnsType} from "antd";
import {useEffect, useState, useMemo} from "react";
import AttendanceAnalysis from "./AttendanceAnalysis.tsx";
import {LuEye} from "react-icons/lu";
import {Link} from "react-router-dom";
import {useFetch} from "../../hooks/useFetch.ts";
import {getStudentAttendances} from "../../data/repository/attendanceRepository.ts";
import PageError from "../../pages/PageError.tsx";
import Tag from "../ui/layout/Tag.tsx";
import {attendanceTag} from "../../entity/enums/attendance.ts";
import {AttendanceRecord} from "../../utils/interfaces.ts";

type DataIndex = AttendanceRecord

const StudentAttendance = ({enrolledStudent}: {enrolledStudent: Enrollment}) => {

    const {
        academicYear: {id, academicYear},
        student,
        student: {firstName, lastName, enrollments}
    } = enrolledStudent

    const [academicYearId, setAcademicYearId] = useState<string>(id)
    const [size, setSize] = useState<number>(10)
    const [pageCount, setPageCount] = useState<number>(0)
    const [attendances, setAttendances] = useState<Attendance[]>([])
    const [allCount, setAllCount] = useState<number>(0)
    const [tabKey, setTabKey] = useState<number>(0)
    const {data, error, isLoading, isSuccess, refetch} = useFetch('attendance-list', getStudentAttendances, [
        student.id, {page: pageCount, size: size}, academicYearId
    ])

    const academicYears = useMemo(() => {
        return [
            { value: id, label: academicYear },
            ...enrollments.map(e => ({
                value: e.academicYear.id,
                label: e.academicYear.academicYear
            }))
        ];
    }, [id, academicYear, enrollments]);

    const dataSource = useMemo(() => {
        return attendances.map(att => {
            const [tagColor, tagText] = attendanceTag(att.status);
            return {
                id: att.id,
                date: setFirstName(fDate(att.attendanceDate)),
                classe: `${att.classe.name}, ${att.classe.category}`,
                section: att.classe.grade.section as string,
                status: <Tag color={tagColor as 'processing'}>{firstLetter(tagText)}</Tag>,
            } ?? [];
        });
    }, [attendances]);

    useEffect(() => {
        if (tabKey !== 0 && tabKey > 1) {
            setSize(allCount)
            refetch().then(r => {
                if (r.data && 'content' in r.data) {
                    setAttendances(r.data.content as Attendance[])
                }
            })
        }else {
            setSize(1)
            if (academicYearId || size) {
                refetch().then(r => r.data)
            }
            if (isSuccess && !isLoading && data && 'content' in data && 'totalElements' in data) {
                setAttendances(data.content as Attendance[])
                setAllCount(data.totalElements as number)
            }
        }

    }, [isSuccess, isLoading, data, academicYearId, refetch, tabKey, allCount, size])

    console.log('Variation de la size: ', size)

    if(error) return <PageError />

    const studentName = `${setFirstName(lastName)} ${setFirstName(firstName)}`

    console.log(student.id)
    console.log(attendances)

    const handleAcademicYearIdValue = (value: string) => {
        setAcademicYearId(value)
    }

    const columns: TableColumnsType<DataIndex> = [
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
            title: <LuEye size={15} />,
            dataIndex: 'id',
            key: 'attendanceId',
            align: 'right',
            width: '50px',
            //TODO redirect to the day record link
            render: (text) => <Link to={`/${text}`}>Voir</Link>
        }
    ];

    const  handleTabChange = (tabKey: string) => {
        setTabKey(Number.parseInt(tabKey))
    }

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
                        rowKey={record => `row-${record.id}`}
                    />
                )},
                {key: '2', label: 'Etude Analytique', children: (
                    <AttendanceAnalysis data={dataSource} />
                )}
            ]}
            onTabChange={handleTabChange}
        />
    )
}

export default StudentAttendance;