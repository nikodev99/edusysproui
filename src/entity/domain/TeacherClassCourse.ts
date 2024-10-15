import {Teacher} from "./teacher.ts";
import {Classe} from "./classe.ts";
import {Course} from "./course.ts";

export interface TeacherClassCourse {
    id: number
    teacher?: Teacher
    classe: Classe
    course: Course
}