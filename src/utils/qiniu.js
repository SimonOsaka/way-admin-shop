var qiniu = require('qiniu')
const accessKey = 'EWUYsfsn9IgUlB5jWgAUe8hF5qlHkWZfCsiinvyb'
const secretKey = 'vjhOhjk3Igl0KrH-1fiHFpTC9M5tWfbYzBR2N7NE'
const bucket = process.env.NODE_ENV === 'production' ? 'static' : 'image02'
const imageHost =
  process.env.NODE_ENV === 'production'
    ? 'http://static.duozouzou.top/'
    : 'http://7xl2ey.com1.z0.glb.clouddn.com/'
const moment = require('moment')

export function getImageFullUrl(key) {
  return imageHost + key
}

export function getQiniuToken() {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

  const options = {
    scope: bucket
  }
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)

  return uploadToken
}

export function getShopLogoKey() {
  return (
    'shop/logo/' + moment().format('YYYYMM') + '/' + moment().unix() + '.jpg'
  )
}

export function getCommodityImagesKey() {
  return (
    'commodity/images/' +
    moment().format('YYYYMM') +
    '/' +
    moment().unix() +
    '.jpg'
  )
}
