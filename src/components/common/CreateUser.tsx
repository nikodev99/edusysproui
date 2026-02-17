import {InsertModal} from "../custom/InsertSchema.tsx";
import {AssignUserToSchoolSchema, signupSchema, SignupSchema} from "@/schema";
import {UserAccountForm} from "../forms/UserAccountForm.tsx";
import {Individual} from "@/entity";
import {UserType} from "@/auth/dto/user.ts";
import {useUserAccountFlow} from "../../hooks/useUserAccountFlow.tsx";

export type CreateUserProps = {
    open?: boolean,
    onCancel?: () => void
    personalInfo?: Individual
    userType: UserType
}

const CreateUser = ({open, onCancel, personalInfo, userType}: CreateUserProps) => {
    const {flowType, handleSubmit: handleSubmitFlow, useForm} = useUserAccountFlow(personalInfo, userType)

    const {control, formState: {errors, submitCount}} = useForm

    const createUser = async (data: SignupSchema | AssignUserToSchoolSchema) => {
        if (submitCount <= 0) {
            return handleSubmitFlow(data)
        }
    }

    return(
        <InsertModal
            data={signupSchema}
            customForm={
                <UserAccountForm
                    control={control as never}
                    errors={errors}
                    flowType={flowType}
                />
            }
            handleForm={useForm as never}
            postFunc={createUser as never}
            open={open}
            onCancel={onCancel}
            messageSuccess={
                flowType === 'create'
                    ? "Nouveau compte utilisateur créer avec succès"
                    : "Utilisateur affilié à l'école avec succès"
            }
            title={
                flowType === 'create'
                    ? "Créer un compte utilisateur pour "
                    : "Affilier l'utilisateur à l'école"
            }
            okText={flowType === 'create' ? "Créer le compte" : "Affilier l'utilisateur"}
            description={
                flowType === 'create'
                    ? "Veuillez confirmer votre pour créer le nouveau compte utilisateur."
                    : "Veuillez confirmer pour affilier l'utilisateur à votre école."
            }
        />
    )
}

export { CreateUser }