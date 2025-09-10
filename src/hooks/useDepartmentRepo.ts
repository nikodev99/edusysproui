import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {useFetch} from "./useFetch.ts";
import {getDepartmentBasics, getPrimaryDepartment, saveDepartment} from "../data/repository/departmentRepository.ts";
import {Department} from "../entity";
import {useInsert} from "./usePost.ts";
import {departmentSchema} from "../schema";
import {RepoOptions} from "../core/utils/interfaces.ts";

export const useDepartmentRepo = () => {
    const schoolId = loggedUser.getSchool()?.id
    
    return {
        useInsertDepartment: () => useInsert(departmentSchema, saveDepartment),

        useGetAllDepartments: (options?: RepoOptions) => {
            const shouldEnable =
                options && "enable" in options
                    ? !!schoolId && options.enable // honor the provided value
                    : !!schoolId;

            const queryData = useFetch(
                ['departments', schoolId],
                getDepartmentBasics,
                [schoolId],
                shouldEnable,
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