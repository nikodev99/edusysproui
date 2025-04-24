import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../core/utils/text_display.ts";
import {Breadcrumb, useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {ListPageHierarchy} from "../../components/custom/ListPageHierarchy.tsx";
import {redirectTo} from "../../context/RedirectContext.ts";
import {LuCalendarPlus, LuEllipsisVertical, LuEye} from "react-icons/lu";
import {AssignmentFilter, getAllAssignments} from "../../data/repository/assignmentRepository.ts";
import {AxiosResponse} from "axios";
import {Assignment, Classe, Course, Individual} from "../../entity";
import ListViewer from "../../components/custom/ListViewer.tsx";
import {useAcademicYear} from "../../hooks/useAcademicYear.ts";
import {useEffect, useState} from "react";
import {Space, TableColumnsType, Tag as AntTag, Typography} from "antd";
import {DataProps} from "../../core/utils/interfaces.ts";
import {AssignmentDescription, SuperWord} from "../../core/utils/tsxUtils.tsx";
import {AvatarTitle} from "../../components/ui/layout/AvatarTitle.tsx";
import Datetime from "../../core/datetime.ts";
import Tag from "../../components/ui/layout/Tag.tsx";
import {ActionButton} from "../../components/ui/layout/ActionButton.tsx";
import {setFirstName} from "../../core/utils/utils.ts";

const ExamListPage = () => {

    const {usedAcademicYearId} = useAcademicYear()
    const [filters, setFilters] = useState<AssignmentFilter>()

    const {Link, Text} = Typography

    useDocumentTitle({
        title: text.exam.label,
        description: "Exams description",
    })

    const pageHierarchy = useBreadCrumb([
        {title: text.exam.label},
    ])

    useEffect(() => {
        if (usedAcademicYearId) {
            setFilters({
                academicYearId: usedAcademicYearId
            })
        }
    }, [usedAcademicYearId, setFilters]);

    console.log('filters: ', filters)

    const getItems = (id: string) => {
        return [
            {
                key: `details-${id}`,
                icon: <LuEye size={20}/>,
                label: text.exam.group.view.label,
                onClick: () => redirectTo(text.exam.group.view.href + id)
            }
        ]
    }

    const cardData = (data: Assignment[]) => {
        return data?.map(c => ({
            id: c.id,
            description: <AssignmentDescription a={c} link={text.exam.group.view.href + c.id} show plus />
        })) as DataProps[]
    }

    const tableColumns: TableColumnsType<Assignment> = [
        {
            title: 'Titre de l\'évaluation',
            dataIndex: 'examName',
            key: 'examName',
            align: 'left',
            width: '20%',
            render: (value, record) => <Link
                onClick={() => redirectTo(text.exam.group.view.href + record?.id)} strong
            >
                {value}
            </Link>
        },
        {
            title: 'Matière',
            dataIndex: 'subject',
            key: 'examName',
            align: "center",
            width: '12%',
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
            render: (classe: Classe) => <AntTag.CheckableTag onClick={
                () => redirectTo(text.cc.group.classe.view.href + classe.id)
            } checked>
                <SuperWord input={classe?.name} />
            </AntTag.CheckableTag>
        },
        {
            title: "Préparer par",
            dataIndex: 'preparedBy',
            key: 'preparedBy',
            align: "left",
            responsive: ['md'],
            width: '18%',
            render: (teacher: Individual) => <AvatarTitle
                lastName={teacher?.lastName}
                firstName={teacher?.firstName}
                image={teacher?.image}
                reference={teacher?.emailId}
                size={35}
            />
        },
        {
            title: "Date",
            dataIndex: 'examDate',
            key: 'examDate',
            align: 'center',
            responsive: ['md'],
            width: '10%',
            render: (text: number[]) => <span>
                {setFirstName(Datetime.of(text).fDate("DD MMM YYYY"))}
            </span>
        },
        {
            title: "Heures",
            dataIndex: 'examDate',
            key: 'times',
            align: 'center',
            responsive: ['md'],
            width: '8%',
            render: (_, record: Assignment) => <span>
                {Datetime.timeToCurrentDate(record.startTime as number[]).fDate("HH:mm")} - {Datetime.timeToCurrentDate(record.endTime as number[]).fDate(" HH:mm")}
            </span>
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
            title: "Action",
            dataIndex: 'id',
            key: 'action',
            align: 'right',
            width: '6%',
            render: (id) => (
                <ActionButton
                    icon={<LuEllipsisVertical size={30} style={{borderStyle: 'border'}} />}
                    items={getItems(id)}
                />
            )
        }
    ]

    const filterParams = [filters]

    return(
        <>
            <ListPageHierarchy
                items={pageHierarchy as [Breadcrumb]}
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
            />
        </>
    )
}

export default ExamListPage