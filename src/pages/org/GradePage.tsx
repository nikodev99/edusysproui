import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {Alert, Button, Divider} from "antd";
import {useGradeRepo} from "../../hooks/actions/useGradeRepo.ts";
import {useAcademicYearRepo} from "../../hooks/actions/useAcademicYearRepo.ts";
import {GradeCard} from "../../components/ui-kit-org";
import {AcademicYear} from "../../entity";
import {useRedirect} from "../../hooks/useRedirect.ts";
import {ReactNode, useMemo} from "react";
import EmptyPage from "../EmptyPage.tsx";
import Marquee from "react-fast-marquee";
import Block from "../../components/view/Block.tsx";

const GradePage = () => {
    useDocumentTitle({
        title: "Grade",
        description: "Setting description",
    })

    const {context} = useBreadCrumb({
        bCItems: [
            {title: text.org.group.school.label, path: text.org.group.school.href},
            {title: text.org.group.grade.label}
        ]
    })

    const {toSaveGrade, toEditGrade} = useRedirect()

    const {useGetCurrentAcademicYear} = useAcademicYearRepo()
    const {useGetAllGradesWithPlannings} = useGradeRepo()
    const academicYear = useGetCurrentAcademicYear()
    const grades = useGetAllGradesWithPlannings(academicYear?.id as string)

    /**
     * Memoized list of GradeCard components generated based on the provided grades and academicYear.
     *
     * This variable leverages React's `useMemo` hook to optimize rendering
     * by recalculating the GradeCard components only when either `grades`
     * or `academicYear` dependencies change.
     *
     * @constant
     * @type {Element[]}
     * @memberof Component
     * @param {Array} grades - Array of grade objects used to create GradeCard components.
     * @param {AcademicYear} academicYear - The academic year associated with the grades.
     * @return {Element[] | ReactNode[]}
     */
    const items: ReactNode[] = useMemo(() => grades?.map((grade) => (
        <GradeCard key={`grade-${grade?.id}`} data={grade} academicYear={academicYear as AcademicYear} toEdit={toEditGrade} />
    )), [academicYear, grades, toEditGrade])

    return(
        <>
            {context}
            <Divider orientation='right'>
                <Button onClick={toSaveGrade} type='primary'>Ajouter une grade</Button>
            </Divider>
            {
                items && items?.length > 0 ? <Block items={items} /> : <EmptyPage
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
            }
        </>
    )
}

export default GradePage;