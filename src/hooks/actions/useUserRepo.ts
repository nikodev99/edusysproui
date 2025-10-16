import {useFetch} from "../useFetch.ts";
import {
    ActivityFilterProps,
    countAllUsers, findUserByPersonalInfo, findUserPersonalInfo,
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

    const getPaginatedUserActivities = async (accountId: number, filters: ActivityFilterProps, page: number, size: number, sortField?: string, sortOrder?: string) => {
        if (sortField && sortOrder) {
            sortOrder = getShortSortOrder(sortOrder);
            sortField = activityFields(sortField);
            return await getUserActivities(accountId, filters, {page: page, size: size}, `${sortField}:${sortOrder}`);
        }
        return await getUserActivities(accountId, filters, {page: page, size: size});
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

    const useSearchUserPersonalInfo = (searchKey: string) => useFetch(
        ['user-search-personal-info', searchKey],
        findUserPersonalInfo,
        [searchKey],
        !!searchKey
    )

    const findSearchedUserPersonalInfo = (searchKey: string) => findUserPersonalInfo(searchKey)

    const useGetUserByPersonalInfo = (personalInfoId: number) => {
        const {data} = useFetch(['user-by-personalInfo', personalInfoId], findUserByPersonalInfo, [personalInfoId], !!personalInfoId)
        return data
    }

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
        getPaginatedUserActivities,
        isSameUser,
        useSearchUserPersonalInfo,
        findSearchedUserPersonalInfo,
        useGetUserByPersonalInfo
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

const activityFields = (sortField: string | string[]) => {
    switch (setSortFieldName(sortField)) {
        case 'action':
            return 'ua.action'
        default:
            return undefined;
    }
}