import {useLocation, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {AffiliationStatus, Teacher} from "@/entity";
import {chooseColor, MAIN_COLOR, setLastName, setName} from "@/core/utils/utils.ts";
import {useDocumentTitle} from "@/hooks/useDocumentTitle.ts";
import {text} from "@/core/utils/text_display.ts";
import {useBreadCrumb} from "@/hooks/useBreadCrumb.tsx";
import {Widgets} from "@/components/ui/layout/Widgets.tsx";
import {WidgetItem} from "@/core/utils/interfaces.ts";
import ViewHeader from "@/components/ui/layout/ViewHeader.tsx";
import {
    TeacherActionLinks,
    TeacherAgenda,
    TeacherAssignments,
    TeacherEditDrawer,
    TeacherInfo, TeacherReports,
    TeacherProgram, TeacherReprimand
} from "@/components/ui-kit-teacher";
import {useToggle} from "@/hooks/useToggle.ts";
import {ViewRoot} from "@/components/custom/ViewRoot.tsx";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {useAccount} from "@/hooks/useAccount.ts";
import {ItemType} from "antd/es/menu/interface";
import queryString from "query-string";
import {usePermission} from "@/hooks/usePermission.ts";
import {useAcademicYearRepo} from "@/hooks/actions/useAcademicYearRepo.ts";
import {useUserRepo} from "@/hooks/actions/useUserRepo.ts";
import {AffiliateStatusTag} from "@/core/utils/tsxUtils.tsx";
import {Skeleton} from "antd";

const TeacherViewPage = () => {

    const { id } = useParams()
    const {search} = useLocation()

    const queryParam = queryString.parse(search);
    const activeTab = queryParam.show ? String(queryParam.show) : undefined;
    const [teacher, setTeacher] = useState<Teacher | null>(null)
    const [linkButtons, setLinkButtons] = useState<ItemType[]>([])
    const [shouldRefresh, setShouldRefresh] = useState<boolean>(false)
    const [openDrawer, setOpenDrawer] = useToggle(false)
    const {isSelfInd} = useUserRepo()
    const {can, canEdit} = usePermission()
    const {useGetTeacher, useGetWidgets} = useTeacherRepo()
    const {useAccountExists} = useAccount()
    const {currentAcademicYear} = useAcademicYearRepo()

    const isTeacherAuthorized = can('teacherAction', true)
    const isSelfAuthorized = isSelfInd(teacher?.personalInfo?.id as number)
    const {data, isLoading, isSuccess, refetch} = useGetTeacher(id as string)
    const {data: widgets} = useGetWidgets(id as string, currentAcademicYear?.id as string)
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

    const widgetItems: WidgetItem[] = [
        {
            title: 'Classes',
            value: teacher?.classes ? teacher?.classes.length : 0,
        },
        {
            title: 'Étudiants enseignés',
            value: widgets?.students ?? 0
        },
        {
            title: 'Rapport',
            value: widgets?.reports ?? 0
        },
        {
            title: 'Étudiants blamés',
            value: widgets?.reprimands ?? 0,
        }
    ]

    const handleCloseDrawer = () => {
        setOpenDrawer()
        refetch().then(r => r.data)
    }

    console.log("TEACHER: ", teacher)

    if (!teacher) return <Skeleton active paragraph={{rows: 10}} />

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
                        title: "Status d'affiliation",
                        mention: <AffiliateStatusTag status={teacher.status as AffiliationStatus} />
                    },
                    {title: 'Télephone', mention: teacher?.personalInfo?.telephone},
                ]}
                items={linkButtons}
            />
            <Widgets items={widgetItems} />
            {/*TODO Ne pas oublié de créer la page setting de l'anseignant où il pourra ajouter les programmes, les modifiés et surtout, changé le timing avec un nouveau academic year.*/}
            <ViewRoot
                items={[
                    {label: "Info", children: <TeacherInfo
                        infoData={teacher as Teacher}
                        color={color}
                        academicYear={currentAcademicYear?.id}
                        dataKey='info'
                        isSelf={isSelfAuthorized}
                    />},
                    {label: "Agenda", children: <TeacherAgenda
                        infoData={teacher as Teacher}
                        academicYear={currentAcademicYear?.id}
                        dataKey='agenda'
                    />},
                    {label: "Programme", children: <TeacherProgram
                        infoData={teacher as Teacher}
                        hasPermission={isTeacherAuthorized}
                        isSelf={isSelfAuthorized}
                        color={color}
                        dataKey='program'
                    />},
                    {label: "Devoirs", children: <TeacherAssignments
                        infoData={teacher as Teacher}
                        hasPermission={isTeacherAuthorized}
                        isSelf={isSelfAuthorized}
                        resourceYear={currentAcademicYear}
                        dataKey='assignment'
                    />},
                    {label: "Réprimande", children: <TeacherReprimand
                        infoData={teacher as Teacher}
                        dataKey='reprimand'
                        hasPermission={isTeacherAuthorized}
                        isSelf={isSelfAuthorized}
                    />},
                    {label: "Rapport Journalier", children: <TeacherReports
                        infoData={teacher as Teacher}
                        resourceYear={currentAcademicYear}
                        hasPermission={isTeacherAuthorized}
                        isSelf={isSelfAuthorized}
                        dataKey={"reports"}
                    />},
                ]}
                exists={!!teacher}
                addMargin={{
                    position: "top",
                    size: 30
                }}
                activeTab={activeTab}
                memorizedTabKey={'teacherTabKey'}
            />
            {(canEdit && teacher && openDrawer) && <section>
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