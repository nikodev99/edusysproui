import {AddStepForm} from "@/components/custom/AddStepForm.tsx";
import {text} from "@/core/utils/text_display.ts";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {useForm} from "react-hook-form";
import {
    ClasseSchemaMerge,
    CourseSchemaMerge,
    teacherSchoolAffiliationSchema,
    TeacherSchoolAffiliationSchema
} from "@/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {useLocation, useParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {ContractOwner, UserPermission} from "@/core/shared/sharedEnums.ts";
import {Teacher} from "@/entity";
import {setName} from "@/core/utils/utils.ts";
import {TeacherAcademicForm} from "@/components/ui-kit-teacher";
import {EmployeeContractForm} from "@/components/forms/EmployeeContractForm.tsx";
import {catchError} from "@/data/action/error_catch.ts";
import {loggedUser} from "@/auth/jwt/LoggedUser.ts";
import {useAuth} from "@/hooks/useAuth.ts";

const AffiliateNewTeacherPage = () => {
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const [classes, setClasses] = useState<ClasseSchemaMerge[]>([])
    const [defaultClasses, setDefaultClasses] = useState<number[]>()
    const [courses, setCourses] = useState<CourseSchemaMerge[]>([])
    const [defaultCourses, setDefaultCourses] = useState<number[]>()
    const [validationTriggered, setValidationTriggered] = useState(false)
    const {state} = useLocation()
    const {id} = useParams()
    const {toTeacher, toAffiliateTeacher, toAddTeacher} = useRedirect()
    const {useGetTeacherPersonalInfo, useAffiliateTeacher} = useTeacherRepo(UserPermission.TEACHER)
    const {userSchool} = useAuth()
    const form = useForm<TeacherSchoolAffiliationSchema>({
        resolver: zodResolver(teacherSchoolAffiliationSchema)
    })

    const teacherId = state ? undefined : id
    const teacherInfo = useGetTeacherPersonalInfo(teacherId)
    const affiliateTeacher = useAffiliateTeacher()
    const teacher = useMemo(() => (state ? state : {id: teacherId, personalInfo: teacherInfo}) as Teacher, [state, teacherId, teacherInfo])

    const metadata = {
        title: text.teacher.group.affiliate.label,
        description: "Ajouter enseignant"
    }

    const items = [
        {title: text.teacher.label, setRedirect: toTeacher},
        {title: text.teacher.group.affiliate.label, setRedirect: toAffiliateTeacher},
        {title: `Affilié ${setName(teacher?.personalInfo)}`}
    ];

    const {control, formState: {errors, isLoading}, setValue, trigger, reset, clearErrors} = form

    useEffect(() => {
        reset({
            school: {
                id: userSchool?.id,
            },
            teacher: {
                id: teacher?.id
            },
            contract: {
                createdBy: {id: loggedUser.getUser()?.personalInfo},
            }
        })
    }, [reset, teacher?.id, userSchool?.id]);

    const handleTeacherClassCourse = ({ courses, classes }: { courses: CourseSchemaMerge[], classes: ClasseSchemaMerge[] }) => {
        setValue('classes', classes?.map(c => ({classe: {id: c.id}})), {
            shouldValidate: true,
        })
        setValue('courses', courses?.map(c => ({course: {id: c.id}})), {
            shouldValidate: true,
        })
    }

    const validate = (validateFields: boolean, current: number) => {
        if (validateFields) {
            setValidationTriggered(true);
            clearErrors()
            toAddTeacher(current + 1, true, teacher)
        }
    }

    const triggerNext = async (current: number) => {
        let validateFields: boolean
        try {
            switch (current) {
                case 0:
                    if (classes.length != 0) {
                        handleTeacherClassCourse({
                            classes: classes,
                            courses: courses
                        })
                        setDefaultCourses((courses ? courses.map(c => c.id) : []) as number[])
                        setDefaultClasses(classes.map(c => c.id))
                    }
                    validate(classes.length != 0, current)
                    break
                case 1:
                    validateFields = await trigger([
                        "contract.role", "contract.contractType", "contract.salaryBasis", "contract.currency", "contract.startDate",
                    ])
                    validate(validateFields, current)
                    break
            }
        }catch (error) {
            console.error(error)
        }
    }

    const handleClassesAndCourses = ({ courses, classes }: { courses?: CourseSchemaMerge[], classes?: ClasseSchemaMerge[] }) => {
        setClasses(classes!)
        setCourses(courses ? courses : [])
    }

    const steps = [
        {
            title: "Matières & Classes",
            content: <TeacherAcademicForm
                onClose={handleClassesAndCourses}
                defaultClasses={defaultClasses}
                defaultCourses={defaultCourses}
            />
        },
        {
            title: 'Embauche',
            content: <EmployeeContractForm
                type={ContractOwner.TEACHER}
                control={control as never}
                errors={errors}
                edit={false}
                clearErrors={clearErrors as never}
                validationTriggered={validationTriggered}
            />
        },
    ]

    const onSubmit = (data: TeacherSchoolAffiliationSchema) => {
        setErrorMessage("")
        setSuccessMessage("")

        affiliateTeacher.mutate(data, {
            onSuccess: (resp) => {
                if (resp.status >= 200 && resp.status < 300) {
                    setSuccessMessage(resp.data)
                    reset()
                }else {
                    setErrorMessage("Technical Error")
                }
            },
            onError: (error) => {
                setErrorMessage(catchError(error) as string)
            }
        })
    }

    return(
        <AddStepForm
            docTitle={metadata}
            breadCrumb={items}
            prevRedirect={(step) => toAddTeacher(step, true, teacher)}
            handleForm={form}
            triggerNext={triggerNext}
            onSubmit={onSubmit}
            steps={steps}
            messages={{success: successMessage, error: errorMessage}}
            isPending={isLoading}
            currentNumber={2}
        />
    )
}

export default AffiliateNewTeacherPage