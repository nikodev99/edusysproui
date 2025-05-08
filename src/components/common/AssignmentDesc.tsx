import Responsive from "../ui/layout/Responsive.tsx";
import Grid from "../ui/layout/Grid.tsx";
import {Card} from "antd";
import VoidData from "../view/VoidData.tsx";
import {ShapePieChart} from "../graph/ShapePieChart.tsx";
import {Assignment} from "../../entity";
import {dateCompare, getAssignmentBarData, getDiffFromNow} from "../../core/utils/utils.ts";
import {ReactNode, useLayoutEffect, useRef, useState} from "react";
import {Score} from "../../entity";
import {CardSkeleton} from "../../core/utils/tsxUtils.tsx";
import dayjs from "dayjs";
import {ScoreItem} from "../ui/layout/ScoreItem.tsx";
import {BarChart} from "../graph/BarChart.tsx";
import Datetime from "../../core/datetime.ts";
import {AssignmentViewDesc} from "./AssignmentViewDesc.tsx";
import {AssignmentSchedule} from "./AssignmentSchedule.tsx";

interface AssignmentDescProps {
    assignments: Assignment[] | null
    listTitle: string | ReactNode
    studentAllScore?: Score[] | null
    isLoading?: boolean
    scoreLoading?: boolean
    hasLegend?: boolean
    showBarChart?: boolean
    barLayout?: 'horizontal' | 'vertical'
    setRefetch?: (refetch: boolean) => void
    refetch?: boolean
    showBest?: boolean
    onlyMark?: string
}

const getNextAssignment = (assignments: Assignment[] | null): Assignment | null => {
    const now = dayjs()
    if (assignments) {
        const upcomingAssignment = assignments.filter(a => Datetime.of(a.examDate as number[])?.isAfter(now))
        upcomingAssignment.sort((a, b) => Datetime.of(a.examDate as number[])?.compare(b.examDate as number[]))
        return upcomingAssignment?.length > 0 ? upcomingAssignment[0] : null
    }
    return null
}

const getLastPassedAssignment = (assignments: Assignment[] | null): Assignment | null => {
    if (assignments) {
        const passedAssignments = assignments.filter((assignment) => assignment.passed);
        passedAssignments.sort((a, b) =>Datetime.of(b?.examDate as number[])?.isBefore(a?.examDate as number[]) ? -1 : 1);
        return passedAssignments?.length > 0 ? passedAssignments[0] : null
    }
    return null
}

