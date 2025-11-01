import {GenderCounted, Options, Pageable} from "../../core/utils/interfaces.ts";
import {useFetch, useRawFetch} from "../useFetch.ts";
import {UseQueryResult} from "@tanstack/react-query";
import {Enrollment} from "../../entity";
import {fetchEnrolledStudents} from "../../data";
import {
    countClasseStudents,
    countSomeClasseStudents,
    countStudent,
    getAllStudentClassmate,
    getClasseEnrolledStudentsSearch,
    getClasseStudents,
    getRandomStudentClassmate,
    getStudentById,
    searchEnrolledStudents, searchUnenrolledStudents
} from "../../data/repository/studentRepository.ts";
import {fetchEnrolledClasseStudents} from "../../data/action/studentAction.ts";
import {useCallback, useEffect, useState} from "react";
import {useGlobalStore} from "../../core/global/store.ts";
import { setFirstName } from "../../core/utils/utils.ts";

export const useStudentRepo = () => {
    const schoolId = useGlobalStore(state => state.schoolId)

    /**
     * Fetches paginated enrolled students.
     *
     * @param {Pageable} pageable - Pagination object (page, size).
     * @param {string} [sortField] - Field to sort by.
     * @param {'asc' | 'desc'} [sortOrder] - Sort direction.
     * @returns {UseQueryResult<Enrollment[], unknown>}
     */
    const useGetEnrolledStudents = (
        pageable: Pageable,
        sortField?: string,
        sortOrder?: 'asc' | 'desc',
    ): UseQueryResult<Enrollment[], unknown> => {
        return useFetch(
            ['students-list'],
            fetchEnrolledStudents,
            [pageable.page, pageable.size, sortField, sortOrder],
            !!pageable.size
        );
    };

    /**
     * Searches enrolled students by name or other identifier.
     *
     * @param {string} searchInput - The search term.
     * @returns {UseQueryResult<Enrollment[], unknown>}
     */
    const useSearchEnrolledStudents = (
        searchInput: string
    ): UseQueryResult<Enrollment[], unknown> => {
        return useFetch(
            ['students-search', schoolId, searchInput],
            searchEnrolledStudents,
            [schoolId, searchInput],
            !!schoolId && !!searchInput
        );
    };

    const useGetSearchUnenrolledStudents = (
        searchInput: string
    ): UseQueryResult<Enrollment[], unknown> => useFetch(
        ["unenrolled-students-search", schoolId],
        searchUnenrolledStudents,
        [schoolId, searchInput],
        !!schoolId && !!searchInput
    )

    const findUnenrolledStudents = (searchInput: string) =>
        searchUnenrolledStudents(schoolId, searchInput)

    /**
     * Fetches a single student by ID.
     *
     * @param {string} studentId - The unique student identifier.
     * @returns {UseQueryResult<Enrollment, unknown>}
     */
    const useGetStudent = (
        studentId: string
    ): UseQueryResult<Enrollment, unknown> => {
        return useFetch(
            ['student', studentId],
            getStudentById,
            [studentId],
            !!studentId
        );
    };

    /**
     * Fetches enrolled students of a specific class with pagination.
     *
     * @param {number} classeId - The class ID.
     * @param {string} academicYear - Academic year identifier.
     * @param {Pageable} pageable - Pagination object.
     * @param {string} [sortField] - Field to sort by.
     * @param {'asc' | 'desc'} [sortOrder] - Sort direction.
     * @returns {UseQueryResult<Enrollment[], unknown>}
     */
    const useGetClasseEnrolledStudents = (
        classeId: number,
        academicYear: string,
        pageable: Pageable = { page: 0, size: 10 },
        sortField?: string,
        sortOrder?: 'asc' | 'desc',
    ): UseQueryResult<Enrollment[], unknown> => {
        return useFetch(
            ['classe-students', classeId, academicYear],
            fetchEnrolledClasseStudents,
            [classeId, academicYear, pageable.page, pageable.size, sortField, sortOrder],
            !!classeId && !!academicYear
        );
    };

    /**
     * Searches enrolled students in a specific class.
     *
     * @param {number} classeId - The class ID.
     * @param {string} academicYear - Academic year.
     * @param {string} searchName - Name or keyword to search.
     * @returns {UseQueryResult<Enrollment[], unknown>}
     */
    const useGetClasseEnrolledStudentsSearch = (
        classeId: number,
        academicYear: string,
        searchName: string,
    ): UseQueryResult<Enrollment[], unknown> => {
        return useFetch(
            ['classe-students-search', classeId, academicYear, searchName],
            getClasseEnrolledStudentsSearch,
            [classeId, academicYear, searchName],
            !!academicYear && !!searchName
        );
    };

    /**
     * Fetches all students in a specific class for a given academic year.
     *
     * @param {number} classeId
     * @param {string} academicYear
     * @returns {UseQueryResult<Enrollment[], unknown>}
     */
    const useGetClasseStudents = (
        classeId: number,
        academicYear: string
    ): UseQueryResult<Enrollment[], unknown> => {
        return useFetch(
            ['classe-students-all', classeId, academicYear],
            getClasseStudents,
            [classeId, academicYear],
            !!classeId && !!academicYear
        );
    };

    /**
     * Fetches a random classmate of a given student.
     *
     * @param {string} studentId
     * @param {string} classeId
     * @returns {UseQueryResult<Enrollment[], unknown>}
     */
    const useGetRandomStudentClassmate = (
        studentId: string,
        classeId: string
    ): UseQueryResult<Enrollment[], unknown> => {
        return useFetch(
            ['random-classmate', schoolId, studentId, classeId],
            getRandomStudentClassmate,
            [schoolId, studentId, classeId],
            !!schoolId && !!studentId && !!classeId
        );
    };

    /**
     * Fetches all classmates of a student with pagination.
     *
     * @param {string} studentId
     * @param {number} classeId
     * @param {string} academicYearId
     * @param {Pageable} pageable
     * @returns {UseQueryResult<Enrollment[], unknown>}
     */
    const useGetStudentClassmate = (
        studentId: string,
        classeId: number,
        academicYearId: string,
        pageable: Pageable
    ): UseQueryResult<Enrollment[], unknown> => {
        return useFetch(
            ['classmates', studentId, classeId, academicYearId],
            getAllStudentClassmate,
            [studentId, classeId, academicYearId, pageable],
            !!academicYearId && !!pageable.size
        );
    };

    /**
     * Counts the number of students in a given class by gender.
     *
     * @param {number} classeId
     * @param {string} academicYearId
     * @returns {UseQueryResult<GenderCounted[], unknown>}
     */
    const useCountClasseStudents = (
        classeId: number,
        academicYearId: string
    ): UseQueryResult<GenderCounted, unknown> => {
        return useFetch(
            ['classe-count', classeId],
            countClasseStudents,
            [classeId, academicYearId],
           !!classeId && !!academicYearId
        );
    };

    /**
     * Counts students across multiple classes.
     *
     * @param {number[]} classeIds
     * @param {string} academicYearId
     * @returns {UseQueryResult<GenderCounted[], unknown>}
     */
    const useCountSomeClasseStudents = (
        classeIds: number[],
        academicYearId: string
    ): UseQueryResult<GenderCounted, unknown> => {
        return useFetch(
            ['multi-classe-count', ...classeIds],
            countSomeClasseStudents,
            [classeIds, academicYearId],
            Array.isArray(classeIds) && classeIds.length > 0 && !!academicYearId
        );
    };

    /**
     * Counts all students.
     *
     * @returns {UseQueryResult<number, unknown>}
     */
    const useCountStudent = (): GenderCounted | undefined => {
        const [count, setCount] = useState<GenderCounted>()
        const fetch = useRawFetch();
        useEffect(() => {
            fetch(countStudent, [schoolId])
                .then(resp => {
                    if (resp.isSuccess) {
                        setCount(resp.data as GenderCounted)
                    }
                })
        }, [fetch]);
        
        return count
    };

    const studentOptions = useCallback((data?: Enrollment[]): Options => {
        return data ? data?.map(i => ({
            label: setFirstName(`${i?.student?.personalInfo?.lastName} ${i?.student?.personalInfo?.firstName}`),
            value: i?.id as number
        })) : [] as Options
    }, [])

    return {
        useGetEnrolledStudents,
        useSearchEnrolledStudents,
        useGetSearchUnenrolledStudents,
        findUnenrolledStudents,
        useGetStudent,
        useGetClasseEnrolledStudents,
        useGetClasseEnrolledStudentsSearch,
        useGetClasseStudents,
        useGetRandomStudentClassmate,
        useGetStudentClassmate,
        useCountClasseStudents,
        useCountSomeClasseStudents,
        useCountStudent,
        studentOptions,
    };
};
