import {Student} from "./student.ts";
import {fDate} from "../../utils/utils.ts";
import {Assignment} from "./assignment.ts";

export interface Score {
    id: bigint
    assignment: Assignment
    student: Student
    obtainedMark: number
}

export const initExamData = (scores: Score[]) => {
    return scores?.map((s) => ({
        examId: s.assignment.id,
        examDate: fDate(s.assignment?.examDate) ?? '',
        examName: s.assignment?.examName ?? '',
        classe: s.assignment?.classe?.name ?? '',
        obtainedMark: s.obtainedMark ?? 0
    })) ?? []
}