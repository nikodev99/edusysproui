import {useParams} from "react-router-dom";
import {ReactNode, useEffect, useMemo, useState} from "react";
import {Classe, Course, Schedule, Teacher} from "../../entity";
import {useFetch, useRawFetch} from "../../hooks/useFetch.ts";
import {getCourseById} from "../../data/repository/courseRepository.ts";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {cutStatement, getUniqueness} from "../../core/utils/utils.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {SuperWord} from "../../core/utils/tsxUtils.tsx";
import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";
import {Tag} from "antd";
import {ItemType} from "antd/es/menu/interface";
import {LuFileArchive} from "react-icons/lu";
import {ViewRoot} from "../../components/custom/ViewRoot.tsx";
import {CourseExam, CourseInfo, CourseSchedule} from "../../components/ui-kit-cc";
import {Color} from "../../core/utils/interfaces.ts";
import {getAllCourseSchedule} from "../../data/repository/scheduleRepository.tsx";
import {useAcademicYear} from "../../hooks/useAcademicYear.ts";

const SubjectViewPage = () => {

    const {id} = useParams()

    const {usedAcademicYearId} = useAcademicYear()

    const [course, setCourse] = useState<Course | null>(null)
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [color, setColor] = useState<Color>('')

    const fetch = useRawFetch<Course>()
    const {data, isSuccess} = useFetch<Schedule[], unknown>(['course-schedule-list'], getAllCourseSchedule, [course?.id, false], course !== null)

    useDocumentTitle({
        title: cutStatement(course?.course as string, 10, course?.abbr) as string,
        description: "Course Description"
    })

    const pageHierarchy = useBreadCrumb([
        { title: text.cc.label, path: text.cc.href },
        { title: <SuperWord input={course?.course as string} /> }
    ])

    const uniqueClasses = useMemo(() => {
        return schedules && schedules.length ? getUniqueness(schedules, s => s?.classe, c => `${c?.id}-${c?.name}`) : []
    }, [schedules])

    const uniqueTeachers = useMemo(() => {
        if (!schedules || schedules.length === 0) return [];

        const teachers = getUniqueness(
            schedules,
            s => s?.teacher,
            t => `${t?.personalInfo?.lastName}-${t?.personalInfo?.firstName}`
        );

        teachers.forEach(teacher => {
            if (teacher)
                teacher.classes = uniqueClasses.filter(c =>
                    schedules.some(s =>
                        s?.classe?.name === c?.name &&
                        s?.classe?.grade.section === c?.grade?.section &&
                        s?.teacher?.personalInfo?.firstName === teacher?.personalInfo?.firstName &&
                        s?.teacher?.personalInfo?.lastName === teacher?.personalInfo?.lastName
                    )
                ) as Classe[]
        });

        return teachers;
    }, [schedules, uniqueClasses])

    useEffect(() => {
        fetch(getCourseById, [id])
            .then(response => {
                if (response.isSuccess) {
                    setCourse(response.data as Course)
                }
            })
        
        if (isSuccess) {
            setSchedules(data)
        }
    }, [data, fetch, id, isSuccess])

    const manageItems: ItemType[] = [
        {key: 0, label: 'Archive', icon: <LuFileArchive />, danger: true}
    ]

    return(
        <>
            <PageHierarchy items={pageHierarchy as [{ title: string | ReactNode, path?: string }]} />
            <ViewHeader
                isLoading={course === null}
                setEdit={() => alert('You clicked')}
                closeState={false}
                avatarProps={{
                    firstName: course?.course,
                    reference: course?.abbr
                }}
                blockProps={[
                    {title: 'Département', mention: <em><mark>{course?.department?.name}</mark></em>},
                    {title: 'Code', mention: <Tag>{course?.department?.code}</Tag>},
                ]}
                items={manageItems}
                pColor={setColor}
            />
            <ViewRoot
                items={[
                    {
                        label: 'Info',
                        children: <CourseInfo
                            color={color}
                            infoData={course as Course}
                            dataKey='course-info'
                            classes={uniqueClasses.length ? uniqueClasses as Classe[] : undefined}
                            teachers={uniqueTeachers as Teacher[] || undefined}
                            academicYear={usedAcademicYearId as string}
                        />
                    },
                    {label: 'Progarmme', children: <CourseSchedule />},
                    {label: 'Evaluation', children: <CourseExam />}
                ]}
                exists={course !== null}
                memorizedTabKey='courseTabKey'
            />
        </>
    )
}

export default SubjectViewPage;