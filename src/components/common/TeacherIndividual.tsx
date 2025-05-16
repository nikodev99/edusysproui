import PanelTable from "../ui/layout/PanelTable.tsx";
import {Teacher} from "../../entity";
import {firstLetter, getAge, getCountry, isNull, setName} from "../../core/utils/utils.ts";
import {Gender} from "../../entity/enums/gender.tsx";
import Datetime from "../../core/datetime.ts";
import {Flag} from "../ui/layout/Flag.tsx";
import {useEffect, useState} from "react";

export const TeacherIndividual = ({teacher, color}: {teacher: Teacher, color?: string}) => {
    const [nation, setNation] = useState<string>()
    const {personalInfo} = teacher ?? {}
    const country = getCountry(personalInfo?.nationality as string)

    useEffect(() => {
        if (teacher && country && personalInfo?.gender === Gender.FEMME) {
            setNation(country?.demonyms.fra.f)
        } else {
            setNation(country?.demonyms.fra.m)
        }
    }, [country, teacher, personalInfo?.gender]);

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

    const addressData = personalInfo?.address ? [
        {statement: 'Numéro', response: personalInfo?.address?.number},
        {statement: 'Rue', response: personalInfo?.address?.street},
        {statement: 'Quartier', response: personalInfo?.address?.neighborhood},
        ...(!isNull(personalInfo?.address?.borough) ? [{
            statement: 'Arrondissement',
            response: personalInfo?.address?.borough
        }] : []),
        {statement: 'Ville', response: personalInfo?.address?.city}
    ] : []

    const cordData = [
        {statement: 'Téléphone', response: personalInfo?.telephone},
        ...(isNull(personalInfo?.mobile) ? [] : [{statement: 'Mobile', response: personalInfo?.mobile}]),
        ...(isNull(personalInfo?.emailId) ? [] : [{statement: '@', response: personalInfo?.emailId}])
    ]

    return(
        <>
            <PanelTable title='Données personnelles' panelColor={color} data={informationData} />
            {addressData?.length > 0 ? <PanelTable title='Adresse' data={addressData} panelColor={color}/> : null}
            <PanelTable title='Coordonnées' data={cordData} panelColor={color}/>
        </>
    )
}
