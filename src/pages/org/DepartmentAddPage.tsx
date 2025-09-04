import {DepartmentForm} from "../../components/forms/DepartmentForm.tsx";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {useForm} from "react-hook-form";
import {InsertSchema} from "../../components/custom/InsertSchema.tsx";
import {DepartmentSchema, departmentSchema} from "../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import PageWrapper from "../../components/view/PageWrapper.tsx";
import {saveDepartment} from "../../data/repository/departmentRepository.ts";
import {Link} from "react-router-dom";
import {useRedirect} from "../../hooks/useRedirect.ts";
import {loggedUser} from "../../auth/jwt/LoggedUser.ts";

export const DepartmentAddPage = () => {

    const {context} = useBreadCrumb({
        bCItems: [
            {title: text.org.label, path: text.org.href},
            {title: text.org.group.department.label, path: text.org.group.department.href},
            {title: text.org.group.department.add.label},
        ]
    })

    const { toDepartment } = useRedirect()

    const form = useForm<DepartmentSchema>({
        resolver: zodResolver(departmentSchema)
    });

    const {control, formState: {errors}} = form

    const handleSubmit = (data: DepartmentSchema) => {
        const registeredData = {
            ...data,
            school: {
                ...data.school,
                id: loggedUser.getSchool()?.id as string,
            }
        }

        console.log("DATA: ", registeredData)
        return saveDepartment(registeredData)
    }

    const onCancel = () => {
        toDepartment()
    }

    console.log('ERRORS: ', errors)

    return(
        <>
            {context}
            <InsertSchema
                data={departmentSchema}
                customForm={
                    <PageWrapper>
                        <DepartmentForm
                            errors={errors}
                            control={control}
                        />
                    </PageWrapper>
                }
                handleForm={form}
                okText={'Soumettre'}
                cancelText={'Annuler'}
                onClose={onCancel}
                postFunc={handleSubmit}
                explain={"Un département structure et spécialise l'enseignement en regroupant les matières et les responsables, " +
                    "renforçant la coordination pédagogique, la qualité des formations et la gestion administrative"}
                messageSuccess={
                    <p>Nouveau département ajouté avec succès. <Link to={text.org.group.department.href}>Retour</Link></p>
                }
            />
        </>
    )
}