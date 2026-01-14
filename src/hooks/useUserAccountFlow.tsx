import {Individual} from "@/entity";
import {User, UserType} from "../auth/dto/user.ts";
import {useAccount} from "./useAccount.ts";
import {useUserRepo} from "./actions/useUserRepo.ts";
import {useAuth} from "./useAuth.ts";
import {useMemo} from "react";
import {assignUserToSchoolSchema, AssignUserToSchoolSchema, signupSchema, SignupSchema} from "@/schema";
import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {MessageResponse} from "../core/utils/interfaces.ts";
import {AxiosResponse} from "axios";

interface UserAccountFlow {
    flowType: 'idle' | 'create' | 'assign'
    handleSubmit: (data: SignupSchema | AssignUserToSchoolSchema) => Promise<AxiosResponse<false | MessageResponse | SignupSchema>>
    accountExists: boolean
    userToAssign?: User
    isReady: boolean
    useForm: ReturnType<typeof useForm>
}

export const useUserAccountFlow = (personalInfo?: Individual, userType?: UserType): UserAccountFlow => {
    const {useAccountExists} = useAccount()
    const {useGetUserByPersonalInfo} = useUserRepo()
    const {registerUser, assignUser} = useAuth()
    
    const accountExists = useAccountExists(personalInfo?.id as number)
    const userToAssign = useGetUserByPersonalInfo(personalInfo?.id as number)
    
    const flowType = useMemo(() => {
        if (!personalInfo) return 'idle'
        return accountExists ? 'assign' : 'create'
    }, [accountExists, personalInfo])

    const form = useForm<AssignUserToSchoolSchema | SignupSchema>({
        resolver: zodResolver(flowType === 'assign' ? assignUserToSchoolSchema : signupSchema)
    })
    
    const handleSubmit = async (data: SignupSchema | AssignUserToSchoolSchema) => {
        if (!personalInfo) return
        
        if (accountExists && userToAssign) {
            const assignData: AssignUserToSchoolSchema = {
                ...data,
                userId: userToAssign.id as number,
            }
            return assignUser(assignData);
        }
        
        if (!accountExists) {
            const createData: SignupSchema = {
                ...data,
                email: personalInfo.emailId,
                phoneNumber: personalInfo.telephone,
                personalInfoId: personalInfo.id as number,
                roles: {...data.roles, schoolId: loggedUser.getSchool()?.id},
                userType: userType
            }
            return registerUser(createData);
        }
    }

    return {
        flowType,
        handleSubmit: handleSubmit as never,
        accountExists,
        userToAssign,
        isReady: !!personalInfo,
        useForm: form
    }
}