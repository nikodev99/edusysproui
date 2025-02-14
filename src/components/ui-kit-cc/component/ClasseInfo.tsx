import {GenderCounted, InfoPageProps} from "../../../utils/interfaces.ts";
import {Classe, Planning, Score, Teacher} from "../../../entity";
import Block from "../../view/Block.tsx";
import {ReactNode, useEffect, useState} from "react";
import Section from "../../ui/layout/Section.tsx";
import PanelStat from "../../ui/layout/PanelStat.tsx";
import {calculateAverageAge, fDate, findPercent, firstWord, setFirstName, setGender} from "../../../utils/utils.ts";
import {text} from "../../../utils/text_display.ts";
import PanelTable from "../../ui/layout/PanelTable.tsx";
import {SuperWord} from "../../../utils/tsxUtils.tsx";
import {DatedListItem} from "../../ui/layout/DatedListItem.tsx";
import {Avatar as AntAvatar, Progress, Tag} from "antd";
import {IndividualDescription} from "../../ui/layout/IndividualDescription.tsx";
import {Individual} from "../../../entity/domain/individual.ts";
import PanelSection from "../../ui/layout/PanelSection.tsx";
import {ScheduleDayCalendar} from "../../common/ScheduleDayCalendar.tsx";
import {AvatarTitle} from "../../ui/layout/AvatarTitle.tsx";
import {redirectTo} from "../../../context/RedirectContext.ts";
import {StudentCarousel} from "../../common/StudentCarousel.tsx";
import {BarChart} from "../../graph/BarChart.tsx";
import {useRawFetch} from "../../../hooks/useFetch.ts";
import {getClasseBestStudents} from "../../../data/repository/scoreRepository.ts";
import {LoadMoreList} from "../../ui/layout/LoadMoreList.tsx";
import {AvatarListItem} from "../../ui/layout/AvatarListItem.tsx";
import {AttendanceStatus, getColors} from "../../../entity/enums/attendanceStatus.ts";
import {getClasseAttendanceStatusCount} from "../../../data/repository/attendanceRepository.ts";
import {ShapePieChart} from "../../graph/ShapePieChart.tsx";
import VoidData from "../../view/VoidData.tsx";

type ClasseInfoProps = InfoPageProps<Classe> & {
    studentCount?: GenderCounted[] | null
    totalStudents?: number
};

