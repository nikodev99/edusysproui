import {FormContentProps, Options} from "@/core/utils/interfaces.ts";
import {CourseProgram, Report, Schedule} from "@/entity";
import FormContent from "@/components/ui/form/FormContent.tsx";
import {FormConfig} from "@/config/FormConfig.ts";
import {InputTypeEnum} from "@/core/shared/sharedEnums.ts";
import {ReportSchema, TeacherCourseProgram, TeacherProgramTopic} from "@/schema";
import {ProgramTopic} from "@/entity/domain/courseProgram.ts";
import Datetime from "@/core/datetime.ts";

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

export const ReportForm = (
    {
        control,
        errors,
        program,
        programOptions,
        programTopicOptions,
        programTopic,
        schedule,
        getSelectedSchedule,
        scheduleOptions,
        showField,
        data, hasTopic = false, hasProgram = false, isRegularized = false, getSelectedProgram, sessionDate
    }: FormContentProps<ReportSchema, Report> & {
    program?: number
    programTopic?: number
    programOptions?: Options
    programTopicOptions?: Options
    teacherId?: string
    hasProgram?: boolean
    hasTopic?: boolean
    schedule?: Schedule,
    scheduleOptions?: Options,
    getSelectedSchedule?: (scheduleId: number | null) => void,
    getSelectedProgram?: (scheduleId: number | null) => void,
    isRegularized?: boolean,
    sessionDate?: Date
}) => {
    const form = new FormConfig(errors)

    const handleScheduleChange = (value: number | null) => {
        getSelectedSchedule?.(value)
    }

    const handleProgramChange = (value: number | null) => {
        getSelectedProgram?.(value)
    }

    console.log({schedule})

    return <FormContent formItems={[
        {
            type: InputTypeEnum.SELECT,
            inputProps: {
                lg: 24,
                md: 24,
                label: 'Thème étudier',
                control: control,
                name: form.name('id', 'courseProgram'),
                required: true,
                options: programOptions,
                onChange: handleProgramChange as never,
                placeholder: 'Thème',
                validateStatus: form.validate('id', 'courseProgram'),
                help: form.error('id', 'courseProgram'),
                defaultValue: (data ? data?.courseProgram?.id : program ? program : undefined),
                disabled: hasProgram
            }
        },
        {
            type: InputTypeEnum.SELECT,
            inputProps: {
                lg: 24,
                md: 24,
                label: 'Sous-Thème étudier',
                control: control,
                name: form.name('id', 'courseProgramTopic'),
                options: programTopicOptions,
                selectedValue: programTopic,
                placeholder: 'Sous-Thème',
                validateStatus: form.validate('id', 'courseProgramTopic'),
                help: form.error('id', 'courseProgramTopic'),
                defaultValue: programTopic,
                disabled: hasTopic
            }
        },
        ...(showField ? [{
            type: InputTypeEnum.SELECT,
            inputProps: {
                lg: 24,
                md: 24,
                label: 'Emploi du temps',
                control: control,
                name: form.name('id', 'schedule'),
                required: true,
                options: scheduleOptions,
                onChange: handleScheduleChange,
                selectedValue: schedule?.id,
                placeholder: 'Session du...',
                validateStatus: form.validate('id', 'schedule'),
                help: form.error('id', 'schedule'),
                defaultValue: (data ? data?.schedule?.id : schedule?.id)
            }
        }] : []) as never,
        {
            type: InputTypeEnum.DATE,
            inputProps: {
                lg: 24,
                md: 24,
                label: 'Date de la session',
                control: control,
                name: form.name("sessionDate"),
                required: true,
                placeholder: "Date de la session",
                validateStatus: form.validate("sessionDate"),
                help: form.error("sessionDate"),
                defaultValue: (data ? data?.sessionDate : sessionDate ? sessionDate : Datetime.now().toDate()),
                disabled: !showField
            }
        },
        {
            type: InputTypeEnum.TIME,
            inputProps: {
                lg: 12,
                md: 12,
                label: 'Debut de session',
                control: control,
                name: form.name("sessionStartingTime"),
                required: true,
                placeholder: "10:30",
                validateStatus: form.validate("sessionStartingTime"),
                help: form.error("sessionStartingTime"),
                defaultValue: (data ? data?.sessionStartingTime : schedule?.startTime),
                disabled: !!schedule
            }
        },
        {
            type: InputTypeEnum.TIME,
            inputProps: {
                lg: 12,
                md: 12,
                label: 'Fin de session',
                control: control,
                name: form.name("sessionEndingTime"),
                required: true,
                placeholder: "13:30",
                validateStatus: form.validate("sessionEndingTime"),
                help: form.error("sessionEndingTime"),
                defaultValue: (data ? data?.sessionEndingTime : schedule?.endTime),
                disabled: !!schedule
            }
        },
        {
            type: InputTypeEnum.TEXTAREA,
            inputProps: {
                lg: 24,
                md: 24,
                label: 'Commentaire',
                control: control,
                name: form.name("notes"),
                required: true,
                placeholder: "Commentaire sur la session...",
                validateStatus: form.validate("notes"),
                help: form.error("notes"),
                defaultValue: (data ? data?.notes : undefined)
            }
        },
        {
            type: InputTypeEnum.CHECKBOX,
            inputProps: {
                lg: 24,
                md: 24,
                label: 'Régularisation ?',
                control: control,
                name: form.name("isLateSubmission"),
                required: false,
                validateStatus: form.validate("isLateSubmission"),
                help: form.error("isLateSubmission"),
                defaultValue: (data ? data?.isLateSubmission : isRegularized ? isRegularized : undefined),
                disabled: isRegularized
            }
        }
    ]} />
}