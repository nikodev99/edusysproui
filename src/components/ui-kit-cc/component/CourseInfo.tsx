import {GenderCounted, InfoPageProps, ScheduleHoursBy} from "../../../core/utils/interfaces.ts";
import {Classe, Course, Department, Schedule, Teacher} from "../../../entity";
import Block from "../../view/Block.tsx";
import {ReactNode, useEffect, useMemo, useRef, useState} from "react";
import {DepartmentDesc} from "../../common/DepartmentDesc.tsx";
import Section from "../../ui/layout/Section.tsx";
import {SuperWord} from "../../../core/utils/tsxUtils.tsx";
import {findPercent, getUniqueness, setFirstName, sumInArray} from "../../../core/utils/utils.ts";
import PanelStat from "../../ui/layout/PanelStat.tsx";
import {Progress, TableColumnsType} from "antd";
import {useClasse} from "../../../hooks/useClasse.tsx";
import {text} from "../../../core/utils/text_display.ts";
import {TeacherList} from "../../common/TeacherList.tsx";
import {useScheduleRepo} from "../../../hooks/useScheduleRepo.ts";
import Datetime from "../../../core/datetime.ts";
import {ScheduleCalendar} from "../../common/ScheduleCalendar.tsx";
import {ShapePieChart} from "../../graph/ShapePieChart.tsx";
import {Table} from "../../ui/layout/Table.tsx";
import {useScoreRepo} from "../../../hooks/useScoreRepo.ts";
import {BestScoredTable} from "../../common/BestScoredTable.tsx";
import {AiOutlineArrowDown} from "react-icons/ai";
import {useStudentRepo} from "../../../hooks/useStudentRepo.ts";
import {Gender} from "../../../entity/enums/gender.tsx";
import PanelTable from "../../ui/layout/PanelTable.tsx";
import {useTeacherRepo} from "../../../hooks/useTeacherRepo.ts";

type CourseInfoType = InfoPageProps<Course> & {
    classes?: Classe[]
    teachers?: Teacher[]
    academicYear?: string
    hours?: ScheduleHoursBy[]
}

const CourseInfoData = ({infoData, color, classes, teachers, academicYear, hours}: CourseInfoType) => {
    const [studentCount, setStudentCount] = useState<GenderCounted>()
    const totalClasses = useRef<number>(0)
    const {classeCount} = useClasse()

    const {useCountStudent, useCountSomeClasseStudents} = useStudentRepo()

    const classeIds = useMemo(() => {
        return classes && classes.length ? getUniqueness(classes, c => c?.id, id => id) : []
    }, [classes])

    const maxAge = studentCount?.genders ? Math.max(...studentCount.genders.map(group => group.ageAverage)) : 1
    const totalWeekHour = sumInArray(hours?? [], 'totalHours')
    const allStudents = useCountStudent()
    const {data, isSuccess} = useCountSomeClasseStudents(classeIds, academicYear ?? '')

    const studentConcerned = findPercent(studentCount?.total as number, allStudents?.count as number)

    useEffect(() => {
        if (isSuccess)
            setStudentCount(data as GenderCounted)
        
        totalClasses.current = classes && classes.length ? classes.length : 0
        
    }, [classes, data, isSuccess, teachers]);

    return (
        <Section title={<SuperWord input={`Profile ${infoData?.course}`} />}>
            <div className='panel'>
                {studentCount?.genders && studentCount?.genders.length > 0 && studentCount?.genders?.map(g => (
                    <PanelStat
                        key={g.count}
                        title={g.count}
                        subTitle={`${text.student.label}${g.gender === Gender.FEMME ? 'e' : ''}s `}
                        round={<Progress percent={findPercent(g.count, studentCount.total) as number} type='circle' size={35} strokeColor={color} />}
                        desc={`Concerné${g.gender === Gender.FEMME ? 'e' : ''}s`}
                    />
                ))}
                <PanelStat
                    title={totalClasses.current}
                    subTitle={`Classe${totalClasses.current > 1 ? 's' : ''}`}
                    round={<Progress percent={findPercent(totalClasses.current, classeCount) as number} type='circle' size={35} strokeColor={color} />}
                    desc='Concernés'
                />
            </div>
            <div className='panel'>
                <PanelStat
                    title={studentConcerned}
                    subTitle='%'
                    round={<Progress percent={studentConcerned as number} type='dashboard' size={35} strokeColor={color} />}
                    desc='Concernés'
                />
                <PanelStat
                    title={studentCount?.totalAverageAge?.toFixed(1)}
                    subTitle='ans'
                    round={<Progress percent={findPercent(studentCount?.totalAverageAge as number, maxAge) as number} type='dashboard' size={35} strokeColor={color} />}
                    desc='Age Moyen'
                />
                <PanelStat
                    title={totalWeekHour}
                    subTitle='Heures'
                    //TODO find the total hour of the week for the school will replace 5*7
                    round={<Progress percent={findPercent(totalWeekHour, 6*7) as number} type='dashboard' size={35} strokeColor={color} />}
                    desc='Par Semaine'
                />
            </div>
        </Section>
    )
}

