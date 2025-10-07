import {useFetch} from "../useFetch.ts";
import {
    countAllUsers,
    getAllSearchedUsers, getAllUserLogins,
    getAllUsers,
    getUserActivities,
    getUserById, getUserLogin,
    saveUserActivity
} from "../../data/repository/userRepository.ts";
import {useGlobalStore} from "../../core/global/store.ts";
import {getShortSortOrder, setSortFieldName} from "../../core/utils/utils.ts";
import {User, UserActivity} from "../../auth/dto/user.ts";
import {loggedUser} from "../../auth/jwt/LoggedUser.ts";

export const useUserRepo = () => {
    const schoolId = useGlobalStore(state => state.schoolId)
    const logged = loggedUser.getUser()

    const useGetAllUsers = () => useFetch(['users', schoolId], getAllUsers, [schoolId], !!schoolId)

    const getPaginatedUsers = async (page: number, size: number, sortField?: string, sortOrder?: string) => {
        if (sortField && sortOrder) {
            sortOrder = getShortSortOrder(sortOrder);
            sortField = sortedField(sortField);
            return await getAllUsers(schoolId as string, {page: page, size: size}, `${sortField}:${sortOrder}`);
        }
        return await getAllUsers(schoolId as string, {page: page, size: size});
    }

    const useGetSearchedUsers = (input?: string) => useFetch(
        ['users-searched', schoolId],
        getAllSearchedUsers,
        [schoolId, input],
        !!schoolId && !!input
    )

    const getSearchedUsers = (input: string) => getAllSearchedUsers(schoolId as string, input);

    const useGetUser = (userId: number) => useFetch(
        ['user', schoolId, userId],
        getUserById,
        [userId, schoolId],
        !!userId && !!schoolId
    )

    const saveActivity = (data: UserActivity) => {
        const accountId = logged?.accountId
        if (accountId)
            data = {...data, accountId: accountId}

        saveUserActivity(data).then(r => r.data)
    }

    const useGetUserActivities = (accountId: number) => {
        const {data} = useFetch(["user-activities", accountId], getUserActivities, [accountId], !!accountId);
        return data
    }

    const useGetAllUserLogins = (accountId: number) => useFetch(
        ['user-logins', accountId],
        getAllUserLogins,
        [accountId],
        !!accountId
    )

    const useGetUserLogin = (accountId: number) => {
        const {data} = useFetch(['user-logins', accountId], getUserLogin, [accountId], !!accountId)
        return data
    }

    const useCountUsers = () => {
        const count = useFetch(['users-count', schoolId], countAllUsers, [schoolId], !!schoolId)
        return count.data as number
    }

    const isSameUser = (currentUser?: User): boolean => currentUser ? currentUser?.username === logged?.username : false


    return {
        useGetAllUsers,
        getPaginatedUsers,
        useGetSearchedUsers,
        getSearchedUsers,
        useGetUser,
        useGetAllUserLogins,
        useGetUserLogin,
        useCountUsers,
        saveActivity,
        useGetUserActivities,
        isSameUser
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