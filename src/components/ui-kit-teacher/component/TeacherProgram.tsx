import {InfoPageProps, Option, Options} from "@/core/utils/interfaces.ts";
import {InsertNewProgram, ProgramCard} from "@/components/ui-kit-teacher"
import {Teacher} from "@/entity";
import {ReactNode, useEffect, useMemo, useState} from "react";
import TabItem from "@/components/view/TabItem.tsx";
import {Button, Card, Flex, Progress, Select, Space} from "antd";
import Grid from "@/components/ui/layout/Grid.tsx";
import Responsive from "@/components/ui/layout/Responsive.tsx";
import {useCourseProgramRepo} from "@/hooks/actions/useCourseProgramRepo.ts";
import {SelectAcademicYear} from "@/components/common/SelectAcademicYear.tsx";
import {useAcademicYearRepo} from "@/hooks/actions/useAcademicYearRepo.ts";
import {SemesterProgram} from "@/entity/domain/courseProgram.ts";
import {semesterHelper} from "@/core/helpers/semesterHelpers.ts";
import {ProgramStatusBadge, StatPill, SuperWord} from "@/core/utils/tsxUtils.tsx";
import {LuBookCheck, LuBookLock, LuBookOpenText, LuClipboardPlus, LuPlus} from "react-icons/lu";
import Datetime from "@/core/datetime.ts";
import {useToggle} from "@/hooks/useToggle.ts";
import LocalStorageManager from "@/core/LocalStorageManager.ts";
import {useSemesterRepo} from "@/hooks/actions/useSemesterRepo.ts";

type SavedParams = {
    academicYear?: string;
    semester?: number;
    course?: number;
    classe?: number;
}

function updateSaved(key: keyof SavedParams, value: unknown) {
    return LocalStorageManager.update<SavedParams>('savedParams', (current) => ({
        ...current,
        [key]: value
    }))
}

