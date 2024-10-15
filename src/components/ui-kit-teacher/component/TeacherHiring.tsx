import {TeacherSchema, ZodProps} from "../../../utils/interfaces.ts";
import DateInput from "../../ui/form/DateInput.tsx";
import TextInput from "../../ui/form/TextInput.tsx";
import Responsive from "../../ui/layout/Responsive.tsx";

const TeacherHiring = ({control, errors, showField}: ZodProps<TeacherSchema>) => {
    return(
        <Responsive gutter={[16, 16]}>

            <DateInput
                lg={12}
                control={control}
                name='hireDate'
                label="Date d'embauche"
            />
            <TextInput.Number
                lg={12}
                control={control}
                name='salaryByHour'
                label='Salaire par heure'
                required
                addonAfter='FCFA'
                placeholder='15OO'
                disabled={showField}
                help={errors.salaryByHour ? errors.salaryByHour?.message : ''}
                validateStatus={errors.salaryByHour ? 'error' : ''}
            />
        </Responsive>
    )
}

export { TeacherHiring }