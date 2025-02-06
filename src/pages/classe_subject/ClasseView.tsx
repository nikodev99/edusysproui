import {useParams} from "react-router-dom";
import {ReactNode, useEffect, useLayoutEffect, useRef, useState} from "react";
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
    LuCalendarCheck, LuCalendarPlus,
    LuUserCheck,
    LuUserPlus, LuUserRoundCheck, LuUserRoundPlus,
} from "react-icons/lu";
import {datetimeExpose, isObjectEmpty} from "../../utils/utils.ts";
import {ViewRoot} from "../../components/custom/ViewRoot.tsx";
import {ClasseAttendance, ClasseExams, ClasseInfo, ClasseSchedule, ClasseStudent} from "../../components/ui-kit-cc";
import {countClasseStudents} from "../../data/repository/studentRepository.ts";
import {SuperWord} from "../../utils/tsxUtils.tsx";

const ClasseView = () => {

    const {id} = useParams();
    const currentAcademicYear: AcademicYear = useGlobalStore.use.currentAcademicYear()
    const academicYears: AcademicYear[] = useGlobalStore.use.academicYears()

    const [classe, setClasse] = useState<Classe | null>(null)
    const [color, setColor] = useState<Color>('')
    const [studentCount, setStudentCount] = useState<GenderCounted[] | null>(null)
    const [usedAcademicYearId, setUsedAcademicYearId] = useState<string | null>(null)
    const countStudent = useRef<number>(0)

    const {data, isSuccess, error, isLoading, refetch} = useFetch(['classe-id', id], getClasse, [id, usedAcademicYearId], {
        queryKey: ['classe-id', id],
        enabled: usedAcademicYearId !== null
    })
    
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
        fetch(countClasseStudents, [id, usedAcademicYearId])
            .then(resp => {
                if (isSuccess) {
                    const count = resp.data as GenderCounted[]
                    setStudentCount(count)
                    countStudent.current = count?.reduce((sum, current) => sum + current.count, 0)
                }
            })
    }, [fetch, id, isSuccess, usedAcademicYearId]);

    useLayoutEffect(() => {
        if (!isObjectEmpty(currentAcademicYear))
            setUsedAcademicYearId(currentAcademicYear.id)
    }, [currentAcademicYear]);

    useEffect(() => {
        if(isObjectEmpty(currentAcademicYear)) {
            initCurrentAcademicYear()
        }
        if (academicYears.length === 0 && classe?.createdAt) {
            const date = datetimeExpose(classe?.createdAt as number)
            initAcademicYears(date?.year as number)
        }
        if (usedAcademicYearId) {
            refetch()
        }
        if(isSuccess) {
            setClasse(data as Classe)
        }
    }, [classe, academicYears, currentAcademicYear, data, isSuccess, usedAcademicYearId, refetch]);

    const academicYearOptions = academicYears?.map(a => ({
        value: a.id,
        label: a.academicYear
    }))

    const handleAcademicYearIdValue = (value: string) =>  {
        setUsedAcademicYearId(value)
    }

    return(
        <>
            <PageHierarchy items={pageHierarchy as [{ title: string | ReactNode, path?: string }]} />
            <ViewHeader
                isLoading={isLoading}
                setEdit={() => alert('Tu as cliqué sur edit')}
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
                items={[
                    {
                        key: 0,
                        label: classe?.principalStudent ? 'Changer chef de classe' : 'Ajouter chef de classe',
                        icon: classe?.principalStudent ? <LuUserRoundCheck /> : <LuUserRoundPlus />,
                        onClick: () => alert('Pour changer le chef de classe')
                    },
                    {
                        key: 0,
                        label: classe?.principalTeacher ? 'Changer prof principal' : 'Ajouter prof principal',
                        icon: classe?.principalTeacher ? <LuUserCheck /> : <LuUserPlus />,
                        onClick: () => alert('Pour changer le prof principal')
                    },
                    {
                        key: 0,
                        label: classe?.schedule && classe.schedule?.length > 0 ? "Changer l'emploi du temps" : "Ajouter l'emploi du temps",
                        icon: classe?.schedule && classe.schedule?.length > 0 ? <LuCalendarCheck /> : <LuCalendarPlus />,
                        onClick: () => alert('Pour changer le prof principal')
                    }
                ]}
                upperName={true}
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
                        />
                    },
                    {label: 'Étudiants', children: <ClasseStudent infoData={classe!} dataKey='students' />},
                    {label: 'Emploi du Temps', children: <ClasseSchedule infoData={classe!} dataKey='schedule' />},
                    {label: 'Présence', children: <ClasseAttendance infoData={classe!} dataKey='attendance' />},
                    {label: 'Examens', children: <ClasseExams infoData={classe!} dataKey='exams' />}
                ]}
                exists={classe !== null && usedAcademicYearId !== null}
                tab={{
                    centered: true
                }}
            />
        </>
    )
}

export default ClasseView