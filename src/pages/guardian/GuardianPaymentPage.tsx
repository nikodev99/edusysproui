import OutletPage from "@/pages/OutletPage.tsx";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {useGuardianRepo} from "@/hooks/actions/useGuardianRepo.ts";
import {useParams} from "react-router-dom";
import {currency, setName, sumInArray} from "@/core/utils/utils.ts";
import {text} from "@/core/utils/text_display.ts";
import {Key, useMemo, useState} from "react";
import {PageTitle} from "@/components/custom/PageTitle.tsx";
import Responsive from "@/components/ui/layout/Responsive.tsx";
import Grid from "@/components/ui/layout/Grid.tsx";
import {useAcademicYearRepo} from "@/hooks/actions/useAcademicYearRepo.ts";
import {isGuardian} from "@/auth/dto/role.ts";
import {Invoice, InvoiceItem} from "@/finance/models/invoice.ts";
import {Button, Card, Divider, Space, TableColumnsType} from "antd";
import {Table} from "@/components/ui/layout/Table.tsx";
import {AvatarTitle} from "@/components/ui/layout/AvatarTitle.tsx";
import Datetime from "@/core/datetime.ts";
import {GetStatusTag, SummaryRow} from "@/core/utils/tsxUtils.tsx";
import {LuCreditCard, LuDownload, LuFileText} from "react-icons/lu";
import {InvoiceDetails} from "@/components/common/InvoiceDetails.tsx";
import {useToggle} from "@/hooks/useToggle.ts";
import {useDownload} from "@/hooks/actions/useDownload.ts";
import {ConfirmationModal} from "@/components/ui/layout/ConfirmationModal.tsx";

