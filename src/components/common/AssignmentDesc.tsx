import Responsive from "../ui/layout/Responsive.tsx";
import Grid from "../ui/layout/Grid.tsx";
import {Button, Card, Descriptions, Modal, Space, Tag, Tooltip} from "antd";
import {BigCalendar} from "../graph/BigCalendar.tsx";
import VoidData from "../view/VoidData.tsx";
import {ShapePieChart} from "../graph/ShapePieChart.tsx";
import {Assignment} from "../../entity";
import {AssignmentScores} from "../ui/layout/AssignmentScores.tsx";
import {CalendarEvent, EventProps} from "../../utils/interfaces.ts";
import {
    dateCompare,
    getDiffFromNow,
    setName,
    setTime
} from "../../utils/utils.ts";
import {ReactNode, useEffect, useLayoutEffect, useRef, useState} from "react";
import {Score} from "../../entity";
import {DescriptionsItemType} from "antd/es/descriptions";
import {IconText} from "../../utils/tsxUtils.tsx";
import {LuCalendarDays, LuClock, LuClock9, LuRefreshCcw, LuX} from "react-icons/lu";
import dayjs from "dayjs";
import {ScoreItem} from "../ui/layout/ScoreItem.tsx";
import {BarChart} from "../graph/BarChart.tsx";
import {useRawFetch} from "../../hooks/useFetch.ts";
import {removeAssignment} from "../../data/repository/assignmentRepository.ts";
import FormSuccess from "../ui/form/FormSuccess.tsx";
import {ModalConfirmButton} from "../ui/layout/ModalConfirmButton.tsx";
import {useToggle} from "../../hooks/useToggle.ts";
import {UpdateAssignmentDates} from "../ui-kit-exam";
import Datetime from "../../core/datetime.ts";

