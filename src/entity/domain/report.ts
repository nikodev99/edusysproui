import {CourseProgram, ProgramTopic, Schedule, Teacher} from "@/entity";
import {Moment} from "@/core/utils/interfaces.ts";

export interface Report {
    id: number
    courseProgram: CourseProgram
    courseProgramTopic: ProgramTopic
    teacher: Teacher
    schedule: Schedule
    sessionDate: Moment
    sessionStartingTime: Moment
    sessionEndingTime: Moment
    duration_minutes: number
    isLateSubmission: boolean
    reportStatus: ReportStatus
    notes: string
    createdAt: Moment
}

export enum ReportStatusEnum {
    SUBMITTED,
    MISSING,
    PENDING,
    UPCOMING
}

export type ReportStatus = keyof typeof ReportStatusEnum;

export const reportStatusColors: Record<ReportStatus, { label: string, c: string, bg: string, bd: string, dot: string, accentBg: string }> = {
    SUBMITTED:{ label:"Rapport soumis",   c:"#166534", bg:"#F0FDF4", bd:"#86EFAC", dot:"#22C55E", accentBg:"#22C55E" },
    MISSING:  { label:"Rapport manquant", c:"#991B1B", bg:"#FFF1F2", bd:"#FCA5A5", dot:"#EF4444", accentBg:"#EF4444" },
    PENDING:  { label:"À soumettre",      c:"#92400E", bg:"#FFFBEB", bd:"#FCD34D", dot:"#F59E0B", accentBg:"#F59E0B" },
    UPCOMING: { label:"À venir",          c:"#64748B", bg:"#F8FAFC", bd:"#E2E8F0", dot:"#CBD5E1", accentBg:"#CBD5E1" },
};