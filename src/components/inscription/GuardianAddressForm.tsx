import {ZodControl, ZodProps} from "../../utils/interfaces.ts";
import AddressForm from "../ui/AddressForm.tsx";

const GuardianAddressForm = ({errors, control}: ZodProps) => {

    const addressProps: ZodControl[] = [
        {
            validateStatus: errors?.student?.guardian?.address?.number ? 'error': '',
            help: errors?.student?.guardian?.address?.number ? errors.student?.guardian?.address.number.message : '',
            name: 'student.guardian.address.number',
            control: control
        },
        {
            validateStatus: errors?.student?.guardian?.address?.street ? 'error': '',
            help: errors?.student?.guardian?.address?.street ? errors.student?.guardian?.address.street.message : '',
            name: 'student.guardian.address.street',
            control: control
        },
        {
            validateStatus: errors?.student?.guardian?.address?.secondStreet ? 'error': '',
            help: errors?.student?.guardian?.address?.secondStreet ? errors.student?.guardian?.address.secondStreet.message : '',
            name: 'student.guardian.address.secondStreet',
            control: control
        },
        {
            validateStatus: errors?.student?.guardian?.address?.neighborhood ? 'error': '',
            help: errors?.student?.guardian?.address?.neighborhood ? errors.student?.guardian?.address.neighborhood.message : '',
            name: 'student.guardian.address.neighborhood',
            control: control
        },
        {
            validateStatus: errors?.student?.guardian?.address?.borough ? 'error': '',
            help: errors?.student?.guardian?.address?.borough ? errors.student?.guardian?.address.borough.message : '',
            name: 'student.guardian.address.borough',
            control: control
        },
        {
            validateStatus: errors?.student?.guardian?.address?.city ? 'error': '',
            help: errors?.student?.guardian?.address?.city ? errors.student?.guardian?.address.city.message : '',
            name: 'student.guardian.address.city',
            control: control
        },
        {
            validateStatus: errors?.student?.guardian?.address?.zipCode ? 'error': '',
            help: errors?.student?.guardian?.address?.zipCode ? errors.student?.guardian?.address.zipCode.message : '',
            name: 'student.guardian.address.zipCode',
            control: control
        },
        {
            validateStatus: errors?.student?.guardian?.address?.country ? 'error': '',
            help: errors?.student?.guardian?.address?.country ? errors.student?.guardian?.address.country.message : '',
            name: 'student.guardian.address.country',
            control: control
        }
    ]

    return (
        <AddressForm addressProps={addressProps} />
    )
}

export default GuardianAddressForm