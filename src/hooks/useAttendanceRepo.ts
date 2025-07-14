import {
    AttendanceRecentCount, AttendanceStatusCountResponse,
    AttendanceSummary,
    Pageable
} from "../core/utils/interfaces.ts";
import {useFetch} from "./useFetch.ts";
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
} from "../data/repository/attendanceRepository.ts";
import {Attendance} from "../entity";
import {useInsert} from "./usePost.ts";
import {useUpdate} from "./useUpdate.ts";
import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {attendanceSchema} from "../schema";

export const useAttendanceRepo = () => {
    const userSchool = loggedUser.getSchool()

    const useInsertAttendances = () => useInsert(attendanceSchema, insertAttendances, {
        mutationKey: ['attendance-post']
    })

    const useUpdateAttendances = () => useUpdate(attendanceSchema, updateAttendances, {
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
        ['school-all-student-attendances', userSchool?.id],
        getAllSchoolStudentAttendanceOfTheDay,
        [userSchool?.id, academicYearId, date, searchable, pageable?.page, pageable?.size, sortField, sortOrder],
        !!userSchool?.id && !!academicYearId
    )

    const useGetClasseAttendanceStatus = (classeId: number, academicYearId: string, searchQuery?: string, pageCount?: number, size?: number) => useFetch<AttendanceSummary[], unknown>(
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
    ) => useFetch<AttendanceRecentCount[], unknown>(
        ['classe-recent-attendances', classeId],
        getClasseRecentAttendanceStatus,
        [classeId, academicYearId, startDate, endDate],
        !!classeId && !!academicYearId
    )

    const useGetSchoolAttendanceStatPerStatus = (
        academicYearId: string,
        startDate?: Date,
        endDate?: Date
    ) => useFetch<AttendanceRecentCount[], unknown>(
        ['school-recent-attendances', userSchool?.id, academicYearId],
        getSchoolAttendanceStatPerStatus,
        [userSchool?.id, academicYearId, startDate, endDate],
        !!userSchool?.id && !!academicYearId
    )

    const useGetClasseStudentRankingAttendances = (classeId: number, academicYearId: string, showWorst: boolean = false) => useFetch<AttendanceSummary[], unknown>(
        ['classe-student-ranking-attendances', classeId, showWorst],
        showWorst ? getClasseWorstStudentAttendanceRanking : getClasseGoodStudentAttendanceRanking,
        [classeId, academicYearId],
        !!classeId && !!academicYearId
    )

    const useGetSchoolStudentRanking = (academicYearId: string, showWorst: boolean = false) => useFetch<AttendanceSummary[], unknown>(
        ['school-student-ranking-attendances', userSchool?.id, showWorst, academicYearId],
        getSchoolStudentRanking,
        [userSchool?.id, academicYearId, showWorst],
        !!userSchool?.id && !!academicYearId
    )

    const useGetSchoolAttendanceCount = (academicYearId: string, date?: Date) => useFetch<AttendanceStatusCountResponse, unknown>(
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
        useGetSchoolAttendanceCount
    }
}