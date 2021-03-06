import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: {
      title: 'login'
    }
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true,
    meta: {
      title: '404'
    }
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true,
    meta: {
      title: '401'
    }
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncNoShopRouterMap = [
  {
    path: '/shop',
    component: Layout,
    redirect: '/shop/create',
    alwaysShow: true,
    name: 'shop',
    meta: {
      title: 'shop',
      icon: 'shop'
    },
    children: [
      {
        path: '/shop/create',
        component: () => import('@/views/shop/create'),
        name: 'shop-create',
        meta: {
          title: 'shop-create',
          icon: 'form',
          noCache: true
        }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/shop',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'shop',
    meta: {
      title: 'shop',
      icon: 'shop'
    },
    children: [
      // {
      //   path: 'index',
      //   component: () => import('@/views/shop/index'),
      //   name: 'shop-list',
      //   meta: {
      //     title: 'shop-list',
      //     icon: 'list',
      //     noCache: true
      //   }
      // },
      {
        path: 'update',
        component: () => import('@/views/shop/create'),
        name: 'shop-update',
        meta: {
          title: 'shop-update',
          icon: 'form',
          noCache: true
        }
      }
    ]
  },

  {
    path: '/commodity',
    component: Layout,
    redirect: '/commodity/index',
    alwaysShow: true,
    name: 'commodity',
    meta: {
      title: 'commodity',
      icon: 'commodity'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/commodity/index'),
        name: 'commodity-list',
        meta: { title: 'commodity-list', icon: 'list', noCache: true }
      },
      {
        path: 'detail',
        component: () => import('@/views/commodity/detail'),
        hidden: true,
        name: 'commodity-detail',
        meta: { title: 'commodity-detail', icon: 'form', noCache: true }
      },
      {
        path: 'create',
        component: () => import('@/views/commodity/create'),
        hidden: true,
        name: 'commodity-create',
        meta: { title: 'commodity-create', icon: 'form', noCache: true }
      },
      {
        path: 'update',
        component: () => import('@/views/commodity/create'),
        hidden: true,
        name: 'commodity-update',
        meta: { title: 'commodity-update', icon: 'form', noCache: true }
      }
    ]
  },

  {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    alwaysShow: true,
    name: 'article',
    meta: {
      title: 'article',
      icon: 'documentation'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/article/create'),
        name: 'createArticle',
        meta: { title: 'createArticle', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/article/edit'),
        name: 'editArticle',
        meta: { title: 'editArticle', noCache: true },
        hidden: true
      },
      {
        path: 'detail/:id(\\d+)',
        component: () => import('@/views/article/detail'),
        name: 'detailArticle',
        meta: { title: 'detailArticle', noCache: true },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/article/list'),
        name: 'articleList',
        meta: { title: 'articleList', icon: 'list' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
