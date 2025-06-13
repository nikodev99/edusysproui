import TabItem from "../../view/TabItem.tsx";
import {Attendance, Enrollment} from "../../../entity";
import {firstLetter, getUniqueness, setFirstName, startsWithVowel} from "../../../core/utils/utils.ts";
import {TableColumnsType} from "antd";
import {useState, useMemo, useRef, useEffect} from "react";
import {AttendanceAnalysis} from "./AttendanceAnalysis.tsx";
import {useAttendanceRepo} from "../../../hooks/useAttendanceRepo.ts";
import {AutoScrollTable} from "../../ui/layout/AutoScrollTable.tsx";
import { attendanceTag } from "../../../entity/enums/attendanceStatus.ts";
import { AttendanceRecord } from "../../../core/utils/interfaces.ts";
import Datetime from "../../../core/datetime.ts";
import Tag from "../../ui/layout/Tag.tsx";
import PageError from "../../../pages/PageError.tsx";
import {LuEye} from "react-icons/lu";
import {Link} from "react-router-dom";
import {SelectAcademicYear} from "../../common/SelectAcademicYear.tsx";

export const StudentAttendance = ({enrolledStudent, infinite = true}: {enrolledStudent: Enrollment, infinite?: boolean}) => {

    const {academicYear, student: {personalInfo, enrollments}} = enrolledStudent

    const pageItemSize: number = 15
    const [academicYearId, setAcademicYearId] = useState<string>(academicYear?.id)
    const [size, setSize] = useState<number>(pageItemSize)
    const [allItems, setAllItems] = useState<number>(0)
    const [attendances, setAttendances] = useState<Attendance[]>([])
    const pageCount = useRef<number>(0)
    const {useGetStudentAttendance} = useAttendanceRepo()
    
    const {data, isSuccess, isLoading, isRefetching, refetch, error} = useGetStudentAttendance(
        personalInfo?.id as number,
        {page: pageCount.current, size: size},
        academicYearId
    )

    const academicYears = useMemo(() => {
        if (!enrollments.length)
            return [academicYear]
        return getUniqueness(enrollments, a => a.academicYear, n => n.id)
    }, [academicYear, enrollments]);

    console.log('enrolled student: ', academicYears)

    const dataSource: AttendanceRecord[] = useMemo(() => {
        return attendances.map(att => {
            const [tagColor, tagText] = attendanceTag(att.status);
            return {
                id: att?.id,
                date: Datetime.of(att.attendanceDate).fDate(),
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
                    <SelectAcademicYear academicYears={academicYears} getAcademicYear={handleAcademicYearIdValue} />
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
                                loading: isLoading || isRefetching,
                                rowKey: record => `row-${record.id}`,
                            }}
                            isLoading={isLoading || isRefetching}
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