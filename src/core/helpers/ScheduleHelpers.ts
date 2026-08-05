import {Schedule, ScheduleCalendarEvent} from "@/entity";
import {parseTimeString, setName} from "@/core/utils/utils.ts";
import {isValidElement, ReactNode} from "react";
import {Moment} from "@/core/utils/interfaces.ts";
import {datehelper} from "@/core/helpers/DateHelpers.ts";
import {WeekDay} from "@/entity/enums/day.ts";

export class ScheduleHelpers {
    getMinMaxTimes (data: Schedule[]) {
        let minMinutes = Infinity;
        let maxMinutes = -Infinity;

        let minStartTime: [number, number] = [24, 0]
        let maxEndTime: [number, number] = [0, 0]

        for (const entry of data) {
            const start: [number, number] = parseTimeString(entry.startTime as number[])
            const end: [number, number] = parseTimeString(entry.endTime as [number, number])

            const startMinutes = start[0] * 60 + start[1];
            const endMinutes = end[0] * 60 + end[1];

            if (startMinutes < minMinutes) {
                minMinutes = startMinutes;
                minStartTime = start;
            }

            if (endMinutes > maxMinutes) {
                maxMinutes = endMinutes;
                maxEndTime = end;
            }
        }
        return {minStartTime, maxEndTime, minMinutes, maxMinutes}
    }

    setTitle (schedule: Schedule, eventTitle: string | ReactNode | ((schedule: Schedule) => string) ): string | ReactNode {
        if (eventTitle) {
            if (typeof eventTitle === "function")
                return eventTitle(schedule)

            if (typeof eventTitle === "string")
                return eventTitle

            if(isValidElement(eventTitle))
                return eventTitle;

        }
        return `${schedule?.course.course ? schedule.course.course : schedule.designation}`
    }

    scheduleTitle(schedule: Schedule): string {
        const course = schedule.course?.course ?? schedule.designation ?? 'Course'
        return schedule?.teacher && schedule.teacher.id ? `${course} — ${setName(schedule?.teacher?.personalInfo)}` : course
    }

    scheduleToEvents(schedule: Schedule, now: Moment): ScheduleCalendarEvent[] {
        const startDates = datehelper.getDates(schedule?.dayOfWeek as WeekDay, schedule.startTime as [number, number], now)
        const endDates = datehelper.getDates(schedule.dayOfWeek as WeekDay, schedule?.endTime as [number, number], now)

        while (startDates.length < startDates.length) {
            endDates.push(endDates[endDates.length - 1])
        }

        return startDates.map((start, index) => ({
            id: `${schedule.id} - ${index}`,
            title: this.scheduleTitle(schedule),
            start,
            end: endDates[index] || start, // Ensure `end` aligns with `start`
            allDay: false,
            resource: schedule
        })) as ScheduleCalendarEvent[];
    }

    schedulesToEvents(schedules: Schedule[], now: Moment = new Date()) {
        return schedules?.flatMap((schedule) => this.scheduleToEvents(schedule, now))
    }

    eventToDayTimePayload(event: { start: Date; end: Date }) {
        return {
            dayOfWeek: datehelper.dateToDay(event.start),
            startTime: datehelper.toTimeArray(event.start),
            endTime: datehelper.toTimeArray(event.end),
        }
    }
}

export const scheduleHelper = new ScheduleHelpers()