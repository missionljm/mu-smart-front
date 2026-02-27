// src/api/permission.js
import request from '@/utils/request'

// 获取用户权限信息
export function logout() {
  return request({
    url: '/commonLogin-Api/logout',
    method: 'get'
  })
}