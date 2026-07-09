import {InfoPageProps} from "@/core/utils/interfaces.ts";
import {Teacher} from "@/entity";
import PageWrapper from "@/components/view/PageWrapper.tsx";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {DayColumn} from "@/components/ui-kit-schedule";
import {useEffect, useMemo, useState} from "react";
import {datehelper} from "@/core/helpers/DateHelpers.ts";
import Datetime from "@/core/datetime.ts";
import Responsive from "@/components/ui/layout/Responsive.tsx";
import Grid from "@/components/ui/layout/Grid.tsx";
import {Day, WeekDay, WeekDays} from "@/entity/enums/day.ts";
import {Alert} from "antd";
import {LuServerCrash, LuTriangleAlert} from "react-icons/lu";
import {reportStatusColors} from "@/entity/domain/report.ts";

export const TeacherReports = ({infoData, resourceYear, hasPermission, isSelf}: InfoPageProps<Teacher>) => {
    const [weekOffset,   setWeekOffset]   = useState<number>(0);
    const [isAllDay, setIsAllDay] = useState(false)
    const {useGetTeacherSchedules, useGetAllWeekReport} = useTeacherRepo()

    const dayRef = useMemo(
        () =>
            resourceYear?.startDate && resourceYear?.endDate
                ? datehelper.getDateReference(
                    resourceYear?.startDate as string,
                    resourceYear?.endDate as string
                )
                : Datetime.now(),
        [resourceYear?.startDate, resourceYear?.endDate]
    );

    const weekDates = useMemo(() => Datetime.getWeekDates(weekOffset, dayRef.toDate()), [dayRef, weekOffset])

    const {data: fetchedSchedules} = useGetTeacherSchedules(infoData?.id as string, resourceYear?.id as string)

    const schedules = useMemo(() => {
        if (!fetchedSchedules) return []
        const result = fetchedSchedules.map(s => ({...s}))

        const allDays = result.filter(s => Day[s.dayOfWeek as unknown as keyof typeof Day] === Day.ALL_DAYS)
        setIsAllDay(allDays.length > 0)

        allDays.forEach((item, i) => {
            const day = Day[WeekDays[i % WeekDays.length]] as unknown as keyof typeof Day;
            item.dayOfWeek = day as WeekDay
        })

        return result
    }, [fetchedSchedules])

    const {data: reports, refetch} = useGetAllWeekReport(
        infoData?.id as string,
        weekDates[0].format("YYYY-MM-DD"),
        weekDates[weekDates?.length - 1].format("YYYY-MM-DD")
    )

    const submittedIds = useMemo(() => new Set(reports?.map(r => r.schedule.id) || []), [reports])
    const missingCount = useMemo(() => schedules?.filter(s => {
        const d = weekDates[Day[s?.dayOfWeek as unknown as keyof typeof Day]]
        return d?.isStrictBefore() && !submittedIds?.has(s?.id)
    }).length, [schedules, submittedIds, weekDates])

    const isCurrentWeek = weekOffset === 0;
    const weekLabel = datehelper.formatWeekRange(weekDates)

    useEffect(() => {
        setWeekOffset(dayRef.DAY);
    }, [dayRef.DAY]);

    return(
        <PageWrapper background={'transparent'}>
            {/* ── WEEK NAVIGATOR ── */}
            <div style={{
                background:"white", borderBottom:"1px solid #E8EDF3",
                padding:"12px 28px",
                display:"flex", alignItems:"center", justifyContent:"space-between",
            }}>
                <button onClick={() => setWeekOffset(o => o - 1)} style={{
                    display:"flex", alignItems:"center", gap:6,
                    padding:"7px 14px", borderRadius:10,
                    border:"1.5px solid #E2E8F0", background:"white",
                    fontSize:12, fontWeight:700, color:"#475569", cursor:"pointer",
                    transition:"all 0.15s",
                }}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor="#6366F1";e.currentTarget.style.color="#6366F1";}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="#E2E8F0";e.currentTarget.style.color="#475569";}}
                >
                    ← Semaine précédente
                </button>

                <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#0F172A" }}>{weekLabel}</div>
                    {isCurrentWeek && (
                        <div style={{ fontSize:11, color:"#6366F1", fontWeight:600, marginTop:1 }}>Semaine en cours</div>
                    )}
                </div>

                <button onClick={() => setWeekOffset(o => o + 1)}
                        disabled={isCurrentWeek}
                        style={{
                            display:"flex", alignItems:"center", gap:6,
                            padding:"7px 14px", borderRadius:10,
                            border:"1.5px solid #E2E8F0", background:"white",
                            fontSize:12, fontWeight:700,
                            color: isCurrentWeek ? "#CBD5E1" : "#475569",
                            cursor: isCurrentWeek ? "not-allowed" : "pointer",
                            transition:"all 0.15s",
                        }}
                        onMouseEnter={e=>{if(!isCurrentWeek){e.currentTarget.style.borderColor="#6366F1";e.currentTarget.style.color="#6366F1";}}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="#E2E8F0";e.currentTarget.style.color=isCurrentWeek?"#CBD5E1":"#475569";}}
                >
                    Semaine suivante →
                </button>
            </div>
            <main style={{ padding:"20px 28px 32px" }}>
                <AlertBanner missing={missingCount} hasPermission={hasPermission && isSelf} />

                {/* Week grid */}
                <Responsive gutter={[16, 16]}>
                    {weekDates?.map((date, input) => (
                        <Grid key={input} xs={24} md={8} lg={4}>
                            <DayColumn
                                key={input}
                                dayIndex={input}
                                date={date}
                                schedules={schedules as []}
                                submittedIds={submittedIds}
                                reports={reports as []}
                                academicYear={resourceYear?.id}
                                onRefetch={refetch as never}
                                hasPermission={hasPermission && isSelf}
                                allDay={isAllDay}
                            />
                        </Grid>
                    ))}
                </Responsive>
                <ReportFooter hasPermission={hasPermission} />
            </main>
        </PageWrapper>
    )
}

