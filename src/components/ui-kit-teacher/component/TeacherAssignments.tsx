import {CalendarEvent, EventProps, InfoPageProps} from "../../../utils/interfaces.ts";
import {Score, Teacher} from "../../../entity";
import TabItem from "../../view/TabItem.tsx";
import {Button, Card, Descriptions, Modal, Select, Space, Tag, Tooltip} from "antd";
import {useEffect, useMemo, useRef, useState} from "react";
import {getAllTeacherAssignments, getAllTeacherCourseAssignments} from "../../../data/request";
import {useFetch} from "../../../hooks/useFetch.ts";
import {Assignment} from "../../../entity/domain/assignment.ts";
import Responsive from "../../ui/layout/Responsive.tsx";
import Grid from "../../ui/layout/Grid.tsx";
import VoidData from "../../view/VoidData.tsx";
import {IconText} from "../../../utils/tsxUtils.tsx";
import {LuCalendarDays, LuClock, LuClock9, LuRefreshCcw, LuX} from "react-icons/lu";
import {
    arrayToDate,
    dateCompare,
    fDate,
    fDatetime,
    getDiffFromNow,
    setDayJsDate,
    setName,
    setTime
} from "../../../utils/utils.ts";
import {DescriptionsItemType} from "antd/es/descriptions";
import dayjs from "dayjs";
import {BigCalendar} from "../../graph/BigCalendar.tsx";
import {AssignmentScores} from "../../ui/layout/AssignmentScores.tsx";
import {ShapePieChart} from "../../graph/ShapePieChart.tsx";
import {getBestStudentByScore, getBestStudentBySubjectScore} from "../../../data/repository/scoreRepository.ts";
import {ScoreItem} from "../../ui/layout/ScoreItem.tsx";

const getNextAssignment = (assignments: Assignment[] | null): Assignment | null => {
    const now = dayjs()
    if (assignments) {
        const upcomingAssignment = assignments.filter(a => setDayJsDate(a.examDate)?.isAfter(now))
        upcomingAssignment.sort((a, b) => setDayJsDate(a.examDate)?.isBefore(setDayJsDate(b.examDate)) ? -1 : 1)
        return upcomingAssignment?.length > 0 ? upcomingAssignment[0] : null
    }
    return null
}

const getLastPassedAssignment = (assignments: Assignment[] | null): Assignment | null => {
    if (assignments) {
        const passedAssignments = assignments.filter((assignment) => assignment.passed);
        passedAssignments.sort((a, b) =>setDayJsDate(b.examDate)?.isBefore(setDayJsDate(a.examDate)) ? -1 : 1);
        return passedAssignments?.length > 0 ? passedAssignments[0] : null
    }
    return null
}

