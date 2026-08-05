import {useDocumentTitle} from "@/hooks/useDocumentTitle.ts";
import {text} from "@/core/utils/text_display.ts";
import {BreadcrumbType, useBreadcrumbItem} from "@/hooks/useBreadCrumb.tsx";
import {LuEllipsisVertical, LuEye, LuHandshake, LuUserPlus, LuUserRoundPlus} from "react-icons/lu";
import {Button, Divider, Flex, TableColumnsType, Tag} from "antd";
import {Teacher, TeacherCourses} from "@/entity";
import {Avatar} from "@/components/ui/layout/Avatar.tsx";
import {enumToObjectArrayForFiltering, getAge, setFirstName, setPlural} from "@/core/utils/utils.ts";
import {Gender} from "@/entity/enums/gender.tsx";
import {AffiliateStatusTag} from "@/core/utils/tsxUtils.tsx";
import {ActionButton} from "@/components/ui/layout/ActionButton.tsx";
import {ListPageHierarchy} from "@/components/custom/ListPageHierarchy.tsx";
import ListViewer from "@/components/custom/ListViewer.tsx";
import {AxiosResponse} from "axios";
import {DataProps} from "@/core/utils/interfaces.ts";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {useMemo, useState} from "react";
import {ItemType} from "antd/es/menu/interface";
import {TeacherActionLinks} from "@/components/ui-kit-teacher";
import {UserPermission} from "@/core/shared/sharedEnums.ts";
import {usePermission} from "@/hooks/usePermission.ts";

const TeacherListPage = () => {
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | undefined>(undefined)
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

    const cardData = (data: Teacher[]) => {
        return data?.map(t => ({
            id: t.id,
            lastName: t?.personalInfo?.lastName,
            firstName: t?.personalInfo?.firstName,
            gender: t?.personalInfo?.gender,
            reference: t?.personalInfo?.emailId,
            tag: <AffiliateStatusTag status={t?.status} />,
            record: t,
            description: <>
                <Divider style={{fontSize: '12px'}}>Cours ou classes</Divider>
                <Flex gap={2} wrap justify={"center"}>
                    {(t.courses && t.courses.length > 0
                        ? t.courses.map((tcc) => tcc?.course?.course).filter(Boolean)
                        : t.classes?.map((c) => c?.classe?.name).filter(Boolean) ?? []).map((item, index) => (
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
                            <Tag key={index}>{c.course.course}</Tag>
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
                cardData={cardData}
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