import {useRedirect} from "@/hooks/useRedirect.ts";
import {useSetting} from "@/core/store/settingAccessor.ts";
import OutletPage from "@/pages/OutletPage.tsx";
import {text} from "@/core/utils/text_display.ts";
import {ExamSettings} from "@/components/ui-kit-setting";
import {useState} from "react";
import {Messages} from "@/components/ui/layout/ConfirmationModal.tsx";

const ExamSettingPage = () => {
    const [messages, setMessages] = useState<Messages>({})
    const {toSettings} = useRedirect()
    const settings = useSetting()

    return (
        <OutletPage
            metadata={{
                title: 'Paramètres évaluations',
                description: 'Paramètres des évaluations description'
            }}
            breadCrumb={{
                bCItems: [
                    {title: 'Paramètres', setRedirect: toSettings},
                    {title: text.exam.label ?? 'Evaluations'}
                ]
            }}
            content={<ExamSettings settings={settings} getMessages={setMessages} />}
            responseMessages={messages}
        />
    )
}

export default ExamSettingPage