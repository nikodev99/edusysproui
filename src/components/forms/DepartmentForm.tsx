import FormContent from "../ui/form/FormContent.tsx";
import {FieldValues} from "react-hook-form";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import {Department} from "../../entity";
import {FormConfig} from "../../config/FormConfig.ts";
import {FormUtils} from "../../core/utils/formUtils.ts";
import {useAcademicYearRepo} from "../../hooks/useAcademicYearRepo.ts";

type DepartmentFormProps<T extends FieldValues> = FormContentProps<T, Department> & {
    handleUpdate?: (field: keyof Department, value: unknown) => void;
}

export const DepartmentForm = <TData extends FieldValues>(
    {errors, control, data, edit, handleUpdate}: DepartmentFormProps<TData>
) => {
    const form = new FormConfig(errors, edit)
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)

    const {academicYearOptions} = useAcademicYearRepo()

    return(
        <FormContent formItems={[

        ]} />
    )
}