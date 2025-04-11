import {LoadMoreList} from "../ui/layout/LoadMoreList.tsx";
import {AvatarListItem} from "../ui/layout/AvatarListItem.tsx";
import {redirectTo} from "../../context/RedirectContext.ts";
import {text} from "../../core/utils/text_display.ts";
import {Tag} from "antd";
import Section from "../ui/layout/Section.tsx";
import {Teacher} from "../../entity";
import {ReactNode} from "react";

export const TeacherList = (
    {seeMore, teachers, showBtn = 'Voir', title, more = true, showCourse = false}: {
        showBtn?: ReactNode
        teachers?: Teacher[]
        seeMore?: () => void
        title?: ReactNode
        more?: boolean
        showCourse?: boolean
    }
) => {
    const descriptions = (teacher: Teacher) =>  showCourse
        ? <div>
            {teacher?.classes?.map(c => (
                <Tag key={c?.id}>{c.name}</Tag>
            ))}
        </div>
        : <div>
            {teacher?.courses?.map(c => (
                <Tag key={c?.id}>{c.course}</Tag>
            ))}
        </div>

    return (
        <Section title={title} more={more} seeMore={seeMore}>
            <LoadMoreList
                listProps={{
                    dataSource: teachers,
                    rowKey: 'id',
                    renderItem: (teacher) => (<AvatarListItem
                        item={teacher?.personalInfo}
                        showBtnText={showBtn}
                        isLoading={teachers === null}
                        onBtnClick={() => redirectTo(text.teacher.group.view.href + teacher?.id)}
                        description={descriptions(teacher)}
                    />)
                }}
                isLoading={false}
                size={10}
                allItems={teachers?.length || 0}
            />
        </Section>
    )
}