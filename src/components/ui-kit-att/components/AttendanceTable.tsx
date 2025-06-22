import {Attendance, Classe, Grade, Individual} from "../../../entity";
import {Descriptions, TableColumnsType} from "antd";
import {firstLetter, isObjectEmpty} from "../../../core/utils/utils.ts";
import Tag from "../../ui/layout/Tag.tsx";
import {AttendanceStatus, attendanceTag} from "../../../entity/enums/attendanceStatus.ts";
import Datetime from "../../../core/datetime.ts";
import {AvatarTitle} from "../../ui/layout/AvatarTitle.tsx";
import ListViewer from "../../custom/ListViewer.tsx";
import {getAllSchoolStudentAttendanceOfTheDay} from "../../../data/repository/attendanceRepository.ts";
import {AxiosResponse} from "axios";
import {text} from "../../../core/utils/text_display.ts";
import {useMemo, useState} from "react";
import {AttendanceStatusCountResponse, DataProps} from "../../../core/utils/interfaces.ts";
import {AttendanceDaySummary} from "./AttendanceDaySummary.tsx";
import {UseQueryResult} from "@tanstack/react-query";

export const AttendanceTable = ({academicYear, todayAttendanceData, date}: {
    todayAttendanceData?: UseQueryResult<AttendanceStatusCountResponse, unknown>,
    academicYear?: string
    date?: Datetime
}) => {

    const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)
    const dataExists = useMemo(() =>
        todayAttendanceData?.isSuccess && todayAttendanceData?.data && !isObjectEmpty(todayAttendanceData?.data)
    , [todayAttendanceData])

    const getTag = (status: AttendanceStatus) => {
        const [tagColor, tagText] = attendanceTag(status);
        return <Tag color={tagColor as 'danger'}>{firstLetter(tagText)}</Tag>
    }
    
    const columns: TableColumnsType<Attendance> = [
        {
            title: 'Nom(s), Prenom(s)',
            dataIndex: 'individual',
            key: 'students',
            render: (student: Individual) => <AvatarTitle
                image={student?.image}
                lastName={student?.lastName}
                firstName={student?.firstName}
                size={35}
            />
        },
        {
            title: "Date",
            dataIndex: 'attendanceDate',
            key: 'date',
            align: 'center',
            render: date => Datetime.of(date).fDate()
        },
        {
            title: "Classe",
            dataIndex: 'classe',
            key: 'classe',
            align: 'center',
            responsive: ['md'],
            render: (classe: Classe) => `${classe?.name}, ${classe?.category}`
        },
        {
            title: "Section",
            dataIndex: ['classe', 'grade'],
            key: 'section',
            align: 'center',
            responsive: ['md'],
            render: (grade: Grade) => `${grade.section}`
        },
        {
            title: "Status",
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: status => getTag(status)
        }
    ]

    const cardData = (data: Attendance[]) => {
        return data?.map(c => (
            {
                id: `${c?.individual?.id}`,
                firstName: c?.individual?.firstName,
                lastName: c?.individual?.lastName,
                image: c?.individual?.image,
                tag: getTag(c.status),
                description: <Descriptions size='small' items={[
                    ...(date ? [{key: 1, label: 'Date', children: <em>{date.fullDay()}</em>, span: 3}] : []),
                    {key: 2, label: 'Classe', children: c?.classe?.name},
                    {key: 1, label: 'Section', children: c?.classe?.grade?.section}
                ]} />
            }
        )) as DataProps<Attendance>[]
    }

    return(
        <main>
            {todayAttendanceData && dataExists && <AttendanceDaySummary data={todayAttendanceData} />}
            <ListViewer
                callback={getAllSchoolStudentAttendanceOfTheDay as () => Promise<AxiosResponse<Attendance>>}
                callbackParams={[text.schoolID, academicYear, date?.toDate(), searchQuery]}
                shareSearchQuery={setSearchQuery}
                tableColumns={columns as []}
                hasCount={false}
                fetchId='attendance-day'
                uuidKey={['individual', 'id']}
                cardData={cardData}
                itemSize={30}
            />
        </main>
    )
}