import {Teacher, Classe, Course, AcademicYear} from "@/entity";
import {Day, WeekDay} from "../enums/day.ts";
import {EventType} from "@/core/utils/interfaces.ts";
import {ScheduleSchema} from "@/schema";
import Datetime from "@/core/datetime.ts";

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

export type ScheduleCalendarEvent = EventType<Schedule>

export const toSchema = (event: ScheduleCalendarEvent, academicYear: string): ScheduleSchema => {
    return {
        id: event.id,
        academicYear: {id: academicYear},
        classe: {id: event.resource?.classe?.id},
        teacher: {id: event.resource?.teacher?.id},
        course: {id: event.resource?.course?.id},
        designation: event.resource?.designation,
        dayOfWeek: event.resource?.dayOfWeek,
        startTime: Datetime.of(event.start).time(),
        endTime: Datetime.of(event.end).time()
    }
}