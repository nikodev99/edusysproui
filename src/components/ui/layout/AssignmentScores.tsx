import {Collapse, Skeleton} from "antd";
import {Score} from "../../../entity";
import {useFetch} from "../../../hooks/useFetch.ts";
import {getAllAssignmentMarks} from "../../../data/repository/scoreRepository.ts";
import {Assignment} from "../../../entity/domain/assignment.ts";
import {useEffect, useRef, useState} from "react";
import {ScoreItem} from "./ScoreItem.tsx";

interface AssignmentScoresProps {
    assignment: Assignment | null
    size?: number
}

const AssignmentScores = (
    {assignment, size}: AssignmentScoresProps
) => {

    const [scores, setScores] = useState<Score[] | null>(null)
    const [allScores, setAllScores] = useState<number>(0)
    const [scoreSize, setScoreSize] = useState<number>(size ?? 5)
    const prevScoreSizeRef = useRef<number>(scoreSize);
    
    const {data, isLoading, isRefetching, isLoadingError, isSuccess, refetch} = useFetch<Score, unknown>('all-scores', getAllAssignmentMarks, [assignment?.id, scoreSize],{
        enabled: assignment !== null && assignment?.id !== undefined && assignment.id > 0,
        queryKey: ['all-scores']
    })
    
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
                    scores={scores as Score[]}
                    isLoading={scorePending}
                    scoreSize={scoreSize}
                    allScores={allScores}
                    onLoadMore={onLoadMore}
                />
            },
        ]}
    />) : (<Skeleton style={{marginTop: '5px'}} active={scorePending} paragraph={{rows: 1}} />)
        
    )
}

export { AssignmentScores }