import RightSidePane from "../../ui/layout/RightSidePane.tsx";
import {AddressSchema, EditProps, GuardianSchema} from "../../../utils/interfaces.ts";
import {Address, Guardian} from "../../../entity";
import GuardianForm from "../../forms/GuardianForm.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {guardianSchema} from "../../../schema";
import AddressForm from "../../forms/AddressForm.tsx";
import {AddressOwner} from "../../../core/shared/sharedEnums.ts";
import {Button} from "antd";
import {useEffect, useState} from "react";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {addressSchema} from "../../../schema/models/addressSchema.ts";
import {updateStudent} from "../../../data";
import {Gender} from "../../../entity/enums/gender.ts";

export const GuardianEditDrawer = ({isLoading, open, close, data}: EditProps<Guardian>) => {

    const [addressDrawer, setAddressDrawer] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const {watch, control, formState: {errors}} = useForm<GuardianSchema>({
        resolver: zodResolver(guardianSchema)
    })

    const zodAddress = useForm<AddressSchema>({
        resolver: zodResolver(addressSchema)
    })

    const guardianData = watch()
    const addressData = zodAddress.watch()

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

    const handleGuardianUpdate = async (field: keyof Guardian) => {
        if (data.id) {
            await updateStudent(field, guardianData[field as keyof GuardianSchema], data.id, 2)
                .then(({isSuccess, success, error}) => {
                    if(isSuccess) {
                        setSuccessMessage(success)
                    }else {
                        setErrorMessage(error)
                    }
                })
                .catch(err => setErrorMessage(`An unexpected error occurred: ${err.error.message}`))
        }
    }

    const handleAddressUpdate = async (field: keyof Address) => {
        if (data?.address?.id) {
            await updateStudent(field, addressData[field as keyof AddressSchema], data?.address?.id as number, 0)
                .then(({isSuccess, success, error}) => {
                    if (isSuccess) {
                        setSuccessMessage(success)
                    }else {
                        setErrorMessage(error)
                    }
                })
        }
    }

    console.log('Watcher: ', guardianData);

    return(
        <RightSidePane loading={isLoading} open={open} onClose={close} className='edit-drawer' destroyOnClose>
            {successMessage && (<FormSuccess message={successMessage} />)}
            {errorMessage && (<FormError message={errorMessage} />)}
            <GuardianForm
                edit
                control={control}
                errors={errors}
                data={data}
                showField={data.gender === Gender.FEMME}
                handleUpdate={handleGuardianUpdate}
            />
            <section>
                <div style={{marginBottom: 10}}>
                    <Button type='dashed' onClick={showAddressDrawer}>Modifier l'adresse </Button>
                </div>
            </section>
            <RightSidePane loading={data.address === null} open={addressDrawer} onClose={closeAddressDrawer}
                           className='address__drawer'>
                <AddressForm
                    control={zodAddress.control}
                    errors={zodAddress.formState.errors}
                    type={AddressOwner.GUARDIAN}
                    edit={true}
                    data={data.address}
                    handleUpdate={handleAddressUpdate}
                />
            </RightSidePane>
        </RightSidePane>
    )
}