// pages/pbmenu/pbmenu.js

import {get,getAdd} from '../../utils/db'
import {upload1} from '../../utils/upload'
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
       sortlist:[],
       files:[],
       openid:'',
       nickName:'',
       avatarUrl:'',
       files:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(){
        //  console.log(app)
        //  var  openid=app.globalData.openid;
        //  var  nickname=app.globalData.userInfo.nickName
        //  var  avatarUrl=app.globalData.userInfo.avatarUrl
         var result=await get('menuType')
         this.setData({
           sortlist:result.data,
           
        
         })
  },
  bindselect(e){
    // console.log(e)
    
    var tempFilePaths=e.detail.tempFilePaths 
    var files= tempFilePaths.map(item=>{
       return {
         url:item
       }
     })
     this.setData({
       files
     })
    //  console.log(this.data.files)
  },
async bindsubmit(e){
    //  console.log(e)
    let {nickName,avatarUrl}=app.globalData.userInfo
    // console.log(nickName,avatarUrl)
      var arr=[]
     this.data.files.forEach(item=>{
      var filename=new Date().getTime();
      //截取文件的后缀名
      var extname=item.url.split('.').pop();
      //文件上传接口
       var prop= wx.cloud.uploadFile({
          //文件上传服务器后的云端路径
          cloudPath:'images2/'+filename+"."+extname,
          filePath:item.url
        })
        arr.push(prop)
      })
      var result=await Promise.all(arr)
      //图片
      var fileID=result.map(item=>{
        
         return item.fileID
      })
   
      // console.log(fileID)
      var data2={
        menuName:e.detail.value.menuName,
        typeId:e.detail.value.typeId,
        desc:e.detail.value.desc,
        nickName,
        avatarUrl,
        
        follows:0,
        views:0,
        fileIds:fileID
      }
      await getAdd('menu',data2)
      wx.showToast({
        title:'发布成功'
      })
  }
})