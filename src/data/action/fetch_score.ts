import { getAllStudentScores } from "../request";
import {ErrorCatch} from "./error_catch.ts";
import {getAllStudentScoresBySubject} from "../repository/scoreRepository.ts";

export const fetchAllStudentScores = async (page: number, size: number, studentId: string, academicYearId: string) => {
    return await getAllStudentScores(page, size, studentId, academicYearId);
}

export const fetchAllStudentScoresBySubject = async (academicYearId: string, subjectId: number) => {
    try {
        const resp = await getAllStudentScoresBySubject(academicYearId, subjectId);
        if (resp && 'data' in resp) {
            return {
                isSuccess: true,
                data: resp.data
            }
        }else {
            return {
                isSuccess: false
            }
        }
    }catch (err: unknown) {
        ErrorCatch(err)
    }
}