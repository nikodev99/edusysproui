import {OutputFileEntry} from "@uploadcare/blocks";
import Responsive from "../ui/layout/Responsive.tsx";
import Grid from "../ui/layout/Grid.tsx";
import {FileUploaderRegular} from "@uploadcare/react-uploader";
import {Form, Image} from "antd";

export const UploadCareForm = ({imageCdn, onChange}: {imageCdn?: string, onChange: (items?: {allEntries: OutputFileEntry[]}) => void}) => {
    return(
        <Responsive gutter={[16, 16]}>
            <Form.Item label='Charger une image'>
                <Grid xs={24} md={24} lg={24} xxl={24}>
                    <FileUploaderRegular
                        pubkey={import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY}
                        imgOnly
                        cropPreset=''
                        multiple={false}
                        onChange={onChange}
                    />
                </Grid>
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
        </Responsive>
    )
}