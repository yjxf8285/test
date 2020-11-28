/*
 * 张轶飞提供的ajax封装对象，仅供参考！不在项目中使用 
 * @Author: Liuxiaofan 
 * @Date: 2018-08-29 16:58:29 
 * @Last Modified by: Liuxiaofan
 * @Last Modified time: 2018-08-29 16:59:27
 */


var util = require('util')

var http = {
  baseURL: "http://192.168.5.17:8082/",
  // baseURL: "http://127.0.0.1:8080/",
  invoke: function (api, header, callback, invoker) {
    if (this.token) header.Authorization = "bearer " + this.token;
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    var that = this;
    return invoker({
      url: this.baseURL + api,
      header: header,
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.token) this.token = res.data.token;
          if (callback && util.isFunction(callback)) callback(res.data);
          else if (callback && callback.success) callback.success(res.data);
          return;
        }
        if (res.statusCode == 403) {
          if (!that.justNav) {
            that.justNav = true;
            setTimeout(() => { that.justNav = false }, 1000);
            wx.navigateTo({ url: '/pages/login/login' });
          }
        }
        console.log(res.data);
        if (callback && callback.fail) callback.fail(res);
      },
      fail: function () {
        wx.showToast({
          icon: "loading",
          title: "请检查网络..."
        })
        if (callback && callback.error) callback.error();
      },
      complete: function () {
        wx.hideLoading();
        if (callback && callback.complete) callback.complete();
      }
    })
  },
  request: function (api, method, header, params, callback) {
    this.invoke(api, header, callback, p => {
      p.method = method;
      p.data = params;
      wx.request(p);
    });
  },
  upload: function (api, file, name, params, callback) {
    this.invoke(api, this.POST_HEADER, callback, p => {
      p.name = name;
      p.filePath = file;
      p.formData = params;
      wx.uploadFile(p);
    });
  },
  proRequest: function (api, method, header, params) {
    return this.invoke(api, header, null, p => {
      p.method = method;
      p.data = params;
      return util.promisify(wx.request)(p);
    });
  },
  proUpload: function (api, file, name, params) {
    return this.invoke(api, this.POST_HEADER, null, p => {
      p.name = name;
      p.filePath = file;
      p.formData = params;
      return util.promisify(wx.uploadFile)(p);
    });
  },
  GET_HEADER: {
    "Accept": "application/json"
  },
  POST_HEADER: {
    "Accept": "application/json",
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
  },
  PUT_HEADER: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  get: function (api, params, callback) {
    this.request(api, "GET", this.GET_HEADER, JSON.stringify(params), callback)
  },
  post: function (api, params, callback) {
    this.request(api, "POST", this.PUT_HEADER, JSON.stringify(params), callback)
  },
  postForm: function (api, params, callback) {
    this.request(api, "POST", this.POST_HEADER, params, callback)
  },
  put: function (api, params, callback) {
    this.request(api, "PUT", this.PUT_HEADER, JSON.stringify(params), callback)
  },
  del: function (api, params, callback) {
    this.request(api, "DELETE", this.PUT_HEADER, JSON.stringify(params), callback)
  },
  proGet: function (api, params) {
    return this.proRequest(api, "GET", this.GET_HEADER, JSON.stringify(params))
  },
  proPost: function (api, params) {
    return this.proRequest(api, "POST", this.PUT_HEADER, JSON.stringify(params))
  },
  proPostForm: function (api, params) {
    return this.proRequest(api, "POST", this.POST_HEADER, params)
  },
  proPut: function (api, params) {
    return this.proRequest(api, "PUT", this.PUT_HEADER, JSON.stringify(params))
  },
  proDel: function (api, params) {
    return this.proRequest(api, "DELETE", this.PUT_HEADER, JSON.stringify(params))
  }
}

module.exports = http