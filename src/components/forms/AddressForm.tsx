import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormContentProps} from "../../utils/interfaces.ts";
import FormContent from "../ui/form/FormContent.tsx";
import {AddressOwner, InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {Address} from "../../entity";
import {FormUtils} from "../../utils/formUtils.ts";
import Responsive from "../ui/layout/Responsive.tsx";
import Grid from "../ui/layout/Grid.tsx";
import {FormConfig} from "../../config/FormConfig.ts";


type AddressFormProps<T extends FieldValues> = FormContentProps<T, Address> & {
    type: AddressOwner,
    handleUpdate?: (field: keyof Address, value: unknown) => void
};

const AddressForm = <T extends FieldValues>(addressProps: AddressFormProps<T>) => {

    const {edit, data, control, errors, enroll, type, handleUpdate} = addressProps

    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)
    const lg = FormUtils.onlyField(edit as boolean, 24, 16)

    const form = new FormConfig(errors, edit, enroll)

    const get = (type: AddressOwner, fieldName: string) => {
        switch (type) {
            case AddressOwner.STUDENT:
                return {
                    name: form.name(fieldName, 'student.address'),
                    validate: form.validate(fieldName, 'student.address'),
                    error: form.error(fieldName, 'student.address'),
                }
            case AddressOwner.TEACHER:
                return {
                    name: form.name(fieldName),
                    validate: form.validate(fieldName),
                    error: form.error(fieldName),
                }
            case AddressOwner.ADMIN:
                return {
                    name: form.name(fieldName),
                    validate: form.validate(fieldName),
                    error: form.error(fieldName),
                }
            case AddressOwner.GUARDIAN:
                return {
                    name: form.name(fieldName, 'student.guardian.address'),
                    validate: form.validate(fieldName, 'student.guardian.address'),
                    error: form.error(fieldName, 'student.guardian.address'),
                }
            default:
                return null

        }
    }

    console.log('Address: ',)

    const twoFirstField = [
        {
            type: InputTypeEnum.NUMBER,
            inputProps: {
                hasForm: edit,
                md: onlyField,
                lg: onlyField,
                label: 'N°',
                control: control,
                name: get(type, 'number')?.name as Path<T>,
                required: true,
                defaultValue: (edit && data ? data.number : '') as PathValue<T, Path<T>>,
                placeholder: '17',
                validateStatus: get(type, 'number')?.validate as 'error',
                help: get(type, 'number')?.error,
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('number', value) : undefined
            }
        },
        {
            type: InputTypeEnum.TEXT,
            inputProps: {
                hasForm: edit,
                md: onlyField,
                lg: lg,
                label: 'Rue',
                control: control,
                name: get(type, 'street')?.name as Path<T>,
                required: true,
                defaultValue: (edit && data ? data.street : '') as PathValue<T, Path<T>>,
                placeholder: '3 Martyrs',
                validateStatus: get(type, 'street')?.validate as 'error',
                help: get(type, 'street')?.error,
                onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('street', value) : undefined
            }
        },
    ]

    return(
        <Responsive gutter={[16, 16]}>
            {!edit &&
                <Grid xs={24} md={12} lg={8}>
                    <FormContent formItems={twoFirstField} />
                </Grid>
            }
            <FormContent responsiveness formItems={[
                ...(edit ? twoFirstField : []),
                {
                    type: InputTypeEnum.TEXT,
                    inputProps: {
                        hasForm: edit,
                        md: onlyField,
                        lg: onlyField,
                        label: 'Seconde Rue / Avenue',
                        control: control,
                        name: get(type, 'secondStreet')?.name as Path<T>,
                        required: false,
                        defaultValue: (edit && data ? data.secondStreet : '') as PathValue<T, Path<T>>,
                        placeholder: 'Av. de la 2ème Division Blindée',
                        validateStatus: get(type, 'secondStreet')?.validate as 'error',
                        help: get(type, 'secondStreet')?.error,
                        onFinish: edit && handleUpdate ? (value) => handleUpdate('secondStreet', value) : undefined
                    }
                },
                {
                    type: InputTypeEnum.TEXT,
                    inputProps: {
                        hasForm: edit,
                        md: onlyField,
                        lg: onlyField,
                        label: 'Quartier',
                        control: control,
                        name: get(type, 'neighborhood')?.name as Path<T>,
                        required: true,
                        defaultValue: (edit && data ? data.neighborhood : '') as PathValue<T, Path<T>>,
                        placeholder: 'Moukoundzi Ngouaka',
                        validateStatus: get(type, 'neighborhood')?.validate as 'error',
                        help: get(type, 'neighborhood')?.error,
                        onFinish: edit && handleUpdate ? (value) => handleUpdate('neighborhood', value) : undefined
                    }
                },
                {
                    type: InputTypeEnum.TEXT,
                    inputProps: {
                        hasForm: edit,
                        md: onlyField,
                        lg: onlyField,
                        label: 'Arrondissement',
                        control: control,
                        name: get(type, 'borough')?.name as Path<T>,
                        required: false,
                        defaultValue: (edit && data ? data.borough : '') as PathValue<T, Path<T>>,
                        placeholder: 'Bacongo',
                        validateStatus: get(type, 'borough')?.validate as 'error',
                        help: get(type, 'borough')?.error,
                        onFinish: edit && handleUpdate ? (value) => handleUpdate('borough', value) : undefined
                    }
                },
                {
                    type: InputTypeEnum.TEXT,
                    inputProps: {
                        hasForm: edit,
                        md: onlyField,
                        lg: onlyField,
                        label: 'Ville',
                        control: control,
                        name: get(type, 'city')?.name as Path<T>,
                        required: true,
                        defaultValue: (edit && data ? data.city : '') as PathValue<T, Path<T>>,
                        placeholder: 'Brazzaville',
                        validateStatus: get(type, 'city')?.validate as 'error',
                        help: get(type, 'city')?.error,
                        onFinish: edit && handleUpdate ? (value) => handleUpdate('city', value) : undefined
                    }
                },
                {
                    type: InputTypeEnum.TEXT,
                    inputProps: {
                        hasForm: edit,
                        md: onlyField,
                        lg: onlyField,
                        label: 'Code Postal',
                        control: control,
                        name: get(type, 'zipCode')?.name as Path<T>,
                        required: false,
                        defaultValue: (edit && data ? data.zipCode : '') as PathValue<T, Path<T>>,
                        placeholder: '99324',
                        validateStatus: get(type, 'zipCode')?.validate as 'error',
                        help: get(type, 'zipCode')?.error,
                        onFinish: edit && handleUpdate ? (value) => handleUpdate('zipCode', value) : undefined
                    }
                },
                {
                    type: InputTypeEnum.COUNTRY,
                    inputProps: {
                        showSearch: true,
                        hasForm: edit,
                        md: onlyField,
                        lg: onlyField,
                        label: 'Pays',
                        control: control,
                        name: get(type, 'country')?.name as Path<T>,
                        required: true,
                        defaultValue: (edit && data ? data.country : undefined) as PathValue<T, Path<T>>,
                        validateStatus: get(type, 'country')?.validate as 'error',
                        help: get(type, 'country')?.error,
                        onFinish: edit && handleUpdate ? (value) => handleUpdate('country', value) : undefined
                    }
                },
            ]} />
        </Responsive>
    )
}

export default AddressForm