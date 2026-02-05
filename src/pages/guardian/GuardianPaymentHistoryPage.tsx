import {useParams} from "react-router-dom";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {useGuardianRepo} from "@/hooks/actions/useGuardianRepo.ts";
import {useMemo} from "react";
import {setName} from "@/core/utils/utils.ts";
import OutletPage from "@/pages/OutletPage.tsx";
import {text} from "@/core/utils/text_display.ts";
import {PageTitle} from "@/components/custom/PageTitle.tsx";
import {Widgets} from "@/components/ui/layout/Widgets.tsx";
import {LuCheck, LuCircleAlert, LuDollarSign} from "react-icons/lu";

const GuardianPaymentHistoryPage = () => {
    const {id: guardianId} = useParams()
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
                    Le portail de paiement permet aux utilisateurs de consulter leurs factures et d’effectuer des paiements sécurisés en ligne en toute simplicité.
                </p>} />
                <Widgets items={[
                    {title: 'Encours total', value: 0, precision: 0, valueStyle: {color: '#ff4d4f'}, prefix: <LuDollarSign />, suffix: 'XAF'},
                    {title: 'Total payé (cette année)', value: 0, valueStyle: {color: '#52c41a'}, prefix: <LuCheck />, suffix: 'XAF'},
                    {title: 'Factures échues', value: 2, valueStyle: {color: (2 > 0) ? '#ff4d4f' : '#52c41a'}, prefix: <LuCircleAlert />},
                    {title: 'Elèves Tutorés', value: 1, valueStyle: {color: '#1890ff'}}
                ]} />
            </main>
        </OutletPage>
    )
}

export default GuardianPaymentHistoryPage