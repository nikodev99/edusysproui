import {Classe} from "./classe.ts";
import {Teacher} from "./teacher.ts";
import {Day} from "../enums/day.ts";
import {Course} from "./course.ts";
import {AcademicYear} from "./academicYear.ts";

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