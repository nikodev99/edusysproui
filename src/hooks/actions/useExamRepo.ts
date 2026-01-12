import {Exam} from "@/entity";
import {
    getAllExams,
    getClasseExamAssignments,
    getClasseExams,
    getStudentExamAssignments, getStudentExamProgress
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
                ['exam-id', examId, classeId, studentId && studentId],
                studentId ? getStudentExamAssignments : getClasseExamAssignments,
                studentId ? [classeId, academicYear, studentId] : [examId, classeId, academicYear, studentId],
                !!classeId && !!academicYear
            )
        },

        useGetStudentExamProgress: (studentId: string, classeId: number, academicYear: string) => {
            const {data} = useFetch(
                ['exam-progress', studentId, classeId],
                getStudentExamProgress,
                [studentId, classeId, academicYear],
                !!studentId && !!classeId && !!academicYear
            )
            return data
        }
    }
}