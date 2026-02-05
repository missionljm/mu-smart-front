import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/commonLogin-Api/login',
    method: 'POST',
    data
  })
}

export function getVerificationCode(userAccount) {
  return request({
    url: '/commonLogin-Api/getVerificationCode',
    method: 'GET',
    params: { userAccount }
  })
}

export function getInfo(token) {
  return request({
    url: '/getUser/api/getUserInfo',
    method: 'get',
    // headers: { 'Cookie': token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
