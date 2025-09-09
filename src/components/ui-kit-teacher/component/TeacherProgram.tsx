import {InfoPageProps} from "../../../core/utils/interfaces.ts";
import {Teacher, CourseProgram} from "../../../entity";
import {useEffect, useMemo, useState} from "react";
import {useFetch} from "../../../hooks/useFetch.ts";
import TabItem from "../../view/TabItem.tsx";
import {Button, Card, Descriptions, DescriptionsProps, Flex, Select, TimelineItemProps} from "antd";
import Grid from "../../ui/layout/Grid.tsx";
import Responsive from "../../ui/layout/Responsive.tsx";
import {AiFillClockCircle} from "react-icons/ai";
import {DraggedTimeline} from "../../graph/DraggedTimeline.tsx";
import {LuChevronsRight} from "react-icons/lu";
import Tag from "../../ui/layout/Tag.tsx";
import {ISOToday} from "../../../core/utils/utils.ts";
import {getAllTeacherCourseProgram, getAllTeacherProgram} from "../../../data/request";
import {BarChart} from "../../graph/BarChart.tsx";
import VoidData from "../../view/VoidData.tsx";

export const TeacherProgram = ({infoData, color}: InfoPageProps<Teacher>) => {
    const {id, courses, classes} = infoData

    const [programs, setPrograms] = useState<CourseProgram[]>([])
    const [subjectValue, setSubjectValue] = useState<number | null>(courses && courses?.length > 0 ? courses[0].id as number : null)
    const [classeValue, setClasseValue] = useState<number>(classes && classes?.length > 0 ? classes[0].id as number : 0)
    const courseExists: boolean = courses && courses?.length > 0 || false

    const dataFetchFnc = courseExists ? getAllTeacherCourseProgram : getAllTeacherProgram

    const {data, isSuccess, refetch, isLoading, isRefetching, isLoadingError} = useFetch('program-id', dataFetchFnc, [infoData?.id, infoData?.schools?.id, {
        classId: classeValue,
        courseId: subjectValue
    }])

    const pending: boolean = isLoading || isRefetching || isLoadingError

    const subjects = useMemo(() => {
        return courses?.map(c => ({
            value: c.id, label: c.course
        }))
    }, [courses])

    const classrooms = useMemo(() => {
        return classes?.map(c => ({
            value: c.id, label: c.name
        }))
    }, [classes])

    useEffect(() => {
        if(isSuccess) {
            setPrograms(data)
        }
        if (classeValue || subjectValue) {
            refetch()
        }
    }, [classeValue, data, isSuccess, refetch, subjectValue]);

    const handleClasseValue = (value: number) => {
        setClasseValue(value)
    }

    const handleSubjectValue = (value: number) => {
        setSubjectValue(value)
    }

    const items: TimelineItemProps[] = programs
        ? [...programs].reverse().map((t, index, arr) => {

            const isFirstOfSemester = index === arr.length - 1 || t.semester?.template?.semesterName !== arr[index + 1].semester?.template?.semesterName

            return {
                color: t.active ? 'green' : t.passed ? color : undefined,
                dot: t.active ? <AiFillClockCircle/> : undefined,
                label: isFirstOfSemester ?
                    t.semester?.template?.semesterName :
                    t.active ?
                        <span style={{color: 'green'}}>{ISOToday()}</span> :
                        undefined,
                children: <span style={{color: t.active ? 'green' : t.passed ? color : 'inherit'}}>
                    {`${t.classe.name} - ${t.topic}`}
                </span>
            }
        })
        : [];

    const activeItem = programs?.filter(item => item.active)
    const activeDesc = (item: CourseProgram): DescriptionsProps['items'] => {
        return [
            {key: 2, label: 'Description', children: item?.description, span: 3},
            {key: 1, label: 'Objective', children: item?.purpose, span: 3},
            {key: 3, label: 'Semestre' , children: item?.semester?.template?.semesterName, span: 2},
            {key: 4, label: 'Status', children: <Tag color='success'>En cours</Tag>},
            //TODO Only the user with teacher role could view the below button
            {key: 5, children: <Button>Cliquer pour passer</Button>, span: 3},
        ]
    }

    const passeItems = programs?.filter(item => item.passed)
    const chartData = [
        {
            name: 'Programme',
            terminer: items && items.length > 0 ? Math.round((passeItems?.length / items?.length) * 100): 0,
            incomplet: items && items.length > 0 ? Math.round(((items?.length - passeItems?.length) / items?.length) * 100): 0,
        }
    ]

    return(
        <TabItem
            title={`Programme de ${infoData.personalInfo?.lastName}`}
            selects={[
                courses && courses.length > 0 && (<Select
                    className='select-control'
                    defaultValue={subjectValue}
                    options={subjects}
                    onChange={handleSubjectValue}
                    variant='borderless'
                />),
                <Select
                    className='select-control'
                    defaultValue={classeValue}
                    options={classrooms}
                    onChange={handleClasseValue}
                    variant='borderless'
                />
            ]}
            items={[
                {
                    key: 'program-list',
                    label: 'Liste Programme',
                    children: <Responsive gutter={[16, 16]} style={{margin: '20px'}}>
                        <Grid xs={24} md={12} lg={12}>
                            <Card loading={pending}>
                                {items && items.length > 0 ? <DraggedTimeline
                                    timelineProps={{
                                        mode:'left',
                                        items:items,
                                        rootClassName:'timeline'
                                    }}
                                    localStorage={id as string}
                                /> : <VoidData />}
                            </Card>
                        </Grid>
                        <Grid xs={24} md={12} lg={12}>
                            <Flex vertical gap={15}>
                                {activeItem && activeItem?.map(item => (<Card loading={pending} key={item?.id}>
                                    <Descriptions title={<div style={{display: 'flex', alignItems: 'center', justifyItems: 'center'}}>
                                        <LuChevronsRight style={{color: 'green'}} size={25}/> {item.topic}
                                    </div>} items={activeDesc(item)}  />
                                </Card>))}
                                <Card loading={pending}>
                                    <BarChart
                                        data={chartData || []}
                                        barSize={200}
                                        legend='name'
                                        color={color}
                                        minHeight={350}
                                        isPercent={true}
                                        stackId='a'
                                        stackBars={2}
                                        stackKeys={['terminer', 'incomplet']}
                                        showLegend
                                    />
                                </Card>
                            </Flex>
                        </Grid>
                    </Responsive>
                }
            ]}
        />
    )
}