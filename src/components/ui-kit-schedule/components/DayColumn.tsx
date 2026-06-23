import Datetime from "@/core/datetime.ts";
import {Schedule, Report, CourseProgram} from "@/entity";
import {frenchDay, Day} from "@/entity/enums/day.ts";
import {ReportCard} from "@/components/ui-kit-schedule";
import {MAIN_COLOR} from "@/core/utils/utils.ts";
import {useCallback, useMemo, useState} from "react";
import {ReportStatus} from "@/entity/domain/report.ts";
import {InsertNewReport} from "@/components/ui-kit-teacher/component/TeacherProgramManagement.tsx";
import {useCourseProgramRepo} from "@/hooks/actions/useCourseProgramRepo.ts";

export type DayColumnProps = {
    dayIndex: Day | number,
    date: Datetime,
    schedules: Schedule[],
    reports?: Report[]
    submittedIds?: Set<number>,
    onSubmit?: (id: number) => void,
    onView?: (id: number) => void,
    onRefetch?: () => Promise<void>,
    academicYear?: string,
}

function sessionStatus(scheduleId: number, date: Datetime, submittedIds?: Set<number>, reports?: Report[]): {status: ReportStatus, report?: Report} {
    if(reports && reports?.length > 0) {
        const report = reports?.find(r => r?.schedule?.id === scheduleId && date.isSameDay(r?.sessionDate))
        if (report) {
            return { status: report?.reportStatus, report }
        }else {
            if (submittedIds?.has(scheduleId)) return {status: "SUBMITTED", report: undefined};
            if (date.isToday()) return {status: "PENDING", report: undefined};
            if (date.isStrictBefore()) return {status: "MISSING", report: undefined};
        }
    }else {
        if (submittedIds?.has(scheduleId)) return {status: "SUBMITTED", report: undefined};
        if (date.isToday()) return {status: "PENDING", report: undefined};
        if (date.isStrictBefore()) return {status: "MISSING", report: undefined};
    }
    return {status: "UPCOMING", report: undefined};
}

export const DayColumn = ({date, schedules, dayIndex, submittedIds, reports, academicYear, onRefetch}: DayColumnProps) => {
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
    const [selectedProgram, setSelectedProgram] = useState<CourseProgram | null>(null)
    const [isRegularized, setIsRegularized] = useState<boolean>(false)
    const [openReport, setOpenReport] = useState<boolean>(false)
    const {useGetTeacherPrograms} = useCourseProgramRepo()
    
    const today  = date.isToday();
    const past   = date.isStrictBefore();
    const daySched = schedules?.filter(s => Day[s.dayOfWeek as unknown as keyof typeof Day] === dayIndex);
    
    const {data: allPrograms} = useGetTeacherPrograms(
        selectedSchedule?.teacher?.id as string,
        {classId: selectedSchedule?.classe?.id as number, courseId: selectedSchedule?.course?.id as number},
        academicYear, selectedSchedule !== null
    )

    const programs = useMemo(() =>
        allPrograms?.semesters?.flatMap(s => s?.programs)?.filter(cp => cp?.id && cp?.timing?.status === "IN_PROGRESS") || [],
    [allPrograms])

    const programOptions = useMemo(() => programs.map(p => ({
        label: p?.name, value: p?.id,
    })), [programs])
    
    const programTopicOptions = useMemo(() => {
        const currentTopics = selectedProgram?.topic?.filter(t => t?.timing?.status === 'IN_PROGRESS')
        return currentTopics?.map(t => ({
            label: t?.title, value: t?.id as number
        }))
    }, [selectedProgram?.topic])
    
    const handleReportSubmitParams = useCallback((schedule: Schedule, open: boolean, isRegularized?: boolean) => {
        setSelectedSchedule(schedule)
        setOpenReport(open)
        setIsRegularized(isRegularized ?? false)
    }, [])
    
    const handleProgramChange = (value: number | null) => {
        setSelectedProgram(programs.find(p => p?.id === value) || null)
    }

    const handleClose = () => {
        setOpenReport(false)
        setSelectedSchedule(null)
        setSelectedProgram(null)
        setIsRegularized(false)
    }

    function fmtDate(d: Datetime) {
        return `${String(d.DATE).padStart(2,"0")}/${String(d.MONTH).padStart(2,"0")}`;
    }

    const CardSession = useCallback(() => {
        return daySched?.length > 0 ? (
            daySched?.map(s => {
                const {status, report} = sessionStatus(s?.id, date, submittedIds, reports)
                return <ReportCard
                    key={s?.id}
                    schedule={s}
                    report={report}
                    status={status}
                    onSubmitReport={handleReportSubmitParams}
                />
            })
        ) : (
            <div style={{
                textAlign:"center", padding:"24px 8px",
                color:"#CBD5E1",
            }}>
                <div style={{ fontSize:22, marginBottom:4, opacity:0.5 }}>—</div>
                <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>
                    Repos
                </div>
            </div>
        )
    }, [date, daySched, handleReportSubmitParams, reports, submittedIds])

    console.log({submittedIds})

    return (<>
        <div style={{
            flex:1, minWidth:128,
            background: today ? "#FAFBFF" : "transparent",
            borderRadius:14,
            border: today ? `1.5px solid ${MAIN_COLOR}` : "1.5px solid transparent",
            padding:"0 5px 10px",
            transition:"border-color 0.2s",
        }}>
            {/* Day header */}
            <div style={{
                textAlign:"center", padding:"10px 4px 10px",
                borderBottom: today ? "1px solid #C7D2FE" : "1px solid #F1F5F9",
                marginBottom:10,
            }}>
                <div style={{
                    fontSize:10, fontWeight:800, letterSpacing:"0.1em",
                    color: today ? "#6366F1" : past ? "#94A3B8" : "#475569",
                    textTransform:"uppercase", marginBottom:4,
                }}>
                    {frenchDay(dayIndex, true)}
                </div>
                <div style={{
                    fontSize:22, fontWeight:900, lineHeight:1,
                    color: today ? "#4338CA" : past ? "#94A3B8" : "#1E293B",
                }}>
                    {date.DATE}
                </div>
                <div style={{ fontSize:10, color:"#94A3B8", marginTop:3 }}>
                    {fmtDate(date).split("/")[1] !== String(new Date().getMonth()+1).padStart(2,"0")
                        ? date.MONTH_SHORT_NAME+"."
                        : ""}
                </div>
                {today && (
                    <div style={{
                        marginTop:5, display:"inline-block",
                        padding:"2px 8px", borderRadius:99,
                        background: MAIN_COLOR,
                        fontSize:8.5, fontWeight:800, color:"white", letterSpacing:"0.1em",
                    }}>
                        AUJOURD'HUI
                    </div>
                )}
            </div>
            {/* Sessions */}
            <CardSession />
        </div>
        {openReport && <InsertNewReport
            open={openReport}
            onClose={handleClose}
            programOptions={programOptions}
            teacherId={selectedSchedule?.teacher?.id}
            programTopicOptions={programTopicOptions}
            schedules={selectedSchedule ? [selectedSchedule] : []}
            onRefetch={onRefetch}
            isRegularized={isRegularized}
            getProgram={handleProgramChange}
            sessionDate={date}
        />}
    </>)
}