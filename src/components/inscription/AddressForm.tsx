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
                        <Form.Item label='N°' required tooltip='requis' validateStatus={errors?.address?.number ? 'error': ''} help={errors?.address?.number ? errors.address.number.message : ''}>
                            <Controller name='address.number' control={control} render={({field}) => (
                                <Input placeholder='17' {...field} />
                            )} />
                        </Form.Item>
                    </Grid>
                    <Grid xs={24} md={12} lg={16}>
                        <Form.Item label='Rue' required tooltip='requis' validateStatus={errors?.address?.street ? 'error': ''} help={errors?.address?.street ? errors.address.street.message : ''}>
                            <Controller name='address.street' defaultValue='' control={control} render={({field}) => (
                                <Input placeholder='3 Martyrs' {...field} />
                            )} />
                        </Form.Item>
                    </Grid>
                </Responsive>
            </Grid>
            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Seconde Rue / Avenue' validateStatus={errors?.address?.secondStreet ? 'error': ''} help={errors?.address?.secondStreet ? errors.address.secondStreet.message : ''}>
                    <Controller name='address.secondStreet' defaultValue='' control={control} render={({field}) => (
                        <Input placeholder='Av. de la 2ème Division Blindée' {...field} />
                    )} />
                </Form.Item>
            </Grid>
            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Quartier' required tooltip='requis' validateStatus={errors?.address?.neighborhood ? 'error': ''} help={errors?.address?.neighborhood ? errors.address.neighborhood.message : ''}>
                    <Controller name='address.neighborhood' defaultValue='' control={control} render={({field}) => (
                        <Input placeholder='Moukoundzi Ngouaka' {...field} />
                    )} />
                </Form.Item>
            </Grid>
            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Arrondissement' validateStatus={errors?.address?.borough ? 'error': ''} help={errors?.address?.borough ? errors?.address.borough.message : ''}>
                    <Controller name='address.borough' defaultValue='' control={control} render={({field}) => (
                        <Input placeholder='Bacongo' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Ville' required tooltip='requis' validateStatus={errors?.address?.city ? 'error': ''} help={errors?.address?.city ? errors.address?.city.message : ''}>
                    <Controller name='address.city' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='Brazzaville' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Code Postal' validateStatus={errors?.address?.zipCode ? 'error': ''} help={errors?.address?.zipCode ? errors?.address.zipCode.message : ''}>
                    <Controller name='address.zipCode' defaultValue='' control={control} render={({field}) => (
                        <Input placeholder='99324' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <CountrySelect
                    control={control}
                    label='Pays'
                    validateStatus={errors?.address?.country ? 'error': ''}
                    help={errors?.address?.country ? errors.address?.country.message : ''}   name={"address.country"}/>
            </Grid>
        </Responsive>
    )
}

export default AddressForm