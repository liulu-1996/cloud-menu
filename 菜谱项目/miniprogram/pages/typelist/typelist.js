// pages/typelist/typelist.js
 import {get,getById} from '../../utils/db'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inp:'', //输入框内容
    lists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
 async onLoad() {
      var result=await get('menuType') 
    
      this.setData({
        list:result.data
      }) 
  },
  //输入框的内容
  bindInputChange(e){
    this.data.inp=e.detail.value
  },
  //跳转到菜单列表页面
  searC(){
    wx.navigateTo({
      url: '/pages/recipelist/recipelist?keyname='+this.data.inp,
    })
  },
 async MenuList(e){
    // console.log(e)
    let id=e.currentTarget.id
    let result=await getById('menuType',id)
    wx.navigateTo({
      url: '/pages/recipelist/recipelist?id='+id+"&typename="+result.data.typeName,
    })
  }
})