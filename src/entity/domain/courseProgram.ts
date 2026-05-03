import {Teacher, Course, Semester, Classe, AcademicYear} from "@/entity";
import {Color, ID, Moment} from "@/core/utils/interfaces.ts";

export interface CourseProgram {
    id: number
    name: string
    purpose: string
    description: string
    timing: ProgramTiming
    topic: ProgramTopic[]
}

export interface CourseProgramResponse {
    teacher: Teacher
    course: Course
    classe: Classe
    academicYear: AcademicYear
    semesters: SemesterProgram[]
}

export interface SemesterProgram {
    semester: Semester
    programs: CourseProgram[]
}

export interface ProgramTiming {
    id: ID
    status: keyof typeof ProgramStatus,
    startDate: Moment,
    endDate: Moment,
    completedAt: Moment
    updatedAt: Moment
}

export interface ProgramTopic {
    id: ID
    title: string,
    description: string,
    order: number
    timing: ProgramTiming
}

export enum ProgramStatus {
    DEBUTED = 'Débuté',
    IN_PROGRESS = "En cours",
    COMPLETED = "Terminé",
    CANCELLED = "Annulé",
    LATE = "En retard",
    PROGRAMMED = "Programmé"
}

export const statusConfig = (status: keyof typeof ProgramStatus, color?: Color): {label: string, bg: string, color: string, dot: string} => {
    switch (status) {
        case "DEBUTED": {
            return { label: ProgramStatus[status], bg: "#EEF2FF", color: color ?? "#4338CA", dot: "#818CF8" }
        }
        case "IN_PROGRESS": {
            return { label: ProgramStatus[status], bg: "#ECFDF5", color: color ?? "#065F46", dot: "#34D399" }
        }
        case "COMPLETED": {
            return { label: ProgramStatus[status], bg: "#F0FDF4", color: color ?? "#166534", dot: "#22C55E" }
        }
        case "LATE": {
            return { label: ProgramStatus[status], bg: "#FEF2F2", color: color ?? "#991B1B", dot: "#F87171" }
        }
        default: {
            return { label: ProgramStatus[status], bg: "#f2f4fe", color: color ?? "#03104c", dot: "#8a87f3" }
        }
    }
};