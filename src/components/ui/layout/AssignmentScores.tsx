import {Collapse, Skeleton} from "antd";
import {Score} from "../../../entity";
import {useEffect, useRef, useState} from "react";
import {ScoreItem} from "./ScoreItem.tsx";
import {useScoreRepo} from "../../../hooks/useScoreRepo.ts";

interface AssignmentScoresProps {
    assignmentId: bigint | undefined
    size?: number,
    markId?: string
    isTable?: boolean
}

const AssignmentScores = (
    {assignmentId, size, markId, isTable}: AssignmentScoresProps
) => {

    const [scores, setScores] = useState<Score[] | null>(null)
    const [allScores, setAllScores] = useState<number>(0)
    const [scoreSize, setScoreSize] = useState<number>(size ?? 5)
    const prevScoreSizeRef = useRef<number>(scoreSize);

    const {useGetAllAssignmentMarks} = useScoreRepo()

    const {data, isLoading, isRefetching, isLoadingError, isSuccess, refetch} = useGetAllAssignmentMarks(assignmentId as bigint, scoreSize)
    
    const scorePending: boolean = isLoading || isRefetching || isLoadingError

    useEffect(() => {
        if (prevScoreSizeRef.current !== scoreSize) {
            refetch().then(r => r.data)
        }
        if (isSuccess && 'content' in data && 'totalElements' in data) {
            setScores(data.content as Score[])
            setAllScores(data.totalElements as number)
        }
        prevScoreSizeRef.current = scoreSize
    }, [data, isSuccess, refetch, scoreSize]);

    const onLoadMore = () => {
        if (scorePending) return
        setScoreSize(
            prevState => prevState < allScores ? prevState + 3 : allScores
        )
    }

    const scoresToShow: Score[] | null = scores && scores.length > 0 && markId ?
        scores.filter(s => s.student.id === markId) :
        scores

    console.log('Assign data: ', scoresToShow)

    return(
        !scorePending || scores && scores?.length > 0 ? (<Collapse
        style={{marginTop: '10px'}}
        size='small'
        ghost
        items={[
            {
                key: 1,
                label: 'Afficher les notes',
                children: <ScoreItem
                    scores={scoresToShow as Score[]}
                    isLoading={scorePending}
                    scoreSize={scoreSize}
                    allScores={allScores}
                    onLoadMore={onLoadMore}
                    height={markId ? 110 : undefined}
                    isTable={isTable}
                />
            },
        ]}
    />) : (<Skeleton style={{marginTop: '5px'}} active={scorePending} paragraph={{rows: 1}} />)
        
    )
}

export { AssignmentScores }