import {InsertSchema} from "../../custom/InsertSchema.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {AcademicYearSchema, academicYearSchema} from "../../../schema";
import {AcademicYearForm} from "../../forms/AcademicYearForm.tsx";
import {useMemo} from "react";
import {saveAcademicYear} from "../../../data/repository/academicYearRepository.ts";
import {loggedUser} from "../../../auth/jwt/LoggedUser.ts";

export const SaveAcademicYear = ({open, onClose}: {open: boolean, onClose: () => void}) => {
    const form = useForm<AcademicYearSchema>({
        resolver: zodResolver(academicYearSchema)
    })

    const explain = useMemo(() => "L’ajout d’une nouvelle année académique sert de contexte temporel global " +
        "structurant l’application."
    , [])

    const schoolId = useMemo(() => loggedUser.getSchool()?.id, [])

    const onSubmit = (data: AcademicYearSchema) => {
        const registerData = {...data, school: {...data.school, id: schoolId}}
        return saveAcademicYear(registerData)
    }

    return(
        <InsertSchema
            open={open}
            onCancel={onClose}
            data={academicYearSchema}
            title="Enregistrer une nouvelle année académique"
            customForm={
                <AcademicYearForm
                    control={form.control}
                    errors={form.formState.errors}
                    edit={false}
                />
            }
            okText="Enregistrer"
            messageSuccess="Nouvelle année enregistrer avec success"
            explain={explain}
            handleForm={form}
            postFunc={onSubmit}
        />
    )
}