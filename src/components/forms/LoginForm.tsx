import FormContent from "../ui/form/FormContent.tsx";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import {LoginRequest} from "../../auth/dto/user.ts";
import {Path} from "react-hook-form";
import {FormConfig} from "../../config/FormConfig.ts";

export const LoginForm = <T extends object>({control, errors}: FormContentProps<T, LoginRequest>) => {

    const form = new FormConfig(errors, false, false)

    return <FormContent formItems={[
        {
            type: InputTypeEnum.TEXT,
            inputProps: {
                lg: 24,
                md: 24,
                name: 'username' as Path<T>,
                placeholder: "Entrer le Username, Numero de téléphone ou Email",
                label: "Nom d'utilisateur",
                control: control,
                required: true,
                validateStatus: form.validate('username'),
                help: form.error('username'),
            }
        },
        {
            type: InputTypeEnum.PASSWORD,
            inputProps: {
                lg: 24,
                md: 24,
                name: 'password' as Path<T>,
                placeholder: "******",
                label: "Mot de passe",
                control: control,
                required: true,
                validateStatus: form.validate('password'),
                help: form.error('password'),
            }
        }
    ]} />
}