import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../core/utils/text_display.ts";
import {BreadcrumbType, useBreadcrumbItem} from "../../hooks/useBreadCrumb.tsx";
import {redirectTo} from "../../context/RedirectContext.ts";
import {LuEllipsisVertical, LuEye} from "react-icons/lu";
import {BiSolidUserAccount} from "react-icons/bi";
import {AiOutlineUserDelete, AiOutlineUsergroupAdd} from "react-icons/ai";
import {Divider, Flex, TableColumnsType, Tag} from "antd";
import {Classe, Course, Teacher} from "../../entity";
import {Avatar} from "../../components/ui/layout/Avatar.tsx";
import {enumToObjectArrayForFiltering, getAge, setFirstName} from "../../core/utils/utils.ts";
import {Gender} from "../../entity/enums/gender.tsx";
import {StatusTags} from "../../core/utils/tsxUtils.tsx";
import {ActionButton} from "../../components/ui/layout/ActionButton.tsx";
import {ListPageHierarchy} from "../../components/custom/ListPageHierarchy.tsx";
import ListViewer from "../../components/custom/ListViewer.tsx";
import {fetchTeachers} from "../../data";
import {AxiosResponse} from "axios";
import {useRef} from "react";
import {Status} from "../../entity/enums/status.ts";
import {DataProps} from "../../core/utils/interfaces.ts";
import {getSearchedTeachers} from "../../data/repository/teacherRepository.ts";

const TeacherListPage = () => {

    useDocumentTitle({
        title: text.teacher.label,
        description: 'Teacher list',
    })

    const pageHierarchy = useBreadcrumbItem([
        {
            title: text.teacher.label + 's'
        }
    ])

    const addUrl = useRef(text.teacher.group.add.href)
    const viewUrl = useRef(text.teacher.group.view.href)

    const throughDetails = (link: string): void => {
        redirectTo(`${viewUrl.current}${link}`)
    }

    const getItems = (url: string) => {
        return [
            {
                key: `details-${url}`,
                icon: <LuEye size={20}/>,
                label: 'Voir l\'enseignant',
                onClick: () => throughDetails(url)
            },
            {
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
            }
        ]
    }

    const cardData = (data: Teacher[]) => {
        return data?.map(t => ({
            id: t.id,
            lastName: t?.personalInfo?.lastName,
            firstName: t?.personalInfo?.firstName,
            gender: t?.personalInfo?.gender,
            reference: t?.personalInfo?.emailId,
            tag: <StatusTags status={t?.personalInfo?.status as Status} female={t?.personalInfo?.gender === Gender.FEMME} />,
            description: <>
                <Divider style={{fontSize: '12px'}}>Cours ou classes</Divider>
                <Flex gap={2} wrap justify={"center"}>
                    {(t.courses && t.courses.length > 0
                        ? t.courses.map((tcc) => tcc?.course).filter(Boolean)
                        : t.classes?.map((c) => c?.name).filter(Boolean) ?? []).map((item, index) => (
                        <Tag key={index}>{item}</Tag>
                    ))}
                </Flex>
            </>
        })) as DataProps<Teacher>[]
    }

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
            render: (text) => getAge(text) + 'ans'
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
            title: "Matières",
            dataIndex: 'courses',
            key: 'emailId',
            align: 'center',
            width: "15%",
            render: (text: Course[], record: Teacher) => {
                if (text && text?.length > 0) {
                    return<Flex justify='center' gap={2} wrap>
                        {text?.map((c: Course, index: number) => (
                            <Tag key={index}>{c.course}</Tag>
                        ))}
                    </Flex>
                }else {
                    return <Flex justify='center' gap={2} wrap>
                        {record?.classes?.map((c: Classe, index: number) => (
                            <Tag key={index}>{c?.name}</Tag>
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
            render: (text) => (
                <ActionButton
                    icon={<LuEllipsisVertical size={30} style={{borderStyle: 'border'}} />}
                    items={getItems(text)}
                />
            )
        }
    ]

    return (
        <>
            <ListPageHierarchy
                items={pageHierarchy as [BreadcrumbType]}
                onClick={() => redirectTo(addUrl.current)}
                hasButton
                type='primary'
                icon={<AiOutlineUsergroupAdd />}
                label='Ajouter enseignant'
            />
            <ListViewer
                callback={fetchTeachers as () => Promise<AxiosResponse<Teacher[]>>}
                searchCallback={getSearchedTeachers as ((...input: unknown[]) => Promise<AxiosResponse<Teacher[]>>)}
                tableColumns={columns as TableColumnsType<Teacher>}
                dropdownItems={getItems}
                throughDetails={throughDetails}
                countTitle={text.teacher.label}
                cardData={cardData}
                localStorage={{
                    activeIcon: 'teacherActiveIcon',
                    pageSize: 'teacherPageSize',
                    page: 'teacherPage',
                    pageCount: 'teacherPageCount'
                }}
                fetchId='teacher-list'
            />
        </>
    )
}

export default TeacherListPage