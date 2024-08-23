import Block from "../ui/layout/Block.tsx";
import {Button, Carousel, Divider, Table, TableColumnsType, Tag, Avatar as AntAvatar} from "antd";
import {ReactNode, useEffect, useState} from "react";
import {Enrollment, HealthCondition, Schedule} from "../../entity";
import {
    convertToM, fDate, fDatetime, firstLetter, fullDay, getAge, getCountry, isCurrentTimeBetween,
    isNull, lowerName, monthsBetween, setFirstName, timeConcat
} from "../../utils/utils.ts";
import PanelStat from "../ui/layout/PanelStat.tsx";
import {Gender} from "../../entity/enums/gender.ts";
import PanelTable from "../ui/layout/PanelTable.tsx";
import {SectionType} from "../../entity/enums/section.ts";
import {Attendance} from "../../entity/enums/attendance.ts";
import {fetchStudentClassmatesRandomly} from "../../data/action/fetch_student.ts";
import Avatar from "../ui/layout/Avatar.tsx";
import {text} from "../../utils/text_display.ts";
import {BloodType} from "../../entity/enums/bloodType.ts";
import {MdHealthAndSafety} from "react-icons/md";
import {GiAchievement, GiHealthDecrease} from "react-icons/gi";
import {redirectTo} from "../../context/RedirectContext.ts";
import RadarChart from "../graph/RadarChart.tsx";
import PieChart from "../graph/PieChart.tsx";
import {Reprimand} from "../../entity/domain/reprimand.ts";
import Section from "../ui/layout/Section.tsx";
import PanelSection from "../ui/layout/PanelSection.tsx";

interface StudentInfoProps {
    enrollment: Enrollment
    dataKey: string
    seeMore?: () => void
}

interface ExamData {
    examDate: string;
    examName: string;
    classe: string;
    obtainedMark: number;
}

interface HistoryData {
    academicYear: string;
    classeName: string;
    yearAmount: number;
}

const IndividualInfo = ({enrollment}: StudentInfoProps) => {

    const {student, student: {address, healthCondition} } = enrollment

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
        {statement: 'Numéro', response: address?.number},
        {statement: 'Rue', response: address?.street},
        {statement: 'Quartier', response: address?.neighborhood},
        ...(!isNull(address?.borough) ? [{
            statement: 'Arrondissement',
            response: address?.borough
        }] : []),
        {statement: 'Ville', response: address?.city}
    ]

    useEffect(() => {
        if (student && country && student.gender === Gender.FEMME) {
            setNationality(country?.demonyms.fra.f)
        } else {
            setNationality(country?.demonyms.fra.m)
        }
    }, [country, student]);

    return (
        <Section title={`Profile de ${setFirstName(student.firstName + ' ' + student.lastName)}`}>
            <div className='panel'>
                <PanelStat title={studentAge} subTitle='ans' src={true} media={country?.cca2} desc={nationality}/>
                <PanelStat title={healthCondition?.weight} subTitle='kgs' src={false} media={''} desc='Poids'/>
                <PanelStat title={healthCondition?.height} subTitle='m' src={false}
                           media={convertToM(healthCondition?.height as number)} desc='Taille'/>
            </div>
            <div className='birth-Body'><p>Née le {birthDay} à {student.birthCity}</p></div>
            <Divider/>
            <div className="panel-table">
                <PanelTable title='Données Personnelles' data={individualData}/>
                <PanelTable title='Addresse' data={addressData}/>
            </div>
        </Section>
    )
}

