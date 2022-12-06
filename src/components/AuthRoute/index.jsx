/* 通过高阶组件来实现路由鉴权 */
// 1. 判断token是否存在
// 2. 如果存在 直接正常渲染
// 3. 如果不存在 重定向到登录路由
import React from 'react'
import { Navigate } from 'react-router-dom'
// 高阶组件:把一个组件当成另外一个组件的参数传入 然后通过一定的判断 返回新的组件
export default function AuthRoute({children}) {
    const visitortoken=localStorage.getItem('visitor-token')
    const isToken=localStorage.getItem('blog-token')
    if(isToken||visitortoken)
    {
        return <>{children}</>
    }
    else{
        return <Navigate to="/login" replace />
    }
}
// <AuthComponent> <Layout/> </AuthComponent>
// 登录：<><Layout/></>
// 非登录：<Navigate to="/login" replace />

export { AuthRoute }