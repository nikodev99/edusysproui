import {SettingWidget, SettingWidgetProps} from "@/components/helpers/SettingWidget.tsx";
import {Divider} from "antd";
import Responsive from "@/components/ui/layout/Responsive.tsx";
import Grid from "@/components/ui/layout/Grid.tsx";
import {PiStudent} from "react-icons/pi";
import {LuClipboardCheck, LuGraduationCap, LuUsers} from "react-icons/lu";
import OutletPage from "@/pages/OutletPage.tsx";
import {useRedirect} from "@/hooks/useRedirect.ts";

const SettingPage = () => {
    const {toSettings} = useRedirect()

    const widgets: SettingWidgetProps[] = [
        {icon: <PiStudent />, title: "Apprenants", desc: "Voir et gérer les apprenants de l'établissement", toView: () => toSetting(1)},
        {icon: <LuUsers />, title: "Enseignants", desc: "Voir et gérer les enseignants de l'établissement", toView: () => toSetting(2)},
        {icon: <LuGraduationCap />, title: "Académie", desc: "Voir et gérer les enseignants de l'établissement", toView: () => toSetting(3)},
        {icon: <LuClipboardCheck />, title: "Evaluation", desc: "Voir et gérer les évaluation de l'établissement", toView: () => toSetting(4)},
    ]

    const toSetting = (link: number) => {
        toSettings(link as 1)
    }

    return (
        <OutletPage
            metadata={{
                title: "Paramètres",
                description: "Description de la page des paramètres"
            }}
            breadCrumb={{
                bCItems: [
                    {title: 'Paramètres'}
                ]
            }}
            content={
                <Responsive gutter={[16, 16]}>
                    <Divider orientation='left'>Basic</Divider>
                    {widgets?.map((widget, index) => (
                        <Grid key={`${widget.title}-${index}`} xs={24} md={12} lg={8} xxl={6}>
                            <SettingWidget
                                icon={widget.icon}
                                title={widget.title}
                                desc={widget.desc}
                                toView={widget.toView}
                            />
                        </Grid>
                    ))}
                </Responsive>
            }
        />
    )
}

export default SettingPage;