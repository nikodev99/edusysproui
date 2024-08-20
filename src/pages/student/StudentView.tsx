import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
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
import Sticky from "react-sticky-el";

const StudentView = () => {

    const { id } = useParams()

    const [enrolledStudent, setEnrolledStudent] = useState<Enrollment | null>(null);

    const {data, isLoading, isSuccess, error, isError} = useQuery({
        queryKey: ['student-id', id],
        queryFn: async () => await fetchStudentById(id as string).then(async (res) => res.data)
    })

    useDocumentTitle({
        title: `EduSysPro - étudiant`,
        description: "Student description",
    })

    const pageHierarchy = setBreadcrumb([
        {
            title: text.student.label,
            path: text.student.href
        },
        {
            title: 'Un titre'//`${setFirstName(student.lastName)} ${setFirstName(student.firstName)}`
        }
    ])

    const activeTabKey = LocalStorageManager.get("tabKey") as string|| "1"
    const [tabKey, setTabKey] = useState<string>(activeTabKey)

    useEffect(() => {
        if (isSuccess && data) {
            setEnrolledStudent(data)
        }
    }, [data, isSuccess]);
    
    const handleTabChange = (activeKey: string) => {
        setTabKey(activeKey)
        LocalStorageManager.update('tabKey', () => activeKey)
    }

    return(
        <>
            <PageHierarchy items={pageHierarchy as [{title: string | ReactNode, path?: string}]} mBottom={25} />
            <ViewHeader enrollment={enrolledStudent} isLoading={isLoading} />
            {/*<Sticky>*/}
                <Tabs rootClassName={`tabs`}
                      items={[
                          ...(enrolledStudent ?
                              [{key: '1', label: 'Info', children: <StudentInfo enrollment={enrolledStudent} />}] :
                              [{key: '1', label: 'Info', children: <Skeleton loading={isLoading} active={isLoading} paragraph={{rows: 5}} />}]),
                          {key: '2', label: 'Examens', children: <StudentExam />},
                          {key: '3', label: 'Presence', children: <StudentAttendance />},
                          {key: '4', label: 'Classe', children: <StudentClasse />},
                          {key: '5', label: 'Historique', children: <StudentHistory />},
                      ]}
                      onChange={handleTabChange}
                      defaultActiveKey={tabKey}
                      centered
                />
            {/*</Sticky>*/}
        </>
    )
}

export default StudentView