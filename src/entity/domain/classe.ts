import {Grade} from "./grade.ts";
import {Student} from "./student.ts";
import {Schedule} from "./schedule.ts";
import {Course} from "./course.ts";
import {ClasseTeacherBoss} from "./ClasseTeacherBoss.ts";
import {ClasseStudentBoss} from "./ClasseStudentBoss.ts";
import {TeacherClassCourse} from "./TeacherClassCourse.ts";

export interface Classe {
    id: number
    name: string
    category: string
    grade: Grade
    schedule: Schedule[]
    roomNumber: number
    principalTeacher: ClasseTeacherBoss
    principalStudent: ClasseStudentBoss
    principalCourse: Course
    students: Student[]
    classTeacherCourses: TeacherClassCourse[]
    monthCost: number
    createdAt: Date
    modifiedAt: Date
}