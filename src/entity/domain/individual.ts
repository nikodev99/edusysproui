import {Gender} from "../enums/gender.ts";
import {Address} from "./address.ts";
import {Status} from "../enums/status.ts";

export interface Individual {
    id: number;
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
    address: Address
    image: string
    attachments: string[]
}