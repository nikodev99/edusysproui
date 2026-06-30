import {Semester, Exam, Classe, Course, Score, Individual} from "@/entity";
import {AssignmentType, AssignmentTypeLiteral} from "../enums/assignmentType.ts";

export type AssignmentFilterProps = {
    academicYearId: string
    teacherId?: number
    gradeId?: number
    semesterId?: number
    classeId?: number
    courseId?: number
    search?: string
}

export interface Assignment {
    id?: bigint | number
    semester?: Semester
    exam?: Exam
    preparedBy?: Individual
    classe?: Classe
    subject?: Course
    examName?: string
    examDate?: Date | number[] | string
    startTime?: Date | number[] | string
    endTime?: Date | number[] | string
    passed?: boolean
    marks?: Score[]
    coefficient?: number
    type?: AssignmentType | AssignmentTypeLiteral
    addedDate?: Date | number | string
    updatedDate?: Date | number | string
}

export interface AssignmentTypeAverage {
    type: AssignmentType | AssignmentTypeLiteral,
    average: number
}