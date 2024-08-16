import {AxiosResponse} from "axios";
import {Guardian} from "../../entity";
import {apiClient} from "../axiosConfig.ts";

export const getEnrolledStudentsGuardians = (): Promise<AxiosResponse<Guardian[]>> => {
    return apiClient.get<Guardian[]>("/enroll/guardians")
}

export const getGuardianById = (guardianId: string): Promise<AxiosResponse<Guardian>> => {
    return apiClient.get<Guardian>(`/guardian/${guardianId}`)
}