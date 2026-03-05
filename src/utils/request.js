import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 500000 ,// request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    debugger
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    debugger
    const res = response.data

    // 检查是否是后端的新格式
    if (res.status && typeof res.status.code !== 'undefined') {
      // 这是后端的新格式
      if (res.status.code === 100500001) {
        // 这是一个错误状态，应该处理错误
        Message({
          message: res.status.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(res.status.msg || 'Error'))
      } else {
        // 假设其他正数code表示成功
        if (res.status.code.toString().startsWith('100')) {
          // 仍然认为是错误
          Message({
            message: res.status.msg || 'Error',
            type: 'error',
            duration: 5 * 1000
          })
          return Promise.reject(new Error(res.status.msg || 'Error'))
        } else {
          // 如果是成功状态，返回result数据
          return { 
            code: 20000,  // 转换为前端期望的格式
            data: res.result 
          }
        }
      }
    } else {
      // 原来的处理逻辑
      if (res.code !== 20000) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        return res
      }
    }
  },
  error => {
    debugger
    console.log('err' + error) // for debug
    // 处理后端返回的错误信息
    let errorMessage = error.message
    if (error.response && error.response.data) {
      const res = error.response.data
      if (res.status && res.status.msg) {
        errorMessage = res.status.msg
      } else if (res.message) {
        errorMessage = res.message
      }
    }
    // 跳转到登录页面
    router.push('/login')
    Message({
      message: errorMessage,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
