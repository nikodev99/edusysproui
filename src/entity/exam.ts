import {Classe} from "./classe.ts";
import {Score} from "./Score.ts";
import {School} from "./school.ts";

export interface Exam {
    id?: number,
    classe?: Classe
    examName?: string
    examDate?: Date
    startTime?: Date
    endTime?: Date
    marks?: Score[]
    school?: School
}