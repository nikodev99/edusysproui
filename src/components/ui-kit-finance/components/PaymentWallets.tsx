import {Widgets} from "@/components/ui/layout/Widgets.tsx";
import {LuBanknote, LuCheck, LuCircleAlert, LuUserRound} from "react-icons/lu";
import {useGuardianRepo} from "@/hooks/actions/useGuardianRepo.ts";
import {Guardian} from "@/entity";
import {currency} from "@/core/utils/utils.ts";

export interface PaymentWalletProps {
    guardian?: Guardian,
    academicYear?: string
}

export const PaymentWallets = ({guardian, academicYear}: PaymentWalletProps) => {
    const {useGetPaymentSummary} = useGuardianRepo()

    const summary = useGetPaymentSummary(guardian?.id as string, academicYear as string)

    return (
        <Widgets items={[
            {
                title: 'Total Encours',
                value: summary?.overdueInvoices ?? 0,
                precision: 0,
                valueStyle: {color: '#ff4d4f'},
                prefix: <LuBanknote />,
            },
            {
                title: 'Total payé (cette année)',
                value: currency(summary?.totalPaidThisYear),
                valueStyle: {color: '#52c41a'},
                prefix: <LuCheck />,
            },
            {
                title: 'Factures Echues',
                value: currency(summary?.totalOutstanding) ?? 0,
                valueStyle: {color: '#f31515'},
                prefix: <LuCircleAlert />
            },
            {
                title: 'Elèves Tutorés',
                value: summary?.countStudent ?? 0,
                valueStyle: {color: '#1890ff'},
                prefix: <LuUserRound />
            }
        ]} />
    )
}