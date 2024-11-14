import {FormContentProps} from "../../utils/interfaces.ts";
import {Individual as PersonalInfo} from "../../entity/domain/individual.ts";
import {FieldValues, Path, PathValue} from "react-hook-form";
import {IndividualType, InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {FormUtils} from "../../utils/formUtils.ts";
import {useMemo} from "react";
import {enumToObjectArray} from "../../utils/utils.ts";
import {Gender} from "../../entity/enums/gender.ts";
import FormContent from "../ui/form/FormContent.tsx";
import {FormConfig} from "../../config/FormConfig.ts";
import {Status} from "../../entity/enums/status.ts";

type IndividualProps<T extends FieldValues, Q extends object> = FormContentProps<T, PersonalInfo> & {
    type: IndividualType
    handleUpdate?: (field: keyof Q | keyof PersonalInfo, value: unknown) => Promise<void>
}

const IndividualForm = <T extends FieldValues, Q extends object>(individualProps: IndividualProps<T, Q>) => {

    const genderOptions = useMemo(() => enumToObjectArray(Gender), [])
    const statusOptions = useMemo(() => enumToObjectArray(Status), [])

    const {edit, data, control, errors, enroll, type, showField, handleUpdate} = individualProps
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)
    const form = new FormConfig(errors, edit, enroll)

    const get = (type: IndividualType, fieldName: string) => {
        switch (type) {
            case IndividualType.STUDENT:
                return {
                    name: form.name(fieldName, 'student.personalInfo'),
                    validate: form.validate(fieldName, 'student.personalInfo'),
                    error: form.error(fieldName, 'student.personalInfo'),
                }
            case IndividualType.TEACHER:
                return {
                    name: form.name(fieldName, 'teacher.personalInfo'),
                    validate: form.validate(fieldName, 'teacher.personalInfo'),
                    error: form.error(fieldName, 'teacher.personalInfo'),
                }
            case IndividualType.GUARDIAN:
                return {
                    name: form.name(fieldName, 'student.guardian.personalInfo'),
                    validate: form.validate(fieldName, 'student.guardian.personalInfo'),
                    error: form.error(fieldName, 'student.guardian.personalInfo'),
                }
            default:
                return null
        }
    }

    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    label: 'Nom(s) de Famille',
                    control: control,
                    name: get(type,'lastName')?.name as Path<T>,
                    required: true,
                    defaultValue: (edit && data ? data.lastName : '') as PathValue<T, Path<T>>,
                    placeholder: 'Malonga',
                    validateStatus: get(type,'lastName')?.validate,
                    help: get(type, 'lastName')?.error,
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('lastName', value) : undefined
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    md: onlyField,
                    lg: onlyField,
                    hasForm: edit,
                    label: 'Prénom(s)',
                    control: control,
                    name: get(type, 'firstName')?.name as Path<T>,
                    required: true,
                    defaultValue: (edit && data ? data.firstName : '') as PathValue<T, Path<T>>,
                    placeholder: 'Patrick',
                    validateStatus: get(type, 'firstName')?.validate,
                    help: get(type,'firstName')?.error,
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('firstName', value) : undefined
                }
            },
            {
                type: InputTypeEnum.SELECT,
                inputProps: {
                    options: genderOptions,
                    name: get(type, 'gender')?.name as Path<T>,
                    label: 'Genre',
                    control: control,
                    required: true,
                    validateStatus: get(type, 'gender')?.validate,
                    help: get(type,'gender')?.error,
                    placeholder: 'Sélectionner le genre',
                    md: onlyField,
                    lg: onlyField,
                    hasForm: edit,
                    selectedValue: (edit && data ? data.gender : '') as PathValue<T, Path<T>>,
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('gender', value) : undefined
                }
            },
            ...(type !== IndividualType.STUDENT ? [
                {
                    type: InputTypeEnum.SELECT,
                    inputProps: {
                        options: statusOptions,
                        name: get(type, 'status')?.name as Path<T>,
                        label: 'Status Matrimonial',
                        control: control,
                        required: true,
                        validateStatus: get(type, 'status')?.validate,
                        help: get(type, 'status')?.error,
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
                            name: get(type, 'maidenName')?.name as Path<T>,
                            required: false,
                            placeholder: 'Mavouanga',
                            validateStatus: get(type, 'maidenName')?.validate,
                            help: get(type, 'maidenName')?.error,
                            hasForm: edit,
                            defaultValue: (edit && data ? data.maidenName : '') as PathValue<T, Path<T>>,
                            onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('maidenName', value) : undefined
                        }
                    }
                ] : [])
            ] : []),
            ...(type !== IndividualType.GUARDIAN ? [
                {
                    type: InputTypeEnum.DATE,
                    inputProps: {
                        control: control,
                        name: get(type, 'birthDate')?.name as Path<T>,
                        label: 'Date de Naissance',
                        required: true,
                        validateStatus: get(type, 'birthDate')?.validate,
                        help: get(type,'birthDate')?.error,
                        defaultValue: (edit && data ? data.birthDate : '') as PathValue<T, Path<T>>,
                        hasForm: edit,
                        md: onlyField,
                        lg: onlyField,
                        onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('birthDate', value) : undefined
                    }
                },
                {
                    type: InputTypeEnum.TEXT,
                    inputProps: {
                        hasForm: edit,
                        md: onlyField,
                        lg: onlyField,
                        label: 'Lieux de Naissance',
                        control: control,
                        name: get(type, 'birthCity')?.name as Path<T>,
                        required: true,
                        defaultValue: (edit && data ? data.birthCity : '') as PathValue<T, Path<T>>,
                        placeholder: 'Brazzaville',
                        validateStatus: get(type, 'birthCity')?.validate,
                        help: get(type,'birthCity')?.error,
                        onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('birthCity', value) : undefined
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
                        name: get(type, 'nationality')?.name as Path<T>,
                        required: true,
                        selectedValue: (edit && data ? data.nationality : '') as PathValue<T, Path<T>>,
                        validateStatus: get(type,'nationality')?.validate,
                        help: get(type,'nationality')?.error,
                        onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('nationality', value) : undefined
                    }
                }
            ] : []),
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    label: 'E-mail',
                    control: control,
                    name: get(type, 'emailId')?.name as Path<T>,
                    defaultValue: (edit && data ? data.emailId : '') as PathValue<T, Path<T>>,
                    placeholder: 'p.malonga@gmail.com',
                    validateStatus: get(type,'emailId')?.validate,
                    help: get(type,'emailId')?.error,
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('emailId', value) : undefined
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    label: 'Téléphone',
                    required: type !== IndividualType.STUDENT,
                    control: control,
                    name: get(type, 'telephone')?.name as Path<T>,
                    defaultValue: (edit && data ? data.telephone : '') as PathValue<T, Path<T>>,
                    placeholder: '060000000',
                    validateStatus: get(type,'telephone')?.validate,
                    help: get(type,'telephone')?.error,
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('telephone', value) : undefined
                }
            },
            ...(type !== IndividualType.STUDENT ? [{
                type: InputTypeEnum.TEXT,
                inputProps: {
                    md: onlyField,
                    lg: onlyField,
                    label: 'Mobile',
                    control: control,
                    name: get(type, 'mobile')?.name as Path<T>,
                    required: false,
                    placeholder: '060000000',
                    validateStatus: get(type, 'mobile')?.validate,
                    help: get(type, 'mobile')?.error,
                    hasForm: edit,
                    defaultValue: (edit && data ? data.mobile : '') as PathValue<T, Path<T>>,
                    onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('mobile', value) : undefined
                }
            }] : [])
        ]} />
    )
}

export { IndividualForm }