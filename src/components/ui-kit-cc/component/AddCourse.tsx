import {ModalProps} from "antd";
import {InsertSchema} from "../../custom/InsertSchema.tsx";
import {useForm} from "react-hook-form";
import {courseSchema, CourseSchema} from "../../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {addCourse} from "../../../data/repository/courseRepository.ts";
import {AddCourseForm} from "../../forms/AddCourseForm.tsx";

export const AddCourse = ({open, onCancel}: ModalProps) => {

    const form = useForm<CourseSchema>({
        resolver: zodResolver(courseSchema)
    });

    const {control, formState: {errors}} = form

    return (
        <InsertSchema
            data={courseSchema}
            customForm={<AddCourseForm control={control} errors={errors} />}
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