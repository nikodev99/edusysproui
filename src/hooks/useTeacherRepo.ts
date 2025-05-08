import {Counted, CountType, GenderCounted, Pageable} from "../core/utils/interfaces.ts";
import {useFetch, useRawFetch} from "./useFetch.ts";
import {fetchTeachers} from "../data";
import {
    countAllTeachers,
    getNumberOfStudentTaughtByClasse,
    getNumberOfStudentTaughtByTeacher,
    getSearchedTeachers, getTeacherBasicValues,
    getTeacherById, getTeacherSchedule, getTeacherScheduleByDay
} from "../data/repository/teacherRepository.ts";
import {useEffect, useState} from "react";
import {SectionType} from "../entity/enums/section.ts";

export const useTeacherRepo = () => {
    const useGetAllTeachers = (pageable: Pageable, sortField: string, sortOrder: string) => useFetch(
        ['teacher-list'],
        fetchTeachers,
        [pageable.page, pageable.size, sortField, sortOrder],
        !!pageable.size,
    )
    
    const useGetSearchedTeachers = (input: string) => useFetch(
        ['teacher-list'],
        getSearchedTeachers,
        [input],
        !!input
    )

    const useGetTeacherBasicValues = (classeId?: number, section?: SectionType) => useFetch(
        ['teacher-basic', classeId, section],
        getTeacherBasicValues,
        [classeId, section],
        !!classeId && !!section
    )

    const useGetTeacher = (teacherId: string) => useFetch(
        ['teacher', teacherId],
        getTeacherById,
        [teacherId],
        !!teacherId
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
            fetch(countAllTeachers, [])
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
        useGetTeacherStudentNumber,
        useGetTeacherClasseStudentNumber,
        useCountAllTeachers,
        useGetTeacherBasicValues
    }
}