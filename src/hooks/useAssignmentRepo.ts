import {useFetch} from "./useFetch.ts";
import {UseQueryResult} from "@tanstack/react-query";
import {Assignment} from "../entity";
import {
    getAllClasseAssignments,
    getAllClasseAssignmentsBySubject,
    getAllCourseAssignments,
    getAllTeacherAssignments,
    getAllTeacherCourseAssignments,
    getSomeTeacherAssignments,
    getTeacherAssignments
} from "../data/repository/assignmentRepository.ts";
import {IDS} from "../core/utils/interfaces.ts";

export const useAssignmentRepo = () => {
    const useGetAllClasseAssignments = (classeId: number, academicYear: string, courseId?: number): UseQueryResult<Assignment[], unknown> => {
        console.log('enavled: ', courseId ? !!classeId && !!courseId && !!academicYear : !!classeId && !academicYear, 'academicYear: ', academicYear)
        return useFetch(
            courseId ? ['classe-course-assignments', classeId, courseId] : ['classe-assignments', classeId],
            courseId ? getAllClasseAssignmentsBySubject : getAllClasseAssignments,
            [{classeId: classeId, subjectId: courseId}, academicYear],
            courseId ? !!classeId && !!courseId && !!academicYear : !!classeId && !!academicYear
        )
    }

    const useGetAllCourseAssignments = (courseId: number, academicYear: string): UseQueryResult<Assignment[], unknown> => {
        console.log('courseId: ', courseId, 'academicYear: ', academicYear)
        return useFetch(['course-assignments', courseId], getAllCourseAssignments, [courseId, academicYear], !!courseId && !!academicYear)
    }

    const useGetSomeTeacherAssignments = (preparedById: number) => useFetch(
        ['teacher-assignments', preparedById],
        getSomeTeacherAssignments,
        [preparedById],
        !!preparedById
    )

    const useGetTeacherAssignments = (preparedById: number) => useFetch(
        ['teacher-assignments', preparedById],
        getTeacherAssignments,
        [preparedById],
        !!preparedById
    )

    const useGetAllTeacherAssignments = (preparedById: bigint, ids: IDS): UseQueryResult<Assignment[], unknown> => useFetch(
        ids.courseId ? ['teacher-course-assignments', preparedById, ids.courseId, ids.courseId] : ['teacher-assignments', preparedById, ids.classId],
        ids.courseId ? getAllTeacherCourseAssignments : getAllTeacherAssignments,
        [preparedById, ids],
        ids.courseId ? !!preparedById && !!ids.courseId && !!ids.classId : !!preparedById && !!ids.classId
    )

    return {
        useGetAllClasseAssignments,
        useGetAllCourseAssignments,
        useGetSomeTeacherAssignments,
        useGetTeacherAssignments,
        useGetAllTeacherAssignments,
    }
}