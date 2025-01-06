import {Score} from "../../../entity";
import {List, Skeleton} from "antd";
import Avatar from "./Avatar.tsx";
import {setFirstName} from "../../../utils/utils.ts";
import {AutoScrollList} from "./AutoScrollList.tsx";

interface ScoreItemProps {
    scores: Score[];
    isLoading: boolean
    scoreSize: number
    allScores: number
    onLoadMore?: () => void
    infinite?: boolean
    height?: number

}

const ScoreItem = (
    {scores, isLoading, scoreSize, allScores, onLoadMore, infinite, height}: ScoreItemProps
) => {
    return(
        <AutoScrollList
            listProps={{
                dataSource: scores as Score[],
                renderItem: (score) => (
                    <List.Item actions={[
                        <span>{score?.obtainedMark}</span>
                    ]}>
                        <Skeleton avatar loading={isLoading} active={isLoading}>
                            <List.Item.Meta
                                avatar={<Avatar
                                    image={score?.student?.personalInfo?.image}
                                    firstText={score?.student?.personalInfo?.firstName}
                                    lastText={score?.student?.personalInfo?.lastName}
                                />}
                                title={
                                    <span className='name'>
                                        {score?.student?.personalInfo?.lastName} {setFirstName(`${score?.student?.personalInfo?.firstName}`)}
                                    </span>
                                }
                                description={score.student.reference}
                            />
                        </Skeleton>
                    </List.Item>
                )
            }}
            isLoading={isLoading}
            size={scoreSize}
            allItems={allScores}
            loadMore={onLoadMore!}
            height={height ?? 300}
            infinite={infinite ?? true}
        />
    )
}

export { ScoreItem };