import {ZodControl, ZodProps} from "../../utils/interfaces.ts";
import AddressForm from "../ui/AddressForm.tsx";

const StudentAddressForm = ({errors, control}: ZodProps) => {

    const addressProps: ZodControl[] = [
        {
            validateStatus: errors?.student?.address?.number ? 'error': '',
            help: errors?.student?.address?.number ? errors.student?.address.number.message : '',
            name: 'student.address.number',
            control: control
        },
        {
            validateStatus: errors?.student?.address?.street ? 'error': '',
            help: errors?.student?.address?.street ? errors.student?.address.street.message : '',
            name: 'student.address.street',
            control: control
        },
        {
            validateStatus: errors?.student?.address?.secondStreet ? 'error': '',
            help: errors?.student?.address?.secondStreet ? errors.student?.address.secondStreet.message : '',
            name: 'student.address.secondStreet',
            control: control
        },
        {
            validateStatus: errors?.student?.address?.neighborhood ? 'error': '',
            help: errors?.student?.address?.neighborhood ? errors.student?.address.neighborhood.message : '',
            name: 'student.address.neighborhood',
            control: control
        },
        {
            validateStatus: errors?.student?.address?.borough ? 'error': '',
            help: errors?.student?.address?.borough ? errors.student?.address.borough.message : '',
            name: 'student.address.borough',
            control: control
        },
        {
            validateStatus: errors?.student?.address?.city ? 'error': '',
            help: errors?.student?.address?.city ? errors.student?.address.city.message : '',
            name: 'student.address.city',
            control: control
        },
        {
            validateStatus: errors?.student?.address?.zipCode ? 'error': '',
            help: errors?.student?.address?.zipCode ? errors.student?.address.zipCode.message : '',
            name: 'student.address.zipCode',
            control: control
        },
        {
            validateStatus: errors?.student?.address?.country ? 'error': '',
            help: errors?.student?.address?.country ? errors.student?.address.country.message : '',
            name: 'student.address.country',
            control: control
        }
    ]

    return (
        <AddressForm  addressProps={addressProps}/>
    )
}

export default StudentAddressForm