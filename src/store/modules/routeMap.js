// src/store/modules/routeMap.js
// 组件路径映射表，用于动态路由的组件导入

const componentMap = {
  'person/index': () => import('@/views/person/index.vue'),
  'fund/person/index': () => import('@/views/fund/person/index.vue'),
  'fund/personDay/index': () => import('@/views/fund/personDay/index.vue')
}

export default componentMap
