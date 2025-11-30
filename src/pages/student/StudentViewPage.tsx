import {useParams} from "react-router-dom";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../core/utils/text_display.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {useMemo, useState} from "react";
import {Student} from "../../entity";
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";
import {setName} from "../../core/utils/utils.ts";
import {
    StudentActionLinks,
    StudentAttendance,
    StudentClasse, StudentEditDrawer,
    StudentExam,
    StudentDiscipline,
    StudentInfo
} from "../../components/ui-kit-student";
import {LuCircleUser} from "react-icons/lu";
import {ViewRoot} from "../../components/custom/ViewRoot.tsx";
import {useStudentRepo} from "../../hooks/actions/useStudentRepo.ts";
import {ItemType} from "antd/es/menu/interface";
import {catchError} from "../../data/action/error_catch.ts";
import {useRedirect} from "../../hooks/useRedirect.ts";

const StudentViewPage = () => {
    const {toViewGuardian} = useRedirect()
    const { id } = useParams()

    const [openDrawer, setOpenDrawer] = useState(false)
    const [color, setColor] = useState('')
    const [linkButtons, setLinkButtons] = useState<ItemType[]>([])
    const {useGetStudent} = useStudentRepo()

    const {data, isLoading, error, refetch} = useGetStudent(id as string)

    const enrolledStudent = useMemo(() => data, [data])
    const errors = useMemo(() => catchError(error), [error])
    const studentName = enrolledStudent ? setName(enrolledStudent?.student.personalInfo) : 'Étudiant'

    useDocumentTitle({
        title: `EduSysPro - ${studentName}`,
        description: "Student description",
        hasEdu: false
    })

    const {context} = useBreadCrumb({
        bCItems: [
            {
                title: text.student.label,
                path: text.student.href
            },
            {
                title: studentName
            }
        ]
    })
    
    const setItems: ItemType[] = useMemo(() => {
        return [
            {
                key: '2',
                label: 'Tuteur légal',
                icon: <LuCircleUser/>,
                onClick: () => toViewGuardian(enrolledStudent?.student?.guardian?.id as string)
            },
            ...linkButtons
        ]
    }, [enrolledStudent?.student?.guardian?.id, linkButtons, toViewGuardian])

    const handleOpenDrawer = (state: boolean) => {
        setOpenDrawer(state)
    }

    const handleCloseDrawer = () => {
        setOpenDrawer(false)
        refetch().then(r => r.data)
    }

    return(
        <>
            {context}
            <ViewHeader
                pColor={setColor}
                isLoading={isLoading}
                setEdit={handleOpenDrawer}
                closeState={openDrawer}
                avatarProps={{
                    image: enrolledStudent?.student.personalInfo?.image,
                    firstName: enrolledStudent?.student.personalInfo?.firstName,
                    lastName: enrolledStudent?.student.personalInfo?.lastName,
                    reference: enrolledStudent?.student?.personalInfo?.reference
                }}
                blockProps={[
                    {
                        title: 'Tuteur Légal',
                        mention: setName(enrolledStudent?.student?.guardian?.personalInfo),
                    },
                    {title: enrolledStudent?.classe?.name, mention: enrolledStudent?.classe?.grade?.section}
                ]}
                items={setItems}
                errors={errors}
            />

            <ViewRoot
                exists={enrolledStudent !== null}
                items={[
                    {label: 'Info', children: <StudentInfo enrollment={enrolledStudent!} color={color}/>},
                    {label: 'Examens', children: <StudentExam enrolledStudent={enrolledStudent!}/>},
                    {label: 'Présence', children: <StudentAttendance enrolledStudent={enrolledStudent!}/>},
                    {label: 'Condisciples', children: <StudentClasse enrolledStudent={enrolledStudent!}/>},
                    {label: 'Discipline', children: <StudentDiscipline/>},
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
            <StudentActionLinks
                data={enrolledStudent}
                getItems={setLinkButtons}
            />
        </>
    )
}

export default StudentViewPage