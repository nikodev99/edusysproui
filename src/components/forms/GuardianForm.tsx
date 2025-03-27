import FormContent from "../ui/form/FormContent.tsx";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import {Guardian} from "../../entity";
import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormUtils} from "../../core/utils/formUtils.ts";
import {FormConfig} from "../../config/FormConfig.ts";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";

type GuardianFormProps<T extends FieldValues> = FormContentProps<T, Guardian> & {
    handleUpdate?: (field: keyof Guardian, value: unknown) => void
}

const GuardianForm = <T extends FieldValues>({control, edit, errors, enroll, data, handleUpdate}: GuardianFormProps<T>) => {

    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)
    const parent: string = 'student.guardian'

    const form = new FormConfig(errors, edit, enroll)

    return(
        <>
            <FormContent formItems={[
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    md: edit ? onlyField : 12,
                    lg: edit ? onlyField : 12,
                    label: 'Employeur',
                    control: control,
                    name: form.name('company', parent),
                    required: false,
                    placeholder: 'Total Energie',
                    validateStatus: form.validate('company', parent),
                    help: form.error('company', parent),
                    hasForm: edit,
                    defaultValue: (edit && data ? data.company : '') as PathValue<T, Path<T>>,
                    onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('company', value) : undefined
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    md: edit ? onlyField : 12,
                    lg: edit ? onlyField : 12,
                    label: 'Poste',
                    control: control,
                    name: form.name('jobTitle', parent),
                    required: false,
                    placeholder: 'Opérateur de maintenance',
                    validateStatus: form.validate('jobTitle', parent),
                    help: form.error('jobTitle', parent),
                    hasForm: edit,
                    defaultValue: (edit && data ? data.jobTitle : '') as PathValue<T, Path<T>>,
                    onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('jobTitle', value) : undefined
                }
            },
        ]} />
        </>
    )
}

export default GuardianForm
