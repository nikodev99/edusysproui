import {ModalProps} from "antd";
import {ClasseForm} from "../../forms/ClasseForm.tsx";
import {useForm} from "react-hook-form";
import {classeSchema, ClasseSchema} from "../../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {addClasse} from "../../../data/repository/classeRepository.ts";
import {InsertModal} from "../../custom/InsertSchema.tsx";
import {useGradeRepo} from "../../../hooks/actions/useGradeRepo.ts";
import {useMemo} from "react";
import {isUniversity} from "../../../entity/enums/section.ts";

export const AddClasse = ({open, onCancel}: ModalProps) => {
    const {gradeOptions, useGetGrade} = useGradeRepo()
    
    const form = useForm<ClasseSchema>({
        resolver: zodResolver(classeSchema)
    })

    const {control, formState: {errors}, watch} = form
    const dataEntered = watch()

    const gradeId = useMemo(() => {
        if (dataEntered)
            return dataEntered.grade?.id
        else 
            return 0
    }, [dataEntered])

    const grade = useGetGrade(gradeId, false)

    const showField = useMemo(() => isUniversity(grade?.section as string), [grade?.section])

    console.log({grade, showField})

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
            isNotif={true}
            toReset={false}
        />
    )
}
