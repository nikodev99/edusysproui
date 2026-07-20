import Block from "@/components/view/Block.tsx";
import {Teacher} from "@/entity";
import {IndividualInfo, MarkMean, ProsInfo} from "@/components/ui-kit-teacher/component/TeacherInfo.tsx";
import {Skeleton} from "antd";

export interface TeacherResultProps {
    resource?: Teacher
}

export const TeacherResult = ({resource}: TeacherResultProps) => {
    if (!resource)
        return <Skeleton active paragraph={{ rows: 4 }} />

    return(
        <main>
            <Block responsive={{xs: 1, md: 2, lg: 3}}>
                <IndividualInfo infoData={resource} dataKey={'teacherInfo'} />
                <ProsInfo infoData={resource} dataKey={'teacherProInfo'} readonly />
                <MarkMean infoData={resource} dataKey={'teacherMarkMean'} />
            </Block>
        </main>
    )
}