import Section from "../../ui/layout/Section.tsx";
import Block from "../../ui/layout/Block.tsx";
import PanelSection from "../../ui/layout/PanelSection.tsx";
import PanelTable from "../../ui/layout/PanelTable.tsx";
import {InfoPageProps, CalendarEvent} from "../../../utils/interfaces.ts";
import {Schedule, Teacher} from "../../../entity";
import {fDate, firstLetter, getAge, getCountry, isNull, setName, timeToCurrentDatetime} from "../../../utils/utils.ts";
import {useEffect, useRef, useState} from "react";
import {Gender} from "../../../entity/enums/gender.tsx";
import {Flag} from "../../ui/layout/Flag.tsx";
import {Flex, Tag} from "antd";
import {useRawFetch} from "../../../hooks/useFetch.ts";
import {getTeacherScheduleByDay} from "../../../data/repository/teacherRepository.ts";
import {BigCalendar} from "../../graph/BigCalendar.tsx";

type TeacherInfo = InfoPageProps<Teacher>

const IndividualInfo = ({data, color}: TeacherInfo) => {

    const [nation, setNation] = useState<string>()
    
    const {personalInfo: {
        firstName, lastName, maidenName, birthCity, birthDate, nationality, gender, address, telephone, emailId, mobile
    }} = data ?? {}

    const country = getCountry(nationality as string)

    const infoData = [
        {statement: 'Nom complet', response: setName(lastName, firstName, maidenName, true)},
        {statement: 'Date de naissance', response: `${fDate(birthDate)} (${getAge(birthDate as number[])} ans)`},
        {statement: 'Lieu de naissance', response: firstLetter(birthCity)},
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
        {statement: 'Téléphone', response: telephone},
        ...(isNull(mobile) ? [] : [{statement: 'Mobile', response: mobile}]),
        ...(isNull(emailId) ? [] : [{statement: '@', response: emailId}])
    ]

    useEffect(() => {
        if (data && country && gender === Gender.FEMME) {
            setNation(country?.demonyms.fra.f)
        } else {
            setNation(country?.demonyms.fra.m)
        }
    }, [country, data, gender]);


    return(
        <PanelSection title={
            <div className='name__title'>
                <h2 className='name'>{`${firstName} ${lastName}`}</h2>
                <p className='subtitle'>Informations Générales sur l'enseignant</p>
            </div>
        }>
            <PanelTable title='Données personnelles' panelColor={color} data={infoData} />
            <PanelTable title='Adresse' data={addressData} panelColor={color}/>
            <PanelTable title='Coordonnées' data={cordData} panelColor={color}/>
        </PanelSection>
    )
}

const ProsInfo = ({data, color}: TeacherInfo) => {

    const {courses, classes} = data

    const employmentData = [
        //TODO adding prof job id {incorporating reference in personalInfo} and position in the database
        {statement: 'ID', response: "1"},
        {statement: 'Position', response: "Professeur de Collège"},
    ]

    const courseTaught = [
        {response: <Flex wrap gap={.5}>
                {courses?.map((c, i) => <Tag key={i}>{c.abbr}</Tag>)}
        </Flex>}
    ]

    const classeTaught = [
        {response: <Flex wrap gap={.5}>
                {classes?.map((c, i) => <Tag key={i}>{c.name}</Tag>)}
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

const CalendarSection = ({data}: TeacherInfo) => {

    const [schedules, setSchedules] = useState<Schedule[] | undefined>()
    const allDay = useRef<boolean>(!(data?.courses && data?.courses?.length > 0));
    const fetch = useRawFetch()

    useEffect(() => {
        fetch(getTeacherScheduleByDay, [data.id, allDay.current])
            .then(response => setSchedules(response.data as Schedule[]))
    }, [data, fetch]);

    const events = schedules && schedules.map((s: Schedule) => ({
        allDay: allDay.current,
        title: s.designation,
        start: s.startTime ? timeToCurrentDatetime(s.startTime) : new Date(),
        end: s.endTime ? timeToCurrentDatetime(s.endTime): new Date(),
    }))

    console.log('events: ', events)

    return(
        <Section title='Informations sur l’emploi du temps'>
            <BigCalendar data={events as CalendarEvent} views={['day']} defaultView='day' />
        </Section>
    )
}

const DepartmentInfo = ({data}: TeacherInfo) => {

    console.log(data)

    return(
        <Section title='Données organisationnelles'>
            Données organisationnelles
        </Section>
    )
}

const MarkMean = () => {
    return(
        <Section title='Indicateurs de performance'>
            Indicateurs de performance
        </Section>
    )
}

const LessonPlan = () => {
    return(
        <Section title='Plans de cours'>
            Fichiers ou liens vers les plans de cours qu’ils ont créés.
        </Section>
    )
}

const StudentReprimanded = () => {
    return(
        <Section title='Liste des élèves réprimandé'>
            Liste des élèves réprimandés
        </Section>
    )
}

const CourseComments = () => {
    return(
        <Section title='Suivis des cours'>
            Suivis des cours
        </Section>
    )
}

export const TeacherInfo = (teacherInfoProps: TeacherInfo) => {
    return (
        <Block items={[
            <IndividualInfo {...teacherInfoProps} />,
            <ProsInfo {...teacherInfoProps} />,
            <CalendarSection {...teacherInfoProps} />,
            <DepartmentInfo {...teacherInfoProps} />,
            <MarkMean />,
            <LessonPlan />,
            <StudentReprimanded />,
            <CourseComments />
        ]} />
    )
}