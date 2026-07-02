import {Moment} from "@/core/utils/interfaces.ts";
import {ReprimandType} from "../enums/reprimandType.ts";
import {Punishment, Individual, Enrollment} from "@/entity";
import {PunishmentType} from "@/entity/enums/punishmentType.ts";
import {PunishmentStatus} from "@/entity/enums/punishmentStatus.ts";

export interface Reprimand {
    id: number
    student: Enrollment
    reprimandDate: Moment
    type: ReprimandType
    description: string
    issuedBy: Individual
    punishment: Punishment
}

export interface ReprimandFilterProps {
    academicYear: string
    classeId?: number
    punishmentType?: PunishmentType
    reprimandType?: ReprimandType
    punishmentStatus?: PunishmentStatus
    reprimandBetween?: [Moment, Moment]
}

export const AVATAR_PALETTE = ["#f56a00", "#7265e6", "#1677ff", "#00a2ae", "#eb2f96", "#52c41a"];