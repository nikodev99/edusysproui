import {useParams} from "react-router-dom";
import {text} from "../core/utils/text_display.ts";
import {redirectTo} from "../context/RedirectContext.ts";
import {SectionType} from "../entity/enums/section.ts";
import {joinWord} from "../core/utils/utils.ts";

export const useRedirect = () => {
    const {schoolSlug} = useParams<{ schoolSlug: string }>()

    if (!schoolSlug)
        throw Error("useRedirect must be used within a Route that provides :schoolSlug")

    const toLogin = () => redirectTo("/login")

    const toDashboard = () => redirectTo(text.home.href)

    const toStudent = () => redirectTo(text.student.href)

    const toAddStudent = () => redirectTo(text.student.group.add.href)

    const toViewStudent = (studentId: string) => redirectTo(text.student.group.view.href + studentId)

    const toTeacher = () => redirectTo(text.teacher.href)

    const toAddTeacher = () => redirectTo(text.teacher.group.add.href)

    const toViewTeacher = (teacherId: string, teacherSlug?: string) => {
        if (!teacherSlug) {
            return redirectTo(text.teacher.group.view.href + teacherId)
        }
        return redirectTo(text.teacher.group.view.href + teacherSlug, {state: teacherId})
    }

    const toGuardian = () => redirectTo(text.guardian.href)

    const toViewGuardian = (guardianId: string, guardianSlug?: string) => {
        if (guardianSlug) {
            return redirectTo(text.guardian.group.view.href + guardianSlug, {state: guardianId})
        }
        return redirectTo(text.guardian.group.view.href + guardianId)
    }

    const toClasseAndCourse = () => redirectTo(text.cc.href)

    const toClassePath = (classeId: string) => redirectTo(text.cc.group.classe.path.view + classeId)

    const toAddClasse = () => redirectTo(text.cc.group.classe.add.href)

    const toViewClasse = (classeId: string) => redirectTo(text.cc.group.classe.view.href + classeId)

    const toCoursePath = (courseId: string) => redirectTo(text.cc.group.course.path.view + courseId)

    const toAddCourse = () => redirectTo(text.cc.group.course.add.href)

    const toViewCourse = (CourseId: string) => redirectTo(text.cc.group.course.view.href + CourseId)

    const toExam = () => redirectTo(text.exam.href)

    const toViewExam = (examId: string) => redirectTo(text.exam.group.view.href + examId)

    const toAddExam = () => redirectTo(text.exam.group.add.href)

    const toAttendance = () => redirectTo(text.att.href)

    const toViewAttendance = (attendanceId: string) => redirectTo(text.att.group.view.href + attendanceId)

    const toAddAttendance = () => redirectTo(text.att.group.add.href)

    const toEditAttendance = () => redirectTo(text.att.group.edit.href)

    const toLibrary = () => redirectTo(text.library.href)

    const toViewLibrary = (libraryId: string) => redirectTo(text.library.group.view.href + libraryId)

    const toAddLibrary = () => redirectTo(text.library.group.add.href)

    const toFinance = () => redirectTo(text.finance.href)

    const toChat = () => redirectTo(text.chat.href)

    const toEmployee = () => redirectTo(text.employee.href)

    const toAddEmployee = () => redirectTo(text.employee.group.add.href)

    const toViewEmployee = (employeeId: string, employeeSlug?: string) => {
        if (employeeSlug)
            return redirectTo(text.employee.group.view.href + employeeSlug, {state: employeeId})
        return redirectTo(text.employee.group.view.href + employeeId)
    }
    const toSettings = () => redirectTo(text.settings.href)

    const toOrg = () => redirectTo(text.org.group.school.href)

    const toSaveGrade = () => redirectTo(text.org.group.grade.add.href)

    const toEditGrade = (gradeId: number, gardeSection?: SectionType) => redirectTo(
        text.org.group.grade.edit.href + (
            gardeSection
                ? joinWord(SectionType[gardeSection as unknown as keyof typeof SectionType], '_', true)
                : gradeId
        ),
        {state: gradeId}
    )

    const toDepartment = () => redirectTo(text.org.group.department.href)

    const toAddDepartment = () => redirectTo(text.org.group.department.add.href)

    const toViewDepartment = (departmentId: number, departmentName?: string) => redirectTo(
        departmentName
            ? text.org.group.department.view.href + joinWord(departmentName, '_', true)
            : text.org.group.department.view.href + departmentId
        , {state: departmentId}
    )

    const toUserList = () => redirectTo(text.org.group.user.href)
    const toSaveUser = () => redirectTo(text.org.group.user.add.href)

    const toViewUser = (userId: number, userName?: string, plus?: { toActivity?: boolean }) => {
        let urlPlus: string = ''
        if (plus?.toActivity) {
            urlPlus = '/activity'
        }

        redirectTo(
            userName
                ? text.org.group.user.view.href + joinWord(userName, '_', true) + urlPlus
                : text.org.group.user.view.href + userId + urlPlus,
            {
                state: userId
            }
        )
    }

    const toUserActivity = (userId: number, userName?: string) => {
        return toViewUser(userId, userName,  {toActivity: true})
    }

    return {
        toLogin,
        toDashboard,
        toStudent,
        toAddStudent,
        toViewStudent,
        toTeacher,
        toAddTeacher,
        toViewTeacher,
        toGuardian,
        toViewGuardian,
        toClasseAndCourse,
        toClassePath,
        toAddClasse,
        toViewClasse,
        toCoursePath,
        toAddCourse,
        toViewCourse,
        toExam,
        toViewExam,
        toAddExam,
        toAttendance,
        toViewAttendance,
        toAddAttendance,
        toEditAttendance,
        toLibrary,
        toViewLibrary,
        toAddLibrary,
        toFinance,
        toChat,
        toEmployee,
        toAddEmployee,
        toViewEmployee,
        toSettings,
        toOrg,
        toSaveGrade,
        toEditGrade,
        toDepartment,
        toAddDepartment,
        toViewDepartment,
        toUserList,
        toSaveUser,
        toViewUser,
        toUserActivity
    }
}