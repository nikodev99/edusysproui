import {ChangeEvent, Key, ReactNode, useEffect, useLayoutEffect, useState} from "react";
import {Button, Flex, Input, Pagination, Segmented, Space, Table, TablePaginationConfig, Tooltip} from "antd";
import {FilterValue, SorterResult } from "antd/es/table/interface";
import LocalStorageManager from "../../core/LocalStorageManager.ts";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import CardList from "../view/CardList.tsx";
import PageDescription from "./PageDescription.tsx";
import PageError from "../../pages/errors/PageError.tsx";
import {fetchFunc, useFetch} from "../../hooks/useFetch.ts";
import {LuDownload, LuLayoutDashboard, LuListFilter, LuTable} from "react-icons/lu";
import {Enrollment} from "../../entity";
import {ListViewerProps, StudentListDataType} from "../../core/utils/interfaces.ts";
import {getAge} from "../../core/utils/utils.ts";
import {AutoScrollTable} from "../ui/layout/AutoScrollTable.tsx";
import Grid from "../ui/layout/Grid.tsx";
import {useToggle} from "../../hooks/useToggle.ts";

const ListViewer = <TData extends object, TError>(
    {
        callback, searchCallback, tableColumns, dropdownItems, throughDetails, hasCount, countTitle, localStorage,
        fetchId, cardData, cardNotAvatar, level, refetchCondition, callbackParams, searchCallbackParams, infinite,
        uuidKey, tableProps, descMargin, itemSize, displayItem, filters, shareSearchQuery, onSelectData, dataDescription
    }: ListViewerProps<TData, TError>
) => {

    const iconActive = localStorage?.activeIcon ? LocalStorageManager.get<number>(localStorage?.activeIcon) ?? 1 : 1
    const pageSizeCount = !infinite && localStorage?.pageSize ? LocalStorageManager.get<number>(localStorage?.pageSize) ?? itemSize ?? 10 : itemSize ? itemSize : 10
    const paginationPage = !infinite && localStorage?.page ? LocalStorageManager.get<number>(localStorage?.page) ?? 1 : 1
    const count = !infinite && localStorage?.pageCount ? LocalStorageManager.get<number>(localStorage?.pageCount) ?? 0 : 0

    const [content, setContent] = useState<TData[] | undefined>(undefined)
    const [dataCount, setDataCount] = useState<number>(0)
    const [activeIcon, setActiveIcon] = useState<number>(iconActive!)
    const [sortOrder, setSortOrder] = useState<string | undefined>(undefined)
    const [sortField, setSortField] = useState<string | undefined>(undefined)
    const [pageCount, setPageCount] = useState<number>(count!)
    const [currentPage, setCurrentPage] = useState<number>(paginationPage!)
    const [size, setSize] = useState<number>(pageSizeCount!)
    const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)
    const [filterUI, setFilterUI] = useState<ReactNode | undefined>(undefined)
    const [showFilters, setShowFilters] = useToggle(false)

    const { data, error, isLoading, refetch, isFetching, isRefetching } = useFetch(
        fetchId ?? 'students', callback, callbackParams 
            ? [...callbackParams, pageCount, size, sortField, sortOrder] 
            : [pageCount, size, sortField, sortOrder]
    )
    
    useEffect( () => {
        if (searchCallback && searchQuery) {
            fetchFunc(searchCallback, searchCallbackParams ? [...searchCallbackParams, searchQuery] : [searchQuery])
                .then((resp) => {
                    if (resp.isSuccess) {
                        setContent(resp.data as TData[])
                    }
                })
        }else {
            refetch().then(r => r.data)
            if (sortField && sortOrder || size || pageCount) {
                refetch().then(r => r.data)
            }

            if (!isLoading && data) {
                if ('content' in data && 'totalElements' in data) {
                    setContent(data.content as TData[])
                    setDataCount(data.totalElements as number)
                }else {
                    setContent(data as TData[])
                    setDataCount((data as TData[])?.length as number)
                }
            }
        }

    }, [data, isLoading, pageCount, refetch, searchCallback, searchCallbackParams, searchQuery, shareSearchQuery, size, sortField, sortOrder]);

    useEffect(() => {
        if (callbackParams)
            refetch().then(r => r.data)
    }, [callbackParams, refetch]);
    
    useLayoutEffect(() => {
        if(refetchCondition) {
            setPageCount(0)
            setCurrentPage(1)
            refetch().then(r => r.data)
        }
        
        if (filters)
            setFilterUI(filters)
    }, [filters, refetch, refetchCondition]);
    
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

    const handleLoadMoreSize = () => {
        setSize(prevState => prevState + pageSizeCount)
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
        const q = e.target.value
        setSearchQuery(q)
        shareSearchQuery?.(q)
    }

    const handleShowFilters = () => setShowFilters()

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

    const rowKey = (record: TData) => {
        if (Array.isArray(uuidKey)) {
            const [parentKey, childKey] = uuidKey
            return record?.[parentKey as keyof TData]?.[childKey as keyof object]
        }
        return record[uuidKey as keyof TData] || uuidKey
    }

    const dataSource = !fetchId
        ? content?.map(tData => {
            const c = tData as Enrollment
            return {
                id: c.student.id,
                academicYear: c.academicYear,
                reference: c.student?.personalInfo?.reference,
                firstName: c.student?.personalInfo?.firstName,
                lastName: c.student?.personalInfo?.lastName,
                gender: c.student?.personalInfo?.gender,
                lastEnrolledDate: c.enrollmentDate,
                classe: c.classe?.name,
                age: getAge(c.student.personalInfo?.birthDate as number[]),
                grade: c.classe?.grade?.section,
                image: c.student?.personalInfo?.image,
            } as StudentListDataType;
        }).filter((item): item is StudentListDataType => item !== null)
        : content;

    console.log("DATASOURCE: ", dataSource)

    const handleUpdateSearchQuery = () => {
        setSearchQuery(undefined)
        shareSearchQuery?.(undefined)
    }

    return(
        <>
            <div className='header__area'>
                <Flex justify='space-between' align='middle' className='flex__between' wrap='wrap'>
                    <PageDescription
                        count={dataCount}
                        title={
                            countTitle
                                ? (countTitle.endsWith('s')
                                    ? countTitle
                                    : `${countTitle}${dataCount > 1 ? 's' : ''}`)
                                : undefined
                        }
                        isCount={hasCount !== undefined ? hasCount : true}
                        description={dataDescription}
                        addMargin={descMargin}
                    />
                    <div className='flex__end'>
                        <Input
                            allowClear
                            size='middle'
                            placeholder='Recherche...'
                            style={{width: '300px'}}
                            className='search__input'
                            onChange={handleSearchInput}
                            onClear={handleUpdateSearchQuery}
                        />
                        <Segmented
                            options={selectableIcons}
                            onChange={(value) => selectedIcon(Number.parseInt(value))}
                            value={activeIcon.toString()}
                        />
                        <Space.Compact>
                            {filterUI && <Tooltip title='Filtrer'>
                                <Button icon={<LuListFilter />} onClick={handleShowFilters} />
                            </Tooltip>}
                            <Tooltip title='Exporter'>
                                <Button icon={<LuDownload />} onClick={() => alert('You clicked download')} />
                            </Tooltip>
                        </Space.Compact>

                    </div>
                </Flex>
                {showFilters && <div className={`filter__area${showFilters ? ' open' : ''}`}>
                    {filterUI}
                </div>}
            </div>
            <Responsive gutter={[16, 16]} className={`${activeIcon !== 2 ? 'student__list__datatable' : ''}`}>
                {
                    activeIcon === 2 ? <CardList
                        content={cardData ? cardData(dataSource as TData[]) : []}
                        isActive={activeIcon === 2 }
                        isLoading={isLoading || dataSource === undefined}
                        dropdownItems={dropdownItems!}
                        throughDetails={throughDetails!}
                        avatarLess={cardNotAvatar}
                        titleLevel={level as 1}
                        displayItem={displayItem}
                        onSelectData={onSelectData}
                    />
                        : <Grid xs={24} md={24} lg={24}>
                            {infinite ? <AutoScrollTable
                                tableProps={{
                                    ...tableProps,
                                    rowKey: uuidKey ? rowKey as (record: TData) => Key : 'id' as keyof TData,
                                    columns: tableColumns,
                                    dataSource: dataSource as TData[],
                                    loading: isLoading || dataSource === undefined,
                                    pagination: false,
                                    onChange: handleSorterChange,
                                    onRow: (record: TData) => ({
                                        onClick: () => onSelectData ? onSelectData(record) : undefined
                                    })
                                }}
                                isLoading={isLoading || isRefetching}
                                allItems={dataCount}
                                loadMoreSize={handleLoadMoreSize}
                                size={size}
                                height={550}
                            />

                            : <Table
                                {...tableProps}
                                style={{width: '100%'}}
                                rowKey={uuidKey ? rowKey as (record: TData) => Key : 'id' as keyof TData}
                                columns={tableColumns}
                                dataSource={dataSource as TData[]}
                                loading={isLoading || isFetching || isRefetching || dataSource === undefined}
                                onChange={handleSorterChange}
                                pagination={false}
                                scroll={{
                                    y: 550,
                                    x: 'max-content'
                                }}
                                onRow={(record: TData) => ({
                                    onClick: () => onSelectData ? onSelectData(record) : undefined
                                })}
                            />}
                        </Grid>
                }
            </Responsive>
            {(!infinite || activeIcon === 2) && <div style={{textAlign: 'right', marginTop: '15px'}}>
                <Pagination
                    current={currentPage}
                    defaultCurrent={1}
                    total={dataCount}
                    pageSize={size}
                    responsive={true}
                    onShowSizeChange={handleSizeChange}
                    onChange={handleNavChange}
                    disabled={!!(isLoading || (searchQuery && !shareSearchQuery))}
                />
            </div>}
        </>
    )
}

export default ListViewer