export const TeacherProgram = ({infoData, color, hasPermission}: InfoPageProps<Teacher>) => {
    const {courses, classes} = infoData
    const saved = LocalStorageManager.get<SavedParams>("savedParams")

    const {currentAcademicYear} = useAcademicYearRepo()
    const [semesterValue, setSemesterValue] = useState<number>(saved?.semester || 0)
    const [teacherId, setTeacherId] = useState<string>(infoData?.id || '')
    const [academicYear, setAcademicYear] = useState<string>(saved?.academicYear || currentAcademicYear?.id || '')
    const [subjectValue, setSubjectValue] = useState<number | undefined>(saved?.course || (courses && courses?.length > 0 ? courses[0].id as number : undefined))
    const [classeValue, setClasseValue] = useState<number>(saved?.classe || (classes && classes?.length > 0 ? classes[0].id as number : 0))
    const [activeClasse, setActiveClasse] = useState<string | ReactNode>(classes && classes?.length > 0 ? saved?.classe ? classes[saved?.classe]?.name : classes[0]?.name  :'')
    const [openNewProgramModal, setOpenNewProgramModal] = useToggle(false)
    const [showClasseField, setShowClasseField] = useState(true)
    
    const {useGetTeacherPrograms} = useCourseProgramRepo()
    const {useGetAllSemesters, semesterOptions} = useSemesterRepo()
    const semesters = useGetAllSemesters()

    const {data: courseProgram, refetch, isLoading, isRefetching, isLoadingError} = useGetTeacherPrograms(teacherId, {classId: classeValue, courseId: subjectValue}, academicYear)

    const {course, semesterPrograms, classe, inProgressSemesterPrograms, programInProgress, totalPrograms, completedPrograms, totalLate, progress} = useMemo(() => {
        const allProgramBySemester = courseProgram?.semesters
        const pickedPrograms: SemesterProgram | undefined = allProgramBySemester?.find(cp => cp?.semester?.semesterId === semesterValue)
        const allPrograms = allProgramBySemester?.flatMap(s => s?.programs)?.filter(cp => cp?.id) || []
        const inProgressBySemester = allProgramBySemester?.filter(cps => cps?.programs?.some(cp => cp?.timing?.status === 'IN_PROGRESS')) || []
        const inProgressPrograms = inProgressBySemester?.flatMap(s => s?.programs)?.filter(cp => cp?.timing?.status === 'IN_PROGRESS') || []
        const tPrograms = allPrograms?.length || 0
        const tCompleted = allPrograms?.reduce((acc, cp) => acc + (cp?.timing?.status === 'COMPLETED' ? 1 : 0), 0) || 0
        const tLate = allPrograms?.reduce((acc, cp) => acc + (semesterHelper.checkLateStatus(cp?.timing) ? 1 : 0), 0) || 0

        const pct = Math.round((tCompleted * 100) / (tPrograms as number))

        return {
            course: courseProgram?.course,
            semesterPrograms: pickedPrograms,
            classe: courseProgram?.classe,
            inProgressSemesterPrograms: inProgressBySemester,
            programInProgress: inProgressPrograms,
            programs: allPrograms,
            totalPrograms: tPrograms,
            completedPrograms: tCompleted,
            totalLate: tLate,
            progress: pct,
        }

    }, [courseProgram?.classe, courseProgram?.course, courseProgram?.semesters, semesterValue])

    const pending: boolean = isLoading || isRefetching || isLoadingError

    const subjects = useMemo(() => {
        return courses?.map(c => ({
            value: c.id, label: c.course
        }))
    }, [courses])
    
    const classeOptions: Options | undefined = useMemo(() => {
        return classes?.map(c => ({
            value: c?.id, label: c?.name
        }))
    }, [classes])

    useEffect(() => {
        setSemesterValue(state => {
            return state === 0 ? semesterHelper.getCurrentSemesterId(semesters ?? []) : state
        });
    }, [semesters]);

    useEffect(() => {
        if (!teacherId) {
            setTeacherId(infoData?.id || '')
        }
        
        if (classeValue || subjectValue || academicYear) {
            refetch().then(r => r)
        }
    }, [academicYear, classeValue, infoData?.id, refetch, subjectValue, teacherId]);

    const handleSubjectValue = (value: number) => {
        setSubjectValue(value)
        updateSaved('course', value)
    }

    const handleSemesterChange = (value: number) => {
        setSemesterValue(value)
        updateSaved('semester', value)
    }

    const handleClasseChange = ({label, value}:Option) => {
        setClasseValue(value as number)
        setActiveClasse(label)
        updateSaved('classe', value)
    }

    const handleShowClasseField = (show: boolean = true) => {
        setShowClasseField(show)
        setOpenNewProgramModal()
    }

    return(
        <TabItem
            title={`Gestion des Programmes de ${infoData.personalInfo?.lastName}`}
            selects={[
                <SelectAcademicYear
                    getAcademicYear={setAcademicYear as () => void}
                    onChange={(value) => updateSaved('academicYear', value)}
                />,

                ...((semesters && semesters?.length > 0) ? [<Select
                    className='select-control'
                    defaultValue={semesterValue}
                    value={semesterValue}
                    options={semesterOptions}
                    onChange={handleSemesterChange}
                    variant='borderless'
                />] : []),

                ...((courses && courses.length > 0) ? [<Select
                    className='select-control'
                    defaultValue={subjectValue}
                    value={subjectValue}
                    options={subjects}
                    onChange={handleSubjectValue}
                    variant='borderless'
                />] : []),

                ...((classeOptions && classeOptions?.length > 0) ? [<Space>
                    {classeOptions.map( c => (
                        <Button key={c.value} onClick={() => handleClasseChange(c)} style={{
                            padding: "6px 14px", borderRadius: 8,
                            border: `1.5px solid ${classeValue === c.value ? "#6366F1" : "#E2E8F0"}`,
                            background: classeValue === c.value ? "#EEF2FF" : "white",
                            color: classeValue === c.value ? "#4338CA" : "#64748B",
                            fontSize: 13, fontWeight: 600, cursor: "pointer",
                            transition: "all 0.15s",
                        }}>
                            <SuperWord input={c?.label as string} />
                        </Button>
                    ))}
                </Space>]: []),

                ...(hasPermission ? [<Button
                    type='primary'
                    icon={<LuPlus />}
                    onClick={() => handleShowClasseField()}
                >
                    Ajouter au programme
                </Button>] : [])
            ]}
            items={[
                {
                    key: 'program-list',
                    label: 'Liste Programme',
                    children: <><Responsive gutter={0} justify='space-around'>
                        <Grid xs={24} md={12} lg={12}>
                            <Flex vertical>
                                <Card loading={pending}>
                                    {inProgressSemesterPrograms && inProgressSemesterPrograms?.length > 0 ? inProgressSemesterPrograms?.map(cp => (
                                    <div key={cp?.semester?.semesterId} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                                <span style={{ fontSize: 11, fontWeight: 700, color: color, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                                    {course?.course}
                                                </span>
                                                <span style={{ color: "#CBD5E1" }}>·</span>
                                                <span style={{ fontSize: 11, color: "#94A3B8" }}>
                                                    <SuperWord input={classe?.name as string} isSpan /> · {cp?.semester?.template?.semesterName}
                                                </span>
                                            </div>
                                            {(cp?.programs && cp?.programs?.length > 0) && programInProgress?.map(p =>
                                                <div key={p?.id}><Space direction='horizontal'>
                                                    <h2 style={{
                                                        fontFamily: "'Instrument Serif', serif",
                                                        fontSize: 24, margin: 0, color: "#0F172A",
                                                        fontWeight: 400, letterSpacing: "-0.01em",
                                                    }}>
                                                        {p?.name} <ProgramStatusBadge status={p?.timing?.status} small />
                                                    </h2>
                                                </Space>
                                                <p style={{ fontSize: 12, color: "#94A3B8", margin: "6px 0 6px 0" }}>
                                                    {Datetime.of(p?.timing?.startDate).fDate()} → {Datetime?.of(p?.timing?.endDate).fDate()}
                                                </p>
                                                {p?.description && <div style={{marginBottom: 6 }}>
                                                    <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600}}>
                                                        DESCRIPTION
                                                    </div>
                                                    <p style={{ fontSize: 12, color: "#94A3B8" }}>
                                                        {p?.description}
                                                    </p>
                                                </div>}
                                                {p?.purpose && <div>
                                                    <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>
                                                        OBJECTIF
                                                    </div>
                                                    <p style={{ fontSize: 12, color: "#94A3B8" }}>
                                                        {p?.purpose}
                                                    </p>
                                                </div>}
                                            </div>)}
                                        </div>
                                    </div>)) : null}

                                    <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
                                        <StatPill icon={<LuBookOpenText color={'#1d55cd'} size={20} />} label="Thèmes" value={totalPrograms} />
                                        <StatPill icon={<LuBookCheck color={'#14a30c'} size={20} />} label="Complétés" value={completedPrograms} />
                                        <StatPill icon={<LuBookLock color={'#DC2626'} size={20} />} label="En retard" value={totalLate} alert={totalLate !== 0} />
                                    </div>

                                    <div style={{ marginTop: 16 }}>
                                        <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 6 }}>
                                            PROGRESSION GLOBALE
                                        </div>
                                        <Progress
                                            percent={progress}
                                            size={{height: 20}}
                                            percentPosition={{align: 'center', type: 'inner'}}
                                            strokeColor={progress === 100 ? "#22C55E" : `linear-gradient(90deg,${color},#22C55E)`}
                                            status={'active'}
                                        />
                                    </div>
                                </Card>

                                <Flex justify='space-around' gap={16} vertical style={{marginTop: 25}}>
                                    {(semesterPrograms && semesterPrograms?.programs && semesterPrograms?.programs?.length > 0) ? (
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#475569", margin: 0, letterSpacing: "0.05em" }}>
                                                    THÈMES ET SOUS-THÈMES
                                                </h3>
                                                <span style={{ fontSize: 12, color: "#94A3B8" }}>
                                                    {semesterPrograms.programs.length} thème{semesterPrograms.programs.length > 1 ? "s" : ""}
                                                </span>
                                            </div>

                                            {semesterPrograms?.programs?.map((sp, index) => (
                                                <ProgramCard
                                                    program={sp}
                                                    key={sp?.id}
                                                    index={index + 1}
                                                    hasPermission={hasPermission}
                                                    academicYearId={academicYear}
                                                    onRefetch={refetch}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{
                                            textAlign: "center", padding: "64px 32px",
                                            background: "white", borderRadius: 16,
                                            border: "1.5px dashed #E2E8F0",
                                        }}>
                                            <div style={{
                                                width: 64, height: 64, borderRadius: 16,
                                                background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                margin: "0 auto 16px", fontSize: 28,
                                            }}><LuClipboardPlus /></div>
                                            <Flex vertical justify={'center'} align={'center'}>
                                                <h3 style={{
                                                    fontFamily: "'Instrument Serif', serif", fontSize: 22,
                                                    color: "#0F172A", fontWeight: 400, margin: "0 0 8px",
                                                }}>
                                                    Aucun programme de {infoData.personalInfo?.lastName} pour la classe de <SuperWord input={activeClasse as string} isSpan />
                                                </h3>
                                                <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 24px", maxWidth: 360, marginInline: "auto" }}>
                                                    Créez un programme pour l'année <strong>{currentAcademicYear?.academicYear}</strong>.
                                                </p>
                                                {hasPermission && <div>
                                                    <Button type='primary' onClick={() => handleShowClasseField(false)}>
                                                        Créer un programme
                                                    </Button>
                                                </div>}
                                            </Flex>
                                        </div>
                                    )}
                                </Flex>
                            </Flex>
                        </Grid>
                    </Responsive>
                    {hasPermission && openNewProgramModal && (
                        <InsertNewProgram 
                            open={openNewProgramModal} 
                            onClose={setOpenNewProgramModal} 
                            classes={classeOptions}
                            courses={subjects}
                            semesters={semesterOptions as []}
                            courseValue={subjectValue}
                            classeValue={classeValue}
                            semesterValue={semesterValue}
                            showField={showClasseField}
                            teacherValue={infoData?.id}
                            academicYear={academicYear}
                            onRefetch={refetch as never}
                        />
                    )}
                    </>
                }
            ]}
        />
    )
}
