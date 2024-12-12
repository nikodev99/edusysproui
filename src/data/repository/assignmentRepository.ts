import {apiClient} from "../axiosConfig.ts";
import {Assignment} from "../../entity/domain/assignment.ts";

export const getSomeTeacherAssignments = (personalInfoId: number) => {
    return apiClient.get<Assignment[]>(`/assignment/teacher_some_${personalInfoId}`)
}