import {
  get, getById
} from '../../utils/db'
Page({
  data: {
    indexMenuList: [],
    inp: '',
    page: 0, //分页：这是第一页
    pageSize: 6, //分页：一页展示8条数据
  },
  onLoad() {
   
  },
  async onShow() {
    this.data.page=0;
    this.data.indexMenuList=[]
    let {
      page,
      pageSize
    } = this.data
    
     
    var result = await get('menu', {}, page * pageSize, pageSize)

    this.setData({
      indexMenuList: this.data.indexMenuList.concat(result.data)
    })
  },
  //跳转到详情页面
async detail(e) {
    //  console.log(e)
    var id = e.currentTarget.id
     let result=await getById('menu',id)
    //  console.log(typename)
    wx.navigateTo({
      url: '/pages/recipeDetail/recipeDetail?id=' + id+"&menuname="+result.data.menuName,
    })
  },
  //搜索框的值
  bindinput(e) {
    //  console.log(e)
    this.data.inp = e.detail.value
  },
  //跳转到菜单列表
  menuLists() {
    wx.navigateTo({
      url: '/pages/recipelist/recipelist?keyname=' + this.data.inp,
    })
  },
  //跳转搜索分类页面
  searchsort() {
    wx.navigateTo({
      url: '/pages/typelist/typelist',
    })
  },
  //儿童菜谱
  async childrenlist() {
    let result9 = await get('menuType', {
      typeName: '儿童菜谱'
    })
    let id = result9.data[0]._id

    wx.navigateTo({
      url: '/pages/recipelist/recipelist?id=' + id + "&typename=儿童菜谱",
    })
  },
  //养生菜谱
  async yangsheng() {
    let result5 = await get('menuType', {
      typeName: '养生菜谱'
    })
    let id = result5.data[0]._id
    wx.navigateTo({
      url: '/pages/recipelist/recipelist?id=' + id + "&typename=养生菜谱",
    })
  },
  //触底加载更多
  async onReachBottom() {
    // let openid=wx.getStorageSync('openid')
    //------触底page+1加载下一页---------
    this.data.page += 1;
    //-------展示在页面上的数据条数不变
    let pageSize = this.data.pageSize
    let result4 = await get('menu', {}, this.data.page * pageSize, pageSize)
    this.setData({
      indexMenuList: this.data.indexMenuList.concat(result4.data)
    })
  }
})