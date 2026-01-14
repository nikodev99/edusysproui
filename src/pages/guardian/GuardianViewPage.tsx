import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Guardian} from "@/entity";
import {setLastName, setName} from "@/core/utils/utils.ts";
import {useBreadCrumb} from "@/hooks/useBreadCrumb.tsx";
import {text} from "@/core/utils/text_display.ts";
import ViewHeader from "@/components/ui/layout/ViewHeader.tsx";
import {GuardianEditDrawer, GuardianStudentList, GuardianActionLinks} from "@/components/ui-kit-guardian";
import {Gender} from "@/entity/enums/gender.tsx";
import {getStatusKey, Status} from "@/entity/enums/status.ts";
import {Tabs, Tag} from "antd";
import {useGuardianRepo} from "@/hooks/actions/useGuardianRepo.ts";
import {useDocumentTitle} from "@/hooks/useDocumentTitle.ts";
import {ItemType} from "antd/es/menu/interface";

const GuardianViewPage: React.FC = () => {

    const { id: guardianId } = useParams();

    const [guardian, setGuardian] = useState<Guardian | null>(null);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false)
    const [color, setColor] = useState('')
    const [shouldRefresh, setShouldRefresh] = useState<boolean>(false)
    const [linkButtons, setLinkButtons] = useState<ItemType[]>([])
    const {useGetGuardianWithStudents} = useGuardianRepo()

    const {data, isLoading, isSuccess, refetch} = useGetGuardianWithStudents(guardianId)
    
    const guardianName = guardian ? setName(guardian?.personalInfo) : 'Tuteur'

    useDocumentTitle({
        title: guardianName,
        description: "Guardian description",
    })

    const {context} = useBreadCrumb({
        bCItems: [
            {
                title: text.guardian.label,
                path: text.guardian.href
            },
            {
                title: guardianName
            }
        ]
    })

    useEffect(() => {
        if (isSuccess && data) {
            setGuardian(data as Guardian);
        }
    }, [data, isSuccess])

    useEffect(() => {
        if (shouldRefresh)
            refetch()
                .then()
    }, [refetch, shouldRefresh]);

    const handleOpenDrawer = (state: boolean) => {
        setOpenDrawer(state)
    }

    const handleCloseDrawer = () => {
        setOpenDrawer(false)
        refetch().then(r => r.data)
    }

    return (
        <>
            {context}
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
                items={linkButtons}
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
            <section>
                <GuardianActionLinks
                    data={guardian}
                    getItems={setLinkButtons}
                    setRefresh={setShouldRefresh}
                />
            </section>
        </>
    )
}

export default GuardianViewPage