import {Planning} from "./planning.ts";
import {Exam} from "./exam.ts";
import {Classe} from "./classe.ts";
import {Course} from "./course.ts";
import {Score} from "./score.ts";
import {Individual} from "./individual.ts";

export interface Assignment {
    id: bigint
    semester: Planning
    exam: Exam
    preparedBy: Individual
    classe: Classe
    subject: Course
    examName: string
    examDate: Date | number[] | string
    startTime: Date | number[] | string
    endTime: Date | number[] | string
    passed: boolean
    marks: Score[]
    addedDate: Date | number | string
    updatedDate: Date | number | string
}