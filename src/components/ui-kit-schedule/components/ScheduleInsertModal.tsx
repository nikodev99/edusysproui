import {useCallback, useEffect, useMemo, useState} from 'react'
import {Classe, Schedule} from "@/entity";
import {InsertModal} from "@/components/custom/InsertSchema.tsx";
import {ScheduleSchema, scheduleSchema} from "@/schema";
import {ScheduleForm} from "@/components/forms/ScheduleForm.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Day, frenchDay} from "@/entity/enums/day.ts";
import {saveSchedule, updateSchedule} from "@/data/repository/scheduleRepository.tsx";
import Datetime from "@/core/datetime.ts";
import {Descriptions, Divider, Select, Typography} from "antd";
import {datehelper} from "@/core/helpers/DateHelpers.ts";
import {IconText} from "@/core/utils/tsxUtils.tsx";
import {LuCalendarDays, LuClock, LuClock9} from "react-icons/lu";

interface ScheduleFromModalProps {
    data?: Schedule
    open: boolean
    slot: { start: Date; end: Date; } | null
    classe?: Classe
    onCancel: () => void
    academicYear: string
    isRecurring?: boolean
    classic?: boolean
}

export function ScheduleInsertModal({ slot, classe, onCancel, open, data, academicYear, isRecurring, classic = false }: ScheduleFromModalProps) {
    const [startTime, setStartTime] = useState<string | undefined>(undefined)
    const [endTime, setEndTime] = useState<string | undefined>(undefined)
    const [day, setDay] = useState<Day | number | undefined>(undefined)
    const isEditing = Boolean(data && data?.id)
    const form = useForm<ScheduleSchema>({
        resolver: zodResolver(scheduleSchema)
    })
    
    const {reset} = form
    
    const {start, dayOfWeek} = useMemo(() => {
        const date = Datetime.of(slot?.start as Date)
        return {
            start: date.time(),
            dayOfWeek: datehelper.dateToDay(date.toDate())
        }
    }, [slot?.start])
    const end = useMemo(() => Datetime.of(slot?.end as Date).time(), [slot?.end])

    const dayUsed = frenchDay(dayOfWeek)
    
    const message = useMemo(() => {
        const subject = data?.course?.course || data?.designation
        const classe = data?.classe?.name
        return `${isEditing ? `${subject} modifié dans la classe ${classe}`: 'Planning ajouté'} pour le ${dayUsed} avec succès`
    }, [data?.classe?.name, data?.course?.course, data?.designation, dayUsed, isEditing])
    
    useEffect(() => {
        reset({
            startTime: isEditing ? data?.startTime : startTime ? startTime : start,
            endTime: isEditing ? data?.endTime : endTime ? endTime: end,
            dayOfWeek: isEditing ? data?.dayOfWeek : isRecurring ? Day.ALL_DAYS : day ? day : dayOfWeek,
            classe: {id: classe?.id},
            academicYear: {id: academicYear}
        })
    }, [
        end, reset, dayOfWeek, startTime, endTime, day, start, classe?.id, academicYear, isRecurring, isEditing,
        data?.startTime, data?.endTime, data?.dayOfWeek
    ])
    
    const onSubmit = useCallback(async (scheduleData: ScheduleSchema) => {
        if (isEditing) {
            const registeredData = {...scheduleData, id: data?.id }
            return await updateSchedule(registeredData, false)
        }else {
            return await saveSchedule(scheduleData)
        }
    }, [data?.id, isEditing])

    return (
        <InsertModal
            data={scheduleSchema}
            customForm={
                <section>
                    <ScheduleDescriptions
                        data={{dayUsed: dayUsed as string, dayValue: dayOfWeek, start: start, end: end}}
                        setStartTime={setStartTime}
                        setEndTime={setEndTime}
                        setDayUsed={setDay}
                        isClassic={classic}
                        isRecurring={isRecurring}
                    />
                    <Divider />
                    <ScheduleForm classe={classe} control={form.control} errors={form.formState.errors} data={data} />
                </section>
            }
            handleForm={form}
            postFunc={onSubmit as never}
            open={open}
            onCancel={onCancel}
            title={"Créer un nouveau planning du temps"}
            okText={isEditing ? "Mis à jour" : "Créer"}
            messageSuccess={message}
            isNotif
            toReset={false}
        />
    )
}

const ScheduleDescriptions = (
    {data, setDayUsed, setStartTime, setEndTime, isClassic, isRecurring}: {
        data: {dayUsed: string, dayValue?: Day | number, start: string, end: string}
        setDayUsed?: (value: number) => void,
        setStartTime: (time: string | undefined) => void,
        setEndTime: (time: string | undefined) => void,
        isClassic?: boolean
        isRecurring?: boolean
    }
) => {
    const [dayValue, setDayValue] = useState<Day | number>(data?.dayValue as Day)
    const [start, setStart] = useState<string | undefined>(data?.start)
    const [end, setEnd] = useState<string | undefined>(data?.end)
    const { Text } = Typography;

    const dayOptions = Object.keys(Day)
        .filter(key => isNaN(Number(key)))
        .map(d => ({
            value: Day[d],
            label: frenchDay(d as unknown as keyof typeof Day)
        }))

    const handleChangeStartTime = (value: string) => {
        setStart(value)
        setStartTime(value)
    }

    const handleChangeEndtime = (value: string) => {
        setEnd(value)
        setEndTime(value)
    }

    console.log({dayOptions, dayValue})

    return(
        <Descriptions
            items={[
                {
                    key: 3,
                    label: undefined,
                    children: isClassic ? (
                        <IconText
                            color="#8f96a3"
                            icon={<LuCalendarDays />}
                            text={
                                <Select
                                    value={isRecurring ? Day.ALL_DAYS : dayValue}
                                    onChange={v => {
                                        setDayValue(v)
                                        setDayUsed?.(v)
                                    }}
                                    size="small"
                                    style={{ minWidth: 130 }}
                                    options={dayOptions}
                                    disabled={isRecurring}
                                />
                            }
                        />
                    ) : (
                        <IconText color="#8f96a3" icon={<LuCalendarDays />} text={data.dayUsed} />
                    ),
                },
                {
                    key: 4,
                    label: undefined,
                    children: isClassic ? (
                        <IconText
                            color="#8f96a3"
                            icon={<LuClock />}
                            text={
                                <Text editable={{ onChange: handleChangeStartTime }}>{start}</Text>
                            }
                        />
                    ) : (
                        <IconText color="#8f96a3" icon={<LuClock />} text={data?.start} />
                    ),
                },
                {
                    key: 5,
                    label: undefined,
                    children: isClassic ? (
                        <IconText
                            color="#8f96a3"
                            icon={<LuClock9 />}
                            text={<Text editable={{ onChange: handleChangeEndtime }}>{end}</Text>}
                        />
                    ) : (
                        <IconText color="#8f96a3" icon={<LuClock9 />} text={data.end} />
                    ),
                },
            ]}
        />
    )
}