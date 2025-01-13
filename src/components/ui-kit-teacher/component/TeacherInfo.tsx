import Section from "../../ui/layout/Section.tsx";
import Block from "../../view/Block.tsx";
import PanelSection from "../../ui/layout/PanelSection.tsx";
import PanelTable from "../../ui/layout/PanelTable.tsx";
import {CalendarEvent, CountType, InfoPageProps, ReprimandData} from "../../../utils/interfaces.ts";
import {Classe, Course, Department, Schedule, Score, Teacher} from "../../../entity";
import {
    fDate,
    firstLetter,
    getAge,
    getCountry,
    getDistinctArray,
    isNull,
    lowerName,
    setName, setTime,
    timeToCurrentDatetime
} from "../../../utils/utils.ts";
import {useEffect, useRef, useState} from "react";
import {Gender} from "../../../entity/enums/gender.tsx";
import {Flag} from "../../ui/layout/Flag.tsx";
import {Flex, List, Skeleton, TableColumnsType, Tag, TimelineProps, Typography} from "antd";
import {useFetch, useRawFetch} from "../../../hooks/useFetch.ts";
import {getNumberOfStudentTaughtByClasse, getTeacherScheduleByDay} from "../../../data/repository/teacherRepository.ts";
import {BigCalendar} from "../../graph/BigCalendar.tsx";
import {getPrimaryDepartment} from "../../../data/repository/departmentRepository.ts";
import {AvatarTitle} from "../../ui/layout/AvatarTitle.tsx";
import {BarChart} from "../../graph/BarChart.tsx";
import {getAllTeacherMarks} from "../../../data/repository/scoreRepository.ts";
import {Timeline} from "../../graph/Timeline.tsx";
import {AiFillClockCircle} from "react-icons/ai";
import {getSomeStudentReprimandedByTeacher} from "../../../data/repository/reprimandRepository.ts";
import {Reprimand} from "../../../entity/domain/reprimand.ts";
import {Table as CustomTable} from "../../ui/layout/Table.tsx";
import {ReprimandType} from "../../../entity/enums/reprimandType.ts";
import {ShapePieChart} from "../../graph/ShapePieChart.tsx";
import {PieChartDataEntry} from "../../ui/ui_interfaces.ts";
import {Assignment} from "../../../entity/domain/assignment.ts";
import {getSomeTeacherAssignments} from "../../../data/repository/assignmentRepository.ts";
import {IconText} from "../../../utils/tsxUtils.tsx";
import {LuCalendarDays, LuClock, LuClock9} from "react-icons/lu";
import {useGlobalStore} from "../../../core/global/store.ts";

type TeacherInfo = InfoPageProps<Teacher>

const IndividualInfo = ({infoData, color}: TeacherInfo) => {

    const [nation, setNation] = useState<string>()
    
    const {personalInfo, personalInfo: {address}} = infoData ?? {}

    const country = getCountry(personalInfo?.nationality as string)

    const informationData = [
        {statement: 'Nom complet', response: setName(personalInfo?.lastName, personalInfo?.firstName, personalInfo?.maidenName, true)},
        {statement: 'Genre', response: Gender[personalInfo?.gender as unknown as keyof typeof Gender]},
        {statement: 'Date de naissance', response: `${fDate(personalInfo?.birthDate)} (${getAge(personalInfo?.birthDate as number[])} ans)`},
        {statement: 'Lieu de naissance', response: firstLetter(personalInfo?.birthCity)},
        {statement: 'Pays de naissance', response: <div className='country__flag'>
                {firstLetter(country?.altSpellings[1])}&nbsp;<Flag media={country?.cca2} desc='Country Flag' size='small'/>
        </div>},
        {statement: 'Nationalité', response: firstLetter(nation)},
    ]

    const addressData = [
        {statement: 'Numéro', response: address?.number},
        {statement: 'Rue', response: address?.street},
        {statement: 'Quartier', response: address?.neighborhood},
        ...(!isNull(address?.borough) ? [{
            statement: 'Arrondissement',
            response: address?.borough
        }] : []),
        {statement: 'Ville', response: address?.city}
    ]

    const cordData = [
        {statement: 'Téléphone', response: personalInfo?.telephone},
        ...(isNull(personalInfo?.mobile) ? [] : [{statement: 'Mobile', response: personalInfo?.mobile}]),
        ...(isNull(personalInfo?.emailId) ? [] : [{statement: '@', response: personalInfo?.emailId}])
    ]

    useEffect(() => {
        if (infoData && country && personalInfo?.gender === Gender.FEMME) {
            setNation(country?.demonyms.fra.f)
        } else {
            setNation(country?.demonyms.fra.m)
        }
    }, [country, infoData, personalInfo?.gender]);


    return(
        <PanelSection title={
            <div className='name__title'>
                <h2 className='name'>{`${personalInfo?.firstName} ${personalInfo?.lastName}`}</h2>
                <p className='subtitle'>Informations Générales sur l'enseignant</p>
            </div>
        }>
            <PanelTable title='Données personnelles' panelColor={color} data={informationData} />
            <PanelTable title='Adresse' data={addressData} panelColor={color}/>
            <PanelTable title='Coordonnées' data={cordData} panelColor={color}/>
        </PanelSection>
    )
}

