/* 
    创建路由表，方便对路由进行管理
*/

// 加载路由组件
import Home from '../pages/Home'
import Publish from '../pages/Publish'
import Articles from '../pages/Articles'
import Comment from '../pages/Comment'
import Label from '../pages/Label'
import Sort from '../pages/Sort'
import LeaveWords from '../pages/LeaveWords'
import AboutMe from '../pages/AboutMe'
import Bullet from  '../pages/Bullet'
import AuthRoute from '../components/AuthRoute'
import Login from '../pages/Login'
import { Navigate } from 'react-router-dom'

const routes= [
    {
        path:'/',
        // 进行路由鉴权
        element:<AuthRoute><Home></Home></AuthRoute> ,
        children:[
            {
                path:'/publish',
                element:<Publish/>
            },
            {
                path:'/article',
                element:<Articles/>
            },
            {
                path:'/comment',
                element:<Comment/>
            },
            {
                path:'/label',
                element:<Label/>
            },
            {
                path:'/sort',
                element:<Sort/>
            },
           
            {
                path:'/leavewords',
                element:<LeaveWords/>
            },
            {
                path:'/bullet',
                element:<Bullet/>
            },
            {
                path:'/',
                element:<AboutMe/>
            },
           
        ]
    },
    {
        path:'/login',
        element:<Login></Login>

    }
   
]

export default routes

