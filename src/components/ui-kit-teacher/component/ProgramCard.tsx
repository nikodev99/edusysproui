import {CourseProgram} from "@/entity";
import {ProgramTopic, statusConfig} from "@/entity/domain/courseProgram.ts";
import {useMemo, useState} from "react";
import {Button, Collapse, Flex, Space} from "antd";
import {ProgramStatusBadge} from "@/core/utils/tsxUtils.tsx";
import Datetime from "@/core/datetime.ts";
import {semesterHelper} from "@/core/helpers/semesterHelpers.ts";
import {LuClipboardPen} from "react-icons/lu";
import {useToggle} from "@/hooks/useToggle.ts";
import {InsertModal} from "@/components/custom/InsertSchema.tsx";

export interface ProgramCardProps {
    program: CourseProgram,
    index?: number,
    onToggle?: () => void,
    onReport?: () => void,
    onAddSub?: () => void
    hasPermission?: boolean
}

export const ProgramCard = ({program, index, hasPermission = false, onToggle, onReport, onAddSub}: ProgramCardProps) => {
    const [expanded, setExpanded] = useToggle(false)
    const cfg = statusConfig(program?.timing?.status)

    const {totalCompletedTopics, totalTopics} = useMemo(() => {
        const topics = program?.topic
        const completedTopics = topics.filter(t => t?.timing?.status === "COMPLETED");
        return {
            topics: program?.topic,
            totalCompletedTopics: completedTopics?.length,
            totalTopics: topics?.length,
        }
    }, [program?.topic])

    return(
        <div style={{
            border: '1px solid #e8edf3',
            borderRadius: 12,
            marginBottom: 10,
            overflow: 'hidden',
            boxShadow: expanded ? '0 4px 16px rgba(0, 0, 0, 0.06)' : "none",
            transition: 'box-shadow 0.2s'}}
        >
           <Collapse
               onChange={() => setExpanded()}
               items={[
                   {
                       key:`${program.id}-${index}`,
                       label: <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                           {index && <div style={{
                               width: 28, height: 28, borderRadius: 8,
                               background: cfg.bg,
                               color: cfg.color,
                               display: "flex", alignItems: "center", justifyContent: "center",
                               fontWeight: 800, fontSize: 12, flexShrink: 0,
                           }}>
                               {index}
                           </div>}
                           <div>
                               <div style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>{program?.name}</div>
                               <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
                                   {totalCompletedTopics}/{totalTopics} sous-thèmes · {Datetime.of(program?.timing?.startDate).fDate()} → {Datetime.of(program?.timing?.endDate).fDate()}
                               </div>
                           </div>
                       </div>,
                       children: <div>
                           {(program?.topic && program?.topic?.length > 0) ? program?.topic?.map(t =>
                                <SubTopicRow topic={t} cfg={cfg} onReport={() => alert('reporter')} hasPermission={hasPermission} />
                           ): (
                               <p style={{ fontSize: 12, color: "#94A3B8", margin: "8px 0" }}>Aucun sous-thème ajouté.</p>
                           )}
                           {hasPermission && <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                               <button onClick={() => () => alert("Ajouter un sous thème")} style={{
                                   padding: "6px 12px", borderRadius: 8,
                                   border: "1.5px dashed #C7D2FE",
                                   background: "#FAFBFF",
                                   fontSize: 12, color: "#6366F1",
                                   cursor: "pointer", fontWeight: 600,
                                   display: "flex", alignItems: "center", gap: 5,
                               }}>
                                   <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Ajouter un sous-thème
                               </button>
                               {program?.timing?.status !== "COMPLETED" && (
                                   <button onClick={() => () => alert('Ajouter un raport')} style={{
                                       padding: "6px 12px", borderRadius: 8,
                                       border: "1px solid #E2E8F0", background: "white",
                                       fontSize: 12, color: "#334155",
                                       cursor: "pointer", fontWeight: 600,
                                   }}>
                                       <LuClipboardPen /> Soumettre un rapport
                                   </button>
                               )}
                           </div>}
                       </div>,
                       extra: <Space>
                           <ProgramStatusBadge status={program?.timing?.status} />
                           {semesterHelper.checkLateStatus(program?.timing) && (
                               <ProgramStatusBadge status={'LATE'} />
                           )}
                       </Space>
                   }
               ]}
               expandIconPosition='end'
           />
        </div>
    )
}

function SubTopicRow({ topic, cfg, onReport, hasPermission = false }: {
    topic: ProgramTopic,
    cfg: {label: string, bg: string, color: string, dot: string},
    onReport: () => void,
    hasPermission: boolean
}) {


    return (
        <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 12px 8px 20px",
            borderLeft: "2px solid #E2E8F0",
            marginLeft: 20,
            marginBottom: 2,
            borderRadius: "0 6px 6px 0",
            background: "transparent",
            transition: "background 0.15s",
        }}
             onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
             onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: `2px solid ${cfg?.dot || "#CBD5E1"}`,
                    background: topic?.timing.status === "COMPLETED" ? cfg.dot : "white",
                    flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {topic?.timing?.status === "COMPLETED" && (
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                  )}
                </span>
                <Flex vertical>
                    <span style={{ fontSize: 13, color: "#334155" }}>{topic?.title}</span>
                    <span style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
                        {Datetime.of(topic?.timing?.startDate).fDate()} → {Datetime.of(topic?.timing?.endDate).fDate()}
                    </span>
                </Flex>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Space>
                    <ProgramStatusBadge status={topic?.timing.status} small />
                    {semesterHelper.checkLateStatus(topic?.timing) && <ProgramStatusBadge status={'LATE'} small />}
                </Space>
                {(hasPermission && topic?.timing.status !== "COMPLETED") && (
                    <Button onClick={() => onReport(topic)} size={'small'} style={{
                        padding: "3px 8px", borderRadius: 6,
                        border: "1px solid #E2E8F0", background: "white",
                        fontSize: 11, color: "#6366F1", cursor: "pointer", fontWeight: 600,
                    }} disabled={topic?.timing.status !== "IN_PROGRESS"}>
                        Rapport
                    </Button>
                )}
            </div>
        </div>
    );
}

export const InsertNewProgram = ({onAdd}: {onAdd: () => void}) => {
    const [open, setOpen] = useState<boolean>()



    return(
        <InsertModal
            open={open}
            data={}
            customForm={}
            handleForm={}
            postFunc={}
        />
    )
}
