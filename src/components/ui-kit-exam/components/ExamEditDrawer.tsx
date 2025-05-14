import RightSidePane from "../../ui/layout/RightSidePane.tsx";
import {EditProps} from "../../../core/utils/interfaces.ts";
import {Assignment} from "../../../entity";
import {AssignmentForm} from "../../forms/AssignmentForm.tsx";
import {useForm} from "react-hook-form";
import {assignmentSchema, AssignmentSchema} from "../../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {PatchUpdate} from "../../../core/PatchUpdate.ts";
import {UpdateType} from "../../../core/shared/sharedEnums.ts";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";

export const ExamEditDrawer = ({open, close, isLoading, data}: EditProps<Assignment>) => {
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)


    const {watch, control, formState: {errors}} = useForm<AssignmentSchema>({
        resolver: zodResolver(assignmentSchema)
    })

    const formData = watch()

    useEffect(() => {
        if(successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(undefined)
                setSuccessMessage(undefined)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [errorMessage, successMessage]);

    console.log("FORM DATA: ", formData)

    const handleUpdate = async (field: string | number | keyof Assignment) => {
        if (data.id) {
            await PatchUpdate.set(
                field,
                formData,
                data.id,
                setSuccessMessage,
                setErrorMessage,
                UpdateType.ASSIGNMENT
            )
        }
    }

    return (
        <RightSidePane open={open} onClose={close} loading={isLoading} destroyOnClose>
            {successMessage && <FormSuccess message={successMessage} isNotif />}
            {errorMessage && <FormError message={errorMessage} isNotif />}
            <AssignmentForm control={control} errors={errors} data={data} edit={true} handleUpdate={handleUpdate} />
        </RightSidePane>
    )
}