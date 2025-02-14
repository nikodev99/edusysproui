import {StudentListDataType as DataType} from "../../utils/interfaces.ts";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../utils/text_display.ts";
import {Breadcrumb, setBreadcrumb} from "../../core/breadcrumb.tsx";
import {ListPageHierarchy} from "../../components/custom/ListPageHierarchy.tsx";
import {useRef} from "react";
import {redirectTo} from "../../context/RedirectContext.ts";
import {AiOutlineUserAdd} from "react-icons/ai";
import {fetchEnrolledStudents} from "../../data";
import {AxiosResponse} from "axios";
import {StudentList} from "../../components/ui-kit-student/components/StudentList.tsx";
import {searchEnrolledStudents} from "../../data/repository/studentRepository.ts";

const StudentListPage = () => {

    useDocumentTitle({
        title: `EduSysPro - ${text.student.label}`,
        description: "Student description",
        hasEdu: false
    })

    const pageHierarchy = setBreadcrumb([
        {
            title: text.student.label
        }
    ])

    const enrollUrl = useRef<string>(text.student.group.add.href);

    return(
        <>
            <ListPageHierarchy
                items={pageHierarchy as [Breadcrumb]}
                hasButton={true}
                onClick={() => redirectTo(enrollUrl.current)}
                type='primary'
                icon={<AiOutlineUserAdd />}
                label={text.student.group.add.label}
            />
            <StudentList
                callback={fetchEnrolledStudents as () => Promise<AxiosResponse<DataType>>}
                searchCallback={searchEnrolledStudents as (...input: unknown[]) => Promise<AxiosResponse<DataType[]>>}
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
