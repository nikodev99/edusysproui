import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../core/utils/text_display.ts";
import {BreadcrumbType, useBreadcrumbItem} from "../../hooks/useBreadCrumb.tsx";
import {ListPageHierarchy} from "../../components/custom/ListPageHierarchy.tsx";
import {redirectTo} from "../../context/RedirectContext.ts";
import {LuCalendarPlus, LuEllipsis, LuEllipsisVertical, LuEye} from "react-icons/lu";
import {AssignmentFilterProps, getAllAssignments} from "../../data/repository/assignmentRepository.ts";
import {AxiosResponse} from "axios";
import {Assignment, Classe, Course, Individual} from "../../entity";
import ListViewer from "../../components/custom/ListViewer.tsx";
import {useEffect, useMemo, useState} from "react";
import {Space, TableColumnsType, Tag as AntTag, Typography} from "antd";
import {AssignmentDescription, SuperWord} from "../../core/utils/tsxUtils.tsx";
import {AvatarTitle} from "../../components/ui/layout/AvatarTitle.tsx";
import Datetime from "../../core/datetime.ts";
import Tag from "../../components/ui/layout/Tag.tsx";
import {ActionButton} from "../../components/ui/layout/ActionButton.tsx";
import {setFirstName} from "../../core/utils/utils.ts";
import {AssignmentFilter, ExamActionLinks} from "../../components/ui-kit-exam";
import {useAcademicYearRepo} from "../../hooks/actions/useAcademicYearRepo.ts";
import {AssignmentTypeLiteral, typeColors} from "../../entity/enums/assignmentType.ts";
import {ItemType} from "antd/es/menu/interface";

