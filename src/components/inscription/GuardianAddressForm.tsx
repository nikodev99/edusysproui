import {ZodControl, ZodProps} from "../../utils/interfaces.ts";
import AddressForm from "../ui/form/AddressForm.tsx";

const GuardianAddressForm = ({errors, control}: ZodProps) => {

    const addressProps: ZodControl[] = [
        {
            validateStatus: errors?.student?.guardian?.address?.number ? 'error': '',
            help: errors?.student?.guardian?.address?.number ? errors.student?.guardian?.address.number.message : '',
            name: 'student.guardian.address.number' as 'student.guardian.address',
            control: control
        },
        {
            validateStatus: errors?.student?.guardian?.address?.street ? 'error': '',
            help: errors?.student?.guardian?.address?.street ? errors.student?.guardian?.address.street.message : '',
            name: 'student.guardian.address.street' as 'student.guardian.address',
            control: control
        },
        {
            validateStatus: errors?.student?.guardian?.address?.secondStreet ? 'error': '',
            help: errors?.student?.guardian?.address?.secondStreet ? errors.student?.guardian?.address.secondStreet.message : '',
            name: 'student.guardian.address.secondStreet' as 'student.guardian.address',
            control: control
        },
        {
            validateStatus: errors?.student?.guardian?.address?.neighborhood ? 'error': '',
            help: errors?.student?.guardian?.address?.neighborhood ? errors.student?.guardian?.address.neighborhood.message : '',
            name: 'student.guardian.address.neighborhood' as 'student.guardian.address',
            control: control
        },
        {
            validateStatus: errors?.student?.guardian?.address?.borough ? 'error': '',
            help: errors?.student?.guardian?.address?.borough ? errors.student?.guardian?.address.borough.message : '',
            name: 'student.guardian.address.borough' as 'student.guardian.address',
            control: control
        },
        {
            validateStatus: errors?.student?.guardian?.address?.city ? 'error': '',
            help: errors?.student?.guardian?.address?.city ? errors.student?.guardian?.address.city.message : '',
            name: 'student.guardian.address.city' as 'student.guardian.address',
            control: control
        },
        {
            validateStatus: errors?.student?.guardian?.address?.zipCode ? 'error': '',
            help: errors?.student?.guardian?.address?.zipCode ? errors.student?.guardian?.address.zipCode.message : '',
            name: 'student.guardian.address.zipCode' as 'student.guardian.address',
            control: control
        },
        {
            validateStatus: errors?.student?.guardian?.address?.country ? 'error': '',
            help: errors?.student?.guardian?.address?.country ? errors.student?.guardian?.address.country.message : '',
            name: 'student.guardian.address.country' as 'student.guardian.address',
            control: control
        }
    ]

    return (
        <AddressForm addressProps={addressProps} />
    )
}

export default GuardianAddressForm