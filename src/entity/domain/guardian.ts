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

export const toGuardianSchema = (guardian: Guardian) => {
    return {
        id: guardian.id,
        lastName: guardian.lastName,
        firstName: guardian.firstName,
        gender: guardian.gender,
        status: guardian.status,
        maidenName: guardian.maidenName,
        emailId: guardian.emailId,
        company: guardian.company,
        jobTitle: guardian.jobTitle,
        telephone: guardian.telephone,
        mobile: guardian.mobile,
        address: {
            id: guardian.address?.id,
            number: guardian.address?.number as number,
            street: guardian.address?.street as string,
            secondStreet: guardian.address?.secondStreet,
            neighborhood: guardian.address?.neighborhood as string,
            borough: guardian.address?.borough,
            city: guardian.address?.city as string,
            zipCode: guardian.address?.zipCode,
            country: guardian.address?.country as string,
        }
    }
}