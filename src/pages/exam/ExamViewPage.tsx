import {useParams} from "react-router-dom";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {useAssignmentRepo} from "../../hooks/useAssignmentRepo.ts";
import {ReactNode, useEffect, useState} from "react";
import {Assignment} from "../../entity";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {SuperWord} from "../../core/utils/tsxUtils.tsx";
import {cutStatement, setFirstName, zeroFormat} from "../../core/utils/utils.ts";
import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";
import {ExamEditDrawer, ExamInfo, ExamScores} from "../../components/ui-kit-exam";
import {useToggle} from "../../hooks/useToggle.ts";
import {ViewRoot} from "../../components/custom/ViewRoot.tsx";
import Datetime from "../../core/datetime.ts";
import {
    LuArchiveX,
    LuCalendarCheck, LuCalendarMinus2,
    LuClock12,
    LuClock8,
    LuListCheck,
    LuListPlus, LuTicketCheck
} from "react-icons/lu";
import {Flex, Space} from "antd";
import Tag from "../../components/ui/layout/Tag.tsx";
import {ItemType} from "antd/es/menu/interface";

const ExamViewPage = () => {
    const {id} = useParams()
    const [openDrawer, setOpenDrawer] = useToggle(false)
    const [assignment, setAssignment] = useState<Assignment | null>(null)
    const [color, setColor] = useState<string>()
    const {useGetAssignment} = useAssignmentRepo()

    const {data, isLoading, isSuccess} = useGetAssignment(id as string)

    const pageHierarchy = useBreadCrumb([
        { title: text.exam.label, path: text.exam.href },
        { title: <SuperWord input={cutStatement(assignment?.examName as string, 20) as string} /> }
    ])

    useDocumentTitle({
        title: assignment?.examName as string,
        description: "Exam description",
    })

    useEffect(() => {
        if (isSuccess) {
            setAssignment(data as Assignment)
        }
    }, [data, isSuccess]);

    const itemType: ItemType[] = [
        ...(assignment?.passed ? [] : [
            {
                key: 2,
                label: 'Notation',
                icon: <LuListPlus/>,
                onClick: () => alert('Page de notation pour ajouter les notes')
            },
            {
                key: 3,
                label: 'Traité',
                icon: <LuListCheck/>,
                onClick: () => alert('Marqué le devoir comme terminer')
            },
            {
                key: 4,
                label: 'Changer de date',
                icon: <LuCalendarMinus2/>,
                onClick: () => alert('Cliquer ici pour changer la date de du devoir')
            },
            {
                key: 6,
                label: 'Notifier Presence',
                icon: <LuTicketCheck/>,
                onClick: () => alert('Cliquer ici pour changer la date de du devoir')
            },
            {
                key: 5,
                label: 'Supprimer',
                danger: true,
                icon: <LuArchiveX />,
                onClick: () => alert('Cliquer ici pour supprimer')
            }
        ]),
    ]

    const handleCloseDrawer = () => {
        setOpenDrawer()
    }

    return (
        <>
            <PageHierarchy items={pageHierarchy as [{ title: string | ReactNode, path?: string }]} />
            <ViewHeader
                isLoading={isLoading}
                setEdit={() => setOpenDrawer()}
                closeState={openDrawer}
                avatarProps={{
                    //TODO adding a tooltip to show the whole name of the assignment
                    firstName: cutStatement(assignment?.examName as string, 40),
                    reference: `#${zeroFormat(assignment?.id as unknown as number)}`
                }}
                blockProps={[
                    {title: "Date de l'examen", mention: <Flex align='center' gap={5}>
                            <LuCalendarCheck style={{color: 'green'}} />
                            <span>{setFirstName(Datetime.of(assignment?.examDate as number[]).fullDay())}</span>
                    </Flex>},
                    {title: "Heure de début", mention: <Flex align={"center"} gap={5}>
                            <LuClock8 style={{color: 'dimgray'}} />
                            <span>{setFirstName(Datetime.timeToCurrentDate(assignment?.startTime as number[]).time())}</span>
                    </Flex>},
                    {title: "Heure de fin", mention: <Flex align={"center"} gap={5}>
                            <LuClock12 style={{color: 'dimgray'}} />
                            <span>{setFirstName(Datetime.timeToCurrentDate(assignment?.endTime as number[]).time())}</span>
                    </Flex>},
                    {title: "Status", mention: <Space>
                            <Tag color={!assignment?.passed ? 'warning': 'success'}>{!assignment?.passed ? 'Programmé' : 'Traité'}</Tag>
                            {assignment?.passed ? undefined : Datetime.now().isAfter(assignment?.examDate as Date) ? <Tag color='danger'>Date Dépassée</Tag> : undefined}
                    </Space>}
                ]}
                pColor={setColor}
                items={itemType}
                hasEdit={!assignment?.passed}
                showBtn={!assignment?.passed}
            />
            <ViewRoot
                items={[
                    {label: 'Info', children: <ExamInfo infoData={assignment != null ? assignment : {}} color={color} dataKey='exam-info' />},
                    {label: 'Notes', children: <ExamScores assignment={assignment as Assignment} /> }
                ]}
                exists={assignment != null}
                memorizedTabKey='exam-view-page'
            />
            <section>
                <ExamEditDrawer open={openDrawer} close={handleCloseDrawer} data={assignment as Assignment} isLoading={isLoading} />
            </section>
        </>
    )
}

export default ExamViewPage