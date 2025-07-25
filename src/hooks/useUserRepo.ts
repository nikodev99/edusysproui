import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {useFetch} from "./useFetch.ts";
import {countAllUsers, getAllUsers} from "../data/repository/userRepository.ts";

export const useUserRepo = () => {
    const schoolId = loggedUser.getSchool()?.id

    return {
        useGetAllUsers: () => useFetch(['users', schoolId], getAllUsers, [schoolId], !!schoolId),

        useCountUsers: () => {
            const count = useFetch(['users-count', schoolId], countAllUsers, [schoolId], !!schoolId)
            return count.data as number
        }
    }
}