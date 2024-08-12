import Block from "../ui/layout/Block.tsx";
import {Card, Divider, Table, TableColumnsType} from "antd";
import {ReactNode, useEffect, useState} from "react";
import {Classe, Score, Student} from "../../entity";
import {
    getAge,
    getCountry,
    setFirstName,
    convertToM,
    fDate,
    firstLetter,
    isNull,
    enumToObjectArrayForFiltering, dateCompare, fDatetime
} from "../../utils/utils.ts";
import PanelStat from "../ui/layout/PanelStat.tsx";
import {Gender} from "../../entity/enums/gender.ts";
import PanelTable from "../ui/layout/PanelTable.tsx";
import {SectionType} from "../../entity/enums/section.ts";
import {StudentList as DataType} from "../../utils/interfaces.ts";
import Avatar from "../ui/layout/Avatar.tsx";
import Tagger from "../list/Tagger.tsx";
import ActionButton from "../list/ActionButton.tsx";

interface StudentInfoProps {
    student: Student,
    classe?: Classe
}

const IndividualInfo = ({student}: StudentInfoProps) => {

    const [nationality, setNationality] = useState<string>()
    const country = getCountry(student.nationality as string)
    const studentAge = getAge(student.birthDate as [number, number, number])
    const birthDay = fDate(student.birthDate)
    const individualData = [
        {statement: 'Genre', response: firstLetter(student.gender)},
        {statement: 'Nom(s) et prénom(s) du père', response: setFirstName(student.dadName)},
        {statement: 'Nom(s) et prénom(s) de la mère', response: setFirstName(student.momName)},
        ...(isNull(student.telephone) ? [] : [{statement: 'Téléphone', response: student.telephone}]),
        ...(isNull(student.emailId) ? [] : [{statement: '@', response: student.emailId}]),
    ]
    const addressData = [
        {statement: 'Numéro', response: student.address?.number},
        {statement: 'Rue', response: student.address?.street},
        {statement: 'Quartier', response: student.address?.neighborhood},
        ...(!isNull(student.address?.borough) ? [{statement: 'Arrondissement', response: student.address?.borough}]: []),
        {statement: 'Ville', response: student.address?.city}
    ]
    const guardianData = [
        {statement: 'Nom(s)', response: student.guardian?.lastName},
        {statement: 'Prénoms(s)', response: student.guardian?.firstName},
        {statement: 'Téléphone', response: student.guardian?.telephone},
        ...(isNull(student.guardian?.mobile) ? [] : [{statement: 'Mobile', response: student.guardian?.mobile}]),
        {statement: '@', response: student.guardian?.emailId}
    ]

    useEffect(() => {
        if (student && country && student.gender === Gender.FEMME) {
            setNationality(country?.demonyms.fra.f)
        }else {
            setNationality(country?.demonyms.fra.m)
        }
    }, [country, student]);
    

    return(
        <Card className='profile-card'
              title={`Profile de ${setFirstName(student.firstName + ' ' + student.lastName)}`} size="small">
            <div className='panel'>
                <PanelStat title={studentAge} subTitle='ans' src={true} media={country?.cca2} desc={nationality}/>
                <PanelStat title={student.healthCondition?.weight} subTitle='kgs' src={false} media={''} desc='Poids'/>
                <PanelStat title={student.healthCondition?.height} subTitle='m' src={false} media={convertToM(student.healthCondition?.height as number)} desc='Taille'/>
            </div>
            <div className='birth-Body'><p>Née le {birthDay} à {student.birthCity}</p></div>
            <Divider />
            <div className="panel-table">
                <PanelTable  title='Données Personnelles' data={individualData} />
                <PanelTable  title='Addresse' data={addressData} />
                <PanelTable  title='Tuteur' data={guardianData} />
            </div>
        </Card>
    )
}

const ExamList = ({student, classe}: StudentInfoProps) => {

    const seeMore = () => {console.log('seing More')}

    const [scores, setScore] = useState<Score[]>()
    
    interface DataType {
        examDate: string;
        examName: string;
        classe: string;
        obtainedMark: number;
    }

    useEffect(() => {
        setScore(student.marks)
    }, [student.marks]);

    const data: DataType[] = scores?.map((s) => ({
        examDate: s.exam?.examDate || '',
        examName: s.exam?.examName || '',
        classe: classe?.name || '',
        obtainedMark: s.obtainedMark || '',
    }));
    
    const columns: TableColumnsType<DataType> = [
        {
            title: "Date",
            dataIndex: 'examDate',
            key: 'examDate',
            align: 'center',
            render: (text) => (<span>{fDatetime(text)}</span>),
            responsive: ['md'],
        },
        {
            title: "Classe",
            dataIndex: 'classe',
            key: 'classe',
            align: 'center'
        },
        {
            title: "Examen",
            dataIndex: 'ExamName',
            key: 'ExamName',
            align: 'center'
        },
        {
            title: "Note",
            dataIndex: 'obtainedMark',
            key: 'obtainedMark',
            align: 'center'
        }
    ];


    return (
        <Card className='profile-card' title='Performance aux devoirs' size="small" extra={
            <p onClick={seeMore} className="btn-toggle">Plus</p>
        }>
            <Table className='score-table' columns={columns} dataSource={data as DataType[]} />
        </Card>
    )
}

const StudentInfo = ({student, classe}: StudentInfoProps) => {

    const items: ReactNode[] = [
        <IndividualInfo student={student} />,
        ...(classe?.grade?.section != SectionType.MATERNELLE && classe?.grade?.section != SectionType.PRIMAIRE ? [<ExamList student={student} />] : [])
    ]

    return(
        <Block items={items} />
    )
}

export default StudentInfo