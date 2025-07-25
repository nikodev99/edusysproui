import RightSidePane from "../ui/layout/RightSidePane.tsx";
import {Address} from "../../entity";
import AddressForm from "../forms/AddressForm.tsx";
import {useForm} from "react-hook-form";
import {addressSchema, AddressSchema} from "../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {PatchUpdate} from "../../core/PatchUpdate.ts";
import {CustomUpdateProps} from "../../core/utils/interfaces.ts";
import {AddressOwner} from "../../core/shared/sharedEnums.ts";
import {useMemo} from "react";

export const UpdateAddress = ({data, open, close, personal, setSuccessMessage, setErrorMessage}: CustomUpdateProps) => {

    const {control, formState: {errors}, watch} = useForm<AddressSchema>({
        resolver: zodResolver(addressSchema)
    })
    
    const address: Address | undefined = useMemo(() => {
        return personal === AddressOwner.SCHOOL && 'address' in data 
            ? data.address : 'personalInfo' in data 
                ? data?.personalInfo?.address 
                : {} as Address
    }, [data, personal])

    const addressData = watch()

    const handleAddressUpdate = async (field: keyof Address) => {
        if (address?.id) {
            await PatchUpdate.address(
                field,
                addressData,
                address?.id,
                setSuccessMessage,
                setErrorMessage,
            )
        }
    }

    return(
        <RightSidePane loading={address === undefined} open={open} onClose={close} className='address__drawer'>
            <AddressForm
                control={control}
                errors={errors}
                type={personal as AddressOwner}
                edit={true}
                data={address}
                handleUpdate={handleAddressUpdate}
            />
        </RightSidePane>
    )
}