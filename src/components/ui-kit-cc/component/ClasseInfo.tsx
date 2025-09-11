import {GenderCounted, InfoPageProps} from "../../../core/utils/interfaces.ts";
import {Classe, Teacher, Individual} from "../../../entity";
import Block from "../../view/Block.tsx";
import {ReactNode} from "react";
import Section from "../../ui/layout/Section.tsx";
import PanelStat from "../../ui/layout/PanelStat.tsx";
import {findPercent, setFirstName, setGender} from "../../../core/utils/utils.ts";
import {text} from "../../../core/utils/text_display.ts";
import PanelTable from "../../ui/layout/PanelTable.tsx";
import {SuperWord} from "../../../core/utils/tsxUtils.tsx";
import {Avatar as AntAvatar, Progress} from "antd";
import {IndividualDescription} from "../../ui/layout/IndividualDescription.tsx";
import PanelSection from "../../ui/layout/PanelSection.tsx";
import {AvatarTitle} from "../../ui/layout/AvatarTitle.tsx";
//import {StudentCarousel} from "../../common/StudentCarousel.tsx";
import {AttendanceStatus, getColors} from "../../../entity/enums/attendanceStatus.ts";
import {ShapePieChart} from "../../graph/ShapePieChart.tsx";
import VoidData from "../../view/VoidData.tsx";
import {TeacherList} from "../../common/TeacherList.tsx";
import {BestScoredTable} from "../../common/BestScoredTable.tsx";
import {ScheduleCalendar} from "../../common/ScheduleCalendar.tsx";
import {useScoreRepo} from "../../../hooks/actions/useScoreRepo.ts";
import {useAttendanceRepo} from "../../../hooks/actions/useAttendanceRepo.ts";
import {GradeCard} from "../../ui-kit-org";

type ClasseInfoProps = InfoPageProps<Classe> & {
    studentCount?: GenderCounted | null
    totalStudents?: number
};

const ClasseInfoData = ({infoData, color, studentCount, totalStudents, seeMore}: ClasseInfoProps) => {
    const {principalTeacher, principalStudent, principalCourse, classeTeachers} = infoData

    const studentAverageAge = studentCount?.totalAverageAge
    const maxAge = studentCount?.genders ? Math.max(...studentCount.genders.map(group => group.ageAverage)) : 1
    const teacher: Teacher | null = (Array.isArray(classeTeachers) && classeTeachers.length > 0)
        ? classeTeachers.filter(t => t?.courses?.[0]?.id === principalCourse?.id)[0]
        : null;

    const redirectLink = (id?: string): string => {
        return `${text.teacher.group.view.href}${id}`
    }

    const handleClick = () => {
        seeMore && seeMore('1')
    }

    return(
        <Section title={<SuperWord input={`Profile de ${infoData?.name}`} />} more={true} seeMore={handleClick}>
            <div className='panel'>
                {studentCount && studentCount?.genders?.map((s, i) => (
                    <PanelStat
                        key={i}
                        title={s.count}
                        subTitle={`${text.student.label}${s.count > 1 ? 's' : ''}`}
                        round={<Progress percent={findPercent(s.count, totalStudents!) as number} type='circle' size={35} strokeColor={color} />}
                        desc={setFirstName(setGender(s.gender)) + `${s.count > 1 ? 's' : ''}`}
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
                    redirectLink={redirectLink(principalTeacher?.principalTeacher?.id)}
                    period={principalTeacher?.startPeriod as number[]}
                    isCurrent={principalTeacher?.current}
                />
                <IndividualDescription
                    personalInfo={principalStudent?.principalStudent?.personalInfo as Individual}
                    show={principalStudent === null || principalStudent === undefined}
                    color={color}
                    titles={{panel: 'Chef de Classe'}}
                    redirectLink={`${text.student.group.view.href}${principalStudent?.principalStudent?.id}`}
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
                    {statement: 'Départment', response: principalCourse?.department?.name},
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

const PlanningInfo = ({infoData}: ClasseInfoProps) => {

    const {grade} = infoData

    return(
        <PanelSection title='Planning de la classe'>
            <GradeCard data={grade} size='small' onlyPlanning={true} />
        </PanelSection>
    )
}

const ClasseSchedule = ({infoData, seeMore}: ClasseInfoProps) => {
    const {schedule} = infoData

    const handleSeeMore = ()=> {
        seeMore && seeMore('2')
    }

    return(
        <Section title="Emploi du temps" seeMore={handleSeeMore} more={true}>
            <ScheduleCalendar
                eventSchedule={schedule}
                views={['day']}
                height={400}
            />
        </Section>

    )
}

//TODO Je ne trouve pas l'intérêt de mettre quelque élèves ici
/*const ClasseStudent = ({infoData, seeMore, color}: ClasseInfoProps) => {

    const {students} = infoData

    const handleClick = () => {
        seeMore && seeMore('1')
    }

    const handleSeeDetails = (id: string) => {
        redirectTo(`${text.student.group.view.href}${id}`)
    }

    return(
        <StudentCarousel
            title='Quelque élèves de la classe'
            students={students}
            seeMore={handleClick}
            redirectTo={handleSeeDetails}
            color={color}
        />
    )
}*/

const ClasseBestStudent = ({infoData, academicYear, color}: ClasseInfoProps) => {
    const {useGetClasseBestStudents} = useScoreRepo()
    const bestStudents = useGetClasseBestStudents(infoData?.id, academicYear as string)
    return(
        <Section title='Meilleurs élèves de la classe'>
            <BestScoredTable
                providedData={bestStudents}
                color={color}
            />
        </Section>
    )
}

const ClassePoorStudent = ({infoData, academicYear, color}: ClasseInfoProps) => {
    const {useGetClassePoorStudents} = useScoreRepo()
    const poorStudents = useGetClassePoorStudents(infoData?.id, academicYear as string)
    return(
        <Section title='Elèves necessitant une suivie'>
            <BestScoredTable
                providedData={poorStudents}
                color={color}
                goodToPoor={true}
            />
        </Section>
    )
}

const ClasseTeachers = ({infoData, seeMore}: ClasseInfoProps) => {
    const {classeTeachers} = infoData

    const handleClick = () => {
        seeMore && seeMore('5')
    }

    return(
        <Section title={'Les profs de la classe'} more={true} seeMore={handleClick}>
            <TeacherList
                teachers={classeTeachers}
            />
        </Section>
    )
}

const ClasseAttendanceGraph = ({infoData, seeMore, academicYear}: ClasseInfoProps) => {

    const {id} = infoData
    const {useGetClasseAttendanceCount} = useAttendanceRepo()
    const {data: classeAttendances} = useGetClasseAttendanceCount(id, academicYear as string)

    const graphData = classeAttendances && classeAttendances?.statusCount ? Object.entries(classeAttendances?.statusCount).map(([key, value]) => ({
        name: AttendanceStatus[key as unknown as keyof typeof AttendanceStatus],
        value: value as number,
        color: getColors(AttendanceStatus[key as unknown as keyof typeof AttendanceStatus])
    })): []

    console.log('graphData: ', graphData)

    const handleClick = () => {
        seeMore && seeMore('3')
    }

    return(
        <Section title='Donnée de présence' more={true} seeMore={handleClick}>
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
        <ClassePoorStudent {...infoData} />,
        <ClasseAttendanceGraph {...infoData} />
    ]

    return (
        <Block items={items} />
    )
}