import {useFetch} from "./useFetch.ts";
import {userExists, userExistsInSchool} from "../auth/services/AuthService.ts.tsx";
import {useGlobalStore} from "@/core/global/store.ts";

export const useAccount = () => {
    const schoolId = useGlobalStore(state => state.schoolId);

    return {
        useAccountExists: (personalInfoId?: number): boolean=> {
            const {data} = useFetch(['account-exists', personalInfoId], userExists, [personalInfoId], !!personalInfoId)
            return !!data
        },

        useAccountExistsInSchool: (personalInfoId?: number) => {
            const {data} = useFetch(["account-exists-in-school",schoolId], userExistsInSchool, [schoolId, personalInfoId], !!schoolId && !!personalInfoId)
            console.log('IS PRESENT: ', data)
            return data
        }
    }
}