import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {Alert, Badge, Button, Card, Divider, Flex, Table, TableColumnsType, Typography} from "antd";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import {AiOutlineEdit} from "react-icons/ai";
import Grid from "../../components/ui/layout/Grid.tsx";
import {useAcademicYearRepo} from "../../hooks/useAcademicYearRepo.ts";
import {useEffect, useMemo} from "react";
import {AcademicYear, Semester} from "../../entity";
import Datetime from "../../core/datetime.ts";
import {AcademicYearEditDrawer, SaveAcademicYear} from "../../components/ui-kit-setting";
import {useToggle} from "../../hooks/useToggle.ts";
import {useSemesterRepo} from "../../hooks/useSemesterRepo.ts";

const AcademicYearPage = () => {
    useDocumentTitle({
        title: "Setting - Année Académique",
        description: "Setting description",
    })

    const {context} = useBreadCrumb({
        bCItems: [
            {title: 'Setting'},
            {title: text.settings.group.academicYear.label}
        ]
    })

    const [openSavePane, setOpenSavePane] = useToggle(false)
    const [refetch, setRefetch] = useToggle(false)
    const [openEdit, setOpenEdit] = useToggle(false)
    const {useGetAllAcademicYear} = useAcademicYearRepo()
    const {useGetAllSemesters} = useSemesterRepo()
    const academicYears = useGetAllAcademicYear({shouldRefetch: refetch})
    const semesters = useGetAllSemesters()

    const currentSemester = useMemo(() => semesters?.find(s => Datetime.now().isBetween(s.startDate, s.endDate)), [semesters])
    const current = useMemo(() => academicYears?.find(a => a.current), [academicYears])
    const entries = useMemo(() => academicYears?.length || 0, [academicYears])
    const currentSemesters = useMemo(() => semesters?.filter(s => s.academicYear.current), [semesters])

    const {Text} = Typography

    useEffect(() => {
        if (refetch) 
            setRefetch()
    }, [refetch, setRefetch]);

    const columns: TableColumnsType<AcademicYear> = [
        {
            title: 'Année Académique',
            dataIndex: 'academicYear',
            key: 'academicYear',
        },
        {
            title: 'Début',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date) => Datetime.of(date).format("DD-MM-YYYY")
        },
        {
            title: 'Fin',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date) => Datetime.of(date).format("DD-MM-YYYY")
        },
        {
            title: 'status',
            dataIndex: 'current',
            key: 'current',
            render: (current: boolean) => <Badge
                color={current ? '#52c41a' : '#f5222d'}
                text={current ? <em style={{color: '#677a67'}}>Actif</em> : <em style={{color: '#877171'}}>Inactif</em>}
                size='small'
            />
        }
    ]

    const mergeCells = useMemo(() => {
        const newMergedCells: Record<number, number> = {};
        if (!semesters || semesters.length === 0) {
            return newMergedCells;
        }

        let currentSemesterName = semesters[0].template.semesterName;
        let currentBlockStart = 0;

        for (let i = 1; i <= semesters.length; i++) {
            if (i === semesters.length || semesters[i].template.semesterName !== currentSemesterName) {
                newMergedCells[currentBlockStart] = i - currentBlockStart; // Mark the first row of the block with its span

                if (i < semesters.length) {
                    currentSemesterName = semesters[i].template.semesterName;
                    currentBlockStart = i;
                }
            }
        }
        return newMergedCells;
    }, [semesters])

    console.log({mergeCells})

    const columnsSemester: TableColumnsType<Semester> = useMemo(() => [
        {
            title: 'Semestre',
            dataIndex: ['template', 'semesterName'],
            key: 'semesterName',
            onCell: (_record, index) => {
                const rowSpan = mergeCells[index as never]
                if(rowSpan !== undefined) {
                    return {rowSpan}
                }
                return {rowSpan: 0}
            },
            render: (semestreName) => <h4>{semestreName}</h4>
        },
        {
            title: 'Année',
            key: 'academicYear',
            render: (academicYear: AcademicYear) => {
                return academicYear.current ?
                    <Text strong>{academicYear?.academicYear}</Text> :
                    <em>{academicYear.academicYear}</em>;
            },
        },
        {
            title: 'Début',
            key: 'startDate',
            render: (_text, record) => {
                return record.startDate ? Datetime.of(record.startDate).fullDay() : '';
            },
        },
        {
            title: 'Fin',
            key: 'endDate',
            render: (_text, record) => {
                return record.endDate ? Datetime.of(record.endDate).fullDay() : '';
            },
        },
        {
            title: 'Action',
            key: 'endDate',
            render: (_text, record) => {
                return record.endDate ? Datetime.of(record.endDate).fullDay() : '';
            },
        },
    ], [Text, mergeCells])
    
    const handleClosePane = () => {
        setOpenSavePane()
        setRefetch()
    }

    return(
        <>
            {context}
            {
                (!currentSemesters || currentSemesters?.length === 0) &&
                <Alert message={`Veuillez ajouter une subdivision à l'année académique actuelle: ${current?.academicYear} La subdivision en semestres 
                ou trimestres structure l’année académique pour faciliter la planification, l’évaluation des étudiants et 
                la gestion administrative.`} showIcon type='warning' />
            }
            <Divider orientation='left'><h3>Manager Années Académiques</h3></Divider>
            <Responsive gutter={[16, 16]}>
                <Grid xs={24} md={12} lg={12}>
                    <Grid xs={24} md={24} lg={24} style={{marginBottom: '15px'}}>
                        <Card bordered={false}>
                            <Card.Meta title={
                                <Flex align='center' justify={'space-between'} wrap>
                                    <h3>Année Académique Actuelle</h3>
                                    <Button icon={<AiOutlineEdit />} onClick={setOpenEdit} size='small' type='primary'>Modifier</Button>
                                </Flex>
                            } style={{marginBottom: '10px'}} />
                            <div>
                                <Text strong>{current?.academicYear}</Text>
                                <p>Du: {Datetime.of(current?.startDate as []).fDate()}</p>
                                <p>Au: {Datetime.of(current?.endDate as []).fDate()}</p>
                                <p><Badge color={'#52c41a'} text={<em style={{color: '#677a67'}}>Actif</em>} /></p>
                            </div>
                        </Card>
                    </Grid>

                    <Grid xs={24} md={24} lg={24}>
                        <Card>
                            <Card.Meta title={
                                <Flex align='center' gap={10}>
                                    <h3>{entries} Année{entries > 1 ? 's' : ''}</h3>
                                    <Button type='primary' onClick={setOpenSavePane}>Nouvelle Année</Button>
                                </Flex>
                            } style={{marginBottom: '10px'}} />
                            <Table
                                columns={columns}
                                dataSource={academicYears}
                                pagination={false}
                                rowKey='id'
                                scroll={{y: 300}}
                            />
                        </Card>
                    </Grid>
                </Grid>

                <Grid xs={24} md={12} lg={12}>
                    <Grid xs={24} md={24} lg={24} style={{marginBottom: '15px'}}>
                        <Card bordered={false}>
                            <Card.Meta title={
                                <Flex align='center' justify={'space-between'} wrap>
                                    <h3>Semestre/Trimestre Actuelle</h3>
                                    {currentSemester && <Button icon={<AiOutlineEdit />} onClick={() => alert('modify the semester')} size='small' type='primary'>Modifier</Button>}
                                </Flex>
                            } style={{marginBottom: '10px'}} />
                            {currentSemester ? <div>
                                <Text strong>{currentSemester?.template?.semesterName}</Text>
                                <p>Du: {Datetime.of(currentSemester?.startDate as []).fDate()}</p>
                                <p>Au: {Datetime.of(currentSemester?.endDate as []).fDate()}</p>
                                <p><Badge color={'#52c41a'} text={<em style={{color: '#677a67'}}>Actif</em>} /></p>
                            </div> : <Alert type='error' message={`Aucun semestre n’a été trouvé pour cette date : ${Datetime.now().fullDay()}. Vous êtes en période de vacances.`} />}
                        </Card>
                    </Grid>

                    <Grid xs={24} md={24} lg={24}>
                        <Card>
                            <Card.Meta title={
                                <Flex align='center' gap={10}>
                                    <h3>{2} Année{entries > 1 ? 's' : ''}</h3>
                                    <Button type='primary' onClick={() => alert('Ajouter un semestre')}>Ajouter un semestre</Button>
                                </Flex>
                            } style={{marginBottom: '10px'}} />
                            <Table
                                columns={columnsSemester}
                                dataSource={semesters}
                                pagination={false}
                                rowKey='semesterId'
                                scroll={{y: 300}}
                            />
                        </Card>
                    </Grid>
                </Grid>
            </Responsive>
            <SaveAcademicYear open={openSavePane} onClose={handleClosePane} />
            <AcademicYearEditDrawer open={openEdit} close={setOpenEdit} data={current as AcademicYear} />
        </>
    )
}

export default AcademicYearPage;