const ExamListPage = () => {

    const {useGetCurrentAcademicYear, useGetAllAcademicYear} = useAcademicYearRepo()
    const [filters, setFilters] = useState<AssignmentFilterProps>()
    const [usedAcademicYearId, setUsedAcademicYearId] = useState<string>()
    const [isRefetch, setIsRefetch] = useState(false)
    const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)
    const [links, setLinks] = useState<ItemType[]>([])
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)

    const academicYear = useGetCurrentAcademicYear()
    const academicYears = useGetAllAcademicYear()

    const {Link, Text} = Typography

    useDocumentTitle({
        title: text.exam.label,
        description: "Exams description",
    })

    const pageHierarchy = useBreadcrumbItem([
        {title: text.exam.label},
    ])

    useEffect(() => {
        if (academicYear) {
            setUsedAcademicYearId(academicYear.id)
        }

        setFilters({
            academicYearId: usedAcademicYearId as string
        })
    }, [academicYear, usedAcademicYearId]);

    useEffect(() => {
        setFilters(prev => {
            const base = { ...prev };

            if (searchQuery) {
                base.search = searchQuery;
            } else {
                const noSearch = { ...base };
                if ('search' in noSearch) {
                    delete noSearch.search;
                }
                return noSearch as AssignmentFilterProps;
            }

            return base as AssignmentFilterProps;
        });

        setIsRefetch(false);
    }, [searchQuery, setFilters]);

    useEffect(() => {
        if (searchQuery === undefined && filters && Object.keys(filters).length > 1 && !isRefetch) {
            setIsRefetch(true)
        }
    }, [filters, isRefetch, searchQuery]);

    const getItems = (id: string) => {
        return [
            {
                key: `details-${id}`,
                icon: <LuEye />,
                label: text.exam.group.view.label,
                onClick: () => redirectTo(text.exam.group.view.href + id)
            },
            ...links,
        ]
    }

    const cardData = (data: Assignment[]) => {
        return data?.map(c => ({
            id: c.id,
            description: <AssignmentDescription a={c} link show plus />,
            record: c
        })) as []
    }

    const tableColumns: TableColumnsType<Assignment> = [
        {
            title: 'Titre de l\'évaluation',
            dataIndex: 'examName',
            key: 'examName',
            align: 'left',
            width: '20%',
            sorter: true,
            showSorterTooltip: false,
            render: (value, record) => <Link
                onClick={() => redirectTo(text.exam.group.view.href + record?.id)}
            >
                {value}
            </Link>
        },
        {
            title: 'Matière',
            dataIndex: 'subject',
            key: 'subject',
            align: "center",
            width: '12%',
            sorter: true,
            showSorterTooltip: false,
            render: (subject: Course) => <Text
                onClick={() => redirectTo(text.cc.group.course.view.href + subject?.id)}
                className='course-Link'
            >
                {subject?.course}
            </Text>
        },
        {
            title: "Classe",
            dataIndex: 'classe',
            key: 'classe',
            align: 'center',
            width: '10%',
            sorter: true,
            showSorterTooltip: false,
            render: (classe: Classe) => <AntTag.CheckableTag onClick={
                () => redirectTo(text.cc.group.classe.view.href + classe.id)
            } checked>
                <SuperWord input={classe?.name} />
            </AntTag.CheckableTag>
        },
        {
            title: "Date",
            dataIndex: 'examDate',
            key: 'examDate',
            align: 'center',
            width: '10%',
            responsive: ['md'],
            sorter: true,
            showSorterTooltip: false,
            render: (text: number[]) => <span>
                {setFirstName(Datetime.of(text).fDate("DD MMM YYYY"))}
            </span>
        },
        {
            title: "Type",
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            width: '10%',
            responsive: ['md'],
            sorter: true,
            showSorterTooltip: false,
            render: (value: AssignmentTypeLiteral) => {
                const type = AssignmentTypeLiteral[value as unknown as keyof typeof AssignmentTypeLiteral]
                return (<AntTag color={typeColors(type) as string}>{type}</AntTag>)
            }
        },
        {
            title: "Préparer par",
            dataIndex: 'preparedBy',
            key: 'preparedBy',
            align: "left",
            width: '16%',
            responsive: ['md'],
            render: (teacher: Individual) => <AvatarTitle
                lastName={teacher?.lastName}
                firstName={teacher?.firstName}
                image={teacher?.image}
                reference={teacher?.emailId}
                size={35}
            />
        },
        {
            title: "Status",
            dataIndex: 'passed',
            key: 'passed',
            align: 'center',
            width: '16%',
            render: (isPassed: true, record: Assignment) => <Space>
                <Tag color={!isPassed ? 'warning': 'success'}>{!isPassed ? 'Programmé' : 'Traité'}</Tag>
                {isPassed ? undefined : Datetime.now().isAfter(record?.examDate as Date) ? <Tag color='danger'>Date Dépassée</Tag> : undefined}
            </Space>
        },
        {
            title: <LuEllipsis size={30} style={{borderStyle: 'border'}} />,
            dataIndex: 'id',
            key: 'action',
            align: 'right',
            width: '6%',
            render: (id) => (
                <ActionButton
                    icon={<LuEllipsisVertical size={30} style={{borderStyle: 'border'}} />}
                    items={getItems(id)}
                    arrow
                />
            )
        }
    ]

    const handleUpdateFilters = (value: AssignmentFilterProps) => {
        setFilters(value)
        setIsRefetch(false)
    }

    const filterParams = [filters]
    const academicYearOptions = useMemo(() => academicYears?.map(a => ({
        value: a.id,
        label: a.academicYear
    })), [academicYears])

    return(
        <>
            <ListPageHierarchy
                items={pageHierarchy as [BreadcrumbType]}
                onClick={() => redirectTo(text.exam.group.add.href)}
                icon={<LuCalendarPlus />}
                label={text.exam.group.add.label}
                hasButton
            />
            <ListViewer
                callback={getAllAssignments as () => Promise<AxiosResponse<Assignment[]>>}
                callbackParams={filterParams}
                tableColumns={tableColumns}
                dropdownItems={getItems}
                countTitle={text.exam.label}
                cardData={cardData}
                fetchId='exam-list'
                cardNotAvatar={true}
                itemSize={12}
                displayItem={3}
                localStorage={{
                    activeIcon: 'examActiveIcon',
                    pageSize: 'examPageSize',
                    page: 'examPage',
                    pageCount: 'examPageCount',
                }}
                shareSearchQuery={setSearchQuery}
                refetchCondition={isRefetch}
                filters={<AssignmentFilter
                    academicYear={usedAcademicYearId as string}
                    academicYearOptions={academicYearOptions}
                    setFilters={handleUpdateFilters}
                />}
                onSelectData={setSelectedAssignment}
            />
            <ExamActionLinks
                assignment={selectedAssignment as Assignment}
                getLinks={setLinks}
                setRefetch={setIsRefetch}
            />
        </>
    )
}

export default ExamListPage