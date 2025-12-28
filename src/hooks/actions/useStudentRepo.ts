import {GenderCounted, Options, Pageable} from "@/core/utils/interfaces.ts";
import {useFetch, useRawFetch} from "../useFetch.ts";
import {UseQueryResult} from "@tanstack/react-query";
import {Enrollment} from "@/entity";
import {
    countClasseStudents,
    countSomeClasseStudents,
    countStudent,
    getAllStudentClassmate, getClasseEnrolledStudents,
    getClasseEnrolledStudentsSearch,
    getClasseStudents, getEnrolledStudents, getEnrolledStudentsByTeacher,
    getRandomStudentClassmate,
    getStudentById,
    searchEnrolledStudents, searchEnrolledStudentsByTeacher, searchStudents, searchUnenrolledStudents
} from "@/data/repository/studentRepository.ts";
import {useCallback, useEffect, useState} from "react";
import {useGlobalStore} from "@/core/global/store.ts";
import {getShortSortOrder, setFirstName} from "@/core/utils/utils.ts";
import {AxiosResponse} from "axios";
import {useAuth} from "@/hooks/useAuth.ts";

export const useStudentRepo = (context: 'ALL' | 'TEACHER' = 'ALL') => {
    const schoolId = useGlobalStore(state => state.schoolId)

    const useGetPaginated = () => {
        const {user} = useAuth()
        return {
            getPaginatedStudents : async (page: number,size: number,sortField?: string, sortOrder?: 'asc' | 'desc') => {
                if (sortField && sortOrder) {
                    sortOrder = getShortSortOrder(sortOrder)
                    sortField = sortedField(sortField)
                    return context === 'ALL'
                        ? await getEnrolledStudents(schoolId, page, size, `${sortField}:${sortOrder}`)
                        : await getEnrolledStudentsByTeacher(schoolId, user?.userId as string, page, size, `${sortField}:${sortOrder}`)
                }
                return context === 'ALL'
                    ? await getEnrolledStudents(schoolId, page, size)
                    : await getEnrolledStudentsByTeacher(schoolId, user?.userId as string, page, size)
            },

            getSearchedEnrolledStudents:  async (searchInput: string) => {
                return context === 'ALL'
                    ? await searchEnrolledStudents(schoolId, searchInput)
                    : await searchEnrolledStudentsByTeacher(schoolId, user?.userId as string, searchInput)
            }
        }
    }

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

    const useGetSearchStudent = (searchInput: string) => useFetch(
        ['search-student', searchInput],
        searchStudents,
        [schoolId, searchInput],
        !!schoolId && !!searchInput
    )

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
     * Retrieves a paginated and optionally sorted list of students enrolled in a specific class for a given academic year.
     *
     * @param {number} classeId - The unique identifier of the class.
     * @param {string} academicYear - The academic year for which the enrolled students are retrieved (e.g., "2023-2024").
     * @param {number} page - The page number of the results to retrieve (starting from 0).
     * @param {number} size - The number of records to fetch per page.
     * @param {string} [sortField] - The field on which the results should be sorted (optional).
     * @param {'asc' | 'desc'} [sortOrder] - The order of sorting, either ascending ('asc') or descending ('desc') (optional).
     * @returns {Promise<AxiosResponse<Enrollment[], unknown>>} A promise resolving to the Axios response containing an array of enrollment records.
     */
    const getPaginatedClasseStudents = async (
        classeId: number,
        academicYear: string,
        page: number,
        size: number,
        sortField?: string,
        sortOrder?: 'asc' | 'desc',
    ): Promise<AxiosResponse<Enrollment[], unknown>> => {
        if (sortField && sortOrder) {
            sortOrder = getShortSortOrder(sortOrder)
            sortField = sortedField(sortField)
            return await getClasseEnrolledStudents(classeId, academicYear, {page: page, size: size}, `${sortField}:${sortOrder}`)
        }
        return await getClasseEnrolledStudents(classeId, academicYear, {page: page, size: size})
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
        classeId: number
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
        useGetPaginated,
        useGetSearchUnenrolledStudents,
        findUnenrolledStudents,
        useGetSearchStudent,
        useGetStudent,
        getPaginatedClasseStudents,
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

const sortedField = (sortField: string) => {
    switch (sortField) {
        case 'lastName':
            return 'e.student.personalInfo.lastName'
        case 'lastEnrolledDate':
            return 'e.enrollmentDate'
        case 'age':
            return 'e.student.personalInfo.birthDate'
        default:
            return undefined;
    }
}
