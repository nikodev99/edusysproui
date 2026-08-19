import {ListViewerProps, StudentListDataType} from "@/core/utils/interfaces.ts";
import {AxiosError} from "axios";
import ListViewer from "@/components/custom/ListViewer.tsx";
import {TableColumnsType} from "antd";
import {Avatar} from "@/components/ui/layout/Avatar.tsx";
import {
    checkAcademicYearEnded,
    enumToObjectArrayForFiltering,
    setFirstName
} from "@/core/utils/utils.ts";
import {Gender, SelectedGenderIcon} from "@/entity/enums/gender.tsx";
import Tagger from "@/components/ui/layout/Tagger.tsx";
import {AiOutlineEllipsis} from "react-icons/ai";
import {ActionButton} from "@/components/ui/layout/ActionButton.tsx";
import {text} from "@/core/utils/text_display.ts";
import {LuEye} from "react-icons/lu";
import {useColumnSearch} from "@/hooks/useColumnSearch.tsx";
import Datetime from "@/core/datetime.ts";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {AcademicYear, Enrollment, Individual} from "@/entity";
import {StudentActionLinks} from "./StudentActionLinks.tsx";
import {useCallback, useState} from "react";
import {ItemType} from "antd/es/menu/interface";
import {fromEnrollment, toEnrollment} from "@/entity/domain/enrollment.ts";
import {formatGrade} from "@/entity/enums/section.ts";
import Tag from "@/components/ui/layout/Tag.tsx";
import {EntityCardProps} from "@/components/custom/EntityCard.tsx";
import {getStudentPalette} from "@/core/helpers/colorPalette.ts";

export const StudentList = <TError extends AxiosError>(listProps: ListViewerProps<StudentListDataType, TError>) => {
    const [selectedStudent, setSelectedStudent] = useState<Enrollment | null | undefined>(undefined)
    const [linkButtons, setLinkButtons] = useState<ItemType[]>([])
    const [refresh, setRefresh] = useState<boolean>(false)
    
    const {callback, searchCallback} = listProps;
    const {toViewStudent} = useRedirect()

    const {getColumnSearchProps} = useColumnSearch<StudentListDataType>()

    const throughDetails = useCallback((_link?: string, record?: StudentListDataType) => {
        toViewStudent(record?.id as string, {lastName: record?.lastName, firstName: record?.firstName} as Individual)
    }, [toViewStudent])

    const getItems = useCallback((_url?: string, record?: StudentListDataType): ItemType[] => {
        return [
            ...(record?.isArchived ? [] : [{
                key: `details-${record?.id}`,
                icon: <LuEye />,
                label: `Voir ${setFirstName(text.student.label)}`,
                onClick: () => throughDetails(record?.id, record)
            }]),
            ...linkButtons
        ]
    }, [linkButtons, throughDetails])

    const handleActionButton = (record?: StudentListDataType) => {
        const hasParam = !!record
        return (
            <ActionButton
                idKey={hasParam ? record?.id: ''}
                onSelect={hasParam ? (key) => setSelectedStudent(record?.id === key ? toEnrollment(record) : undefined): undefined}
                items={selectedStudent && selectedStudent?.student?.id === record?.id ? getItems(record?.id, record) : []}
                dropdownProps={hasParam ? {open: Boolean(selectedStudent?.student?.id as string === record?.id as string)}: undefined}
            />
        )
    }

    console.log('SELECTED STUDENT: ', selectedStudent)

    const handleCardRender = (record: StudentListDataType[]) => {
        return record?.map((r) => {
            const colors = getStudentPalette(r.gender, r.isArchived)
            return {
                id: r.id as string,
                record: r,
                ariaLabel: `Fiche étudiant – ${r.firstName} ${r.lastName}`,
                palette: colors,
                header: {type: "avatar", image: r.image, firstText: r.firstName, lastText: r.lastName},
                pillText: r.reference,
                rightText: r.academicYear?.academicYear,
                titlePrimary :r.firstName.charAt(0) + r.firstName.slice(1).toLowerCase(),
                titleSecondary: r.lastName.charAt(0) + r.lastName.slice(1).toLowerCase(),
                stats: [
                    {label: "Âge", value: r.age},
                    {label: "Classe", value: r.classe, small: true},
                    {label: "Enrol. ID", value: r.enrollmentId, small: true},
                ],
                tags: [
                    <Tag key={'grade'} color={colors?.accentSoft} textColor={colors?.accentColor}>{formatGrade(r.grade)?.toUpperCase()}</Tag>,
                    <Tag key={'gender'} color={colors?.genderTagBg} textColor={colors?.genderTagColor} icon={<SelectedGenderIcon gender={r.gender}/>}>
                        {colors?.genderLabel}
                    </Tag>,
                    <Tagger  key={'status'} status={checkAcademicYearEnded(r.academicYear)} successMessage="inscrit" warnMessage="fin-année-scolaire"/>,
                ],
                footerLabel: "Inscrit le",
                footerValue: Datetime.of(r.lastEnrolledDate).format({format: "DD MMM YYYY"}),
                isDimmed: r.isArchived,
                redirectTo: throughDetails,
                dropdown: handleActionButton?.(r)
            } as EntityCardProps<StudentListDataType>
        })
    }

    console.log('STUDENT ITEMS: ', getItems?.(selectedStudent?.student?.id as string, fromEnrollment(selectedStudent as Enrollment)))

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
                style: {cursor: 'pointer'},
                ...(!record?.isArchived ? {onClick: () => throughDetails(record?.id, record)}: {})
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
            onFilter: (value, record) => record.gender.indexOf(value as string) === 0,
            render: gender => <Tag icon={<SelectedGenderIcon gender={gender} />}>{gender?.toUpperCase()}</Tag>
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
            render: (academicYear: AcademicYear) => (<Tagger
                status={checkAcademicYearEnded(academicYear)}
                successMessage={'inscrit'}
                warnMessage={academicYear?.current ? 'fin-année-scolaire' : 'Archivé'}
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
            render: grade => (<Tag icon={'none'}>{formatGrade(grade)?.toUpperCase()}</Tag>)
            //TODO getting all the grade distinct grade and filter by grade
        },
        {
            title: <AiOutlineEllipsis />,
            dataIndex: 'id',
            key: 'action',
            align: 'right',
            width: '5%',
            render: () => (
                <ActionButton
                    items={getItems?.(selectedStudent?.student?.id,
                        fromEnrollment(selectedStudent as Enrollment))}
                />
            )
        }
    ];

    return(
        <>
            <ListViewer
                {...listProps}
                callback={callback}
                searchCallback={searchCallback}
                tableColumns={columns}
                dropdownItems={(url, record) => getItems(url, record)}
                throughDetails={throughDetails as () => void}
                countTitle={text.student.label}
                cardRender={handleCardRender}
                hasDesc={false}
                level={5}
                displayItem={4}
                itemSize={12}
                onSelectData={(data) => {
                    console.log('selected student data: ', data)
                    setSelectedStudent(toEnrollment(data as StudentListDataType))
                }}
                refetchCondition={refresh}
            />
            {selectedStudent && <StudentActionLinks
                data={selectedStudent}
                getItems={setLinkButtons}
                setRefresh={setRefresh}
           />}
        </>
    )
}