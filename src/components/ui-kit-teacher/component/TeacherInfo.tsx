import Section from "@/components/ui/layout/Section.tsx";
import Block from "@/components/view/Block.tsx";
import PanelSection from "@/components/ui/layout/PanelSection.tsx";
import PanelTable from "@/components/ui/layout/PanelTable.tsx";
import {InfoPageProps, Moment, ReprimandData} from "@/core/utils/interfaces.ts";
import {Department, StaffRole, Teacher} from "@/entity";
import {
    getDistinctArray,
    cLowerName,
    setTime
} from "@/core/utils/utils.ts";
import {useMemo} from "react";
import {Flex, Skeleton, TableColumnsType, Tag} from "antd";
import {Timeline} from "@/components/graph/Timeline.tsx";
import {Table as CustomTable} from "@/components/ui/layout/Table.tsx";
import {ReprimandType} from "@/entity/enums/reprimandType.ts";
import {ShapePieChart} from "@/components/graph/ShapePieChart.tsx";
import {PieChartDataEntry} from "@/components/ui/ui_interfaces.ts";
import {useGlobalStore} from "@/core/global/store.ts";
import {DatedListItem} from "@/components/ui/layout/DatedListItem.tsx";
import {DepartmentDesc} from "@/components/common/DepartmentDesc.tsx";
import Datetime from "@/core/datetime.ts";
import {useScoreRepo} from "@/hooks/actions/useScoreRepo.ts";
import {MarksHistogram} from "@/components/common/MarksHistogram.tsx";
import {TeacherIndividual} from "@/components/common/TeacherIndividual.tsx";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {ScheduleCalendar} from "@/components/ui-kit-schedule/components/ScheduleCalendar.tsx";
import {useDepartmentRepo} from "@/hooks/actions/useDepartmentRepo.ts";
import {statusConfig} from "@/entity/domain/courseProgram.ts";
import {LuCircleCheck, LuClock} from "react-icons/lu";
import {useReprimandRepo} from "@/hooks/actions/useReprimandRepo.ts";
import {datehelper} from "@/core/helpers/DateHelpers.ts";
import {useAssignmentRepo} from "@/hooks/actions/useAssignmentRepo.ts";

type TeacherInfo = InfoPageProps<Teacher> & {readonly?: boolean}

export const IndividualInfo = ({infoData, color}: TeacherInfo) => {
    if (!infoData)
        return <PanelSection title={"Informations Générales sur l'enseignant"}><Skeleton active paragraph={{ rows: 4 }} /></PanelSection>
    const {personalInfo} = infoData ?? {}

    return(
        <PanelSection title={
            <div className='name__title'>
                <h3 className='name'>{`${personalInfo?.firstName} ${personalInfo?.lastName}`}</h3>
                <p className='subtitle'>Informations Générales sur l'enseignant</p>
            </div>
        }>
            <TeacherIndividual teacher={infoData} color={color} />
        </PanelSection>
    )
}

