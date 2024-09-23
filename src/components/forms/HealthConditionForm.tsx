import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormContentProps} from "../../utils/interfaces.ts";
import FormContent from "../ui/form/FormContent.tsx";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {HealthCondition} from "../../entity";
import {FormUtils} from "../../utils/formUtils.ts";
import {FormConfig} from "../../config/FormConfig.ts";
import {BloodType} from "../../entity/enums/bloodType.ts";

const HealthConditionForm = <T extends FieldValues>({control, errors, edit, enroll, data}: FormContentProps<T, HealthCondition>) => {

    const form = new FormConfig(errors, edit, enroll)
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)
    const parent: string = 'student.healthCondition'
    const bloodOptions = [
        {value: BloodType.A, label: 'A+'},
        {value: BloodType.A_, label: 'A-'},
        {value: BloodType.B, label: 'B+'},
        {value: BloodType.B_, label: 'B-'},
        {value: BloodType.AB, label: 'AB+'},
        {value: BloodType.AB_, label: 'AB-'},
        {value: BloodType.O, label: 'O+'},
        {value: BloodType.O_, label: 'O-'},
    ]

    return(
        <FormContent responsiveness formItems={[
            {
                type: InputTypeEnum.SELECT,
                inputProps: {
                    md: onlyField,
                    lg: onlyField,
                    control: control,
                    label: 'Groupe Sanguin',
                    required: true,
                    name: form.name('bloodType', parent),
                    validateStatus: form.validate('bloodType', parent),
                    help: form.error('bloodType', parent),
                    hasForm: edit,
                    selectedValue: (edit && data ? data.bloodType : undefined) as PathValue<T, Path<T>>,
                    placeholder: 'Sélectionner le groupe sanguin',
                    options: bloodOptions
                }
            },
            {
                type: InputTypeEnum.NUMBER,
                inputProps: {
                    md: onlyField,
                    lg: onlyField,
                    control: control,
                    label: 'Poids',
                    required: true,
                    name: form.name('weight', parent),
                    validateStatus: form.validate('weight', parent),
                    help: form.error('weight', parent),
                    hasForm: edit,
                    defaultValue: (edit && data ? data.weight : 0) as PathValue<T, Path<T>>,
                    addonAfter: 'kg',
                    min: 0,
                    placeholder:'67'
                }
            },
            {
                type: InputTypeEnum.NUMBER,
                inputProps: {
                    md: onlyField,
                    lg: onlyField,
                    control: control,
                    label: 'Taille',
                    required: true,
                    name: form.name('height', parent),
                    validateStatus: form.validate('height', parent),
                    help: form.error('height', parent),
                    hasForm: edit,
                    defaultValue: (edit && data ? data.height : 0) as PathValue<T, Path<T>>,
                    addonAfter: 'cm',
                    min: 0,
                    placeholder:'167'
                }
            }
        ]} />
    )
}

export default HealthConditionForm