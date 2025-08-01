import FormContent from "../ui/form/FormContent.tsx";
import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import {Grade} from "../../entity";
import {FormConfig} from "../../config/FormConfig.ts";
import {FormUtils} from "../../core/utils/formUtils.ts";
import {useMemo} from "react";
import {enumToObjectArray} from "../../core/utils/utils.ts";
import {SectionType} from "../../entity/enums/section.ts";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";

type GradeFormProps<T extends FieldValues> = FormContentProps<T, Grade> &{
    handleUpdate?: (field: keyof Grade, value: unknown) => void
}

export const GradeForm = <T extends FieldValues>(
    {errors, control, edit, data, handleUpdate}: GradeFormProps<T>
) => {
    const form = new FormConfig(errors, edit)
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)

    const sectionOptions = useMemo(() => enumToObjectArray(SectionType, true), [])

    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.SELECT,
                inputProps: {
                    lg: onlyField ?? 12,
                    md: onlyField ?? 12,
                    options: sectionOptions as [],
                    label: 'Section\\Niveau',
                    control: control,
                    name: form.name('section') as Path<T>,
                    required: true,
                    placeholder: SectionType.LYCEE,
                    validateStatus: form.validate('section'),
                    help: form.error('section'),
                    selectedValue: (data ? data.section : undefined) as PathValue<T, Path<T>>,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('section', value) : undefined
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    lg: onlyField ?? 12,
                    md: onlyField ?? 12,
                    label: 'Sub section\\Sub Niveau',
                    control: control,
                    name: form.name('subSection') as Path<T>,
                    validateStatus: form.validate('subSection'),
                    help: form.error( 'subSection'),
                    placeholder: 'Série A',
                    defaultValue: (data ? data.subSection : undefined) as PathValue<T, Path<T>>,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('section', value) : undefined
                }
            },
        ]} />
    )
}