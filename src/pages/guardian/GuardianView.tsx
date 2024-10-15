import React, {ReactNode, useEffect, useState} from "react";
import {useFetch} from "../../hooks/useFetch.ts";
import {useParams} from "react-router-dom";
import {fetchGuardianWithStudents} from "../../data";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {Guardian} from "../../entity";
import {setFirstName} from "../../utils/utils.ts";
import {setBreadcrumb} from "../../core/breadcrumb.tsx";
import {text} from "../../utils/text_display.ts";
import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";
import {GuardianEditDrawer} from "../../components/ui-kit-guardian";
import {Gender} from "../../entity/enums/gender.ts";
import {getStatusKey, Status} from "../../entity/enums/status.ts";
import {Tabs, Tag} from "antd";
import {GuardianStudentList} from "../../components/ui-kit-guardian/component/GuardianStudentList.tsx";

const GuardianView: React.FC = () => {

    const { id } = useParams();

    const [guardian, setGuardian] = useState<Guardian | null>(null);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false)

    const {data, isLoading, isSuccess, refetch} = useFetch(['guardian-id'], fetchGuardianWithStudents, [id])

    const guardianName = guardian ? setFirstName(`${guardian.lastName} ${guardian.firstName}`) : 'Tuteur'

    useDocumentTitle({
        title: guardianName,
        description: "Student description",
    })

    const pageHierarchy = setBreadcrumb([
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
            setGuardian(data);
        }
    }, [data, isSuccess])

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
                    firstName: guardian?.firstName,
                    lastName: guardian?.maidenName ? `${guardian?.lastName} née ${guardian?.maidenName}` : guardian?.lastName,
                    reference: guardian?.emailId
                }}
                blockProps={[
                    {
                        title: 'Etat Civil',
                        mention: <Tag color='cyan-inverse'>{
                            getStatusKey(guardian?.status as Status, guardian?.gender === Gender.FEMME)
                        }</Tag>
                    },
                    {title: 'Télephone', mention: guardian?.telephone},
                    {
                        title: guardian?.jobTitle ? guardian.jobTitle : '',
                        mention: guardian?.company ? guardian?.company : ''
                    }
                ]}
                items={[/*TODO Ajouter certain items concernant le tuteur*/]}
            />
            <section>
                <Tabs
                    rootClassName='tabs'
                    centered
                    items={[
                        {key: '1', label: 'List des étudiants', children: <GuardianStudentList students={guardian?.students} />},
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
        </>
    )
}

export default GuardianView