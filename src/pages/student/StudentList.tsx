import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import {setBreadcrumb} from "../../core/breadcrumb.tsx";
import {ReactNode} from "react";
import {Flex} from "antd";

const StudentList = () => {
    const pageHierarchy = setBreadcrumb([
        {
            title: 'Apprenants'
        }
    ])

    return(
        <>
            <PageHierarchy items={pageHierarchy as [{title: string | ReactNode, path?: string}]} />
            <Flex className='page-wrapper' vertical>
                <div>Content</div>
            </Flex>
        </>
    )
}

export default StudentList