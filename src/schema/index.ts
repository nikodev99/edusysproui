import {z} from "zod";
import {courseSchema, courseSchemaMerge} from "./models/courseSchema.ts";
import {classeSchema, classeSchemaMerge} from "./models/classeSchema.ts";
import {guardianSchema} from "./models/guardianSchema.ts";
import {enrollmentSchema} from "./models/enrollmentSchema.ts";
import {studentSchema} from "./models/studentSchema.ts";
import {addressSchema} from "./models/addressSchema.ts";
import {healthSchema} from "./models/healthSchema.ts";
import {teacherSchema} from "./models/teacherSchema.ts";
import {individualSchema} from "./models/individualSchema.ts";

export {enrollmentSchema} from './models/enrollmentSchema'
export {classeSchemaMerge, classeSchema} from './models/classeSchema'
export {courseSchemaMerge, courseSchema} from './models/courseSchema.ts'
export {gradeSchemaMerge} from './models/gradeSchema.ts'
export {departmentSchemaMerge} from './models/departmentSchema.ts'
export {schoolSchema} from './models/schoolSchema'
export {guardianSchema} from './models/guardianSchema'
export {studentSchema} from './models/studentSchema'
export {teacherSchema} from './models/teacherSchema'
export {addressSchema} from './models/addressSchema'
export {healthSchema} from './models/healthSchema'
export {individualSchema} from './models/individualSchema.ts'

export type CourseSchema = z.infer<typeof courseSchema>
export type CourseSchemaMerge = z.infer<typeof courseSchemaMerge>
export type ClasseSchemaMerge = z.infer<typeof classeSchemaMerge>
export type ClasseSchema = z.infer<typeof classeSchema>
export type GuardianSchema = z.infer<typeof guardianSchema>
export type EnrollmentSchema = z.infer<typeof enrollmentSchema>
export type StudentSchema = z.infer<typeof studentSchema>
export type AddressSchema = z.infer<typeof addressSchema>
export type HealthSchema = z.infer<typeof healthSchema>
export type TeacherSchema = z.infer<typeof teacherSchema>
export type IndividualSchema = z.infer<typeof individualSchema>