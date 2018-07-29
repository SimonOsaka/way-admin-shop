import {
  asyncRouterMap,
  constantRouterMap,
  asyncNoShopRouterMap
} from '@/router'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        commit('SET_ROUTERS', asyncRouterMap)
        resolve()
      })
    },

    GenerateNoShopRoutes({ commit }) {
      return new Promise(resolve => {
        commit('SET_ROUTERS', asyncNoShopRouterMap)
        resolve()
      })
    }
  }
}

export default permission
