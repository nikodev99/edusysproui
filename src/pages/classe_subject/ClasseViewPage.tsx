import {useParams} from "react-router-dom";
import {ReactNode, useEffect, useState} from "react";
import {Classe} from "../../entity";
import {Color, GenderCounted} from "../../core/utils/interfaces.ts";
import {useFetch} from "../../hooks/useFetch.ts";
import {getClasse} from "../../data/repository/classeRepository.ts";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";
import {Select, Tag} from "antd";
import {
    LuBookOpenCheck, LuBookPlus, LuCalendarCheck, LuCalendarPlus, LuUserCheck,
    LuUserPlus, LuUserRoundCheck, LuUserRoundPlus,
} from "react-icons/lu";
import {ViewRoot} from "../../components/custom/ViewRoot.tsx";
import {
    ClasseAttendance,
    ClasseExams,
    ClasseInfo,
    ClasseSchedule,
    ClasseStudent,
    ClasseReport,
    ClasseEditDrawer
} from "../../components/ui-kit-cc";
import {SuperWord} from "../../core/utils/tsxUtils.tsx";
import {useToggle} from "../../hooks/useToggle.ts";
import {useAcademicYear} from "../../hooks/useAcademicYear.ts";
import {useStudentRepo} from "../../hooks/useStudentRepo.ts";

const ClasseViewPage = () => {

    const {id} = useParams();

    const [classe, setClasse] = useState<Classe | null>(null)
    const [color, setColor] = useState<Color>('')
    const [studentCount, setStudentCount] = useState<GenderCounted | null>(null)
    const [open, setOpen] = useToggle(false)
    const {useCountClasseStudents} = useStudentRepo()

    const {usedAcademicYearId, currentAcademicYear, academicYearOptions, handleAcademicYearIdValue} = useAcademicYear(classe?.createdAt as number)

    const {data, isSuccess, error, isLoading, refetch} = useFetch(['classe-id', id], getClasse, [id, usedAcademicYearId], usedAcademicYearId !== null)

    console.log('Error: ', error);
    const {data: countData, isSuccess: isCountSuccess} = useCountClasseStudents(Number.parseInt(id ?? '0'), usedAcademicYearId as string)

    useDocumentTitle({
        title: classe?.name as string,
        description: "Classe Description"
    })

    const pageHierarchy = useBreadCrumb([
        { title: text.cc.label, path: text.cc.href },
        { title: <SuperWord input={classe?.name as string} /> }
    ])

    useEffect(() => {
        if (isCountSuccess)
            setStudentCount(countData)
    }, [countData, isCountSuccess]);

    useEffect(() => {
        if (usedAcademicYearId) {
            refetch().then(r => r.data)
        }
    }, [refetch, usedAcademicYearId]);

    useEffect(() => {
        if(isSuccess && data) {
            setClasse(data as Classe);
        }
    }, [classe?.createdAt, currentAcademicYear, data, isSuccess]);

    const handleCloseDrawer = () => {
        setOpen()
        refetch().then(r => r.data)
    }

    const linkItem = [
        {
            label: classe?.principalStudent ? 'Changer chef de classe' : 'Ajouter chef de classe',
            icon: classe?.principalStudent ? <LuUserRoundCheck /> : <LuUserRoundPlus />,
            onClick: () => alert('Pour changer le chef de classe')
        },
        {
            label: classe?.principalTeacher ? 'Changer prof principal' : 'Ajouter prof principal',
            icon: classe?.principalTeacher ? <LuUserCheck /> : <LuUserPlus />,
            onClick: () => alert('Pour changer le prof principal')
        },
        {
            label: classe?.principalCourse ? 'Changer matière principal' : 'Ajouter matière principal',
            icon: classe?.principalCourse ? <LuBookOpenCheck /> : <LuBookPlus />,
            onClick: () => alert('Pour changer le prof principal')
        },
        {
            label: classe?.schedule && classe.schedule?.length > 0 ? "Changer l'emploi du temps" : "Ajouter l'emploi du temps",
            icon: classe?.schedule && classe.schedule?.length > 0 ? <LuCalendarCheck /> : <LuCalendarPlus />,
            onClick: () => alert('Pour changer le prof principal')
        }
    ]

    return(
        <>
            <PageHierarchy items={pageHierarchy as [{ title: string | ReactNode, path?: string }]} />
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
                    {title: "Nombre " + text.student.label + 's', mention: studentCount?.total},
                    {
                        title: "Année Académique",
                        mention: <Select
                            className='select-control'
                            defaultValue={currentAcademicYear?.academicYear}
                            options={academicYearOptions}
                            onChange={handleAcademicYearIdValue}
                            variant='borderless'
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
                    {label: 'Info', children: <ClasseInfo
                            infoData={classe!}
                            color={color}
                            dataKey='Info'
                            studentCount={studentCount}
                            totalStudents={studentCount?.total}
                            academicYear={usedAcademicYearId as string}
                        />
                    },
                    {label: 'Étudiants', children: <ClasseStudent
                        infoData={classe!}
                        academicYear={usedAcademicYearId as string}
                        studentCount={studentCount}
                        dataKey='students'
                    />},
                    {label: 'Emploi du Temps', children: <ClasseSchedule infoData={classe!} academicYear={usedAcademicYearId as string} dataKey='schedule' />},
                    {label: 'Présence', children: <ClasseAttendance
                        infoData={classe!}
                        academicYear={usedAcademicYearId as string}
                        dataKey='attendance'
                        studentCount={studentCount}
                    />},
                    {label: 'Examens', children: <ClasseExams infoData={classe!} academicYear={usedAcademicYearId as string} dataKey='exams' />},
                    {label: 'Compte Rendu', children: <ClasseReport />}
                ]}
                exists={classe !== null && usedAcademicYearId !== null}
                memorizedTabKey='classeTabKey'
                tab={{
                    centered: true
                }}
            />
            <ClasseEditDrawer open={open} close={handleCloseDrawer} data={classe as Classe} />
        </>
    )
}

export default ClasseViewPage