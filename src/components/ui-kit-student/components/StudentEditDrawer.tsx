import RightSidePane from "../../ui/layout/RightSidePane.tsx";
import {useForm} from "react-hook-form";
import {AddressSchema, EditProps, HealthSchema, StudentSchema} from "../../../utils/interfaces.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {studentSchema} from "../../../schema";
import {Address, HealthCondition, Student} from "../../../entity";
import StudentForm from "../../forms/StudentForm.tsx";
import {Button} from "antd";
import {useEffect, useState} from "react";
import AddressForm from "../../forms/AddressForm.tsx";
import {AddressOwner} from "../../../core/shared/sharedEnums.ts";
import {addressSchema} from "../../../schema/models/addressSchema.ts";
import HealthConditionForm from "../../forms/HealthConditionForm.tsx";
import {healthSchema} from "../../../schema/models/healthSchema.ts";
import {updateStudent} from "../../../data";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";

export const StudentEditDrawer = ({open, close, isLoading, data}: EditProps<Student>) => {

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

    const handleStudentUpdate = async (field: keyof Student) => {
        if (data.id) {
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
        }
    }

    const handleAddressUpdate = async (field: keyof Address) => {
        if (data?.address.id) {
            await updateStudent(field, addressData[field as keyof AddressSchema], data?.address.id, 0)
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
            <StudentForm control={control} errors={errors} edit={true} data={data} handleUpdate={handleStudentUpdate} />
            {successMessage && (<FormSuccess message={successMessage} />)}
            {errorMessage && (<FormError message={errorMessage} />)}
            <section>
                <div style={{marginBottom: 10}}>
                    <Button type='dashed' onClick={showAddressDrawer}>Modifier l'adresse </Button>
                </div>
                <div>
                    <Button type='dashed' onClick={showHealthDrawer}>Modifier les conditions médicales </Button>
                </div>
            </section>
            <RightSidePane loading={data.address === null} open={addressDrawer} onClose={closeAddressDrawer} className='address__drawer'>
                <AddressForm
                    control={zodAddress.control}
                    errors={zodAddress.formState.errors}
                    type={AddressOwner.STUDENT}
                    edit={true}
                    data={data.address}
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