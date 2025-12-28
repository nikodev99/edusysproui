import {Params, useLocation, useParams} from "react-router-dom";
import {ReactNode, useEffect, useMemo, useState} from "react";
import {useStudentRepo} from "@/hooks/actions/useStudentRepo.ts";
import {Enrollment} from "@/entity";
import {setName, setPlural} from "@/core/utils/utils.ts";
import {text} from "@/core/utils/text_display.ts";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {AddStepForm} from "@/components/custom/AddStepForm.tsx";
import {useForm} from "react-hook-form";
import {ReprimandForm} from "@/components/forms/ReprimandForm.tsx";
import {ReprimandSchema} from "@/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {reprimandSchema} from "@/schema/models/reprimandSchema.ts";
import Datetime from "@/core/datetime.ts";
import {useAuth} from "@/hooks/useAuth.ts";
import {PunitionForm} from "@/components/forms/PunitionForm.tsx";
import {useReprimandRepo} from "@/hooks/actions/useReprimandRepo.ts";

const StudentDisciplinePage = () => {
    const [student, setStudent] = useState<Enrollment | null>(null)
    const [studentId, setStudentId] = useState<string | null>(null)
    const [validationTriggered, setValidationTriggered] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const {toViewStudent, toDiscipline} = useRedirect()
    const location = useLocation()
    const { id }: Readonly<Params> = useParams()
    const {useGetStudent} = useStudentRepo()
    const {useInsertReprimand} = useReprimandRepo()
    const studentState: Enrollment | undefined = location.state

    const {data, isSuccess} = useGetStudent(studentId as string)
    const {user} = useAuth()

    const {insert, isLoading} = useInsertReprimand()

    const form = useForm<ReprimandSchema>({
        resolver: zodResolver(reprimandSchema),
    })
    
    const {ind} = useMemo(() => ({
        ind: student?.student?.personalInfo
    }), [student?.student?.personalInfo])

    const studentName = student ? setName(ind) : 'Étudiant'

    useEffect(() => {
        if (studentState) {
            setStudent(studentState)
        }else {
            setStudentId(id as string)
            if (isSuccess)
                setStudent(data)
        }
    }, [data, id, isSuccess, studentState]);

    const {control, formState: {errors, isSubmitting, submitCount}, trigger, clearErrors, reset} = form

    // Add a new useEffect to reset the form when student data loads
    useEffect(() => {
        if (student) {
            reset({
                academicYear: {
                    id: student.academicYear?.id
                },
                student: {
                    id: student.id
                },
                classe: {
                    id: student.classe?.id
                },
                reprimandDate: Datetime.now().toDayjs(),
                issuedBy: {
                    id: user?.personalInfo
                },
            })
        }
    }, [student, user?.personalInfo, reset])

    const redirectToStudentView = () => {
        toViewStudent(id as string, ind)
    }

    const steps: {title: ReactNode, content: ReactNode}[] = [
        {
            title: 'Mise en cause',
            content: <ReprimandForm
                control={control}
                errors={errors}
                reprimandee={student as Enrollment}
                validationTriggered={validationTriggered}
            />
        },
        {
            title: 'Punition',
            content: <PunitionForm
                control={control as never}
                errors={errors}
                validationTriggered={validationTriggered}
            />
        }
    ]

    const nextValidation = (validateFields: boolean, current: number) => {
        if (validateFields) {
            setValidationTriggered(true);
            clearErrors()
            toDiscipline(id as string, student as Enrollment, current + 1)
        }
    }

    const prevValidation = (current: number) => {
        toDiscipline(id as string, student as Enrollment, current)
    }

    const triggerNext = async (current: number) => {
        let validateFields: boolean
        try {
            switch (current) {
                case 0:
                    validateFields = await trigger([
                        'academicYear.id', 'student.id', 'classe.id', 'reprimandDate', 'type', 'description', 'issuedBy.id'
                    ])
                    nextValidation(validateFields, current)
                    break
            }
        }catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = (data: ReprimandSchema) => {
        setSuccessMessage(undefined)
        setErrorMessage(undefined)

        if (submitCount === 0) {
            insert(data, [])
                .then(resp => {
                    if (resp.success)
                        setSuccessMessage("Réprimande ajouté avec succès")
                    else
                        setErrorMessage(`${resp.status} - ${resp.error}`)
                })
        }else {
            setErrorMessage("Attention vous allez enregistrer les mêmes données 2 fois.")
        }
    }

    return(
        <AddStepForm
            docTitle={{
                title: 'Ajouter une sanction disciplinaire',
                description: 'Discipline description'
            }}
            breadCrumb={[
                {
                    title: setPlural(text.student.label),
                    path: text.student.href
                },
                {
                    title: studentName,
                    setRedirect: redirectToStudentView
                },
                {
                    title: 'Sanction disciplinaire'
                }
            ]}
            handleForm={form}
            prevRedirect={prevValidation}
            triggerNext={triggerNext}
            onSubmit={handleSubmit}
            steps={steps}
            messages={{
                success: successMessage,
                error: errorMessage
            }}
            setRedirect={redirectToStudentView}
            modalMessage={"Souhaitez-vous continuer avec l'ajout de cette réprimande ?"}
            isPending={(isSubmitting || isLoading) as boolean}
            currentNumber={2}
        />
    )
}

export default StudentDisciplinePage