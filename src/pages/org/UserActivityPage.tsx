import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import React, {useCallback, useMemo, useState} from "react";
import {getBrowser, getSlug, setTitle} from "../../core/utils/utils.ts";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {useLocation} from "react-router-dom";
import {useUserRepo} from "../../hooks/actions/useUserRepo.ts";
import {Badge, Button, Divider, Flex, Menu, TableColumnsType, Tooltip, Typography} from "antd";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import Grid from "../../components/ui/layout/Grid.tsx";
import {ItemType} from "antd/es/menu/interface";
import ListViewer from "../../components/custom/ListViewer.tsx";
import {UserActiveLogin, UserActivity} from "../../auth/dto/user.ts";
import Datetime from "../../core/datetime.ts";
import {LuLogOut} from "react-icons/lu";
import {DataProps} from "../../core/utils/interfaces.ts";
import {ActivityFilterProps, getAllUserLogins} from "../../data/repository/userRepository.ts";
import {useToggle} from "../../hooks/useToggle.ts";
import {loggedUser} from "../../auth/jwt/LoggedUser.ts";
import {UserActivityFilter, SessionLogout} from "../../components/ui-kit-org";

const UserActivityPage = () => {
    const location = useLocation()
    const {state: userId} = location

    const {Title} = Typography

    const [current, setCurrent] = useState<React.Key | string>('access');

    const {useGetUser, isSameUser} = useUserRepo()
    const {data: user} = useGetUser(userId)

    const isSame = useMemo(() => isSameUser(user), [isSameUser, user])
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
            {
                title: userName,
                path: text.org.group.user.view.href + getSlug({firstName: user?.firstName, lastName: user?.lastName}),
                state: userId
            },
            {title: 'Activités'}
        ]
    })

    const items: ItemType[] = useMemo(() => [
        {
            label: 'Accès au compte',
            key: 'access',
        },
        {
            label: 'Activité du compte',
            key: 'activity',
        }
    ], [])

    const handleSelectMenu = (e: ItemType) => {
        setCurrent(e?.key as React.Key);
    };

    return(
        <>
            {context}
            <section style={{marginTop: '20px'}}>
                <Title level={3} style={{color: '#333'}}>Accès et activités du compte</Title>
                <Responsive gutter={[16, 16]}>
                    <Grid xs={24} md={12} lg={12} style={{color: '#666'}}>
                        Cette page vous permet de vérifier les sessions actives ainsi que les appareils à partir desquels vous êtes connecté à votre compte utilisateur.
                    </Grid>
                </Responsive>
                <Responsive gutter={[16, 16]} style={{marginTop: '30px'}}>
                    <Grid xs={24} md={12} lg={12} style={{color: '#666'}}>
                        <Menu items={items} mode='horizontal' selectedKeys={[current as string]} onClick={handleSelectMenu} />
                    </Grid>
                </Responsive>
                {current === 'access'
                    ? (
                        <AccountAccess accountId={user?.account} isSame={isSame} />
                    )
                    : (
                        <AccountActivity accountId={user?.account} />
                    )
                }
            </section>
        </>
    )
}

const AccountAccess = ({accountId, isSame}: {accountId?: number, isSame: boolean}) => {
    const storedToken = loggedUser.getRefreshToken()
    
    const [logout, setLogout] = useToggle(false)
    const [sessionId, setSessionId] = useState<number>(0)
    const [isCurrent, setIsCurrent] = useState<boolean>(false)
    const [refetch, setRefetch] = useState<boolean>(false)
    
    const isCurrentSession = useCallback((token?: string): boolean => {
        return token ? token === storedToken : false
    }, [storedToken])
    
    const columns: TableColumnsType<UserActiveLogin> = useMemo(() => [
        {
            title: 'OS',
            key: 'os',
            dataIndex: 'device',
            render: device => device || '-'
        },
        {
            title: 'Plateforme',
            key: 'platform',
            dataIndex: 'browser',
            render: browser => browser ? getBrowser(browser) : '-'
        },
        {
            title: 'Localisation',
            key: 'localisation',
            dataIndex: 'localisation',
            render: () => '-'
        },
        {
            title: 'IP',
            key: 'ipClient',
            dataIndex: 'clientIp',
        },
        {
            title: 'Date de dernière connexion',
            key: 'lastUsedAt',
            dataIndex: 'lastUsedAt',
            render: (date: number, record) => date
                ? <Flex gap={3}>
                    <span>{Datetime.of(date).fDatetime({format: 'DD MMM YYYY, HH:mm:ss'})}</span>
                    {isCurrentSession(record?.token) && <Tooltip title='session en cours'><Badge color='green'/></Tooltip>}
                </Flex>
                : '-'
        },
        ...(isSame ? [{
            title: '',
            key: 'loginId',
            dataIndex: 'loginId',
            width: '6%',
            render: () => <Tooltip title='Se dédonnecter de cette session'>
                <Button onClick={setLogout} type='text' variant='filled' danger icon={<LuLogOut />} />
            </Tooltip>
        }]: []),
    ], [isCurrentSession, isSame, setLogout])
    
    const handleCurrentStates = (data: UserActiveLogin) => {
        setSessionId(data?.loginId)
        setIsCurrent(isCurrentSession(data?.token))
    }

    const cardData = useCallback((allLogins: UserActiveLogin[]) => {
        if (!Array.isArray(allLogins)) return [] as DataProps<UserActiveLogin>[]
        return allLogins?.map(login => ({
            id: login.loginId,
            description: <div>
                <Flex align='start' justify='space-between'>
                    <Flex vertical align='start'>
                        <Typography.Title level={4}>{login.device || '-'}</Typography.Title>
                        <p>Plateforme: <span>{getBrowser(login.browser) || '-'}</span></p>
                    </Flex>
                    <Tooltip title='Se dédonnecter de cette session'>
                        <Button onClick={() => alert('Se déconnecté de ' + login?.lastUsedAt)} type='text' variant='filled' danger icon={<LuLogOut />} />
                    </Tooltip>
                </Flex>
                <Divider />
                <Flex align='start' gap={3}>
                    <span>Dernière connexion: {Datetime.of(login?.lastUsedAt).fDatetime({format: 'DD MMM YYYY, HH:mm:ss'})}</span>
                    {isCurrentSession(login?.token) && <Tooltip title='session en cours'><Badge color='green'/></Tooltip>}
                </Flex>
            </div>,
        })) as DataProps<UserActiveLogin>[]
    }, [isCurrentSession])

    return(
        <section style={{marginTop: '30px'}}>
            <Responsive gutter={[16, 16]}>
                <Grid xs={24} md={12} lg={12} style={{color: '#666'}}>
                    <div>
                        Vous êtes connecté à votre compte utilisateur dans les sessions ci-dessous.
                        Si vous n’en reconnaissez pas une, réinitialisez la connexion en vous déconnectant. Vous devrez
                        ensuite vous reconnecter avec vos identifiants habituels.
                    </div>
                </Grid>
            </Responsive>
            <ListViewer
                callback={getAllUserLogins as () => Promise<never>}
                callbackParams={[accountId]}
                tableColumns={columns}
                countTitle={'Sessions actives'}
                cardData={cardData}
                uuidKey={'loginId'}
                cardNotAvatar
                fetchId='user-logins'
                displayItem={3}
                localStorage={{
                    activeIcon: 'accessToggleIcon'
                }}
                onSelectData={handleCurrentStates}
                refetchCondition={refetch}
            />
            <SessionLogout
                sessionId={sessionId}
                open={logout}
                close={setLogout}
                isCurrent={isCurrent}
                setRefetch={setRefetch}
            />
        </section>
    )
}

