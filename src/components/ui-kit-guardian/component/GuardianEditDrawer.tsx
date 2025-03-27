import RightSidePane from "../../ui/layout/RightSidePane.tsx";
import {EditProps} from "../../../core/utils/interfaces.ts";
import {Guardian} from "../../../entity";
import GuardianForm from "../../forms/GuardianForm.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {guardianSchema, GuardianSchema} from "../../../schema";
import {AddressOwner, IndividualType, UpdateType} from "../../../core/shared/sharedEnums.ts";
import {Button} from "antd";
import {useEffect, useState} from "react";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {Individual} from "../../../entity/domain/individual.ts";
import {hasField} from "../../../core/utils/utils.ts";
import {UpdateAddress} from "../../custom/UpdateAddress.tsx";
import {UpdatePersonalData} from "../../custom/UpdatePersonalData.tsx";
import {PatchUpdate} from "../../../core/PatchUpdate.ts";

export const GuardianEditDrawer = ({isLoading, open, close, data}: EditProps<Guardian>) => {

    const [addressDrawer, setAddressDrawer] = useState<boolean>(false)
    const [jobDrawer, setJobDrawer] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const {watch, control, formState: {errors}} = useForm<GuardianSchema>({
        resolver: zodResolver(guardianSchema)
    })

    const guardianData = watch()

    useEffect(() => {
        if(!open) {
            setErrorMessage(undefined)
            setSuccessMessage(undefined)
        }
    }, [open]);

    const showAddressDrawer = () => {
        setAddressDrawer(true)
    }

    const showJobDrawer = () => {
        setJobDrawer(true)
    }

    const closeAddressDrawer = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        setAddressDrawer(false)
    }

    const closeJobDrawer = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        setJobDrawer(false)
    }

    const handleGuardianUpdate = async (field: keyof Guardian | keyof Individual) => {
        if (data.id) {
            if (hasField(data, field as keyof Guardian)) {
                await PatchUpdate.set(
                    field,
                    guardianData,
                    data.id,
                    setSuccessMessage,
                    setErrorMessage,
                    UpdateType.GUARDIAN
                )
            }
        }
    }

    return(
        <RightSidePane loading={isLoading} open={open} onClose={close} className='edit-drawer' destroyOnClose>
            {successMessage && (<FormSuccess message={successMessage} />)}
            {errorMessage && (<FormError message={errorMessage} />)}
            <UpdatePersonalData
                data={data}
                personal={IndividualType.GUARDIAN}
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
            />
            <section>
                <div style={{marginBottom: 10}}>
                    <Button type='dashed' onClick={showAddressDrawer}>Modifier Adresse </Button>
                </div>
                <div>
                    <Button type='dashed' onClick={showJobDrawer}>Modifier Emploie </Button>
                </div>
            </section>
            <UpdateAddress
                data={data}
                open={addressDrawer}
                close={closeAddressDrawer}
                personal={AddressOwner.GUARDIAN}
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
            />
            <RightSidePane loading={isLoading} open={jobDrawer} onClose={closeJobDrawer}>
                <GuardianForm
                    edit
                    control={control}
                    errors={errors}
                    data={data}
                    handleUpdate={handleGuardianUpdate}
                />
            </RightSidePane>
        </RightSidePane>
    )
}