import axios from '../utils/request'

/* 
    路径地址
*/
const base={
    baseUrl:"http://1.117.109.184:3008",
    // baseUrl:"http://localhost:3008",
    
    upload:'/upload',

    visitorlogin:'/api/visitor',
    login:'/api/login',

    publish:'/api/publish',
    articles:"/api/articles",
    deletearticle:'/api/deletearticle',
    updatearticle:'/api/updatearticle',

    addsort:'/api/addsort',
    updatesort:'/api/updatesort',
    deletesort:'/api/deletesort',
    sorts:"/api/sorts",

    addlabel:'/api/addlabel',
    updatelabel:'/api/updatelabel',
    deletelabel:'/api/deletelabel',
    labels:"/api/labels",

    bulletscreen:'/api/bulletscreen',
    submitbullet:'/api/submitbullet',
    updatebullet:'/api/updatebullet',
    deletebullet:'/api/deletebullet',

    comments:'/api/comments',
    submitComment:'/api/submitComment',
    deletecomment:'/api/deletecomment',

    messages:'/api/messages',
    deletemessage:'/api/deletemessage',
    
}

/* 
    请求方法
*/


const api={

    visitorlogin(){
        return axios({
            method:'get',
            url:base.baseUrl+base.visitorlogin
        })
    },

    //登录
    login(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.login,
            data:params
        })
    },

    // 获取文章列表
    getArticles(params){
        return axios({
            method:'get',
            url: base.baseUrl+base.articles,
            params
        })
    },
    // 发布文章
    publishArticle(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.publish,
            data:params
        })
    },
    // 删除文章
    deleteArticle(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.deletearticle,
            data:params
        })
    },
    // 编辑文章
    updateArticle(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.updatearticle,
            data:params
        })
    },


    // 获得分类列表
    getSorts(){
        return axios({
            method:'get',
            url:base.baseUrl+base.sorts
        })
    },
    // 添加文章分类
    addSort(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.addsort,
            data:params
        })
    },
    // 修改文章分类
    updateSort(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.updatesort,
            data:params
        })
    },
    // 删除文章分类
    deleteSort(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.deletesort,
            data:params
        })
    },
    // 添加文章标签
    addLabels(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.addlabel,
            data:params
        })
    },
    // 修改文章标签
    updateLabel(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.updatelabel,
            data:params
        })
    },
    // 获得文章标签
    getLabels(){
        return axios({
            method:'get',
            url:base.baseUrl+base.labels
        })
    },
    // 删除文章标签
    deleteLabel(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.deletelabel,
            data:params
        })
    },
    // 获得弹幕
    getBulletScreen(){
        return axios({
            method:'get',
            url:base.baseUrl+base.bulletscreen
        })
    },
    //发表弹幕
    submitBulletScreen(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.submitbullet,
            data:params
        })
    },
    // 修改弹幕
    updateBullet(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.updatebullet,
            data:params
        })
    },
    // 删除弹幕
    deleteBullet(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.deletebullet,
            data:params
        })
    },
    // 获得评论
    getComments(params){
        return axios({
            method:'get',
            url:base.baseUrl+base.comments,
            params//get请求传参，用paraams接受,且接收值必须是对象形式！
        })
    },
    // 提交评论
    submitComment(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.submitComment,
            data:params//post请求传参，用data参数接受，若想通过res.body接受，一定要是data参数
        })
    },
    // 刪除评论
    deleteComment(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.deletecomment,
            data:params//post请求传参，用data参数接受，若想通过res.body接受，一定要是data参数
        })
    },

    // 获得留言
    geMessage(params){
        return axios({
            method:'get',
            url:base.baseUrl+base.messages,
            params//get请求传参，用paraams接受,且接收值必须是对象形式！
        })
    },
     // 刪除留言
     deleteMessage(params){
        return axios({
            method:'post',
            url:base.baseUrl+base.deletemessage,
            data:params//post请求传参，用data参数接受，若想通过res.body接受，一定要是data参数
        })
    },
    uploadImage(params){
     return axios({
        method:'post',
        url:base.baseUrl+base.upload,
        data:params//post请求传参，用data参数接受，若想通过res.body接受，一定要是data参数
    })
    }

}

export default api