import {InsertModal} from "../../custom/InsertSchema.tsx";
import {useForm, UseFormReturn} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {AcademicYearSchema, academicYearSchema} from "../../../schema";
import {AcademicYearForm} from "../../forms/AcademicYearForm.tsx";
import {useMemo} from "react";
import {saveAcademicYear} from "../../../data/repository/academicYearRepository.ts";
import {Alert, Card, Divider, Typography} from "antd";
import {Semester} from "../../../entity";
import {SemesterForm} from "../../forms/SemesterForm.tsx";

export const SaveAcademicYear = ({open, onClose, schoolId, semesterStructure}: {open: boolean, onClose: () => void, schoolId?: string, semesterStructure?: Semester[]}) => {
    const form = useForm<AcademicYearSchema>({
        resolver: zodResolver(academicYearSchema)
    })

    const explain = useMemo(() => "L’ajout d’une nouvelle année académique sert de contexte temporel global " +
        "structurant l’application."
    , [])

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
                <AcademicYearCustomFields form={form} semester={semesterStructure} />
            }
            okText="Enregistrer"
            messageSuccess="Nouvelle année enregistrer avec success"
            explain={explain}
            handleForm={form}
            postFunc={onSubmit}
        />
    )
}

const AcademicYearCustomFields = ({form, semester}: {form: UseFormReturn<AcademicYearSchema>, semester?: Semester[]}) => {
    const {Text} = Typography
    
    const semesterForm = useMemo(() => {
        if (semester && semester?.length > 0 ) {
            return (
                semester?.map((s: Semester, index: number) => {
                    form.setValue(`semesters.${index}.template.id`, s.template.id)
                    return (
                        <Card key={`${s?.semesterId}-${index}`} title={<Text strong>{s.template.semesterName}</Text>} style={{marginBottom: '20px'}}>
                            <SemesterForm
                                control={form.control}
                                errors={form.formState.errors}
                                edit={false}
                                parent={`semesters.${index}`}
                                data={s}
                            />
                        </Card>
                    )
                })
            )
        }else {
            return (
                <Alert message="Votre école n'a pas de structure de semestre. " type="warning" showIcon/>
            )
        }
    }, [Text, form, semester])

    return(
        <>
            <AcademicYearForm
                control={form.control}
                errors={form.formState.errors}
                edit={false}
            />
            <Divider />
            {
                semesterForm
            }
        </>
    )
}