import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import {Employee} from "../../entity";
import FormContent from "../ui/form/FormContent.tsx";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {FormUtils} from "../../core/utils/formUtils.ts";
import {FormConfig} from "../../config/FormConfig.ts";
import {ContractType} from "../../entity/enums/contractType.ts";
import {enumToObjectArray} from "../../core/utils/utils.ts";
import {useMemo} from "react";

type EmployeeFormProps<T extends FieldValues> = FormContentProps<T, Employee> & {
    handleUpdate?: (field: keyof Employee, value: unknown) => void
}

const EmployeeForm = <T extends FieldValues>(
    {control, data, errors, handleUpdate, edit}: EmployeeFormProps<T>
) => {
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)

    const form = new FormConfig(errors, edit)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const contractTypeOptions = useMemo(() => enumToObjectArray(ContractType, true), [])

    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.DATE,
                inputProps: {
                    control: control,
                    name: form.name('hireDate') as Path<T>,
                    label: 'Date d\'embauche',
                    required: true,
                    validateStatus: form.validate('hireDate'),
                    help: form.error('hireDate'),
                    defaultValue: (edit && data ? data.hireDate : '') as PathValue<T, Path<T>>,
                    hasForm: edit,
                    md: onlyField ?? 12,
                    lg: onlyField ?? 12,
                    onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('hireDate', value) : undefined
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    md: onlyField ?? 12,
                    lg: onlyField ?? 12,
                    label: 'Poste',
                    control: control,
                    name: form.name('jobTitle'),
                    required: true,
                    placeholder: 'Opérateur de maintenance',
                    validateStatus: form.validate('jobTitle'),
                    help: form.error('jobTitle'),
                    hasForm: edit,
                    defaultValue: (edit && data ? data.jobTitle : '') as PathValue<T, Path<T>>,
                    onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('jobTitle', value) : undefined
                }
            },
            {
                type: InputTypeEnum.NUMBER,
                inputProps: {
                    hasForm: edit,
                    md: onlyField ?? 12,
                    lg: onlyField ?? 12,
                    label: 'Salaire net mensuel',
                    control: control,
                    name: form.name('salary') as Path<T>,
                    required: false,
                    defaultValue: (edit && data ? data.salary : '') as PathValue<T, Path<T>>,
                    placeholder: '1500',
                    validateStatus: form.validate('salary') as 'error',
                    help: form.error('salary'),
                    onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('salary', value) : undefined,
                    addonAfter: 'FCFA'
                }
            },
            {
                type: InputTypeEnum.SELECT,
                inputProps: {
                    hasForm: edit,
                    md: onlyField ?? 12,
                    lg: onlyField ?? 12,
                    label: 'Type de Contract',
                    control: control,
                    name: form.name('contractType') as Path<T>,
                    required: true,
                    selectedValue: (edit && data ? data.contractType : '') as PathValue<T, Path<T>>,
                    placeholder: 'Sélectionner le type de contrat',
                    validateStatus: form.validate('contractType') as 'error',
                    options: contractTypeOptions,
                    help: form.error('contractType'),
                    onFinish: edit && handleUpdate ? value => handleUpdate('contractType', value) : undefined,
                }
            }
        ]} />
    )
}

export {EmployeeForm}