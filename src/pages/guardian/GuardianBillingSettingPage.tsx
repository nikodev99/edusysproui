import EmptyPage from "@/pages/EmptyPage.tsx";
import {LuSettings2} from "react-icons/lu";
import {useParams} from "react-router-dom";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {Button} from "antd";

const GuardianBillingSettingPage = () => {
    const {id: guardianId} = useParams()
    const {toViewGuardian} = useRedirect()

    return(
        <EmptyPage
            title={"Page de parametrage des donnée de paiement"}
            subTitle={"Ici le tuteur peut mettre à jour son numéro de mobile money aussi bien pour MTN que pour Airtel et aussi sa Carte Bancaire"}
            icon={<LuSettings2 />}
            extra={<Button onClick={() => toViewGuardian(guardianId as string)}>Voir le tuteur</Button>}
        />
    )
}

export default GuardianBillingSettingPage