import {Schedule} from "@/entity";
import {parseTimeString} from "@/core/utils/utils.ts";

export class ScheduleHelpers {
    getMinMaxTimes = (data: Schedule[]) => {
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
}

export const scheduleHelper = new ScheduleHelpers()