const GuardianBlock = ({enrollment}: StudentInfoProps) => {
    const {student: {guardian, guardian: {address}}} = enrollment

    const guardianData = [
        {statement: 'Nom(s)', response: guardian?.lastName},
        {statement: 'Prénoms(s)', response: guardian?.firstName},
        {statement: 'Téléphone', response: guardian?.telephone},
        ...(isNull(guardian?.mobile) ? [] : [{statement: 'Mobile', response: guardian?.mobile}]),
        {statement: '@', response: guardian?.emailId}
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

    return(
        <PanelSection title='Tuteur legal'>
            <PanelTable title='Tuteur' data={guardianData}/>
            <PanelTable title='Addresse' data={addressData}/>
        </PanelSection>
    )
}

const ExamList = ({enrollment, seeMore}: StudentInfoProps) => {

    const {student: {marks}, classe} = enrollment

    const data: ExamData[] = marks?.map((s) => ({
        examDate: fDate(s.exam?.examDate) ?? '',
        examName: s.exam?.subject?.course ?? '',
        classe: classe?.name ?? '',
        obtainedMark: s.obtainedMark ?? 0,
    })) ?? [];

    const columns: TableColumnsType<ExamData> = [
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
        <Section title='Performance aux devoirs' more={true} seeMore={seeMore}>
            <Table className='score-table' size='small' columns={columns} dataSource={data} pagination={false} />
        </Section>
    )
}

const GraphSection = ({enrollment}: StudentInfoProps) => {

    const {student: {marks}} = enrollment

    const data = marks.map((s) => ({
        subject: s.exam?.subject?.course,
        score: s.obtainedMark
    }))

    //TODO this should be average score
    data.push({subject: 'Physique chimie', score: 16})
    data.push({subject: 'French', score: 12})
    data.push({subject: 'Anglais', score: 18})
    data.push({subject: 'Music', score: 15})
    data.push({subject: 'Math', score: 13})

    return (
        <Section title='Progression aux examens'>
            <RadarChart data={data} xField='subject' yField='score' />
        </Section>
    )
}

const SchoolHistory = ({enrollment, seeMore}: StudentInfoProps) => {
    const {student: {enrollments}} = enrollment

    const columns: TableColumnsType<HistoryData> = [
        {
            title: "Année",
            dataIndex: 'academicYear',
            key: 'academicYear',
            align: 'center',
            render: (text) => (<span>{text}</span>),
            responsive: ['md'],
        },
        {
            title: "Classe",
            dataIndex: 'classeName',
            key: 'classeName',
            align: 'center'
        },
        {
            title: "Montant Annuel",
            dataIndex: 'yearAmount',
            key: 'yearAmount',
            align: 'center'
        },
    ];

    const data: HistoryData[] = enrollments?.map((e) => ({
        academicYear: e.academicYear?.academicYear ?? '',
        classeName: e.classe?.name ?? '',
        yearAmount: (e.classe?.monthCost ?? 0) * (monthsBetween(e.academicYear?.startDate, e.academicYear?.endDate) ?? 0),
    })) ?? [];

    return (
        <Section title='Hystorique' more={true} seeMore={seeMore}>
            <Table
                className='score-table'
                size='small'
                columns={columns}
                dataSource={data}
                pagination={false}
                rowKey={(record) => record.classeName}
            />
        </Section>
    )
}

const AttendanceSection = ({enrollment, seeMore}: StudentInfoProps) => {

    const { student: { attendances } } = enrollment

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
            statement: setFirstName(fullDay(a.attendanceDate)) as string,
            response: <Tag bordered={false} color={tagColor}>{tagText?.toLowerCase()}</Tag>
        };
    }) ?? [];

    return (
        <PanelSection title='Suivis de présence' more={true} seeMore={seeMore}>
            <PanelTable title='Données des présences' data={attendanceData}/>
        </PanelSection>
    )
}

const SchoolColleagues = ({enrollment, seeMore}: StudentInfoProps) => {
    
    const [classmates, setClassmates] = useState<Enrollment[]>([])

    useEffect(() => {
        const fetchData = async () => {
            await fetchStudentClassmatesRandomly(enrollment).then(async (res) => {
                if (res?.isSuccess) {
                    setClassmates(res?.data as Enrollment[])
                }
            }).catch((error) => `Failed to fetch classmates ${error.errorCode}: ${error.message}`)
        }

        fetchData().then()
    }, [enrollment]);

    const handleSeeDetails = (id: string) => {
        redirectTo(`${text.student.group.view.href}${id}`)
    }

    return (
        <Section title='Condisciples' more={true} seeMore={seeMore}>
            <Carousel slidesToShow={3} slidesToScroll={1} dots={false} arrows draggable autoplay>
                {classmates && classmates.map((c, i) => (<div className='classmate-team' key={`${c.student.id}-${i}`}>
                    <div className='scroll-box'>
                        <a onClick={() => handleSeeDetails(c.student.id)}>
                            <div className='avatar'>
                                <Avatar
                                    image={c.student.image}
                                    size={{xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100}}
                                    firstText={c.student.firstName} lastText={c.student.lastName}
                                />
                            </div>
                            <div className='name'>
                                <span>{lowerName(c.student.firstName, c.student.lastName)}</span>
                            </div>
                        </a>
                        <div className='view__button'>
                            <Button type='primary' style={{width: '100%'}}>Voir</Button>
                        </div>
                    </div>

                </div>))}
            </Carousel>
        </Section>
    )
}

