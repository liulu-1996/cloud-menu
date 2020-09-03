const db = wx.cloud.database()
import {
  getById,
  getAdd,
  updateData,
  get
} from '../../utils/db'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuDetail: [],
    id: '',
    flag: false,
    follows1:0
  },

  async onLoad(e) {

    var id = e.id
    //--------标题---------
    wx.setNavigationBarTitle({
      title: e.menuname,
    })
    //浏览次数
    var res = await updateData('menu', id, {
      views: db.command.inc(1)
    });
    var resul = await getById('menu', id)
      
    var openid=wx.getStorageSync('openid')
    //读取关注的数据根据menuId,openid
    var foll = await get('follow', {
      menuId: id,
      _openid:openid
    })
    // console.log(foll)
    this.setData({
      menuDetail: resul.data,
      id
    })
   //判断是否关注
    if (foll.data.length==1) {
      this.setData({
        flag:true
      })
    } else {
      this.setData({
        flag:false
      })
    }
  },
  //点击关注
  async follows1() {
    var openid = wx.getStorageSync('openid')
    var menuId = this.data.id

    var data4 = {
      menuId: this.data.id,
      addtime: new Date().getTime()
    }
    this.setData({
      flag: !this.data.flag
    })
    if (this.data.flag) {
      var result1 = await getAdd('follow', data4)
      //关注数+1
      var result2 = await updateData('menu', this.data.id, {
        follows: db.command.inc(1)
      })
      
     
    } else {
      //关注数-1
      var result2 = await updateData('menu', this.data.id, {
        follows: db.command.inc(-1)
      })
      wx.cloud.callFunction({
        name: 'couldDel',
        data: {
          a: openid,
          b: menuId
        }
      })
    }
  },
  //点击分享
  bindTap(){
     wx.showToast({
       title: '尚未开发',
       icon:"none"
     })
  },
  async onShow() {
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})