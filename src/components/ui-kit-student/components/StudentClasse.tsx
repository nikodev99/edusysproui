import PageWrapper from "../../view/PageWrapper.tsx";
import {Button, List, Select, Skeleton} from "antd";
import {useEffect, useMemo, useRef, useState} from "react";
import TabItem from "../../view/TabItem.tsx";
import {Enrollment} from "../../../entity";
import {setFirstName} from "../../../core/utils/utils.ts";
import {useFetch} from "../../../hooks/useFetch.ts";
import {getAllStudentClassmate} from "../../../data/repository/studentRepository.ts";
import {Avatar} from "../../ui/layout/Avatar.tsx";
import {redirectTo} from "../../../context/RedirectContext.ts";
import {text} from "../../../core/utils/text_display.ts";
import {LoadMoreList} from "../../ui/layout/LoadMoreList.tsx";


const count = 3;

export const StudentClasse = ({enrolledStudent, setActiveKey}: {enrolledStudent: Enrollment, setActiveKey?: (key: string) => void }) => {

    const {academicYear, student, student: {personalInfo}, classe} = enrolledStudent

    const [academicYearId, setAcademicYearId] = useState<string>(academicYear.id)
    const [size, setSize] = useState<number>(5)
    const [classeId, setClasseId] = useState<number>(classe.id)
    const [allItems, setAllItems] = useState<number>(0)
    const [classmates, setClassmates] = useState<Enrollment[]>([]);
    const pageCount = useRef<number>(0)
    
    const {data, error, isLoading, isFetching, isSuccess, refetch} = useFetch('student-classmates', getAllStudentClassmate, [
        student.id, classeId, academicYearId, {page: pageCount.current, size: size}
    ])

    const academicYears = useMemo(() => {
        return [
            { value: academicYear.id, label: academicYear.academicYear },
            ...student.enrollments.map(e => ({
                value: e.academicYear.id,
                label: e.academicYear.academicYear
            }))
        ];
    }, [academicYear.id, academicYear.academicYear, student.enrollments]);

    useEffect(() => {
        if (size && classeId || data || student.id) {
            refetch().then(r => r.data)
        }
        if (isSuccess && !isLoading && data && 'content' in data && 'totalElements' in data) {
            setClassmates(data.content)
            setAllItems(data.totalElements)
        }
    }, [classeId, data, isLoading, isSuccess, refetch, size, student.id]);

    if(error) {
        console.error(error)
    }

    const studentName = `${setFirstName(personalInfo?.lastName)} ${setFirstName(personalInfo?.firstName)}`

    const onLoadMore = () => {
        setSize((prevState) => prevState + count)
    }

    const handleWatchClassmate = (id: string) => {
        setActiveKey ? setActiveKey('0') : undefined
        redirectTo(`${text.student.group.view.href}${id}`)
    }

    const handleAcademicYearIdValue = (value: string) => {
        const enrollment = student.enrollments.find(e => e.academicYear.id === value)
        setAcademicYearId(value)
        setClasseId(enrollment ? enrollment.classe.id : classe.id)
    }

    return(
        <PageWrapper>
            <TabItem
                tabClassName='class-tab'
                title={`Les condisciple de ${studentName}`}
                selects={[
                    (
                        <Select
                            className='select-control'
                            defaultValue={academicYear.id}
                            options={academicYears}
                            onChange={handleAcademicYearIdValue}
                            variant='borderless'
                        />
                    )
                ]}
                items={[
                    {key: '1', label: `Classe ${classe.name}`, children: (
                        <LoadMoreList
                            listProps={{
                                dataSource: classmates,
                                renderItem: (item) => (
                                    <List.Item actions={[
                                        <Button
                                            disabled={isFetching}
                                            type='link'
                                            key="list-loadmore-more"
                                            onClick={() => handleWatchClassmate(item.student.id)}
                                        >
                                            Voir plus
                                        </Button>
                                    ]}>
                                        <Skeleton avatar loading={isLoading} active={isLoading}>
                                            <List.Item.Meta
                                                avatar={<Avatar
                                                    image={item?.student?.personalInfo?.image}
                                                    firstText={item?.student?.personalInfo?.firstName}
                                                    lastText={item?.student?.personalInfo?.lastName}
                                                />}
                                                title={
                                                    <span className='name' onClick={() => handleWatchClassmate(item?.student?.id)}>
                                                    {item?.student?.personalInfo?.lastName} {setFirstName(`${item?.student?.personalInfo?.firstName}`)}
                                                </span>
                                                }
                                                description={item.student.reference}
                                            />
                                        </Skeleton>
                                    </List.Item>
                                )
                            }}
                            isLoading={isLoading}
                            size={size}
                            allItems={allItems}
                            onLoadMore={onLoadMore}
                        />
                    )}
                ]}
            />
        </PageWrapper>
    )
}