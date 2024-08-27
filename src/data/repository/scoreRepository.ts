import {AxiosResponse} from "axios";
import {Score} from "../../entity";
import {request} from "../axiosConfig.ts";

export const getAllStudentScores = (page: number, size: number, academicYearId: string): Promise<AxiosResponse<Score[]>> => {
    return request({
        method: 'GET',
        url: '/score/all',
        params: {
            page: page,
            size: size,
            academicYearId: academicYearId
        }
    })
}

export const getAllStudentScoresBySubject = (academicYearId: string, subjectId: number): Promise<AxiosResponse<Score[]>> => {
    return request({
        method: 'GET',
        url: `/score/all/${subjectId}`,
        params: {
            academicYearId: academicYearId,
        }
    })
}