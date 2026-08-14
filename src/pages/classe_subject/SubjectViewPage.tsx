import {useParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {Classe, Course, Schedule, Teacher, TeacherClasses} from "@/entity";
import {useDocumentTitle} from "@/hooks/useDocumentTitle.ts";
import {cutStatement, getUniqueness} from "@/core/utils/utils.ts";
import {useBreadCrumb} from "@/hooks/useBreadCrumb.tsx";
import {text} from "@/core/utils/text_display.ts";
import {SuperWord} from "@/core/utils/tsxUtils.tsx";
import ViewHeader from "@/components/ui/layout/ViewHeader.tsx";
import {Tag} from "antd";
import {ItemType} from "antd/es/menu/interface";
import {LuFileArchive} from "react-icons/lu";
import {ViewRoot} from "@/components/custom/ViewRoot.tsx";
import {CourseExam, CourseInfo, CourseSchedule} from "@/components/ui-kit-cc";
import {Color} from "@/core/utils/interfaces.ts";
import {useScheduleRepo} from "@/hooks/actions/useScheduleRepo.ts";
import {useCourseRepo} from "@/hooks/actions/useCourseRepo.ts";
import {CourseEditDrawer} from "@/components/ui-kit-cc/component/CourseEditDrawer.tsx";
import {useToggle} from "@/hooks/useToggle.ts";
import {CourseType, CourseTypeEnum} from "@/entity/domain/course.ts";
import {useAcademicYearRepo} from "@/hooks/actions/useAcademicYearRepo.ts";
import {usePermission} from "@/hooks/usePermission.ts";
import {PermissionType} from "@/pages/classe_subject/ClasseViewPage.tsx";
import {isTeacher} from "@/auth/dto/role.ts";

const SubjectViewPage = () => {

    const {id} = useParams()
    const [course, setCourse] = useState<Course | null>(null)
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [color, setColor] = useState<Color>('')
    const [open, setOpen] = useToggle(false)

    const {can} = usePermission()
    const {currentAcademicYear} = useAcademicYearRepo()
    const {useGetAllCourseSchedule}= useScheduleRepo()
    const {useGetCourse} = useCourseRepo()

    const canViewTeachers = can('canViewTeachers', true)
    
    //TODO Mieux réfléchir lorsqu'un prof est connecter.
    const canViewStudents = can('canViewStudents', true)

    const {data, isSuccess} = useGetAllCourseSchedule(course?.id as number, false)
    const {data: courseData, isSuccess: isCourseFetched, refetch} = useGetCourse(Number.parseInt(id as string))

    useDocumentTitle({
        title: cutStatement(course?.course as string, 10, course?.abbr) as string,
        description: "Course Description"
    })

    const {context} = useBreadCrumb({
        bCItems: [
            { title: text.cc.label, path: text.cc.href },
            { title: <SuperWord input={course?.course as string} /> }
        ]
    })

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

        teachers?.forEach(teacher => {
            if (teacher)
                teacher.classes = uniqueClasses?.filter(c =>
                    schedules.some(s =>
                        s?.classe?.name === c?.name &&
                        s?.classe?.grade.section === c?.grade?.section &&
                        s?.teacher?.personalInfo?.firstName === teacher?.personalInfo?.firstName &&
                        s?.teacher?.personalInfo?.lastName === teacher?.personalInfo?.lastName
                    )
                ).map(c => ({
                    classe: c
                })) as TeacherClasses[]
        });

        return teachers;
    }, [schedules, uniqueClasses])

    const hasPermission: PermissionType = useMemo(() => {
        return {
            canViewTeacher: canViewTeachers,
            canViewStudent: isTeacher() ? false : canViewStudents,
        }
    }, [canViewStudents, canViewTeachers])

    useEffect(() => {
        if (isCourseFetched)
            setCourse(courseData as Course)
        
        if (isSuccess)
            setSchedules(data)

    }, [courseData, data, isCourseFetched, isSuccess])

    const manageItems: ItemType[] = [
        {key: 0, label: 'Archive', icon: <LuFileArchive />, danger: true}
    ]

    const handleCloseDrawer = () => {
        setOpen()
        refetch().then(r => r.data)
    }

    return(
        <>
            {context}
            <ViewHeader
                isLoading={course === null}
                setEdit={setOpen}
                closeState={false}
                avatarProps={{
                    firstName: course?.course,
                    reference: course?.abbr
                }}
                blockProps={[
                    {title: 'Département', mention: <em><mark>{course?.department?.name}</mark></em>},
                    {title: 'Type', mention: <Tag color={color}>{CourseTypeEnum[course?.courseType as CourseType]}</Tag>},
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
                            classes={uniqueClasses?.length ? uniqueClasses as Classe[] : undefined}
                            teachers={uniqueTeachers as Teacher[] || undefined}
                            resourceYear={currentAcademicYear}
                            academicYear={currentAcademicYear?.id as string}
                            hasPermission={hasPermission}
                        />
                    },
                    {
                        label: 'Programme',
                        children: <CourseSchedule
                            infoData={course as Course}
                            academicYear={currentAcademicYear?.id as string}
                            dataKey='course-schedule'
                        />
                    },
                    {
                        label: 'Evaluation',
                        children: <CourseExam
                            infoData={course as Course}
                            dataKey='course-exams'
                            academicYear={currentAcademicYear?.id as string}
                            resourceYear={currentAcademicYear}
                            hasPermission={hasPermission}
                        />
                    }
                ]}
                exists={course !== null}
                memorizedTabKey='courseTabKey'
            />
            {open && <CourseEditDrawer open={open} close={handleCloseDrawer} data={course as Course} />}
        </>
    )
}

export default SubjectViewPage;