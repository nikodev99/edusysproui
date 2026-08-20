import {useDocumentTitle} from "@/hooks/useDocumentTitle.ts";
import {text} from "@/core/utils/text_display.ts";
import {BreadcrumbType, useBreadcrumbItem} from "@/hooks/useBreadCrumb.tsx";
import {LuEllipsisVertical, LuEye, LuHandshake, LuUserPlus, LuUserRoundPlus} from "react-icons/lu";
import {Button, Flex, TableColumnsType} from "antd";
import Tag from "@/components/ui/layout/Tag.tsx";
import {Teacher, TeacherCourses} from "@/entity";
import {Avatar} from "@/components/ui/layout/Avatar.tsx";
import {
    cutStatement,
    enumToObjectArrayForFiltering,
    setFirstName,
    setPlural
} from "@/core/utils/utils.ts";
import {Gender, SelectedGenderIcon} from "@/entity/enums/gender.tsx";
import {AffiliateStatusTag} from "@/core/utils/tsxUtils.tsx";
import {ActionButton} from "@/components/ui/layout/ActionButton.tsx";
import {ListPageHierarchy} from "@/components/custom/ListPageHierarchy.tsx";
import ListViewer from "@/components/custom/ListViewer.tsx";
import {AxiosResponse} from "axios";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {useMemo, useState} from "react";
import {ItemType} from "antd/es/menu/interface";
import {TeacherActionLinks} from "@/components/ui-kit-teacher";
import {UserPermission} from "@/core/shared/sharedEnums.ts";
import {usePermission} from "@/hooks/usePermission.ts";
import {EntityCardProps} from "@/components/custom/EntityCard.tsx";
import Datetime from "@/core/datetime.ts";
import {ContractTypeEnum} from "@/entity/enums/contractType.ts";
import {getTeacherPalette} from "@/core/helpers/colorPalette.ts";
import {datehelper} from "@/core/helpers/DateHelpers.ts";

