import {useDocumentTitle} from "@/hooks/useDocumentTitle.ts";
import {useText} from "@/core/utils/text_display.ts";
import {useBreadCrumb} from "@/hooks/useBreadCrumb.tsx";
import {InsertExam} from "@/components/ui-kit-exam";

const AddExamPage = () => {
    const text = useText()
    useDocumentTitle({
        title: "Nouveau Devoir",
        description: "Add exam description",
    })

    const {context} = useBreadCrumb({
        bCItems: [
            {
                title: text.exam.label,
                path: text.exam.href
            },
            {
                title: text.exam.group.add.label
            }
        ]
    })

    return(
        <>
            {context}
            <InsertExam />
        </>
    )
}

export default AddExamPage;