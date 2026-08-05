import {Schedule, Grade, Course, ClasseTeacherBoss, ClasseStudentBoss, TeacherClasses, Enrollment, Department} from "@/entity";

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

export interface ClasseBossesProps {
    academicYear: string,
    classeId: number,
    classe?: Classe
    open?: boolean,
    onClose?: () => void
}