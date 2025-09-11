import {Counted, CountType, GenderCounted, Pageable} from "../../core/utils/interfaces.ts";
import {useFetch, useRawFetch} from "../useFetch.ts";
import {fetchTeachers} from "../../data";
import {
    countAllTeachers,
    getNumberOfStudentTaughtByClasse,
    getNumberOfStudentTaughtByTeacher,
    getSearchedTeachers, getTeachersBasicValues,
    getTeacherById, getTeacherSchedule, getTeacherScheduleByDay, getTeacherBasicValues
} from "../../data/repository/teacherRepository.ts";
import {useEffect, useState} from "react";
import {SectionType} from "../../entity/enums/section.ts";
import {Teacher} from "../../entity";
import {useGlobalStore} from "../../core/global/store.ts";

export const useTeacherRepo = () => {
    const schoolId = useGlobalStore(state => state.schoolId)

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