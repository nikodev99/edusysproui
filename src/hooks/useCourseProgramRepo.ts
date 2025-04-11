import {IDS} from "../core/utils/interfaces.ts";
import {useFetch} from "./useFetch.ts";
import {getAllTeacherCourseProgram, getAllTeacherProgram} from "../data/repository/courseProgramRepository.ts";

export const useCourseProgramRepo = () => {
    const useGetTeacherCourseAllProgram = (teacherId: string, ids: IDS) => {
        return useFetch(['teacher-course-all-program', teacherId], getAllTeacherCourseProgram, [teacherId, ids], {
            queryKey: ['teacher-course-program', teacherId],
            enabled: !!teacherId && !!ids.courseId && !!ids.classId
        });
    }

    const useGetTeacherCourseProgram  = (teacherId: string, ids: IDS) => {
        return useFetch(['teacher-course-program', teacherId], getAllTeacherProgram, [teacherId, ids], {
            queryKey: ['teacher-course-program', teacherId],
            enabled: !!teacherId && !!ids.classId
        })
    }

    return {
        useGetTeacherCourseAllProgram,
        useGetTeacherCourseProgram
    }
}