import {useParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {AcademicYear, Classe} from "@/entity";
import {Color, GenderCounted} from "@/core/utils/interfaces.ts";
import {useDocumentTitle} from "@/hooks/useDocumentTitle.ts";
import {useBreadCrumb} from "@/hooks/useBreadCrumb.tsx";
import {useText} from "@/core/utils/text_display.ts";
import ViewHeader from "@/components/ui/layout/ViewHeader.tsx";
import {Skeleton, Tag} from "antd";
import {ViewRoot} from "@/components/custom/ViewRoot.tsx";
import {
    ClasseAttendance,
    ClasseExams,
    ClasseInfo,
    ClasseSchedule,
    ClasseStudent,
    ClasseReport,
    ClasseEditDrawer, ClasseActionLinks, ClasseReprimand
} from "@/components/ui-kit-cc";
import {SuperWord} from "@/core/utils/tsxUtils.tsx";
import {useToggle} from "@/hooks/useToggle.ts";
import {useStudentRepo} from "@/hooks/actions/useStudentRepo.ts";
import {useClasseRepo} from "@/hooks/actions/useClasseRepo.ts";
import {SelectAcademicYear} from "@/components/common/SelectAcademicYear.tsx";
import {useAcademicYearRepo} from "@/hooks/actions/useAcademicYearRepo.ts";
import {usePermission} from "@/hooks/usePermission.ts";
import {ItemType} from "antd/es/menu/interface";
import {stringhelper} from "@/core/helpers/StringHelper.ts";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {getUniqueness} from "@/core/utils/utils.ts";
import {isTeacher} from "@/auth/dto/role.ts";

export type PermissionType = {canViewStudent: boolean, canViewTeacher: boolean}

const ClasseViewPage = () => {

    const {id} = useParams();

    const [classe, setClasse] = useState<Classe | null>(null)
    const [linkButtons, setLinkButtons] = useState<ItemType[]>([])
    const [shouldRefresh, setShouldRefresh] = useState<boolean>(false)
    const [color, setColor] = useState<Color>('')
    const [studentCount, setStudentCount] = useState<GenderCounted | null>(null)
    const [academicYear, setAcademicYear] = useState<AcademicYear | undefined>(undefined)
    const [usedAcademicYearId, setUsedAcademicYearId] = useState<string>()
    const [open, setOpen] = useToggle(false)
    const {currentAcademicYear} = useAcademicYearRepo()
    const {useCountClasseStudents} = useStudentRepo()
    const {useCheckPrincipal, useAmongClasseTeachers} = useTeacherRepo()
    const {useGetClasse} = useClasseRepo()
    const {can, canCreate, canDelete} = usePermission()
    const text = useText()

    const {isPrincipal} = useCheckPrincipal(Number(id))
    const isTeacherAuthorized = can('teacherAction', true)
    const canViewTeachers = can('canViewTeachers', true)
    const canViewStudents = can('canViewStudents', true)
    const distinctTeachers = getUniqueness((classe?.classeTeachers ?? []), c => c.teacher, t => t?.id as string)
    const isClasseTeacher = useAmongClasseTeachers(distinctTeachers)
    
    const isTeacherStudentView = canViewStudents && isClasseTeacher
    const hasPermission: PermissionType = useMemo(() => ({
        canViewTeacher: canViewTeachers,
        canViewStudent: isTeacher() ? isTeacherStudentView :  canViewStudents
    }), [canViewStudents, canViewTeachers, isTeacherStudentView])

    const {data, isSuccess, error, isLoading, refetch} = useGetClasse(Number(id), (usedAcademicYearId || currentAcademicYear?.id) as string)
    const {data: countData, isSuccess: isCountSuccess} = useCountClasseStudents(Number.parseInt(id ?? '0'), usedAcademicYearId as string)

    useDocumentTitle({
        title: classe?.name as string,
        description: "Classe Description"
    })

    const {context} = useBreadCrumb({
        bCItems: [
            { title: text.cc.label, path: text.cc.href },
            { title: <SuperWord input={classe?.name as string} /> }
        ]
    })

    useEffect(() => {
        if (isCountSuccess)
            setStudentCount(countData)
    }, [countData, isCountSuccess]);

    useEffect(() => {
        if(isSuccess && data) {
            setClasse(data as Classe);
        }
    }, [data, isSuccess])
    
    useEffect(() => {
        if (shouldRefresh)
            refetch().then(r => r)
        
    }, [refetch, shouldRefresh]) 

    const handleCloseDrawer = () => {
        setOpen()
        refetch().then(r => r.data)
    }

    const linkItem = [
        ...linkButtons
    ]

    if (!classe || (error && Object.keys(error).length > 0))
        return <Skeleton active paragraph={{ rows: 10 }} />

    return(
        <>
            {context}
            <ViewHeader
                isLoading={isLoading}
                setEdit={() => setOpen()}
                closeState={false}
                avatarProps={{
                    firstName: classe?.name,
                    reference: classe?.category
                }}
                blockProps={[
                    {title: 'Niveau', mention: <Tag>{classe?.grade.section}</Tag>},
                    {
                        title: "Nombre " + stringhelper.setPlural({word: text.student.label, count: studentCount?.total}),
                        mention: studentCount?.total
                    },
                    {
                        title: "Année Académique",
                        mention: <SelectAcademicYear
                            getResource={setAcademicYear as never}
                            getAcademicYear={setUsedAcademicYearId as never}
                            when={{after: classe?.createdAt}}
                        />
                    }
                ]}
                items={linkItem as []}
                upperName={true}
                btnLabel='Gestion de Classe'
                editText='Editer la classe'
                pColor={setColor}
            />
            <ViewRoot
                items={[
                    {
                        label: 'Info',
                        children: <ClasseInfo
                            infoData={classe!}
                            color={color}
                            dataKey='Info'
                            studentCount={studentCount}
                            totalStudents={studentCount?.total}
                            academicYear={usedAcademicYearId as string}
                            resourceYear={academicYear}
                            hasPermission={hasPermission}
                        />
                    },
                    {
                        label: 'Étudiants',
                        children: <ClasseStudent
                            infoData={classe!}
                            academicYear={usedAcademicYearId as string}
                            studentCount={studentCount}
                            dataKey='students'
                        />
                    },
                    {
                        label: 'Emploi du Temps',
                        children: <ClasseSchedule
                            infoData={classe!}
                            academicYear={usedAcademicYearId as string}
                            dataKey='schedule'
                        />
                    },
                    {
                        label: 'Présence',
                        children: <ClasseAttendance
                            infoData={classe!}
                            academicYear={usedAcademicYearId as string}
                            dataKey='attendance'
                            studentCount={studentCount}
                        />
                    },
                    {
                        label: 'Examens',
                        children: <ClasseExams
                            infoData={classe!}
                            academicYear={usedAcademicYearId as string}
                            resourceYear={academicYear}
                            hasPermission={hasPermission}
                            dataKey='exams'
                        />
                    },
                    {
                        label: 'Réprimandes',
                        children: <ClasseReprimand
                            infoData={classe!}
                            academicYear={usedAcademicYearId as string}
                            dataKey='classe-reprimands'
                        />
                    },
                    {
                        label: 'Compte Rendu',
                        children: <ClasseReport
                            infoData={classe}
                            academicYear={usedAcademicYearId}
                            resourceYear={academicYear}
                            hasPermission={isTeacherAuthorized && isClasseTeacher}
                            isSelf={false}
                            dataKey='reports'
                        />
                    }
                ]}
                exists={!!classe && !!usedAcademicYearId}
                memorizedTabKey='classeTabKey'
                tab={{
                    centered: true
                }}
            />
            {open && <ClasseEditDrawer
                open={open}
                close={handleCloseDrawer}
                data={classe as Classe}
            />}
            {classe && <ClasseActionLinks 
                data={classe} 
                getItems={setLinkButtons} 
                setRefresh={setShouldRefresh} 
                academicYear={usedAcademicYearId as string}
                permissions={{
                    canCreate,
                    canDelete,
                    isPrincipal: (isPrincipal || false)
                }}
            />}
        </>
    )
}

export default ClasseViewPage