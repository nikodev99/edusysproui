import PageWrapper from "../../ui/layout/PageWrapper.tsx";
import {Button, List, Select, Skeleton} from "antd";
import {useEffect, useMemo, useRef, useState} from "react";
import TabItem from "../../view/TabItem.tsx";
import {Enrollment} from "../../../entity";
import {setFirstName} from "../../../utils/utils.ts";
import {useFetch} from "../../../hooks/useFetch.ts";
import {getAllStudentClassmate} from "../../../data/repository/studentRepository.ts";
import Avatar from "../../ui/layout/Avatar.tsx";
import {redirectTo} from "../../../context/RedirectContext.ts";
import {text} from "../../../utils/text_display.ts";


const count = 3;

export const StudentClasse = ({enrolledStudent, setActiveKey}: {enrolledStudent: Enrollment, setActiveKey: (key: string) => void }) => {

    const {academicYear, student, classe} = enrolledStudent

    const [academicYearId, setAcademicYearId] = useState<string>(academicYear.id)
    const [size, setSize] = useState<number>(5)
    const [classeId, setClasseId] = useState<number>(classe.id)
    const [allItems, setAllItems] = useState<number>(0)
    const [classmates, setClassmates] = useState<Enrollment[]>([]);
    const pageCount = useRef<number>(0)
    
    const {data, error, isLoading, isSuccess, refetch} = useFetch('student-classmates', getAllStudentClassmate, [
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

    const classes = useMemo(() => {
        return [
            { value: classe.id, label: classe.name },
            ...student.enrollments.map(e => ({
                value: e.classe.id,
                label: e.classe.name
            }))
        ];
    }, [classe.id, classe.name, student.enrollments]);

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

    const studentName = `${setFirstName(student.lastName)} ${setFirstName(student.firstName)}`

    const onLoadMore = () => {
        setSize((prevState) => prevState + count)
    }

    const handleWatchClassmate = (id: string) => {
        setActiveKey('1')
        redirectTo(`${text.student.group.view.href}${id}`)
    }

    const loadMore =
        !isLoading ? (
            <div style={{
                textAlign: 'center',
                marginTop: 12,
                height: 32,
                lineHeight: '32px',
            }}>
                <Button type='dashed' disabled={size >= allItems} onClick={onLoadMore} loading={isLoading}>Charger plus</Button>
            </div>
        ) : null;

    const handleAcademicYearIdValue = (value: string) => {
        const enrollment = student.enrollments.find(e => e.academicYear.id === value)
        setAcademicYearId(value)
        setClasseId(enrollment ? enrollment.classe.id : classe.id)
    }

    const handleClasseValue = (value: number) => {
        const enrollment = student.enrollments.find(e => e.classe.id === value)
        setClasseId(value)
        setAcademicYearId(enrollment ? enrollment.academicYear.id : academicYear.id)
    }

    console.log("classmates: ", classmates)

    return(
        <PageWrapper>
            <TabItem
                tabClassName='class-tab'
                title={`Les condisciple de ${studentName}`}
                selects={[
                    (
                        <Select
                            className='select-control'
                            defaultValue={classe.id}
                            options={classes}
                            onChange={handleClasseValue}
                            variant='borderless'
                        />
                    ),
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
                        <List
                            className="loadmore-list"
                            loading={isLoading}
                            loadMore={loadMore}
                            dataSource={classmates}
                            renderItem={(item) => (
                                <List.Item actions={[<Button type='link' key="list-loadmore-more" onClick={() => handleWatchClassmate(item.student.id)}>Voir</Button>]}>
                                    <Skeleton avatar loading={isLoading} active={isLoading}>
                                        <List.Item.Meta
                                            avatar={<Avatar
                                                image={item.student.image}
                                                firstText={item.student.firstName}
                                                lastText={item.student.lastName}
                                            />}
                                            title={
                                                <span className='name' onClick={() => handleWatchClassmate(item.student.id)}>
                                                    {item.student.lastName} {setFirstName(`${item.student.firstName}`)}
                                                </span>
                                            }
                                            description={item.student.reference}
                                        />
                                    </Skeleton>
                                </List.Item>
                            )}
                        />
                    )}
                ]}
            />
        </PageWrapper>
    )
}