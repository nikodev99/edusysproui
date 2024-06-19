import {Classe} from "./classe.ts";
import {School} from "./school.ts";
import {Teacher} from "./teacher.ts";
import {Day} from "../enums/day.ts";
import {Course} from "./course.ts";

export interface Schedule {
    id?: number
    classe?: Classe
    teacher?: Teacher
    course?: Course
    designation?: string
    dayOfWeek?: Day | number
    startTime?: Date
    endTime?: Date
    school?: School
}