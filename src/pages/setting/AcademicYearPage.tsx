import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {Badge, Button, Card, Divider, Flex, Table, TableColumnsType, Typography} from "antd";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import {AiOutlineEdit} from "react-icons/ai";
import Grid from "../../components/ui/layout/Grid.tsx";
import {useAcademicYearRepo} from "../../hooks/useAcademicYearRepo.ts";
import {useEffect, useMemo} from "react";
import {AcademicYear} from "../../entity";
import Datetime from "../../core/datetime.ts";
import {AcademicYearEditDrawer, SaveAcademicYear} from "../../components/ui-kit-setting";
import {useToggle} from "../../hooks/useToggle.ts";

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
    const academicYears = useGetAllAcademicYear({shouldRefetch: refetch})

    const current = useMemo(() => academicYears?.find(a => a.current), [academicYears])
    const entries = useMemo(() => academicYears?.length || 0, [academicYears])

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
                text={current ? <em style={{color: '#b1b1b3'}}>Actif</em> : <em style={{color: '#b1b1b3'}}>Inactif</em>}
                size='small'
            />
        }
    ]
    
    const handleClosePane = () => {
        setOpenSavePane()
        setRefetch()
    }

    return(
        <>
            {context}
            <Divider orientation='left'><h3>Manager Années Académiques</h3></Divider>
            <Responsive gutter={[16, 16]}>
                <Grid xs={24} md={12} lg={8}>
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
                            <p><Badge color={'#52c41a'} text={<em style={{color: '#b1b1b3'}}>Actif</em>} /></p>
                        </div>
                    </Card>
                </Grid>
                <Grid xs={24} md={12} lg={16}>
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
            </Responsive>
            <SaveAcademicYear open={openSavePane} onClose={handleClosePane} />
            <AcademicYearEditDrawer open={openEdit} close={setOpenEdit} data={current as AcademicYear} />
        </>
    )
}

export default AcademicYearPage;