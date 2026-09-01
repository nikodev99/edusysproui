import {AssignmentScores} from "@/components/ui/layout/AssignmentScores.tsx";
import {TableColumnsType, Tag} from "antd";
import {Assignment, Score} from "@/entity";
import {AvatarTitle} from "@/components/ui/layout/AvatarTitle.tsx";
import {text} from "@/core/utils/text_display.ts";
import PageWrapper from "@/components/view/PageWrapper.tsx";
import {InitMarkType, MarkBadge} from "@/core/utils/tsxUtils.tsx";
import {Section, SectionType} from "@/entity/enums/section.ts";

export const ExamScores = (
    {assignment, scores, loading}: {assignment?: Assignment, scores?: Score[], loading?: boolean}
) => {

    const maxScale = assignment?.classe?.grade?.gradingScaleMax ?? 20

    const customTableColumns: TableColumnsType<Score> = [
        {
            title: 'Noms & Prénoms',
            dataIndex: 'student',
            key: 'student',
            width: '20%',
            render: student => <AvatarTitle
                firstName={student?.personalInfo?.firstName}
                lastName={student?.personalInfo?.lastName}
                reference={student?.personalInfo?.reference}
                image={student?.personalInfo?.image}
                link={text.student.group.view.href + student.id}
                size={50}
            />
        },
        {
            title: 'Matière',
            key: 'subject',
            align: 'center',
            responsive: ['md'],
            width: '15%',
            render: () => assignment?.subject?.course
                ? (
                    <Tag>{assignment?.subject?.course}</Tag>
                ): (
                    <Tag>{SectionType[assignment?.classe?.grade?.section as Section]}</Tag>
                )
        },
        {
            title: 'Devoir',
            key: 'name',
            align: 'center',
            responsive: ['md'],
            width: '25%',
            render: () => <Tag>{assignment?.examName}</Tag>
        },
        {
            title: 'Notes Obtenues',
            dataIndex: 'obtainedMark',
            key: 'obtainedMark',
            align: "end",
            render: (score: number) => <MarkBadge
                score={score}
                maxScale={maxScale}
            />
        },
        {
            title: 'Coefficient',
            key: 'coefficient',
            align: 'end',
            responsive: ['md'],
            render: () => <Tag>{assignment?.coefficient}</Tag>
        },
        ...((assignment?.coefficient && assignment?.coefficient > 1) ? [{
            align: 'end' as 'start',
            title: 'Notes Pondérés',
            dataIndex: 'obtainedMark',
            key: 'mark-coefficient',
            render: (score: number) => <MarkBadge
                score={score}
                maxScale={maxScale}
                coefficient={(assignment?.coefficient) as number}
            />
        }] : []),
        {
            title: 'Appreciation',
            dataIndex: 'obtainedMark',
            key: 'appreciation',
            align: 'center',
            responsive: ['md'],
            render: (note: number) => <InitMarkType
                av={note}
                maxScale={assignment?.classe?.grade?.gradingScaleMax ?? 20}
                coefficient={assignment?.coefficient}
            />
        },
    ]

    //TODO Adding the graphs

    return(
        <PageWrapper>
            <AssignmentScores
                assignmentId={assignment ? assignment.id as number : undefined}
                marks={scores || undefined}
                loading={loading}
                tableColumns={customTableColumns}
                isTable={true}
                hasCollapse={false}
                size={10}
                height={500}
                pagination={{}}
            />
        </PageWrapper>
    )
}