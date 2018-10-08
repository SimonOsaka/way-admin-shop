import request from '@/utils/request'

export function queryShopList(params) {
  return request({
    url: '/sp/shop/list',
    method: 'post',
    data: params
  })
}

export function createShop(params, token) {
  return request({
    url: '/sp/shop/create',
    method: 'post',
    headers: { token },
    data: params
  })
}

export function updateShop(params) {
  return request({
    url: '/sp/shop/update',
    method: 'post',
    data: params
  })
}

export function deleteShop(params) {
  return request({
    url: '/sp/shop/delete',
    method: 'post',
    data: params
  })
}

export function getShop(params) {
  return request({
    url: '/sp/shop/get',
    method: 'post',
    data: params
  })
}

export function onlineShop(params) {
  return request({
    url: '/sp/shop/online',
    method: 'post',
    data: params
  })
}

export function offlineShop(params) {
  return request({
    url: '/sp/shop/offline',
    method: 'post',
    data: params
  })
}

export function getShopCateRoot(params) {
  return request({
    url: '/sp/shop/cate/root',
    method: 'post',
    data: params
  })
}

export function getShopCateLeaf(params) {
  return request({
    url: '/sp/shop/cate/leaf',
    method: 'post',
    data: params
  })
}

export function getShopCateAll() {
  return request({
    url: '/sp/shop/cate/all',
    method: 'post'
  })
}

export function getShopRejectLog(params) {
  return request({
    url: '/sp/shop/log/reject/get',
    method: 'post',
    data: params
  })
}
