import FormContent from "../ui/form/FormContent.tsx";
import {FieldValues, Path, PathValue} from "react-hook-form";
import {FormContentProps, Options} from "../../core/utils/interfaces.ts";
import {DBoss, Department, Employee} from "../../entity";
import {FormConfig} from "../../config/FormConfig.ts";
import {FormUtils} from "../../core/utils/formUtils.ts";
import {useAcademicYearRepo} from "../../hooks/useAcademicYearRepo.ts";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import {useCallback, useMemo, useState} from "react";
import {setFirstName} from "../../core/utils/utils.ts";
import {useSearch} from "../../hooks/useSearch.ts";
import {useEmployeeRepo} from "../../hooks/useEmployeeRepo.ts";
import {Space, Spin, Typography} from "antd";

type DepartmentFormProps<T extends FieldValues> = FormContentProps<T, Department> & {
    handleUpdate?: (field: keyof Department, value: unknown) => void;
}

type DepartmentBossFormProps<T extends FieldValues> = FormContentProps<T, DBoss> & {
    handleUpdate?: (field: keyof DBoss, value: unknown) => void;
}

export const DepartmentForm = <TData extends FieldValues>(
    {errors, control, data, edit = false, handleUpdate}: DepartmentFormProps<TData>
) => {
    const form = new FormConfig(errors, edit)
    const onlyField = FormUtils.onlyField(edit as boolean, 24, 12)
    const {Text} = Typography

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
            },
            {
                type: InputTypeEnum.TEXTAREA,
                inputProps: {
                    lg: onlyField,
                    md: onlyField,
                    hasForm: edit,
                    label: <Space>
                        <Text>Description</Text>
                        <Text italic disabled>Caractères maximum: 500 </Text>
                    </Space>,
                    control: control,
                    name: form.name('purpose') as Path<TData>,
                    validateStatus: form.validate('purpose'),
                    help: form.error( 'purpose'),
                    placeholder: 'Descriptions, Objectif ou importance de département',
                    defaultValue: (data ? data.purpose : undefined) as PathValue<TData, Path<TData>>,
                    onFinish: edit ? (value: unknown) => handleUpdate?.('purpose', value) : undefined
                }
            }
        ]} />
    )
}

export const DepartmentBossForm = <TData extends FieldValues>(
    {errors, control, data, edit = false, handleUpdate}: DepartmentBossFormProps<TData>
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
                name: form.name('id', 'academicYear') as Path<TData>,
                validateStatus: form.validate('id', 'academicYear'),
                help: form.error('id', 'academicYear'),
                selectedValue: yearOptions[0].value as PathValue<TData, Path<TData>>,
                onFinish: edit ? (value: unknown) => handleUpdate?.("academicYear", value) : undefined,
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
                onChange: handleChange,
                showSearch: true,
                name: form.name('id', 'd_boss') as Path<TData>,
                validateStatus: form.validate('id', 'd_boss'),
                help: form.error('id', 'd_boss'),
                selectedValue: (data ? data?.d_boss?.id : searchValue) as PathValue<TData, Path<TData>>,
                onFinish: edit ? (value: unknown) => handleUpdate?.('d_boss', value) : undefined,
                notFoundContent: fetching ? <Spin /> : null,
                options: options,
            }
        },
        {
            type: InputTypeEnum.DATE,
            inputProps: {
                md: onlyField,
                lg: onlyField,
                label: 'Date de debut mandat',
                control: control,
                name: form.name('startPeriod') as Path<TData>,
                placeholder: 'Début du mandat',
                validateStatus: form.validate('startPeriod'),
                help: form.error('startPeriod'),
                defaultValue: data ? data.startPeriod : undefined,
                onFinish: edit ? (value: unknown) => handleUpdate?.('startPeriod', value) : undefined,
            }
        },
        {
            type: InputTypeEnum.DATE,
            inputProps: {
                md: onlyField,
                lg: onlyField,
                label: 'Date de fin mandat',
                control: control,
                name: form.name('endPeriod') as Path<TData>,
                placeholder: 'Fin du Période',
                validateStatus: form.validate('endPeriod'),
                help: form.error('endPeriod'),
                defaultValue: data ? data?.endPeriod : undefined,
                onFinish: edit ? (value: unknown) => handleUpdate?.('endPeriod', value) : undefined,
            }
        }
    ]} />
}
