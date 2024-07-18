import {Student} from "./student.ts";
import {Exam} from "./exam.ts";

export interface Score {
    id?: bigint
    exam?: Exam
    student?: Student
    obtainedMark?: number
}