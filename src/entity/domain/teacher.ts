import { CourseProgram, Individual, Course, Classe, School } from "@/entity";

export interface Teacher {
    id?: string
    personalInfo: Individual
    hireDate?: Date | number[] | string
    classes?: Classe[]
    courses?: Course[]
    salaryByHour?: number
    courseProgram: CourseProgram[][]
    schools?: School
    createdAt?: Date
    modifyAt?: Date
}

export enum OperationType {ADD, REMOVE}

export interface TeacherClassUpdateRequest {
    operationType: OperationType;
    classIds: number[];
}

export interface TeacherCourseUpdateRequest {
    operationType: OperationType;
    courseIds: number[];
}