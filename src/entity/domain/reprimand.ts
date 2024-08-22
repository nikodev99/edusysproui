import {Student} from "./student.ts";
import {PrimitiveDate} from "../../utils/interfaces.ts";
import {ReprimandType} from "../enums/reprimandType.ts";
import {Punishment} from "./punishment.ts";

export interface Reprimand {
    id: number
    student: Student
    reprimandDate: PrimitiveDate
    type: ReprimandType
    description: string
    issuedBy: string
    punishment: Punishment
}