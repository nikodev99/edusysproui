import {Individual, Student} from "@/entity";
import {Classe} from "./classe.ts";
import {AcademicYear} from "@/entity";
import {StudentListDataType} from "@/core/utils/interfaces.ts";
import {Gender} from "@/entity/enums/gender.tsx";
import {SectionType} from "@/entity/enums/section.ts";
import {getAge} from "@/core/utils/utils.ts";

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
        isArchived: data?.isArchived,
        enrollmentDate: data?.lastEnrolledDate as Date
    } as Enrollment
}

export const fromEnrollment = (enrollment: Enrollment): StudentListDataType => {
    return {
        enrollmentId: enrollment?.id,
        id: enrollment?.student?.id,
        academicYear: enrollment?.academicYear,
        reference: enrollment?.student?.personalInfo?.reference as string,
        firstName: enrollment?.student?.personalInfo?.firstName as string,
        lastName: enrollment?.student?.personalInfo?.lastName as string,
        gender: enrollment?.student?.personalInfo?.gender as Gender,
        age: getAge(enrollment?.student?.personalInfo?.birthDate as []) as number,
        lastEnrolledDate: enrollment?.enrollmentDate,
        classeId: enrollment?.classe?.id,
        classe: enrollment?.classe?.name,
        grade: enrollment?.classe?.grade?.section as SectionType,
        image: enrollment?.student?.personalInfo?.image as string,
        isArchived: enrollment?.isArchived
    }
}