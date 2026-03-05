import { login, logout, getInfo,getDict } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'


const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    dictMap: {},
    permissions: ''
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
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_DICTMAP: (state, map) => {
      state.dictMap = map
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
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const { user  } = data
        const { avatar } = user
        commit('SET_NAME', user.userName)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 数据字典
    GetDict({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getDict().then(res => {
          debugger
          commit('SET_DICTMAP', res.data['dict'])
          console.log("数据字典为：" + res.data['dict'])
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
   },

   // 设置数据字典
    SetDictMap({
      commit
    }, dictMap) {
      return new Promise(resolve => {
        commit('SET_DICTMAP', dictMap)
        resolve()
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

