import {Student} from "./student.ts";
import {Assignment} from "./assignment.ts";

export interface Score {
    id?: bigint | number
    assignment?: Assignment
    student?: Student
    obtainedMark: number
    isPresent?: boolean
}

export const initExamData = (scores: Score[]) => {
    return scores?.map((s) => ({
        examId: s?.assignment?.id,
        examDate: s?.assignment?.examDate ?? '',
        examName: s?.assignment?.examName ?? '',
        classe: s?.assignment?.classe?.name ?? '',
        subject: s?.assignment?.subject?.course ?? undefined,
        obtainedMark: s?.obtainedMark ?? 0,
        coefficient: s?.assignment?.coefficient ?? 1,
        isPresent: s?.isPresent ?? false
    })) ?? []
}