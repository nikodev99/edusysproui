import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {Alert, Button, Divider, Flex} from "antd";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import {useGradeRepo} from "../../hooks/useGradeRepo.ts";
import Grid from "../../components/ui/layout/Grid.tsx";
import {useAcademicYearRepo} from "../../hooks/useAcademicYearRepo.ts";
import {GradeCard} from "../../components/ui-kit-setting";
import {AcademicYear} from "../../entity";
import {useRedirect} from "../../hooks/useRedirect.ts";
import {useMemo} from "react";
import EmptyPage from "../EmptyPage.tsx";
import Marquee from "react-fast-marquee";

const GradePage = () => {
    useDocumentTitle({
        title: "Setting - Grade",
        description: "Setting description",
    })

    const {context} = useBreadCrumb({
        bCItems: [
            {title: text.org.group.school.label, path: text.org.group.school.href},
            {title: text.org.group.grade.label}
        ]
    })

    const {toSaveGrade} = useRedirect()

    const {useGetCurrentAcademicYear} = useAcademicYearRepo()
    const {useGetAllGradesWithPlannings} = useGradeRepo()
    const academicYear = useGetCurrentAcademicYear()
    const grades = useGetAllGradesWithPlannings(academicYear?.id as string)

    const items = useMemo(() => grades?.map((grade) => (
        <Grid xs={24} md={12} lg={8} key={grade.id}>
            <GradeCard data={grade} academicYear={academicYear as AcademicYear} />
        </Grid>
    )), [academicYear, grades])

    console.log('Grades: ', grades)

    return(
        <>
            {context}
            <Divider orientation='left'>Manager les grades</Divider>
            <Flex justify='end'>
                <Button onClick={toSaveGrade} type='primary'>Ajouter une grade</Button>
            </Flex>
            <Divider />
            <Responsive gutter={[16, 16]}>
                {items && items?.length > 0 ? items : (
                    <Grid xs={24} md={24} lg={24}>
                        <EmptyPage
                            title="Aucun grade trouvé dans le système"
                            subTitle={
                                <Alert
                                    type='info'
                                    showIcon
                                    message={(
                                        <Marquee pauseOnHover gradient={false}>
                                            <span style={{ display: "inline-block", paddingRight: "3rem" }}>
                                                Les niveaux scolaires sont essentiels car ils organisent l'enseignement en étapes
                                                adaptées au développement des élèves, permettant une progression pédagogique cohérente,
                                                une évaluation pertinente et une gestion efficace des ressources de l'école.
                                            </span>
                                        </Marquee>
                                    )}
                                />
                            }
                            btnLabel={text.org.group.grade.add.label}
                            btnUrl={text.org.group.grade.add.href}
                        />
                    </Grid>
                )}
            </Responsive>
        </>
    )
}

export default GradePage;