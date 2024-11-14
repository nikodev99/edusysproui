import {EditProps} from "../../../utils/interfaces.ts";
import RightSidePane from "../../ui/layout/RightSidePane.tsx";
import {TeacherForm} from "../../forms/TeacherForm.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    AddressSchema,
    addressSchema,
    individualSchema,
    IndividualSchema,
    TeacherSchema,
    teacherSchema
} from "../../../schema";
import {Teacher} from "../../../entity";
import {useState} from "react";
import {useToggle} from "../../../hooks/useToggle.ts";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {Button} from "antd";
import AddressForm from "../../forms/AddressForm.tsx";
import {AddressOwner, IndividualType} from "../../../core/shared/sharedEnums.ts";
import {IndividualForm} from "../../forms/IndividualForm.tsx";

const TeacherEditDrawer = ({open, close, isLoading, data}: EditProps<Teacher>) => {

    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const [addressDrawer, showAddressDrawer] = useToggle(false)
    const [teacherJob, showTeacherJob] = useToggle(false)

    const {watch, control, formState: {errors}} = useForm<TeacherSchema>({
        resolver: zodResolver(teacherSchema)
    })

    const zodAddress = useForm<AddressSchema>({
        resolver: zodResolver(addressSchema)
    })

    const zodInfo = useForm<IndividualSchema>({
        resolver: zodResolver(individualSchema)
    })

    const teacherData = watch()
    const addressData = zodAddress.watch()

    const closeAddressDrawer = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        showAddressDrawer()
    }

    const closeTeacherJob = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        showTeacherJob()
    }

    return(
        <RightSidePane loading={data?.personalInfo === null} open={open} onClose={close}>
            {successMessage && (<FormSuccess message={successMessage}/>)}
            {errorMessage && (<FormError message={errorMessage}/>)}
            <IndividualForm
                control={zodInfo.control}
                errors={zodInfo.formState.errors}
                type={IndividualType.TEACHER}
                data={data?.personalInfo}
                edit
                handleUpdate={() => alert("Vous avez cliqué")}
            />
            <section>
                <div style={{marginBottom: 10}}>
                    <Button type='dashed' onClick={showAddressDrawer}>Modifier l'adresse </Button>
                </div>
                <div>
                    <Button type='dashed' onClick={showTeacherJob}>Modifier Salariale </Button>
                </div>
            </section>
            <RightSidePane loading={isLoading} open={teacherJob} onClose={closeTeacherJob}>
                <TeacherForm
                    control={control}
                    errors={errors}
                    edit={true}
                    data={data}
                    handleUpdate={() => alert('toUpdate')}
                />
            </RightSidePane>
            <RightSidePane loading={data?.personalInfo?.address === undefined} open={addressDrawer} onClose={closeAddressDrawer} className='address__drawer'>
                <AddressForm
                    control={zodAddress.control}
                    errors={zodAddress.formState.errors}
                    type={AddressOwner.TEACHER}
                    edit={true}
                    data={data?.personalInfo?.address}
                    handleUpdate={() => alert('address edit')}
                />
            </RightSidePane>
        </RightSidePane>
    )
}

export {TeacherEditDrawer}