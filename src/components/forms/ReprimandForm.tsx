import {FormContentProps} from "@/core/utils/interfaces.ts";
import {Enrollment, Individual, Reprimand} from "@/entity";
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
import {useAuth} from "@/hooks/useAuth.ts";

type ReprimandFormProps<T extends object> = FormContentProps<T, Reprimand> & {
    handleUpdate?: (field: keyof ReprimandSchema, value: unknown) => void,
    reprimandee: Enrollment
}

export const ReprimandForm = <T extends object>(
    {errors, control, edit, data, handleUpdate, reprimandee}: ReprimandFormProps<T>
) => {
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)
    const form = new FormConfig(errors, edit, true)
    const {user} = useAuth()

    const {academicYearOptions} = useAcademicYearRepo()
    const classe = reprimandee?.classe
    const student = reprimandee?.student?.personalInfo

    const currentAcademicYearOptions = academicYearOptions(true)
    const typeOptions = enumToObjectArray(ReprimandType, true)

    return <FormContent formItems={[
        {
            type: InputTypeEnum.SELECT,
            inputProps: {
                hasForm: edit,
                control: control,
                name:'student.academicYear.id' as Path<T>,
                label: 'Année Académique',
                lg: onlyField,
                md: onlyField,
                required: true,
                disabled: true,
                placeholder: "Choisissez l'année académique",
                options: currentAcademicYearOptions,
                validateStatus: form.validate('id', 'student.academicYear'),
                help: form.error('id', 'student.academicYear'),
                defaultValue: (data ? data.student.academicYear.id : currentAcademicYearOptions[0].value) as PathValue<T, Path<T>>,
            }
        },
        {
            type: InputTypeEnum.SELECT,
            inputProps: {
                hasForm: edit,
                control: control,
                name: 'student.classe.id' as Path<T>,
                label: 'Classe',
                lg: onlyField,
                md: onlyField,
                required: true,
                disabled: true,
                placeholder: "Choisissez la classe",
                options: [
                    {value: classe?.id, label: classe?.name}
                ],
                validateStatus: form.validate('id', 'student.classe'),
                help: form.error('id', 'student.classe'),
                defaultValue: (data ? data.student.classe.id : classe?.id) as PathValue<T, Path<T>>,
            }
        },
        {
            type: InputTypeEnum.SELECT,
            inputProps: {
                hasForm: edit,
                control: control,
                name: 'student.id' as Path<T>,
                label: `${text.student.label} Réprimandé`,
                lg: onlyField,
                md: onlyField,
                required: true,
                disabled: true,
                placeholder: "Choisissez l'élève réprimandé",
                options: [
                    {value: reprimandee?.id, label: setName(student)}
                ],
                validateStatus: form.validate('id', 'student'),
                help: form.error('id', 'student'),
                defaultValue: (data ? data.student.id : reprimandee?.id) as PathValue<T, Path<T>>,
            }
        },
        {
            type: InputTypeEnum.DATE,
            inputProps: {
                hasForm: edit,
                control: control,
                name: form.name('reprimandDate') as Path<T>,
                label: 'Date de la réprimande',
                lg: onlyField,
                md: onlyField,
                required: true,
                showTime: true,
                format: "DD/MM/YYYY HH:mm",
                placeholder: "Choisissez l'année académique",
                validateStatus: form.validate('reprimandDate'),
                help: form.error('reprimandDate'),
                defaultValue: (data ? data.reprimandDate : Datetime.now().toDayjs()) as PathValue<T, Path<T>>,
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('reprimandDate', value) : undefined,
            }
        },
        {
            type: InputTypeEnum.SELECT,
            inputProps: {
                hasForm: edit,
                control: control,
                name: 'type' as Path<T>,
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
                name: 'issuedBy.id' as Path<T>,
                label: 'Réprimandé par',
                lg: onlyField,
                md: onlyField,
                required: true,
                disabled: true,
                placeholder: "Choisissez l'autorité",
                options: [
                    {value: user?.personalInfo, label: setName({
                            firstName: user?.firstName,
                            lastName: user?.lastName
                    } as Individual)}
                ],
                validateStatus: form.validate('id', 'issuedBy'),
                help: form.error('id', 'issuedBy'),
                defaultValue: (data ? data.type : user?.personalInfo) as PathValue<T, Path<T>>,
            }
        },
        {
            type: InputTypeEnum.TEXTAREA,
            inputProps: {
                hasForm: edit,
                control: control,
                name: form.name('description') as Path<T>,
                label: 'Description',
                lg: 12,
                md: onlyField,
                placeholder: "Description (max. 2000 characters)",
                validateStatus: form.validate('description'),
                help: form.error('description'),
                defaultValue: (data ? data.type : undefined) as PathValue<T, Path<T>>,
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('description', value) : undefined,
            }
        },
    ]} />
}