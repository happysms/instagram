import React, {useEffect, useState} from "react";
import {Form, Input, Button, notification, Card} from "antd";
import {useHistory , useLocation} from "react-router-dom";
import {SmileOutlined, FrownOutlined} from "@ant-design/icons"
import {setToken, useAppContext} from "../../store";
import {parseErrorMessages} from "../../utils/forms";
import {useAxios, axiosInstance} from "../../api";

export default function Login() {

    const { dispatch } = useAppContext();
    const location = useLocation();

    const history = useHistory();
    const [fieldErrors, setFieldErrors] = useState({});

    const {from: loginRedirectUrl } = location.state || {from: { pathname: "/"}};

    const onFinish = (values) => {
        async function fn() {
            const {username, password} = values;
            const data = {username, password};
            try{
                const response = await axiosInstance.post("/accounts/token/", data);
                const {data: {token:jwtToken}} = response;
                dispatch(setToken(jwtToken));

                // setJwtToken(jwtToken);

                notification.open({
                    message: "로그인 성공",
                    icon: <SmileOutlined style={{color:"#108ee9"}}/>
                });

                history.push(loginRedirectUrl); // 이동주소
            }
            catch(error){
                if (error.response){

                    notification.open({
                    message: "로그인 실패",
                    description: "아이디/암호를 확인해주세요.",
                    icon: <FrownOutlined style={{color:"#ff3333"}}/>
                    })
                    const {data: fieldErrorMessages } = error.response;
                    // fieldErrorMessages => { username: ["m1 m2"] , password: [] }
                    //python: mydict.items()

                    setFieldErrors(parseErrorMessages(fieldErrorMessages));
                }
            }
        }
        fn();
    };

    return (
        <Card title="로그인">
            <Form
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}

                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                        {min: 5, message: "5글자만 입력해주세요."}
                    ]}
                    hasFeedback
                    {...fieldErrors.username}
                    {...fieldErrors.non_field_errors}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please  input your password!',
                        },
                    ]}

                    {...fieldErrors.password}
                >
                    <Input.Password/>
                </Form.Item>


                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );

}

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};

const tailLayout = {
    wrapperCol: {offset: 8, span: 16}
};
