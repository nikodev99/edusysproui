import Responsive from "../layout/Responsive.tsx";
import {TypedInputType} from "../../../core/utils/interfaces.ts";
import {FieldValues} from "react-hook-form";
import TextInput from "./TextInput.tsx";
import SelectInput from "./SelectInput.tsx";
import DateInput from "./DateInput.tsx";
import CountrySelect from "./CountrySelect.tsx";
import {InputTypeEnum} from "../../../core/shared/sharedEnums.ts";
import ListInput from "./ListInput.tsx";
import RadioInput from "./RadioInput.tsx";
import {TimeInput} from "./TimeInput.tsx";

interface InputProps<TFieldValues extends FieldValues> {
    inputProps: TypedInputType<TFieldValues>,
    type: InputTypeEnum
}

interface FormContentProps<T extends FieldValues> {
    formItems: InputProps<T>[],
    responsiveness?: boolean
}

const FormContent = <T extends FieldValues>({formItems, responsiveness}: FormContentProps<T>) => {

    const renderInput = ({type, inputProps}: InputProps<T>, index: string) => {
        switch (type) {
            case InputTypeEnum.TEXT:
                return <TextInput key={index} {...inputProps} />
            case InputTypeEnum.SELECT:
                return <SelectInput key={index} {...inputProps} />
            case InputTypeEnum.DATE:
                return <DateInput key={index} {...inputProps} />
            case InputTypeEnum.COUNTRY:
                return <CountrySelect key={index} {...inputProps} />
            case InputTypeEnum.NUMBER:
                return <TextInput.Number key={index} {...inputProps} />
            case InputTypeEnum.LIST:
                return <ListInput key={index} {...inputProps} />
            case InputTypeEnum.TIME:
                return <TimeInput key={index} {...inputProps} />
            case InputTypeEnum.RADIO:
                return <RadioInput key={index} {...inputProps} />
            default:
                return null;
        }
    }

    return(
        <>
            {responsiveness ? (
                formItems.map((input, index) => (
                    renderInput(input, `input-${index}`)
                ))
            ): (
                <Responsive gutter={[16, 16]}>
                    {
                        formItems.map((input, index) => (
                            renderInput(input, `input-${index}`)
                        ))
                    }
                </Responsive>
            )}
        </>
    )
}

export default FormContent