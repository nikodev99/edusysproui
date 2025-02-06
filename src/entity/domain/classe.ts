import {Grade} from "./grade.ts";
import {Student} from "./student.ts";
import {Schedule} from "./schedule.ts";
import {Course} from "./course.ts";
import {ClasseTeacherBoss} from "./classeTeacherBoss.ts";
import {ClasseStudentBoss} from "./classeStudentBoss.ts";
import {Teacher} from "./teacher.ts";

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
    classeTeachers: Teacher[]
    monthCost: number
    createdAt: Date | number
    modifiedAt: Date | number
}