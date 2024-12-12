import {School} from "./school.ts";
import {DepartmentTeacherBoss} from "./classeTeacherBoss.ts";

export interface Department {
    id?: number
    name?: string
    code?:string
    purpose?: string
    boss?: DepartmentTeacherBoss
    school?: School
    createdAt?: Date
    modifyAt?: Date
}