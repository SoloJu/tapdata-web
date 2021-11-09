'use strict'

import Vue from 'vue'
import axios from 'axios'
import { Message } from 'element-ui'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL ||  '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: ''
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
  headers: {
    'x-requested-with': 'XMLHttpRequest'
  }
}
const _axios = axios.create(config)
const pending = []
const CancelToken = axios.CancelToken

const getPendingKey = config => {
  let { url, method, params } = config
  let headers = {}
  for (const key in config.headers) {
    let value = config.headers[key]
    if (Object.prototype.toString.call(value) === '[object String]' && !['Content-Type', 'Accept'].includes(key)) {
      headers[key] = value
    }
  }
  let key = JSON.stringify({
    url,
    method,
    params,
    headers
  })
  return key
}
const removePending = config => {
  let key = getPendingKey(config)
  let index = pending.findIndex(it => it === key)
  pending.splice(index, 1)
}
const errorCallback = error => {
  let status = error?.response?.status
  // 从请求池清除掉错误请求
  if (error?.response?.config || error?.config) {
    removePending(error.config || error.response.config)
  }
  if (status === 401) {
    // 未登录
    location.replace(location.href.split('#/')[0] + '#/login')
  } else if ((status + '').startsWith('5')) {
    // 500 报错
    location.replace(location.href.split('#/')[0] + '#/500')
  } else if (status && !(status + '').startsWith('2')) {
    // 其他错误
    Message.error(`请求失败(${status})： ${error.message || error}`)
  }
  return Promise.reject(error)
}
// 请求发起拦截器
_axios.interceptors.request.use(function (config) {
  // 本地开发使用header中加__token的方式绕过网关登录
  const ACCESS_TOKEN = process.env.VUE_APP_ACCESS_TOKEN || ''
  if (ACCESS_TOKEN) {
    let params = { __token: ACCESS_TOKEN }
    config.params = Object.assign({}, config.params, params)
  }

  // headers里面注入用户token，并开启鉴权
  let user = window.__USER_INFO__
  if (user) {
    config.headers['X-Token'] = user.token
  }
  config.withCredentials = true

  // 获取取消请求的函数
  let cancelFunc = null
  config.cancelToken = new CancelToken(c => {
    cancelFunc = c
  })
  let key = getPendingKey(config)
  // 判断请求池是否有相同请求，有则取消当前请求（后一条）,没有则将请求注入请求池
  if (pending.includes(key)) {
    console.log('Cancel request:', config) //eslint-disable-line
    cancelFunc('cancel')
  } else {
    pending.push(key)
  }
  return config
}, errorCallback)

// 请求返回拦截器
_axios.interceptors.response.use(function (response) {
  return new Promise((resolve, reject) => {
    // 从请求池清除掉错误请求
    removePending(response.config)

    let data = response?.data
    let code = data?.code
    if (code === 'ok') {
      // code 为 ok 则表示请求正常返回，进入then逻辑
      return resolve(data?.data)
    } else if (code === 'SystemError') {
      // code 为 SystemError 则表示请求异常，提示信息
      let msg = data?.message || data?.msg
      Message.error(`SystemError： ${msg}`)
      return reject(msg)
    }
    // 其他情况交由业务端自行处理
    reject(Object.assign(response, { isException: true }))
  })
}, errorCallback)

const Plugin = {}
Plugin.install = function (Vue) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios
      }
    },
    $axios: {
      get() {
        return _axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
