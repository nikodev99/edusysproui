import {ListPageHierarchy} from "@/components/custom/ListPageHierarchy.tsx";
import {BreadcrumbType, useBreadcrumbItem} from "@/hooks/useBreadCrumb.tsx";
import {text} from "@/core/utils/text_display.ts";
import {useDocumentTitle} from "@/hooks/useDocumentTitle.ts";
import ListViewer from "@/components/custom/ListViewer.tsx";
import {TableColumnsType} from "antd";
import {Avatar} from "@/components/ui/layout/Avatar.tsx";
import {enumToObjectArrayForFiltering, getSlug, setFirstName} from "@/core/utils/utils.ts";
import {Gender} from "@/entity/enums/gender.tsx";
import {Guardian} from "@/entity";
import {ActionButton} from "@/components/ui/layout/ActionButton.tsx";
import {LuEye} from "react-icons/lu";
import {StatusTags} from "@/core/utils/tsxUtils.tsx";
import {Status} from "@/entity/enums/status.ts";
import {DataProps} from "@/core/utils/interfaces.ts";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {useGuardianRepo} from "@/hooks/actions/useGuardianRepo.ts";
import {useState} from "react";
import {ItemType} from "antd/es/menu/interface";
import {GuardianActionLinks} from "@/components/ui-kit-guardian";

const GuardianListPage = () => {
    const [selectedGuardian, setSelectedGuardian] = useState<Guardian | undefined>(undefined)
    const [linkButtons, setLinkButtons] = useState<ItemType[]>([])
    const [refresh, setRefresh] = useState<boolean>(false)
    const {useGetPaginated} = useGuardianRepo()
    const {toViewGuardian} = useRedirect()

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
        return toViewGuardian(id, getSlug({personalInfo: record?.personalInfo}))
    }

    const getItems = (_url?: string, record?: Guardian) => {
        return [
            {
                key: `details-${record?.id}`,
                icon: <LuEye />,
                label: 'Voir le tuteur',
                onClick: () => throughDetails(record?.id)
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
            render: (id, record) => (<ActionButton items={getItems(id, record)} />)
        }
    ]

    const cardData = (data: Guardian[]) => {
        return data?.map(c => ({
            id: c.id,
            lastName: c.personalInfo?.lastName,
            firstName: c.personalInfo?.firstName,
            gender: c.personalInfo?.gender as Gender,
            reference: c.personalInfo?.emailId,
            tag: <StatusTags status={c.personalInfo?.status as Status} female={c.personalInfo?.gender === Gender.FEMME} />,
            description: [],
        })) || [] as DataProps<Guardian>[]
    }

    return(
        <>
            <ListPageHierarchy items={pageHierarchy as [BreadcrumbType]} />
            <ListViewer
                callback={getPaginatedGuardian}
                searchCallback={getSearchedGuardian}
                tableColumns={columns as TableColumnsType<Guardian>}
                dropdownItems={getItems}
                throughDetails={throughDetails}
                countTitle='Liste de Tuteur'
                hasCount={false}
                cardData={cardData as never}
                fetchId='guardian-list'
                onSelectData={setSelectedGuardian}
                refetchCondition={refresh}
            />
            <section>
                <GuardianActionLinks
                    getItems={setLinkButtons}
                    data={selectedGuardian}
                    setRefresh={setRefresh}
                />
            </section>
        </>
    )
}

export default GuardianListPage