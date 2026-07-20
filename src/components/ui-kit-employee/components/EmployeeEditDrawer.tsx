import RightSidePane from "@/components/ui/layout/RightSidePane.tsx";
import {EditProps} from "@/core/utils/interfaces.ts";
import {Employee} from "@/entity";
import {useEffect, useState} from "react";
import {useToggle} from "@/hooks/useToggle.ts";
import {AddressOwner, ContractOwner, IndividualType} from "@/core/shared/sharedEnums.ts";
import FormSuccess from "@/components/ui/form/FormSuccess.tsx";
import FormError from "@/components/ui/form/FormError.tsx";
import {UpdatePersonalData} from "@/components/custom/UpdatePersonalData.tsx";
import {Button, Space} from "antd";
import {UpdateAddress} from "@/components/custom/UpdateAddress.tsx";
import {UpdateEmployeeContract} from "@/components/custom/UpdateEmployeeContract.tsx";

export const EmployeeEditDrawer = ({open, close, data}: EditProps<Employee>) => {
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const [addressDrawer, showAddressDrawer] = useToggle(false)
    const [employeeJob, showEmployeeJob] = useToggle(false)

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
            <Space direction='vertical'>
                <Button type='dashed' onClick={showAddressDrawer}>Modifier adresse </Button>
                <Button type='dashed' onClick={showEmployeeJob}>Modifier termes du contrat</Button>
            </Space>
            {employeeJob && <UpdateEmployeeContract
                data={data}
                personal={ContractOwner.EMPLOYEE}
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
                close={closeEmployeeDrawer}
                open={employeeJob}
            />}
            {addressDrawer && <UpdateAddress
                data={data}
                personal={AddressOwner.EMPLOYEE}
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
                close={closeAddressDrawer}
                open={addressDrawer}
            />}
        </RightSidePane>
    )
}