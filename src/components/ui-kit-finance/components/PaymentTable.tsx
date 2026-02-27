import ListViewer from "@/components/custom/ListViewer.tsx";
import {GuardianPayment} from "@/finance/apis/guardianPayment.ts";
import {Enrollment, Guardian, Individual} from "@/entity";
import {Button, Space, TableColumnsType} from "antd";
import {PaymentGateway, PaymentHistory, PaymentMethod, PaymentStatus, STATUS_META} from "@/finance/models/payment.ts";
import Datetime from "@/core/datetime.ts";
import {PaymentMethodChip, PaymentStatusBadge} from "@/core/utils/tsxUtils.tsx";
import {currency} from "@/core/utils/utils.ts";
import {LuDownload} from "react-icons/lu";
import {BtnFilter, DataProps} from "@/core/utils/interfaces.ts";
import {useState} from "react";
import {useDownload} from "@/hooks/actions/useDownload.ts";
import {useToggle} from "@/hooks/useToggle.ts";
import {ConfirmationModal} from "@/components/ui/layout/ConfirmationModal.tsx";

export interface PaymentTableProps {
    guardian?: Guardian,
    academicYear?: string
}

const studentName = (p: Individual) => {
    return p ? `${p.firstName} ${p.lastName}` : "—";
};

export const PaymentTable = ({guardian, academicYear}: PaymentTableProps) => {
    const [key, setKey] = useState<keyof PaymentHistory | null>(null)
    const [value, setValue] = useState<keyof typeof PaymentStatus | null>(null)
    const [btnFilter, setBtnFilter] = useState<BtnFilter<PaymentHistory> | null>(null)
    const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(null)
    const [showDownloadPane, setShowDownloadPane] = useToggle(false)

    const {useDownloadReceipt} = useDownload()
    const download = useDownloadReceipt()

    const columns: TableColumnsType<PaymentHistory> = [
        {
            title: 'Bon/Reçu',
            dataIndex: 'voucherNumber',
            key: 'voucher_number',
            render: (voucherNumber, record) => <div style={{fontWeight: 700, color: T.accent}}>
                {voucherNumber}
                {record?.receiptNumber && <div style={{fontSize: 10, marginTop: '2px', color: T.textMuted}}>
                    {record?.receiptNumber}
                </div>}
            </div>
        },
        {
            title: 'Apprenant',
            dataIndex: 'enrolledStudent',
            key: 'student',
            render: (student: Enrollment) => <div>
                <div>{studentName(student?.student?.personalInfo as Individual)}</div>
                <div style={{fontSize: '11', marginTop: '1', color: T.textMuted}}>{student?.classe?.name}</div>
            </div>
        },
        {
            title: 'Date',
            dataIndex: 'paymentDate',
            key: 'date',
            render: date => <div style={{color: T.textSub}}>{
                Datetime.of(date).format("DD MMM YYYY, HH:mm")
            }</div>,
        },
        {
            title: 'Méthode',
            dataIndex: 'paymentMethod',
            key: 'method',
            render: (method, record) => <PaymentMethodChip
                method={PaymentMethod[method] as keyof PaymentMethod}
                gateway={PaymentGateway[record?.paymentGateway] as keyof PaymentGateway}
            />
        },
        {
            title: 'Montant',
            dataIndex: 'amountPaid',
            key: 'amount',
            render: (amount, record) => <div style={{fontWeight: 700}}>
                {currency(amount)}
                {record?.invoice && amount < record?.invoice?.totalAmount && (
                    <div style={{fontSize: '10', color: '#92400e', marginTop: '2'}}>
                        sur {currency(record?.invoice?.totalAmount)}
                    </div>
                )}
            </div>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => <PaymentStatusBadge status={PaymentStatus[status] as keyof PaymentStatus} />
        },
        {
            title: 'Payé par',
            dataIndex: 'processedBy',
            key: 'processed_by',
            render: (processedBy: Individual) => <div>
                {processedBy?.firstName} {processedBy?.lastName}
            </div>
        },
        {
            title: 'Reçu',
            dataIndex: 'paymentId',
            key: 'paymentId',
            render: (_paymentId, record) =>
                <Button onClick={() => handleOpenDownload(record)}><LuDownload /></Button>
        }
    ]

    const cardData = (data: PaymentHistory[]) => {
        return data?.map(payment => ({
            id: payment?.paymentId as string,
            description: <CardView p={payment} onDownload={handleOpenDownload} />,
            record: payment as PaymentHistory,
        })) || [] as DataProps<PaymentHistory>[]
    }

    const handleOnFilterStatus = (value: keyof typeof PaymentStatus) => {
        setKey('status')
        setValue(value)
        setBtnFilter({key: 'status', value: value})
    }

    const handleUnsetFilter = () => {
        setKey(null)
        setValue(null)
        setBtnFilter(null)
    }

    const handleOpenDownload = (payment: PaymentHistory) => {
        setSelectedPayment(payment)
        setShowDownloadPane()
    }

    const handleCloseDownload = () => {
        setSelectedPayment(null)
        setShowDownloadPane()
    }

    const handleDownload = () => {
        download.mutate({
            paymentId: selectedPayment?.paymentId as string,
            voucherNumber: selectedPayment?.voucherNumber,
        })
    }

    const handleSearch = (data: PaymentHistory[], searchQuery?: string) => {
        return data?.filter(p => {
            const matchStatus = key === null && value === null
            const q = searchQuery?.toLowerCase();
            const matchSearch = !q
                || studentName(p?.enrolledStudent?.student?.personalInfo as Individual).toLowerCase().includes(q)
                || p.voucherNumber.toLowerCase().includes(q)
                || (p.receiptNumber || "").toLowerCase().includes(q)
                || (p.transactionId || "").toLowerCase().includes(q);
            return matchStatus && matchSearch;
        }) ?? []
    }

    return(
        <>
        <ListViewer
            callback={GuardianPayment.getGuardianPaymentHistory as never}
            callbackParams={[guardian?.id, academicYear]}
            tableColumns={columns}
            countTitle={<Space>
                <Button
                    onClick={handleUnsetFilter}
                    variant={"filled"}
                    color={key === null ? 'blue' : 'default'}
                >
                    Tous
                </Button>
                <Button
                    onClick={() => handleOnFilterStatus('COMPLETED')}
                    variant={"filled"}
                    color={value === 'COMPLETED' ? 'blue' : 'default'}
                >
                    Complété
                </Button>
                <Button
                    onClick={() => handleOnFilterStatus('CANCELLED')}
                    variant={"filled"}
                    color={value === 'CANCELLED' ? 'blue' : 'default'}
                >
                    Annulé
                </Button>
                <Button
                    onClick={() => handleOnFilterStatus('FAILED')}
                    variant={"filled"}
                    color={value === 'FAILED' ? 'blue' : 'default'}
                >
                    Echoué
                </Button>
            </Space>}
            cardData={cardData as never}
            cardNotAvatar
            fetchId='payment-list'
            localStorage={{
                activeIcon: '@paymentTable'
            }}
            hasCount={false}
            btnFilter={btnFilter}
            uuidKey={'paymentId'}
            searchInputPlaceholder={"Recherche élève, Bon/Reçu... "}
            onInputSearch={handleSearch}
        />

        {showDownloadPane && <ConfirmationModal
            data={selectedPayment as PaymentHistory}
            open={showDownloadPane}
            close={handleCloseDownload}
            alertDesc={{
                type: "info", msg: 'Télécharger le reçu'
            }}
            handleFunc={handleDownload}
            modalTitle={"Téléchargement du reçu " + selectedPayment?.voucherNumber}
            btnTxt={'Télécharger'}
            btnProps={{
                icon: <LuDownload/>,
                type: 'primary'
            }}
            justify={'center'}
            isConfirm={false}
        />}
        </>
    )
}

