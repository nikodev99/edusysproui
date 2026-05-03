import {CourseProgram, Semester} from "@/entity";
import Datetime from "@/core/datetime.ts";
import {ProgramTiming} from "@/entity/domain/courseProgram.ts";

export class SemesterHelper {
    getCurrentSemesterId (semesters: Semester[]): number {
        for (const semester of semesters) {
            if (this.isActive(semester))
                return semester?.semesterId
        }

        return semesters[semesters.length - 1]?.semesterId ?? 0
    }

    sortSemesterByCurrentDate (semesters: Semester[]): Semester[] {
        const now = Datetime.now()

        const active = semesters?.filter(semester => this.isActive(semester, now))
        const upcoming = semesters?.filter(s => this.isUpcoming(s, now))
        const past = semesters?.filter(s => this.isPast(s, now))

        upcoming?.sort((a, b) => Datetime.of(a?.startDate).compare(b?.startDate))
        past?.sort((a, b) => Datetime.of(b?.startDate).compare(a?.startDate))

        return [...active, ...upcoming, ...past]
    }

    getActiveSemester (semesters: Semester[]): Semester | null {
        for (const semester of semesters) {
            if (this.isActive(semester))
                return semester
        }

        return null
    }

    isActive(semester: Semester, current?: Datetime | null) {
        const now = current ?? Datetime.now()
        const isBetween = now.isBetween(semester?.startDate, semester?.endDate)
        const isEqual = now.isSame(semester?.startDate, 'day') || now?.isSame(semester?.endDate, 'day')

        return isBetween || isEqual
    }

    isUpcoming(semester: Semester, now?: Datetime | null) {
        return now
            ? now.isAfter(semester?.startDate)
            : Datetime.now().isAfter(semester?.startDate)
    }

    isPast(semester: Semester, current?: Datetime | null) {
        return current
            ? current.isAfter(semester?.endDate)
            : Datetime.now().isAfter(semester?.endDate)
    }

    checkLateStatus (timing: ProgramTiming): boolean {
        const now = Datetime.now()
        return (
            now.isAfter(timing?.startDate) &&
            timing?.status !== 'IN_PROGRESS' &&
            timing?.status !== 'COMPLETED'
        ) || (
            now.isAfter(timing?.endDate) &&
            timing?.status !== 'COMPLETED'
        )
    }
}

export const semesterHelper = new SemesterHelper()