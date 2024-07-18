import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import {setBreadcrumb} from "../../core/breadcrumb.tsx";
import {ChangeEvent, ReactNode, useEffect, useRef, useState} from "react";
import {Avatar, Button, Flex, Input, InputRef, Pagination, Space, Table, TableColumnsType, TableColumnType, TablePaginationConfig} from "antd";
import PageDescription from "../PageDescription.tsx";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../utils/text_display.ts";
import {useNavigation} from "../../hooks/useNavigation.ts";
import {TfiLayoutGrid2Alt, TfiViewList} from "react-icons/tfi";
import {FilterDropdownProps, FilterValue, SorterResult} from "antd/es/table/interface";
import {AiOutlineSearch, AiOutlineUserAdd} from "react-icons/ai";
import LocalStorageManager from "../../core/LocalStorageManager.ts";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import {StudentList as DataType} from "../../utils/interfaces.ts";
import {useNavigate} from "react-router-dom";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {fetchEnrolledStudents, fetchSearchedEnrolledStudents} from "../../data";
import {Gender} from "../../entity/enums/gender.ts";
import {chooseColor, enumToObjectArrayForFiltering, fDatetime, setFirstName} from "../../utils/utils.ts";
import PageError from "../PageError.tsx";
import Highlighter from "react-highlight-words";
import ActionButton from "../../components/list/ActionButton.tsx";
import EmptyPage from "../EmptyPage.tsx";
import CardList from "../../components/list/CardList.tsx";
import {LuEye} from "react-icons/lu";

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
    const pageSizeCount = LocalStorageManager.get<number>('pageSize') ?? 10;

    const [content, setContent] = useState<DataType[] | null>(null)
    const [studentCount, setStudentCount] = useState<number>(0)
    const [activeIcon, setActiveIcon] = useState<number>(iconActive)
    const [searchText, setSearchText] = useState<string>('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [sortOrder, setSortOrder] = useState<string | undefined>(undefined)
    const [sortField, setSortField] = useState<string | undefined>(undefined)
    const [pageCount, setPageCount] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [size, setSize] = useState<number>(pageSizeCount)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const searchInput = useRef<InputRef>(null);
    const enrollUrl = useRef<string>(text.student.group.enroll.href);
    const navigate = useNavigation(enrollUrl.current)
    const nav = useNavigate();

    const throughEnroll = () => {
        navigate()
    }

    const throughDetails = (link: string) => {
        nav(`${text.student.group.view.href}${link}`)
    }

    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ['students'],
        queryFn: async () => await fetchEnrolledStudents(pageCount, size, sortField, sortOrder).then(res => res.data),
        placeholderData: keepPreviousData
    })

    useEffect( () => {
        console.log('field: ', sortField, 'Order: ', sortOrder)
        if (searchQuery) {
            fetchSearchedEnrolledStudents(searchQuery)
                .then((resp) => {
                    if (resp && resp.isSuccess) {
                        setContent(resp.data as DataType[])
                    }
                })

        }else {
            refetch().then(r => r.data)
            if (sortField && sortOrder || size || pageCount) {
                refetch().then(r => r.data)
            }

            if (!isLoading && data) {
                setContent(data.content)
                setStudentCount(data.totalElements)
            }
        }
        
    }, [data, isLoading, pageCount, refetch, searchQuery, size, sortField, sortOrder]);

    if (error) {
        return <PageError />
    }

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
                    <Button type="link" size="small" onClick={() => { close() }}>Fermer</Button>
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

    const handleSorterChange = (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter:  SorterResult<DataType> | SorterResult<DataType>[]) => {
        pagination.disabled
        if (!Array.isArray(filters))
            if (!Array.isArray(sorter)) {
                setSortField(sorter.field as string)
                setSortOrder(sorter.order as string)
            }
    }

    const handleSizeChange = (current: number, pageSize: number) => {
        setCurrentPage(current)
        setSize(pageSize)
        LocalStorageManager.update('pageSize', () => pageSize)
    }

    const handleNavChange = (page: number, pageSize: number) => {
        setPageCount(page - 1)
        setCurrentPage(page)
        setSize(pageSize)
        LocalStorageManager.update('pageSize', () => pageSize)
    }

    const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    const columns: TableColumnsType<DataType> = [
        {
            title: 'Nom(s) et Prénons',
            dataIndex: 'lastName',
            key: 'lastName',
            width: '30%',
            sorter: true,
            showSorterTooltip: false,
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
            align: 'center',
            filters: enumToObjectArrayForFiltering(Gender),
            onFilter: (value, record) => record.gender.indexOf(value as string) === 0,
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
        },
        {
            title: "Section",
            dataIndex: 'grade',
            key: 'grade',
            align: 'center'
        },
        {
            title: "Action",
            dataIndex: 'id',
            key: 'action',
            align: 'right',
            render: (text) => (<ActionButton items={getItems(text)} />)
        }
    ];

    const getItems = (url: string) => {
        return [
            {key: `details-${url}`, icon: <LuEye size={20} />, label: 'Voir l\'étudiant', onClick: () => throughDetails(url)},
            {key: `delete-${url}`, label: 'Delete', danger: true}
        ]
    }

    const selectableIcons = [
        {
            key: 1,
            element: <TfiViewList size={19} />
        },
        {
            key: 2,
            element: <TfiLayoutGrid2Alt size={19} />
        }
    ]

    return(
        <>
            <Flex align="center" justify='space-between'>
                <PageHierarchy items={pageHierarchy as [{title: string | ReactNode, path?: string}]} />
                <div className='add__btn__wrapper'>
                    <Button onClick={throughEnroll} type='primary' icon={<AiOutlineUserAdd size={20} />} className='add__btn'>Ajouter Étudiant</Button>
                </div>
            </Flex>
            {content !== null ? (
                <>
                    <div className='header__area'>
                        <PageDescription count={studentCount} title={`Étudiant${studentCount > 1 ? 's' : ''}`} isCount={true}/>
                        <div className='flex__end'>
                            <Input size='middle' placeholder='Recherche...' style={{width: '300px'}} className='search__input' onChange={handleSearchInput} />
                            {selectableIcons.map(icon => (
                                <span key={icon.key} className={`list__icon ${activeIcon === icon.key ? 'active' : ''}`} onClick={() => selectedIcon(icon.key)}>
                                    {icon.element}
                                </span>
                            ))}
                        </div>
                    </div>
                    <Responsive gutter={[16, 16]} className={`${activeIcon !== 2 ? 'student__list__datatable' : ''}`}>
                        {
                            activeIcon === 2 ? <CardList content={content} isActive={activeIcon === 2 } isLoading={isLoading} dropdownItems={getItems} />
                            : <Table
                                style={{width: '100%'}}
                                rowKey="id"
                                columns={columns}
                                dataSource={content}
                                loading={isLoading}
                                onChange={handleSorterChange}
                                pagination={false}
                            />
                        }
                    </Responsive>
                    <div style={{textAlign: 'right', marginTop: '30px'}}>
                        <Pagination
                            current={currentPage}
                            defaultCurrent={1}
                            total={studentCount}
                            pageSize={size}
                            responsive={true}
                            onShowSizeChange={handleSizeChange}
                            onChange={handleNavChange}
                            disabled={!!(isLoading || searchQuery)}
                        />
                    </div>
                </>): <EmptyPage
                        title="Organiser les étudiant de l'école x dans le tableau"
                        subTitle='Work teams enable simpler and faster management of your users’ access rights. Simply add users to a team and they will inherit the access rights of that work team.'
                        btnLabel='Créer un nouveau étudiant'
                        btnUrl={enrollUrl.current}
                />}
        </>
    )
}

export default StudentList