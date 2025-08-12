import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import FormContent from "../ui/form/FormContent.tsx";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {HealthCondition} from "../../entity";
import {FormUtils} from "../../core/utils/formUtils.ts";
import {FormConfig} from "../../config/FormConfig.ts";
import {BloodType} from "../../entity/enums/bloodType.ts";
import {Card} from "antd";

type HealthProps<T extends FieldValues> = FormContentProps<T, HealthCondition> & { handleUpdate?: (field: keyof HealthCondition, value: unknown) => void }

const HealthConditionForm = <T extends FieldValues>({control, errors, edit, enroll, data, handleUpdate}: HealthProps<T>) => {

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
        <FormContent formItems={[
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
                    options: bloodOptions,
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('bloodType', value) : undefined
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
                    placeholder:'67',
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('weight', value) : undefined
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
                    placeholder:'167',
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('height', value) : undefined
                }
            },
            {
                type: InputTypeEnum.LIST,
                inputProps: {
                    md: onlyField,
                    lg: onlyField,
                    control: control,
                    label: 'Conditions Médicales',
                    required: false,
                    listName: 'conditions',
                    name: form.name('medicalConditions', parent),
                    validateStatus: form.validate('medicalConditions', parent),
                    help: form.error('medicalConditions', parent),
                    hasForm: edit,
                    itemLabel: 'Condition Médicale',
                    defaultValue: (edit && data ? data.medicalConditions : undefined) as PathValue<T, Path<T>>,
                    wrapper: <Card style={{width: '100%'}} />,
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('medicalConditions', value) : undefined
                }
            },
            {
                type: InputTypeEnum.LIST,
                inputProps: {
                    md: onlyField,
                    lg: onlyField,
                    control: control,
                    label: 'Allergie',
                    itemLabel: 'Allergie',
                    required: false,
                    listName: 'allergies',
                    name: form.name('allergies', parent),
                    validateStatus: form.validate('allergies', parent),
                    help: form.error('allergies', parent),
                    hasForm: edit,
                    defaultValue: (edit && data ? data.allergies : undefined) as PathValue<T, Path<T>>,
                    wrapper: <Card style={{width: '100%'}} />,
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('allergies', value) : undefined
                }
            },
            {
                type: InputTypeEnum.LIST,
                inputProps: {
                    md: onlyField,
                    lg: onlyField,
                    control: control,
                    label: 'Medicament Obligatoire',
                    itemLabel: 'Médicament',
                    required: false,
                    listName: 'medications',
                    name: form.name('medications', parent),
                    validateStatus: form.validate('medications', parent),
                    help: form.error('medications', parent),
                    hasForm: edit,
                    defaultValue: (edit && data ? data.medications : 0) as PathValue<T, Path<T>>,
                    wrapper: <Card style={{width: '100%'}} />,
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('medications', value) : undefined
                }
            }
        ]} />
    )
}

export default HealthConditionForm