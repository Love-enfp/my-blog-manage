import { Space, Tag , Table,Button,Popconfirm, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { dateFormatter2 } from '../../utils/dateFormat';
import EditAdd from '../../components/EditAdd';
import api from '../../api';
import { useDispatch } from 'react-redux';
// import { initBullet } from '../../redux/actions/bullet';
import './index.scss'
export default function BuildLog() {

  const [refresh,setRefresh]=useState(false)
  const dispatch=useDispatch()

  const [buildlogs,setbuildlogs]=useState([])
  // 是否打开弹框（编辑和新增用的同一个）
  const [isModalOpen, setIsModalOpen] = useState(false);
  // false默认代表是增加，true代表是编辑
  const [editoradd,setEditoradd]=useState(false)
  // 存储要编辑的信息
  const [updateData,setUpdateData]=useState()
  // 编辑建站日志
  function updateBullet(rowData){
    const id=rowData.id
    const res=buildlogs.filter(item=>item.id===id)
    setUpdateData(res[0])
    setIsModalOpen(true)
    setEditoradd(true)
  }
  // 增加建站日志
  function addBullet(){
    setIsModalOpen(true)
    setEditoradd(false)
  }
  // 编辑组件执行完了，告诉父组件可以关闭弹框了
  function isReOpen(flag){
    if(flag==false)
    setIsModalOpen(false)
  }
  // 删除按钮，点击确定
  function deleteBullet(rowData){
    const id=rowData.id
    api.deleteBulidLog({id:id}).then(res=>{
      console.log(res.data);
    })
    message.success('删除成功')
    setRefresh(!refresh)

  }

  const columns = [
    {
      title: 'id',
      key:'id',
      dataIndex: 'id',
      width:150,
    },
    {
      title: '内容',
      key:'content',
      dataIndex: 'content',
      width:400,
    },
    {
      title: '创建时间',
      key:'create_date',
      dataIndex: 'create_date',
      width:200
    },
    {
      title: '操作',
      key:'handle',
      render: (rowData) => (
        <Space size="middle" key={rowData.id}>
          <a href={`http://1.117.109.184/buildlog`} className="detail">详情</a>


          <a  className={localStorage.getItem('visitor-token')?"disabled":''} onClick={()=>updateBullet(rowData)}>编辑</a>

          <Popconfirm
          title="你确定要删除吗"
          onConfirm={()=>deleteBullet(rowData)}
          // onCancel={cancel}
          okText="删除"
          cancelText="取消"
         >
          <a className={localStorage.getItem('visitor-token')?"disabled":''} >删除</a>

         </Popconfirm>

        </Space>
      ),
      width:200
    },
  ];
  useEffect(()=>{
    api.getBuildLog().then(res=>{
      // 数据处理，对时间格式化
      const result= res.data.result.map((item)=>{
        /* 拿到一个对象，直接对其中的属性修改，然后返回整个对象就行！ */
        item.create_date=dateFormatter2(item.create_date,'yyyy-mm-dd HH:mm:ss')
        return item
      })
      setbuildlogs(result)
    //   dispatch(initBullet(result))
    })
  },[refresh])

  return (
    <div className='buildlogPage'>
      <div className="top">
        <Button type='primary' disabled={localStorage.getItem('blog-token')? false:true} onClick={addBullet} >添加建站日志</Button>
        {
          // 在子组件中isModalOpen变化，但是不能影响本组件，所以第二次就打不开弹框了，所以用回调函数的形式
          // 当子组件关闭的时候，传给本组件，让本组件也为false，用的是子————>父的方式
          isModalOpen?<EditAdd isModalOpen={isModalOpen} n={buildlogs.length} isReOpen={isReOpen} editoradd={editoradd} updateData={updateData} buildlogtag={true}></EditAdd>:''
        }
      </div>
      <Table columns={columns} dataSource={buildlogs}  bordered rowKey='id'/>
    </div>
  );
}
