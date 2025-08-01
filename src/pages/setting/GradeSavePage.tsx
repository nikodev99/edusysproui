import {useSemesterRepo} from "../../hooks/useSemesterRepo.ts";
import {useFieldArray, useForm} from "react-hook-form";
import {gradeSchema, GradeSchema} from "../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {InsertSchema} from "../../components/custom/InsertSchema.tsx";
import {GradeForm} from "../../components/forms/GradeForm.tsx";
import PageWrapper from "../../components/view/PageWrapper.tsx";
import {Alert, Divider, Modal} from "antd";
import {PlanningForm} from "../../components/forms/PlanningForm.tsx";
import {useState} from "react";
import {useToggle} from "../../hooks/useToggle.ts";

export const GradeSavePage = () => {
    const [open, setOpen] = useToggle(false)
    const {useGetAllSemesters} = useSemesterRepo()

    const form = useForm<GradeSchema>({
        resolver: zodResolver(gradeSchema),
    })

    const {formState: {errors}, handleSubmit, watch, control, clearErrors} = form

    const arr = useFieldArray({
        control,
        name: 'planning',
    })

    console.log('WATCHER: ', watch())
    console.log('PLANNING ARRAY: ', arr)

    return (
        <PageWrapper>
            <InsertSchema
                data={gradeSchema}
                customForm={<>
                    <GradeForm
                        errors={errors}
                        control={control}
                        edit={false}
                        clearErrors={clearErrors}
                    />
                    <Divider />
                    <div>
                        <Alert type='info' message={'Here is a message'} />
                    </div>
                </>
                }
                handleForm={form}
                postFunc={() => alert('inserting...')}
                onClose={setOpen}
                cancelText={'Ajouter un planning'}
            />
            <Modal open={open} onCancel={setOpen} onOk={() => arr.append(watch().planning)}>
                <PlanningForm control={control} errors={errors} edit={false} parent={'planning'} />
            </Modal>
        </PageWrapper>
    )
}