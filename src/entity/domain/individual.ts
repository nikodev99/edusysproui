import {Gender} from "../enums/gender.tsx";
import {Address} from "./address.ts";
import {Status} from "../enums/status.ts";
import {UserType} from "../../auth/dto/user.ts";

export interface Individual {
    id: bigint | number;
    firstName: string
    lastName: string
    maidenName: string
    gender: Gender | string
    status: Status | string
    emailId: string
    birthDate: Date | number[] | string
    birthCity: string
    nationality: string
    telephone: string
    mobile: string
    reference: string
    address: Address
    image: string
    attachments: string[]
    individualType: IndividualType | number
}

export enum IndividualType {
    EMPLOYEE, GUARDIAN, TEACHER, STUDENT
}

export const individualTypeToUserType = (individualType: IndividualType): UserType => {
    switch (individualType) {
        case IndividualType.EMPLOYEE:
            return UserType.EMPLOYEE;
        case IndividualType.GUARDIAN:
            return UserType.GUARDIAN;
        case IndividualType.TEACHER:
            return UserType.TEACHER;
        default:
            return UserType.EMPLOYEE
    }
}