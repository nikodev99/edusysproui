import {School} from "./school.ts";
import {Enrollment} from "./enrollment.ts";
import {Address} from "./address.ts";
import {Gender} from "./enums/gender.ts";
import {Guardian} from "./guardian.ts";
import {HealthCondition} from "./healthCondition.ts"
import {Score} from "./Score.ts";
import {Attendance} from "./attendance.ts";

export interface Student {
    id?: string
    firstName?: string
    lastName?: string
    gender?: Gender | string
    emailId?: string
    enrollment?: Enrollment[]
    birthDate?: Date
    birthCity?: string
    nationality?: string
    dadName?: string
    momName?: string
    reference?: string
    telephone?: string
    address?: Address
    guardian?: Guardian
    healthCondition?: HealthCondition
    marks?: Score[]
    attendances?: Attendance[]
    image?: string
    school?:School
    createdAt?: Date
    modifyAt?: Date
}