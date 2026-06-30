import {FormConfig} from "@/config/FormConfig.ts";
import {FormContentProps, Option} from "@/core/utils/interfaces.ts";
import {Assignment, Classe, Course} from "@/entity";
import {FieldValues, Path, PathValue} from "react-hook-form";
import FormContent from "@/components/ui/form/FormContent.tsx";
import {InputTypeEnum} from "@/core/shared/sharedEnums.ts";
import {FormUtils} from "@/core/utils/formUtils.ts";
import {useEffect, useMemo, useState} from "react";
import {SectionType} from "@/entity/enums/section.ts";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {enumToObjectArray, setFirstName} from "@/core/utils/utils.ts";
import {AssignmentType, AssignmentTypeLiteral} from "@/entity/enums/assignmentType.ts";
import {useExamRepo} from "@/hooks/actions/useExamRepo.ts";
import {loggedUser} from "@/auth/jwt/LoggedUser.ts";
import {useClasseRepo} from "@/hooks/actions/useClasseRepo.ts";
import {useCourseRepo} from "@/hooks/actions/useCourseRepo.ts";
import {useSemesterRepo} from "@/hooks/actions/useSemesterRepo.ts";

export const AssignmentForm = <T extends FieldValues, Q>(
    {control, data, errors, edit, showField = true, handleUpdate, disabled = false, academicYear}: FormContentProps<T, Assignment> & {
    handleUpdate?: (field: string | keyof Q | keyof Assignment, value: unknown) => Promise<void>
    selectedClasse?: number
    disabled?: boolean
    academicYear?: string
}) => {
    const [selectedClasse, setSelectedClasse] = useState<number | null>(null)
    const [pickedSection, setPickedSection] = useState<SectionType | null>(null)
    const [allClasses, setAllClasses] = useState<Classe[]>([])
    const [allCourses, setAllCourses] = useState<Course[]>([])
    const {semesterOptions} = useSemesterRepo()
    const {useGetTeacherBasicValues, useGetTeacherCourses, useGetTeacherClasses} = useTeacherRepo()
    const {useGetClasseBasicValues} = useClasseRepo()
    const {useGetBasicCourses} = useCourseRepo()
    const {useGetAllExams} = useExamRepo()
    const {data: teacherClasses} = useGetTeacherClasses(loggedUser.getUser()?.userId as string, !showField)
    const {data: teacherCourses} = useGetTeacherCourses(loggedUser.getUser()?.userId as string, !showField)
    const classes = useGetClasseBasicValues(showField)
    const courses = useGetBasicCourses(showField)

    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)
    
    const form = new FormConfig(errors, true)
    const {data: teachers} = useGetTeacherBasicValues(selectedClasse ?? data?.classe?.id, pickedSection ?? data?.classe?.grade?.section as SectionType, showField)
    const exams = useGetAllExams(academicYear)

    const classeOptions = useMemo(() => allClasses?.map(c => ({
        value: c.id,
        label: c.name
    })), [allClasses])

    const courseOptions = useMemo(() => allCourses?.map(c => ({
        value: c?.id,
        label: c?.course
    })), [allCourses])

    const teacherOptions = useMemo((): Option[] => teachers && teachers?.length > 0 ? teachers.map(t => ({
        value: t.personalInfo?.id as number,
        label: setFirstName(`${t.personalInfo?.lastName} ${t.personalInfo?.firstName}`)
    })): [], [teachers])

    const typeOptions = useMemo(() => enumToObjectArray(AssignmentTypeLiteral, true, AssignmentType), [])

    const examOptions = useMemo(() => exams && exams?.length > 0 ? exams.map(e => ({
        value: e.id,
        label: e.examType?.name
    })): [], [exams])

    useEffect(() => {
        setAllClasses(classes && classes?.length > 0
            ? classes
            : teacherClasses?.classes && teacherClasses?.classes?.length > 0
                ? teacherClasses?.classes
                : []
        )
        
        setAllCourses(courses && courses?.length > 0
            ? courses
            : teacherCourses?.courses && teacherCourses?.courses?.length > 0
                ? teacherCourses?.courses
                : []
        )
    }, [classes, courses, teacherClasses, teacherCourses?.courses]);

    const handleChangeClasse = (value: number) => {
        setSelectedClasse(value)
        const section = allClasses.find(c => c.id === value)?.grade?.section ?? null
        setPickedSection(SectionType[section as keyof typeof SectionType])
    }

    return (
        <FormContent
            formItems={[
                {
                    type: InputTypeEnum.TEXT,
                    inputProps: {
                        hasForm: edit,
                        lg: onlyField,
                        md: onlyField,
                        label: 'Titre du devoir',
                        control: control,
                        name: 'examName' as Path<T>,
                        required: true,
                        placeholder: 'Devoir de Math',
                        validateStatus: form.validate('examName'),
                        help: form.error('examName'),
                        defaultValue: (data ? data.examName : undefined) as PathValue<T, Path<T>>,
                        onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('examName', value) : undefined,
                    }
                },
                {
                    type: InputTypeEnum.DATE,
                    inputProps: {
                        hasForm: edit,
                        control: control,
                        lg: onlyField,
                        md: onlyField,
                        name: 'examDate' as Path<T>,
                        label: 'Date du devoir',
                        required: true,
                        validateStatus: form.validate('examDate'),
                        help: form.error('examDate'),
                        defaultValue: (data ? data.examDate : undefined) as PathValue<T, Path<T>>,
                        onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('examDate', value) : undefined,
                        disabled: disabled
                    }
                },
                {
                    type: InputTypeEnum.TIME,
                    inputProps:{
                        hasForm: edit,
                        control: control,
                        name: 'startTime' as Path<T>,
                        label: 'Heure de début',
                        lg: onlyField,
                        md: onlyField,
                        required: true,
                        validateStatus: form.validate('startTime'),
                        help: form.error('startTime'),
                        defaultValue: (data ? data.startTime : undefined) as PathValue<T, Path<T>>,
                        onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('startTime', value) : undefined,
                        disabled: disabled
                    }
                },
                {
                    type: InputTypeEnum.TIME,
                    inputProps:{
                        hasForm: edit,
                        control: control,
                        name: 'endTime' as Path<T>,
                        label: 'Heure de fin',
                        lg: onlyField,
                        md: onlyField,
                        required: true,
                        validateStatus: form.validate('endTime'),
                        help: form.error('endTime'),
                        defaultValue: (data ? data.endTime : undefined) as PathValue<T, Path<T>>,
                        onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('endTime', value) : undefined,
                        disabled: disabled
                    }
                },
                {
                    type: InputTypeEnum.SELECT,
                    inputProps: {
                        hasForm: edit,
                        control: control,
                        name: 'classe.id' as Path<T>,
                        label: 'Classe',
                        lg: onlyField,
                        md: onlyField,
                        required: true,
                        showSearch: true,
                        placeholder: 'Choisissez la classe',
                        options: classeOptions,
                        onChange: handleChangeClasse as () => void,
                        validateStatus: form.validate('id', 'classe'),
                        help: form.error('id', 'classe'),
                        defaultValue: (data ? data.classe?.id : undefined) as PathValue<T, Path<T>>,
                        onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('classeEntity.id', value) : undefined,
                    }
                },
                {
                    type: InputTypeEnum.SELECT,
                    inputProps: {
                        hasForm: edit,
                        control: control,
                        name: 'subject.id' as Path<T>,
                        label: 'Matière',
                        lg: onlyField,
                        md: onlyField,
                        required: false,
                        showSearch: true,
                        placeholder: 'Choisissez la matière',
                        options: courseOptions,
                        validateStatus: form.validate('id', 'subject'),
                        help: form.error('id', 'subject'),
                        defaultValue: (data ? data.subject?.id : undefined) as PathValue<T, Path<T>>,
                        onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('subject.id', value) : undefined,
                    }
                },
                {
                    type: InputTypeEnum.RADIO,
                    inputProps: {
                        hasForm: edit,
                        control: control,
                        name: form.name('type'),
                        label: 'Type de devoir',
                        lg: onlyField ?? 16,
                        md: onlyField,
                        radioOptions: typeOptions as [],
                        optionType: 'button',
                        buttonStyle: edit ? 'solid' : 'outline',
                        required: true,
                        validateStatus: form.validate('type'),
                        help: form.error('type'),
                        defaultValue: data ? AssignmentType[data?.type as unknown as keyof typeof AssignmentType] : undefined,
                        onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('type', value) : undefined,
                    }
                },
                {
                    type: InputTypeEnum.SELECT,
                    inputProps: {
                        hasForm: edit,
                        control: control,
                        name: 'exam.id' as Path<T>,
                        label: 'Devoir comptant pour l\'examen',
                        options: examOptions,
                        lg: onlyField,
                        md: onlyField,
                        required: true,
                        showSearch: true,
                        placeholder: 'Choisissez l\'examen',
                        validateStatus: form.validate('id', 'exam'),
                        help: form.error('id', 'exam'),
                        defaultValue: (data ? data.exam?.id : undefined) as PathValue<T, Path<T>>,
                        onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('exam.id', value) : undefined,
                    }
                },
                {
                    type: InputTypeEnum.SELECT,
                    inputProps: {
                        hasForm: edit,
                        control: control,
                        name: 'semester.semesterId' as Path<T>,
                        label: 'Semestre/Trimestre',
                        lg: onlyField,
                        md: onlyField,
                        required: true,
                        showSearch: true,
                        placeholder: 'Choisissez le semestre',
                        options: semesterOptions,
                        validateStatus: form.validate('semesterId', 'semester'),
                        help: form.error('semesterId', 'semester'),
                        defaultValue: (data ? data.semester?.semesterId : undefined) as PathValue<T, Path<T>>,
                        onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('semester.semesterId', value) : undefined,
                    }
                },
                ...(showField ? [{
                    type: InputTypeEnum.SELECT,
                    inputProps: {
                        hasForm: edit,
                        control: control,
                        name: 'preparedBy.id' as Path<T>,
                        label: 'Preparer par',
                        lg: onlyField,
                        md: onlyField,
                        required: true,
                        showSearch: true,
                        placeholder: 'Choisissez le professeur',
                        options: teacherOptions,
                        validateStatus: form.validate('id', 'preparedBy'),
                        help: form.error('id', 'preparedBy'),
                        defaultValue: (data ? data.preparedBy?.id : undefined),
                        onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('preparedBy.id', value) : undefined,
                    }
                }] : []),
                {
                    type: InputTypeEnum.NUMBER,
                    inputProps: {
                        hasForm: edit,
                        control: control,
                        name: 'coefficient' as Path<T>,
                        label: 'Coefficient',
                        lg: onlyField,
                        md: onlyField,
                        required: false,
                        placeholder: '2',
                        validateStatus: form.validate('coefficient'),
                        help: form.error('coefficient'),
                        defaultValue: (data ? data.coefficient : undefined) as PathValue<T, Path<T>>,
                        onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('coefficient', value) : undefined,
                    }
                }
            ]}
        />
    )
}
