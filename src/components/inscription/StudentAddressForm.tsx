import {EnrollmentSchema, FormInitialProps,} from "../../utils/interfaces.ts";
import AddressForm from "../forms/AddressForm.tsx";
import {AddressOwner} from "../../core/shared/sharedEnums.ts";

const StudentAddressForm = ({errors, control}: FormInitialProps<EnrollmentSchema>) => {
    return (
        <AddressForm
            enroll={true}
            control={control}
            type={AddressOwner.STUDENT}
            edit={false}
            errors={errors}
        />
    )
}

export default StudentAddressForm