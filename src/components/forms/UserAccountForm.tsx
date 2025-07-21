import FormContent from "../ui/form/FormContent.tsx";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {FormConfig} from "../../config/FormConfig.ts";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import {SignupRequest} from "../../auth/dto/user.ts";
import {useMemo} from "react";
import {enumToObjectArray} from "../../core/utils/utils.ts";
import {RoleEnum} from "../../auth/dto/role.ts";

export const UserAccountForm = <T extends object>({control, errors}: FormContentProps<T, SignupRequest>) => {
    const form = new FormConfig(errors, false)
    const roleOptions = useMemo(() => enumToObjectArray(RoleEnum, true), [])

    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    md: 12,
                    lg: 12,
                    label: 'Identifiant',
                    control: control,
                    name: form.name('username'),
                    required: true,
                    placeholder: 'Donnez un identifiant au nouveau compte compte',
                    validateStatus: form.validate('username'),
                    help: form.error('username'),
                    hasForm: false,
                }
            },
            {
                type: InputTypeEnum.PASSWORD,
                inputProps: {
                    md: 12,
                    lg: 12,
                    label: 'Mot de passe',
                    control: control,
                    name: form.name('password'),
                    required: true,
                    placeholder: 'Donnez un mot de passe au nouveau compte',
                    validateStatus: form.validate('password'),
                    help: form.error('password'),
                    hasForm: false,
                }
            },
            {
                type: InputTypeEnum.PASSWORD,
                inputProps: {
                    md: 12,
                    lg: 12,
                    label: 'Confirmer le mot de passe Mot de passe',
                    control: control,
                    name: form.name('passwordConfirm'),
                    required: true,
                    placeholder: 'Donnez un mot de passe au nouveau compte',
                    validateStatus: form.validate('passwordConfirm'),
                    help: form.error('passwordConfirm'),
                    hasForm: false,
                }
            },
            {
                type: InputTypeEnum.SELECT,
                inputProps: {
                    md: 12,
                    lg: 12,
                    label: 'Roles',
                    control: control,
                    name: form.name('roles', 'roles'),
                    required: true,
                    options: roleOptions,
                    placeholder: 'Donnez un mot de passe au nouveau compte',
                    validateStatus: form.validate('roles', 'roles'),
                    help: form.error('roles', 'roles'),
                    hasForm: false,
                    mode: 'multiple'
                }
            }
        ]} />
    )
}