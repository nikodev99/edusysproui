import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormContentProps} from "../../utils/interfaces.ts";
import {Teacher} from "../../entity";
import {FormUtils} from "../../utils/formUtils.ts";
import {FormConfig} from "../../config/FormConfig.ts";
import FormContent from "../ui/form/FormContent.tsx";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";

type TeacherFormProps<T extends FieldValues> = FormContentProps<T, Teacher> & {
    handleUpdate?: (field: keyof Teacher, value: unknown) => void
}

const TeacherForm = <T extends FieldValues>(
    {edit, errors, control, data, handleUpdate}: TeacherFormProps<T>
) => {
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)

    const form = new FormConfig(errors, edit)

    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.DATE,
                inputProps: {
                    control: control,
                    name: form.name('hireDate') as Path<T>,
                    label: 'Date d\'embauche',
                    required: false,
                    validateStatus: form.validate('hireDate'),
                    help: form.error('hireDate'),
                    defaultValue: (edit && data ? data.hireDate : '') as PathValue<T, Path<T>>,
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('hireDate', value) : undefined
                }
            },
            {
                type: InputTypeEnum.NUMBER,
                inputProps: {
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    label: 'Salaire par heure',
                    control: control,
                    name: form.name('salaryByHour') as Path<T>,
                    required: true,
                    defaultValue: (edit && data ? data.salaryByHour : '') as PathValue<T, Path<T>>,
                    placeholder: '1500',
                    validateStatus: form.validate('salaryByHour') as 'error',
                    help: form.error('salaryByHour'),
                    onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('salaryByHour', value) : undefined,
                    addonAfter: 'FCFA'
                }
            }
        ]} />
    )
}

export { TeacherForm }