import { getAllStudentScores } from "../request";

export const fetchAllStudentScores = async (page: number, size: number, studentId: string, academicYearId: string) => {
    return await getAllStudentScores(page, size, studentId, academicYearId);
}