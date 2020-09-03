// pages/personal/personal.js
const app=getApp();
const db=wx.cloud.database()
console.log(app)
import {getAdd,get,del, getById} from '../../utils/db'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      openidLogin:'', 
      userInfo:{}, //用户公开信息
      isLogin:false,
      list:[
        {id:0,menu1:'菜单'},
        {id:1,menu1:'分类'},
        {id:2,menu1:'关注'}
      ],
     id:0,
     sortList:[], //分类列表
     menulist:[], //菜单列表
     followslist1:[], //关注列表
     page:0,//首页
     pageSize:6 //每一页展示的数据条数
  },

  /**
   * 生命周期函数--监听页面加载
   */
async  onLoad() {
    
    if (app.globalData.userInfo!=null){
       //渲染用户信息
       var userInfo=app.globalData.userInfo
       this.setData({
         userInfo,
         isLogin:true
       })
    }else{
      //回到app里拿用户信息
      app.userInfoReadyCallback=res=>{
        // console.log(res)
        this.setData({
          userInfo:res.userInfo,
          isLogin:true
        })
      }
    }
    let {page,pageSize}=this.data
    var openid=wx.getStorageSync("openid")
    //分类列表数据
    var result=await get('menuType',{_openid:openid})
    //菜单列表数据
    var result1=await get('menu',{_openid:openid},page*pageSize,pageSize)

    //获取关注列表
    var openid=wx.getStorageSync('openid')
    //根据openid获取menu中的menuId组成的数组
    var followslist=await get('follow',{_openid:openid})
    // console.log(followslist)
    var menuidArr=followslist.data.map(item=>{
          return item.menuId
    })
    //根据menuId数组，获取menu详情
    var followslist1=await get('menu',{_id:db.command.in(menuidArr)},page*pageSize,pageSize)
    // var followslist1=await db.collection('menu').where({_id:db.command.in(menuidArr)}).get()
    this.setData({
      sortList:result.data,
      menulist:result1.data,
      followslist1:followslist1.data
    })
    // console.log(followslist1)
  },
  //获取用户信息
 async myInfo(e){
    var openidLogin=app.globalData.openid;
    // console.log(openidLogin)
    this.setData({
      openidLogin,
      userInfo:e.detail.userInfo,
      isLogin:true
    })
    var data1={
         openidLogin:this.data.openidLogin,
         nickName:this.data.userInfo.nickName,
         avatarUrl:this.data.userInfo.avatarUrl
       }
       await getAdd('user',data1)
  },
  //点击关注选项卡中的图片跳转到相应的详情页面
 async details(e){
    // console.log(e)
    var id=e.currentTarget.id;
    let result=await getById('menu',id)
    wx.navigateTo({
      url: '/pages/recipeDetail/recipeDetail?id='+id+"&menuname="+result.data.menuName,
    })
  },
  //跳转到菜单添加页面
  fbcpfl(){
    wx.navigateTo({
      url:'/pages/pbmenutype/pbmenutype'
    })
  },
  //选项卡切换
 sele(e){
  //  console.log(e)
   var id=parseInt(e.currentTarget.id);
   this.setData({
     id
   })
  //  console.log(this.data.index)
 },
 //菜单选项卡的删除操作
 delCdlb(e){
    // console.log(e)
    //拿到id和index
    let {id,index}=e.currentTarget.dataset;
    // console.log(id);return;
    wx.showModal({
      title:'删除成功',
      success:async res=>{
        //当res.confirm为真时执行删除
        if(res.confirm){
             //在数据库中删除该条数据
              await del('menu',id)
              //在页面中删除该条数据
              this.data.menulist.splice(index,1)
              //重新渲染数据
              this.setData({
                menulist:this.data.menulist
              })
        }
      }
    })
 },

async onShow() {
  var openid=wx.getStorageSync("openid")
  var result=await get('menuType',{_openid:openid})
  var result1=await get('menu')

  //获取关注列表
  //根据openid获取menu中的menuId组成的数组
  var followslist=await get('follow',{_openid:openid})
  // console.log(followslist)
  var menuidArr=followslist.data.map(item=>{
        return item.menuId
  })
  //根据menuId数组，获取menu详情
  var followslist1=await db.collection('menu').where({_id:db.command.in(menuidArr)}).get()
  this.setData({
    sortList:result.data,
    menulist:result1.data,
    followslist1:followslist1.data
  })
  },
  //跳转菜单添加页面
  pbmenu(){
    wx.navigateTo({
      url: "/pages/pbmenu/pbmenu",
    })
  },
  //分类列表点击查看跳转到相应的菜单列表
async  sortLook(e){
    // console.log(e)
    
    var id=e.currentTarget.id
    var res=await getById('menuType',id)
    var typename=res.data.typeName
    // console.log(typename,'11111')
    wx.navigateTo({
      url: '/pages/recipelist/recipelist?id='+id+'&typename='+typename,
    })
},
//跳转到详情页
async xiangQ(e){
  // console.log(e)
  let id=e.currentTarget.id
  let reuslt=await getById('menu',id)
  wx.navigateTo({
    url: '/pages/recipeDetail/recipeDetail?id='+id+'&menuname='+reuslt.data.menuName,
  })
},
 //页面触底加载更多(选项卡是菜单时)
 async onReachBottom(){
   let openid=wx.getStorageSync('openid')
   this.data.page+=1;
   let pageSize=this.data.pageSize
   let result=await get('menu',{_openid:openid},this.data.page*pageSize,pageSize)
 }
})