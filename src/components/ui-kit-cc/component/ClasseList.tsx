import {TableColumnsType} from "antd";
import Tag from "@/components/ui/layout/Tag.tsx";
import {Classe, Department} from "@/entity";
import {LuEye, LuGraduationCap} from "react-icons/lu";
import ListViewer from "@/components/custom/ListViewer.tsx";
import {text} from "@/core/utils/text_display.ts";
import {AxiosResponse} from "axios";
import {currency, fDatetime} from "@/core/utils/utils.ts";
import {ID} from "@/core/utils/interfaces.ts";
import {SuperWord} from "@/core/utils/tsxUtils.tsx";
import {useClasseRepo} from "@/hooks/actions/useClasseRepo.ts";
import {AvatarTitle} from "@/components/ui/layout/AvatarTitle.tsx";
import {anyIsUniversity, formatGrade, SectionType} from "@/entity/enums/section.ts";
import {useCallback, useMemo, useState} from "react";
import {ItemType} from "antd/es/menu/interface";
import {useGradeRepo} from "@/hooks/actions/useGradeRepo.ts";
import {usePermission} from "@/hooks/usePermission.ts";
import {UserPermission} from "@/core/shared/sharedEnums.ts";
import {ClasseActionLinks} from "@/components/ui-kit-cc";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {ActionButton} from "@/components/ui/layout/ActionButton.tsx";
import {getClassePalette} from "@/core/helpers/colorPalette.ts";
import Datetime from "@/core/datetime.ts";
import {EntityCardProps} from "@/components/custom/EntityCard.tsx";
import {objectHelper} from "@/core/helpers/ObjectHelper.ts";

export const ClasseList = ({condition}: {condition?: boolean}) => {
    const [selectedClasse, setSelectedClasse] = useState<Classe | null>(null)
    const [linkButtons, setLinkButtons] = useState<ItemType[]>([])
    const [refresh, setRefresh] = useState<boolean>(condition as boolean)
    const {toViewClasse} = useRedirect()
    const {useGetAllGrades} = useGradeRepo()
    const {canViewAll, canViewSome} = usePermission()

    const context = useMemo(() => {
        if (canViewAll) return UserPermission.ALL
        if (canViewSome) return UserPermission.TEACHER
        return UserPermission.NONE
    }, [canViewAll, canViewSome])

    const {useGetPaginated} = useClasseRepo(context)
    const {getPaginatedClasses, getSearchedClasses} = useGetPaginated()
    const grades = useGetAllGrades()

    const isUniv = anyIsUniversity(grades?.map(g => g.section as string) || [])

    const throughDetails = useCallback((link: string | number) => {
        toViewClasse(link as number)
    }, [toViewClasse])

    const getItems = useCallback((url?: ID): ItemType[] => {
        if (url)
            return [
                {
                    key: `details-${url}`,
                    icon: <LuEye />,
                    label: text.cc.group.classe.view.label,
                    onClick: () => throughDetails(url as number)
                },
                ...(linkButtons && linkButtons?.length > 0 ? [
                    {type: 'divider'} as ItemType,
                    ...linkButtons
                ] : []),
            ]
        return []
    }, [linkButtons, throughDetails])

    const columns: TableColumnsType<Classe> = [
        {
            title: "Classe",
            dataIndex: 'name',
            key: 'name',
            align: 'left',
            sorter: true,
            showSorterTooltip: false,
            render: (text) => <SuperWord input={text} />
        },
        {
            title: "Category",
            dataIndex: 'category',
            key: 'category',
            align: 'center',
        },
        ...(isUniv ? [{
            title: 'Département',
            dataIndex: 'department',
            key: 'department',
            render: (department: Department) => {
                if (!department || !Object.keys(department).length) return <span style={{ color: '#aaa' }}>—</span>; // or return null
                return (
                    <AvatarTitle
                        firstName={department.name}
                        reference={department.code}
                        size={40}
                    />
                );
            }
        }]: []),
        {
            title: "Niveau",
            dataIndex: ['grade', 'section'],
            key: 'grade',
            align: 'center',
            render: (text) => (<Tag color='geekblue'>{SectionType[text]}</Tag>)
            //TODO getting all the grade distinct grade and filter by grade
        },

        {
            title: 'Numéro de la classe',
            dataIndex: 'roomNumber',
            key: 'roomNumber',
            align: 'center',
        },

        {
            title: "Montant par mois",
            dataIndex: 'monthCost',
            key: 'monthCost',
            align: 'right',
            render: amount => currency(amount)
        },
        {
            title: "Date d'ajout",
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'right',
            render: text => fDatetime(text, true)
        }
    ];

    const handleActionButton = (record?: Classe) => {
        const hasParam = !!record
        return (
            <ActionButton
                idKey={hasParam ? `${record?.id}`: ''}
                onSelect={hasParam ? (key) => setSelectedClasse(record?.id === Number(key) ? record : null): undefined}
                items={selectedClasse && selectedClasse?.id === record?.id ? getItems(record?.id as number) : []}
                dropdownProps={hasParam ? {open: Boolean(selectedClasse?.id === record?.id)}: undefined}
            />
        )
    }

    const handleCardRender = (record: Classe[]) => {
        return record?.map(r => {
            const colors = getClassePalette()
            return {
                id: r.id as number,
                record: r,
                ariaLabel: `Fiche étudiant – ${r.name}`,
                palette: colors,
                header: {type: 'icon', icon: <LuGraduationCap size={36} color={colors.accentColor} />},
                pillText: r?.category,
                rightText: formatGrade(SectionType[r?.grade?.section as keyof typeof SectionType])?.toUpperCase(),
                titlePrimary :r.name,
                stats: [
                    {label: "Salle", value: r?.roomNumber ?? "—"},
                    {label: "Coût/mois", value: r?.monthCost ? `${r.monthCost}` : "—", small: true},
                ],
                tags: [
                    ...(r.department && !objectHelper.isEmpty(r.department) ? [
                        <Tag color={colors.accentSoft} textColor={colors.accentColor}>{r?.department?.name?.toUpperCase()}</Tag>
                    ]: [])
                ],
                footerLabel: "Créée le",
                footerValue: Datetime.of(r?.createdAt as Date).format({format: "DD MMM YYYY"}),
                redirectTo: throughDetails,
                dropdown: handleActionButton?.(r),
            } as EntityCardProps<Classe>
        })
    }

    return (<>
        <ListViewer
            callback={getPaginatedClasses as () => Promise<AxiosResponse<Classe[]>>}
            searchCallback={getSearchedClasses as (input: unknown) => Promise<AxiosResponse<Classe[]>>}
            tableColumns={columns}
            dropdownItems={getItems}
            countTitle='Classe'
            fetchId='classe-list'
            cardRender={handleCardRender}
            localStorage={{
                activeIcon: 'classeActiveIcon'
            }}
            onRowRedirect={record => throughDetails(record?.id as number)}
            getSelectedRecord={setSelectedClasse}
            refetchCondition={refresh}
            descMargin={{size: '10px 0'}}
        />
        {selectedClasse && <ClasseActionLinks
            getItems={setLinkButtons}
            data={selectedClasse}
            setRefresh={setRefresh}
        />}
    </>)
}