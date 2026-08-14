import {GenderCounted, InfoPageProps} from "@/core/utils/interfaces.ts";
import {Classe, Teacher, Individual, ClasseRanking} from "@/entity";
import Block from "@/components/view/Block.tsx";
import {ReactNode} from "react";
import Section from "@/components/ui/layout/Section.tsx";
import PanelStat from "@/components/ui/layout/PanelStat.tsx";
import {findPercent, setFirstName, setGender} from "@/core/utils/utils.ts";
import {text} from "@/core/utils/text_display.ts";
import PanelTable from "@/components/ui/layout/PanelTable.tsx";
import {SuperWord} from "@/core/utils/tsxUtils.tsx";
import {Avatar as AntAvatar, Progress, Skeleton} from "antd";
import {IndividualDescription} from "@/components/ui/layout/IndividualDescription.tsx";
import PanelSection from "@/components/ui/layout/PanelSection.tsx";
import {AvatarTitle} from "@/components/ui/layout/AvatarTitle.tsx";
//import {StudentCarousel} from "@/components/common/StudentCarousel.tsx";
import {AttendanceStatus, getColors} from "@/entity/enums/attendanceStatus.ts";
import {ShapePieChart} from "@/components/graph/ShapePieChart.tsx";
import VoidData from "@/components/view/VoidData.tsx";
import {TeacherList} from "@/components/common/TeacherList.tsx";
import {ScheduleCalendar} from "@/components/ui-kit-schedule/components/ScheduleCalendar.tsx";
import {useScoreRepo} from "@/components/../hooks/actions/useScoreRepo.ts";
import {useAttendanceRepo} from "@/components/../hooks/actions/useAttendanceRepo.ts";
import {GradeCard} from "@/components/ui-kit-org";
import {datehelper} from "@/core/helpers/DateHelpers.ts";
import {stringhelper} from "@/core/helpers/StringHelper.ts";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {CourseTypeEnum} from "@/entity/domain/course.ts";
import {BestStudentList} from "@/components/common/BestStudentList.tsx";
import {PermissionType} from "@/pages/classe_subject/ClasseViewPage.tsx";

type ClasseInfoProps = InfoPageProps<Classe, PermissionType> & {
    studentCount?: GenderCounted | null
    totalStudents?: number
};

const ClasseInfoData = ({infoData, color, studentCount, totalStudents, seeMore, hasPermission}: ClasseInfoProps) => {
    const {toViewStudent, toViewTeacher} = useRedirect()

    if (!infoData)
        return <PanelSection title={"Profile Classe"}><Skeleton active paragraph={{ rows: 4 }} /></PanelSection>

    const {principalTeacher, principalStudent, principalCourse} = infoData

    const classeTeachers = principalTeacher?.principalTeacher?.courses?.map(c => c?.affiliation?.teacher)

    const studentAverageAge = studentCount?.totalAverageAge
    const maxAge = studentCount?.genders ? Math.max(...studentCount.genders.map(group => group.ageAverage)) : 1
    const teacher: Teacher | null = (Array.isArray(classeTeachers) && classeTeachers.length > 0)
        ? classeTeachers.filter(t => t?.courses?.[0]?.id === principalCourse?.id)[0]
        : null;

    const redirectLink = (id?: string): string => {
        return `${text.teacher.group.view.href}${id}`
    }

    const canViewTeacher = (hasPermission as PermissionType).canViewTeacher
    const canViewStudent = (hasPermission as PermissionType).canViewStudent

    const handleClick = () => {
        seeMore && seeMore('1')
    }

    studentCount?.genders?.map(s => console.log({count: s.count, word: stringhelper.setPlural({word: text.student.label, count: s.count})}))

    return(
        <Section title={<SuperWord input={`Profile de ${infoData?.name}`} />} more={true} seeMore={handleClick}>
            <div className='panel'>
                {studentCount && studentCount?.genders?.map((s, i) => (
                    <PanelStat
                        key={i}
                        title={s.count}
                        subTitle={stringhelper.setPlural({word: text.student.label, count: s.count})}
                        round={<Progress percent={findPercent(s.count, totalStudents!) as number} type='circle' size={35} strokeColor={color} />}
                        desc={stringhelper.setPlural({word: setFirstName(setGender(s.gender)), count: s.count})}
                    />
                ))}
                {studentAverageAge && <PanelStat
                    title={studentAverageAge.toFixed(1)}
                    subTitle={studentAverageAge > 1 ? 'ans' : 'an'}
                    round={<Progress percent={findPercent(studentAverageAge, maxAge) as number} type='circle' size={35} strokeColor={color} />}
                    desc='Age Moyen'
                />}
            </div>
            <div className="panel-table">
                <IndividualDescription
                    personalInfo={principalTeacher?.principalTeacher?.personalInfo as Individual}
                    show={principalTeacher === null || principalTeacher?.principalTeacher === undefined}
                    color={color}
                    titles={{panel: 'Responsable de classe'}}
                    onRedirect={(principalTeacher?.current && canViewTeacher) ? () => toViewTeacher(principalTeacher?.principalTeacher?.id as string) : undefined}
                    period={principalTeacher?.startPeriod as number[]}
                    isCurrent={principalTeacher?.current}
                />
                <IndividualDescription
                    personalInfo={principalStudent?.principalStudent?.personalInfo as Individual}
                    show={principalStudent === null || principalStudent === undefined}
                    color={color}
                    titles={{panel: 'Chef de Classe'}}
                    onRedirect={(principalStudent?.current && canViewStudent) ? () => toViewStudent(principalStudent?.principalStudent?.id as string) : undefined}
                    period={principalStudent?.startPeriod as number[]}
                    isCurrent={principalStudent?.current}
                />
                {principalCourse && <PanelTable title='Matière Principale' data={[
                    {statement: 'Matière principale', response: <p style={{fontSize: '15px', textTransform: 'uppercase', }}>
                        <span style={{textShadow: `1px 1px 2px ${color}`}}>
                            {principalCourse?.course}
                        </span>
                        <AntAvatar size='small' shape='square' style={{marginLeft: '5px', background: 'black', color: color}}>
                            {principalCourse?.abbr}
                        </AntAvatar>
                    </p>},
                    {statement: 'Discipline', response: CourseTypeEnum[principalCourse?.courseType]},
                    ...(teacher ? [{
                        statement: 'Professeur',
                        response: teacher && <AvatarTitle
                            lastName={teacher?.personalInfo?.lastName}
                            firstName={teacher?.personalInfo?.firstName}
                            image={teacher?.personalInfo?.image}
                            gap={5} size={35}
                        />,
                        link: redirectLink(teacher?.id)
                    }] : [])
                ]} panelColor={color} />}
            </div>
        </Section>
    )
}

