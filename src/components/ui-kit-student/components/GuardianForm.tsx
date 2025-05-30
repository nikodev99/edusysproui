import {GuardianProps} from "../../../core/utils/interfaces.ts";
import Responsive from "../../ui/layout/Responsive.tsx";
import Grid from "../../ui/layout/Grid.tsx";
import {Alert, Button, Checkbox, Collapse, Divider, Modal, SelectProps} from "antd";
import {useRef, useState} from "react";
import { GuardianDetails } from "./GuardianDetails.tsx";
import {fetchGuardian, fetchSearchedEnrolledStudentsGuardian} from "../../../data";
import {Guardian} from "../../../entity";
import GuardianFormContent from '../../forms/GuardianForm.tsx'
import {AddressOwner, IndividualType} from "../../../core/shared/sharedEnums.ts";
import AddressForm from "../../forms/AddressForm.tsx";
import {EnrollmentSchema} from "../../../schema";
import {setName} from "../../../core/utils/utils.ts";
import {IndividualForm} from "../../forms/IndividualForm.tsx";

export const GuardianForm = ({control, errors, showField, checked, onChecked, value, setValue, isExists, setIsExists, guardian, setGuardian}: GuardianProps<EnrollmentSchema, Guardian>) => {

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
            fetchSearchedEnrolledStudentsGuardian(value)
                .then((response) => {
                    if (response && response.isSuccess && 'data' in response) {
                        const guardians: Guardian[] = response.data as Guardian[]
                        if (currentValue.current === value) {
                            const data = guardians.map((g) => ({
                                value: g.id,
                                text: `[${g.personalInfo.telephone}] ${g.personalInfo.lastName} ${g.personalInfo.firstName}`
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
    }

    const handleChange = (newValue: string) => {
        setValue(newValue);
    }

    const onModalOpen = () => {
        setOPen(!open)
    }

    const onConfirm = () => {
        console.log("Existing guardian: ", value)
        if (value) {
            fetchGuardian(value)
                .then(response => {
                    console.log("Fetch existing guardian: ", response)
                    if (response && response.isSuccess) {
                        setGuardian(response.data as Guardian)
                    }
                })
        }
        setIsExists(true)
        setOPen(false)
    }

    return(
        <>
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
                    {isExists && <>
                            <Alert type='success' message={setName(guardian?.personalInfo?.lastName, guardian?.personalInfo?.firstName, guardian?.personalInfo?.maidenName)} showIcon />
                            <Divider />
                        </>
                    }
                </Grid>
            </Responsive>
            <IndividualForm
                control={control}
                edit={false}
                enroll={true}
                errors={errors}
                type={IndividualType.GUARDIAN}
                showField={showField}
            />
            <GuardianFormContent
                control={control}
                errors={errors}
                edit={false}
                enroll={true}
            />
            <Responsive>
                <Grid xs={24} md={24} lg={24} className='guardian__address__check'>
                    <Collapse defaultActiveKey={['1']} items={[
                        {
                            key: 1,
                            label: <Checkbox checked={checked} onClick={onChecked}>L'adresse du tuteur correspond à celui de l'élève/étudiant</Checkbox>,
                            children: <AddressForm
                                enroll={true}
                                control={control}
                                type={AddressOwner.GUARDIAN}
                                edit={false}
                                errors={errors}
                            />,
                            showArrow: false,
                            collapsible: 'icon'
                        }]
                    } activeKey={!checked ? 1 : ''} />
                </Grid>
            </Responsive>
        </>
    )
}