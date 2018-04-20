var request = require('request-promise').defaults({forever: true, pool: {maxSockets: 5000}})
var Utils = require('./Utils')
var AppConfig = require('./AppConfig')
var log = require('./log').helper

/**
 * Http远程请求
 * @param {JSON} opts {req:请求输入对象,res:输出对象,httpHost:调用host地址}
 */
function HttpClient(opts) {
  if (opts.urlPath) {
    this.urlPath = opts.urlPath
    if (!(Object.prototype.toString.call(this.urlPath) === '[object String]' && this.urlPath.length > 0)) {
      throw new Error(Utils.RuntimeCodes.InvalidParameter.toString() + ' urlPath必须为字符串，且不可为空.')
    }
  } else {
    throw new Error(Utils.RuntimeCodes.InvalidParameter.toString() + ' urlPath参数不可为空.')
  }
  this.httpHost = opts.httpHost || AppConfig.app.remoteHost
  this.options = Utils._.extend(true, {
    httpHost: this.httpHost
  }, opts)
}

HttpClient.prototype = {
  responseJsonData: null,
  responseText: '',
/**
 * 设置请求输出对象
 * @param {object} res 输出对象
 */
  setResponse: function(res) {
    this.response = res
  },
/**
 * 设置请求输入对象
 * @param {object} req 输入对象
 */
  setRequest: function(req) {
    this.request = req
  },
/**
 * 设置请求要发送的主机地址
 * @param {string} host 主机地址
 */
  setHttpHost: function(host) {
    this.httpHost = host
  },
  sendPromise: function() {
    let that = this
    let options = that.options
    let startTime = new Date() * 1
    let endTime = new Date() * 1
    if (!options.urlPath) {
      throw new Error(Utils.RuntimeCodes.RequiredHttphost.toString())
    }

    var arr = []

    if (options.queryParams) {
      for (var param in options.queryParams) {
        if (options.queryParams.hasOwnProperty(param)) {
          arr.push(param + '=' + options.queryParams[param])
        }
      }
      if (!options.queryParams.rdm) {
        arr.push('rdm=' + new Date() * 1)
      }
    }

    var url = that.httpHost + options.urlPath + (arr.length > 0 ? ('?' + arr.join('&')) : '')
    if (options.method === 'get') {
      return request.get(url)
          .then((body) => {
            endTime = new Date() * 1
            if (process.env.ENV_NODE === 'development' || process.env.debug_log === 'true') {
              log.info(`\r\n
  //======请求日志 Start=======//\r
  URL:${url}\r
  Method:${options.method}\r
  Form Data:${JSON.stringify(options.formData || {}, null, 2)}\r
  Response Body:${body}\r
  Start Time:${startTime}\r
  End Time:${endTime}\r
  Full Excute Time：${endTime - startTime}\r
  //======请求日志 End========//`)
            }
            return Utils.HttpClientResponseBodyDataFormatter(body)
          })
            .catch(function(err) {
              if (process.env.ENV_NODE === 'development') {
                log.error('//===============[HttpClient] 服务请求捕获到异常 Begin==============//')
                log.error(err)
                log.error('//===============[HttpClient] 服务请求捕获到异常 End==============//')
              }
              return Utils.HttpClientResponseErrorFormatter(err)
            })
    } else {
      var opts = {
        json: true,
        body: options.formData || {}
      }
      if (options.headers) {
        opts.headers = options.headers
      }
      return request.post(url, opts)
            .then(function(body) {
              endTime = new Date() * 1
              if (process.env.ENV_NODE === 'development' || process.env.debug_log === 'true') {
                log.info(`\r\n
//======请求日志 Start=======//\r
URL:${url}\r
Method:${options.method}\r
Form Data:${JSON.stringify(options.formData || {}, null, 2)}\r
Response Body:${body}\r
Start Time:${startTime}\r
End Time:${endTime}\r
Full Excute Time：${endTime - startTime}\r
//======请求日志 End========//`)
              }
              return Utils.HttpClientResponseBodyDataFormatter(body)
            })
            .catch(function(err) {
              if (process.env.ENV_NODE === 'development') {
                log.error('//===============[HttpClient] 服务请求捕获到异常 Begin==============//')
                log.error(err)
                log.error('//===============[HttpClient] 服务请求捕获到异常 End==============//')
              }
              return Utils.HttpClientResponseErrorFormatter(err)
            })
    }
  },
      /**
       * Get请求
       * @param  {Function} callback [description]
       * @return {[type]}            [description]
       */
  get: function(callback) {
    this.options.method = 'get'
    if (callback) {
      this.send(callback)
    } else {
      return this.sendPromise()
    }
  },
        /**
         * Post请求
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
  post: function(callback) {
    this.options.method = 'post'
    if (callback) {
      this.send(callback)
    } else {
      return this.sendPromise()
    }
  }
}

module.exports = HttpClient
