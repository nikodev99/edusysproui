import {Exam} from "../entity";
import {getAllExams, getClasseExamAssignments, getClasseExams} from "../data/repository/examRepository.ts";
import {useFetch} from "./useFetch.ts";

export const useExamRepo = () => {

    return{
        useGetAllExams: (academicYear?: string): Exam[] => {
            return useFetch(
                ['exam-list'],
                getAllExams,
                [academicYear],
                !!academicYear
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

        useGetClasseExamAssignments: (examId: number, classeId: number, academicYear: string): Exam => {
            return useFetch(
                ['exam-id', classeId],
                getClasseExamAssignments,
                [examId, classeId, academicYear],
                !!examId && !!classeId && !!academicYear
            ).data as Exam
        }
    }
}