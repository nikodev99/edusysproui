import {Alert, Badge, Button, Card, Divider, Flex, Modal, Select, Space} from "antd";
import {useMemo, useState} from "react";
import FormSuccess from "../../ui/form/FormSuccess.tsx";
import FormError from "../../ui/form/FormError.tsx";
import {User} from "../../../auth/dto/user.ts";
import {Role, RoleEnum} from "../../../auth/dto/role.ts";
import Tag from "../../ui/layout/Tag.tsx";
import {enumToObjectArray, MAIN_COLOR} from "../../../core/utils/utils.ts";
import {LuMinus} from "react-icons/lu";
import {ModalConfirmButton} from "../../ui/layout/ModalConfirmButton.tsx";
import {PatchUpdate} from "../../../core/PatchUpdate.ts";
import {UpdateType} from "../../../core/shared/sharedEnums.ts";

export const UserRoles = ({user, open, close}: {
    user: User,
    open: boolean,
    close: () => void,
}) => {
    const [roles, setRoles] = useState<Role[]>([])
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const options = useMemo(() => enumToObjectArray(RoleEnum, true), [])

    const handleChange = (value: unknown) => {
        setRoles(value as [])
    }

    const handleFinish = async () => {
        await PatchUpdate.set(
            'roles',
            roles,
            user?.id,
            () => setSuccessMessage("Devoir traité avec succès"),
            setErrorMessage,
            UpdateType.ASSIGNMENT
        )
    }

    const handleRemoveRole = async () => {

    }

    return (
        <>
        {successMessage && <FormSuccess message={successMessage} isNotif={true} />}
        {errorMessage && <FormError message={errorMessage} isNotif={true} />}
        <Modal open={open} onCancel={close} title='Gestion des roles' footer={null}>
            {successMessage && <Alert type={'success'} message={successMessage} />}
            {errorMessage && <Alert type={'error'} message={errorMessage} />}
            <Card>
                <Card.Meta title="Ajouter roles à l'utilisateur" style={{marginBottom: '20px'}} />
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Selectionner les roles"
                    onChange={handleChange}
                    options={options}
                    defaultValue={user?.roles}
                />
                <Flex style={{marginTop: '20px'}} justify='flex-end' gap={10}>
                    <ModalConfirmButton
                        handleFunc={handleFinish}
                        title='Souhaitez vous poursuivre ?'
                        content="Soyez assurer lorsque vous cliquerez sur OUI, vous n'aurez plus la possibilité de modifier quoi que ce soit pour ce devoir"
                        tooltipTxt='Cliqué pour terminer'
                        btnTxt='Confirmer'
                        btnProps={{type: 'primary'}}
                    />
                </Flex>
            </Card>
            <Divider />
            <Card>
                <Card.Meta title="Rétiré roles à l'utilisateur" style={{marginBottom: '20px'}} />
                <Space wrap>
                    {user?.roles?.map((role: Role) => (
                        <Badge key={`role-${role}`} status='error' count={
                            <p
                                style={{border: '1px solid #ff4d4f', borderRadius: '40%', cursor: 'pointer' }}
                                onClick={() => alert('Suprimé le role')}
                            >
                                <LuMinus style={{color: '#ff4d4f'}} />
                            </p>
                        }>
                            <Tag color={MAIN_COLOR} white>{RoleEnum[role]}</Tag>
                        </Badge>
                    ))}
                </Space>
                <Flex style={{marginTop: '20px'}} justify='flex-end' gap={10}>
                    <ModalConfirmButton
                        handleFunc={() => alert('Traité')}
                        title='Souhaitez vous poursuivre ?'
                        content="Soyez assurer lorsque vous cliquerez sur OUI, vous n'aurez plus la possibilité de modifier quoi que ce soit pour ce devoir"
                        tooltipTxt='Cliqué pour terminer'
                        btnTxt='Confirmer'
                        btnProps={{type: 'primary'}}
                    />
                </Flex>
            </Card>
            <Flex justify={'flex-end'} gap={10} style={{marginTop: '20px'}}>
                <Button onClick={close}>Annuler</Button>
            </Flex>
        </Modal>
        </>
    )
}