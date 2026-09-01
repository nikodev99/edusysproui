import {School} from "./school.ts";
import {Planning, Score} from "@/entity";
import {SectionType} from "../enums/section.ts";

export interface Grade {
    id?: number
    section?: SectionType | string
    subSection?: string
    gradingScaleMax: number
    gradingPassThreshold: number
    school?: School
    planning?: Planning[]
    createdAt?: Date | number[] | string
    modifyAt?: Date | number[] | string
}

export type GradeRankingStudent = {
    gradeId: number
    classeName?: string
    section?: SectionType | string
    subSection?: string
    bestStudentScores: Score[]
    poorStudentScores: Score[]
}

export const checkIfGradeRanking = (variable: object) => {
    return Object.keys(variable).includes('gradeId')
}