import {useParams} from "react-router-dom";
import {useEffect, useLayoutEffect, useState} from "react";
import {Teacher} from "../../entity";
import {chooseColor, MAIN_COLOR, setLastName, setName} from "../../core/utils/utils.ts";
import {count} from "../../data";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../core/utils/text_display.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {Widgets} from "../../components/ui/layout/Widgets.tsx";
import {WidgetItem} from "../../core/utils/interfaces.ts";
import {Progress, Tag} from "antd";
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";
import {getStatusKey, Status} from "../../entity/enums/status.ts";
import {Gender} from "../../entity/enums/gender.tsx";
import {
    LuClipboardPenLine,
    LuListChecks, LuListTodo,
    LuTrash2, LuUserCheck,
    LuUserMinus,
} from "react-icons/lu";
import {
    TeacherActionLinks,
    TeacherAgenda,
    TeacherAssignments,
    TeacherEditDrawer,
    TeacherInfo,
    TeacherProgram, TeacherReprimand
} from "../../components/ui-kit-teacher";
import {useToggle} from "../../hooks/useToggle.ts";
import {ViewRoot} from "../../components/custom/ViewRoot.tsx";
import {useTeacherRepo} from "../../hooks/actions/useTeacherRepo.ts";
import {useStudentRepo} from "../../hooks/actions/useStudentRepo.ts"
import {useAccount} from "../../hooks/useAccount.ts";

type ActionsButtons = {
    createUser?: boolean
}

const TeacherViewPage = () => {

    const { id } = useParams()

    const [teacher, setTeacher] = useState<Teacher | null>(null)
    const [studentTaughtCount, setStudentTaughtCount] = useState<number>(0)
    const [openActions, setOpenActions] = useState<ActionsButtons>({})
    const [showAction, setShowAction] = useState<ActionsButtons>({})
    const [openDrawer, setOpenDrawer] = useToggle(false)
    const {useCountStudent} = useStudentRepo()
    const {useGetTeacher} = useTeacherRepo()
    const {useAccountExists} = useAccount()

    const {data, isLoading, isSuccess, refetch} = useGetTeacher(id as string)
    const studentCount = useCountStudent()
    const accountExists = useAccountExists(teacher?.personalInfo?.id as number)

    console.log("DATA FETCHED: ", data)

    const teacherName = setName(teacher?.personalInfo)
    const color: string = teacher?.personalInfo?.firstName ? chooseColor(teacher.personalInfo?.firstName) as string  : MAIN_COLOR

    useDocumentTitle({
        title: teacherName,
        description: 'Teacher description',
    })

    const {context} = useBreadCrumb({
        bCItems: [
            {title: text.teacher.label + 's', path: text.teacher.href},
            {title: teacherName}
        ]
    })

    useEffect(() => {
        if (isSuccess && data) {
            setTeacher(data as Teacher)
        }
        setShowAction({createUser: accountExists})
    }, [isSuccess, data, accountExists])

    useLayoutEffect(() => {
        if (teacher?.id) {
            count(teacher.id).then((resp) => {
                if (resp.isSuccess && 'data' in resp) {
                    setStudentTaughtCount(resp.data ? resp?.data.count : 0);
                }
            });
        }
    }, [teacher]);

    const widgetItems: WidgetItem[] = [
        {
            title: 'Classes',
            value: teacher?.classes ? teacher?.classes.length : 0,
        },
        {
            title: 'Étudiants enseignés',
            value: studentTaughtCount,
            bottomValue: <Progress
                percent={Math.round((studentTaughtCount * 100) / (studentCount?.total as number))}
                size={{height: 20}}
                percentPosition={{align: 'center', type: 'inner'}}
                strokeColor={color}
            />
        },
        {
            title: 'Commentaires',
            value: '',
        },
        {
            title: 'Étudiants blamés',
            value: '',
        }
    ]

    const handleCloseDrawer = () => {
        setOpenDrawer()
        refetch().then(r => r.data)
    }

    return(
        <>
            {context}
            <ViewHeader
                isLoading={isLoading}
                setEdit={setOpenDrawer}
                closeState={openDrawer}
                avatarProps={{
                    image: teacher?.personalInfo?.image,
                    firstName: teacher?.personalInfo?.firstName,
                    lastName: setLastName(teacher?.personalInfo?.lastName, teacher?.personalInfo?.maidenName),
                    reference: teacher?.personalInfo?.emailId
                }}
                blockProps={[
                    {
                        title: 'Etat Civil',
                        mention: <Tag color={color}>{
                            getStatusKey(
                                teacher?.personalInfo?.status as Status,
                                teacher?.personalInfo?.gender === Gender.FEMME
                            )}</Tag>
                    },
                    {title: 'Télephone', mention: teacher?.personalInfo?.telephone},
                ]}
                items={[
                    {key: 2, label: 'Créer compte Professeur', icon: <LuUserCheck/>, onClick: () => setOpenActions({createUser: true})},
                    {key: 2, label: 'Ajouter programme', icon: <LuListChecks/>},
                    {key: 3, label: 'Créer examen', icon: <LuClipboardPenLine/>},
                    {key: 4, label: 'Réprimander', icon: <LuUserMinus/>},
                    {key: 5, label: 'Compte rendu', icon: <LuListTodo/>},
                    {key: 6, label: 'Retirer l\'enseignant', danger: true, icon: <LuTrash2/>}
                ]}
            />
            <Widgets items={widgetItems}/>
            <ViewRoot
                items={[
                    {label: "Info", children: <TeacherInfo infoData={teacher as Teacher} color={color} dataKey='info' />},
                    {label: "Agenda", children: <TeacherAgenda infoData={teacher as Teacher} dataKey='agenda' />},
                    {label: "Programme", children: <TeacherProgram infoData={teacher as Teacher} color={color} dataKey='program' />},
                    {label: "Devoirs", children: <TeacherAssignments infoData={teacher as Teacher} dataKey='assignment' />},
                    {label: "Réprimande", children: <TeacherReprimand infoData={teacher as Teacher} dataKey='reprimand' />},
                ]}
                exists={teacher !== null}
                addMargin={{
                    position: "top",
                    size: 30
                }}
                memorizedTabKey={'teacherTabKey'}
            />
            <section>
                <TeacherEditDrawer
                    open={openDrawer}
                    close={handleCloseDrawer}
                    isLoading={isLoading}
                    data={teacher ? teacher : {} as Teacher}
                />
            </section>
            <TeacherActionLinks 
                open={openActions} 
                setActions={setOpenActions} 
                show={showAction} 
                personalInfo={teacher?.personalInfo}
            />
        </>
    )
}

export default TeacherViewPage;