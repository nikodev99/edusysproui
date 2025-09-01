import {InsertModal} from "../../custom/InsertSchema.tsx";
import {PlanningSchema, planningSchema} from "../../../schema";
import {SinglePlanningForm} from "../../forms/PlanningForm.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {savePlanning} from "../../../data/repository/planningRepository.ts";

export const PlanningSaveModal = ({isOpen, onClose, academicYearId, gradeId}: {
    isOpen: boolean, onClose: () => void, academicYearId: string, gradeId?: number
}) => {
    const form = useForm<PlanningSchema>({
        resolver: zodResolver(planningSchema)
    })

    const {control, formState: {errors}} = form

    const handleSubmit = async (data: PlanningSchema) => {
        if (gradeId)
            data = {...data, grade: {id: gradeId}}

        return await savePlanning(data)
    }

    return(
        <InsertModal
            data={planningSchema}
            customForm={
                <SinglePlanningForm
                    control={control}
                    errors={errors}
                    academicYear={academicYearId}
                />
            }
            handleForm={form}
            postFunc={handleSubmit}
            open={isOpen}
            onCancel={onClose}
            messageSuccess='Nouveau planning créer avec succès'
            title='Ajouter un nouveau planning'
            okText='Ajouter'
            description='Appuyer sur confirmer pour ajouter le planning'
        />
    )
}