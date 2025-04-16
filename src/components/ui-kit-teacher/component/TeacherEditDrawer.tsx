import {EditProps} from "../../../core/utils/interfaces.ts";
import RightSidePane from "../../ui/layout/RightSidePane.tsx";
import {TeacherForm} from "../../forms/TeacherForm.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {TeacherSchema, teacherSchema} from "../../../schema";
import {Teacher, Individual} from "../../../entity";
import {useEffect, useState} from "react";
import {useToggle} from "../../../hooks/useToggle.ts";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {Button} from "antd";
import {AddressOwner, IndividualType, UpdateType} from "../../../core/shared/sharedEnums.ts";
import {hasField} from "../../../core/utils/utils.ts";
import {PatchUpdate} from "../../../core/PatchUpdate.ts";
import {UpdateAddress} from "../../custom/UpdateAddress.tsx";
import {UpdatePersonalData} from "../../custom/UpdatePersonalData.tsx";

const TeacherEditDrawer = ({open, close, isLoading, data}: EditProps<Teacher>) => {

    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const [addressDrawer, showAddressDrawer] = useToggle(false)
    const [teacherJob, showTeacherJob] = useToggle(false)

    const {watch, control, formState: {errors}} = useForm<TeacherSchema>({
        resolver: zodResolver(teacherSchema)
    })

    const teacherData = watch()

    useEffect(() => {
        if(successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(undefined)
                setSuccessMessage(undefined)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [errorMessage, successMessage]);

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

    const handleTeacherUpdate = async (field: keyof Teacher | keyof Individual) => {
        if (data.id) {
            if (hasField(data, field as keyof Teacher)) {
                await PatchUpdate.set(
                    field,
                    teacherData,
                    data?.id,
                    setSuccessMessage,
                    setErrorMessage,
                    UpdateType.TEACHER
                )
            }
        }
    }

    return(
        <RightSidePane loading={data?.personalInfo === null} open={open} onClose={close}>
            {successMessage && (<FormSuccess message={successMessage}/>)}
            {errorMessage && (<FormError message={errorMessage}/>)}
            <UpdatePersonalData
                data={data}
                personal={IndividualType.TEACHER}
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
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
                    handleUpdate={handleTeacherUpdate}
                />
            </RightSidePane>
            <UpdateAddress
                data={data}
                open={addressDrawer}
                close={closeAddressDrawer}
                personal={AddressOwner.TEACHER}
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
            />
        </RightSidePane>
    )
}

export {TeacherEditDrawer}