const PlanningInfo = ({infoData, resourceYear}: ClasseInfoProps) => {
    const {grade} = infoData
    const day = datehelper.getDateReference(resourceYear?.startDate, resourceYear?.endDate)

    if (!infoData)
        return <PanelSection title={'Planning de la classe'}><Skeleton active paragraph={{ rows: 4 }} /></PanelSection>

    return(
        <PanelSection title={`Planning de la classe ${day.format('MMM-YY')}`}>
            {!grade ? <GradeCard data={grade} size='small' onlyPlanning={true} /> : <VoidData />}
        </PanelSection>
    )
}

const ClasseSchedule = ({infoData, seeMore}: ClasseInfoProps) => {
    const {schedule} = infoData

    if (!infoData)
        return (
            <PanelSection title={'Emploi du temps'}>
                <Skeleton active paragraph={{ rows: 4 }} />
            </PanelSection>
        )

    const handleSeeMore = ()=> {
        seeMore && seeMore('2')
    }

    return(
        <Section title="Emploi du temps" seeMore={handleSeeMore} more={true}>
            <ScheduleCalendar
                eventSchedule={schedule}
                views={['day']}
                height={500}
                toolbar={false}
            />
        </Section>
    )
}

//TODO Je ne trouve pas l'intérêt de mettre quelque élèves ici

const ClasseBestStudent = ({infoData, academicYear, color, hasPermission}: ClasseInfoProps) => {
    const {useGetClasseBestStudents} = useScoreRepo()
    const bestStudents = useGetClasseBestStudents(infoData?.id, academicYear as string)

    if (!infoData)
        return <Section title={'Meilleurs élève de la classe'}><Skeleton active paragraph={{ rows: 4 }} /></Section>

    return(
        <BestStudentList
            bestStudents={bestStudents ?? []}
            sectionTitles={{
                sectionTitle: (c: ClasseRanking) => <SuperWord input={`Performance des élèves de ${c.classeName}`} isSpan />,
                bestTableTitle: 'Meilleurs élève de la classe',
                poorTableTitle: 'Étudiant nécessitant un suivi'
            }}
            hasPermission={(hasPermission as PermissionType).canViewStudent}
            color={color}
        />
    )
}

const ClasseTeachers = ({infoData, seeMore, hasPermission}: ClasseInfoProps) => {
    const classeTeachers = infoData?.classeTeachers?.map(t => t.teacher)

    if (!infoData || (classeTeachers.length && classeTeachers[0].id === undefined))
        return <Section title={'Enseignants de la classe'}><Skeleton active paragraph={{ rows: 4 }} /></Section>

    const handleClick = () => {
        seeMore && seeMore('6')
    }

    return(
        <Section title={'Enseignants de la classe'} more={true} seeMore={handleClick}>
            <TeacherList
                teachers={classeTeachers}
                hasPermission={(hasPermission as PermissionType).canViewTeacher}
            />
        </Section>
    )
}

const ClasseAttendanceGraph = ({infoData, seeMore, academicYear}: ClasseInfoProps) => {
    const {useGetClasseAttendanceCount} = useAttendanceRepo()
    const {data: classeAttendances} = useGetClasseAttendanceCount(infoData?.id, academicYear as string)

    const graphData = classeAttendances && classeAttendances?.statusCount ? Object.entries(classeAttendances?.statusCount).map(([key, value]) => ({
        name: AttendanceStatus[key as unknown as keyof typeof AttendanceStatus],
        value: value as number,
        color: getColors(AttendanceStatus[key as unknown as keyof typeof AttendanceStatus])
    })): []

    if (!infoData)
        return <Section title={'Taux de présence'}><Skeleton active paragraph={{ rows: 4 }} /></Section>

    const handleClick = () => {
        seeMore && seeMore('3')
    }

    return(
        <Section title='Taux de présence' more={true} seeMore={handleClick}>
            {classeAttendances && classeAttendances.statusCount ? <ShapePieChart
                data={graphData as []}
                height={280}
                innerRadius={40}
                outerRadius={80}
                hasLegend={true}
            />: <VoidData />}
        </Section>
    )
}

export const ClasseInfo = (infoData: ClasseInfoProps) => {

    const items: ReactNode[] = [
        <ClasseInfoData {...infoData} />,
        <PlanningInfo {...infoData} />,
        <ClasseTeachers {...infoData} />,
        <ClasseSchedule {...infoData} />,
        //<ClasseStudent {...infoData} />,
        <ClasseBestStudent {...infoData} />,
        <ClasseAttendanceGraph {...infoData} />
    ]

    return (
        <Block items={items} />
    )
}