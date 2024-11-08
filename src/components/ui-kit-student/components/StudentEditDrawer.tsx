import RightSidePane from "../../ui/layout/RightSidePane.tsx";
import {useForm} from "react-hook-form";
import {EditProps} from "../../../utils/interfaces.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {addressSchema, AddressSchema, healthSchema, HealthSchema, studentSchema, StudentSchema} from "../../../schema";
import {Address, HealthCondition, Student} from "../../../entity";
import StudentForm from "../../forms/StudentForm.tsx";
import {Button} from "antd";
import {useEffect, useState} from "react";
import AddressForm from "../../forms/AddressForm.tsx";
import {AddressOwner, IndividualType} from "../../../core/shared/sharedEnums.ts";
import HealthConditionForm from "../../forms/HealthConditionForm.tsx";
import {updateStudent} from "../../../data";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {Individual} from "../../../entity/domain/individual.ts";
import {hasField} from "../../../utils/utils.ts";
import {IndividualForm} from "../../forms/IndividualForm.tsx";

export const StudentEditDrawer = ({open, close, isLoading, data}: EditProps<Student>) => {

    const [parentDrawer, setParentDrawer] = useState<boolean>(false);
    const [addressDrawer, setAddressDrawer] = useState<boolean>(false)
    const [healthDrawer, setHealthDrawer] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    useEffect(() => {
        if(successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(undefined)
                setSuccessMessage(undefined)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [errorMessage, successMessage]);

    const {watch, control, formState: {errors}} = useForm<StudentSchema>({
        resolver: zodResolver(studentSchema)
    })
    const zodAddress = useForm<AddressSchema>({
        resolver: zodResolver(addressSchema)
    })
    const zodHealth = useForm<HealthSchema>({
        resolver: zodResolver(healthSchema)
    })

    const studentData = watch()
    const addressData = zodAddress.watch()
    const healthData = zodHealth.watch()

    const showDrawer = () => {
        setParentDrawer(true)
    }
    const closeDrawer = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        setParentDrawer(false)
    }

    const showAddressDrawer = () => {
        setAddressDrawer(true)
    }
    const closeAddressDrawer = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        setAddressDrawer(false)
    }

    const showHealthDrawer = () => {
        setHealthDrawer(true)
    }
    const closeHealthDrawer = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        setHealthDrawer(false)
    }

    const handleStudentUpdate = async (field: keyof Student | keyof Individual) => {
        if (data.id) {
            if (hasField(data, field as keyof Student)) {
                await updateStudent(field, studentData[field as keyof StudentSchema], data.id)
                    .then(({isSuccess, success, error}) => {
                        if (isSuccess) {
                            setSuccessMessage(success)
                        }else {
                            setErrorMessage(error)
                        }
                    })
                    .catch((err) => {
                        setErrorMessage(`An unexpected error occurred: ${err.error.message}`);
                    })
            }else {
                //TODO Handle the individual update
            }

        }
    }

    const handleAddressUpdate = async (field: keyof Address) => {
        if (data?.personalInfo.address.id) {
            await updateStudent(field, addressData[field as keyof AddressSchema], data?.personalInfo.address.id, 0)
                .then(({isSuccess, success, error}) => {
                    if (isSuccess) {
                        setSuccessMessage(success)
                    }else {
                        setErrorMessage(error)
                    }
                })
        }
    }

    const handleHealthUpdate = async (field: keyof HealthCondition) => {
        if (data.id) {
            await updateStudent(field, healthData[field as keyof HealthSchema], data.id, 1)
                .then(({isSuccess, success, error}) => {
                    if (isSuccess) {
                        setSuccessMessage(success)
                    }else {
                        setErrorMessage(error)
                    }
                })
        }
    }

    return (
        <RightSidePane loading={isLoading} open={open} onClose={close} className='edit-drawer' destroyOnClose>
            <IndividualForm
                control={control}
                errors={errors}
                edit={true}
                data={data.personalInfo}
                handleUpdate={handleStudentUpdate}
                type={IndividualType.STUDENT}
            />
            {successMessage && (<FormSuccess message={successMessage} />)}
            {errorMessage && (<FormError message={errorMessage} />)}
            <section>
                <div style={{marginBottom: 10}}>
                    <Button type='dashed' onClick={showDrawer}>Modification </Button>
                </div>
                <div style={{marginBottom: 10}}>
                    <Button type='dashed' onClick={showAddressDrawer}>Modifier l'adresse </Button>
                </div>
                <div>
                    <Button type='dashed' onClick={showHealthDrawer}>Modifier les conditions médicales </Button>
                </div>
            </section>
            <RightSidePane loading={isLoading} open={parentDrawer} onClose={closeDrawer}>
                <StudentForm control={control} errors={errors} edit={true} data={data} handleUpdate={handleStudentUpdate} />
            </RightSidePane>
            <RightSidePane loading={data?.personalInfo.address === null} open={addressDrawer} onClose={closeAddressDrawer} className='address__drawer'>
                <AddressForm
                    control={zodAddress.control}
                    errors={zodAddress.formState.errors}
                    type={AddressOwner.STUDENT}
                    edit={true}
                    data={data.personalInfo.address}
                    handleUpdate={handleAddressUpdate}
                />
            </RightSidePane>
            <RightSidePane loading={false} open={healthDrawer} onClose={closeHealthDrawer} className='health__drawer'>
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