const TeacherListPage = () => {
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | undefined | null>(undefined)
    const [linkButtons, setLinkButtons] = useState<ItemType[]>([])
    const [refresh, setRefresh] = useState<boolean>(false)
    const {toViewTeacher, toAddTeacher, toAffiliateTeacher} = useRedirect()
    const {canViewAll, canViewSelf} = usePermission()
    
    const context = useMemo(() => {
        if (canViewAll) {
            return UserPermission.ALL
        }
        if (canViewSelf) {
            return UserPermission.TEACHER
        }
        return UserPermission.NONE
    }, [canViewAll, canViewSelf])
    
    const {useGetPaginated} = useTeacherRepo(context)
    const {getPaginatedTeachers, getSearchedTeachers} = useGetPaginated()

    useDocumentTitle({
        title: text.teacher.label,
        description: 'Teacher list',
    })

    const pageHierarchy = useBreadcrumbItem([
        {
            title: setPlural(text.teacher.label)
        }
    ])

    const throughDetails = (link: string): void => {
        toViewTeacher(link)
    }

    const getItems = (url: string) => {
        return [
            {
                key: `details-${url}`,
                icon: <LuEye />,
                label: 'Voir l\'enseignant',
                onClick: () => throughDetails(url)
            },
            ...linkButtons
            /*{
                key: `account-${url}`,
                icon: <BiSolidUserAccount size={20}/>,
                label: 'Compte enseignant',
                onClick: () => alert('Création de compte')
            },
            {
                key: `delete-${url}`,
                icon: <AiOutlineUserDelete size={20}/>,
                label: 'Retirer l\'enseignant',
                danger: true
            }*/
        ]
    }

    const handleActionButton = (record?: Teacher) => {
        const hasParam = !!record
        return (
            <ActionButton
                idKey={hasParam ? record?.id: ''}
                onSelect={hasParam ? (key) => setSelectedTeacher(record?.id === key ? record : undefined): undefined}
                items={selectedTeacher && selectedTeacher?.id === record?.id ? getItems(record?.id as string) : []}
                dropdownProps={hasParam ? {open: Boolean(selectedTeacher?.id === record?.id)}: undefined}
            />
        )
    }

    const actionButton = <ActionButton
        icon={<LuEllipsisVertical size={30} style={{borderStyle: 'border'}} />}
        items={getItems(selectedTeacher?.id as string)}
    />

    const columns: TableColumnsType<Teacher> = [
        {
            title: 'Nom(s) et Prénons',
            dataIndex: ['personalInfo', 'lastName'],
            key: 'lastName',
            width: '20%',
            sorter: true,
            showSorterTooltip: false,
            className: 'col__name',
            onCell: (data) => ({
                onClick: (): void => throughDetails(data?.id ? data.id : '')
            }),
            render: (text, {personalInfo}) => (
                <div className='render__name'>
                    <Avatar firstText={personalInfo?.firstName} lastText={text}/>
                    <div>
                        <p style={{textAlign: 'left'}}>
                            {`${text?.toUpperCase()}, ${setFirstName(personalInfo?.firstName)}`}
                        </p>
                        <p className='st__ref'>{personalInfo?.reference ?? personalInfo?.emailId}</p>
                    </div>
                </div>
            )
        },
        {
            title: 'Genre',
            dataIndex: ['personalInfo', 'gender'],
            key: 'gender',
            align: 'center',
            //TODO the filter directly to the database
            filters: enumToObjectArrayForFiltering(Gender),
            sorter: true,
            showSorterTooltip: false,
            onFilter: (value, record) => record?.personalInfo?.gender ?
                record?.personalInfo?.gender.indexOf(value as string) === 0 : false
        },
        {
            title: "Age",
            dataIndex: ['personalInfo', 'birthDate'],
            key: 'birthDate',
            align: 'center',
            responsive: ['md'],
            sorter: true,
            render: (text) => datehelper.timeAgo(text, {isUpper: false})
        },
        {
            title: "Status",
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            responsive: ['md'],
            sorter: true,
            showSorterTooltip: false,
            render: (status) => <AffiliateStatusTag status={status} />
        },
        {
            title: "Matières",
            dataIndex: 'courses',
            key: 'emailId',
            align: 'center',
            width: "15%",
            render: (text: TeacherCourses[], record: Teacher) => {
                if (text && text?.length > 0) {
                    return<Flex justify='center' gap={2} wrap>
                        {text?.map((c, index: number) => (
                            <Tag key={index}>{cutStatement(c.course.course as string, 10, c?.course?.abbr)}</Tag>
                        ))}
                    </Flex>
                }else {
                    return <Flex justify='center' gap={2} wrap>
                        {record?.classes?.map((c, index: number) => (
                            <Tag key={index}>{c?.classe?.name}</Tag>
                        ))}
                    </Flex>
                }
            }
            //TODO getting all the grade distinct classes and filter by grade
        },
        {
            title: "Téléphone",
            dataIndex: ['personalInfo', 'telephone'],
            key: 'telephone',
            align: 'center',
            responsive: ['md'],
        },
        {
            title: "Action",
            dataIndex: 'id',
            key: 'action',
            align: 'right',
            width: '6%',
            render: () => actionButton
        }
    ]

    const handleCardRender = (record: Teacher[]) => {
        return record?.map(r => {
            const colors = getTeacherPalette(r?.personalInfo?.gender as keyof typeof Gender)
            return {
                id: r.id as string,
                record: r,
                ariaLabel: `Fiche Enseignant – ${r.personalInfo?.firstName} ${r.personalInfo?.lastName}`,
                palette: colors,
                header: {type: "avatar", image: r.personalInfo?.image, firstText: r.personalInfo?.firstName, lastText: r.personalInfo?.lastName},
                pillText: r.personalInfo?.reference,
                rightText: text.teacher.label,
                titlePrimary :r.personalInfo?.firstName.charAt(0) + r.personalInfo?.firstName.slice(1).toLowerCase(),
                titleSecondary: r.personalInfo?.lastName.charAt(0) + r.personalInfo?.lastName.slice(1).toLowerCase(),
                stats: [
                    {label: "Age", value: datehelper.timeAgo(r?.personalInfo?.birthDate, {showLabels: false})},
                    {label: "Classes", value: r?.classes?.map(c => `${c.classe.name}`)?.join(', '), small: true},
                    ...(r?.courses && r?.courses?.length > 0 ? [{label: "Matières", value: r?.courses?.map(c => `${cutStatement(c.course.course as string, 10, c?.course?.abbr)}`)?.join(', '), small: true}] : []),
                ],
                tags: [
                    <Tag color={colors.genderTagBg} textColor={colors.genderTagColor} icon={<SelectedGenderIcon gender={colors.genderLabel as Gender}/>}>
                        {colors.genderLabel}
                    </Tag>,
                    ...(r?.contract?.contractType ? [<Tag color={colors.accentColor} textColor={colors.accentSoft}>
                        {(ContractTypeEnum[r?.contract?.contractType] ?? "")?.toUpperCase()}
                    </Tag>] : []),
                    ...(r?.status ? [<AffiliateStatusTag status={r?.status} />] : [])
                ],
                footerLabel: "Embauché le",
                footerValue: Datetime.of(r.contract?.startDate).format({format: "DD MMM YYYY"}),
                isDimmed: r.status !== 'ACTIVE',
                redirectTo: throughDetails,
                dropdown: handleActionButton?.(r as Teacher)
            } as EntityCardProps<Teacher>
        })
    }

    return (
        <>
            <ListPageHierarchy
                items={pageHierarchy as [BreadcrumbType]}
                hasDropdownButton
                dropdownItems={[
                    {key: '1', label: 'Nouveau enseignant', icon: <LuUserRoundPlus />, onClick: () => toAddTeacher()},
                    {key: '2', label: 'Affilié enseignant', icon: <LuHandshake />, onClick: () => toAffiliateTeacher() },
                ]}
                icon={<Button type='primary'><LuUserPlus /> {text.teacher.group.add.label}</Button>}
            />
            <ListViewer
                callback={getPaginatedTeachers as () => Promise<AxiosResponse<Teacher[]>>}
                searchCallback={getSearchedTeachers as ((...input: unknown[]) => Promise<AxiosResponse<Teacher[]>>)}
                tableColumns={columns as TableColumnsType<Teacher>}
                dropdownItems={getItems as never}
                throughDetails={throughDetails as never}
                countTitle={text.teacher.label}
                cardRender={handleCardRender}
                localStorage={{
                    activeIcon: 'teacherActiveIcon',
                    pageSize: 'teacherPageSize',
                    page: 'teacherPage',
                    pageCount: 'teacherPageCount'
                }}
                fetchId='teacher-list'
                refetchCondition={refresh}
                onSelectData={setSelectedTeacher}
            />
            {selectedTeacher && (
                <TeacherActionLinks
                    getItems={setLinkButtons}
                    data={selectedTeacher}
                    setRefresh={setRefresh}
                />
            )}
        </>
    )
}

export default TeacherListPage