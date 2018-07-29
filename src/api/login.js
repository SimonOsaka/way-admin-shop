import request from '@/utils/request'

export function loginByUsername(userLoginName, userLoginPassword) {
  const data = {
    userLoginName,
    userLoginPassword
  }
  return request({
    url: '/sp/user/login',
    method: 'post',
    data
  })
}

export function logout(token, userLoginId) {
  return request({
    url: '/sp/user/logout',
    method: 'post',
    headers: { token },
    data: { userLoginId }
  })
}

export function getUserInfo(token, userLoginId) {
  return request({
    url: '/sp/user/info',
    method: 'post',
    headers: { token },
    data: { userLoginId }
  })
}
