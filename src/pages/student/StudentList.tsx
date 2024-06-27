import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import {setBreadcrumb} from "../../core/breadcrumb.tsx";
import {ReactNode, useRef, useState} from "react";
import {
    Avatar,
    Button,
    Card,
    Flex,
    Input,
    InputRef,
    Skeleton,
    Space,
    Table,
    TableColumnsType,
    TableColumnType
} from "antd";
import PageDescription from "../PageDescription.tsx";
import {LuUserPlus2} from "react-icons/lu";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../utils/text_display.ts";
import {useNavigation} from "../../hooks/useNavigation.ts";
import {TfiLayoutGrid2Alt, TfiViewList} from "react-icons/tfi";
import {FilterDropdownProps} from "antd/es/table/interface";
import {AiOutlineEllipsis, AiOutlineSearch} from "react-icons/ai";
import Highlighter from 'react-highlight-words';
import LocalStorageManager from "../../core/LocalStorageManager.ts";
import Meta from "antd/es/card/Meta";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import Grid from "../../components/ui/layout/Grid.tsx";

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
}

type DataIndex = keyof DataType;

const data: DataType[] = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Joe Black',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Jim Green',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
    },
    {
        key: '4',
        name: 'Jim Red',
        age: 32,
        address: 'London No. 2 Lake Park',
    },
    {
        key: '5',
        name: 'Jim Red',
        age: 32,
        address: 'London No. 2 Lake Park',
    }
];

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

    const [studentCount, setStudentCount] = useState<number>(0)
    const [activeIcon, setActiveIcon] = useState<number>(iconActive)
    const [searchText, setSearchText] = useState<string>('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const navigate = useNavigation(text.student.group.enroll.href)

    const throughEnroll = () => {
        navigate()
    }

    const selectedIcon = (index: number) => {
        setActiveIcon(index)
        LocalStorageManager.update<number>('activeIcon', () => index)
    }

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex,
    ) => {
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
                    placeholder={`Search ${dataIndex}`}
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
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
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
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            width: '20%',
            ...getColumnSearchProps('age'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            ...getColumnSearchProps('address'),
            sorter: (a, b) => a.address.length - b.address.length,
            sortDirections: ['descend', 'ascend'],
        },
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

    return(
        <>
            <Flex align="center" justify='space-between'>
                <PageHierarchy items={pageHierarchy as [{title: string | ReactNode, path?: string}]} />
                <div className='add__btn__wrapper'>
                    <Button onClick={throughEnroll} type='primary' icon={<LuUserPlus2 size={20} />} className='add__btn'>Ajouter Étudiant</Button>
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
                    activeIcon === 2
                    ? data.map(d => (
                        <Grid key={d.key} xs={24} md={12} lg={8} xl={6}>
                            <Card actions={[
                                <AiOutlineEllipsis key="ellipsis" />,
                            ]}>
                                <Skeleton loading={false} avatar active>
                                    <Meta
                                        avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
                                        title={d.name}
                                        description={<div>
                                            <p>{d.age}</p>
                                            <p>{d.address}</p>
                                        </div>}
                                    />
                                </Skeleton>
                            </Card>
                        </Grid>
                    ))
                    : <Table style={{width: '100%'}} columns={columns} dataSource={data} />
                }
            </Responsive>
        </>
    )
}

export default StudentList