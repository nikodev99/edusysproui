import {useLocation} from "react-router-dom";
import {useUserRepo} from "../../hooks/actions/useUserRepo.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {getBrowser, getSlug, MAIN_COLOR, setTitle} from "../../core/utils/utils.ts"
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";
import {ReactNode, useEffect, useMemo, useState} from "react";
import {Card, Flex, Space, Divider, Typography, Progress} from "antd";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import Grid from "../../components/ui/layout/Grid.tsx";
import {LuCircleCheckBig, LuLaptopMinimal, LuLockKeyhole} from "react-icons/lu";
import Tag from "../../components/ui/layout/Tag.tsx";
import {RoleEnum} from "../../auth/dto/role.ts";
import Datetime from "../../core/datetime.ts";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {UserActionLinks} from "../../components/ui-kit-org";
import {ItemType} from "antd/es/menu/interface";
import {useRedirect} from "../../hooks/useRedirect.ts";

const UserViewPage = () => {

    const location = useLocation()
    const {state: userId} = location

    const {toUserActivity} = useRedirect()

    const [linkButtons, setLinkButtons] = useState<ItemType[]>([])
    const [shouldRefetch, setShouldRefetch] = useState<boolean>(false)
    const {useGetUser, useGetUserLogin} = useUserRepo()
    const {data: user, isLoading, refetch} = useGetUser(userId)
    const login = useGetUserLogin(user?.account as number)

    const userName = useMemo(() =>
        setTitle({firstName: user?.firstName, lastName: user?.lastName}),
        [user?.firstName, user?.lastName]
    )

    useDocumentTitle({
        title: userName,
        description: "Setting description",
    })

    const {context} = useBreadCrumb({
        bCItems: [
            {title: text.org.group.school.label, path: text.org.group.school.href},
            {title: text.org.group.user.label, path: text.org.group.user.href},
            {title: userName},
        ]
    })

    const accountStatus = useMemo((): ReactNode => {
        const enabledTag = user?.enabled
            ? <Tag icon={<LuCircleCheckBig />} color='success'>Activé</Tag>
            : <Tag icon={<LuLockKeyhole />} color='danger'>Désactivé</Tag>

        const lockedTag = user?.accountNonLocked
            ? <Tag icon={<LuCircleCheckBig />} color='success'>disponible</Tag>
            : <Tag icon={<LuLockKeyhole />} color='danger'>Vérrouillé</Tag>

        return <Space>
            {enabledTag} {lockedTag}
        </Space>
    }, [user?.accountNonLocked, user?.enabled])

    useEffect(() => {
        const init = async () => {
            if (shouldRefetch)
                refetch().then()
        }

        init().then(() => setShouldRefetch(false))
    }, [refetch, shouldRefetch])

    const toActivity = () => {
        toUserActivity(user?.id as number, getSlug({firstName: user?.firstName, lastName: user?.lastName}))
    }

    return (
        <>
            {context}
            <ViewHeader
                isLoading={isLoading}
                setEdit={() => console.log('Edit')}
                hasEdit={false}
                closeState={false}
                avatarProps={{
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    reference: user?.email ?? user?.username,
                }}
                blockProps={[
                    {title: 'Identifiant', mention: <Typography.Text editable>{user?.username}</Typography.Text>},
                    {title: 'Téléphone', mention: user?.phoneNumber},
                    {title: 'Status du compte', mention: accountStatus}
                ]}
                items={linkButtons}
            />
            <section style={{marginTop: '20px'}}>
                <Responsive gutter={[16, 16]}>
                    <Grid xs={24} md={12} lg={6}>
                        <Card>
                            <Card.Meta title='Roles' style={{marginBottom: '10px'}} />
                            <Space wrap>
                                {user?.roles?.map((role, index) => (
                                    <Tag key={index} color={MAIN_COLOR} white>{RoleEnum[role]}</Tag>
                                ))}
                            </Space>
                        </Card>
                    </Grid>
                    <Grid xs={24} md={12} lg={9}>
                        <Card style={{margin: '0', padding: '0'}}>
                            <Card.Meta title={
                                <Flex justify='space-between'>
                                    <h3>Dernière connection</h3>
                                    <Typography.Link onClick={toActivity}>Voir Activités</Typography.Link>
                                </Flex>
                            } style={{marginBottom: '10px'}} />
                            <Flex align='center' gap={10}>
                                <LuLaptopMinimal size={50} />
                                <div>
                                    <p>{
                                        user?.lastLogin || login?.lastUsedAt
                                            ? Datetime.of((user?.lastLogin || login?.lastUsedAt) as number)
                                                .fDatetime({format: 'dddd D MMMM YYYY à HH:mm:ss'})
                                            : '-'
                                    }</p>
                                    {login && (<Space split={<Divider type='vertical' />} wrap>
                                        <p>IP: {login?.clientIp && login?.clientIp}</p>
                                        <p>Browser: {getBrowser(login?.browser && login?.browser)}</p>
                                        <p>OS: {login?.device && login?.device}</p>
                                    </Space>)}
                                </div>
                            </Flex>
                        </Card>
                    </Grid>
                    <Grid xs={24} md={12} lg={9}>
                        <Card style={{margin: '0', padding: '0'}}>
                            <Card.Meta title={
                                <Flex justify='space-between'>
                                    <h3>Sécurité du compte</h3>
                                    <Typography.Link>Envoyer alerte sécurité</Typography.Link>
                                </Flex>
                            } style={{marginBottom: '10px'}} />
                            <Flex align='center' gap={10}>
                                <Progress type='circle' percent={80} size={50} />
                                <div>
                                    <small style={{color: '#ccc'}}>La sécurité du compte est</small>
                                    <p style={{color: '#047921'}}>Acceptable</p>
                                </div>
                            </Flex>
                        </Card>
                    </Grid>
                    <Grid xs={24} lg={24} md={24}>
                        <Card>
                            <Card.Meta title='Administration' />
                            <Flex justify='flex-end'>
                            <div style={{color: '#9c9c9f'}}>
                                <p>This is a <span style={{color: '#047921'}}>Legal representative</span></p>
                                <p>They can have access to <b style={{color: 'black', fontSize: 'bold'}}>all</b> organisation products</p>
                            </div>
                            </Flex>
                        </Card>
                    </Grid>
                </Responsive>
            </section>
            <section>
                <UserActionLinks
                    user={user}
                    getItems={setLinkButtons}
                    setRefresh={setShouldRefetch}
                />
            </section>
        </>
    )
}

export default UserViewPage;