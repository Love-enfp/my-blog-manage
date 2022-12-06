import React from 'react'
import { useNavigate } from 'react-router-dom';
import {Card, Button, Checkbox, Form, Input ,message} from 'antd';
import api from '../../api';
import './index.scss'
import { useDispatch } from 'react-redux';
import { initLogin } from '../../redux/actions/login';
import Password from 'antd/lib/input/Password';
// import {useStore} from '../../store/index'
export default function Login() {
    const dispatch=useDispatch()
//   const {loginStore}=useStore()
  const navigate=useNavigate()
  /* 发起请求实现登录 */
  function  onFinish(value){
    const {username,password}=value
    api.login({username,password}).then(res=>{
        if(res.data.status==200)
        {
            console.log(res.data);
            // 存储到本地
            localStorage.setItem('blog-token',res.data.token)
            // 存储到redux中
            dispatch(initLogin({username:res.data.nick,token:res.data.token}))
            // 跳转页面
            navigate('/')
        }
        else{
            console.log("登录失败");
        }
        
    })
  }
  function visitorLogin(){
    api.visitorlogin().then(res=>{
        console.log(res.data);
         // 存储到本地
         localStorage.setItem('visitor-token',res.data.token)

         navigate('/')
    })

  }
  return (
    <div className='all'>   
        <Card
        className='card'
        title=" "
        style={{width:400,height:300}}
        >
             <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                initialValues={{
                }}
                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                >
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your code!',
                    },
                    ]}
                >
                    <Password/>
                </Form.Item>

                

                <Form.Item
                    wrapperCol={{
                    offset: 8,
                    span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        登录
                    </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               
                </Form.Item>
            </Form>
            <Button type="primary"  className='visitor' onClick={visitorLogin}>
                        游客登录
             </Button>
        </Card>
                    
        
    </div>
  )
}
