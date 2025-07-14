import {Gender} from "../enums/gender.tsx";
import {Address} from "./address.ts";
import {Status} from "../enums/status.ts";

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
}