import TabItem from "../../view/TabItem.tsx";
import {Attendance, Enrollment} from "../../../entity";
import {fDate, firstLetter, setFirstName, startsWithVowel} from "../../../utils/utils.ts";
import {Select, Table, TableColumnsType} from "antd";
import {useEffect, useState, useMemo} from "react";
import {LuEye} from "react-icons/lu";
import {Link} from "react-router-dom";
import {useFetch} from "../../../hooks/useFetch.ts";
import {getStudentAttendances} from "../../../data/repository/attendanceRepository.ts";
import PageError from "../../../pages/PageError.tsx";
import Tag from "../../ui/layout/Tag.tsx";
import {attendanceTag} from "../../../entity/enums/attendanceStatus.ts";
import {AttendanceRecord} from "../../../utils/interfaces.ts";
import {AttendanceAnalysis} from "./AttendanceAnalysis.tsx";

export const StudentAttendance = ({enrolledStudent}: {enrolledStudent: Enrollment}) => {

    const {academicYear, student: {personalInfo, enrollments}} = enrolledStudent

    const [academicYearId, setAcademicYearId] = useState<string>(academicYear?.id)
    const [size, setSize] = useState<number>(10)
    const [pageCount, setPageCount] = useState<number>(0)
    const [attendances, setAttendances] = useState<Attendance[]>([])
    const {data, error, isLoading, isSuccess, refetch} = useFetch('attendance-list', getStudentAttendances, [
        personalInfo?.id, {page: pageCount, size: size}, academicYearId
    ])

    const academicYears = useMemo(() => {
        return [
            { value: academicYear?.id, label: academicYear?.academicYear },
            ...enrollments.map(e => ({
                value: e.academicYear.id,
                label: e.academicYear.academicYear
            }))
        ];
    }, [academicYear, enrollments]);

    const dataSource: AttendanceRecord[] = useMemo(() => {
        return attendances.map(att => {
            console.log('Attendance: ', att?.classe?.name)
            const [tagColor, tagText] = attendanceTag(att.status);
            return {
                id: att?.id,
                date: setFirstName(fDate(att.attendanceDate)),
                classe: `${att?.classe?.name}, ${att?.classe?.category}`,
                section: att?.classe?.grade?.section as string,
                status: <Tag color={tagColor as 'danger'}>{firstLetter(tagText)}</Tag>,
            };
        })
    }, [attendances])

    useEffect(() => {
        if (academicYearId || size) {
            refetch().then(r => r.data)
        }
        if (isSuccess && !isLoading && data && 'content' in data) {
            setAttendances(data.content as Attendance[])
        }
    }, [academicYearId, data, isLoading, isSuccess, refetch, size])

    if(error) return <PageError />

    const studentName = `${setFirstName(personalInfo?.lastName)} ${setFirstName(personalInfo?.firstName)}`

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
            title: <LuEye size={15} />,
            dataIndex: 'id',
            key: 'attendanceId',
            align: 'right',
            width: '50px',
            //TODO redirect to the day record link
            render: (text) => <Link to={`/${text}`}>Voir</Link>
        }
    ];

    return(
        <TabItem
            title={`Suivis de présence d${startsWithVowel(personalInfo?.lastName) ? "'" : 'e '}${studentName}`}
            selects={[
                (
                    <Select
                        className='select-control'
                        defaultValue={academicYear?.id}
                        options={academicYears}
                        onChange={handleAcademicYearIdValue}
                        variant='borderless'
                    />
                )
            ]}
            items={[
                {key: '1', label: 'Données de présence', children: (
                    <>
                        <AttendanceAnalysis enrollment={enrolledStudent} academicYear={academicYearId} />
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            size='small'
                            scroll={{y: 500}}
                            pagination={false}
                            rowKey={record => `row-${record.id}`}
                        />
                    </>
                )}
            ]}
        />
    )
}