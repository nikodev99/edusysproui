import {IDS} from "@/core/utils/interfaces.ts";
import {useFetch} from "../useFetch.ts";
import {getAllTeacherCourseProgram, getAllTeacherProgram} from "@/data/repository/courseProgramRepository.ts";
//import {useGlobalStore} from "@/core/global/store.ts";

export const useCourseProgramRepo = () => {
    //const schoolId = useGlobalStore(state => state.schoolId)

    const useGetTeacherPrograms = (
        teacherId: string,
        ids: IDS,
        academicYear?: string
    ) => {
        const hasCourse = isValidId(ids.courseId)
        const baseEnabled = !!teacherId && isValidId(ids.classId)

        const queryKey = hasCourse
            ? ['teacher-course-all-program', teacherId, ids.classId, ids.courseId, academicYear]
            : ['teacher-course-program',     teacherId, ids.classId, academicYear]

        const fetcher = hasCourse ? getAllTeacherCourseProgram : getAllTeacherProgram

        const fetchArgs = hasCourse
            ? [teacherId, ids, academicYear]   // ← academicYear added
            : [teacherId, ids, academicYear]

        const enabled = hasCourse
            ? baseEnabled && isValidId(ids.courseId) && !!academicYear
            : baseEnabled && !!academicYear

        return useFetch(queryKey, fetcher, fetchArgs, enabled)
    }

    return {
        useGetTeacherPrograms
    }
}

const isValidId = (id?: string | number): boolean =>
    id !== undefined && id !== null && id !== '' && Number(id) !== 0