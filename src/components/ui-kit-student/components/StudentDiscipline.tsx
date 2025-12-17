import {useReprimandRepo} from "../../../hooks/actions/useReprimandRepo.ts";
import {AcademicYear, Classe, Enrollment, Individual, Punishment, Reprimand} from "../../../entity";
import {useEffect, useMemo, useState} from "react";
import ListViewer from "../../custom/ListViewer.tsx";
import {ReprimandFilterProps} from "../../../data/repository/reprimandRepository.ts";
import {TableColumnsType, Tag as AntTag} from "antd";
import {ReprimandFilters} from "../../filters/ReprimandFilters.tsx";
import {useAcademicYearRepo} from "../../../hooks/actions/useAcademicYearRepo.ts";
import {LuCircleAlert} from "react-icons/lu";
import Tag from "../../ui/layout/Tag.tsx";
import Datetime from "../../../core/datetime.ts";
import {ReprimandType, typeColor} from "../../../entity/enums/reprimandType.ts";
import {PunishmentType} from "../../../entity/enums/punishmentType.ts";
import {punishmentStatusTag} from "../../../entity/enums/punishmentStatus.ts";
import {StudentReprimandDrawer} from "./StudentReprimandDrawer.tsx";
import {useToggle} from "../../../hooks/useToggle.ts";

interface StudentDisciplineProps {
    enrolledStudent: Enrollment
}

export const StudentDiscipline = ({enrolledStudent}: StudentDisciplineProps) => {
    const [filters, setFilters] = useState<ReprimandFilterProps>()
    const [selectedReprimand, setSelectedReprimand] = useState<Reprimand | null>(null)
    const {academicYearOptions} = useAcademicYearRepo()
    const [openDrawer, setOpenDrawer] = useToggle(false)
    
    const {useGetAllStudentReprimands} = useReprimandRepo()
    
    const {academicYear, student} = useMemo(() => ({
        academicYear: enrolledStudent?.academicYear,
        student: enrolledStudent?.student,
    }), [enrolledStudent])

    useEffect(() => {
        setFilters({
            academicYear: academicYear?.id
        })
    }, [academicYear?.id]);
    
    const {fetchReprimands} = useGetAllStudentReprimands(student?.id as string)

    const tableColumns: TableColumnsType<Reprimand> = [
        {
            key: '@Icons',
            render: () => <LuCircleAlert color={'red'} size={18} />
        },
        {
            title: "Année Academique",
            dataIndex: 'academicYear',
            key: '@AcademicYear',
            render: (a: AcademicYear) => a.academicYear
        },
        {
            title: "Classe",
            dataIndex: 'classe',
            key: '@Classe',
            render: (c: Classe) => <AntTag>{c.name}</AntTag>
        },
        {
            title: 'Réprimande',
            dataIndex: 'type',
            key: '@reprimandType',
            render: type => <Tag color={typeColor(ReprimandType[type])}>{ReprimandType[type]}</Tag>
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
            render: (punishment: Punishment) => <Tag color='warning'>{PunishmentType[punishment?.type]}</Tag>
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
            <ListViewer
                callback={fetchReprimands as () => never}
                callbackParams={filterParams}
                tableColumns={tableColumns}
                countTitle='Blame'
                fetchId='reprimand-list'
                cardNotAvatar={true}
                filters={
                    <ReprimandFilters
                        setFilters={handleFilters}
                        academicYear={academicYear?.id}
                        academicYearOptions={academicYearOption}
                    />
                }
                onSelectData={handleSelectReprimand}
                noSearch={true}
            />
            
            <StudentReprimandDrawer 
                reprimand={selectedReprimand as Reprimand}
                open={openDrawer} 
                close={handleCloseDrawer}
            />
        </>
    )
}