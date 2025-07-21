import RightSidePane from "../../ui/layout/RightSidePane.tsx";
import {EditProps} from "../../../core/utils/interfaces.ts";
import {Employee, Individual} from "../../../entity";
import {useEffect, useState} from "react";
import {useToggle} from "../../../hooks/useToggle.ts";
import {useForm} from "react-hook-form";
import {EmployeeSchema} from "../../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {employeeSchema} from "../../../schema/models/employeeSchema.ts";
import {hasField} from "../../../core/utils/utils.ts";
import {PatchUpdate} from "../../../core/PatchUpdate.ts";
import {AddressOwner, IndividualType, UpdateType} from "../../../core/shared/sharedEnums.ts";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {UpdatePersonalData} from "../../custom/UpdatePersonalData.tsx";
import {Button} from "antd";
import {EmployeeForm} from "../../forms/EmployeeForm.tsx";
import {UpdateAddress} from "../../custom/UpdateAddress.tsx";

export const EmployeeEditDrawer = ({open, close, isLoading, data}: EditProps<Employee>) => {
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const [addressDrawer, showAddressDrawer] = useToggle(false)
    const [employeeJob, showEmployeeJob] = useToggle(false)

    const {watch, control, formState: {errors}} = useForm<EmployeeSchema>({
        resolver: zodResolver(employeeSchema)
    })

    const formData = watch()

    useEffect(() => {

    }, []);

    const closeAddressDrawer = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        showAddressDrawer()
    }

    const closeEmployeeDrawer = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        showEmployeeJob()
    }

    const handleEmployeeUpdate = async (field: keyof Employee | keyof Individual) => {
        if (data?.id) {
            if (hasField(data, field as keyof Employee)) {
                await PatchUpdate.set(
                    field,
                    formData,
                    data.id,
                    setSuccessMessage,
                    setErrorMessage,
                    UpdateType.EMPLOYEE,
                )
            }
        }
    }

    return(
        <RightSidePane loading={data?.personalInfo === null} open={open} onClose={close}>
            {successMessage && (<FormSuccess message={successMessage} isNotif />)}
            {errorMessage && (<FormError message={errorMessage} isNotif />)}
            <UpdatePersonalData
                data={data}
                personal={IndividualType.EMPLOYEE}
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
            />
            <section>
                <div style={{marginBottom: 10}}>
                    <Button type='dashed' onClick={showAddressDrawer}>Modifier l'adresse </Button>
                </div>
                <div>
                    <Button type='dashed' onClick={showEmployeeJob}>Modifier Employée</Button>
                </div>
            </section>
            <RightSidePane loading={isLoading} open={employeeJob} onClose={closeEmployeeDrawer}>
                <EmployeeForm
                    control={control}
                    errors={errors}
                    edit={true}
                    data={data}
                    handleUpdate={handleEmployeeUpdate}
                />
            </RightSidePane>
            <UpdateAddress
                data={data}
                personal={AddressOwner.EMPLOYEE}
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
                close={closeAddressDrawer}
                open={addressDrawer}
            />
        </RightSidePane>
    )
}