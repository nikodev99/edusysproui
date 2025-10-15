import {useFetch} from "./useFetch.ts";
import {userExists} from "../auth/services/AuthService.ts.tsx";

export const useAccount = () => {
    return {
        useAccountExists: (personalInfoId?: number): boolean=> {
            const {data} = useFetch(['account-exists', personalInfoId], userExists, [personalInfoId], !!personalInfoId)
            return !!data
        }
    }
}