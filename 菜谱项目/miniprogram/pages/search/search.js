// pages/search/search.js
const db=wx.cloud.database()
Page({
  data: {
    arr:[],//近期搜索
    hotsearch:[],//热门搜索
    inp:'',
    flag:false
  },
  //获取搜索框输入的数据
  inputchange(e){
    // console.log(e)
    var inp=e.detail.value
    this.data.inp=inp
  },
onShow(){
  var arr=wx.getStorageSync('inp') || []
  this.setData({
    arr
  })
  if(this.data.arr.length!=0){ //判断近期搜索是否有数据
    this.setData({
      flag:true
    })
  }else{
    this.setData({
      flag:false
    })
  }
},

  //搜索框输入的内容
  searchK(){
     //把输入框的值存入缓存
     var inp=this.data.inp
     var arr=wx.getStorageSync('inp') || []
     var index=arr.findIndex(item=>{
       return item==inp
     })
     if(index!=-1){
       arr.splice(index,1)
     }
     arr.unshift(inp)
     wx.setStorageSync('inp',arr)
     this.setData({
      arr
    })
    if(this.data.arr.length!=0){   //判断近期搜索是否有数据
      this.setData({
        flag:true
      })
    }else{
      this.setData({
        flag:false
      })
    }
    //跳转到列表页
    wx.navigateTo({
      url: '/pages/recipelist/recipelist?keyname='+this.data.inp,
    })
  },
async onLoad(){
   //按照view降序排列
   let hot=await db.collection('menu').orderBy('views','desc').limit(10).get()
   this.setData({
     hotsearch:hot.data
   })
   
}

})