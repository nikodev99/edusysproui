import {Student} from "./student.ts";
import {Individual} from "./individual.ts";
import {School} from "./school.ts";

export interface Guardian {
    id: string
    personalInfo: Individual
    jobTitle: string
    company: string
    students: Student[] | undefined
    createdAt: Date | undefined
    modifyAt: Date | undefined
    school: School[]
}

export const toGuardianSchema = (guardian: Guardian) => {
    const p = guardian.personalInfo
    return {
        id: guardian.id,
        personalInfo: {
            firstName: p.firstName,
            lastName: p.lastName,
            maidenName: p.maidenName,
            gender: p.gender,
            status: p.status,
            emailId: p.emailId,
            birthDate: p.birthDate,
            birthCity: p.birthCity,
            nationality: p.nationality,
            telephone: p.telephone,
            mobile: p.mobile,
            address: {
                id: p.address.id,
                number: p.address.number,
                street: p.address.street,
                secondStreet: p.address.secondStreet,
                neighborhood: p.address.neighborhood,
                borough: p.address.borough,
                city: p.address.city,
                zipCode: p.address.zipCode,
                country: p.address.country
            },
            image: p.image,
            attachments: p.attachments
        },
        company: guardian.company,
        jobTitle: guardian.jobTitle,
    }
}