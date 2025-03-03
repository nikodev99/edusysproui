import {apiClient} from "../axiosConfig.ts";

export const getAllClasseSchedule = (classeId: number) => {
    return apiClient.get(`/schedule/classe/${classeId}`);
}