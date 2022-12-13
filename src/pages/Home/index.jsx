import {
  AppstoreOutlined,
  CalendarOutlined,
  MailOutlined,
  SettingOutlined,
  PoweroffOutlined,
  UserOutlined
} from '@ant-design/icons';
import Title from '../../assets/images/title.png'
import moduleName from './index.scss'
import { Divider, Menu, Switch ,Layout,Popconfirm } from 'antd';
import { useDispatch } from 'react-redux';
import { outLogin } from '../../redux/actions/login';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
const { Header, Footer, Sider, Content } = Layout;
function getItem(label, key, icon, children) {
  return {
    label,
    key,
    icon,    
  };
}
const items = [
  // getItem('后台首页', '/', <MailOutlined />,),
  getItem('个人主页', '/', <AppstoreOutlined />),
  getItem('发布文章', '/publish', <CalendarOutlined />),
  getItem('文章管理', '/article', <AppstoreOutlined />),
  getItem('留言管理', '/leavewords', <SettingOutlined />, ),
  getItem('评论管理', '/comment', <AppstoreOutlined />),
  getItem('标签管理', '/label', <SettingOutlined />,),
  getItem('分类管理', '/sort', <SettingOutlined />,),
  getItem('弹幕管理', '/bullet', <AppstoreOutlined />),
 

];
export default function Home() {
  const dispatch=useDispatch()
  // 改变主题样式
  const [theme, setTheme] = useState('light');
  const changeTheme = (value) => {
    setTheme(value ? 'dark' : 'light');
  };
  // useLocation包含有关当前 URL 的信息。pathname为URL 的路径部分。
  const {pathname}=useLocation()
  const navigate=useNavigate()
  // 切换菜单栏
  function changeMenu(value){
    navigate(value.key)
  }
  // 退出登录
  function confirm(){
    if(localStorage.getItem('visitor-token'))
    {
      // 清楚本地
    localStorage.removeItem('visitor-token')
    }
    else{
      // 清楚本地
      localStorage.removeItem('blog-token')
      
      // 清除redux
      dispatch(outLogin())
    }

    // 跳转
    navigate('/login')
  }
  // 取消退出登录
  function cancel(){
    
  }
  useEffect(()=>{
    changeMenu(pathname)
    // console.log(pathname);
  },[pathname])
  return (
    <div className="home">
      <Layout>
            <Header>
              <div className="userImage">
                  <img src={Title} alt="" />
              </div>
              <div className="welcome">
                <p>欢迎您：<UserOutlined /><span>{localStorage.getItem('visitor-token')?'游客':'主人'}</span></p>
              </div>
              <div className="outLogin">
              <Popconfirm
              title="您确定要退出吗？"
              onConfirm={confirm}
              onCancel={cancel}
              okText="退出"
              cancelText="取消"
              >
                <a><span><PoweroffOutlined /></span></a>
              </Popconfirm>
                
              </div>
            </Header>
            <Layout>
              <Sider width={220}>
                <div className='slider'>
                  {/* <div className="theme"> */}
                    {/* <Divider type="vertical" /> */}
                    {/* <Switch onChange={changeTheme} /> 改变主题   */}
                    {/* <br /> */}
                  {/* </div> */}
                  <Menu
                    defaultSelectedKeys={[pathname]}
                    defaultOpenKeys={['/aboutme']}
                    theme={theme}
                    items={items}
                    onClick={changeMenu}
                    // 除了直接点击切换，也可以根据url地址栏切换
                    selectedKeys={pathname}
                  />
                </div>
              </Sider>
              <Content>
                <div className="content">
                  {/* 二级路由的出口 */}
                  <Outlet></Outlet>
                </div>
                <div className="homeContent">
                 
                </div>
              </Content>
            </Layout>
            <Footer></Footer>
          </Layout>
    </div>
    

  )
}
