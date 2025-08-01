import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {Button, Divider, Flex} from "antd";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import {useGradeRepo} from "../../hooks/useGradeRepo.ts";
import Grid from "../../components/ui/layout/Grid.tsx";
import {useAcademicYearRepo} from "../../hooks/useAcademicYearRepo.ts";
import {GradeCard} from "../../components/ui-kit-setting";
import {AcademicYear} from "../../entity";
import {useRedirect} from "../../hooks/useRedirect.ts";
import {useMemo} from "react";

const GradePage = () => {
    useDocumentTitle({
        title: "Setting - Grade",
        description: "Setting description",
    })

    const {context} = useBreadCrumb({
        bCItems: [
            {title: 'Setting'},
            {title: text.settings.group.academicYear.label}
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

    return(
        <>
            {context}
            <Divider orientation='left'>Manager les grades</Divider>
            <Flex justify='end'>
                <Button onClick={toSaveGrade} type='primary'>Ajouter une grade</Button>
            </Flex>
            <Divider />
            <Responsive gutter={[16, 16]}>
                {items}
            </Responsive>
        </>
    )
}

export default GradePage;