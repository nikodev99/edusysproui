import {Student} from "./student.ts";
import {Classe} from "./classe.ts";

export interface Enrollment {
    id?: number
    academicYear?: string
    student?: Student
    classe?: Classe
    enrollmentDate?: Date
    isArchive?: boolean
}