interface AssignmentDescProps {
    assignments: Assignment[] | null
    listTitle: string | ReactNode
    studentAllScore?: Score[] | null
    scoreLoading?: boolean
    hasLegend?: boolean
    showBarChart?: boolean
    barLayout?: 'horizontal' | 'vertical'
    setRefetch?: (refetch: boolean) => void
    refetch?: boolean
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
    {assignments, listTitle, studentAllScore, setRefetch, refetch, scoreLoading, hasLegend = true, showBarChart = false, barLayout = 'vertical'}: AssignmentDescProps
) => {

    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [scoreSize, setScoreSize] = useState<number>(5)
    const [wasDeleted, setWasDeleted] = useState<Record<string, boolean>>({})
    const [wasUpdated, setWasUpdated] = useState<Record<string, boolean>>({})
    const [openUpdater, setUpdater] = useToggle(false)
    const assignment = useRef<Assignment | null>()
    const passedAssignment = useRef<Assignment | null>()

    const remove = useRawFetch<Record<string, boolean>>()

    const handleRemoveAssignment = (assignmentId?: bigint) => {
        remove(removeAssignment, [assignmentId])
            .then(resp => {
                if (resp.isSuccess) {
                    setWasDeleted(resp.data as Record<string, boolean>)
                }
            })
    }
    
    useEffect(() => {
        if (wasDeleted?.status || wasUpdated?.updated) {
            setIsModalOpen(false)
            if (setRefetch) {
                setRefetch(true)
            }
        }
    }, [setRefetch, wasDeleted?.status, wasUpdated?.updated])

    useLayoutEffect(() => {
        if (refetch) {
            setRefetch && setRefetch(refetch)
        }
    }, [refetch, setRefetch])

    const assignmentDesc = (a: Assignment, show?: boolean, plus?: boolean): DescriptionsItemType[] => {
        console.log("assignmentDesc", a)
        return [
            ...(show ? [{key: 1, label: 'Titre', children: a?.examName, span: 3}] : []),
            ...(a?.semester?.semester ? [{key: 2, label: 'Semestre', children: a?.semester?.semester?.semesterName, span: 3}] : []),
            ...(a?.exam?.examType ? [{key: 3, label: 'Examen', children: a?.exam?.examType?.name, span: 3}] : []),
            ...(a && plus ? [{key: 5, label: undefined, children: <IconText color='#8f96a3' icon={<LuCalendarDays />} text={Datetime.of(a?.examDate as number[]).fDate('D MMM YYYY') as string} key="1" />}]: []),
            ...(a && plus ? [{key: 6, label: undefined, children: <IconText color='#8f96a3' icon={<LuClock />} text={setTime(a?.startTime as []) as string} key="2" />}]: []),
            ...(a && plus ? [{key: 7, label: undefined, children: <IconText color='#8f96a3' icon={<LuClock9 />} text={setTime(a?.endTime as []) as string} key="3" />}]: []),
            {key: 8, label: 'Status', children: <div>
                    <Tag color={!a?.passed ? 'gold': 'green'}>{!a?.passed ? 'A venir' : 'Accompli'}</Tag>
                    {a?.passed ? undefined : !dateCompare(a?.examDate as Date) ? <Tag color='red'>Date dépassée</Tag> : undefined}
                </div>, span: 3},
            ...(a?.preparedBy ? [
                {key: 9, label: 'Préparer par', children: <span>{setName(a?.preparedBy?.lastName, a?.preparedBy?.firstName)}</span>, span: 3},
                {key: 10, label: 'Mise à jour', children: <span>{Datetime.of(a?.updatedDate as number).fDatetime()}</span>, span: 3}
            ] : []),

            ...(
                a?.passed ? [] : dateCompare(a?.examDate as Date) ? [] : [{key: 11, children: <Space.Compact block>
                        <ModalConfirmButton handleFunc={handleRemoveAssignment} funcParam={a?.id} btnTxt={<LuX />} />
                        <Tooltip title="Changer de date"> {/* TODO Gérer les boutons supprimer et changer de date */}
                            <Button onClick={setUpdater} icon={<LuRefreshCcw />} />
                        </Tooltip>
                </Space.Compact>}]
            )
        ]
    }

    const eventData: CalendarEvent = assignment ? assignments?.map(assignment => ({
        title: assignment.examName,
        start: Datetime.of(assignment?.examDate as number[]).timeToDatetime(assignment?.startTime as number[]).toDate(),
        end: Datetime.of(assignment?.examDate as number[]).timeToDatetime(assignment?.endTime as number[]).toDate(),
        allDay: false,
        resource: assignment
    })): []

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

    function getBarData(): {
        matiere: string;
        valeur: number;
    }[] {
        const subjectCount: { [key: string]: number } | null = assignments && assignments?.reduce((acc: Record<string, number>, exam) => {
            const subject = exam?.subject?.abbr; // Get the subject abbreviation
            if (acc[subject as string]) {
                acc[subject as string] += 1; // Increment the count for the subject
            } else {
                acc[subject as string] = 1; // Initialize count for the subject
            }
            return acc;
        }, {});

        // Convert the object to the desired format
        return subjectCount ? Object.keys(subjectCount!)?.map(key => ({
            matiere: key,
            valeur: subjectCount ? subjectCount[key] : 0,
        })) : [];
    }

    const barData = getBarData()

    function onEventSelected(event: EventProps) {
        setIsModalOpen(true)
        setSelectedAssignment(event.resource as Assignment)
    }

    function onModalCancel() {
        setIsModalOpen(false)
        setScoreSize(prev => prev > 5 ? 5 : prev)
    }

    return(
        <>
            {wasDeleted?.status && <FormSuccess message='Evaluation Supprimer avec succès' />}
            <Responsive gutter={[16, 16]} style={{padding: '0 20px 20px 20px'}}>
            <Grid xs={24} md={24} lg={24}>
                {assignments && assignments.length > 0 ? <Card>
                    <BigCalendar
                        styles={{height: 450}}
                        data={eventData as []}
                        views={['month', 'week']}
                        defaultView='month'
                        onSelectEvent={onEventSelected}
                        showNavButton
                    />
                </Card> : <VoidData />}
            </Grid>
            <Grid xs={24} md={12} lg={12}>
                <Responsive gutter={[16, 16]}>
                    <Grid xs={24} md={24} lg={showBarChart ? 12 : 24}>
                        {assignments && assignments?.length > 0 && <Card title='Status des devoirs' size='small'>
                            <ShapePieChart
                                data={pieData as []}
                                minHeight={290}
                                height={290}
                                innerRadius={50}
                                outerRadius={80}
                                hasLegend={hasLegend}
                            />
                        </Card>}
                    </Grid>
                    {showBarChart  && <Grid xs={24} md={24} lg={12}>
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
                    </Grid>}
                    {assignments && assignments?.length > 0 && studentAllScore && <Grid xs={24} md={24} lg={24}>
                        <Card size='small' title={listTitle} bordered={false}>
                            {<ScoreItem
                                scores={studentAllScore as Score[]}
                                isLoading={scoreLoading ?? false}
                                scoreSize={5}
                                allScores={5}
                                infinite={false}
                                height={300}
                            />}
                        </Card>
                    </Grid>}
                </Responsive>
            </Grid>
            <Grid xs={24} md={12} lg={12}>
                <Responsive gutter={[16, 16]}>
                    {assignment.current && <Grid xs={24} md={24} lg={24}>
                        <Card>
                            <Descriptions
                                title={`Prochain devoirs ${timeDiff}`}
                                items={assignmentDesc(assignment.current as Assignment, true)}
                            />
                        </Card>
                    </Grid>}
                    {passedAssignment.current && <Grid xs={24} md={24} lg={24}>
                        <Card>
                            <Descriptions
                                title={`Dernier devoir terminé`}
                                items={assignmentDesc(passedAssignment.current as Assignment, true)}
                            />
                            <AssignmentScores assignment={passedAssignment.current} />
                        </Card>
                    </Grid>}
                </Responsive>
            </Grid>
        </Responsive>
            {/* TODO Adding the link to assignment view on the title */}
            <Modal title={selectedAssignment?.examName} open={isModalOpen} footer={null} onCancel={onModalCancel} destroyOnClose>
                <Card>
                    <Descriptions items={assignmentDesc(selectedAssignment as Assignment, false, true)} />
                    {selectedAssignment?.passed ? <AssignmentScores assignment={selectedAssignment} size={scoreSize} /> : undefined}
                </Card>
            </Modal>
            <UpdateAssignmentDates assignment={selectedAssignment} open={openUpdater} onCancel={setUpdater} resp={setWasUpdated} />
        </>
    )
}