const ProsInfo = ({infoData, color}: TeacherInfo) => {

    const {courses, classes, salaryByHour, hireDate} = infoData

    const employmentData = [
        //TODO adding prof job id {incorporating reference in personalInfo} and position in the database
        {statement: 'ID', response: "1"},
        {statement: 'Position', response: "Professeur de Collège"},
        {statement: 'Date d\'Embauche', response: fDate(hireDate)},
        {statement: 'Ancienneté', response: getAge(hireDate as number[]) + ' ans'},
        {statement: 'Salaire par heure', response: salaryByHour}
    ]

    const courseTaught = [
        {response: <Flex wrap gap={.5}>
                {courses?.map((c: Course, i) => <Tag key={i}>{c.abbr}</Tag>)}
        </Flex>}
    ]

    const classeTaught = [
        {response: <Flex wrap gap={.5}>
                {classes?.map((c: Classe, i) => <Tag key={i}>{c.name}</Tag>)}
        </Flex>}
    ]

    return(
        <PanelSection title="Informations Professionnelles">
            <PanelTable title='Position' data={employmentData} panelColor={color}/>
            {courses && courses?.length > 0 ? <PanelTable title='Cours' data={courseTaught} panelColor={color}/> : undefined}
            {classes && classes?.length > 0 ? <PanelTable title='Classes' data={classeTaught} panelColor={color}/> : undefined}
        </PanelSection>
    )
}

const CalendarSection = ({infoData, seeMore}: TeacherInfo) => {

    const [schedules, setSchedules] = useState<Schedule[] | undefined>()
    const allDay = useRef<boolean>(!(infoData?.courses && infoData?.courses?.length > 0));
    const fetch = useRawFetch()

    useEffect(() => {
        fetch(getTeacherScheduleByDay, [infoData.id, allDay.current])
            .then(response => setSchedules(response.data as Schedule[]))
    }, [infoData, fetch]);

    const events: CalendarEvent = schedules && schedules.map((s: Schedule) => ({
        allDay: false,
        title: `${s?.classe?.name} - ${s.designation}`,
        start: s.startTime ? timeToCurrentDatetime(s.startTime) : new Date(),
        end: s.endTime ? timeToCurrentDatetime(s.endTime): new Date()
    })) as CalendarEvent

    const handleClick = () => {
        seeMore && seeMore('1')
    }

    return(
        <Section title='Informations sur l’emploi du temps' more={true} seeMore={handleClick}>
            <BigCalendar data={events as []} views={['day']} defaultView='day' />
        </Section>
    )
}

const MarkMean = ({infoData, color}: TeacherInfo) => {
    const [marks, setMarks] = useState<number[]>([])
    const {data: fetchedMarks, isLoading} = useFetch(['teacher-marks'], getAllTeacherMarks, [infoData?.personalInfo?.id])

    useEffect(() => {
        if (fetchedMarks) {
            const newMarks = fetchedMarks?.map((s: Score) => s.obtainedMark)
            setMarks(newMarks)
        }
    }, [fetchedMarks]);

    if (marks.length === 0) {
        setMarks([10, 6, 8, 16, 8,5,3,1, 0,9, 19, 13, 16, 15, 20,9, 20,10, 10, 8, 12, 13, 12, 10, 7, 10, 11, 14, 15,12, 17])
    }

    const filter = (min: number, max: number) => {
        const count = marks.filter((mark, index) =>
            index === 0 ? mark >= min && mark <= max : mark > min && mark <= max
        ).length;
        return Math.round(((count / marks.length) * 100))
    }

    const histogramData = [
        { range: "0-5", pourcentage: filter(0, 5) },
        { range: "6-10", pourcentage: filter(5, 10) },
        { range: "11-15", pourcentage: filter(10, 15) },
        { range: "16-20", pourcentage: filter(15, 20) },
    ];

    return(
        <Section title='Moyenne des notes'>
            {isLoading && <Skeleton active={isLoading} />}
            <BarChart
                data={histogramData}
                dataKey={['pourcentage']}
                legend='range'
                color={color}
                minHeight={300}
                isPercent
            />
        </Section>
    )
}

