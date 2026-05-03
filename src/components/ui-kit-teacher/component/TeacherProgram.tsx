import {InfoPageProps} from "@/core/utils/interfaces.ts";
import {ProgramCard} from "@/components/ui-kit-teacher"
import {Teacher, CourseProgram, Semester} from "@/entity";
import {useEffect, useMemo, useState} from "react";
import TabItem from "@/components/view/TabItem.tsx";
import {Button, Card, DescriptionsProps, Flex, Menu, Progress, Select, Space, Tabs} from "antd";
import Grid from "@/components/ui/layout/Grid.tsx";
import Responsive from "@/components/ui/layout/Responsive.tsx";
import Tag from "@/components/ui/layout/Tag.tsx";
import {useCourseProgramRepo} from "@/hooks/actions/useCourseProgramRepo.ts";
import {SelectAcademicYear} from "@/components/common/SelectAcademicYear.tsx";
import {useAcademicYearRepo} from "@/hooks/actions/useAcademicYearRepo.ts";
import {CourseProgramResponse, SemesterProgram} from "@/entity/domain/courseProgram.ts";
import {useGlobalStore} from "@/core/global/store.ts";
import {getUniqueness, sumInArray} from "@/core/utils/utils.ts";
import {semesterHelper} from "@/core/helpers/semesterHelpers.ts";
import {ProgramStatusBadge, StatPill, SuperWord} from "@/core/utils/tsxUtils.tsx";
import {LuBookCheck, LuBookLock, LuBookOpenText, LuClipboardPlus, LuPlus} from "react-icons/lu";
import Datetime from "@/core/datetime.ts";

export const TeacherProgram = ({infoData, color, hasPermission}: InfoPageProps<Teacher>) => {
    const {id, courses, classes} = infoData

    const breakpoints = useGlobalStore.use.modalBreakpoints();

    const {currentAcademicYear} = useAcademicYearRepo()
    const [semesterValue, setSemesterValue] = useState<number>(0)
    const [teacherId, setTeacherId] = useState<string>(infoData?.id || '')
    const [academicYear, setAcademicYear] = useState<string>(currentAcademicYear?.id || '')
    const [subjectValue, setSubjectValue] = useState<number | undefined>(courses && courses?.length > 0 ? courses[0].id as number : undefined)
    const [classeValue, setClasseValue] = useState<number>(classes && classes?.length > 0 ? classes[0].id as number : 0)
    const [activeClasse, setActiveClasse] = useState<string>(classes && classes?.length > 0 ? classes[0].name : '')
    
    const {useGetTeacherPrograms} = useCourseProgramRepo()

    const {data: courseProgram, refetch, isLoading, isRefetching, isLoadingError} = useGetTeacherPrograms(teacherId, {classId: classeValue, courseId: subjectValue}, academicYear)

    const {course, semesters, semesterPrograms, classe, inProgressSemesterPrograms, programs, programInProgress, totalPrograms, completedPrograms, totalLate, progress} = useMemo(() => {
        const allProgramBySemester = courseProgram?.semesters
        const pickedPrograms: SemesterProgram | undefined = allProgramBySemester?.find(cp => cp?.semester?.semesterId === semesterValue)
        const allPrograms = allProgramBySemester?.flatMap(s => s?.programs)?.filter(cp => cp?.id) || []
        const allSemesters = getUniqueness<SemesterProgram, Semester>(allProgramBySemester as [], cp => cp?.semester, s => s?.semesterId)
        const inProgressBySemester = allProgramBySemester?.filter(cps => cps?.programs?.some(cp => cp?.timing?.status === 'IN_PROGRESS')) || []
        const inProgressPrograms = inProgressBySemester?.flatMap(s => s?.programs)?.filter(cp => cp?.timing?.status === 'IN_PROGRESS') || []
        const tPrograms = allPrograms?.length || 0
        const tCompleted = allPrograms?.reduce((acc, cp) => acc + (cp?.timing?.status === 'COMPLETED' ? 1 : 0), 0) || 0
        const tLate = allPrograms?.reduce((acc, cp) => acc + (semesterHelper.checkLateStatus(cp) ? 1 : 0), 0) || 0

        const pct = Math.round((tCompleted * 100) / (tPrograms as number))

        return {
            course: courseProgram?.course,
            semesters: allSemesters,
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

    const semesterOptions: {value: number, label: string}[] | undefined = useMemo(() => {
        return semesters?.map(s => ({
            value: s?.semesterId, label: s?.template?.semesterName
        }))
    }, [semesters])

    console.log("Programs: ", programs, ' semester value: ', programInProgress)

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
            refetch()
        }
    }, [academicYear, classeValue, infoData?.id, refetch, subjectValue, teacherId]);

    const handleSubjectValue = (value: number) => {
        setSubjectValue(value)
    }

    const handleSemesterChange = (value: number) => {
        setSemesterValue(value)
    }

    const handleClasseChange = ({label, value}:{label: string, value: number}) => {
        setClasseValue(value)
        setActiveClasse(label)
    }

    return(
        <TabItem
            title={`Gestion des Programmes de ${infoData.personalInfo?.lastName}`}
            selects={[
                <SelectAcademicYear getAcademicYear={setAcademicYear as () => void} />,

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

                ...((classes && classes?.length > 0) ? [<Space>
                    {classes.map( c => (
                        <Button key={c.id} onClick={() => handleClasseChange({value: c?.id, label: c?.name})} style={{
                            padding: "6px 14px", borderRadius: 8,
                            border: `1.5px solid ${classeValue === c.id ? "#6366F1" : "#E2E8F0"}`,
                            background: classeValue === c.id ? "#EEF2FF" : "white",
                            color: classeValue === c.id ? "#4338CA" : "#64748B",
                            fontSize: 13, fontWeight: 600, cursor: "pointer",
                            transition: "all 0.15s",
                        }}>
                            <SuperWord input={c?.name} />
                        </Button>
                    ))}
                </Space>]: []),

                ...(hasPermission ? [<Button
                    type='primary'
                    icon={<LuPlus />}
                    onClick={() => alert("Tu as cliqué sur ajouter au programme")}
                >
                    Ajouter au programme
                </Button>] : [])
            ]}
            items={[
                {
                    key: 'program-list',
                    label: 'Liste Programme',
                    children: <Responsive gutter={0} justify='space-around'>

                        <Grid xs={24} md={12} lg={12}>
                            <Flex vertical>
                                {inProgressSemesterPrograms && inProgressSemesterPrograms?.length > 0 ? inProgressSemesterPrograms?.map(cp => (
                                    <Card loading={pending} key={cp?.semester?.semesterId}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
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
                                                    <p style={{ fontSize: 12, color: "#94A3B8", margin: "6px 0 0" }}>
                                                        {Datetime.of(p?.timing?.startDate).fDate()} → {Datetime?.of(p?.timing?.endDate).fDate()}
                                                    </p>
                                                </div>)}
                                            </div>
                                        </div>

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
                                )) : null}


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
                                                    expanded={false}
                                                    hasPermission={hasPermission}
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
                                                    Aucun programme de {infoData.personalInfo?.lastName} pour la classe de <SuperWord input={activeClasse} isSpan />
                                                </h3>
                                                <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 24px", maxWidth: 360, marginInline: "auto" }}>
                                                    Créez un programme pour l'année <strong>{currentAcademicYear?.academicYear}</strong>.
                                                </p>
                                                {hasPermission && <div>
                                                    <Button type='primary' onClick={() => alert('Open adding modal')}>
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
                }
            ]}
        />
    )
}
