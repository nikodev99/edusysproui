import {Teacher, Classe, Course, AcademicYear} from "@/entity";
import {Day} from "../enums/day.ts";

export interface Schedule {
    id: number
    academicYear: AcademicYear
    classe?: Classe
    teacher?: Teacher
    course: Course
    designation?: string
    dayOfWeek?: Day | number
    startTime?: Date | number[]
    endTime?: Date | number[]
}