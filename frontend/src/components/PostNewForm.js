import React, {useState} from "react"
import {Button, Form, Input, Upload, Modal, notification} from "antd";
import {FrownOutlined, PlusOutlined} from "@ant-design/icons";
import {getBase64FromFile} from "../utils/base64";
import {useAppContext} from "../store";
import {parseErrorMessages} from "../utils/forms";
import {useHistory} from "react-router-dom";
import {useAxios, axiosInstance} from "../api";


export default function PostNewForm() {

    const {store: {jwtToken}} = useAppContext();
    const [fileList, setFileList] = useState([]);
    const [fieldErrors, setFieldErrors] = useState({});
    const [previewPhoto, setPreviewPhoto] = useState({
        visible: false,
        base64: null
    });

    const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
    };

    const history = useHistory();

    const handleUploadChange = ({fileList}) => {
        setFileList(fileList);
    }

    const handlePreviewPhoto = async (file) => {
        if (!file.url && !file.preview){
            file.preview = await getBase64FromFile(file.originFileObj);
        }
        setPreviewPhoto({
            visible: true,
            base64: file.url || file.preview,
        });
    };

    const handleFinish = async (fieldValues) =>  {
        const { caption, location, photo: { fileList }} = fieldValues;

        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("location", location);

        fileList.forEach(file =>{
            formData.append("photo" , file.originFileObj);
        })

        const headers = { Authorization: `JWT ${jwtToken}` };

        try{
            const response = await axiosInstance.post("/api/posts/", formData, { headers });
            console.log("success response : " , response);
            history.push("/");
        }
        catch(error){
            if (error.response){
                const { status, data: fieldsErrorMessages } = error.response;
                if (typeof fieldsErrorMessages === "string"){
                    notification.open({
                    message: "???  ??? ??????",
                    description:`??????) ${status} ????????? ???????????????. ??????????????? ??????????????????. `,
                    icon: <FrownOutlined style={{color:"#ff3333"}}/>
                    });
                }else{
                    setFieldErrors(parseErrorMessages(fieldsErrorMessages));
                }


            }
        }
    };

    return (
            <Form {...layout} onFinish={handleFinish} autoComplete={"false"}>
                <Form.Item
                    label="Caption"
                    name="caption"
                    rules={[
                        {
                            required: true,
                            message: 'Caption??? ??????????????????.' ,
                        },
                    ]}
                    hasFeedback
                    {...fieldErrors.caption}
                    {...fieldErrors.non_field_errors}
                >
                    <Input.TextArea/>

                </Form.Item>

                <Form.Item
                    label="Location"
                    name="location"
                    rules={[
                        {
                            required: true,
                            message: 'Location??? ??????????????????.',
                        },
                    ]}
                    hasFeedback
                    {...fieldErrors.location}
                    {...fieldErrors.non_field_errors}
                >
                    <Input/>
                </Form.Item>


                <Form.Item
                    label="Photo"
                    name="photo"
                    rules={[{required: true, message: "????????? ??????????????????."}]}
                    hasFeedback
                    {...fieldErrors.photo}
                >
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        beforeUpload={() => {
                            return false;
                        }}
                        onChange={handleUploadChange}
                        onPreview={handlePreviewPhoto}
                    >

                        {fileList.length > 0 ? null : (
                            <div>
                                <PlusOutlined/>
                                <div className="ant-upload-text">Upload</div>
                            </div>
                        )}

                    </Upload>


                </Form.Item>

                <Modal visible={previewPhoto.visible} footer={null}
                       onCancel={() => setPreviewPhoto({visible: false})}>
                    <img src={previewPhoto.base64} style={{width: "100%"}} alt="Preview"/>
                </Modal>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="subm  it">
                        Submit
                    </Button>
                </Form.Item>
                <hr/>
                {JSON.stringify(fileList)}
            </Form>
    );
}


const tailLayout = {
    wrapperCol: {offset: 8, span: 16}
};
