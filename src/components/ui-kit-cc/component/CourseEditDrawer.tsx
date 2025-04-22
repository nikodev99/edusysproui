import {UpdateSchema} from "../../custom/UpdateSchema.tsx";
import {EditProps} from "../../../core/utils/interfaces.ts";
import {Course} from "../../../entity";
import {useForm} from "react-hook-form";
import {courseSchema, CourseSchema} from "../../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {updateCourse} from "../../../data/repository/courseRepository.ts";
import {CourseForm} from "../../forms/CourseForm.tsx";

export const CourseEditDrawer = ({data, close, open}: EditProps<Course>) => {

    const updateForm = useForm<CourseSchema>({
        resolver: zodResolver(courseSchema)
    })

    const {control, formState: {errors}} = updateForm

    return (
        <UpdateSchema
            data={courseSchema}
            customForm={<CourseForm control={control} errors={errors} data={data} />}
            handleForm={updateForm}
            id={data?.id as number}
            putFunc={updateCourse}
            open={open}
            onCancel={close}
        />
    )
}