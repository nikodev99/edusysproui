import {Moment} from "@/core/utils/interfaces.ts";
import {ReprimandType} from "../enums/reprimandType.ts";
import {Punishment, Student, Individual, AcademicYear, Classe} from "@/entity";

export interface Reprimand {
    id: number
    academicYear: AcademicYear
    student: Student
    classe: Classe
    reprimandDate: Moment
    type: ReprimandType
    description: string
    issuedBy: Individual
    punishment: Punishment
}