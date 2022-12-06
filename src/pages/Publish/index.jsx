import React from 'react'
import './index.scss'
// import moment from 'moment'
import {  Form, Input ,Select,Button,Upload ,Switch, message,Card, Divider,Tag,
  Table, Modal, InputNumber,  Popconfirm} from 'antd';
import { useState ,useEffect} from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
// 接受路由参数state
import { useLocation } from 'react-router-dom';
// 引入redux
import { initArticle} from '../../redux/actions/articles';
import { initLabel } from '../../redux/actions/label';
import { initSort } from '../../redux/actions/sort';
import { useDispatch } from 'react-redux';
// 用插件来渲染成markdown格式的内容
import {marked} from 'marked';
// 代码高亮
import hljs from 'highlight.js';
import './github-dark.css'
import api from '../../api'
import getMaxId from '../../utils/getMaxId';

import moment from 'moment';
import oss from 'ali-oss';

const { Option } = Select;
export default function Publish() {
  // 存储图片列表
  const [fileList,setFileList]=useState()
  const [allLabel,setAllLabel]=useState([])
  const [allSort,setAllSort]=useState([])
  const [uniqueSortName,setUniqueSortName]=useState([])
  const [allArticle,setAllTicle]=useState([])

  const form=useRef()

  // 存储要发布的文章内容，不包括标签和分类
  const [publishData,setPublishData]=useState({})

  const [imageUrl, setImageUrl] = useState();  

  // 定义一个hook，存储文章的正文：
  const [content, setContent] = useState('');

  const dispatch=useDispatch()

  const {state}=useLocation()
  
  const [editFlag,setEditFlag]=useState(false)

  const [currentArticle,setCurrentArticle]=useState({})

  useEffect(() => {
    console.log('最刚开始的state的值',state);
    // state存在，说明当前是编辑状态！
    if(state)
    {
      setCurrentArticle(state.currentArticle)
      const {currentArticle}=state
      console.log(currentArticle);
      console.log('要编辑');
      form.current.setFieldsValue({
        id:currentArticle.id,
        title:currentArticle.title,
        img:currentArticle.img,
        sort:currentArticle.sort,
        // label:currentArticle.label,
        isOpen:currentArticle.open===1?true:false
        // create_date:updateData.create_date时间有点问题
      })
      // console.log(form.current);
      setImageUrl(currentArticle.img)
      // setFileList(currentArticle.img)
      // 回显编辑区和预览区
      setContent(currentArticle.content) 
      edit.current.innerText=currentArticle.content

      setEditFlag(true)
      
    }
    
    // if(flag)
    // console.log(currentArticle);
    
    api.getArticles({page:1}).then(res=>{
      setAllTicle(res.data.allArticles)
      // 存储到redux中
      dispatch(initArticle(res.data.allArticles))
    })
    api.getSorts().then(res=>{
      setAllSort(res.data.result)
      const sortName=res.data.result.map((item)=>{return item.name})
      const uniqueSort=Array.from(new Set(sortName))
      setUniqueSortName(uniqueSort)
      // 存储到redux中
      dispatch(initSort(res.data.result))
    })
    api.getLabels().then(res=>{
      setAllLabel(res.data.result)
      // 存储到redux中
      dispatch(initLabel(res.data.result))
      
    })
    // 配置highlight
    hljs.configure({
        tabReplace: '',
        classPrefix: 'hljs-',
        languages: ['CSS', 'HTML', 'JavaScript', 'Python', 'TypeScript', 'Markdown'],
    });
    // 配置marked
    marked.setOptions({
        renderer: new marked.Renderer(),// 这是必填项
        highlight: code => hljs.highlightAuto(code).value,// 高亮的语法规范
        gfm: true, //默认为true。 允许 Git Hub标准的markdown.
        tables: true, //默认为true。 允许支持表格语法。该选项要求 gfm 为true。
        breaks: true, //默认为false。 允许回车换行。该选项要求 gfm 为true。
    });
  }, []);


  function onFinish(value){
    // 通过moment获得当前时间
    let create_date=moment().format('YYYY-MM-DD HH:mm:ss')
    console.log('表单的内容是',publishData,value);
    console.log('最刚开始我的状态',fileList);
    console.log('最刚开始我的状态',state);
    // console.log('提交图片的内容是',value.img.fileList[0].name);
    /* 下面是提交文章 内容部分----------------------------------------------------------------------------------- */
    if(editFlag)//editFlag为标质量
    {
      console.log("现在是编辑-------------------------------------------------------------------");
      // const {currentArticle}=state
      let open=currentArticle.isOpen
      open=(open===true?1:0)
      const publishParams={
        ...value,
        id:currentArticle.id,
        author:'王建功',
        content,
        update_date:create_date,//默认就是创建时间
        create_date:currentArticle.create_date,
        like:0,
        dislike:0,
        img:fileList===undefined?currentArticle.img:value.img.fileList[0].name,
        view:currentArticle.view,
        open,
        
      }
      console.log('-------编辑的参数为-------',publishParams);
      
      api.updateArticle(publishParams).then(res=>{
        console.log(res.data);
      })

       /* 下面是编辑文章 标签部分----------------------------------------------------------------------------------- */
      
      console.log(value);
      
      let labelid=getMaxId(allLabel)
      value.label.map(item=>{
        labelid=labelid+1
        const params={
          id:(labelid),
          blog_id:currentArticle.id,
          name:item
        }
        console.log(params);
        return api.addLabels(params)
      })

      let labelList=currentArticle.label
      console.log(labelList);
      labelList.map(item=>{
        console.log(item);
        return api.deleteLabel({name:item.name})
      })


      
      /* 下面是编辑文章 分类部分----------------------------------------------------------------------------------- */
      const sortParams={
        blog_id:currentArticle.id,
        sort_id:currentArticle.sort_id,
        oldname:currentArticle.sort,
        newname:value.sort
      }
      api.updateSort(sortParams).then(res=>{
        console.log(res.data);
      })
      message.success('恭喜您，文章编辑成功！')

      setTimeout(() => {
        window.location.reload() // 强制页面刷新
      }, 1000);

    }
   else{
      console.log("现在是发布-------------------------------------------------------------------");
    
      let open=value.isOpen
      open=(open===true?1:0)
      const publishParams={
        ...value,
        id:getMaxId(allArticle)+1,
        author:'王建功',
        content,
        create_date,
        update_date:create_date,//默认就是创建时间
        like:0,
        dislike:0,
        img:value.img.fileList[0].name,
        view:0,
        open,
        
      }
      console.log('--------------',publishParams);
      
      api.publishArticle(publishParams).then(res=>{
        console.log(res.data);
      })

       /* 下面是提交文章 分类部分----------------------------------------------------------------------------------- */
      const sortParams={
        id:getMaxId(allSort)+1,
        blog_id:getMaxId(allArticle)+1,
        name:value.sort
      }
      api.addSort(sortParams).then(res=>{
        console.log(res.data);
      })
      /* 下面是提交文章 便签部分----------------------------------------------------------------------------------- */
      const labelParams={
        id:getMaxId(allLabel)+1,
        blog_id:getMaxId(allArticle)+1,
        name:value.label
      }
      console.log('labelParams的值为',labelParams);
      api.addLabels(labelParams).then(res=>{
        console.log(res.data);
      })
      message.success('恭喜您，文章发布成功')

      setTimeout(() => {
        window.location.reload() // 强制页面刷新
      }, 1000);

   }


   

  


  
  }

  
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 4,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 20,
      },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 20,
        offset: 4,
      },
    },
  };

  let scrolling
  let scrollTimer;
  const edit = useRef(null) 
  const show = useRef(null)  
  const handleScroll = (block, event) => {
      let { scrollHeight, scrollTop, clientHeight } = event.target
      let scale = scrollTop / (scrollHeight - clientHeight)  // 改进后的计算滚动比例的方法

      if(block === 1) {
          if(scrolling === 0) scrolling = 1;  
          if(scrolling === 2) return;    

          driveScroll(scale, show.current)  
      } else if(block === 2) {  
          if(scrolling === 0) scrolling = 2;
          if(scrolling === 1) return;    

          driveScroll(scale, edit.current)
      }
  }

  // 驱动一个元素进行滚动
  const driveScroll = (scale, el) => {
      let { scrollHeight, clientHeight } = el
      el.scrollTop = (scrollHeight - clientHeight) * scale  // scrollTop的同比例滚动

      if(scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
          scrolling = 0   
          clearTimeout(scrollTimer)
      }, 200)
  }
  // const [imageUrl,setImageUrl]=useState()
  // const [loading,setLoading]=useState(false)
  // const [token,setToken]=useState({
  //   access_key_id: 'LTAI5tNTGgSepk3u8iCLthM7', // oss的key_id
  //   access_key_secret: 'OAOcOcyf8uLTsMXN8CGDWKv8tDYV0O', // oss的secret
  //   OSS_ENDPOINT: '',  // 自己oss服务器的配置信息
  //   OSS_BUCKET: 'wjg-blog', // 自己oss服务器的配置信息
  // })

  // state = {
  //   loading: false,
  //   token: {
     
  //   }
  // };

