import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {useFetch} from "./useFetch.ts";
import {
    findAllEmployees,
    findAllEmployeesSearch,
    findEmployeeById,
    insertEmployee
} from "../data/repository/employeeRepository.ts";
import {Pageable, SortCriteria} from "../core/utils/interfaces.ts";
import {Employee} from "../entity";
import {useInsert} from "./usePost.ts";
import {employeeSchema} from "../schema/models/employeeSchema.ts";

export const useEmployeeRepo = () => {
    const school = loggedUser.getSchool()

    return {
        useInsertEmployee: () => useInsert(employeeSchema, insertEmployee, {
            mutationKey: ['employee-post'],
        }),

        useGetEmployees: (pageable: Pageable, sortCriteria: SortCriteria<Employee>[]) => {
            const criteria: string = sortCriteria
                ?.map(s => `${s.sortField}:${s.sortOrder}`)
                ?.join(',')

            return useFetch(
                ['employee-list', school?.id],
                findAllEmployees,
                [school?.id, pageable, criteria],
                !!school?.id && !!pageable.size
            )
        },

        useGetEmployeeSearched: (searchInput: string) => useFetch(
            ['employee-searched', school?.id, searchInput],
            findAllEmployeesSearch,
            [school?.id, searchInput],
            !!school?.id && !!searchInput
        ),

        useGetEmployee: (employeeId: string) => useFetch(
            ['employee-id', employeeId],
            findEmployeeById,
            [employeeId],
            !!employeeId
        )
    }
}