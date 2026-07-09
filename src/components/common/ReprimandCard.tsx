import {PunishmentStatus, statusTagStyle} from "@/entity/enums/punishmentStatus.ts";
import {Reprimand} from "@/entity";
import {Button, Flex, Skeleton, Space} from "antd";
import {ReprimandType, typeColor} from "@/entity/enums/reprimandType.ts";
import {chooseColor, cutStatement, setName} from "@/core/utils/utils.ts";
import {SuperWord} from "@/core/utils/tsxUtils.tsx";
import Datetime from "@/core/datetime.ts";
import {ReactNode, useEffect, useState} from "react";
import {PunishmentType} from "@/entity/enums/punishmentType.ts";
import {useUserRepo} from "@/hooks/actions/useUserRepo.ts";
import {LuEye, LuPenLine} from "react-icons/lu";
import {EditProps} from "@/core/utils/interfaces.ts";
import RightSidePane from "@/components/ui/layout/RightSidePane.tsx";
import {ReprimandForm} from "@/components/forms/ReprimandForm.tsx";
import {useToggle} from "@/hooks/useToggle.ts";
import {PunitionForm} from "@/components/forms/PunitionForm.tsx";
import {useForm} from "react-hook-form";
import {PunishmentSchema, ReprimandSchema} from "@/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {reprimandSchema} from "@/schema/models/reprimandSchema.ts";
import {punishmentSchema} from "@/schema/models/punishmentSchema.ts";
import {PatchUpdate} from "@/core/PatchUpdate.ts";
import {UpdateType} from "@/core/shared/sharedEnums.ts";
import FormSuccess from "@/components/ui/form/FormSuccess.tsx";
import FormError from "@/components/ui/form/FormError.tsx";
import {StudentReprimandDrawer} from "@/components/ui-kit-student/components/StudentReprimandDrawer.tsx";

