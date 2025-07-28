import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {AttendanceInserting} from "../../components/ui-kit-att";

const AttendanceAddPage = () => {

    useDocumentTitle({
        title: "Mise à jour de présence",
        description: "AttendanceAddPage description",
    })

    const {context} = useBreadCrumb({
        bCItems: [
            {title: text.att.label, path: text.att.href},
            {title: text.att.group.add.label}
        ]
    })

    return (
        <main>
            {context}
            <AttendanceInserting />
        </main>
    )
}

export default AttendanceAddPage;