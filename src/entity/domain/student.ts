import {Enrollment} from "./enrollment.ts";
import {Guardian} from "./guardian.ts";
import {HealthCondition} from "./healthCondition.ts"
import {Score} from "./score.ts";
import {Attendance} from "./attendance.ts";
import {Individual} from "./individual.ts";
import {Classe} from "./classe.ts";
import {School} from "./school.ts";

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