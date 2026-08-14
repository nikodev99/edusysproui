import {
    Enrollment,
    Guardian,
    HealthCondition,
    Attendance,
    Individual,
    Classe,
    School,
    RadarAxis,
    Score
} from "@/entity";

export interface Student {
    id: string
    personalInfo?: Individual
    enrollments: Enrollment[]
    dadName: string
    momName: string
    guardian: Guardian
    healthCondition: HealthCondition
    marks: Score[]
    courseTypeStats: RadarAxis[];
    attendances: Attendance[]
    classe: Classe
    school: School
    createdAt: Date | number | string
    modifyAt: Date | number | string
}