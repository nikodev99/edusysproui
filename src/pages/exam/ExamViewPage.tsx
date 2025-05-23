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
import {ExamEditDrawer, ExamInfo, ExamScores, UpdateAssignmentDates} from "../../components/ui-kit-exam";
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
import {ExamFinished} from "../../components/ui-kit-exam/components/ExamFinished.tsx";
import FormSuccess from "../../components/ui/form/FormSuccess.tsx";
import FormError from "../../components/ui/form/FormError.tsx";

const ExamViewPage = () => {
    const {id} = useParams()
    const [openDrawer, setOpenDrawer] = useToggle(false)
    const [finish, setFinish] = useToggle(false)
    const [openChangeDate, setOpenChangeDate] = useToggle(false)
    const [notify, setNotify] = useState<'completed' | 'date' | false>()
    const [assignment, setAssignment] = useState<Assignment | null>(null)
    const [color, setColor] = useState<string>()
    const [items, setItems] = useState<TabItemType[] | undefined>([])
    const [activeTab, setActiveTab] = useState<string | undefined>()
    const [refetchScore, setRefetchScore] = useState<boolean>(false)
    const [messages, setMessages] = useState<{success?: string, error?: string}>({success: '', error: ''})
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
    }, [data, isSuccess, loadScores, notify, refetchScore, setNotify]);

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
                loadMessage={setMessages}
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
        refetch()
    }

    const handleCompleteAssignment = () => {
        if (scores && scores?.length > 0) {
            setFinish()
            deleteTab("2")
        }else {
            setNotify('completed')
        }
    }

    const handleChangeDate = () => {
        if (scores && scores?.length > 0) {
            setNotify('date')
        }else {
            setOpenChangeDate()
        }
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
                onClick: () => handleCompleteAssignment(),
                disabled: notify === 'completed'
            },
            {
                key: 4,
                label: 'Changer de date',
                icon: <LuCalendarMinus2/>,
                onClick: () => handleChangeDate(),
                disabled: notify === 'date'
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

    const handleFinish = () => {
        setFinish()
        refetch()
    }

    const handleChangeDateClose = () => {
        setOpenChangeDate()
        refetch()
    }

    const getNotificationMessage = () => {
        switch (notify) {
            case 'completed':
                return "Ce devoir n'a pas été noté par conséquent vous ne pouvez pas le traiter"
            case 'date':
                return "Ce devoir est déjà noté par conséquent vous ne pouvez pas changer la date"
            default:
                return ''
        }
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
                            <span>{setFirstName(Datetime.timeToCurrentDate(assignment?.startTime as number[]).format('HH:mm'))}</span>
                        </Flex>
                    },
                    {
                        title: "Heure de fin",
                        mention: <Flex align={"center"} gap={5}>
                            <LuClock12 style={{color: 'dimgray'}} />
                            <span>{setFirstName(Datetime.timeToCurrentDate(assignment?.endTime as number[]).format('HH:mm'))}</span>
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
                {notify && <FormSuccess
                    message={getNotificationMessage() as string}
                    type='info'
                    onClose={() => setNotify(false)}
                    isNotif
                />}
                {messages?.success && <FormSuccess message={messages?.success} />}
                {messages?.error && <FormError message={messages?.error} />}
                <ExamEditDrawer open={openDrawer} close={handleCloseDrawer} data={assignment as Assignment} isLoading={isLoading} />
                <ExamFinished assignmentId={assignment?.id as number} open={finish} close={handleFinish} />
                <UpdateAssignmentDates assignment={assignment} open={openChangeDate} onCancel={handleChangeDateClose} />
            </section>
        </>
    )
}

export default ExamViewPage