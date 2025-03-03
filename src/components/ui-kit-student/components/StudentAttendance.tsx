import TabItem from "../../view/TabItem.tsx";
import {Attendance, Enrollment} from "../../../entity";
import {fDate, firstLetter, setFirstName, startsWithVowel} from "../../../utils/utils.ts";
import {Select, TableColumnsType} from "antd";
import {useEffect, useState, useMemo, useRef} from "react";
import {LuEye} from "react-icons/lu";
import {Link} from "react-router-dom";
import {useFetch} from "../../../hooks/useFetch.ts";
import {getStudentAttendances} from "../../../data/repository/attendanceRepository.ts";
import PageError from "../../../pages/PageError.tsx";
import Tag from "../../ui/layout/Tag.tsx";
import {attendanceTag} from "../../../entity/enums/attendanceStatus.ts";
import {AttendanceRecord} from "../../../utils/interfaces.ts";
import {AttendanceAnalysis} from "./AttendanceAnalysis.tsx";
import {AutoScrollTable} from "../../ui/layout/AutoScrollTable.tsx";

export const StudentAttendance = ({enrolledStudent, infinite = true}: {enrolledStudent: Enrollment, infinite?: boolean}) => {

    const {academicYear, student: {personalInfo, enrollments}} = enrolledStudent

    const pageItemSize: number = 15
    const [academicYearId, setAcademicYearId] = useState<string>(academicYear?.id)
    const [size, setSize] = useState<number>(pageItemSize)
    const [allItems, setAllItems] = useState<number>(0)
    const [attendances, setAttendances] = useState<Attendance[]>([])
    const pageCount = useRef<number>(0)
    
    const {data, error, isLoading, isFetching, isSuccess, refetch} = useFetch('attendance-list', getStudentAttendances, [
        personalInfo?.id, {page: pageCount.current, size: size}, academicYearId
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
        if (academicYearId || size || personalInfo?.id) {
            refetch().then(r => r.data)
        }
        if (isSuccess && !isLoading && data && 'content' in data && 'totalElements'in data) {
            setAttendances(data.content as Attendance[])
            setAllItems(data.totalElements as number)
        }
    }, [academicYearId, data, isLoading, isSuccess, personalInfo?.id, refetch, size])

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

    const handleLoadMore = ()=>  {
        setSize(prevState => prevState + size)
    }

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
                        <AutoScrollTable
                            tableProps={{
                                columns: columns,
                                dataSource: dataSource,
                                size: 'small',
                                pagination: false,
                                loading: isLoading || isFetching,
                                rowKey: record => `row-${record.id}`,
                            }}
                            isLoading={isLoading || isFetching}
                            allItems={allItems}
                            loadMoreSize={handleLoadMore}
                            size={size}
                            infinite={infinite}
                            height={500}
                        />
                    </>
                )}
            ]}
        />
    )
}