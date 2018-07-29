import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken, getUserLoginId } from '@/utils/auth'

const user = {
  state: {
    user: '',
    userLoginId: getUserLoginId(),
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: 'http://7xl2ey.com1.z0.glb.clouddn.com/shop.png',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    shop: {}
  },

  mutations: {
    SET_USER_LOGIN_ID: (state, userLoginId) => {
      state.userLoginId = userLoginId
    },
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_SHOP: (state, shop) => {
      state.shop = shop
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password)
          .then(response => {
            console.log(response)
            const data = response.data
            commit('SET_TOKEN', data.token)
            commit('SET_USER_LOGIN_ID', data.userLoginId)
            setToken(response.data.token, data.userLoginId)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const userLoginId = state.userLoginId
        getUserInfo(state.token, userLoginId)
          .then(response => {
            if (!response.data) {
              // 由于mockjs 不支持自定义状态码只能这样hack
              reject('error')
            }
            const data = response.data

            commit('SET_NAME', data.profile.userNickName)
            // commit('SET_INTRODUCTION', data.introduction)
            if (data.shop) {
              commit('SET_SHOP', data.shop)
              commit('SET_AVATAR', data.shop.shopLogoUrl)
            }
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        const userLoginId = state.userLoginId
        logout(state.token, userLoginId)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_USER_LOGIN_ID', '')
            removeToken()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_USER_LOGIN_ID', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
