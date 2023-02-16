import { SearchOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { Button, Input, Space, Table,Tag ,Popconfirm} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { dateFormatter } from '../../utils/dateFormat';
import {EyeOutlined,EyeInvisibleOutlined} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import './index.scss'
import api from '../../api';

const Articles = () => {

  const sorts=useSelector(state=>state.sorts)

  const labels=useSelector(state=>state.labels)

  useEffect(()=>{
    api.getArticles({page:1}).then(res=>{
      const result= res.data.allArticles.map((item)=>{
        /* 拿到一个对象，直接对其中的属性修改，然后返回整个对象就行！ */
        item.create_date=dateFormatter(item.create_date,'yyyy-mm-dd HH:mm:ss')
        item.update_date=dateFormatter(item.update_date,'yyyy-mm-dd HH:mm:ss')
          // 查找每个文章对应的分类---------------------------------------------
          let sortData= sorts.filter((i)=>i.blog_id===item.id)
          console.log(sortData);
          // 为每个文章对象添加分类属性
          if(sortData[0])//加个判断，不然会报错
          item.sort=sortData[0].name
          item.sort_id=sortData[0].id
          // 查找每个标签对应的分类---------------------------------------------
          let labelData= labels.filter((j)=>j.blog_id===item.id)
          item.label=labelData
          // 如果说当前标签不为空，就添加上对用的标签属性，编辑时候会用到
          if(labelData.length!=0)
          {
            item.label_id=labelData[0].id
          }
        return item
      })
      setArticles(result)
    })
  },[])
  const [articles,setArticles]=useState([])
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
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
      ...getColumnSearchProps('title'),
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
      title: '封页',
      dataIndex: 'img',
      key: 'img',
      width: '20%',
      render: (rowData) => (
            <img src={rowData} width="150" height="150" alt="" />
      ),
    },
    {
      title: '分类',
      key: 'sort',
      dataIndex: 'sort',
      render: (sort) => (
              <Tag color='geekblue' key={sort}>
                {sort}
              </Tag>
      ),
      width: '8%',
    },
    {
      title: '标签',
      key: 'label',
      dataIndex: 'label',
      render: (label) => (
        <>
          {label.map((item) => {
           
            return (
              <Tag color='orange' key={item.id}>
                {item.name}
              </Tag>
            );
          })}
        </>
      ),
      width: '12%',
    },
    {
      title: '发布时间',
      dataIndex: 'create_date',
      key: 'create_date',
      width: '12%',
      // ...getColumnSearchProps('create_date'),
      sorter: (a, b) => a.create_date.length - b.create_date.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '编辑时间',
      dataIndex: 'update_date',
      key: 'update_date',
      width: '12%',
      render: (rowData) => (
   
        rowData
      ),
      // ...getColumnSearchProps('update_date'),
      sorter: (a, b) => a.update_date.length - b.update_date.length,
      sortDirections: ['descend', 'ascend'],
    },
    // {
    //   title: '喜欢',
    //   dataIndex: 'like',
    //   key: 'like',
    //   width: '7%',
    //   sorter: (a, b) => a.like.length - b.like.length,
    //   sortDirections: ['descend', 'ascend'],
    // },
    {
      title: '浏览量',
      dataIndex: 'view',
      key: 'view',
      width: '7%',
      sorter: (a, b) => a.view.length - b.view.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '公开',
      dataIndex: 'open',
      key: 'open',
      width: '7%',
      render: (data) => (
        data===1?<EyeOutlined />:<EyeInvisibleOutlined />
      ),
    },
    {
      title: '操作',
      key:'handle',
      render: (rowData) => (
        <Space size="middle" key={rowData.id}>
          {/* <NavLink   to={`http://1.117.109.184/article/${rowData.id}`} >查看详情</NavLink> */}
          <a href={`http://1.117.109.184/article/${rowData.id}`} className="detail">详情</a>
          <NavLink  className={localStorage.getItem('visitor-token')?"disabled":''}      to="/publish" state={{currentArticle:rowData,currentLabels:labels,flag:true}}>编辑</NavLink>
          <Popconfirm
          title="你确定要删除吗"
          onConfirm={()=>deleteArticles(rowData)}
          // onCancel={cancel}
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
  // 删除文章的功能
  function deleteArticles(article){
    api.deleteArticle({id:article.id}).then(res=>{
      console.log(res.data);
    })
    window.location.reload() // 强制页面刷新
  }
  return (
    <div className="articleHightOver">
      <div className="article">
          <Table columns={columns} dataSource={articles}  bordered rowKey={record => record.id}/>;
      </div>
    </div>
  ) 
};
export default Articles;