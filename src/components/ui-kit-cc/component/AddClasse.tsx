import {ModalProps} from "antd";
import {ClasseForm} from "../../forms/ClasseForm.tsx";
import {useForm} from "react-hook-form";
import {classeSchema, ClasseSchema} from "../../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {addClasse} from "../../../data/repository/classeRepository.ts";
import {InsertModal} from "../../custom/InsertSchema.tsx";
import {useGradeRepo} from "../../../hooks/useGradeRepo.ts";
import {useMemo} from "react";
import {isUniversity, SectionType} from "../../../entity/enums/section.ts";

export const AddClasse = ({open, onCancel}: ModalProps) => {
    const {gradeOptions} = useGradeRepo()
    
    const form = useForm<ClasseSchema>({
        resolver: zodResolver(classeSchema)
    })

    const {control, formState: {errors}, watch} = form
    const gradeId = useMemo(() => watch()?.grade?.id, [watch])

    const showField = useMemo(() => {
        if (gradeId) {
            const sectionEntered = gradeOptions?.find(g => g.value === gradeId)
            const show = isUniversity(SectionType[sectionEntered?.label as unknown as keyof typeof SectionType])
            console.log({sectionEntered, show})
            return show
        }
        return false
    }, [gradeId, gradeOptions])

    return(
        <InsertModal
            data={classeSchema}
            customForm={<ClasseForm control={control} errors={errors} gradeOptions={gradeOptions} showField={showField} />}
            postFunc={addClasse}
            open={open}
            onCancel={onCancel}
            messageSuccess="Nouvelle classe ajouter avec success"
            title='Ajouter une nouvelle classe'
            okText='Ajouter une nouvelle classe'
            description="Souhaitez-vous poursuivre avec l'ajout de la classe ?"
            handleForm={form}
        />
    )
}
