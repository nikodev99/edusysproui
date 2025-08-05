import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import {Semester} from "../../entity";
import FormContent from "../ui/form/FormContent.tsx";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {Card} from "antd";
import {FormConfig} from "../../config/FormConfig.ts";
import {FormUtils} from "../../core/utils/formUtils.ts";

export const SemesterForm = <T extends FieldValues>(
    {control, errors, edit, data, handleUpdate, parent}: FormContentProps<T, Semester> & {
        handleUpdate?: (field: keyof Semester, value: unknown) => void,
        parent?: string
    }
) => {
    const form = new FormConfig(errors, edit)
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)
    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.LIST,
                fieldList: [
                    {
                        md: onlyField ?? 12,
                        lg: onlyField ?? 12,
                        control: control,
                        label: 'Nom du semestre\\trimestre',
                        required: true,
                        name: form.name('semestreName', 'template'),
                        validateStatus: form.validate('semestreName', 'template'),
                        help: form.error('semestreName', 'template'),
                        defaultValue: (edit && data ? data?.template?.semesterName : undefined) as PathValue<T, Path<T>>,
                        //onFinish: edit ? (value) => handleUpdate?.('semesterName', value) : undefined
                    },
                    {
                        md: onlyField ?? 12,
                        lg: onlyField ?? 12,
                        control: control,
                        label: 'Description',
                        required: true,
                        name: form.name('description', 'template'),
                        validateStatus: form.validate('description', 'template'),
                        help: form.error('description', 'template'),
                        defaultValue: (edit && data ? data?.template.description : undefined) as PathValue<T, Path<T>>,
                        //onFinish: edit ? (value) => handleUpdate?.('description', value): undefined
                    },
                    {
                        type: 'date',
                        md: onlyField ?? 12,
                        lg: onlyField ?? 12,
                        control: control,
                        label: 'Date de début',
                        required: true,
                        name: form.name('startDate'),
                        validateStatus: form.validate('startDate',),
                        help: form.error('startDate',),
                        defaultValue: (edit && data ? data?.startDate : undefined) as PathValue<T, Path<T>>,
                        onFinish: edit ? (value) => handleUpdate?.('startDate', value): undefined
                    },
                    {
                        type: 'date',
                        md: onlyField ?? 12,
                        lg: onlyField ?? 12,
                        control: control,
                        label: 'Date de fin',
                        required: true,
                        name: form.name('endDate'),
                        validateStatus: form.validate('endDate'),
                        help: form.error('endDate',),
                        defaultValue: (edit && data ? data?.endDate : undefined) as PathValue<T, Path<T>>,
                        onFinish: edit ? (value) => handleUpdate?.('endDate', value): undefined
                    }
                ],
                inputProps: {
                    md: 24,
                    lg: 24,
                    control: control,
                    listName: 'semesters',
                    itemLabel: 'Semester',
                    name: form.name(parent as string) as Path<T>,
                    hasForm: edit,
                    defaultValue: (edit && data ? data : undefined) as PathValue<T, Path<T>>,
                    wrapper: <Card style={{width: '100%', marginBottom: '20px'}} />,
                }
            },
        ]} />
    )
}