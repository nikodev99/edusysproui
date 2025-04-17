import Section from "../../ui/layout/Section.tsx";
import Block from "../../view/Block.tsx";
import PanelSection from "../../ui/layout/PanelSection.tsx";
import PanelTable from "../../ui/layout/PanelTable.tsx";
import {CalendarEvent, CountType, InfoPageProps, ReprimandData} from "../../../core/utils/interfaces.ts";
import {Classe, Course, Department, Schedule, Teacher} from "../../../entity";
import {
    firstLetter,
    getAge,
    getCountry,
    getDistinctArray,
    isNull,
    cLowerName,
    setName, setTime,
    timeToCurrentDatetime
} from "../../../core/utils/utils.ts";
import {useEffect, useRef, useState} from "react";
import {Gender} from "../../../entity/enums/gender.tsx";
import {Flag} from "../../ui/layout/Flag.tsx";
import {Flex, TableColumnsType, Tag, TimelineProps} from "antd";
import {useRawFetch} from "../../../hooks/useFetch.ts";
import {getNumberOfStudentTaughtByClasse, getTeacherScheduleByDay} from "../../../data/repository/teacherRepository.ts";
import {BigCalendar} from "../../graph/BigCalendar.tsx";
import {getPrimaryDepartment} from "../../../data/repository/departmentRepository.ts";
import {Timeline} from "../../graph/Timeline.tsx";
import {AiFillClockCircle} from "react-icons/ai";
import {getSomeStudentReprimandedByTeacher} from "../../../data/repository/reprimandRepository.ts";
import {Reprimand, Assignment} from "../../../entity";
import {Table as CustomTable} from "../../ui/layout/Table.tsx";
import {ReprimandType} from "../../../entity/enums/reprimandType.ts";
import {ShapePieChart} from "../../graph/ShapePieChart.tsx";
import {PieChartDataEntry} from "../../ui/ui_interfaces.ts";
import {getSomeTeacherAssignments} from "../../../data/repository/assignmentRepository.ts";
import {useGlobalStore} from "../../../core/global/store.ts";
import {DatedListItem} from "../../ui/layout/DatedListItem.tsx";
import {DepartmentDesc} from "../../common/DepartmentDesc.tsx";
import Datetime from "../../../core/datetime.ts";
import {useScoreRepo} from "../../../hooks/useScoreRepo.ts";
import {MarksHistogram} from "../../common/MarksHistogram.tsx";

type TeacherInfo = InfoPageProps<Teacher>

const IndividualInfo = ({infoData, color}: TeacherInfo) => {

    const [nation, setNation] = useState<string>()

    const {personalInfo, personalInfo: {address}} = infoData ?? {}

    const country = getCountry(personalInfo?.nationality as string)

    const informationData = [
        {statement: 'Nom complet', response: setName(personalInfo?.lastName, personalInfo?.firstName, personalInfo?.maidenName, true)},
        {statement: 'Genre', response: Gender[personalInfo?.gender as unknown as keyof typeof Gender]},
        {statement: 'Date de naissance', response: `${Datetime?.of(personalInfo?.birthDate).fDate()} (${getAge(personalInfo?.birthDate as number[])} ans)`},
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
        {statement: 'Date d\'Embauche', response: Datetime.of(hireDate as number[]).fDate()},
        {statement: 'Ancienneté', response: getAge(hireDate as number[]) + ' ans'},
        {statement: 'Salaire par heure', response: salaryByHour}
    ]

    const courseTaught = [
        {response: <Flex wrap gap={.5} justify='end' style={{padding: '10px'}}>
                {courses?.map((c: Course, i) => <Tag key={i}>{c.abbr}</Tag>)}
        </Flex>, tableRow: true}
    ]

    const classeTaught = [
        {response: <Flex wrap gap={.5} justify='end' style={{padding: '10px'}}>
                {classes?.map((c: Classe, i) => <Tag key={i}>{c.name}</Tag>)}
        </Flex>, tableRow: true}
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
    const {useGetAllTeacherMarks} = useScoreRepo()
    const {data: fetchedMarks, isLoading} = useGetAllTeacherMarks(infoData?.personalInfo?.id)

    return(
        <Section title='Moyenne des notes'>
            <MarksHistogram
                scores={fetchedMarks}
                isLoading={isLoading}
                color={color as string}
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
            {departments?.map((department: Department) => (
                <div key={department.id}>
                    <DepartmentDesc department={department} color={color} />
                </div>
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
        studentName: `${cLowerName(r.student?.student?.personalInfo?.firstName as string, r.student?.student?.personalInfo?.lastName, 15)}`,
        reprimandType: r.type,
        punishmentDates: `${Datetime?.of(r.punishment?.startDate)?.fDate('DD/MM/YYYY')} à ${Datetime?.of(r.punishment?.endDate)?.fDate('DD/MM/YYYY')}`,
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
                response: <DatedListItem
                    dataSource={assignments?.map(a => (
                        {
                            date: Datetime?.of(a.examDate as number[]).fDate(),
                            startTime: setTime(a.startTime as number[]),
                            endTime: setTime(a.endTime as number[]),
                            title: <a href="#">{a.examName}</a>,
                            description: <Tag>{`${a.subject?.course} - ${a.classe?.name}`}</Tag>
                        }
                    ))}
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