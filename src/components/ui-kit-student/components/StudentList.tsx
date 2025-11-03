import {DataProps, ListViewerProps, StudentListDataType} from "../../../core/utils/interfaces.ts";
import {AxiosError} from "axios";
import ListViewer from "../../custom/ListViewer.tsx";
import {TableColumnsType, Tag} from "antd";
import {Avatar} from "../../ui/layout/Avatar.tsx";
import {dateCompare, enumToObjectArrayForFiltering, setFirstName} from "../../../core/utils/utils.ts";
import {Gender} from "../../../entity/enums/gender.tsx";
import Tagger from "../../ui/layout/Tagger.tsx";
import {AiOutlineEllipsis} from "react-icons/ai";
import {ActionButton} from "../../ui/layout/ActionButton.tsx";
import {text} from "../../../core/utils/text_display.ts";
import {LuEye} from "react-icons/lu";
import {useColumnSearch} from "../../../hooks/useColumnSearch.tsx";
import Datetime from "../../../core/datetime.ts";
import {useRedirect} from "../../../hooks/useRedirect.ts";
import {Individual} from "../../../entity";
import {StudentActionLinks} from "./StudentActionLinks.tsx";
import {useCallback, useState} from "react";
import {ItemType} from "antd/es/menu/interface";

export const StudentList = <TError extends AxiosError>(listProps: ListViewerProps<StudentListDataType, TError>) => {
    const [selectedStudent, setSelectedStudent] = useState<StudentListDataType | undefined>(undefined)
    const [linkButtons, setLinkButtons] = useState<ItemType[]>([])
    const [refresh, setRefresh] = useState<boolean>(false)
    
    const {callback, searchCallback} = listProps;
    const {toViewStudent} = useRedirect()

    const {getColumnSearchProps} = useColumnSearch<StudentListDataType>()

    const throughDetails = useCallback((_link?: string, record?: StudentListDataType) => {
        toViewStudent(record?.id as string, {lastName: record?.lastName, firstName: record?.firstName} as Individual)
    }, [toViewStudent])

    const getItems = useCallback((_url?: string, student?: StudentListDataType): ItemType[] => {
        return [
            {
                key: `details-${student?.id}`,
                icon: <LuEye />,
                label: `Voir ${setFirstName(text.student.label)}`,
                onClick: () => throughDetails(student?.id, student),
            },
            ...linkButtons
        ]
    }, [linkButtons, throughDetails])

    const columns: TableColumnsType<StudentListDataType> = [
        {
            title: 'Nom(s) et Prénons',
            dataIndex: 'lastName',
            key: 'lastName',
            width: '25%',
            sorter: true,
            showSorterTooltip: false,
            className: 'col__name',
            align: 'start',
            onCell: (record) => ({
                onClick: () => throughDetails(record?.id, record)
            }),
            ...getColumnSearchProps('lastName'),
            render: (text, {firstName, image, reference}) => (
                <div className='render__name'>
                    <Avatar image={image} firstText={firstName} lastText={text} />
                    <div>
                        <p>{`${text?.toUpperCase()}, ${setFirstName(firstName)}`}</p>
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
            width: '12%',
            //TODO the filter directly to the database
            filters: enumToObjectArrayForFiltering(Gender),
            onFilter: (value, record) => record.gender.indexOf(value as string) === 0
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            align: 'center',
            width: '10%',
            showSorterTooltip: false,
            sorter: true,
            render: text => `${text} ans`
        },
        {
            title: "Status",
            dataIndex: 'academicYear',
            key: 'status',
            align: 'center',
            width: '12%',
            render: (text) => (<Tagger
                status={dateCompare(text?.endDate)}
                successMessage={'inscrit'}
                warnMessage={'fin-année-scolaire'}
            />)
        },
        {
            title: "Date d'Inscription",
            dataIndex: 'lastEnrolledDate',
            key: 'lastEnrolledDate',
            align: 'center',
            width: '15%',
            sorter: true,
            showSorterTooltip: false,
            render: (value: number) => (<span>{
                Datetime.of(value).fDatetime()
            }</span>),
            responsive: ['md'],
        },
        {
            title: "Classe",
            dataIndex: 'classe',
            key: 'classe',
            align: 'center',
            width: '10%',
            //TODO getting all the grade distinct classes and filter by grade
        },
        {
            title: "Section",
            dataIndex: 'grade',
            key: 'grade',
            align: 'center',
            width: '11%',
            render: (text) => (<Tag>{text}</Tag>)
            //TODO getting all the grade distinct grade and filter by grade
        },
        {
            title: <AiOutlineEllipsis />,
            dataIndex: 'id',
            key: 'action',
            align: 'right',
            width: '5%',
            render: (text) => (<ActionButton items={getItems(text)} />)
        }
    ];

    const cardData = (data: StudentListDataType[]) => {
        return data?.map(c => ({
            id: c?.id,
            lastName: c?.lastName,
            firstName: c?.firstName,
            gender: c?.gender,
            image: c?.image,
            reference: c?.reference,
            tag: <Tagger status={dateCompare(c?.academicYear?.endDate as Date)} successMessage='inscrit'
                         warnMessage='fin_annee_scolaire'/>,
            description: [
                `${c.grade} - ${c.classe}`,
                `Inscrit le, ${Datetime.of(c.lastEnrolledDate).fDatetime({to: true})}`
            ]
        })) as DataProps<StudentListDataType>[]
    }

    return(
        <>
            <ListViewer
                {...listProps}
                callback={callback}
                searchCallback={searchCallback}
                tableColumns={columns}
                dropdownItems={getItems}
                throughDetails={throughDetails as () => void}
                countTitle={text.student.label}
                cardData={cardData}
                hasDesc={false}
                level={5}
                onSelectData={setSelectedStudent}
                refetchCondition={refresh}
            />
           <StudentActionLinks
               data={selectedStudent}
               getItems={setLinkButtons}
               setRefresh={setRefresh}
           />
        </>
    )
}