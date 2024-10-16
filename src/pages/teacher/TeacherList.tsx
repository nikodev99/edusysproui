import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../utils/text_display.ts";
import {Breadcrumb, setBreadcrumb} from "../../core/breadcrumb.tsx";
import {redirectTo} from "../../context/RedirectContext.ts";
import {LuEye} from "react-icons/lu";
import {BiSolidUserAccount} from "react-icons/bi";
import {AiOutlineUserDelete, AiOutlineUsergroupAdd} from "react-icons/ai";
import {TableColumnsType} from "antd";
import {Teacher} from "../../entity";
import Avatar from "../../components/ui/layout/Avatar.tsx";
import {enumToObjectArrayForFiltering, getAge, setFirstName} from "../../utils/utils.ts";
import {Gender} from "../../entity/enums/gender.ts";
import {statusTags} from "../../utils/tsxUtils.tsx";
import ActionButton from "../../components/ui/layout/ActionButton.tsx";
import {ListPageHierarchy} from "../../components/custom/ListPageHierarchy.tsx";
import ListViewer from "../../components/custom/ListViewer.tsx";
import {fetchSearchedTeachers, fetchTeachers} from "../../data";
import {AxiosResponse} from "axios";
import {Response} from "../../data/action/response.ts";
import {useRef} from "react";
import {TeacherClassCourse} from "../../entity/domain/TeacherClassCourse.ts";

const TeacherList = () => {

    useDocumentTitle({
        title: text.teacher.label,
        description: 'Teacher list',
    })

    const pageHierarchy = setBreadcrumb([
        {
            title: text.teacher.label
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

    const columns: TableColumnsType<Teacher> = [
        {
            title: 'Nom(s) et Prénons',
            dataIndex: 'lastName',
            key: 'lastName',
            width: '20%',
            sorter: true,
            showSorterTooltip: false,
            className: 'col__name',
            onCell: (data) => ({
                onClick: (): void => throughDetails(data?.id ? data.id : '')
            }),
            render: (text, {firstName, emailId}) => (
                <div className='render__name'>
                    <Avatar firstText={firstName} lastText={text}/>
                    <div>
                        <p>{`${text.toUpperCase()}, ${setFirstName(firstName)}`}</p>
                        <p className='st__ref'>{emailId}</p>
                    </div>
                </div>
            )
        },
        {
            title: 'Genre',
            dataIndex: 'gender',
            key: 'gender',
            align: 'center',
            //TODO the filter directly to the database
            filters: enumToObjectArrayForFiltering(Gender),
            onFilter: (value, record) => record?.gender ? record.gender.indexOf(value as string) === 0 : false
        },
        {
            title: "Age",
            dataIndex: 'birthDate',
            key: 'birthDate',
            align: 'center',
            responsive: ['md'],
            render: (text) => getAge(text) + 'ans'
        },
        {
            title: "Status",
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            responsive: ['md'],
            render: (text, {gender}) => statusTags(text, gender === Gender.FEMME)
        },
        {
            title: "Matières",
            dataIndex: 'teacherClassCourses',
            key: 'emailId',
            align: 'center',
            width: "15%",
            render: (text: TeacherClassCourse[]) => {
                if (text && text?.length > 0) {
                    return text?.map((t: TeacherClassCourse, index: number) => (
                        <>
                            <span className='matter' key={index}>{t.course?.course as string}</span>
                            {index !== text.length - 1 && <>,&nbsp;</>}
                        </>
                    ))
                }else {
                    return text?.map((t: TeacherClassCourse, index: number) => (
                        <>
                            <span className='matter' key={index}>{t.classe?.name as string}</span>
                            {index !== text.length - 1 && <>,&nbsp;</>}
                        </>
                    ))
                }
            }
            //TODO getting all the grade distinct classes and filter by grade
        },
        {
            title: "Téléphone",
            dataIndex: 'telephone',
            key: 'telephone',
            align: 'center',
            responsive: ['md'],
        },
        {
            title: "Action",
            dataIndex: 'id',
            key: 'action',
            align: 'right',
            render: (text) => (<ActionButton items={getItems(text)} />)
        }
    ]

    return (
        <>
            <ListPageHierarchy
                items={pageHierarchy as [Breadcrumb]}
                onClick={() => redirectTo(addUrl.current)}
                hasButton
                type='primary'
                icon={<AiOutlineUsergroupAdd />}
                label='Ajouter enseignant'
            />
            <ListViewer
                callback={fetchTeachers as () => Promise<AxiosResponse<Teacher[]>>}
                searchCallback={fetchSearchedTeachers as (input: unknown) => Promise<Response<Teacher[]>>}
                tableColumns={columns as TableColumnsType<Teacher[]>}
                dropdownItems={getItems}
                throughDetails={throughDetails}
                countTitle={text.teacher.label}
                cardType='teacher'
                localStorage={{
                    activeIcon: 'teacherActiveIcon',
                    pageSize: 'teacherPageSize',
                    page: 'teacherPage',
                    pageCount: 'teacherPageCount'
                }}
            />
        </>
    )
}

export default TeacherList