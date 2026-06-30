import Responsive from "@/components/ui/layout/Responsive.tsx";
import Grid from "@/components/ui/layout/Grid.tsx";
import PageWrapper from "@/components/view/PageWrapper.tsx";
import {useAssignmentRepo} from "@/hooks/actions/useAssignmentRepo.ts";
import {useEffect, useMemo, useState} from "react";
import {Assignment} from "@/entity";
import {AssignmentSchedule} from "@/components/common/AssignmentSchedule.tsx";
import {InsertModal} from "@/components/custom/InsertSchema.tsx";
import {useForm} from "react-hook-form";
import {assignmentSchema, AssignmentSchema} from "@/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {insertAssignment} from "@/data/repository/assignmentRepository.ts";
import {SlotInfo} from "react-big-calendar";
import {useToggle} from "@/hooks/useToggle.ts";
import {Typography} from "antd";
import {AssignmentForm} from "@/components/forms/AssignmentForm.tsx";
import Datetime from "@/core/datetime.ts";
import {useAcademicYearRepo} from "@/hooks/actions/useAcademicYearRepo.ts";
import {isTeacher} from "@/auth/dto/role.ts";
import {Moment} from "@/core/utils/interfaces.ts";
import {loggedUser} from "@/auth/jwt/LoggedUser.ts";

const InsertExam = () => {
    const {Title} = Typography
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [isRefetch, setIsRefetch] = useState(false)
    const [openModal, setOpenModal] = useToggle(false)
    const {useGetAllNotCompletedAssignments} = useAssignmentRepo()
    const {currentAcademicYear} = useAcademicYearRepo()

    const showField = useMemo(() => !isTeacher(), [])
    const {teacherId, teacherPersonal} = useMemo(() => {
        if (!showField) {
            return {
                teacherId: loggedUser?.getUser()?.userId,
                teacherPersonal: loggedUser?.getUser()?.personalInfo
            }
        }
        return {teacherId: undefined, teacherPersonal: undefined}
    }, [showField])

    const {data, refetch} = useGetAllNotCompletedAssignments(currentAcademicYear?.id as string, teacherPersonal)

    const form = useForm<AssignmentSchema>({
        resolver: zodResolver(assignmentSchema)
    })

    const {control, formState: {errors}, reset} = form

    useEffect(() => {
        if (data)
            setAssignments(data)
        
        if (isRefetch) {
            refetch().then(r => r)
        }
    }, [data, isRefetch, refetch]);

    const handleSelectSlot = (slots: SlotInfo) => {
        if(slots.action === 'click') {
            setOpenModal()
            reset({
                examDate: Datetime.of(slots?.start as Date).toDate(),
                ...(teacherId && teacherPersonal ? {
                    preparedBy: {
                        id: teacherPersonal,
                    }
                } : {})
            })
        }
    }

    const handleModalClose = () => {
        reset()
        refetch().then(r => r)
        setOpenModal()
    }

    console.log("ERRORS: ", errors)

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
                        startDate={Datetime.of(currentAcademicYear?.startDate as Moment).toDate()}
                        endDate={Datetime.of(currentAcademicYear?.endDate as Moment).toDate()}
                    />
                </Grid>
            </Responsive>
            <InsertModal
                data={assignmentSchema as never}
                customForm={<AssignmentForm
                    errors={errors}
                    control={control}
                    showField={showField}
                    academicYear={currentAcademicYear?.id}
                />}
                handleForm={form}
                postFunc={insertAssignment}
                open={openModal}
                onCancel={handleModalClose}
                messageSuccess={"Nouveau devoir ajouté avec succès"}
                title={<Title level={3}>Ajouter un nouveau devoir</Title>}
                okText='Créer devoir'
                description="Poursuivre ?"
                isNotif
            />
        </PageWrapper>
    )
}

export {InsertExam}