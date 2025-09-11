import Responsive from "../../ui/layout/Responsive.tsx";
import Grid from "../../ui/layout/Grid.tsx";
import PageWrapper from "../../view/PageWrapper.tsx";
import {useAssignmentRepo} from "../../../hooks/actions/useAssignmentRepo.ts";
import {useEffect, useState} from "react";
import {Assignment} from "../../../entity";
import {AssignmentSchedule} from "../../common/AssignmentSchedule.tsx";
import {InsertModal} from "../../custom/InsertSchema.tsx";
import {useForm} from "react-hook-form";
import {assignmentSchema, AssignmentSchema} from "../../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {insertAssignment} from "../../../data/repository/assignmentRepository.ts";
import {SlotInfo} from "react-big-calendar";
import {useToggle} from "../../../hooks/useToggle.ts";
import {Typography} from "antd";
import {AssignmentForm} from "../../forms/AssignmentForm.tsx";
import Datetime from "../../../core/datetime.ts";
import {useAcademicYearRepo} from "../../../hooks/actions/useAcademicYearRepo.ts";

const InsertExam = () => {
    const {Title} = Typography
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [isRefetch, setIsRefetch] = useState(false)
    const [openModal, setOpenModal] = useToggle(false)
    const {useGetAllNotCompletedAssignments} = useAssignmentRepo()
    const {useGetCurrentAcademicYear} = useAcademicYearRepo()

    const academicYear = useGetCurrentAcademicYear()
    const {data, refetch} = useGetAllNotCompletedAssignments(academicYear?.id as string)

    const form = useForm<AssignmentSchema>({
        resolver: zodResolver(assignmentSchema)
    })

    const {control, formState: {errors}, setValue, reset} = form

    useEffect(() => {
        if (data)
            setAssignments(data)
        
        if (isRefetch) {
            refetch()
        }
    }, [data, isRefetch, refetch]);

    const handleSelectSlot = (slots: SlotInfo) => {
        if(slots.action === 'click') {
            setOpenModal()
            setValue('examDate', Datetime.now(slots.start).toDate())
            setValue('startTime', Datetime.now().toDayjs('HH:mm').toDate() as unknown as string)
            setValue('endTime', Datetime.now().plusHour(1).toDayjs('HH:mm').toDate() as unknown as string)
        }
    }

    const handleModalClose = () => {
        reset()
        refetch()
        setOpenModal()
    }

    const formData = form.watch()
    console.log("ERRORS: ", errors)
    console.log("FORM DATA: ", formData)

    return (
        <PageWrapper>
            <Responsive gutter={[16, 16]}>
                <Grid xs={24} md={24} lg={24}>
                    <AssignmentSchedule
                        views={['month']}
                        setRefetch={setIsRefetch}
                        eventSchedule={assignments}
                        selectable={true}
                        selectSlotAction={handleSelectSlot}
                    />
                </Grid>
            </Responsive>
            <InsertModal
                data={assignmentSchema as never}
                customForm={<AssignmentForm
                    errors={errors}
                    control={control}
                    selectedClasse={formData.classe?.id}
                />}
                handleForm={form}
                postFunc={insertAssignment}
                open={openModal}
                onCancel={handleModalClose}
                messageSuccess={"Nouveau devoir ajouté avec succès"}
                title={<Title level={3}>Ajouter un nouveau devoir</Title>}
                okText='Créer devoir'
                description="Poursuivre ?"
            />
        </PageWrapper>
    )
}

export {InsertExam}