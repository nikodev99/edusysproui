import {ChangeEvent, useEffect, useLayoutEffect, useState} from "react";
import {
    Input,
    Pagination, Segmented,
    Table,
    TableColumnsType,
    TablePaginationConfig,
} from "antd";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import LocalStorageManager from "../../core/LocalStorageManager.ts";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import CardList from "../view/CardList.tsx";
import PageDescription from "./PageDescription.tsx";
import PageError from "../../pages/PageError.tsx";
import {useFetch} from "../../hooks/useFetch.ts";
import {AxiosResponse} from "axios";
import {Response} from '../../data/action/response.ts'
import {ItemType} from "antd/es/menu/interface";
import {LuLayoutDashboard, LuTable} from "react-icons/lu";
import {Enrollment} from "../../entity";
import {DataProps, StudentListDataType} from "../../utils/interfaces.ts";

interface ListViewerProps<TData extends object, TError> {
    callback: () => Promise<AxiosResponse<TData | TData[], TError>>
    searchCallback: ((...args: unknown[]) => Promise<Response<TData>>) | ((...args: unknown[]) => Promise<AxiosResponse<TData[]>>)
    tableColumns: TableColumnsType<TData>
    dropdownItems?: (url: string) => ItemType[]
    throughDetails?: (id: string) => void
    hasCount?: boolean,
    countTitle?: string,
    fetchId?: string
    localStorage?: {activeIcon?: string, pageSize?: string, page?: string, pageCount?: string}
    cardNotAvatar?: boolean
    cardData: (data: TData[]) => DataProps[]
    level?: number
    refetchCondition?: boolean
}

