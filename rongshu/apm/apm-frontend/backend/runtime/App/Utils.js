let AppConfig = require('./AppConfig')
let _ = require('lodash')

class RuntimeCode {
  constructor(code, success, tag, msg) {
    this.code = code
    this.success = success
    this.tag = tag
    this.msg = msg
  }
  toString() {
    return `{code}:{tag} {msg}`
  }
}
class ServiceCode {
  constructor(code, success, tag, msg) {
    this.code = code
    this.success = success
    this.tag = tag
    this.msg = msg
  }
  toString() {
    return `{code}:{tag} {msg}`
  }
}

let initRuntimeCodes = () => {
  let codes = {}
  AppConfig.message.runtime.forEach((item, index) => {
    codes[item[2] + ''] = new RuntimeCode(item[0], item[1], item[2], item[3])
  })
  return codes
}

let initServiceCodes = () => {
  let codes = {}
  AppConfig.message.service.forEach((item, index) => {
    codes[item[0] + ''] = new ServiceCode(item[0], item[1], item[2], item[3])
  })
  return codes
}

let initCaasCodes = () => {
  let codes = {}
  AppConfig.message.caas.forEach((item, index) => {
    codes[item[0] + ''] = new ServiceCode(item[0], item[1], item[2], item[3])
  })
  return codes
}

let formatObjectDecimal = (function() {
  function isFloat(n) {
    return ~~n !== n
  }

  function formaObjectProperty(obj, prop, value) {
    value = value || obj[prop]
    let propType = Object.prototype.toString.call(value)
    switch (propType) {
      case '[object Number]':
        formatNumber(obj, prop, value)
        break
      case '[object Array]':
        formatArray(obj, prop, value)
        break
      case '[object Object]':
        formatObject(obj[prop])
        break
        /* case '[object String]':
        case '[object Null]':
        case '[object Undefined]': */
      default:
        break
    }
  }

  function formatNumber(obj, prop, value) {
    value = value || obj[prop]
    if (isFloat(value)) {
      obj[prop] = Math.round(value * 100) / 100
    }
  }

  // function formatArray(obj, prop, value) {
  //   value = value || obj[prop]
  //   let index = obj[prop].length
  //   let propType = null
  //   let item = null
  //   while (index-- >= 0) {
  //     item = obj[prop][index]
  //     propType = Object.prototype.toString.call(item)
  //     switch (propType) {
  //       case '[object Number]':
  //         formatNumber(obj[prop], index, item)
  //         break
  //       case '[object Array]':
  //         formatArray(obj[prop], index, item)
  //         break
  //       case '[object Object]':
  //         formatObject(obj[prop][index])
  //         break
  //       default:
  //         break
  //     }
  //   }
  // }
  function formatArray(obj, prop, value) {
    value = value || obj[prop]
    obj[prop].forEach((item, index) => {
      let propType = Object.prototype.toString.call(item)
      switch (propType) {
        case '[object Number]':
          formatNumber(obj[prop], index, item)
          break
        case '[object Array]':
          formatArray(obj[prop], index, item)
          break
        case '[object Object]':
          formatObject(obj[prop][index])
          break
        default:
          break
      }
    })
  }

  function formatObject(obj) {
    let startTime = new Date() * 1
    let key = null
    for (key in obj) {
      formaObjectProperty(obj, key)
    }
    // Object.keys(obj).forEach(item => {
    //   formaObjectProperty(obj, item)
    // })

    let endTime = new Date() * 1
    console.warn('开始时间:' + startTime)
    console.warn('结束时间:' + endTime)
    console.warn('执行时间:' + (endTime - startTime))
  }
  return formatObject
})()

let Utils = {
  formatObjectDecimal,
  _: _,
  RuntimeCodes: initRuntimeCodes(),
  ServiceCodes: initServiceCodes(),
  CaasCodes: initCaasCodes(),
  /**
   * @param success 是否成功
   * @param msg 回调返回的消息
   * @param dataObject 回调最终返回的默认数据
   */
  GetCallBackObject: (success, msg, dataObject) => {
    return {
      success: success || false,
      msg: msg || '',
      dataObject: dataObject || null
    }
  },
  /**
   * @param {IncomingResponse} reponse 请求体输出对象
   * @return {Object} 格式化为JSON对象
   */
  HttpClientResponseDataFormatter: (response) => {
    var dataObject = {}
    dataObject = Object.prototype.toString.call(response.body) === '[object Object]' ? response.body : (JSON.parse(response.body) || {})
    var code = Utils.ServiceCodes[dataObject.code + '']
    dataObject.success = code ? code.success : (dataObject.message === 'success' ? true : (dataObject.status === 'success'))
    dataObject.msg = code ? code.msg : (dataObject.msg || dataObject.message || '')
    // dataObject.dataObject = dataObject.dataObject || dataObject.data
    // delete dataObject.data
    // 对请求的数据进行浮点小数点截断，保留两位小数

    formatObjectDecimal(dataObject)
    return dataObject
  },
  /**
   * @param {IncomingResponse} reponse 请求体输出对象的Body
   * @return {Object} 格式化为JSON对象
   */
  HttpClientResponseBodyDataFormatter: (body) => {
    var dataObject = {}
    dataObject = Object.prototype.toString.call(body) === '[object Object]' ? body : (JSON.parse(body) || {})
    var code = Utils.ServiceCodes[dataObject.code + '']
    dataObject.success = code ? code.success : false
    dataObject.msg = code ? code.msg : (dataObject.msg || '')
    // dataObject.dataObject = dataObject.dataObject || dataObject.data
    // delete dataObject.data
    formatObjectDecimal(dataObject)
    dataObject.code = code ? dataObject.code : -1
    return dataObject
  },
  HttpClientResponseErrorFormatter(error) {
    // 开发环境抛出完整信息
    if (process.env.NODE_ENV === 'development') return error
    // var dataObject = Object.prototype.toString.call(error) === '[object Object]' ? error : (JSON.parse(error) || {})
    let code = _.isObject(error) && error.error && error.error.code ? error.error.code : _.isObject(error) && error.code ? error.code : ''
    let formatCode = Utils.ServiceCodes[code + '']
    return {
      code: code || -1,
      success: formatCode ? formatCode.success : false,
      msg: formatCode ? formatCode.msg : error && error.error && error.error.message ? error.error.message : error && error.message ? error.message : '服务异常，请联系管理员.'
    }
  }
}

module.exports = Utils
