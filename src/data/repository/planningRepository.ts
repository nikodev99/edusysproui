import {apiClient} from "../axiosConfig.ts";
import {Planning} from "../../entity";
import {SectionType} from "../../entity/enums/section.ts";

export const getAllPlannings = (academicYear: string) => {
    return apiClient.get<Planning[]>('/planning/basic', {
        params: {
            academicYear: academicYear
        }
    })
}

export const getGradePlannings = (section: SectionType) => {
    return apiClient.get<Planning[]>(`/planning`, {
        params: {
            section: section
        }
    })
}