const CourseDepartment = ({infoData, color}: CourseInfoType) => {
    const {department} = infoData
    return (
        <DepartmentDesc department={department as Department} color={color} />
    )
}

const CourseTeachers = ({teachers, infoData, color}: CourseInfoType) => {
    const {useCountAllTeachers} = useTeacherRepo()
    const countTeachers = useCountAllTeachers()
    const maxAge = countTeachers?.genders ? Math.max(...countTeachers.genders.map(group => group.ageAverage)) : 1

    console.log("GRADE: ", )

    return (
        <Section title={text.teacher.label + 's assignés'}>
            <div className='panel'>
                <PanelStat
                    title={teachers?.length}
                    subTitle={text.teacher.label + 's'}
                    round={<Progress percent={findPercent(teachers?.length as number, countTeachers?.total as number) as number} type='circle' size={35} strokeColor={color} />}
                    desc={`Assignés`}
                />
                <PanelStat
                    title={10}
                    subTitle={'Note'}
                    round={<Progress percent={(100*10)/20} type='circle' size={35} strokeColor={color} />}
                    desc='Moyen'
                />
                <PanelStat
                    title={countTeachers?.totalAverageAge?.toFixed(1)}
                    subTitle='ans'
                    round={<Progress percent={findPercent(countTeachers?.totalAverageAge as number, maxAge) as number} type='circle' size={35} strokeColor={color} />}
                    desc='Age Moyen'
                />
            </div>
            <div className="panel-table">
                <PanelTable title={text.teacher.label + ' ' + infoData?.course} panelColor={color} data={[{
                    tableRow: true,
                    response: <TeacherList
                        teachers={teachers}
                        showCourse={true}
                    />
                }]}/>
            </div>
        </Section>
    )
}

const CourseSchedule = ({infoData, color}: CourseInfoType) => {
    const [courseSchedules, setCourseSchedules] = useState<Schedule[]>([])
    const {useGetAllCourseSchedule} = useScheduleRepo()

    const {data, isLoading, isSuccess} = useGetAllCourseSchedule(infoData.id as number, true)

    useEffect(() => {
        if (isSuccess) {
            setCourseSchedules(data)
        }
    }, [data, isSuccess]);
    
    return (
        <Section title={`Emploie du temps du ${Datetime.now().format('dddd DD MMMM')}`} more={true} seeMore={() => alert('You clicked')}>
            <ScheduleCalendar
                eventSchedule={courseSchedules}
                hasTeacher={true}
                views={['day']}
                height={380}
                color={color}
                isLoading={isLoading}
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

const CourseBestStudents = ({infoData, color, academicYear}: CourseInfoType) => {
    const {useGetCourseBestStudents} = useScoreRepo()
    const bestStudents = useGetCourseBestStudents(infoData?.id as number, academicYear as string)
    return (
        <Section title={setFirstName(`Meilleurs ${text.student.label}s en ${infoData?.course}`)}>
            <BestScoredTable
                providedData={bestStudents}
                color={color}
            />
        </Section>
    )
}

const CoursePoorStudents = ({infoData, color, academicYear}: CourseInfoType) => {
    const {useGetCoursePoorStudents} = useScoreRepo()
    const poorStudents = useGetCoursePoorStudents(infoData?.id as number, academicYear as string)
    return (
        <Section title={setFirstName(`Mauvais ${text.student.label}s en ${infoData?.course}`)}>
            <BestScoredTable
                providedData={poorStudents}
                color={color}
                icon={<AiOutlineArrowDown />}
                goodToPoor={true}
            />
        </Section>
    )
}

export const CourseInfo = (courseType: CourseInfoType) => {
    const {infoData} = courseType
    const [courseHour, setCourseHour] = useState<ScheduleHoursBy[]>([])
    const {useGetCourseHourByTeacher} = useScheduleRepo()

    const {data, isSuccess} = useGetCourseHourByTeacher(infoData?.id as number)

    useEffect(() => {
        if(isSuccess)
            setCourseHour(data)
    }, [data, isSuccess]);

    const coursesComponents: ReactNode[] = [
        <CourseInfoData {...courseType} hours={courseHour} />,
        <CourseDepartment {...courseType} />,
        <CourseTeachers {...courseType} />,
        <CourseSchedule {...courseType} />,
        <CourseHoursByClasse {...courseType} hours={courseHour} />,
        <CourseHoursByTeacher {...courseType} hours={courseHour} />,
        <CourseBestStudents {...courseType} />,
        <CoursePoorStudents {...courseType} />
    ]

    return(
       <Block items={coursesComponents as []} />
    )
}