import { Options } from "@/core/utils/interfaces"
import {
    courseProgramSchema,
    ReportSchema,
    reportSchema,
    TeacherCourseProgram,
    TeacherProgramTopic,
    topicSchema
} from "@/schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {InsertModal} from "@/components/custom/InsertSchema.tsx";
import {CourseProgramForm, CourseProgramTopicForm, ReportForm} from "@/components/forms/CourseProgramForm.tsx";
import {useCallback, useEffect, useMemo, useState} from "react";
import {SuperWord} from "@/core/utils/tsxUtils.tsx";
import {addProgram, addProgramTopic} from "@/data/repository/courseProgramRepository.ts";
import Datetime from "@/core/datetime.ts";
import {Schedule} from "@/entity";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {Day, frenchDay} from "@/entity/enums/day.ts";
import {ReportStatusEnum} from "@/entity/domain/report.ts";

export const InsertNewProgram = (
    {open, courseValue, showField, courses, classes, classeValue, teacherValue, academicYear, semesterValue, semesters, onClose, onRefetch}: {
        open: boolean
        courses?: Options
        classes?: Options
        classeValue?: number
        courseValue?: number
        semesterValue?: number
        semesters?: Options[]
        onClose?: () => void
        showField?: boolean
        teacherValue?: string
        academicYear?: string
        onRefetch?: () => Promise<void>
    }) => {

    const classeName = useMemo(() => {
        return classes?.find(c => c.value === classeValue)?.label as string
    }, [classeValue, classes])

    const form = useForm<TeacherCourseProgram>({
        resolver: zodResolver(courseProgramSchema)
    })

    const { control, formState: {errors}, reset } = form

    useEffect(() => {
        reset({
            classe: { id: classeValue },
            semester: { semesterId: semesterValue },
            course: { id: courseValue },
            teacher: { id: teacherValue },
            timing: { 
                status: 5,
                academicYear: { id: academicYear },
                updatedAt: Datetime.now().toDate()
            },
        })
    }, [academicYear, classeValue, courseValue, reset, semesterValue, showField, teacherValue]);

    return(
        <InsertModal
            open={open}
            width={400}
            data={courseProgramSchema as never}
            onCancel={onClose}
            customForm={<CourseProgramForm
                courses={courses}
                errors={errors}
                control={control}
                courseValue={courseValue}
                classes={classes}
                classeValue={classeValue}
                semesterValue={semesterValue}
                semesters={semesters}
                showField={showField}
            />}
            messageSuccess={"Nouveau thème ajouté avec succès"}
            description="Souhaitez-vous poursuivre avec l'ajout de ce theme ?"
            title={<SuperWord input={`Ajouter au programme ${showField ? '' : 'de la ' + classeName}`} />}
            handleForm={form as never}
            postFunc={addProgram as never}
            toReset={false}
            isNotif
            onSuccess={async () => {
                await onRefetch?.()?.then(r => r);
                setTimeout(() => {
                    onClose?.();
                }, 5000);
            }}
        />
    )
}

export const InsertNewProgramTopic = (
    {open, onClose, programValue, academicYear, onRefetch}: {
        open: boolean
        onClose: () => void
        programValue?: number
        academicYear?: string
        onRefetch?: () => Promise<void>
}) => {
    const form = useForm<TeacherProgramTopic>({
        resolver: zodResolver(topicSchema)
    })

    const { control, formState: {errors}, reset } = form

    useEffect(() => {
        reset({
            courseProgram: { id: programValue },
            timing: { 
                status: 5,
                academicYear: { id: academicYear },
                updatedAt: Datetime.now().toDate()
            },
        })
    }, [academicYear, reset, programValue]);

    return <InsertModal
        data={topicSchema}
        open={open}
        onCancel={onClose}
        postFunc={addProgramTopic as never}
        customForm={<CourseProgramTopicForm
            control={control as never}
            errors={errors}
        />}
        handleForm={form as never}
        messageSuccess={"Nouveau sous-thème ajouté avec succès"}
        description="Souhaitez-vous poursuivre avec l'ajout de ce sous-theme ?"
        title={'Ajouter au sous theme au programme'}
        isNotif
        width={400}
        onSuccess={async () => {
            await onRefetch?.()?.then(r => r);
            setTimeout(() => {
                onClose?.();
            }, 5000);
        }}
    />
}

