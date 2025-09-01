import {useDepartmentRepo} from "../../hooks/useDepartmentRepo.ts";
import PageWrapper from "../../components/view/PageWrapper.tsx";
import {DepartmentDesc} from "../../components/common/DepartmentDesc.tsx";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import Grid from "../../components/ui/layout/Grid.tsx";
import {Button, Divider, Flex} from "antd";
import {LuLink} from "react-icons/lu";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {cutStatement} from "../../core/utils/utils.ts";
import {useRedirect} from "../../hooks/useRedirect.ts";

const DepartmentPage = () => {
    useDocumentTitle({
        title: 'department',
        description: 'Department description',
    })

    const {context} = useBreadCrumb({
        bCItems: [
            {title: text.org.group.school.label, path: text.org.group.school.href},
            {title: text.org.group.department.label}
        ]
    })

    const {toViewDepartment, toAddDepartment} = useRedirect()

    const {useGetAllDepartments} = useDepartmentRepo()
    const departments = useGetAllDepartments()

    console.log({departments})

    return(
        <>
        {context}
        <PageWrapper>
            <Divider orientation="right">
                <Button onClick={toAddDepartment} type='primary'>Ajouter un départment</Button>
            </Divider>
            <Responsive gutter={[16, 16]}>
                {departments.map((department) => (
                    <Grid key={department.id} xs={24} md={12} lg={8}>
                        <DepartmentDesc
                            department={department}
                            title={<Flex justify='space-between'>
                                <h3>{cutStatement(department?.name as string, 30, department?.code)}</h3>
                                <Button
                                    onClick={() => toViewDepartment(department?.id as number, department?.name)}
                                    type={'text'}
                                    icon={<LuLink style={{color: 'blue'}} />}
                                />
                            </Flex>}
                        />
                    </Grid>
                ))}
            </Responsive>
        </PageWrapper>
        </>
    )
}

export default DepartmentPage;