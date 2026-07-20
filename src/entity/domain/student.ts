import {Enrollment, Guardian, HealthCondition, Score, Attendance, Individual, Classe, School} from "@/entity";

export interface Student {
    id: string
    personalInfo?: Individual
    enrollments: Enrollment[]
    dadName: string
    momName: string
    guardian: Guardian
    healthCondition: HealthCondition
    marks: Score[]
    attendances: Attendance[]
    classe: Classe
    school: School
    createdAt: Date | number | string
    modifyAt: Date | number | string
}