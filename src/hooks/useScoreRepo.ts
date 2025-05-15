import {
    getAllAssignmentMarks,
    getAllStudentScores,
    getAllStudentScoresBySubject,
    getAllTeacherMarks, getAssignmentMarks,
    getBestTeacherStudentByScore,
    getBestTeacherStudentBySubject,
    getClasseBestStudents,
    getClasseBestStudentsByCourse,
    getClassePoorStudents,
    getCourseBestStudentsByCourse,
    getCoursePoorStudents
} from "../data/repository/scoreRepository.ts";
import {useFetch, useRawFetch} from "./useFetch.ts";
import {Pageable} from "../core/utils/interfaces.ts";
import {Score} from "../entity";
import {useEffect, useState} from "react";
import {AxiosResponse} from "axios";

export const useScoreRepo = () => {
    const useGetAllAssignmentMarks = (assignmentId: bigint, size: number) => useFetch(
        ['assignment-marks', assignmentId], getAllAssignmentMarks, [assignmentId, size], !!assignmentId && !!size
    )

    const useGetAssignmentScores = (assignmentId: bigint): Score[] => {
        const [scores, setScores] = useState<Score[]>([])
        const fetch = useRawFetch()

        useEffect(() => {
            if (assignmentId) {
                fetch(getAssignmentMarks, [assignmentId])
                    .then(resp => {
                        if (resp.isSuccess) {
                            setScores(resp.data as Score[])
                        }
                    })
            }
        }, [assignmentId, fetch]);

        return scores
    }
    
    const useGetAllStudentScores = (studentId: string, academicYearId: string, pageable: Pageable, subjectId?: number) => {
        return useFetch(
            subjectId ? ['subject-mark-list', subjectId, studentId] : ['marks-list', studentId],
            subjectId ? getAllStudentScoresBySubject : getAllStudentScores,
            subjectId ? [studentId, academicYearId, subjectId]: [pageable.page, pageable.size, studentId, academicYearId],
            subjectId ? !!studentId && !!academicYearId && !!subjectId : !!studentId && !!academicYearId
        )
    }
    
    const useGetClasseBestStudents = (classId: number, academicYear: string, courseId?: number): Score[] => {
        const [scores, setScores] = useState<Score[]>([])
        const fetch = useRawFetch()
        const func = courseId ? getClasseBestStudentsByCourse : getClasseBestStudents
        useEffect(() => {
            if (classId && academicYear) {
                fetch(func as (...args: unknown[]) => Promise<AxiosResponse<Score[], unknown>>, [{classId: classId, courseId: courseId}, academicYear])
                    .then(resp => {
                        if (resp.isSuccess) {
                            setScores(resp.data as Score[])
                        }
                    })
            }
        }, [academicYear, classId, courseId, fetch, func]);
        console.log('Scores: ', scores)
        
        return scores
    }
    
    const useGetClassePoorStudents = (classeId: number, academicYear: string): Score[] => {
        const [scores, setScores] = useState<Score[]>([])
        const fetch = useRawFetch()

        useEffect(() => {
            if (classeId && academicYear) {
                fetch(getClassePoorStudents, [classeId, academicYear])
                    .then(resp => {
                        if (resp.isSuccess) {
                            setScores(resp.data as Score[])
                        }
                    })
            }
        }, [academicYear, classeId, fetch]);
        
        return scores
    }

    const useGetCourseBestStudents = (courseId: number, academicYear: string): Score[] => {
        const [scores, setScores] = useState<Score[]>([])
        const fetch = useRawFetch()

        useEffect(() => {
            if (courseId && academicYear) {
                fetch(getCourseBestStudentsByCourse, [courseId, academicYear])
                    .then(resp => {
                        if (resp.isSuccess) {
                            setScores(resp.data as Score[])
                        }
                    })
            }
        }, [academicYear, courseId, fetch]);

        return scores
    }

    const useGetCoursePoorStudents = (courseId: number, academicYear: string): Score[] => {
        const [scores, setScores] = useState<Score[]>([])
        const fetch = useRawFetch()

        useEffect(() => {
            if (courseId && academicYear) {
                fetch(getCoursePoorStudents, [courseId, academicYear])
                    .then(resp => {
                        if (resp.isSuccess) {
                            setScores(resp.data as Score[])
                        }
                    })
            }
        }, [academicYear, courseId, fetch]);

        return scores
    }

    const useGetAllTeacherMarks = (teacherId: bigint | bigint[]) => useFetch(
        ['teacher-marks', teacherId],
        getAllTeacherMarks,
        [teacherId],
        !!teacherId
    )

    const useGetBestTeacherStudents = (teacherPersonalInfoId: bigint, subjectId?: number) => useFetch(
        subjectId ? ['teacher-student-marks', teacherPersonalInfoId] : ['teacher-students', teacherPersonalInfoId],
        subjectId ? getBestTeacherStudentBySubject : getBestTeacherStudentByScore,
        [teacherPersonalInfoId, subjectId],
        subjectId ? !!teacherPersonalInfoId && !!subjectId : !!teacherPersonalInfoId
    )
    
    return{
        useGetAllAssignmentMarks,
        useGetAssignmentScores,
        useGetAllStudentScores,
        useGetClasseBestStudents,
        useGetClassePoorStudents,
        useGetCourseBestStudents,
        useGetCoursePoorStudents,
        useGetAllTeacherMarks,
        useGetBestTeacherStudents
    }
}