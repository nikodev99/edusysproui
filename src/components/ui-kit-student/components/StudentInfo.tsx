import Block from "../../ui/layout/Block.tsx";
import {Button, Carousel, Divider, Table, TableColumnsType, Avatar as AntAvatar} from "antd";
import {HTMLProps, ReactNode, useEffect, useState} from "react";
import {Enrollment, HealthCondition, Schedule} from "../../../entity";
import {
    bloodLabel, convertToM, fDate, fDatetime, firstLetter, fullDay, getAge, getCountry,
    chooseColor, isNull, lowerName, monthsBetween, setFirstName, timeToCurrentDatetime, currency
} from "../../../utils/utils.ts";
import PanelStat from "../../ui/layout/PanelStat.tsx";
import { Table as CustomTable } from "../../ui/layout/Table.tsx";
import {Gender} from "../../../entity/enums/gender.tsx";
import PanelTable from "../../ui/layout/PanelTable.tsx";
import {SectionType} from "../../../entity/enums/section.ts";
import {fetchStudentClassmatesRandomly} from "../../../data/action/fetch_student.ts";
import Avatar from "../../ui/layout/Avatar.tsx";
import {text} from "../../../utils/text_display.ts";
import {BloodType} from "../../../entity/enums/bloodType.ts";
import {MdHealthAndSafety} from "react-icons/md";
import {GiAchievement, GiHealthDecrease} from "react-icons/gi";
import {redirectTo} from "../../../context/RedirectContext.ts";
import RadarChart from "../../graph/RadarChart.tsx";
import PieChart from "../../graph/PieChart.tsx";
import {Reprimand} from "../../../entity/domain/reprimand.ts";
import Section from "../../ui/layout/Section.tsx";
import PanelSection from "../../ui/layout/PanelSection.tsx";
import {CalendarEvent, ExamData, InfoPageProps} from "../../../utils/interfaces.ts";
import {initExamData} from "../../../entity/domain/score.ts";
import {attendanceTag} from "../../../entity/enums/attendanceStatus.ts";
import Tag from "../../ui/layout/Tag.tsx";
import {LuBan} from "react-icons/lu";
import {BigCalendar} from "../../graph/BigCalendar.tsx";

type StudentInfoProps = InfoPageProps<Enrollment>

interface HistoryData {
    dataId: string
    academicYear: string
    classeName: string
    yearAmount: number
}

const IndividualInfo = ({data, color}: StudentInfoProps) => {

    const {student, student: {personalInfo, healthCondition}} = data

    const [nationality, setNationality] = useState<string>()
    const country = getCountry(personalInfo?.nationality as string)
    const studentAge = getAge(personalInfo?.birthDate as [number, number, number])
    const birthDay = fDate(personalInfo?.birthDate)
    const individualData = [
        {statement: 'Genre', response: firstLetter(personalInfo?.gender)},
        {statement: 'Nom(s) et prénom(s) du père', response: setFirstName(student.dadName)},
        {statement: 'Nom(s) et prénom(s) de la mère', response: setFirstName(student.momName)},
        ...(isNull(personalInfo?.telephone) ? [] : [{statement: 'Téléphone', response: personalInfo?.telephone}]),
        ...(isNull(personalInfo?.emailId) ? [] : [{statement: '@', response: personalInfo?.emailId}]),
    ]
    const addressData = [
        {statement: 'Numéro', response: personalInfo?.address?.number},
        {statement: 'Rue', response: personalInfo?.address?.street},
        {statement: 'Quartier', response: personalInfo?.address?.neighborhood},
        ...(!isNull(personalInfo?.address?.borough) ? [{
            statement: 'Arrondissement',
            response: personalInfo?.address?.borough
        }] : []),
        {statement: 'Ville', response: personalInfo?.address?.city}
    ]

    useEffect(() => {
        if (student && country && personalInfo?.gender === Gender.FEMME) {
            setNationality(country?.demonyms.fra.f)
        } else {
            setNationality(country?.demonyms.fra.m)
        }
    }, [country, personalInfo?.gender, student]);

    return (
        <Section title={`Profile de ${setFirstName(personalInfo?.firstName + ' ' + personalInfo?.lastName)}`}>
            <div className='panel'>
                <PanelStat title={studentAge} subTitle='ans' src={true} media={country?.cca2} desc={nationality}/>
                <PanelStat title={healthCondition?.weight} subTitle='kgs' desc='Poids'/>
                <PanelStat title={healthCondition?.height} subTitle='m' media={convertToM(healthCondition?.height as number)} desc='Taille'/>
            </div>
            <div className='birth-Body'><p>Née le {birthDay} à {personalInfo?.birthCity}</p></div>
            <Divider/>
            <div className="panel-table">
                <PanelTable title='Données Personnelles' data={individualData} panelColor={color}/>
                <PanelTable title='Adresse' data={addressData} panelColor={color}/>
            </div>
        </Section>
    )
}

