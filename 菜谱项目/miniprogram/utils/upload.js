// 上传文件到云存储   （参数：_filePath：文件临时路径 ）
async  function  upload1(_filePath){
   //生成时间戳用来作为文件名
   
   var filename=new Date().getTime();
   //截取文件的后缀名
   var extname=_filePath.split('.').pop();
   //文件上传接口
   return await wx.cloud.uploadFile({
       //文件上传服务器后的云端路径
       cloudPath:'images/'+filename+"."+extname,
       filePath:_filePath
   })
  
}

export {upload1}
