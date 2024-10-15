import {AddStepForm} from "../../components/custom/AddStepForm.tsx";
import {EnrollmentSchema, GuardianSchema, Metadata} from "../../utils/interfaces.ts";
import {text} from "../../utils/text_display.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {enrollmentSchema} from "../../schema";
import {useEffect, useState, useTransition} from "react";
import {Gender} from "../../entity/enums/gender.ts";
import {Status} from "../../entity/enums/status.ts";
import {Guardian, toGuardianSchema} from "../../entity";
import {redirectTo} from "../../context/RedirectContext.ts";
import {addStudent} from "../../data";
import StudentForm from "../../components/forms/StudentForm.tsx";
import AddressForm from "../../components/forms/AddressForm.tsx";
import {AddressOwner} from "../../core/shared/sharedEnums.ts";
import {AcademicForm, AttachmentForm, GuardianForm} from "../../components/ui-kit-student";
import HealthConditionForm from "../../components/forms/HealthConditionForm.tsx";
import {useToggle} from "../../hooks/useToggle.ts";
import {OutputFileEntry} from "@uploadcare/blocks";

const Inscription = () => {

    const documentTitle: Metadata = {
        title: "EduSysPro - Inscription",
        description: "Inscription description",
        hasEdu: false
    }

    const breadCrumb = [
        {
            title: text.student.label,
            path: text.student.href
        },
        {
            title: text.student.group.add.label
        }
    ]

    const [checked, setChecked] = useToggle(true)
    const [guardianId, setGuardianId] = useState<string | undefined>(undefined)
    const [guardian, setGuardian] = useState<Guardian | object>({})
    const [isExists, setIsExists] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()
    const [validationTriggered, setValidationTriggered] = useState(false)
    const [showMaidenName, setShowMaidenName] = useState(false)
    const [image, setImage] = useState<string | undefined>(undefined)
    const addLink = text.student.group.add.href

    const form = useForm<EnrollmentSchema>({
        resolver: zodResolver(enrollmentSchema)
    })

    const {watch, control, formState: {errors}, setValue, trigger, reset} = form
    //TODO in production stop the watching
    const formData = watch()

    useEffect(() => {
        const guardian = formData?.student?.guardian
        if (
            guardian && 'gender' in guardian && 'status' in guardian &&
            guardian?.gender === Gender.FEMME && guardian?.status === Status.MARIE
        ) {
            setShowMaidenName(true)
        }else {
            setShowMaidenName(false)
        }
        console.log('Error Occurred: ', errors)
    }, [errors, formData]);

    const validate = (validateFields: boolean, current: number) => {
        if (validateFields) {
            setValidationTriggered(true);
            redirectTo(`${addLink}?step=${current + 1}`)
        }
    }

    const setGuardianValues = (guardian: Guardian) => {
        const newGuardian: GuardianSchema = toGuardianSchema(guardian)
        setValue('student.guardian', newGuardian, {
            shouldValidate: true
        })
    }

    const handleUploadChange = (items?: {allEntries: OutputFileEntry[]}) => {
        const file = items?.allEntries[0]
        if (file && file.status === 'success' && file.cdnUrl && file.name) {
            setImage(`${file.cdnUrl}${file.name}`)
        }
    }

    const steps = [
        {
            title: 'Individuelle',
            content: <StudentForm control={control} errors={errors} edit={false} enroll={true} />
        },
        {
            title: 'Adresse',
            content: <AddressForm
                enroll={true}
                control={control}
                type={AddressOwner.STUDENT}
                edit={false}
                errors={errors}
                validationTriggered={validationTriggered}
            />
        },
        {
            title: 'Scolarité',
            content: <AcademicForm control={control} errors={errors} validationTriggered={validationTriggered} />
        },
        {
            title: 'Tuteur',
            content: <GuardianForm
                control={control}
                errors={errors}
                validationTriggered={validationTriggered}
                showField={showMaidenName}
                checked={checked}
                onChecked={setChecked}
                value={guardianId}
                setValue={setGuardianId}
                isExists={isExists}
                setIsExists={setIsExists}
                guardian={guardian as Guardian}
                setGuardian={setGuardian}
            />
        },
        {
            title: 'Santé',
            content: <HealthConditionForm control={control} errors={errors} edit={false} enroll={true} />
        },
        {
            title: 'Attachements',
            content: <AttachmentForm imageCdn={image}  onChange={handleUploadChange}/>
        }
    ]

    const triggerNext = async (current: number) => {
        let validateFields;
        try {
            switch (current) {
                case 0:
                    validateFields = await trigger([
                        'student.lastName', 'student.firstName', 'student.gender', 'student.dadName', 'student.momName',
                        'student.birthCity', 'student.birthDate', 'student.nationality'
                    ])
                    validate(validateFields, current)
                    break
                case 1:
                    validateFields = await trigger([
                        'student.address.number', 'student.address.street', 'student.address.neighborhood', 'student.address.city',
                        'student.address.country'
                    ])
                    validate(validateFields, current)
                    break
                case 2:
                    validateFields = await trigger([
                        'academicYear.id', 'classe.id'
                    ])
                    validate(validateFields, current)
                    break
                case 3:
                    if (guardianId && isExists) {
                        setGuardianValues(guardian as Guardian)
                        validate(true, current)
                    }else {
                        validateFields = await trigger([
                            "student.guardian.firstName", 'student.guardian.lastName', 'student.guardian.gender', 'student.guardian.status',
                            'student.guardian.telephone'
                        ])
                        validate(validateFields, current)
                    }
                    break
                case 4:
                    validateFields = await trigger([
                        'student.healthCondition.bloodType', 'student.healthCondition.weight', 'student.healthCondition.height'
                    ])
                    validate(validateFields, current)
                    break
            }
        }catch (err) {
            console.error('Validation failed:', err);
        }
    }

    const onSubmit = (data: EnrollmentSchema) => {
        setError("")
        setSuccess("")

        startTransition(() => {

            if (checked && !guardianId && !isExists) {
                data = {
                    ...data,
                    student: {
                        ...data.student,
                        guardian: {
                            ...data.student.guardian,
                            address: data.student.address
                        }
                    }
                }
            }

            if (image) data = {...data, student: {...data.student, image: image}}

            data = {
                ...data,
                student: {
                    ...data.student,
                    reference: 'AMB000005'
                }
            }

            addStudent(data)
                .then((res) => {
                    setError(res?.error)
                    if (res.isSuccess) {
                        setSuccess(res?.success)
                        reset()
                    }
                })
        })
    }

    return(
        <AddStepForm
            docTitle={documentTitle}
            breadCrumb={breadCrumb}
            addLink={addLink}
            HandleForm={form}
            triggerNext={triggerNext}
            onSubmit={onSubmit}
            steps={steps}
            messages={{success: success, error: error}}
            isPending={isPending}
        />
    )
}

export default Inscription
