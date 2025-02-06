import {ModalProps} from "antd";
import {ClasseForm} from "../../forms/ClasseForm.tsx";
import {useForm} from "react-hook-form";
import {classeSchema, ClasseSchema} from "../../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {addClasse} from "../../../data/repository/classeRepository.ts";
import {InsertSchema} from "../../custom/InsertSchema.tsx";

export const AddClasse = ({open, onCancel}: ModalProps) => {

    const form = useForm<ClasseSchema>({
        resolver: zodResolver(classeSchema)
    })

    const {control, formState: {errors}} = form

    return(
        <InsertSchema
            data={classeSchema}
            customForm={<ClasseForm control={control} errors={errors} />}
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
