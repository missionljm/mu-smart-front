// src/api/permission.js
import request from '@/utils/request'

// 获取用户权限信息
export function getUserPermissions() {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get'
  })
}

// 获取路由配置（可选）
export function getRouteConfig() {
  return request({
    url: '/getUser/api/getUserPermissions',
    method: 'get'
  })
}