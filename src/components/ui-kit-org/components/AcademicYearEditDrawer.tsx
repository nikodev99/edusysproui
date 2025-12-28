import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {academicYearSchema, AcademicYearSchema} from "@/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {AcademicYear} from "@/entity";
import {hasField} from "@/core/utils/utils.ts";
import {PatchUpdate} from "@/core/PatchUpdate.ts";
import {UpdateType} from "@/core/shared/sharedEnums.ts";
import RightSidePane from "@/components/ui/layout/RightSidePane.tsx";
import FormSuccess from "@/components/ui/form/FormSuccess.tsx";
import FormError from "@/components/ui/form/FormError.tsx";
import {EditProps} from "@/core/utils/interfaces.ts";
import {AcademicYearForm} from "@/components/forms/AcademicYearForm.tsx";

export const AcademicYearEditDrawer = ({open, close, isLoading, data, resp}: EditProps<AcademicYear>) => {
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const {watch, control, formState: {errors}} = useForm<AcademicYearSchema>({
        resolver: zodResolver(academicYearSchema)
    })

    const formData = watch()

    useEffect(() => {
        if(!open) {
            setErrorMessage(undefined)
            setSuccessMessage(undefined)
        }
    }, [open]);

    const handleUpdate = async (field: keyof AcademicYear) => {
        if (data.id) {
            if (hasField(data, field as keyof AcademicYear)) {
                PatchUpdate.set(
                    field,
                    formData,
                    data.id,
                    setSuccessMessage,
                    setErrorMessage,
                    UpdateType.ACADEMIC_YEAR
                ).then(() => {
                    if (resp) {
                        resp({'updated': true})
                    }
                })
            }
        }
    }

    return(
        <RightSidePane loading={isLoading} open={open} onClose={close} destroyOnHidden>
            {successMessage && (<FormSuccess message={successMessage} />)}
            {errorMessage && (<FormError message={errorMessage} />)}
            <AcademicYearForm
                edit
                control={control}
                errors={errors}
                data={data}
                handleUpdate={handleUpdate}
            />
        </RightSidePane>
    )
}