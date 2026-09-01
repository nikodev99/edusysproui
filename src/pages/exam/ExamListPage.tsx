import {useDocumentTitle} from "@/hooks/useDocumentTitle.ts";
import {useText} from "@/core/utils/text_display.ts";
import {BreadcrumbType, useBreadcrumbItem} from "@/hooks/useBreadCrumb.tsx";
import {ListPageHierarchy} from "@/components/custom/ListPageHierarchy.tsx";
import {LuCalendarPlus, LuClipboardList, LuEllipsis, LuEllipsisVertical, LuEye} from "react-icons/lu";
import {AxiosResponse} from "axios";
import {Assignment, Classe, Course, Individual} from "@/entity";
import ListViewer from "@/components/custom/ListViewer.tsx";
import {useEffect, useMemo, useState} from "react";
import {Space, TableColumnsType, Tag as AntTag, Typography} from "antd";
import {SuperWord} from "@/core/utils/tsxUtils.tsx";
import {AvatarTitle} from "@/components/ui/layout/AvatarTitle.tsx";
import Datetime from "@/core/datetime.ts";
import Tag from "@/components/ui/layout/Tag.tsx";
import {ActionButton} from "@/components/ui/layout/ActionButton.tsx";
import {cutStatement, setFirstName, setName} from "@/core/utils/utils.ts";
import {AssignmentFilter, ExamActionLinks} from "@/components/ui-kit-exam";
import {useAcademicYearRepo} from "@/hooks/actions/useAcademicYearRepo.ts";
import {AssignmentTypeLiteral, typeColors} from "@/entity/enums/assignmentType.ts";
import {ItemType} from "antd/es/menu/interface";
import {useAssignmentRepo} from "@/hooks/actions/useAssignmentRepo.ts";
import {UserPermission} from "@/core/shared/sharedEnums.ts";
import {AssignmentFilterProps} from "@/entity/domain/assignment.ts";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {usePermission} from "@/hooks/usePermission.ts";
import {getExamPalette} from "@/core/helpers/colorPalette.ts";
import {EntityCardProps} from "@/components/custom/EntityCard.tsx";
import {Section, SectionType} from "@/entity/enums/section.ts";
import {objectHelper} from "@/core/helpers/ObjectHelper.ts";

