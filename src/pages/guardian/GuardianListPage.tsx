import {ListPageHierarchy} from "@/components/custom/ListPageHierarchy.tsx";
import {BreadcrumbType, useBreadcrumbItem} from "@/hooks/useBreadCrumb.tsx";
import {text} from "@/core/utils/text_display.ts";
import {useDocumentTitle} from "@/hooks/useDocumentTitle.ts";
import ListViewer from "@/components/custom/ListViewer.tsx";
import {TableColumnsType} from "antd";
import {Avatar} from "@/components/ui/layout/Avatar.tsx";
import {enumToObjectArrayForFiltering, getSlug, setFirstName} from "@/core/utils/utils.ts";
import {Gender, SelectedGenderIcon} from "@/entity/enums/gender.tsx";
import {Guardian} from "@/entity";
import {ActionButton} from "@/components/ui/layout/ActionButton.tsx";
import {LuEye} from "react-icons/lu";
import {StatusTags} from "@/core/utils/tsxUtils.tsx";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {useGuardianRepo} from "@/hooks/actions/useGuardianRepo.ts";
import {useMemo, useState} from "react";
import {ItemType} from "antd/es/menu/interface";
import {GuardianActionLinks} from "@/components/ui-kit-guardian";
import {UserPermission} from "@/core/shared/sharedEnums.ts";
import {usePermission} from "@/hooks/usePermission.ts";
import {getGuardianPalette} from "@/core/helpers/colorPalette.ts";
import Tag from "@/components/ui/layout/Tag.tsx";
import Datetime from "@/core/datetime.ts";
import {EntityCardProps} from "@/components/custom/EntityCard.tsx";
import {Status} from "@/entity/enums/status.ts";

