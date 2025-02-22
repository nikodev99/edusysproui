import {Student} from "./student.ts";
import {Classe} from "./classe.ts";
import {AcademicYear} from "./academicYear.ts";

export interface Enrollment {
    id: number
    academicYear: AcademicYear
    student: Student
    classe: Classe
    enrollmentDate: Date
    isArchive: boolean
}