import {InsertModal} from "../custom/InsertSchema.tsx";
import {useForm} from "react-hook-form";
import {signupSchema, SignupSchema} from "../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {UserAccountForm} from "../forms/UserAccountForm.tsx";
import {useAuth} from "../../hooks/useAuth.ts";
import {Individual} from "../../entity";
import {UserType} from "../../auth/dto/user.ts";
import {useEffect} from "react";
import {loggedUser} from "../../auth/jwt/LoggedUser.ts";

type CreateUserProps = {
    open?: boolean,
    onCancel?: () => void
    personalInfo?: Individual
    userType: UserType
    resp?: (resp: { updated: boolean }) => void
}

const CreateUser = ({open, onCancel, personalInfo, userType}: CreateUserProps) => {
    const form = useForm<SignupSchema>({
        resolver: zodResolver(signupSchema)
    })

    const {setValue, control, formState: {errors}, watch} = form
    
    const {registerUser} = useAuth()

    useEffect(() => {
        setValue('userType', userType)
    }, [setValue, userType]);

    console.log('DATA ENTERED: ', watch())
    
    const createUser = async (data: SignupSchema) => {
        if (form.formState.submitCount <= 0) {
            if (personalInfo) {
                const registerData = {
                    ...data,
                    email: personalInfo.emailId,
                    phoneNumber: personalInfo.telephone,
                    personalInfoId: personalInfo.id as number,
                    roles: {...data.roles, schoolId: loggedUser.getSchool()?.id}
                };

                console.log('registerData ', registerData)
                return await registerUser(registerData as SignupSchema);
            }
            return await registerUser(data);
        }
    }

    return(
        <InsertModal
            data={signupSchema}
            customForm={
                <UserAccountForm
                    control={control}
                    errors={errors}
                />
            }
            handleForm={form}
            postFunc={createUser as never}
            open={open}
            onCancel={onCancel}
            messageSuccess={"Nouveau compte utilisateur créer avec succès"}
            title={"Créer un compte utilisateur pour "}
            okText={"Créer le compte"}
            description={"Veuillez confirmer votre pour créer le nouveau compte utilisateur."}
        />
    )
}

export {CreateUser}