const GuardianListPage = () => {
    const [selectedGuardian, setSelectedGuardian] = useState<Guardian | undefined | null>(undefined)
    const [linkButtons, setLinkButtons] = useState<ItemType[]>([])
    const [refresh, setRefresh] = useState<boolean>(false)
    const { canViewAll, canViewSelf, canViewSome } = usePermission()
    const {toViewGuardian} = useRedirect()

    const context = useMemo(() => {
        if (canViewAll) {
            return UserPermission.ALL
        }
        if (canViewSome) {
            return UserPermission.TEACHER
        }

        if (canViewSelf) {
            return UserPermission.GUARDIAN
        }
    }, [canViewAll, canViewSelf, canViewSome])

    const {useGetPaginated} = useGuardianRepo(context)

    useDocumentTitle({
        title: text.guardian.label,
        description: 'Guardian Description'
    })

    const pageHierarchy = useBreadcrumbItem([
        {
            title: text.guardian.label
        }
    ])

    const {getPaginatedGuardian, getSearchedGuardian} = useGetPaginated()

    const throughDetails = (id: string | number, record?: Guardian): void => {
        return toViewGuardian(id as string, getSlug({personalInfo: record?.personalInfo}))
    }

    const getItems = (_url?: string, record?: Guardian) => {
        return [
            {
                key: `details-${record?.id}`,
                icon: <LuEye />,
                label: 'Voir le tuteur',
                onClick: () => throughDetails(record?.id as string, record),
            },
            ...linkButtons
        ]
    }

    const columns: TableColumnsType<Guardian> = [
        {
            title: 'Nom(s) et Prénons',
            dataIndex: ['personalInfo', 'lastName'],
            key: 'lastName',
            width: '20%',
            sorter: true,
            align: 'start',
            showSorterTooltip: false,
            className: 'col__name',
            onCell: ({id}) => ({
                onClick: (): void => throughDetails(id)
            }),
            render: (text, {personalInfo}) => (
                <div className='render__name'>
                    <Avatar firstText={personalInfo?.firstName} lastText={text} />
                    <div>
                        <p>{`${text?.toUpperCase()}, ${setFirstName(personalInfo?.firstName)}`}</p>
                        <p className='st__ref'>{personalInfo?.reference || personalInfo?.emailId}</p>
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
            onFilter: (value, record) => record?.personalInfo?.gender.indexOf(value as string) === 0
        },
        {
            title: "Status",
            dataIndex: ['personalInfo', 'status'],
            key: 'status',
            align: 'center',
            responsive: ['md'],
            render: (text, {personalInfo}) => <StatusTags status={text} female={personalInfo?.gender === Gender.FEMME} />
        },
        {
            title: "Numéro de téléphone",
            dataIndex: ['personalInfo', 'telephone'],
            key: 'telephone',
            align: 'center',
            responsive: ['md'],
        },
        {
            title: "Email",
            dataIndex: ['personalInfo', 'emailId'],
            key: 'emailId',
            align: 'center',
            //TODO getting all the grade distinct classes and filter by grade
        },
        {
            title: '',
            dataIndex: 'id',
            key: 'action',
            align: 'right',
            render: () => <ActionButton items={getItems(selectedGuardian?.id, selectedGuardian as Guardian)} />
        }
    ]

    const handleActionButton = (record?: Guardian) => {
        const hasParam = !!record
        return (
            <ActionButton
                idKey={hasParam ? record?.id: ''}
                onSelect={hasParam ? (key) => setSelectedGuardian(record?.id === key ? record : undefined): undefined}
                items={selectedGuardian && selectedGuardian?.id === record?.id ? getItems(record?.id as string, record) : []}
                dropdownProps={hasParam ? {open: Boolean(selectedGuardian?.id === record?.id)}: undefined}
            />
        )
    }

    const handleCardRender = (record: Guardian[]) => {
        return record?.map(r => {
            const colors = getGuardianPalette(r?.personalInfo?.gender as keyof typeof Gender)
            return {
                id: r.id as string,
                record: r,
                ariaLabel: `Fiche étudiant – ${r.personalInfo?.firstName} ${r.personalInfo?.lastName}`,
                palette: colors,
                header: {type: "avatar", image: r.personalInfo?.image, firstText: r.personalInfo?.firstName, lastText: r.personalInfo?.lastName},
                pillText: r.personalInfo?.reference,
                rightText: text.guardian.label,
                titlePrimary :r.personalInfo?.firstName.charAt(0) + r.personalInfo?.firstName.slice(1).toLowerCase(),
                titleSecondary: r.personalInfo?.lastName.charAt(0) + r.personalInfo?.lastName.slice(1).toLowerCase(),
                stats: [
                    {label: "Téléphone", value: r?.personalInfo?.telephone, small: true},
                    ...(r?.company ? [{label: "Employeur", value: r?.company ?? 0, small: true}]: []),
                    ...(r?.jobTitle ? [{label: "Poste", value: r?.jobTitle ?? "—", small: true}]: [])
                ],
                tags: [
                    <Tag color={colors.genderTagBg} textColor={colors.genderTagColor} icon={<SelectedGenderIcon gender={colors.genderLabel as Gender}/>}>
                        {colors.genderLabel}
                    </Tag>,
                    <StatusTags status={r?.personalInfo?.status as Status} female={r?.personalInfo?.gender === Gender.FEMME} />
                ],
                footerLabel: "Enregistré le",
                footerValue: Datetime.of(r?.createdAt as Date).format({format: "DD MMM YYYY"}),
                redirectTo: throughDetails,
                dropdown: handleActionButton?.(r)
            } as EntityCardProps<Guardian>
        })
    }

    return(
        <>
            <ListPageHierarchy
                items={pageHierarchy as [BreadcrumbType]}
            />
            <ListViewer
                callback={getPaginatedGuardian as never}
                searchCallback={getSearchedGuardian as never}
                tableColumns={columns as TableColumnsType<Guardian>}
                dropdownItems={getItems}
                countTitle='Liste de Tuteur'
                hasCount={false}
                cardRender={handleCardRender}
                fetchId='guardian-list'
                onSelectData={setSelectedGuardian}
                refetchCondition={refresh}
            />
            {selectedGuardian && <section>
                <GuardianActionLinks
                    getItems={setLinkButtons}
                    data={selectedGuardian}
                    setRefresh={setRefresh}
                />
            </section>}
        </>
    )
}

export default GuardianListPage