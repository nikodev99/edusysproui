import {useParams} from "react-router-dom";
import {fetchStudentById} from "../../data";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../utils/text_display.ts";
import {setBreadcrumb} from "../../core/breadcrumb.tsx";
import {ReactNode, useEffect, useState} from "react";
import {Enrollment, Student} from "../../entity";
import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";
import {Skeleton, Tabs} from "antd";
import LocalStorageManager from "../../core/LocalStorageManager.ts";
import {setFirstName} from "../../utils/utils.ts";
import {useFetch} from "../../hooks/useFetch.ts";
import {
    StudentAttendance,
    StudentClasse, StudentEditDrawer,
    StudentExam,
    StudentHistory,
    StudentInfo
} from "../../components/ui-kit-student";
import {LuTrash, LuUserCircle, LuUserPlus} from "react-icons/lu";
import {redirectTo} from "../../context/RedirectContext.ts";
import {ViewRoot} from "../../components/custom/ViewRoot.tsx";

const StudentView = () => {

    const { id } = useParams()

    const activeTabKey = LocalStorageManager.get("tabKey") as string || "1"
    const [enrolledStudent, setEnrolledStudent] = useState<Enrollment | null>(null);
    const [tabKey, setTabKey] = useState<string>(activeTabKey)
    const [openDrawer, setOpenDrawer] = useState(false)

    const {data, isLoading, isSuccess, error, refetch} = useFetch(['student-id', id as string], fetchStudentById, [id])

    const studentName = enrolledStudent ?
        `${setFirstName(enrolledStudent?.student.lastName)} ${setFirstName(enrolledStudent?.student.firstName)}` : 'Étudiant'

    useDocumentTitle({
        title: `EduSysPro - ${studentName}`,
        description: "Student description",
        hasEdu: false
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
        refetch().then(r => r.data)
    }

    error ? console.log('error occured: ', error) : ''

    return(
        <>
            <PageHierarchy items={pageHierarchy as [{ title: string | ReactNode, path?: string }]} mBottom={25}/>
            <ViewHeader
                isLoading={isLoading}
                setEdit={handleOpenDrawer}
                closeState={openDrawer}
                avatarProps={{
                    image: enrolledStudent?.student.image,
                    firstName: enrolledStudent?.student.firstName,
                    lastName: enrolledStudent?.student.lastName,
                    reference: enrolledStudent?.student.reference
                }}
                blockProps={[
                    {
                        title: 'Tuteur Légal',
                        mention: setFirstName(`${enrolledStudent?.student.guardian?.lastName} ${enrolledStudent?.student.guardian?.firstName}`)
                    },
                    {title: enrolledStudent?.classe.name, mention: enrolledStudent?.classe.grade.section}
                ]}
                items={[
                    {
                        key: 2,
                        label: 'Tuteur légal',
                        icon: <LuUserCircle/>,
                        onClick: () => redirectTo(text.guardian.group.view.href + enrolledStudent?.student.guardian.id)
                    },
                    {key: 3, label: 'Réinscrire', icon: <LuUserPlus/>},
                    {key: 4, label: 'Retirer l\'étudiant', danger: true, icon: <LuTrash/>}
                ]}
            />
            <ViewRoot
                exists={enrolledStudent != null}
                items={[
                    {label: 'Info', children: <StudentInfo enrollment={enrolledStudent!} seeMore={handleTabChange}/>},
                    {label: 'Examens', children: <StudentExam enrolledStudent={enrolledStudent!}/>},
                    {label: 'Présence', children: <StudentAttendance enrolledStudent={enrolledStudent!}/>},
                    {label: 'Condisciples', children: <StudentClasse setActiveKey={handleTabChange} enrolledStudent={enrolledStudent!}/>},
                    {label: 'Discipline', children: <StudentHistory/>},
                ]}
                tab={{
                    onChange: handleTabChange,
                    defaultActiveKey: tabKey,
                    activeKey: tabKey,
                    centered: true,
                }}
            />
            <section>
                <StudentEditDrawer
                    open={openDrawer}
                    close={handleCloseDrawer}
                    isLoading={isLoading}
                    data={enrolledStudent ? enrolledStudent.student : {} as Student}
                />
            </section>
        </>
    )
}

export default StudentView