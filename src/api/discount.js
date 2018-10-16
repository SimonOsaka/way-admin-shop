import request from '@/utils/request'

export function queryDiscount(params) {
  return request({
    url: '/sp/discount/list',
    method: 'post',
    data: params
  })
}

export function createDiscount(params) {
  return request({
    url: '/sp/discount/create',
    method: 'post',
    data: params
  })
}

export function getDiscount(params) {
  return request({
    url: '/sp/discount/get',
    method: 'post',
    data: params
  })
}
