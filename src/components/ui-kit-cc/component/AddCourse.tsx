import {ModalProps} from "antd";
import {InsertModal} from "../../custom/InsertSchema.tsx";
import {useForm} from "react-hook-form";
import {courseSchema, CourseSchema} from "../../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {addCourse} from "../../../data/repository/courseRepository.ts";
import {CourseForm} from "../../forms/CourseForm.tsx";

export const AddCourse = ({open, onCancel}: ModalProps) => {

    const form = useForm<CourseSchema>({
        resolver: zodResolver(courseSchema)
    });

    const {control, formState: {errors}} = form

    return (
        <InsertModal
            data={courseSchema}
            customForm={<CourseForm control={control} errors={errors} />}
            handleForm={form}
            postFunc={addCourse}
            open={open}
            onCancel={onCancel}
            messageSuccess="Nouvelle matière ajoutée avec success"
            title='Ajouter une nouvelle Matière'
            okText="Ajouter Matière"
            description="Souhaitez-vous poursuivre avec l'ajout de la matière ?"
        />
    )
}