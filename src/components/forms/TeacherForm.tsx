import {useMemo} from "react";
import {enumToObjectArray} from "../../utils/utils.ts";
import {Gender} from "../../entity/enums/gender.ts";
import {Status} from "../../entity/enums/status.ts";
import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormContentProps} from "../../utils/interfaces.ts";
import {Teacher} from "../../entity";
import {FormUtils} from "../../utils/formUtils.ts";
import {FormConfig} from "../../config/FormConfig.ts";
import FormContent from "../ui/form/FormContent.tsx";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";

type TeacherFormProps<T extends FieldValues> = FormContentProps<T, Teacher> & {
    showField?: boolean
    handleUpdate?: (field: keyof Teacher, value: unknown) => void
}

const TeacherForm = <T extends FieldValues>(
    {edit, errors, control, data, handleUpdate, showField}: TeacherFormProps<T>
) => {
    const genderOptions = useMemo(() => enumToObjectArray(Gender), [])
    const statusOptions = useMemo(() => enumToObjectArray(Status), [])
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)

    const form = new FormConfig(errors, edit)

    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    md: onlyField,
                    lg: onlyField,
                    label: 'Nom(s)',
                    control: control,
                    name: form.name('lastName'),
                    required: true,
                    placeholder: 'Malonga',
                    validateStatus: form.validate('lastName'),
                    help: form.error('lastName'),
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
                    label: 'Prénom(s)',
                    control: control,
                    name: form.name('firstName'),
                    required: true,
                    placeholder: 'Patrick',
                    validateStatus: form.validate('firstName'),
                    help: form.error('firstName'),
                    hasForm: edit,
                    defaultValue: (edit && data ? data.firstName : '') as PathValue<T, Path<T>>,
                    onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('firstName', value) : undefined
                }
            },
            {
                type: InputTypeEnum.SELECT,
                inputProps: {
                    options: genderOptions,
                    name: form.name('gender'),
                    label: 'Genre',
                    control: control,
                    required: true,
                    validateStatus: form.validate('gender'),
                    help: form.error('gender'),
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
                    name: form.name('status'),
                    label: 'Status Matrimonial',
                    control: control,
                    required: true,
                    validateStatus: form.validate('status'),
                    help: form.error('status'),
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
                        name: form.name('maidenName'),
                        required: false,
                        placeholder: 'Mavouanga',
                        validateStatus: form.validate('maidenName'),
                        help: form.error('maidenName'),
                        hasForm: edit,
                        defaultValue: (edit && data ? data.maidenName : '') as PathValue<T, Path<T>>,
                        onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('maidenName', value) : undefined
                    }
                }
            ] : []),
            {
                type: InputTypeEnum.DATE,
                inputProps: {
                    control: control,
                    name: form.name('birthDate') as Path<T>,
                    label: 'Date de Naissance',
                    required: true,
                    validateStatus: form.validate('birthDate'),
                    help: form.error('birthDate'),
                    defaultValue: (edit && data ? data.birthDate : '') as PathValue<T, Path<T>>,
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('birthDate', value) : undefined
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    md: onlyField,
                    lg: onlyField,
                    label: 'Ville de Naissance',
                    control: control,
                    name: form.name('cityOfBirth'),
                    required: true,
                    placeholder: 'Brazzaville',
                    validateStatus: form.validate('cityOfBirth'),
                    help: form.error('cityOfBirth'),
                    hasForm: edit,
                    defaultValue: (edit && data ? data.cityOfBirth : '') as PathValue<T, Path<T>>,
                    onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('cityOfBirth', value) : undefined
                }
            },
            {
                type: InputTypeEnum.COUNTRY,
                inputProps: {
                    showSearch: true,
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    label: 'Nationalité',
                    control: control,
                    name: form.name('nationality') as Path<T>,
                    required: true,
                    selectedValue: (edit && data ? data.nationality : '') as PathValue<T, Path<T>>,
                    validateStatus: form.validate('nationality'),
                    help: form.error('nationality'),
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('nationality', value) : undefined
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    md: onlyField,
                    lg: onlyField,
                    label: 'E-mail',
                    control: control,
                    name: form.name('emailId'),
                    required: true,
                    placeholder: 'p.malonga@gmail.com',
                    validateStatus: form.validate('emailId'),
                    help: form.error('emailId'),
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
                    label: 'Téléphone',
                    control: control,
                    name: form.name('telephone'),
                    required: true,
                    placeholder: '060000000',
                    validateStatus: form.validate('telephone'),
                    help: form.error('telephone'),
                    hasForm: edit,
                    defaultValue: (edit && data ? data.telephone : '') as PathValue<T, Path<T>>,
                    onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('telephone', value) : undefined
                }
            },
            ...(edit ? [{
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
            }] : []),
        ...(edit ? [{
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
            }] : [])
        ]} />
    )
}

export { TeacherForm }