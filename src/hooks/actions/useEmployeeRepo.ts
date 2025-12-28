import {useFetch} from "../useFetch.ts";
import {
    findAllEmployees,
    findAllEmployeesSearch,
    findEmployeeById, findEmployeeIndividuals,
    insertEmployee
} from "@/data/repository/employeeRepository.ts";
import {Pageable, SortCriteria} from "@/core/utils/interfaces.ts";
import {Employee} from "@/entity";
import {useInsert} from "../usePost.ts";
import {employeeSchema} from "@/schema/models/employeeSchema.ts";
import {useMemo} from "react";
import {setFirstName} from "@/core/utils/utils.ts";
import {useGlobalStore} from "@/core/global/store.ts";

export const useEmployeeRepo = () => {
    const schoolId = useGlobalStore(state => state.schoolId)

    const useInsertEmployee = () => useInsert(employeeSchema, insertEmployee, {
        mutationKey: ['employee-post'],
    })

    const useGetEmployees = (pageable: Pageable, sortCriteria: SortCriteria<Employee>[]) => {
        const criteria: string = sortCriteria
            ?.map(s => `${s.sortField}:${s.sortOrder}`)
            ?.join(',')

        return useFetch<Employee[], unknown>(
            ['employee-list', schoolId],
            findAllEmployees,
            [schoolId, pageable, criteria],
            !!schoolId && !!pageable.size
        )
    }

    const useGetEmployeeSearched = (searchInput: string) =>
        useFetch<Employee[], unknown>(
            ['employee-searched', schoolId, searchInput],
            findAllEmployeesSearch,
            [schoolId, searchInput],
            !!schoolId && !!searchInput
    )

    const useGetEmployee = (employeeId: string) =>
        useFetch<Employee, unknown>(
            ['employee-id', employeeId],
            findEmployeeById,
            [employeeId],
            !!employeeId
    )

    const useGetEmployeeIndividuals = (searchInput?: string, isSearchable: boolean = true) =>
        useFetch<Employee[], unknown>(
            ['employee-individuals', schoolId, searchInput],
            findEmployeeIndividuals,
            [schoolId, searchInput],
            isSearchable ? !!searchInput && !!schoolId: !!schoolId
    )

    const fetchEmployeeIndividuals = (searchValue?: string) =>
        findEmployeeIndividuals(schoolId as string, searchValue)

    const employeeIndividuals = useGetEmployeeIndividuals()?.data

    const employeeOptions = useMemo(() => employeeIndividuals?.map(e => ({
        label: setFirstName(`${e?.personalInfo?.lastName} ${e?.personalInfo?.firstName}`),
        value: e?.id
    })), [employeeIndividuals])

    return {
        /* Custom Hooks */
        useInsertEmployee,
        useGetEmployees,
        useGetEmployeeSearched,
        useGetEmployee,
        useGetEmployeeIndividuals,

        /* Constants */
        employeeIndividuals,
        employeeOptions,

        /* API Functions */
        fetchEmployeeIndividuals
    }
}