import {Card, Descriptions, Modal, Tag} from "antd";
import {Schedule} from "@/entity";
import { IconText } from "@/core/utils/tsxUtils";
import { DescriptionsItemType } from "antd/es/descriptions";
import {LuCalendarDays, LuClock, LuClock9} from "react-icons/lu";
import {text} from "@/core/utils/text_display.ts";
import {Color} from "@/core/utils/interfaces.ts";
import {SectionType} from "@/entity/enums/section.ts";
import {AvatarTitle} from "@/components/ui/layout/AvatarTitle.tsx";
import {useCallback} from "react";
import {frenchDay, WeekDay} from "@/entity/enums/day.ts";
import Datetime from "@/core/datetime.ts";

export const ScheduleDetailsModal = (
    {schedule, open, onCancel, showClass, showTeacher, color}: {
        schedule: Schedule, 
        open: boolean, 
        onCancel: () => void, 
        showClass?: boolean, 
        showTeacher?: boolean
        color?: Color
    }
) => {
    const assignmentDesc = useCallback((a: Schedule, show?: boolean, plus?: boolean): DescriptionsItemType[] => {
        return [
            {key: 1, label: 'Matière', children: a?.course?.course ? a?.course?.course : a?.designation, span: 3},
            {key: 2, label: text.academicYear.name, children: a?.academicYear?.academicYear, span: 3},
            ...(a && plus ? [{key: 3, label: undefined, children: <IconText color='#8f96a3' icon={<LuCalendarDays />} text={'startTime' in a ? frenchDay(a.dayOfWeek as WeekDay) : undefined} key="1" />}]: []),
            ...(a && plus ? [{key: 4, label: undefined, children: <IconText color='#8f96a3' icon={<LuClock />} text={Datetime.timeToCurrentDate(a?.startTime as []).time()} key="2" />}]: []),
            ...(a && plus ? [{key: 5, label: undefined, children: <IconText color='#8f96a3' icon={<LuClock9 />} text={Datetime.timeToCurrentDate(a?.endTime as []).time()} key="3" />}]: []),
            ...(showClass ? [{key: 6, label: 'Classe', children: <Tag color={color ?? '#bd081c'}>{a?.classe?.name}</Tag>, span: 2}] : []),
            ...(showClass ? [{key: 7, label: 'Grade', children: SectionType[a?.classe?.grade?.section as unknown as keyof typeof SectionType]}] : []),
            ...((showTeacher && show) ? [{key: 8, label: text.teacher.label, children: '', span: 3}] : []),
            ...((showTeacher && show) ? [{key: 9, children: <AvatarTitle
                    lastName={a?.teacher?.personalInfo?.lastName}
                    firstName={a?.teacher?.personalInfo?.firstName}
                    image={a?.teacher?.personalInfo?.image}
                    size={32}
                />, span: 3 }] : [])
        ]
    }, [color, showClass, showTeacher])
    
    return (
        <Modal title={schedule?.designation} open={open} footer={null} onCancel={onCancel} destroyOnHidden>
            <Card>
                <Descriptions items={assignmentDesc(
                    schedule as Schedule,
                    !!schedule?.teacher && schedule?.teacher?.personalInfo?.id !== 0,
                    true)}
                />
            </Card>
        </Modal>
    )
}