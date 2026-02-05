// src/store/modules/permission.js
import { constantRoutes } from '@/router'
import Layout from '@/layout/index'
import router from '@/router'

// 后端返回的路由数据格式示例
const backendRoutes = [
  {
    path: '/admin',
    component: 'Layout',  // 指定布局组件
    redirect: '/admin/users',
    name: 'Admin',
    meta: { 
      title: 'Admin', 
      icon: 'lock',
      roles: ['admin'] 
    },
    children: [
      {
        path: 'users',
        name: 'UserManage',
        component: '@/views/admin/users/index',  // 组件路径
        meta: { 
          title: 'User Management', 
          roles: ['admin', 'manager'] 
        }
      },
      {
        path: 'settings',
        name: 'SystemSettings',
        component: '@/views/admin/settings/index',
        meta: { 
          title: 'System Settings', 
          roles: ['admin'] 
        }
      }
    ]
  }
]

// 将后端返回的路由数据转换为Vue Router格式
function convertBackendRoute(backendRoute) {
  const route = { ...backendRoute }
  
  // 处理组件引用
  if (route.component === 'Layout') {
    route.component = Layout
  } else if (route.component) {
    // 动态导入组件
    route.component = () => import(`@/${route.component.replace('@/', '')}`)
  }
  
  // 处理子路由
  if (route.children && route.children.length > 0) {
    route.children = route.children.map(child => convertBackendRoute(child))
  }
  
  return route
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // 从后端获取路由配置
  async generateRoutes({ commit }, permissions) {
    try {
      debugger
      // 从后端获取路由配置
      const { data } = await import('@/api/permission')
      const backendRoutes = await data.getRouteConfig()
      
      // 根据用户权限过滤路由
      let accessedRoutes = []
      if (permissions.includes('admin')) {
        // admin用户可以访问所有路由
        accessedRoutes = backendRoutes.data.map(route => convertBackendRoute(route))
      } else {
        // 普通用户根据权限过滤
        accessedRoutes = backendRoutes.data
          .filter(route => {
            if (route.meta && route.meta.roles) {
              return permissions.some(permission => 
                route.meta.roles.includes(permission)
              )
            }
            return true
          })
          .map(route => convertBackendRoute(route))
      }
      
      commit('SET_ROUTES', accessedRoutes)
      return accessedRoutes
    } catch (error) {
      console.error('获取路由配置失败:', error)
      // 如果获取失败，返回空数组或默认路由
      commit('SET_ROUTES', [])
      return []
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}