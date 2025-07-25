import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {useFetch} from "./useFetch.ts";
import {getDepartmentBasics, getPrimaryDepartment, saveDepartment} from "../data/repository/departmentRepository.ts";
import {Department} from "../entity";
import {useInsert} from "./usePost.ts";
import {departmentSchema} from "../schema/models/departmentSchema.ts";

export const useDepartmentRepo = () => {
    const schoolId = loggedUser.getSchool()?.id
    
    return {
        useInsertDepartment: () => useInsert(departmentSchema, saveDepartment),

        useGetAllDepartments: () => {
            const queryData = useFetch(
                ['departments', schoolId],
                getDepartmentBasics,
                [schoolId],
                !!schoolId
            )
            
            return queryData.data as Department[] || []
        },

        useGetDepartmentByCode: (departmentCode: string, enabled: boolean = true) => {
            const department = useFetch(
                ['department-code', departmentCode, schoolId],
                getPrimaryDepartment,
                [schoolId, departmentCode],
                !!schoolId && !!departmentCode && enabled
            )

            return department?.data as Department
        }
    }
}