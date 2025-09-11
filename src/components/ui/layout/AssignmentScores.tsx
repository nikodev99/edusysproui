import {Collapse, Skeleton, TableColumnsType, TablePaginationConfig} from "antd";
import {Assignment, Score} from "../../../entity";
import {useEffect, useRef, useState} from "react";
import {ScoreItem} from "./ScoreItem.tsx";
import {useScoreRepo} from "../../../hooks/actions/useScoreRepo.ts";

interface AssignmentScoresProps {
    assignmentId?: bigint | number | undefined
    marks?: Score[]
    size?: number,
    markId?: string
    isTable?: boolean
    hasCollapse?: boolean
    tableColumns?: TableColumnsType<Score>
    height?: number
    addToScores?: Assignment
    loading?: boolean
    pagination?: TablePaginationConfig | false
}

const AssignmentScores = (
    {assignmentId, size, markId, isTable, hasCollapse = true, height, tableColumns, addToScores, marks, loading, pagination}: AssignmentScoresProps
) => {

    const [scores, setScores] = useState<Score[] | null>(null)
    const [allScores, setAllScores] = useState<number>(0)
    const [scoreSize, setScoreSize] = useState<number>(size ?? 5)
    const prevScoreSizeRef = useRef<number>(scoreSize);

    const {useGetAllAssignmentMarks} = useScoreRepo()

    const {data, isLoading, isRefetching, isLoadingError, isSuccess, refetch} = useGetAllAssignmentMarks(assignmentId as bigint, scoreSize)
    
    const scorePending: boolean = loading ?? (isLoading || isRefetching || isLoadingError)

    useEffect(() => {
        if (marks && marks.length > 0) {
            setScores(marks)
        } else {
            if (prevScoreSizeRef.current !== scoreSize) {
                refetch().then(r => r.data)
            }
            if (isSuccess && 'content' in data && 'totalElements' in data) {
                setScores(data.content as Score[])
                setAllScores(data.totalElements as number)
            }
            prevScoreSizeRef.current = scoreSize
        }
    }, [data, isSuccess, marks, refetch, scoreSize]);

    useEffect(() => {
        if (addToScores) {
            setScores(prevState => prevState?.map(score => ({
                ...score,
                assignment: addToScores
            })) ?? [])
        }
    }, [addToScores]);

    const onLoadMore = () => {
        if (scorePending) return
        setScoreSize(
            prevState => prevState < allScores ? prevState + 3 : allScores
        )
    }

    const scoresToShow: Score[] | null = scores && scores.length > 0 && markId ?
        scores.filter(s => s.student?.id === markId) : scores

    const scoreItem = <ScoreItem
        scores={scoresToShow as Score[]}
        isLoading={scorePending}
        scoreSize={scoreSize}
        allScores={allScores}
        onLoadMore={onLoadMore}
        height={markId ? 110 : height}
        isTable={isTable}
        customHeaders={tableColumns}
        infinite={!marks}
        hasPagination={pagination}
    />

    return(
        <>{
            !scorePending || scores && scores.length > 0 ?
                (hasCollapse ? (
                    <Collapse
                        style={{marginTop: '10px'}}
                        size='small'
                        ghost
                        items={[
                            {
                                key: 1,
                                label: 'Afficher les notes',
                                children: scoreItem
                            },
                        ]}
                    />
                ): (
                    scoreItem
                )):
                (
                    <Skeleton style={{marginTop: '5px'}} active={false} paragraph={{rows: 2}}/>
                )
            }
        </>
    )
}

export { AssignmentScores }