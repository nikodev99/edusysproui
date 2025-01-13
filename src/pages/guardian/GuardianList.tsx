import {ListPageHierarchy} from "../../components/custom/ListPageHierarchy.tsx";
import {Breadcrumb, setBreadcrumb} from "../../core/breadcrumb.tsx";
import {text} from "../../utils/text_display.ts";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import ListViewer from "../../components/custom/ListViewer.tsx";
import {TableColumnsType} from "antd";
import {Avatar} from "../../components/ui/layout/Avatar.tsx";
import {enumToObjectArrayForFiltering, setFirstName} from "../../utils/utils.ts";
import {Gender} from "../../entity/enums/gender.tsx";
import {Guardian} from "../../entity";
import {fetchEnrolledStudentsGuardians, fetchSearchedEnrolledStudentsGuardian} from "../../data";
import {ActionButton} from "../../components/ui/layout/ActionButton.tsx";
import {LuEye} from "react-icons/lu";
import {redirectTo} from "../../context/RedirectContext.ts";
import {AxiosResponse} from "axios";
import {Response} from "../../data/action/response.ts";
import {AiOutlineUserDelete} from "react-icons/ai";
import {BiSolidUserAccount} from "react-icons/bi";
import {statusTags} from "../../utils/tsxUtils.tsx";
import {Status} from "../../entity/enums/status.ts";
import {DataProps} from "../../utils/interfaces.ts";

const GuardianList = () => {

    useDocumentTitle({
        title: text.guardian.label,
        description: 'Guardian Description'
    })

    const pageHierarchy = setBreadcrumb([
        {
            title: text.guardian.label
        }
    ])

    const throughDetails = (link: string): void => {
        redirectTo(`${text.guardian.group.view.href}${link}`)
    }

    const getItems = (url: string) => {
        return [
            {
                key: `details-${url}`,
                icon: <LuEye size={20} />,
                label: 'Voir le tuteur',
                onClick: () => throughDetails(url)
            },
            {
                key: `account-${url}`,
                icon: <BiSolidUserAccount size={20} />,
                label: 'Créer compte tuteur',
                onClick: () => alert('Création de compte')
            },
            {
                key: `delete-${url}`,
                icon: <AiOutlineUserDelete size={20} />,
                label: 'Supprimer',
                danger: true
            }
        ]
    }

    const columns: TableColumnsType<Guardian> = [
        {
            title: 'Nom(s) et Prénons',
            dataIndex: ['personalInfo', 'lastName'],
            key: 'lastName',
            width: '20%',
            sorter: true,
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
                        <p className='st__ref'>{personalInfo?.emailId}</p>
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
            render: (text, {personalInfo}) => statusTags(text, personalInfo?.gender === Gender.FEMME)
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
            render: (text) => (<ActionButton items={getItems(text)} />)
        }
    ]

    const cardData = (data: Guardian[]) => {
        return data?.map(c => ({
            id: c.id,
            lastName: c.personalInfo?.lastName,
            firstName: c.personalInfo?.firstName,
            gender: c.personalInfo?.gender,
            reference: c.personalInfo?.emailId,
            tag: statusTags(c.personalInfo?.status as Status, c.personalInfo?.gender === Gender.FEMME),
            description: []
        })) as DataProps[]
    }

    return(
        <>
            <ListPageHierarchy items={pageHierarchy as [Breadcrumb]} />
            <ListViewer
                callback={fetchEnrolledStudentsGuardians as () => Promise<AxiosResponse<Guardian[]>>}
                searchCallback={fetchSearchedEnrolledStudentsGuardian as (input: unknown) => Promise<Response<Guardian>>}
                tableColumns={columns as TableColumnsType<Guardian>}
                dropdownItems={getItems}
                throughDetails={throughDetails}
                countTitle='Liste de Tuteur'
                hasCount={false}
                cardData={cardData}
                fetchId='guardian-list'
            />
        </>
    )
}

export default GuardianList