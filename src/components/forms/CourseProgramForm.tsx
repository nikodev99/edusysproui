import {FormContentProps, Options} from "@/core/utils/interfaces.ts";
import {CourseProgram} from "@/entity";
import FormContent from "@/components/ui/form/FormContent.tsx";
import {FormConfig} from "@/config/FormConfig.ts";
import {InputTypeEnum} from "@/core/shared/sharedEnums.ts";
import {TeacherCourseProgram, TeacherProgramTopic} from "@/schema";
import {ProgramTopic} from "@/entity/domain/courseProgram.ts";

export const CourseProgramForm = (
    {control, errors, data, semesters, showField, classes, courses, semesterValue, classeValue, courseValue}: FormContentProps<TeacherCourseProgram, CourseProgram> & {
        semesters?: Options,
        classes?: Options,
        courses?: Options,
        semesterValue?: number,
        classeValue?: number,
        courseValue?: number,
    }
) => {
    const form = new FormConfig(errors)

    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    lg: 24,
                    md: 24,
                    label: 'Nom du thème',
                    control: control,
                    name: form.name('name'),
                    required: true,
                    placeholder: 'Mathématique Quantique',
                    validateStatus: form.validate('name'),
                    help: form.error('name'),
                    defaultValue: (data ? data.name : undefined)
                }
            },
            {
                type: InputTypeEnum.SELECT,
                inputProps: {
                    lg: 24,
                    md: 24,
                    label: 'Trimestre',
                    control: control,
                    name: form.name('semesterId', 'semester'),
                    required: true,
                    options: semesters,
                    selectedValue: semesterValue,
                    placeholder: 'Trimestre',
                    validateStatus: form.validate('semesterId', 'semester'),
                    help: form.error('semesterId', 'semester'),
                    defaultValue: semesterValue
                }
            },
            ...(showField ? [{
                type: InputTypeEnum.SELECT,
                inputProps: {
                    lg: 12,
                    md: 12,
                    label: 'Classe',
                    control: control,
                    name: form.name('id', 'classe'),
                    required: true,
                    options: classes,
                    selectedValue: classeValue,
                    placeholder: 'Classe',
                    validateStatus: form.validate('id', 'classe'),
                    help: form.error('id', 'classe'),
                    defaultValue: classeValue
                }
            }] : []),
            {
                type: InputTypeEnum.SELECT,
                inputProps: {
                    lg: showField ? 12 : 24,
                    md: showField ? 12 : 24,
                    label: 'Matière',
                    control: control,
                    name: form.name('id', 'course'),
                    options: courses,
                    selectedValue: courseValue,
                    placeholder: 'Matière',
                    validateStatus: form.validate('id', 'course'),
                    help: form.error('id', 'course'),
                    defaultValue: courseValue
                }
            },
            {
                type: InputTypeEnum.RANGE,
                inputProps: {
                    lg: 24,
                    md: 24,
                    label: 'Période du thème',
                    control: control,
                    name: form.name('dateRange', 'timing'),
                    required: true,
                    placeholder: ['Date de début', 'Date de fin'],
                    validateStatus: form.validate('dateRange', 'timing'),
                    help: form.error('dateRange', 'timing'),
                    defaultValue: (data ? [data?.timing?.startDate, data?.timing?.endDate] : undefined)
                }
            },
            {
                type: InputTypeEnum.TEXTAREA,
                inputProps: {
                    lg: 24,
                    md: 24,
                    label: 'Objectif',
                    control: control,
                    name: form.name('purpose'),
                    required: true,
                    placeholder: 'Objectif',
                    validateStatus: form.validate('purpose'),
                    help: form.error('purpose'),
                    defaultValue: (data ? data.purpose : undefined),
                }
            },
            {
                type: InputTypeEnum.TEXTAREA,
                inputProps: {
                    lg: 24,
                    md: 24,
                    label: 'Description',
                    control: control,
                    name: form.name('description'),
                    required: false,
                    placeholder: 'Description',
                    validateStatus: form.validate('description'),
                    help: form.error('description'),
                    defaultValue: (data ? data.description : undefined),
                }
            },
        ]} />
    )
}

export const CourseProgramTopicForm = (
    {control, errors, data}: FormContentProps<TeacherProgramTopic, ProgramTopic>
) => {
    const form = new FormConfig(errors)

    return <FormContent formItems={[
        {
            type: InputTypeEnum.TEXT,
            inputProps: {
                lg: 24,
                md: 24,
                label: 'Titre du sous-thème',
                control: control,
                name: form.name('title'),
                required: true,
                placeholder: 'Mathématique Quantique',
                validateStatus: form.validate('title'),
                help: form.error('title'),
                defaultValue: (data ? data.title : undefined)
            }
        },
        {
            type: InputTypeEnum.TEXT,
            inputProps: {
                lg: 24,
                md: 24,
                label: 'Description',
                control: control,
                name: form.name('description'),
                required: false,
                placeholder: 'Description',
                validateStatus: form.validate('description'),
                help: form.error('description'),
                defaultValue: (data ? data.description : undefined)
            }
        },
        {
            type: InputTypeEnum.RANGE,
            inputProps: {
                lg: 24,
                md: 24,
                label: 'Période du sous-thème',
                control: control,
                name: form.name('dateRange', 'timing'),
                required: true,
                placeholder: ['Date de début', 'Date de fin'],
                validateStatus: form.validate('dateRange', 'timing'),
                help: form.error('dateRange', 'timing'),
                defaultValue: (data ? [data?.timing?.startDate, data?.timing?.endDate] : undefined)
            }
        },
        {
            type: InputTypeEnum.NUMBER,
            inputProps: {
                lg: 24,
                md: 24,
                label: 'Ordre',
                control: control,
                name: form.name('order'),
                required: false,
                placeholder: 'Ordre',
                validateStatus: form.validate('order'),
                help: form.error('order'),
                defaultValue: (data ? data.order : undefined)
            }
        },
    ]} />
}