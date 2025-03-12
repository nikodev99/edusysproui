import {ViewRoot} from "../../components/custom/ViewRoot.tsx";
import {ClasseList, CourseList, AddClasse, AddCourse} from "../../components/ui-kit-cc";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../utils/text_display.ts";
import {Breadcrumb, setBreadcrumb} from "../../core/breadcrumb.tsx";
import {ListPageHierarchy} from "../../components/custom/ListPageHierarchy.tsx";
import {LuBookPlus, LuChevronDown, LuClipboard} from "react-icons/lu";
import {Button} from "antd";
import {useEffect, useState} from "react";

const ClasseSubjectListsPage = () => {

    useDocumentTitle({
        title: text.cc.label,
        description: "Classe & Matière description",
    })

    const [addClasseOpen, setAddClasseOpen] = useState<boolean>(false)
    const [addCourseOpen, setAddCourseOpen] = useState<boolean>(false)
    const [classeRefetch, setClasseRefetch] = useState<boolean>(false)
    const [courseRefetch, setCourseRefetch] = useState<boolean>(false)

    const pageHierarchy = setBreadcrumb([
        {
            title: text.cc.label
        }
    ])
    
    useEffect(() => {
        if (classeRefetch) setClasseRefetch(false)
        if (courseRefetch) setCourseRefetch(false)
    }, [classeRefetch, courseRefetch])

    const handleClasseModalClose = () => {
        setAddClasseOpen(false)
        setClasseRefetch(true)
    }

    const handleCourseModalClose = () => {
        setAddCourseOpen(false)
        setCourseRefetch(true)
    }

    return(
        <>
            <ListPageHierarchy
                items={pageHierarchy as [Breadcrumb]}
                hasDropdownButton={true}
                icon={<Button type='primary'>Ajouter <LuChevronDown /></Button>}
                dropdownItems={[
                    {key: '1', icon: <LuClipboard />,label: text.cc.group.classe.add.label, onClick: () => setAddClasseOpen(true)},
                    {key: '2', icon: <LuBookPlus />, label: text.cc.group.course.add.label, onClick: () => setAddCourseOpen(true)}
                ]}
            />
            <ViewRoot
                items={[
                    {key: '1', label: 'Classes', children: <ClasseList condition={classeRefetch} />},
                    {key: '2', label: 'Matières', children: <CourseList condition={courseRefetch} />}
                ]}
                tab={{
                    centered: false,
                    type: 'card'
                }}
                exists={true}
                memorizedTabKey='classe-course'
                addMargin={{position: "top", size: 10}}
            />
            <AddClasse open={addClasseOpen} onCancel={handleClasseModalClose} />
            <AddCourse open={addCourseOpen} onCancel={handleCourseModalClose} />
        </>
    )
}

export default ClasseSubjectListsPage