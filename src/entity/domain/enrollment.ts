import {Individual, Student} from "@/entity";
import {Classe} from "./classe.ts";
import {AcademicYear} from "@/entity";
import {StudentListDataType} from "@/core/utils/interfaces.ts";

export interface Enrollment {
    id: number
    academicYear: AcademicYear
    student: Student
    classe: Classe
    enrollmentDate: Date
    isArchived: boolean
}

export const toEnrollment = (data: StudentListDataType): Enrollment => {
    return {
        id: data?.enrollmentId,
        academicYear: data?.academicYear,
        student: {
            id: data?.id,
            personalInfo: {
                firstName: data?.firstName,
                lastName: data?.lastName,
                gender: data?.gender,
                reference: data?.reference,
                image: data?.image
            } as Individual
        } as Student,
        classe: {
            id: data?.classeId,
            name: data?.classe,
            grade: {
                section: data?.grade
            }
        } as Classe,
        enrollmentDate: data?.lastEnrolledDate as Date
    } as Enrollment
}