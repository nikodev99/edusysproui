import FormContent from "../ui/form/FormContent.tsx";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import {Guardian} from "../../entity";
import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormUtils} from "../../core/utils/formUtils.ts";
import {FormConfig} from "../../config/FormConfig.ts";
import {InputTypeEnum, LinkToStudent} from "../../core/shared/sharedEnums.ts";
import {useMemo} from "react";
import {enumToObjectArray} from "../../core/utils/utils.ts";
import {text} from "../../core/utils/text_display.ts";

type GuardianFormProps<T extends FieldValues> = FormContentProps<T, Guardian> & {
    handleUpdate?: (field: keyof Guardian, value: unknown) => void
}

const GuardianForm = <T extends FieldValues>({control, edit, errors, enroll, data, handleUpdate}: GuardianFormProps<T>) => {

    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)
    const parent: string = 'student.guardian'

    const form = new FormConfig(errors, edit, enroll)

    const linkToStudentOptions = useMemo(() => enumToObjectArray(LinkToStudent, true), [])

    return(
        <>
            <FormContent formItems={[
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    md: onlyField,
                    lg: onlyField,
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
                    md: onlyField,
                    lg: onlyField,
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
                {
                    type: InputTypeEnum.SELECT,
                    inputProps: {
                        options: linkToStudentOptions,
                        name: form.name('linkToStudent', parent) as Path<T>,
                        label: 'Lien de parenté',
                        control: control,
                        required: false,
                        validateStatus: form.validate('linkToStudent', parent),
                        help: form.error('linkToStudent',parent),
                        placeholder: 'Sélectionner le lien de parenté entre le tuteur et ' + (text.student.label).toLowerCase(),
                        md: onlyField,
                        lg: onlyField,
                        hasForm: edit,
                        selectedValue: (edit && data ? data.linkToStudent : '') as PathValue<T, Path<T>>,
                        onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('linkToStudent', value) : undefined
                    }
                }
        ]} />
        </>
    )
}

export default GuardianForm
