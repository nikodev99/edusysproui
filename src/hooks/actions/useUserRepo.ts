import {useFetch} from "../useFetch.ts";
import {
    countAllUsers,
    getAllSearchedUsers,
    getAllUsers,
    getUserById,
    getUserLogins
} from "../../data/repository/userRepository.ts";
import {useGlobalStore} from "../../core/global/store.ts";
import {getShortSortOrder, setSortFieldName} from "../../core/utils/utils.ts";

export const useUserRepo = () => {
    const schoolId = useGlobalStore(state => state.schoolId)

    const useGetAllUsers = () => useFetch(['users', schoolId], getAllUsers, [schoolId], !!schoolId)

    const getPaginatedUsers = async (page: number, size: number, sortField?: string, sortOrder?: string) => {
        if (sortField && sortOrder) {
            sortOrder = getShortSortOrder(sortOrder);
            sortField = sortedField(sortField);
            return await getAllUsers(schoolId, {page: page, size: size}, `${sortField}:${sortOrder}`);
        }
        return await getAllUsers(schoolId, {page: page, size: size});
    }

    const useGetSearchedUsers = (input?: string) => useFetch(
        ['users-searched', schoolId],
        getAllSearchedUsers,
        [schoolId, input],
        !!schoolId && !!input
    )

    const getSearchedUsers = (input: string) => getAllSearchedUsers(schoolId, input);

    const useGetUser = (userId: number) => useFetch(
        ['user', schoolId, userId],
        getUserById,
        [userId, schoolId],
        !!userId && !!schoolId
    )

    const useGetUserLogins = (userId: number) => {
        const {data} = useFetch(['user-logins', userId], getUserLogins, [userId], !!userId)
        return data
    }

    const useCountUsers = () => {
        const count = useFetch(['users-count', schoolId], countAllUsers, [schoolId], !!schoolId)
        return count.data as number
    }

    return {
        useGetAllUsers,
        getPaginatedUsers,
        useGetSearchedUsers,
        getSearchedUsers,
        useGetUser,
        useGetUserLogins,
        useCountUsers,
    }
}

const sortedField = (sortField: string | string[]) => {
    switch (setSortFieldName(sortField)) {
        case 'username':
            return 'u.username'
        case 'firstName':
            return 'i.firstName'
        case 'lastName':
            return 'i.lastName'
        case 'lastLogin':
            return 'u.lastLogin'
        case 'userType':
            return 'u.userType'
        default:
            return undefined;
    }
}