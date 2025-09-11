import {Exam} from "../../entity";
import {getAllExams, getClasseExamAssignments, getClasseExams} from "../../data/repository/examRepository.ts";
import {useFetch} from "../useFetch.ts";
import {useGlobalStore} from "../../core/global/store.ts";

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