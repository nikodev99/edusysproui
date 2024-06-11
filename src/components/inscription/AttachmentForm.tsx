import {Button, Form, message, Upload, UploadProps} from 'antd'
import ImgCrop from 'antd-img-crop';
import {ZodProps} from "../../utils/interfaces.ts";
import Responsive from "../ui/Responsive.tsx";
import Grid from "../ui/Grid.tsx";
import {Controller} from "react-hook-form";
import {useState} from "react";
import {AiOutlineInbox, AiOutlineLoading, AiOutlinePlus} from "react-icons/ai";

const AttachmentForm = ({control, errors}: ZodProps) => {

    const [loading, setLoading] = useState(false)

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return(
        <Responsive gutter={[16, 16]}>
            <Grid xs={24} md={24} lg={24}>
                <Form.Item label='Image' validateStatus={errors.student?.image ? 'error' : ''} help={errors.student?.image ? errors.student?.image.message : ''}>
                    <Controller name='student.image' control={control} render={({field}) => (
                        <ImgCrop rotationSlider aspectSlider showReset>
                            <Upload listType='picture-card' className='image_uploader' beforeUpload={() => false}{...field}>
                                <Button type='text' style={{ border: 0, background: 'none' }}>
                                    {loading ? <AiOutlineLoading /> : <AiOutlinePlus />}
                                    <div>Charger</div>
                                </Button>
                            </Upload>
                        </ImgCrop>
                    )} />
                </Form.Item>
            </Grid>
            {/*<Grid xs={24} md={24} lg={24}>
                <Form.Item label='Attachements' validateStatus={errors.student?.image ? 'error' : ''} help={errors.student?.image ? errors.student?.image.message : ''}>
                        <Upload.Dragger {...props} disabled>
                            <p className="ant-upload-drag-icon"><AiOutlineInbox className='drag-n-drop-icon' /></p>
                            <p className="ant-upload-text">Click ou drag les fichiers à attacher</p>
                        </Upload.Dragger>
                </Form.Item>
            </Grid>*/}
        </Responsive>
    )
}

export default AttachmentForm