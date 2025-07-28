import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {Divider} from "antd";

const GradePage = () => {
    useDocumentTitle({
        title: "Setting - Année Académique",
        description: "Setting description",
    })

    const {context} = useBreadCrumb({
        bCItems: [
            {title: 'Setting'},
            {title: text.settings.group.academicYear.label}
        ]
    })
    return(
        <>
            {context}
            <Divider>Manager les grades</Divider>
        </>
    )
}

export default GradePage;