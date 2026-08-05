import {AcademicYear, Classe, Student} from "@/entity";
import {Moment} from "@/core/utils/interfaces.ts";

export interface ClasseStudentBoss {
    id?: number
    academicYear?: AcademicYear
    classe?: Classe
    principalStudent?: Student
    current?: boolean
    startPeriod?: Moment
    endPeriod?: Moment
}