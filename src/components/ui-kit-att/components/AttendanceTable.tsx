import {Attendance, Classe, Grade, Individual} from "@/entity";
import {TableColumnsType} from "antd";
import {cutStatement, firstLetter, isObjectEmpty} from "@/core/utils/utils.ts";
import Tag from "../../ui/layout/Tag.tsx";
import {AttendanceStatus, attendanceTag} from "@/entity/enums/attendanceStatus.ts";
import Datetime, {DateFormat} from "../../../core/datetime.ts";
import {AvatarTitle} from "../../ui/layout/AvatarTitle.tsx";
import ListViewer from "../../custom/ListViewer.tsx";
import {useMemo, useState} from "react";
import {AttendanceStatusCountResponse} from "@/core/utils/interfaces.ts";
import {AttendanceDaySummary} from "./AttendanceDaySummary.tsx";
import {UseQueryResult} from "@tanstack/react-query";
import {EntityCardProps} from "@/components/custom/EntityCard.tsx";
import {getAttendancePalette} from "@/core/helpers/colorPalette.ts";
import {SectionType} from "@/entity/enums/section.ts";
import {useAttendanceRepo} from "@/hooks/actions/useAttendanceRepo.ts";

export const AttendanceTable = ({academicYear, todayAttendanceData, date}: {
    todayAttendanceData?: UseQueryResult<AttendanceStatusCountResponse, unknown>,
    academicYear?: string
    date?: Datetime
}) => {

    const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)
    const {useGetPaginated} = useAttendanceRepo()
    const {getPaginatedData} = useGetPaginated(academicYear as string, date as Datetime)
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

    const handleCardRender = (data: Attendance[]): EntityCardProps<Attendance>[] => {
        return data?.map(c => {
            const colors = getAttendancePalette(AttendanceStatus[c?.status])
            return {
                id: c.id,
                record: c,
                ariaLabel: `Fiche de présence – ${c?.id}`,
                palette: colors,
                header: {type: 'avatar', image: c?.individual?.image, firstText: c?.individual?.firstName, lastText: c?.individual?.lastName},
                pillText: `ATT-${c?.id}`,
                rightText: c?.academicYear?.academicYear,
                titlePrimary: c?.individual?.firstName,
                titleSecondary: c?.individual?.lastName,
                stats: [
                    {label: 'Date', value: Datetime.of(c?.attendanceDate).fDate(), small: true},
                    {label: 'Classe', value: cutStatement(c?.classe?.category as string, 10, c?.classe?.name), small: true},
                    {label: 'Section', value: SectionType[c?.classe?.grade?.section as unknown as keyof typeof SectionType], small: true}
                ],
                tags: [
                    getTag(c?.status)
                ],
                footerLabel: 'Ajouté le',
                footerValue: Datetime.of(c?.createdDate).format(DateFormat.DATE_MEDIUM)
            } as EntityCardProps<Attendance>
        })
    }

    return(
        <main>
            {todayAttendanceData && dataExists && <AttendanceDaySummary data={todayAttendanceData} />}
            <ListViewer
                callback={getPaginatedData as never}
                callbackParams={[searchQuery]}
                shareSearchQuery={setSearchQuery}
                tableColumns={columns as []}
                hasCount={false}
                fetchId='attendance-day'
                uuidKey={['individual', 'id']}
                cardRender={handleCardRender}
                itemSize={50}
            />
        </main>
    )
}