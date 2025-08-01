import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import {Semester} from "../../entity";
import FormContent from "../ui/form/FormContent.tsx";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {Card} from "antd";
import {FormConfig} from "../../config/FormConfig.ts";
import {FormUtils} from "../../core/utils/formUtils.ts";

export const SemesterForm = <T extends FieldValues>(
    {control, errors, edit, data, handleUpdate}: FormContentProps<T, Semester> & {handleUpdate?: (field: keyof Semester, value: unknown) => void}
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
                        name: form.name('semestreName'),
                        validateStatus: form.validate('semestreName'),
                        help: form.error('semestreName'),
                        defaultValue: (edit && data ? data.semesterName : 0) as PathValue<T, Path<T>>,
                        onFinish: edit ? (value) => handleUpdate?.('semesterName', value) : undefined
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
                        defaultValue: (edit && data ? data.description : undefined) as PathValue<T, Path<T>>,
                        onFinish: edit ? (value) => handleUpdate?.('description', value) : undefined
                    }
                ],
                inputProps: {
                    control: control,
                    listName: 'semesters',
                    itemLabel: 'Semesters',
                    name: form.name(''),
                    hasForm: edit,
                    defaultValue: (edit && data ? data : undefined) as PathValue<T, Path<T>>,
                    wrapper: <Card style={{width: '100%', marginBottom: '20px'}} />,
                    onFinish: edit ? (value) => handleUpdate?.('semesterName', value) : undefined
                }
            },
        ]} />
    )
}