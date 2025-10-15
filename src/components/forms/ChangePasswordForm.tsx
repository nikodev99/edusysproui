import {FieldValues, Path} from "react-hook-form";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import {ChangePasswordRequest} from "../../auth/dto/user.ts";
import {FormConfig} from "../../config/FormConfig.ts";
import FormContent from "../ui/form/FormContent.tsx";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";

export const ChangePasswordForm = <T extends FieldValues>(
    {control, errors, edit = false}: FormContentProps<T, ChangePasswordRequest>
) => {
    const form = new FormConfig(errors, edit)

    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.PASSWORD,
                inputProps: {
                    lg: 24,
                    md: 24,
                    label: 'Ancien mot de passe',
                    control: control,
                    name: 'oldPassword' as Path<T>,
                    required: true,
                    placeholder: '*********',
                    validateStatus: form.validate('oldPassword'),
                    help: form.error('oldPassword')
                }
            },
            {
                type: InputTypeEnum.PASSWORD,
                inputProps: {
                    lg: 24,
                    md: 24,
                    label: 'Nouveau mot de passe',
                    control: control,
                    name: 'newPassword' as Path<T>,
                    required: true,
                    placeholder: '*********',
                    validateStatus: form.validate('newPassword'),
                    help: form.error('newPassword')
                }
            }
        ]} />
    )
}