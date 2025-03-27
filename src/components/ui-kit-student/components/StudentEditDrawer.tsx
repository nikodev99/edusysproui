import RightSidePane from "../../ui/layout/RightSidePane.tsx";
import {useForm} from "react-hook-form";
import {EditProps} from "../../../core/utils/interfaces.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {healthSchema, HealthSchema, studentSchema, StudentSchema} from "../../../schema";
import {HealthCondition, Student} from "../../../entity";
import StudentForm from "../../forms/StudentForm.tsx";
import {Button} from "antd";
import {useEffect, useState} from "react";
import {AddressOwner, IndividualType, UpdateType} from "../../../core/shared/sharedEnums.ts";
import HealthConditionForm from "../../forms/HealthConditionForm.tsx";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {hasField} from "../../../core/utils/utils.ts";
import {PatchUpdate} from "../../../core/PatchUpdate.ts";
import {useToggle} from "../../../hooks/useToggle.ts";
import {UpdateAddress} from "../../custom/UpdateAddress.tsx";
import {UpdatePersonalData} from "../../custom/UpdatePersonalData.tsx";

export const StudentEditDrawer = ({open, close, isLoading, data}: EditProps<Student>) => {

    const [parentDrawer, showDrawer] = useToggle(false);
    const [addressDrawer, showAddressDrawer] = useToggle(false)
    const [healthDrawer, showHealthDrawer] = useToggle(false)
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const {watch, control, formState: {errors}} = useForm<StudentSchema>({
        resolver: zodResolver(studentSchema)
    })
    const zodHealth = useForm<HealthSchema>({
        resolver: zodResolver(healthSchema)
    })

    const studentData = watch()
    const healthData = zodHealth.watch()

    useEffect(() => {
        if(successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(undefined)
                setSuccessMessage(undefined)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [errorMessage, successMessage]);

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

    const handleStudentUpdate = async (field: keyof Student) => {
        if (data.id) {
            if (hasField(data, field as keyof Student)) {
                await PatchUpdate.set(
                    field,
                    studentData,
                    data?.id,
                    setSuccessMessage,
                    setErrorMessage,
                )
            }
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
            <UpdatePersonalData
                data={data}
                personal={IndividualType.STUDENT}
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
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
                <StudentForm
                    control={control}
                    errors={errors}
                    edit={true}
                    data={data}
                    handleUpdate={handleStudentUpdate}
                />
            </RightSidePane>
            <UpdateAddress
                data={data}
                open={addressDrawer}
                close={closeAddressDrawer}
                personal={AddressOwner.STUDENT}
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
            />
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