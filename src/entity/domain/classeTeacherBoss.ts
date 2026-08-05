import {AcademicYear, Classe, Teacher} from "@/entity";

export interface ClasseTeacherBoss {
    id?: number
    academicYear?: AcademicYear
    classe?: Classe
    principalTeacher?: Teacher
    current?: boolean
    startPeriod?: Date | number[]
    endPeriod?: Date | number[]
}

export interface DepartmentTeacherBoss {
    id?: number
    academicYear?: AcademicYear
    d_boss?: Teacher
    current?: boolean
    startPeriod?:  | number[]
    endPeriod?: Date | number[]
}