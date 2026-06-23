import {CourseProgram} from "@/entity";
import {
    hasDebuted, isDebut,
    isDrafted,
    isFinished, isInProgress,
    ProgramStatus, ProgramTiming,
    ProgramTopic,
    statusConfig
} from "@/entity/domain/courseProgram.ts";
import {useMemo, useState} from "react";
import {Button, Collapse, Flex, Space, Tooltip} from "antd";
import {ProgramStatusBadge} from "@/core/utils/tsxUtils.tsx";
import Datetime from "@/core/datetime.ts";
import {semesterHelper} from "@/core/helpers/semesterHelpers.ts";
import {LuCheck, LuClipboardPen, LuHourglass, LuPlay, LuTrash2} from "react-icons/lu";
import {useToggle} from "@/hooks/useToggle.ts";
import {
    InsertNewProgramTopic,
    InsertNewReport
} from "@/components/ui-kit-teacher/component/TeacherProgramManagement.tsx";
import {ConfirmationModal, Messages} from "@/components/ui/layout/ConfirmationModal.tsx";
import {useCourseProgramRepo} from "@/hooks/actions/useCourseProgramRepo.ts";

export interface ProgramCardProps {
    teacherId?: string,
    program: CourseProgram,
    academicYearId?: string,
    index?: number,
    onReport?: () => void,
    onRefetch?: () => void
    hasPermission?: boolean
}

export const ProgramCard = ({program, index, hasPermission = false, academicYearId, onRefetch, teacherId}: ProgramCardProps) => {
    const [expanded, setExpanded] = useToggle(false)
    const [addTopic, setAddTopic] = useToggle(false)
    const [openReport, setOpenReport] = useToggle(false)
    const [selectedTopic, setSelectedTopic] = useState<ProgramTopic | undefined>(undefined)

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

    const topicOptions = useMemo(() => selectedTopic 
        ? [{ label: selectedTopic?.title, value: selectedTopic?.id as number }]
        : program?.topic?.map(t => ({ label: t?.title, value: t?.id as number })) || [],
    [program?.topic, selectedTopic])

    const handleTopicReport = (topic?: ProgramTopic) => {
        setSelectedTopic(topic)
        setOpenReport()
    }

    const handleClose = () => {
        setSelectedTopic(undefined)
        setOpenReport()
    }

    return(<>
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
                                   {totalCompletedTopics}/{totalTopics} sous-thèmes · {
                                       isFinished(program?.timing?.status)
                                       ? `fini le ${Datetime.of(program?.timing?.completedAt).fDate()}`
                                       : `${Datetime.of(program?.timing?.startDate).fDate()} → ${Datetime.of(program?.timing?.endDate).fDate()}`
                                   }
                               </div>
                           </div>
                       </div>,
                       children: <div>
                           {(program?.topic && program?.topic?.length > 0) ? program?.topic?.map(t =>
                                <SubTopicRow
                                    key={t.id}
                                    topic={t}
                                    cfg={cfg}
                                    onReport={handleTopicReport}
                                    hasPermission={hasPermission}
                                    hasProgramDebuted={hasDebuted(program?.timing?.status)}
                                    onRefetch={onRefetch}
                                />
                           ): (
                               <p style={{ fontSize: 12, color: "#94A3B8", margin: "8px 0" }}>Aucun sous-thème ajouté.</p>
                           )}
                           {hasPermission && <div style={{ display: "flex", justifyContent: 'space-between', marginTop: 10 }}>
                               <div style={{ display: "flex", gap: 8 }}>
                                   <button onClick={setAddTopic} disabled={isFinished(program?.timing?.status)} style={{
                                       padding: "6px 12px", borderRadius: 8,
                                       border: "1.5px dashed #C7D2FE",
                                       background: "#FAFBFF",
                                       fontSize: 12, color: isFinished(program?.timing?.status) ? 'grey' : "#6366F1",
                                       cursor: "pointer", fontWeight: 600,
                                       display: "flex", alignItems: "center", gap: 5,
                                   }}>
                                       <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Ajouter un sous-thème
                                   </button>
                                   {!isFinished(program?.timing?.status) && (
                                       <button onClick={setOpenReport} style={{
                                           padding: "6px 12px", borderRadius: 8,
                                           border: "1px solid #E2E8F0", background: "white",
                                           fontSize: 12, color: "#334155",
                                           cursor: "pointer", fontWeight: 600,
                                       }}>
                                           <LuClipboardPen /> Soumettre un rapport
                                       </button>
                                   )}
                               </div>
                               <ActionButtonList
                                   data={program?.timing}
                                   status={program?.timing?.status}
                                   onRefetch={onRefetch}
                               />
                           </div>}
                           {hasPermission && addTopic &&
                               <InsertNewProgramTopic
                                   open={addTopic}
                                   onClose={setAddTopic}
                                   programValue={program?.id}
                                   academicYear={academicYearId}
                                   onRefetch={onRefetch as never}
                           />}
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
        {openReport && <InsertNewReport
            open={openReport}
            onClose={handleClose}
            hasTopic={selectedTopic !== undefined}
            hasProgram={!!program}
            program={program?.id}
            teacherId={teacherId}
            programTopic={selectedTopic?.id as number}
            programOptions={[{ label: program?.name, value: program?.id}]}
            programTopicOptions={topicOptions}
            showSchedule
        />}
    </>)
}

