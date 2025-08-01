import {Score} from "../../../entity";
import {Badge, List, Skeleton, TableColumnsType, TablePaginationConfig, Tag, Typography} from "antd";
import {Avatar} from "./Avatar.tsx";
import {setFirstName} from "../../../core/utils/utils.ts";
import {AutoScrollList} from "./AutoScrollList.tsx";
import {AvatarTitle} from "./AvatarTitle.tsx";
import {text} from "../../../core/utils/text_display.ts";
import {AutoScrollTable} from "./AutoScrollTable.tsx";
import {Table} from "./Table.tsx";
import {useMemo} from "react";

interface ScoreItemProps {
    scores: Score[];
    isLoading: boolean
    scoreSize: number
    allScores: number
    onLoadMore?: () => void
    infinite?: boolean
    height?: number
    isTable?: boolean
    customHeaders?: TableColumnsType<Score>
    hasPagination?: TablePaginationConfig | false
}

const ScoreItem = (
    {scores, isLoading, scoreSize, allScores, onLoadMore, infinite = true, height, isTable, customHeaders = undefined, hasPagination = false}: ScoreItemProps
) => {

    const sortedScores = useMemo(() => scores && scores?.length > 0 ?
            [...scores]?.sort((a, b) => b.obtainedMark - a.obtainedMark) : []
        , [scores])

    const columns: TableColumnsType<Score> = customHeaders ?? [
        {
            title: 'Noms & Prénoms',
            dataIndex: 'student',
            render: student => <AvatarTitle
                firstName={student?.personalInfo?.firstName}
                lastName={student?.personalInfo?.lastName}
                reference={student?.reference}
                image={student?.personalInfo?.image}
                link={text.student.group.view.href + student.id}
                size={50}
            />
        },
        {
            title: 'Classe',
            dataIndex: ['assignment', 'classe'],
            key: 'classe',
            align: 'center',
            render: classe => <Tag color={'#1d2e28'}>{classe?.name}</Tag>
        },
        {
            title: 'Notes cumulés',
            dataIndex: 'obtainedMark',
            key: 'obtainedMark',
            align: "right",
            render: (text: number) => <Typography.Title level={4}>
                {text}
                <Badge color={text >= 15 ? 'green' : text >= 10 ? 'gold' : 'red' } />
            </Typography.Title>
        }
    ]

    return(
        <>
        {isTable ? infinite ? (
            <AutoScrollTable
                tableProps={{
                    columns: columns,
                    dataSource: sortedScores,
                    pagination: hasPagination,
                    className: 'score-table',
                    loading: isLoading,
                    rowKey: item => item?.student?.id as string
                }}
                height={height ?? 200}
                size={scoreSize}
                loadMoreSize={onLoadMore!}
                allItems={allScores}
                isLoading={isLoading}
                infinite={infinite}
            />
        ) : (
            <Table
                tableProps={{
                    columns: columns,
                    dataSource: sortedScores,
                    pagination: hasPagination,
                    className: 'score-table',
                    loading: isLoading,
                    rowKey: item => item?.student?.id as string,
                    scroll: {y: height ?? 200}
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