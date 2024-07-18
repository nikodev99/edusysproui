import {Classe} from "./classe.ts";
import {Score} from "./score.ts";
import {Planning} from "./planning.ts";

export interface Exam {
    id?: number,
    semester?: Planning
    preparedBy?: string
    classe?: Classe
    examName?: string
    examDate?: Date
    startTime?: Date
    endTime?: Date
    marks?: Score[]
}