import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/sp/article',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/sp/article/' + id,
    method: 'get'
  })
}

export function fetchPostToken() {
  return request({
    url: '/sp/article/token',
    method: 'get'
  })
}

export function createArticle(data) {
  return request({
    url: '/sp/article',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/sp/article/' + data.postId,
    method: 'put',
    data
  })
}

export function queryCommodity(params) {
  return request({
    url: '/sp/commodity/list',
    method: 'post',
    data: params
  })
}

export function getRejectContent(postId) {
  return request({
    url: '/sp/article/audit/' + postId,
    method: 'get'
  })
}
