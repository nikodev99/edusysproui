import React, {ReactNode, useEffect, useState} from "react";
import {useFetch} from "../../hooks/useFetch.ts";
import {useParams} from "react-router-dom";
import {fetchGuardianWithStudents} from "../../data";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {Guardian} from "../../entity";
import {setLastName, setName} from "../../core/utils/utils.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";
import {GuardianEditDrawer, GuardianStudentList, GuardianActionLinks} from "../../components/ui-kit-guardian";
import {Gender} from "../../entity/enums/gender.tsx";
import {getStatusKey, Status} from "../../entity/enums/status.ts";
import {Tabs, Tag} from "antd";
import {useAccount} from "../../hooks/useAccount.ts";
import {LuUserPlus} from "react-icons/lu";

type ActionsButtons = {
    createUser?: boolean
}

const GuardianViewPage: React.FC = () => {

    const { id } = useParams();

    const [guardian, setGuardian] = useState<Guardian | null>(null);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false)
    const [color, setColor] = useState('')
    const [openActions, setOpenActions] = useState<ActionsButtons>({})
    const [showAction, setShowAction] = useState<ActionsButtons>({})
    const {useAccountExists} = useAccount()

    const {data, isLoading, isSuccess, refetch} = useFetch(['guardian-id', id], fetchGuardianWithStudents, [id], !!id)
    const accountExists = useAccountExists(guardian?.personalInfo?.id as number)
    
    const guardianName = guardian ? setName(guardian?.personalInfo) : 'Tuteur'

    useDocumentTitle({
        title: guardianName,
        description: "Guardian description",
    })

    const pageHierarchy = useBreadCrumb([
        {
            title: text.guardian.label,
            path: text.guardian.href
        },
        {
            title: guardianName
        }
    ])

    useEffect(() => {
        if (isSuccess && data) {
            setGuardian(data as Guardian);
        }
        setShowAction({createUser: accountExists})
    }, [accountExists, data, isSuccess])

    const handleOpenDrawer = (state: boolean) => {
        setOpenDrawer(state)
    }

    const handleCloseDrawer = () => {
        setOpenDrawer(false)
        refetch().then(r => r.data)
    }

    return (
        <>
            <PageHierarchy items={pageHierarchy as [{title: string | ReactNode, path?: string}]} mBottom={25} />
            <ViewHeader
                isLoading={isLoading}
                setEdit={handleOpenDrawer}
                closeState={openDrawer}
                avatarProps={{
                    firstName: guardian?.personalInfo?.firstName,
                    lastName: setLastName(guardian?.personalInfo?.lastName, guardian?.personalInfo?.maidenName, true),
                    reference: guardian?.personalInfo?.emailId
                }}
                blockProps={[
                    {
                        title: 'Etat Civil',
                        mention: <Tag color={color}>{
                            getStatusKey(guardian?.personalInfo?.status as Status, guardian?.personalInfo?.gender === Gender.FEMME)
                        }</Tag>
                    },
                    {title: 'Télephone', mention: guardian?.personalInfo?.telephone},
                    ...(guardian?.company || guardian?.jobTitle ? [{
                        title: guardian?.jobTitle ? guardian.jobTitle : '',
                        mention: guardian?.company ? guardian?.company : ''
                    }] : [])
                ]}
                items={[
                ...(accountExists ? [] : [{
                        key: 2,
                        label: 'Compte Tuteur',
                        icon: <LuUserPlus />,
                        onClick: () => setOpenActions({createUser: true})
                    }])
                ]}
                pColor={setColor}
            />
            <section>
                <Tabs
                    rootClassName='tabs'
                    centered
                    items={[
                        {
                            key: '1',
                            label: 'List des étudiants',
                            children: <GuardianStudentList
                                students={guardian?.students}
                            />
                        }
                    ]}
                />
            </section>
            <section>
                <GuardianEditDrawer
                    close={handleCloseDrawer}
                    data={guardian ? guardian : {} as Guardian}
                    isLoading={isLoading}
                    open={openDrawer}
                />
            </section>
            <GuardianActionLinks
                open={openActions}
                setActions={setOpenActions}
                show={showAction}
                personalInfo={guardian?.personalInfo}
            />
        </>
    )
}

export default GuardianViewPage