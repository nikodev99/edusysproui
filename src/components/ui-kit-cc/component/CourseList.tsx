import {text} from "@/core/utils/text_display.ts";
import {LuEye} from "react-icons/lu";
import {TableColumnsType, Tag} from "antd";
import {Course} from "@/entity";
import ListViewer from "@/components/custom/ListViewer.tsx";
import {AxiosResponse} from "axios";
import {DataProps} from "@/core/utils/interfaces.ts";
import {fDatetime} from "@/core/utils/utils.ts";
import {useCourseRepo} from "@/hooks/actions/useCourseRepo.ts";
import {usePermission} from "@/hooks/usePermission.ts";
import {useMemo} from "react";
import {UserPermission} from "@/core/shared/sharedEnums.ts";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {CourseType, CourseTypeEnum} from "@/entity/domain/course.ts";

export const CourseList = ({condition}: {condition?: boolean}) => {
    const {toViewCourse} = useRedirect()
    const {canViewAll, canViewSome} = usePermission()

    const context = useMemo(() => {
        if (canViewAll) return UserPermission.ALL
        if (canViewSome) return UserPermission.TEACHER
        return UserPermission.NONE
    }, [canViewAll, canViewSome])

    const {useGetPaginated} = useCourseRepo(context)
    const { getPaginatedCourses, getSearchedCourses } = useGetPaginated()

    const throughDetails = (link: string | number) => {
        toViewCourse(link as number)
    }

    const getItems = (url: string) => {
        if (url)
            return [
                {
                    key: `details-${url}`,
                    icon: <LuEye />,
                    label: text.cc.group.course.view.label,
                    onClick: () => throughDetails(url)
                },
            ]
        return []
    }

    const columns: TableColumnsType<Course> = [
        {
            title: "Matière",
            dataIndex: 'course',
            key: 'course',
            align: 'left',
            sorter: true,
            showSorterTooltip: false,
            width: '25%',
            render: (text) => <p>{text?.toUpperCase()}</p>
        },
        {
            title: "Abbréviation",
            dataIndex: 'abbr',
            key: 'abbr',
            align: 'center',
            sorter: true,
            showSorterTooltip: false,
            render: (text) => <Tag>{text?.toUpperCase()}</Tag>
        },
        {
            title: "Département",
            dataIndex: ['department', 'name'],
            key: 'department',
            align: 'center',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: "Type",
            dataIndex: 'courseType',
            key: 'code',
            align: 'center',
            sorter: true,
            showSorterTooltip: false,
            render: (type: CourseType) => <Tag color='cyan'>{CourseTypeEnum[type]}</Tag>
        },
        {
            title: "Date d'ajout",
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'right',
            sorter: true,
            showSorterTooltip: false,
            render: text => fDatetime(text, true)
        }
    ];

    const toCardData = (data: Course[]): DataProps<Course>[] => {
        return data?.map(d=> ({
            id: d.id,
            lastName: d.course,
            reference: d.abbr,
            tag: <Tag style={{marginTop: '5px'}} color='cyan'>{d.department?.code}</Tag>,
            description: d.department?.name
        })) as DataProps<Course>[]
    }

    return(
        <ListViewer
            callback={getPaginatedCourses as () => Promise<AxiosResponse<Course[]>>}
            searchCallback={getSearchedCourses as (input: unknown) => Promise<AxiosResponse<Course[]>>}
            tableColumns={columns}
            cardData={toCardData}
            dropdownItems={(url?: string) =>getItems(url as string)}
            throughDetails={throughDetails}
            countTitle='Cour'
            fetchId='course-list'
            cardNotAvatar={true}
            level={5}
            localStorage={{
                activeIcon: 'courseActiveIcon'
            }}
            onRowRedirect={record => throughDetails(record?.id as number)}
            refetchCondition={condition}
            descMargin={{size: '10px 0'}}
        />
    )
}