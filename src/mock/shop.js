const shopArray2 = {
  items: [],
  total: 21
}

const shopItem = {
  id: 1,
  shopLogoUrl:
    'https://fuss10.elemecdn.com/0/f0/71ef3220ff962d16d559767ac5b20jpeg.jpeg?imageMogr/format/webp/thumbnail/!130x130r/gravity/Center/crop/130x130/',
  shopName: '德克士（土桥店）',
  shopAddress: '北京市通州区砖厂南里39号楼1层111室',
  shopLng: 116.433224,
  shopLat: 39.482613,
  shopTel: '18001223932',
  shopBusinessTime: '00:00-24:00',
  shopBusinessTime1: '00:00-3:00',
  shopBusinessTime2: '06:00-23:59',
  shopInfo: '简介',
  shopCateLeafId: 3,
  shopCateRootId: 1
}

const resultModel = {
  code: 200,
  msg: ''
}

function mockListBySize(page, size, total) {
  var a = []
  var num = total - page * size > 0 ? size : total - (page - 1) * size
  for (var i = 0; i < num; i++) {
    shopItem.id += 1
    a.push(shopItem)
  }
  return a
}

const shopCateRoot = [
  {
    id: 1,
    label: '美食',
    leaf: []
  },
  {
    id: 2,
    label: '休闲',
    leaf: []
  },
  {
    id: 3,
    label: '酒店',
    leaf: []
  },
  {
    id: 4,
    label: '购物',
    leaf: []
  },
  {
    id: 5,
    label: '生活',
    leaf: []
  },
  {
    id: 6,
    label: '丽人',
    leaf: []
  },
  {
    id: 7,
    label: '结婚',
    leaf: []
  },
  {
    id: 8,
    label: '旅游',
    leaf: []
  }
]

const shopCateLeaf = {
  1: [
    {
      rootId: 1,
      id: 1,
      label: '外卖'
    },
    {
      rootId: 1,
      id: 2,
      label: '火锅'
    },
    {
      rootId: 1,
      id: 3,
      label: '自助餐'
    }
  ],
  2: [
    {
      rootId: 2,
      id: 19,
      label: 'KTV'
    },
    {
      rootId: 2,
      id: 20,
      label: '温泉'
    },
    {
      rootId: 2,
      id: 21,
      label: '公园/游乐园'
    }
  ],
  3: [
    {
      rootId: 3,
      id: 37,
      label: '经济/客栈'
    },
    {
      rootId: 3,
      id: 38,
      label: '三星/舒适'
    },
    {
      rootId: 3,
      id: 39,
      label: '四星/精品'
    }
  ],
  4: [
    {
      rootId: 4,
      id: 41,
      label: '海产品'
    },
    {
      rootId: 4,
      id: 42,
      label: '烟酒'
    },
    {
      rootId: 4,
      id: 43,
      label: '服饰鞋包'
    }
  ],
  5: [
    {
      rootId: 5,
      id: 54,
      label: '保健养生'
    },
    {
      rootId: 5,
      id: 55,
      label: '汽车服务'
    },
    {
      rootId: 5,
      id: 56,
      label: '体检保健'
    }
  ],
  6: [
    {
      rootId: 6,
      id: 71,
      label: '美发'
    },
    {
      rootId: 6,
      id: 72,
      label: '美容/SPA'
    },
    {
      rootId: 6,
      id: 73,
      label: '个性写真'
    }
  ],
  7: [
    {
      rootId: 7,
      id: 77,
      label: '婚纱摄影'
    },
    {
      rootId: 7,
      id: 78,
      label: '旅游婚纱照'
    },
    {
      rootId: 7,
      id: 79,
      label: '婚纱礼服'
    }
  ],
  8: [
    {
      rootId: 8,
      id: 88,
      label: '景点门票'
    },
    {
      rootId: 8,
      id: 89,
      label: '当地/周边游'
    },
    {
      rootId: 8,
      id: 90,
      label: '国内游'
    }
  ]
}
export default {
  queryShopList: config => {
    console.log(config)
    const { page, size, shopName } = JSON.parse(config.body)

    shopArray2.items = mockListBySize(page, size, shopArray2.total)
    if (shopName) {
      shopArray2.items = shopArray2.items.filter(
        i => i.shopName.indexOf(shopName) >= 0
      )
      console.log(shopArray2.items)
    }
    resultModel['data'] = shopArray2
    return resultModel
  },

  createShop: config => {
    console.log(config)
    return resultModel
  },

  updateShop: config => {
    console.log(config)
    return resultModel
  },

  deleteShop: config => {
    console.log(config)
    return resultModel
  },

  getShop: config => {
    console.log(config)
    resultModel['data'] = shopItem
    return resultModel
  },

  getShopCateRoot: config => {
    console.log(config)
    resultModel['data'] = shopCateRoot
    return resultModel
  },

  getShopCateLeaf: config => {
    console.log(config)
    const { rootId } = JSON.parse(config.body)
    const leaf = shopCateLeaf[rootId]
    resultModel['data'] = leaf
    return resultModel
  }
}
