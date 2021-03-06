import Mock from 'mockjs'
import loginAPI from './login'
import shopAPI from './shop'
import commodityAPI from './commodity'
import amapAPI from './amap'
// import remoteSearchAPI from './remoteSearch'
// import transactionAPI from './transaction'

if (process.env.MOCK_DATA === 'yes') {
  console.log('***********************************')
  console.log('* 开启模拟数据', process.env.MOCK_DATA)
  console.log('***********************************')
  // Mock.setup({
  //   timeout: '350-600'
  // })

  // 登录相关
  Mock.mock(/\/user\/login/, 'post', loginAPI.loginByUsername)
  Mock.mock(/\/user\/logout/, 'post', loginAPI.logout)
  Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

  // 商家管理相关
  Mock.mock(/\/sp\/shop\/list/, 'post', shopAPI.queryShopList)
  Mock.mock(/\/sp\/shop\/create/, 'post', shopAPI.createShop)
  Mock.mock(/\/sp\/shop\/update/, 'post', shopAPI.updateShop)
  Mock.mock(/\/sp\/shop\/delete/, 'post', shopAPI.deleteShop)
  Mock.mock(/\/sp\/shop\/get/, 'post', shopAPI.getShop)
  Mock.mock(/\/sp\/shop\/cate\/root/, 'post', shopAPI.getShopCateRoot)
  Mock.mock(/\/sp\/shop\/cate\/leaf/, 'post', shopAPI.getShopCateLeaf)

  // 商品管理相关
  Mock.mock(/\/sp\/commodity\/list/, 'post', commodityAPI.queryCommodity)
  Mock.mock(/\/sp\/commodity\/create/, 'post', commodityAPI.createCommodity)
  Mock.mock(/\/sp\/commodity\/update/, 'post', commodityAPI.updateCommodity)
  Mock.mock(/\/sp\/commodity\/delete/, 'post', commodityAPI.deleteCommodity)
  Mock.mock(/\/sp\/commodity\/get/, 'post', commodityAPI.getCommodity)

  // 地图相关
  Mock.mock(/\/amap\/search/, 'post', amapAPI.searchMap)
  // Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
  // Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
  // Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
  // Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)

  // 搜索相关
  // Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

  // 账单相关
  // Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)
}
export default Mock
