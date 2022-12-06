import React from 'react'
// 引入路由表
import routes from './routes';
// 导入useRoutes
import { useRoutes } from "react-router-dom";
function App() {
  // 根据路由表生成对应的路由规则
  const element=useRoutes(routes)
  return (
    <div className="App">
    {/* 注册路由部分   */}
    {element}
    </div>
  );
}

export default App;
