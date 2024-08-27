import {Classe} from "./classe.ts";
import {Score} from "./score.ts";
import {Planning} from "./planning.ts";
import {ExamType} from "./examType.ts";
import {Course} from "./course.ts";

export interface Exam {
    id?: number,
    semester?: Planning
    examType?: ExamType
    preparedBy?: string
    classe: Classe
    subject?: Course
    examName: string
    examDate: Date | number[] | string
    startTime?: Date | number[] | string
    endTime?: Date | number[] | string
    marks?: Score[]
}