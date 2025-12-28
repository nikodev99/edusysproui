import Block from "@/components/view/Block.tsx";
import {Divider, Table, TableColumnsType, Avatar as AntAvatar, Typography, Badge, Card} from "antd";
import {HTMLProps, ReactNode, useEffect, useMemo, useState} from "react";
import {Enrollment, HealthCondition, Schedule} from "@/entity";
import {
    bloodLabel, convertToM, fDate, firstLetter, fullDay, getAge, getCountry,
    chooseColor, isNull, monthsBetween, setFirstName, currency
} from "@/core/utils/utils.ts";
import PanelStat from "@/components/ui/layout/PanelStat.tsx";
import { Table as CustomTable } from "@/components/ui/layout/Table.tsx";
import {Gender} from "@/entity/enums/gender.tsx";
import PanelTable from "@/components/ui/layout/PanelTable.tsx";
import {SectionType} from "@/entity/enums/section.ts";
import {text} from "@/core/utils/text_display.ts";
import {BloodType} from "@/entity/enums/bloodType.ts";
import {MdHealthAndSafety} from "react-icons/md";
import {GiAchievement, GiHealthDecrease} from "react-icons/gi";
import {redirectTo} from "@/context/RedirectContext.ts";
import RadarChart from "@/components/graph/RadarChart.tsx";
import PieChart from "@/components/graph/PieChart.tsx";
import Section from "@/components/ui/layout/Section.tsx";
import PanelSection from "@/components/ui/layout/PanelSection.tsx";
import {ExamData, InfoPageProps} from "@/core/utils/interfaces.ts";
import {initExamData} from "@/entity/domain/score.ts";
import {attendanceTag} from "@/entity/enums/attendanceStatus.ts";
import Tag from "@/components/ui/layout/Tag.tsx";
import {LuBan} from "react-icons/lu";
import {StudentCarousel} from "@/components/common/StudentCarousel.tsx";
import {ScheduleCalendar} from "@/components/common/ScheduleCalendar.tsx";
import Datetime from "@/core/datetime.ts";
import {LinkToStudent} from "@/core/shared/sharedEnums.ts";
import {useStudentRepo} from "@/hooks/actions/useStudentRepo.ts";
import {useReprimandRepo} from "@/hooks/actions/useReprimandRepo.ts";
import {ReprimandType} from "@/entity/enums/reprimandType.ts";

type StudentInfoProps = InfoPageProps<Enrollment>

interface HistoryData {
    dataId: string
    academicYear: string
    classeName: string
    yearAmount: number
}

