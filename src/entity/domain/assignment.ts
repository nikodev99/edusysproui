import {Planning} from "@/entity";
import {Exam} from "./exam.ts";
import {Classe} from "./classe.ts";
import {Course} from "./course.ts";
import {Score} from "./score.ts";
import {Individual} from "@/entity";
import {AssignmentType, AssignmentTypeLiteral} from "../enums/assignmentType.ts";

export interface Assignment {
    id?: bigint | number
    semester?: Planning
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