import {Teacher} from "./teacher.ts";
import {School} from "./school.ts";

export interface Department {
    id?: number
    name?: string
    code?:string
    boss?: Teacher
    school?: School
    createdAt?: Date
    modifyAt?: Date
}