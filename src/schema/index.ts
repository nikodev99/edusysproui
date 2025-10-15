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
import {loginSchema, logoutSchema, signupSchema} from "./models/authSchema.ts";
import {employeeSchema} from "./models/employeeSchema.ts";
import {schoolSchema} from "./models/schoolSchema.ts";
import {academicYearSchema} from "./models/academicYearSchema.ts";
import {gradeSchema} from "./models/gradeSchema.ts";
import {
    allSemesterSchema, allSemesterTemplateSchema,
    semesterSchema, semesterTemplateSchema,
} from "./models/semesterSchema.ts";
import {departmentBossSchema, departmentSchema} from "./models/departmentSchema.ts";

export {enrollmentSchema} from './models/enrollmentSchema'
export {classeSchemaMerge, classeSchema} from './models/classeSchema'
export {courseSchemaMerge, courseSchema} from './models/courseSchema.ts'
export {gradeSchemaMerge, gradeSchema} from './models/gradeSchema.ts'
export {departmentSchemaMerge,departmentSchema} from './models/departmentSchema.ts'
export {schoolMergeSchema, schoolSchema} from './models/schoolSchema'
export {guardianSchema} from './models/guardianSchema'
export {studentSchema, studentSchemaMerge} from './models/studentSchema'
export {teacherSchema} from './models/teacherSchema'
export {addressSchema} from './models/addressSchema'
export {healthSchema} from './models/healthSchema'
export {individualSchema, individualSchemaMerge} from './models/individualSchema.ts'
export {assignmentDateUpdateSchema, assignmentSchema, assignmentMerge} from './models/assignmentSchema.ts'
export {attendanceSchema, singleAttendanceSchema} from './models/attendanceSchema.ts'
export {planningSchemaMerge, planningSchema} from './models/planningSchema.ts'
export {scoreSchema, singleScoreSchema} from './models/scoreSchema.ts'
export {loginSchema, logoutSchema, signupSchema, assignUserToSchoolSchema} from './models/authSchema.ts'
export {academicYearSchema, academicYearSchemaMerge} from './models/academicYearSchema.ts'
export {semesterSchema, semesterTemplateSchema, allSemesterSchema, allSemesterTemplateSchema} from './models/semesterSchema.ts'

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
export type SingleAttendanceSchema = z.infer<typeof singleScoreSchema>
export type PlanningMergeSchema = z.infer<typeof planningSchemaMerge>
export type PlanningSchema = z.infer<typeof planningSchema>
export type IndividualMergeSchema = z.infer<typeof individualSchemaMerge>
export type AssignmentSchema = z.infer<typeof assignmentSchema>
export type ScoreSchema = z.infer<typeof scoreSchema>
export type SingleScoreSchema = z.infer<typeof singleScoreSchema>
export type LoginSchema = z.infer<typeof loginSchema>
export type LogoutSchema = z.infer<typeof logoutSchema>
export type SignupSchema = z.infer<typeof signupSchema>
export type EmployeeSchema = z.infer<typeof employeeSchema>
export type SchoolSchema = z.infer<typeof schoolSchema>
export type AcademicYearSchema = z.infer<typeof academicYearSchema>
export type GradeSchema = z.infer<typeof gradeSchema>
export type SemesterSchema = z.infer<typeof semesterSchema>
export type AllSemesterSchema = z.infer<typeof allSemesterSchema>
export type SemesterTemplateSchema = z.infer<typeof semesterTemplateSchema>
export type AllSemesterTemplateSchema = z.infer<typeof allSemesterTemplateSchema>
export type DepartmentSchema = z.infer<typeof departmentSchema>
export type DepartmentBossSchema = z.infer<typeof departmentBossSchema>
export type AssignUserToSchoolSchema = z.infer<typeof assignUserToSchoolSchema>