import {ZodProps} from "../../utils/interfaces.ts";
import Responsive from "../ui/Responsive.tsx";
import Grid from "../ui/Grid.tsx";
import {Controller} from "react-hook-form";
import {Form, Input} from "antd";
import CountrySelect from "../ui/CountrySelect.tsx";

const AddressForm = ({errors, control}: ZodProps) => {

    return (
        <Responsive gutter={[16, 16]}>
            <Grid xs={24} md={12} lg={8}>
                <Responsive gutter={[16, 16]}>
                    <Grid xs={24} md={12} lg={8}>
                        <Form.Item label='N°' required tooltip='requis' validateStatus={errors?.student?.address?.number ? 'error': ''} help={errors?.student?.address?.number ? errors.student?.address.number.message : ''}>
                            <Controller name='student.address.number' control={control} render={({field}) => (
                                <Input placeholder='17' {...field} />
                            )} />
                        </Form.Item>
                    </Grid>
                    <Grid xs={24} md={12} lg={16}>
                        <Form.Item label='Rue' required tooltip='requis' validateStatus={errors?.student?.address?.street ? 'error': ''} help={errors?.student?.address?.street ? errors.student?.address.street.message : ''}>
                            <Controller name='student.address.street' defaultValue='' control={control} render={({field}) => (
                                <Input placeholder='3 Martyrs' {...field} />
                            )} />
                        </Form.Item>
                    </Grid>
                </Responsive>
            </Grid>
            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Seconde Rue / Avenue' validateStatus={errors?.student?.address?.secondStreet ? 'error': ''} help={errors?.student?.address?.secondStreet ? errors.student?.address.secondStreet.message : ''}>
                    <Controller name='student.address.secondStreet' defaultValue='' control={control} render={({field}) => (
                        <Input placeholder='Av. de la 2ème Division Blindée' {...field} />
                    )} />
                </Form.Item>
            </Grid>
            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Quartier' required tooltip='requis' validateStatus={errors?.student?.address?.neighborhood ? 'error': ''} help={errors?.student?.address?.neighborhood ? errors.student?.address.neighborhood.message : ''}>
                    <Controller name='student.address.neighborhood' defaultValue='' control={control} render={({field}) => (
                        <Input placeholder='Moukoundzi Ngouaka' {...field} />
                    )} />
                </Form.Item>
            </Grid>
            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Arrondissement' validateStatus={errors?.student?.address?.borough ? 'error': ''} help={errors?.student?.address?.borough ? errors?.student?.address.borough.message : ''}>
                    <Controller name='student.address.borough' defaultValue='' control={control} render={({field}) => (
                        <Input placeholder='Bacongo' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Ville' required tooltip='requis' validateStatus={errors?.student?.address?.city ? 'error': ''} help={errors?.student?.address?.city ? errors.student?.address?.city.message : ''}>
                    <Controller name='student.address.city' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='Brazzaville' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Code Postal' validateStatus={errors?.student?.address?.zipCode ? 'error': ''} help={errors?.student?.address?.zipCode ? errors?.student?.address.zipCode.message : ''}>
                    <Controller name='student.address.zipCode' defaultValue='' control={control} render={({field}) => (
                        <Input placeholder='99324' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <CountrySelect
                    control={control}
                    label='Pays'
                    validateStatus={errors?.student?.address?.country ? 'error': ''}
                    help={errors?.student?.address?.country ? errors.student?.address?.country.message : ''}   name='student.address.country'/>
            </Grid>
        </Responsive>
    )
}

export default AddressForm