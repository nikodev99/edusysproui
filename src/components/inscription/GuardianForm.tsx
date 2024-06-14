import {GuardianProps} from "../../utils/interfaces.ts";
import Responsive from "../ui/layout/Responsive.tsx";
import Grid from "../ui/layout/Grid.tsx";
import {Checkbox, Collapse, Form, Input, Select} from "antd";
import {Controller} from "react-hook-form";
import {useMemo} from "react";
import {enumToObjectArray} from "../../utils/utils.ts";
import {Gender} from "../../entity/enums/gender.ts";
import {Status} from "../../entity/enums/status.ts";
import GuardianAddressForm from "./GuardianAddressForm.tsx";

const GuardianForm = ({control, errors, showField, checked, onChecked}: GuardianProps) => {

    const genderOptions = useMemo(() => enumToObjectArray(Gender), [])
    const statusOptions = useMemo(() => enumToObjectArray(Status), [])

    return(
        <Responsive gutter={[16, 16]}>
            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Nom(s) du tuteur' required tooltip='requis' validateStatus={errors.student?.guardian?.lastName ? 'error': ''} help={errors.student?.guardian?.lastName ? errors.student?.guardian?.lastName.message : ''}>
                    <Controller name='student.guardian.lastName' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='Malonga' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Prénom(s) du tuteur' required tooltip='requis' validateStatus={errors.student?.guardian?.firstName ? 'error': ''} help={errors.student?.guardian?.firstName ? errors.student?.guardian?.firstName.message : ''}>
                    <Controller name='student.guardian.firstName' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='Patrick' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Genre' required tooltip='requis' validateStatus={errors.student?.guardian?.gender ? 'error': ''} help={errors.student?.guardian?.gender ? errors.student?.guardian?.gender.message : ''}>
                    <Controller name='student.guardian.gender' control={control} render={({field}) => (
                        <Select placeholder='Selectionner le genre' options={genderOptions} {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Status Matrimonial' required tooltip='requis' validateStatus={errors.student?.guardian?.status ? 'error': ''} help={errors.student?.guardian?.status ? errors.student?.guardian?.status.message : ''}>
                    <Controller name='student.guardian.status' control={control} render={({field}) => (
                        <Select placeholder='Selectionner le status matrimonial du tuteur' options={statusOptions} {...field} />
                    )} />
                </Form.Item>
            </Grid>

            {showField && <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Nom(s) de jeune fille' validateStatus={errors.student?.guardian?.maidenName ? 'error': ''} help={errors.student?.guardian?.maidenName ? errors.student?.guardian?.maidenName.message : ''}>
                    <Controller name='student.guardian.maidenName' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='Mavouanga' {...field} />
                    )} />
                </Form.Item>
            </Grid>}

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='E-mail' validateStatus={errors.student?.guardian?.emailId ? 'error': ''} help={errors.student?.guardian?.emailId ? errors.student?.guardian?.emailId.message : ''}>
                    <Controller name='student.guardian.emailId' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='p.malonga@gmail.com' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Employeur' validateStatus={errors.student?.guardian?.company ? 'error': ''} help={errors.student?.guardian?.company ? errors.student?.guardian?.company.message : ''}>
                    <Controller name='student.guardian.company' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='Total Energie' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Poste' validateStatus={errors.student?.guardian?.jobTitle ? 'error': ''} help={errors.student?.guardian?.jobTitle ? errors.student?.guardian?.jobTitle.message : ''}>
                    <Controller name='student.guardian.jobTitle' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='Malonga Marie' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Téléphone' required tooltip='requis' validateStatus={errors.student?.guardian?.telephone ? 'error': ''} help={errors.student?.guardian?.telephone ? errors.student?.guardian?.telephone.message : ''}>
                    <Controller name='student.guardian.telephone' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='060000000' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <Form.Item label='Mobile' validateStatus={errors.student?.guardian?.mobile ? 'error': ''} help={errors.student?.guardian?.mobile ? errors.student?.guardian?.mobile.message : ''}>
                    <Controller name='student.guardian.mobile' control={control} defaultValue='' render={({field}) => (
                        <Input placeholder='060000000' {...field} />
                    )} />
                </Form.Item>
            </Grid>

            <Grid xs={24} md={24} lg={24} className='guardian__address__check'>
                <Collapse defaultActiveKey={['1']} items={[
                    {
                        key: 1,
                        label: <Checkbox checked={checked} onClick={onChecked}>L'adresse du tuteur correspond à celui de l'élève/étudiant</Checkbox>,
                        children: <GuardianAddressForm control={control} errors={errors}/>,
                        showArrow: false,
                        collapsible: 'icon'
                    }]
                } activeKey={!checked ? 1 : ''} />
            </Grid>
        </Responsive>
    )
}

export default GuardianForm