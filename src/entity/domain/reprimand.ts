import {Moment} from "@/core/utils/interfaces.ts";
import {ReprimandType} from "../enums/reprimandType.ts";
import {Punishment, Individual, Enrollment} from "@/entity";

export interface Reprimand {
    id: number
    student: Enrollment
    reprimandDate: Moment
    type: ReprimandType
    description: string
    issuedBy: Individual
    punishment: Punishment
}