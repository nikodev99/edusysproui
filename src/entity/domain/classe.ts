import {Grade} from "./grade.ts";
import {Student} from "./student.ts";
import {School} from "./school.ts";
import {Schedule} from "./schedule.ts";
import {Teacher} from "./teacher.ts";
import {Course} from "./course.ts";

export interface Classe {
    id?: number
    name?: string
    grade?: Grade
    schedule?: Schedule[]
    roomNumber?: number
    principalTeacher?: Teacher
    principalStudent?: Student
    principalCourse?: Course
    students?: Student[]
    teachers?: Teacher[]
    monthCost?: number
    school?: School
    createdAt?: Date
    modifiedAt?: Date
}