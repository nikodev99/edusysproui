import Block from "../ui/layout/Block.tsx";
import {Card, Divider, Table, TableColumnsType, Tag} from "antd";
import {ReactNode, useEffect, useState} from "react";
import {Classe, Enrollment, Score, Student} from "../../entity";
import {
    convertToM,
    fDate,
    fDatetime,
    firstLetter, fullDay,
    getAge,
    getCountry,
    isNull,
    monthsBetween,
    setFirstName
} from "../../utils/utils.ts";
import PanelStat from "../ui/layout/PanelStat.tsx";
import {Gender} from "../../entity/enums/gender.ts";
import PanelTable from "../ui/layout/PanelTable.tsx";
import {SectionType} from "../../entity/enums/section.ts";
import {PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer} from 'recharts';
import {Attendance} from "../../entity/enums/attendance.ts";

interface StudentInfoProps {
    student: Student,
    classe?: Classe,
    seeMore?: () => void
}

interface DataTable {
    year: string;
    examName?: string;
    classe: string;
    obtainedMark: number;
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
        ...(!isNull(student.address?.borough) ? [{
            statement: 'Arrondissement',
            response: student.address?.borough
        }] : []),
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
        } else {
            setNationality(country?.demonyms.fra.m)
        }
    }, [country, student]);


    return (
        <Card className='profile-card'
              title={`Profile de ${setFirstName(student.firstName + ' ' + student.lastName)}`} size="small">
            <div className='panel'>
                <PanelStat title={studentAge} subTitle='ans' src={true} media={country?.cca2} desc={nationality}/>
                <PanelStat title={student.healthCondition?.weight} subTitle='kgs' src={false} media={''} desc='Poids'/>
                <PanelStat title={student.healthCondition?.height} subTitle='m' src={false}
                           media={convertToM(student.healthCondition?.height as number)} desc='Taille'/>
            </div>
            <div className='birth-Body'><p>Née le {birthDay} à {student.birthCity}</p></div>
            <Divider/>
            <div className="panel-table">
                <PanelTable title='Données Personnelles' data={individualData}/>
                <PanelTable title='Addresse' data={addressData}/>
                <PanelTable title='Tuteur' data={guardianData}/>
            </div>
        </Card>
    )
}

const ExamList = ({student, classe, seeMore}: StudentInfoProps) => {

    const [scores, setScore] = useState<Score[]>()

    useEffect(() => {
        setScore(student.marks)
    }, [student.marks]);

    const data: DataTable[] = scores?.map((s) => ({
        year: fDate(s.exam?.examDate) ?? '',
        examName: s.exam?.subject?.course ?? '',
        classe: classe?.name ?? '',
        obtainedMark: s.obtainedMark ?? 0,
    })) ?? [];

    const columns: TableColumnsType<DataTable> = [
        {
            title: "Date",
            dataIndex: 'year',
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
            dataIndex: 'examName',
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
            <Table className='score-table' size='small' columns={columns} dataSource={data} pagination={false} />
        </Card>
    )
}

const GraphSection = ({notes}: { notes: Score[] }) => {
    const data = notes.map((s) => ({
        subject: s.exam?.subject?.course,
        score: s.obtainedMark
    }))

    data.push({subject: 'Physique chimie', score: 20})
    data.push({subject: 'French', score: 12})
    data.push({subject: 'Anglais', score: 18})
    data.push({subject: 'Music', score: 15})
    data.push({subject: 'Math', score: 13})

    return (
        <Card className='profile-card' title='Progression aux examens' size='small'>
            <ResponsiveContainer height={400} minHeight={300}>
                <RadarChart data={data}>
                    <PolarGrid/>
                    <PolarAngleAxis dataKey="subject"/>
                    {/* TODO ajouter à combien vont les notes. Par défaut [0 à 20] puis customizable */}
                    <PolarRadiusAxis angle={30} domain={[0, 20]}/>
                    <Radar name="Scores" dataKey="score" stroke="#137333" fill="#137333" fillOpacity={0.4}/>
                </RadarChart>
            </ResponsiveContainer>
        </Card>
    )
}

const SchoolHistory = ({student, seeMore}: StudentInfoProps) => {
    const enrollments: Enrollment[] = student.enrollments ?? []

    const columns: TableColumnsType<DataTable> = [
        {
            title: "Année",
            dataIndex: 'year',
            key: 'academicYear',
            align: 'center',
            render: (text) => (<span>{text}</span>),
            responsive: ['md'],
        },
        {
            title: "Classe",
            dataIndex: 'classe',
            key: 'enrollmentClasse',
            align: 'center'
        },
        {
            title: "Montant Total",
            dataIndex: 'obtainedMark',
            key: 'totalAmount',
            align: 'center'
        },
    ];

    const data: DataTable[] = enrollments?.map((e) => ({
        year: e.academicYear?.academicYear ?? '',
        classe: e.classe?.name ?? '',
        obtainedMark: (e.classe?.monthCost ?? 0) * (monthsBetween(e.academicYear?.startDate, e.academicYear?.endDate) ?? 0),
    })) ?? [];

    return (
        <Card className='profile-card' title='Hystorique' size='small' extra={
            <p onClick={seeMore} className="btn-toggle">Plus</p>
        }>
            <Table className='score-table' size='small' columns={columns} dataSource={data} pagination={false}></Table>
        </Card>
    )
}

const AttendanceSection = ({student, seeMore}: StudentInfoProps) => {

    const { attendances } = student

    const attendanceData = attendances?.map((a) => {
        let tagColor
        let tagText

        switch (a.status) {
            case 'ABSENT' as Attendance:
                tagColor = 'error'
                tagText = Attendance.ABSENT
                break;
            case 'EXCUSED' as Attendance:
                tagColor = 'processing'
                tagText = Attendance.EXCUSED
                break;
            case 'PRESENT' as Attendance:
                tagColor = 'success'
                tagText = Attendance.PRESENT
                break;
            case 'LATE' as Attendance:
                tagColor = 'warning'
                tagText = Attendance.LATE
                break;
            default:
                tagColor = 'gray'; // Default color for unexpected statuses
        }

        return {
            statement: fullDay(a.attendanceDate) as string,
            response: <Tag bordered={false} color={tagColor}>{tagText?.toLowerCase()}</Tag>
        };
    }) ?? [];

    return (
        <Card className='profile-card' title='Suivis de présence' size='small' extra={
            <p onClick={seeMore} className="btn-toggle">Plus</p>
        }>
            <div className="panel-table">
                <PanelTable title='Données des présences' data={attendanceData}/>
            </div>
        </Card>
    )
}

const StudentInfo = ({student, classe}: StudentInfoProps) => {

    const items: ReactNode[] = [
        <IndividualInfo student={student}/>,
        ...(classe?.grade?.section != SectionType.MATERNELLE && classe?.grade?.section != SectionType.PRIMAIRE ? [
            <ExamList student={student}/>] : []),
        ...(classe?.grade?.section != SectionType.MATERNELLE && classe?.grade?.section != SectionType.PRIMAIRE ? [
            <GraphSection notes={student?.marks ?? []}/>] : []),
        <SchoolHistory student={student} />,
        <AttendanceSection student={student} />
    ]

    return (
        <Block items={items}/>
    )
}

export default StudentInfo