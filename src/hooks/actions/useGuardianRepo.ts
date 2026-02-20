import {guardianSchema} from "@/schema";
import {useQueryUpdate} from "@/hooks/useUpdate.ts";
import {useGlobalStore} from "@/core/global/store.ts";
import {getShortSortOrder, setSortFieldName} from "@/core/utils/utils.ts";
import {
    getEnrolledStudentsGuardians, getEnrolledStudentsGuardiansByTeacher, getEnrolledStudentsSelfGuardians,
    getGuardianById,
    getGuardianWithStudentsById,
    getSearchedEnrolledStudentGuardian, getSearchedEnrolledStudentGuardianByTeacher,
    getSearchedEnrolledStudentSelfGuardian, globalGuardianSearch
} from "@/data/repository/guardianRepository.ts";
import {useFetch} from "@/hooks/useFetch.ts";
import {GuardianPayment} from "@/finance/apis/guardianPayment.ts";
import {RepoOptions} from "@/core/utils/interfaces.ts";
import {useInsert} from "@/hooks/usePost.ts";
import {PaymentResponse, paymentSchema, PaymentSchema} from "@/finance/models/payment.ts";
import {UserPermission} from "@/core/shared/sharedEnums.ts";
import {useAuth} from "@/hooks/useAuth.ts";

export const useGuardianRepo = (context: UserPermission = UserPermission.ALL) => {
    const schoolId = useGlobalStore(state => state.schoolId)

    const useGetPaginated = () => {
        const {user} = useAuth()
        return {
            getPaginatedGuardian: async (page: number, size: number, sortField?: string, sortOrder?: string) => {
                if (sortField && sortOrder) {
                    sortOrder = getShortSortOrder(sortOrder)
                    sortField = sortedField(sortField)
                    switch (context) {
                        case UserPermission.ALL:
                            return await getEnrolledStudentsGuardians(schoolId, page, size, `${sortField}:${sortOrder}`);
                        case UserPermission.TEACHER:
                            return await getEnrolledStudentsGuardiansByTeacher(schoolId, user?.userId as string, page, size, `${sortField}:${sortOrder}`)
                        case UserPermission.GUARDIAN:
                            return await getEnrolledStudentsSelfGuardians(schoolId, user?.userId as string, page, size, `${sortField}:${sortOrder}`)
                    }
                }
                switch (context) {
                    case UserPermission.ALL:
                        return await getEnrolledStudentsGuardians(schoolId, page, size);
                    case UserPermission.TEACHER:
                        return await getEnrolledStudentsGuardiansByTeacher(schoolId, user?.userId as string, page, size)
                    case UserPermission.GUARDIAN:
                        return await getEnrolledStudentsSelfGuardians(schoolId, user?.userId as string, page, size)
                }
            },
            getSearchedGuardian: async (searchInput: string) => {
                switch (context) {
                    case UserPermission.ALL:
                        return await getSearchedEnrolledStudentGuardian(schoolId, searchInput)
                    case UserPermission.TEACHER:
                        return await getSearchedEnrolledStudentGuardianByTeacher(schoolId, user?.userId as string, searchInput)
                    case UserPermission.GUARDIAN:
                        return await getSearchedEnrolledStudentSelfGuardian(schoolId, user?.userId as string, searchInput)
                }
            },

            getGlobalSearchGuardian: async (searchInput: string) => {
                return await globalGuardianSearch(searchInput)
            }
        }
    }

    const useChangeGuardian = () => useQueryUpdate(guardianSchema)

    const useGetGuardianWithStudents = (guardianId: string) => useFetch(
        ['guardian-with-students', schoolId, guardianId],
        getGuardianWithStudentsById,
        [schoolId, guardianId],
        !!guardianId
    )

    const useGetGuardian = (guardianId: string) => useFetch(
        ['guardian', guardianId],
        getGuardianById,
        [guardianId],
        !!guardianId
    )

    const useGetPaymentSummary = (guardianId: string, academicYear: string) => {
        const {data} = useFetch(["payment-summary", guardianId, academicYear], GuardianPayment.getPaymentSummary, [guardianId, academicYear], !!guardianId && !!academicYear)
        return data
    }

    const useGetAllInvoices = (guardianId: string, options?: RepoOptions) => useFetch(
        ["all-invoices", guardianId, schoolId],
        GuardianPayment.getAllGuardianInvoices,
        [guardianId, schoolId],
        options?.enable ? options?.enable && !!guardianId && !!schoolId : !!guardianId && !!schoolId
    )

    const useGetCurrentInvoices = (guardianId: string, academicYear: string, options?: RepoOptions) => useFetch(
        ["current-invoices", guardianId, academicYear],
        GuardianPayment.getGuardianCurrentInvoices,
        [guardianId, academicYear],
        (options?.enable ?? true) &&
        !!guardianId &&
        !!academicYear
    )

    const useGetActiveInvoices = (guardianId: string, academicYear: string, options?: RepoOptions) => useFetch(
        ["active-invoices", guardianId, academicYear],
        GuardianPayment.getGuardianActiveInvoice,
        [guardianId, academicYear],
        (options?.enable ?? true) &&
        !!guardianId &&
        !!academicYear
    )

    const useGetPaymentHistory = (guardianId: string, academicYear: string) => useFetch(
        ["payment-history", guardianId, academicYear],
        GuardianPayment.getGuardianPaymentHistory,
        [guardianId, academicYear],
        !!guardianId && !!academicYear
    )

    const useInitPayment = () => useInsert<PaymentSchema, PaymentResponse>(paymentSchema, GuardianPayment.initPayment as never)

    return {
        useGetPaginated,
        useChangeGuardian,
        useGetGuardianWithStudents,
        useGetGuardian,
        useGetPaymentSummary,
        useGetAllInvoices,
        useGetCurrentInvoices,
        useGetActiveInvoices,
        useGetPaymentHistory,
        useInitPayment
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