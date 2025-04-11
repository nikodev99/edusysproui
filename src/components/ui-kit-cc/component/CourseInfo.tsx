import {GenderCounted, InfoPageProps, ScheduleHoursBy} from "../../../core/utils/interfaces.ts";
import {Classe, Course, Department, Schedule, Teacher} from "../../../entity";
import Block from "../../view/Block.tsx";
import {ReactNode, useEffect, useMemo, useRef, useState} from "react";
import {DepartmentDesc} from "../../common/DepartmentDesc.tsx";
import Section from "../../ui/layout/Section.tsx";
import {SuperWord} from "../../../core/utils/tsxUtils.tsx";
import {useRawFetch} from "../../../hooks/useFetch.ts";
import {countSomeClasseStudents} from "../../../data/repository/studentRepository.ts";
import {findPercent, getUniqueness, setFirstName, sumInArray} from "../../../core/utils/utils.ts";
import PanelStat from "../../ui/layout/PanelStat.tsx";
import {Progress, TableColumnsType} from "antd";
import {useClasse} from "../../../hooks/useClasse.tsx";
import {text} from "../../../core/utils/text_display.ts";
import {useCount} from "../../../hooks/useCount.ts";
import {TeacherList} from "../../common/TeacherList.tsx";
import {useScheduleRepo} from "../../../hooks/useScheduleRepo.ts";
import Datetime from "../../../core/datetime.ts";
import {ScheduleCalendar} from "../../common/ScheduleCalendar.tsx";
import {ShapePieChart} from "../../graph/ShapePieChart.tsx";
import {Table} from "../../ui/layout/Table.tsx";
import {useScoreRepo} from "../../../hooks/useScoreRepo.ts";
import {BestScoredTable} from "../../common/BestScoredTable.tsx";
import {AiOutlineArrowDown} from "react-icons/ai";

type CourseInfoType = InfoPageProps<Course> & {
    classes?: Classe[]
    teachers?: Teacher[]
    academicYear?: string
}

const CourseInfoData = ({infoData, color, classes, teachers, academicYear}: CourseInfoType) => {
    const [studentCount, setStudentCount] = useState<GenderCounted[]>()
    const fetch = useRawFetch()
    const totalClasses = useRef<number>(0)
    const totalTeachers = useRef<number>(0)
    const {classeCount} = useClasse()

    const {countAllStudent, countAllTeachers} = useCount({all: true})

    const classeIds = useMemo(() => {
        return classes && classes.length ? getUniqueness(classes, c => c?.id, id => id) : []
    }, [classes])

    const courseStudents = sumInArray(studentCount as [], 'count')
    const allTeachers = sumInArray(countAllTeachers as [], 'count')

    useEffect(() => {
        fetch(countSomeClasseStudents, [classeIds, academicYear])
            .then(resp => {
                const data = resp?.data as GenderCounted[]
                setStudentCount(data)
            })
        
        totalClasses.current = classes && classes.length ? classes.length : 0
        totalTeachers.current = teachers && teachers.length ? teachers.length : 0
        
    }, [academicYear, classeIds, classes, fetch, teachers]);

    return (
        <Section title={<SuperWord input={`Profile ${infoData?.course}`} />}>
            <div className='panel'>
                <PanelStat
                    title={courseStudents}
                    subTitle={text.student.label}
                    round={<Progress percent={findPercent(courseStudents, countAllStudent) as number} type='circle' size={35} strokeColor={color} />}
                    desc='Concernés'
                />
                <PanelStat
                    title={totalClasses.current}
                    subTitle={`Classe${totalClasses.current > 1 ? 's' : ''}`}
                    round={<Progress percent={findPercent(totalClasses.current, classeCount) as number} type='circle' size={35} strokeColor={color} />}
                    desc='Concernés'
                />
                <PanelStat
                    title={totalTeachers.current}
                    subTitle={`Enseignant${totalTeachers.current > 1 ? 's' : ''}`}
                    round={<Progress percent={findPercent(totalTeachers.current, allTeachers) as number} type='circle' size={35} strokeColor={color} />}
                    desc='Assignés'
                />
            </div>
            <div className='panel-table'>

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

const CourseTeachers = ({teachers}: CourseInfoType) => {
    return (
        <TeacherList
            teachers={teachers}
            more={false}
            title={text.teacher.label + ' assignés'}
            showCourse={true}
        />
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

const CourseHoursByTeacher = ({infoData, color}: CourseInfoType) => {
    const [courseHour, setCourseHour] = useState<ScheduleHoursBy[]>([])
    const {useGetCourseHourByTeacher} = useScheduleRepo()

    const {data, isSuccess} = useGetCourseHourByTeacher(infoData.id as number)

    useEffect(() => {
        if(isSuccess)
            setCourseHour(data)
    }, [data, isSuccess]);

    const totalWeekHour = sumInArray(courseHour, 'totalHours')

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
                    dataSource: courseHour,
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

export const CourseInfo = (infoProps: CourseInfoType) => {
    const coursesComponents: ReactNode[] = [
        <CourseInfoData {...infoProps} />,
        <CourseDepartment {...infoProps} />,
        <CourseTeachers {...infoProps} />,
        <CourseSchedule {...infoProps} />,
        <CourseHoursByClasse {...infoProps} />,
        <CourseHoursByTeacher {...infoProps} />,
        <CourseBestStudents {...infoProps} />,
        <CoursePoorStudents {...infoProps} />
    ]

    return(
       <Block items={coursesComponents as []} />
    )
}