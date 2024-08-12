import {Classe} from "./classe.ts";
import {Score} from "./score.ts";
import {Planning} from "./planning.ts";
import {ExamType} from "./examType.ts";

export interface Exam {
    id?: number,
    semester?: Planning
    examType?: ExamType
    preparedBy?: string
    classe?: Classe
    examName?: string
    examDate?: Date
    startTime?: Date
    endTime?: Date
    marks?: Score[]
}