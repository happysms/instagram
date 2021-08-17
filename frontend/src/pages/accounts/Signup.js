import React, {useEffect, useState} from "react";
import {Form, Input, Button, notification} from "antd";
import {useHistory} from "react-router-dom";
import {SmileOutlined, FrownOutlined} from "@ant-design/icons"
import {useAxios, axiosInstance} from "../../api";

export default function Signup(){
    const history = useHistory();
    const [fieldErrors, setFieldErrors] = useState({});

    const onFinish = (values) => {
        async function fn() {
            const {username, password} = values;
            const data = {username, password};
            try{
                await axiosInstance.post("/accounts/signup/", data);

                notification.open({
                    message: "회원가입 성공",
                    description: "로그인 페이지로 이동합니다. ",
                    icon: <SmileOutlined style={{color:"#108ee9"}}/>
                })

                history.push("accounts/login");
            }
            catch(error){
                if (error.response){

                    notification.open({
                    message: "회원가입 실패",
                    description: "아이디/암호를 확인해주세요.",
                    icon: <FrownOutlined style={{color:"#ff3333"}}/>
                    })
                    const {data: fieldErrorMessages } = error.response;
                    // fieldErrorMessages => { username: ["m1 m2"] , password: [] }
                    //python: mydict.items()

                    setFieldErrors(
                        Object.entries(fieldErrorMessages).reduce((acc, [fieldName, errors]) => {
                        // errors : ["m1", "m2"].join(" ") => "m1 m2"
                        acc[fieldName] = {
                            ValidateStatus: "error",
                            help: errors.join(" "),
                        }
                        return acc;
                    }, {}));
                }
            }
        }
        fn();
    };

    return (
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
                { min: 5, message: "5글자만 입력해주세요." }
            ]}
            hasFeedback
            {...fieldErrors.username}
        >
            <Input/>
        </Form.Item>

        <Form.Item
            label="Password"
            name="password"
            rules={[
                {
                    required: true,
                    message: 'Please input your password!',
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
    );
}

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};

const tailLayout = {
    wrapperCol: {offset: 8, span: 16}
};

// export default function Signup() {
//     const history = useHistory();
//
//     const [inputs, setInputs] = useState({username:"", password:""});
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [formDisabled, setFormDisabled] = useState(true);
//
//     const onSubmit = (e) => {
//         e.preventDefault();
//
//         setLoading(true);
//         setErrors({});
//
//         Axios.post("http://localhost:8000/accounts/signup/", inputs)
//             .then(response => {
//                 console.log("response : ", response);
//                 history.push("/accounts/login");
//             })
//             .catch(error => {
//                 console.log("error : ", error);
//                 if (error.response){
//                     setErrors({
//                         username: (error.response.data.username || []).join(" "),
//                         password: (error.response.data.password || []).join(" "),
//                     });
//                 }
//             })
//             .finally(()=>{
//                 setLoading(false);
//             });
//
//         console.log("onSubmit : ", inputs);
//     };
//
//     useEffect(() =>{
//         console.log("changed input: " , inputs)
//     }, [inputs])
//
//     useEffect(() =>{
//         const isEnabled = Object.values(inputs).every(s => s.length > 0);  //각각의 항목들이 조건을 만족할 때
//
//         setFormDisabled(!isEnabled)
//     }, [inputs]);
//
//     const onChange = e => {
//         const {name, value} = e.target;
//         setInputs(prev=>({
//             ...prev,
//             [name]: value,
//             }));
//     };
//
//     return (
//         <div>
//             {errors.username}
//             <form onSubmit={onSubmit}>
//                 <div>
//                     <input type="text" name="username" onChange={onChange} />
//                     {errors.username && <Alert type="error" message={errors.username}/>}
//                 </div>
//                 <div>
//                     <input type="password" name="password" onChange={onChange} />
//                     {errors.password && <Alert type="error" message={errors.password}/>}
//                 </div>
//                 <input type="submit" value="회원 가입" disabled={loading || formDisabled} />
//             </form>
//         </div>
//     );
// }
