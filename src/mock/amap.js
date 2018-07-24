const searchResult = [
  {
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄',
    lng: 116.687972,
    lat: 39.872654
  },
  {
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1517 弄',
    lng: 116.430984,
    lat: 39.800054
  },
  {
    date: '2016-05-01',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1519 弄',
    lng: 116.318876,
    lat: 39.962615
  },
  {
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1516 弄',
    lng: 116.495375,
    lat: 39.971021
  },
  {
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1516 弄',
    lng: 116.19692,
    lat: 39.21937
  },
  {
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1516 弄',
    lng: 116.236304,
    lat: 39.263243
  },
  {
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1516 弄',
    lng: 116.275688,
    lat: 39.307117
  }
]

const resultModel = {
  code: 200,
  msg: ''
}

export default {
  searchMap: config => {
    resultModel['data'] = searchResult
    return resultModel
  }
}
