import {z} from "zod";
import {courseSchema} from "./models/courseSchema.ts";
import {classeSchema} from "./models/classeSchema.ts";

export {enrollmentSchema} from './models/enrollmentSchema'
export {classeSchema} from './models/classeSchema'
export {courseSchema} from './models/courseSchema.ts'
export {schoolSchema} from './models/schoolSchema'
export {guardianSchema} from './models/guardianSchema'
export {studentSchema} from './models/studentSchema'
export {teacherSchema} from './models/teacherSchema'
export {addressSchema} from './models/addressSchema'

export type CourseSchema = z.infer<typeof courseSchema>
export type ClasseSchema = z.infer<typeof classeSchema>