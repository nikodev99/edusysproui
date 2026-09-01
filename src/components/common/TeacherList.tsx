import {LoadMoreList} from "@/components/ui/layout/LoadMoreList.tsx";
import {AvatarListItem} from "@/components/ui/layout/AvatarListItem.tsx";
import {Tag} from "antd";
import {Teacher} from "@/entity";
import {ReactNode} from "react";
import {useRedirect} from "@/hooks/useRedirect.ts";

export const TeacherList = (
    {teachers, showBtn = 'Voir', showCourse = false, hasPermission}: {
        showBtn?: ReactNode
        teachers?: Teacher[]
        showCourse?: boolean
        hasPermission?: boolean
    }
) => {
    const {toViewTeacher} = useRedirect()
    const descriptions = (teacher: Teacher) =>  showCourse
        ? <div>
            {teacher?.classes?.map((c, i) => (
                <Tag key={`${c.classe?.id}-${i}`}>{c?.classe.name}</Tag>
            ))}
        </div>
        : (teacher?.courses && teacher?.courses?.length) ? <div>
            {teacher?.courses?.map((c, i) => (
                <Tag key={`${c?.course?.id}-${i}`}>{c?.course.course}</Tag>
            ))}
        </div>
        : 'Maitre de ' //+ teacher?.classes?.map(c => (c?.classe?.name))

    return (
        <LoadMoreList
            listProps={{
                dataSource: teachers,
                rowKey: 'id',
                renderItem: (teacher) => (<AvatarListItem
                    item={teacher?.personalInfo}
                    showViewBtn={hasPermission}
                    showBtnText={showBtn}
                    isLoading={teachers === null}
                    onBtnClick={hasPermission ? () => toViewTeacher(teacher?.id as string) : undefined}
                    description={descriptions(teacher)}
                />)
            }}
            isLoading={false}
            size={10}
            allItems={teachers?.length || 0}
        />
    )
}