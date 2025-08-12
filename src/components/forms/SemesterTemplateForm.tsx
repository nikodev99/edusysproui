import {FormConfig} from "../../config/FormConfig.ts";
import {FormUtils} from "../../core/utils/formUtils.ts";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {FieldValues, Path, PathValue} from "react-hook-form";
import {Card} from "antd";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import {SemesterTemplate} from "../../entity";
import FormContent from "../ui/form/FormContent.tsx";

export const SemesterTemplateForm = <T extends FieldValues>(
    {control, errors, edit, data, parent}: FormContentProps<T, SemesterTemplate[]> & {
        handleUpdate?: (field: keyof SemesterTemplate, value: unknown) => void,
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
                        md: onlyField,
                        lg: onlyField,
                        control: control,
                        label: 'Nom du semestre\\trimestre',
                        required: true,
                        name: form.name('semesterName'),
                        validateStatus: form.validate('semesterName'),
                        help: form.error('semesterName', 'template'),
                        //onFinish: edit ? (value) => handleUpdate?.('semesterName', value) : undefined
                    },
                    {
                        md: onlyField,
                        lg: onlyField,
                        control: control,
                        label: 'Description',
                        required: true,
                        name: form.name('description'),
                        validateStatus: form.validate('description'),
                        help: form.error('description'),
                        //onFinish: edit ? (value) => handleUpdate?.('description', value): undefined
                    },
                    {
                        type: 'number',
                        md: onlyField,
                        lg: onlyField,
                        control: control,
                        label: "Position du semestre/Trimestre",
                        required: false,
                        name: form.name('displayOrder'),
                        validateStatus: form.validate('displayOrder'),
                        help: form.error('displayOrder'),
                        //onFinish: edit ? (value) => handleUpdate?.('description', value): undefined
                    },
                ],
                inputProps: {
                    md: 24,
                    lg: 24,
                    control: control,
                    listName: 'semesters',
                    itemLabel: 'Semester',
                    name: form.name(parent as string) as Path<T>,
                    hasForm: edit,
                    defaultValue: (data ? data : []) as PathValue<T, Path<T>>,
                    wrapper: <Card style={{width: '100%', marginBottom: '20px'}} />,
                }
            },
        ]} />
    )
}