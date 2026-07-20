import {Button, Divider, Flex, Form, Skeleton} from "antd";
import {setName} from "@/core/utils/utils.ts";
import {ReactNode} from "react";
import {Enrollment} from "@/entity";
import {useEnrollmentForm} from "@/hooks/useEnrollmentForm.ts";
import {AcademicForm} from "@/components/ui-kit-student";
import {LuUserRoundPlus} from "react-icons/lu";
import {FormLayout} from "antd/es/form/Form";
import {useRedirect} from "@/hooks/useRedirect.ts";
import Block from "@/components/view/Block.tsx";
import {
    AttendanceWidget,
    DisciplinaryRecords, ExamInsight,
    GuardianBlock,
    HealthData,
    IndividualInfo,
    SchoolHistory
} from "@/components/ui-kit-student/components/StudentInfo.tsx";
import {ConfirmationModal} from "@/components/ui/layout/ConfirmationModal.tsx";
import {enrollmentSchema} from "@/schema";
import {useToggle} from "@/hooks/useToggle.ts";

export interface StudentResultProps {
    title?: ReactNode
    resource?: Enrollment
    formLayout?: FormLayout | undefined
    submitBtnTxt?: ReactNode
    modalTitle?: ReactNode
}

export const StudentResult = ({title, resource, formLayout = 'vertical', submitBtnTxt = 'Inscrire', modalTitle}: StudentResultProps) => {
    const [openEnrollModal, setOpenEnrollModal] = useToggle(false)
    const {toViewStudent} = useRedirect()

    const {control, errors, handleSubmit, onSubmit, successMessage, errorMessage} = useEnrollmentForm(resource?.student?.id)

    if (!resource) return <Skeleton active paragraph={{rows: 10}} />

    return(
        <main>
            <div><Divider orientation='left'>{title}</Divider>
                <Flex justify='space-between' align='center'>
                    <span style={{fontSize: 20, fontWeight: 700}}>{setName(resource?.student?.personalInfo)}</span>
                    <Button type='primary' size='middle' onClick={setOpenEnrollModal}>Inscrire</Button>
                </Flex>
                <Divider />
            </div>
            <Block responsive={{xs: 1, md: 2, lg: 3}}>
                <IndividualInfo infoData={resource} dataKey={'studentInfo'} />
                <GuardianBlock infoData={resource} dataKey={'studentGuardian'} />
                <HealthData infoData={resource} dataKey={'studentHealth'} />
                <SchoolHistory infoData={resource} dataKey={'studentHistory'} readonly />
                <ExamInsight infoData={resource} dataKey={'studentExam'} />
                <AttendanceWidget infoData={resource} dataKey={'studentAttendance'} />
                <DisciplinaryRecords infoData={resource} dataKey={'studentDisciplinary'} showMoreBtn={false} />
            </Block>
            {openEnrollModal && <ConfirmationModal
                data={() => enrollmentSchema(true)}
                open={openEnrollModal}
                close={setOpenEnrollModal}
                modalTitle={`Inscrire ${setName(resource?.student?.personalInfo)}`}
                alertDesc={{
                    msg: "Ce formulaire transférera le dossier de l'élève vers votre établissement et l'inscrire dans sa nouvelle classe pour cette année scolaire.",
                    type: 'info'
                }}
                customComponent={
                    <Form layout={formLayout}>
                        <AcademicForm
                            control={control}
                            errors={errors}
                            validationTriggered
                            xs
                        />
                    </Form>
                }
                setRedirect={() => toViewStudent(resource?.student?.id as string, resource?.student?.personalInfo)}
                messages={{success: successMessage, error: errorMessage}}
                btnTxt={submitBtnTxt}
                title={modalTitle}
                btnProps={{
                    icon: <LuUserRoundPlus />,
                    type: 'primary'
                }}
                handleFunc={() => handleSubmit(onSubmit)()}
            />}
        </main>
    )
}