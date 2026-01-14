import {guardianSchema} from "@/schema";
import {useQueryUpdate} from "@/hooks/useUpdate.ts";
import {useGlobalStore} from "@/core/global/store.ts";
import {getShortSortOrder, setSortFieldName} from "@/core/utils/utils.ts";
import {
    getEnrolledStudentsGuardians, getGuardianById, getGuardianWithStudentsById,
    getSearchedEnrolledStudentGuardian
} from "@/data/repository/guardianRepository.ts";
import {useFetch} from "@/hooks/useFetch.ts";

export const useGuardianRepo = () => {
    const schoolId = useGlobalStore(state => state.schoolId)

    const useGetPaginated = () => {
        return {
            getPaginatedGuardian: async (page: number, size: number, sortField?: string, sortOrder?: string) => {
                if (sortField && sortOrder) {
                    sortOrder = getShortSortOrder(sortOrder)
                    sortField = sortedField(sortField)
                    return await getEnrolledStudentsGuardians(schoolId, page, size, `${sortField}:${sortOrder}`);
                }
                return await getEnrolledStudentsGuardians(schoolId, page, size)
            },
            getSearchedGuardian: async (searchInput: string) => {
                return await getSearchedEnrolledStudentGuardian(schoolId, searchInput)
            }
        }
    }

    const useChangeGuardian = () => useQueryUpdate(guardianSchema)

    const useGetGuardianWithStudents = (guardianId: string) => useFetch(
        ['guardian-with-students', guardianId],
        getGuardianWithStudentsById,
        [guardianId],
        !!guardianId
    )

    const useGetGuardian = (guardianId: string) => useFetch(
        ['guardian', guardianId],
        getGuardianById,
        [guardianId],
        !!guardianId
    )

    return {
        useGetPaginated,
        useChangeGuardian,
        useGetGuardianWithStudents,
        useGetGuardian
    }
}

const sortedField = (sortField: string | string[]) => {
    switch (setSortFieldName(sortField)) {
        case 'lastName':
            return 'e.student.guardian.personalInfo.lastName'
        default:
            return undefined;
    }
}