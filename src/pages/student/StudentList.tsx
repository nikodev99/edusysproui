import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import {setBreadcrumb} from "../../core/breadcrumb.tsx";
import {ReactNode, useEffect, useMemo, useRef, useState} from "react";
import {
    Avatar,
    Button,
    Card, Dropdown,
    Flex,
    Input,
    InputRef, Pagination,
    Skeleton,
    Space,
    Table,
    TableColumnsType,
    TableColumnType
} from "antd";
import PageDescription from "../PageDescription.tsx";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../utils/text_display.ts";
import {useNavigation} from "../../hooks/useNavigation.ts";
import {TfiLayoutGrid2Alt, TfiViewList} from "react-icons/tfi";
import {FilterDropdownProps} from "antd/es/table/interface";
import {AiOutlineEllipsis, AiOutlineSearch, AiOutlineUserAdd} from "react-icons/ai";
import Highlighter from 'react-highlight-words';
import LocalStorageManager from "../../core/LocalStorageManager.ts";
import Meta from "antd/es/card/Meta";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import Grid from "../../components/ui/layout/Grid.tsx";
import {StudentList as DataType} from "../../utils/interfaces.ts";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchEnrolledStudent, findClassesBasicValue} from "../../data";
import {Gender} from "../../entity/enums/gender.ts";
import {chooseColor, enumToObjectArrayForFiltering, fDatetime, setFirstName} from "../../utils/utils.ts";

type DataIndex = keyof DataType;

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

    const iconActive = LocalStorageManager.get<number>('activeIcon') ?? 1;

    const [content, setContent] = useState<DataType[]>()
    const [studentCount, setStudentCount] = useState<number>(0)
    const [activeIcon, setActiveIcon] = useState<number>(iconActive)
    const [searchText, setSearchText] = useState<string>('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const navigate = useNavigation(text.student.group.enroll.href)
    const nav = useNavigate();

    const throughEnroll = () => {
        navigate()
    }

    const throughDetails = (link: string) => {
        nav(`${text.student.group.view.href}${link}`)
    }

    const { data, error, isLoading } = useQuery({
        queryKey: ['students'],
        queryFn: async () => await fetchEnrolledStudent(0, 50).then(res => res.data)
    })

    useEffect(() => {
        if (!isLoading && data) {
            setContent(data.content)
            setStudentCount(data.totalElements)
        }
    }, [data, isLoading]);

    const selectedIcon = (index: number) => {
        setActiveIcon(index)
        LocalStorageManager.update<number>('activeIcon', () => index)
    }

    const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps['confirm'], dataIndex: DataIndex,) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Recherche ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<AiOutlineSearch />}
                        size="small"
                        style={{ width: 90 }}
                    />
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Réinitialiser
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filtrer
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Fermer
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <AiOutlineSearch style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns: TableColumnsType<DataType> = [
        {
            title: 'Nom(s) et Prénons',
            dataIndex: 'lastName',
            key: 'lastName',
            width: '30%',
            sorter: (a, b) => a.lastName.localeCompare(b.lastName),
            showSorterTooltip: false,
            align: "center",
            className: 'col__name',
            onCell: ({id}) => ({
                onClick: () => throughDetails(id)
            }),
            ...getColumnSearchProps('lastName'),
            render: (text, {firstName, image, reference}) => (
                <div className='render__name'>
                    {
                        image ? <Avatar src={image} />
                        : <Avatar style={{background: chooseColor(text) as string}}>
                            {`${text.charAt(0)}${firstName.charAt(0)}`}
                        </Avatar>
                    }
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
            filters: enumToObjectArrayForFiltering(Gender),
            onFilter: (value, record) => record.gender.indexOf(value as string) === 0,
        },
        {
            title: "Date d'Inscription",
            dataIndex: 'lastEnrolledDate',
            key: 'lastEnrolledDate',
            render: (text) => (<span>{fDatetime(text)}</span>),
            responsive: ['md'],
        },
        {
            title: "Classe",
            dataIndex: 'classe',
            key: 'classe',
            ...getColumnSearchProps('classe')
        },
        {
            title: "Section",
            dataIndex: 'grade',
            key: 'grade',
            ...getColumnSearchProps('grade')
        },
        {
            title: "Action",
            dataIndex: 'id',
            key: 'action',
            render: (text) => (
                <Dropdown trigger={['click']} menu={{
                    items: [
                        {key: `details-${text}`, label: 'Details', onClick: () => throughDetails(text)},
                        {key: `delete-${text}`, label: 'Delete', danger: true}
                    ]
                }}>
                    <div style={{cursor: 'pointer'}}>
                        <AiOutlineEllipsis style={{fontWeight: 'bolder'}} size={30} />
                    </div>
                </Dropdown>
            )
        }
    ];

    const selectableIcons = [
        {
            key: 1,
            element: <TfiViewList size={25} />
        },
        {
            key: 2,
            element: <TfiLayoutGrid2Alt size={25} />
        }
    ]

    console.log('CONTENT: ', content)

    return(
        <>
            <Flex align="center" justify='space-between'>
                <PageHierarchy items={pageHierarchy as [{title: string | ReactNode, path?: string}]} />
                <div className='add__btn__wrapper'>
                    <Button onClick={throughEnroll} type='primary' icon={<AiOutlineUserAdd size={20} />} className='add__btn'>Ajouter Étudiant</Button>
                </div>
            </Flex>
            <div className='header__area'>
                <PageDescription count={studentCount} title={`Étudiant${studentCount > 1 ? 's' : ''}`} isCount={true}/>
                <div className='flex__end'>
                    <Input />
                    {selectableIcons.map(icon => (
                        <span key={icon.key} className={`list__icon ${activeIcon === icon.key ? 'active' : ''}`} onClick={() => selectedIcon(icon.key)}>
                            {icon.element}
                        </span>
                    ))}
                </div>
            </div>
            <Responsive gutter={[16, 16]} className={`${activeIcon !== 2 ? 'student__list__datatable' : ''}`}>
                {
                    activeIcon === 2 ? (<Skeleton loading={isLoading} active={isLoading} avatar>
                            { content?.map(d => (
                                <Grid key={d.id} xs={24} md={12} lg={8} xl={6}>
                                    <Card actions={[
                                        <AiOutlineEllipsis key="ellipsis" />,
                                    ]}>
                                        <Skeleton loading={isLoading} avatar active={isLoading}>
                                            <Meta
                                                avatar={<Avatar src={`${d.image ? d.image : "https://api.dicebear.com/7.x/miniavs/svg?seed=1"}`} />}
                                                title={`${d.lastName} ${d.firstName}`}
                                                description={<div>
                                                    <p>{d.gender.toString()}</p>
                                                    <p>{fDatetime(d.lastEnrolledDate)}</p>
                                                </div>}
                                            />
                                        </Skeleton>
                                    </Card>
                                </Grid>
                                ))
                            }
                    </Skeleton>)
                    : <Table
                        style={{width: '100%'}}
                        rowKey="id"
                        columns={columns}
                        dataSource={content}
                        loading={isLoading}
                        pagination={false}
                    />
                }
            </Responsive>
            <div style={{textAlign: 'right', marginTop: '30px'}}>
                <Pagination defaultCurrent={1} total={studentCount} pageSize={content?.length} />
            </div>
        </>
    )
}

export default StudentList