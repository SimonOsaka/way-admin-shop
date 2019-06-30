import store from '../store'

var qiniu = require('qiniu')
const accessKey = 'EWUYsfsn9IgUlB5jWgAUe8hF5qlHkWZfCsiinvyb'
const secretKey = 'vjhOhjk3Igl0KrH-1fiHFpTC9M5tWfbYzBR2N7NE'
const bucket = process.env.NODE_ENV === 'production' ? 'static' : 'image02'
const imageHost =
  process.env.NODE_ENV === 'production'
    ? 'http://static.jicu.vip/'
    : 'http://image02.jicu.vip/'
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
  return getImagesKey('shop/logo/')
}

export function getCommodityImagesKey() {
  return getImagesKey('commodity/images/')
}

export function getImagesKey(prefix) {
  const token = store.getters.token
  return (
    token +
    '/' +
    prefix +
    moment().format('YYYYMM') +
    '/' +
    moment().unix() +
    '.jpg'
  )
}
