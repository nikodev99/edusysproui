import {Counted, CountType, GenderCounted, Pageable} from "@/core/utils/interfaces.ts";
import {useFetch, useRawFetch} from "../useFetch.ts";
import {fetchTeachers} from "@/data";
import {
    countAllTeachers, getAllSelfTeachers, getAllTeachers,
    getNumberOfStudentTaughtByClasse,
    getNumberOfStudentTaughtByTeacher,
    getSearchedTeachers,
    getTeacherBasicValues,
    getTeacherById,
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

    const useGetTeacherBasicValues = (classeId?: number, section?: SectionType) => useFetch(
        ['teacher-basic', classeId, section],
        getTeachersBasicValues,
        [classeId, section],
        !!classeId && !!section
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

    const useGetTeacherSchedules = (teacherId: string,  allDay: boolean = false) => useFetch(
        ['teacher-schedules', teacherId],
        allDay ? getTeacherScheduleByDay : getTeacherSchedule,
        allDay ? [teacherId, allDay] : [teacherId],
        !!teacherId
    )
    
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

    return {
        useGetPaginated,
        useGetAllTeachers,
        useGetSearchedTeachers,
        useGetTeacher,
        useGetTeacherSchedules,
        useGetTeacherBasic,
        useGetTeacherStudentNumber,
        useGetTeacherClasseStudentNumber,
        useCountAllTeachers,
        useGetTeacherBasicValues
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