const HealthData = ({enrollment}: StudentInfoProps) => {

    const {student} = enrollment
    const healthCondition: HealthCondition = student.healthCondition !== null ? student.healthCondition : {} as HealthCondition

    const conditions = healthCondition.medicalConditions?.map((condition) => ({
        response: <div className='health'>
            <span>{condition}</span>
            <GiHealthDecrease  className='health-icon decrease' size={35}/>
        </div>
    }))
    const allergies = healthCondition.allergies?.map((allergy) => ({
        response: <div>{allergy}</div>
    }))
    const medications = healthCondition.medications?.map((medication) => ({
        response: <div>{medication}</div>
    }))
    const blood = healthCondition?.bloodType as unknown as keyof typeof BloodType
    const healthData = [
        {statement: 'Groupe Sanguin', response: <AntAvatar style={{backgroundColor: '#4B1E24'}}>{BloodType[blood]}</AntAvatar>},
        ...(!conditions && !allergies && !medications ? [{response: <div className='health'>
                <span>Etat de santé Normal</span>
                <MdHealthAndSafety className='health-icon' size={35} />
        </div>}] : [])
    ]

    return(
        <PanelSection title='Santé'>
            <PanelTable title='Etat de santé' data={healthData}/>
            {conditions && (<PanelTable title='Condition Médicale' data={conditions} />)}
            {allergies && (<PanelTable title='Allergies' data={allergies} />)}
            {medications && (<PanelTable title='Medicamennt Chronique' data={medications} />)}
        </PanelSection>
    )
}

const CourseSchedule = ({enrollment}: StudentInfoProps) => {
    const {classe} = enrollment
    const schedules: Schedule[] = classe.schedule !== null ? classe.schedule : []

    const columns: TableColumnsType<Schedule> = [
        {
            title: "Heures",
            dataIndex: 'startTime',
            key: 'time',
            align: 'center',
            render: (text, s) => (<p style={{textAlign: 'left'}}>{timeConcat(text, s.endTime as number[])}</p>),
            responsive: ['md'],
        },
        {
            title: "Matières",
            dataIndex: 'course',
            key: 'course',
            align: 'center',
            render: (c, r) => (<p style={{textAlign: 'left'}}>{c?.course ?? r.designation}</p>),
        },
    ];

    return(
        <Section title={`Emploi du temps: ${setFirstName(fullDay(new Date()))}`}>
            <Table
                className='score-table'
                columns={columns}
                dataSource={schedules}
                pagination={false}
                size='small'
                rowKey={(record) => `row-${record.id}`}
                rowClassName={(record) => isCurrentTimeBetween(record.startTime as number[], record.endTime as number[]) ? 'highlight-row' : ''}
            />
        </Section>
    )
}

const DisciplinaryRecords = ({enrollment, seeMore}: StudentInfoProps) => {

    const {student: {firstName}} = enrollment
    const reprimands = [] as Reprimand[]
    const data = Object.values(
        reprimands.reduce((acc, curr) => {
            if (!acc[curr.type]) {
                acc[curr.type] = {type: curr.type, value: 0}
            }
            acc[curr.type].value += 1;
            return acc;
        }, {} as Record<string, { type: string; value: number }>)
    )

    return (
        <Section title={`Dossiers disciplinaires de ${setFirstName(firstName)}`} more={true} seeMore={seeMore}>
            {reprimands.length !== 0 ? (<PieChart data={data} />) : (
                <div className='panel-table'>
                    <PanelTable title='Dossiers disciplinaires' data={[{
                        response: (
                            <div className='health'>
                                <span className='big-text'>Aucune réprimande trouvée</span>
                                <GiAchievement className='health-icon' size={100}/>
                            </div>
                        )
                    }]}/>
                </div>
            )}
        </Section>
    )
}

//TODO add the bar graph for the 5 last exams

const StudentInfo = ({enrollment}: { enrollment: Enrollment }) => {

    const {classe: {grade}} = enrollment

    const items: ReactNode[] = [
        <IndividualInfo enrollment={enrollment} dataKey='individual-block'/>,
        <GuardianBlock enrollment={enrollment} dataKey='guardian-section' />,
        ...(grade?.section != SectionType.MATERNELLE && grade?.section != SectionType.PRIMAIRE ? [
            <ExamList enrollment={enrollment}  dataKey='exam-block'/>
        ] : []),
        ...(grade?.section != SectionType.MATERNELLE && grade?.section != SectionType.PRIMAIRE ? [
            <GraphSection enrollment={enrollment}  dataKey='graph-block'/>
        ] : []),
        <SchoolHistory enrollment={enrollment}  dataKey='school-history-block'/>,
        <AttendanceSection enrollment={enrollment}  dataKey='attendance-block'/>,
        <SchoolColleagues enrollment={enrollment}  dataKey='classmates-block'/>,
        <HealthData enrollment={enrollment} dataKey='health-section' />,
        <CourseSchedule enrollment={enrollment} dataKey='schedule-section' />,
        <DisciplinaryRecords enrollment={enrollment} dataKey='disciplinary-section' />
    ]

    return (
        <Block items={items}/>
    )
}

export default StudentInfo