import {z} from "zod";
import {courseSchema, courseSchemaMerge} from "./models/courseSchema.ts";
import {classeSchema, classeSchemaMerge} from "./models/classeSchema.ts";
import {guardianSchema} from "./models/guardianSchema.ts";
import {enrollmentSchema} from "./models/enrollmentSchema.ts";
import {studentSchema} from "./models/studentSchema.ts";
import {addressSchema} from "./models/addressSchema.ts";
import {healthSchema} from "./models/healthSchema.ts";
import {teacherSchema} from "./models/teacherSchema.ts";
import {individualSchema, individualSchemaMerge} from "./models/individualSchema.ts";
import {assignmentDateUpdateSchema, assignmentSchema} from "./models/assignmentSchema.ts";
import {attendanceSchema} from "./models/attendanceSchema.ts";
import {planningSchema, planningSchemaMerge} from "./models/planningSchema.ts";
import {scoreSchema, singleScoreSchema} from "./models/scoreSchema.ts";

export {enrollmentSchema} from './models/enrollmentSchema'
export {classeSchemaMerge, classeSchema} from './models/classeSchema'
export {courseSchemaMerge, courseSchema} from './models/courseSchema.ts'
export {gradeSchemaMerge, gradeSchema} from './models/gradeSchema.ts'
export {departmentSchemaMerge} from './models/departmentSchema.ts'
export {schoolSchema} from './models/schoolSchema'
export {guardianSchema} from './models/guardianSchema'
export {studentSchema, studentSchemaMerge} from './models/studentSchema'
export {teacherSchema} from './models/teacherSchema'
export {addressSchema} from './models/addressSchema'
export {healthSchema} from './models/healthSchema'
export {individualSchema, individualSchemaMerge} from './models/individualSchema.ts'
export {assignmentDateUpdateSchema, assignmentSchema, assignmentMerge} from './models/assignmentSchema.ts'
export {attendanceSchema} from './models/attendanceSchema.ts'
export {planningSchemaMerge, planningSchema} from './models/planningSchema.ts'
export {scoreSchema, singleScoreSchema} from './models/scoreSchema.ts'

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
export type AssignmentUpdateDate = z.infer<typeof assignmentDateUpdateSchema>
export type AttendanceSchema = z.infer<typeof attendanceSchema>
export type PlanningMergeSchema = z.infer<typeof planningSchemaMerge>
export type PlanningSchema = z.infer<typeof planningSchema>
export type IndividualMergeSchema = z.infer<typeof individualSchemaMerge>
export type AssignmentSchema = z.infer<typeof assignmentSchema>
export type ScoreSchema = z.infer<typeof scoreSchema>
export type SingleScoreSchema = z.infer<typeof singleScoreSchema>