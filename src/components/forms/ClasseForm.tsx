import FormContent from "../ui/form/FormContent.tsx";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {FormContentProps} from "../../core/utils/interfaces.ts";
import {Classe, Grade} from "../../entity";
import {FieldValues, Path, PathValue} from "react-hook-form";
import {useEffect, useState} from "react";
import {useRawFetch} from "../../hooks/useFetch.ts";
import {getAllSchoolGrades} from "../../data/repository/gradeRepository.ts";
import {SectionType} from "../../entity/enums/section.ts";
import {FormConfig} from "../../config/FormConfig.ts";

export const ClasseForm = <T extends FieldValues>(
    {control, data, errors}: FormContentProps<T, Classe>
) => {
    const [grades, setGrades] = useState<Grade[] | null>(null)
    const fetch = useRawFetch<Grade>()
    
    useEffect(() => {
        fetch(getAllSchoolGrades).then(r => {
            if (r.isSuccess) {
                setGrades(r.data as Grade[])
            }
        })
    }, [fetch])

    const form = new FormConfig(errors, false)

    const gradeOptions = grades ? grades?.map(g => ({
        value: g.id,
        label: SectionType[g.section as unknown as keyof typeof SectionType],
    })) : []
    
    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    lg: 12,
                    label: 'Nom de la classe',
                    control: control,
                    name: 'name' as Path<T>,
                    required: true,
                    placeholder: 'Terminal A',
                    validateStatus: form.validate('name'),
                    help: form.error('name'),
                    defaultValue: (data ? data.name : undefined) as PathValue<T, Path<T>>
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    lg: 12,
                    label: 'Catégorie\\Nom complet',
                    control: control,
                    name: 'category' as Path<T>,
                    placeholder: 'Terminal Littéraire',
                    defaultValue: (data ? data.category : undefined) as PathValue<T, Path<T>>
                }
            },
            {
                type: InputTypeEnum.SELECT,
                inputProps: {
                    lg: 12,
                    options: gradeOptions as [],
                    label: 'Grade\\Niveau',
                    control: control,
                    name: 'grade.id' as Path<T>,
                    required: true,
                    placeholder: 'Lycée',
                    validateStatus: form.validate('id', 'grade'),
                    help: form.error('id', 'grade'),
                    selectedValue: (data ? data.grade.id : undefined) as PathValue<T, Path<T>>
                }
            },
            {
                type: InputTypeEnum.NUMBER,
                inputProps: {
                    lg: 12,
                    label: 'Numéro de la salle de classe',
                    control: control,
                    name: 'roomNumber' as Path<T>,
                    placeholder: '30',
                    defaultValue: (data ? data.roomNumber : undefined) as PathValue<T, Path<T>>
                }
            },
            {
                type: InputTypeEnum.NUMBER,
                inputProps: {
                    lg: 12,
                    label: 'Frais académique par mois',
                    control: control,
                    name: 'monthCost' as Path<T>,
                    required: true,
                    placeholder: '15000',
                    validateStatus: form.validate('monthCost'),
                    help: form.error('monthCost'),
                    defaultValue: (data ? data.monthCost : undefined) as PathValue<T, Path<T>>
                }
            }
        ]} />
    )
}