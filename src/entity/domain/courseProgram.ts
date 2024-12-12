import {Course} from "./course.ts";
import {Teacher} from "./teacher.ts";
import {Semester} from "./semester.ts";
import {Classe} from "./classe.ts";

export interface CourseProgram {
    id: number
    topic: string
    purpose: string
    description: string
    active: boolean
    passed: boolean
    updateDate: Date | number [] | string
    semester: Semester
    course: Course
    classe: Classe
    teacher: Teacher
}