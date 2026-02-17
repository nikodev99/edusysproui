import {guardianSchema} from "@/schema";
import {useQueryUpdate} from "@/hooks/useUpdate.ts";
import {useGlobalStore} from "@/core/global/store.ts";
import {getShortSortOrder, setSortFieldName} from "@/core/utils/utils.ts";
import {
    getEnrolledStudentsGuardians, getGuardianById, getGuardianWithStudentsById,
    getSearchedEnrolledStudentGuardian
} from "@/data/repository/guardianRepository.ts";
import {useFetch} from "@/hooks/useFetch.ts";
import {GuardianPayment} from "@/finance/apis/guardianPayment.ts";
import {RepoOptions} from "@/core/utils/interfaces.ts";
import {useInsert} from "@/hooks/usePost.ts";
import {PaymentSchema, paymentSchema, PaymentResponse} from "@/finance/models/payment.ts";

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