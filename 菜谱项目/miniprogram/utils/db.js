const db = wx.cloud.database()
//条件查询
async function get(_collection = '', _where = {},_skip=0,_limit=20) {
  var result = await db.collection(_collection).skip(_skip).limit(_limit).where(_where).get()
  return result;
}

//根据id查询
async function getById(_collection = '',id) {
  var result = await db.collection(_collection).doc(id).get()
  return result;
}

//添加数据
async function getAdd(_collection = '', _data = {}) {
  var result = await db.collection(_collection).add({
    data: _data
  })
  return result;
}

//删除数据
async function del(_collection = '', _id) {
  var result = await db.collection(_collection).doc(_id).remove()
  return result;
}
//修改数据
async function updateData(_collection = '', _id, _data = {}) {
  var result = await db.collection(_collection).doc(_id).update({
    data: _data
  })
  return result;
}
export {
  get,
  getById,
  getAdd,
  del,
  updateData
}