import { param2Obj } from '@/utils'

const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  },
  shop: {
    roles: ['shop'],
    token: 'shop',
    introduction: '我是商家',
    avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Shop Admin',
    shop: { id: 1 }
  }
}

const resultModel = {
  code: 200,
  msg: ''
}

export default {
  loginByUsername: config => {
    const { username } = JSON.parse(config.body)
    resultModel['data'] = userMap[username]
    return resultModel
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    if (userMap[token]) {
      resultModel['data'] = userMap[token]
      return resultModel
    } else {
      return false
    }
  },
  logout: () => {
    resultModel['data'] = 'success'
    return resultModel
  }
}
