import {useForm} from "react-hook-form";
import {gradeSchema, GradeSchema} from "../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {InsertSchema} from "../../components/custom/InsertSchema.tsx";
import {GradeForm} from "../../components/forms/GradeForm.tsx";
import PageWrapper from "../../components/view/PageWrapper.tsx";
import {Divider} from "antd";
import {PlanningForm} from "../../components/forms/PlanningForm.tsx";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {useMemo} from "react";
import {saveGrade} from "../../data/repository/gradeRepository.ts";
import {loggedUser} from "../../auth/jwt/LoggedUser.ts";
import {useAcademicYearRepo} from "../../hooks/useAcademicYearRepo.ts";

export const GradeSavePage = () => {
    const {useGetCurrentAcademicYear} = useAcademicYearRepo()
    const currentAcademicYear = useGetCurrentAcademicYear();

    const {context} = useBreadCrumb({
        bCItems: [
            {title: text.org.group.school.label, path: text.org.group.school.href},
            {title: text.org.group.grade.label, path: text.org.group.grade.href},
            {title: text.org.group.grade.add.label}
        ]
    })

    const explain = useMemo(() => "Les niveaux scolaires sont essentiels car ils organisent l'enseignement en étapes" +
        "adaptées au développement des élèves, permettant une progression pédagogique cohérente," +
        "une évaluation pertinente et une gestion efficace des ressources de l'école.", [])
    const schoolId = useMemo(() => loggedUser.getSchool()?.id, [])

    const form = useForm<GradeSchema>({
        resolver: zodResolver(gradeSchema),
    })

    const {formState: {errors}, watch, control, clearErrors} = form

    console.log('WATCHER: ', watch())
    console.log('ERRORS: ', errors)

    const onSubmit = (data: GradeSchema) => {
        console.log({data})
        const registeredData = {
            ...data,
            school: {
                ...data.school,
                id: schoolId
            },
        }

        return saveGrade(registeredData)
    }

    return (
        <>
        {context}
        <PageWrapper>
            <InsertSchema
                data={gradeSchema}
                customForm={<>
                    <GradeForm
                        errors={errors}
                        control={control}
                        edit={false}
                        clearErrors={clearErrors}
                    />
                    <Divider />
                    <PlanningForm
                        control={control}
                        errors={errors}
                        edit={false}
                        parent='planning'
                        academicYear={currentAcademicYear?.id}
                    />
                </>
                }
                okText='Enregistrer'
                messageSuccess={"Nouveau grade avec plannings ajoutés avec succès"}
                handleForm={form}
                postFunc={onSubmit}
                explain={explain}
                marquee={true}
                cancelText={'Ajouter un planning'}
            />
        </PageWrapper>
        </>
    )
}