import {useDocumentTitle} from "@/hooks/useDocumentTitle.ts";
import {text} from "@/core/utils/text_display.ts";
import {BreadcrumbType, useBreadcrumbItem} from "@/hooks/useBreadCrumb.tsx";
import {ListPageHierarchy} from "@/components/custom/ListPageHierarchy.tsx";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {LuEllipsisVertical, LuEye, LuUserPlus} from "react-icons/lu";
import ListViewer from "@/components/custom/ListViewer.tsx";
import {fetchAllEmployees, fetchSearchedEmployees} from "@/data/action/employeeAction.ts";
import {TableColumnsType} from "antd";
import {Employee} from "@/entity";
import {AvatarTitle} from "@/components/ui/layout/AvatarTitle.tsx";
import {getAge, getSlug} from "@/core/utils/utils.ts";
import {Gender} from "@/entity/enums/gender.tsx";
import {StatusTags} from "@/core/utils/tsxUtils.tsx";
import {ActionButton} from "@/components/ui/layout/ActionButton.tsx";
import {BiSolidUserAccount} from "react-icons/bi";
import {AiOutlineUserDelete} from "react-icons/ai";
import {EntityCardProps} from "@/components/custom/EntityCard.tsx";
import {getEmployeePalette} from "@/core/helpers/colorPalette.ts";
import Datetime from "@/core/datetime.ts";

const EmployeeListPage = () => {
    const {toAddEmployee, toViewEmployee} = useRedirect()

    useDocumentTitle({
        title: text.employee.label,
        description: "Employee description",
    })

    const pageHierarchy = useBreadcrumbItem([
        {
            title: text.employee.label + 's'
        }
    ])

    const redirectToView = (id: string | number, employee?: Employee) => {
        const slug:string | undefined = employee?.personalInfo ? getSlug({personalInfo: employee?.personalInfo}) : undefined
        toViewEmployee(id as string, slug)
    }

    const getItems = (employee?: Employee) => {
        return [
            {
                key: `details-${employee?.id}`,
                icon: <LuEye size={20}/>,
                label: 'Voir Profile',
                onClick: () => redirectToView(employee?.id as string, employee)
            },
            {
                key: `account-${employee?.id}`,
                icon: <BiSolidUserAccount size={20}/>,
                label: 'Compte Employee',
                onClick: () => alert('Création de compte')
            },
            {
                key: `delete-${employee?.id}`,
                icon: <AiOutlineUserDelete size={20}/>,
                label: 'Retirer l\'Employé',
                danger: true
            }
        ]
    }

    /*const handleActionButton = (record?: Teacher) => {
        const hasParam = !!record
        return (
            <ActionButton
                idKey={hasParam ? record?.id: ''}
                onSelect={hasParam ? (key) => setSelectedTeacher(record?.id === key ? record : undefined): undefined}
                items={selectedTeacher && selectedTeacher?.id === record?.id ? getItems(record?.id as string) : []}
                dropdownProps={hasParam ? {open: Boolean(selectedTeacher?.id === record?.id)}: undefined}
            />
        )
    }*/

    const handleCardRender = (record: Employee[]) => {
        return record?.map(r => {
            const colors = getEmployeePalette(r?.personalInfo?.gender as keyof typeof Gender)
            return {
                id: r.id as string,
                record: r,
                ariaLabel: `Fiche Employé – ${r.personalInfo?.firstName} ${r.personalInfo?.lastName}`,
                palette: colors,
                header: {type: "avatar", image: r.personalInfo?.image, firstText: r.personalInfo?.firstName, lastText: r.personalInfo?.lastName},
                pillText: r.personalInfo?.reference,
                rightText: text.teacher.label,
                titlePrimary :r.personalInfo?.firstName.charAt(0) + r.personalInfo?.firstName.slice(1).toLowerCase(),
                titleSecondary: r.personalInfo?.lastName.charAt(0) + r.personalInfo?.lastName.slice(1).toLowerCase(),
                footerLabel: "Embauché le",
                footerValue: Datetime.of(r.contract?.startDate).format({format: "DD MMM YYYY"}),
                isDimmed: r.contract?.status !== 'ACTIVE',
                redirectTo: redirectToView,
                dropdown: <div>dropdown</div>
            } as EntityCardProps<Employee>
        })
    }

    const columns: TableColumnsType<Employee> = [
        {
            title: 'Nom(s) & Prénom(s)',
            key: 'lastName',
            dataIndex: ['personalInfo', "lastName"],
            sorter: true,
            render: (_lastname, record: Employee) => (
                <AvatarTitle
                    personalInfo={record?.personalInfo}
                    link={text.employee.group.view.href + record?.id}
                    slug={getSlug({personalInfo: record?.personalInfo})}
                />
            )
        },
        {
            title: 'Poste',
            dataIndex: ['contract', 'jobTitle'],
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
                items={pageHierarchy as [BreadcrumbType]}
                onClick={toAddEmployee}
                icon={<LuUserPlus />}
                label={text.employee.group.add.label}
                hasButton
            />
            <ListViewer
                callback={fetchAllEmployees as () => Promise<never>}
                searchCallback={fetchSearchedEmployees as () => Promise<never>}
                tableColumns={columns}
                cardRender={handleCardRender}
                dropdownItems={(_url?: string, record?: Employee) => getItems(record)}
                throughDetails={redirectToView}
                fetchId={"employees-list"}
            />
        </>
    )
}

export default EmployeeListPage;