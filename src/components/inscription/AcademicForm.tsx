import {ZodProps} from "../../utils/interfaces.ts";
import Responsive from "../ui/layout/Responsive.tsx";
import Grid from "../ui/layout/Grid.tsx";
import {Form, Input, Select} from "antd";
import {Controller} from "react-hook-form";
import {getAcademicYear} from "../../utils/utils.ts";
import {useEffect, useMemo, useState} from "react";
import {getClassesBasicValues} from "../../data/request";
import {Classe} from "../../entity";

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

    console.log('Classes: ', classes)

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
                    <Controller name='academicYear' defaultValue={academicYear} control={control} render={({field}) => (
                        <Input {...field} />
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