import {UpdateSchema} from "../../custom/UpdateSchema.tsx";
import {useForm} from "react-hook-form";
import {planningSchema, PlanningSchema} from "../../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {updatePlanning} from "../../../data/repository/planningRepository.ts";
import {SinglePlanningForm} from "../../forms/PlanningForm.tsx";
import {Planning} from "../../../entity";
import {useMemo, useEffect} from "react";

export const PlanningUpdateModal = ({isOpen, onClose, academicYearId, data}: {
    isOpen: boolean, onClose: () => void, academicYearId: string, data?: Planning
}) => {
    const form = useForm<PlanningSchema>({
        resolver: zodResolver(planningSchema)
    })
    
    const defaultData = useMemo(() => data, [data])

    useEffect(() => {
        form.reset(defaultData as PlanningSchema);
    }, [defaultData, form]);


    const {control, formState: {errors}} = form

    return(<UpdateSchema
        data={planningSchema}
        customForm={<SinglePlanningForm
            control={control}
            errors={errors}
            data={defaultData}
            academicYear={academicYearId}
        />}
        open={isOpen}
        onCancel={onClose}
        messageSuccess='Modifications effectuées avec succès'
        title={'Modification de planning'}
        okText={'Modifier'}
        description={'Appuyer sur "confirmer" pour appliquer les changements'}
        handleForm={form}
        id={data?.id || 0}
        putFunc={updatePlanning}
    />)
}