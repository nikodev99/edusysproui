import {EnrollmentSchema, ZodProps} from "../../utils/interfaces.ts";
import AddressForm from "../forms/AddressForm.tsx";
import {AddressOwner} from "../../core/shared/sharedEnums.ts";

const GuardianAddressForm = ({errors, control}: ZodProps<EnrollmentSchema>) => {
    return (
        <AddressForm
            enroll={true}
            control={control}
            type={AddressOwner.GUARDIAN}
            edit={false}
            errors={errors}
        />
    )
}

export default GuardianAddressForm