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

const StudentDisciplinePage = () => {
    const [student, setStudent] = useState<Enrollment | null>(null)
    const [studentId, setStudentId] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const {toViewStudent} = useRedirect()
    const location = useLocation()
    const { id }: Readonly<Params> = useParams()
    const {useGetStudent} = useStudentRepo()
    const studentState: Enrollment | undefined = location.state
    const {data, isSuccess} = useGetStudent(studentId as string)

    const form = useForm()
    
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

    const {control, formState: {errors, isSubmitting}} = form

    const steps: {title: ReactNode, content: ReactNode}[] = [
        {
            title: 'Mise en cause',
            content: <ReprimandForm
                control={control}
                errors={errors}
                reprimandee={student}
            />
        },
        {
            title: 'Punition',
            content: <div>Punition Form</div>
        }
    ]

    const triggerNext = async (current: number) => {
        console.log({current})
    }

    const handleSubmit = (data: object) => {
        console.log(data)
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
                    setRedirect: () => toViewStudent(id as string, ind)
                },
                {
                    title: 'Sanction disciplinaire'
                }
            ]}
            addLink={text.student.group.view + '/discipline'}
            handleForm={form}
            triggerNext={triggerNext}
            onSubmit={handleSubmit}
            steps={steps}
            messages={{
                success: successMessage,
                error: errorMessage
            }}
            isPending={isSubmitting}
            currentNumber={2}
        />
    )
}

export default StudentDisciplinePage