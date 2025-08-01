import {useMemo} from "react";
import {useFetch} from "./useFetch.ts";
import {getAllSemesters} from "../data/repository/semesterRepository.ts";
import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {RepoOptions} from "../core/utils/interfaces.ts";

export const useSemesterRepo = () => {
    const userSchool = useMemo(() => loggedUser.getSchool(), [])
    
    const useGetAllSemesters = (options?: RepoOptions) => {
        const {data, refetch} = useFetch(['semester-list', userSchool?.id], getAllSemesters, [userSchool?.id], !!userSchool?.id)

        if (options?.shouldRefetch)
            refetch().then(r => r.data)

        return data
    }

    return {
        useGetAllSemesters
    }
}