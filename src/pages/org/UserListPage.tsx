import {useUserRepo} from "../../hooks/actions/useUserRepo.ts";
import {ListPageHierarchy} from "../../components/custom/ListPageHierarchy.tsx";
import ListViewer from "../../components/custom/ListViewer.tsx";
import {useRedirect} from "../../hooks/useRedirect.ts";
import {getSlug, MAIN_COLOR} from "../../core/utils/utils.ts";
import {DataProps} from "../../core/utils/interfaces.ts";
import {User} from "../../auth/dto/user.ts";
import {Space, TableColumnsType} from "antd";
import {Role, RoleEnum} from "../../auth/dto/role.ts";
import {AvatarTitle} from "../../components/ui/layout/AvatarTitle.tsx";
import {ActionButton} from "../../components/ui/layout/ActionButton.tsx";
import Tag from "../../components/ui/layout/Tag.tsx"
import {
    LuCircleCheckBig, LuEllipsisVertical, LuLockKeyhole,
    LuTable2, LuUserCog,
    LuUserRoundPlus
} from "react-icons/lu";
import {useCallback, useMemo, useState} from "react";
import {useBreadcrumbItem} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import Datetime from "../../core/datetime.ts";
import {UserActionLinks} from "../../components/ui-kit-org";
import {ItemType} from "antd/es/menu/interface";

const UserListPage = () => {
    const {toSaveUser, toViewUser} = useRedirect()

    const breadCrumb = useBreadcrumbItem([
        {title: text.org.group.school.label, path: text.org.group.school.href},
        {title: text.org.group.user.label}
    ])

    useDocumentTitle({
        title: text.org.group.user.label,
        description: "User description"
    })

    const [refetch, setRefetch] = useState(false)
    const [linkButtons, setLinkButtons] = useState<ItemType[]>([])
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined)
    const {getPaginatedUsers, getSearchedUsers} = useUserRepo()

    const toView = useCallback((id: string | number, record?: User) => {
        const slug = getSlug({firstName: record?.firstName, lastName: record?.lastName})
        toViewUser(id as number, slug)
    }, [toViewUser])

    const getItems = useCallback((usr?: User) => {
        return [
            {
                key: `details-${usr?.id}`,
                icon: <LuUserCog />,
                label: 'Manager Utilisateur',
                onClick: () => toView(usr?.id as number, usr),
            },
            ...linkButtons
        ]
    }, [linkButtons, toView])

    const cardData = (data: User[]) => data?.map(u => ({
        id: u?.id,
        lastName: u?.lastName,
        firstName: u?.firstName,
        reference: u?.email,
        AntTag: <Space>
            {u?.roles?.map(role => (
                <Tag key={`role=${role}`} textColor={'#dddde1'} color={MAIN_COLOR}>
                    {RoleEnum[role]}
                </Tag>
            ))}
        </Space>,
        record: u,
        description: <div>
            Dernière connection le {Datetime.of(u?.lastLogin).format('DD MMM YYYY - HH:mm')}
        </div>,
    })) as DataProps<User>[]

    const columns: TableColumnsType<User> = useMemo(() => [
        {
            title: 'Utilisateurs',
            key: 'lastName',
            dataIndex: "lastName",
            sorter: true,
            showSorterTooltip: false,
            render: (_lastname, record: User) => (
                <AvatarTitle
                    firstName={record?.firstName}
                    lastName={record?.lastName}
                    reference={record?.email ?? record?.username}
                    toView={() => toView(record?.id, record)}
                />
            )
        },
        {
            title: 'Role',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles: Role[]) => <Space>
                {roles?.map(role => (
                    <Tag key={`role=${role}`} textColor={'#dddde1'} color={MAIN_COLOR}>
                        {RoleEnum[role]}
                    </Tag>
                ))}
            </Space>
        },
        {
            title: 'Status',
            dataIndex: "enabled",
            key: 'enabled',
            responsive: ['md'],
            render: (enabled: boolean, record) => {
                const enabledTag = enabled
                    ? <Tag icon={<LuCircleCheckBig />} color='success'>Activé</Tag>
                    : <Tag icon={<LuLockKeyhole />} color='danger'>Désactivé</Tag>

                const lockedTag = record?.accountNonLocked
                    ? <Tag icon={<LuCircleCheckBig />} color='success'>disponible</Tag>
                    : <Tag icon={<LuLockKeyhole />} color='danger'>Vérrouillé</Tag>

                return <Space>
                    {enabledTag} {lockedTag}
                </Space>
            }
        },
        {
            title: 'Dernière Connection',
            dataIndex: "lastLogin",
            key: 'lastLogin',
            responsive: ['md'],
            sorter: true,
            showSorterTooltip: false,
            render: lastLogin => lastLogin
                ? Datetime.of(lastLogin).format({format: 'DD MMM YYYY - HH:mm'})
                : "-"
        },
        {
            title: <LuTable2 />,
            dataIndex: 'id',
            key: 'action',
            align: 'right',
            render: (_id: string, record: User) => {
                return (
                    <ActionButton
                        icon={<LuEllipsisVertical size={30} style={{borderStyle: 'border'}} />}
                        items={getItems(record) as []}
                    />
                )
            }
        }
    ], [getItems, toView])


    return <>
        <ListPageHierarchy
            items={breadCrumb}
            onClick={toSaveUser}
            icon={<LuUserRoundPlus />}
            label={text.org.group.user.add.label}
            hasButton
        />
        <ListViewer
            callback={getPaginatedUsers as () => Promise<never>}
            searchCallback={getSearchedUsers as () => Promise<never>}
            tableColumns={columns}
            cardData={cardData}
            dropdownItems={(_url?: string, record?: User) => getItems(record) as []}
            throughDetails={toView}
            countTitle='Utilisateur'
            localStorage={{
                activeIcon: 'userActiveIcon',
                pageSize: 'userPageSize',
                page: 'userPage',
                pageCount: 'userPageCount'
            }}
            fetchId={"users-list"}
            onSelectData={setSelectedUser}
            refetchCondition={refetch}
        />
        <section>
            <UserActionLinks
                data={selectedUser}
                getItems={setLinkButtons}
                setRefresh={setRefetch}
            />
        </section>
    </>
}

export default UserListPage;
