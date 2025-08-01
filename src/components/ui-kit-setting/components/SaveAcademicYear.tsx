import {InsertModal} from "../../custom/InsertSchema.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {AcademicYearSchema, academicYearSchema, semesterSchema, SemesterSchema} from "../../../schema";
import {AcademicYearForm} from "../../forms/AcademicYearForm.tsx";
import {useMemo} from "react";
import {saveAcademicYear} from "../../../data/repository/academicYearRepository.ts";
import {loggedUser} from "../../../auth/jwt/LoggedUser.ts";
import {Divider} from "antd";
import {SemesterForm} from "../../forms/SemesterForm.tsx";

export const SaveAcademicYear = ({open, onClose}: {open: boolean, onClose: () => void}) => {
    const form = useForm<AcademicYearSchema>({
        resolver: zodResolver(academicYearSchema)
    })

    const semesterForm = useForm<SemesterSchema>({
        resolver: zodResolver(semesterSchema)
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
        <InsertModal
            open={open}
            onCancel={onClose}
            data={academicYearSchema}
            title="Enregistrer une nouvelle année académique"
            customForm={
                <>
                    <AcademicYearForm
                        control={form.control}
                        errors={form.formState.errors}
                        edit={false}
                    />
                    <Divider />
                    <SemesterForm
                        control={semesterForm.control}
                        errors={semesterForm.formState.errors}
                        edit={false}
                    />
                </>
            }
            okText="Enregistrer"
            messageSuccess="Nouvelle année enregistrer avec success"
            explain={explain}
            handleForm={form}
            postFunc={onSubmit}
        />
    )
}