import Section from "../../ui/layout/Section.tsx";
import Block from "../../ui/layout/Block.tsx";
import PanelSection from "../../ui/layout/PanelSection.tsx";
import PanelTable from "../../ui/layout/PanelTable.tsx";
import {InfoPageProps} from "../../../utils/interfaces.ts";
import {Teacher} from "../../../entity";
import {fDate, firstLetter, getAge, getCountry, isNull, setName} from "../../../utils/utils.ts";
import {useEffect, useState} from "react";
import {Gender} from "../../../entity/enums/gender.tsx";
import {Flag} from "../../ui/layout/Flag.tsx";

type TeacherInfo = InfoPageProps<Teacher>

const IndividualInfo = ({data, color}: TeacherInfo) => {

    const [nation, setNation] = useState<string>()
    
    const {personalInfo: {
        firstName, lastName, maidenName, birthCity, birthDate, nationality, gender, address,
        telephone, emailId, mobile
    }} = data

    const country = getCountry(nationality as string)

    console.log("Country: ", country)

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
        {statement: 'ID', response: "1"},
        {statement: 'Position', response: "Professeur de Collège"},
        ...(courses ? [] : [{statement: 'Mobile', response: courses}]),
        ...(classes ? [] : [{statement: '@', response: classes}])
    ]

    return(
        <Section title="Informations Professionnelles">
            Informations Professionnelles
        </Section>
    )
}

const DepartmentInfo = () => {
    return(
        <Section title='Données organisationnelles'>
            Données organisationnelles
        </Section>
    )
}

const CalendarSection = () => {
    return(
        <Section title='Informations sur l’emploi du temps'>
            Informations sur l’emploi du temps
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
            <DepartmentInfo />,
            <CalendarSection />,
            <MarkMean />,
            <LessonPlan />,
            <StudentReprimanded />,
            <CourseComments />
        ]} />
    )
}