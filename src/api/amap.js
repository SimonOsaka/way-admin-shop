import request from '@/utils/request'

export function searchMap(keywords) {
  const data = {
    keywords
  }
  return request({
    url: '/amap/searchText',
    method: 'post',
    data
  })
}
