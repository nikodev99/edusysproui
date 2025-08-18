import {useParams} from "react-router-dom";
import {text} from "../core/utils/text_display.ts";
import {redirectTo} from "../context/RedirectContext.ts";

export const useRedirect = () => {
    const {schoolSlug} = useParams<{ schoolSlug: string }>()

    if (!schoolSlug)
        throw Error("useRedirect must be used within a Route that provides :schoolSlug")

    return {
        toDashboard: () => redirectTo(text.home.href),
        toStudent: () => redirectTo(text.student.href),
        toAddStudent: () => redirectTo(text.student.group.add.href),
        toViewStudent: (studentId: string) => redirectTo(text.student.group.view.href + studentId),
        toTeacher: () => redirectTo(text.teacher.href),
        toAddTeacher: () => redirectTo(text.teacher.group.add.href),
        toViewTeacher: (teacherId: string) => redirectTo(text.teacher.group.view.href + teacherId),
        toGuardian: () => redirectTo(text.guardian.href),
        toViewGuardian: (guardianId: string) => redirectTo(text.guardian.group.view.href + guardianId),
        toClasseAndCourse: () => redirectTo(text.cc.href),
        toClassePath: (classeId: string) => redirectTo(text.cc.group.classe.path.view + classeId),
        toAddClasse: () => redirectTo(text.cc.group.classe.add.href),
        toViewClasse: (classeId: string) => redirectTo(text.cc.group.classe.view.href + classeId),
        toCoursePath: (courseId: string) => redirectTo(text.cc.group.course.path.view + courseId),
        toAddCourse: () => redirectTo(text.cc.group.course.add.href),
        toViewCourse: (CourseId: string) => redirectTo(text.cc.group.course.view.href + CourseId),
        toExam: () => redirectTo(text.exam.href),
        toViewExam: (examId: string) => redirectTo(text.exam.group.view.href + examId),
        toAddExam: () => redirectTo(text.exam.group.add.href),
        toAttendance: () => redirectTo(text.att.href),
        toViewAttendance: (attendanceId: string) => redirectTo(text.att.group.view.href + attendanceId),
        toAddAttendance: () => redirectTo(text.att.group.add.href),
        toEditAttendance: () => redirectTo(text.att.group.edit.href),
        toLibrary: () => redirectTo(text.library.href),
        toViewLibrary: (libraryId: string) => redirectTo(text.library.group.view.href + libraryId),
        toAddLibrary: () => redirectTo(text.library.group.add.href),
        toFinance: () => redirectTo(text.finance.href),
        toChat: () => redirectTo(text.chat.href),
        toEmployee: () => redirectTo(text.employee.href),
        toAddEmployee: () => redirectTo(text.employee.group.add.href),
        toViewEmployee: (employeeId: string, employeeSlug?: string) => {
            if (employeeSlug)
                return redirectTo(text.employee.group.view.href + employeeSlug, {state: employeeId})
            else
                return redirectTo(text.employee.group.view.href + employeeId)
        },
        toSettings: () => redirectTo(text.settings.href),
        toOrg: () => redirectTo(text.org.group.school.href),
        toSaveGrade: () => redirectTo(text.org.group.grade.add.href),
    }
}