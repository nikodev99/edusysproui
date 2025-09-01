import {useLocation} from "react-router-dom";
import {useGradeRepo} from "../../hooks/useGradeRepo.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import Grid from "../../components/ui/layout/Grid.tsx";
import {PlanningSaveModal, PlanningUpdateModal, PlanningRemoveModal} from "../../components/ui-kit-org";
import {Button, Divider, Space, Table, TableColumnsType, Typography} from "antd";
import {useCallback, useMemo, useState} from "react";
import Datetime from "../../core/datetime.ts";
import {GradeForm} from "../../components/forms/GradeForm.tsx";
import {useForm} from "react-hook-form";
import {gradeSchema, GradeSchema} from "../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Grade, Planning, Semester} from "../../entity";
import {PatchUpdate} from "../../core/PatchUpdate.ts";
import FormSuccess from "../../components/ui/form/FormSuccess.tsx";
import FormError from "../../components/ui/form/FormError.tsx";
import {hasField} from "../../core/utils/utils.ts";
import PageWrapper from "../../components/view/PageWrapper.tsx";
import {useToggle} from "../../hooks/useToggle.ts";
import {LuPen, LuTrash} from "react-icons/lu";

const GradeEditPage = () => {
    const location = useLocation()

    const {state: gradeId} = location

    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const [shouldRefetch, setShouldRefetch] = useState<boolean>(false)
    const [selectedPlanning, setSelectedPlanning] = useState<Planning | undefined>(undefined)
    const [isOpen, setIsOpen] = useToggle(false)
    const [isOpenUpdate, setIsOpenUpdate] = useToggle(false)
    const [isOpenRemove, setIsOpenRemove] = useToggle(false)

    const {useGetGrade} = useGradeRepo()
    const grade = useGetGrade(gradeId, {shouldRefetch: shouldRefetch})

    const {context} = useBreadCrumb({
        bCItems: [
            {title: text.org.group.school.label, path: text.org.group.school.href},
            {title: text.org.group.grade.label, path: text.org.group.grade.href},
            {title: text.org.group.grade.edit.label},
        ],
        mBottom: 20
    })

    const gradeFrom = useForm<GradeSchema>({
        resolver: zodResolver(gradeSchema)
    })
    
    const academicYear = useMemo(() => {
        if (grade?.planning && grade?.planning?.length > 0) {
            const semester = grade?.planning[0]?.semester
            if (semester) {
                return semester?.academicYear
            }
        }
    }, [grade?.planning])
    
    const plannings = useMemo(() =>
        grade?.planning?.slice()?.sort((a, b) =>
            Datetime.of(b.termStartDate as number[]).diffSecond(a.termEndDate as number[])),
        [grade?.planning]
    )
    
    const selectPlanning = useCallback((planningId: number) => {
        const planning = plannings?.find(p => p.id === planningId)
        setSelectedPlanning(planning)
    }, [plannings])

    const tableColumns: TableColumnsType<Planning> = useMemo(() => [
        {
            title: '#',
            key: 'number',
            width: 7,
            render: (_, __, index) => `#${index + 1}`,
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
        },
        {
            title: 'Début',
            dataIndex: 'termStartDate',
            key: 'debut',
            render: date => Datetime.of(date).format({format: 'DD/MM/YYYY'})
        },
        {
            title: 'Fin',
            dataIndex: 'termEndDate',
            key: 'fin',
            render: date => Datetime.of(date).format({format: 'DD/MM/YYYY'})
        },
        {
            title: 'Semestre',
            dataIndex: 'semester',
            key: 'semester',
            responsive: ['md'],
            render: (semester: Semester) => semester?.template?.semesterName
        },
        {
            title: 'Actions',
            dataIndex: 'id',
            key: 'action',
            align: 'right',
            render: (planningId: number) => <Space>
                <Button type='text' icon={<LuPen />} onClick={() => {
                    selectPlanning(planningId)
                    setIsOpenUpdate()
                }} />
                <Button type='text' icon={<LuTrash style={{color: 'red'}} />} onClick={() => {
                    selectPlanning(planningId)
                    setIsOpenRemove()
                }} />
            </Space>
        }
    ], [selectPlanning, setIsOpenRemove, setIsOpenUpdate])

    const handleCloseModal = () => {
        setShouldRefetch(true)
        setIsOpen()
    }

    const handleCloseUpdateModal = () => {
        setShouldRefetch(true)
        setIsOpenUpdate()
    }

    const handleCloseRemoveModal = () => {
        setShouldRefetch(true)
        setIsOpenRemove()
    }

    const handleGradeUpdate = async (field: keyof Grade) => {
        if (grade.id) {
            if (hasField(grade, field)) {
                await PatchUpdate.set(
                    field,
                    gradeFrom.watch(),
                    grade.id,
                    setSuccessMessage,
                    setErrorMessage
                )
            }
        }
    }

    return(
        <>
            {context}
            <Responsive gutter={[16, 16]}>
                <Grid xs={24} md={12} lg={8}>
                    <PageWrapper>
                        {successMessage && (<FormSuccess message={successMessage} />)}
                        {errorMessage && (<FormError message={errorMessage} />)}
                        <GradeForm
                            edit
                            control={gradeFrom.control}
                            errors={gradeFrom.formState.errors}
                            handleUpdate={handleGradeUpdate}
                            data={grade}
                        />
                    </PageWrapper>
                </Grid>
                <Grid xs={24} md={12} lg={16}>
                    <PageWrapper>
                        <Typography.Title level={3}>Les plannings</Typography.Title>
                        <Divider orientation='right'>
                            <Button type='primary' onClick={setIsOpen}>Ajouter un planning</Button>
                        </Divider>
                        <Table
                            dataSource={plannings}
                            columns={tableColumns}
                            pagination={false}
                            size='small'
                            rowKey="id"
                        />
                    </PageWrapper>
                </Grid>
            </Responsive>
            <PlanningSaveModal
                isOpen={isOpen}
                onClose={handleCloseModal}
                academicYearId={academicYear?.id as string}
                gradeId={gradeId}
            />
            <PlanningUpdateModal 
                isOpen={isOpenUpdate} 
                onClose={handleCloseUpdateModal} 
                academicYearId={academicYear?.id as string} 
                data={selectedPlanning}
            />
            <PlanningRemoveModal 
                planningId={selectedPlanning?.id || 0} 
                open={isOpenRemove}
                close={handleCloseRemoveModal}
            />
        </>
    )
}

export default GradeEditPage;