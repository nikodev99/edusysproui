import {useFetch} from "./useFetch.ts";
import {userExists} from "../auth/services/AuthService.ts.tsx";

export const useAccount = () => {
    return {
        useAccountExists: (personalInfoId?: number): boolean=> {
            const {data} = useFetch(['employee-account-exists', personalInfoId], userExists, [personalInfoId], !!personalInfoId)
            return !!data
        }
    }
}