/*点击上传时触发*/
function onChange({fileList: newFileList}){
  setFileList(newFileList)
    console.log(newFileList)
}

  return (
    <div className="publish">
        <div className="basicInfo">
          <Card>
          <Form
        ref={form}
        {...formItemLayoutWithOutLabel}
        name="basic"
        initialValues={{
          remember: true,
          isOpen:false
        }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
        >
        <Form.Item
          label="标题"
          name="title"
          rules={[
            {
              required: true,
              message: '请输入文章标题',
            },
          ]}
        >
          <Input placeholder='请输入文章标题' />
        </Form.Item>
 
        <Form.Item
          label="封面"
          name="img"
          rules={[
            {
              required: true,
            }
          ]}
        >
          <Upload
               action="http://localhost:80/api/upload"
               listType="picture-card"
               onChange={onChange} //0000
               fileList={fileList}
               maxCount={1}
               disabled={localStorage.getItem('blog-token')? false:true}
           >
            {imageUrl ?
              (
                fileList==undefined?
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    width: '100%',
                    height:'100%'
                  }}
                />:''
              ) 
              : 'upload'
            }
           </Upload>

        </Form.Item>

        <Form.Item
          label="分类"
          name="sort"
          rules={[
            {
              required: true,
              message: '请选择文章类别',
            },
          ]}
        >
          <Select placeholder="请选择文章类别">
            {
             uniqueSortName.map((item,index)=>{
              return (
                <Option value={item} key={index}>{item}</Option>
              )
             })
            }
          {/* <Option value="篮球">篮球</Option>
         
          <Option value="技术">技术</Option> */}
        </Select>
        </Form.Item>
        
        <div className="labels">
            <Form.List
            name="label"
            >
            {(fields, { add, remove },{ errors }) => (
              <>
              
                {fields.map((field, index) => (
                      <Form.Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? '标签' : ''}
                        required={true}
                        key={index}
                      >
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "请输入标签或者删除此项",
                            },
                          ]}
                          noStyle
                        >
                          <Input
                            style={{
                              width: '35%',
                              placeholder:'请输入标签'
                            }}
                          />
                        </Form.Item>
                        {fields.length > 1 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </Form.Item>
                  
                ))}
                <div className="addLabel">
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{
                        width: '40%',
                      }}
                      // icon={<PlusOutlined />}
                    >
                      添加标签
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </div>
                
              </>
            )}
            </Form.List>
          </div>
       
        <Form.Item label="公开" name="isOpen" valuePropName="checked"   rules={[{required: true,},]}>
                      {/* Switch属于第三方控件，所以必须加valuePropName */}
          <Switch />
        </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      {
        localStorage.getItem('visitor-token')?
          <Button type="primary" htmlType="submit" disabled>
          发布文章
          </Button>
        :
          <Button type="primary" htmlType="submit">
          发布文章
          </Button>
      }
        
      </Form.Item>
          </Form>
          </Card>
        </div>
        <div className="mainContent">

        
        <div className="titleMarkd">
          <h1>编辑区&nbsp;&nbsp;(markdown语法)</h1>
          <h1>预览区</h1>
        </div>
        <div className="marked">
            {/* 编辑区 */}
            <div 
            className="input-region markdownStyle" 
            contentEditable="plaintext-only"//设置div为可编辑的，且仅为纯文本
            suppressContentEditableWarning//解决上述属性的报错问题
            onInput={e => {//onInput为原生的js写法，就是在输入区域变化时候就触发，而onChange是输入区域变化且失去焦点时候触发
              setContent(e.target.innerText);
            }}
            ref={edit}
            onScroll={(e) => handleScroll(1, e)}
            >
            </div>

            {/* 预览区 */}
            <div
            className="show-region markdownStyle"
            ref={show}
            dangerouslySetInnerHTML={{
              __html: marked(content).replace(/<pre>/g, "<pre id='hljs'>"),
            }}
            >
            </div>
        </div>
        </div>
    </div>
    
  )
}
