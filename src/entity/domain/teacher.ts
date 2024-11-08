import {School} from "./school.ts";
import {Classe} from "./classe.ts";
import {Course} from "./course.ts";
import {Individual} from "./individual.ts";
import {CourseProgram} from "./courseProgram.ts";

export interface Teacher {
    id?: string
    personalInfo: Individual
    hireDate?: Date
    classes?: Classe[]
    courses?: Course[]
    salaryByHour?: number
    courseProgram: CourseProgram[]
    schools?: School
    createdAt?: Date
    modifyAt?: Date
}