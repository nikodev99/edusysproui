import {CustomUpdateProps} from "../../utils/interfaces.ts";
import {IndividualType, UpdateType} from "../../core/shared/sharedEnums.ts";
import {IndividualForm} from "../forms/IndividualForm.tsx";
import {useForm} from "react-hook-form";
import {individualSchema, IndividualSchema} from "../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {PatchUpdate} from "../../core/PatchUpdate.ts";
import {Individual} from "../../entity/domain/individual.ts";
import {Gender} from "../../entity/enums/gender.tsx";

export const UpdatePersonalData = ({data, setSuccessMessage, setErrorMessage, personal}: CustomUpdateProps) => {

    const {control, formState: {errors}, watch} = useForm<IndividualSchema>({
        resolver: zodResolver(individualSchema)
    })

    const infoData = watch()

    const handlePersonalInfoUpdate = async (field: keyof Individual) => {
        if(data?.personalInfo?.id) {
            await PatchUpdate.set(
                field,
                infoData,
                data?.personalInfo?.id,
                setSuccessMessage,
                setErrorMessage,
                UpdateType.INFO
            )
        }
    }

    return(
        <IndividualForm
            control={control}
            errors={errors}
            type={personal as IndividualType}
            data={data?.personalInfo}
            showField={data?.personalInfo?.gender === Gender.FEMME}
            edit
            handleUpdate={handlePersonalInfoUpdate}
        />
    )
}