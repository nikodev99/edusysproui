import FormContent from "../ui/form/FormContent.tsx";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import {Planning} from "../../entity";
import {FieldValues, Path, PathValue} from "react-hook-form";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {FormUtils} from "../../core/utils/formUtils.ts";
import {FormConfig} from "../../config/FormConfig.ts";
import {useSemesterRepo} from "../../hooks/useSemesterRepo.ts";
import {useMemo} from "react";
import Datetime from "../../core/datetime.ts";
import {Alert} from "antd";

type PlanningFormProps<T extends FieldValues> = FormContentProps<T, Planning> & {
    handleUpdate?: (field: keyof Planning, value: unknown) => void,
    parent?: string,
    shouldRefetch?: boolean,
}

export const PlanningForm = <T extends FieldValues>(
    {control, errors, edit, handleUpdate, parent, data, shouldRefetch}: PlanningFormProps<T>
) => {

    const {useGetAllSemesters} = useSemesterRepo()
    const semesters = useGetAllSemesters({shouldRefetch: shouldRefetch})

    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)
    const form = new FormConfig(errors, edit)

    const semesterOptions = useMemo(() => semesters?.slice()
        ?.sort((a, b) => Datetime.of(a?.startDate).diffSecond(b?.endDate))
        ?.map(semester => {
        return {
            label: semester.semesterName,
            value: semester.semesterId
        }
    }), [semesters])

    return <FormContent formItems={[
        {
            type: InputTypeEnum.TEXT,
            inputProps: {
                md: onlyField ?? 12,
                lg: onlyField ?? 12,
                label: 'Désignation',
                control: control,
                name: form.name('designation', parent) as Path<T>,
                required: true,
                placeholder: 'Période 1',
                validateStatus: form.validate('designation', parent),
                help: form.error('designation', parent),
                defaultValue: (data ? data.designation : undefined) as PathValue<T, Path<T>>,
                onFinish: edit ? (value: unknown) => handleUpdate?.('designation', value) : undefined,
            }
        },
        ...(!edit ? [{
            type: InputTypeEnum.RADIO,
            inputProps: {
                hasForm: edit,
                md: onlyField ?? 12,
                lg: onlyField ?? 12,
                control: control,
                label: semesterOptions ? 'Semestre\\Trimestre' : <Alert
                    type='warning'
                    message={'Aucun semestre\\trimestre n\'existe dans le système. Veuillez créer un semestre\\trimestre avant d\'ajouter les plannings'}
                />,
                name: form.name('semester.semesterId', parent) as Path<T>,
                required: true,
                selectedValue: (edit && data ? data.semester?.semesterId : '') as PathValue<T, Path<T>>,
                validateStatus: form.validate('semester.semesterId', parent) as 'error',
                radioOptions: semesterOptions as [],
                help: form.error('semester.semesterId', parent),
                optionType: 'button',
            }
        } as never] : []),
        {
            type: InputTypeEnum.DATE,
            inputProps: {
                md: onlyField ?? 12,
                lg: onlyField ?? 12,
                label: 'Date de debut',
                control: control,
                name: form.name('termStartDate', parent) as Path<T>,
                required: true,
                placeholder: 'Début du Période',
                validateStatus: form.validate('termStartDate', parent),
                help: form.error('termStartDate', parent),
                defaultValue: (data ? data.designation : undefined) as PathValue<T, Path<T>>,
                onFinish: edit ? (value: unknown) => handleUpdate?.('termStartDate', value) : undefined,
            }
        },
        {
            type: InputTypeEnum.DATE,
            inputProps: {
                md: onlyField ?? 12,
                lg: onlyField ?? 12,
                label: 'Date de fin',
                control: control,
                name: form.name('termEndDate', parent) as Path<T>,
                required: true,
                placeholder: 'Fin du Période',
                validateStatus: form.validate('termEndDate', parent),
                help: form.error('termEndDate', parent),
                defaultValue: (data ? data.designation : undefined) as PathValue<T, Path<T>>,
                onFinish: edit ? (value: unknown) => handleUpdate?.('termEndDate', value) : undefined,
            }
        },
    ]} />
}