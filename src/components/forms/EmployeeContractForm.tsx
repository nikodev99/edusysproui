import {FormContentProps} from "@/core/utils/interfaces.ts";
import {EmployeeContract, SalaryBasisEnum, StaffRole} from "@/entity";
import {FormUtils} from "@/core/utils/formUtils.ts";
import {FormConfig} from "@/config/FormConfig.ts";
import FormContent from "@/components/ui/form/FormContent.tsx";
import {ContractOwner, InputTypeEnum} from "@/core/shared/sharedEnums.ts";
import {enumToObjectArray} from "@/core/utils/utils.ts";
import {EmployeeContractSchema} from "@/schema";
import {ContractTypeEnum} from "@/entity/enums/contractType.ts";

type EmployeeContractFormProps = FormContentProps<EmployeeContractSchema, EmployeeContract> & {
    handleUpdate?: (field: keyof EmployeeContract, value: unknown) => void
    parent?: string
    type: ContractOwner
}

export const EmployeeContractForm = (
    {edit, errors, control, data, handleUpdate, parent, type}: EmployeeContractFormProps
) => {
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)
    const form = new FormConfig(errors, edit)

    const staffRoleOptions = enumToObjectArray(StaffRole, true)
    const contractTypeOptions = enumToObjectArray(ContractTypeEnum, true)
    const salaryBasisOptions = enumToObjectArray(SalaryBasisEnum, true)

    const get = (type: ContractOwner, fieldName: keyof EmployeeContractSchema) => {
        switch (type) {
            case ContractOwner.EMPLOYEE:
                return {
                    name: form.name(fieldName, parent ?? 'contract'),
                    validate: form.validate(fieldName, parent ?? 'contract'),
                    error: form.error(fieldName, parent ?? 'contract'),
                }
            case ContractOwner.TEACHER:
                return {
                    name: form.name(fieldName, parent ?? 'contract'),
                    validate: form.validate(fieldName, parent ?? 'contract'),
                    error: form.error(fieldName, parent ?? 'contract'),
                }
            default: return {
                name: form.name(fieldName, parent),
                validate: form.validate(fieldName, parent),
                error: form.error(fieldName, parent), 
            }
        }
    }

    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.SELECT,
                inputProps: {
                    control: control,
                    name: get(type, 'role')?.name,
                    label: 'Titre du poste',
                    required: true,
                    validateStatus: get(type, 'role')?.validate,
                    help: get(type, 'role')?.error,
                    defaultValue: (edit && data ? data?.role : staffRoleOptions[0].value),
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('role', value) : undefined,
                    options: staffRoleOptions
                }
            },
            {
                type: InputTypeEnum.SELECT,
                inputProps: {
                    control: control,
                    name: get(type,'contractType')?.name,
                    label: 'Type de contrat',
                    required: true,
                    validateStatus: get(type,'contractType')?.validate,
                    help: get(type,'contractType')?.error,
                    defaultValue: (edit && data ? data?.contractType : contractTypeOptions[0].value),
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('contractType', value) : undefined,
                    options: contractTypeOptions
                }
            },
            {
                type: InputTypeEnum.SELECT,
                inputProps: {
                    control: control,
                    name: get(type,'salaryBasis')?.name,
                    label: 'Fréquence de paiement',
                    required: true,
                    validateStatus: get(type,'salaryBasis')?.validate,
                    help: get(type,'salaryBasis')?.error,
                    defaultValue: (edit && data ? data?.salaryBasis : salaryBasisOptions[0].value),
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('salaryBasis', value) : undefined,
                    options: salaryBasisOptions
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    control: control,
                    name: get(type,'currency')?.name,
                    label: 'Devise',
                    required: true,
                    validateStatus: get(type,'currency')?.validate,
                    help: get(type,'currency')?.error,
                    defaultValue: (edit && data ? data?.currency : 'XAF'),
                    disabled: true,
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('currency', value) : undefined,
                }
            },
            {
                type: InputTypeEnum.NUMBER,
                inputProps: {
                    control: control,
                    name: get(type,'salaryByHour')?.name,
                    label: 'Salaire par heure',
                    required: false,
                    validateStatus: get(type,'salaryByHour')?.validate,
                    help: get(type,'salaryByHour')?.error,
                    defaultValue: (edit && data ? data?.salaryByHour : 0),
                    placeholder: '5000',
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('salaryByHour', value) : undefined,
                }
            },
            {
                type: InputTypeEnum.NUMBER,
                inputProps: {
                    control: control,
                    name: get(type,'monthlySalary')?.name,
                    label: 'Salaire par mois',
                    required: false,
                    validateStatus: get(type,'monthlySalary')?.validate,
                    help: get(type,'monthlySalary')?.error,
                    defaultValue: (edit && data ? data?.monthlySalary : 0),
                    placeholder: '100000',
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('monthlySalary', value) : undefined,
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    control: control,
                    name: get(type,'bankName')?.name,
                    label: 'Nom de la banque',
                    required: false,
                    validateStatus: get(type,'bankName')?.validate,
                    help: get(type,'bankName')?.error,
                    defaultValue: (edit && data ? data?.bankName : ''),
                    placeholder: 'Bank Of Africa',
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('bankName', value) : undefined,
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    control: control,
                    name: get(type,'bankAccount')?.name,
                    label: 'N° de compte',
                    required: false,
                    validateStatus: get(type,'bankAccount')?.validate,
                    help: get(type,'bankAccount')?.error,
                    defaultValue: (edit && data ? data?.bankAccount : ''),
                    placeholder: '00020271598',
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('bankAccount', value) : undefined,
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    control: control,
                    name: get(type,'mobileMoneyNumber')?.name,
                    label: 'Numéro de Momo',
                    required: false,
                    validateStatus: get(type,'mobileMoneyNumber')?.validate,
                    help: get(type,'mobileMoneyNumber')?.error,
                    defaultValue: (edit && data ? data?.mobileMoneyNumber : ''),
                    placeholder: '066983030',
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('mobileMoneyNumber', value) : undefined,
                }
            },
            {
                type: InputTypeEnum.DATE,
                inputProps: {
                    control: control,
                    name: get(type,'startDate')?.name,
                    label: "Date d'embauche",
                    required: true,
                    validateStatus: get(type,'startDate')?.validate,
                    help: get(type,'startDate')?.error,
                    defaultValue: (edit && data ? data?.startDate : ''),
                    placeholder: '10/10/2026',
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('startDate', value) : undefined,
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    control: control,
                    name: get(type,'cnssNumber')?.name,
                    label: "Numéro d'affiliation à la CNSS",
                    required: false,
                    validateStatus: get(type,'cnssNumber')?.validate,
                    help: get(type,'cnssNumber')?.error,
                    defaultValue: (edit && data ? data?.cnssNumber : ''),
                    placeholder: '1234567/23',
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('cnssNumber', value) : undefined,
                }
            }
        ]} />
    )
}