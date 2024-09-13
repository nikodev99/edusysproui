import {ZodProps} from "../../utils/interfaces.ts";
import {Student} from "../../entity";
import {FieldValues, Path, PathValue} from "react-hook-form";
import {InputTypeEnum} from "../../core/shared/sharedEnums.ts";
import FormContent from "../ui/form/FormContent.tsx";
import {useMemo} from "react";
import {enumToObjectArray} from "../../utils/utils.ts";
import {Gender} from "../../entity/enums/gender.ts";

interface StudentProps<T extends FieldValues> extends ZodProps<T> {
    edit?: boolean
    data?: Student
}

const StudentForm = <T extends FieldValues>(studentProps:  StudentProps<T>) => {

    const genderOptions = useMemo(() => enumToObjectArray(Gender), [])
    const {edit, data, control, errors} = studentProps
    const onlyField = edit ? 24 : undefined

    const getValidationStatus = (fieldName: string) => {
        if (edit) {
            return errors?.[fieldName] ? 'error' : '';
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            return errors?.student?.[fieldName] ? 'error' : '';
        }
    };

    const getErrorMessage = (fieldName: string) => {
        if (edit) {
            return errors?.[fieldName]?.message || '';
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            return errors?.student?.[fieldName]?.message || '';
        }
    };

    return(
        <FormContent formItems={[
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    label: 'Nom(s) de Famille',
                    control: control,
                    name: (edit ? 'lastName' : 'student.lastName') as Path<T>,
                    required: true,
                    defaultValue: (edit && data ? data.lastName : '') as PathValue<T, Path<T>>,
                    placeholder: 'Malonga',
                    validateStatus: getValidationStatus('lastName'),
                    help: getErrorMessage('lastName')
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    md: onlyField,
                    lg: onlyField,
                    hasForm: edit,
                    label: 'Prénom(s)',
                    control: control,
                    name: (edit ? 'firstName' : 'student.firstName') as Path<T>,
                    required: true,
                    defaultValue: (edit && data ? data.firstName : '') as PathValue<T, Path<T>>,
                    placeholder: 'Patrick',
                    validateStatus: getValidationStatus('firstName'),
                    help: getErrorMessage('firstName')
                }
            },
            {
                type: InputTypeEnum.SELECT,
                inputProps: {
                    options: genderOptions,
                    name: (edit ? 'gender' : 'student.gender') as Path<T>,
                    label: 'Genre',
                    control: control,
                    required: true,
                    validateStatus: getValidationStatus('gender'),
                    help: getErrorMessage('gender'),
                    placeholder: 'Sélectionner le genre',
                    md: onlyField,
                    lg: onlyField,
                    hasForm: edit,
                    selectedValue: (edit && data ? data.gender : '') as PathValue<T, Path<T>>
                }
            },
            {
                type: InputTypeEnum.DATE,
                inputProps: {
                    control: control,
                    name: (edit ? 'birthDate' : 'student.birthDate') as Path<T>,
                    label: 'Date de Naissance',
                    required: true,
                    validateStatus: getValidationStatus('birthDate'),
                    help: getErrorMessage('birthDate'),
                    defaultValue: (edit && data ? data.birthDate : '') as PathValue<T, Path<T>>,
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    label: 'Lieux de Naissance',
                    control: control,
                    name: (edit ? 'birthCity' : 'student.birthCity') as Path<T>,
                    required: true,
                    defaultValue: (edit && data ? data.birthCity : '') as PathValue<T, Path<T>>,
                    placeholder: 'Brazzaville',
                    validateStatus: getValidationStatus('birthCity'),
                    help: getErrorMessage('birthCity')
                }
            },
            {
                type: InputTypeEnum.COUNTRY,
                inputProps: {
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    label: 'Nationalité',
                    control: control,
                    name: (edit ? 'nationality' : 'student.nationality') as Path<T>,
                    required: true,
                    defaultValue: (edit && data ? data.nationality : '') as PathValue<T, Path<T>>,
                    validateStatus: getValidationStatus('nationality'),
                    help: getErrorMessage('nationality'),
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    hasForm: edit,
                    md: edit ? onlyField: 12,
                    lg: edit ? onlyField: 12,
                    label: 'Nom(s) et Prénom(s) du père',
                    control: control,
                    name: (edit ? 'dadName' : 'student.dadName') as Path<T>,
                    required: true,
                    defaultValue: (edit && data ? data.dadName : '') as PathValue<T, Path<T>>,
                    placeholder: 'Malonga Patrick',
                    validateStatus: getValidationStatus('dadName'),
                    help: getErrorMessage('dadName')
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    hasForm: edit,
                    md: edit ? onlyField: 12,
                    lg: edit ? onlyField: 12,
                    label: 'Nom(s) et Prénom(s) de la mère',
                    control: control,
                    name: (edit ? 'momName' : 'student.momName') as Path<T>,
                    required: true,
                    defaultValue: (edit && data ? data.momName : '') as PathValue<T, Path<T>>,
                    placeholder: 'Malonga Marie',
                    validateStatus: getValidationStatus('momName'),
                    help: getErrorMessage('momName')
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    label: 'E-mail',
                    control: control,
                    name: (edit ? 'emailId' : 'student.emailId') as Path<T>,
                    defaultValue: (edit && data ? data.emailId : '') as PathValue<T, Path<T>>,
                    placeholder: 'p.malonga@gmail.com',
                    validateStatus: getValidationStatus('emailId'),
                    help: getErrorMessage('emailId')
                }
            },
            {
                type: InputTypeEnum.TEXT,
                inputProps: {
                    hasForm: edit,
                    md: onlyField,
                    lg: onlyField,
                    label: 'Téléphone',
                    control: control,
                    name: (edit ? 'telephone' : 'student.telephone') as Path<T>,
                    defaultValue: (edit && data ? data.telephone : '') as PathValue<T, Path<T>>,
                    placeholder: '060000000',
                    validateStatus: getValidationStatus('telephone'),
                    help: getErrorMessage('telephone')
                }
            }
        ]} />
    )
}

export default StudentForm