function SubTopicRow({ topic, cfg, hasPermission = false, onReport, hasProgramDebuted = false, onRefetch }: {
    topic: ProgramTopic,
    cfg: {label: string, bg: string, color: string, dot: string},
    onReport: (topic?: ProgramTopic) => void,
    onRefetch?: () => void,
    hasPermission: boolean
    hasProgramDebuted: boolean
}) {

    const handleReport = () => {
        onReport?.(topic)
    }

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
            overflowY: 'auto'
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
                        {isFinished(topic?.timing?.status)
                            ? `fini le ${Datetime.of(topic?.timing?.completedAt).fDate()}`
                            : `${Datetime.of(topic?.timing?.startDate).fDate()} → ${Datetime.of(topic?.timing?.endDate).fDate()}`
                        }
                    </span>
                </Flex>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Space>
                    <ProgramStatusBadge status={topic?.timing.status} small />
                    {semesterHelper.checkLateStatus(topic?.timing) && <ProgramStatusBadge status={'LATE'} small />}
                </Space>
                <ActionButtonList
                    data={topic?.timing}
                    status={topic?.timing?.status}
                    isSmall isTopicTitle
                    enableTopic={hasPermission && hasProgramDebuted}
                    onRefetch={onRefetch}
                />
                {(hasPermission && hasProgramDebuted && hasDebuted(topic?.timing?.status)) && (
                    <Button onClick={handleReport} size={'small'} style={{
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

type Flags = {
    shouldStart: boolean;
    enableProgress: boolean;
    shouldRemove: boolean;
    isCompleted: boolean;
};

const ActionButtonList = ({data, status, isSmall = false, isTopicTitle = false, enableTopic, onRefetch}: {
    status: keyof typeof ProgramStatus,
    isSmall?: boolean,
    isTopicTitle?: boolean,
    enableTopic?: boolean
    data: ProgramTiming
    onRefetch?: () => void
}) => {

    const [open, setOpen] = useState<Flags>({
        shouldStart: false,
        enableProgress: false,
        shouldRemove: false,
        isCompleted: false,
    })

    const [isComplete, setIsComplete] = useState<boolean>(false)
    const [msg, setMsg] = useState<Messages>({})

    const {useChangeStatus} = useCourseProgramRepo()
    const manageStatus = useChangeStatus(isComplete, setMsg)

    const enable = isTopicTitle ? enableTopic : true
    const subTitle = isTopicTitle ? 'sous-thème' : 'theme'

    const {title, btnText, message, statusValue, isDisabled} = useMemo(() => {
        if (open.shouldStart) {
            return {
                title : `Démarrer le ${subTitle}`,
                btnText: 'Démarrer',
                message: <i>Voulez-vous démarrer ce nouveau thème ?</i>,
                statusValue: 'DEBUTED' as keyof typeof ProgramStatus,
                isDisabled: isDebut(status)
            }
        }else if (open.enableProgress) {
            return {
                title: `Sélectionner comme en cours`,
                btnText: 'En cours',
                message: <i>Ce {subTitle} sera marqué comme "En cours". Vous pourrez le compléter ou le supprimer à tout moment. </i>,
                statusValue: 'IN_PROGRESS' as keyof typeof ProgramStatus,
                isDisabled: isInProgress(status)
            }
        }else if (open.isCompleted) {
            return {
                title: `Terminer le ${subTitle}`,
                btnText: 'Terminé',
                message: <i>Félicitations ! Ce {subTitle} sera marqué comme "Terminé".</i>,
                statusValue: 'CANCELLED' as keyof typeof ProgramStatus,
                isDisabled: isFinished(status)
            }
        }else if (open.shouldRemove) {
            return {
                title: `Supprimer le ${subTitle}`,
                btnText: 'Supprimer',
                message: <i>Voulez-vous vraiment supprimer ce {subTitle} ? Cette action est irréversible{isTopicTitle ? '' : ' et supprime tous les sous thèmes'}.</i>,
                statusValue: 'CANCELLED' as keyof typeof ProgramStatus,
                isDisabled: false
            }
        }
        return  {}
    }, [open.shouldStart, open.enableProgress, open.isCompleted, open.shouldRemove, subTitle, status, isTopicTitle])

    const hasAnyTrue = (): boolean => {
        return open.shouldStart || open.enableProgress || open.shouldRemove || open.isCompleted;
    };

    function changeValue(flag: keyof Flags, setAsCompeted: boolean = false) {
        setOpen(prev => ({
            ...prev,
            [flag]: true,
        }));
        setIsComplete(setAsCompeted)
    }

    function resetIfAnyTrue() {
        setMsg({})
        setOpen((prev) => {
            if (hasAnyTrue()) {
                return {
                    shouldStart: false,
                    enableProgress: false,
                    shouldRemove: false,
                    isCompleted: false,
                };
            }
            return prev;
        });
    }

    const shouldOpen = hasAnyTrue()

    const handleSubmit = () => {
        manageStatus.mutate({ timingId: data?.id as number, status: statusValue })
    }
    
    console.log({statusValue})

    return (<>
        {(enable && (isDrafted(status) || hasDebuted(status))) && <div style={{ display: "flex", gap: 8 }}>
            {isDrafted(status) && <Tooltip title={`Démarrer le ${subTitle}`}>
                <Button
                    icon={<LuPlay />}
                    type='primary'
                    size={isSmall ? 'small' : undefined}
                    onClick={() => changeValue('shouldStart')}
                />
            </Tooltip>}
            {isDebut(status) && <Tooltip title={`Sélectionner comme en cours`}>
                <Button
                icon={<LuHourglass />}
                type='primary'
                size={isSmall ? 'small' : undefined}
                onClick={() => changeValue('enableProgress')}
            />
            </Tooltip>}
            {isInProgress(status) && <Tooltip title={`Terminer le ${subTitle}`}>
                <Button
                    icon={<LuCheck />}
                    color={'green'}
                    variant='solid'
                    size={isSmall ? 'small' : undefined}
                    onClick={() => changeValue('isCompleted', true)}
                />
            </Tooltip>}
            {!isInProgress(status) && <Tooltip title={`Supprimer le ${subTitle}`}>
                <Button
                    icon={<LuTrash2 />}
                    color={'danger'}
                    variant='solid'
                    size={isSmall ? 'small' : undefined}
                    onClick={() => changeValue('shouldRemove')}
                />
            </Tooltip>}
            <ConfirmationModal
                data={data}
                open={shouldOpen}
                close={resetIfAnyTrue}
                handleFunc={handleSubmit}
                title={title}
                modalTitle={title}
                alertDesc={{
                    alert: false,
                    msg: ''
                }}
                messages={{
                    success: msg.success,
                    error: msg.error,
                }}
                btnTxt={btnText}
                customComponent={<p>{message}</p>}
                btnProps={{
                    danger: open.shouldRemove,
                    type: 'primary',
                    disabled: isDisabled
                }}
                setRefetch={onRefetch}
                isConfirm={false}
            />
        </div>}
    </>)
}
