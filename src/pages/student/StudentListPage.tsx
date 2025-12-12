import {StudentListDataType as DataType} from "../../core/utils/interfaces.ts";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../core/utils/text_display.ts";
import {useBreadcrumbItem} from "../../hooks/useBreadCrumb.tsx";
import {ListPageHierarchy} from "../../components/custom/ListPageHierarchy.tsx";
import {AiOutlineUserAdd} from "react-icons/ai";
import {AxiosResponse} from "axios";
import {StudentList} from "../../components/ui-kit-student/components/StudentList.tsx";
import {useRedirect} from "../../hooks/useRedirect.ts";
import {Button} from "antd";
import {LuClipboard, LuClipboardPlus, LuSearch} from "react-icons/lu";
import {useMemo} from "react";
import {setPlural} from "../../core/utils/utils.ts";
import {useStudentRepo} from "../../hooks/actions/useStudentRepo.ts";

const StudentListPage = () => {
    const {toEnrollStudent, toReenrollStudent, toSearchStudent} = useRedirect()
    const {getPaginatedStudents, getSearchedEnrolledStudents} = useStudentRepo()
    
    const pageLabel = useMemo(() => setPlural(text.student.label), [])

    useDocumentTitle({
        title: `EduSysPro - ${pageLabel}`,
        description: "Student description",
        hasEdu: false
    })

    const pageHierarchy = useBreadcrumbItem([
        {
            title: pageLabel
        }
    ])

    return(
        <>
            <ListPageHierarchy
                items={pageHierarchy as []}
                hasDropdownButton={true}
                icon={<Button type='primary'><AiOutlineUserAdd /> {text.student.group.add.label}</Button>}
                dropdownItems={[
                    {key: '1', icon: <LuClipboard />,label: text.student.group.add.label, onClick: toEnrollStudent},
                    {key: '2', icon: <LuClipboardPlus />, label: text.student.group.reAdd.label, onClick: toReenrollStudent},
                    {key: '3', icon: <LuSearch />, label: text.student.group.search.label, onClick: toSearchStudent}
                ]}
            />
            <StudentList
                callback={getPaginatedStudents as never}
                searchCallback={getSearchedEnrolledStudents as (...input: unknown[]) => Promise<AxiosResponse<DataType[]>>}
                localStorage={{
                    activeIcon: 'activeIcon',
                    pageSize: 'pageSize',
                    page: 'page',
                    pageCount: 'pageCount'
                }}
            />
        </>
    )
}

export default StudentListPage
