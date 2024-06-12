import {Button, Form, Upload} from 'antd'
import ImgCrop from 'antd-img-crop';
import Responsive from "../ui/Responsive.tsx";
import Grid from "../ui/Grid.tsx";
import {useState} from "react";
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';

const AttachmentForm = () => {

    const [loading, setLoading] = useState(false)

    return(
        <Responsive gutter={[16, 16]}>

            <Grid xs={24} md={24} lg={24}>
                <Form.Item label='Image'>
                    <FileUploaderRegular pubkey={import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY} />
                    {/*<ImgCrop rotationSlider aspectSlider showReset>
                        <Upload listType='picture-card' className='image_uploader' beforeUpload={() => false}>
                            <Button type='text' style={{ border: 0, background: 'none' }}>
                                {loading ? <AiOutlineLoading /> : <AiOutlinePlus />}
                                <div>Charger</div>
                            </Button>
                        </Upload>
                    </ImgCrop>*/}
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