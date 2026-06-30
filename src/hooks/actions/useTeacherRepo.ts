import {Counted, CountType, GenderCounted, Moment, Pageable} from "@/core/utils/interfaces.ts";
import {useFetch, useRawFetch} from "../useFetch.ts";
import {fetchTeachers} from "@/data";
import {
    countAllTeachers, getAllSelfTeachers, getAllTeachers,
    getNumberOfStudentTaughtByClasse,
    getNumberOfStudentTaughtByTeacher,
    getSearchedTeachers,
    getTeacherBasicValues,
    getTeacherById, getTeacherClasses, getTeacherCourses,
    getTeachersBasicValues,
    getTeacherSchedule,
    getTeacherScheduleByDay
} from "@/data/repository/teacherRepository.ts";
import {useEffect, useState} from "react";
import {SectionType} from "@/entity/enums/section.ts";
import {Teacher} from "@/entity";
import {useGlobalStore} from "@/core/global/store.ts";
import {UserPermission} from "@/core/shared/sharedEnums.ts";
import {useAuth} from "@/hooks/useAuth.ts";
import {getShortSortOrder, setSortFieldName} from "@/core/utils/utils.ts";
import {reportRepository} from "@/data/repository/reportRepository.ts";
import {ReportSchema} from "@/schema";

