import { Button, Card, List ,Tag,Form, Input,Modal, message,Tooltip} from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {ArrowDownOutlined,CheckCircleOutlined,} from '@ant-design/icons';
import { initSort } from '../../redux/actions/sort';
import { handleSort } from '../../utils/sort';
import './index.scss'
import getMaxId from '../../utils/getMaxId'
import api from '../../api';
import { useDispatch } from 'react-redux';
export default function Sort() {
  const dispatch=useDispatch()
  // 存储所有分类的状态
  const [dataList,setDataList]=useState([])
  const [refresh,setRefresh]=useState(false)

  // 从reudx中获得数据
  const sorts=useSelector(state=>state.sorts)


  useEffect(()=>{
    api.getSorts().then(res=>{
      // setAllSort(res.data.result)
      // 存储到redux中
      dispatch(initSort(res.data.result))
        // 抽取所有的分类名
      const sortName=res.data.result.map((item)=>{return item.name})
      // 分类名去重
      const uniqueSortName=Array.from(new Set(sortName))
      // 得到分类名和其对应的所有分类数据(id,blog_id,name)
      let res1= uniqueSortName.map((item,index)=>{
        const innerList=res.data.result.filter(i=>{
          return i.name===item
        })
        return {
          item,
          innerList
        }
      })
      console.log(res1);
      // 对数组进行排序
      res1= handleSort(res1)
      setDataList(res1)
    })
   
    // api.addSort()
  },[refresh])

  // 删除分类功能-----------------------------------------------------------------------
  function onFinishDelete(value){
    api.deleteSort({name:value.name}).then(res=>{
      console.log(res.data);
    })
    message.success('删除成功')
    setIsDeleteModalOpen(false);
    setRefresh(!refresh)
    // setTimeout(() => {
    //   window.location.reload() // 强制页面刷新
    // }, 500);
  }
  // 删除分类对话框
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const showDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  // 增加分类功能----------------------------------------------------------------------
  function onFinish(value){
    // console.log(value);
    const params={
      id:getMaxId(sorts)+1,
      blog_id:0,//0代表没有任何文章是属于此分类
      name:value.name
    }
    api.addSort(params).then(res=>{
      console.log(res.data);
    })
    message.success('提交成功')
    setIsModalOpen(false);
    setRefresh(!refresh)

    // setTimeout(() => {
    //   window.location.reload() // 强制页面刷新
    // }, 1000);

  }
  // 新增分类对话框
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // 增加修改功能----------------------------------------------------------------------
  function onFinishUpdate(value){
    const {oldname,newname}=value
    const params={oldname,newname}
    console.log(params);
    api.updateSort(params).then(res=>{
      console.log(res.data);
    })
    message.success('修改成功')
    setIsModalOpen(false);
    // setRefresh(!refresh)

    setTimeout(() => {
      window.location.reload() // 强制页面刷新
    }, 500);
    
  }
  // 修改分类对话框
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const showUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalOpen(false);
  };

  // 当新增一个分类，切有一篇文章选他时候，不显示当前文章五分类这个字样！
  function judge(name){
    let res=dataList.filter(i=>{
      return i.item===name
    })
    console.log(res[0].innerList);
    if(res[0].innerList.length>1)
    return false
    return true
  }
  return (
    <div className='sorts'>
      

      <div className="menu">
          <div className="top">
          {/* <Tag icon={<CheckCircleOutlined />} color="success">
        点击文章id可查看对应文章
      </Tag> */}
            <Button type='primary' disabled={localStorage.getItem('blog-token')? false:true} onClick={showModal}>新增分类</Button>

            <Modal title="新增分类" open={isModalOpen}  onCancel={handleCancel} footer={[]}>
                  <Form
                  name="basic"
                  onFinish={onFinish}
                  >
                  <Form.Item
                    label="名称"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: '请输入',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                    <Form.Item
                      >
                      <Button type="primary" htmlType="submit">
                        提交
                      </Button>
                    </Form.Item>
                </Form>
            </Modal>


          </div>
          <div className="update">
                  <Button type='primary'  disabled={localStorage.getItem('blog-token')? false:true} onClick={showUpdateModal}>修改分类名称</Button>
                  <Modal title="修改分类" open={isUpdateModalOpen}  onCancel={handleUpdateCancel} footer={[]}>
                      <Form
                      name="basic"
                      onFinish={onFinishUpdate}
                      >
                      <Form.Item
                        label="原分类名称"
                        name="oldname"
                        rules={[
                          {
                            required: true,
                            message: '请输入',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="新分类名称"
                        name="newname"
                        rules={[
                          {
                            required: true,
                            message: '请输入',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                        <Form.Item
                          >
                          <Button type="primary" htmlType="submit">
                            提交
                              </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
          </div>
          <div className="delete">
            <Button type='primary'  disabled={localStorage.getItem('blog-token')? false:true} onClick={showDeleteModal}>删除分类</Button>
            <Modal title="删除分类" open={isDeleteModalOpen}  onCancel={handleDeleteCancel} footer={[]}>
                <Form
                name="basic2"
                onFinish={onFinishDelete}
                >
                <Form.Item
                  label="分类名称"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: '请输入',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                  <Form.Item
                    >
                    <Button type="primary" htmlType="submit">
                      删除
                        </Button>
                      </Form.Item>
                </Form>
            </Modal>
          </div>
       </div>
      <List
      grid={{
        gutter: 16,
        column: 4,
      }}
      dataSource={dataList}
      renderItem={(data) => (
        <List.Item>
          <Card title={data.item}>

           
          {/* <span className='title'>对应文章信息如下&nbsp;&nbsp;<ArrowDownOutlined /></span><br /> */}
            {
              data.innerList.map(i=>{
                return (
                  <div className="detail" key={i.id}>
                    {
                      i.blog_id==0&&judge(i.name)?
                      <h3 color='red'>当前分类无文章！</h3>
                      :(
                        <div>
                          { 
                            // 不显示创建的分类数据，因为创建时候，blog_id初始化均为0
                            i.blog_id!=0?
                            <div>
                              <span>id：</span><Tag color="#f50">{i.id}</Tag>
                              &nbsp;&nbsp;&nbsp;&nbsp;
                              <span>文章id：</span>
                              <a href={`http://1.117.109.184/article/${i.blog_id}`} className="detail">
                                  <Tag color="#2db7f5">{i.blog_id}</Tag>
                              </a>
                            </div>
                            :''
                          }
                           

                        </div>
                      )
                    }
                   
                  </div>
                )
              })
            }
          </Card>
        </List.Item>
      )}
  />
    </div>
  )
}
