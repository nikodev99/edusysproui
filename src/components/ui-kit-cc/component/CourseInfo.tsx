import {GenderCounted, InfoPageProps, ScheduleHoursBy} from "@/core/utils/interfaces.ts";
import {Classe, Course, Department, GradeRankingStudent, Schedule, Score, Teacher} from "@/entity";
import Block from "@/components/view/Block.tsx";
import {ReactNode, useEffect, useMemo, useState} from "react";
import {DepartmentDesc} from "@/components/common/DepartmentDesc.tsx";
import Section from "@/components/ui/layout/Section.tsx";
import {SuperWord} from "@/core/utils/tsxUtils.tsx";
import {cutStatement, findPercent, getUniqueness, setName, sumInArray} from "@/core/utils/utils.ts";
import PanelStat from "@/components/ui/layout/PanelStat.tsx";
import {Progress, TableColumnsType} from "antd";
import {text} from "@/core/utils/text_display.ts";
import {TeacherList} from "@/components/common/TeacherList.tsx";
import {useScheduleRepo} from "@/hooks/actions/useScheduleRepo.ts";
import Datetime from "@/core/datetime.ts";
import {ScheduleCalendar} from "@/components/ui-kit-schedule/components/ScheduleCalendar.tsx";
import {ShapePieChart} from "@/components/graph/ShapePieChart.tsx";
import {Table} from "@/components/ui/layout/Table.tsx";
import {useScoreRepo} from "@/hooks/actions/useScoreRepo.ts";
import {useStudentRepo} from "@/hooks/actions/useStudentRepo.ts";
import {Gender} from "@/entity/enums/gender.tsx";
import PanelTable from "@/components/ui/layout/PanelTable.tsx";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {MarksHistogram} from "@/components/common/MarksHistogram.tsx";
import {useClasseRepo} from "@/hooks/actions/useClasseRepo.ts";
import {stringhelper} from "@/core/helpers/StringHelper.ts";
import {SectionType} from "@/entity/enums/section.ts";
import {SingleBestStudentList} from "@/components/common/BestStudentList.tsx";
import {PermissionType} from "@/pages/classe_subject/ClasseViewPage.tsx";

type CourseInfoType = InfoPageProps<Course, PermissionType> & {
    classes?: Classe[]
    teachers?: Teacher[]
    academicYear?: string
    hours?: ScheduleHoursBy[]
    marks?: {scores: Score[], isLoading: boolean}
    meanMark?: number
    setPlural?: (value: string, count?: number) => string
}

const CourseInfoData = ({infoData, color, classes, academicYear}: CourseInfoType) => {
    const [studentCount, setStudentCount] = useState<GenderCounted>()
    const {countClasses} = useClasseRepo()

    const {useCountStudent, useCountSomeClasseStudents} = useStudentRepo()

    const classeIds = useMemo(() => {
        return classes && classes.length ? getUniqueness(classes, c => c?.id, id => id) : []
    }, [classes])

    const maxAge = studentCount?.genders ? Math.max(...studentCount.genders.map(group => group.ageAverage)) : 1
    const allStudents = useCountStudent()
    const {data, isSuccess} = useCountSomeClasseStudents(classeIds as [], academicYear ?? '')

    const studentConcerned = findPercent(studentCount?.total as number, allStudents?.total as number)
    const genderTitle = (s: Gender) => s === Gender.FEMME ? 'Filles' : 'Garçons'
    const totalClasses = classes && classes.length ? classes.length : 0

    useEffect(() => {
        if (isSuccess)
            setStudentCount(data as GenderCounted)
        
    }, [classes, data, isSuccess]);

    return (
        <Section title={<SuperWord input={`Profile ${infoData?.course}`} />}>
            <div className='panel'>
                {studentCount?.genders && studentCount?.genders.length > 0 && studentCount?.genders?.map((g, i) => (
                    <PanelStat
                        key={i}
                        title={g.count}
                        subTitle={genderTitle(g.gender)}
                        round={<Progress percent={findPercent(g.count, studentCount.total) as number} type='circle' size={35} strokeColor={color} />}
                        desc={`Concerné${g.gender === Gender.FEMME ? 'e' : ''}s`}
                    />
                ))}
                {totalClasses && <PanelStat
                    title={totalClasses}
                    subTitle={`Classe${totalClasses > 1 ? 's' : ''}`}
                    round={<Progress percent={findPercent(totalClasses, countClasses) as number} type='circle' size={35} strokeColor={color} />}
                    desc='Concernés'
                />}
            </div>
            <div className='panel'>
                {studentConcerned && <PanelStat
                    title={`${studentConcerned ?? 0}%`}
                    subTitle={text.student.label + 's'}
                    round={<Progress percent={studentConcerned as number} type='dashboard' size={35} strokeColor={color} />}
                    desc='Concernés'
                />}
                {studentCount?.genders && studentCount?.genders.length > 0 && studentCount?.genders?.map(s => (<PanelStat
                    title={s?.ageAverage?.toFixed(1)}
                    subTitle={genderTitle(s?.gender as Gender)}
                    round={<Progress percent={findPercent(s?.ageAverage as number, maxAge) as number} type='dashboard' size={35} strokeColor={color} />}
                    desc='Age Moyen'
                />))}
            </div>
        </Section>
    )
}

