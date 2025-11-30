import {Moment} from "../../core/utils/interfaces.ts";
import {ReprimandType} from "../enums/reprimandType.ts";
import {Punishment} from "./punishment.ts";
import {Individual} from "./individual.ts";
import {Student} from "./student.ts";
import {AcademicYear} from "./academicYear.ts";
import {Classe} from "./classe.ts";

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