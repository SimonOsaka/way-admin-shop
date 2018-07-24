import request from '@/utils/request'

export function queryShopList(params) {
  return request({
    url: '/admin/shop/list',
    method: 'post',
    data: params
  })
}

export function createShop(params) {
  return request({
    url: '/admin/shop/create',
    method: 'post',
    data: params
  })
}

export function updateShop(params) {
  return request({
    url: '/admin/shop/update',
    method: 'post',
    data: params
  })
}

export function deleteShop(params) {
  return request({
    url: '/admin/shop/delete',
    method: 'post',
    data: params
  })
}

export function getShop(params) {
  return request({
    url: '/admin/shop/get',
    method: 'post',
    data: params
  })
}

export function getShopCateRoot(params) {
  return request({
    url: '/admin/shop/cate/root',
    method: 'post',
    data: params
  })
}

export function getShopCateLeaf(params) {
  return request({
    url: '/admin/shop/cate/leaf',
    method: 'post',
    data: params
  })
}
