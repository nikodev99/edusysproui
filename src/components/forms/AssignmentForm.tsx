import {FormConfig} from "@/config/FormConfig.ts";
import {FormContentProps, Option} from "@/core/utils/interfaces.ts";
import {Assignment} from "@/entity";
import {FieldValues, Path, PathValue} from "react-hook-form";
import FormContent from "@/components/ui/form/FormContent.tsx";
import {InputTypeEnum} from "@/core/shared/sharedEnums.ts";
import {FormUtils} from "@/core/utils/formUtils.ts";
import {useClasseRepo} from "@/hooks/actions/useClasseRepo.ts";
import {useCourseRepo} from "@/hooks/actions/useCourseRepo.ts";
import {useEffect, useMemo, useState} from "react";
import {SectionType} from "@/entity/enums/section.ts";
import {usePlanningRepo} from "@/hooks/actions/usePlanningRepo.ts";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {enumToObjectArray, setFirstName} from "@/core/utils/utils.ts";
import {AssignmentType, AssignmentTypeLiteral} from "@/entity/enums/assignmentType.ts";
import {useExamRepo} from "@/hooks/actions/useExamRepo.ts";
import {useAcademicYearRepo} from "@/hooks/actions/useAcademicYearRepo.ts";

export const AssignmentForm = <T extends FieldValues, Q>(
    {control, data, errors, edit, selectedClasse, handleUpdate, disabled = false}: FormContentProps<T, Assignment> & {
    handleUpdate?: (field: string | keyof Q | keyof Assignment, value: unknown) => Promise<void>
    selectedClasse?: number
    disabled?: boolean
}) => {
    const [pickedSection, setPickedSection] = useState<SectionType>()
    const {useGetClasseBasicValues} = useClasseRepo()
    const {useGetBasicCourses} = useCourseRepo()
    const {useGetGradePlannings} = usePlanningRepo()
    const {useGetTeacherBasicValues} = useTeacherRepo()
    const {useGetAllExams} = useExamRepo()
    const {useGetCurrentAcademicYear} = useAcademicYearRepo()

    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)
    const form = new FormConfig(errors, true)
    const classes = useGetClasseBasicValues()
    const courses = useGetBasicCourses()
    const plannings = useGetGradePlannings(pickedSection ?? data?.classe?.grade?.section as SectionType)
    const {data: teachers} = useGetTeacherBasicValues(selectedClasse ?? data?.classe?.id, pickedSection ?? data?.classe?.grade?.section as SectionType)
    const currentAcademicYear = useGetCurrentAcademicYear()
    const exams = useGetAllExams(currentAcademicYear?.id)

    const classeOptions: Option[] = useMemo(() => classes ? classes.map(c => ({
        value: c.id,
        label: c.name
    })) : [], [classes])

    const courseOptions = useMemo((): Option[] => courses && courses?.length > 0 ? courses.map(c => ({
        value: c.id,
        label: c.course
    })): [], [courses])

    const planningOptions = useMemo((): Option[] => plannings && plannings?.length > 0 ? plannings.map(p => ({
        value: p.id,
        label: p.designation
    })): [], [plannings])

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
        if(selectedClasse) {
            const section = classes?.find(c => c.id === selectedClasse)?.grade?.section
            setPickedSection(SectionType[section as keyof typeof SectionType])
        }

    }, [classes, selectedClasse]);

    console.log("IsDisabled: ", disabled)

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
                        name: 'semester.id' as Path<T>,
                        label: 'Planning',
                        lg: onlyField,
                        md: onlyField,
                        required: true,
                        showSearch: true,
                        placeholder: 'Choisissez le planning',
                        options: planningOptions,
                        validateStatus: form.validate('id', 'semester'),
                        help: form.error('id', 'semester'),
                        defaultValue: (data ? data.semester?.id : undefined) as PathValue<T, Path<T>>,
                        onFinish: edit && handleUpdate ? (value: unknown) => handleUpdate('semester.id', value) : undefined,
                    }
                },
                {
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
                },
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
