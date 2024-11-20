import RightSidePane from "../ui/layout/RightSidePane.tsx";
import {Address} from "../../entity";
import AddressForm from "../forms/AddressForm.tsx";
import {useForm} from "react-hook-form";
import {addressSchema, AddressSchema} from "../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {PatchUpdate} from "../../core/PatchUpdate.ts";
import {CustomUpdateProps} from "../../utils/interfaces.ts";
import {AddressOwner} from "../../core/shared/sharedEnums.ts";

export const UpdateAddress = ({data, open, close, personal, setSuccessMessage, setErrorMessage}: CustomUpdateProps) => {

    const {control, formState: {errors}, watch} = useForm<AddressSchema>({
        resolver: zodResolver(addressSchema)
    })

    const addressData = watch()

    const handleAddressUpdate = async (field: keyof Address) => {
        if (data?.personalInfo?.address.id) {
            await PatchUpdate.address(
                field,
                addressData,
                data?.personalInfo?.address.id,
                setSuccessMessage,
                setErrorMessage,
            )
        }
    }

    return(
        <RightSidePane loading={data?.personalInfo?.address === undefined} open={open} onClose={close} className='address__drawer'>
            <AddressForm
                control={control}
                errors={errors}
                type={personal as AddressOwner}
                edit={true}
                data={data?.personalInfo?.address}
                handleUpdate={handleAddressUpdate}
            />
        </RightSidePane>
    )
}