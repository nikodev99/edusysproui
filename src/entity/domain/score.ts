import {Student, Assignment} from "@/entity";
import {AssignmentTypeLiteral} from "@/entity/enums/assignmentType.ts";
import {CourseType} from "@/entity/domain/course.ts";
import {SectionType} from "@/entity/enums/section.ts";

export interface Score {
    id?: bigint | number
    assignment?: Assignment
    assignmentCount: number
    student?: Student
    obtainedMark: number
    shrinkMark: number
    isPresent?: boolean
}

export type RadarAxis = {
    courseType: CourseType
    average: number
    assignmentCount: number
    reliable: boolean
}

export enum ScoreMode {
    DIGITS = 'La notation chiffrée (sur 10, 20, 100)',
    LETTERS = 'La notation en lettres (A, B, C, D, E, F)',
    PERCENT = 'La notation en pourcentage (10%, 20%, 100%)',
    QCM = 'La notation en QCM (oui/non)',
}

export type ScoreType = keyof typeof ScoreMode

export type ScoreSettings = {section: keyof typeof SectionType, value: number}

export const initExamData = (scores: Score[]) => {
    return scores?.map((s) => ({
        examId: s?.assignment?.id,
        examDate: s?.assignment?.examDate ?? '',
        examName: s?.assignment?.examName ?? '',
        examType: AssignmentTypeLiteral[s?.assignment?.type as unknown as keyof typeof AssignmentTypeLiteral],
        classe: s?.assignment?.classe?.name ?? '',
        subject: s?.assignment?.subject?.course ?? undefined,
        obtainedMark: s?.obtainedMark ?? 0,
        coefficient: s?.assignment?.coefficient ?? 1,
        isPresent: s?.isPresent ?? false
    })) ?? []
}