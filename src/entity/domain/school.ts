import {Address} from "./address.ts";
import {Grade} from "./grade.ts";

export interface School {
    id?: string
    name?: string
    abbr?: string
    address?: Address
    foundedDate?: Date
    accreditationCode?: string
    accreditationNumber?: string
    contactEmail?: string
    phoneNumber?: string
    websiteURL?: string
    grade?: Grade[]
    createdAt?: Date
    modifyAt?: Date
}