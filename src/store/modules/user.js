import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password , verifyCode } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password , verifyCode:verifyCode}).then(response => {
        debugger
        const { data } = response
        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },


  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        debugger
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar , user } = data

        commit('SET_NAME', user.userName)
        commit('SET_AVATAR', avatar)
        debugger
        // ⭐️ 关键：获取用户权限后，触发动态路由生成
        dispatch('permission/generateRoutes', permissions, { root: true })
            .then(accessedRoutes => {
              // ⭐️ 关键：将动态路由添加到路由器
              accessedRoutes.forEach(route => {
                router.addRoute(route)
              })
              
              // ⭐️ 关键：如果当前路由不在新生成的路由中，需要重定向
              const currentRoute = router.currentRoute
              if (currentRoute.name && !router.hasRoute(currentRoute.name)) {
                router.push('/404')
        }
          })
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