const GuardianBlock = ({data, color}: StudentInfoProps) => {
    const {student: {guardian: {personalInfo}}} = data

    const guardianData = [
        {statement: 'Nom(s)', response: personalInfo?.lastName},
        {statement: 'Prénoms(s)', response: personalInfo?.firstName},
        {statement: 'Téléphone', response: personalInfo?.telephone},
        ...(isNull(personalInfo?.mobile) ? [] : [{statement: 'Mobile', response: personalInfo?.mobile}]),
        {statement: '@', response: personalInfo?.emailId}
    ]
    const addressData = [
        {statement: 'Numéro', response: personalInfo.address?.number},
        {statement: 'Rue', response: personalInfo.address?.street},
        {statement: 'Quartier', response: personalInfo.address?.neighborhood},
        ...(!isNull(personalInfo.address?.borough) ? [{
            statement: 'Arrondissement',
            response: personalInfo.address?.borough
        }] : []),
        {statement: 'Ville', response: personalInfo.address?.city}
    ]

    return (
        <PanelSection title='Tuteur legal'>
            <PanelTable title='Tuteur' data={guardianData} panelColor={color}/>
            <PanelTable title='Addresse' data={addressData} panelColor={color}/>
        </PanelSection>
    )
}

const ExamList = ({data, seeMore, color}: StudentInfoProps) => {

    const {student: {marks}} = data

    const handleClick = () => {
        seeMore && seeMore('1')
    }

    const columns: TableColumnsType<ExamData> = [
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
        <Section title='Performance aux devoirs' more={true} seeMore={handleClick}>
            <CustomTable
                tableProps={{
                    className:'score-table',
                    size:'small',
                    columns: columns as [],
                    dataSource: initExamData(marks),
                    pagination: false
                }}
                color={color}
            />
        </Section>
    )
}

const GraphSection = ({data}: StudentInfoProps) => {

    const {student: {personalInfo, marks}} = data

    const graphData = marks.map((s) => ({
        subject: s.assignment?.subject?.course,
        score: s.obtainedMark
    }))

    //TODO this should be average score
    graphData.push({subject: 'Physique chimie', score: 16})
    graphData.push({subject: 'French', score: 12})
    graphData.push({subject: 'Anglais', score: 18})
    graphData.push({subject: 'Music', score: 15})
    graphData.push({subject: 'Math', score: 13})

    return (
        <Section title='Progression aux examens'>
            <RadarChart data={graphData}  xField='subject' yField='score' color={chooseColor(personalInfo?.firstName as string)} />
        </Section>
    )
}

const SchoolHistory = ({data, color}: StudentInfoProps) => {
    const {student: {enrollments}} = data

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
            align: 'center',
            render: (text) => (<span>{text ? currency(text) : ''}</span>),
        },
    ];

    const historyData: HistoryData[] = enrollments?.map((e) => ({
        dataId: e.classe.id.toString(),
        academicYear: e.academicYear?.academicYear ?? '',
        classeName: e.classe?.name ?? '',
        yearAmount: (e.classe?.monthCost ?? 0) * (monthsBetween(e.academicYear?.startDate, e.academicYear?.endDate) ?? 0),
    })) ?? [];

    return (
        <Section title='Hystorique'>
            <Table
                className='score-table'
                size='small'
                columns={columns}
                dataSource={historyData}
                pagination={false}
                rowKey={(record) => record.dataId}
                components={{
                    header: {
                        cell: (props: HTMLProps<HTMLTableCellElement>) => (
                            <th {...props} style={{...props.style, backgroundColor: color}} />
                        )
                    }
                }}
            />
        </Section>
    )
}

