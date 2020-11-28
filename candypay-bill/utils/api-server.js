/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2018-08-13 17:48:10 
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-05-08 13:39:53
 */

import models from '../api/index'
import SignService from '../service/SigninService'
import tokenUtil from './storage-util'
import Config from '../config'
const ApiSever = {}
const baseUrl = Config.host

const handleApiFail = (e, options) => {
    options.fail && options.fail()
    let errMsg = e.errMsg || ''
    if ((errMsg.indexOf("timeout") != -1) || (errMsg.indexOf("请求超时") != -1)) {
        wx.showModal({
            title: '请求超时',
            content: '当前网络不可用，请检查您的网络设置',
            showCancel: false,
        })
    } else {
        wx.showModal({
            title: '提示',
            content: e.errMsg,
            showCancel: false,
        })
    }
}
const handleErrorMessage = (res, callback, newCall) => {
    console.log('server rsp code= %s errMsg= %s: ', res.statusCode, JSON.stringify(res.data))
    if (res.statusCode == 401) {
        tokenUtil.clearTokenCache()
        SignService.checkSignStatus(newCall)
        return
    }
    if (callback) {
        callback(res)
        return
    }
    if (res.data.payload) {
        wx.showModal({
            title: '提示',
            content: res.data.payload,
            showCancel: false,
        })
    } else {
        wx.showModal({
            title: '提示',
            content: '网络请求失败',
            showCancel: false,
        })
    }
}

Object.keys(models).map(m => {
    ApiSever[m] = function (fnOpt, callback) {
        let opts = models[m]
        let options = Object.assign({}, {
            // timeout: 500, //这里设置没用，要在小程序的json配置文件里面设置
            params: {},//部分Post接口会用到这个参数例如：card/vendor/status
            data: {},
            hideLoading: false,
            success() { },
            fail() { },
            complete() {
            }
        }, opts, fnOpt)
        if (!typeof (fnOpt.data) == 'string') {
            options.data = Object.assign({}, options.data, fnOpt.data)
        }
        if (!options.hideLoading) {
            wx.showLoading({
                title: '加载中',
                mask: true
            })
        }
        if (JSON.stringify(options.params) != "{}") {
            let urlParamStr = ''
            Object.keys(options.params).forEach(m => {
                urlParamStr += m + '=' + options.params[m] + '&'
            })
            options.url = options.url + "?" + urlParamStr.substr(0, urlParamStr.length - 1)
        }
        let newCall = {
            url: options.url,
            block: options.block,
            signInCallback(checkResult) {
                if (checkResult == SignService.CHECK_OK) {
                    // console.log('url = ' + baseUrl + options.url)
                    let token = tokenUtil.getToken()
                    // token = 'eyJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6ImFjY2VzcyIsInVzZXJJZCI6MjMwNn0.E-EwpoTus8JvpWC3sSZmKb5jOF0gVUtx333vYzwfCzc'
                    let url = options.curl ? options.curl : baseUrl + options.url
                    return wx.request({
                        url,
                        header: {
                            'Authorization': "bearer " + token
                        },
                        data: options.data,
                        method: options.method,
                        success: function (res) {
                            if (res.statusCode !== 200) {
                                handleErrorMessage(res, callback, newCall)
                            } else {
                                options.success(res.data)
                            }
                        },
                        fail: function (e) {
                            handleApiFail(e, options)
                        },
                        complete: function () {
                            wx.hideLoading()
                            options.complete()
                        }
                    })
                } else if (checkResult == SignService.CHECKE_REJECTED) {
                    console.log('被设定为single模式的请求，因为请求队列中已有相同请求，该次请求拒绝')
                }
            }
        }
        SignService.checkSignStatus(newCall)
    }
})
export default ApiSever