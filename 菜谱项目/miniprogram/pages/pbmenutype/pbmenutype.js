// pages/pbmenutype/pbmenutype.js
const app = getApp()
import {
  getAdd,
  get,
  del,
  updateData
} from '../../utils/db'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    muensort: '',
    typeName:'',
    openidLogin: '',
    flagadd: false,
    flagupdata: false,
    list: [],
    updateId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    var result = await get('menuType')
    this.setData({
      list: result.data
    })
  },

  addBtn() {
    this.setData({
      flag: true
    })

  },
  //添加数据
  async addData() {
    // console.log(this.data.muensort)

    var addtime = new Date().getTime();
    var openidLogin = app.globalData.openid;
    var data1 = {
      typeName: this.data.muensort,
      addtime: addtime,
      openidLogin
    }
    this.setData({
      openidLogin,
      flag: false,
     
    })
    var res = await getAdd('menuType', data1)
    wx.showToast({
      title: "添加成功"
    })
    var result = await get('menuType')
    this.setData({
      list: result.data
    })
  },
  //删除数据
  Del(e){
    //  console.log(e)
     let {id,index} =e.currentTarget.dataset;
     wx.showModal({
      title:'确定要删除吗？',
      success:res=>{
        // console.log(res)
        if(res.confirm){
          //删除数据库中的数据
          del('menuType',id)
          //删除页面中的数据
          this.data.list.splice(index,1)
          this.setData({
            list:this.data.list
          })
        };

      }
     })
      

  },
  //修改输入框
  upda(e) {
    // console.log(e)
    var updateId=e.currentTarget.id
    console.log(updateId)
    this.setData({
      updateId,
      flagupdata: true
    })
    console.log(this.data.updateId)
  },
    //修改数据
async menuchange(){
   var typeName=this.data.typeName 
   var id=this.data.updateId
  //  console.log(typeName,id)
   var  data3={
    typeName:typeName
  }
    var re= await updateData('menuType',id,data3);
    // console.log(re)
     wx.showToast({
       title:'修改成功'
     })
    var result=await get('menuType')
    this.setData({
      flage:false,
      list: result.data
    })
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    var result = await get('menuType')
    this.setData({
      list: result.data
    })
    // console.log(this.data.list)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})