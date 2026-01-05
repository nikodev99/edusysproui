import {Exam} from "@/entity";
import {
    getAllExams,
    getClasseExamAssignments,
    getClasseExams,
    getStudentExamAssignments
} from "@/data/repository/examRepository.ts";
import {useFetch} from "../useFetch.ts";
import {useGlobalStore} from "@/core/global/store.ts";

export const useExamRepo = () => {
    const schoolId = useGlobalStore(state => state.schoolId)

    return{
        useGetAllExams: (academicYear?: string): Exam[] => {
            return useFetch(
                ['exam-list'],
                getAllExams,
                [schoolId, academicYear],
                !!schoolId && !!academicYear
            ).data as Exam[]
        },

        useGetClasseExams: (classeId?: number, academicYear?: string): Exam[] => {
            return useFetch(
                ['exam-classe-list', classeId],
                getClasseExams,
                [classeId, academicYear],
                !!classeId && !!academicYear
            ).data as Exam[]
        },

        useGetExamAssignments: (examId: number, classeId: number, academicYear: string, studentId?: string) => {
            return useFetch(
                ['exam-id', classeId, studentId && studentId],
                studentId ? getStudentExamAssignments : getClasseExamAssignments,
                [examId, classeId, academicYear, studentId],
                !!examId && !!classeId && !!academicYear
            )
        }
    }
}