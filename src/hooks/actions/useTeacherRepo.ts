import {Counted, CountType, GenderCounted, Moment, Options, Pageable} from "@/core/utils/interfaces.ts";
import {useFetch, useRawFetch} from "../useFetch.ts";
import {
    affiliateTeacher, checkTeacherIsPrincipal,
    countAllTeachers, deleteTeacherAffiliation, getAllSelfTeachers, getAllTeachers,
    getNumberOfStudentTaughtByClasse,
    getNumberOfStudentTaughtByTeacher, getSearchedTeacher,
    getSearchedTeachers,
    getTeacherBasicValues,
    getTeacherById, getTeacherClasses, getTeacherCourses, getTeacherPersonalInfo,
    getTeachersBasicValues,
    getTeacherSchedule,
    getTeacherScheduleByDay, getTeacherWidgets, updateTeacherClasses, updateTeacherCourses
} from "@/data/repository/teacherRepository.ts";
import {useCallback, useEffect, useState} from "react";
import {SectionType} from "@/entity/enums/section.ts";
import {Teacher} from "@/entity";
import {useGlobalStore} from "@/core/global/store.ts";
import {UserPermission} from "@/core/shared/sharedEnums.ts";
import {useAuth} from "@/hooks/useAuth.ts";
import {getShortSortOrder, setName, setSortFieldName} from "@/core/utils/utils.ts";
import {reportRepository} from "@/data/repository/reportRepository.ts";
import {ReportSchema, TeacherSchoolAffiliationSchema} from "@/schema";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {TeacherClassUpdateRequest, TeacherCourseUpdateRequest} from "@/entity/domain/teacher.ts";

export const useTeacherRepo = (context: UserPermission = UserPermission.ALL) => {
    const schoolId = useGlobalStore(state => state.schoolId)
    const {user} = useAuth()

    const useGetPaginated = () => {
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

    const useGetSearchedTeacher = (searchInput: string) => useFetch(
        ['searched-teacher'],
        getSearchedTeacher,
        [schoolId, searchInput],
        !!schoolId && !!searchInput
    )

    const useGetAllTeachers = (pageable: Pageable, sortField: string, sortOrder: string) => useFetch(
        ['teacher-list'],
        getAllTeachers,
        [schoolId, pageable.page, pageable.size, `${sortField}:${sortOrder}`],
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

    const useGetTeacherPersonalInfo = (teacherId?: string) => {
        const {data} = useFetch(['teacher-personal-info', teacherId], getTeacherPersonalInfo, [teacherId], !!teacherId)
        return data
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
                fetch(getNumberOfStudentTaughtByTeacher, [teacherId, schoolId])
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
                fetch(getNumberOfStudentTaughtByClasse, [teacherId, schoolId])
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

    const useGetWidgets = (teacherId: string, academicYear: string) => useFetch(
        ['teacher-widgets', teacherId, academicYear],
        getTeacherWidgets,
        [teacherId, academicYear],
        !!teacherId && !!academicYear
    )

    const useUpdateClasses = (teacherId: string) => {
        const query = useQueryClient()
        return useMutation({
            mutationFn: async (payload: TeacherClassUpdateRequest) => {
                return await updateTeacherClasses(teacherId, schoolId, payload)
            },
            onSuccess: () => {
                query.invalidateQueries({queryKey: ["teacher", teacherId]}).then(r => r);
                query.invalidateQueries({queryKey: ["teacher-classes", teacherId]}).then(r => r);
            }
        })
    }

    const useUpdateCourses = (teacherId: string) => {
        const query = useQueryClient()
        return useMutation({
            mutationFn: async (payload: TeacherCourseUpdateRequest) => await updateTeacherCourses(teacherId, schoolId, payload),
            onSuccess: () => {
                query.invalidateQueries({queryKey: ["teacher", teacherId]}).then(r => r);
                query.invalidateQueries({queryKey: ["teacher-courses", teacherId]}).then(r => r);
            }
        })
    }

    const useAffiliateTeacher = () => {
        const query = useQueryClient()
        return useMutation({
            mutationFn: async (payload: TeacherSchoolAffiliationSchema) => await affiliateTeacher(payload),
            onSuccess: () => {
                query.invalidateQueries({queryKey: ["affiliate-teacher"]}).then(r => r);
            }
        })
    }

    const useRemoveTeacherAffiliation = () => {
        return useMutation({
            mutationFn: async (payload: {teacherId: string, schoolId: string}) =>
                deleteTeacherAffiliation(payload.teacherId, payload.schoolId),
        })
    }

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

    const useGetAllWeekReport = (id: string | number, startDate: Moment, endDate: Moment, isClasse: boolean = false) => useFetch(
        ["reports", id, startDate, endDate],
        isClasse ? reportRepository.getAllClasseWeekReport : reportRepository.getAllWeekReport,
        [id, startDate, endDate],
        !!id
    )

    const useViewReport = (reportId: number) => useFetch(
        ["reports", reportId], reportRepository.viewReport, [reportId], (!!reportId)
    )

    const useCheckPrincipal = (classeId: number) => {
        const {data} = useFetch(["teacher-principal", classeId, user?.userId], checkTeacherIsPrincipal, [user?.userId, classeId], !!user?.userId && !!classeId)
        return {
            isPrincipal: data
        }
    }

    const useAmongClasseTeachers = (classeTeacherIds?: Teacher[]): boolean => {
        return (classeTeacherIds ?? []).some(t => t.id === user?.userId)
    }

    const teacherOptions = useCallback((data?: Teacher[], isPersonalInfo: boolean = false): Options => {
        return data ? data?.map(i => ({
            label: setName(i.personalInfo),
            value: isPersonalInfo ? i?.personalInfo?.id as number : i?.id as string
        })) : [] as Options
    }, [])

    return {
        useGetPaginated,
        useGetAllTeachers,
        useGetSearchedTeachers,
        useGetSearchedTeacher,
        useGetTeacher,
        useGetTeacherSchedules,
        useGetTeacherBasic,
        useGetTeacherPersonalInfo,
        useGetTeacherStudentNumber,
        useGetTeacherClasseStudentNumber,
        useGetTeacherClasses,
        useGetTeacherCourses,
        useGetWidgets,
        useCountAllTeachers,
        useGetTeacherBasicValues,
        useSaveReport,
        useGetAllWeekReport,
        useUpdateClasses,
        useUpdateCourses,
        useAffiliateTeacher,
        useRemoveTeacherAffiliation,
        useViewReport,
        useCheckPrincipal,
        useAmongClasseTeachers,
        teacherOptions
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