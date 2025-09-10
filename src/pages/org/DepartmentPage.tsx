import {useDepartmentRepo} from "../../hooks/useDepartmentRepo.ts";
import PageWrapper from "../../components/view/PageWrapper.tsx";
import {DepartmentDesc} from "../../components/common/DepartmentDesc.tsx";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import Grid from "../../components/ui/layout/Grid.tsx";
import {Alert, Button, Divider, Flex, Tag} from "antd";
import {LuArrowLeft, LuArrowRight, LuFileText, LuLink, LuUniversity} from "react-icons/lu";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {cutStatement, MAIN_COLOR} from "../../core/utils/utils.ts";
import {useRedirect} from "../../hooks/useRedirect.ts";
import EmptyPage from "../EmptyPage.tsx";
import {Link} from "react-router-dom";
import {useMemo} from "react";
import {useSchoolRepo} from "../../hooks/useSchoolRepo.ts";
import {anyIsCollege, anyIsUniversity, SectionType} from "../../entity/enums/section.ts";

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
    const {schoolSections} = useSchoolRepo()
    
    const displayDepartments = useMemo(() => anyIsCollege(schoolSections) || anyIsUniversity(schoolSections), [schoolSections])

    const departments = useGetAllDepartments({enable: displayDepartments})

    return(
        <>
        {context}
        <PageWrapper>
            {displayDepartments ? (<>
            <Divider orientation="right">
                <Button onClick={toAddDepartment} type='primary'>Ajouter un départment</Button>
            </Divider>
            <Responsive gutter={[16, 16]}>
                {departments && departments?.length > 0 ? departments.map((department) => (
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
                )): (
                    <EmptyPage
                        title={"Aucun département trouvé"}
                        subTitle={<Alert
                            type='info'
                            showIcon
                            message={"Un département structure et spécialise l'enseignement en regroupant les matières " +
                                "et les responsables, renforçant la coordination pédagogique, la qualité des formations " +
                                "et la gestion administrative"}
                        />}
                        extra={
                            <Flex vertical gap={20}>
                                <span>Appuyer sur le lien ci-dessous pour créer un nouveau département</span>
                                <Link to={text.org.group.department.add.href}>{text.org.group.department.add.label}</Link>
                            </Flex>
                        }
                        icon={<LuFileText size={100} style={{color: MAIN_COLOR}} />}
                    />
                )}
            </Responsive></>) : schoolSections?.length ? (
               <EmptyPage
                   title={`Aucun département requis pour ce${schoolSections?.length > 1 ? 's' : ''} niveau${schoolSections?.length > 1 ? 'x' : ''}`}
                   subTitle={<p>
                       Il n’est pas nécessaire de créer des départements. Le{schoolSections?.length > 1 ? 's' : ''} niveau{schoolSections?.length > 1 ? 'x' : ''} de votre établissement:&nbsp;
                       {schoolSections?.map((s, i) => (<Tag key={`${s}-${i}`} color={MAIN_COLOR}>{SectionType[s]}</Tag>))}
                       n’en {schoolSections?.length > 1 ? 'ont' : 'a'} pas besoin.
                   </p>}
                   icon={<LuUniversity size={80} />}
                   btnUrl={text.org.group.school.href}
                   btnIcon={<LuArrowLeft size={15} />}
                   btnLabel='Retour'
               />
            ): <EmptyPage
                title={"Votre école n'a aucun grade"}
                subTitle={<p>Les départements nécessitent des niveaux (grades) afin d’associer matières, enseignants et
                    ressources à chaque année d’études, organiser les cours et suivre la progression des élèves.</p>}
                icon={<LuUniversity size={80} />}
                btnUrl={text.org.group.grade.add.href}
                btnIcon={<LuArrowRight size={15} />}
                btnLabel='Ajouter un grade'
            />}
        </PageWrapper>
        </>
    )
}

export default DepartmentPage;