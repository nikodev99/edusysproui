import {Grade} from "./grade.ts";
import {Schedule} from "./schedule.ts";
import {Course} from "./course.ts";
import {ClasseTeacherBoss} from "./classeTeacherBoss.ts";
import {ClasseStudentBoss} from "./classeStudentBoss.ts";
import {TeacherClasses} from "./teacher.ts";
import {Enrollment} from "./enrollment.ts";
import {Department} from "./department.ts";

export interface Classe {
    id: number
    name: string
    category: string
    grade: Grade
    department: Department
    schedule: Schedule[]
    roomNumber: number
    principalTeacher: ClasseTeacherBoss
    principalStudent: ClasseStudentBoss
    principalCourse: Course
    students: Enrollment[]
    classeTeachers: TeacherClasses[]
    monthCost: number
    createdAt: Date | number
    modifiedAt: Date | number
}