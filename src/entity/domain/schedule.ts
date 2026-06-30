import {Teacher, Classe, Course, AcademicYear} from "@/entity";
import {Day, WeekDay} from "../enums/day.ts";

export interface Schedule {
    id: number
    academicYear: AcademicYear
    classe?: Classe
    teacher?: Teacher
    course: Course
    designation?: string
    dayOfWeek?: WeekDay | Day | number
    startTime?: Date | number[]
    endTime?: Date | number[]
}