const ExamListPage = () => {
    const [filters, setFilters] = useState<AssignmentFilterProps | null>(null)
    const [isRefetch, setIsRefetch] = useState(false)
    const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)
    const [links, setLinks] = useState<ItemType[]>([])
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null | undefined>(null)
    const {currentAcademicYear, academicYearOptions} = useAcademicYearRepo()
    const {canViewAll, canViewSome} = usePermission()
    const text = useText()
    
    const context = useMemo(() => 
        canViewAll ? UserPermission.ALL : canViewSome ? UserPermission.TEACHER : UserPermission.NONE, [
            canViewAll, canViewSome
    ])
    
    const {useGetPaginatedExams} = useAssignmentRepo(context)
    const {toAddExam, toViewExam, toViewCourse, toViewClasse} = useRedirect()
    
    const {getAllSchoolAssignments} = useGetPaginatedExams()

    const { Text } = Typography

    useDocumentTitle({
        title: text.exam.label,
        description: "Exams description",
    })

    const pageHierarchy = useBreadcrumbItem([
        {title: text.exam.label},
    ])

    useEffect(() => {
        setFilters({
            academicYearId: currentAcademicYear?.id as string
        })
    }, [currentAcademicYear?.id]);

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

    const getItems = (url?: string, record?: Assignment) => {
        return [
            {
                key: `details-${url}`,
                icon: <LuEye />,
                label: text.exam.group.view.label,
                onClick: () => toViewExam(record?.id as number)
            },
            ...links,
        ]
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
            render: (value: string, record) => <SuperWord
                input={cutStatement(value, 40)}
                onClick={() => toViewExam(record?.id as number)}
                tooltip={value}
                isSpan
            />
        },
        {
            title: 'Matière',
            dataIndex: 'subject',
            key: 'subject',
            align: "center",
            width: '12%',
            sorter: true,
            showSorterTooltip: false,
            render: (subject: Course, record) => !objectHelper.isEmpty(subject) ? (
                <Text onClick={() => toViewCourse(subject?.id as number)} className='course-Link'>
                    {subject?.course}
                </Text>
            ): (
                <Tag>{SectionType[record?.classe?.grade?.section as Section]}</Tag>
            )
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
                () => toViewClasse(classe.id)
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
                personalInfo={teacher}
                size={30}
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
                {isPassed ? undefined : Datetime.now().isAfter(record?.examDate as Date) ? <Tag color='danger'>Dépassée</Tag> : undefined}
            </Space>
        },
        {
            title: <LuEllipsis size={30} style={{borderStyle: 'border'}} />,
            dataIndex: 'id',
            key: 'action',
            align: 'right',
            width: '6%',
            render: (id, record) => (
                <ActionButton
                    icon={<LuEllipsisVertical size={30} style={{borderStyle: 'border'}} />}
                    items={getItems(id, record)}
                    arrow
                />
            )
        }
    ]

    const handleCardRender = (record: Assignment[]) => {
        return record?.map(r => {
            const literal = AssignmentTypeLiteral[r?.type as unknown as keyof typeof AssignmentTypeLiteral]
            const date = Datetime.of(r?.examDate as Date)
            const start = date.timeToDatetime(r?.startTime as [])?.time()
            const end = date.timeToDatetime(r?.endTime as [])?.time()
            const preparedBy = setName(r?.preparedBy)
            const colors = getExamPalette(literal)
            return {
                id: r.id as number,
                record: r,
                ariaLabel: `Fiche étudiant – ${r.examName}`,
                palette: colors,
                header: {type: 'icon', icon: <LuClipboardList size={36} color={colors.accentColor}/>},
                pillText: `${literal}-#${r?.id}`,
                rightText: `${r?.semester?.academicYear?.academicYear} - ${r?.semester?.template?.semesterName}`,
                titlePrimary : {primary: cutStatement(r?.examName as string, 35), tooltipTitle: r?.examName && r?.examName?.length > 40 ? r?.examName : undefined},
                titleSecondary: `Préparé par ${preparedBy}`,
                stats: [
                    {label: "Classe", value: r?.classe?.name},
                    ...(!objectHelper.isEmpty(r?.subject as Course) ? [
                        {label: 'Matière', value: cutStatement(r?.subject?.course as string, 10, r?.subject?.abbr)}
                    ]: [
                        {label: 'Section', value: SectionType[r?.classe?.grade?.section as Section]}
                    ]),
                    ...((r?.coefficient && r?.coefficient > 1) ? [{label: 'Coefficient', value: r?.coefficient, small: true}]: []),
                    {label: 'Date', value: date.format({format: "DD MMM YYYY"}), small: true}
                ],
                tags: [
                    <Space>
                        <Tag color={!r?.passed ? 'warning': 'success'}>{!r?.passed ? 'Programmé' : 'Traité'}</Tag>
                        {r?.passed ? undefined : Datetime.now().isAfter(r?.examDate as Date) ? <Tag color='danger'>Dépassée</Tag> : undefined}
                    </Space>,
                ],
                footerLabel: "Heures: ",
                footerValue: <strong>{start}-{end}</strong>,
                redirectTo: (_id, record) => toViewExam(record?.id as number),
                dropdown: <ActionButton items={getItems(selectedAssignment?.id as never, selectedAssignment as Assignment)} />,
            } as EntityCardProps<Assignment>
        })
    }

    const handleUpdateFilters = (value: AssignmentFilterProps) => {
        setFilters(value)
        setIsRefetch(false)
    }

    const filterParams = [filters]
    const academicOptions = academicYearOptions()

    return(
        <>
            <ListPageHierarchy
                items={pageHierarchy as [BreadcrumbType]}
                onClick={toAddExam}
                icon={<LuCalendarPlus />}
                label={text.exam.group.add.label}
                hasButton
            />
            <ListViewer
                callback={getAllSchoolAssignments as () => Promise<AxiosResponse<Assignment[]>>}
                callbackParams={filterParams}
                tableColumns={tableColumns}
                dropdownItems={getItems}
                countTitle={text.exam.label}
                cardRender={handleCardRender}
                fetchId='exam-list'
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
                    academicYear={currentAcademicYear?.id as string}
                    academicYearOptions={academicOptions}
                    setFilters={handleUpdateFilters}
                />}
                onSelectData={setSelectedAssignment}
            />
            {selectedAssignment && <ExamActionLinks
                data={selectedAssignment as Assignment}
                getItems={setLinks}
                setRefresh={setIsRefetch}
            />}
        </>
    )
}

export default ExamListPage