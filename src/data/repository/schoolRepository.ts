import {apiClient} from "../axiosConfig.ts";
import {School} from "../../entity";
import {SectionType} from "../../entity/enums/section.ts";

export const getSchool = (schoolId: string) => {
    return apiClient.get<School>(`/school/${schoolId}`)
}

export const getSchoolSections = (schoolId: string) => {
    return apiClient.get<SectionType[]>(`/school/section/${schoolId}`)
}