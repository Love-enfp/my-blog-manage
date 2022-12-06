import { Button, Modal,Form, Input ,DatePicker, message} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import api from '../../api';

export default function EditAdd(props) {
  const form=useRef()
  let len=props.n
  // 存储对话框显示的标志
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  
  useEffect(()=>{
    setIsModalOpen(props.isModalOpen)
    // 如果点击是编辑，就回显数据
    if(props.editoradd==true)
    {
      let updateData=props.updateData
      // 回显数据
        form.current.setFieldsValue({
          id:updateData.id,
          content:updateData.content,
          // create_date:updateData.create_date时间有点问题
        })
    }
      
      
  },[isModalOpen])

  // 提交表单
  function onFinish(value){
    // 当前是新增弹幕状态
    if(props.editoradd==false)
    {
        // 对象的解构赋值
        let params={
          ...value,
          'id':len+1,
          'create_date': value['create_date'].format('YYYY-MM-DD HH:mm:ss'),
        }
        // 发起请求
        api.submitBulletScreen(params).then(res=>{
        })
        message.success('添加成功')
        // 回传标志
        props.isReOpen(false)
        // 关闭弹框
        setIsModalOpen(false)
        
        window.location.reload() // 强制页面刷新
        // message.success('发布弹幕成功')
        // console.log(22);
    }
    // 当前是修改弹幕状态
    else
    {
       // 对象的解构赋值
       let params={
        ...value,
        'create_date': value['create_date'].format('YYYY-MM-DD HH:mm:ss'),
      }
      // console.log(111);
      // 发起请求
      api.updateBullet(params).then(res=>{
        console.log(res.data);
      })
      message.success('编辑成功')
      window.location.reload() // 强制页面刷新
      // 回传标志
      props.isReOpen(false)
      // 关闭弹框
      setIsModalOpen(false)

    }

      
    
  }

  // 右上角的关闭按钮
  const handleCancel = () => {
    // console.log(form);
    props.isReOpen(false)
  };

  return (
    <div>
      <Modal
        forceRender = {true}//强制渲染.解决初始进入页面，访问不到Form元素的情况
         title={props.editoradd===true?"编辑弹幕":"新增弹幕"}
         open={isModalOpen}
         closable
         footer={
          [] // 设置footer为空，去掉 取消 确定默认按钮
          }
          onCancel={handleCancel}
        >
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{//初始的值
              id:len+1
            }}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            ref={form}
          >


       
            <Form.Item
              label="id"
              name="id"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="内容"
              name="content"
              rules={[
                {
                  required: true,
                  message: '请输入弹幕内容',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
            name="create_date"
            label="发布时间"
            rules={[
              {
                required: true,
                message: '请输入弹幕内容',
              },
            ]}
              >
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                  {props.editoradd===true?"编辑弹幕":"新增弹幕"}
              </Button>
            </Form.Item>
           
          </Form>
          </Modal>
    </div>
  )
}