export const TeacherAssignments = ({infoData}: InfoPageProps<Teacher>) => {
    const {personalInfo, courses, classes} = infoData

    const [assignments, setAssignments] = useState<Assignment[] | null>(null)
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
    const [subjectValue, setSubjectValue] = useState<number | null>(courses && courses?.length > 0 ? courses[0].id as number : null)
    const [classeValue, setClasseValue] = useState<number>(classes && classes?.length > 0 ? classes[0].id as number : 0)
    const [scoreSize, setScoreSize] = useState<number>(5)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [studentAllScore, setStudentAllScore] = useState<Score[] | null>(null)
    const assignment = useRef<Assignment | null>()
    const passedAssignment = useRef<Assignment | null>()
    const courseExists: boolean = courses && courses?.length > 0 || false

    const dataFetchFnc = courseExists ? getAllTeacherCourseAssignments : getAllTeacherAssignments
    const bestScoreFnc = courseExists ? getBestStudentBySubjectScore : getBestStudentByScore

    const {data, isSuccess, refetch} = useFetch<Assignment, unknown>('assignment-list', dataFetchFnc, [personalInfo.id, {
        classId: classeValue,
        courseId: subjectValue
    }])

    const {data: scoreData, isSuccess: scoreFetched, isLoading: scoreLoading} = useFetch<Score, unknown>('student-score', bestScoreFnc, [personalInfo?.id, subjectValue], {
        queryKey: ['student-score'],
        enabled: assignments !== null && assignments.length > 0
    })

    const subjects = useMemo(() => {
        return courses?.map(c => ({
            value: c.id, label: c.course
        }))
    }, [courses])

    const classrooms = useMemo(() => {
        return classes?.map(c => ({
            value: c.id, label: c.name
        }))
    }, [classes])

    useEffect(() => {
        if(subjectValue || classeValue) {
            refetch().then(r => r.data)
        }
        if (isSuccess) {
            setAssignments(data as Assignment[])
        }
        if (scoreFetched) {
            setStudentAllScore(scoreData as Score[])
        }
    }, [classeValue, data, isSuccess, refetch, scoreData, scoreFetched, subjectValue]);

    const assignmentDesc = (a: Assignment, show?: boolean, plus?: boolean): DescriptionsItemType[] => {
        return [
            ...(show ? [{key: 6, label: 'Titre', children: a?.examName, span: 3}] : []),
            ...(a?.semester?.semester ? [{key: 1, label: 'Semestre', children: a?.semester?.semester?.semesterName, span: 3}] : []),
            ...(a?.exam?.examType ? [{key: 2, label: 'Devoir comptant pour', children: a?.exam?.examType?.name, span: 3}] : []),
            ...(a && plus ? [{key: 7, label: undefined, children: <IconText color='#8f96a3' icon={<LuCalendarDays />} text={fDate(a?.examDate, 'D MMM YYYY') as string} key="1" />}]: []),
            ...(a && plus ? [{key: 8, label: undefined, children: <IconText color='#8f96a3' icon={<LuClock />} text={setTime(a?.startTime as []) as string} key="2" />}]: []),
            ...(a && plus ? [{key: 9, label: undefined, children: <IconText color='#8f96a3' icon={<LuClock9 />} text={setTime(a?.endTime as []) as string} key="3" />}]: []),
            {key: 4, label: 'Status', children: <div>
                    <Tag color={!a?.passed ? 'gold': 'green'}>{!a?.passed ? 'A venir' : 'Accompli'}</Tag>
                    {a?.passed ? undefined : !dateCompare(a?.examDate as Date) ? <Tag color='red'>Date dépassée</Tag> : undefined}
                </div>, span: 3},
            ...(a?.preparedBy ? [
                {key: 3, label: 'Préparer par', children: <span>{setName(a?.preparedBy?.lastName, a?.preparedBy?.firstName)}</span>, span: 3},
                {key: 5, label: 'Créer le', children: <span>{fDatetime(a?.addedDate)}</span>, span: 3}
            ] : []),

            ...(
                a?.passed ? [] : dateCompare(a?.examDate as Date) ? [] : [{key: 5, children: <Space.Compact block>
                    <Tooltip title="Supprimer">
                        <Button icon={<LuX />} />
                    </Tooltip>
                    <Tooltip title="Changer de date">
                        <Button icon={<LuRefreshCcw />} />
                    </Tooltip>
                </Space.Compact>}]
            )
        ]
    }

    const eventData: CalendarEvent = assignments?.map(assignment => ({
        title: assignment.examName,
        start: arrayToDate(assignment?.examDate as number[], assignment?.startTime as number[]),
        end: arrayToDate(assignment?.examDate as number[], assignment?.endTime as number[]),
        allDay: false,
        resource: assignment
    }))

    const pieData = [
        {name: 'A venir', value: assignments?.filter(a => !a.passed && dateCompare(a?.examDate as Date))?.length, color: '#DAA520'},
        {name: 'Accompli', value: assignments?.filter(a => a.passed)?.length, color: '#228B22'},
        {name: 'Date dépassé', value: assignments?.filter(a => !a.passed && !dateCompare(a?.examDate as Date))?.length, color: '#B22222'}
    ]

    console.log('Scores: ', studentAllScore)

    assignment.current = getNextAssignment(assignments)
    passedAssignment.current = getLastPassedAssignment(assignments)

    const days = getDiffFromNow(assignment.current?.examDate as [number, number, number], 'day', assignment?.current?.startTime as [number, number])
    const hours = getDiffFromNow(assignment.current?.examDate as [number, number, number], 'hour', assignment?.current?.startTime as [number, number])
    const minutes = getDiffFromNow(assignment.current?.examDate as [number, number, number], 'minute', assignment?.current?.startTime as [number, number])
    const timeDiff: string =  days && days > 0
        ? `dans ${days} jour${days > 1 ? 's': ''}`
        : hours && hours > 0 ? `dans ${hours} heure${hours > 1 ? 's': ''}`
        : minutes && minutes > 0 ? `dans ${minutes} heure${minutes > 1 ? 's': ''}`: "à l'instant"

    const handleClasseValue = (value: number) => {
        setClasseValue(prev => prev === value ? prev : value)
    }

    const handleSubjectValue = (value: number) => {
        setSubjectValue(prev => prev === value ? prev : value)
    }

    function onEventSelected(event: EventProps) {
        setIsModalOpen(true)
        setSelectedAssignment(event.resource as Assignment)
    }

    function onModalCancel() {
        setIsModalOpen(false)
        setScoreSize(prev => prev > 5 ? 5 : prev)
    }

    return (
        <>
        <TabItem
            title={`Devoirs preparé par ${personalInfo?.lastName}`}
            selects={[
                courses && courses?.length > 0 && (<Select
                    className='select-control'
                    defaultValue={subjectValue}
                    options={subjects}
                    onChange={handleSubjectValue}
                    variant='borderless'
                />),
                <Select
                    className='select-control'
                    defaultValue={classeValue}
                    options={classrooms}
                    onChange={handleClasseValue}
                    variant='borderless'
                />
                //TODO Adding the filtre by semester
            ]}
            items={[
                {
                    key: 'assignment-list',
                    label: 'Liste de devoirs',
                    children: <Responsive gutter={[16, 16]} style={{padding: '0 20px 20px 20px'}}>
                        <Grid xs={24} md={24} lg={24}>
                            {assignments && assignments.length > 0 ? <Card>
                                <BigCalendar
                                    styles={{height: 450}}
                                    data={eventData as []}
                                    views={['month']}
                                    defaultView='month'
                                    onSelectEvent={onEventSelected}
                                    showNavButton
                                />
                            </Card> : <VoidData />}
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
                        <Grid xs={24} md={12} lg={12}>
                            <Responsive gutter={[16, 16]}>
                                {assignments && assignments?.length > 0 && <Grid xs={24} md={24} lg={24}>
                                    <Card title='Status des devoirs' size='small'>
                                        <ShapePieChart data={pieData as []} height={270} innerRadius={50} />
                                    </Card>
                                </Grid>}
                                {assignments && assignments?.length > 0 && studentAllScore && <Grid xs={24} md={24} lg={24}>
                                    <Card size='small' title={`Les meilleurs apprenants de ${personalInfo?.lastName}`}>
                                        <ScoreItem
                                            scores={studentAllScore as Score[]}
                                            isLoading={scoreLoading}
                                            scoreSize={5}
                                            allScores={5}
                                            infinite={false}
                                            height={300}
                                        />
                                    </Card>
                                </Grid>}
                            </Responsive>
                        </Grid>
                    </Responsive>
                }
            ]}
        />
        {/* TODO Adding the link to assignment view on the title */}
        <Modal title={selectedAssignment?.examName} open={isModalOpen} footer={null} onCancel={onModalCancel} destroyOnClose>
            <Card>
                <Descriptions items={assignmentDesc(selectedAssignment as Assignment, false, true)} />
                {selectedAssignment?.passed ? <AssignmentScores assignment={selectedAssignment} size={scoreSize} /> : undefined}
            </Card>
        </Modal>
        </>
    )
}