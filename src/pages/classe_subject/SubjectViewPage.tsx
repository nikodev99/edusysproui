import {useParams} from "react-router-dom";
import {ReactNode, useEffect, useMemo, useState} from "react";
import {Classe, Course, Schedule, Teacher} from "../../entity";
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
import {useAcademicYear} from "../../hooks/useAcademicYear.ts";
import {useScheduleRepo} from "../../hooks/useScheduleRepo.ts";
import {useCourseRepo} from "../../hooks/useCourseRepo.ts";

const SubjectViewPage = () => {

    const {id} = useParams()

    const {usedAcademicYearId} = useAcademicYear()

    const [course, setCourse] = useState<Course | null>(null)
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [color, setColor] = useState<Color>('')

    const {useGetAllCourseSchedule}= useScheduleRepo()
    const {useGetCourse} = useCourseRepo()

    const {data, isSuccess} = useGetAllCourseSchedule(course?.id as number, false)
    const {data: courseData, isSuccess: isCourseFetched} = useGetCourse(Number.parseInt(id as string))

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
        if (isCourseFetched)
            setCourse(courseData as Course)
        
        if (isSuccess)
            setSchedules(data)

    }, [courseData, data, isCourseFetched, isSuccess])

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