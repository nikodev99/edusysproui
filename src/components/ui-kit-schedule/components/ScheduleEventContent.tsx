import {ScheduleCalendarEvent} from "@/entity";
import {Dropdown, MenuProps} from "antd";
import {LuDelete, LuPencilRuler} from "react-icons/lu";
import {setName} from "@/core/utils/utils.ts";
import {memo} from "react";

export interface EventContextProps {
    event: ScheduleCalendarEvent
    onModify: (event: ScheduleCalendarEvent) => void
    onDelete: (event: ScheduleCalendarEvent) => void
}

const ScheduleEventContent = ({ event, onDelete, onModify }: EventContextProps) => {
    const items: MenuProps['items'] = [
        { key: 'modify', label: 'Modify', icon: <LuPencilRuler /> },
        { key: 'delete', label: 'Delete', icon: <LuDelete />, danger: true },
    ]

    const handleClick: MenuProps['onClick'] = ({ key, domEvent }) => {
        domEvent.stopPropagation()
        if (key === 'modify') onModify(event)
        if (key === 'delete') onDelete(event)
    }

    return (
        <Dropdown menu={{ items, onClick: handleClick }} trigger={['contextMenu']}>
            <div className="event-content">
                <strong>{event?.schedule?.course?.course}</strong>
                {event?.schedule?.teacher && <div className="event-teacher">{setName(event?.schedule?.teacher?.personalInfo)}</div>}
            </div>
        </Dropdown>
    )
}

export const EventContent = memo(ScheduleEventContent)