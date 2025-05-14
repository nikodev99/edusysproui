import {ExamType} from "./examType.ts";
import {Assignment} from "./assignment.ts";

export interface Exam {
    id?: number,
    examType?: ExamType
    assignments: Assignment[]
    startDate: Date | number[]
    endDate: Date | number[]
}