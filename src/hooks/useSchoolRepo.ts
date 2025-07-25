import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {School} from "../entity";
import {useFetch} from "./useFetch.ts";
import {getSchool} from "../data/repository/schoolRepository.ts";

export const useSchoolRepo = () => {
    const schoolId = loggedUser.getSchool()?.id

    return {
        useGetSchool: (refetch: boolean = false): School | undefined => {
            const schoolRes = useFetch(['school', schoolId], getSchool, [schoolId], !!schoolId)
            if (refetch) {
                schoolRes.refetch().then()
            }
            return schoolRes.data
        }
    }
}