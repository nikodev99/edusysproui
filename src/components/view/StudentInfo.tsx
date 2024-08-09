import Block from "../ui/layout/Block.tsx";
import {Card, Divider} from "antd";
import {ReactNode, useEffect, useState} from "react";
import {Student} from "../../entity";
import {getAge, getCountry, setFirstName, convertToM, fDate, firstLetter} from "../../utils/utils.ts";
import PanelStat from "../ui/layout/PanelStat.tsx";
import {Gender} from "../../entity/enums/gender.ts";
import PanelTable from "../ui/layout/PanelTable.tsx";

interface StudentInfoProps {
    student: Student
}

const IndividualInfo = ({student}: StudentInfoProps) => {

    const [nationality, setNationality] = useState<string>()
    const country = getCountry(student.nationality as string)
    const studentAge = getAge(student.birthDate as [number, number, number])
    const birthDay = fDate(student.birthDate)
    const individualData = [
        {statement: 'Genre', response: firstLetter(student.gender)}
    ]

    useEffect(() => {
        if (student && country && student.gender === Gender.FEMME) {
            setNationality(country?.demonyms.fra.f)
        }else {
            setNationality(country?.demonyms.fra.m)
        }
    }, [country, student]);
    

    return(
        <Card className='profile-card' style={{borderRadius: 0}}
              title={`Profile de ${setFirstName(student.firstName + ' ' + student.lastName)}`} size="small">
            <div className='panel'>
                <PanelStat title={studentAge} subTitle='ans' src={true} media={country?.cca2} desc={nationality}/>
                <PanelStat title={student.healthCondition?.weight} subTitle='kgs' src={false} media={''} desc='Poids'/>
                <PanelStat title={student.healthCondition?.height} subTitle='m' src={false} media={convertToM(student.healthCondition?.height as number)} desc='Taille'/>
            </div>
            <div className='birth-Body'><p>Née le {birthDay} à {student.birthCity}</p></div>
            <Divider />
            <div className="panel-table">
                <PanelTable  title='Données Personnelle' data={individualData} />
            </div>
        </Card>
    )
}

const StudentInfo = ({student}: StudentInfoProps) => {

    const items: ReactNode[] = [
        <IndividualInfo student={student} />
    ]

    return(
        <Block items={items} />
    )
}

export default StudentInfo