import {useParams} from "react-router-dom";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {useGuardianRepo} from "@/hooks/actions/useGuardianRepo.ts";
import {useMemo, useState} from "react";
import {setName} from "@/core/utils/utils.ts";
import OutletPage from "@/pages/OutletPage.tsx";
import {text} from "@/core/utils/text_display.ts";
import {PageTitle} from "@/components/custom/PageTitle.tsx";
import {PaymentTable, PaymentWallets} from "@/components/ui-kit-finance";
import {SelectAcademicYear} from "@/components/common/SelectAcademicYear.tsx";

const GuardianPaymentHistoryPage = () => {
    const {id: guardianId} = useParams()
    const [academicYear, setAcademicYear] = useState<string>("")
    const {toViewGuardian, toGuardian, toGuardianInv} = useRedirect()
    const {useGetGuardian} = useGuardianRepo()

    const {data: guardian} = useGetGuardian(guardianId as string)
    const guardianName = useMemo(() => setName(guardian?.personalInfo), [guardian?.personalInfo])

    return(
        <OutletPage metadata={{
            title: 'Historique de paiements',
            description: 'Tuteur Historique de paiements description'
        }} breadCrumb={{
            bCItems: [
                {title: text.guardian.label, setRedirect: toGuardian},
                {title: guardianName, setRedirect: () => toViewGuardian(guardianId as string)},
                {title: 'Factures', setRedirect: () => toGuardianInv(guardianId as string)},
                {title: 'Historique de paiements'}
            ],
            mBottom: 20
        }}>
            <main>
                <PageTitle title={"Historique de paiements"} margins={'0 0 30px 0'} description={<p>
                    Suivi des versements de frais scolaires — toutes classes confondues
                </p>} />
                <SelectAcademicYear
                    getAcademicYear={setAcademicYear as (value: string | string[]) => void}
                    variant='filled'
                    style={{marginBottom: '10px'}}
                />
                <PaymentWallets
                    guardian={guardian}
                    academicYear={academicYear}
                />
                <PaymentTable
                    guardian={guardian}
                    academicYear={academicYear}
                />
            </main>
        </OutletPage>
    )
}

export default GuardianPaymentHistoryPage