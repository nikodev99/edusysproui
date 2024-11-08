import {Course} from "./course.ts";
import {Teacher} from "./teacher.ts";
import {Semester} from "./semester.ts";

export interface CourseProgram {
    id: number
    topic: string
    updateDate: Date | number [] | string
    semester: Semester
    course: Course
    teacher: Teacher
}