const CourseDepartment = ({infoData, color}: CourseInfoType) => {
    const {department} = infoData
    return (
        <DepartmentDesc
            department={department as Department}
            color={color}
        />
    )
}

const CourseTeachers = ({teachers, infoData, color, meanMark, hours, setPlural, hasPermission}: CourseInfoType) => {
    const {useCountAllTeachers} = useTeacherRepo()
    const countTeachers = useCountAllTeachers()
    const totalWeekHour = sumInArray(hours?? [], 'totalHours')

    const teacherTitle = setPlural?.(text.teacher.label, teachers?.length)

    return (
        <Section title={teacherTitle + ' assignés'}>
            <div className='panel'>
                <PanelStat
                    title={teachers?.length}
                    subTitle={teacherTitle}
                    round={<Progress percent={findPercent(teachers?.length as number, countTeachers?.total as number) as number} type='circle' size={35} strokeColor={color} />}
                    desc={`Assignés`}
                />
                <PanelStat
                    title={meanMark?.toFixed(1)}
                    subTitle={'Note'}
                    round={<Progress percent={findPercent(meanMark as number, 20) as number} type='circle' size={35} strokeColor={color} />}
                    desc='Moyenne'
                />
                <PanelStat
                    title={totalWeekHour}
                    subTitle='Heures'
                    //TODO find the total hour of the week for the school will replace 5*7
                    round={<Progress percent={findPercent(totalWeekHour, 6*7) as number} type='dashboard' size={35} strokeColor={color} />}
                    desc='Par Semaine'
                />
            </div>
            <div className="panel-table">
                <PanelTable title={text.teacher.label + ' ' + infoData?.course} panelColor={color} data={[{
                    tableRow: true,
                    response: <TeacherList
                        teachers={teachers}
                        showCourse={true}
                        hasPermission={(hasPermission as PermissionType).canViewTeacher}
                    />
                }]}/>
            </div>
        </Section>
    )
}

const CourseSchedule = ({infoData, color, seeMore}: CourseInfoType) => {
    const [courseSchedules, setCourseSchedules] = useState<Schedule[]>([])
    const {useGetAllCourseSchedule} = useScheduleRepo()

    const {data, isLoading, isSuccess} = useGetAllCourseSchedule(infoData.id as number, true)

    useEffect(() => {
        if (isSuccess) {
            setCourseSchedules(data)
        }
    }, [data, isSuccess]);

    const handleSeeMore = () => {
        if (seeMore)
            seeMore('1')
    }
    
    return (
        <Section title={`Emploie du temps du ${Datetime.now().format('dddd DD MMMM')}`} more={true} seeMore={handleSeeMore}>
            <ScheduleCalendar
                eventSchedule={courseSchedules}
                hasTeacher={true}
                views={['day']}
                height={500}
                color={color}
                isLoading={isLoading}
                toolbar={false}
                eventTitle={e => `${e?.classe?.name} * ${e?.course?.course} * ${setName(e.teacher?.personalInfo)}`}
            />
        </Section>
    )
}

const CourseHoursByClasse = ({infoData}: CourseInfoType) => {
    const [courseHour, setCourseHour] = useState<ScheduleHoursBy[]>([])
    const {useGetCourseHourByClasse} = useScheduleRepo()

    const {data, isSuccess} = useGetCourseHourByClasse(infoData.id as number)

    useEffect(() => {
        if(isSuccess)
            setCourseHour(data)
    }, [data, isSuccess]);

    const graphData = courseHour && courseHour?.map(c => ({
        name: c.name,
        value: c.totalHours
    }))

    return (
        <Section title="Répartition hebdomadaire des heures par classe">
            <ShapePieChart
                data={graphData}
                hasLegend={true}
                height={300}
            />
        </Section>
    )
}

