import {Score, Student} from "@/entity";
import {Badge, List, Skeleton, TableColumnsType, TablePaginationConfig, Tag, Typography} from "antd";
import {Avatar} from "./Avatar.tsx";
import {MAIN_COLOR, setFirstName} from "@/core/utils/utils.ts";
import {AutoScrollList} from "./AutoScrollList.tsx";
import {AvatarTitle} from "./AvatarTitle.tsx";
import {AutoScrollTable} from "./AutoScrollTable.tsx";
import {Table} from "./Table.tsx";
import {useCallback, useMemo} from "react";
import {stringhelper} from "@/core/helpers/StringHelper.ts";
import {useRedirect} from "@/hooks/useRedirect.ts";

interface ScoreItemProps {
    scores: Score[];
    isLoading: boolean
    scoreSize: number
    allScores: number
    onLoadMore?: () => void
    infinite?: boolean
    height?: number
    isTable?: boolean
    showBestTable?: boolean
    customHeaders?: TableColumnsType<Score>
    hasPagination?: TablePaginationConfig | false
    hasPermission?: boolean
}

const ScoreItem = (
    {
        scores, isLoading, scoreSize, allScores, onLoadMore, infinite = true, height, isTable, customHeaders = undefined,
        hasPagination = false, showBestTable = false, hasPermission = false
    }: ScoreItemProps
) => {

    const {toViewStudent} = useRedirect()

    const sortedScores = useMemo(() => scores && scores?.length > 0 ?
            [...scores]?.sort((a, b) => b.obtainedMark - a.obtainedMark) : []
        , [scores])

    const load = useCallback(() => onLoadMore?.(), [onLoadMore])

    const columns: TableColumnsType<Score> = customHeaders ?? [
        {
            title: 'Noms & Prénoms',
            dataIndex: 'student',
            render: (student: Student) => <AvatarTitle
                firstName={student?.personalInfo?.firstName}
                lastName={student?.personalInfo?.lastName}
                reference={student?.personalInfo?.reference}
                image={student?.personalInfo?.image}
                toView={hasPermission ? () => toViewStudent(student?.id, student.personalInfo) : undefined}
                size={35}
            />
        },
        {
            title: 'Classe',
            dataIndex: ['assignment', 'classe'],
            key: 'classe',
            align: 'center',
            render: classe => <Tag color={MAIN_COLOR}>{classe?.name}</Tag>
        },
        ...(showBestTable ? [{
            title: 'n',
            dataIndex: 'assignmentCount',
            key: 'assignmentCount',
            align: "right",
            render: (text: number) => text
        },
        {
            title: 'Moyenne Total',
            dataIndex: 'obtainedMark',
            key: 'obtainedMark',
            align: "right",
            render: (text: number) => <Typography.Title level={4}>
                {stringhelper.formatAvg(text)}
            </Typography.Title>
        },
        {
            title: 'Moyenne Bayésienne',
            dataIndex: 'shrinkMark',
            key: 'shrinkMark',
            align: "right",
            render: (text: number) => <Typography.Title level={4}>
                {stringhelper.formatAvg(text)}
                <Badge color={text >= 15 ? 'green' : text >= 10 ? 'gold' : 'red' } />
            </Typography.Title>
        }]: [
            {
                title: 'Moyenne Total',
                dataIndex: 'obtainedMark',
                key: 'obtainedMark',
                align: "right",
                render: (text: number) => <Typography.Title level={4}>
                    {stringhelper.formatAvg(text)}
                    <Badge color={text >= 15 ? 'green' : text >= 10 ? 'gold' : 'red' } />
                </Typography.Title>
            }
        ]),

    ] as TableColumnsType<Score>

    return(
        <>
        {isTable ? infinite ? (
            <AutoScrollTable
                tableProps={{
                    columns: columns,
                    dataSource: scores,
                    pagination: hasPagination,
                    className: 'score-table',
                    size: 'small',
                    loading: isLoading,
                    rowKey: item => item?.student?.id as string
                }}
                height={height ?? 200}
                size={scoreSize}
                loadMoreSize={load}
                allItems={allScores}
                isLoading={isLoading}
                infinite={infinite}
            />
        ) : (
            <Table
                tableProps={{
                    columns: columns,
                    dataSource: scores,
                    pagination: hasPagination,
                    className: 'score-table',
                    loading: isLoading,
                    size: 'small',
                    rowKey: item => item?.student?.id as string,
                    scroll: {y: height ?? 200, x: 'max-content'}
                }}
            />
            )
        :(
            <AutoScrollList
                listProps={{
                    dataSource: sortedScores as Score[],
                    renderItem: (score) => (
                        <List.Item actions={[
                            <Typography.Title level={4}>
                                {score?.obtainedMark}
                                <Badge color={score?.obtainedMark >= 15 ? 'green' : score?.obtainedMark >= 10 ? 'gold' : 'red' } />
                            </Typography.Title>
                        ]}>
                            <Skeleton avatar loading={isLoading} active={isLoading}>
                                <List.Item.Meta
                                    avatar={<Avatar
                                        image={score?.student?.personalInfo?.image}
                                        firstText={score?.student?.personalInfo?.firstName}
                                        lastText={score?.student?.personalInfo?.lastName}
                                        size={50}
                                    />}
                                    title={
                                        <span className='name'>
                                            {score?.student?.personalInfo?.lastName} {setFirstName(`${score?.student?.personalInfo?.firstName}`)}
                                        </span>
                                    }
                                    description={score?.student?.personalInfo?.reference}
                                />
                            </Skeleton>
                        </List.Item>
                    )
                }}
                isLoading={isLoading}
                size={scoreSize}
                allItems={allScores}
                loadMoreSize={onLoadMore!}
                height={height ?? 200}
                infinite={infinite}
            />
        )}
        </>
    )
}

export { ScoreItem };