export const CardView = ({p, onDownload}: {p: PaymentHistory, onDownload: (payment: PaymentHistory) => void}) => {
    const progress = p.invoice ? Math.min((p.amountPaid / p.invoice.totalAmount) * 100, 100) : 100;
    const dot = STATUS_META[p.status]?.dot || "#9ca3af";

    return(
        <div key={p.paymentId} style={{
            background: T.surface,
            position: "relative", overflow: "hidden",
            height: '350px'
        }}>
            {/* Status stripe */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: dot }} />

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, marginTop: 6 }}>
                <div>
                    <div style={{ fontSize: 11, color: T.accent, fontWeight: 700 }}>
                        {p.voucherNumber}
                    </div>
                    {p.receiptNumber && (
                        <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}>
                            {p.receiptNumber}
                        </div>
                    )}
                </div>
                <PaymentStatusBadge status={PaymentStatus[p.status] as keyof PaymentStatus} />
            </div>

            {/* Student */}
            <div style={{ marginBottom: 13 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>
                    {studentName(p?.enrolledStudent?.student?.personalInfo as Individual)}
                </div>
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{p.enrolledStudent?.classe?.name}</div>
            </div>

            {/* Amount block */}
            <div style={{
                background: T.accentBg, border: `1px solid ${T.accentLight}`,
                borderRadius: 10, padding: "11px 14px", marginBottom: 12,
            }}>
                <div style={{ fontSize: 10, color: T.accent, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
                    Montant versé
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>
                    {currency(p?.amountPaid)}
                </div>
                {p.invoice && (
                    <>
                        <div style={{ marginTop: 8, height: 5, background: T.accentLight, borderRadius: 3 }}>
                            <div style={{
                                height: "100%", borderRadius: 3, width: `${progress}%`,
                                background: progress >= 100 ? "#10b981" : "#f59e0b",
                                transition: "width 0.5s ease",
                            }} />
                        </div>
                        <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4 }}>
                            {progress.toFixed(0)}% sur {currency(p?.invoice?.totalAmount)}
                        </div>
                    </>
                )}
            </div>

            {/* Method + Date */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <PaymentMethodChip
                    method={PaymentMethod[p?.paymentMethod] as keyof PaymentMethod}
                    gateway={PaymentGateway[p?.paymentGateway] as keyof PaymentGateway}
                />
                <div style={{ fontSize: 11, color: T.textMuted, textAlign: "right" }}>
                    {Datetime.of(p?.paymentDate).format("DD MMM YYYY HH:mm")}
                </div>
            </div>

            {/* Footer */}
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 11, color: T.textMuted }}>
                    Par <span style={{ color: T.textSub, fontWeight: 600 }}>{p?.processedBy?.firstName} {p?.processedBy?.lastName}</span>
                </div>
                <div><Button size='small' onClick={() => onDownload(p)}><LuDownload /></Button></div>
            </div>

            {p.notes && (
                <div style={{ marginTop: 10, fontSize: 11, color: T.textSub, fontStyle: "italic", borderLeft: `3px solid ${T.accentLight}`, paddingLeft: 8 }}>
                    {p?.notes}
                </div>
            )}
        </div>
    )
}

// ─── Light Theme Tokens ───────────────────────────────────────────────────────
const T = {
    bg:           "#f4f6f9",
    surface:      "#ffffff",
    surfaceHover: "#f8fafc",
    border:       "#e5eaf1",
    borderStrong: "#cdd5e0",
    text:         "#111827",
    textSub:      "#4b5563",
    textMuted:    "#9ca3af",
    accent:       "#1a7f5a",
    accentBg:     "#edfaf4",
    accentLight:  "#c9f0df",
};