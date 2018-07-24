const commodityArray = {
  items: [],
  total: 1
}

const commodityItem = {
  id: 1,
  imgUrl:
    'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  imgUrlList: [
    {
      i: 1,
      url:
        'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
    }
  ],
  name: '香辣鸡翅/2块',
  price: 12,
  shopId: 1
}

const resultModel = {
  code: 200,
  msg: ''
}

function mockListBySize(page, size, total) {
  var a = []
  var num = total - page * size > 0 ? size : total - (page - 1) * size
  for (var i = 0; i < num; i++) {
    commodityItem.id += 1
    a.push(commodityItem)
  }
  return a
}

export default {
  queryCommodity: config => {
    console.log(config)
    const { page, size } = JSON.parse(config.body)

    commodityArray.items = mockListBySize(page, size, commodityArray.total)
    resultModel['data'] = commodityArray
    return resultModel
  },

  createCommodity: config => {
    console.log(config)
    return resultModel
  },

  updateCommodity: config => {
    console.log(config)
    return resultModel
  },

  deleteCommodity: config => {
    console.log(config)
    return resultModel
  },

  getCommodity: config => {
    console.log(config)
    resultModel['data'] = commodityItem
    return resultModel
  }
}