const IndividualInfo = ({infoData, color}: StudentInfoProps) => {

    const {student, personalInfo, healthCondition} = useMemo(() => ({
        student: infoData?.student,
        personalInfo: infoData?.student?.personalInfo,
        healthCondition: infoData?.student?.healthCondition,
    }), [infoData])

    const [nationality, setNationality] = useState<string>()
    const country = getCountry(personalInfo?.nationality as string)
    const studentAge = getAge(personalInfo?.birthDate as [number, number, number])
    const birthDay = fDate(personalInfo?.birthDate)
    const individualData = [
        {statement: 'Genre', response: firstLetter(personalInfo?.gender)},
        {statement: 'Nom(s) et prénom(s) du père', response: setFirstName(student?.dadName)},
        {statement: 'Nom(s) et prénom(s) de la mère', response: setFirstName(student?.momName)},
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
                <PanelStat title={healthCondition?.height} subTitle='cm' media={convertToM(healthCondition?.height as number)} desc='Taille'/>
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

const GuardianBlock = ({infoData, color}: StudentInfoProps) => {
    const {personalInfo, linkToStudent, jobTitle, company} = useMemo(() => ({
        personalInfo: infoData?.student?.guardian?.personalInfo,
        linkToStudent: infoData?.student?.guardian?.linkToStudent,
        jobTitle: infoData?.student?.guardian?.jobTitle,
        company: infoData?.student?.guardian?.company,
    }), [infoData?.student?.guardian])

    const guardianData = [
        {statement: 'Nom(s)', response: personalInfo?.lastName},
        {statement: 'Prénoms(s)', response: personalInfo?.firstName},
        {statement: 'Téléphone', response: personalInfo?.telephone},
        ...(isNull(personalInfo?.mobile) ? [] : [{statement: 'Mobile', response: personalInfo?.mobile}]),
        {statement: '@', response: personalInfo?.emailId},
        ...(isNull(linkToStudent) ? [] : [{statement: 'Lien de parenté', response: LinkToStudent[linkToStudent]}])
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

    const professional = [
        ...(isNull(company) ? [] : [{statement: 'Employeur', response: company}]),
        ...(isNull(jobTitle) ? [] : [{statement: 'Poste', response: jobTitle}])
    ]

    return (
        <PanelSection title='Tuteur legal'>
            <PanelTable title='Tuteur' data={guardianData} panelColor={color}/>
            <PanelTable title='Adresse' data={addressData} panelColor={color}/>
            {professional && professional?.length > 0 && (
                <PanelTable title='Emploi' data={professional} panelColor={color}/>
            )}
        </PanelSection>
    )
}

const ExamList = ({infoData, seeMore, color}: StudentInfoProps) => {

    const marks = useMemo(() => infoData?.student?.marks, [infoData?.student?.marks])

    const handleClick = () => {
        seeMore && seeMore('1')
    }

    const columns: TableColumnsType<ExamData> = [
        {
            title: "Date",
            dataIndex: 'examDate',
            key: 'examDate',
            align: 'center',
            render: (text) => (<span>{fDate(text, 'DD/MM/YYYY')}</span>),
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
            align: 'center',
            render: (text, score) => (<span>{score.subject ?? text}</span>),
        },
        {
            title: "Note",
            dataIndex: 'obtainedMark',
            key: 'obtainedMark',
            align: 'center',
            render: (text: number) => <Typography.Title level={4}>
                {text}
                <Badge color={text >= 15 ? 'green' : text >= 10 ? 'gold' : 'red' } />
            </Typography.Title>
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
                    pagination: false,
                    rowKey: 'examId'
                }}
                color={color}
            />
        </Section>
    )
}

const GraphSection = ({infoData}: StudentInfoProps) => {

    const {personalInfo, marks} = useMemo(() => ({
        personalInfo: infoData?.student?.personalInfo,
        marks: infoData?.student?.marks,
    }), [infoData?.student?.marks, infoData?.student?.personalInfo])

    const graphData = marks?.map((s) => ({
        subject: s.assignment?.subject?.course,
        score: s.obtainedMark
    }))

    if (graphData && graphData?.length === 0) {
        graphData.push({subject: 'Physique chimie', score: 16})
        graphData.push({subject: 'French', score: 12})
        graphData.push({subject: 'Anglais', score: 18})
        graphData.push({subject: 'Music', score: 15})
        graphData.push({subject: 'Math', score: 13})
    }

    return (
        <Section title='Progression aux examens'>
            <RadarChart data={graphData}  xField='subject' yField='score' color={chooseColor(personalInfo?.firstName as string)} />
        </Section>
    )
}

const SchoolHistory = ({infoData, color}: StudentInfoProps) => {
    const {enrollments} = useMemo(() => ({
        enrollments: infoData?.student?.enrollments
    }), [infoData?.student?.enrollments])

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
            render: (text) => {
                if (text)
                    return(<span>{text ? currency(text) : ''}</span>)
            },
        },
    ];

    const historyData: HistoryData[] = enrollments?.map((e) => ({
        dataId: e.classe.id.toString(),
        academicYear: e.academicYear?.academicYear ?? '',
        classeName: e.classe?.name ?? '',
        yearAmount: (e.classe?.monthCost || 0) * (monthsBetween(e.academicYear?.startDate, e.academicYear?.endDate) || 0),
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

const AttendanceSection = ({infoData, seeMore, color}: StudentInfoProps) => {

    const { attendances } = useMemo(() => ({
        attendances: infoData?.student?.attendances
    }), [infoData?.student?.attendances])

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

const SchoolColleagues = ({infoData, seeMore, color}: StudentInfoProps) => {
    const [classmates, setClassmates] = useState<Enrollment[]>([])
    const {useGetRandomStudentClassmate} = useStudentRepo()
    const {data, isLoading, isPending, isPaused} = useGetRandomStudentClassmate(
        infoData?.student?.id as string,
        infoData?.classe?.id as number
    )

    useEffect(() => {
        setClassmates(data || [])
    }, [data]);

    const handleClick = () => {
        seeMore && seeMore('3')
    }

    const handleSeeDetails = (id: string) => {
        redirectTo(`${text.student.group.view.href}${id}`)
    }

    return (
        <StudentCarousel
            students={classmates ?? [] as Enrollment[]}
            seeMore={handleClick}
            redirectTo={handleSeeDetails}
            color={color}
            loading={isLoading || isPending || isPaused}
        />
    )
}

const HealthData = ({infoData, color}: StudentInfoProps) => {

    const student = useMemo(() => infoData?.student, [infoData?.student])

    const healthCondition: HealthCondition | undefined = student?.healthCondition

    const conditions = healthCondition?.medicalConditions?.map((condition) => ({
        response: <div className='health'>
            <span>{condition}</span>
            <GiHealthDecrease  className='health-icon decrease' size={25}/>
        </div>
    }))
    const allergies = healthCondition?.allergies?.map((allergy) => ({
        response: <div className='health'>
            <span>{allergy}</span>
            <LuBan className='health-icon allergy' size={25} />
        </div>
    }))
    const medications = healthCondition?.medications?.map((medication) => ({
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
        <>
            {healthCondition && (
                <PanelSection title='Santé'>
                    <PanelTable title='Etat de santé' data={healthData} panelColor={color}/>
                    {conditions && (<PanelTable title='Condition Médicale' data={conditions} panelColor={color}/>)}
                    {allergies && (<PanelTable title='Allergies' data={allergies} panelColor={color}/>)}
                    {medications && (<PanelTable title='Medicamennt Chronique' data={medications} panelColor={color}/>)}
                </PanelSection> )
            }
        </>
    )
}

const CourseSchedule = ({infoData}: StudentInfoProps) => {
    const classe = useMemo(() => infoData?.classe, [infoData?.classe])
    const schedules: Schedule[] = classe?.schedule !== null ? classe?.schedule : []

    return(
        <Section title={`Emploi du temps: ${Datetime.now().fullDay()}`}>
            <ScheduleCalendar
                views={['day']}
                eventSchedule={schedules}
                height={300}
                hasTeacher
            />
        </Section>
    )
}

const DisciplinaryRecords = ({infoData, seeMore, color}: StudentInfoProps) => {
    const {useGetAllStudentReprimand} = useReprimandRepo()
    const personalInfo = useMemo(() => infoData?.student?.personalInfo, [infoData?.student?.personalInfo])
    const reprimands = useGetAllStudentReprimand(infoData?.student?.id)

    const values = reprimands ? Object.values(
        reprimands.reduce((acc, curr) => {
            if (!acc[curr.type]) {
                acc[curr.type] = {name: ReprimandType[curr.type], value: 0}
            }
            acc[curr.type].value += 1;
            return acc;
        }, {} as Record<string, { name: string; value: number }>)
    ) : undefined

    const handClick = () => {
        seeMore && seeMore('4')
    }

    return (
        <Section title={`Dossiers disciplinaires de ${setFirstName(personalInfo?.firstName)}`} more={true} seeMore={handClick}>
            {reprimands?.length !== 0 && values ? (<Card variant={'borderless'}>
                <Card.Meta title={`Total réprimande: ${values?.length}`} style={{textAlign: 'center', marginTop: '5px'}} />
                    <PieChart
                        data={values}
                        height={250}
                        plainColor
                        hasLabel
                        hasLegend
                        defaultColor={color}
                    />
                </Card>) : (
                <div className='panel-table'>
                    <PanelTable title='Dossiers disciplinaires' data={[{
                        response: (
                            <div className='health'>
                                <span className='big-text'>Aucune réprimande trouvée</span>
                                <GiAchievement className='health-icon' size={100}/>
                            </div>
                        ),
                        tableRow: true
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
    const classe = useMemo(() => enrollment?.classe, [enrollment])
    const sections = [SectionType.MATERNELLE, SectionType.PRIMAIRE, SectionType.GARDERIE, SectionType.CRECHE]

    const items: ReactNode[] = [
        <IndividualInfo infoData={enrollment} dataKey='individual-block' color={color}/>,
        ...(!sections.includes(SectionType[classe?.grade?.section as keyof typeof SectionType]) ? [
            <GraphSection infoData={enrollment} dataKey='graph-block' color={color}/>
        ] : []),
        <GuardianBlock infoData={enrollment} dataKey='guardian-section' color={color} />,
        ...(!sections.includes(SectionType[classe?.grade?.section as keyof typeof SectionType]) ? [
            <ExamList infoData={enrollment} seeMore={seeMore} dataKey='exam-block' color={color}/>
        ] : []),
        <SchoolHistory infoData={enrollment} seeMore={seeMore} dataKey='school-history-block' color={color}/>,
        <AttendanceSection infoData={enrollment} seeMore={seeMore} dataKey='attendance-block' color={color}/>,
        <HealthData infoData={enrollment} dataKey='health-section' color={color} />,
        <SchoolColleagues infoData={enrollment} seeMore={seeMore} dataKey='classmates-block' color={color}/>,
        <CourseSchedule infoData={enrollment} dataKey='schedule-section' color={color} />,
        <DisciplinaryRecords infoData={enrollment} dataKey='disciplinary-section' seeMore={seeMore} color={color} />
    ]

    return (
        <Block items={items}/>
    )
}