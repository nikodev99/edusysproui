import FormContent from "@/components/ui/form/FormContent.tsx";
import {FormContentProps, TypedInputType} from "@/core/utils/interfaces.ts";
import {Planning, Semester} from "@/entity";
import {Control, FieldErrors, FieldValues, Path, PathValue} from "react-hook-form";
import {InputTypeEnum} from "@/core/shared/sharedEnums.ts";
import {FormUtils} from "@/core/utils/formUtils.ts";
import {FormConfig} from "@/config/FormConfig.ts";
import {useSemesterRepo} from "@/hooks/actions/useSemesterRepo.ts";
import {useMemo} from "react";
import {Alert, Card} from "antd";
import Datetime from "@/core/datetime.ts";
import {getUniqueness} from "@/core/utils/utils.ts";
import {FieldConfig} from "@/components/ui/form/ListInput.tsx";

type PlanningFormProps<T extends FieldValues> = FormContentProps<T, Planning> & {
    handleUpdate?: (field: string, value: unknown) => void,
    parent?: string,
    shouldRefetch?: boolean,
    academicYear: string
}

export const PlanningForm = <T extends FieldValues>(
    {control, errors, edit, handleUpdate, data, parent, shouldRefetch, academicYear}: PlanningFormProps<T>
) => {
    const {semesterOptions, startDate, endDate} = useOptions(academicYear, shouldRefetch as boolean)

    return <FormContent formItems={[
        {
            type: InputTypeEnum.LIST,
            fieldList: fieldConstruct(control, errors, edit as boolean, semesterOptions as [], [startDate, endDate]) as FieldConfig<T>[],
            inputProps: {
                md: 24,
                lg: 24,
                control: control,
                listName: 'Planning',
                itemLabel: 'Planning',
                name: parent as Path<T>,
                hasForm: edit,
                defaultValue: (data ? data : []) as PathValue<T, Path<T>>,
                wrapper: <Card style={{width: '100%', marginBottom: '20px'}} />,
                onFinish: edit ? (values) => handleUpdate?.(parent as string, values as unknown[]) : undefined
            }
        }
    ]} />
}

export const SinglePlanningForm = <T extends FieldValues>(
    {control, edit, errors, handleUpdate, shouldRefetch, academicYear, data}: PlanningFormProps<T>
) => {
    const {semesterOptions, startDate, endDate} = useOptions(academicYear, shouldRefetch as boolean)

    return(
        <FormContent formItems={
            fieldConstruct(
                control,
                errors,
                edit as boolean,
                semesterOptions as [],
                [startDate, endDate],
                data,
                false,
                handleUpdate
            ) as []
        } />
    )
}

const useOptions = (academicYear: string, shouldRefetch: boolean) => {
    const {useGetCurrentSemesters} = useSemesterRepo()
    const semesters = useGetCurrentSemesters(academicYear as string, {shouldRefetch: shouldRefetch})
    
    return useMemo(() => {
        const semesterOptions = semesters?.map(semester => ({
            label: semester.template.semesterName,
            value: {semesterId: semester.semesterId, startDate: semester.startDate, endDate: semester.endDate},
            id: `option-${semester.semesterId}`
        }))

        const years = getUniqueness(semesters as Semester[], s => s.academicYear, a => a.id)
        const [startDate, endDate] = years && years?.length > 0 ? [years[0].startDate, years[0].endDate] : []

        return {semesterOptions, startDate, endDate}
    }, [semesters])
}

