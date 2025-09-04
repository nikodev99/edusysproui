import FormContent from "../ui/form/FormContent.tsx";
import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormContentProps, Options} from "../../core/utils/interfaces.ts";
import {Department, Employee} from "../../entity";
import {FormConfig} from "../../config/FormConfig.ts";
import {FormUtils} from "../../core/utils/formUtils.ts";
import {useAcademicYearRepo} from "../../hooks/useAcademicYearRepo.ts";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {useCallback, useMemo, useState} from "react";
import {setFirstName} from "../../core/utils/utils.ts";
import {useSearch} from "../../hooks/useSearch.ts";
import {useEmployeeRepo} from "../../hooks/useEmployeeRepo.ts";
import {Spin} from "antd";

type Defaults = { academicYear?: string; dBoss?: number }

type DepartmentFormProps<T extends FieldValues> = FormContentProps<T, Department> & {
    handleUpdate?: (field: keyof Department, value: unknown) => void;
    getDefaultValue?: (value: Defaults) => void
}

export const DepartmentForm = <TData extends FieldValues>(
    {errors, control, data, edit = false, handleUpdate}: DepartmentFormProps<TData>
) => {
    const form = new FormConfig(errors, edit)
    const onlyField = FormUtils.onlyField(edit as boolean, 24, 12)

    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    lg: onlyField,
                    md: onlyField,
                    hasForm: edit,
                    label: 'Nom du département',
                    required: true,
                    control: control,
                    name: form.name('name') as Path<TData>,
                    validateStatus: form.validate('name'),
                    help: form.error( 'name'),
                    placeholder: 'Département de mathématique',
                    defaultValue: (data ? data.name : undefined) as PathValue<TData, Path<TData>>,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('name', value) : undefined
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    lg: onlyField,
                    md: onlyField,
                    hasForm: edit,
                    label: 'Code ou intitulé',
                    required: true,
                    control: control,
                    name: form.name('code') as Path<TData>,
                    validateStatus: form.validate('code'),
                    help: form.error( 'code'),
                    placeholder: 'Mathématique',
                    defaultValue: (data ? data.code : undefined) as PathValue<TData, Path<TData>>,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('code', value) : undefined
                }
            }
        ]} />
    )
}

export const DepartmentBossForm = <TData extends FieldValues>(
    {errors, control, data, edit = false, handleUpdate, getDefaultValue}: DepartmentFormProps<TData>
) => {

    const [searchValue, setSearchValue] = useState<number | undefined>(undefined)

    const form = new FormConfig(errors, edit)
    const onlyField = FormUtils.onlyField(edit as boolean, 24, 12)
    const {academicYearOptions} = useAcademicYearRepo()
    const {fetchEmployeeIndividuals} = useEmployeeRepo()

    const yearOptions = useMemo(() => academicYearOptions(true), [academicYearOptions])

    const employeeOptions = useCallback((data?: Employee[]): Options => {
        return data ? data?.map(d => ({
            label: setFirstName(`${d?.personalInfo?.lastName} ${d?.personalInfo?.firstName}`),
            value: d?.personalInfo?.id as number
        })) : [] as Options
    }, [])

    const {fetching, options, handleSearch, handleChange} = useSearch({
        setValue: setSearchValue as (value: unknown) => void,
        fetchFunc: fetchEmployeeIndividuals as never,
        setCustomOptions: employeeOptions,
    })

    const changeHandler = useCallback((value: string) => {
        if (getDefaultValue && value && yearOptions.length > 0) {
            getDefaultValue?.({
                academicYear: yearOptions[0]?.value as string,
                dBoss: Number.parseInt(value)
            })
            handleChange(value)
        }
    }, [getDefaultValue, handleChange, yearOptions])

    return <FormContent formItems={[
        {
            type: InputTypeEnum.SELECT,
            inputProps: {
                lg: onlyField,
                md: onlyField,
                hasForm: edit,
                options: yearOptions as [],
                label: 'Année Academique',
                control: control,
                name: form.name('academicYear.id', 'boss') as Path<TData>,
                validateStatus: form.validate('academicYear.id', 'boss'),
                help: form.error('academicYear.id', 'boss'),
                selectedValue: yearOptions[0].value as PathValue<TData, Path<TData>>,
                onFinish: edit ? (value: unknown) => handleUpdate?.("boss", value) : undefined,
                disabled: true
            }
        },
        {
            type: InputTypeEnum.SELECT,
            inputProps: {
                lg: onlyField,
                md: onlyField,
                hasForm: edit,
                label: 'Chef du département',
                placeholder: 'Choisissez le chef du département',
                control: control,
                filterOption: true,
                onSearch: handleSearch,
                onChange: changeHandler,
                showSearch: true,
                name: form.name('d_boss.id', 'boss') as Path<TData>,
                validateStatus: form.validate('d_boss.id', 'boss'),
                help: form.error('d_boss.id', 'boss'),
                selectedValue: (data ? data?.boss?.academicYear?.id : searchValue) as PathValue<TData, Path<TData>>,
                onFinish: edit ? (value: unknown) => handleUpdate?.('boss', value) : undefined,
                notFoundContent: fetching ? <Spin /> : null,
                options: options,
            }
        },
        {
            type: InputTypeEnum.DATE,
            inputProps: {
                md: onlyField,
                lg: onlyField,
                label: 'Date de debut',
                control: control,
                name: form.name('startPeriod', 'boss') as Path<TData>,
                placeholder: 'Début du mandat',
                validateStatus: form.validate('startPeriod', 'boss'),
                help: form.error('startPeriod', 'boss'),
                defaultValue: data ? data.boss?.startPeriod : undefined,
                onFinish: edit ? (value: unknown) => handleUpdate?.('boss', value) : undefined,
            }
        },
        {
            type: InputTypeEnum.DATE,
            inputProps: {
                md: onlyField,
                lg: onlyField,
                label: 'Date de mandat',
                control: control,
                name: form.name('endPeriod', 'boss') as Path<TData>,
                placeholder: 'Fin du Période',
                validateStatus: form.validate('endPeriod', 'boss'),
                help: form.error('endPeriod', 'boss'),
                defaultValue: data ? data.boss?.endPeriod : undefined,
                onFinish: edit ? (value: unknown) => handleUpdate?.('boss', value) : undefined,
            }
        }
    ]} />
}
