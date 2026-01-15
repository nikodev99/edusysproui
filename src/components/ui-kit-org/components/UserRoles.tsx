import {Alert, Badge, Button, Card, Divider, Flex, message, Modal, Select, Space} from "antd";
import {ReactNode, useEffect, useMemo, useState} from "react";
import FormSuccess from "@/components/ui/form/FormSuccess.tsx";
import FormError from "@/components/ui/form/FormError.tsx";
import {User} from "@/auth/dto/user.ts";
import {Role, RoleEnum} from "@/auth/dto/role.ts";
import Tag from "@/components/ui/layout/Tag.tsx";
import {enumToObjectArray, MAIN_COLOR} from "@/core/utils/utils.ts";
import {LuMinus} from "react-icons/lu";
import {ModalConfirmButton} from "@/components/ui/layout/ModalConfirmButton.tsx";
import {PatchUpdate} from "@/core/PatchUpdate.ts";
import {setAccountRoles} from "@/data/repository/userRepository.ts";
import {loggedUser} from "@/auth/jwt/LoggedUser.ts";
import {ActionDrawer} from "@/core/utils/interfaces.ts";

export const UserRoles = ({data, open, close, setRefresh, sameUser}: ActionDrawer<User>) => {
    const [roles, setRoles] = useState<Role[]>([])
    const [roleToDelete, setRoleToDelete] = useState<Role[]>([])
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const options = useMemo(() => enumToObjectArray(RoleEnum, true), [])
    const accountRoles = useMemo(() => {
        const userRoles = data?.roles
        if (roleToDelete && roleToDelete.length > 0) {
            return userRoles?.filter(r => !roleToDelete.includes(r))
        }
        return userRoles
    }, [roleToDelete, data?.roles])

    useEffect(() => {
        setRoles(data?.roles)

        if (open) {
            setErrorMessage(undefined)
            setSuccessMessage(undefined)
            setRefresh && setRefresh(false)
        }
    }, [open, setRefresh, setErrorMessage, setSuccessMessage, data?.roles])

    const tagRender = (props: { label: ReactNode }) => {
        const { label } = props;

        return (
            <span style={{marginRight: '3px'}}>
                <Tag color={MAIN_COLOR} white>{label}</Tag>
            </span>
        );
    };

    const handleChange = (value: unknown) => {
        if (Array.isArray(value) && (!value || value?.length === 0)) {
            message.warning("L’utilisateur doit conserver au moins un rôle.").then(r => r);
            return;
        }

        setRoles(value as []);
    }

    const handleRemove = (role: Role) => {
        setRoleToDelete(prev => {
            // if already queued for deletion, do nothing
            if (prev.some(p => p === role)) return prev;

            const currentUserRoles = data?.roles ?? [];

            // build the candidate delete list
            const newRoleToDelete = [...prev, role];

            // roles that would remain if we applied the deletion
            const remainingRoles = currentUserRoles.filter(
                r => !newRoleToDelete.some(rd => rd === r)
            );

            if (remainingRoles.length === 0) {
                message.warning('L’utilisateur doit conserver au moins un rôle.').then(r => r);
                return prev;
            }

            return newRoleToDelete;
        });
    }

    const handleAddRoles = async () => {
        setRefresh?.(false)
        setRoleToDelete([])
        await PatchUpdate.setWithCustom(
            setAccountRoles as () => never,
            () => setSuccessMessage("Les roles ont été mis à jour avec succès"),
            setErrorMessage,
            [data?.account, roles]
        )
        updateRole(roles)
    }

    const handleRemoveRoles = async () => {
        setRefresh?.(false)
        setRoleToDelete([])
        await PatchUpdate.setWithCustom(
            setAccountRoles as () => never,
            () => setSuccessMessage("Les roles ont été mis à jour avec succès"),
            setErrorMessage,
            [data?.account, accountRoles]
        )
        updateRole(accountRoles)
    }

    const handleCloseModal = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        setRoleToDelete([])
        setRefresh?.(true)
        close()
    }

    const updateRole = (roles?: Role[]) => {
        if (sameUser) {
            loggedUser.setRoles(roles || [])
        }
    }

    return (
        <>
        {successMessage && <FormSuccess message={successMessage} isNotif={true} />}
        {errorMessage && <FormError message={errorMessage} isNotif={true} />}
        <Modal open={open} onCancel={handleCloseModal} title='Gestion des roles' footer={null}>
            {successMessage && <Alert type={'success'} message={successMessage} closeIcon showIcon style={{marginBottom: '10px'}} />}
            {errorMessage && <Alert type={'error'} message={errorMessage} closeIcon showIcon style={{marginBottom: '10px'}} />}
            <Card>
                <Card.Meta title="Ajouter roles à l'utilisateur" style={{marginBottom: '20px'}} />
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Selectionner les roles"
                    onChange={handleChange}
                    options={options}
                    tagRender={tagRender}
                    value={roles}
                    showSearch={false}
                />
                <Flex style={{marginTop: '20px'}} justify='flex-end' gap={10}>
                    <ModalConfirmButton
                        handleFunc={handleAddRoles}
                        title='Souhaitez vous poursuivre ?'
                        content="Soyez assurer lorsque vous cliquerez sur OUI, vous confirmerez que la sauvegarde des roles de l'utilisateur avec les roles précédemment ajoutés"
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
                    {accountRoles?.map((role: Role) => (
                        <Badge key={`role-${role}`} status='error' count={
                            <p
                                style={{border: '1px solid #ff4d4f', borderRadius: '40%', cursor: 'pointer' }}
                                onClick={() => handleRemove(role)}
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
                        handleFunc={handleRemoveRoles}
                        title='Souhaitez vous poursuivre ?'
                        content="Soyez assurer lorsque vous cliquerez sur OUI, vous confirmerez que la sauvegarde des roles de l'utilisateur sans les roles précédemment supprimés"
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