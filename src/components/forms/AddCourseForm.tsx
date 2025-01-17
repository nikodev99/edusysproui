import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormContentProps} from "../../utils/interfaces.ts";
import {Course} from "../../entity";
import FormContent from "../ui/form/FormContent.tsx";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {FormConfig} from "../../config/FormConfig.ts";
import {initDepartments} from "../../core/global/store.ts";

export const AddCourseForm = <T extends FieldValues>(
    {control, errors, data}: FormContentProps<T, Course>
) => {

    const form = new FormConfig(errors)
    const departments = initDepartments()

    const departmentOptions = departments && departments.map(d => ({
        value: d.id,
        label: d.name
    })) as []

    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    lg: 12,
                    label: 'Nom de la classe',
                    control: control,
                    name: 'course' as Path<T>,
                    required: true,
                    placeholder: 'Mathématique',
                    validateStatus: form.validate('course'),
                    help: form.error('course'),
                    defaultValue: (data ? data.course : undefined) as PathValue<T, Path<T>>
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    lg: 12,
                    label: 'Abbréviation',
                    control: control,
                    name: 'abbr' as Path<T>,
                    required: true,
                    placeholder: 'Math',
                    validateStatus: form.validate('abbr'),
                    help: form.error('abbr'),
                    defaultValue: (data ? data.abbr : undefined) as PathValue<T, Path<T>>
                }
            },
            {
                type: InputTypeEnum.SELECT,
                inputProps: {
                    lg: 12,
                    options: departmentOptions,
                    label: 'Département',
                    control: control,
                    name: 'department.id' as Path<T>,
                    required: true,
                    placeholder: 'Départment de Science',
                    validateStatus: form.validate('id', 'department'),
                    help: form.error('id', 'department'),
                    selectedValue: (data ? data.department?.id : undefined) as PathValue<T, Path<T>>
                }
            },
        ]} />
    )
}