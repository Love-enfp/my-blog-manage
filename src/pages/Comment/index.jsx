import { SearchOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { Button, Input, Space, Table,Tag ,Popconfirm,message} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { dateFormatter } from '../../utils/dateFormat';
import {EyeOutlined,EyeInvisibleOutlined,PushpinOutlined} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { initComment } from '../../redux/actions/comment';
import './index.scss'
import api from '../../api';

export default function Comment() {

  const dispatch=useDispatch()

  const [comments,setComments]=useState([])

  useEffect(()=>{
    api.getComments().then(res=>{
      const result= res.data.allComment.map((item)=>{
        item.create_time=dateFormatter(item.create_time,'yyyy-mm-dd HH:mm:ss')
        return item
      })
      setComments(result)
    })
  },[])
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            搜索
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            重置
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            过滤
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            关闭
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: '8%',
    },
    {
      title: '昵称',
      dataIndex: 'nick',
      key: 'nick',
      width: '20%',
      ...getColumnSearchProps('nick'),
      render: (rowData) => (
        
          rowData==='钟爱enfp女孩' ?
          <span className='author'><PushpinOutlined className='authorIcon' />&nbsp;{rowData}</span>
          :rowData
        
        
      ),
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: '25%',
      ...getColumnSearchProps('content'),
      ellipsis: true//内容溢出。。。
          
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: '17%',
      // render: (rowData) => (
      //       <img src={rowData} width="150" height="150" alt="" />
      // ),
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: '15%',
      render: (rowData) => (
            <img src={rowData} width="100" height="100" alt=""  key={rowData}/>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: '13%',
    },
    {
      title: '文章id',
      dataIndex: 'blog_id',
      key: 'blog_id',
      width: '7%',
    },
    {
      title: '类型',
      dataIndex: 'parent_id',
      key: 'parent_id',
      width: '10%',
      render: (rowData) => (
        <>
        {
          rowData===0?
          <Tag color='red' key={rowData}>评论</Tag>
          :
          <Tag color='orange' key={rowData}>回复id:{rowData}</Tag>
        }
        </>
      ),
    },

    {
      title: '操作',
      key:'handle',
      render: (rowData) => (
        <Space size="middle" key={rowData.id}>
          <Popconfirm
          title="你确定要删除吗"
          onConfirm={()=>deletecomments(rowData)}
          okText="删除"
          cancelText="取消"
          >
            <a className={localStorage.getItem('visitor-token')?"disabled":''} >删除</a>
          </Popconfirm>

        </Space>
      ),
      width: '10%',
    },
  ];
  function deletecomments(rowData){
    console.log(rowData.id);
    api.deleteComment({id:rowData.id}).then(res=>{
      console.log(res.data);
    })

    message.success('删除成功')

    setTimeout(() => {
      window.location.reload() // 强制页面刷新
    }, 1000);
   

    
  }
  return (
    <div className="comment">
      <Table columns={columns} dataSource={comments}  bordered rowKey={record => record.id}/>

    </div>
  )
}
