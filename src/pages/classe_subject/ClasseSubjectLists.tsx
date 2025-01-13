import {ViewRoot} from "../../components/custom/ViewRoot.tsx";
import {ClasseList} from "../../components/ui-kit-cc/ClasseList.tsx";
import {CourseList} from "../../components/ui-kit-cc/CourseList.tsx";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../utils/text_display.ts";
import {Breadcrumb, setBreadcrumb} from "../../core/breadcrumb.tsx";
import {ListPageHierarchy} from "../../components/custom/ListPageHierarchy.tsx";
import {LuBookPlus, LuChevronDown, LuClipboard} from "react-icons/lu";
import {Button} from "antd";

const ClasseSubjectLists = () => {

    useDocumentTitle({
        title: text.cc.label,
        description: "Classe & Matière description",
    })

    const pageHierarchy = setBreadcrumb([
        {
            title: text.cc.label
        }
    ])

    return(
        <>
            <ListPageHierarchy
                items={pageHierarchy as [Breadcrumb]}
                hasDropdownButton={true}
                icon={<Button type='primary'>Ajouter <LuChevronDown /></Button>}
                dropdownItems={[
                    {key: '1', icon: <LuClipboard />,label: text.cc.group.classe.add.label, onClick: () => alert('Ajouter une classe')},
                    {key: '2', icon: <LuBookPlus />, label: text.cc.group.course.add.label, onClick: () => alert('Ajouter une matière')}
                ]}
            />
            <ViewRoot
                items={[
                    {key: '1', label: 'Classes', children: <ClasseList />},
                    {key: '2', label: 'Matières', children: <CourseList />}
                ]}
                tab={{
                    type: 'card',
                    centered: false
                }}
                exists={true}
                memorizedTabKey='classe-course'
                addMargin={{position: "top", size: 30}}
            />
        </>
    )
}

export default ClasseSubjectLists