const ReportFooter = ({hasPermission}: {hasPermission?: boolean}) => {
    return(
        <div style={{
            display:"flex", gap:16, marginTop:20, justifyContent:"center", flexWrap:"wrap",
        }}>
            {Object.entries(reportStatusColors).map(([k, v]) => (
                <div key={k} style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ width:8, height:8, borderRadius:"50%", background:v.dot }} />
                    <span style={{ fontSize:11, color:"#94A3B8", fontWeight:600 }}>{v.label}</span>
                </div>
            ))}
            {hasPermission && (<><div style={{ fontSize:11, color:"#CBD5E1" }}>·</div>
            <div style={{ fontSize:11, color:"#94A3B8" }}>
                Les rapports sont liés à votre programme de cours et vérifiés lors du calcul de paie.
            </div></>)}
        </div>
    )
}

const AlertBanner = ({missing, hasPermission}: {missing?: number, hasPermission?: boolean}) => {
    if (missing === 0) return null;
    const severe = missing && missing > 2

    return (
        <Alert
            showIcon
            icon={severe
                ? <LuServerCrash color={"#991B1B"} style={{fontWeight: 900}} size={25} />
                : <LuTriangleAlert color={"#92400E"} style={{fontWeight: 900}} size={25} />
            }
            type={severe ? "error" : "warning"}
            message={<div style={{
                    fontSize:14, fontWeight:700,
                    color: severe ? "#991B1B" : "#92400E",
                    marginBottom: severe ? 6 : 0,
                }}>
                {missing === 1
                    ? "1 rapport manquant cette semaine"
                    : `${missing} rapports de séance manquants cette semaine`}
            </div>}
            description={hasPermission ? (<div style={{flex:1}}>
                {severe && (
                    <>
                        <div style={{fontSize:12.5, color:"#B91C1C", lineHeight:1.65}}>
                            Les séances non documentées ne peuvent pas être vérifiées par l'administration.{" "}
                            <strong>Un déficit de rapports peut impacter directement le calcul de votre salaire.</strong>
                        </div>
                        <div style={{
                            marginTop:10, display:"inline-flex", alignItems:"center", gap:6,
                            padding:"5px 12px", borderRadius:99,
                            background:"#FEE2E2", border:"1px solid #FCA5A5",
                            fontSize:11, fontWeight:700, color:"#991B1B", letterSpacing:"0.04em",
                        }}>
                            ⏱ Régularisez vos rapports dès aujourd'hui
                        </div>
                    </>
                )}
            </div>): undefined}
        />
    );
}
