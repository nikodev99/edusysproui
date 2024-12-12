import {Moment} from "../../utils/interfaces.ts";
import {ReprimandType} from "../enums/reprimandType.ts";
import {Punishment} from "./punishment.ts";
import {Enrollment} from "./enrollment.ts";
import {Individual} from "./individual.ts";

export interface Reprimand {
    id: number
    student: Enrollment
    reprimandDate: Moment
    type: ReprimandType
    description: string
    issuedBy: Individual
    punishment: Punishment
}