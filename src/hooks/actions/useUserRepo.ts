import {useFetch} from "../useFetch.ts";
import {countAllUsers, getAllUsers} from "../../data/repository/userRepository.ts";
import {useGlobalStore} from "../../core/global/store.ts";

export const useUserRepo = () => {
    const schoolId = useGlobalStore(state => state.schoolId)

    return {
        useGetAllUsers: () => useFetch(['users', schoolId], getAllUsers, [schoolId], !!schoolId),

        useCountUsers: () => {
            const count = useFetch(['users-count', schoolId], countAllUsers, [schoolId], !!schoolId)
            return count.data as number
        }
    }
}