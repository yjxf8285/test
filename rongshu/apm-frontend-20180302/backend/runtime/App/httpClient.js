var request = require('request-promise')
var Utils = require('./Utils')
var AppConfig = require('./AppConfig')
var log = require('./log').helper

/**
 * Http远程请求
 * @param {JSON} opts {req:请求输入对象,res:输出对象,httpHost:调用host地址}
 */
function HttpClient(opts) {
  /*   if (opts.res) {
      this.res = opts.res
    } else {
      throw new Error(Utils.RuntimeCodes.InvalidParameter.toString() + ' res参数不可为空.')
    }
    if (opts.req) {
      this.req = opts.req
    } else {
      throw new Error(Utils.RuntimeCodes.InvalidParameter.toString() + ' req参数不可为空.')
    } */
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
  /**
   * 单次执行
   * @param  {}   options  [description]
   */
  send: function(callback) {
    let that = this
    let options = that.options
    if (options.beforeSend) {
      options.beforeSend.call(that, options)
    }
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

    log.info('begin http request from "' + url + '"')

    var onResponse = function(error, response, body) {
      var dataObject
      log.info('//===============[HttpClient] 服务请求返回结果 Begin==============//')
      log.info(error)
      log.info(JSON.stringify(response))
      log.info('//===============[HttpClient] 服务请求返回结果 End===============//')
      if (!error && response && response.statusCode === 200) {
        dataObject = Utils.HttpClientResponseDataFormatter(response)

        log.info('remote call success, url:' + url + ', request body :" ' + JSON.stringify(response.body, null, 2) + ' "')

        if (dataObject.success) {
          if (options.onSuccess) {
            options.onSuccess.call(that, dataObject)
          }
        } else {
          if (options.onFiald) {
            options.onFiald.call(that, dataObject)
          }
        }

        that.dataObject = dataObject
      } else {
        error = typeof error === 'object' ? JSON.stringify(error) : error

        dataObject = {}
        dataObject.success = false
        dataObject.msg = error || Utils.RuntimeCodes.FaildHttpRequest.toString()
        dataObject.statusCode = response && response.statusCode || ''

        dataObject.url = url
        dataObject.responseBody = response && response.body ? JSON.stringify(response.body) : ''
        log.error(dataObject)

        if (options.onFiald) {
          options.onFiald.call(that, dataObject)
        }
        that.dataObject = dataObject
      }

      if (callback) {
        callback.call(that, that.dataObject)
      }
    }

    log.info('method:' + options.method)
    log.info('url:' + url)
    log.info('queryParams:' + JSON.stringify(options.queryParams || {}, null, 2))
    log.info('formData:' + JSON.stringify(options.formData || {}, null, 2))

    if (options.method === 'get') {
      request.get(url, onResponse)
    } else {
      var opts = {
        json: true,
        body: options.formData || {}
      }
      if (options.headers) {
        opts.headers = options.headers
      }
      request.post(url, opts, onResponse)
    }
  },
  sendPromise: function() {
    let that = this
    let options = that.options
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

    log.info('begin http request from "' + url + '"')
    log.info('method:' + options.method)
    log.info('url:' + url)
    log.info('queryParams:' + JSON.stringify(options.queryParams || {}, null, 2))
    log.info('formData:' + JSON.stringify(options.formData || {}, null, 2))

    if (options.method === 'get') {
      return request.get(url)
        .then(function(body) {
          log.info('//===============[HttpClient] 服务请求返回结果 Begin==============//')
          log.info(body)
          log.info('//===============[HttpClient] 服务请求返回结果 End===============//')
          return Utils.HttpClientResponseBodyDataFormatter(body)
        })
        .catch(function(err) {
          log.error('//===============[HttpClient] 服务请求捕获到异常 Begin==============//')
          log.error(err)
          log.error('//===============[HttpClient] 服务请求捕获到异常 End==============//')
          return Utils.HttpClientResponseErrorFormatter(err)
          // if(progress.env.NODE_ENV !=='development') {
          //   return Utils.HttpClientResponseErrorFormatter(err)
          // }
          // return err
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
          log.info('//===============[HttpClient] 服务请求返回结果 Begin==============//')
          log.info(body)
          log.info('//===============[HttpClient] 服务请求返回结果 End===============//')
          return Utils.HttpClientResponseBodyDataFormatter(body)
        })
        .catch(function(err) {
          log.error('//===============[HttpClient] 服务请求捕获到异常 Begin==============//')
          log.error(err)
          log.error('//===============[HttpClient] 服务请求捕获到异常 End==============//')
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
