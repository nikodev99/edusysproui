import {InfoPageProps, Pageable} from "@/core/utils/interfaces.ts";
import {Enrollment, Reprimand, Teacher} from "@/entity";
import Responsive from "@/components/ui/layout/Responsive.tsx";
import {Button, Flex, Select, Skeleton, Space} from "antd";
import Grid from "@/components/ui/layout/Grid.tsx";
import {SelectAcademicYear} from "@/components/common/SelectAcademicYear.tsx";
import {useEffect, useState} from "react";
import {useSearch} from "@/hooks/useSearch.ts";
import {useStudentRepo} from "@/hooks/actions/useStudentRepo.ts";
import {UserPermission} from "@/core/shared/sharedEnums.ts";
import {text} from "@/core/utils/text_display.ts";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {Notification} from "@/components/custom/Notification.tsx";
import {useReprimandRepo} from "@/hooks/actions/useReprimandRepo.ts";
import {ReprimandFilterProps} from "@/entity/domain/reprimand.ts";
import {useFetch} from "@/hooks/useFetch.ts";
import {ReprimandCard} from "@/components/common/ReprimandCard.tsx";
import VoidData from "@/components/view/VoidData.tsx";
import {filtersStatus, PunishmentStatus} from "@/entity/enums/punishmentStatus.ts";
import {Pagination} from "@/components/custom/Pagination.tsx";
import Block from "@/components/view/Block.tsx";

export const TeacherReprimand = ({infoData, hasPermission, isSelf}: InfoPageProps<Teacher>) => {
    const [academicYear, setAcademicYear] = useState<string>()
    const [studentValue, setStudentValue] = useState<string | null>(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [filters, setFilters] = useState<ReprimandFilterProps>()
    const [filter, setFilter] = useState<string>('ALL')
    const [reprimands, setReprimands] = useState<Reprimand[]>([])
    const [pageable, setPageable] = useState<Pageable>({page: 0, size: 12})
    const [dataCount, setDataCount] = useState<number>(0)
    const {toDiscipline} = useRedirect()
    const {useGetPaginated, studentOptions} = useStudentRepo(UserPermission.TEACHER)
    const {getSearchedEnrolledStudents} = useGetPaginated()
    const {useGetAllStudentReprimandByTeacher} = useReprimandRepo()
    const {fetchReprimands} = useGetAllStudentReprimandByTeacher(infoData?.personalInfo?.id as number)

    const {data, isSuccess, refetch} = useFetch(
        ['teacher-all-reprimands', filters, pageable?.size],
        fetchReprimands,
        [filters, pageable?.page, pageable?.size],
        !!infoData?.personalInfo?.id && !!academicYear
    )

    const {fetching, resource, options, handleSearch, handleChange} = useSearch<Enrollment>({
        setValue: setStudentValue as (value: unknown) => void,
        fetchFunc: getSearchedEnrolledStudents as never,
        setCustomOptions: studentOptions
    })

    useEffect(() => {
        if (isSuccess) {
            setReprimands(data?.content)
            setDataCount(data?.totalElements as number)
        }
    }, [data, isSuccess])

    useEffect(() => {
        setFilters({
            academicYear: academicYear as string,
            punishmentStatus: filter === "ALL" ? undefined : filter as PunishmentStatus,
        })
    }, [academicYear, filter]);

    if (!infoData) {
        return <Skeleton active paragraph={{rows: 10}} />
    }

    const handleToDiscipline = () => {
        if (resource) {
            toDiscipline(resource.student.id as string, resource)
        }else {
            setOpenDialog(true)
        }
    }

    return(
        <main>
            {openDialog && <Notification
                responseMessages={{error: `Veuillez sélectionner ${(text.student.label).toLowerCase()} que vous souhaitez reprimander`}}
                onClose={() => setOpenDialog(false)}
            />}
            <div style={{marginBottom: '50px'}}>
                <Responsive gutter={[16, 16]}>
                    <Grid xs={24} md={12} lg={12} xxl={12}>
                        <Flex gap={10} wrap>
                            <SelectAcademicYear
                                getAcademicYear={setAcademicYear as () => void}
                                variant={'filled'}
                            />
                            {(hasPermission && isSelf) && (<><Select
                                placeholder={`Rechercher ${(text.student.label).toLowerCase()} à réprimander`}
                                filterOption={false}
                                onSearch={handleSearch}
                                onChange={handleChange}
                                notFoundContent={fetching ? 'Recherche...' : null}
                                options={options}
                                variant={'filled'}
                                styles={{
                                    root: {width: '50%'},
                                }}
                                showSearch
                                value={studentValue}
                            />
                            <Button type='primary' onClick={handleToDiscipline}>Reprimander</Button></>)}
                        </Flex>
                    </Grid>
                </Responsive>
            </div>
            <div>
                <div style={{ marginBottom: 16 }}>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "rgba(0,0,0,0.88)" }}>
                        Élèves sanctionnés
                    </h2>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(0,0,0,0.45)" }}>
                        {reprimands.length} blâme{reprimands.length > 1 ? "s" : ""} affiché
                        {reprimands.length > 1 ? "s" : ""}
                    </p>
                </div>
                {/* FILTERED Buttons  */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                    {filtersStatus.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: "4px 12px",
                                borderRadius: 6,
                                fontSize: 13,
                                cursor: "pointer",
                                border: filter === f ? "1px solid #1677ff" : "1px solid #d9d9d9",
                                background: filter === f ? "#e6f4ff" : "#fff",
                                color: filter === f ? "#1677ff" : "rgba(0,0,0,0.65)",
                                fontWeight: filter === f ? 600 : 400,
                            }}
                        >
                            {f === "ALL" ? "Tous" : PunishmentStatus[f]}
                        </button>
                    ))}
                </div>
                {reprimands && reprimands.length > 0 ? <Block responsive={{350:1, 768:2, 1200:3, 1600:4, 2000:5}} items={reprimands?.map((r, i) => (
                    <ReprimandCard dataKey={`${i}`} reprimand={r} refetch={refetch as never} />
                ))}/> : <VoidData />}
                <Space align='end' style={{marginTop: '50px'}}>
                    <Pagination
                        size={pageable?.size}
                        dataCount={dataCount}
                        getSize={(value) => setPageable(p => ({...p, size: value}))}
                    />
                </Space>
            </div>
        </main>
    )
}