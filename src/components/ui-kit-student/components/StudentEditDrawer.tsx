import RightSidePane from "../../ui/layout/RightSidePane.tsx";
import {useForm} from "react-hook-form";
import {EditProps} from "../../../utils/interfaces.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    addressSchema,
    AddressSchema,
    healthSchema,
    HealthSchema,
    individualSchema,
    IndividualSchema,
    studentSchema,
    StudentSchema
} from "../../../schema";
import {Address, HealthCondition, Student} from "../../../entity";
import StudentForm from "../../forms/StudentForm.tsx";
import {Button} from "antd";
import {useEffect, useState} from "react";
import AddressForm from "../../forms/AddressForm.tsx";
import {AddressOwner, IndividualType, UpdateType} from "../../../core/shared/sharedEnums.ts";
import HealthConditionForm from "../../forms/HealthConditionForm.tsx";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {Individual} from "../../../entity/domain/individual.ts";
import {hasField} from "../../../utils/utils.ts";
import {IndividualForm} from "../../forms/IndividualForm.tsx";
import {PatchUpdate} from "../../../core/PatchUpdate.ts";
import {useToggle} from "../../../hooks/useToggle.ts";

export const StudentEditDrawer = ({open, close, isLoading, data}: EditProps<Student>) => {

    const [parentDrawer, showDrawer] = useToggle(false);
    const [addressDrawer, showAddressDrawer] = useToggle(false)
    const [healthDrawer, showHealthDrawer] = useToggle(false)
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const {watch, control, formState: {errors}} = useForm<StudentSchema>({
        resolver: zodResolver(studentSchema)
    })
    const zodAddress = useForm<AddressSchema>({
        resolver: zodResolver(addressSchema)
    })
    const zodHealth = useForm<HealthSchema>({
        resolver: zodResolver(healthSchema)
    })

    const zodInfo = useForm<IndividualSchema>({
        resolver: zodResolver(individualSchema)
    })

    const studentData = watch()
    const addressData = zodAddress.watch()
    const healthData = zodHealth.watch()
    const infoData = zodInfo.watch()

    useEffect(() => {
        console.log("Info Data: ", zodInfo)
        console.log("Address Data: ", zodAddress)
        if(successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(undefined)
                setSuccessMessage(undefined)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [errorMessage, successMessage, zodAddress, zodInfo]);

    const closeDrawer = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        showDrawer()
    }

    const closeAddressDrawer = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        showAddressDrawer()
    }

    const closeHealthDrawer = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        showHealthDrawer()
    }

    const handleStudentUpdate = async (field: keyof Student | keyof Individual) => {
        if (data.id) {
            if (hasField(data, field as keyof Student)) {
                await PatchUpdate.set(
                    field,
                    studentData,
                    data?.id,
                    setSuccessMessage,
                    setErrorMessage,
                )

            }else {
                if(data?.personalInfo?.id) {
                    await PatchUpdate.set(
                        field,
                        infoData,
                        data?.personalInfo?.id,
                        setSuccessMessage,
                        setErrorMessage,
                        UpdateType.INFO
                    )
                }
            }
        }
    }

    const handleAddressUpdate = async (field: keyof Address) => {
        if (data?.personalInfo?.address.id) {
            await PatchUpdate.set(
                field,
                addressData,
                data?.personalInfo?.address.id,
                setSuccessMessage,
                setErrorMessage,
                UpdateType.ADDRESS
            )
        }
    }

    const handleHealthUpdate = async (field: keyof HealthCondition) => {
        if (data.id) {
            await PatchUpdate.set(
                field,
                healthData,
                data.id,
                setSuccessMessage,
                setErrorMessage,
                UpdateType.HEALTH
            )
        }
    }

    return (
        <RightSidePane loading={isLoading} open={open} onClose={close} className='edit-drawer' destroyOnClose>
            <IndividualForm
                control={zodInfo.control}
                errors={zodInfo.formState.errors}
                edit={true}
                data={data?.personalInfo}
                handleUpdate={handleStudentUpdate}
                type={IndividualType.STUDENT}
            />
            {successMessage && (<FormSuccess message={successMessage} />)}
            {errorMessage && (<FormError message={errorMessage} />)}
            <section>
                <div style={{marginBottom: 10}}>
                    <Button type='dashed' onClick={showAddressDrawer}>Modifier l'adresse </Button>
                </div>
                <div style={{marginBottom: 10}}>
                    <Button type='dashed' onClick={showHealthDrawer}>Modifier les conditions médicales </Button>
                </div>
                <div>
                    <Button type='dashed' onClick={showDrawer}>Modifier les parents </Button>
                </div>
            </section>
            <RightSidePane loading={isLoading} open={parentDrawer} onClose={closeDrawer}>
                <StudentForm control={control} errors={errors} edit={true} data={data} handleUpdate={handleStudentUpdate} />
            </RightSidePane>
            <RightSidePane loading={data?.personalInfo?.address === undefined} open={addressDrawer} onClose={closeAddressDrawer} className='address__drawer'>
                <AddressForm
                    control={zodAddress.control}
                    errors={zodAddress.formState.errors}
                    type={AddressOwner.STUDENT}
                    edit={true}
                    data={data.personalInfo?.address}
                    handleUpdate={handleAddressUpdate}
                />
            </RightSidePane>
            <RightSidePane loading={data?.healthCondition === undefined} open={healthDrawer} onClose={closeHealthDrawer} className='health__drawer'>
                <HealthConditionForm
                    control={zodHealth.control}
                    errors={zodHealth.formState.errors}
                    edit={true}
                    data={data?.healthCondition}
                    handleUpdate={handleHealthUpdate}
                />
            </RightSidePane>
        </RightSidePane>
    )
}