const DepartmentInfo = ({infoData, color}: TeacherInfo) => {

    const [departments, setDepartments] = useState<Department[] | undefined>()
    //TODO the value of the primary department code should be in the settings
    const primaryDepartmentCode = useGlobalStore.use.primaryDepartment()
    const primary = useRef<string | undefined>(primaryDepartmentCode)
    const fetch = useRawFetch()

    useEffect(() => {
        if (infoData.courses && infoData.courses?.length !== 0) {
            const deps: Department[] = Array.from(
                new Set(infoData.courses?.map((course) => course.department))
            ) as Department[]
            setDepartments(getDistinctArray<Department>(deps, (dep: Department) => dep?.id))
        }else {
            fetch(getPrimaryDepartment, [primary.current])
                .then(response => setDepartments([response.data] as Department[]))
        }
    }, [infoData.courses, fetch]);

    return(
        <>
            {departments?.map((department: Department, index) => (
                <PanelSection key={index} title={`Membre du Department ${department.code}`}>
                    <PanelTable title='Organisation Departementale' data={[
                        {statement: 'Department', response: department.name},
                        {statement: 'Code', response: department.code},
                    ]} panelColor={color} />
                    <PanelTable title='Chef de department' data={[
                        {statement: 'Nom(s), prénom(s)', response: <Flex justify='center'>
                                <AvatarTitle
                                    lastName={department?.boss?.d_boss?.personalInfo?.lastName}
                                    firstName={department?.boss?.d_boss?.personalInfo?.firstName}
                                    image={department?.boss?.d_boss?.personalInfo?.image}
                                    gap={2} size={30}
                                />
                        </Flex>, link: `/teachers/${department.boss?.d_boss?.id}`},
                        {statement: 'Debut de mandat', response: <span>{fDate(department.boss?.startPeriod, 'DD/MM/YYYY')}</span>},
                        {
                            statement: 'Status',
                            response: <Tag color='success'>Mandat en cours</Tag>
                        }
                    ]} panelColor={color}/>
                    {department?.purpose ? <PanelTable title='Objectif' panelColor={color} data={[
                        {response: <Typography.Text>{department?.purpose}</Typography.Text>}
                    ]} /> : null}
                </PanelSection>
            ))}
        </>
    )
}

const LessonPlan = ({infoData, color, seeMore}: TeacherInfo) => {

    const {courseProgram} = infoData

    const items: TimelineProps['items'] = courseProgram
        ? [...courseProgram].reverse().map(t => ({
            color: t.active ? 'green' : undefined,
            dot: t.active ? <AiFillClockCircle /> : undefined,
            children: `${t.classe.name} - ${t.topic}`
        }))
        : [];

    const handleClick = () => {
        seeMore && seeMore('2')
    }

    return(
        <PanelSection title='Plans de cours' more={true} seeMore={handleClick}>
            <PanelTable title='Année 2024-2025' data={items.length > 0 ? [
                {response: <Timeline mode='alternate' items={items} rootClassName='timeline' />, tableRow: true}
            ]: []} panelColor={color} />
        </PanelSection>
    )
}

