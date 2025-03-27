import {useParams} from "react-router-dom";
import {ReactNode, useEffect, useState} from "react";
import {Course} from "../../entity";
import {useRawFetch} from "../../hooks/useFetch.ts";
import {getCourseById} from "../../data/repository/courseRepository.ts";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {cutStatement} from "../../core/utils/utils.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {SuperWord} from "../../core/utils/tsxUtils.tsx";
import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";
import {Tag} from "antd";
import {ItemType} from "antd/es/menu/interface";
import {LuFileArchive} from "react-icons/lu";
import {ViewRoot} from "../../components/custom/ViewRoot.tsx";
import {CourseExam, CourseInfo, CourseSchedule} from "../../components/ui-kit-cc";
import {Color} from "../../core/utils/interfaces.ts";

const SubjectViewPage = () => {

    const {id} = useParams()

    const [course, setCourse] = useState<Course | null>(null)
    const [color, setColor] = useState<Color>('')
    
    const fetch = useRawFetch<Course>()

    useDocumentTitle({
        title: cutStatement(course?.course as string, 10, course?.abbr) as string,
        description: "Course Description"
    })

    const pageHierarchy = useBreadCrumb([
        { title: text.cc.label, path: text.cc.href },
        { title: <SuperWord input={course?.course as string} /> }
    ])

    useEffect(() => {
        fetch(getCourseById, [id])
            .then(response => {
                if (response.isSuccess) {
                    setCourse(response.data as Course)
                }
            })
    }, [fetch, id])

    const manageItems: ItemType[] = [
        {key: 0, label: 'Archive', icon: <LuFileArchive />, danger: true}
    ]

    return(
        <>
            <PageHierarchy items={pageHierarchy as [{ title: string | ReactNode, path?: string }]} />
            <ViewHeader
                isLoading={course === null}
                setEdit={() => alert('You clicked')}
                closeState={false}
                avatarProps={{
                    firstName: course?.course,
                    reference: course?.abbr
                }}
                blockProps={[
                    {title: 'Département', mention: <em><mark>{course?.department?.name}</mark></em>},
                    {title: 'Code', mention: <Tag>{course?.department?.code}</Tag>},
                ]}
                items={manageItems}
                pColor={setColor}
            />
            <ViewRoot
                items={[
                    {label: 'Info', children: <CourseInfo color={color} infoData={course as Course} dataKey='course-info' />},
                    {label: 'Progarmme', children: <CourseSchedule />},
                    {label: 'Evaluation', children: <CourseExam />}
                ]}
                exists={course !== null}
                memorizedTabKey='courseTabKey'
            />
        </>
    )
}

export default SubjectViewPage;