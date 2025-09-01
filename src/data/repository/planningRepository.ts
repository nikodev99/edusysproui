import {apiClient} from "../axiosConfig.ts";
import {Planning} from "../../entity";
import {SectionType} from "../../entity/enums/section.ts";
import {PlanningSchema} from "../../schema";
import {ID} from "../../core/utils/interfaces.ts";

export const savePlanning = (planning: PlanningSchema) => {
    return apiClient.post<PlanningSchema>('/planning', planning)
}

export const updatePlanning = (planning: PlanningSchema, planningId: ID) => {
    return apiClient.put<{ updated: boolean }>('/planning/' + planningId, planning)
}

export const deletePlanning = (planningId: number) => {
    return apiClient.delete(`/planning/${planningId}`)
}

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