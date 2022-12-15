import { Card, Col, Row , Avatar, Comment, Tooltip} from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as echarts from 'echarts';
import { useRef } from 'react';
import {Link} from "react-router-dom"
import './index.scss'
import {dateFormatter} from '../../utils/dateFormat'
import User from '../../assets/images/user.png'
import {ReadOutlined,AppstoreOutlined,EditOutlined,PushpinOutlined,TagsOutlined,FireOutlined,HighlightOutlined,CommentOutlined} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { initMessage } from '../../redux/actions/message';
import { initLabel} from '../../redux/actions/label';
import { initSort } from '../../redux/actions/sort';
import { initArticle } from '../../redux/actions/articles';
import { initComment } from '../../redux/actions/comment';
import { initBullet } from '../../redux/actions/bullet';
import api from '../../api';
const { Meta } = Card;
export default function AboutMe() {
  const dispatch=useDispatch()

  const echartDom=useRef(null)

  const article=useSelector(state=>state.articles)
  const sort=useSelector(state=>state.sorts)
  const label=useSelector(state=>state.labels)
  const comment=useSelector(state=>state.comments)
  const bullet=useSelector(state=>state.bullets)
  const message=useSelector(state=>state.messages)

  // const newComment=comment.splice(3)
  // console.log(newComment);

  // 初始化图标数据
  function initData(node,keys,values){
    var myChart = echarts.init(node);
    let seriesData = []
    seriesData=switchEchartsData(keys,values)
    const option = {
      title: {//标题样式
        text: '分类分布图',
        left: 'left',
        padding: [20, 20],
        textStyle:{
          color :'black',
          fontWeight :300,
          fontSize:22
        }
      },
      tooltip: {//提示框组件。每个饼部分的提示
        trigger: 'item',//触发类型
        formatter: '{a} ：{b} <br/>数量: {c} ({d}%)'//提示框浮层内容格式器
      },
      legend: {//指的是饼图右边的菜单栏
        type: 'scroll',//可滚动翻页的图例
        orient: 'vertical',
        right: 0,//图例组件离容器右侧的距离。
        top: 20,
        bottom: 20,
        // data: legendData
      },
      series: [
        {
          name: '标签',
          type: 'pie',
          radius: '55%',
          center: ['40%', '50%'],
          data:seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    // 绘制图表
    myChart.setOption(option);
      
  }
 
  function switchEchartsData(keys,values){
    // console.log(keys,values);
    let res=[]
    res= keys.map((item,index)=>{
      return (
        { 
          name:item,
          value:values[index]
        }
      )
    })
    // console.log(res);
    return res
  }

      
  useEffect(()=>{
    /* 
      初始化所有的数据，都给存到redux中、
    */
      // 1.留言数据----------------------------------------------------------------------
      api.geMessage().then(res=>{
        const result= res.data.allMessage.map((item)=>{
          item.create_time=dateFormatter(item.create_time,'yyyy-mm-dd HH:mm:ss')
          return item
        })
        dispatch(initMessage(result))
  
      })
      // 2.文章数据----------------------------------------------------------------------
      api.getArticles({page:1}).then(res=>{
        // setAllTicle(res.data.allArticles)
        // 存储到redux中
        dispatch(initArticle(res.data.allArticles))
      })
      // 3.分类数据----------------------------------------------------------------------
      api.getSorts().then(res=>{
        // setAllSort(res.data.result)
        // 存储到redux中
        dispatch(initSort(res.data.result))
      })
      // 4.标签数据----------------------------------------------------------------------
      api.getLabels().then(res=>{
        // setAllLabel(res.data.result)
        // 存储到redux中
        dispatch(initLabel(res.data.result))
        
      })
      // 5.评论数据----------------------------------------------------------------------
      api.getComments().then(res=>{
        const result= res.data.allComment.map((item)=>{
          item.create_time=dateFormatter(item.create_time,'yyyy-mm-dd HH:mm:ss')
          return item
        })
        // setComments(result)
        dispatch(initComment(result))
      })
      // 6.弹幕数据---------------------------------------------------------------------
      api.getBulletScreen().then(res=>{
        // 数据处理，对时间格式化
        const result= res.data.result.map((item)=>{
          /* 拿到一个对象，直接对其中的属性修改，然后返回整个对象就行！ */
          item.create_date=dateFormatter(item.create_date,'yyyy-mm-dd HH:mm:ss')
          return item
        })
        dispatch(initBullet(result))
      })


    // commentNew=commentNew.splice(3)
    // commentNew= commentNew.map((item)=>{
    //   /* 拿到一个对象，直接对其中的属性修改，然后返回整个对象就行！ */
    //   item.create_time=dateFormatter(item.create_time,'yyyy-mm-dd HH:mm:ss')
    //   return item


     // 获得纯标签数据arr，仅有标签名
     const arr=sort.map(item=>{
      if(item.blog_id!==0)
      return item.name
      // else return 
      return item.name
    })
    let objGroup = arr.reduce(function (obj, name) {
        obj[name] = obj[name] ? ++obj[name] : 1;
        return obj;
    }, {});

    initData(echartDom.current,Object.keys(objGroup),Object.values(objGroup))
  },[])


  return (
    <div className="aboutme">
      <div className="topInfo">
        <div className="user">
        <Card
          style={{
            width: 300,
          }}
          cover={
            <img
              alt="example"
              src={User}
            />
          }

        >
          <Meta
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title="王建功"
            description="世上没有不弯的路，人间没有不谢的花，人这一生能力有限，但是努力无限。努力做一个善良的人，做一个心态阳光的人，做一个积极向上的人"
          />
        </Card>
        </div>
        
        <div className="dataNum">
          <div className="top">
              <Card  bordered={false} className="one">
                <Link to="/article">
                  <div className="left"> <ReadOutlined /></div>
                  <div className="right">
                    <p>文章数量</p>
                    <span>{article.length}</span>
                  </div>
                </Link>
                
              </Card>
              <Card  bordered={false} className="two">
                <Link to="/sort">
                    <div className="left"> <AppstoreOutlined /></div>
                    <div className="right">
                    <p>分类数量</p>
                    <span>{sort.length}</span>
                  </div>
                </Link>
              </Card>
              <Card  bordered={false} className="three">
                <Link to="/label">
                  <div className="left"> <TagsOutlined /></div>
                  <div className="right">
                  <p>标签数量</p>
                  <span>{label.length}</span>
                </div>
                </Link>
              </Card>
          </div>
          <div className="bottom">
              <Card  bordered={false} className="four">
                <Link to="/comment">
                <div className="left"><HighlightOutlined /></div>
                  <div className="right">
                  <p>评论数量</p>
                  <span>{comment.length}</span>
                </div>
                </Link>
              </Card>

              <Card  bordered={false} className="five">
               <Link to="/bullet">
                  <div className="left"> <FireOutlined /></div>
                  <div className="right">
                  <p>弹幕数量</p>
                  <span>{bullet.length}</span>
                </div>
                </Link>
              </Card>


              <Card  bordered={false} className="six">
                <Link to="/leavewords">
                  <div className="left"> <CommentOutlined /></div>
                  <div className="right">
                  <p>留言数量</p>
                  <span>{message.length}</span>
                </div>
                </Link>
              </Card>
          </div>
        </div>
      </div>
      <div className="middleInfo">
        <div className="sortData">
          <Card>
          <div className='echarts' style={{height:450,width:500}} ref={echartDom}> </div>

          </Card>
      
        </div>
        <div className="newestData">
        <Card title="最新消息">
            <Card type="inner" title="最新留言" extra={<a href="leavewords">More</a>} className="messageNew">
              {
                message?
                message.map((item,index)=>{
                  return (
                    <div key={index}>
                       {
                        index<2?
                        (
                        <Comment
                        author={<a>{item.nick=='钟爱enfp女孩'?<span><PushpinOutlined className='author'></PushpinOutlined>{item.nick}</span>:item.nick}</a>}
                        avatar={<Avatar src={item.avatar} alt="Han Solo" />}
                        content={
                          <p>
                            {item.content}
                          </p>
                        
                        }
                        datetime={
                          <Tooltip title={item.create_time}>
                            <span>{item.create_time}</span>
                          </Tooltip>
                        }
                        />)
                        :''
                       }
                       
                    </div>
                  )
                }):
                ''
              }
            </Card>
            <Card
              className='commentNew'
              style={{
                marginTop: 16,
              }}
              type="inner"
              title="最新评论"
              extra={<a href="comment">More</a>}
            >
               {
                comment?
                comment.map((item,index)=>{
                  return (
                    <div  key={index}>
                      {
                        index<2?
                        <Comment
                        author={<a>{item.nick=='钟爱enfp女孩'?<span><PushpinOutlined className='author'></PushpinOutlined>{item.nick}</span>:item.nick}</a>}
                          avatar={<Avatar src={item.avatar} alt="Han Solo" />}
                          content={
                            <p>
                              {item.content}
                            </p>
                          }
                          datetime={
                            <Tooltip title={item.create_time}>
                              <span>{item.create_time}</span>
                            </Tooltip>
                          }
                        />:''
                      }
                      
                    </div>
                     
                  )
                }):
                ''
              }
            </Card>
            <Card
              className='bulletNew'
              style={{
                marginTop: 16,
              }}
              type="inner"
              title="最新弹幕"
              extra={<a href="/bullet">More</a>}
            >
               {
                bullet?
                bullet.map((item,index)=>{
                  return (
                    <div key={index}>
                      {
                        index<2?
                        <Comment
                      
                          content={
                            <p>
                              {item.content}
                            </p>
                          }
                          datetime={
                            <Tooltip title={item.create_date}>
                              <span>{item.create_date}</span>
                            </Tooltip>
                          }
                        />:""
                      }
                    </div>
                     
                  )
                }):
                ''
              }
            </Card>
            
        </Card>
        </div>
      </div>
    </div>
    
  )
}