export const ReprimandCard = ({reprimand, refetch, dataKey}: {reprimand?: Reprimand, refetch?: () => Promise<void>, dataKey?: string}) => {
    const [openEditDrawer, setOpenEditDrawer] = useToggle(false)
    const [openDetail, setOpenDetail] = useToggle(false)
    const {isSelfInd} = useUserRepo()

    if (!reprimand)
        return <Skeleton active paragraph={{ rows: 4 }} />

    const { student, reprimandDate, type, description, issuedBy, punishment } = reprimand;
    const tColor = typeColor(type);
    const sStyle = statusTagStyle(punishment?.status as unknown as keyof typeof PunishmentStatus);

    const isIssuer = isSelfInd(reprimand?.issuedBy?.id as number)

    const studentName = setName(student?.student?.personalInfo)

    const handleCloseDrawer = () => {
        refetch?.()
        setOpenEditDrawer()
    }

    return (
        <div
            key={dataKey}
            style={{
                background: "#fff",
                borderRadius: 8,
                border: "1px solid #f0f0f0",
                boxShadow:
                    "0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.10), 0 5px 12px 4px rgba(0,0,0,0.06)",
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    borderBottom: "1px solid #f0f0f0",
                }}
            >
                <Avatar name={studentName} />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "rgba(0,0,0,0.88)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {studentName}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
                        <SuperWord input={`${student?.classe?.name} · ${student?.student?.personalInfo?.reference}`} isSpan />
                    </div>
                </div>
                <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", whiteSpace: "nowrap" }}>
                    {Datetime.of(reprimandDate).fDate()}
                </div>
            </div>

            {/* Body */}
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                    <Tag color={tColor}>{ReprimandType[type]}</Tag>
                </div>
                <div style={{ fontSize: 13, color: "rgba(0,0,0,0.75)", lineHeight: 1.6 }}>
                    {cutStatement(description, 100)}
                </div>

                <div
                    style={{
                        marginTop: 4,
                        padding: "10px 12px",
                        background: "#fafafa",
                        borderRadius: 6,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.65)" }}>
                          Punition: {PunishmentType[punishment?.type] ?? '-'}
                        </span>
                        <Tag color={sStyle.text} bg={sStyle.bg} border={sStyle.border} dot={sStyle.dot}>
                            {PunishmentStatus[punishment?.status]}
                        </Tag>
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }}>{cutStatement(punishment.description, 100)}</div>
                    <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
                        {Datetime.of(punishment.startDate).fDate()} → {Datetime.of(punishment.endDate).fDate()} · exécuté par{" "}
                        {punishment.executedBy}
                    </div>
                    {punishment?.appealed && (
                        <div
                            style={{
                                fontSize: 12,
                                color: "#722ed1",
                                background: "#f9f0ff",
                                border: "1px solid #d3adf7",
                                borderRadius: 4,
                                padding: "4px 8px",
                            }}
                        >
                            Appel : {cutStatement(punishment?.appealedNote, 100)}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <Flex justify={'space-between'} align={'center'} style={{ padding: "0 16px" }} gap={10} wrap={'wrap'}>
                <div
                    style={{
                        padding: "10px 16px",
                        borderTop: "1px solid #f0f0f0",
                        fontSize: 12,
                        color: "rgba(0,0,0,0.45)",
                    }}
                >
                    Signalé par <span style={{ color: "rgba(0,0,0,0.65)" }}>{setName(issuedBy)}</span> ·{" "}
                </div>
                <Space>
                    <Button size={'small'} type={'primary'} icon={<LuEye />} onClick={setOpenDetail} />
                    {isIssuer && (
                        <Button size={'small'} type={'primary'} icon={<LuPenLine />} onClick={setOpenEditDrawer} />
                    )}
                </Space>
            </Flex>
            {openDetail && (
                <StudentReprimandDrawer reprimand={reprimand} open={openDetail} close={setOpenDetail} />
            )}
            {openEditDrawer && isIssuer && (
                <ReprimandEditDrawer
                    data={reprimand}
                    open={openEditDrawer}
                    close={handleCloseDrawer}
                    isLoading={!reprimand}
                />
            )}
        </div>
    );
}

const ReprimandEditDrawer = ({data, open, close, isLoading}: EditProps<Reprimand>) => {
    const [openPunishmentDrawer, setOpenPunishmentDrawer] = useToggle(false)
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const { control, formState: {errors}, watch } = useForm<ReprimandSchema>({
        resolver: zodResolver(reprimandSchema)
    })
    const reprimandData = watch()

    const punishmentForm = useForm<PunishmentSchema>({
        resolver: zodResolver(punishmentSchema)
    })
    const punishmentData = punishmentForm.watch()

    useEffect(() => {
        if(successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(undefined)
                setSuccessMessage(undefined)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [errorMessage, successMessage]);

    const closeReprimandDrawer = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        close()
    }

    const closePunishmentDrawer = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        setOpenPunishmentDrawer()
    }

    const handleEditReprimand = async (field: keyof ReprimandSchema) => {
        if (data?.id) {
            await PatchUpdate.set(
                field,
                reprimandData,
                data?.id,
                setSuccessMessage,
                setErrorMessage,
                UpdateType.REPRIMAND
            )
        }
    }

    const handleEditPunishment = async (field: keyof PunishmentSchema) => {
        if (data?.punishment?.id) {
            await PatchUpdate.set(
                field,
                punishmentData,
                data?.punishment?.id,
                setSuccessMessage,
                setErrorMessage,
                UpdateType.PUNISHMENT
            )
        }
    }

    return (
        <RightSidePane loading={isLoading || !data} open={open} onClose={closeReprimandDrawer}>
            {successMessage && (<FormSuccess message={successMessage} isNotif />)}
            {errorMessage && (<FormError message={errorMessage} isNotif />)}
            <ReprimandForm
                data={data}
                control={control}
                errors={errors}
                reprimandee={data?.student}
                edit={true}
                handleUpdate={handleEditReprimand}
            />
            <Button type='link' onClick={setOpenPunishmentDrawer}>Modifier la punition </Button>
            <RightSidePane loading={!data?.punishment} open={openPunishmentDrawer} onClose={closePunishmentDrawer}>
                <PunitionForm
                    control={punishmentForm?.control}
                    errors={punishmentForm?.formState?.errors}
                    data={data?.punishment}
                    edit={true}
                    handleUpdate={handleEditPunishment}
                />
            </RightSidePane>
        </RightSidePane>
    )
}

const Tag = ({ color, bg, border, children, dot }: {color?: string, bg?: string, border?: string, children: ReactNode, dot?: string}) => (
    <span
        style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "0 7px",
            fontSize: 12,
            lineHeight: "20px",
            borderRadius: 4,
            border: `1px solid ${border || color}`,
            background: bg || `${color}1A`,
            color: color,
            fontWeight: 500,
            whiteSpace: "nowrap",
        }}
    >
    {dot && (
        <span
            style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: dot,
                flexShrink: 0,
            }}
        />
    )}
        {children}
  </span>
);

const Avatar = ({ name }: {name: string}) => {
    const initialsOf = name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return <div
        style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: chooseColor(name),
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: 14,
            flexShrink: 0,
        }}
    >
        {initialsOf}
    </div>
}