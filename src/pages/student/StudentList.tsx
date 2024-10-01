import {StudentListDataType as DataType} from "../../utils/interfaces.ts";
import ListViewer from "../../components/list/ListViewer.tsx";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../utils/text_display.ts";
import {setBreadcrumb} from "../../core/breadcrumb.tsx";
import {ListPageHierarchy} from "../../components/list/ListPageHierarchy.tsx";
import {ReactNode, useRef} from "react";
import {redirectTo} from "../../context/RedirectContext.ts";
import {AiOutlineUserAdd} from "react-icons/ai";
import {fetchEnrolledStudents, fetchSearchedEnrolledStudents} from "../../data";
import {AxiosResponse} from "axios";
import {Response} from '../../data/action/response.ts'
import {TableColumnsType} from "antd";
import Avatar from "../../components/ui/layout/Avatar.tsx";
import {dateCompare, enumToObjectArrayForFiltering, fDatetime, setFirstName} from "../../utils/utils.ts";
import {Gender} from "../../entity/enums/gender.ts";
import Tagger from "../../components/ui/layout/Tagger.tsx";
import ActionButton from "../../components/ui/layout/ActionButton.tsx";
import {useColumnSearch} from "../../hooks/useColumnSearch.tsx";
import {LuEye} from "react-icons/lu";

const StudentList = () => {

    useDocumentTitle({
        title: `EduSysPro - ${text.student.label}`,
        description: "Student description",
    })

    const pageHierarchy = setBreadcrumb([
        {
            title: text.student.label
        }
    ])

    const enrollUrl = useRef<string>(text.student.group.add.href);
    const {getColumnSearchProps} = useColumnSearch<DataType>()

    const getItems = (url: string) => {
        return [
            {key: `details-${url}`, icon: <LuEye size={20} />, label: 'Voir l\'étudiant', onClick: () => throughDetails(url)},
            {key: `delete-${url}`, label: 'Delete', danger: true}
        ]
    }

    const throughDetails = (link: string) => {
        redirectTo(`${text.student.group.view.href}${link}`)
    }

    const columns: TableColumnsType<DataType> = [
        {
            title: 'Nom(s) et Prénons',
            dataIndex: 'lastName',
            key: 'lastName',
            width: '20%',
            sorter: true,
            showSorterTooltip: false,
            className: 'col__name',
            onCell: ({id}) => ({
                onClick: () => throughDetails(id)
            }),
            ...getColumnSearchProps('lastName'),
            render: (text, {firstName, image, reference}) => (
                <div className='render__name'>
                    <Avatar image={image} firstText={firstName} lastText={text} />
                    <div>
                        <p>{`${text.toUpperCase()}, ${setFirstName(firstName)}`}</p>
                        <p className='st__ref'>{reference}</p>
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
            onFilter: (value, record) => record.gender.indexOf(value as string) === 0
        },
        {
            title: "Status",
            dataIndex: 'academicYear',
            key: 'status',
            align: 'center',
            render: (text) => (<Tagger status={dateCompare(text.endDate)} successMessage={'inscrit'} warnMessage={'fin-année-scolaire'} />)
        },
        {
            title: "Date d'Inscription",
            dataIndex: 'lastEnrolledDate',
            key: 'lastEnrolledDate',
            align: 'center',
            render: (text) => (<span>{fDatetime(text)}</span>),
            responsive: ['md'],
        },
        {
            title: "Classe",
            dataIndex: 'classe',
            key: 'classe',
            align: 'center'
            //TODO getting all the grade distinct classes and filter by grade
        },
        {
            title: "Section",
            dataIndex: 'grade',
            key: 'grade',
            align: 'center',
            //TODO getting all the grade distinct grade and filter by grade
        },
        {
            title: "Action",
            dataIndex: 'id',
            key: 'action',
            align: 'right',
            render: (text) => (<ActionButton items={getItems(text)} />)
        }
    ];

    return(
        <>
            <ListPageHierarchy
                items={pageHierarchy as [{title: string | ReactNode, path?: string}]}
                hasButton={true}
                onClick={() => redirectTo(enrollUrl.current)}
                type='primary'
                icon={<AiOutlineUserAdd />}
                label={text.student.group.add.label}
            />
            <ListViewer
                callback={fetchEnrolledStudents as () => Promise<AxiosResponse<DataType>>}
                searchCallback={fetchSearchedEnrolledStudents as (input: unknown) => Promise<Response<DataType>>}
                tableColumns={columns}
                dropdownItems={getItems}
                throughDetails={throughDetails}
                cardType='student'
            />
        </>
    )
}

export default StudentList