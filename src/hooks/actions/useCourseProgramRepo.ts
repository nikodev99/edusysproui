import {IDS, MessageResponse} from "@/core/utils/interfaces.ts";
import {useFetch} from "../useFetch.ts";
import {
    changeStatus,
    completed,
    getAllTeacherCourseProgram,
    getAllTeacherProgram
} from "@/data/repository/courseProgramRepository.ts";
import {AxiosResponse} from "axios";
import {useMutation} from "@tanstack/react-query";
import {ProgramStatus} from "@/entity/domain/courseProgram.ts";
import {catchError} from "@/data/action/error_catch.ts";
//import {useGlobalStore} from "@/core/global/store.ts";

export const useCourseProgramRepo = () => {
    //const schoolId = useGlobalStore(state => state.schoolId)

    const useGetTeacherPrograms = (
        teacherId: string,
        ids: IDS,
        academicYear?: string,
        enable: boolean = true
    ) => {
        const hasCourse = isValidId(ids.courseId)
        const baseEnabled = !!teacherId && isValidId(ids.classId) && enable

        const queryKey = hasCourse
            ? ['teacher-course-all-program', teacherId, ids.classId, ids.courseId, academicYear, enable]
            : ['teacher-course-program',     teacherId, ids.classId, academicYear, enable]

        const fetcher = hasCourse ? getAllTeacherCourseProgram : getAllTeacherProgram

        const fetchArgs = hasCourse
            ? [teacherId, ids, academicYear]   // ← academicYear added
            : [teacherId, ids, academicYear]

        const enabled = hasCourse
            ? baseEnabled && isValidId(ids.courseId) && !!academicYear
            : baseEnabled && !!academicYear

        return useFetch(queryKey, fetcher, fetchArgs, enabled)
    }

    const useChangeStatus = (isCompleted: boolean = false, setMessage: (msg: {success?: string, error?: string}) => void) =>
        useMutation<AxiosResponse<MessageResponse>, unknown, {timingId: number, status?: keyof typeof ProgramStatus}>({
            mutationFn: ({timingId, status}) => isCompleted
                ? completed(timingId)
                : changeStatus(timingId, status as keyof typeof ProgramStatus),
            onSuccess: async (res) => setMessage({success: res?.data?.message}),
            onError: async (err) => setMessage({error: catchError(err) as never}),
        })

    return {
        useGetTeacherPrograms,
        useChangeStatus
    }
}

const isValidId = (id?: string | number): boolean =>
    id !== undefined && id !== null && id !== '' && Number(id) !== 0