const ClasseInfoData = ({infoData, color, studentCount, totalStudents, seeMore}: ClasseInfoProps) => {
    const {principalTeacher, principalStudent, principalCourse, classeTeachers} = infoData

    const studentAverageAge = calculateAverageAge(studentCount)
    const maxAge = studentCount ? Math.max(...studentCount.map(group => group.ageAverage)) : 1
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
                {studentCount && studentCount.map((s, i) => (
                    <PanelStat
                        key={i}
                        title={s.count}
                        subTitle={`apprénant${s.count > 1 ? 's' : ''}`}
                        round={<Progress percent={findPercent(s.count, totalStudents!) as number} type='circle' size={35} strokeColor={color} />}
                        desc={setFirstName(setGender(s.gender)) + `${s.count > 1 ? 's' : ''}`}
                    />
                ))}
                {studentAverageAge && <PanelStat
                    title={studentAverageAge}
                    subTitle={studentAverageAge > 1 ? 'ans' : 'an'}
                    round={<Progress percent={findPercent(studentAverageAge, maxAge) as number} type='circle' size={35} strokeColor={color} />}
                    desc='Age Moyen'
                />}
            </div>
            <div className="panel-table">
                <IndividualDescription
                    personalInfo={principalTeacher?.principalTeacher?.personalInfo as Individual}
                    show={principalTeacher === null || principalTeacher === undefined}
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

const PlanningInfo = ({infoData, color}: ClasseInfoProps) => {

    const {grade} = infoData

    const groupeBySemester = (terms: Planning[]) => {
        return terms?.reduce((acc, term) => {
            const semesterName = term.semester?.semesterName
            if (!acc[semesterName as string]) {
                acc[semesterName as string] = []
            }

            acc[semesterName as string].push(term)
            return acc
        }, {} as Record<string, Planning[]>)
    }

    const semesters = groupeBySemester(grade?.planning as Planning[])
    const planningData = Object.entries(semesters)?.map(([semesterName, planning]) => {
        return {
            semester: semesterName,
            data: [{
                response: <DatedListItem dataSource={planning.map(term => ({
                    date: [fDate(term?.termStartDate), fDate(term?.termEndDate)],
                    title: term.designation
                }))} />,
                tableRow: true
            }]
        }
    })

    return(
        <PanelSection title='Planning de la classe'>
            {planningData && planningData?.map(data => <PanelTable
                key={data?.semester}
                title={data?.semester}
                data={data.data}
                panelColor={color} ps
            />)}
        </PanelSection>
    )
}

const ClasseSchedule = ({infoData, seeMore}: ClasseInfoProps) => {
    const {schedule} = infoData

    const handleSeeMore = ()=> {
        seeMore && seeMore('2')
    }

    return(
        <ScheduleDayCalendar
            eventSchedule={schedule}
            sectionTitle={'Schedule'}
            seeMore={handleSeeMore}
            //TODO adding the hasTeacher={true}
        />
    )
}

const ClasseStudent = ({infoData, seeMore, color}: ClasseInfoProps) => {

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
}

const ClasseBestStudent = ({infoData, academicYear, color}: ClasseInfoProps) => {

    const [scores, setScores] = useState<Score[] | null>(null)
    const classeId = infoData?.id
    const fetch = useRawFetch<Score>();

    useEffect(() => {
        fetch(getClasseBestStudents, [classeId, academicYear])
            .then(resp => {
                if(resp.isSuccess) {
                    setScores(resp?.data as Score[])
                }
            })
    }, [academicYear, classeId, fetch]);

   const barData = scores && scores?.length !== 0 ? scores.map(score => ({
       student: firstWord(score?.student?.personalInfo?.lastName),
       marks: score?.obtainedMark
   })) : []

    return(
        <Section title='Meilleurs élèves de la classe'>
            {scores && scores?.length > 0 ? <BarChart
                data={barData}
                dataKey={['marks']}
                legend='student'
                color={color}
                minHeight={350}
                layout={"vertical"}
                barSize={30}
            /> : <VoidData />}
        </Section>
    )
}

const ClasseTeachers = ({infoData, seeMore}: ClasseInfoProps) => {
    const {classeTeachers} = infoData

    const handleClick = () => {
        seeMore && seeMore('5')
    }

    return(
        <Section title='Les profs de la classe' more={true} seeMore={handleClick}>
            <LoadMoreList
                listProps={{
                    dataSource: classeTeachers,
                    renderItem: (teacher) => (<AvatarListItem
                        item={teacher?.personalInfo}
                        showBtnText='Voir'
                        isLoading={classeTeachers === null}
                        onBtnClick={() => redirectTo(text.teacher.group.view.href + teacher?.id)}
                        description={teacher?.courses?.map(c => (<Tag key={c.abbr}>{c.course}</Tag>))}
                    />)
                }}
                isLoading={classeTeachers === null}
                size={10}
                allItems={classeTeachers?.length}
            />
        </Section>
    )
}

const ClasseAttendanceGraph = ({infoData, seeMore, academicYear}: ClasseInfoProps) => {

    const [countData, setCountData] = useState<{status?: AttendanceStatus, count?: number}[] | null>(null)
    const fetch = useRawFetch();

    const {id} = infoData

    useEffect(() => {
        fetch(getClasseAttendanceStatusCount, [id, academicYear])
            .then(resp => {
                if (resp.isSuccess) {
                    setCountData(resp.data as {status?: AttendanceStatus, count?: number}[])
                }
            })
    }, [academicYear, fetch, id]);

    const graphData = countData && countData?.map(c => ({
        name: AttendanceStatus[c.status as unknown as keyof typeof AttendanceStatus],
        value: c.count,
        color: getColors(AttendanceStatus[c.status as unknown as keyof typeof AttendanceStatus])
    }))

    const handleClick = () => {
        seeMore && seeMore('3')
    }

    return(
        <Section title='Donnée de présence' more={true} seeMore={handleClick}>
            {countData && <ShapePieChart
                data={graphData as []}
                height={280}
                innerRadius={40}
                outerRadius={80}
                hasLegend={true}
            />}
        </Section>
    )
}

export const ClasseInfo = (infoData: ClasseInfoProps) => {

    const items: ReactNode[] = [
        <ClasseInfoData {...infoData} />,
        <PlanningInfo {...infoData} />,
        <ClasseSchedule {...infoData} />,
        <ClasseStudent {...infoData} />,
        <ClasseBestStudent {...infoData} />,
        <ClasseTeachers {...infoData} />,
        <ClasseAttendanceGraph {...infoData} />
    ]

    return (
        <Block items={items} />
    )
}