export const useTeacherRepo = (context: UserPermission = UserPermission.ALL) => {
    const schoolId = useGlobalStore(state => state.schoolId)

    const useGetPaginated = () => {
        const {user} = useAuth()

        return {
            getPaginatedTeachers: async (page: number, size: number, sortField?: string, sortOrder?: string) => {
                if (sortField && sortOrder) {
                    sortOrder = getShortSortOrder(sortOrder);
                    sortField = sortedField(sortField);
                    switch (context) {
                        case UserPermission.TEACHER:
                            return await getAllSelfTeachers(schoolId, user?.userId as string, page, size, `${sortField}:${sortOrder}`);
                        case UserPermission.ALL:
                            return await getAllTeachers(schoolId, page, size, `${sortField}:${sortOrder}`);
                    }
                }
                switch (context) {
                    case UserPermission.TEACHER:
                        return await getAllSelfTeachers(schoolId, user?.userId as string, page, size)
                    case UserPermission.ALL:
                        return await getAllTeachers(schoolId, page, size)
                }

            },
            getSearchedTeachers: async (searchInput: string) => {
                switch (context) {
                    case UserPermission.ALL:
                        return await getSearchedTeachers(schoolId, searchInput)
                    default:
                        return undefined
                }
            }
        }
    }

    const useGetAllTeachers = (pageable: Pageable, sortField: string, sortOrder: string) => useFetch(
        ['teacher-list'],
        fetchTeachers,
        [schoolId, pageable.page, pageable.size, sortField, sortOrder],
        !!schoolId && !!pageable.size,
    )
    
    const useGetSearchedTeachers = (input: string) => useFetch(
        ['teacher-list'],
        getSearchedTeachers,
        [input],
        !!input
    )

    const useGetTeacherBasicValues = (classeId?: number, section?: SectionType, enable: boolean = true) => useFetch(
        ['teacher-basic', classeId, section, enable],
        getTeachersBasicValues,
        [classeId, section],
        enable && !!classeId && !!section
    )

    const useGetTeacherBasic = (teacherId: number, classeId: number): Teacher | undefined => {
        const [teacher, setTeacher] = useState<Teacher | undefined>(undefined)
        const fetch = useRawFetch()

        useEffect(() => {
            if (teacherId && classeId)
                fetch(getTeacherBasicValues, [teacherId, classeId])
                    .then(resp => {
                        if (resp.isSuccess) {
                            setTeacher(resp.data as Teacher)
                        }
                    })
        }, [classeId, fetch, teacherId]);

        return teacher
    }

    const useGetTeacher = (teacherId: string) => useFetch(
        ['teacher', teacherId, schoolId],
        getTeacherById,
        [teacherId, schoolId],
        !!teacherId && !!schoolId
    )

    const useGetTeacherSchedules = (teacherId: string, academicYear: string, allDay: boolean = false,  enable: boolean = true) => {
        return useFetch(
            ['teacher-schedules', teacherId, allDay, enable],
            allDay ? getTeacherScheduleByDay : getTeacherSchedule,
            allDay ? [teacherId, academicYear, allDay] : [teacherId, academicYear],
            (!!teacherId && enable)
        )
    }
    
    const useGetTeacherStudentNumber = (teacherId: string): Counted | undefined => {
        const [count, setCount] = useState<Counted>()
        const fetch = useRawFetch()

        useEffect(() => {
            if (teacherId)
                fetch(getNumberOfStudentTaughtByTeacher, [teacherId])
                    .then(resp => {
                        if (resp.isSuccess) {
                            setCount(resp.data as Counted)
                        }
                    })
        }, [fetch, teacherId]);

        return count
    }

    const useGetTeacherClasseStudentNumber = (teacherId: string): CountType[] | undefined => {
        const [count, setCount] = useState<CountType[]>([])
        const fetch = useRawFetch()

        useEffect(() => {
            if (teacherId)
                fetch(getNumberOfStudentTaughtByClasse, [teacherId])
                    .then(resp => {
                        if (resp.isSuccess) {
                            setCount(resp.data as CountType[])
                        }
                    })
        }, [fetch, teacherId]);

        return count
    }

    const useGetTeacherClasses = (teacherId: string, enable: boolean = true) => useFetch(
        ['teacher-classes', teacherId, enable],
        getTeacherClasses,
        [teacherId, schoolId],
        enable && !!teacherId && !!schoolId
    )

    const useGetTeacherCourses = (teacherId: string, enable: boolean = true) => useFetch(
        ['teacher-courses', teacherId, enable],
        getTeacherCourses,
        [teacherId, schoolId],
        enable && !!teacherId && !!schoolId
    )

    const useCountAllTeachers = (): GenderCounted | undefined => {
        const [count, setCount] = useState<GenderCounted>()
        const fetch = useRawFetch()

        useEffect(() => {
            fetch(countAllTeachers, [schoolId])
                .then(resp => {
                    if (resp.isSuccess) {
                        setCount(resp.data as GenderCounted)
                    }
                })
        }, [fetch]);
        
        return count
    }

    const useSaveReport= () => {
        return {
            saveReport: (report: ReportSchema) => reportRepository.saveReport(report)
        }
    }

    const useGetAllWeekReport = (teacherId: string, startDate: Moment, endDate: Moment) => useFetch(
        ["reports", teacherId, startDate, endDate],
        reportRepository.getAllWeekReport,
        [teacherId, startDate, endDate],
        !!teacherId
    )

    const useViewReport = (reportId: number) => useFetch(
        ["reports", reportId], reportRepository.viewReport, [reportId], (!!reportId)
    )

    return {
        useGetPaginated,
        useGetAllTeachers,
        useGetSearchedTeachers,
        useGetTeacher,
        useGetTeacherSchedules,
        useGetTeacherBasic,
        useGetTeacherStudentNumber,
        useGetTeacherClasseStudentNumber,
        useGetTeacherClasses,
        useGetTeacherCourses,
        useCountAllTeachers,
        useGetTeacherBasicValues,
        useSaveReport,
        useGetAllWeekReport,
        useViewReport
    }
}

const sortedField = (sortField: string[] | string) => {
    return getSorted(setSortFieldName(sortField))
}


const getSorted = (sortField: string) => {
    switch (sortField) {
        case 'lastName':
            return 't.personalInfo.lastName'
        case 'gender':
            return 't.personalInfo.gender'
        case 'birthDate':
            return 't.personalInfo.birthDate'
        case 'status':
            return 't.personalInfo.status'
        default:
            return undefined;
    }
}