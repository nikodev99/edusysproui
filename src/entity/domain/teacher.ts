import {Status} from "../enums/status.ts";
import {Address} from "./address.ts";
import {School} from "./school.ts";
import {Gender} from "../enums/gender.ts";
import {TeacherClassCourse} from "./TeacherClassCourse.ts";

export interface Teacher {
    id?: string
    firstName?: string
    lastName?: string
    maidenName?: string
    status?: Status | string
    birthDate?: Date
    cityOfBirth?: string
    nationality?: string
    gender?: Gender | string
    address?: Address
    emailId?: string
    image?: string
    telephone?: string
    hireDate?: Date
    teacherClassCourses?: TeacherClassCourse[]
    salaryByHour?: number
    attachments?: string[]
    schools?: School
    createdAt?: Date
    modifyAt?: Date
}