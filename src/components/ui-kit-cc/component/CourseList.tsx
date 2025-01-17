import {redirectTo} from "../../../context/RedirectContext.ts";
import {text} from "../../../utils/text_display.ts";
import {LuEye} from "react-icons/lu";
import {TableColumnsType, Tag} from "antd";
import {Course} from "../../../entity";
import {ActionButton} from "../../ui/layout/ActionButton.tsx";
import ListViewer from "../../custom/ListViewer.tsx";
import {getAllCoursesSearch} from "../../../data/repository/courseRepository.ts";
import {getAllSchoolCourses} from "../../../data/action/courseAction.ts";
import {AxiosResponse} from "axios";
import {DataProps} from "../../../utils/interfaces.ts";
import {AiOutlineEllipsis} from "react-icons/ai";
import {fDatetime} from "../../../utils/utils.ts";

export const CourseList = ({condition}: {condition?: boolean}) => {

    const throughDetails = (link: string) => {
        redirectTo(`${text.cc.group.course.view.href}${link}`)
    }

    const getItems = (url: string) => {
        if (url)
            return [
                {
                    key: `details-${url}`,
                    icon: <LuEye size={20}/>,
                    label: text.cc.group.course.view.label,
                    onClick: () => throughDetails(url)
                },
                {key: `delete-${url}`, label: 'Delete', danger: true}
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
            title: "Discipline",
            dataIndex: ['department', 'code'],
            key: 'code',
            align: 'center',
            sorter: true,
            showSorterTooltip: false,
            render: text => <Tag color='cyan'>{text}</Tag>
        },
        {
            title: "Date d'ajout",
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'right',
            sorter: true,
            showSorterTooltip: false,
            render: text => fDatetime(text, true)
        },
        {
            title: <AiOutlineEllipsis />,
            dataIndex: 'id',
            key: 'action',
            align: 'right',
            width: '10%',
            render: (text) => (<ActionButton items={getItems(text)}/>)
        }
    ];

    const toCardData = (data: Course[]): DataProps[] => {
        return data?.map(d=> ({
            id: d.id,
            lastName: d.course,
            reference: d.abbr,
            tag: <Tag style={{marginTop: '5px'}} color='cyan'>{d.department?.code}</Tag>,
            description: d.department?.name
        }))
    }

    return(
        <ListViewer
            callback={getAllSchoolCourses as () => Promise<AxiosResponse<Course[]>>}
            searchCallback={getAllCoursesSearch as (input: unknown) => Promise<AxiosResponse<Course[]>>}
            tableColumns={columns}
            cardData={toCardData}
            dropdownItems={getItems}
            throughDetails={throughDetails}
            countTitle='Course'
            fetchId='course-list'
            cardNotAvatar={true}
            level={5}
            localStorage={{
                activeIcon: 'courseActiveIcon'
            }}
            refetchCondition={condition}
        />
    )
}