const AccountActivity = ({accountId}: {accountId?: number}) => {
    const [filters, setFilters] = useState<ActivityFilterProps>({
        dates: {
            startDate: Datetime.now().minusMonth(1).toDate(),
            endDate: Datetime.now().toDate()
        }
    })
    const [isRefetch, setIsRefetch] = useState(false)

    const {getPaginatedUserActivities} = useUserRepo()
    
    const shouldRefetch = useMemo(() => (filters && Object.keys(filters).length > 1 && !isRefetch), [filters, isRefetch])
    
    const columns: TableColumnsType<UserActivity> = useMemo(() => [
        {
            title: 'Actions',
            key: 'actions',
            dataIndex: 'action',
            sorter: true,
            showSorterTooltip: false
        },
        {
            title: 'Date',
            key: 'date',
            dataIndex: 'actionDate',
            render: date => Datetime.of(date as Date).fDatetime({format: 'DD MMM YYYY, HH:mm:ss'})
        },
        {
            title: 'IP',
            key: 'ip',
            dataIndex: 'ipAddress',
        },
        {
            title: 'Description',
            key: 'description',
            dataIndex: 'description',
        }
    ], [])

    const cardData = useCallback((activities: UserActivity[]) => {
        if (!Array.isArray(activities)) return [] as DataProps<UserActiveLogin>[]
        return activities?.map(a => ({
            id: a.id,
            description: <div>
                <Flex align='start' vertical>
                    <Typography.Title level={4} style={{color: '#333'}}>{a?.action || '-'}</Typography.Title>
                    <p style={{color: '#666'}}>{a.description}</p>
                </Flex>
                <Divider />
                <Flex align='center' justify='start' style={{color: '#666'}}>
                    <span>le {Datetime.of(a?.actionDate as Date).fDatetime({format: 'DD MMM YYYY, HH:mm:ss'})}</span>
                    <Divider type='vertical' />
                    <span>IP: {a?.ipAddress}</span>
                </Flex>
            </div>,
        })) as DataProps<UserActivity>[]
    }, [])

    const handleUpdateFilters = (value: ActivityFilterProps) => {
        setFilters(value)
        setIsRefetch(false)
    }

    return(
        <section style={{marginTop: '30px'}}>
            <Responsive gutter={[16, 16]}>
                <Grid xs={24} md={12} lg={12} style={{color: '#666'}}>
                    Vérifiez les activités récentes liés à ce compte utilisateur. Contrôlez régulièrement la sécurité
                    de votre compte afin d’éviter toute activité suspecte.
                </Grid>
            </Responsive>
            <ListViewer
                callback={getPaginatedUserActivities as () => Promise<never>}
                callbackParams={[accountId, filters as ActivityFilterProps]}
                tableColumns={columns}
                countTitle={'Activité'}
                cardData={cardData as () => never}
                cardNotAvatar
                fetchId='user-activities'
                displayItem={3}
                refetchCondition={shouldRefetch}
                itemSize={20}
                filters={<UserActivityFilter setFilters={handleUpdateFilters} />}
                tableHeight={800}
                localStorage={{
                    activeIcon: 'activityToggleIcon'
                }}
            />
        </section>
    )
}

export default UserActivityPage