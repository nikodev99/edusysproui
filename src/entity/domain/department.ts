import {School} from "./school.ts";
import {ClasseTeacherBoss} from "./classeTeacherBoss.ts";

export interface Department {
    id?: number
    name?: string
    code?:string
    boss?: ClasseTeacherBoss
    school?: School
    createdAt?: Date
    modifyAt?: Date
}