export const ProsInfo = ({infoData, color, isSelf, readonly = false}: TeacherInfo) => {
    if (!infoData)
        return <PanelSection title={"Informations Professionnelles"}><Skeleton active paragraph={{ rows: 4 }} /></PanelSection>

    const {courses, classes, contract} = infoData

    const isHourly = !!contract?.salaryByHour

    const employmentData = [
        //TODO adding prof job id {incorporating reference in personalInfo} and position in the database
        {statement: 'Référence', response: infoData?.personalInfo?.reference},
        {statement: "Role dans établissement", response: StaffRole[infoData?.contract?.role]},
        ...(infoData?.contract?.jobTitle ? [{statement: 'Position', response: infoData?.contract?.jobTitle}] : []),
        ...(!readonly ? [{statement: 'Date d\'Embauche', response: Datetime.of(contract?.startDate as number[]).fDate()}] : []),
        {statement: 'Ancienneté', response: datehelper.timeAgo(contract?.startDate as Moment)},
        ...(!readonly && isSelf ? [{statement: `Salaire par ${isHourly ? 'heure' : 'mois'}`, response: isHourly ? contract?.salaryByHour: contract?.monthlySalary}] : [])
    ]

    const courseTaught = [
        {response: <Flex wrap gap={.5} justify='end' style={{padding: '10px'}}>
                {courses?.map((c, i) => <Tag key={i}>{c?.course?.abbr}</Tag>)}
        </Flex>, tableRow: true}
    ]

    const classeTaught = [
        {response: <Flex wrap gap={.5} justify='end' style={{padding: '10px'}}>
                {classes?.map((c, i) => <Tag key={i}>{c.classe?.name}</Tag>)}
        </Flex>, tableRow: true}
    ]

    return(
        <PanelSection title="Informations Professionnelles">
            <PanelTable title='Position' data={employmentData} panelColor={color}/>
            {courses && courses?.length > 0 ? <PanelTable title='Cours' data={courseTaught} panelColor={color}/> : undefined}
            {!readonly && classes && classes?.length > 0 ? <PanelTable title='Classes' data={classeTaught} panelColor={color}/> : undefined}
        </PanelSection>
    )
}

const CalendarSection = ({infoData, seeMore, academicYear}: TeacherInfo) => {
    const {useGetTeacherSchedules} = useTeacherRepo()
    const {data: schedules, isLoading, isFetching} = useGetTeacherSchedules(infoData?.id as string, academicYear as string, !(infoData?.courses && infoData?.courses?.length > 0))

    if (!infoData || !academicYear || !schedules || isLoading || isFetching)
        return <Section title='Informations sur l’emploi du temps'><Skeleton active paragraph={{ rows: 4 }} /></Section>

    const handleClick = () => {
        seeMore && seeMore('1')
    }

    return(
        <Section title='Informations sur l’emploi du temps' more={true} seeMore={handleClick}>
            <ScheduleCalendar
                views={['day']}
                eventSchedule={schedules}
                height={300}
            />
        </Section>
    )
}

export const MarkMean = ({infoData, color}: TeacherInfo) => {
    const {useGetAllTeacherMarks} = useScoreRepo()
    const {data: fetchedMarks, isLoading, isFetching} = useGetAllTeacherMarks(infoData?.personalInfo?.id as number)

    if (!infoData || !fetchedMarks || isLoading || isFetching)
        return <Section title='Moyenne des notes'><Skeleton active paragraph={{ rows: 4 }} /></Section>

    return(
        <Section title='Moyenne des notes'>
            <MarksHistogram
                scores={fetchedMarks}
                isLoading={isLoading || isFetching}
                color={color as string}
            />
        </Section>
    )
}

const DepartmentInfo = ({infoData, color}: TeacherInfo) => {

    //TODO the value of the primary department code should be in the settings
    const primaryDepartmentCode = useGlobalStore.use.primaryDepartment()
    const {useGetDepartmentByCode} = useDepartmentRepo()
    const primary = useMemo(() => primaryDepartmentCode, [primaryDepartmentCode])
    const fetchedDepartment = useGetDepartmentByCode(primary, !infoData.courses || infoData.courses?.length === 0)

    const departments = useMemo(() => {
        let settingDepartments: Department[];
        if (infoData.courses && infoData.courses?.length !== 0) {
            settingDepartments =  Array.from(
                new Set(infoData.courses?.map((course) => course?.course.department))
            ) as Department[]
            
        }else {
            settingDepartments = [fetchedDepartment]
        }

        return getDistinctArray(settingDepartments, d => d?.id)
    }, [fetchedDepartment, infoData.courses])

    if (!infoData || !departments)
        return <Section title='Department'><Skeleton active paragraph={{ rows: 4 }} /></Section>

    return(
        <>
            {departments?.map((department: Department, index) => (
                <div key={department?.id + `${index}`}>
                    <DepartmentDesc department={department} color={color} />
                </div>
            ))}
        </>
    )
}

