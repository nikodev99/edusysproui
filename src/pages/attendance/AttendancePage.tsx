import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../core/utils/text_display.ts";
import {ReactNode, useState} from "react";
import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import Datetime from "../../core/datetime.ts";
import {ViewRoot} from "../../components/custom/ViewRoot.tsx";
import {AttendanceAnalysis} from "../../components/ui-kit-att";
import {SelectAcademicYear} from "../../components/common/SelectAcademicYear.tsx";

const AttendancePage = () => {

    useDocumentTitle({
        title: text.att.label,
        description: "Exam description",
    })

    const [academicYear, setAcademicYear] = useState<string>('')
    const pageHierarchy = useBreadCrumb([{ title: text.att.label }])

    const handleCatchingAcademicYear = (academicYear: string) => {
        setAcademicYear(academicYear)
    }

    return (
        <>
            <PageHierarchy items={pageHierarchy as [{ title: string | ReactNode, path?: string }]} />
            <ViewHeader
                isLoading={false}
                setEdit={() => alert('Modifier les présence') }
                closeState={false}
                blockProps={[
                    {title: 'Date', mention: <mark>{Datetime.now().fullDay()}</mark>},
                    {title: 'Année Academique', mention: <SelectAcademicYear getAcademicYear={handleCatchingAcademicYear} />}
                ]}
                addMargin={{
                    position: 'top',
                    size: 20
                }}
                showBtn
            />
            <ViewRoot
                items={[
                    {
                        label: 'Etat de présence',
                        children: <AttendanceAnalysis academicYear={academicYear}/>
                    }
                ]}
                exists={true}
            />
        </>
    )
}

export default AttendancePage