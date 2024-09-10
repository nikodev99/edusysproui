import {useParams} from "react-router-dom";
import {fetchStudentById} from "../../data";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../utils/text_display.ts";
import {setBreadcrumb} from "../../core/breadcrumb.tsx";
import {ReactNode, useEffect, useState} from "react";
import {Enrollment} from "../../entity";
import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";
import {Skeleton, Tabs} from "antd";
import StudentInfo from "../../components/view/StudentInfo.tsx";
import StudentExam from "../../components/view/StudentExam.tsx";
import StudentAttendance from "../../components/view/StudentAttendance.tsx";
import StudentClasse from "../../components/view/StudentClasse.tsx";
import StudentHistory from "../../components/view/StudentHistory.tsx";
import LocalStorageManager from "../../core/LocalStorageManager.ts";
import {setFirstName} from "../../utils/utils.ts";
import {useFetch} from "../../hooks/useFetch.ts";
import Sticky from "react-sticky-el";
import StudentEditDrawer from "../../components/view/StudentEditDrawer.tsx";

const StudentView = () => {

    const { id } = useParams()

    const activeTabKey = LocalStorageManager.get("tabKey") as string || "1"
    const [enrolledStudent, setEnrolledStudent] = useState<Enrollment | null>(null);
    const [tabKey, setTabKey] = useState<string>(activeTabKey)
    const [openDrawer, setOpenDrawer] = useState(false)

    const {data, isLoading, isSuccess, error} = useFetch(['student-id', id as string], fetchStudentById, [id])

    const studentName = enrolledStudent ?
        `${setFirstName(enrolledStudent?.student.lastName)} ${setFirstName(enrolledStudent?.student.firstName)}` : 'Étudiant'

    useDocumentTitle({
        title: `EduSysPro - ${studentName}`,
        description: "Student description",
    })

    const pageHierarchy = setBreadcrumb([
        {
            title: text.student.label,
            path: text.student.href
        },
        {
            title: studentName
        }
    ])

    useEffect(() => {
        if (isSuccess && data) {
            setEnrolledStudent(data)
        }
    }, [data, isSuccess]);
    
    const handleTabChange = (activeKey: string) => {
        setTabKey(activeKey)
        LocalStorageManager.update('tabKey', () => activeKey)
    }

    const handleOpenDrawer = (state: boolean) => {
        setOpenDrawer(state)
    }

    const handleCloseDrawer = () => {
        setOpenDrawer(false)
    }

    const skeleton = <Skeleton loading={isLoading} active={isLoading} paragraph={{rows: 5}} />

    return(
        <>
            <PageHierarchy items={pageHierarchy as [{title: string | ReactNode, path?: string}]} mBottom={25} />
            <ViewHeader enrollment={enrolledStudent} isLoading={isLoading} setEdit={handleOpenDrawer} closeState={openDrawer} />
            <section className="sticky-wrapper" style={{ position: 'relative' }}>
                <Tabs rootClassName={`tabs`}
                      items={[
                          {key: '1', label: 'Info', children: (enrolledStudent ? <StudentInfo enrollment={enrolledStudent} seeMore={handleTabChange} /> : skeleton)},
                          {key: '2', label: 'Examens', children: (enrolledStudent ? <StudentExam enrolledStudent={enrolledStudent} />: skeleton)},
                          {key: '3', label: 'Présence', children: (enrolledStudent ? <StudentAttendance  enrolledStudent={enrolledStudent}/>: skeleton)},
                          {key: '4', label: 'Condisciples', children: (enrolledStudent ? <StudentClasse setActiveKey={handleTabChange} enrolledStudent={enrolledStudent} />: skeleton)},
                          {key: '5', label: 'Discipline', children: (enrolledStudent ? <StudentHistory /> : skeleton)},
                      ]}
                      onChange={handleTabChange}
                      defaultActiveKey={tabKey}
                      activeKey={tabKey}
                      centered
                />
            </section>
            <section>
                <StudentEditDrawer
                    open={openDrawer}
                    close={handleCloseDrawer}
                    isLoading={enrolledStudent !== null}
                    data={enrolledStudent ? enrolledStudent.student : []}
                />
            </section>
        </>
    )
}

export default StudentView