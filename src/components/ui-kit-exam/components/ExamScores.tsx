import {AssignmentScores} from "../../ui/layout/AssignmentScores.tsx";
import {Badge, TableColumnsType, Tag, Typography} from "antd";
import {Assignment, Score} from "../../../entity";
import {AvatarTitle} from "../../ui/layout/AvatarTitle.tsx";
import {text} from "../../../core/utils/text_display.ts";
import PageWrapper from "../../view/PageWrapper.tsx";
import {InitMarkType} from "../../../core/utils/tsxUtils.tsx";

export const ExamScores = ({assignment}: {assignment: Assignment}) => {

    const customTableColumns: TableColumnsType<Score> = [
        {
            title: 'Noms & Prénoms',
            dataIndex: 'student',
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
            render: () => <Tag>{assignment?.subject?.course}</Tag>
        },
        {
            title: 'Devoir',
            key: 'name',
            align: 'center',
            responsive: ['md'],
            render: () => <Tag>{assignment?.examName}</Tag>
        },
        {
            title: 'Notes Obtenue',
            dataIndex: 'obtainedMark',
            key: 'obtainedMark',
            align: "end",
            render: (score: number) => <Typography.Title level={4}>
                {score}
                <Badge color={score >= 15 ? 'green' : score >= 10 ? 'gold' : 'red' } />
            </Typography.Title>
        },
        {
            title: 'Coefficient',
            key: 'coefficient',
            align: 'end',
            responsive: ['md'],
            render: () => <Tag>{assignment?.coefficient}</Tag>
        },
        ...(assignment?.coefficient && assignment?.coefficient > 1 ? [{
            align: 'end' as 'start',
            title: 'Notes Pondéré',
            dataIndex: 'obtainedMark',
            key: 'obtainedMark',
            render: (score: number) => <Typography.Title level={4}>
                {score * (assignment?.coefficient ?? 1)}
                <Badge color={
                    (score * (assignment?.coefficient ?? 1)) >= (15 * (assignment?.coefficient ?? 1))
                        ? 'green'
                            : (score * (assignment?.coefficient ?? 1)) >= (10 * (assignment?.coefficient ?? 1))
                            ? 'gold'
                        : 'red'
                    }
                />
            </Typography.Title>
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
                assignmentId={assignment?.id as bigint}
                tableColumns={customTableColumns}
                isTable={true}
                hasCollapse={false}
                size={10}
                height={530}
            />
        </PageWrapper>
    )
}