import Responsive from "../layout/Responsive.tsx";
import Grid from "../layout/Grid.tsx";
import {Form, Input, InputNumber} from "antd";
import {Controller} from "react-hook-form";
import CountrySelect from "./CountrySelect.tsx";
import {ZodControl} from "../../../utils/interfaces.ts";

const AddressForm = ({addressProps}: {addressProps: ZodControl[]}) => {
    return (
        <Responsive gutter={[16, 16]}>
            <Grid xs={24} md={12} lg={8}>
                <Responsive gutter={[16, 16]}>
                    <Grid xs={24} md={12} lg={8}>
                        <Form.Item label='N°' required tooltip='requis' validateStatus={addressProps[0].validateStatus} help={addressProps[0].help}>
                            <Controller name={addressProps[0].name as 'academicYear.id'} control={addressProps[0].control} render={({field}) => (
                                <InputNumber placeholder='17' {...field} />
                            )} />
                        </Form.Item>
                    </Grid>
                    <Grid xs={24} md={12} lg={16}>
                        <Form.Item label='Rue' required tooltip='requis' validateStatus={addressProps[1].validateStatus} help={addressProps[1].help}>
                            <Controller name={addressProps[1].name as 'academicYear.id'} defaultValue='' control={addressProps[0].control} render={({field}) => (
                                <Input placeholder='3 Martyrs' {...field} />
                            )} />
                        </Form.Item>
                    </Grid>
                </Responsive>
            </Grid>
            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Seconde Rue / Avenue' validateStatus={addressProps[2].validateStatus} help={addressProps[2].help}>
                    <Controller name={addressProps[2].name as 'academicYear.id'} defaultValue='' control={addressProps[2].control} render={({field}) => (
                        <Input placeholder='Av. de la 2ème Division Blindée' {...field} />
                    )} />
                </Form.Item>
            </Grid>
            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Quartier' required tooltip='requis' validateStatus={addressProps[3].validateStatus} help={addressProps[3].help}>
                    <Controller name={addressProps[3].name as 'academicYear.id'} defaultValue='' control={addressProps[3].control} render={({field}) => (
                        <Input placeholder='Moukoundzi Ngouaka' {...field} />
                    )} />
                </Form.Item>
            </Grid>
            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Arrondissement' validateStatus={addressProps[4].validateStatus} help={addressProps[4].help}>
                    <Controller name={addressProps[4].name as 'academicYear.id'} defaultValue='' control={addressProps[4].control} render={({field}) => (
                        <Input placeholder='Bacongo' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Ville' required tooltip='requis' validateStatus={addressProps[5].validateStatus} help={addressProps[5].help}>
                    <Controller name={addressProps[5].name as 'academicYear.id'} control={addressProps[5].control} defaultValue='' render={({field}) => (
                        <Input placeholder='Brazzaville' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Code Postal' validateStatus={addressProps[6].validateStatus} help={addressProps[6].help}>
                    <Controller name={addressProps[6].name as 'academicYear.id'} defaultValue='' control={addressProps[6].control} render={({field}) => (
                        <Input placeholder='99324' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <CountrySelect
                    control={addressProps[7].control}
                    label='Pays'
                    validateStatus={addressProps[7].validateStatus}
                    help={addressProps[7].help}   name={addressProps[7].name}/>
            </Grid>
        </Responsive>
    )
}

export default AddressForm