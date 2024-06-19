import {Status} from "../enums/status.ts";
import {Address} from "./address.ts";
import {Classe} from "./classe.ts";
import {School} from "./school.ts";
import {Course} from "./course.ts";
import {Gender} from "../enums/gender.ts";

export interface Teacher {
    id?: string
    firstName?: string
    lastName?: string
    maidenName?: string
    status?: Status | string
    birthDate?: Date
    gender?: Gender | string
    address?: Address
    emailId?: string
    telephone?: string
    hireDate?: Date
    classes?: Classe[]
    courses?: Course[]
    salaryByHour?: number
    schools?: School
    createdAt?: Date
    modifyAt?: Date
}