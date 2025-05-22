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
    LuListPlus, LuTicketCheck, LuX
} from "react-icons/lu";
import {Flex, Space} from "antd";
import Tag from "../../components/ui/layout/Tag.tsx";
import {ItemType} from "antd/es/menu/interface";
import {ExamInsertScores} from "../../components/ui-kit-exam/components/ExamInsertScores.tsx";
import {TabItemType} from "../../core/utils/interfaces.ts";
import {useScoreRepo} from "../../hooks/useScoreRepo.ts";

const ExamViewPage = () => {
    const {id} = useParams()
    const [openDrawer, setOpenDrawer] = useToggle(false)
    const [assignment, setAssignment] = useState<Assignment | null>(null)
    const [color, setColor] = useState<string>()
    const [items, setItems] = useState<TabItemType[] | undefined>([])
    const [activeTab, setActiveTab] = useState<string | undefined>()
    const [refetchScore, setRefetchScore] = useState<boolean>(false)
    const {useGetAssignment} = useAssignmentRepo()
    const {useGetAssignmentScores} = useScoreRepo()

    const pageHierarchy = useBreadCrumb([
        { title: text.exam.label, path: text.exam.href },
        { title: <SuperWord input={cutStatement(assignment?.examName as string, 20) as string} /> }
    ])

    useDocumentTitle({
        title: assignment?.examName as string,
        description: "Exam description",
    })
    
    const {scores, refetch: loadScores} = useGetAssignmentScores(assignment?.id as bigint) ?? []
    const {data, isLoading, isSuccess, refetch} = useGetAssignment(id as string)

    useEffect(() => {
        if (isSuccess) {
            setAssignment(data as Assignment)
        }
        
        if (refetchScore) {
            loadScores()
            setRefetchScore(false)
        }
    }, [data, isSuccess, loadScores, refetchScore]);

    const addTab = () => {
        const newActiveKey = '2';
        const newTab: TabItemType = {
            label: <span>Notation <LuX style={{cursor: 'pointer'}} onClick={() => deleteTab(newActiveKey)} /></span>,
            key: newActiveKey,
            children: <ExamInsertScores 
                assignment={assignment as Assignment} 
                onClose={() => deleteTab(newActiveKey)} 
                marks={scores}
                load={setRefetchScore}
            />,
            closable: true
        }
        setItems(prev => {
            const existing = prev || []
            if (existing.some(tab => tab.key === newActiveKey) || assignment?.passed === true) {
                return existing
            }
            return [...(prev || []), newTab]
        });
        setActiveTab(newActiveKey)
    }

    const deleteTab = (key: string) => {
        setItems(prev => {
            const items = prev || [];
            return items.filter(item => item.key !== key);
        });
        setActiveTab(current => (current === key ? "0" : current));
        loadScores()
    }

    const itemType: ItemType[] = [
        ...(assignment?.passed ? [] : [
            {
                key: 2,
                label: 'Notation',
                icon: <LuListPlus/>,
                onClick: () => addTab()
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
        refetch()
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
                    {
                        title: "Date de l'examen",
                        mention: <Flex align='center' gap={5}>
                            <LuCalendarCheck style={{color: 'green'}} />
                            <span>{setFirstName(Datetime.of(assignment?.examDate as number[]).fullDay())}</span>
                        </Flex>
                    },
                    {
                        title: "Heure de début",
                        mention: <Flex align={"center"} gap={5}>
                            <LuClock8 style={{color: 'dimgray'}} />
                            <span>{setFirstName(Datetime.timeToCurrentDate(assignment?.startTime as number[]).time())}</span>
                        </Flex>
                    },
                    {
                        title: "Heure de fin",
                        mention: <Flex align={"center"} gap={5}>
                            <LuClock12 style={{color: 'dimgray'}} />
                            <span>{setFirstName(Datetime.timeToCurrentDate(assignment?.endTime as number[]).time())}</span>
                        </Flex>
                    },
                    {
                        title: "Status",
                        mention: <Space>
                            <Tag color={!assignment?.passed ? 'warning': 'success'}>{!assignment?.passed ? 'Programmé' : 'Traité'}</Tag>
                            {assignment?.passed ? undefined : Datetime.now().isAfter(assignment?.examDate as Date) ? <Tag color='danger'>Date Dépassée</Tag> : undefined}
                        </Space>
                    }
                ]}
                pColor={setColor}
                items={itemType}
                hasEdit={!assignment?.passed}
                showBtn={!assignment?.passed}
            />
            <ViewRoot
                items={[
                    {label: 'Info', children: <ExamInfo infoData={assignment != null ? assignment : {}} marks={scores} color={color} dataKey='exam-info' />},
                    {label: 'Notes', children: <ExamScores scores={scores} loading={isLoading} record={assignment as Assignment} /> },
                    ...items as TabItemType[]
                ]}
                exists={assignment != null}
                activeTab={activeTab}
                memorizedTabKey='exam-view-page'
            />
            <section>
                <ExamEditDrawer open={openDrawer} close={handleCloseDrawer} data={assignment as Assignment} isLoading={isLoading} />
            </section>
        </>
    )
}

export default ExamViewPage