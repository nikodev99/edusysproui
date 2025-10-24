import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import {Course} from "../../entity";
import FormContent from "../ui/form/FormContent.tsx";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {FormConfig} from "../../config/FormConfig.ts";
import {useMemo} from "react";
import {useDepartmentRepo} from "../../hooks/actions/useDepartmentRepo.ts";

export const CourseForm = <T extends FieldValues>(
    {control, errors, data, showField}: FormContentProps<T, Course>
) => {

    const {useGetAllDepartments} = useDepartmentRepo()
    const form = new FormConfig(errors)

    const departments = useGetAllDepartments()

    const departmentOptions = useMemo(() => departments && departments.map(d => ({
        value: d.id,
        label: d.name
    })) as [], [departments])

    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    lg: 12,
                    label: 'Nom de la matière',
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
            ...(showField ? [{
                type: InputTypeEnum.SELECT,
                inputProps: {
                    lg: 12,
                    options: departmentOptions as [],
                    label: 'Département',
                    control: control,
                    name: 'department.id' as Path<T>,
                    required: showField,
                    placeholder: 'Départment de Science',
                    validateStatus: form.validate('id', 'department'),
                    help: form.error('id', 'department'),
                    selectedValue: (data ? data.department?.id : undefined) as PathValue<T, Path<T>>
                }
            }]: [{
                type: InputTypeEnum.TEXT,
                inputProps: {
                    lg: 12,
                    label: 'Discipline',
                    control: control,
                    name: 'discipline' as Path<T>,
                    required: false,
                    placeholder: 'Science',
                    validateStatus: form.validate('discipline'),
                    help: form.error('discipline'),
                    defaultValue: (data ? data.discipline : undefined) as PathValue<T, Path<T>>
                }
            }]),
        ]} />
    )
}