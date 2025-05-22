import {AssignmentScores} from "../../ui/layout/AssignmentScores.tsx";
import {TableColumnsType, Tag} from "antd";
import {Assignment, Score} from "../../../entity";
import {AvatarTitle} from "../../ui/layout/AvatarTitle.tsx";
import {text} from "../../../core/utils/text_display.ts";
import PageWrapper from "../../view/PageWrapper.tsx";
import {InitMarkType, MarkBadge} from "../../../core/utils/tsxUtils.tsx";

export const ExamScores = (
    {assignment, scores, loading, record}: {assignment?: Assignment, scores?: Score[], loading?: boolean, record?: Assignment}
) => {

    const customTableColumns: TableColumnsType<Score> = [
        {
            title: 'Noms & Prénoms',
            dataIndex: 'student',
            key: 'student',
            width: '20%',
            render: student => <AvatarTitle
                firstName={student?.personalInfo?.firstName}
                lastName={student?.personalInfo?.lastName}
                reference={student?.reference}
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
            render: () => <Tag>{(assignment?.subject?.course) || (record?.subject?.course)}</Tag>
        },
        {
            title: 'Devoir',
            key: 'name',
            align: 'center',
            responsive: ['md'],
            width: '25%',
            render: () => <Tag>{(assignment?.examName) || (record?.examName)}</Tag>
        },
        {
            title: 'Notes Obtenue',
            dataIndex: 'obtainedMark',
            key: 'obtainedMark',
            align: "end",
            render: (score: number) => <MarkBadge
                score={score}
            />
        },
        {
            title: 'Coefficient',
            key: 'coefficient',
            align: 'end',
            responsive: ['md'],
            render: () => <Tag>{(assignment?.coefficient) || (record?.coefficient)}</Tag>
        },
        ...((assignment?.coefficient && assignment?.coefficient > 1) || (record?.coefficient && record?.coefficient > 1) ? [{
            align: 'end' as 'start',
            title: 'Notes Pondéré',
            dataIndex: 'obtainedMark',
            key: 'mark-coefficient',
            render: (score: number) => <MarkBadge
                score={score}
                coefficient={(assignment?.coefficient || record?.coefficient) as number}
            />
        }] : []),
        {
            title: 'Appreciation',
            dataIndex: 'obtainedMark',
            key: 'appreciation',
            align: 'center',
            responsive: ['md'],
            render: (note: number) => <InitMarkType av={note} coefficient={assignment?.coefficient} />
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