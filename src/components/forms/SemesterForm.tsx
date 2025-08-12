import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import {Semester} from "../../entity";
import FormContent from "../ui/form/FormContent.tsx";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {FormConfig} from "../../config/FormConfig.ts";
import {FormUtils} from "../../core/utils/formUtils.ts";

export const SemesterForm = <T extends FieldValues>(
    {control, errors, edit, data, handleUpdate, parent, enroll = true}: FormContentProps<T, Semester> & {
        handleUpdate?: (field: keyof Semester, value: unknown) => void,
        parent?: string
    }
) => {
    const form = new FormConfig(errors, edit, enroll)
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)
    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.DATE,
                inputProps: {
                    type: 'date',
                    md: onlyField ?? 12,
                    lg: onlyField ?? 12,
                    control: control,
                    label: 'Date de début',
                    placeholder: '10/10/2025',
                    required: true,
                    name: form.name('startDate', parent),
                    validateStatus: form.validate('startDate', parent),
                    help: form.error('startDate', parent),
                    defaultValue: (edit && data ? data?.startDate : undefined) as PathValue<T, Path<T>>,
                    onFinish: edit ? (value) => handleUpdate?.('startDate', value): undefined
                }
            },
            {
                type: InputTypeEnum.DATE,
                inputProps: {
                    md: onlyField ?? 12,
                    lg: onlyField ?? 12,
                    control: control,
                    label: 'Date de fin',
                    placeholder: '10/10/2025',
                    required: true,
                    name: form.name('endDate', parent),
                    validateStatus: form.validate('endDate', parent),
                    help: form.error('endDate', parent),
                    defaultValue: (edit && data ? data?.endDate : undefined) as PathValue<T, Path<T>>,
                    onFinish: edit ? (value) => handleUpdate?.('endDate', value) : undefined
                }
            }
        ]} />
    )
}