/**
 * Created by liuxiaofan on 2017/9/26.
 */
import axios from 'axios'
// import deepAssign from 'deep-assign'
// import Qs from 'qs'
import Models from '../models'
const ver = '1.0.0'
const ApiSever = {}
const def = {
  url: '/api/',
  method: 'post',
  baseURL: '/api/',
  transformRequest: [function (data) {
    return data
  }],
  transformResponse: [function (data) {
    return data
  }],
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  },
  params: {ver},
  data: {ver},
  timeout: 5000,
  responseType: 'json'
}

let checkStatus = (response, apiName) => {
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response.data
  } else {
    return {
      status: apiName + '请求失败，错误码：' + ((response && response.status) ? response.status : 0),
      msg: '请求失败'
    }
  }
}

let checkCode = (response, apiName) => {
  if (response && !response.success) {
    console.error('api request fail:', response.status || response.msg)
  }
  return response
}
Object.keys(Models).map(m => {
  ApiSever[m] = function (opts = {}) {
    let options = Object.assign({}, def, Models[m], opts)
    // options.data = Qs.stringify(opts.data)
    options.data = JSON.stringify(opts.data)
    axios.interceptors.request.use(config => {
      options.beforeRequest && options.beforeRequest(config)
      return config
    }, error => {
      return Promise.reject(error)
    })
    axios.interceptors.response.use(response => {
      return response
    }, error => {
      return Promise.resolve(error.response)
    })
    return axios(options)
      .then(
        (response) => {
          return checkStatus(response, m)
        }
      ).then(
        (res) => {
          return checkCode(res, m)
        }
      )
  }
})

export default ApiSever
