import request from '@/utils/request'

export function queryCommodity(params) {
  return request({
    url: '/admin/commodity/list',
    method: 'post',
    data: params
  })
}

export function createCommodity(params) {
  return request({
    url: '/admin/commodity/create',
    method: 'post',
    data: params
  })
}

export function updateCommodity(params) {
  return request({
    url: '/admin/commodity/update',
    method: 'post',
    data: params
  })
}

export function deleteCommodity(params) {
  return request({
    url: '/admin/commodity/delete',
    method: 'post',
    data: params
  })
}

export function getCommodity(params) {
  return request({
    url: '/admin/commodity/get',
    method: 'post',
    data: params
  })
}
