import Responsive from "@/components/ui/layout/Responsive.tsx";
import Grid from "@/components/ui/layout/Grid.tsx";
import {Badge, Card, Descriptions, Form, Spin, Tag} from "antd";
import {getAge} from "@/core/utils/utils.ts";
import Datetime from "@/core/datetime.ts";
import {ReactNode} from "react";
import {Enrollment} from "@/entity";
import {useEnrollmentForm} from "@/hooks/useEnrollmentForm.ts";
import {AcademicForm} from "@/components/ui-kit-student";
import {ModalConfirmButton} from "@/components/ui/layout/ModalConfirmButton.tsx";
import {LuUserRoundPlus} from "react-icons/lu";
import {FormLayout} from "antd/es/form/Form";
import {Notification} from "@/components/custom/Notification.tsx";
import {useRedirect} from "@/hooks/useRedirect.ts";

export interface StudentResultProps {
    title?: ReactNode
    resource?: Enrollment
    formLayout?: FormLayout | undefined
    submitBtnTxt?: ReactNode
    modalTitle?: ReactNode
}

export const StudentResult = ({title, resource, formLayout = 'vertical', submitBtnTxt = 'Inscrire', modalTitle}: StudentResultProps) => {
    const {toViewStudent} = useRedirect()

    const {classe, ind, student} = {
        classe: resource?.classe,
        student: resource?.student,
        ind: resource?.student?.personalInfo
    }

    const {control, errors, handleSubmit, onSubmit, isPending, successMessage, errorMessage} = useEnrollmentForm(student?.id)

    return(
        <Responsive gutter={[16, 16]} style={{marginTop: '30px'}}>
            <Grid xs={24} md={12} lg={12}>
                <Card>
                    <Descriptions
                        title={title}
                        items={[
                            {key: '1', label: 'Nom(s)', children: ind?.lastName, span: 3},
                            {key: '2', label: 'Prenom(s)', children: ind?.firstName, span: 3},
                            {key: '3', label: 'Date de Naissance', children: Datetime.of(ind?.birthDate as Date).fDate(), span: 3},
                            {key: '4', label: 'Age', children: getAge(ind?.birthDate as number[], true), span: 3},
                            {key: '5', label: 'Lieu de naissance', children: ind?.birthCity, span: 3},
                            {key: '6', label: 'Référence', children: <b>{ind?.reference}</b>, span: 3},
                            {key: '7', label: 'Classe', children: classe?.name, span: 3},
                            {key: '8', label: 'Niveau', children: <Tag>{classe?.grade?.section}</Tag>, span: 3},
                            {key: '9', label: 'Date d\'inscription', children: Datetime.of(resource?.enrollmentDate as Date).fDatetime(), span: 3},
                            {key: '10', label: 'Archivé', children: <Badge status="error" text={resource?.isArchived ? 'Oui' : 'Non'} />},
                        ]}
                    />
                </Card>
            </Grid>
            <Grid xs={24} md={12} lg={12}>
                <Card>
                    <Form layout={formLayout}>
                        { (successMessage || errorMessage) && <Notification
                            responseMessages={{
                                success: successMessage,
                                error: errorMessage
                            }}
                            setRedirect={() => toViewStudent(student?.id as string, ind)}
                        /> }
                        <AcademicForm
                            control={control}
                            errors={errors}
                            validationTriggered={true}
                        />
                        <Form.Item>
                            <ModalConfirmButton
                                btnProps={{
                                    icon: <LuUserRoundPlus />,
                                    type: 'primary'
                                }}
                                btnTxt={submitBtnTxt}
                                title={modalTitle}
                                handleFunc={() => handleSubmit(onSubmit)()}
                            />
                        </Form.Item>
                        {isPending && <Spin />}
                    </Form>
                </Card>
            </Grid>
        </Responsive>
    )
}