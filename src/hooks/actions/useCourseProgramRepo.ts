import {IDS} from "../../core/utils/interfaces.ts";
import {useFetch} from "../useFetch.ts";
import {getAllTeacherCourseProgram, getAllTeacherProgram} from "../../data/repository/courseProgramRepository.ts";
import {useGlobalStore} from "../../core/global/store.ts";

export const useCourseProgramRepo = () => {
    const schoolId = useGlobalStore(state => state.schoolId)

    const useGetTeacherCourseAllProgram = (teacherId: string, ids: IDS) => {
        return useFetch(['teacher-course-all-program', teacherId], getAllTeacherCourseProgram, [teacherId, schoolId, ids], !!teacherId && !!ids.courseId && !!ids.classId)
    }

    const useGetTeacherCourseProgram  = (teacherId: string, ids: IDS) => {
        return useFetch(['teacher-course-program', teacherId], getAllTeacherProgram, [teacherId, schoolId, ids], !!teacherId && !!ids.classId)
    }

    return {
        useGetTeacherCourseAllProgram,
        useGetTeacherCourseProgram
    }
}