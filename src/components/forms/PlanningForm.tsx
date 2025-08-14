import FormContent from "../ui/form/FormContent.tsx";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import {Planning} from "../../entity";
import {FieldValues, Path, PathValue} from "react-hook-form";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {FormUtils} from "../../core/utils/formUtils.ts";
import {FormConfig} from "../../config/FormConfig.ts";
import {useSemesterRepo} from "../../hooks/useSemesterRepo.ts";
import {useMemo} from "react";
import {Alert, Card} from "antd";

type PlanningFormProps<T extends FieldValues> = FormContentProps<T, Planning> & {
    handleUpdate?: (field: string, value: unknown[]) => void,
    parent?: string,
    shouldRefetch?: boolean,
    academicYear?: string
}

export const PlanningForm = <T extends FieldValues>(
    {control, errors, edit, handleUpdate, parent, data, shouldRefetch, academicYear}: PlanningFormProps<T>
) => {

    const {useGetCurrentSemesters} = useSemesterRepo()
    const semesters = useGetCurrentSemesters(academicYear as string, {shouldRefetch: shouldRefetch})

    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)
    const form = new FormConfig(errors, edit, false, parent)

    const semesterOptions = useMemo(() => semesters?.map(semester => {
        return {
            label: semester.template.semesterName,
            value: {semesterId: semester.semesterId, startDate: semester.startDate, endDate: semester.endDate},
            id: `option-${semester.semesterId}`,
        }
    }), [semesters])

    console.log("CONTROLLER: ", control)

    return <FormContent formItems={[
        {
            type: InputTypeEnum.LIST,
            fieldList: [
                {
                    md: onlyField ?? 12,
                    lg: onlyField ?? 12,
                    label: 'Désignation',
                    control: control,
                    name: form.name('designation') as Path<T>,
                    required: true,
                    placeholder: 'Période 1',
                    validateStatus: form.validate('designation'),
                    help: form.error('designation'),
                    //onFinish: edit ? (value: unknown) => handleUpdate?.('designation', value) : undefined,
                },
                ...(!edit ? [{
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
                } as never] : []),
                {
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
                    //onFinish: edit ? (value: unknown) => handleUpdate?.('termStartDate', value) : undefined,
                },
                {
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
                    //onFinish: edit ? (value: unknown) => handleUpdate?.('termEndDate', value) : undefined,
                },
            ],
            inputProps: {
                md: 24,
                lg: 24,
                control: control,
                listName: 'Planning',
                itemLabel: 'Planning',
                name: form.name(parent as string) as Path<T>,
                hasForm: edit,
                defaultValue: (data ? data : []) as PathValue<T, Path<T>>,
                wrapper: <Card style={{width: '100%', marginBottom: '20px'}} />,
                onFinish: edit ? (values) => handleUpdate?.(parent as string, values as unknown[]) : undefined
            }
        }
    ]} />
}