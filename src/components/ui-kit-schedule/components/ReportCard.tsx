import {Schedule, Report} from "@/entity";
import {ReportStatus, reportStatusColors} from "@/entity/domain/report.ts";
import Datetime from "@/core/datetime.ts";
import {Descriptions, Flex} from "antd";
import {cutStatement} from "@/core/utils/utils.ts";
import {SuperWord} from "@/core/utils/tsxUtils.tsx";
import RightSidePane from "@/components/ui/layout/RightSidePane.tsx";
import {useToggle} from "@/hooks/useToggle.ts";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {Moment} from "@/core/utils/interfaces.ts";
import {LuPenLine} from "react-icons/lu";

export const ReportCard = ({schedule, status, report, onSubmitReport, hasPermission, allDay, date, times}: {
    schedule?: Schedule
    status?: ReportStatus
    report?: Report,
    hasPermission?: boolean,
    onSubmitReport?: (schedule: Schedule, value: boolean, isRegularized?: boolean) => void
    allDay?: boolean
    times?: {min: number[], max: number[]}
    date?: Datetime
}) => {
    const [openView, setOpenView] = useToggle(false)
    const cfg = reportStatusColors[status as ReportStatus]

    return (
        <>
        <div style={{
            borderRadius:12,
            border:`1px solid ${cfg?.bd}`,
            background:"white",
            marginBottom:8,
            overflow:"hidden",
            boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
            transition:"box-shadow 0.2s, transform 0.15s",
            cursor:"default",
        }}
             onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,0.1)";e.currentTarget.style.transform="translateY(-1px)";}}
             onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.04)";e.currentTarget.style.transform="none";}}
        >
            {/* Color accent strip */}
            <div style={{ height:3, background:cfg.accentBg, opacity: status === "UPCOMING" ? 0.3 : 1 }} />

            <div style={{ padding:"10px 12px" }}>
                {/* Time + type */}
                <Flex align='center' vertical>
                    <span style={{fontSize:12, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase",}}>
                        {allDay ? `Cours du ${date?.fullDay()}` : schedule?.designation}
                    </span>
                    <span style={{fontSize:10, fontWeight:700, letterSpacing:"0.05em", padding:"2px 8px", borderRadius:99, color: "#94A3B8"}}>
                        {Datetime.timeToCurrentDate(allDay ? times?.min as [] : schedule?.startTime as [])?.time()} – {Datetime.timeToCurrentDate(allDay ? times?.max as [] : schedule?.endTime as [])?.time()}
                    </span>
                </Flex>

                {/* Course + Class */}
                <div style={{ fontSize:13.5, fontWeight:700, color:"#0F172A", marginBottom:1 }}>
                    {schedule?.course?.course}
                </div>
                <div style={{ fontSize:13, color:"#64748B", marginBottom:10 }}>
                    <SuperWord input={schedule?.classe?.name as string} isSpan />
                </div>

                {report && <div style={{ fontSize:12, padding:"12px", borderRadius:10, marginBottom:10, background:"#F8FAFC", border:"1px solid #E2E8F0" }}>
                    {cutStatement(report?.notes, 100)}
                </div>}

                {/* Status row + CTA */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", background:cfg.dot, flexShrink:0 }} />
                        <span style={{ fontSize:10, fontWeight:600, color:cfg.c }}>{cfg.label}</span>
                    </div>

                    {status === "SUBMITTED" && (
                        <button onClick={setOpenView} style={{
                            padding:"4px 10px", borderRadius:6,
                            border:"1.5px solid #86EFAC", background:"#F0FDF4",
                            fontSize:11, fontWeight:700, color:"#166534", cursor:"pointer",
                        }}>Voir ↗</button>
                    )}
                    {status === "SUBMITTED" && hasPermission && (
                        <button onClick={() => alert("Implémenter la modification des rapport")} style={{
                            padding:"4px 10px", borderRadius:6,
                            border:"1.5px solid #277fd5", background:"#163e65",
                            fontSize:11, fontWeight:700, color:"#F0FDF4", cursor:"pointer",
                        }}><LuPenLine size={14} /></button>
                    )}
                    {status === "MISSING" && hasPermission && (
                        <button onClick={() => onSubmitReport?.(schedule!, true, true)} style={{
                            padding:"4px 10px", borderRadius:6,
                            border:"none",
                            background:"linear-gradient(135deg,#EF4444,#DC2626)",
                            fontSize:11, fontWeight:700, color:"white", cursor:"pointer",
                            boxShadow:"0 2px 6px rgba(239,68,68,.35)",
                        }}>Régulariser</button>
                    )}
                    {status === "PENDING" && hasPermission && (
                        <button onClick={() => onSubmitReport?.(schedule!, true)} style={{
                            padding:"4px 10px", borderRadius:6,
                            border:"none",
                            background:"linear-gradient(135deg,#6366F1,#8B5CF6)",
                            fontSize:11, fontWeight:700, color:"white", cursor:"pointer",
                            boxShadow:"0 2px 6px rgba(99,102,241,.35)",
                        }}>Soumettre</button>
                    )}
                </div>
            </div>
        </div>
        {openView && <ReportCardView recordId={report?.id as number} open={openView} onClose={setOpenView} />}
        </>
    );
}

export const ReportCardView = ({recordId, open, onClose}: {
    recordId: number,
    open: boolean
    onClose: () => void
}) => {
    const {useViewReport} = useTeacherRepo()
    const {data} = useViewReport(recordId)

    return <RightSidePane open={open} onClose={onClose} title={
        <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                    <h4 style={{ color:"#0F172A", fontWeight: 700 }}>
                        {Datetime.of(data?.sessionDate as Moment).format("dddd, DD MMMM")}
                    </h4>
                </div>
                <span style={{
                    padding:"4px 10px", borderRadius:99,
                    background:"#F0FDF4", border:"1px solid #86EFAC",
                    fontSize:10, fontWeight:800, color:"#166534",
                }}>✓ Soumis</span>
            </div>
        </div>
    }>
        <Descriptions items={[
            {key: '1', label: 'Thème abordé', children: "", span: 3},
            {children: data?.courseProgram?.name, span: 3},
            ...(data?.courseProgramTopic ? [{key: '7', label: 'Sous-thème abordé', children: "", span: 3}, {key: '8', children: data?.courseProgramTopic?.title, span: 3}] : []),
            {key: '2', label: 'Date de la session', children: Datetime.of(data?.sessionDate as string).format("dddd, DD MMMM YYYY"), span: 3},
            {key: '3', label: 'Durée', children: data?.duration_minutes + ' min', span: 3},
            {key: '4', label: 'Soumis le', children: Datetime.of(data?.createdAt as string).fDatetime({to: true}), span: 3},
            {key: '5', label: 'Commentaire', children: "", span: 3},
            {key: '6', children: data?.notes, span: 3},
            ...(data?.isLateSubmission ? [{key: '9', children: <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ width:8, height:8, borderRadius:"50%", background:'#EF4444' }} />
                    <span style={{ fontSize:11, color:"#991B1B", fontWeight:600 }}>Soumis en rétard</span>
                </div>}] : []),
        ]} />
    </RightSidePane>
}