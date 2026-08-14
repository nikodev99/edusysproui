import {
    countAssignmentMarks,
    getAllAssignmentMarks,
    getAllStudentScores,
    getAllStudentScoresBySubject,
    getAllTeacherMarks, getAssignmentMarks,
    getBestTeacherStudentByScore,
    getBestTeacherStudentBySubject,
    getClasseBestStudents,
    getClasseBestStudentsByCourse,
    getCourseBestStudentsByCourse,
    getStudentScoreOfAssignment
} from "@/data/repository/scoreRepository.ts";
import {useFetch, useRawFetch} from "../useFetch.ts";
import {Pageable} from "@/core/utils/interfaces.ts";
import {Score} from "@/entity";
import {useCallback, useEffect, useState} from "react";

export const useScoreRepo = () => {
    const useGetAllAssignmentMarks = (assignmentId: number, size: number, enable: boolean = true) => useFetch(
        ['assignment-marks', assignmentId, size], getAllAssignmentMarks, [assignmentId, size], enable && !!assignmentId && !!size
    )

    const useGetAssignmentScores = (assignmentId: number): { scores: Score[], refetch: () => void } => {
        const [scores, setScores] = useState<Score[]>([])
        const fetch = useRawFetch()

        const loadScores = useCallback(() => {
            if (assignmentId) {
                fetch(getAssignmentMarks, [assignmentId])
                    .then(resp => {
                        if (resp.isSuccess) {
                            setScores(resp.data as Score[])
                        }
                    })
            }
        }, [assignmentId, fetch]);

        useEffect(() => {
            loadScores()
        }, [loadScores]);

        return {scores, refetch: loadScores}
    }
    
    const useGetAllStudentScores = (studentId: string, academicYearId: string, pageable: Pageable, subjectId?: number) => {
        return useFetch(
            subjectId ? ['subject-mark-list', subjectId, studentId] : ['marks-list', studentId],
            subjectId ? getAllStudentScoresBySubject : getAllStudentScores,
            subjectId ? [studentId, academicYearId, subjectId]: [pageable.page, pageable.size, studentId, academicYearId],
            subjectId ? !!studentId && !!academicYearId && !!subjectId : !!studentId && !!academicYearId
        )
    }
    
    const useGetClasseBestStudents = (classId: number, academicYear: string, courseId?: number) => {
        const {data} = useFetch(
            ["List-of-best-student-in-classe", classId, courseId, academicYear],
            courseId ? getClasseBestStudentsByCourse : getClasseBestStudents,
            [{classId: classId, courseId: courseId}, academicYear],
            courseId ? !!classId && !!courseId && !!academicYear : !!classId && !!academicYear
        )

        return data
    }

    const useGetCourseBestStudents = (courseId: number, academicYear: string) => {
        const {data} = useFetch("Lis-of-best-students", getCourseBestStudentsByCourse, [courseId, academicYear], !!courseId && !!academicYear)
        return data
    }

    const useGetAllTeacherMarks = (teacherId: number | number[]) => useFetch(
        ['teacher-marks', teacherId],
        getAllTeacherMarks,
        [teacherId],
        !!teacherId
    )

    const useGetBestTeacherStudents = (teacherPersonalInfoId: number, academicYear: string, subjectId?: number) => useFetch(
        ['teacher-student-marks', teacherPersonalInfoId, subjectId],
        subjectId ? getBestTeacherStudentBySubject : getBestTeacherStudentByScore,
        subjectId ? [teacherPersonalInfoId, subjectId, academicYear] : [teacherPersonalInfoId, academicYear],
        subjectId ? !!teacherPersonalInfoId && !!subjectId && !!academicYear : !!teacherPersonalInfoId && !!academicYear
    )

    const useGetStudentScore = (assignmentId: number, studentId: string, enabled: boolean = true) => useFetch(
        ['student-one-score', assignmentId, studentId],
        getStudentScoreOfAssignment,
        [assignmentId, studentId],
        enabled && !!assignmentId && !!studentId
    )
    
    const useCountAssignmentMarks = (assignmentId: number) => {
        const [count, setCount] = useState<number>(0)
        const {data, isSuccess} = useFetch(['count-assignment-marks', assignmentId], countAssignmentMarks, [assignmentId], !!assignmentId)
        
        useEffect(() => {
            if(isSuccess) {
                setCount(data as number)
            }
        }, [data, isSuccess]);
        
        return count
    }
    
    return{
        useGetAllAssignmentMarks,
        useGetAssignmentScores,
        useGetAllStudentScores,
        useGetClasseBestStudents,
        useGetCourseBestStudents,
        useGetAllTeacherMarks,
        useGetBestTeacherStudents,
        useGetStudentScore,
        useCountAssignmentMarks
    }
}