const AttendanceSection = ({data, seeMore, color}: StudentInfoProps) => {

    const { student: { attendances } } = data

    const handleClick = () => {
        seeMore && seeMore('2')
    }

    const attendanceData = attendances?.map((a) => {
        const [tagColor, tagText] = attendanceTag(a.status)

        return {
            statement: setFirstName(fullDay(a.attendanceDate)) as string,
            response: <Tag color={tagColor as 'success'}>{tagText?.toLowerCase()}</Tag>
        };
    }) ?? [];

    return (
        <PanelSection title='Suivis de présence' more={true} seeMore={handleClick}>
            <PanelTable title='Données des présences' data={attendanceData} panelColor={color} />
        </PanelSection>
    )
}

const SchoolColleagues = ({data, seeMore, color}: StudentInfoProps) => {
    
    const [classmates, setClassmates] = useState<Enrollment[]>([])

    const handleClick = () => {
        seeMore && seeMore('3')
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchStudentClassmatesRandomly(data).then(async (res) => {
                if (res?.isSuccess && 'data' in res) {
                    setClassmates(res?.data as Enrollment[])
                }
            }).catch((error) => `Failed to fetch classmates ${error.errorCode}: ${error.message}`)
        }

        fetchData().then()
    }, [data]);

    const handleSeeDetails = (id: string) => {
        redirectTo(`${text.student.group.view.href}${id}`)
    }

    return (
        <Section title='Condisciples' more={true} seeMore={handleClick}>
            <Carousel slidesToShow={3} slidesToScroll={1} dots={false} arrows draggable autoplay>
                {classmates && classmates.map((c, i) => (<div className='classmate-team' key={`${c.student.id}-${i}`}>
                    <div className='scroll-box'>
                        <a onClick={() => handleSeeDetails(c.student.id)}>
                            <div className='avatar'>
                                <Avatar
                                    image={c.student?.personalInfo?.image}
                                    size={{xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100}}
                                    firstText={c.student?.personalInfo?.firstName} lastText={c.student?.personalInfo?.lastName}
                                />
                            </div>
                            <div className='name'>
                                <span>{lowerName(c.student?.personalInfo?.firstName, c.student?.personalInfo?.lastName)}</span>
                            </div>
                        </a>
                        <div className='view__button'>
                            <Button style={{width: '100%', background: color}}>Voir</Button>
                        </div>
                    </div>

                </div>))}
            </Carousel>
        </Section>
    )
}

const HealthData = ({data, color}: StudentInfoProps) => {

    const {student} = data
    const healthCondition: HealthCondition = student.healthCondition !== null ? student.healthCondition : {} as HealthCondition

    const conditions = healthCondition.medicalConditions?.map((condition) => ({
        response: <div className='health'>
            <span>{condition}</span>
            <GiHealthDecrease  className='health-icon decrease' size={25}/>
        </div>
    }))
    const allergies = healthCondition.allergies?.map((allergy) => ({
        response: <div className='health'>
            <span>{allergy}</span>
            <LuBan className='health-icon allergy' size={25} />
        </div>
    }))
    const medications = healthCondition.medications?.map((medication) => ({
        response: <div>{medication}</div>
    }))
    const blood = healthCondition?.bloodType as unknown as keyof typeof BloodType
    const healthData = [
        {statement: 'Groupe Sanguin', response: <AntAvatar style={{backgroundColor: '#4B1E24'}}>{bloodLabel(BloodType[blood])}</AntAvatar>},
        ...(!conditions && !allergies && !medications ? [{response: <div className='health'>
                <span>Etat de santé Normal</span>
                <MdHealthAndSafety className='health-icon' size={35} />
        </div>}] : [])
    ]

    return(
        <PanelSection title='Santé'>
            <PanelTable title='Etat de santé' data={healthData} panelColor={color}/>
            {conditions && (<PanelTable title='Condition Médicale' data={conditions} panelColor={color} />)}
            {allergies && (<PanelTable title='Allergies' data={allergies} panelColor={color} />)}
            {medications && (<PanelTable title='Medicamennt Chronique' data={medications} panelColor={color} />)}
        </PanelSection>
    )
}

