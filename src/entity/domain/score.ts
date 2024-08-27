import {Student} from "./student.ts";
import {Exam} from "./exam.ts";
import {fDate} from "../../utils/utils.ts";

export interface Score {
    id: bigint
    exam: Exam
    student: Student
    obtainedMark: number
}

export const initExamData = (scores: Score[]) => {
    return scores?.map((s) => ({
        examId: s.exam.id,
        examDate: fDate(s.exam?.examDate) ?? '',
        examName: s.exam?.examName ?? '',
        classe: s.exam?.classe?.name ?? '',
        obtainedMark: s.obtainedMark ?? 0
    })) ?? []
}