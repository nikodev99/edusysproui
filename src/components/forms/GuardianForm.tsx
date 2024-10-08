import FormContent from "../ui/form/FormContent.tsx";
import {FormContentProps} from "../../utils/interfaces.ts";
import {Guardian} from "../../entity";
import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormUtils} from "../../utils/formUtils.ts";
import {FormConfig} from "../../config/FormConfig.ts";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {useMemo} from "react";
import {enumToObjectArray} from "../../utils/utils.ts";
import {Gender} from "../../entity/enums/gender.ts";
import {Status} from "../../entity/enums/status.ts";

type GuardianFormProps<T extends FieldValues> = FormContentProps<T, Guardian> & {
    showField?: boolean
    handleUpdate?: (field: keyof Guardian, value: unknown) => void
}

const GuardianForm = <T extends FieldValues>({control, edit, errors, enroll, data, showField, handleUpdate}: GuardianFormProps<T>) => {

    const genderOptions = useMemo(() => enumToObjectArray(Gender), [])
    const statusOptions = useMemo(() => enumToObjectArray(Status), [])
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)
    const parent: string = 'student.guardian'

    const form = new FormConfig(errors, edit, enroll)

    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    md: onlyField,
                    lg: onlyField,
                    label: 'Nom(s) du tuteur',
                    control: control,
                    name: form.name('lastName', parent),
                    required: true,
                    placeholder: 'Malonga',
                    validateStatus: form.validate('lastName', 'student.guardian'),
                    help: form.error('lastName', 'student.guardian'),
                    hasForm: edit,
                    defaultValue: (edit && data ? data.lastName : '') as PathValue<T, Path<T>>,
                    onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('lastName', value) : undefined
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    md: onlyField,
                    lg: onlyField,
                    label: 'Prénom(s) du tuteur',
                    control: control,
                    name: form.name('firstName', parent),
                    required: true,
                    placeholder: 'Patrick',
                    validateStatus: form.validate('firstName', parent),
                    help: form.error('firstName', parent),
                    hasForm: edit,
                    defaultValue: (edit && data ? data.firstName : '') as PathValue<T, Path<T>>,
                    onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('firstName', value) : undefined
                }
            },
            {
                type: InputTypeEnum.SELECT,
                inputProps: {
                    options: genderOptions,
                    name: form.name('gender', parent),
                    label: 'Genre',
                    control: control,
                    required: true,
                    validateStatus: form.validate('gender', parent),
                    help: form.error('gender', parent),
                    placeholder: 'Sélectionner le genre',
                    md: onlyField,
                    lg: onlyField,
                    hasForm: edit,
                    selectedValue: (edit && data ? data.gender : '') as PathValue<T, Path<T>>,
                    onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('gender', value) : undefined
                }
            },
            {
                type: InputTypeEnum.SELECT,
                inputProps: {
                    options: statusOptions,
                    name: form.name('status', parent),
                    label: 'Status Matrimonial',
                    control: control,
                    required: true,
                    validateStatus: form.validate('status', parent),
                    help: form.error('status', parent),
                    placeholder: 'Sélectionner le status matrimonial du tuteur',
                    md: onlyField,
                    lg: onlyField,
                    hasForm: edit,
                    selectedValue: (edit && data ? data.status : '') as PathValue<T, Path<T>>,
                    onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('status', value) : undefined
                }
            },
            ...(showField ? [
                {
                    type: InputTypeEnum.TEXT,
                    inputProps: {
                        md: onlyField,
                        lg: onlyField,
                        label: 'Nom(s) de jeune fille',
                        control: control,
                        name: form.name('maidenName', parent),
                        required: false,
                        placeholder: 'Mavouanga',
                        validateStatus: form.validate('maidenName', parent),
                        help: form.error('maidenName', parent),
                        hasForm: edit,
                        defaultValue: (edit && data ? data.maidenName : '') as PathValue<T, Path<T>>,
                        onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('maidenName', value) : undefined
                    }
                }
            ] : []),
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    md: onlyField,
                    lg: onlyField,
                    label: 'E-mail',
                    control: control,
                    name: form.name('emailId', parent),
                    required: false,
                    placeholder: 'p.malonga@gmail.com',
                    validateStatus: form.validate('emailId', parent),
                    help: form.error('emailId', parent),
                    hasForm: edit,
                    defaultValue: (edit && data ? data.emailId : '') as PathValue<T, Path<T>>,
                    onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('emailId', value) : undefined
                }
            },
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
                type: InputTypeEnum.TEXT,
                inputProps: {
                    md: onlyField,
                    lg: onlyField,
                    label: 'Téléphone',
                    control: control,
                    name: form.name('telephone', parent),
                    required: true,
                    placeholder: '060000000',
                    validateStatus: form.validate('telephone', parent),
                    help: form.error('telephone', parent),
                    hasForm: edit,
                    defaultValue: (edit && data ? data.telephone : '') as PathValue<T, Path<T>>,
                    onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('telephone', value) : undefined
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    md: onlyField,
                    lg: onlyField,
                    label: 'Mobile',
                    control: control,
                    name: form.name('mobile', parent),
                    required: false,
                    placeholder: '060000000',
                    validateStatus: form.validate('mobile', parent),
                    help: form.error('mobile', parent),
                    hasForm: edit,
                    defaultValue: (edit && data ? data.telephone : '') as PathValue<T, Path<T>>,
                    onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('mobile', value) : undefined
                }
            }
        ]} />
    )
}

export default GuardianForm
