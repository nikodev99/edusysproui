import RightSidePane from "../../ui/layout/RightSidePane.tsx";
import {EditProps} from "../../../utils/interfaces.ts";
import {Address, Guardian} from "../../../entity";
import GuardianForm from "../../forms/GuardianForm.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    guardianSchema,
    addressSchema,
    GuardianSchema,
    AddressSchema,
    IndividualSchema,
    individualSchema
} from "../../../schema";
import AddressForm from "../../forms/AddressForm.tsx";
import {AddressOwner, IndividualType} from "../../../core/shared/sharedEnums.ts";
import {Button} from "antd";
import {useEffect, useState} from "react";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {updateStudent} from "../../../data";
import {Gender} from "../../../entity/enums/gender.ts";
import {IndividualForm} from "../../forms/IndividualForm.tsx";
import {Individual} from "../../../entity/domain/individual.ts";
import {hasField} from "../../../utils/utils.ts";
import {PatchUpdate} from "../../../core/PatchUpdate.ts";

export const GuardianEditDrawer = ({isLoading, open, close, data}: EditProps<Guardian>) => {

    const [addressDrawer, setAddressDrawer] = useState<boolean>(false)
    const [jobDrawer, setJobDrawer] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const {watch, control, formState: {errors}} = useForm<GuardianSchema>({
        resolver: zodResolver(guardianSchema)
    })

    const zodAddress = useForm<AddressSchema>({
        resolver: zodResolver(addressSchema)
    })

    const zodInfo = useForm<IndividualSchema>({
        resolver: zodResolver(individualSchema)
    })

    const guardianData = watch()
    const addressData = zodAddress.watch()
    const infoData = zodInfo.watch()

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
                await updateStudent(field, guardianData[field as keyof GuardianSchema], data.id, 2)
                    .then(({isSuccess, success, error}) => {
                        if (isSuccess) {
                            setSuccessMessage(success)
                        } else {
                            setErrorMessage(error)
                        }
                    })
                    .catch(err => setErrorMessage(`An unexpected error occurred: ${err.error.message}`))
            }else {
                await PatchUpdate.set(field, infoData, data?.personalInfo?.id, setSuccessMessage, setErrorMessage)
            }
        }
    }

    const handleAddressUpdate = async (field: keyof Address) => {
        if (data?.personalInfo.address?.id) {
            await updateStudent(field, addressData[field as keyof AddressSchema], data?.personalInfo.address?.id as number, 0)
                .then(({isSuccess, success, error}) => {
                    if (isSuccess) {
                        setSuccessMessage(success)
                    }else {
                        setErrorMessage(error)
                    }
                })
        }
    }

    return(
        <RightSidePane loading={isLoading} open={open} onClose={close} className='edit-drawer' destroyOnClose>
            {successMessage && (<FormSuccess message={successMessage} />)}
            {errorMessage && (<FormError message={errorMessage} />)}
            <IndividualForm
                control={zodInfo.control}
                edit
                errors={zodInfo.formState.errors}
                type={IndividualType.GUARDIAN}
                showField={data?.personalInfo?.gender === Gender.FEMME}
                data={data?.personalInfo}
                handleUpdate={handleGuardianUpdate}
            />
            <section>
                <div style={{marginBottom: 10}}>
                    <Button type='dashed' onClick={showAddressDrawer}>Modifier Adresse </Button>
                </div>
                <div>
                    <Button type='dashed' onClick={showJobDrawer}>Modifier Emploie </Button>
                </div>
            </section>
            <RightSidePane loading={data?.personalInfo?.address === null} open={addressDrawer}
                           onClose={closeAddressDrawer}
                           className='address__drawer'>
                <AddressForm
                    control={zodAddress.control}
                    errors={zodAddress.formState.errors}
                    type={AddressOwner.GUARDIAN}
                    edit={true}
                    data={data?.personalInfo?.address}
                    handleUpdate={handleAddressUpdate}
                />
            </RightSidePane>
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