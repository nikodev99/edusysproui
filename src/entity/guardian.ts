import {Status} from "./enums/status.ts";
import {Gender} from "./enums/gender.ts";
import {Address} from "./Address.ts";
import {Student} from "./student.ts";

export interface Guardian {
    id?: string
    firstName?: string
    lastName?: string
    maidenName?: string
    status?: Status | string
    gender?: Gender | string
    emailId?: string
    jobTitle?: string
    company?: string
    telephone?: string
    mobile?: string
    address?: Address
    student?: Student[]
    createdAt?: Date
    modifyAt?: Date
}