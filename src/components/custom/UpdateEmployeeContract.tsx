import {CustomUpdateProps} from "@/core/utils/interfaces.ts";
import {Employee, EmployeeContract, Teacher} from "@/entity";
import {useForm} from "react-hook-form";
import {EmployeeContractSchema, employeeContractSchema} from "@/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import RightSidePane from "@/components/ui/layout/RightSidePane.tsx";
import {useMemo} from "react";
import {EmployeeContractForm} from "@/components/forms/EmployeeContractForm.tsx";
import {ContractOwner} from "@/core/shared/sharedEnums.ts";
import {PatchUpdate} from "@/core/PatchUpdate.ts";

export const UpdateEmployeeContract = (
    {data, open, close, personal, setSuccessMessage, setErrorMessage}: CustomUpdateProps<Teacher | Employee, ContractOwner>
) => {
    const {control, formState: {errors, isLoading, isSubmitting}, watch} = useForm<EmployeeContractSchema>({
        resolver: zodResolver(employeeContractSchema)
    })

    const contractData = useMemo(() => {
        return personal === ContractOwner.EMPLOYEE && 'contract' in data
            ? (data as Employee)?.contract : 'contract' in data
                ? (data as Teacher)?.contract
                : {} as EmployeeContract
    }, [data, personal])

    const loading = useMemo(() => !data || isLoading || isSubmitting, [data, isLoading, isSubmitting])

    const handleContractUpdate = async (field: keyof EmployeeContract) => {
        if ((contractData as EmployeeContract)?.id) {
            await PatchUpdate.contract(
                field as never,
                watch(),
                (contractData as EmployeeContract)?.id,
                setSuccessMessage,
                setErrorMessage,
            )
        }
    }
    
    return(
        <RightSidePane loading={loading} open={open} onClose={close} className='address__drawer'>
            <EmployeeContractForm
                control={control}
                errors={errors}
                type={personal}
                edit={true}
                data={contractData}
                handleUpdate={handleContractUpdate}
            />
        </RightSidePane>
    )
}