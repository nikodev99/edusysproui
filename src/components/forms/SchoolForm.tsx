import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import {School} from "../../entity";
import FormContent from "../ui/form/FormContent.tsx";
import {FormConfig} from "../../config/FormConfig.ts";
import {FormUtils} from "../../core/utils/formUtils.ts";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";

type SchoolFormProps<T extends FieldValues> = FormContentProps<T, School> & {
    handleUpdate?: (field: keyof School, value: unknown) => void;
}

export const SchoolForm = <T extends FieldValues>(
    {edit, data, control, errors, handleUpdate}: SchoolFormProps<T>
) => {
    const form = new FormConfig(errors, edit)
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)

    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    label: "Nom de l'établissement",
                    control: control,
                    name: form.name('name') as Path<T>,
                    required: true,
                    defaultValue: (edit ? data?.name : undefined) as PathValue<T, Path<T>>,
                    placeholder: "Entrez le nom de l'établissement",
                    validateStatus: form.validate('name'),
                    help: form.error('name'),
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('name', value) : undefined
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    label: "Abréviation de l'établissement",
                    control: control,
                    name: form.name('abbr') as Path<T>,
                    required: true,
                    defaultValue: (edit ? data?.abbr : undefined) as PathValue<T, Path<T>>,
                    placeholder: "Entrez abréviation de l'établissement",
                    validateStatus: form.validate('abbr'),
                    help: form.error('abbr'),
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('abbr', value) : undefined
                }
            },
            {
                type: InputTypeEnum.DATE,
                inputProps: {
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    label: "Date de création",
                    control: control,
                    name: form.name('foundedDate') as Path<T>,
                    required: true,
                    defaultValue: (edit ? data?.foundedDate : undefined) as PathValue<T, Path<T>>,
                    placeholder: "Entrer la date de création",
                    validateStatus: form.validate('foundedDate'),
                    help: form.error('foundedDate'),
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('foundedDate', value) : undefined
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    label: "Email de contact",
                    control: control,
                    name: form.name('contactEmail') as Path<T>,
                    required: true,
                    defaultValue: (edit ? data?.contactEmail : undefined) as PathValue<T, Path<T>>,
                    placeholder: "Entrer email de contact",
                    validateStatus: form.validate('contactEmail'),
                    help: form.error('contactEmail'),
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('contactEmail', value) : undefined
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    label: "Numéro de téléphone",
                    control: control,
                    name: form.name('phoneNumber') as Path<T>,
                    required: true,
                    defaultValue: (edit ? data?.phoneNumber : undefined) as PathValue<T, Path<T>>,
                    placeholder: "Entrer email de contact",
                    validateStatus: form.validate('phoneNumber'),
                    help: form.error('phoneNumber'),
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('phoneNumber', value) : undefined
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    label: "Site Web",
                    control: control,
                    name: form.name('websiteURL') as Path<T>,
                    required: false,
                    defaultValue: (edit ? data?.websiteURL : undefined) as PathValue<T, Path<T>>,
                    placeholder: "Entrez votre site web",
                    validateStatus: form.validate('websiteURL'),
                    help: form.error('websiteURL'),
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('websiteURL', value) : undefined
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    label: "Accréditation",
                    control: control,
                    name: form.name('accreditationCode') as Path<T>,
                    required: false,
                    defaultValue: (edit ? data?.accreditationCode : undefined) as PathValue<T, Path<T>>,
                    placeholder: "Entrez le code de votre accréditation",
                    validateStatus: form.validate('accreditationCode'),
                    help: form.error('accreditationCode'),
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('accreditationCode', value) : undefined
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    label: "Numéro de l'accréditation",
                    control: control,
                    name: form.name('accreditationNumber') as Path<T>,
                    required: false,
                    defaultValue: (edit ? data?.accreditationNumber : undefined) as PathValue<T, Path<T>>,
                    placeholder: "Entrer le numéro de votre accréditation",
                    validateStatus: form.validate('accreditationNumber'),
                    help: form.error('accreditationNumber'),
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('accreditationNumber', value) : undefined
                }
            },
        ]} />
    )
}
