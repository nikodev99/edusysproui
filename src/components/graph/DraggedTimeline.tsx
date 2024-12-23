import {ReactNode, useEffect, useState} from "react";
import LocalStorageManager from "../../core/LocalStorageManager.ts";
import {Timeline, TimelineItemProps, TimelineProps} from "antd";
import {arrayMove, SortableContext, useSortable} from "@dnd-kit/sortable";
import {closestCenter, DndContext, DragEndEvent, UniqueIdentifier} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";

const SortableTimelineItem = ({id, content}: {id: UniqueIdentifier, content: ReactNode}) => {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab',
        opacity: isDragging ? 1 : .5,
    }

    return(
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} onMouseDown={e => e.stopPropagation()}>
            {content}
        </div>
    )
}

export const DraggedTimeline = ({timelineProps, localStorage}:{timelineProps: TimelineProps, localStorage: string}) => {
    const [timelineItems, setTimelineItems] = useState<TimelineItemProps[]>(timelineProps.items || []);

    useEffect(() => {
        const savedOrder = LocalStorageManager.get<UniqueIdentifier[]>(localStorage);
        if (savedOrder) {
            // Sort items based on saved order, but only if items exist
            const sortedItems = savedOrder
                .map(id => timelineItems.find(item => item.key === id))
                .filter(Boolean) as TimelineItemProps[]
            if (sortedItems.length === timelineItems.length) {
                setTimelineItems(sortedItems)
            }
        }else {
            setTimelineItems(timelineProps.items as TimelineItemProps[])
        }
    }, [localStorage, timelineItems, timelineProps.items])

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (active.id !== over?.id && timelineItems) {
            const oldIndex = timelineItems.findIndex((item) => item.key === active.id);
            const newIndex = timelineItems.findIndex((item) => item.key === over?.id);
            if(oldIndex !== -1 && newIndex !== -1) {
                setTimelineItems((currentItems) => {
                    const movedArray = arrayMove([...currentItems], oldIndex, newIndex)
                    LocalStorageManager.update(localStorage, () => timelineItems.map(item => item.key));
                    return movedArray
                })
            }
        }
    }

    console.log('timeline items', timelineItems)

    return(
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={timelineItems.map(item => item.key as UniqueIdentifier)}>
                <Timeline {...timelineProps} items={timelineItems.map((item) => ({
                    ...item,
                    children: <SortableTimelineItem id={item.key as number} content={item.children} />
                }))} />
            </SortableContext>
        </DndContext>
    );
}