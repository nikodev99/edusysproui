import {ModalProps} from "antd";
import {InsertModal} from "../../custom/InsertSchema.tsx";
import {useForm} from "react-hook-form";
import {courseSchema, CourseSchema} from "../../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {addCourse} from "../../../data/repository/courseRepository.ts";
import {CourseForm} from "../../forms/CourseForm.tsx";
import {useMemo} from "react";
import {anyIsCollege} from "../../../entity/enums/section.ts";
import {useGradeRepo} from "../../../hooks/actions/useGradeRepo.ts";

export const AddCourse = ({open, onCancel}: ModalProps) => {
    const {useGetAllGrades} = useGradeRepo()
    
    const form = useForm<CourseSchema>({
        resolver: zodResolver(courseSchema)
    });

    const {control, formState: {errors}} = form
    const grades = useGetAllGrades()
    
    const showField = useMemo(() => {
        if (grades?.length) {
            const sections = grades.map(g => g.section)
            console.log({sections})
            return anyIsCollege(sections as string[])
        }
        return false
    }, [grades])
    
    return (
        <InsertModal
            data={courseSchema}
            customForm={<CourseForm control={control} errors={errors} showField={showField} />}
            handleForm={form}
            postFunc={addCourse}
            open={open}
            onCancel={onCancel}
            messageSuccess="Nouvelle matière ajoutée avec success"
            title='Ajouter une nouvelle Matière'
            okText="Ajouter Matière"
            description="Souhaitez-vous poursuivre avec l'ajout de la matière ?"
            toReset={false}
            isNotif
        />
    )
}