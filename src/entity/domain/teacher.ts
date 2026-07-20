import {CourseProgram, Individual, Course, Classe, School, EmployeeContract} from "@/entity";

export interface Teacher {
    id?: string
    personalInfo: Individual
    status: AffiliationStatus
    classes?: TeacherClasses[]
    courses?: TeacherCourses[]
    courseProgram: CourseProgram[][]
    contract: EmployeeContract
    school?: School
    createdAt?: Date
    modifyAt?: Date
}

export interface TeacherSchoolAffiliate {
    id: number
    classes?: TeacherClasses[]
    courses?: TeacherCourses[]
    teacher: Teacher
    school: School
    status: AffiliationStatus
    contract: EmployeeContract
}

export interface TeacherCourses {
    id: number
    course: Course
    affiliation: TeacherSchoolAffiliate
}

export interface TeacherClasses {
    id: number
    classe: Classe
    affiliation: TeacherSchoolAffiliate
}

export const getCourses = (data: Teacher) => {
    return data?.courses?.map(course => course.course)
}

export const getClasses = (data: Teacher) => {
    return data?.classes?.map(course => course.classe)
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

export enum AffiliationStatusEnum {
    ACTIVE = "Actif",
    TERMINATED = "Terminé",
    SUSPENDED = "Suspendu",
}

export type AffiliationStatus = keyof typeof AffiliationStatusEnum