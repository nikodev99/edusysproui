import {text} from "../../utils/text_display.ts";
import {useEffect, useState, useTransition} from "react";
import {TeacherAcademicForm} from "../../components/ui-kit-teacher";
import {useForm} from "react-hook-form";
import {AddressOwner} from "../../core/shared/sharedEnums.ts";
import AddressForm from "../../components/forms/AddressForm.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {TeacherClassCourseSchema, TeacherSchema} from "../../utils/interfaces.ts";
import {teacherSchema} from "../../schema";
import {AddStepForm} from "../../components/custom/AddStepForm.tsx";
import {customDot} from "../../utils/tsxUtils.tsx";
import {redirectTo} from "../../context/RedirectContext.ts";
import {TeacherForm} from "../../components/forms/TeacherForm.tsx";
import {Gender} from "../../entity/enums/gender.ts";
import {Status} from "../../entity/enums/status.ts";
import {UploadCareForm} from "../../components/forms/UploadCareForm.tsx";
import {OutputFileEntry} from "@uploadcare/blocks";
import {TeacherHiring} from "../../components/ui-kit-teacher/component/TeacherHiring.tsx";
import {addTeacher} from "../../data";

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
    const [isReset, setIsReset] = useState<boolean>(false)
    const [teacherClassCourse, setTeacherClassCourse] = useState<TeacherClassCourseSchema[]>([])
    const [isPending, startTransition] = useTransition()

    const addUrl = text.teacher.group.add.href

    const form = useForm<TeacherSchema>({
        resolver: zodResolver(teacherSchema)
    })

    const {watch, control, formState: {errors, isLoading}, setValue, trigger, reset} = form

    const formData = watch()
    console.log('Data entered: ', formData)
    console.log('error encountered: ', errors)

    const handleTeacherClassCourse = (classCourses: TeacherClassCourseSchema[]) => {
        setValue('teacherClassCourses', classCourses, {
            shouldValidate: true,
        })
        setValue('school.id', text.schoolID, {
            shouldValidate: true
        })
    }

    useEffect(() => {
        if(formData) {
            setShowMaidenName(formData.gender === Gender.FEMME && formData.status === Status.MARIE)
        }
    }, [formData, teacherClassCourse])

    const validate = (validateFields: boolean, current: number) => {
        if (validateFields) {
            setValidationTriggered(true);
            redirectTo(`${addUrl}?step=${current + 1}`)
        }
    }

    const triggerNext = async (current: number) => {
        let validateFields
        try {
            switch (current) {
                case 0:
                    validateFields = await trigger([
                        "lastName", "firstName", "gender", "status", "birthDate", "cityOfBirth", "nationality", "emailId",
                        "telephone"
                    ])
                    validate(validateFields, current)
                    break
                case 1:
                    validateFields = await trigger([
                        'address.number', 'address.street', 'address.neighborhood', 'address.city', 'address.country'
                    ])
                    validate(validateFields, current)
                    break
                case 2:
                    if (teacherClassCourse.length != 0) {
                        handleTeacherClassCourse(teacherClassCourse)
                    }
                    validate(teacherClassCourse.length != 0, current)
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

    const handleClassesAndCourses = (finalArray: TeacherClassCourseSchema[]) => {
        setTeacherClassCourse(finalArray)
    }

    const steps = [
        {
            title: 'Information Personnelles',
            content: <TeacherForm
                control={control}
                errors={errors}
                edit={false}
                showField={showMaidenName}
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
            />
        },
        {
            title: "Matières & Classes",
            content: <TeacherAcademicForm onClose={handleClassesAndCourses} reset={isReset} />
        },
        {
            title: "Embauche",
            content: <TeacherHiring
                control={control}
                errors={errors}
                showField={false}
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
        console.log('Valeur à insérer: ', data);

        startTransition(() => {
            if(image) {
                data = {...data, image: image}
            }

            addTeacher(data)
                .then(resp => {
                    if (resp.isSuccess) {
                        setSuccessMessage(resp.success)
                        reset()
                        setIsReset(true)
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
            HandleForm={form}
            triggerNext={triggerNext}
            onSubmit={onsubmit}
            steps={steps}
            messages={{success: successMessage, error: errorMessage}}
            isPending={isLoading || isPending}
            stepsDots={customDot}
        />
    )
}

export default AddTeacher;