import {Form, Image} from 'antd'
import Responsive from "../ui/Responsive.tsx";
import Grid from "../ui/Grid.tsx";
import {FileUploaderRegular} from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';
import {OutputFileEntry} from "@uploadcare/blocks";

const AttachmentForm = ({imageCdn, onChange}: {imageCdn?: string, onChange: (items?: {allEntries: OutputFileEntry[]}) => void}) => {

    return(
        <Responsive gutter={[16, 16]}>

            <Grid xs={24} md={24} lg={24} xxl={24}>
                <Form.Item label='Charger une image'>
                    <FileUploaderRegular
                        pubkey={import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY}
                        imgOnly
                        cropPreset=''
                        multiple={false}
                        onChange={onChange}
                    />
                    {/*<ImgCrop rotationSlider aspectSlider showReset>
                        <Upload listType='picture-card' className='image_uploader' beforeUpload={() => false}>
                            <Button type='text' style={{ border: 0, background: 'none' }}>
                                {loading ? <AiOutlineLoading /> : <AiOutlinePlus />}
                                <div>Charger</div>
                            </Button>
                        </Upload>
                    </ImgCrop>*/}
                </Form.Item>
                {imageCdn && <Grid xs={24} md={4} lg={4} xxl={4} style={{marginBottom: '30px'}}>
                    <Image
                        width={200}
                        src={imageCdn}
                    />
                </Grid>}
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