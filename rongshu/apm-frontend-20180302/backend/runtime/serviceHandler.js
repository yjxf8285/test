var express = require('express')
let Validator = require('../runtime/App/validator')
let async = require('async')
let Mock = require('mockjs')
let URL = require('url')
let log = require('../runtime/App/log').helper
let HttpClient = require('../runtime/App/httpClient')
let _ = require('../runtime/App/Utils')._

let serviceTransfers = {

}

let generator = {
  router: express.Router()
}

class ServiceDirector {
  constructor(router, service) {
    this.router = router
    this.options = service
    this.defaultMethod = 'get'
  }

  execute() {
    let that = this
    let options = that.options
    let callback = options.callback
    that.method = options.method || that.defaultMethod
    that.router[that.method](options.url, function(req, res, next) {
      let valid = that.beforeExecute(req, res)
      log.info('begin exec service')
      if (!valid) return
      /**
       * mock验证规则
       * 1.如果当前出于生产环境，则不进行Mock，否则：
       * 2.url中包含mock query 则进行Mock
       * 3.配置中如果Mock.on=true 则进行Mock
       */
      // if (process.env.ENV !== 'production') {
      if (typeof (req.query.mock) !== 'undefined' || (options.mock && options.mock.on)) {
        that.onMocking(req, res, options.mock.dataRegular)
        return that
      }
      // }

      callback.call(that, req, res, function(actionResult) {
        that.actionResult = actionResult
        that.afterExecute(req, res)
        res.json(actionResult)
        res.end()
      })
    })
    return that
  }
  /**
   * 执行前对请求体数据进行校验
   */
  beforeExecute(request, response) {
    response.setHeader('Content-Type', 'application/json;charset=utf-8')
    log.info('validate service params ....')
    let validResult = {
      valid: true,
      message: ''
    }

    if (this.options.validate) {
      let method = String.prototype.toLowerCase.call(this.options.method) || 'get'
      let dataObj = method === 'get' ? request.query : request.body
      this.options.validate.forEach((validater, index) => {
        if (validResult.valid) {
          validResult = new Validator(dataObj[validater.field], validater.options).validate().result
        }
      })
    }
    if (!validResult.valid) {
      response.json({
        success: true,
        code: 'E9011',
        msg: validResult.message
      })
      response.end()
    }
    return validResult.valid
  }
  /**
   * 执行完之后，对服务的处理
   *
   * @param {any} request
   * @param {any} response
   * @memberof ServiceDirector
   */
  afterExecute(request, response) {
    log.info('after execute service ....')
    let that = this
    let baseUrl = URL.parse(request.url).pathname
    let regExp = new RegExp('^\/api(.+)')
    let results = regExp.exec(baseUrl)

    if (results === null || (results && typeof (results[1]) !== 'string' && results[1].length)) {
      baseUrl = ''
    } else {
      baseUrl = decodeURIComponent(results[1]).replace(/\+/g, ' ')
    }

    let transfer = serviceTransfers[baseUrl]
    if (transfer) {
      log.info('service is transferring....')
      transfer(request, response, that.actionResult)
    }
  }
  /**
   * Mock数据
   * @param {IncomingRequest} request
   * @param {IncomingResponse} response
   * @param {Object|Function} dataRegular Mock数据的规则，可以是函数，也可以是数据规则JSON，如果是函数需要最终返回数据规则JSON
   */
  onMocking(request, response, dataRegular) {
    log.warn('正在Mock service："' + request.path + '" 数据...')
    let data
    if (_.isFunction(dataRegular)) {
      data = dataRegular.call(this, request)
    } else {
      data = Mock.mock(dataRegular)
    }
    response.json({
      success: true,
      code: 0,
      data: data
    })
    response.end()
  }
  packaging(req, res, callbacks) {
    if (_.isObject(callbacks)) {
      // ['key',function(error,result){}]
      // ['key',{url:'/api/test',method,'post',callback:function(error,result){}}]
      let packagedCallbacks = {}
      for (var key in callbacks) {
        console.log(key)
        var callback = callbacks[key]
        if (_.isFunction(callback)) {
          packagedCallbacks[key] = callback
        } else if (_.isObject(callback)) {
          packagedCallbacks[key] = (error, cb) => {
            if (!error) {
              packageHttpClient(callback)
              return
            }
            cb({
              success: true
            })
          }
        } else if (_.isArray(callback)) {
          let lastCallback = callback[callback.length - 1]
          if (_.isObject(lastCallback)) {
            packagedCallbacks[key] = callback.slice(0, callback.length - 1).concat([packageHttpClient(lastCallback)])
          }
        }
      }
      async.auto(packagedCallbacks, (err, result) => {
        if (err) {
          log.error(err)
        } else {
          console.log(result)
        }
      })
    }

    function packageHttpClient(options) {
      return (error, cb) => {
        if (!error) {
          new HttpClient(Object.assign({
            req: req,
            res: res
          }, options))[options.method]((responseData) => {
            cb(responseData)
          })
          return
        }
        cb({
          success: false
        })
      }
    }
  }
}

let service = (ServiceObject) => {
  let apiService = null
  let apiServiceUrl = '/api/*'
  for (let url in ServiceObject) {
    if (url === apiServiceUrl) {
      apiService = ServiceObject[url]
      apiService.url = apiServiceUrl
      continue
    }
    let service = ServiceObject[url]
    if (_.isFunction(service)) {
      serviceTransfers[url] = service
      continue
    }
    service.url = url
    new ServiceDirector(generator.router, service).execute()
  }

  if (apiService) {
    new ServiceDirector(generator.router, apiService).execute()
  }

  return generator
}
module.exports = service
