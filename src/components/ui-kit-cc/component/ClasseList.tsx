import {TableColumnsType, Tag} from "antd";
import {Classe, Department} from "@/entity";
import {LuEye} from "react-icons/lu";
import ListViewer from "@/components/custom/ListViewer.tsx";
import {text} from "@/core/utils/text_display.ts";
import {AxiosResponse} from "axios";
import {currency, fDatetime} from "@/core/utils/utils.ts";
import {DataProps} from "@/core/utils/interfaces.ts";
import {SuperWord} from "@/core/utils/tsxUtils.tsx";
import {useClasseRepo} from "@/hooks/actions/useClasseRepo.ts";
import {AvatarTitle} from "@/components/ui/layout/AvatarTitle.tsx";
import {anyIsUniversity, SectionType} from "@/entity/enums/section.ts";
import {useCallback, useMemo, useState} from "react";
import {ItemType} from "antd/es/menu/interface";
import {useGradeRepo} from "@/hooks/actions/useGradeRepo.ts";
import {usePermission} from "@/hooks/usePermission.ts";
import {UserPermission} from "@/core/shared/sharedEnums.ts";
import {ClasseActionLinks} from "@/components/ui-kit-cc";
import {useRedirect} from "@/hooks/useRedirect.ts";

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

    const getItems = useCallback((url?: string): ItemType[] => {
        if (url)
            return [
                {
                    key: `details-${url}`,
                    icon: <LuEye />,
                    label: text.cc.group.classe.view.label,
                    onClick: () => throughDetails(url)
                },
                ...(linkButtons && linkButtons?.length > 0 ? [
                    {type: 'divider'} as ItemType,
                    ...linkButtons
                ] : []),
            ]
        return []
    }, [linkButtons, throughDetails])

    const cardData = (data: Classe[]) => {
        return data?.map(c => ({
            id: c.id,
            lastName: c.name,
            reference: c.category,
            description: <div style={{
                textAlign: 'center',
            }}>
                <div style={{marginBottom: '5px'}}>Niveau Académique</div>
                <div><Tag color='geekblue'>{c.grade.section}</Tag></div>
            </div>
        })) as DataProps<Classe>[]
    }

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

    return (<>
        <ListViewer
            callback={getPaginatedClasses as () => Promise<AxiosResponse<Classe[]>>}
            searchCallback={getSearchedClasses as (input: unknown) => Promise<AxiosResponse<Classe[]>>}
            tableColumns={columns}
            dropdownItems={getItems}
            throughDetails={throughDetails}
            countTitle='Classe'
            fetchId='classe-list'
            cardData={cardData}
            cardNotAvatar={true}
            localStorage={{
                activeIcon: 'classeActiveIcon'
            }}
            onRowRedirect={record => throughDetails(record?.id)}
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