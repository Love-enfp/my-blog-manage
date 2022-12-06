// 获取最大的id值，也就是插入数据的id值
function getMaxId(allArticleComment){
    const idList=allArticleComment.map(item=>{
        return item.id
    })
    idList.sort((a,b)=>{
        return b-a
    })
    return idList[0]
  }
export default getMaxId