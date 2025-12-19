import {FormContentProps} from "@/core/utils/interfaces.ts";
import {Enrollment, Reprimand} from "@/entity";
import FormContent from "@/components/ui/form/FormContent.tsx";
import {FormUtils} from "@/core/utils/formUtils.ts";
import {FormConfig} from "@/config/FormConfig.ts";
import {InputTypeEnum} from "@/core/shared/sharedEnums.ts";
import {Path, PathValue} from "react-hook-form";
import {ReprimandSchema} from "@/schema";
import {useAcademicYearRepo} from "@/hooks/actions/useAcademicYearRepo.ts";
import {enumToObjectArray, setName} from "@/core/utils/utils.ts";
import {text} from "@/core/utils/text_display.ts";
import Datetime from "@/core/datetime.ts";
import {ReprimandType} from "@/entity/enums/reprimandType.ts";
import {loggedUser} from "@/auth/jwt/LoggedUser.ts";

type ReprimandFormProps = FormContentProps<ReprimandSchema, Reprimand> & {
    handleUpdate?: (field: keyof ReprimandSchema, value: unknown) => void,
    reprimandee: Enrollment
}

const user = loggedUser.getUser()

console.log({user})

export const ReprimandForm = <T extends object>(
    {errors, control, edit, data, handleUpdate, reprimandee}: ReprimandFormProps<T>
) => {
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)
    const form = new FormConfig(errors, true)

    const {academicYearOptions} = useAcademicYearRepo()
    const classe = reprimandee?.classe
    const student = reprimandee?.student?.personalInfo
    const recentDate = Datetime.now().UNIX

    const currentAcademicYearOptions = academicYearOptions(true)
    const typeOptions = enumToObjectArray(ReprimandType)

    return <FormContent formItems={[
        {
            type: InputTypeEnum.SELECT,
            inputProps: {
                hasForm: edit,
                control: control,
                name: form.name('academicYear') as Path<T>,
                label: 'Année Académique',
                lg: onlyField,
                md: onlyField,
                required: true,
                disabled: true,
                selectedValue: currentAcademicYearOptions[0].value,
                placeholder: "Choisissez l'année académique",
                options: currentAcademicYearOptions,
                validateStatus: form.validate('id', 'academicYear'),
                help: form.error('id', 'academicYear'),
                defaultValue: (data ? data.academicYear.id : undefined) as PathValue<T, Path<T>>,
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('academicYear.id', value) : undefined,
            }
        },
        {
            type: InputTypeEnum.SELECT,
            inputProps: {
                hasForm: edit,
                control: control,
                name: form.name('classe') as Path<T>,
                label: 'Classe',
                lg: onlyField,
                md: onlyField,
                required: true,
                disabled: true,
                selectedValue: classe?.id,
                placeholder: "Choisissez la classe",
                options: [
                    {value: classe?.id, label: classe?.name}
                ],
                validateStatus: form.validate('id', 'classe'),
                help: form.error('id', 'classe'),
                defaultValue: (data ? data.classe.id : undefined) as PathValue<T, Path<T>>,
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('classe.id', value) : undefined,
            }
        },
        {
            type: InputTypeEnum.SELECT,
            inputProps: {
                hasForm: edit,
                control: control,
                name: form.name('student') as Path<T>,
                label: `${text.student.label} Réprimandé`,
                lg: onlyField,
                md: onlyField,
                required: true,
                disabled: true,
                selectedValue: reprimandee?.id,
                placeholder: "Choisissez l'élève réprimandé",
                options: [
                    {value: reprimandee?.id, label: setName(student)}
                ],
                validateStatus: form.validate('id', 'student'),
                help: form.error('id', 'student'),
                defaultValue: (data ? data.academicYear.id : undefined) as PathValue<T, Path<T>>,
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('student.id', value) : undefined,
            }
        },
        {
            type: InputTypeEnum.SELECT,
            inputProps: {
                hasForm: edit,
                control: control,
                name: form.name('reprimandDate') as Path<T>,
                label: 'Date de la réprimande',
                lg: onlyField,
                md: onlyField,
                required: true,
                disabled: true,
                selectedValue: recentDate,
                placeholder: "Choisissez l'année académique",
                options: [
                    {value: recentDate, label: Datetime.now().fDatetime()}
                ],
                validateStatus: form.validate('reprimandDate'),
                help: form.error('reprimandDate'),
                defaultValue: (data ? data.reprimandDate : undefined) as PathValue<T, Path<T>>,
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('reprimandDate', value) : undefined,
            }
        },
        {
            type: InputTypeEnum.SELECT,
            inputProps: {
                hasForm: edit,
                control: control,
                name: form.name('type') as Path<T>,
                label: 'Type de reprimande',
                lg: onlyField,
                md: onlyField,
                required: true,
                placeholder: "Choisissez le type de réprimande",
                options: typeOptions,
                validateStatus: form.validate('type'),
                help: form.error('type'),
                defaultValue: (data ? data.type : undefined) as PathValue<T, Path<T>>,
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('type', value) : undefined,
            }
        },
        {
            type: InputTypeEnum.SELECT,
            inputProps: {
                hasForm: edit,
                control: control,
                name: form.name('issuedBy') as Path<T>,
                label: 'L’autorité ayant prononcé la réprimande',
                lg: onlyField,
                md: onlyField,
                required: true,
                disabled: true,
                placeholder: "Choisissez l'autorité'",
                options: [
                    {}
                ],
                validateStatus: form.validate('type'),
                help: form.error('type'),
                defaultValue: (data ? data.type : undefined) as PathValue<T, Path<T>>,
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('type', value) : undefined,
            }
        },
    ]} />
}