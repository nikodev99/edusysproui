import {useLocation, useParams} from "react-router-dom";
import {useEffect, useLayoutEffect, useState} from "react";
import {Teacher} from "@/entity";
import {chooseColor, MAIN_COLOR, setLastName, setName} from "@/core/utils/utils.ts";
import {count} from "@/data";
import {useDocumentTitle} from "@/hooks/useDocumentTitle.ts";
import {text} from "@/core/utils/text_display.ts";
import {useBreadCrumb} from "@/hooks/useBreadCrumb.tsx";
import {Widgets} from "@/components/ui/layout/Widgets.tsx";
import {WidgetItem} from "@/core/utils/interfaces.ts";
import {Progress, Tag} from "antd";
import ViewHeader from "@/components/ui/layout/ViewHeader.tsx";
import {getStatusKey, Status} from "@/entity/enums/status.ts";
import {Gender} from "@/entity/enums/gender.tsx";
import {
    TeacherActionLinks,
    TeacherAgenda,
    TeacherAssignments,
    TeacherEditDrawer,
    TeacherInfo,
    TeacherProgram, TeacherReprimand
} from "@/components/ui-kit-teacher";
import {useToggle} from "@/hooks/useToggle.ts";
import {ViewRoot} from "@/components/custom/ViewRoot.tsx";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {useStudentRepo} from "@/hooks/actions/useStudentRepo.ts"
import {useAccount} from "@/hooks/useAccount.ts";
import {ItemType} from "antd/es/menu/interface";
import queryString from "query-string";

const TeacherViewPage = () => {

    const { id } = useParams()
    const {search} = useLocation()

    const queryParam = queryString.parse(search);
    const activeTab = String(queryParam.show);
    const [teacher, setTeacher] = useState<Teacher | null>(null)
    const [studentTaughtCount, setStudentTaughtCount] = useState<number>(0)
    const [linkButtons, setLinkButtons] = useState<ItemType[]>([])
    const [shouldRefresh, setShouldRefresh] = useState<boolean>(false)
    const [openDrawer, setOpenDrawer] = useToggle(false)
    const {useCountStudent} = useStudentRepo()
    const {useGetTeacher} = useTeacherRepo()
    const {useAccountExists} = useAccount()

    const {data, isLoading, isSuccess, refetch} = useGetTeacher(id as string)
    const studentCount = useCountStudent()
    const accountExists = useAccountExists(teacher?.personalInfo?.id as number)

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
    }, [isSuccess, data, accountExists])

    useEffect(() => {
        if (shouldRefresh)
            refetch()
                .then()
    }, [refetch, shouldRefresh]);

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
                items={linkButtons}
            />
            <Widgets items={widgetItems}/>
            <ViewRoot
                items={[
                    {label: "Info", children: <TeacherInfo infoData={teacher as Teacher} color={color} dataKey='info' />},
                    {label: "Agenda", children: <TeacherAgenda infoData={teacher as Teacher} dataKey='agenda' />},
                    {label: "Programme", children: <TeacherProgram infoData={teacher as Teacher} color={color} dataKey='program' />},
                    {label: "Devoirs", children: <TeacherAssignments infoData={teacher as Teacher} dataKey='assignment' />},
                    {label: "Réprimande", children: <TeacherReprimand infoData={teacher as Teacher} dataKey='reprimand' />},
                    {label: "Rapport Journalier", children: <h1>Teacher report</h1>},
                ]}
                exists={teacher !== null}
                addMargin={{
                    position: "top",
                    size: 30
                }}
                activeTab={activeTab}
                memorizedTabKey={'teacherTabKey'}
            />
            {teacher && openDrawer && <section>
                <TeacherEditDrawer
                    open={openDrawer}
                    close={handleCloseDrawer}
                    isLoading={isLoading}
                    data={teacher ? teacher : {} as Teacher}
                />
            </section>}
            {teacher && <TeacherActionLinks
                data={teacher as Teacher}
                getItems={setLinkButtons}
                setRefresh={setShouldRefresh}
            />}
        </>
    )
}

export default TeacherViewPage;