import FormContent from "../ui/form/FormContent.tsx";
import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import {AcademicYear} from "../../entity";
import {FormUtils} from "../../core/utils/formUtils.ts";
import {FormConfig} from "../../config/FormConfig.ts";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";

type AcademicYearFormProps<T extends FieldValues> = FormContentProps<T, AcademicYear> & {
    handleUpdate?: (field: keyof AcademicYear, value: unknown) => void
};

export const AcademicYearForm = <T extends FieldValues>(props: AcademicYearFormProps<T>) => {
    const {edit, data, control, errors, handleUpdate} = props

    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)

    const form = new FormConfig(errors, edit)

    return <FormContent formItems={[
        {
            type: InputTypeEnum.DATE,
            inputProps: {
                hasForm: edit,
                md: onlyField ?? 12,
                lg: onlyField ?? 12,
                label: 'Début d\'année',
                control: control,
                name: form.name('startDate') as Path<T>,
                required: true,
                defaultValue: (edit && data ? data.startDate : '') as PathValue<T, Path<T>>,
                placeholder: '01/10/2030',
                validateStatus: form.validate('startDate') as 'error',
                help: form.error('startDate'),
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('startDate', value) : undefined
            }
        },
        {
            type: InputTypeEnum.DATE,
            inputProps: {
                hasForm: edit,
                md: onlyField ?? 12,
                lg: onlyField ?? 12,
                label: 'Fin d\'année',
                control: control,
                name: form.name('endDate') as Path<T>,
                required: true,
                defaultValue: (edit && data ? data.endDate : '') as PathValue<T, Path<T>>,
                placeholder: '15/06/2030',
                validateStatus: form.validate('endDate') as 'error',
                help: form.error('endDate'),
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('endDate', value) : undefined
            }
        },
    ]} />
}