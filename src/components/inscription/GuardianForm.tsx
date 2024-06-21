import {GuardianProps} from "../../utils/interfaces.ts";
import Responsive from "../ui/layout/Responsive.tsx";
import Grid from "../ui/layout/Grid.tsx";
import {Button, Checkbox, Collapse, Divider, Form, Modal, Select, SelectProps} from "antd";
import {Controller} from "react-hook-form";
import {useMemo, useRef, useState} from "react";
import {enumToObjectArray} from "../../utils/utils.ts";
import {Gender} from "../../entity/enums/gender.ts";
import {Status} from "../../entity/enums/status.ts";
import GuardianAddressForm from "./GuardianAddressForm.tsx";
import FormInput from "../ui/form/FormInput.tsx";
import GuardianDetails from "./GuardianDetails.tsx";
import {fetchEnrolledStudentsGuardians} from "../../data";
import {Guardian} from "../../entity";

const GuardianForm = ({control, errors, showField, checked, onChecked, value, setValue}: GuardianProps) => {

    const genderOptions = useMemo(() => enumToObjectArray(Gender), [])
    const statusOptions = useMemo(() => enumToObjectArray(Status), [])

    const [open, setOPen] = useState<boolean>(false)

    const [data, setData] = useState<SelectProps['options']>([]);
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const currentValue = useRef<string>('');
    const [fetching, setFetching] = useState(false);

    const fetch = (value: string, callback: (data: { text: string; value: string | undefined }[]) => void) => {
        if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = null;
        }
        currentValue.current = value;

        const getGuardians = () => {
            setFetching(true);
            fetchEnrolledStudentsGuardians()
                .then((response) => {
                    if (response && response.isSuccess) {
                        const guardians = response.data as Guardian[]
                        if (currentValue.current === value) {
                            const data = guardians.map((g) => ({
                                value: g.id,
                                text: `[${g.telephone}] ${g.lastName} ${g.firstName}`
                            }))
                            callback(data)
                            setFetching(false);
                        }
                    }
                })
        };
        if (value) {
            timeout.current = setTimeout(getGuardians, 300);
        } else {
            callback([]);
        }
    };

    const handleSearch = (newValue: string) => {
        fetch(newValue, setData);
    };

    const handleChange = (newValue: string) => {
        setValue(newValue);
    };

    const onModalOpen = () => {
        setOPen(!open)
    }

    const onConfirm = () => {

    }

    return(
        <Responsive gutter={[16, 16]}>
            <Grid xs={24} md={24} lg={24}>
                <div className='linked_button'>
                    <Button type='link' onClick={onModalOpen}>Rechercher un tuteur existant</Button>
                </div>
                <Divider />
                <Modal title="Rechercher le tuteur" centered open={open} width={1000}
                       okText='Confirmer'
                       cancelText='Annuler'
                       onOk={() => onConfirm()}
                       onCancel={() => onModalOpen()}
                >
                    <GuardianDetails data={data} value={value} fetching={fetching} onSearch={handleSearch} onChange={handleChange}/>
                </Modal>
            </Grid>
            <Grid xs={24} md={12} lg={8}>
                <FormInput
                    label='Nom(s) du tuteur' control={control} name='student.guardian.lastName' required defaultValue='' placeholder='Malonga'
                    validateStatus={errors.student?.guardian?.lastName ? 'error': ''} help={errors.student?.guardian?.lastName ? errors.student?.guardian?.lastName.message : ''}
                />
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <FormInput
                    label='Prénom(s) du tuteur' control={control} name='student.guardian.firstName' required defaultValue='' placeholder='Patrick'
                    validateStatus={errors.student?.guardian?.firstName ? 'error': ''} help={errors.student?.guardian?.firstName ? errors.student?.guardian?.firstName.message : ''}
                />
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
                <FormInput
                    label='Nom(s) de jeune fille' control={control} name='student.guardian.maidenName' defaultValue='' placeholder='Mavouanga'
                    validateStatus={errors.student?.guardian?.maidenName ? 'error': ''} help={errors.student?.guardian?.maidenName ? errors.student?.guardian?.maidenName.message : ''}
                />
            </Grid>}

            <Grid xs={24} md={12} lg={8}>
                <FormInput
                    label='E-mail' control={control} name='student.guardian.emailId' defaultValue='' placeholder='p.malonga@gmail.com'
                    validateStatus={errors.student?.guardian?.emailId ? 'error': ''} help={errors.student?.guardian?.emailId ? errors.student?.guardian?.emailId.message : ''}
                />
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <FormInput
                    label='Employeur' control={control} name='student.guardian.company' defaultValue='' placeholder='Total Energie'
                    validateStatus={errors.student?.guardian?.company ? 'error': ''} help={errors.student?.guardian?.company ? errors.student?.guardian?.company.message : ''}
                />
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <FormInput
                    label='Poste' control={control} name='student.guardian.jobTitle' defaultValue='' placeholder='Operateur de maintenance'
                    validateStatus={errors.student?.guardian?.jobTitle ? 'error': ''} help={errors.student?.guardian?.jobTitle ? errors.student?.guardian?.jobTitle.message : ''}
                />
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <FormInput
                    label='Téléphone' control={control} name='student.guardian.telephone' defaultValue='' placeholder='060000000' required
                    validateStatus={errors.student?.guardian?.telephone ? 'error': ''} help={errors.student?.guardian?.telephone ? errors.student?.guardian?.telephone.message : ''}
                />
            </Grid>

            <Grid xs={24} md={12} lg={8}>
                <FormInput
                    label='Mobile' control={control} name='student.guardian.mobile' defaultValue='' placeholder='060000000'
                    validateStatus={errors.student?.guardian?.mobile ? 'error': ''} help={errors.student?.guardian?.mobile ? errors.student?.guardian?.mobile.message : ''}
                />
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