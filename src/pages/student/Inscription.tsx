import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {setBreadcrumb} from "../../utils/breadcrumb.tsx";
import {Flex, Form, Input, Steps, Tag} from "antd";
import Responsive from "../../components/ui/Responsive.tsx";
import Grid from "../../components/ui/Grid.tsx";
import {useForm} from "react-hook-form";
import React from "react";

const Inscription = () => {

    useDocumentTitle({
        title: "EduSysPro - Inscription",
        description: "Inscription description",
    })

    const items = setBreadcrumb([{
        title: 'Inscription'
    }])

    const form = useForm()
    const requiredMark = (label: React.ReactNode, {required}: {required: boolean}) => (
        <>
            {required ? <Tag color='error'>Requis</Tag> : <Tag color='warning'>optionnel</Tag>}
            {label}
        </>
    )

    return(
        <>
            <PageHierarchy items={items}/>
            <Flex className='' vertical>
                <Steps current={0} items={[
                    {
                        title: 'Individuelle'
                    },
                    {
                        title: 'Adresse'
                    },
                    {
                        title: 'Gardien'
                    }
                ]} />
                <div className='inscription-form-wrapper'>
                    <Form {...form} layout="vertical" initialValues={{requiredMarkValue: 'customize'}} requiredMark={requiredMark}>
                        <Form.Item label='Nom de famille' required tooltip='Ce champ est requis'>
                            <Input placeholder='Malonga' />
                        </Form.Item>
                        <Form.Item label='Prénom' tooltip='Ce champ est optionnel'>
                            <Input placeholder='Malonga' />
                        </Form.Item>
                    </Form>
                    <Responsive gutter={[16, 16]}>
                        <Grid xs={24} md={12} lg={8} style={{background: "purple"}}>
                            <Input />
                        </Grid>
                        <Grid xs={24} md={12} lg={8}>
                            <Input />
                        </Grid>
                        <Grid xs={24} md={12} lg={8}>
                            <Input />
                        </Grid>
                        <Grid xs={24} md={12} lg={8}>
                            <Input />
                        </Grid>
                    </Responsive>
                </div>
            </Flex>
        </>

    )
}

export default Inscription