import request from '@/utils/request'

export function searchMap(keywords) {
  const data = {
    keywords
  }
  return request({
    url: '/amap/search',
    method: 'post',
    data
  })
}
