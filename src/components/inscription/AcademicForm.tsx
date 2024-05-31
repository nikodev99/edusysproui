import {ZodProps} from "../../utils/interfaces.ts";
import Responsive from "../ui/Responsive.tsx";
import Grid from "../ui/Grid.tsx";
import {Form, Input, Select} from "antd";
import {Controller} from "react-hook-form";
import {getAcademicYear} from "../../utils/utils.ts";
import {useEffect, useMemo, useState} from "react";
import {getClassesBasicValues} from "../../data/request";
import {Classe} from "../../entity/classe.ts";

const AcademicForm = ({control, errors}: ZodProps) => {

    const academicYear = useMemo(() => getAcademicYear(), [])
    const [classes, setClasses] = useState<Classe[]>([])

    useEffect(() => {
        getClassesBasicValues()
            .then((classe) => {
                setClasses(classe.data);
            })
            .catch((error) => console.error(error))
            .finally(() => { return null})
    }, []);

    const options = useMemo(() => classes.map(c => ({
        value: c.id,
        label: c.name,
    })), [classes])

    return(
        <Responsive gutter={[16, 16]}>
            <Grid xs={24} md={12} lg={12}>
                <Form.Item
                    label='Année Scolaire/Academique' required tooltip='requis'
                    validateStatus={errors.enrollment && errors.enrollment[0]?.academicYear ? 'error' : ''}
                    help={errors.enrollment && errors.enrollment[0]?.academicYear ? errors.enrollment[0]?.academicYear.message : ''}
                >
                    <Controller name={`enrollment.${0}.academicYear`} defaultValue={academicYear} control={control} render={({field}) => (
                        <Input {...field} />
                    )} />
                </Form.Item>
            </Grid>
            <Grid xs={24} md={12} lg={12}>
                <Form.Item
                    label='Classe' required tooltip='requis'
                    validateStatus={errors.enrollment && errors.enrollment[0]?.classe?.id ? 'error' : ''}
                    help={errors.enrollment && errors.enrollment[0]?.classe?.id ? errors.enrollment[0]?.classe?.id.message : ''}
                >
                    <Controller name={`enrollment.${0}.classe.id`} control={control} render={({field}) => (
                        <Select placeholder='Selectionne une classe' options={options} {...field} />
                    )} />
                </Form.Item>
            </Grid>
        </Responsive>
    )
}

export default AcademicForm