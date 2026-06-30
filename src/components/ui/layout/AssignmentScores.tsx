import {Collapse, Skeleton, TableColumnsType, TablePaginationConfig} from "antd";
import {Assignment, Score} from "@/entity";
import {useEffect, useRef, useState} from "react";
import {ScoreItem} from "./ScoreItem.tsx";
import {useScoreRepo} from "@/hooks/actions/useScoreRepo.ts";

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
    {assignmentId, size, markId, isTable, hasCollapse = true, height, tableColumns, addToScores, marks = [], loading, pagination}: AssignmentScoresProps
) => {

    const [scores, setScores] = useState<Score[] | null>(null)
    const [allScores, setAllScores] = useState<number>(0)
    const [scoreSize, setScoreSize] = useState<number>(size ?? 10)
    const prevScoreSizeRef = useRef<number>(scoreSize)

    const {useGetAllAssignmentMarks, useGetStudentScore} = useScoreRepo()
    const hasMarks = (marks?.length ?? 0) > 0
    const shouldFetchAll = !markId && !hasMarks

    const {data, isLoading, isRefetching, isLoadingError, isSuccess, refetch} = useGetAllAssignmentMarks(assignmentId as number, scoreSize, shouldFetchAll)
    const {data: studentScore} = useGetStudentScore(assignmentId as number, markId as string, !!markId)
    
    const scorePending: boolean = loading ?? (isLoading || isRefetching || isLoadingError)

    useEffect(() => {
        if (studentScore) setScores([studentScore])
    }, [studentScore])

    useEffect(() => {
        if (!markId && hasMarks) {
            setScores(marks!)
            setAllScores(marks!.length)
        }
    }, [markId, hasMarks, marks])

    useEffect(() => {
        if (addToScores) {
            setScores(prevState => prevState?.map(score => ({
                ...score,
                assignment: addToScores
            })) ?? [])
        }
    }, [addToScores]);

    useEffect(() => {
        if (!shouldFetchAll) return

        prevScoreSizeRef.current = scoreSize

        if (prevScoreSizeRef.current !== scoreSize) {
            refetch().then(result => {
                if (result.data && 'content' in result.data && 'totalElements' in result.data) {
                    setScores(result.data.content as Score[])
                    setAllScores(result.data.totalElements as number)
                }
            })
            return // don't fall through to stale `data` below
        }

        if (isSuccess && data && 'content' in data && 'totalElements' in data) {
            setScores(data.content as Score[])
            setAllScores(data.totalElements as number)
        }
    }, [shouldFetchAll, isSuccess, data, scoreSize, refetch])


    const onLoadMore = () => {
        if (scorePending) return
        setScoreSize(
            prevState => prevState < allScores ? prevState + 10 : allScores
        )
    }

    const scoreItem = <ScoreItem
        scores={scores as Score[]}
        isLoading={scorePending}
        scoreSize={scoreSize}
        allScores={allScores}
        onLoadMore={onLoadMore}
        height={markId ? 110 : height}
        isTable={isTable}
        customHeaders={tableColumns}
        infinite={shouldFetchAll}
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