export const AssignmentDesc = (
    {assignments, listTitle, isLoading, studentAllScore, setRefetch, refetch, scoreLoading, hasLegend = true, showBarChart = false,
    showBest = true, barLayout = 'vertical', onlyMark}: AssignmentDescProps
) => {
    const [scoreSize, setScoreSize] = useState<number>(5)
    const assignment = useRef<Assignment | null>()
    const passedAssignment = useRef<Assignment | null>()

    useLayoutEffect(() => {
        if (refetch) {
            setRefetch && setRefetch(refetch)
        }
    }, [refetch, setRefetch])

    const pieData = [
        {name: 'A venir', value: assignments?.filter(a => !a.passed && dateCompare(a?.examDate as Date))?.length || 0, color: '#DAA520'},
        {name: 'Accompli', value: assignments?.filter(a => a.passed)?.length || 0, color: '#228B22'},
        {name: 'Date dépassé', value: assignments?.filter(a => !a.passed && !dateCompare(a?.examDate as Date))?.length || 0, color: '#B22222'}
    ]

    const days = getDiffFromNow(assignment.current?.examDate as [number, number, number], 'day', assignment?.current?.startTime as [number, number])
    const hours = getDiffFromNow(assignment.current?.examDate as [number, number, number], 'hour', assignment?.current?.startTime as [number, number])
    const minutes = getDiffFromNow(assignment.current?.examDate as [number, number, number], 'minute', assignment?.current?.startTime as [number, number])
    const timeDiff: string =  days && days > 0
        ? `dans ${days} jour${days > 1 ? 's': ''}`
        : hours && hours > 0 ? `dans ${hours} heure${hours > 1 ? 's': ''}`
            : minutes && minutes > 0 ? `dans ${minutes} heure${minutes > 1 ? 's': ''}`: "à l'instant"

    assignment.current = getNextAssignment(assignments)
    passedAssignment.current = getLastPassedAssignment(assignments)

    const barData = getAssignmentBarData(assignments)

    return(
        <>
        <Responsive gutter={[16, 16]} style={{padding: '0 20px 20px 20px'}}>
            <Grid xs={24} md={24} lg={24}>
                {assignments && assignments?.length > 0
                    ? <Card>
                        <AssignmentSchedule
                            eventSchedule={assignments}
                            shareScoreSize={setScoreSize}
                            setRefetch={setRefetch}
                            onlyMark={onlyMark}
                            isLoading={isLoading}
                            showBest={showBest}
                        />
                    </Card>
                    : <VoidData />
                }
            </Grid>

            {showBest  && <Grid xs={24} md={12} lg={12}>
                <Responsive gutter={[16, 16]}>
                    <Grid xs={24} md={24} lg={showBarChart ? 12 : 24}>
                        {!isLoading
                            ? assignments && assignments?.length > 0 && <Card title='Status des devoirs' size='small'>
                                <ShapePieChart
                                    data={pieData as []}
                                    minHeight={290}
                                    height={290}
                                    innerRadius={50}
                                    outerRadius={80}
                                    hasLegend={hasLegend}
                                />
                            </Card>
                            : <CardSkeleton title='Status des devoirs' />
                        }
                    </Grid>
                    {!isLoading
                        ? assignments && assignments?.length > 0 && showBarChart && (<Grid xs={24} md={24} lg={12}>
                            {showBarChart && <Card title='Status des matières' size='small'>
                                <BarChart
                                    data={barData as []}
                                    dataKey={['valeur']}
                                    legend='matiere'
                                    minHeight={290}
                                    height={290}
                                    layout={barLayout}
                                />
                            </Card>}
                        </Grid>)
                        : (<Grid xs={24} md={24} lg={12}>
                            <CardSkeleton title='Status des matières' />
                        </Grid>)
                    }
                    {studentAllScore && <Grid xs={24} md={24} lg={24}>
                        <Card size='small' title={listTitle} bordered={false}>
                            {<ScoreItem
                                scores={studentAllScore as Score[]}
                                isLoading={scoreLoading ?? false}
                                scoreSize={5}
                                allScores={5}
                                infinite={false}
                                height={300}
                                isTable={true}
                            />}
                        </Card>
                    </Grid>}
                </Responsive>
            </Grid>}

            <Grid xs={24} md={!showBest ? 24 : 12} lg={!showBest ? 24 : 12}>
                <Responsive gutter={[16, 16]}>
                    {assignment.current && <Grid xs={24} md={!showBest ? 12 : 24} lg={!showBest ? 12 : 24}>
                        <AssignmentViewDesc
                            assignment={assignment.current}
                            title={`Prochain devoirs ${timeDiff}`}
                            show={true}
                            showBest={showBest}
                            onlyMark={onlyMark}
                            scoreSize={scoreSize}
                        />
                    </Grid>}
                    {passedAssignment.current && <Grid xs={24} md={!showBest ? 12 : 24} lg={!showBest ? 12 : 24}>
                        <AssignmentViewDesc
                            assignment={passedAssignment.current}
                            title={`Dernier devoir terminé`}
                            show={true}
                            showBest={showBest}
                            onlyMark={onlyMark}
                            scoreSize={scoreSize}
                        />
                    </Grid>}
                </Responsive>
            </Grid>
        </Responsive>
        </>
    )
}