const CourseHoursByTeacher = ({hours, color}: CourseInfoType) => {

    const totalWeekHour = sumInArray(hours ?? [], 'totalHours')

    const columns: TableColumnsType<ScheduleHoursBy> = [
        {
            title: text.teacher.label,
            dataIndex: 'name',
        },
        {
            title: 'Heures',
            dataIndex: 'totalHours',
            align: 'center',
            sorter: (a, b) => a.totalHours - b.totalHours,
            showSorterTooltip: false,
            render: value => <mark>{`${value} Heure${value > 1 ? 's': ''}`}</mark>
        },
        {
            title: 'Pourcentage',
            render: (_, record) => (
                <Progress percent={findPercent(record?.totalHours, totalWeekHour) as number} />
            )
        }
    ]

    return (
        <Section title={"Répartition hebdomadaire des heures par " + text.teacher.label}>
            <Table
                color={color}
                tableProps={{
                    dataSource: hours,
                    columns: columns,
                    pagination: false,
                    size: 'small',
                    rowKey: 'name'
                }}
            />
        </Section>
    )
}

const CourseMarkHistogram = ({marks, color}: CourseInfoType) => {
    return(
        <Section title='Distribution des Notes'>
            <MarksHistogram
                scores={marks?.scores as Score[]}
                isLoading={marks?.isLoading as boolean}
                color={color as string}
            />
        </Section>
    )
}

export const CourseInfo = (courseType: CourseInfoType) => {
    const {infoData, teachers, academicYear, color, hasPermission} = courseType
    const [courseHour, setCourseHour] = useState<ScheduleHoursBy[]>([])
    const [scores, setScores] = useState<Score[]>([])
    const {useGetCourseHourByTeacher} = useScheduleRepo()
    const {useGetAllTeacherMarks, useGetCourseBestStudents} = useScoreRepo()
    const bestStudents = useGetCourseBestStudents(infoData?.id as number, academicYear as string)
    
    const teacherIds = teachers?.length ? teachers.map(t => t.personalInfo.id) : []

    const {data, isSuccess} = useGetCourseHourByTeacher(infoData?.id as number)
    const {data: fetchedScores, isLoading, isSuccess: isFetched} = useGetAllTeacherMarks(teacherIds as [])

    const sectionTitles = {
        sectionTitle: (s: GradeRankingStudent) => `Performance des apprenants de ${SectionType[s.section as keyof SectionType]} en ${cutStatement(infoData?.course as string, 15, infoData?.abbr)}`,
        bestTableTitle: `Meilleurs apprenants`,
        poorTableTitle: `apprenants en difficulté`
    }

    useEffect(() => {
        if (isFetched)
            setScores(fetchedScores)
        
        if(isSuccess)
            setCourseHour(data)
    }, [data, fetchedScores, isFetched, isSuccess])

    const meanMark = scores?.length ? (sumInArray(scores, 'obtainedMark')/scores?.length) : 0
    const handlePlural = (word: string, count?: number) => {
        return stringhelper.setPlural({word: word, count: count ?? undefined})
    }

    const coursesComponents: ReactNode[] = [
        <CourseInfoData {...courseType} setPlural={handlePlural} />,
        <CourseDepartment {...courseType} />,
        <CourseTeachers {...courseType} meanMark={meanMark} hours={courseHour} setPlural={handlePlural} />,
        <CourseSchedule {...courseType} />,
        <CourseHoursByClasse {...courseType} hours={courseHour} />,
        <CourseHoursByTeacher {...courseType} hours={courseHour} />,
        ...((bestStudents && bestStudents.length > 0) ? bestStudents.map((s, i) => (
            <SingleBestStudentList
                key={`${s.section}-${i}`}
                bestStudents={s}
                sectionTitles={sectionTitles}
                color={color}
                hasPermission={(hasPermission as PermissionType).canViewStudent}
            />
        )): []),
        <CourseMarkHistogram {...courseType} marks={{scores: scores, isLoading: isLoading}} />
    ]

    return(
       <Block items={coursesComponents as []} />
    )
}