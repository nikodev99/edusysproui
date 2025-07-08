import {apiClient} from "../axiosConfig.ts";
import {Planning} from "../../entity";
import {SectionType} from "../../entity/enums/section.ts";

export const getAllPlannings = (schoolId: string, academicYear: string) => {
    return apiClient.get<Planning[]>('/planning/basic/' + schoolId, {
        params: {
            academicYear: academicYear
        }
    })
}

export const getGradePlannings = (schoolId: string, section: SectionType) => {
    return apiClient.get<Planning[]>(`/planning/${schoolId}`, {
        params: {
            section: section
        }
    })
}