const GuardianPaymentPage = () => {
    const {id: guardianId} = useParams()

    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [selectedInvoices, setSelectedInvoices] = useState<Invoice[]>([]);
    const [showDetailPane, setShowDetailPane] = useToggle(false)
    const [showDownloadPane, setShowDownloadPane] = useToggle(false)

    const {toViewGuardian, toGuardian} = useRedirect()
    const {currentAcademicYear} = useAcademicYearRepo()
    const {useGetGuardian, useGetActiveInvoices} = useGuardianRepo()

    const {useDownloadInvoice} = useDownload()
    const download = useDownloadInvoice()

    const {data: guardian} = useGetGuardian(guardianId as string)
    const guardianName = useMemo(() => setName(guardian?.personalInfo), [guardian?.personalInfo])

    const {data: guardianActiveInv} = useGetActiveInvoices(guardianId as string, currentAcademicYear?.id as string, /*{enable: isGuardian()}*/)
    const invoicesCount = useMemo(() => guardianActiveInv?.length || 0, [guardianActiveInv?.length])
    const valueToPay = useMemo(() => ({
        totalTax: sumInArray(selectedInvoices, "taxAmount"),
        subTotal: (sumInArray(selectedInvoices, "subTotalAmount") - sumInArray(selectedInvoices, 'discount')),
        totalAmount: sumInArray(selectedInvoices, 'totalAmount')
    }), [selectedInvoices])

    console.log({guardianActiveInv, isGuardian: isGuardian()})

    const columns: TableColumnsType<Invoice> = [
        {
            title: 'Numéro de facture',
            dataIndex: 'invoiceNumber',
            key: 'invoiceId',
        },
        {
            title: 'Etudiant',
            key: 'studentName',
            render: (_, record) => <AvatarTitle
                personalInfo={record?.enrolledStudent?.student?.personalInfo}
                size={35}
            />
        },
        {
            title: 'Date du facture',
            dataIndex: 'invoiceDate',
            key: 'invoiceDate',
            render: date => Datetime.of(date).format("DD/MM/YYYY"),
        },
        {
            title: 'Date de paiement',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: date => Datetime.of(date).format("DD/MM/YYYY"),
        },
        {
            title: 'Montant',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: totalAmount => currency(totalAmount),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <GetStatusTag status={status} isOverdue={record?.isOverdue} />
            )
        },
        {
            title: 'Actions',
            dataIndex: 'invoiceId',
            key: 'invoiceId',
            align: 'right',
            render: (_, record) => (
                <Space>
                    <Button type='link' size='small' icon={<LuFileText />} onClick={() => handleShowDetails(record?.invoiceId)}>Details</Button>
                    <Button type='link' size='small' icon={<LuDownload />} onClick={() => handleOpnDownload(record?.invoiceId)}>Telecharger</Button>
                    <Button type='primary' size='small' icon={<LuCreditCard />}>Payer</Button>
                </Space>
            ),
            width: 200
        }
    ]

    const nestedColumns: TableColumnsType<InvoiceItem> = [
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 500
        },
        {
            title: 'Quantité',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'Prix unitaire',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            render: unitPrice => currency(unitPrice)
        },
        {
            title: 'remise',
            dataIndex: 'discountPercentage',
            key: 'discount',
            render: discount => discount ? (discount * 100).toFixed(2) + '%' : 0
        },
        {
            title: 'Montant à payé',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: amount => currency(amount)
        }
    ]

    const onSelectChange = (selectedRowKeys: Key[]) => {
        const selected = guardianActiveInv?.filter(inv => selectedRowKeys.includes(inv.invoiceId));
        setSelectedInvoices(selected ?? []);
    };

    const handleShowDetails = (invoiceId: number) => {
        const selected = guardianActiveInv?.find(i => i?.invoiceId === invoiceId)
        setSelectedInvoice(selected ?? null)
        setShowDetailPane()
    }

    const handleCloseDetails = () => {
        setSelectedInvoice(null)
        setShowDetailPane()
    }

    const handleOpnDownload = (invoiceId: number) => {
        const selected = guardianActiveInv?.find(i => i?.invoiceId === invoiceId)
        setSelectedInvoice(selected ?? null)
        setShowDownloadPane()
    }

    const handleCloseDownload = () => {
        setSelectedInvoice(null)
        setShowDownloadPane()
    }

    const handleDownload = () => {
        download.mutate({
            invoiceId: selectedInvoice?.invoiceId as number,
        })
    }

    console.log({showDownloadPane})

    return(
        <OutletPage metadata={{
            title: 'Tuteur Portail de paiements',
            description: 'Tuteur portail de paiements description'
        }} breadCrumb={{
            bCItems: [
                {title: text.guardian.label, setRedirect: toGuardian},
                {title: guardianName, setRedirect: () => toViewGuardian(guardianId as string)},
                {title: 'Paiements'}
            ],
            mBottom: 20
        }}>
            <main>
                <PageTitle title={"Portail de Paiement"} margins={'0 0 30px 0'} description={<p>
                    Le portail de paiement permet aux utilisateurs de consulter leurs factures et d’effectuer des paiements sécurisés en ligne en toute simplicité.
                </p>} />
                <Divider />
                <Responsive gutter={[16, 16]}>
                    <Grid xs={24} md={24} lg={24}>
                        <Table tableProps={{
                            rowSelection: {
                                selectedRowKeys: selectedInvoices.map(inv => inv.invoiceId),
                                onChange: onSelectChange,
                            },
                            columns: columns,
                            dataSource: guardianActiveInv,
                            rowKey: 'invoiceId',
                            size: 'large',
                            pagination: invoicesCount > 10 ? {pageSize: 10} : false,
                            style: {marginBottom: '80px'},
                            expandable: {
                                expandedRowRender: (record) => (
                                    <Table tableProps={{
                                        columns: nestedColumns,
                                        dataSource: record?.items,
                                        rowKey: 'id',
                                        pagination: false,
                                        size: 'small',
                                        scroll: {x: 1300}
                                    }} />
                                )
                            }
                        }} />
                        <Card style={{borderRadius: 0, padding: 0, border: 'none'}} styles={{
                            body: {padding: "0px 0px"}
                        }}>
                            <div style={{background: '#f7f7f7', borderRadius: 0, padding: 0, marginBottom: '10px'}}>
                                <SummaryRow label={"Montant excl. taxe"} value={currency(valueToPay?.subTotal)} />
                                <SummaryRow label={"Taxe & TVA"} value={currency(valueToPay?.totalTax)} />
                                <SummaryRow label={"Total"} value={currency(valueToPay?.totalAmount)} hideDivider strong />
                            </div>
                            <Responsive justify='end'>
                                <Grid>
                                    <Button type='primary'>PAYER LA SELECTION</Button>
                                </Grid>
                            </Responsive>
                        </Card>
                    </Grid>
                </Responsive>
            </main>
            <InvoiceDetails open={showDetailPane} onClose={handleCloseDetails} data={selectedInvoice} />
            <ConfirmationModal
                data={selectedInvoice as Invoice}
                open={showDownloadPane}
                close={handleCloseDownload}
                alertDesc={{
                    type: "info", msg: 'Télécharger le fichier pdf de la facture'
                }}
                handleFunc={handleDownload}
                modalTitle={"Téléchargement de la facture " + selectedInvoice?.invoiceNumber}
                btnTxt={'Télécharger'}
                btnProps={{
                    icon: <LuDownload />,
                    type: 'primary'
                }}
                justify={'center'}
                isConfirm={false}
            />
        </OutletPage>
    )
}

export default GuardianPaymentPage