import {PrimitiveDate} from "../../utils/interfaces.ts";
import {PunishmentType} from "../enums/punishmentType.ts";
import {PunishmentStatus} from "../enums/punishmentStatus.ts";

export interface Punishment {
    id: number
    isRequire: boolean
    type: PunishmentType
    description: string
    startDate: PrimitiveDate
    endDate: PrimitiveDate
    status: PunishmentStatus
    executedBy: string
    appealed: boolean
    appealedNote: string
}