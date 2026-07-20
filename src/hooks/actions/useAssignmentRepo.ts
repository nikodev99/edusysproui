import {useFetch} from "../useFetch.ts";
import {UseQueryResult} from "@tanstack/react-query";
import {Assignment} from "@/entity";
import {
    getAllAssignments,
    getAllClasseAssignments,
    getAllClasseAssignmentsBySubject,
    getAllCourseAssignments,
    getAllNotCompletedAssignment,
    getAllTeacherAssignments,
    getAllTeacherCourseAssignments,
    getAssignmentById,
    getSomeTeacherAssignments,
    getTeacherAssignments, getTeacherAssignmentsList
} from "@/data/repository/assignmentRepository.ts";
import {ID, IDS} from "@/core/utils/interfaces.ts";
import {UserPermission} from "@/core/shared/sharedEnums.ts";
import {useAuth} from "@/hooks/useAuth.ts";
import {getShortSortOrder} from "@/core/utils/utils.ts";
import {AssignmentFilterProps} from "@/entity/domain/assignment.ts";
import {useGlobalStore} from "@/core/global/store.ts";

export const useAssignmentRepo = (context: UserPermission = UserPermission.ALL) => {
    const schoolId = useGlobalStore(state => state.schoolId)

    const useGetPaginatedExams = () => {
        const {user} = useAuth()

        return {
            getAllSchoolAssignments: async (filters: AssignmentFilterProps, page: number, size: number, sortField?: string, sortOrder?: string) => {
                if (sortField && sortOrder) {
                    sortOrder = getShortSortOrder(sortOrder)
                    sortField = assignmentSortedField(sortField)
                }
                switch (context) {
                    case UserPermission.TEACHER:
                        return await getTeacherAssignmentsList(user?.personalInfo as number, filters, page, size, sortField, sortOrder)
                    default:
                        return await getAllAssignments(filters, page, size, sortField, sortOrder)
                }
            }
        }
    }

    const useGetAllClasseAssignments = (classeId: number, academicYear: string, courseId?: number): UseQueryResult<Assignment[], unknown> => {
        return useFetch(
            courseId ? ['classe-course-assignments', classeId, courseId] : ['classe-assignments', classeId],
            courseId ? getAllClasseAssignmentsBySubject : getAllClasseAssignments,
            [{classeId: classeId, subjectId: courseId}, academicYear],
            courseId ? !!classeId && !!courseId && !!academicYear : !!classeId && !!academicYear
        )
    }

    const useGetAllNotCompletedAssignments = (academicYear: string, teacherId?: number) => useFetch(
        ['Not-Completed-Assignments', academicYear, teacherId],
        getAllNotCompletedAssignment, [academicYear, teacherId],
        teacherId ? !!academicYear && !!teacherId : !!academicYear
    )

    const useGetAllCourseAssignments = (courseId: number, academicYear: string): UseQueryResult<Assignment[], unknown> => {
        return useFetch(['course-assignments', courseId], getAllCourseAssignments, [courseId, academicYear], !!courseId && !!academicYear)
    }

    const useGetSomeTeacherAssignments = (preparedById: number) => useFetch(
        ['teacher-assignments', preparedById],
        getSomeTeacherAssignments,
        [preparedById, schoolId],
        !!preparedById && !!schoolId
    )

    const useGetTeacherAssignments = (preparedById: number, academicYear: string) => useFetch(
        ['teacher-assignments', preparedById, academicYear],
        getTeacherAssignments,
        [preparedById, academicYear],
        !!preparedById && !!academicYear
    )

    const useGetAllTeacherAssignments = (preparedById: number, academicYear: string, ids: IDS): UseQueryResult<Assignment[], unknown> => useFetch(
        ids.courseId ? ['teacher-course-assignments', preparedById, academicYear, ids.courseId, ids.courseId] : ['teacher-assignments', preparedById, ids.classId],
        ids.courseId ? getAllTeacherCourseAssignments : getAllTeacherAssignments,
        [preparedById, academicYear, ids],
        ids.courseId ? !!preparedById && !!ids.courseId && !!ids.classId : !!preparedById && !!ids.classId
    )

    const useGetAssignment = (assignmentId: ID) => useFetch(
        ['assignment-id', assignmentId],
        getAssignmentById,
        [assignmentId],
        !!assignmentId
    )

    return {
        useGetPaginatedExams,
        useGetAllClasseAssignments,
        useGetAllNotCompletedAssignments,
        useGetAllCourseAssignments,
        useGetSomeTeacherAssignments,
        useGetTeacherAssignments,
        useGetAllTeacherAssignments,
        useGetAssignment
    }
}

const assignmentSortedField = (sortField: string) => {
    switch (sortField) {
        case 'examName':
            return 'examName'
        case 'examDate':
            return 'examDate'
        case 'subject':
            return 'subject.course'
        case 'classe':
            return 'classeEntity.name'
    }
}