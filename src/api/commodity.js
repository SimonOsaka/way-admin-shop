import request from '@/utils/request'

export function queryCommodity(params) {
  return request({
    url: '/sp/commodity/list',
    method: 'post',
    data: params
  })
}

export function createCommodity(params) {
  return request({
    url: '/sp/commodity/create',
    method: 'post',
    data: params
  })
}

export function updateCommodity(params) {
  return request({
    url: '/sp/commodity/update',
    method: 'post',
    data: params
  })
}

export function deleteCommodity(params) {
  return request({
    url: '/sp/commodity/delete',
    method: 'post',
    data: params
  })
}

export function getCommodity(params) {
  return request({
    url: '/sp/commodity/get',
    method: 'post',
    data: params
  })
}
