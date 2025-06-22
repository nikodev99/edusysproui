import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {ReactNode} from "react";
import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import {AttendanceInserting} from "../../components/ui-kit-att";

export const AttendanceEditPage = () => {
    useDocumentTitle({
        title: "Mise à jour de présence",
        description: "AttendanceAddPage description",
    })

    const items = useBreadCrumb([
        {title: text.att.label, path: text.att.href},
        {title: text.att.group.edit.label}
    ])

    return (
        <main>
            <PageHierarchy items={items as [{ title: string | ReactNode, path?: string }]}/>
            <AttendanceInserting
                edit={true}
            />
        </main>
    )
}