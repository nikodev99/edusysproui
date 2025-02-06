import {text} from "../../utils/text_display.ts";
import {useEffect, useState, useTransition} from "react";
import {TeacherAcademicForm} from "../../components/ui-kit-teacher";
import {useForm} from "react-hook-form";
import {AddressOwner, IndividualType} from "../../core/shared/sharedEnums.ts";
import AddressForm from "../../components/forms/AddressForm.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {ClasseSchemaMerge, CourseSchemaMerge, TeacherSchema, teacherSchema} from "../../schema";
import {AddStepForm} from "../../components/custom/AddStepForm.tsx";
import {CustomDot} from "../../utils/tsxUtils.tsx";
import {redirectTo} from "../../context/RedirectContext.ts";
import {TeacherForm} from "../../components/forms/TeacherForm.tsx";
import {Gender} from "../../entity/enums/gender.tsx";
import {Status} from "../../entity/enums/status.ts";
import {UploadCareForm} from "../../components/forms/UploadCareForm.tsx";
import {OutputFileEntry} from "@uploadcare/blocks";
import {addTeacher} from "../../data";
import {IndividualForm} from "../../components/forms/IndividualForm.tsx";

const AddTeacher = () => {

    const metadata = {
        title: "Ajouter enseignant",
        description: "Ajouter enseignant"
    }

    const items = [
        {
            title: text.teacher.label,
            path: text.teacher.href
        },
        {
            title: text.teacher.group.add.label
        }
    ];

    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const [validationTriggered, setValidationTriggered] = useState(false)
    const [showMaidenName, setShowMaidenName] = useState(false)
    const [image, setImage] = useState<string | undefined>(undefined)
    const [classes, setClasses] = useState<ClasseSchemaMerge[]>([])
    const [defaultClasses, setDefaultClasses] = useState<number[]>()
    const [courses, setCourses] = useState<CourseSchemaMerge[]>([])
    const [defaultCourses, setDefaultCourses] = useState<number[]>()
    const [isPending, startTransition] = useTransition()

    const addUrl = text.teacher.group.add.href

    const form = useForm<TeacherSchema>({
        resolver: zodResolver(teacherSchema)
    })

    const {watch, control, formState: {errors, isLoading}, setValue, trigger, reset, clearErrors} = form

    const formData = watch()

    const handleTeacherClassCourse = ({ courses, classes }: { courses: CourseSchemaMerge[], classes: ClasseSchemaMerge[] }) => {
        setValue('classes', classes, {
            shouldValidate: true,
        })
        setValue('courses', courses, {
            shouldValidate: true,
        })
        setValue('school.id', text.schoolID, {
            shouldValidate: true
        })
    }

    useEffect(() => {
        if(formData) {
            setShowMaidenName(formData?.personalInfo?.gender === Gender.FEMME && formData?.personalInfo?.status === Status.MARIE)
        }
    }, [formData, classes, courses, errors])

    const validate = (validateFields: boolean, current: number) => {
        if (validateFields) {
            setValidationTriggered(true);
            clearErrors()
            redirectTo(`${addUrl}?step=${current + 1}`)
        }
    }

    const triggerNext = async (current: number) => {
        let validateFields
        try {
            switch (current) {
                case 0:
                    validateFields = await trigger([
                        "personalInfo.lastName", "personalInfo.firstName", "personalInfo.gender", "personalInfo.status",
                        "personalInfo.birthDate", "personalInfo.birthCity", "personalInfo.nationality", "personalInfo.emailId",
                        "personalInfo.telephone"
                    ])
                    validate(validateFields, current)
                    break
                case 1:
                    validateFields = await trigger([
                        'personalInfo.address.number', 'personalInfo.address.street', 'personalInfo.address.neighborhood',
                        'personalInfo.address.city', 'personalInfo.address.country'
                    ])
                    validate(validateFields, current)
                    break
                case 2:
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
                case 3:
                    validateFields = await trigger([
                        "salaryByHour"
                    ])
                    validate(validateFields, current)
                    break
            }
        }catch (error) {
            console.error(error)
        }
    }

    const handleUploadChange = (items?: {allEntries: OutputFileEntry[]}) => {
        const file = items?.allEntries[0]
        if (file && file.status === 'success' && file.cdnUrl && file.name) {
            setImage(`${file.cdnUrl}${file.name}`)
        }
    }

    const handleClassesAndCourses = ({ courses, classes }: { courses?: CourseSchemaMerge[], classes?: ClasseSchemaMerge[] }) => {
        setClasses(classes!)
        setCourses(courses ? courses : [])
    }

    const steps = [
        {
            title: 'Information Personnelles',
            content: <IndividualForm
                control={control}
                errors={errors}
                edit={false}
                showField={showMaidenName}
                clearErrors={clearErrors}
                type={IndividualType.TEACHER}
            />
        },
        {
            title: 'Adresse',
            content: <AddressForm
                control={control}
                type={AddressOwner.TEACHER}
                edit={false}
                errors={errors}
                validationTriggered={validationTriggered}
                clearErrors={clearErrors}
            />
        },
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
            content: <TeacherForm
                control={control}
                errors={errors}
                edit={false}
                clearErrors={clearErrors}
            />
        },
        {
            title: "Attachement",
            content: <UploadCareForm imageCdn={image} onChange={handleUploadChange}/>
        }
    ]

    const onsubmit = (data: TeacherSchema) => {
        setErrorMessage("")
        setSuccessMessage("")

        startTransition(() => {
            if(image) {
                data = {...data, personalInfo: {...data.personalInfo, image: image}}
            }

            addTeacher(data)
                .then(resp => {
                    if (resp.isSuccess) {
                        setSuccessMessage(resp.success)
                        reset()
                    }else {
                        setErrorMessage(resp.error)
                    }
                })
        })

    }

    return(
        <AddStepForm
            docTitle={metadata}
            breadCrumb={items}
            addLink={addUrl}
            handleForm={form}
            triggerNext={triggerNext}
            onSubmit={onsubmit}
            steps={steps}
            messages={{success: successMessage, error: errorMessage}}
            isPending={isLoading || isPending}
            stepsDots={CustomDot}
            currentNumber={5}
            follow="Souhaitez vous continuer à ajouter "
        />
    )
}

export default AddTeacher;