const LessonPlan = ({infoData, color, seeMore}: TeacherInfo) => {
    if (!infoData || !infoData?.courseProgram)
        return <PanelSection title='Plans de cours'><Skeleton active paragraph={{ rows: 4 }} /></PanelSection>

    const {courseProgram} = infoData

    const items = courseProgram?.flat().map((unit) => {
        const cfg = statusConfig(unit?.timing?.status);
        const dots = unit?.timing.status === 'COMPLETED' ? <LuCircleCheck style={{ color: '#52c41a' }} /> : <LuClock style={{ color: color }} />;
        return {
            color: unit?.timing.status === 'COMPLETED' ? 'green' : 'blue',
            dot: dots,
            children: (
                <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', gap: 5}}>
                        <strong>{unit.name}</strong>
                        <div>
                            <Tag color={color}>{unit?.classeName}</Tag>
                            <Tag color={cfg.color}>{cfg.label}</Tag>
                        </div>
                    </div>
                    <ul style={{ marginTop: 5, paddingLeft: 10 }}>
                        {unit.topic.map((t, i) => (
                            <li key={i} style={{ color: '#8c8c8c', fontSize: 13 }}>
                                {t.title}
                            </li>
                        ))}
                    </ul>
                </div>
            ),
        };
    });

    const handleClick = () => {
        seeMore && seeMore('2')
    }

    return(
        <PanelSection title='Plans de cours' more={true} seeMore={handleClick}>
            <PanelTable ps={true} title='Année 2024-2025' data={items.length > 0 ? [
                {response: <Timeline items={items} rootClassName='timeline' />, tableRow: true}
            ]: []} panelColor={color} />
        </PanelSection>
    )
}

const StudentReprimanded = ({infoData, color, seeMore}: TeacherInfo) => {
    const {personalInfo} = infoData

    const {useGetSomeStudentReprimandByTeacher} = useReprimandRepo()
    const studentReprimanded = useGetSomeStudentReprimandByTeacher(personalInfo?.id as number)

    if (!infoData || !studentReprimanded)
        return <Section title='Liste des élèves réprimandé'><Skeleton active paragraph={{ rows: 4 }} /></Section>

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
    const {useGetTeacherClasseStudentNumber} = useTeacherRepo()
    const countFetched = useGetTeacherClasseStudentNumber(infoData.id as string)

    if (!infoData || !countFetched)
        return <Section title='Liste des élèves réprimandé'><Skeleton active paragraph={{ rows: 4 }} /></Section>

    const entryData: PieChartDataEntry[] = countFetched?.map(c => ({
        name: c.classe,
        value: c.count
    })) as []

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

const AssignmentPlan = ({infoData,color, seeMore, isSelf}: TeacherInfo) => {
    const { personalInfo } = infoData
    const { useGetSomeTeacherAssignments } = useAssignmentRepo()
    const { data: assignments } = useGetSomeTeacherAssignments(personalInfo.id as number)

    if (!infoData || !assignments)
        return <PanelSection title='Suivi des devoirs'><Skeleton active paragraph={{ rows: 4 }} /></PanelSection>

    const handleClick = () => {
        seeMore && seeMore('3')
    }

    return(
        <PanelSection title='Suivi des devoirs' more={true} seeMore={handleClick}>
            <PanelTable title='Les devoirs à venir' ps={true} data={[{
                response: <DatedListItem
                    dataSource={assignments?.map(a => (
                        {
                            date: Datetime?.of(a?.examDate as number[]).fDate(),
                            startTime: setTime(a?.startTime as number[]),
                            endTime: setTime(a?.endTime as number[]),
                            title: isSelf ? <a href="#">{a?.examName}</a> : <span>{a?.examName}</span>,
                            description: <Tag>{`${a?.subject?.course} - ${a?.classe?.name}`}</Tag>
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