const { get } = require("../../utils/db");

// pages/recipelist/recipelist.js
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    typename:'',//标题
    flag:false,  //
    show:false,  //滚动获取数据时，数据不够的情况
    pageSize:5,
    page:0,
    id:'',
    keyname:'',
    sumstart:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
async  onLoad(e) {
     //---------页面加载获取第一页内容
     let {page,pageSize}=this.data
    
    
    //------通过个人中心的分类列表------
     if(e.id){
      let typename=e.typename
      let sId=e.id;
      var res=await get('menu',{typeId:sId},page*pageSize,pageSize)
      //-------------------------------xingxing-----------------------
      res.data.map((v)=>{
        if(v.follows<3){
        this.data.numstar=0
        }else if(v.follows<6){
        this.data.numstar=1
        }else if(v.follows<9){
        this.data.numstar=2
        }else if(v.follows<12){
        this.data.numstar=3
        }else if(v.follows<15){
        this.data.numstar=4
        }else{
        this.data.numstar=5
        }
        let stararr=[]
        for(var i=0;i<this.data.numstar;i++){
        stararr.push(i)
        }
        let stararr2=[]
        for(var i=0;i<(5-this.data.numstar);i++){
        stararr2.push(i)
        }
        v.star=stararr
        v.star2=stararr2
        return v
        })
      //---------渲染页面---------------
      this.setData({
        list:res.data,
        typename,
        id:sId
      })
       //修改标题
      wx.setNavigationBarTitle({
        title:typename
      })
     }
     
     //-----通过搜索框-------
     if(e.keyname){
      //  console.log("--33333---")
      let keyname=e.keyname;
      var result=await db.collection('menu').where({
        menuName:db.RegExp({
          regexp:keyname,
          options:'i',
        },page*pageSize,pageSize)
      }).get()
      //-------------小星星------------------
      result.data.map((v)=>{
        if(v.follows<3){
        this.data.numstar=0
        }else if(v.follows<6){
        this.data.numstar=1
        }else if(v.follows<9){
        this.data.numstar=2
        }else if(v.follows<12){
        this.data.numstar=3
        }else if(v.follows<15){
        this.data.numstar=4
        }else{
        this.data.numstar=5
        }
        let stararr=[]
        for(var i=0;i<this.data.numstar;i++){
        stararr.push(i)
        }
        let stararr2=[]
        for(var i=0;i<(5-this.data.numstar);i++){
        stararr2.push(i)
        }
        v.star=stararr
        v.star2=stararr2
        return v
        })
      //-----渲染页面----------------------
      this.setData({
        list:result.data
      })
       //修改标题
     wx.setNavigationBarTitle({
      title:'菜谱'
    })
     }
     if(this.data.list.length>0){
        this.setData({
          flag:true
        })
     }else{
      this.setData({
        flag:false
      })
     }
    
  },

  onShow: function () {
    if(this.data.list.length>0){
      this.setData({
        flag:true,  //是否有菜谱
       
      })
   }else{
    this.setData({
      flag:false
    })
   }
  },
  //根据id跳转到相应的详情页
async  detail1(e){
      let id=e.currentTarget.id;
      let result8=await get('menu',{_id:id})
      let menuname=result8.data[0].menuName
     
      wx.navigateTo({
        url:'/pages/recipeDetail/recipeDetail?id='+id+"&menuname="+menuname,
      })
  },
  //触底加载更多
  onReachBottom(){
    // console.log("分页");
     this.data.page+=1;
     var pageSize=this.data.pageSize;
     if(this.data.id!=''){
          //调取分页列表的函数
         this.getList({typeId:this.data.id},page,pageSize)
     }
     if(keyname!=''){
      //调取分页列表的函数
         this.getList({
           menuName:db.RegExp({
                  regexp:this.data.keyname,
                   options:'i',
        })},page,pageSize)
     }
    
  },
  //获取列表页的数据
  async getList(_where,page,pageSize){
    var result7=await get('menu',_where,page*pageSize,pageSize)
    this.setData({
      list:this.data.list.concat(result7.data)
    })
  }
})