export const InsertNewReport = (
    {
        open, onClose, onRefetch, program, programTopic, schedules, teacherId, programOptions, programTopicOptions,
        showSchedule = false, hasProgram, hasTopic, isRegularized, getProgram, sessionDate
    }: {
        open: boolean,
        onClose: () => void
        onRefetch?: () => Promise<void>
        program?: number
        programTopic?: number
        schedules?: Schedule[]
        programOptions?: Options
        programTopicOptions?: Options
        getProgram?: (value: number | null) => void
        hasProgram?: boolean
        hasTopic?: boolean
        showSchedule?: boolean
        teacherId?: string,
        isRegularized?: boolean
        sessionDate?: Datetime
    }
) => {
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | undefined>(undefined)
    const {useGetTeacherSchedules, useSaveReport} = useTeacherRepo()
    const {saveReport} = useSaveReport()
    const {data: scheduleData} = useGetTeacherSchedules(teacherId as string, false, !(schedules && schedules?.length > 0))
    const sch = schedules && schedules?.length > 0 ? schedules : scheduleData

    const scheduleOptions = useMemo(() => sch?.map(s => ({
        label: frenchDay(s?.dayOfWeek as Day) + " - " + s?.classe?.name + " - " + s?.designation,
        value: s?.id,
    })) ?? [], [sch])
    
    const handlePickSchedule = useCallback((value: number | null) => {
        setSelectedSchedule(sch?.find(s => s?.id === value));
    }, [sch])

    useEffect(() => {
        if (sch && sch?.length === 1) {
            setSelectedSchedule(sch[0])
        }
    }, [sch]);
    
    const form = useForm<ReportSchema>({
        resolver: zodResolver(reportSchema)
    })
    
    const {formState: {errors}, control, reset} = form

    useEffect(() => {
        reset({
            sessionStartingTime: Datetime.timeToCurrentDate(selectedSchedule?.startTime as number[])
                .format("HH:mm:ss"),
            sessionEndingTime: Datetime.timeToCurrentDate(selectedSchedule?.endTime as number[])
                .format("HH:mm:ss"),
            reportStatus: ReportStatusEnum.SUBMITTED,
            teacher: { id: teacherId },
            schedule: { id: selectedSchedule ? selectedSchedule?.id : sch?.length === 1 ? sch[0]?.id : undefined },
        })
    }, [reset, sch, selectedSchedule, selectedSchedule?.endTime, selectedSchedule?.id, selectedSchedule?.startTime, teacherId]);
    
    return <InsertModal
        data={reportSchema}
        open={open}
        onCancel={onClose}
        postFunc={saveReport as never}
        customForm={<ReportForm
            errors={errors}
            control={control}
            program={program}
            programTopic={programTopic}
            getSelectedSchedule={handlePickSchedule}
            schedule={selectedSchedule}
            scheduleOptions={scheduleOptions}
            programOptions={programOptions}
            programTopicOptions={programTopicOptions}
            hasTopic={hasTopic}
            hasProgram={hasProgram}
            showField={showSchedule}
            teacherId={teacherId}
            isRegularized={isRegularized}
            getSelectedProgram={getProgram}
            sessionDate={sessionDate?.toDate()}
        />}
        handleForm={form as never}
        messageSuccess={"Rapport de session de cours "+ sessionDate ? "du " + sessionDate?.format("DD/MM/YYYY") + " " : null +"soumit avec succès"}
        description="Souhaitez-vous soumettre ce rapport de session de cours ?"
        title={'Soumettre Rapport'}
        isNotif
        width={400}
        onSuccess={async () => {
            await onRefetch?.()?.then(r => r);
            setTimeout(() => {
                onClose?.();
            }, 5000);
        }}
    />
}

export const UpdateReport = () => {
    return <div>UpdateReport</div>
}