const StudentReprimanded = ({infoData, color, seeMore}: TeacherInfo) => {
    const {personalInfo} = infoData

    const [studentReprimanded, setStudentReprimanded] = useState<Reprimand[]>([])
    const fetch = useRawFetch();

    useEffect(() => {
        fetch(getSomeStudentReprimandedByTeacher, [personalInfo?.id])
            .then(resp => {
                if(resp.success) {
                    setStudentReprimanded(resp.data as Reprimand[])
                }
            })
    }, [fetch, personalInfo?.id]);

    const dataSource = studentReprimanded?.map(r => ({
        key: r.id,
        studentId: r.student?.student?.id,
        studentName: `${lowerName(r.student?.student?.personalInfo?.firstName, r.student?.student?.personalInfo?.lastName, 15)}`,
        reprimandType: r.type,
        punishmentDates: `${fDate(r.punishment?.startDate, 'DD/MM/YYYY')} à ${fDate(r.punishment?.endDate, 'DD/MM/YYYY')}`,
        studentClasse: r.student?.classe?.name,
        studentSection: r.student?.classe?.grade?.section
    })) as []

    const columns: TableColumnsType<ReprimandData> = [
        {
            title: "Apprenant",
            dataIndex: "studentName",
            key: "studentName",
        },
        {
            title: "Classe",
            dataIndex: "studentClasse",
            key: "className",
            align: 'center',
            render: text => (
                    <Tag>{text}</Tag>
            ),
        },
        {
            title: "Réprimande",
            dataIndex: "reprimandType",
            key: "reprimandType",
            align: 'center',
            render: text => (
                <Tag color="volcano">{ReprimandType[text as unknown as keyof typeof ReprimandType]}</Tag>
            ),
        },
    ];

    const handleClick = () => {
        seeMore && seeMore('4')
    }

    return(
        <Section title='Liste des élèves réprimandé' more={true} seeMore={handleClick}>
          <CustomTable tableProps={{
              size: 'small',
              columns: columns as [],
              dataSource: dataSource,
              pagination: false
          }} color={color} />
        </Section>
    )
}

const StudentByClasse = ({infoData, color}: TeacherInfo) => {
    const [countFetched, setCountFetched] = useState<CountType[]>([])
    const fetch = useRawFetch();

    useEffect(() => {
        fetch(getNumberOfStudentTaughtByClasse, [infoData.id])
            .then(resp => {
                if (resp.isSuccess) {
                    setCountFetched(resp.data as CountType[])
                }
            })
    }, [infoData.id, fetch]);

    const entryData: PieChartDataEntry[] = countFetched?.map(c => ({
        name: c.classe,
        value: c.count
    }))

    return(
        <Section title="Nombre d'élève enseignés par classe">
            <ShapePieChart
                data={entryData}
                defaultColor={color}
                height={300}
                innerRadius={50}
                outerRadius={90}
            />
        </Section>
    )
}

const AssignmentPlan = ({infoData,color, seeMore}: TeacherInfo) => {
    const {personalInfo} = infoData
    
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const fetch = useRawFetch();

    useEffect(() => {
        fetch(getSomeTeacherAssignments, [personalInfo.id])
            .then(resp => {
                if (resp.isSuccess) {
                    setAssignments(resp.data as Assignment[])
                }
            })
    }, [fetch, personalInfo.id]);

    const handleClick = () => {
        seeMore && seeMore('3')
    }
    
    return(
        <PanelSection title='Suivi des devoirs' more={true} seeMore={handleClick}>
            <PanelTable title='Les devoirs à venir' ps={true} data={[{
                response: <List
                    itemLayout='vertical'
                    dataSource={assignments}
                    renderItem={(item: Assignment) => (
                        <List.Item key={item.id} actions={[
                            <IconText icon={<LuCalendarDays />} text={fDate(item.examDate) as string} key="list-vertical-star-o" />,
                            <IconText icon={<LuClock />} text={setTime(item.startTime as number[])} key="list-vertical-like-o" />,
                            <IconText icon={<LuClock9 /> } text={setTime(item.endTime as number[])} key="list-vertical-message" />,
                        ]}>
                            <List.Item.Meta
                                //TODO adding a link to the assignment view
                                title={<a href="#">{item.examName}</a>}
                                description={<Tag>{`${item.subject?.course} - ${item.classe?.name}`}</Tag>}
                            />
                        </List.Item>
                    )}
                />,
                tableRow: true
            }]} panelColor={color} />
        </PanelSection>
    )
}

export const TeacherInfo = (teacherInfoProps: TeacherInfo) => {
    return (
        <Block items={[
            <IndividualInfo {...teacherInfoProps} />,
            <ProsInfo {...teacherInfoProps} />,
            <CalendarSection {...teacherInfoProps} />,
            <MarkMean {...teacherInfoProps} />,
            <DepartmentInfo {...teacherInfoProps} />,
            <LessonPlan {...teacherInfoProps} />,
            <StudentReprimanded {...teacherInfoProps} />,
            <StudentByClasse {...teacherInfoProps} />,
            <AssignmentPlan {...teacherInfoProps} />
        ]} />
    )
}