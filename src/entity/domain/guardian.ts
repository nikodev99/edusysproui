import {Status} from "../enums/status.ts";
import {Gender} from "../enums/gender.ts";
import {Address} from "./address.ts";
import {Student} from "./student.ts";

export interface Guardian {
    id: string
    firstName: string
    lastName: string
    maidenName: string
    status: Status | string
    gender: Gender | string
    emailId: string
    jobTitle: string
    company: string
    telephone: string
    mobile: string
    address: Address | undefined
    students: Student[] | undefined
    createdAt: Date | undefined
    modifyAt: Date | undefined
}