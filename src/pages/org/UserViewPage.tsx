import {useLocation} from "react-router-dom";
import {useUserRepo} from "../../hooks/actions/useUserRepo.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {getBrowser, MAIN_COLOR, setTitle} from "../../core/utils/utils.ts"
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";
import {useMemo, useState} from "react";
import {Card, Flex, Button, Space, Divider, Typography, Progress} from "antd";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import Grid from "../../components/ui/layout/Grid.tsx";
import {LuLaptopMinimal, LuPlus} from "react-icons/lu";
import Tag from "../../components/ui/layout/Tag.tsx";
import {RoleEnum} from "../../auth/dto/role.ts";
import Datetime from "../../core/datetime.ts";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {UserActionLinks} from "../../components/ui-kit-org";
import {ItemType} from "antd/es/menu/interface";

const UserViewPage = () => {

    const location = useLocation()
    const {state: userId} = location

    const [linkButtons, setLinkButtons] = useState<ItemType[]>([])
    const {useGetUser, useGetUserLogins} = useUserRepo()
    const {data: user, isLoading} = useGetUser(userId)
    const logins = useGetUserLogins(userId)

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

    const login = useMemo(() =>
            logins?.sort((a, b) => Datetime.of(a.createdAt).diffSecond(b.createdAt))?.[0] ?? null,
    [logins])

    console.log("USER: ", logins)

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
                    {title: 'Téléphone', mention: user?.phoneNumber}
                ]}
                addMargin={{position: 'top', size: 50}}
                items={linkButtons}
            />
            <section style={{marginTop: '20px'}}>
                <Responsive gutter={[16, 16]}>
                    <Grid xs={24} md={12} lg={6}>
                        <Card>
                            <Card.Meta title='Roles' style={{marginBottom: '10px'}} />
                            <Flex vertical>
                                <div style={{marginBottom: '10px'}}>
                                    <Button type='link'>
                                        <LuPlus />
                                        Ajouter un role
                                    </Button>
                                </div>
                                <Space wrap>
                                    {user?.roles?.map((role, index) => (
                                        <Tag key={index} color={MAIN_COLOR} white>{RoleEnum[role]}</Tag>
                                    ))}
                                </Space>
                            </Flex>
                        </Card>
                    </Grid>
                    <Grid xs={24} md={12} lg={9}>
                        <Card style={{margin: '0', padding: '0'}}>
                            <Card.Meta title={
                                <Flex justify='space-between'>
                                    <h3>Dernière connection</h3>
                                    <Typography.Link>Voir Activités</Typography.Link>
                                </Flex>
                            } style={{marginBottom: '10px'}} />
                            <Flex align='center' gap={10}>
                                <LuLaptopMinimal size={50} />
                                <div>
                                    <p>{Datetime.of(user?.lastLogin as number).fDatetime({format: 'dddd D MMMM YYYY à HH:mm:ss'})}</p>
                                    {login && (<Space split={<Divider type='vertical' />} wrap>
                                        <p>IP: {login.clientIp}</p>
                                        <p>Browser: {getBrowser(login.browser)}</p>
                                        <p>OS: {login.device}</p>
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
                />
            </section>
        </>
    )
}

export default UserViewPage;