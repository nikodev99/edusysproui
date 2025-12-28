import RightSidePane from "@/components/ui/layout/RightSidePane.tsx";
import {EditProps} from "@/core/utils/interfaces.ts";
import {School} from "@/entity";
import {SchoolForm} from "@/components/forms/SchoolForm.tsx";
import {useForm} from "react-hook-form";
import {schoolSchema, SchoolSchema} from "@/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {hasField} from "@/core/utils/utils.ts";
import {PatchUpdate} from "@/core/PatchUpdate.ts";
import {useEffect, useState} from "react";
import {AddressOwner, UpdateType} from "@/core/shared/sharedEnums.ts";
import FormSuccess from "@/components/ui/form/FormSuccess.tsx";
import FormError from "@/components/ui/form/FormError.tsx";
import {Button} from "antd";
import {UpdateAddress} from "@/components/custom/UpdateAddress.tsx";

export const SchoolEditDrawer = ({open, close, data}: EditProps<School>) => {
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const [addressDrawer, setAddressDrawer] = useState<boolean>(false)

    const {watch, control, formState: {errors}} = useForm<SchoolSchema>({
        resolver: zodResolver(schoolSchema)
    })

    const formData = watch()

    useEffect(() => {
        if(!open) {
            setErrorMessage(undefined)
            setSuccessMessage(undefined)
        }
    }, [open]);

    const showAddressDrawer = () => {
        setAddressDrawer(true)
    }

    const closeAddressDrawer = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        setAddressDrawer(false)
    }

    const handleSchoolUpdate = async (field: keyof School) => {
        if (data.id) {
            if (hasField(data, field as keyof School)) {
                await PatchUpdate.set(
                    field,
                    formData,
                    data.id,
                    setSuccessMessage,
                    setErrorMessage,
                    UpdateType.SCHOOL
                )
            }
        }
    }

    return(
        <RightSidePane open={open} onClose={close} destroyOnClose>
            {successMessage && (<FormSuccess message={successMessage} />)}
            {errorMessage && (<FormError message={errorMessage} />)}
            <SchoolForm
                edit
                control={control}
                errors={errors}
                data={data}
                handleUpdate={handleSchoolUpdate}
            />
            <section>
                <div style={{marginBottom: 10}}>
                    <Button type='dashed' onClick={showAddressDrawer}>Modifier Adresse </Button>
                </div>
            </section>
            <UpdateAddress
                data={data}
                open={addressDrawer}
                close={closeAddressDrawer}
                personal={AddressOwner.SCHOOL}
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
            />
        </RightSidePane>
    )
}