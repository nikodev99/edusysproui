import {Alert, Modal} from "antd";
import {setName} from "@/core/utils/utils.ts";
import {Individual, Student} from "@/entity";
import {ModalConfirmButton} from "@/components/ui/layout/ModalConfirmButton.tsx";
import {LuTrash2} from "react-icons/lu";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {useCallback, useMemo, useState} from "react";
import {archiveStudent} from "@/data/repository/studentRepository.ts";
import {Notification} from "@/components/custom/Notification.tsx";
import {ActionDrawer} from "@/core/utils/interfaces.ts";
import {useAuth} from "@/hooks/useAuth.ts";

export const RemoveStudent = ({data, open, close, setRefresh}: ActionDrawer<Student>) => {
    const {userSchool} = useAuth()
    const {toStudent} = useRedirect()
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const enableCons = useMemo(() => 
        "La suppression d’un élève n’entraîne pas l’effacement de ses données : son statut est simplement passé à « inactif » " +
        "au sein de l’établissement, ses informations sont conservées et l’école pourra à tout moment retrouver cet ancien " +
        "élève dans les archives pour le réinscrire si nécessaire.",[]
    )

    const handleFinish = useCallback(() => {
        setRefresh?.(false)
        setSuccessMessage(undefined)
        setErrorMessage(undefined)
        archiveStudent(userSchool?.id as string, data?.id)
            .then(r => {
                if(r.status >= 200 && r.status < 300) {
                    const m = r.data
                    if (m.isError) {
                        setErrorMessage(m.message)
                    }else {
                        setSuccessMessage(m.message)
                    }
                }
            })
    }, [data?.id, setRefresh, userSchool?.id])

    const handleCancel = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        setRefresh?.(true)
        close()
        toStudent()
    }
    return <Modal
        open={open}
        onCancel={handleCancel}
        destroyOnHidden
        title={`Supprimé ${setName({firstName: data?.personalInfo?.firstName, lastName: data?.personalInfo?.lastName} as Individual)} de votre établissement`}
        footer={null}
    >
        <Notification
            responseMessages={{
                success: successMessage,
                error: errorMessage
            }}
            setRedirect={toStudent}
        />
        <Alert style={{marginBottom: '15px'}} message={enableCons} showIcon />
        <div style={{textAlign: 'center'}}>
            <ModalConfirmButton
                handleFunc={handleFinish}
                title='Souhaitez vous poursuivre ?'
                content={`Veuillez cliquer sur OUI pour rétiré cet étudiant`}
                tooltipTxt={`Cliquer pour rétiré l'utilisateur`}
                btnTxt={'Rétiré l\'utilisateur'}
                btnProps={{
                    icon: <LuTrash2 />,
                    type: 'default',
                    danger: true
                }}
            />
        </div>
    </Modal>
}