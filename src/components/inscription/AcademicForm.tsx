import {ZodProps} from "../../utils/interfaces.ts";
import Responsive from "../ui/layout/Responsive.tsx";
import Grid from "../ui/layout/Grid.tsx";
import {Form, Select} from "antd";
import {Controller} from "react-hook-form";
import {useEffect, useMemo, useState} from "react";
import {AcademicYear, Classe} from "../../entity";
import {findClassesBasicValue} from "../../data";
import {findCurrentAcademicYear} from "../../data/action/fetch_academic_year.ts";

const AcademicForm = ({control, errors}: ZodProps) => {

    const [classes, setClasses] = useState<Classe[]>([])
    const [academicYear, setAcademicYear] = useState<AcademicYear>({})

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
    const options = useMemo(() => classes.map(c => ({
        value: c.id,
        label: c.name,
    })), [classes])

    return(
        <Responsive gutter={[16, 16]}>
            <Grid xs={24} md={12} lg={12}>
                <Form.Item
                    label='Année Scolaire/Academique' required tooltip='requis'
                    validateStatus={errors.academicYear ? 'error' : ''}
                    help={errors.academicYear ? errors.academicYear.message : ''}
                >
                    <Controller name='academicYear.id' defaultValue={academicYear.id} control={control} render={({field}) => (
                        <Select options={[{value: academicYear.id, label: academicYear.academicYear}]} {...field} />
                    )} />
                </Form.Item>
            </Grid>
            <Grid xs={24} md={12} lg={12}>
                <Form.Item
                    label='Classe' required tooltip='requis'
                    validateStatus={errors.classe?.id ? 'error' : ''}
                    help={errors.classe?.id ? errors.classe?.id.message : ''}
                >
                    <Controller name='classe.id' control={control} render={({field}) => (
                        <Select placeholder='Selectionne une classe' options={options} {...field} />
                    )} />
                </Form.Item>
            </Grid>
        </Responsive>
    )
}

export default AcademicForm