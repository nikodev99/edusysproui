import Responsive from "../../ui/layout/Responsive.tsx";
import DateInput from "../../ui/form/DateInput.tsx";
import {useForm, UseFormReturn} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {assignmentDateUpdateSchema, AssignmentUpdateDate} from "../../../schema";
import {TimeInput} from "../../ui/form/TimeInput.tsx";
import Datetime from "../../../core/datetime.ts";
import {UpdateSchema} from "../../custom/UpdateSchema.tsx";
import {changeAssignmentDate} from "../../../data/repository/assignmentRepository.ts";
import {Assignment} from "../../../entity";
import {ZodSchema} from "zod";
import {useEffect} from "react";

type UpdateAssignmentProps = {
    assignment: Assignment | null
    open?: boolean,
    onCancel?: () => void
    resp?: (resp: Record<string, boolean>) => void
}

export const UpdateAssignmentDates = ({assignment, open, onCancel, resp}: UpdateAssignmentProps) => {

    const form = useForm<AssignmentUpdateDate>({
        resolver: zodResolver(assignmentDateUpdateSchema)
    })

    const {control, formState: {errors}, setValue} = form

    useEffect(() => {
        setValue('updatedDate', Datetime.now().toDate())
    }, [setValue]);

    return (
        <UpdateSchema
            data={assignmentDateUpdateSchema as ZodSchema}
            id={(assignment ? assignment.id : 0) as bigint}
            resp={resp}
            putFunc={changeAssignmentDate}
            open={open}
            onCancel={onCancel}
            messageSuccess="Mise à jour correctement effectuer"
            title="Change la date du devoir"
            okText="oui"
            description="Souhaitez-vous poursuivre cette action ?"
            handleForm={form as UseFormReturn<Assignment>}
            customForm={
                <Responsive gutter={[16, 16]}>
                    <DateInput
                        control={control}
                        name='examDate'
                        label='Nouvelle date'
                        validateStatus={errors?.examDate ? 'error' : ''}
                        help={errors.examDate ? errors?.examDate?.message : ''}
                        required
                        defaultValue={assignment ? Datetime.of(assignment?.examDate as number[]).toDate() : undefined}
                    />
                    <TimeInput
                        control={control}
                        name='startTime'
                        label='Heure de début'
                        validateStatus={errors?.startTime ? 'error' : ''}
                        help={errors.examDate ? errors?.startTime?.message : ''}
                        required
                        defaultValue={assignment ? Datetime.timeToCurrentDate(assignment?.startTime as number[]).toDayjs('HH:mm') as unknown : undefined}
                    />
                    <TimeInput
                        control={control}
                        name='endTime'
                        label='Heure de fin'
                        validateStatus={errors?.endTime ? 'error' : ''}
                        help={errors.examDate ? errors?.endTime?.message : ''}
                        required
                        defaultValue={assignment ? Datetime.timeToCurrentDate(assignment?.endTime as number[]).toDayjs('HH:mm') as unknown : undefined}
                    />
                </Responsive>
            }
        />
    )
}