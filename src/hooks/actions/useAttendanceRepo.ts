import {AttendanceStatusCountResponse, Pageable} from "@/core/utils/interfaces.ts";
import {useFetch} from "../useFetch.ts";
import {
    getAllSchoolStudentAttendanceOfTheDay,
    getAllStudentAttendances,
    getAllStudentClasseAttendanceOfTheDay,
    getClasseAttendanceStatus,
    getClasseAttendanceStatusCount,
    getClasseAttendanceStatusSearch,
    getClasseGoodStudentAttendanceRanking,
    getClasseRecentAttendanceStatus,
    getClasseWorstStudentAttendanceRanking,
    getSchoolAttendanceStatPerStatus,
    getSchoolAttendanceStatusCount, getSchoolStudentRanking,
    getStudentAttendances, getStudentAttendanceStatusCount, insertAttendances, updateAttendances
} from "@/data/repository/attendanceRepository.ts";
import {Attendance} from "@/entity";
import {useInsert} from "../usePost.ts";
import {useUpdate} from "../useUpdate.ts";
import {attendanceSchema} from "@/schema";
import {useGlobalStore} from "@/core/global/store.ts";
import Datetime from "@/core/datetime.ts";

export const useAttendanceRepo = () => {
    const schoolId = useGlobalStore(state => state.schoolId)

    const useGetPaginated = (academicYear: string, date: Datetime) => {
        return {
            getPaginatedData: (searchable: string, page: number, size: number, sortField?: string, sortOrder?: string) => {
                return getAllSchoolStudentAttendanceOfTheDay(schoolId, academicYear, date.toDate(), searchable, page, size, sortField, sortOrder)
            }
        }
    }

    const useInsertAttendances = () => useInsert(attendanceSchema, insertAttendances, {
        mutationKey: ['attendance-post']
    })

    const useUpdateAttendances = () => useUpdate(attendanceSchema, updateAttendances as never, {
        mutationKey: ['attendance-put']
    })

    const useGetStudentAttendance = (studentId: number, pageable: Pageable, academicYearId: string) => useFetch<Attendance[], unknown>(
        ['student-attendance', studentId],
        getStudentAttendances,
        [studentId, pageable, academicYearId],
        !!studentId && !!pageable.size && !!academicYearId
    )

    const useGetAllStudentAttendances = (studentId: number, academicYearId: string) => useFetch(
        ['student-all-attendances', studentId],
        getAllStudentAttendances,
        [studentId, academicYearId],
        !!studentId && !!academicYearId
    )

    const useGetAllStudentClasseAttendanceOfTheDay = (classeId: number, academicYearId: string, date?: Date) => useFetch<Attendance[], unknown>(
        ['all-classe-student-attendances', classeId, academicYearId, date],
        getAllStudentClasseAttendanceOfTheDay,
        [classeId, academicYearId, date],
        !!classeId && !!academicYearId
    )

    const useGetStudentAttendanceStatusCount = (studentId: number, academicYearId: string) => useFetch(
        ['student-attendance-count', studentId],
        getStudentAttendanceStatusCount,
        [studentId, academicYearId],
        !!studentId && !!academicYearId
    )

    const useGetClasseAttendanceCount = (classeId: number, academicYearId: string, date?: Date) => useFetch<AttendanceStatusCountResponse, unknown>(
        ['attendance-count', classeId],
        getClasseAttendanceStatusCount,
        [classeId, academicYearId, date ?? null],
        !!classeId && !!academicYearId
    )

    const useGetAllSchoolStudentAttendanceOfDay = (
        academicYearId: string,
        date?: Date,
        searchable?: string,
        pageable?: Pageable,
        sortField?: string,
        sortOrder?: string,
    ) => useFetch<Attendance[], unknown>(
        ['school-all-student-attendances', schoolId],
        getAllSchoolStudentAttendanceOfTheDay,
        [schoolId, academicYearId, date, searchable, pageable?.page, pageable?.size, sortField, sortOrder],
        !!schoolId && !!academicYearId
    )

    const useGetClasseAttendanceStatus = (classeId: number, academicYearId: string, searchQuery?: string, pageCount?: number, size?: number) => useFetch(
        ['classe-attendance-summary', classeId],
        searchQuery ? getClasseAttendanceStatusSearch : getClasseAttendanceStatus,
        searchQuery ? [classeId, academicYearId, searchQuery] : [classeId, academicYearId, pageCount, size],
        searchQuery ? !!classeId && !!academicYearId && !!searchQuery : !!classeId && !!academicYearId && !!size
    )

    const useGetClasseAttendanceStatPerStatus = (
        classeId: number,
        academicYearId: string,
        startDate?: Date,
        endDate?: Date
    ) => useFetch(
        ['classe-recent-attendances', classeId],
        getClasseRecentAttendanceStatus,
        [classeId, academicYearId, startDate, endDate],
        !!classeId && !!academicYearId
    )

    const useGetSchoolAttendanceStatPerStatus = (
        academicYearId: string,
        startDate?: Date,
        endDate?: Date
    ) => useFetch(
        ['school-recent-attendances', schoolId, academicYearId],
        getSchoolAttendanceStatPerStatus,
        [schoolId, academicYearId, startDate, endDate],
        !!schoolId && !!academicYearId
    )

    const useGetClasseStudentRankingAttendances = (classeId: number, academicYearId: string, showWorst: boolean = false) => useFetch(
        ['classe-student-ranking-attendances', classeId, showWorst],
        showWorst ? getClasseWorstStudentAttendanceRanking : getClasseGoodStudentAttendanceRanking,
        [classeId, academicYearId],
        !!classeId && !!academicYearId
    )

    const useGetSchoolStudentRanking = (academicYearId: string, showWorst: boolean = false) => useFetch(
        ['school-student-ranking-attendances', schoolId, showWorst, academicYearId],
        getSchoolStudentRanking,
        [schoolId, academicYearId, showWorst],
        !!schoolId && !!academicYearId
    )

    const useGetSchoolAttendanceCount = (academicYearId: string, date?: Date) => useFetch(
        ['school-attendance-count', academicYearId, date],
        getSchoolAttendanceStatusCount,
        [academicYearId, date ?? null],
        !!academicYearId
    )
    
    return {
        useInsertAttendances,
        useUpdateAttendances,
        useGetStudentAttendance,
        useGetAllStudentAttendances,
        useGetAllStudentClasseAttendanceOfTheDay,
        useGetStudentAttendanceStatusCount,
        useGetClasseAttendanceCount,
        useGetAllSchoolStudentAttendanceOfDay,
        useGetClasseAttendanceStatus,
        useGetClasseAttendanceStatPerStatus,
        useGetSchoolAttendanceStatPerStatus,
        useGetClasseStudentRankingAttendances,
        useGetSchoolStudentRanking,
        useGetSchoolAttendanceCount,
        useGetPaginated
    }
}