import {EnrollmentSchema, ZodProps} from "../../../utils/interfaces.ts";
import Responsive from "../../ui/layout/Responsive.tsx";
import {useEffect, useMemo, useState} from "react";
import {AcademicYear, Classe} from "../../../entity";
import {findClassesBasicValue} from "../../../data";
import {findCurrentAcademicYear} from "../../../data/action/fetch_academic_year.ts";
import SelectInput from "../../ui/form/SelectInput.tsx";

export const AcademicForm = ({control, errors}: ZodProps<EnrollmentSchema>) => {

    const [classes, setClasses] = useState<Classe[]>([])
    const [academicYear, setAcademicYear] = useState<AcademicYear | undefined>(undefined)

    useEffect(() => {
        const fetchData = async () => {
            await findClassesBasicValue()
                .then((resp) => {
                    if (resp && resp.isSuccess) {
                        setClasses(resp.data as Classe[])
                    }
                })

            await findCurrentAcademicYear()
                .then(async (resp) => {
                    if (resp && resp.isSuccess) {
                        setAcademicYear(resp.data as AcademicYear)

                    }
                })
        }
        fetchData().catch(e => console.error(e.message))
    }, []);

    console.log('Academic Year: ', academicYear)

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