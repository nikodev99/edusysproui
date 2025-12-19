import {FormContentProps} from "@/core/utils/interfaces.ts";
import {FieldValues, Path, PathValue} from "react-hook-form";
import {InputTypeEnum} from "@/core/shared/sharedEnums.ts";
import FormContent from "@/components/ui/form/FormContent.tsx";
import {Student} from "@/entity";
import {FormUtils} from "@/core/utils/formUtils.ts";

type StudentFormProps<T extends FieldValues> = FormContentProps<T, Student> & { handleUpdate?: (field: keyof Student, value: unknown) => void };

const StudentForm = <T extends FieldValues>(studentProps:  StudentFormProps<T>) => {

    const {edit, data, control, errors, handleUpdate} = studentProps
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)

    const getValidationStatus = (fieldName: string) => {
        return FormUtils.getValidationStatus(fieldName, errors, edit as boolean, 'student', !edit)
    }

    const getErrorMessage = (fieldName: string) => {
        return FormUtils.getErrorMessage(fieldName, errors, edit as boolean, 'student', !edit)
    }

    return(
        <FormContent formItems={[
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
                    help: getErrorMessage('dadName'),
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('dadName', value) : undefined
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
                    help: getErrorMessage('momName'),
                    onFinish: edit && handleUpdate ? (value) => handleUpdate('momName', value) : undefined
                }
            },
        ]} />
    )
}

export default StudentForm