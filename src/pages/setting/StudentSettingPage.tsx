import OutletPage from "@/pages/OutletPage.tsx";
import {StudentSettings} from "@/components/ui-kit-setting";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {useSetting} from "@/core/store/settingAccessor.ts";
import {useText} from "@/core/utils/text_display.ts";

const StudentSettingPage = () => {
    const {toSettings} = useRedirect()
    const text = useText()
    const settings = useSetting()

    return (
        <OutletPage
            metadata={{
                title: 'Paramètres apprenants',
                description: 'Paramètres apprenants description'
            }}
            breadCrumb={{
                bCItems: [
                    {title: 'Paramètres', setRedirect: toSettings},
                    {title: text.student.label as string ?? 'Apprenants'}
                ]
            }}
            content={<StudentSettings settings={settings} />}
        />
    )
}

export default StudentSettingPage