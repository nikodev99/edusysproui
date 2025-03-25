import {useParams} from "react-router-dom";
import {ReactNode, useEffect, useRef, useState} from "react";
import {AcademicYear, Classe} from "../../entity";
import {Color, GenderCounted} from "../../utils/interfaces.ts";
import {useFetch, useRawFetch} from "../../hooks/useFetch.ts";
import {getClasse} from "../../data/repository/classeRepository.ts";
import {initAcademicYears, initCurrentAcademicYear, useGlobalStore} from "../../core/global/store.ts";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {setBreadcrumb} from "../../core/breadcrumb.tsx";
import {text} from "../../utils/text_display.ts";
import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";
import {Select, Tag} from "antd";
import {
    LuBookOpenCheck, LuBookPlus, LuCalendarCheck, LuCalendarPlus, LuUserCheck,
    LuUserPlus, LuUserRoundCheck, LuUserRoundPlus,
} from "react-icons/lu";
import {datetimeExpose, isObjectEmpty} from "../../utils/utils.ts";
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
import {countClasseStudents} from "../../data/repository/studentRepository.ts";
import {SuperWord} from "../../utils/tsxUtils.tsx";
import {useToggle} from "../../hooks/useToggle.ts";

const ClasseViewPage = () => {

    const {id} = useParams();
    const currentAcademicYear: AcademicYear = useGlobalStore.use.currentAcademicYear()
    const academicYears: AcademicYear[] = useGlobalStore.use.academicYears()

    const [classe, setClasse] = useState<Classe | null>(null)
    const [color, setColor] = useState<Color>('')
    const [studentCount, setStudentCount] = useState<GenderCounted[] | null>(null)
    const [usedAcademicYearId, setUsedAcademicYearId] = useState<string | null>(null)
    const [open, setOpen] = useToggle(false)
    const countStudent = useRef<number>(0)

    const {data, isSuccess, error, isLoading, refetch} = useFetch(['classe-id', id], getClasse, [id, usedAcademicYearId], {
        queryKey: ['classe-id', id],
        enabled: usedAcademicYearId !== null
    })

    console.log('Error: ', error);
    
    const fetch = useRawFetch<GenderCounted>()

    useDocumentTitle({
        title: classe?.name as string,
        description: "Classe Description"
    })

    const pageHierarchy = setBreadcrumb([
        { title: text.cc.label, path: text.cc.href },
        { title: <SuperWord input={classe?.name as string} /> }
    ])

    useEffect(() => {
        if (id && usedAcademicYearId) {
            fetch(countClasseStudents, [id, usedAcademicYearId])
                .then(resp => {
                    if (resp.isSuccess) {
                        const count = resp.data as GenderCounted[]
                        setStudentCount(count)
                        countStudent.current = count?.reduce((sum, current) => sum + current.count, 0)
                    }
                })
                .catch(error => {
                    console.error("Failed to fetch student count: ", error)
                })
        }
    }, [fetch, id, isSuccess, usedAcademicYearId]);

    useEffect(() => {
        if (!isObjectEmpty(currentAcademicYear))
            setUsedAcademicYearId(currentAcademicYear.id)
    }, [currentAcademicYear]);

    useEffect(() => {
        if (usedAcademicYearId) {
            refetch().then(r => r.data)
        }
    }, [refetch, usedAcademicYearId]);

    useEffect(() => {
        if(isObjectEmpty(currentAcademicYear)) {
            initCurrentAcademicYear()
        }
        if (academicYears.length === 0 && classe?.createdAt) {
            const date = datetimeExpose(classe?.createdAt as number)
            initAcademicYears(date?.year as number)
        }
        if(isSuccess && data) {
            setClasse(data as Classe);
        }
    }, [academicYears.length, classe?.createdAt, currentAcademicYear, data, isSuccess]);

    const academicYearOptions = academicYears?.map(a => ({
        value: a.id,
        label: a.academicYear
    }))

    const handleAcademicYearIdValue = (value: string) =>  {
        setUsedAcademicYearId(value)
    }

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

    console.log('CLASSE: ', classe)

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
                    {title: "Nombre d'élève", mention: countStudent.current},
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
                            totalStudents={countStudent.current}
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