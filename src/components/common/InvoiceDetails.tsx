import {Invoice, InvoiceItem, InvoiceStatus} from "@/finance/models/invoice.ts";
import RightSidePane from "@/components/ui/layout/RightSidePane.tsx";
import {Button, Descriptions, Space} from "antd";
import {AvatarTitle} from "@/components/ui/layout/AvatarTitle.tsx";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {LuBadgeAlert, LuCreditCard, LuDownload} from "react-icons/lu";
import Responsive from "@/components/ui/layout/Responsive.tsx";
import Grid from "@/components/ui/layout/Grid.tsx";
import Datetime from "@/core/datetime.ts";
import {currency} from "@/core/utils/utils.ts";
import {GetStatusTag} from "@/core/utils/tsxUtils.tsx";
import Tag from "@/components/ui/layout/Tag.tsx";

export interface InvoiceDetailsProps {
    data: Invoice | null,
    open: boolean,
    onClose: () => void
    handleDownload?: () => void
    handlePay?: () => void
}

export const InvoiceDetails = ({data, open, onClose}: InvoiceDetailsProps) => {
    const {toViewStudent} = useRedirect()

    return(
        <RightSidePane open={open} onClose={onClose} title={"Facture " + data?.invoiceNumber} footer={
            <Responsive gutter={[16, 16]} justify='space-between'>
                <Grid>
                    <Button
                        key="download"
                        type='link'
                        icon={<LuDownload />}
                        onClick={() => alert('Télécharger la facture ' + data?.invoiceNumber)}
                        children="Télécharger"
                    />
                </Grid>
                <Grid>
                    <Button
                        key="pay"
                        type='primary'
                        icon={<LuCreditCard />}
                        children='Payer'
                        onClick={() => alert('Payer la facture ' + data?.invoiceNumber)}
                    />
                </Grid>
            </Responsive>
        }>
            <Descriptions items={[
                {
                    key: "1",
                    children: <AvatarTitle
                        personalInfo={data?.enrolledStudent?.student?.personalInfo}
                        toView={() => toViewStudent(data?.enrolledStudent?.student?.id as string, data?.enrolledStudent?.student?.personalInfo)}
                    />,
                    span: 3
                },
                {
                    key: "2",
                    label: 'Numéro de la facture',
                    children: data?.invoiceNumber,
                    span: 3
                },
                {
                    key: "3",
                    label: 'Date de création',
                    children: Datetime.of(data?.invoiceDate as string).fDatetime(),
                    span: 3
                },
                {
                    key: "4",
                    label: 'Date de Paiement',
                    children: Datetime.of(data?.dueDate as string).fullDay(),
                    span: 3
                },
                {
                    key: "5",
                    label: 'Date de création',
                    children: Datetime.of(data?.invoiceDate as string).fDatetime(),
                    span: 3
                },
                {
                    key: "6",
                    label: 'Montant hors taxe',
                    children: currency(data?.subTotalAmount),
                    span: 3
                },
                {
                    key: "7",
                    label: 'Remise',
                    children: currency(data?.discount),
                    span: 3
                },
                {
                    key: "8",
                    label: 'TVA',
                    children: currency(data?.taxAmount),
                    span: 3
                },
                {
                    key: "9",
                    label: 'Montant à payer',
                    children: currency(data?.totalAmount),
                    span: 3
                },
                {
                    key: "10",
                    label: 'Status',
                    children: <Space>
                        {data?.isOverdue && <Tag icon={<LuBadgeAlert />} color='danger'>Non payé</Tag>}
                        <GetStatusTag status={data?.status as InvoiceStatus} isOverdue={data?.isOverdue} />
                    </Space>,
                    span: 3
                },
                {
                    key: "11",
                    label: 'Facture pour',
                    children: undefined,
                    span: 3
                },
                {
                    key: "12",
                    children: data?.items?.map(item => (
                        <ItemDescriptions item={item} />
                    )),
                    span: 3
                }
            ]} />
        </RightSidePane>
    )
}

const ItemDescriptions = ({ item }: {item: InvoiceItem}) => {
    return (
        <Descriptions
            bordered
            size="small"
            column={{ xs: 1, sm: 2, md: 3 }} // responsive columns
            style={{ marginBottom: 8 }}
            items={[
                {
                    key: "1",
                    label: "Description",
                    children: item.description ?? "-",
                    span: 3
                },
                {
                    key: "2",
                    label: "Catégorie",
                    children: item.category?.name ?? "-",
                    span: 3
                },
                {
                    key: "3",
                    label: "Quantité",
                    children: item.quantity ?? 1,
                    span: 3
                },
                {
                    key: "4",
                    label: "Prix un.",
                    children: currency(item.unitPrice ?? 0),
                    span: 3
                },
                {
                    key: "5",
                    label: "Montant",
                    children: ((item?.discountPercentage ?? 0) * 100).toFixed(2) + '%'
                },
                {
                    key: "6",
                    label: "Remise",
                    children: currency(item?.discountAmount),
                    span: 2
                },
                {
                    key: "7",
                    label: "Montant total",
                    children: currency(item.totalAmount ?? 0),
                    span: 3
                },
            ]}
        />
    );
};
