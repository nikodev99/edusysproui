import {Individual} from "./individual.ts";
import {School} from "./school.ts";

export interface Employee {
    id: string;
    personalInfo: Individual
    school: School
    jobTitle: string
    salary: number
    contractType: string
    active: boolean
    hireDate: number[] | Date | string
    createdAt: number[] | Date | string
    modifyAt: number[] | Date | string
}