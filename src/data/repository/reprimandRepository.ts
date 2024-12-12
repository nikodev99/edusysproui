import {apiClient} from "../axiosConfig.ts";

export const getSomeStudentReprimandedByTeacher = (teacherId: number) => {
    return apiClient.get(`/blame/teacher_some/${teacherId}`)
}