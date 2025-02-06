import {useParams} from "react-router-dom";
import {fetchStudentById} from "../../data";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../utils/text_display.ts";
import {setBreadcrumb} from "../../core/breadcrumb.tsx";
import {ReactNode, useEffect, useState} from "react";
import {Enrollment, Student} from "../../entity";
import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";
import {setName} from "../../utils/utils.ts";
import {useFetch} from "../../hooks/useFetch.ts";
import {
    StudentAttendance,
    StudentClasse, StudentEditDrawer,
    StudentExam,
    StudentHistory,
    StudentInfo
} from "../../components/ui-kit-student";
import {LuCircleUser, LuTrash, LuUserPlus} from "react-icons/lu";
import {redirectTo} from "../../context/RedirectContext.ts";
import {ViewRoot} from "../../components/custom/ViewRoot.tsx";

const StudentView = () => {

    const { id } = useParams()

    const [enrolledStudent, setEnrolledStudent] = useState<Enrollment | null>(null);
    const [openDrawer, setOpenDrawer] = useState(false)
    const [color, setColor] = useState('')

    const {data, isLoading, isSuccess, error, refetch} = useFetch<Enrollment, unknown>(['student-id', id as string], fetchStudentById, [id])

    const studentName = enrolledStudent ? setName(
        enrolledStudent?.student.personalInfo?.lastName,
        enrolledStudent?.student.personalInfo?.firstName
    ) : 'Étudiant'

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
            setEnrolledStudent(data as Enrollment)
        }
    }, [data, isSuccess]);

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
                pColor={setColor}
                isLoading={isLoading}
                setEdit={handleOpenDrawer}
                closeState={openDrawer}
                avatarProps={{
                    image: enrolledStudent?.student.personalInfo?.image,
                    firstName: enrolledStudent?.student.personalInfo?.firstName,
                    lastName: enrolledStudent?.student.personalInfo?.lastName,
                    reference: enrolledStudent?.student?.reference
                }}
                blockProps={[
                    {
                        title: 'Tuteur Légal',
                        mention: setName(
                            enrolledStudent?.student?.guardian?.personalInfo?.lastName,
                            enrolledStudent?.student?.guardian?.personalInfo?.firstName,
                            enrolledStudent?.student?.guardian?.personalInfo?.maidenName
                        ),
                    },
                    {title: enrolledStudent?.classe?.name, mention: enrolledStudent?.classe?.grade?.section}
                ]}
                items={[
                    {
                        key: 2,
                        label: 'Tuteur légal',
                        icon: <LuCircleUser/>,
                        onClick: () => redirectTo(text.guardian.group.view.href + enrolledStudent?.student.guardian.id)
                    },
                    {key: 3, label: 'Réinscrire', icon: <LuUserPlus/>},
                    {key: 4, label: 'Retirer l\'étudiant', danger: true, icon: <LuTrash/>}
                ]}
            />

            <ViewRoot
                exists={enrolledStudent !== null}
                items={[
                    {label: 'Info', children: <StudentInfo enrollment={enrolledStudent!} color={color}/>},
                    {label: 'Examens', children: <StudentExam enrolledStudent={enrolledStudent!}/>},
                    {label: 'Présence', children: <StudentAttendance enrolledStudent={enrolledStudent!}/>},
                    {label: 'Condisciples', children: <StudentClasse enrolledStudent={enrolledStudent!}/>},
                    {label: 'Discipline', children: <StudentHistory/>},
                ]}
                tab={{centered: true}}
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