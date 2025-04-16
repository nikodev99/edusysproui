import {
    getAllAssignmentMarks,
    getAllStudentScores,
    getAllStudentScoresBySubject, getAllTeacherMarks, getBestStudentByScore, getBestStudentBySubjectScore,
    getClasseBestStudents,
    getClasseBestStudentsByCourse,
    getClassePoorStudents, getCourseBestStudentsByCourse,
    getCoursePoorStudents
} from "../data/repository/scoreRepository.ts";
import {useFetch, useRawFetch} from "./useFetch.ts";
import {IDS, Pageable} from "../core/utils/interfaces.ts";
import {Score} from "../entity";
import {useEffect, useState} from "react";

export const useScoreRepo = () => {
    const useGetAllAssignmentMarks = (assignmentId: string, size: number) => useFetch(
        ['assignment-marks', assignmentId], getAllAssignmentMarks, [assignmentId, size], !!assignmentId && !!size
    )
    
    const useGetAllStudentScores = (pageable: Pageable, studentId: string, academicYearId: string) => useFetch(
        ['marks-list', studentId],
        getAllStudentScores,
        [pageable.page, pageable.size, studentId, academicYearId], !!studentId && !!academicYearId
    )
    
    const useGetAllStudentSubjectScores = (studentId: string, academicYearId: string, subjectId: number) => useFetch(
        ['subject-mark-list', subjectId, studentId],
        getAllStudentScoresBySubject,
        [studentId, academicYearId, subjectId], !!studentId && !!academicYearId && !!subjectId
    )
    
    const useGetClasseBestStudents = (classId: number, academicYear: string): Score[] => {
        const [scores, setScores] = useState<Score[]>([])
        const fetch = useRawFetch()

        useEffect(() => {
            if (classId && academicYear) {
                fetch(getClasseBestStudents, [{classId: classId}, academicYear])
                    .then(resp => {
                        if (resp.isSuccess) {
                            setScores(resp.data as Score[])
                        }
                    })
            }
        }, [academicYear, classId, fetch]);
        
        return scores
    }

    const useGetClasseBestSubjectStudent = ({classId, courseId}: IDS, academicYear: string): Score[] => {
        const [scores, setScores] = useState<Score[]>([])
        const fetch = useRawFetch()

        useEffect(() => {
            if (classId && academicYear && courseId) {
                fetch(getClasseBestStudentsByCourse, [classId, courseId, academicYear])
                    .then(resp => {
                        if (resp.isSuccess) {
                            setScores(resp.data as Score[])
                        }
                    })
            }
        }, [academicYear, classId, courseId, fetch]);
        
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

    const useGetAllTeacherMarks = (teacherId: string) => useFetch(
        ['teacher-marks', teacherId],
        getAllTeacherMarks,
        [teacherId],
        !!teacherId
    )

    const useGetBestTeacherSubjectStudents = (teacherPersonalInfoId: number, subjectId: number) => useFetch(
        ['teacher-student-marks', teacherPersonalInfoId],
        getBestStudentBySubjectScore,
        [teacherPersonalInfoId, subjectId],
        !!teacherPersonalInfoId && !!subjectId
    )

    const useGetBestTeacherStudents = (teacherPersonalInfoId: number) => useFetch(
        ['teacher-students', teacherPersonalInfoId],
        getBestStudentByScore,
        [teacherPersonalInfoId],
        !!teacherPersonalInfoId
    )
    
    return{
        useGetAllAssignmentMarks,
        useGetAllStudentScores,
        useGetAllStudentSubjectScores,
        useGetClasseBestStudents,
        useGetClassePoorStudents,
        useGetClasseBestSubjectStudent,
        useGetCourseBestStudents,
        useGetCoursePoorStudents,
        useGetAllTeacherMarks,
        useGetBestTeacherSubjectStudents,
        useGetBestTeacherStudents
    }
}