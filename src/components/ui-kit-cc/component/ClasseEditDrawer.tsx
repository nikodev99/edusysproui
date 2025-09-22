import {EditProps} from "../../../core/utils/interfaces.ts";
import {Classe} from "../../../entity";
import {UpdateSchema} from "../../custom/UpdateSchema.tsx";
import {useForm} from "react-hook-form";
import {classeSchema, ClasseSchema} from "../../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {ClasseForm} from "../../forms/ClasseForm.tsx";
import {updateClasseValues} from "../../../data/repository/classeRepository.ts";
import {useGradeRepo} from "../../../hooks/actions/useGradeRepo.ts";

export const ClasseEditDrawer = ({open, close, data}: EditProps<Classe>) => {

    const {gradeOptions} = useGradeRepo()
    const form = useForm<ClasseSchema>({
        resolver: zodResolver(classeSchema)
    })

    const {control, formState: {errors}} = form

    return(
        <UpdateSchema
            data={classeSchema}
            customForm={<ClasseForm control={control} data={data} errors={errors} gradeOptions={gradeOptions} />}
            handleForm={form}
            id={data?.id}
            putFunc={updateClasseValues}
            open={open}
            onCancel={close}
            title='Editer la classe'
            okText='Editer'
            description='Voulez-vous continuer ?'
            confirmBtnText='oui'
        />
    )
}