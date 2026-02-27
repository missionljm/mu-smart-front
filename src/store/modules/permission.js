// src/store/modules/permission.js
import { constantRoutes } from '@/router'
import Layout from '@/layout/index'
import { getRouteConfig } from '@/api/permission'
import router from '@/router'

//后端返回的路由数据格式示例
const backendRoutes = [
    {
      path: '/fund',
      component: Layout,
      hidden: false,
      redirect: '/fund/person',
      name: '资金管理',
      meta: { title: '资金管理', icon: 'el-icon-s-help' },
    }
]

// 将后端返回的路由数据转换为Vue Router格式
function convertBackendRoute(backendRoute) {
  const route = { ...backendRoute }
  
  // 处理 hidden 字段，转换为布尔类型
  if (typeof route.hidden === 'string') {
    route.hidden = route.hidden === 'true'
  }
  
  // 处理组件引用
  if (route.component === 'Layout') {
    route.component = Layout
  } else if (route.component && typeof route.component === 'string') {
    // 动态导入组件
    const componentPath = route.component.replace('@/', '')
    route.component = () => import(`@/${componentPath}`)
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
  async generateRoutes({ commit }, roles) {
    try {
      const res = await getRouteConfig()
      // 从后端获取路由配置
      const backendRoutes = res.data || []
      debugger
      // 转换后端路由格式
      const accessedRoutes = backendRoutes.map(route => convertBackendRoute(route))
      // 保存路由到状态
      commit('SET_ROUTES', accessedRoutes)
      // 添加路由到路由实例
      router.addRoutes(accessedRoutes)
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