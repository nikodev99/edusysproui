import ListViewer from "../../custom/ListViewer.tsx";
import {
    getClasseAttendanceStatus,
    getClasseAttendanceStatusSearch
} from "../../../data/repository/attendanceRepository.ts";
import {Avatar, Badge, Progress, TableColumnsType, Typography} from "antd";
import {
    AttendanceCount,
    AttendanceStatusCount,
    AttendanceSummary,
    Color,
    DataProps
} from "../../../utils/interfaces.ts";
import {Individual} from "../../../entity/domain/individual.ts";
import {AvatarTitle} from "../../ui/layout/AvatarTitle.tsx";
import {AxiosResponse} from "axios";
import {AttendanceStatus, countAll, getColors} from "../../../entity/enums/attendanceStatus.ts";
import {ATTENDANCE_STATUS_COLORS, findPercent} from "../../../utils/utils.ts";
import {Table} from "../../ui/layout/Table.tsx";

type NestedType = {category: string} & AttendanceStatusCount

const ClasseAttendanceTable = (
    {classeId, academicYear, classeTotal, color}: {
        classeId?: number, academicYear?: string, classeTotal: AttendanceStatusCount, color?: Color
    }) => {

    const { Text } = Typography;

    const columns: TableColumnsType<AttendanceSummary> = [
        {
            title: 'Nom(s) et Prénons',
            dataIndex: 'individual',
            key: 'individual',
            width: '25%',
            className: 'col__name',
            render: (text: Individual) => (
                <AvatarTitle
                    image={text?.image}
                    firstName={text?.firstName}
                    lastName={text?.lastName}
                    size={30}
                />
            )
        },
        {
            title: 'Jours Présent',
            dataIndex: 'statusCount',
            key: 'present-count',
            align: 'center',
            render: (text: AttendanceCount[]) => <Badge count={countAll(text)} color={ATTENDANCE_STATUS_COLORS[0]}>
                <Avatar shape='square' style={{background: 'white', border: '1px solid #ccc', color: 'black'}}>
                    {text && text?.find(
                        s => AttendanceStatus[s?.status as unknown as keyof typeof AttendanceStatus] === AttendanceStatus.PRESENT
                    )?.count || 0 }
                </Avatar>
            </Badge>
        },
        {
            title: 'Jours Absent',
            dataIndex: 'statusCount',
            key: 'present-count',
            align: 'center',
            render: (text: AttendanceCount[]) => <Badge count={countAll(text)} color={ATTENDANCE_STATUS_COLORS[1]}>
                <Avatar shape='square' style={{background: 'white', border: '1px solid #ccc', color: 'black'}}>
                    {text && text?.find(
                        s => AttendanceStatus[s?.status as unknown as keyof typeof AttendanceStatus] === AttendanceStatus.ABSENT
                    )?.count || 0 }
                </Avatar>
            </Badge>
        },
        {
            title: 'Jours en Retard',
            dataIndex: 'statusCount',
            key: 'present-count',
            align: 'center',
            render: (text: AttendanceCount[]) => <Badge count={countAll(text)} color={ATTENDANCE_STATUS_COLORS[2]}>
                <Avatar shape='square' style={{background: 'white', border: '1px solid #ccc', color: 'black'}}>
                    {text && text?.find(
                        s => AttendanceStatus[s?.status as unknown as keyof typeof AttendanceStatus] === AttendanceStatus.LATE
                    )?.count || 0 }
                </Avatar>
            </Badge>
        },
        {
            title: 'Jours Excusé',
            dataIndex: 'statusCount',
            key: 'present-count',
            align: 'center',
            render: (text: AttendanceCount[]) => <Badge count={countAll(text)} color={ATTENDANCE_STATUS_COLORS[3]}>
                <Avatar shape='square' style={{background: 'white', border: '1px solid #ccc', color: 'black'}}>
                    {text && text?.find(
                        s => AttendanceStatus[s?.status as unknown as keyof typeof AttendanceStatus] === AttendanceStatus.EXCUSED
                    )?.count || 0 }
                </Avatar>
            </Badge>
        }
    ]

    const nestedDataSource = (datasource: AttendanceCount[]) => {
        const data: NestedType[] = []
        const objectMap: NestedType = {} as NestedType
        const objectMap2: NestedType = {} as NestedType
        const total = countAll(datasource)
        objectMap.category = 'Taux de présence'
        objectMap2.category = 'Taux par rapport a la classe'
        datasource.forEach(d => {
            switch (AttendanceStatus[d.status as unknown as keyof typeof AttendanceStatus]) {
                case AttendanceStatus.ABSENT:
                    objectMap.absent =  findPercent(d.count, total) as number
                    objectMap2.absent =  findPercent(d.count, classeTotal.absent) as number
                    break
                case AttendanceStatus.EXCUSED:
                    objectMap.excused = findPercent(d.count, total) as number
                    objectMap2.excused = findPercent(d.count, classeTotal.excused) as number
                    break
                case AttendanceStatus.PRESENT:
                    objectMap.present = findPercent(d.count, total) as number
                    objectMap2.present = findPercent(d.count, classeTotal.present) as number
                    break
                case AttendanceStatus.LATE:
                    objectMap.late = findPercent(d.count, total) as number
                    objectMap2.late = findPercent(d.count, classeTotal.late) as number
                    break
                default:
                    break
            }
        })
        data.push(objectMap)
        data.push(objectMap2)
        return data
    }

    const nestedColumns: TableColumnsType<NestedType> = [
        {
            title: '',
            dataIndex: 'category',
            key: 'category',
            width: '25%'
        },
        {
            title: 'Présent',
            dataIndex: 'present',
            key: 'count-present',
            align: 'center',
            render: (text) => <Progress
                percent={text}
                type='dashboard'
                size={50}
                strokeColor={getColors(AttendanceStatus.PRESENT)}
                strokeWidth={12}
                status={'active'}
            />
        },
        {
            title: 'Absent',
            dataIndex: 'absent',
            key: 'count-absent',
            align: 'center',
            render: (text) => <Progress
                percent={text}
                type='dashboard'
                size={50}
                strokeColor={getColors(AttendanceStatus.ABSENT)}
                strokeWidth={12}
                status={'active'}
            />
        },
        {
            title: 'En retard',
            dataIndex: 'late',
            key: 'count-late',
            align: 'center',
            render: (text) => <Progress
                percent={text}
                type='dashboard'
                size={50}
                strokeColor={getColors(AttendanceStatus.LATE)}
                strokeWidth={12}
                status={'active'}
            />
        },
        {
            title: 'Excusé',
            dataIndex: 'excused',
            key: 'count-excused',
            align: 'center',
            render: (text) => <Progress
                percent={text}
                type='dashboard'
                size={50}
                strokeColor={getColors(AttendanceStatus.EXCUSED)}
                strokeWidth={12}
                status={'active'}
            />
        }
    ];

    const cardData = (data: AttendanceSummary[]) => {
        return data?.map(c => {
            const total = c?.statusCount.reduce((sum, record) => sum + record.count, 0)
            return {
                id: `${c?.individual?.id}`,
                firstName: c?.individual?.firstName,
                lastName: c?.individual?.lastName,
                image: c?.individual?.image,
                description: c?.statusCount.map((item) => (
                <div key={item?.status} style={{ marginBottom: 5, textAlign: 'left' }}>
                    <Text>{AttendanceStatus[item?.status as unknown as keyof typeof AttendanceStatus]}: {item.count} Jours</Text>
                    <Progress
                        percent={findPercent(item?.count, total) as number}
                        status="active"
                        strokeColor={getColors(AttendanceStatus[item?.status as unknown as keyof typeof AttendanceStatus])}
                    />
                </div>))
            }
        }) as DataProps[]
    }

    return(
        <ListViewer
            callback={getClasseAttendanceStatus as () => Promise<AxiosResponse<AttendanceSummary>>}
            callbackParams={[classeId, academicYear]}
            searchCallback={getClasseAttendanceStatusSearch as (...input: unknown[]) => Promise<AxiosResponse<AttendanceSummary[]>>}
            searchCallbackParams={[classeId, academicYear]}
            tableColumns={columns as []}
            hasCount={false}
            fetchId='attendanceTable'
            uuidKey={['individual', 'id']}
            cardData={cardData}
            tableProps={{
                expandable: {
                    expandedRowRender: (record, index) => (
                        <Table
                            tableProps={{
                                dataSource: nestedDataSource(record?.statusCount),
                                columns: nestedColumns,
                                rowKey: `${index}`,
                                pagination: false
                            }}
                            color={color}
                        />
                    ),
                    defaultExpandedRowKeys: ['0']
                }
            }}
        />
    )
}

export { ClasseAttendanceTable }