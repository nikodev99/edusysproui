import {InsertModal} from "../../custom/InsertSchema.tsx";
import {useForm} from "react-hook-form";
import {
    AllSemesterTemplateSchema, allSemesterTemplateSchema
} from "../../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMemo} from "react";
import {saveAllSemesters} from "../../../data/repository/semesterRepository.ts";
import {SemesterTemplateForm} from "../../forms/SemesterTemplateForm.tsx";
import {Semester} from "../../../entity";
import {getUniqueness} from "../../../core/utils/utils.ts";

export const SaveSemesterTemplate = ({open, onClose, semesters, schoolId}: {
    open: boolean,
    onClose: () => void,
    semesters?: Semester[],
    schoolId?: string
}) => {
    const form = useForm<AllSemesterTemplateSchema>({
        resolver: zodResolver(allSemesterTemplateSchema)
    })

    const { control, formState: {errors}, clearErrors } = form

    const templates = useMemo(() => {
        return semesters && semesters?.length > 0 ? getUniqueness(semesters, s => s.template, t => t.id) : []
    }, [semesters])

    const explain = useMemo(() => "La subdivision en semestres ou trimestres structure l’année académique pour faciliter " +
        "la planification, l’évaluation des étudiants et la gestion administrative. ", [])

    const onSubmit = (data: AllSemesterTemplateSchema) => {
        const registeredData = {
            semesters: data?.semesters?.map(semester => ({
                ...semester,
                schoolId: schoolId,
            }))
        }

        return saveAllSemesters(registeredData)
    }

    return(
        <InsertModal
            open={open}
            onCancel={onClose}
            title="Enregistrer une nouvelle structure"
            data={allSemesterTemplateSchema}
            customForm={
                <SemesterTemplateForm
                    control={control}
                    errors={errors}
                    clearErrors={clearErrors}
                    data={templates}
                    parent={'semesters'}
                />
            }
            messageSuccess={"Nouvelle structure enregistrer avec success"}
            okText={"Sauvegarder"}
            handleForm={form}
            postFunc={onSubmit}
            explain={explain}
            marquee
        />
    )
}