const CourseSchedule = ({data}: StudentInfoProps) => {
    const {classe} = data
    const schedules: Schedule[] = classe.schedule !== null ? classe.schedule : []

    const events = schedules.map((schedule: Schedule) => ({
        title: schedule?.course?.course ? schedule?.course?.course : schedule?.designation,
        start: schedule.startTime ? timeToCurrentDatetime(schedule.startTime) : new Date(),
        end: schedule.endTime ? timeToCurrentDatetime(schedule.endTime): new Date(),
        allDay: false
    }))

    console.log('schedules: ', schedules)

    return(
        <Section title={`Emploi du temps: ${setFirstName(fullDay(new Date()))}`}>
            <BigCalendar
                data={events as CalendarEvent}
                views={['day']}
                defaultView='day'
                startDayTime={[8, 0]}
                endDayTime={[14, 0]}
            />
        </Section>
    )
}

const DisciplinaryRecords = ({data, seeMore, color}: StudentInfoProps) => {

    const {student: {personalInfo}} = data
    const reprimands = [] as Reprimand[]
    const values = Object.values(
        reprimands.reduce((acc, curr) => {
            if (!acc[curr.type]) {
                acc[curr.type] = {type: curr.type, value: 0}
            }
            acc[curr.type].value += 1;
            return acc;
        }, {} as Record<string, { type: string; value: number }>)
    )

    const handClick = () => {
        seeMore && seeMore('4')
    }

    return (
        <Section title={`Dossiers disciplinaires de ${setFirstName(personalInfo?.firstName)}`} more={true} seeMore={handClick}>
            {reprimands.length !== 0 ? (<PieChart data={values} />) : (
                <div className='panel-table'>
                    <PanelTable title='Dossiers disciplinaires' data={[{
                        response: (
                            <div className='health'>
                                <span className='big-text'>Aucune réprimande trouvée</span>
                                <GiAchievement className='health-icon' size={100}/>
                            </div>
                        )
                    }]} panelColor={color}/>
                </div>
            )}
        </Section>
    )
}

//TODO add the bar graph for the 5 last exams
/**
 * TODO Add graph pour la progression des notes (trouver la moyenne de note par années et l'afficher)
 * suivi d'un tableau qui classe les élèves par moyenne de notes.
 */

export const StudentInfo = ({enrollment, seeMore, color}: { enrollment: Enrollment, color?: string, seeMore?: (key: string) => void }) => {

    const {classe: {grade}} = enrollment

    const items: ReactNode[] = [
        <IndividualInfo data={enrollment} dataKey='individual-block' color={color}/>,
        ...(grade?.section != SectionType.MATERNELLE && grade?.section != SectionType.PRIMAIRE ? [
            <GraphSection data={enrollment}  dataKey='graph-block' color={color}/>
        ] : []),
        <GuardianBlock data={enrollment} dataKey='guardian-section' color={color} />,
        ...(grade?.section != SectionType.MATERNELLE && grade?.section != SectionType.PRIMAIRE ? [
            <ExamList data={enrollment}  seeMore={seeMore} dataKey='exam-block' color={color}/>
        ] : []),
        <SchoolHistory data={enrollment} seeMore={seeMore}  dataKey='school-history-block' color={color}/>,
        <AttendanceSection data={enrollment} seeMore={seeMore} dataKey='attendance-block' color={color}/>,
        <HealthData data={enrollment} dataKey='health-section' color={color} />,
        <SchoolColleagues data={enrollment} seeMore={seeMore} dataKey='classmates-block' color={color}/>,
        <CourseSchedule data={enrollment} dataKey='schedule-section' color={color} />,
        <DisciplinaryRecords data={enrollment} dataKey='disciplinary-section' color={color} />
    ]

    return (
        <Block items={items}/>
    )
}