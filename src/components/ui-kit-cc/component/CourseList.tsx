import {text} from "@/core/utils/text_display.ts";
import {LuBookOpen, LuEye} from "react-icons/lu";
import {TableColumnsType} from "antd";
import Tag from "@/components/ui/layout/Tag.tsx";
import {Course} from "@/entity";
import ListViewer from "@/components/custom/ListViewer.tsx";
import {AxiosResponse} from "axios";
import {ID} from "@/core/utils/interfaces.ts";
import {fDatetime} from "@/core/utils/utils.ts";
import {useCourseRepo} from "@/hooks/actions/useCourseRepo.ts";
import {usePermission} from "@/hooks/usePermission.ts";
import {useMemo} from "react";
import {UserPermission} from "@/core/shared/sharedEnums.ts";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {CourseType, CourseTypeEnum} from "@/entity/domain/course.ts";
import {ActionButton} from "@/components/ui/layout/ActionButton.tsx";
import {getCoursePalette} from "@/core/helpers/colorPalette.ts";
import Datetime from "@/core/datetime.ts";
import {EntityCardProps} from "@/components/custom/EntityCard.tsx";

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

    const getItems = (url: ID) => {
        if (url)
            return [
                {
                    key: `details-${url}`,
                    icon: <LuEye />,
                    label: text.cc.group.course.view.label,
                    onClick: () => throughDetails(url as number)
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

    const handleCardRender = (record: Course[]) => {
        return record?.map(r => {
            const colors = getCoursePalette()
            return {
                id: r.id as number,
                record: r,
                ariaLabel: `Fiche étudiant – ${r.course}`,
                palette: colors,
                header: {type: 'icon', icon: <LuBookOpen size={36} color={colors.accentColor}/>},
                pillText: r?.abbr,
                rightText: r?.department?.name,
                titlePrimary :r.course,
                tags: [
                    <Tag color={colors.accentSoft} textColor={colors.accentColor}>
                        <span>{CourseTypeEnum[r?.courseType] as string}</span>
                    </Tag>
                ],
                footerLabel: "Mis à jour le",
                footerValue: Datetime.of(r?.modifyAt as Date).format({format: "DD MMM YYYY"}),
                redirectTo: throughDetails,
                dropdown: <ActionButton items={getItems(r?.id as number)} />,
            } as EntityCardProps<Course>
        })
    }

    return(
        <ListViewer
            callback={getPaginatedCourses as () => Promise<AxiosResponse<Course[]>>}
            searchCallback={getSearchedCourses as (input: unknown) => Promise<AxiosResponse<Course[]>>}
            tableColumns={columns}
            cardRender={handleCardRender}
            dropdownItems={(url?: string) =>getItems(url as string)}
            throughDetails={throughDetails}
            countTitle='Cour'
            fetchId='course-list'
            localStorage={{
                activeIcon: 'courseActiveIcon'
            }}
            onRowRedirect={record => throughDetails(record?.id as number)}
            refetchCondition={condition}
            descMargin={{size: '10px 0'}}
        />
    )
}