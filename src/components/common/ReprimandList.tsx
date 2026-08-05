import {useEffect, useState} from "react";
import {AcademicYear, Classe, Enrollment, Individual, Punishment, Reprimand, ReprimandFilterProps} from "@/entity";
import {useAcademicYearRepo} from "@/hooks/actions/useAcademicYearRepo.ts";
import {useToggle} from "@/hooks/useToggle.ts";
import {usePermission} from "@/hooks/usePermission.ts";
import {Button, Card, Empty, TableColumnsType, Tag as AntTag, Typography} from "antd";
import {LuCircleAlert, LuPlus, LuSmile} from "react-icons/lu";
import Tag from "@/components/ui/layout/Tag.tsx";
import {ReprimandType, typeColor} from "@/entity/enums/reprimandType.ts";
import {setFirstName} from "@/core/utils/utils.ts";
import Datetime from "@/core/datetime.ts";
import {PunishmentType} from "@/entity/enums/punishmentType.ts";
import {punishmentStatusTag} from "@/entity/enums/punishmentStatus.ts";
import PageDescription from "@/components/custom/PageDescription.tsx";
import ListViewer from "@/components/custom/ListViewer.tsx";
import {ReprimandFilters} from "@/components/filters/ReprimandFilters.tsx";
import {StudentReprimandDrawer} from "@/components/ui-kit-student/components/StudentReprimandDrawer.tsx";
import {ID} from "@/core/utils/interfaces.ts";
import {AvatarTitle} from "@/components/ui/layout/AvatarTitle.tsx";

type ReprimandListType = {
    dataId?: ID
    toDiscipline?: () => void
    academicYear?: string
    callback?: () => void
    isClasse?: boolean
}

export const ReprimandList = ({toDiscipline, academicYear, callback, dataId, isClasse}: ReprimandListType) => {
    const [filters, setFilters] = useState<ReprimandFilterProps>()
    const [selectedReprimand, setSelectedReprimand] = useState<Reprimand | null>(null)
    const {academicYearOptions} = useAcademicYearRepo()
    const [openDrawer, setOpenDrawer] = useToggle(false)
    const {can} = usePermission()

    const {Title, Text} = Typography

    useEffect(() => {
        setFilters({
            academicYear: academicYear as string,
            classeId: dataId as number
        })
    }, [academicYear, dataId]);

    const tableColumns: TableColumnsType<Reprimand> = [
        {
            key: '@Icons',
            render: () => <LuCircleAlert color={'red'} size={18} />
        },
        ...(isClasse ? [{
            title: "Étudiant réprimandé",
            dataIndex: 'student',
            key: '@Student',
            render: (s: Enrollment) => <AvatarTitle personalInfo={s.student.personalInfo} size={35} />
        }] : []),
        {
            title: "Année Académique",
            dataIndex: ['student', 'academicYear'],
            key: '@AcademicYear',
            render: (a: AcademicYear) => a.academicYear
        },
        {
            title: "Classe",
            dataIndex: ['student', 'classe'],
            key: '@Classe',
            render: (c: Classe) => <AntTag>{c.name}</AntTag>
        },
        {
            title: 'Réprimande',
            dataIndex: 'type',
            key: '@reprimandType',
            render: type => <AntTag color={typeColor(ReprimandType[type])}>
                {setFirstName(ReprimandType[type])}
            </AntTag>
        },
        {
            title: 'Date',
            dataIndex: 'reprimandDate',
            key: '@date',
            render: date => Datetime.of(date).fDate()
        },
        {
            title: 'Punition',
            dataIndex: 'punishment',
            key: '@punishment',
            render: (punishment: Punishment) => <span>
                {PunishmentType[punishment?.type]}
            </span>
        },
        {
            title: 'Status',
            dataIndex: 'punishment',
            key: '@status',
            render: (punishment: Punishment) => {
                const [tagColor, tagText] = punishmentStatusTag(punishment?.status)
                return <Tag color={tagColor}>{tagText}</Tag>
            }
        },
        {
            title: 'Administré par',
            dataIndex: 'issuedBy',
            key: '@issueBy',
            render: (t: Individual) => `${t.lastName} ${t.firstName}`
        }
    ]

    const filterParams = [filters]
    const academicYearOption = academicYearOptions()

    const handleSelectReprimand = (data: Reprimand) => {
        setSelectedReprimand(data)
        setOpenDrawer()
    }

    const handleFilters = (value: ReprimandFilterProps) => {
        setFilters(value)
    }


    const handleCloseDrawer = () => {
        setOpenDrawer()
    }

    return(
        <>
            {can('reprimand') && <PageDescription title={
                <Button onClick={toDiscipline} type={'primary'} icon={<LuPlus />}>
                    Ajouter une réprimande
                </Button>
            } addMargin={{position: 'bottom', size: 20}} />}
            <ListViewer
                callback={callback as () => never}
                callbackParams={filterParams}
                tableColumns={tableColumns}
                countTitle='Blame'
                fetchId='reprimand-list'
                cardNotAvatar={true}
                filters={
                    <>
                        {/* TODO The classe filter should be only of the student history */}
                        <ReprimandFilters
                            setFilters={handleFilters}
                            academicYear={academicYear}
                            academicYearOptions={academicYearOption}
                        />
                    </>
                }
                onSelectData={handleSelectReprimand}
                noSearch={true}
                emptyPage={
                    <Card
                        styles={{
                            body: { padding: 32, textAlign: "center" }
                        }}
                    >
                        <Empty
                            image={<LuSmile style={{ fontSize: 64, color: "#52c41a" }} />}
                            description={
                                <div className="space-y-2">
                                    <Title level={4} className="!mb-0">
                                        Aucun blâme enregistré
                                    </Title>
                                    <Text type="secondary">
                                        {isClasse
                                            ? "Cet classe est exempte de blames"
                                            : "Cet étudiant n’a fait l’objet d’aucune réprimande disciplinaire."
                                        }
                                    </Text>
                                </div>
                            }
                        />
                    </Card>
                }
            />

            {selectedReprimand && <StudentReprimandDrawer
                reprimand={selectedReprimand as Reprimand}
                open={openDrawer}
                close={handleCloseDrawer}
            />}
        </>
    )
}