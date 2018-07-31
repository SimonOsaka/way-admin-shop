import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { Message } from 'element-ui'
import { getToken, getUserLoginId } from '@/utils/auth' // 验权
import i18n from './lang' // Internationalization

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// permission judge function
// function hasPermission(roles, permissionRoles) {
//   console.log(roles, permissionRoles)
//   if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
//   if (!permissionRoles) return true
//   return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = i18n.t('route.' + to.meta.title)
  }
  NProgress.start() // start progress bar
  if (getToken() && getUserLoginId()) {
    // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.addRouters.length === 0) {
        store
          .dispatch('GetUserInfo')
          .then(res => {
            store.dispatch('GenerateRoutes').then(() => {
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            })
          })
          .catch(err => {
            store.dispatch('FedLogOut').then(() => {
              Message.error(err || 'Verification failed, please login again')
              next({ path: '/' })
            })
          })
      } else if (!store.getters.shop.id && to.path !== '/shop/create') {
        // 未创建商铺信息，跳转创建商铺页面
        store
          .dispatch('GetUserInfo')
          .then(res => {
            // alert(to.path)
            store.dispatch('GenerateNoShopRoutes').then(() => {
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              next({
                path: '/shop/create',
                replace: true
              })
            })
          })
          .catch(err => {
            store.dispatch('FedLogOut').then(() => {
              Message.error(err || 'Verification failed, please login again')
              next({ path: '/' })
            })
          })
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
