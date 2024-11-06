import {AddressSchema, EditProps, TeacherSchema} from "../../../utils/interfaces.ts";
import RightSidePane from "../../ui/layout/RightSidePane.tsx";
import {TeacherForm} from "../../forms/TeacherForm.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {teacherSchema, addressSchema} from "../../../schema";
import {Teacher} from "../../../entity";
import {useState} from "react";
import {useToggle} from "../../../hooks/useToggle.ts";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {Button} from "antd";
import AddressForm from "../../forms/AddressForm.tsx";
import {AddressOwner} from "../../../core/shared/sharedEnums.ts";

const TeacherEditDrawer = ({open, close, isLoading, data}: EditProps<Teacher>) => {

    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const [addressDrawer, showAddressDrawer] = useToggle(false)

    const {watch, control, formState: {errors}} = useForm<TeacherSchema>({
        resolver: zodResolver(teacherSchema)
    })

    const zodAddress = useForm<AddressSchema>({
        resolver: zodResolver(addressSchema)
    })

    const teacherData = watch()
    const addressData = zodAddress.watch()

    const closeAddressDrawer = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        showAddressDrawer()
    }

    return(
        <RightSidePane loading={isLoading} open={open} onClose={close}>
            <TeacherForm control={control} errors={errors} edit={true} data={data}
                         handleUpdate={() => alert('toUpdate')}/>
            {successMessage && (<FormSuccess message={successMessage}/>)}
            {errorMessage && (<FormError message={errorMessage}/>)}
            <section>
                <div style={{marginBottom: 10}}>
                    <Button type='dashed' onClick={showAddressDrawer}>Modifier l'adresse </Button>
                </div>
            </section>
            <RightSidePane loading={data.address === null} open={addressDrawer} onClose={closeAddressDrawer} className='address__drawer'>
                <AddressForm
                    control={zodAddress.control}
                    errors={zodAddress.formState.errors}
                    type={AddressOwner.TEACHER}
                    edit={true}
                    data={data.address}
                    handleUpdate={() => alert('address edit')}
                />
            </RightSidePane>
        </RightSidePane>
    )
}

export {TeacherEditDrawer}