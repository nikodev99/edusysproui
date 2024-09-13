import {EnrollmentSchema, ZodProps} from "../../utils/interfaces.ts";
import {useEffect} from "react";
import StudentForm from "../forms/StudentForm.tsx";

const IndividualForm = ({control, errors, validationTriggered}: ZodProps<EnrollmentSchema>) => {

    useEffect(() => {
        if (validationTriggered) {
            if (errors?.student?.lastName) {
                console.error(errors.student?.lastName.message)
            }
            if (errors?.student?.firstName) {
               console.error(errors?.student?.firstName.message);
            }
        }
    }, [errors, validationTriggered]);

    return (
        <StudentForm control={control} errors={errors} edit={false} />
    )
}

export default IndividualForm;