import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../core/utils/text_display.ts";
import {Breadcrumb, useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import {InsertExam} from "../../components/ui-kit-exam";

const AddExamPage = () => {

    useDocumentTitle({
        title: "Nouveau Devoir",
        description: "Add exam description",
    })

    const breadCrumb: Breadcrumb[] = useBreadCrumb([
        {
            title: text.exam.label,
            path: text.exam.href
        },
        {
            title: text.exam.group.add.label
        }
    ])

    return(
        <>
            <PageHierarchy items={breadCrumb as [Breadcrumb]} />
            <InsertExam />
        </>
    )
}

export default AddExamPage;