import {FormContentProps, Option} from "@/core/utils/interfaces.ts";
import {ScheduleSchema} from "@/schema";
import {Classe, Schedule} from "@/entity";
import FormContent from "@/components/ui/form/FormContent.tsx";
import {FormConfig} from "@/config/FormConfig.ts";
import {FormUtils} from "@/core/utils/formUtils.ts";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {useMemo, useState} from "react";
import {setFirstName} from "@/core/utils/utils.ts";
import {InputTypeEnum} from "@/core/shared/sharedEnums.ts";
import {SectionType} from "@/entity/enums/section.ts";

export const ScheduleForm = ({edit, data, control, errors, classe}: FormContentProps<ScheduleSchema, Schedule> & {
    classe?: Classe
}) => {
    const {useGetTeacherBasicValues, useGetTeacherCourses} = useTeacherRepo()
    const [selectedTeacher, setSelectedTeacher] = useState<string | undefined>(undefined)
    const {data: teachers} = useGetTeacherBasicValues(classe?.id, classe?.grade?.section as SectionType)
    const {data: teacher} = useGetTeacherCourses(selectedTeacher as string)

    const teacherOptions = useMemo((): Option[] => teachers && teachers?.length > 0 ? teachers.map(t => ({
        value: t?.id as string,
        label: setFirstName(`${t.personalInfo?.lastName} ${t.personalInfo?.firstName}`)
    })): [], [teachers])

    const courseOptions = useMemo((): Option[] => {
        // 1. If teacher has courses, map them
        if (teacher?.courses && teacher.courses.length > 0) {
            return teacher.courses.map((c) => ({
                value: c.course.id,
                label: c.course.course,
            }));
        }

        // 2. Fallback to single course data if present
        if (data?.course) {
            return [
                {
                    value: data.course.id,
                    label: data.course.course,
                },
            ];
        }

        return [];
    }, [teacher, data]);
    
    const form = new FormConfig(errors, edit)
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)

    const handleTeacherChange = (value: string) => {
        setSelectedTeacher(value)
    }

    console.log({data})
    
    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    lg: onlyField,
                    md: onlyField,
                    hasForm: edit,
                    label: 'Designation du planning',
                    control: control,
                    name: form.name('designation'),
                    required: true,
                    placeholder: "Entré une désignation du planning",
                    validateStatus: form.validate('designation'),
                    help: form.error('designation'),
                    defaultValue: (data ? data?.designation : undefined),
                    disabled: edit
                }
            },
            {
                type: InputTypeEnum.SELECT,
                inputProps: {
                    lg: onlyField,
                    md: onlyField,
                    hasForm: edit,
                    options: teacherOptions as [],
                    label: 'Enseignant',
                    control: control,
                    name: form.name('id', 'teacher'),
                    onChange: handleTeacherChange,
                    placeholder: "Sélectionné le professeur",
                    validateStatus: form.validate('id', 'teacher'),
                    help: form.error('id', 'teacher'),
                    selectedValue: (data ? data?.teacher?.id : undefined),
                    disabled: edit
                }
            },
            {
                type: InputTypeEnum.SELECT,
                inputProps: {
                    lg: onlyField,
                    md: onlyField,
                    hasForm: edit,
                    control: control,
                    name: form.name('id', 'course'),
                    label: 'Matière',
                    required: false,
                    showSearch: true,
                    placeholder: 'Choisissez la matière',
                    options: courseOptions,
                    validateStatus: form.validate('id', 'course'),
                    help: form.error('id', 'subject'),
                    defaultValue: (data ? data.course?.id : undefined)
                }
            },
        ]} />
    )
}