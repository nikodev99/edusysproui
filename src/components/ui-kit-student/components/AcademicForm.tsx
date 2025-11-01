import {ZodProps} from "../../../core/utils/interfaces.ts";
import Responsive from "../../ui/layout/Responsive.tsx";
import {useMemo} from "react";
import SelectInput from "../../ui/form/SelectInput.tsx";
import {EnrollmentSchema} from "../../../schema";
import {useAcademicYearRepo} from "../../../hooks/actions/useAcademicYearRepo.ts";
import {useClasseRepo} from "../../../hooks/actions/useClasseRepo.ts";

export const AcademicForm = ({control, errors}: ZodProps<EnrollmentSchema>) => {

    const {useGetCurrentAcademicYear} = useAcademicYearRepo()
    const {useGetClasseBasicValues} = useClasseRepo()

    const academicYear = useGetCurrentAcademicYear()
    const classes = useGetClasseBasicValues()

    //TODO ensure the client is connected
    const classeOptions = useMemo(() => classes.map(c => ({
        value: c.id,
        label: c.name,
    })), [classes])

    return(
        <Responsive gutter={[16, 16]}>
            <SelectInput
                lg={12}
                control={control}
                name='academicYear.id'
                label='Année Scolaire/Academique'
                placeholder="Selectionne l'année academique"
                required
                validateStatus={errors.academicYear ? 'error' : ''}
                help={errors.academicYear ? errors.academicYear.message : ''}
                selectedValue={academicYear?.id}
                options={[{value: academicYear?.id as string, label: academicYear?.academicYear as string}]}
            />
            <SelectInput
                lg={12}
                control={control}
                name='classe.id'
                label='Classe'
                placeholder='Selectionne une classe'
                required
                validateStatus={errors.classe?.id ? 'error' : ''}
                help={errors.classe?.id ? errors.classe?.id.message : ''}
                options={classeOptions}
            />
        </Responsive>
    )
}