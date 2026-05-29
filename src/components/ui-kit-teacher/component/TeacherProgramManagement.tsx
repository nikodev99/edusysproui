import { Options } from "@/core/utils/interfaces"
import {courseProgramSchema, TeacherCourseProgram, TeacherProgramTopic, topicSchema} from "@/schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {InsertModal} from "@/components/custom/InsertSchema.tsx";
import {CourseProgramForm, CourseProgramTopicForm} from "@/components/forms/CourseProgramForm.tsx";
import {useEffect, useMemo} from "react";
import {SuperWord} from "@/core/utils/tsxUtils.tsx";
import {addProgram, addProgramTopic} from "@/data/repository/courseProgramRepository.ts";
import Datetime from "@/core/datetime.ts";

export const InsertNewProgram = (
    {open, courseValue, showField, courses, classes, classeValue, teacherValue, academicYear, semesterValue, semesters, onClose, onRefetch}: {
        open: boolean
        courses?: Options
        classes?: Options
        classeValue?: number
        courseValue?: number
        semesterValue?: number
        semesters?: Options[]
        onClose?: () => void
        showField?: boolean
        teacherValue?: string
        academicYear?: string
        onRefetch?: () => Promise<void>
    }) => {

    const classeName = useMemo(() => {
        return classes?.find(c => c.value === classeValue)?.label as string
    }, [classeValue, classes])

    const form = useForm<TeacherCourseProgram>({
        resolver: zodResolver(courseProgramSchema)
    })

    const { control, formState: {errors}, reset } = form

    useEffect(() => {
        reset({
            classe: { id: classeValue },
            semester: { semesterId: semesterValue },
            course: { id: courseValue },
            teacher: { id: teacherValue },
            timing: { 
                status: 5,
                academicYear: { id: academicYear },
                updatedAt: Datetime.now().toDate()
            },
        })
    }, [academicYear, classeValue, courseValue, reset, semesterValue, showField, teacherValue]);

    return(
        <InsertModal
            open={open}
            width={400}
            data={courseProgramSchema as never}
            onCancel={onClose}
            customForm={<CourseProgramForm
                courses={courses}
                errors={errors}
                control={control}
                courseValue={courseValue}
                classes={classes}
                classeValue={classeValue}
                semesterValue={semesterValue}
                semesters={semesters}
                showField={showField}
            />}
            messageSuccess={"Nouveau thème ajouté avec succès"}
            description="Souhaitez-vous poursuivre avec l'ajout de ce theme ?"
            title={<SuperWord input={`Ajouter au programme ${showField ? '' : 'de la ' + classeName}`} />}
            handleForm={form as never}
            postFunc={addProgram as never}
            toReset={false}
            isNotif
            onSuccess={async () => {
                await onRefetch?.()?.then(r => r);
                setTimeout(() => {
                    onClose?.();
                }, 5000);
            }}
        />
    )
}

export const InsertNewProgramTopic = (
    {open, onClose, programValue, academicYear, onRefetch}: {
        open: boolean
        onClose: () => void
        programValue?: number
        academicYear?: string
        onRefetch?: () => Promise<void>
}) => {
    const form = useForm<TeacherProgramTopic>({
        resolver: zodResolver(topicSchema)
    })

    const { control, formState: {errors}, reset } = form

    useEffect(() => {
        reset({
            courseProgram: { id: programValue },
            timing: { 
                status: 5,
                academicYear: { id: academicYear },
                updatedAt: Datetime.now().toDate()
            },
        })
    }, [academicYear, reset, programValue]);

    return <InsertModal
        data={topicSchema}
        open={open}
        onCancel={onClose}
        postFunc={addProgramTopic as never}
        customForm={<CourseProgramTopicForm
            control={control as never}
            errors={errors}
        />}
        handleForm={form as never}
        messageSuccess={"Nouveau sous-thème ajouté avec succès"}
        description="Souhaitez-vous poursuivre avec l'ajout de ce sous-theme ?"
        title={'Ajouter au sous theme au programme'}
        isNotif
        width={400}
        onSuccess={async () => {
            await onRefetch?.()?.then(r => r);
            setTimeout(() => {
                onClose?.();
            }, 5000);
        }}
    />
}