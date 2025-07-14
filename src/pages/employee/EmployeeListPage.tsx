import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../core/utils/text_display.ts";
import {Breadcrumb, useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {ListPageHierarchy} from "../../components/custom/ListPageHierarchy.tsx";
import {useRedirect} from "../../hooks/useRedirect.ts";
import {LuEllipsisVertical, LuEye, LuUserPlus} from "react-icons/lu";
import ListViewer from "../../components/custom/ListViewer.tsx";
import {fetchAllEmployees, fetchSearchedEmployees} from "../../data/action/employeeAction.ts";
import {TableColumnsType, Tag} from "antd";
import {Employee} from "../../entity";
import {AvatarTitle} from "../../components/ui/layout/AvatarTitle.tsx";
import {firstWord, getAge} from "../../core/utils/utils.ts";
import {Gender} from "../../entity/enums/gender.tsx";
import {StatusTags} from "../../core/utils/tsxUtils.tsx";
import {ActionButton} from "../../components/ui/layout/ActionButton.tsx";
import {BiSolidUserAccount} from "react-icons/bi";
import {AiOutlineUserDelete} from "react-icons/ai";
import {DataProps} from "../../core/utils/interfaces.ts";
import {Status} from "../../entity/enums/status.ts";
import {useCallback} from "react";

const EmployeeListPage = () => {
    const {toAddEmployee, toViewEmployee} = useRedirect()

    useDocumentTitle({
        title: text.employee.label,
        description: "Employee description",
    })

    const pageHierarchy = useBreadCrumb([
        {
            title: text.employee.label + 's'
        }
    ])

    const getSlug = useCallback((employee: Employee) => {
        const first = firstWord(employee.personalInfo?.firstName)
        const last = firstWord(employee.personalInfo?.lastName)
        return (`${first}_${last}`)?.toLowerCase()
    }, [])

    const getItems = (employee: Employee) => {
        const slug = getSlug(employee)
        return [
            {
                key: `details-${employee.id}`,
                icon: <LuEye size={20}/>,
                label: 'Voir Profile',
                onClick: () => toViewEmployee(slug, employee.id)
            },
            {
                key: `account-${employee.id}`,
                icon: <BiSolidUserAccount size={20}/>,
                label: 'Compte Employee',
                onClick: () => alert('Création de compte')
            },
            {
                key: `delete-${employee.id}`,
                icon: <AiOutlineUserDelete size={20}/>,
                label: 'Retirer l\'Employé',
                danger: true
            }
        ]
    }

    const cardData = (data: Employee[]) => data?.map(e => ({
        id: e.id,
        lastName: e?.personalInfo?.lastName,
        firstName: e?.personalInfo?.firstName,
        gender: e?.personalInfo?.gender,
        reference: e.personalInfo?.emailId,
        tag: <StatusTags status={e.personalInfo?.status as Status} female={e.personalInfo?.gender === Gender.FEMME} />,
        description: <div></div>
    })) as DataProps<Employee>[]

    const columns: TableColumnsType<Employee> = [
        {
            title: 'Nom(s) & Prénom(s)',
            key: 'lastName',
            dataIndex: ['personalInfo', "lastName"],
            sorter: true,
            render: (_lastname, {personalInfo, id}) => (
                <AvatarTitle personalInfo={personalInfo} link={text.employee.group.view.href + id} />
            )
        },
        {
            title: 'Poste',
            dataIndex: 'jobTitle',
            key: 'jobTitle',
            align: 'center',
        },
        {
            title: 'Genre',
            dataIndex: ['personalInfo', 'gender'],
            key: 'gender',
            align: 'center',
            responsive: ['md'],
            onFilter: (value, record) => record?.personalInfo?.gender ?
                record?.personalInfo?.gender.indexOf(value as string) === 0 : false
        },
        {
            title: "Age",
            dataIndex: ['personalInfo', 'birthDate'],
            key: 'birthDate',
            align: 'center',
            sorter: true,
            responsive: ['md'],
            render: (text) => getAge(text, true)
        },
        {
            title: "Status",
            dataIndex: ['personalInfo', 'status'],
            key: 'status',
            align: 'center',
            responsive: ['md'],
            sorter: true,
            showSorterTooltip: false,
            render: (text, {personalInfo}) => <StatusTags status={text} female={personalInfo?.gender === Gender.FEMME} />
        },
        {
            title: "Type de contrat",
            dataIndex: 'contractType',
            key: 'contractType',
            align: 'center',
            sorter: true,
            showSorterTooltip: false,
            render: (contreType: string) => <Tag>{contreType}</Tag>
        },
        {
            title: "Téléphone",
            dataIndex: ['personalInfo', 'telephone'],
            key: 'telephone',
            align: 'center',
        },
        {
            title: "Action",
            dataIndex: 'id',
            key: 'action',
            align: 'right',
            width: '6%',
            render: (_id: string, record: Employee) => (
                <ActionButton
                    icon={<LuEllipsisVertical size={30} style={{borderStyle: 'border'}} />}
                    items={getItems(record)}
                />
            )
        }
    ]

    return(
        <>
            <ListPageHierarchy
                items={pageHierarchy as [Breadcrumb]}
                onClick={toAddEmployee}
                icon={<LuUserPlus />}
                label={text.employee.group.add.label}
                hasButton
            />
            <ListViewer
                callback={fetchAllEmployees as () => Promise<never>}
                searchCallback={fetchSearchedEmployees as () => Promise<never>}
                tableColumns={columns}
                cardData={cardData}
                throughDetails={(data: Employee) => toViewEmployee(getSlug(data), data.id)}
                fetchId={"employees-list"}
            />
        </>
    )
}

export default EmployeeListPage;