const ListViewer = <TData extends object, TError>(
    {
        callback,
        searchCallback,
        tableColumns,
        dropdownItems,
        throughDetails,
        hasCount,
        countTitle,
        localStorage,
        fetchId,
        cardData,
        cardNotAvatar,
        level,
        refetchCondition
    }: ListViewerProps<TData, TError>
) => {

    const iconActive = localStorage?.activeIcon ? LocalStorageManager.get<number>(localStorage?.activeIcon) ?? 1 : 1
    const pageSizeCount = localStorage?.pageSize ? LocalStorageManager.get<number>(localStorage?.pageSize) ?? 10 : 10
    const paginationPage = localStorage?.page ? LocalStorageManager.get<number>(localStorage?.page) ?? 1 : 1
    const count = localStorage?.pageCount ? LocalStorageManager.get<number>(localStorage?.pageCount) ?? 0 : 0

    const [content, setContent] = useState<TData[] | undefined>(undefined)
    const [dataCount, setDataCount] = useState<number>(0)
    const [activeIcon, setActiveIcon] = useState<number>(iconActive!)
    const [sortOrder, setSortOrder] = useState<string | undefined>(undefined)
    const [sortField, setSortField] = useState<string | undefined>(undefined)
    const [pageCount, setPageCount] = useState<number>(count!)
    const [currentPage, setCurrentPage] = useState<number>(paginationPage!)
    const [size, setSize] = useState<number>(pageSizeCount!)
    const [searchQuery, setSearchQuery] = useState<string>('')

    const { data, error, isLoading, refetch } = useFetch(fetchId ?? 'students', callback, [pageCount, size, sortField, sortOrder])
    
    useEffect( () => {
        if (searchQuery) {
            searchCallback(searchQuery)
                .then((resp) => {
                    if (resp) {
                        console.log('Response: ', resp)
                        setContent(resp.data as TData[])
                    }
                })
        }else {
            refetch().then(r => r.data)
            if (sortField && sortOrder || size || pageCount) {
                refetch().then(r => r.data)
            }

            if (!isLoading && data && 'content' in data && 'totalElements' in data) {
                setContent(data.content as TData[])
                setDataCount(data.totalElements as number)
            }
        }

    }, [data, isLoading, pageCount, refetch, searchCallback, searchQuery, size, sortField, sortOrder]);

    useLayoutEffect(() => {
        if(refetchCondition) refetch()
    }, [refetch, refetchCondition]);
    
    if (error) {
        return <PageError />
    }

    const selectedIcon = (index: number) => {
        setActiveIcon(index)
        localStorage?.activeIcon ? LocalStorageManager.update<number>(localStorage?.activeIcon, () => index) : null
    }

    const handleSorterChange = (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter:  SorterResult<TData> | SorterResult<TData>[]) => {
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
        localStorage?.pageSize ? LocalStorageManager.update(localStorage?.pageSize, () => pageSize) : null
        localStorage?.page ? LocalStorageManager.update(localStorage?.page, () => current): null
    }

    const handleNavChange = (page: number, pageSize: number) => {
        setPageCount(page - 1)
        setCurrentPage(page)
        setSize(pageSize)
        localStorage?.pageSize ? LocalStorageManager.update(localStorage?.pageSize, () => pageSize) : null
        localStorage?.page ? LocalStorageManager.update(localStorage?.page, () => page) : null
        localStorage?.pageCount ? LocalStorageManager.update(localStorage?.pageCount, () => page - 1) : null
    }

    const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    const selectableIcons = [
        {
            label: '',
            value: '1',
            icon: <LuTable />
        },
        {
            label: '',
            value: '2',
            icon: <LuLayoutDashboard />
        }
    ]

    const dataSource = !fetchId
        ? content?.map(tData => {
            const c = tData as Enrollment
            return {
                id: c.student.id,
                academicYear: c.academicYear,
                reference: c.student.reference,
                firstName: c.student.personalInfo?.firstName,
                lastName: c.student.personalInfo?.lastName,
                gender: c.student.personalInfo?.gender,
                lastEnrolledDate: c.enrollmentDate,
                classe: c.classe?.name,
                grade: c.classe?.grade?.section,
                image: c.student?.personalInfo?.image,
            } as StudentListDataType;
        }).filter((item): item is StudentListDataType => item !== null)
        : content;

    return(
        <>
            <div className='header__area'>
                <PageDescription count={dataCount} title={`${countTitle}${dataCount > 1 ? 's' : ''}`} isCount={hasCount !== undefined ? hasCount : true}/>
                <div className='flex__end'>
                    <Input
                        allowClear
                        size='middle'
                        placeholder='Recherche...'
                        style={{width: '300px'}}
                        className='search__input'
                        onChange={handleSearchInput}
                    />
                    <Segmented
                        options={selectableIcons}
                        onChange={(value) => selectedIcon(Number.parseInt(value))}
                        value={activeIcon.toString()}
                    />
                </div>
            </div>
            <Responsive gutter={[16, 16]} className={`${activeIcon !== 2 ? 'student__list__datatable' : ''}`}>
                {
                    activeIcon === 2 ? <CardList
                            content={cardData(dataSource as TData[])}
                            isActive={activeIcon === 2 }
                            isLoading={isLoading || dataSource === undefined}
                            dropdownItems={dropdownItems!}
                            throughDetails={throughDetails!}
                            avatarLess={cardNotAvatar}
                            titleLevel={level as 1}
                        />
                        : <Table
                            style={{width: '100%'}}
                            rowKey={'id' as keyof TData}
                            columns={tableColumns}
                            dataSource={dataSource as TData[]}
                            loading={isLoading || dataSource === undefined}
                            onChange={handleSorterChange}
                            pagination={false}
                            scroll={{y: 550}}
                        />
                }
            </Responsive>
            <div style={{textAlign: 'right', marginTop: '15px'}}>
                <Pagination
                    current={currentPage}
                    defaultCurrent={1}
                    total={dataCount}
                    pageSize={size}
                    responsive={true}
                    onShowSizeChange={handleSizeChange}
                    onChange={handleNavChange}
                    disabled={!!(isLoading || searchQuery)}
                />
            </div>
        </>
    )
}

export default ListViewer