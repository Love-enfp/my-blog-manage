
export const handleSort=(arr)=>{

    console.log(arr);
    for(var i=0;i<arr.length;i++){
        for(var j=i+1;j<arr.length;j++){
            //如果第一个比第二个大，就交换他们两个位置
            if(arr[i].innerList.length<arr[j].innerList.length){
                var temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }
    
    return arr
}

