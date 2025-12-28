import FormContent from "@/components/ui/form/FormContent.tsx";
import {FormContentProps} from "@/core/utils/interfaces.ts";
import {Punishment} from "@/entity";
import {PunishmentSchema, ReprimandSchema} from "@/schema";
import {InputTypeEnum} from "@/core/shared/sharedEnums.ts";
import {FormUtils} from "@/core/utils/formUtils.ts";
import {FormConfig} from "@/config/FormConfig.ts";
import {enumToObjectArray} from "@/core/utils/utils.ts";
import {PunishmentType} from "@/entity/enums/punishmentType.ts";
import {PunishmentStatus} from "@/entity/enums/punishmentStatus.ts";

type PunitionFormProps = FormContentProps<PunishmentSchema, Punishment> & {
    parent?: keyof ReprimandSchema
    handleUpdate?: (field: keyof PunishmentSchema, value: unknown) => void,
}

export const PunitionForm = ({control, errors, edit, data, handleUpdate, parent = 'punishment'}: PunitionFormProps) => {
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)
    const form = new FormConfig(errors, edit, true)

    const typeOptions = enumToObjectArray(PunishmentType, true)
    const statusOptions = enumToObjectArray(PunishmentStatus, true)

    return <FormContent formItems={[
        {
            type: InputTypeEnum.CHECKBOX,
            inputProps: {
                hasForm: edit,
                control: control,
                name: form.name('isRequire', parent),
                label: 'Obligation de punition',
                checkLabel: 'Punition réquise ?',
                lg: 24,
                md: 24,
                required: true,
                validateStatus: form.validate('isRequire', parent),
                help: form.error('isRequire', parent),
                defaultValue: (data ? data.isRequire : true),
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('isRequire', value) : undefined,
            }
        },
        {
            type: InputTypeEnum.SELECT,
            inputProps: {
                hasForm: edit,
                control: control,
                name: form.name('type', parent),
                label: 'Type de punition',
                lg: onlyField,
                md: onlyField,
                required: true,
                placeholder: "Choisissez le type de punition",
                options: typeOptions,
                validateStatus: form.validate('type', parent),
                help: form.error('type', parent),
                defaultValue: (data ? data.type : undefined),
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('type', value) : undefined,
            }
        },
        {
            type: InputTypeEnum.RANGE,
            inputProps: {
                hasForm: edit,
                control: control,
                name: form.name('dateRange', parent),
                label: 'Période de la punition',
                lg: onlyField,
                md: onlyField,
                required: true,
                placeholder: ['Date de début', 'Date de fin'],
                validateStatus: form.validate('dateRange', parent),
                help: form.error('dateRange', parent),
                defaultValue: (data ? [data?.startDate, data?.endDate] : undefined),
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('dateRange', value) : undefined,
            }
        },
        {
            type: InputTypeEnum.SELECT,
            inputProps: {
                hasForm: edit,
                control: control,
                name: form.name('status', parent),
                label: 'Status de la punition',
                lg: onlyField,
                md: onlyField,
                required: true,
                placeholder: "Choisissez le status de la punition",
                options: statusOptions,
                validateStatus: form.validate('status', parent),
                help: form.error('status', parent),
                defaultValue: (data ? data.status : undefined),
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('type', value) : undefined,
            }
        },
        {
            type: InputTypeEnum.TEXT,
            inputProps: {
                hasForm: edit,
                control: control,
                name: form.name('executedBy', parent),
                label: 'Executé par',
                lg: onlyField,
                md: onlyField,
                placeholder: "Autorité d'exécution",
                validateStatus: form.validate('executedBy', parent),
                help: form.error('executedBy', parent),
                defaultValue: (data ? data.executedBy : undefined),
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('type', value) : undefined,
            }
        },
        {
            type: InputTypeEnum.TEXTAREA,
            inputProps: {
                hasForm: edit,
                control: control,
                name: form.name('description', parent),
                label: 'Description',
                lg: 12,
                md: onlyField,
                placeholder: "Description (max. 2000 characters)",
                validateStatus: form.validate('description', parent),
                help: form.error('description', parent),
                defaultValue: (data ? data.type : undefined),
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('description', value) : undefined,
            }
        },
        {
            type: InputTypeEnum.CHECKBOX,
            inputProps: {
                hasForm: edit,
                control: control,
                name: form.name('appealed', parent),
                label: "Appel de l'élève",
                checkLabel: "L'élève fait appel ?",
                lg: 24,
                md: 24,
                validateStatus: form.validate('appealed', parent),
                help: form.error('appealed', parent),
                defaultValue: (data ? data.appealed : false),
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('appealed', value) : undefined,
            }
        },
        {
            type: InputTypeEnum.TEXTAREA,
            inputProps: {
                hasForm: edit,
                control: control,
                name: form.name('appealedNote', parent),
                label: "Note de l'appel",
                lg: 12,
                md: onlyField,
                placeholder: "Note de l'appel (max. 2000 characters)",
                validateStatus: form.validate('appealedNote', parent),
                help: form.error('appealedNote', parent),
                defaultValue: (data ? data.type : undefined),
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('appealedNote', value) : undefined,
            }
        },
    ]} />
}