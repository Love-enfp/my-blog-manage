import { Button, Card, List, Tag, Form, Input, Modal, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrowDownOutlined } from '@ant-design/icons';
import { handleSort } from '../../utils/sort';
import { initLabel } from '../../redux/actions/label';
import { useDispatch } from 'react-redux';
import './index.scss'
import getMaxId from '../../utils/getMaxId'
import api from '../../api';
export default function Sort() {
  const dispatch = useDispatch()
  // 存储所有标签的状态
  const [dataList, setDataList] = useState([])
  const [refresh, setRefresh] = useState(false)
  // 从reudx中获得数据
  const labels = useSelector(state => state.labels)

  useEffect(() => {
    api.getLabels().then(res => {
      // setAllLabel(res.data.result)
      // 存储到redux中
      dispatch(initLabel(res.data.result))
      // 抽取所有的标签名
      const sortName = res.data.result.map((item) => { return item.name })
      // 标签名去重
      const uniqueSortName = Array.from(new Set(sortName))
      // 得到标签名和其对应的所有标签数据(id,blog_id,name)
      let res1 = uniqueSortName.map((item, index) => {
        const innerList = res.data.result.filter(i => {
          return i.name === item
        })
        return {
          item,
          innerList
        }
      })
      // 对数组进行排序
      res1 = handleSort(res1)
      setDataList(res1)
    })

    // api.addSort()
  }, [refresh])

  // 删除标签功能-----------------------------------------------------------------------
  function onFinishDelete(value) {
    api.deleteLabel({ name: value.name }).then(res => {
      console.log(res.data);
    })
    message.success('删除成功')
    setIsDeleteModalOpen(false);
    // setRefresh(!refresh)
    setTimeout(() => {
      window.location.reload() // 强制页面刷新
    }, 500);
  }
  // 删除标签对话框
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const showDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  // 增加标签功能----------------------------------------------------------------------
  function onFinish(value) {
    const params = {
      id: (getMaxId(labels) + 1),//这里用是reudx的数据值
      blog_id: 0,//0代表没有任何文章是属于此标签
      name: value.name
    }
    api.addLabels(params).then(res => {
      console.log(res.data);
    })
    message.success('提交成功')
    setIsModalOpen(false);
    // setRefresh(!refresh)

    setTimeout(() => {
      window.location.reload() // 强制页面刷新
    }, 1000);

  }
  // 新增标签对话框
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // 增加修改功能----------------------------------------------------------------------
  function onFinishUpdate(value) {
    const { oldname, newname } = value
    const params = { oldname, newname }
    api.updateLabel(params).then(res => {
      console.log(res.data);
    })
    message.success('修改成功')
    // setRefresh(!refresh)
    setIsModalOpen(false);


    setTimeout(() => {
      window.location.reload() // 强制页面刷新
    }, 500);

  }
  // 修改标签对话框
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const showUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalOpen(false);
  };


  return (
    <div className="labelOverHigh">
      <div className='labels'>
        <div className="menu">
          <div className="top">
            <Button type='primary' disabled={localStorage.getItem('blog-token') ? false : true} onClick={showModal}>新增标签</Button>
            <Modal title="新增标签" open={isModalOpen} onCancel={handleCancel} footer={[]}>
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
            <Button type='primary' disabled={localStorage.getItem('blog-token') ? false : true} onClick={showUpdateModal}>修改标签名称</Button>
            <Modal title="修改标签" open={isUpdateModalOpen} onCancel={handleUpdateCancel} footer={[]}>
              <Form
                name="basic"
                onFinish={onFinishUpdate}
              >
                <Form.Item
                  label="原标签名称"
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
                  label="新标签名称"
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
            <Button type='primary' disabled={localStorage.getItem('blog-token') ? false : true} onClick={showDeleteModal}>删除标签</Button>
            <Modal title="删除标签" open={isDeleteModalOpen} onCancel={handleDeleteCancel} footer={[]}>
              <Form
                name="basic2"
                onFinish={onFinishDelete}
              >
                <Form.Item
                  label="标签名称"
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
                  data.innerList.map(i => {
                    return (
                      <div className="detail" key={i.id}>
                        {
                          i.blog_id == 0 ? <h3 color='red'>当前标签无文章！</h3>
                            : (
                              <div>
                                <span>id：</span><Tag color="#f50">{i.id}</Tag>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <span>文章id：</span>
                                <a href={`http://1.117.109.184/article/${i.blog_id}`} className="detail">
                                  <Tag color="#2db7f5">{i.blog_id}</Tag>
                                </a>
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
    </div>

  )
}