const fieldConstruct = <T extends FieldValues>(
    control: Control<T>,
    errors: FieldErrors<T>,
    edit: boolean,
    semesterOptions: {label: string, value: object, id: string}[],
    [min, max]: [string | Date | number[] | undefined, string | Date | number[] | undefined],
    data?: Planning,
    isFieldList: boolean = true,
    handleUpdate?: (field: string, value: unknown) => void,
): FieldConfig<T>[] | TypedInputType<T> & { itemLabel?: string } => {
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)
    const form = new FormConfig(errors, edit, false)

    const defaultSemester = data ? {
        value: {semesterId: data?.semester?.semesterId, startDate: data?.semester?.startDate, endDate: data?.semester?.endDate},
        label: data?.semester?.template?.semesterName,
        id: `option-${data?.semester?.semesterId}`,
    }: undefined

    return [
        {
            ...(!isFieldList ? {type: InputTypeEnum.TEXT} : undefined),
            ...(!isFieldList ? {
                inputProps: {
                    md: onlyField ?? 12,
                    lg: onlyField ?? 12,
                    label: 'Désignation',
                    control: control,
                    name: form.name('designation') as Path<T>,
                    required: true,
                    placeholder: 'Période 1',
                    validateStatus: form.validate('designation'),
                    help: form.error('designation'),
                    defaultValue: data ? data.designation : undefined,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('designation', value) : undefined,
                }
            } : {
                md: onlyField ?? 12,
                lg: onlyField ?? 12,
                label: 'Désignation',
                control: control,
                name: form.name('designation') as Path<T>,
                required: true,
                placeholder: 'Période 1',
                validateStatus: form.validate('designation'),
                help: form.error('designation')
            })
        },
        ...(!edit ? [{
            ...(!isFieldList ? {type: InputTypeEnum.RADIO} : {}),
            ...(!isFieldList ? {
                inputProps: {
                    md: onlyField ?? 12,
                    lg: onlyField ?? 12,
                    control: control,
                    label: semesterOptions ? 'Semestre\\Trimestre' as string : <Alert
                        type='warning'
                        showIcon
                        message={'Aucun semestre\\trimestre n\'existe dans le système. Veuillez créer un semestre\\trimestre avant d\'ajouter les plannings'}
                    /> as never,
                    name: form.name('semester') as Path<T>,
                    required: true,
                    validateStatus: form.validate('semester') as 'error',
                    radioOptions: semesterOptions as [],
                    isValueObject: true,
                    defaultValue: defaultSemester,
                    help: form.error('semester'),
                }
            } : {
                type: 'radio',
                md: onlyField ?? 12,
                lg: onlyField ?? 12,
                control: control,
                label: semesterOptions ? 'Semestre\\Trimestre' as string : <Alert
                    type='warning'
                    showIcon
                    message={'Aucun semestre\\trimestre n\'existe dans le système. Veuillez créer un semestre\\trimestre avant d\'ajouter les plannings'}
                /> as never,
                name: form.name('semester') as Path<T>,
                required: true,
                validateStatus: form.validate('semester') as 'error',
                radioOptions: semesterOptions as [],
                isValueObject: true,
                optionType: 'button',
                help: form.error('semester'),
            })
        }] : []),
        {
            ...(!isFieldList ? {
                type: InputTypeEnum.DATE,
                inputProps: {
                    md: onlyField ?? 12,
                    lg: onlyField ?? 12,
                    label: 'Date de debut',
                    control: control,
                    name: form.name('termStartDate') as Path<T>,
                    required: true,
                    placeholder: 'Début du Période',
                    validateStatus: form.validate('termStartDate'),
                    help: form.error('termStartDate'),
                    min: Datetime.of(min as string).UNIX,
                    max: Datetime.of(max as string).UNIX,
                    defaultValue: data ? data.termStartDate : undefined,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('termStartDate', value) : undefined,
                }
            } : {
                type: 'date',
                md: onlyField ?? 12,
                lg: onlyField ?? 12,
                label: 'Date de debut',
                control: control,
                name: form.name('termStartDate') as Path<T>,
                required: true,
                placeholder: 'Début du Période',
                validateStatus: form.validate('termStartDate'),
                help: form.error('termStartDate'),
                min: Datetime.of(min as string).UNIX,
                max: Datetime.of(max as string).UNIX,
            })
        },
        {
            ...(!isFieldList ? {
                type: InputTypeEnum.DATE,
                inputProps: {
                    md: onlyField ?? 12,
                    lg: onlyField ?? 12,
                    label: 'Date de fin',
                    control: control,
                    name: form.name('termEndDate') as Path<T>,
                    required: true,
                    placeholder: 'Fin du Période',
                    validateStatus: form.validate('termEndDate'),
                    help: form.error('termEndDate'),
                    min: Datetime.of(min as string).UNIX,
                    max: Datetime.of(max as string).UNIX,
                    defaultValue: data ? data.termEndDate : undefined,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('termEndDate', value) : undefined,
                }
            } : {
                type: 'date',
                md: onlyField ?? 12,
                lg: onlyField ?? 12,
                label: 'Date de fin',
                control: control,
                name: form.name('termEndDate') as Path<T>,
                required: true,
                placeholder: 'Fin du Période',
                validateStatus: form.validate('termEndDate'),
                help: form.error('termEndDate'),
                min: Datetime.of(min as string).UNIX,
                max: Datetime.of(max as string).UNIX,
            })
        },
    ] as never
}