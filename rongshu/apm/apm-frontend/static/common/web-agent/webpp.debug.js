(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var config = require("./config")
var JSON = require("./json")
var detector = require("./ua")

var ArrayProto = Array.prototype
var ObjProto = Object.prototype
var slice = ArrayProto.slice
var toString = ObjProto.toString
var hasOwnProperty = ObjProto.hasOwnProperty
var navigator = window.navigator
var document = window.document
var userAgent = navigator.userAgent
var LIB_VERSION = config.LIB_VERSION
var nativeForEach = ArrayProto.forEach
var nativeIndexOf = ArrayProto.indexOf
var nativeIsArray = Array.isArray
var emptyObj = {}
var _ = {}
var each = _.each = function (obj, iterator, context) {
  if (obj == null) {
    return false
  }
  if (nativeForEach && obj.forEach === nativeForEach) {
    obj.forEach(iterator, context)
  } else if (obj.length === +obj.length) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (i in obj && iterator.call(context, obj[i], i, obj) === emptyObj) {
        return false
      }
    }
  } else {
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        if (iterator.call(context, obj[key], key, obj) === emptyObj) {
          return false
        }
      }
    }
  }
}

_.extend = function (obj) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0) {
        obj[prop] = source[prop]
      }
    }
  })
  return obj
}

// 如果已经有的属性不覆盖,如果没有的属性加进来
_.coverExtend = function (obj) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0 && obj[prop] === void 0) {
        obj[prop] = source[prop]
      }
    }
  })
  return obj
}

_.isArray = nativeIsArray || function (obj) {
  return toString.call(obj) === "[object Array]"
}

_.isFunction = function (f) {
  try {
    return /^\s*\bfunction\b/.test(f)
  } catch (x) {
    return false
  }
}

_.isArguments = function (obj) {
  return !!(obj && hasOwnProperty.call(obj, "callee"))
}

_.toArray = function (iterable) {
  if (!iterable) {
    return []
  }
  if (iterable.toArray) {
    return iterable.toArray()
  }
  if (_.isArray(iterable)) {
    return slice.call(iterable)
  }
  if (_.isArguments(iterable)) {
    return slice.call(iterable)
  }
  return _.values(iterable)
}

_.values = function (obj) {
  var results = []
  if (obj == null) {
    return results
  }
  each(obj, function (value) {
    results[results.length] = value
  })
  return results
}

_.include = function (obj, target) {
  var found = false
  if (obj == null) {
    return found
  }
  if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
    return obj.indexOf(target) !== -1
  }
  each(obj, function (value) {
    if (found || (found = (value === target))) {
      return emptyObj
    }
  })
  return found
}

_.includes = function (str, needle) {
  return str.indexOf(needle) !== -1
}

_.arrayFilter = function (array, predicate) {
  var index = -1
  var length = array ? array.length : 0
  var resIndex = 0
  var result = []

  while (++index < length) {
    var value = array[index]
    if (predicate(value, index, array)) {
      result[resIndex++] = value
    }
  }
  return result
}

_.inherit = function (Subclass, SuperClass) {
  Subclass.prototype = new SuperClass()
  Subclass.prototype.constructor = Subclass
  Subclass.superclass = SuperClass.prototype
  return Subclass
}

_.isObject = function (obj) {
  return toString.call(obj) === "[object Object]"
}

_.isEmptyObject = function (obj) {
  if (_.isObject(obj)) {
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        return false
      }
    }
    return true
  }
  return false
}

var rTrim = /^\s+|\s+$/
_.trim = "".trim ? function (s) {
  return s.trim()
} : function (s) {
  return s.replace(rTrim)
}

_.isUndefined = function (obj) {
  return obj === void 0
}

_.isString = function (obj) {
  return toString.call(obj) === "[object String]"
}

_.isDate = function (obj) {
  return toString.call(obj) === "[object Date]"
}

_.isBoolean = function (obj) {
  return toString.call(obj) === "[object Boolean]"
}

_.isNumber = function (obj) {
  /* eslint-disable no-useless-escape */
  return (toString.call(obj) === "[object Number]" && /[\d\.]+/.test(String(obj)))
}

_.encodeDates = function (obj) {
  _.each(obj, function (v, k) {
    if (_.isDate(v)) {
      obj[k] = _.formatDate(v)
    } else if (_.isObject(v)) {
      obj[k] = _.encodeDates(v)
    }
  })
  return obj
}

_.formatDate = function (date) {
  function pad (n) {
    return n < 10 ? "0" + n : n
  }
  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    "T",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes()),
    ":",
    pad(date.getSeconds()),
    ".",
    pad(date.getMilliseconds()),
    "+08:00"
  ].join("")
}

_.searchObjDate = function (o) {
  if (_.isObject(o)) {
    _.each(o, function (a, b) {
      if (_.isObject(a)) {
        _.searchObjDate(o[b])
      } else {
        if (_.isDate(a)) {
          o[b] = _.formatDate(a)
        }
      }
    })
  }
}

_.utf8Encode = function (string) {
  string = (string + "").replace(/\r\n/g, "\n").replace(/\r/g, "\n")

  var utftext = "",
    start, end
  var stringl = 0,
    n

  start = end = 0
  stringl = string.length

  for (n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n)
    var enc = null

    if (c1 < 128) {
      end++
    } else if ((c1 > 127) && (c1 < 2048)) {
      enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128)
    } else {
      enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128)
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.substring(start, end)
      }
      utftext += enc
      start = end = n + 1
    }
  }

  if (end > start) {
    utftext += string.substring(start, string.length)
  }

  return utftext
}

_.detector = detector

_.base64Encode = function (data) {
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    enc = "",
    tmpArr = []
  if (!data) {
    return data
  }
  data = _.utf8Encode(data)
  do {
    o1 = data.charCodeAt(i++)
    o2 = data.charCodeAt(i++)
    o3 = data.charCodeAt(i++)

    bits = o1 << 16 | o2 << 8 | o3

    h1 = bits >> 18 & 0x3f
    h2 = bits >> 12 & 0x3f
    h3 = bits >> 6 & 0x3f
    h4 = bits & 0x3f
    tmpArr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4)
  } while (i < data.length)

  enc = tmpArr.join("")

  switch (data.length % 3) {
  case 1:
    enc = enc.slice(0, -2) + "=="
    break
  case 2:
    enc = enc.slice(0, -1) + "="
    break
  }

  return enc
}

_.UUID = (function () {
  var T = function () {
    var d = 1 * new Date(),
      i = 0
    while (d === 1 * new Date()) {
      i++
    }
    return d.toString(16) + i.toString(16)
  }
  var R = function () {
    return Math.random().toString(16).replace(".", "")
  }
  var UA = function (n) {
    var ua = userAgent,
      i, ch, buffer = [],
      ret = 0

    function xor (result, byteArray) {
      var j, tmp = 0
      for (j = 0; j < byteArray.length; j++) {
        tmp |= (buffer[j] << j * 8)
      }
      return result ^ tmp
    }

    for (i = 0; i < ua.length; i++) {
      ch = ua.charCodeAt(i)
      buffer.unshift(ch & 0xFF)
      if (buffer.length >= 4) {
        ret = xor(ret, buffer)
        buffer = []
      }
    }

    if (buffer.length > 0) {
      ret = xor(ret, buffer)
    }

    return ret.toString(16)
  }

  return function () {
    var se = (screen.height * screen.width).toString(16)
    return (T() + "-" + R() + "-" + UA() + "-" + se + "-" + T())
  }
})()

_.getQueryParam = function (query, url, undecode, isHash) {
  var search, index
  if (!url || typeof url !== "string") {
    url = window.location[isHash ? "hash" : "search"]
  }
  index = url.indexOf(isHash ? "#" : "?")
  if (index < 0) {
    return null
  }
  search = "&" + url.slice(index + 1)

  return search && new RegExp("&" + query + "=([^&#]*)").test(search)
    ? undecode ? RegExp.$1 : unescape(RegExp.$1)
    : null
}

_.concatQueryParam = function (url, paramKey, paramValue) {
  var hash = ""
  if (url.indexOf("#") !== -1) {
    hash = url.split("#")[1]
    url = url.split("#")[0]
  }
  if (paramValue === undefined || paramValue === null) {
    paramValue = ""
  }
  var regexS = "[\\?&]" + paramKey + "=([^&#]*)",
    regex = new RegExp(regexS),
    results = regex.exec(url)
  if (results === null || (results && typeof (results[1]) !== "string" && results[1].length)) {
    if (url.indexOf("?") !== -1 || url.indexOf("=") !== -1) {
      url = url + "&" + paramKey + "=" + paramValue
    } else {
      url = url + "?" + paramKey + "=" + paramValue
    }
  } else {
    url = url.replace(results[0], results[0].replace(results[1], paramValue))
  }

  if (hash !== "") {
    url += "#" + hash
  }
  return url
}
_.parseUrl = function (url) {
  var link = document.createElement("a")
  var location = window.location
  var parsedUrl = {}
  link.href = url
  parsedUrl.port = link.port
  var hrefArray = link.href.split("://")
  if (!parsedUrl.port && hrefArray[1]) {
    parsedUrl.port = hrefArray[1].split("/")[0].split(":")[1]
  }
  if (!(parsedUrl.port && parsedUrl.port !== "0")) {
    parsedUrl.port = hrefArray[0] === "https" ? "443" : "80"
  }
  parsedUrl.hostname = link.hostname || location.hostname
  parsedUrl.pathname = link.pathname
  if (parsedUrl.pathname.charAt(0) !== "/") {
    parsedUrl.pathname = "/" + parsedUrl.pathname
  }

  parsedUrl.sameOrigin = !link.hostname || link.hostname === document.domain && link.port === location.port && link.protocol === location.protocol
  return parsedUrl
}

_.xhr = function (cors) {
  var xhr
  if (cors) {
    xhr = new XMLHttpRequest()
    xhr = "withCredentials" in xhr ? xhr : typeof XDomainRequest !== "undefined" ? new XDomainRequest() : xhr
  }
  if (XMLHttpRequest) xhr = new XMLHttpRequest()
  if (window.ActiveXObject) {
    try {
      /* eslint-disable no-undef */
      xhr = new ActiveXObject("Msxml2.XMLHTTP")
    } catch (ex) {
      try {
        /* eslint-disable no-undef */
        xhr = new ActiveXObject("Microsoft.XMLHTTP")
      } catch (ex) {}
    }
  }
  if (!("setRequestHeader" in xhr)) {
    xhr.setRequestHeader = function () {

    }
  }
  xhr.__apm_xhr__ = true
  return xhr
}
_.ajax = function (params) {
  function parseJson (params) {
    try {
      return JSON.parse(params)
    } catch (t) {
      return {}
    }
  }
  var xhr = _.xhr(params.cors)

  if (!params.type) {
    params.type = params.data ? "POST" : "GET"
  }

  params = _.extend({
    success: function () {},
    error: function (xhr, textStatus, errorThrown) {
      _.log(xhr.status)
      _.log(xhr.readyState)
      _.log(textStatus)
    },
    complete: function (xhr) {}
  }, params)

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      /* eslint-disable no-mixed-operators */
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
        params.success(parseJson(xhr.responseText))
      } else {
        params.error(xhr)
      }

      params.complete(xhr)
      xhr.onreadystatechange && (xhr.onreadystatechange = null)
      xhr.onload && (xhr.onload = null)
    }
  }
  xhr.open(params.type, params.url, params.async === void 0 ? !0 : params.async)
  /* xhr.withCredentials = true; */
  if (_.isObject(params.header)) {
    for (var i in params.header) {
      xhr.setRequestHeader(i, params.header[i])
    }
  }
  if (params.data) {
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
    params.contentType === "application/json" ? xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8") : xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
  }
  xhr.send(params.data || null)
}

_.info = {
  searchEngine: function (referrer) {
    if (referrer.search("https?://(.*)google.([^/?]*)") === 0) {
      return "google"
    } else if (referrer.search("https?://(.*)bing.com") === 0) {
      return "bing"
    } else if (referrer.search("https?://(.*)yahoo.com") === 0) {
      return "yahoo"
    } else if (referrer.search("https?://(.*)duckduckgo.com") === 0) {
      return "duckduckgo"
    } else if (referrer.search("https?://(.*)sogou.com") === 0) {
      return "sogou"
    } else if (referrer.search("https?://(.*)so.com") === 0) {
      return "360so"
    } else {
      return null
    }
  },
  browser: function (userAgent, v, opera) {
    var vendor = v || "" // vendor is undefined for at least IE9
    if (opera || _.includes(userAgent, " OPR/")) {
      if (_.includes(userAgent, "Mini")) {
        return "Opera Mini"
      }
      return "Opera"
    } else if (/(BlackBerry|PlayBook|BB10)/i.test(userAgent)) {
      return "BlackBerry"
    } else if (_.includes(userAgent, "IEMobile") || _.includes(userAgent, "WPDesktop")) {
      return "Internet Explorer Mobile"
    } else if (_.includes(userAgent, "Edge")) {
      return "Microsoft Edge"
    } else if (_.includes(userAgent, "FBIOS")) {
      return "Facebook Mobile"
    } else if (_.includes(userAgent, "Chrome")) {
      return "Chrome"
    } else if (_.includes(userAgent, "CriOS")) {
      return "Chrome iOS"
    } else if (_.includes(vendor, "Apple")) {
      if (_.includes(userAgent, "Mobile")) {
        return "Mobile Safari"
      }
      return "Safari"
    } else if (_.includes(userAgent, "Android")) {
      return "Android Mobile"
    } else if (_.includes(userAgent, "Konqueror")) {
      return "Konqueror"
    } else if (_.includes(userAgent, "Firefox")) {
      return "Firefox"
    } else if (_.includes(userAgent, "MSIE") || _.includes(userAgent, "Trident/")) {
      return "Internet Explorer"
    } else if (_.includes(userAgent, "Gecko")) {
      return "Mozilla"
    } else {
      return ""
    }
  },
  browserVersion: function (userAgent, vendor, opera) {
    var browser = _.info.browser(userAgent, vendor, opera)
    var versionRegexs = {
      "Internet Explorer Mobile": /rv:(\d+(\.\d+)?)/,
      "Microsoft Edge": /Edge\/(\d+(\.\d+)?)/,
      "Chrome": /Chrome\/(\d+(\.\d+)?)/,
      "Chrome iOS": /Chrome\/(\d+(\.\d+)?)/,
      "Safari": /Version\/(\d+(\.\d+)?)/,
      "Mobile Safari": /Version\/(\d+(\.\d+)?)/,
      "Opera": /(Opera|OPR)\/(\d+(\.\d+)?)/,
      "Firefox": /Firefox\/(\d+(\.\d+)?)/,
      "Konqueror": /Konqueror:(\d+(\.\d+)?)/,
      "BlackBerry": /BlackBerry (\d+(\.\d+)?)/,
      "Android Mobile": /android\s(\d+(\.\d+)?)/,
      "Internet Explorer": /(rv:|MSIE )(\d+(\.\d+)?)/,
      "Mozilla": /rv:(\d+(\.\d+)?)/
    }
    var regex = versionRegexs[browser]
    if (regex === undefined) {
      return null
    }
    var matches = userAgent.match(regex)
    if (!matches) {
      return null
    }
    return String(parseFloat(matches[matches.length - 2]))
  },
  os: function () {
    var a = userAgent
    if (/Windows/i.test(a)) {
      if (/Phone/.test(a)) {
        return "Windows Mobile"
      }
      return "Windows"
    } else if (/(iPhone|iPad|iPod)/.test(a)) {
      return "iOS"
    } else if (/Android/.test(a)) {
      return "Android"
    } else if (/(BlackBerry|PlayBook|BB10)/i.test(a)) {
      return "BlackBerry"
    } else if (/Mac/i.test(a)) {
      return "Mac OS X"
    } else if (/Linux/.test(a)) {
      return "Linux"
    } else {
      return ""
    }
  },
  device: function (userAgent) {
    if (/iPad/.test(userAgent)) {
      return "iPad"
    } else if (/iPod/i.test(userAgent)) {
      return "iPod"
    } else if (/iPhone/i.test(userAgent)) {
      return "iPhone"
    } else if (/(BlackBerry|PlayBook|BB10)/i.test(userAgent)) {
      return "BlackBerry"
    } else if (/Windows Phone/i.test(userAgent)) {
      return "Windows Phone"
    } else if (/Windows/i.test(userAgent)) {
      return "Windows"
    } else if (/Macintosh/i.test(userAgent)) {
      return "Macintosh"
    } else if (/Android/i.test(userAgent)) {
      return "Android"
    } else if (/Linux/i.test(userAgent)) {
      return "Linux"
    } else {
      return ""
    }
  },
  referringDomain: function (referrer) {
    var split = referrer.split("/")
    if (split.length >= 3) {
      return split[2]
    }
    return ""
  },
  getBrowser: function () {
    return {
      browser: detector.browser.name,
      browser_version: String(detector.browser.version)
    }
  },
  getWindow: function () {
    var winWidth, winHeight
    // 获取窗口宽度
    if (window.innerWidth) { winWidth = window.innerWidth } else if (document.body && document.body.clientWidth) { winWidth = document.body.clientWidth }
    // 获取窗口高度
    if (window.innerHeight) { winHeight = window.innerHeight } else if (document.body && document.body.clientHeight) { winHeight = document.body.clientHeight }
    // 通过深入 Document 内部对 body 进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
      winHeight = document.documentElement.clientHeight
      winWidth = document.documentElement.clientWidth
    }
    return {
      win_width: winWidth,
      win_height: winHeight
    }
  },
  properties: function () {
    var h1s = document.body && document.body.getElementsByTagName("h1"),
      pageH1 = ""

    if (h1s && h1s.length && h1s.length > 0) {
      pageH1 = h1s[0].innerText || h1s.textContent || ""
    }
    return _.extend({}, {
      os: detector.os.name,
      os_version: detector.os.fullVersion,
      device: detector.device.name,
      device_version: detector.device.fullVersion
    }, {
      browser_engine: detector.engine.name,
      screen_height: screen.height,
      screen_width: screen.width,
      page_title: document.title,
      page_h1: pageH1,
      page_referrer: document.referrer,
      page_url: location.href,
      page_url_path: location.pathname,
      lib: "js",
      lib_version: LIB_VERSION
    }, _.info.getBrowser())
  },
  // 保存临时的一些变量，只针对当前页面有效
  currentProps: {},
  register: function (obj) {
    _.extend(_.info.currentProps, obj)
  }
}

module.exports = _

},{"./config":2,"./json":9,"./ua":20}],2:[function(require,module,exports){
/**
 * @author jiangfeng
 * @summary SDK基础配置
 */
module.exports = {
  LIB_VERSION: "1.0.0", // SDK版本
  LIB_KEY: "RXAPM201708", // 与SDK安装时的Key对应
  maxLimit: 10, // 发送限制，多于当前设置条数，就会发送事件
  crossSubDomain: true, // 是否跨域
  loadTime: new Date(), // SDK加载时间
  apiHost: "http://172.16.12.187:8099",
  oAuth: false,
  agentId: "35"
}

},{}],3:[function(require,module,exports){
module.exports = {
  pageLoader_loaded: "pageLoader_loaded",
  pageLoader_domloading: "pageLoader_domloading",
  kepler_message_type: "Kepler-Message-Type",
  kepler_agent_token: "Kepler-Agent-Token",
  kepler_config_version: "Kepler-Config-Version",
  WEB_ERROR: "WEB_ERROR",
  WEB_LOAD_BATCH: "WEB_LOAD_BATCH",
  WEB_AJAX_BATCH: "WEB_AJAX_BATCH"
}

},{}],4:[function(require,module,exports){
var _ = require("./common")
var JSON = require("./json")

var HTML = document.documentElement, rLinkButton = /^(A|BUTTON)$/
var dom = {
  // 元素注册事件
  // elem {DOMElement}
  // eventType {String}
  // fn {Function}
  // return {undefined}
  addEvent: window.addEventListener
    ? function (elem, eventType, fn) {
      elem.addEventListener(eventType, fn, true)
    }
    : function (elem, eventType, fn) {
      elem.attachEvent("on" + eventType, fn)
    },

  innerText: "innerText" in HTML
    ? function (elem) {
      return elem.innerText
    }
    : function (elem) {
      return elem.textContent
    },

  // 从一个元素自身开始，向上查找一个匹配指定标签的元素
  // elem {DOMElement}
  // tagName {String}
  // root {DOMElement} 可指定的根元素
  // return {DOMElement|undefined}
  iAncestorTag: function (elem, tagName, root) {
    tagName.test || (tagName = tagName.toUpperCase())
    root || (root = document)
    do {
      if (tagName.test ? tagName.test(elem.tagName) : elem.tagName === tagName) { return elem }
    } while (elem !== root && (elem = elem.parentNode))
  },

  // 按钮类型Boolean表
  BUTTON_TYPE: {
    button: !0,
    image: !0, // 图像按钮
    submit: !0,
    reset: !0
  },

  // 获取点击事件的预置信息
  // elem {DOMEvent}
  // return {Object|undefined}
  getClickPreset: function (e) {
    e || (e = window.event)
    var target = e.target || e.srcElement,
      tagName = target.tagName,
      aTarget,
      preset,
      type,
      text,
      href,
      domPath,
      offset,
      domSize
    switch (tagName) {
    case "INPUT":
      type = target.type
      if (dom.BUTTON_TYPE[type]) {
        domPath = this.getDomSelector(target)
        domSize = this.getDomSize(target)
        offset = this.getDomEventOffset(e, target)
        console.log(
          JSON.stringify(
            {
              domPath: domPath,
              domSize: domSize,
              offset: offset
            },
            null,
            2
          )
        )

        preset = {
          event: "btn_click",
          category: "click",
          properties: {
            b_dom_path: domPath, // 获取DOMSelector
            b_offset_x: offset.offsetX,
            b_offset_y: offset.offsetY,
            b_dom_width: domSize.width,
            b_dom_height: domSize.height,
            b_btn_type: type, // 类型
            b_btn_text: target.value, // 按钮文字
            b_btn_name: target.getAttribute("name") || "", // 按钮name
            b_btn_value: target.getAttribute("value") || "" // 按钮value
          }
        }
      }
      break
    default:
      aTarget = dom.iAncestorTag(target, rLinkButton)
      if (aTarget) {
        domPath = this.getDomSelector(aTarget)
        domSize = this.getDomSize(aTarget)
        offset = this.getDomEventOffset(e, aTarget)
        console.log(
          JSON.stringify(
            {
              domPath: domPath,
              domSize: domSize,
              offset: offset
            },
            null,
            2
          )
        )
        switch (aTarget.tagName) {
        case "BUTTON":
          text = _.trim(dom.innerText(aTarget))
          preset = {
            event: "btn_click",
            category: "click",
            properties: {
              b_dom_path: domPath, // 获取DOMSelector
              b_offset_x: offset.offsetX,
              b_offset_y: offset.offsetY,
              b_dom_width: domSize.width,
              b_dom_height: domSize.height,
              b_btn_type: aTarget.type, // 类型
              b_btn_text: text, // 按钮文字
              b_btn_name: aTarget.getAttribute("name") || "", // 按钮name
              b_btn_value: aTarget.getAttribute("value") || "" // 按钮value
            }
          }
          break
        case "A":
          text = _.trim(dom.innerText(aTarget))
          href = aTarget.href
          preset = {
            event: "link_click",
            category: "click",
            properties: {
              b_dom_path: domPath, // 获取DOMSelector
              b_offset_x: offset.offsetX,
              b_offset_y: offset.offsetY,
              b_dom_width: domSize.width,
              b_dom_height: domSize.height,
              b_link_url: href, // 链接地址
              b_link_text: text // 链接文字
            }
          }
          break
        default:
          break
        }
      } else {
        domPath = this.getDomSelector(target)
        domSize = this.getDomSize(target)
        offset = this.getDomEventOffset(e, target)
        console.log(
          JSON.stringify(
            {
              domPath: domPath,
              domSize: domSize,
              offset: offset
            },
            null,
            2
          )
        )
        preset = {
          event: "element_click",
          category: "click",
          properties: {
            b_dom_path: domPath, // 获取DOMSelector
            b_offset_x: offset.offsetX,
            b_offset_y: offset.offsetY,
            b_dom_width: domSize.width,
            b_dom_height: domSize.height
          }
        }
      }
    }
    // 鼠标坐标
    if (preset) {
      preset.properties.b_clientX = e.clientX
      preset.properties.b_clientY = e.clientY
    }
    return preset
  },

  // 页面位置及窗口大小
  getPageSize: function () {
    var scrW, scrH
    if (window.innerHeight && window.scrollMaxY) {
      // Mozilla
      scrW = window.innerWidth + window.scrollMaxX
      scrH = window.innerHeight + window.scrollMaxY
    } else if (document.body.scrollHeight > document.body.offsetHeight) {
      // all but IE Mac
      scrW = document.body.scrollWidth
      scrH = document.body.scrollHeight
    } else if (document.body) {
      // IE Mac
      scrW = document.body.offsetWidth
      scrH = document.body.offsetHeight
    }
    var winW, winH

    if (window.innerHeight) {
      // all except IE
      winW = window.innerWidth
      winH = window.innerHeight
    } else if (
      document.documentElement && document.documentElement.clientHeight
    ) {
      // IE 6 Strict Mode
      winW = document.documentElement.clientWidth
      winH = document.documentElement.clientHeight
    } else if (document.body) {
      // other
      winW = document.body.clientWidth
      winH = document.body.clientHeight
    }
    // for small pages with total size less
    // then the viewport
    var pageW = scrW < winW ? winW : scrW
    var pageH = scrH < winH ? winH : scrH
    return {
      PageWidth: pageW,
      PageHeight: pageH,
      WinWidth: winW,
      WinHeight: winH
    }
  },

  // 滚动条位置
  getPageScroll: function () {
    var x, y
    if (window.pageYOffset) {
      // all except IE
      y = window.pageYOffset
      x = window.pageXOffset
    } else if (document.documentElement && document.documentElement.scrollTop) {
      // IE 6 Strict
      x = document.documentElement.scrollLeft
      y = document.documentElement.scrollTop
    } else if (document.body) {
      // all
      // other IE
      x = document.body.scrollLeft
      y = document.body.scrollTop
    }

    return {
      b_scrollX: x,
      b_scrollY: y
    }
  },
  /**
   * 获取DOM节点的Selector
   */
  getDomSelector: function (dom) {
    var nodeType = dom.nodeName.toLowerCase()
    if (nodeType === "body" || nodeType === "html") return "body"
    else {
      var parent = dom.parentNode
      if (dom.getAttribute("id")) { return this.getDomSelector(parent) + ">#" + dom.getAttribute("id") } else if ((nodeType === "input" || nodeType === "select" || nodeType === "textarea" || nodeType === "button") && dom.getAttribute("name")) {
        return (this.getDomSelector(parent) + ">" + nodeType + ":input[name='" + dom.getAttribute("name") + "']")
      }

      for (var e = [], d = 0; d < parent.children.length; d++) {
        var f = parent.children[d]
        f.nodeName && f.nodeName.toLowerCase() === nodeType && e.push(f)
      }
      for (d = 0; d < e.length; d++) {
        if (e[d] === dom) {
          return this.getDomSelector(parent) + ">" + nodeType + ":eq(" + d + ")"
        }
      }
    }
  },
  /**
   * 获取DOM元素相对于可是文档区域左上角的位置
   */
  getDomOffset: function (dom) {
    var offset = {
      top: 0,
      left: 0
    }
    if (typeof dom.getBoundingClientRect !== typeof undefined) {
      offset = document.documentElement
      dom = dom.getBoundingClientRect()
      offset = {
        top: dom.top + (window.pageYOffset || offset.scrollTop) - (offset.clientTop || 0),
        left: dom.left + (window.pageXOffset || offset.scrollLeft) - (offset.clientLeft || 0)
      }
    } else {
      offset.top += dom.offsetTop
      offset.left += dom.offsetLeft
      if (dom.offsetParent) {
        dom = this.getDomOffset(dom.offsetParent)
        offset.top += dom.top
        offset.left += dom.left
      }

      if (offset.top < 0) offset.top = 0
      if (offset.left < 0) offset.left = 0
      offset.top = isNaN(offset.top) ? 0 : parseInt(offset.top, 10)
      offset.left = isNaN(offset.left) ? 0 : parseInt(offset.left, 10)
    }
    offset.top = Math.round(offset.top)
    offset.left = Math.round(offset.left)
    return offset
  },
  /**
   * 获取事件发生时坐标相对于事件源的相对位置
   */
  getDomEventOffset: function (e, target) {
    var offset = {}
    if (e.offsetX && e.offsetY) {
      offset.offsetX = e.offsetX
      offset.offsetY = e.offsetY
    } else {
      var box = target.getBoundingClientRect()
      offset.offsetX = e.clientX - box.left
      offset.offsetY = e.clientY - box.top
    }
    return offset
  },
  /**
   * 获取元素大小
   */
  getDomSize: function (dom) {
    var size = {}
    size.width = dom.offsetWidth
    size.height = dom.offsetHeight
    return size
  }
}

module.exports = dom

},{"./common":1,"./json":9}],5:[function(require,module,exports){
var common = require("../common")
var consts = require("../consts")
var eventEmitter = require("../eventEmitter")
var config = require("../config")
var log = require("../log")
var winOnError = window.onerror
var errors = []

console.log(config)

/* var i = false
var j = 0 */

function InnerError (msg, url, line) {
  this.message = msg || "Uncaught error with no additional information"
  this.sourceURL = url
  this.line = line
}

eventEmitter.on("err", function (err) {
  log("====捕获到错误====")
  log(arguments)
  errors.push(err)
})

setInterval(function () {
  var data = []
  if (errors.length > config.maxLimit) {
    data = errors.splice(0, config.maxLimit)
  } else {
    data = errors.splice(0, errors.length)
  }
  var options = {
    url: config.apiHost,
    type: "get",
    cors: true,
    data: data,
    success: function (data) {
      log("错误信息已发送")
    },
    error: function (xhr) {
      log(xhr.status)
      log(xhr.statusText)
      // errors.concat(data)
    },
    complete: function () {
      log("错误信息发送完毕.")
    }
  }

  options.header = {}
  options.header[consts.kepler_message_type] = consts.web_error
  options.header[consts.kepler_agent_token] = config.agentId
  options.header[consts.kepler_config_version] = config.LIB_VERSION

  // common.ajax(options)
}, config.transFrequency)

function onError (msg, url, line, col, error) {
  try {
    eventEmitter.emit("err", [error || new InnerError(msg, url, line)])
  } catch (error) {
    try {
      eventEmitter.emit("innererr", [error, (new Date()).getTime(), true])
    } catch (error) {}
  }
  return typeof winOnError === "function" ? winOnError.apply(this, common.toArray(arguments)) : false
}

window.onerror = onError

module.exports = eventEmitter

},{"../common":1,"../config":2,"../consts":3,"../eventEmitter":6,"../log":12}],6:[function(require,module,exports){
var globalContext = require("./globalContext")

var defaultContextKey = "__default_context__"

function eventEmitter (/* singletonEmit */) {
  var events = {}
  var eventArgs = {}
  function initObject () {
    return {}
  }

  function emit (eventName, params, context) {
    /* if (singletonEmit) {
      singletonEmit(eventName, params, context)
    } */
    if (!context) {
      context = {}
    }

    var listeners = getListeners(eventName)
    var listenersLen = listeners.length
    var k = {}

    try {
      k = globalContext.setOnce(context, defaultContextKey, initObject)
    } catch (err) {

    }
    for (var index = 0; listenersLen > index; index++) {
      listeners[index].apply(k, params)
    }
    return k
  }

  /**
   *
   * @param {*string} eventName 注册事件
   * @param {*Function|Array(Function)} cb 事件回调函数
   */
  function on (eventName, cb) {
    if (!cb) {
      cb = function () {}
    }
    events[eventName] = getListeners(eventName).concat(cb)
  }

  function getListeners (eventName) {
    return events[eventName] || []
  }

  /**
 *
 * 事件池中如果有事件监听器，则执行
 * 事件池中没有的话，则将事件参数假如到待执行队列中
 *
 * @param {any} eventName
 * @param {any} params
 * @param {any} context
 */
  function addEventArgs (eventName, params, context) {
    if (getListeners(eventName).length) {
      emit(eventName, params, context)
    } else {
      if (!eventArgs[eventName]) {
        eventArgs[eventName] = []
      }
      eventArgs[eventName].push(params)
    }
  }

  /**
   *
   * 尝试注册事件监听器
   * 如果已经存在事件监听器了，则退出
   * 如果不存在，则注册此事件，并清空队列中的待处理事件参数
   * @param {any} eventName
   * @param {any} callback
   * @returns
   */
  function handleEventArgs (eventName, callback) {
    if (getListeners(eventName).length) return false
    on(eventName, callback)
    var q = eventArgs[eventName]
    if (q) {
      for (var item = 0; item < q.length; item++) {
        emit(eventName, q[item])
      }
      delete eventArgs[eventName]
    }
    return true
  }

  function create () {
    return eventEmitter(emit)
  }

  return {
    on: on,
    emit: emit,
    create: create,
    listeners: getListeners,
    _events: events,
    addEventArgs: addEventArgs,
    handleQueue: handleEventArgs
  }
}

module.exports = eventEmitter()

},{"./globalContext":8}],7:[function(require,module,exports){
/*
 * @Author: jiangfeng
 * @Date: 2017-08-23 16:05:01
 * @Last Modified by: jiangfeng
 * @Last Modified time: 2017-08-28 17:39:47
 */

var rxApm = require("./main")
var config = {
  maxLimit: 10,
  crossSubDomain: true,
  loadTime: window.$$rxApmFirstByteTime || 1 * new Date(),
  showLog: true,
  openTracing: true,
  transFrequency: 5e3,
  apiHost: "http://10.200.10.22:8098",
  agentId: "pEdfa3M1",
  tierId: "1",
  appId: "1"
}

config = {
  maxLimit: 10,
  crossSubDomain: true,
  loadTime: window.$$rxApmFirstByteTime || 1 * new Date(),
  showLog: "<$=showLog$>",
  openTracing: "<$=openTracing$>",
  transFrequency: "<$=transFrequency$>",
  apiHost: "<$=apiHost$>",
  agentId: "<$=agentId$>",
  tierId: "<$=tierId$>",
  appId: "<$=appId$>"
}

config.showLog = !!0 + "" === config.showLog
config.openTracing = !!0 + "" === config.openTracing
config.transFrequency = +config.transFrequency

rxApm.init(config)

},{"./main":13}],8:[function(require,module,exports){
var _ = require("./common")
var config = require("./config")
var store = require("./store")
var locker = require("./locker")
function GetCurrentEventID () {
  return store.getSession("CURRENT_EVENT_ID")
}

function SetCurrentEventID (cid) {
  store.setSession("CURRENT_EVENT_ID", cid)
}

var state = {
}

/**
   * 本地上下文环境
   * 获取当前发送器的授权状态
   * 获取当前发送器的事件池
   * @type {Object}
   */
var globalContext = {
  get: function (key) {
    return key ? state[key] : state
  },
  set: function (key, value) {
    state[key] = value
  },
  push: function (key, value) {
    var a = state[key]
    if (!a) {
      a = state[key] = []
    }
    a.push(value)
  },
  setOnce: function (context, property, defaultCallback) {
    var objHasOwnProperty = Object.prototype.hasOwnProperty
    if (objHasOwnProperty.call(context, property)) return context[property]
    var propertyValue = defaultCallback()
    if (Object.defineProperty && Object.keys) {
      try {
        Object.defineProperty(context, property, {
          value: propertyValue,
          writable: true,
          enumerable: false
        })
        return propertyValue
      } catch (err) {

      }
    }
    try {
      context[property] = propertyValue
    } catch (err) {}
    return propertyValue
  },
  getEventPool: function () {
    var pool = _.localStorage.parse(config.LIB_KEY + "EventPool" + config.agentId, [])
    return pool
  },
  setEventPool: function (eventPool) {
    _.localStorage.set(config.LIB_KEY + "EventPool" + config.agentId, JSON.stringify(eventPool))
  },
  /**
     * 事件入池
     */
  pushEvent: function (event) {
    var that = this
    event.sending = false
    locker.exec(function () {
      event.cid = _.UUID()
      var cid = GetCurrentEventID()
      if (cid) {
        event.pid = cid
      }

      SetCurrentEventID(event.cid)

      var pool = that.getEventPool()
      pool.push(event)
      that.setEventPool(pool)
    })
  }
}

module.exports = globalContext

},{"./common":1,"./config":2,"./locker":11,"./store":18}],9:[function(require,module,exports){
/* eslint-disable */
// JSON polyfill
var toString = Object.prototype.toString
module.exports = (typeof JSON === "object" && toString.call(JSON) === "[object JSON]") ? JSON
    : (function (JSON) {
        "use strict"

        function f (e) {
            return e < 10 ? "0" + e : e
        }

        // function this_value() {
        // return this.valueOf()
        // }

        function quote (e) {
            return rx_escapable.lastIndex = 0, rx_escapable.test(e) ? "\"" + e.replace(rx_escapable, function (e) {
                var t = meta[e]
                return typeof t === "string" ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
            }) + "\"" : "\"" + e + "\""
        }

        function objectToJSON (e) {
            switch (toString.call(e)) {
            case "[object Date]":
                return isFinite(e.valueOf()) ? e.getUTCFullYear() + "-" + f(e.getUTCMonth() + 1) + "-" + f(e.getUTCDate()) + "T" + f(e.getUTCHours()) + ":" + f(e.getUTCMinutes()) + ":" + f(e.getUTCSeconds()) + "Z" : null
            case "[object Boolean]":
            case "[object String]":
            case "[object Number]":
                return e.valueOf()
            }
            return e
        }

        function str (e, t) {
            var r, n, i, o, s, a = gap,
                u = t[e]
            switch (u && typeof u === "object" && (u = objectToJSON(u)), typeof rep === "function" && (u = rep.call(t, e, u)), typeof u) {
            case "string":
                return quote(u)
            case "number":
                return isFinite(u) ? String(u) : "null"
            case "boolean":
            case "null":
                return String(u)
            case "object":
                if (!u) return "null"
                if (gap += indent, s = [], toString.call(u) === "[object Array]") {
                    for (o = u.length, r = 0; o > r; r += 1) s[r] = str(r, u) || "null"
                    return i = s.length === 0 ? "[]" : gap ? "[\n" + gap + s.join(",\n" + gap) + "\n" + a + "]" : "[" + s.join(",") + "]", gap = a, i
                }
                if (rep && typeof rep === "object") { for (o = rep.length, r = 0; o > r; r += 1) typeof rep[r] === "string" && (n = rep[r], i = str(n, u), i && s.push(quote(n) + (gap ? ": " : ":") + i)) } else { for (n in u) Object.prototype.hasOwnProperty.call(u, n) && (i = str(n, u), i && s.push(quote(n) + (gap ? ": " : ":") + i)) }
                return i = s.length === 0 ? "{}" : gap ? "{\n" + gap + s.join(",\n" + gap) + "\n" + a + "}" : "{" + s.join(",") + "}", gap = a, i
            }
        }
        var rx_one = /^[\],:{}\s]*$/,
            rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
            rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            rx_four = /(?:^|:|,)(?:\s*\[)+/g,
            rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
        //		"function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
        //			return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        //		}, Boolean.prototype.toJSON = this_value, Number.prototype.toJSON = this_value, String.prototype.toJSON = this_value);
        var gap, indent, meta, rep
        typeof JSON.stringify !== "function" && (meta = {
            "\b": "\\b",
            "	": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        }, JSON.stringify = function (e, t, r) {
                var n
                if (gap = "", indent = "", typeof r === "number") { for (n = 0; r > n; n += 1) indent += " " } else typeof r === "string" && (indent = r)
                if (rep = t, t && typeof t !== "function" && (typeof t !== "object" || typeof t.length !== "number")) throw new Error("JSON.stringify")
                return str("", {
                    "": e
                })
            }), typeof JSON.parse !== "function" && (JSON.parse = function (text, reviver) {
            function walk (e, t) {
                var r, n, i = e[t]
                if (i && typeof i === "object") { for (r in i) Object.prototype.hasOwnProperty.call(i, r) && (n = walk(i, r), void 0 !== n ? i[r] = n : delete i[r]) }
                return reviver.call(e, t, i)
            }
            var j
            if (text = String(text), rx_dangerous.lastIndex = 0, rx_dangerous.test(text) && (text = text.replace(rx_dangerous, function (e) {
                return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
            })), rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) {
                return j = eval("(" + text + ")"), typeof reviver === "function" ? walk({
                    "": j
                }, "") : j
            }
            throw new SyntaxError("JSON.parse")
        })
        return JSON
    })({})

},{}],10:[function(require,module,exports){
//
// Autogenerated by Thrift Compiler (0.10.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
var Thrift = require("./thrift")
//
// Autogenerated by Thrift Compiler (0.10.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//

var TWebAgentLoadBatch = function (args) {
  this.loadBatch = null
  if (args) {
    if (args.loadBatch !== undefined && args.loadBatch !== null) {
      this.loadBatch = Thrift.copyList(args.loadBatch, [null])
    }
  }
}
TWebAgentLoadBatch.prototype = {}
TWebAgentLoadBatch.prototype.read = function (input) {
  input.readStructBegin()
  while (true) {
    var ret = input.readFieldBegin()
    var fname = ret.fname
    var ftype = ret.ftype
    var fid = ret.fid
    if (ftype == Thrift.Type.STOP) {
      break
    }
    switch (fid) {
    case 1:
      if (ftype == Thrift.Type.LIST) {
        var _size0 = 0
        var _rtmp34
        this.loadBatch = []
        var _etype3 = 0
        _rtmp34 = input.readListBegin()
        _etype3 = _rtmp34.etype
        _size0 = _rtmp34.size
        for (var _i5 = 0; _i5 < _size0; ++_i5) {
          var elem6 = null
          elem6 = new TWebAgentLoad()
          elem6.read(input)
          this.loadBatch.push(elem6)
        }
        input.readListEnd()
      } else {
        input.skip(ftype)
      }
      break
    case 0:
      input.skip(ftype)
      break
    default:
      input.skip(ftype)
    }
    input.readFieldEnd()
  }
  input.readStructEnd()
}

TWebAgentLoadBatch.prototype.write = function (output) {
  output.writeStructBegin("TWebAgentLoadBatch")
  if (this.loadBatch !== null && this.loadBatch !== undefined) {
    output.writeFieldBegin("loadBatch", Thrift.Type.LIST, 1)
    output.writeListBegin(Thrift.Type.STRUCT, this.loadBatch.length)
    for (var iter7 in this.loadBatch) {
      if (this.loadBatch.hasOwnProperty(iter7)) {
        iter7 = this.loadBatch[iter7]
        iter7.write(output)
      }
    }
    output.writeListEnd()
    output.writeFieldEnd()
  }
  output.writeFieldStop()
  output.writeStructEnd()
}

var TWebAgentLoad = function (args) {
  this.agentId = null
  this.tierId = null
  this.appId = null
  this.traceId = null
  this.urlDomain = null
  this.urlQuery = null
  this.reportTime = null
  this.firstScreenTime = null
  this.whiteScreenTime = null
  this.operableTime = null
  this.resourceLoadedTime = null
  this.loadedTime = null
  this.browser = null
  this.backupProperties = null
  this.backupQuota = null
  if (args) {
    if (args.agentId !== undefined && args.agentId !== null) {
      this.agentId = args.agentId
    }
    if (args.tierId !== undefined && args.tierId !== null) {
      this.tierId = args.tierId
    }
    if (args.appId !== undefined && args.appId !== null) {
      this.appId = args.appId
    }
    if (args.traceId !== undefined && args.traceId !== null) {
      this.traceId = args.traceId
    }
    if (args.urlDomain !== undefined && args.urlDomain !== null) {
      this.urlDomain = args.urlDomain
    }
    if (args.urlQuery !== undefined && args.urlQuery !== null) {
      this.urlQuery = args.urlQuery
    }
    if (args.reportTime !== undefined && args.reportTime !== null) {
      this.reportTime = args.reportTime
    }
    if (args.firstScreenTime !== undefined && args.firstScreenTime !== null) {
      this.firstScreenTime = args.firstScreenTime
    }
    if (args.whiteScreenTime !== undefined && args.whiteScreenTime !== null) {
      this.whiteScreenTime = args.whiteScreenTime
    }
    if (args.operableTime !== undefined && args.operableTime !== null) {
      this.operableTime = args.operableTime
    }
    if (args.resourceLoadedTime !== undefined && args.resourceLoadedTime !== null) {
      this.resourceLoadedTime = args.resourceLoadedTime
    }
    if (args.loadedTime !== undefined && args.loadedTime !== null) {
      this.loadedTime = args.loadedTime
    }
    if (args.browser !== undefined && args.browser !== null) {
      this.browser = args.browser
    }
    if (args.backupProperties !== undefined && args.backupProperties !== null) {
      this.backupProperties = Thrift.copyMap(args.backupProperties, [null])
    }
    if (args.backupQuota !== undefined && args.backupQuota !== null) {
      this.backupQuota = Thrift.copyMap(args.backupQuota, [null])
    }
  }
}
TWebAgentLoad.prototype = {}
TWebAgentLoad.prototype.read = function (input) {
  input.readStructBegin()
  while (true) {
    var ret = input.readFieldBegin()
    var fname = ret.fname
    var ftype = ret.ftype
    var fid = ret.fid
    if (ftype == Thrift.Type.STOP) {
      break
    }
    switch (fid) {
    case 1:
      if (ftype == Thrift.Type.STRING) {
        this.agentId = input.readString().value
      } else {
        input.skip(ftype)
      }
      break
    case 2:
      if (ftype == Thrift.Type.STRING) {
        this.tierId = input.readString().value
      } else {
        input.skip(ftype)
      }
      break
    case 3:
      if (ftype == Thrift.Type.STRING) {
        this.appId = input.readString().value
      } else {
        input.skip(ftype)
      }
      break
    case 4:
      if (ftype == Thrift.Type.STRING) {
        this.traceId = input.readString().value
      } else {
        input.skip(ftype)
      }
      break
    case 5:
      if (ftype == Thrift.Type.STRING) {
        this.urlDomain = input.readString().value
      } else {
        input.skip(ftype)
      }
      break
    case 6:
      if (ftype == Thrift.Type.STRING) {
        this.urlQuery = input.readString().value
      } else {
        input.skip(ftype)
      }
      break
    case 7:
      if (ftype == Thrift.Type.I64) {
        this.reportTime = input.readI64().value
      } else {
        input.skip(ftype)
      }
      break
    case 8:
      if (ftype == Thrift.Type.I64) {
        this.firstScreenTime = input.readI64().value
      } else {
        input.skip(ftype)
      }
      break
    case 9:
      if (ftype == Thrift.Type.I64) {
        this.whiteScreenTime = input.readI64().value
      } else {
        input.skip(ftype)
      }
      break
    case 10:
      if (ftype == Thrift.Type.I64) {
        this.operableTime = input.readI64().value
      } else {
        input.skip(ftype)
      }
      break
    case 11:
      if (ftype == Thrift.Type.I64) {
        this.resourceLoadedTime = input.readI64().value
      } else {
        input.skip(ftype)
      }
      break
    case 12:
      if (ftype == Thrift.Type.I64) {
        this.loadedTime = input.readI64().value
      } else {
        input.skip(ftype)
      }
      break
    case 13:
      if (ftype == Thrift.Type.STRING) {
        this.browser = input.readString().value
      } else {
        input.skip(ftype)
      }
      break
    case 14:
      if (ftype == Thrift.Type.MAP) {
        var _size8 = 0
        var _rtmp312
        this.backupProperties = {}
        var _ktype9 = 0
        var _vtype10 = 0
        _rtmp312 = input.readMapBegin()
        _ktype9 = _rtmp312.ktype
        _vtype10 = _rtmp312.vtype
        _size8 = _rtmp312.size
        for (var _i13 = 0; _i13 < _size8; ++_i13) {
          if (_i13 > 0) {
            if (input.rstack.length > input.rpos[input.rpos.length - 1] + 1) {
              input.rstack.pop()
            }
          }
          var key14 = null
          var val15 = null
          key14 = input.readString().value
          val15 = input.readString().value
          this.backupProperties[key14] = val15
        }
        input.readMapEnd()
      } else {
        input.skip(ftype)
      }
      break
    case 15:
      if (ftype == Thrift.Type.MAP) {
        var _size16 = 0
        var _rtmp320
        this.backupQuota = {}
        var _ktype17 = 0
        var _vtype18 = 0
        _rtmp320 = input.readMapBegin()
        _ktype17 = _rtmp320.ktype
        _vtype18 = _rtmp320.vtype
        _size16 = _rtmp320.size
        for (var _i21 = 0; _i21 < _size16; ++_i21) {
          if (_i21 > 0) {
            if (input.rstack.length > input.rpos[input.rpos.length - 1] + 1) {
              input.rstack.pop()
            }
          }
          var key22 = null
          var val23 = null
          key22 = input.readString().value
          val23 = input.readI64().value
          this.backupQuota[key22] = val23
        }
        input.readMapEnd()
      } else {
        input.skip(ftype)
      }
      break
    default:
      input.skip(ftype)
    }
    input.readFieldEnd()
  }
  input.readStructEnd()
}

TWebAgentLoad.prototype.write = function (output) {
  output.writeStructBegin("TWebAgentLoad")
  if (this.agentId !== null && this.agentId !== undefined) {
    output.writeFieldBegin("agentId", Thrift.Type.STRING, 1)
    output.writeString(this.agentId)
    output.writeFieldEnd()
  }
  if (this.tierId !== null && this.tierId !== undefined) {
    output.writeFieldBegin("tierId", Thrift.Type.STRING, 2)
    output.writeString(this.tierId)
    output.writeFieldEnd()
  }
  if (this.appId !== null && this.appId !== undefined) {
    output.writeFieldBegin("appId", Thrift.Type.STRING, 3)
    output.writeString(this.appId)
    output.writeFieldEnd()
  }
  if (this.traceId !== null && this.traceId !== undefined) {
    output.writeFieldBegin("traceId", Thrift.Type.STRING, 4)
    output.writeString(this.traceId)
    output.writeFieldEnd()
  }
  if (this.urlDomain !== null && this.urlDomain !== undefined) {
    output.writeFieldBegin("urlDomain", Thrift.Type.STRING, 5)
    output.writeString(this.urlDomain)
    output.writeFieldEnd()
  }
  if (this.urlQuery !== null && this.urlQuery !== undefined) {
    output.writeFieldBegin("urlQuery", Thrift.Type.STRING, 6)
    output.writeString(this.urlQuery)
    output.writeFieldEnd()
  }
  if (this.reportTime !== null && this.reportTime !== undefined) {
    output.writeFieldBegin("reportTime", Thrift.Type.I64, 7)
    output.writeI64(this.reportTime)
    output.writeFieldEnd()
  }
  if (this.firstScreenTime !== null && this.firstScreenTime !== undefined) {
    output.writeFieldBegin("firstScreenTime", Thrift.Type.I64, 8)
    output.writeI64(this.firstScreenTime)
    output.writeFieldEnd()
  }
  if (this.whiteScreenTime !== null && this.whiteScreenTime !== undefined) {
    output.writeFieldBegin("whiteScreenTime", Thrift.Type.I64, 9)
    output.writeI64(this.whiteScreenTime)
    output.writeFieldEnd()
  }
  if (this.operableTime !== null && this.operableTime !== undefined) {
    output.writeFieldBegin("operableTime", Thrift.Type.I64, 10)
    output.writeI64(this.operableTime)
    output.writeFieldEnd()
  }
  if (this.resourceLoadedTime !== null && this.resourceLoadedTime !== undefined) {
    output.writeFieldBegin("resourceLoadedTime", Thrift.Type.I64, 11)
    output.writeI64(this.resourceLoadedTime)
    output.writeFieldEnd()
  }
  if (this.loadedTime !== null && this.loadedTime !== undefined) {
    output.writeFieldBegin("loadedTime", Thrift.Type.I64, 12)
    output.writeI64(this.loadedTime)
    output.writeFieldEnd()
  }
  if (this.browser !== null && this.browser !== undefined) {
    output.writeFieldBegin("browser", Thrift.Type.STRING, 13)
    output.writeString(this.browser)
    output.writeFieldEnd()
  }
  if (this.backupProperties !== null && this.backupProperties !== undefined) {
    output.writeFieldBegin("backupProperties", Thrift.Type.MAP, 14)
    output.writeMapBegin(Thrift.Type.STRING, Thrift.Type.STRING, Thrift.objectLength(this.backupProperties))
    for (var kiter24 in this.backupProperties) {
      if (this.backupProperties.hasOwnProperty(kiter24)) {
        var viter25 = this.backupProperties[kiter24]
        output.writeString(kiter24)
        output.writeString(viter25)
      }
    }
    output.writeMapEnd()
    output.writeFieldEnd()
  }
  if (this.backupQuota !== null && this.backupQuota !== undefined) {
    output.writeFieldBegin("backupQuota", Thrift.Type.MAP, 15)
    output.writeMapBegin(Thrift.Type.STRING, Thrift.Type.I64, Thrift.objectLength(this.backupQuota))
    for (var kiter26 in this.backupQuota) {
      if (this.backupQuota.hasOwnProperty(kiter26)) {
        var viter27 = this.backupQuota[kiter26]
        output.writeString(kiter26)
        output.writeI64(viter27)
      }
    }
    output.writeMapEnd()
    output.writeFieldEnd()
  }
  output.writeFieldStop()
  output.writeStructEnd()
}

var TWebAgentAjaxBatch = function (args) {
  this.ajaxBatch = null
  if (args) {
    if (args.ajaxBatch !== undefined && args.ajaxBatch !== null) {
      this.ajaxBatch = Thrift.copyList(args.ajaxBatch, [null])
    }
  }
}
TWebAgentAjaxBatch.prototype = {}
TWebAgentAjaxBatch.prototype.read = function (input) {
  input.readStructBegin()
  while (true) {
    var ret = input.readFieldBegin()
    var fname = ret.fname
    var ftype = ret.ftype
    var fid = ret.fid
    if (ftype == Thrift.Type.STOP) {
      break
    }
    switch (fid) {
    case 1:
      if (ftype == Thrift.Type.LIST) {
        var _size28 = 0
        var _rtmp332
        this.ajaxBatch = []
        var _etype31 = 0
        _rtmp332 = input.readListBegin()
        _etype31 = _rtmp332.etype
        _size28 = _rtmp332.size
        for (var _i33 = 0; _i33 < _size28; ++_i33) {
          var elem34 = null
          elem34 = new TWebAgentAjax()
          elem34.read(input)
          this.ajaxBatch.push(elem34)
        }
        input.readListEnd()
      } else {
        input.skip(ftype)
      }
      break
    case 0:
      input.skip(ftype)
      break
    default:
      input.skip(ftype)
    }
    input.readFieldEnd()
  }
  input.readStructEnd()
}

TWebAgentAjaxBatch.prototype.write = function (output) {
  output.writeStructBegin("TWebAgentAjaxBatch")
  if (this.ajaxBatch !== null && this.ajaxBatch !== undefined) {
    output.writeFieldBegin("ajaxBatch", Thrift.Type.LIST, 1)
    output.writeListBegin(Thrift.Type.STRUCT, this.ajaxBatch.length)
    for (var iter35 in this.ajaxBatch) {
      if (this.ajaxBatch.hasOwnProperty(iter35)) {
        iter35 = this.ajaxBatch[iter35]
        iter35.write(output)
      }
    }
    output.writeListEnd()
    output.writeFieldEnd()
  }
  output.writeFieldStop()
  output.writeStructEnd()
}

var TWebAgentAjax = function (args) {
  this.agentId = null
  this.tierId = null
  this.appId = null
  this.traceId = null
  this.urlDomain = null
  this.urlQuery = null
  this.reportTime = null
  this.loadedTime = null
  this.browser = null
  this.backupProperties = null
  this.backupQuota = null
  if (args) {
    if (args.agentId !== undefined && args.agentId !== null) {
      this.agentId = args.agentId
    }
    if (args.tierId !== undefined && args.tierId !== null) {
      this.tierId = args.tierId
    }
    if (args.appId !== undefined && args.appId !== null) {
      this.appId = args.appId
    }
    if (args.traceId !== undefined && args.traceId !== null) {
      this.traceId = args.traceId
    }
    if (args.urlDomain !== undefined && args.urlDomain !== null) {
      this.urlDomain = args.urlDomain
    }
    if (args.urlQuery !== undefined && args.urlQuery !== null) {
      this.urlQuery = args.urlQuery
    }
    if (args.reportTime !== undefined && args.reportTime !== null) {
      this.reportTime = args.reportTime
    }
    if (args.loadedTime !== undefined && args.loadedTime !== null) {
      this.loadedTime = args.loadedTime
    }
    if (args.browser !== undefined && args.browser !== null) {
      this.browser = args.browser
    }
    if (args.backupProperties !== undefined && args.backupProperties !== null) {
      this.backupProperties = Thrift.copyMap(args.backupProperties, [null])
    }
    if (args.backupQuota !== undefined && args.backupQuota !== null) {
      this.backupQuota = Thrift.copyMap(args.backupQuota, [null])
    }
  }
}
TWebAgentAjax.prototype = {}
TWebAgentAjax.prototype.read = function (input) {
  input.readStructBegin()
  while (true) {
    var ret = input.readFieldBegin()
    var fname = ret.fname
    var ftype = ret.ftype
    var fid = ret.fid
    if (ftype == Thrift.Type.STOP) {
      break
    }
    switch (fid) {
    case 1:
      if (ftype == Thrift.Type.STRING) {
        this.agentId = input.readString().value
      } else {
        input.skip(ftype)
      }
      break
    case 2:
      if (ftype == Thrift.Type.STRING) {
        this.tierId = input.readString().value
      } else {
        input.skip(ftype)
      }
      break
    case 3:
      if (ftype == Thrift.Type.STRING) {
        this.appId = input.readString().value
      } else {
        input.skip(ftype)
      }
      break
    case 4:
      if (ftype == Thrift.Type.STRING) {
        this.traceId = input.readString().value
      } else {
        input.skip(ftype)
      }
      break
    case 5:
      if (ftype == Thrift.Type.STRING) {
        this.urlDomain = input.readString().value
      } else {
        input.skip(ftype)
      }
      break
    case 6:
      if (ftype == Thrift.Type.STRING) {
        this.urlQuery = input.readString().value
      } else {
        input.skip(ftype)
      }
      break
    case 7:
      if (ftype == Thrift.Type.I64) {
        this.reportTime = input.readI64().value
      } else {
        input.skip(ftype)
      }
      break
    case 8:
      if (ftype == Thrift.Type.I64) {
        this.loadedTime = input.readI64().value
      } else {
        input.skip(ftype)
      }
      break
    case 9:
      if (ftype == Thrift.Type.STRING) {
        this.browser = input.readString().value
      } else {
        input.skip(ftype)
      }
      break
    case 10:
      if (ftype == Thrift.Type.MAP) {
        var _size36 = 0
        var _rtmp340
        this.backupProperties = {}
        var _ktype37 = 0
        var _vtype38 = 0
        _rtmp340 = input.readMapBegin()
        _ktype37 = _rtmp340.ktype
        _vtype38 = _rtmp340.vtype
        _size36 = _rtmp340.size
        for (var _i41 = 0; _i41 < _size36; ++_i41) {
          if (_i41 > 0) {
            if (input.rstack.length > input.rpos[input.rpos.length - 1] + 1) {
              input.rstack.pop()
            }
          }
          var key42 = null
          var val43 = null
          key42 = input.readString().value
          val43 = input.readString().value
          this.backupProperties[key42] = val43
        }
        input.readMapEnd()
      } else {
        input.skip(ftype)
      }
      break
    case 11:
      if (ftype == Thrift.Type.MAP) {
        var _size44 = 0
        var _rtmp348
        this.backupQuota = {}
        var _ktype45 = 0
        var _vtype46 = 0
        _rtmp348 = input.readMapBegin()
        _ktype45 = _rtmp348.ktype
        _vtype46 = _rtmp348.vtype
        _size44 = _rtmp348.size
        for (var _i49 = 0; _i49 < _size44; ++_i49) {
          if (_i49 > 0) {
            if (input.rstack.length > input.rpos[input.rpos.length - 1] + 1) {
              input.rstack.pop()
            }
          }
          var key50 = null
          var val51 = null
          key50 = input.readString().value
          val51 = input.readI64().value
          this.backupQuota[key50] = val51
        }
        input.readMapEnd()
      } else {
        input.skip(ftype)
      }
      break
    default:
      input.skip(ftype)
    }
    input.readFieldEnd()
  }
  input.readStructEnd()
}

TWebAgentAjax.prototype.write = function (output) {
  output.writeStructBegin("TWebAgentAjax")
  if (this.agentId !== null && this.agentId !== undefined) {
    output.writeFieldBegin("agentId", Thrift.Type.STRING, 1)
    output.writeString(this.agentId)
    output.writeFieldEnd()
  }
  if (this.tierId !== null && this.tierId !== undefined) {
    output.writeFieldBegin("tierId", Thrift.Type.STRING, 2)
    output.writeString(this.tierId)
    output.writeFieldEnd()
  }
  if (this.appId !== null && this.appId !== undefined) {
    output.writeFieldBegin("appId", Thrift.Type.STRING, 3)
    output.writeString(this.appId)
    output.writeFieldEnd()
  }
  if (this.traceId !== null && this.traceId !== undefined) {
    output.writeFieldBegin("traceId", Thrift.Type.STRING, 4)
    output.writeString(this.traceId)
    output.writeFieldEnd()
  }
  if (this.urlDomain !== null && this.urlDomain !== undefined) {
    output.writeFieldBegin("urlDomain", Thrift.Type.STRING, 5)
    output.writeString(this.urlDomain)
    output.writeFieldEnd()
  }
  if (this.urlQuery !== null && this.urlQuery !== undefined) {
    output.writeFieldBegin("urlQuery", Thrift.Type.STRING, 6)
    output.writeString(this.urlQuery)
    output.writeFieldEnd()
  }
  if (this.reportTime !== null && this.reportTime !== undefined) {
    output.writeFieldBegin("reportTime", Thrift.Type.I64, 7)
    output.writeI64(this.reportTime)
    output.writeFieldEnd()
  }
  if (this.loadedTime !== null && this.loadedTime !== undefined) {
    output.writeFieldBegin("loadedTime", Thrift.Type.I64, 8)
    output.writeI64(this.loadedTime)
    output.writeFieldEnd()
  }
  if (this.browser !== null && this.browser !== undefined) {
    output.writeFieldBegin("browser", Thrift.Type.STRING, 9)
    output.writeString(this.browser)
    output.writeFieldEnd()
  }
  if (this.backupProperties !== null && this.backupProperties !== undefined) {
    output.writeFieldBegin("backupProperties", Thrift.Type.MAP, 10)
    output.writeMapBegin(Thrift.Type.STRING, Thrift.Type.STRING, Thrift.objectLength(this.backupProperties))
    for (var kiter52 in this.backupProperties) {
      if (this.backupProperties.hasOwnProperty(kiter52)) {
        var viter53 = this.backupProperties[kiter52]
        output.writeString(kiter52)
        output.writeString(viter53)
      }
    }
    output.writeMapEnd()
    output.writeFieldEnd()
  }
  if (this.backupQuota !== null && this.backupQuota !== undefined) {
    output.writeFieldBegin("backupQuota", Thrift.Type.MAP, 11)
    output.writeMapBegin(Thrift.Type.STRING, Thrift.Type.I64, Thrift.objectLength(this.backupQuota))
    for (var kiter54 in this.backupQuota) {
      if (this.backupQuota.hasOwnProperty(kiter54)) {
        var viter55 = this.backupQuota[kiter54]
        output.writeString(kiter54)
        output.writeI64(viter55)
      }
    }
    output.writeMapEnd()
    output.writeFieldEnd()
  }
  output.writeFieldStop()
  output.writeStructEnd()
}

module.exports = {
  TWebAgentLoad: TWebAgentLoad,
  TWebAgentAjax: TWebAgentAjax,
  TWebAgentLoadBatch: TWebAgentLoadBatch,
  TWebAgentAjaxBatch: TWebAgentAjaxBatch
}

},{"./thrift":19}],11:[function(require,module,exports){
var log = require("./log")
var _lockTimer = null
var _lockState = false
var cbs = []
var locker = {
  exec: function (cb) {
    cbs.push(cb)
    if (!_lockTimer) {
      _lockTimer = setInterval(function () {
        if (_lockState || cbs.length <= 0) return
        _lockState = true
        var callback = cbs.shift()
        callback()
        log("队列函数数量：" + cbs.length)
        if (cbs.length === 0) {
          clearInterval(_lockTimer)
          _lockTimer = null
        }
        _lockState = false
      }, 0)
    }
  }
}

module.exports = locker

},{"./log":12}],12:[function(require,module,exports){
var config = require("./config")
module.exports = function () {
  if (!config.showLog) return
  if (typeof console === "object" && console.log) {
    try {
      console.log.apply(console, arguments)
    } catch (e) {
      console.log(arguments[0])
    }
  }
}

},{"./config":2}],13:[function(require,module,exports){
var _ = require("./common")
var config = require("./config")

var performance = require("./performance")
var rxApm = {
  config: config
}
rxApm.init = function (config) {
  var that = this
  if (config && !_.isEmptyObject(config)) {
    _.extend(that.config, config)
  }
  if (window.$$rxApmSetting) {
    _.extend(that.config, window.$$rxApmSetting)
  }
  performance()
  require("./error")
  require("./xhr")
}
module.exports = rxApm

},{"./common":1,"./config":2,"./error":5,"./performance":14,"./xhr":22}],14:[function(require,module,exports){
/*
 * @Author: jiangfeng
 * @Date: 2017-08-22 11:54:47
 * @Last Modified by: jiangfeng
 * @Last Modified time: 2017-08-28 22:31:50
 */
var eventEmitter = require("../eventEmitter")
var common = require("../common")
var consts = require("../consts")
var log = require("../log")
var config = require("../config")
var pageLoader = require("./pageLoader")
var domLoading = pageLoader.domLoading()
var firstScreen
var performance = require("./performance")
var sender = require("./sender")

var win = window
var doc = win.document
var url = ("" + location).split("?")[0]
var ie = false
var domContentLoaded = false
var strAddEventListener = "addEventListener"
var strAttachEvent = "attachEvent"

var pageInfo = {
  firstByte: config.loadTime || window.$$rxApmFirstByteTime || pageLoader.getCurrentTime(),
  origin: url,
  features: {}
}

// 页面加载完毕后发送性能数据
eventEmitter.on(consts.pageLoader_loaded, function (pageInfo) {
  var perfors = getPerformanceData()
  sender.sendPerformances(common.extend({}, perfors, common.info.properties()))
})

/* eventEmitter.on(consts.pageLoader_domloading, function (pageInfo) {
  eventEmitter.addEventArgs("mark", ["domLoading", domLoading.getDomLoadingStartTime()])
}) */

/**
 * 标记文档加载完毕的时间
 */
function onLoaded () {
  // 标记白屏加载时间
  // 标记首屏加载时间--以首屏所有IMG标签的最大加载时间作为首屏加载完成时间
  // 标记页面记载完成的时间，用来计算页面加载时间
  setTimeout(function () {
    eventEmitter.addEventArgs("mark", ["domLoading", domLoading.getDomLoadingStartTime()])
    if (!firstScreen) {
      console.warn("firstScreen not find")
    }
    eventEmitter.addEventArgs("mark", ["firstScreen", firstScreen.getFirstScreenTime()])
    eventEmitter.addEventArgs("mark", ["onLoad", pageLoader.getCurrentTime()])
    eventEmitter.emit(consts.pageLoader_loaded, [pageInfo])
  }, 0)
}

function onReadyStateChangedComplete () {
  if (domContentLoaded || doc.readyState === "complete") {
    onDomContentLoaded()
  }
}

/**
 * 标记当前页面的DOM加载完毕的时间，用来计算可操作时间
 * 之后开始首屏计算
 */
function onDomContentLoaded () {
  eventEmitter.addEventArgs("mark", ["domContent", pageLoader.getCurrentTime()])
  log("onDomContentLoaded executed, the firstScreen object:")
  firstScreen = pageLoader.firstScreen()
  log(firstScreen)
}

/**
 * 获取全部的性能数据
 *
 * @returns 返回处理后的性能数据JSON对象
 */
function getPerformanceData () {
  var performances = {}
  eventEmitter.handleQueue("mark", function (mark, time) {
    if (mark !== "firstByte") {
      performances[mark] = time - pageInfo.firstByte
    } else {
      performances[mark] = pageInfo.firstByte
    }
  })
  // 白屏时间
  performances["domLoading"] = performance.getWriteScreenTimeSpan() || performances["domLoading"]
  // 可操作时间（Dom加载完成时间）
  performances["domContent"] = performance.getDomReadyTimeSpan() || performances["domContent"]
  // 首屏时间
  performances["firstScreen"] = performances["firstScreen"] || performances["domContent"] || -1
  // 页面加载完成时间
  performances["onLoad"] = performance.getPageReadyTimeSpan() || performances["onLoad"]
  // DNS解析时间
  performances["dns"] = performance.getDNSTimeSpan() || -1
  // TCP解析时间
  performances["tcp"] = performance.getTCPTimeSpan() || -1
  // 页面资源数量
  performances["resourceCount"] = performance.getResourceCount() || -1
  return performances
}

// 标记进入页面的时间
function markFirstByteTime () {
  eventEmitter.addEventArgs("mark", ["firstByte", config.loadTime || window.$$rxApmFirstByteTime || pageLoader.getCurrentTime()])
}

module.exports = function () {
  markFirstByteTime()
  log(doc.readyState)
  // complete等同于window.onload
  // interactive等同与DOMContentLoaded
  var docState = document.readyState
  if (docState === "complete") {
    onDomContentLoaded()
    onLoaded()
  } else {
    // 如果页面DOM元素加载完成，则出发ContentLoaded事件
    if (docState === "interactive") {
      onDomContentLoaded()
    }
    if (doc[strAddEventListener]) {
      log("current readyState " + doc.readyState + ", exec dateTime :" + new Date() * 1)
      doc[strAddEventListener]("DOMContentLoaded", onDomContentLoaded, false)
      win[strAddEventListener]("load", onLoaded, false)
    } else {
      log("ie:current readyState " + doc.readyState + ", exec dateTime :" + new Date() * 1)
      doc[strAttachEvent]("onreadystatechange", onReadyStateChangedComplete)
      win[strAttachEvent]("onload", onLoaded)
    }
  }

  /**
   * doScroll判断ie6-8的DOM是否加载完成
   * ie特有的doScroll方法
   * 当页面DOM未加载完成时，调用doScroll方法时，就会报错
   * 反过来，只要一直间隔调用doScroll直到不报错
   * 那就表示页面DOM加载完毕了。
   */
  try {
    ie = window.frameElement == null && document.documentElement
  } catch (err) {

  }

  function ieContentLoaded () {
    if (!domContentLoaded) {
      try {
        ie.doScroll("left")
      } catch (err) {
        return setTimeout(ieContentLoaded, 50)
      }
      domContentLoaded = true
      onDomContentLoaded()
    }
  }

  if (ie && ie.doScroll) {
    ieContentLoaded()
  }
}

},{"../common":1,"../config":2,"../consts":3,"../eventEmitter":6,"../log":12,"./pageLoader":15,"./performance":16,"./sender":17}],15:[function(require,module,exports){
/*
 * @Author: jiangfeng
 * @Date: 2017-08-22 15:02:32
 * @Last Modified by: jiangfeng
 * @Last Modified time: 2017-09-21 17:32:55
 */

var domHelper = require("../dom")
var win = window
var doc = win.document

/**
 * 获取当前时间戳
 *
 * @returns
 */
function getCurrentTime () {
  return new Date() * 1
}

/**
 * 获取首屏时间
 *
 * @returns
 */
function firstScreen () {
  var onImgLoaded = function () {
    var that = this
    if (that.removeEventListener) {
      that.removeEventListener("load", onImgLoaded, false)
    }
    firstScreenImgs.push({
      img: this,
      time: getCurrentTime()
    })
  }

  var imgs = document.getElementsByTagName("img")
  var firstScreenTime = getCurrentTime()
  var firstScreenImgs = []
  for (var i = 0; i < imgs.length; i++) {
    (function () {
      var img = imgs[i]
      if (img.addEventListener) {
        !img.complete && img.addEventListener("load", onImgLoaded, false)
      } else if (img.attachEvent) {
        img.attachEvent("onreadystatechange", function () {
          if (img.readyState === "complete") {
            onImgLoaded.call(img, onImgLoaded)
          }
        })
      }
    })()
  }

  /**
   * 获取首屏时间
   *
   * @returns
   */
  function getFirstScreenTime () {
    var sh = document.documentElement.clientHeight
    for (var i = 0; i < firstScreenImgs.length; i++) {
      var item = firstScreenImgs[i]
      var img = item["img"]
      var time = item["time"]
      var top = domHelper.getDomOffset(img).top
      if (top > 0 && top < sh) {
        firstScreenTime = time > firstScreenTime ? time : firstScreenTime
      }
    }
    return firstScreenTime
  }

  return {
    getFirstScreenTime: getFirstScreenTime
  }
}

/**
 * 获取页面开始加载DOM的时间，即可以获取对应的页面白屏时间
 *
 * @returns
 */
function domLoading () {
  /* eslint-disabled no-multi-str */

  var c = doc.createElement("script")
  c.id = "rx-" + new Date() * 1
  c.text = "window.$$rxApmDomLoadingStartTime=new Date() * 1;\
            var s = document.getElementById('" + c.id + "'); \
            document.getElementsByTagName('head')[0].removeChild(s);"
  document.getElementsByTagName("head")[0].appendChild(c)

  function getDomLoadingStartTime () {
    var time = window.$$rxApmDomLoadingStartTime
    try {
      delete window.$$rxApmDomLoadingStartTime
    } catch (ex) {

    }

    return time
  }
  return {
    getDomLoadingStartTime: getDomLoadingStartTime
  }
}

module.exports = {
  getCurrentTime: getCurrentTime,
  domLoading: domLoading,
  firstScreen: firstScreen
}

},{"../dom":4}],16:[function(require,module,exports){
/*
 * @Author: jiangfeng
 * @Date: 2017-08-22 15:02:40
 * @Last Modified by: jiangfeng
 * @Last Modified time: 2017-09-19 20:05:37
 */

var headerLinks
var headerScripts
var resources
var win = window
var doc = win.document
var winPerformance = win.performance
var links = {}

/**
 * 获取白屏时间
 *
 * @returns 返回白屏时间对象，附带了Header那的所有静态资源请求
 */
function getWriteScreenTimeSpan () {
  var index = 0
  var resourceLenth = 0
  var writeScreenTime = 0
  if (winPerformance && doc.querySelectorAll && winPerformance.getEntriesByType) {
    writeScreenTime = winPerformance.timing.domLoading
    headerLinks = doc.querySelectorAll("head>link")
    headerScripts = doc.querySelectorAll("head>script")
    for (var item in headerLinks) {
      if (headerLinks[item].href !== "" && void 0 !== headerLinks[item].href) {
        links[unescape(headerLinks[item].href)] = 1
      }
    }
    for (item in headerScripts) {
      if (headerScripts[item].src !== "" && void 0 !== headerScripts[item].src && headerScripts[item].async !== 1) {
        links[unescape(headerScripts[item].src)] = 1
      }
    }
    resourceLenth += headerLinks.length
    resourceLenth += headerScripts.length
    resources = winPerformance.getEntriesByType("resource")
    // 为什么要用2*resourceLength呢？
    if (2 * resourceLenth > resources.length) {
      resourceLenth = resources.length
    } else {
      resourceLenth += resourceLenth
    }

    for (index; resourceLenth >= index; index++) {
      if (resources[index] &&
        links[unescape(resources[index].name)] === 1 &&
        resources[index].responseEnd > 0 &&
        resources[index].responseEnd + winPerformance.timing.navigationStart >= writeScreenTime) {
        writeScreenTime = resources[index].responseEnd + winPerformance.timing.navigationStart
      }
    }

    writeScreenTime -= winPerformance.timing.navigationStart
    return parseInt(writeScreenTime)
    /* return {
      feelTime: parseInt(f),
      headUrl: links
    } */
  }
}

/**
 * 获取性能指标数据
 *
 */
function getStartTime () {
  return null
}
/**
 * 获取链接类型
 *
 * @returns 返回值（bluetooth/cellular/ethernet/none/wifi/wimax/other/unknown）
 */
function getSysConnectionType () {
  return window.navigator.connection ? window.navigator.connection.type + "" : ""
}

/**
 * 获取DNS寻址执行的时间，只能通过指定浏览器的特性支持
 *
 * @returns 如果版本高，则返回对应的DNS寻址时间，如果版本低，则返回undefined
 */
function getDNSTimeSpan () {
  if (window.performance) {
    return window.performance.timing.domainLookupEnd - window.performance.timing.domainLookupStart
  }
  return void 0
}

/**
 * 获取TCP执行时间，只能通过指定浏览器的特性支持
 *
 * @returns
 */
function getTCPTimeSpan () {
  if (window.performance) {
    return window.performance.timing.connectEnd - window.performance.timing.connectStart
  }
  return void 0
}

/**
 * 获取Dom加载完毕的时间，高版本直接通过domContentLoadedEventStart与navigationStart的差值进行计算
 *
 * @returns
 */
function getDomReadyTimeSpan () {
  if (window.performance) {
    return window.performance.timing.domContentLoadedEventStart - window.performance.timing.navigationStart
  }
  return void 0
}

/**
 * 获取页面加载完成的时间，高版本直接通过loadEventStart与navigationStart的差值做计算
 *
 * @returns
 */
function getPageReadyTimeSpan () {
  if (window.performance) {
    return window.performance.timing.loadEventStart - window.performance.timing.navigationStart
  }
  return void 0
}

/**
 * 获取静态资源数量，高版本直接通过getEntriesByType("resource")获取数量
 *
 * @returns
 */
function getResourceCount () {
  if (window.performance.getEntriesByType && typeof window.performance.getEntriesByType === "function") {
    return window.performance.getEntriesByType("resource").length
  }
  return void 0
}

module.exports = {
  getWriteScreenTimeSpan: getWriteScreenTimeSpan,
  getStartTime: getStartTime,
  getSysConnectionType: getSysConnectionType,
  getDNSTimeSpan: getDNSTimeSpan,
  getTCPTimeSpan: getTCPTimeSpan,
  getDomReadyTimeSpan: getDomReadyTimeSpan,
  getPageReadyTimeSpan: getPageReadyTimeSpan,
  getResourceCount: getResourceCount
}

},{}],17:[function(require,module,exports){
/*
 * @Author: jiangfeng
 * @Date: 2017-08-22 15:02:53
 * @Last Modified by: jiangfeng
 * @Last Modified time: 2017-10-17 14:24:18
 */

var config = require("../config")
var common = require("../common")
var consts = require("../consts")
var log = require("../log")
var Thrift = require("../thrift")
var kepler = require("../kepler")

function serialize (entity, obj) {
  entity.agentId = config.agentId
  entity.tierId = config.tierId
  entity.appId = config.appId
  entity.traceId = common.UUID()
  entity.urlDomain = document.domain || window.location.host
  entity.reportTime = new Date() * 1
  entity.firstScreenTime = obj.firstScreen
  entity.whiteScreenTime = obj.domLoading
  entity.operableTime = obj.domContent
  entity.resourceLoadedTime = obj.onLoad
  entity.loadedTime = obj.onLoad
  entity.browser = obj.browser
  entity.urlQuery = obj.page_url_path

  entity.backupProperties = {
    "os": obj.os,
    "os_version": obj.os_version,
    "device": obj.device,
    "device_version": obj.device_version,
    "browser_engine": obj.browser_engine,
    "page_title": obj.page_title,
    "page_h1": obj.page_h1,
    "page_referrer": obj.page_referrer,
    "page_url": obj.page_url,
    "lib": obj.lib,
    "lib_version": obj.lib_version,
    "browser_version": obj.browser_version
  }

  entity.backupQuota = {
    "dns": obj.dns,
    "tcp": obj.tcp,
    "screen_height": obj.screen_height,
    "screen_width": obj.screen_width
  }
}

function sendPerformances (performances) {
  log("performance resource data:")
  log(JSON.stringify(performances, null, 2))
  var transport = new Thrift.Transport("")
  var protocol = new Thrift.Protocol(transport)
  var entity = new kepler.TWebAgentLoad(performances)
  serialize(entity, performances)

  protocol.writeMessageBegin("TWebAgentLoadBatch", Thrift.MessageType.CALL, 0)
  var patch = new kepler.TWebAgentLoadBatch({
    loadBatch: [entity]
  })
  // log("performance json data:")
  // log(JSON.stringify(patch, null, 2))
  patch.write(protocol)
  protocol.writeMessageEnd()
  var sendValue = transport.flush()
  var x = JSON.parse(sendValue)
  sendValue = JSON.stringify(x[x.length - 1])
  log("performance thrift data:")
  log(sendValue)
  var options = {
    url: config.apiHost,
    type: "post",
    cors: true,
    data: sendValue,
    success: function (data) {
      log("事件发送返回消息错误")
    },
    error: function (xhr) {
      log(xhr.status)
      log(xhr.statusText)
    },
    complete: function () {
      log("事件发送完毕.")
    }
  }

  options.header = {}
  options.header[consts.kepler_message_type] = consts.WEB_LOAD_BATCH
  options.header[consts.kepler_agent_token] = config.agentId
  options.header[consts.kepler_config_version] = config.LIB_VERSION

  common.ajax(options)
}

module.exports = {
  sendPerformances: sendPerformances
}

},{"../common":1,"../config":2,"../consts":3,"../kepler":10,"../log":12,"../thrift":19}],18:[function(require,module,exports){
var config = require("./config")
var common = require("./common")
var JSON = require("./json")

var LIB_KEY = config.LIB_KEY
var sessionState = {}
var session = {
  getId: function () {
    return sessionState.id
  },
  init: function () {
    var ds = common.cookie.get(LIB_KEY + "session")
    var state = null
    if (ds !== null && (typeof (state = JSON.parse(ds)) === "object")) {
      sessionState = state
    }
  },
  get: function (name) {
    return name ? sessionState[name] : sessionState
  },
  set: function (name, value) {
    sessionState[name] = value
    this.save()
  },
  setOnce: function (name, value) {
    if (!(name in sessionState)) {
      this.set(name, value)
    }
  },
  change: function (name, value) {
    sessionState[name] = value
  },
  save: function (props) {
    if (props) {
      sessionState = props
    }
    common.cookie.set(LIB_KEY + "session", JSON.stringify(sessionState), 0, config.crossSubDomain)
  },
  init: function () {
    var ds = common.cookie.get(LIB_KEY + "jssdk")
    var cs = common.cookie.get(LIB_KEY + "jssdkcross")
    var cross = null
    if (config.crossSubDomain) {
      cross = cs
      if (ds !== null) {
        common.log("在根域且子域有值，删除子域的cookie")
        // 如果是根域的，删除以前设置在子域的
        common.cookie.remove(LIB_KEY + "jssdk", false)
        common.cookie.remove(LIB_KEY + "jssdk", true)
      }
      if (cross === null && ds !== null) {
        common.log("在根域且根域没值，子域有值，根域＝子域的值", ds)
        cross = ds
      }
    } else {
      common.log("在子域")
      cross = ds
    }
    this.initSessionState()
    if (cross !== null) {
      this.toState(cross)
      // 如果是根域且根域没值
      if (config.crossSubDomain && cs === null) {
        common.log("在根域且根域没值，保存当前值到cookie中")
        this.save()
      }
    } else {
      common.log("没有值，set值")
      this.set("uniqueId", common.UUID())
    }
    // 生成本次回话的SessionID
    this.setOnce("id", common.UUID())
  }
}
module.exports = {
  getDeviceId: function () {
    return this._state.uniqueId
  },
  getSessionId: function () {
    return this._sessionState.sessionId
  },
  getDomain: function () {
    var domain = this._state.domain
    if (!domain) {
      domain = document.domain || window.location.host
      this.setOnce("domain", domain)
    }
    return domain
  },
  toState: function (ds) {
    var state = null
    if (ds !== null && (typeof (state = JSON.parse(ds)) === "object")) {
      this._state = state
    }
  },
  initSessionState: function () {
    var ds = common.cookie.get(LIB_KEY + "session")
    var state = null
    if (ds !== null && (typeof (state = JSON.parse(ds)) === "object")) {
      this._sessionState = state
    }
  },
  get: function (name) {
    return name ? this._state[name] : this._state
  },
  getSession: function (name) {
    return name ? this._sessionState[name] : this._sessionState
  },
  set: function (name, value) {
    this._state[name] = value
    this.save()
  },
  setOnce: function (name, value) {
    if (!(name in this._state)) {
      this.set(name, value)
    }
  },
  setSession: function (name, value) {
    this._sessionState[name] = value
    this.sessionSave()
  },
  setSessionOnce: function (name, value) {
    if (!(name in this._sessionState)) {
      this.setSession(name, value)
    }
  },
  // 针对当前页面修改
  change: function (name, value) {
    this._state[name] = value
  },
  sessionChange: function (name, value) {
    this._sessionState[name] = value
  },
  setSessionProps: function (newp) {
    this._setSessionProps("props", newp)
  },
  setSessionPropsOnce: function (newp) {
    this._setSessionPropsOnce("props", newp)
  },
  setSessionSubject: function (newp) {
    this._setSessionProps("subject", newp)
  },
  setSessionSubjectOnce: function (newp) {
    this._setSessionPropsOnce("subject", newp)
  },
  clearSessionSubject: function () {
    this._sessionState.subject = {}
    this.sessionSave()
  },
  setSessionObject: function (newp) {
    this._setSessionProps("object", newp)
  },
  setSessionObjectOnce: function (newp) {
    this._setSessionPropsOnce("object", newp)
  },
  clearSessionObject: function () {
    this._sessionState.object = {}
    this.sessionSave()
  },
  setProps: function (newp) {
    this._setProps("props", newp)
  },
  setPropsOnce: function (newp) {
    this._setPropsOnce("props", newp)
  },
  setSubject: function (newp) {
    this._setProps("subject", newp)
  },
  setSubjectOnce: function (newp) {
    this._setPropsOnce("subject", newp)
  },
  clearSubject: function () {
    this._state.subject = {}
    this.save()
  },
  setObject: function (newp) {
    this._setProps("subject", newp)
  },
  setObjectOnce: function (newp) {
    this._setPropsOnce("subject", newp)
  },
  clearObject: function () {
    this._state.object = {}
    this.save()
  },
  _setProps: function (objName, newp) {
    var obj = this._state[objName] || {}
    common.extend(obj, newp)
    this.set(objName, obj)
  },
  _setPropsOnce: function (objName, newp) {
    var obj = this._state[objName] || {}
    common.coverExtend(obj, newp)
    this.set(objName, obj)
  },
  _setSessionProps: function (objName, newp) {
    var obj = this._sessionState[objName] || {}
    common.extend(obj, newp)
    this.setSession(objName, obj)
  },
  _setSessionPropsOnce: function (objName, newp) {
    var obj = this._sessionState[objName] || {}
    common.coverExtend(obj, newp)
    this.setSession(objName, obj)
  },
  sessionSave: function (props) {
    if (props) {
      this._sessionState = props
    }
    common.cookie.set(LIB_KEY + "session", JSON.stringify(this._sessionState), 0, config.crossSubDomain)
  },
  save: function () {
    if (config.crossSubDomain) {
      common.cookie.set(LIB_KEY + "jssdkcross", JSON.stringify(this._state), this._state["expires"] || 730, true)
    } else {
      common.cookie.set(LIB_KEY + "jssdk", JSON.stringify(this._state), this._state["expires"] || 730, false)
    }
  },
  _sessionState: {
    props: {},
    subject: {},
    object: {}
  },
  _state: {
    props: {},
    subject: {},
    object: {}
  },
  init: function () {
    var ds = common.cookie.get(LIB_KEY + "jssdk")
    var cs = common.cookie.get(LIB_KEY + "jssdkcross")
    var cross = null
    if (config.crossSubDomain) {
      cross = cs
      if (ds !== null) {
        common.log("在根域且子域有值，删除子域的cookie")
        // 如果是根域的，删除以前设置在子域的
        common.cookie.remove(LIB_KEY + "jssdk", false)
        common.cookie.remove(LIB_KEY + "jssdk", true)
      }
      if (cross === null && ds !== null) {
        common.log("在根域且根域没值，子域有值，根域＝子域的值", ds)
        cross = ds
      }
    } else {
      common.log("在子域")
      cross = ds
    }
    this.initSessionState()
    if (cross !== null) {
      this.toState(cross)
      // 如果是根域且根域没值
      if (config.crossSubDomain && cs === null) {
        common.log("在根域且根域没值，保存当前值到cookie中")
        this.save()
      }
    } else {
      common.log("没有值，set值")
      this.set("uniqueId", common.UUID())
    }
    // 生成本次回话的SessionID
    this.setSessionOnce("sessionId", common.UUID())
  }
}

},{"./common":1,"./config":2,"./json":9}],19:[function(require,module,exports){
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* jshint evil:true */

/**
 * The Thrift namespace houses the Apache Thrift JavaScript library
 * elements providing JavaScript bindings for the Apache Thrift RPC
 * system. End users will typically only directly make use of the
 * Transport (TXHRTransport/TWebSocketTransport) and Protocol
 * (TJSONPRotocol/TBinaryProtocol) constructors.
 *
 * Object methods beginning with a __ (e.g. __onOpen()) are internal
 * and should not be called outside of the object's own methods.
 *
 * This library creates one global object: Thrift
 * Code in this library must never create additional global identifiers,
 * all features must be scoped within the Thrift namespace.
 * @namespace
 * @example
 *     var transport = new Thrift.Transport('http://localhost:8585');
 *     var protocol  = new Thrift.Protocol(transport);
 *     var client = new MyThriftSvcClient(protocol);
 *     var result = client.MyMethod();
 */
var Thrift = {
  /**
   * Thrift JavaScript library version.
   * @readonly
   * @const {string} Version
   * @memberof Thrift
   */
  Version: "1.0.0-dev",

  /**
   * Thrift IDL type string to Id mapping.
   * @readonly
   * @property {number}  STOP   - End of a set of fields.
   * @property {number}  VOID   - No value (only legal for return types).
   * @property {number}  BOOL   - True/False integer.
   * @property {number}  BYTE   - Signed 8 bit integer.
   * @property {number}  I08    - Signed 8 bit integer.
   * @property {number}  DOUBLE - 64 bit IEEE 854 floating point.
   * @property {number}  I16    - Signed 16 bit integer.
   * @property {number}  I32    - Signed 32 bit integer.
   * @property {number}  I64    - Signed 64 bit integer.
   * @property {number}  STRING - Array of bytes representing a string of characters.
   * @property {number}  UTF7   - Array of bytes representing a string of UTF7 encoded characters.
   * @property {number}  STRUCT - A multifield type.
   * @property {number}  MAP    - A collection type (map/associative-array/dictionary).
   * @property {number}  SET    - A collection type (unordered and without repeated values).
   * @property {number}  LIST   - A collection type (unordered).
   * @property {number}  UTF8   - Array of bytes representing a string of UTF8 encoded characters.
   * @property {number}  UTF16  - Array of bytes representing a string of UTF16 encoded characters.
   */
  Type: {
    STOP: 0,
    VOID: 1,
    BOOL: 2,
    BYTE: 3,
    I08: 3,
    DOUBLE: 4,
    I16: 6,
    I32: 8,
    I64: 10,
    STRING: 11,
    UTF7: 11,
    STRUCT: 12,
    MAP: 13,
    SET: 14,
    LIST: 15,
    UTF8: 16,
    UTF16: 17
  },

  /**
   * Thrift RPC message type string to Id mapping.
   * @readonly
   * @property {number}  CALL      - RPC call sent from client to server.
   * @property {number}  REPLY     - RPC call normal response from server to client.
   * @property {number}  EXCEPTION - RPC call exception response from server to client.
   * @property {number}  ONEWAY    - Oneway RPC call from client to server with no response.
   */
  MessageType: {
    CALL: 1,
    REPLY: 2,
    EXCEPTION: 3,
    ONEWAY: 4
  },

  /**
   * Utility function returning the count of an object's own properties.
   * @param {object} obj - Object to test.
   * @returns {number} number of object's own properties
   */
  objectLength: function (obj) {
    var length = 0
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        length++
      }
    }
    return length
  },

  /**
   * Utility function to establish prototype inheritance.
   * @see {@link http://javascript.crockford.com/prototypal.html|Prototypal Inheritance}
   * @param {function} constructor - Contstructor function to set as derived.
   * @param {function} superConstructor - Contstructor function to set as base.
   * @param {string} [name] - Type name to set as name property in derived prototype.
   */
  inherits: function (constructor, superConstructor, name) {
    function F () {}
    F.prototype = superConstructor.prototype
    constructor.prototype = new F()
    constructor.prototype.name = name || ""
  }
}

/**
* Initializes a Thrift TException instance.
* @constructor
* @augments Error
* @param {string} message - The TException message (distinct from the Error message).
* @classdesc TException is the base class for all Thrift exceptions types.
*/
Thrift.TException = function (message) {
  this.message = message
}
Thrift.inherits(Thrift.TException, Error, "TException")

/**
* Returns the message set on the exception.
* @readonly
* @returns {string} exception message
*/
Thrift.TException.prototype.getMessage = function () {
  return this.message
}

/**
* Thrift Application Exception type string to Id mapping.
* @readonly
* @property {number}  UNKNOWN                 - Unknown/undefined.
* @property {number}  UNKNOWN_METHOD          - Client attempted to call a method unknown to the server.
* @property {number}  INVALID_MESSAGE_TYPE    - Client passed an unknown/unsupported MessageType.
* @property {number}  WRONG_METHOD_NAME       - Unused.
* @property {number}  BAD_SEQUENCE_ID         - Unused in Thrift RPC, used to flag proprietary sequence number errors.
* @property {number}  MISSING_RESULT          - Raised by a server processor if a handler fails to supply the required return result.
* @property {number}  INTERNAL_ERROR          - Something bad happened.
* @property {number}  PROTOCOL_ERROR          - The protocol layer failed to serialize or deserialize data.
* @property {number}  INVALID_TRANSFORM       - Unused.
* @property {number}  INVALID_PROTOCOL        - The protocol (or version) is not supported.
* @property {number}  UNSUPPORTED_CLIENT_TYPE - Unused.
*/
Thrift.TApplicationExceptionType = {
  UNKNOWN: 0,
  UNKNOWN_METHOD: 1,
  INVALID_MESSAGE_TYPE: 2,
  WRONG_METHOD_NAME: 3,
  BAD_SEQUENCE_ID: 4,
  MISSING_RESULT: 5,
  INTERNAL_ERROR: 6,
  PROTOCOL_ERROR: 7,
  INVALID_TRANSFORM: 8,
  INVALID_PROTOCOL: 9,
  UNSUPPORTED_CLIENT_TYPE: 10
}

/**
* Initializes a Thrift TApplicationException instance.
* @constructor
* @augments Thrift.TException
* @param {string} message - The TApplicationException message (distinct from the Error message).
* @param {Thrift.TApplicationExceptionType} [code] - The TApplicationExceptionType code.
* @classdesc TApplicationException is the exception class used to propagate exceptions from an RPC server back to a calling client.
*/
Thrift.TApplicationException = function (message, code) {
  this.message = message
  this.code = typeof code === "number" ? code : 0
}
Thrift.inherits(Thrift.TApplicationException, Thrift.TException, "TApplicationException")

/**
* Read a TApplicationException from the supplied protocol.
* @param {object} input - The input protocol to read from.
*/
Thrift.TApplicationException.prototype.read = function (input) {
  while (1) {
    var ret = input.readFieldBegin()

    if (ret.ftype == Thrift.Type.STOP) {
      break
    }

    var fid = ret.fid

    switch (fid) {
    case 1:
      if (ret.ftype == Thrift.Type.STRING) {
        ret = input.readString()
        this.message = ret.value
      } else {
        ret = input.skip(ret.ftype)
      }
      break
    case 2:
      if (ret.ftype == Thrift.Type.I32) {
        ret = input.readI32()
        this.code = ret.value
      } else {
        ret = input.skip(ret.ftype)
      }
      break
    default:
      ret = input.skip(ret.ftype)
      break
    }

    input.readFieldEnd()
  }

  input.readStructEnd()
}

/**
* Wite a TApplicationException to the supplied protocol.
* @param {object} output - The output protocol to write to.
*/
Thrift.TApplicationException.prototype.write = function (output) {
  output.writeStructBegin("TApplicationException")

  if (this.message) {
    output.writeFieldBegin("message", Thrift.Type.STRING, 1)
    output.writeString(this.getMessage())
    output.writeFieldEnd()
  }

  if (this.code) {
    output.writeFieldBegin("type", Thrift.Type.I32, 2)
    output.writeI32(this.code)
    output.writeFieldEnd()
  }

  output.writeFieldStop()
  output.writeStructEnd()
}

/**
* Returns the application exception code set on the exception.
* @readonly
* @returns {Thrift.TApplicationExceptionType} exception code
*/
Thrift.TApplicationException.prototype.getCode = function () {
  return this.code
}

Thrift.TProtocolExceptionType = {
  UNKNOWN: 0,
  INVALID_DATA: 1,
  NEGATIVE_SIZE: 2,
  SIZE_LIMIT: 3,
  BAD_VERSION: 4,
  NOT_IMPLEMENTED: 5,
  DEPTH_LIMIT: 6
}

Thrift.TProtocolException = function TProtocolException (type, message) {
  Error.call(this)
  Error.captureStackTrace(this, this.constructor)
  this.name = this.constructor.name
  this.type = type
  this.message = message
}
Thrift.inherits(Thrift.TProtocolException, Thrift.TException, "TProtocolException")

/**
* Constructor Function for the XHR transport.
* If you do not specify a url then you must handle XHR operations on
* your own. This type can also be constructed using the Transport alias
* for backward compatibility.
* @constructor
* @param {string} [url] - The URL to connect to.
* @classdesc The Apache Thrift Transport layer performs byte level I/O
* between RPC clients and servers. The JavaScript TXHRTransport object
* uses Http[s]/XHR. Target servers must implement the http[s] transport
* (see: node.js example server_http.js).
* @example
*     var transport = new Thrift.TXHRTransport("http://localhost:8585");
*/
Thrift.Transport = Thrift.TXHRTransport = function (url, options) {
  this.url = url
  this.wpos = 0
  this.rpos = 0
  this.useCORS = (options && options.useCORS)
  this.customHeaders = options ? (options.customHeaders ? options.customHeaders : {}) : {}
  this.send_buf = ""
  this.recv_buf = ""
}

Thrift.TXHRTransport.prototype = {
  /**
   * Gets the browser specific XmlHttpRequest Object.
   * @returns {object} the browser XHR interface object
   */
  getXmlHttpRequestObject: function () {
    try { return new XMLHttpRequest() } catch (e1) { }
    try { return new ActiveXObject("Msxml2.XMLHTTP") } catch (e2) { }
    try { return new ActiveXObject("Microsoft.XMLHTTP") } catch (e3) { }

    throw "Your browser doesn't support XHR."
  },

  /**
   * Sends the current XRH request if the transport was created with a URL
   * and the async parameter is false. If the transport was not created with
   * a URL, or the async parameter is True and no callback is provided, or
   * the URL is an empty string, the current send buffer is returned.
   * @param {object} async - If true the current send buffer is returned.
   * @param {object} callback - Optional async completion callback
   * @returns {undefined|string} Nothing or the current send buffer.
   * @throws {string} If XHR fails.
   */
  flush: function (async, callback) {
    var self = this
    if ((async && !callback) || this.url === undefined || this.url === "") {
      return this.send_buf
    }

    var xreq = this.getXmlHttpRequestObject()

    if (xreq.overrideMimeType) {
      xreq.overrideMimeType("application/vnd.apache.thrift.json; charset=utf-8")
    }

    if (callback) {
      // Ignore XHR callbacks until the data arrives, then call the
      //  client's callback
      xreq.onreadystatechange =
            (function () {
              var clientCallback = callback
              return function () {
                if (this.readyState == 4 && this.status == 200) {
                  self.setRecvBuffer(this.responseText)
                  clientCallback()
                }
              }
            }())

      // detect net::ERR_CONNECTION_REFUSED and call the callback.
      xreq.onerror =
              (function () {
                var clientCallback = callback
                return function () {
                  clientCallback()
                }
              }())
    }

    xreq.open("POST", this.url, !!async)

    // add custom headers
    Object.keys(self.customHeaders).forEach(function (prop) {
      xreq.setRequestHeader(prop, self.customHeaders[prop])
    })

    if (xreq.setRequestHeader) {
      xreq.setRequestHeader("Accept", "application/vnd.apache.thrift.json; charset=utf-8")
      xreq.setRequestHeader("Content-Type", "application/vnd.apache.thrift.json; charset=utf-8")
    }

    xreq.send(this.send_buf)
    if (async && callback) {
      return
    }

    if (xreq.readyState != 4) {
      throw "encountered an unknown ajax ready state: " + xreq.readyState
    }

    if (xreq.status != 200) {
      throw "encountered a unknown request status: " + xreq.status
    }

    this.recv_buf = xreq.responseText
    this.recv_buf_sz = this.recv_buf.length
    this.wpos = this.recv_buf.length
    this.rpos = 0
  },

  /**
   * Creates a jQuery XHR object to be used for a Thrift server call.
   * @param {object} client - The Thrift Service client object generated by the IDL compiler.
   * @param {object} postData - The message to send to the server.
   * @param {function} args - The original call arguments with the success call back at the end.
   * @param {function} recv_method - The Thrift Service Client receive method for the call.
   * @returns {object} A new jQuery XHR object.
   * @throws {string} If the jQuery version is prior to 1.5 or if jQuery is not found.
   */
  jqRequest: function (client, postData, args, recv_method) {
    if (typeof jQuery === "undefined" ||
          typeof jQuery.Deferred === "undefined") {
      throw "Thrift.js requires jQuery 1.5+ to use asynchronous requests"
    }

    var thriftTransport = this

    var jqXHR = jQuery.ajax({
      url: this.url,
      data: postData,
      type: "POST",
      cache: false,
      contentType: "application/vnd.apache.thrift.json; charset=utf-8",
      dataType: "text thrift",
      converters: {
        "text thrift": function (responseData) {
          thriftTransport.setRecvBuffer(responseData)
          var value = recv_method.call(client)
          return value
        }
      },
      context: client,
      success: jQuery.makeArray(args).pop()
    })

    return jqXHR
  },

  /**
   * Sets the buffer to provide the protocol when deserializing.
   * @param {string} buf - The buffer to supply the protocol.
   */
  setRecvBuffer: function (buf) {
    this.recv_buf = buf
    this.recv_buf_sz = this.recv_buf.length
    this.wpos = this.recv_buf.length
    this.rpos = 0
  },

  /**
   * Returns true if the transport is open, XHR always returns true.
   * @readonly
   * @returns {boolean} Always True.
   */
  isOpen: function () {
    return true
  },

  /**
   * Opens the transport connection, with XHR this is a nop.
   */
  open: function () {},

  /**
   * Closes the transport connection, with XHR this is a nop.
   */
  close: function () {},

  /**
   * Returns the specified number of characters from the response
   * buffer.
   * @param {number} len - The number of characters to return.
   * @returns {string} Characters sent by the server.
   */
  read: function (len) {
    var avail = this.wpos - this.rpos

    if (avail === 0) {
      return ""
    }

    var give = len

    if (avail < len) {
      give = avail
    }

    var ret = this.read_buf.substr(this.rpos, give)
    this.rpos += give

    // clear buf when complete?
    return ret
  },

  /**
   * Returns the entire response buffer.
   * @returns {string} Characters sent by the server.
   */
  readAll: function () {
    return this.recv_buf
  },

  /**
   * Sets the send buffer to buf.
   * @param {string} buf - The buffer to send.
   */
  write: function (buf) {
    this.send_buf = buf
  },

  /**
   * Returns the send buffer.
   * @readonly
   * @returns {string} The send buffer.
   */
  getSendBuffer: function () {
    return this.send_buf
  }

}

/**
* Constructor Function for the WebSocket transport.
* @constructor
* @param {string} [url] - The URL to connect to.
* @classdesc The Apache Thrift Transport layer performs byte level I/O
* between RPC clients and servers. The JavaScript TWebSocketTransport object
* uses the WebSocket protocol. Target servers must implement WebSocket.
* (see: node.js example server_http.js).
* @example
*   var transport = new Thrift.TWebSocketTransport("http://localhost:8585");
*/
Thrift.TWebSocketTransport = function (url) {
  this.__reset(url)
}

Thrift.TWebSocketTransport.prototype = {
  __reset: function (url) {
    this.url = url // Where to connect
    this.socket = null // The web socket
    this.callbacks = [] // Pending callbacks
    this.send_pending = [] // Buffers/Callback pairs waiting to be sent
    this.send_buf = "" // Outbound data, immutable until sent
    this.recv_buf = "" // Inbound data
    this.rb_wpos = 0 // Network write position in receive buffer
    this.rb_rpos = 0 // Client read position in receive buffer
  },

  /**
   * Sends the current WS request and registers callback. The async
   * parameter is ignored (WS flush is always async) and the callback
   * function parameter is required.
   * @param {object} async - Ignored.
   * @param {object} callback - The client completion callback.
   * @returns {undefined|string} Nothing (undefined)
   */
  flush: function (async, callback) {
    var self = this
    if (this.isOpen()) {
      // Send data and register a callback to invoke the client callback
      this.socket.send(this.send_buf)
      this.callbacks.push((function () {
        var clientCallback = callback
        return function (msg) {
          self.setRecvBuffer(msg)
          clientCallback()
        }
      }()))
    } else {
      // Queue the send to go out __onOpen
      this.send_pending.push({
        buf: this.send_buf,
        cb: callback
      })
    }
  },

  __onOpen: function () {
    var self = this
    if (this.send_pending.length > 0) {
      // If the user made calls before the connection was fully
      // open, send them now
      this.send_pending.forEach(function (elem) {
        this.socket.send(elem.buf)
        this.callbacks.push((function () {
          var clientCallback = elem.cb
          return function (msg) {
            self.setRecvBuffer(msg)
            clientCallback()
          }
        }()))
      })
      this.send_pending = []
    }
  },

  __onClose: function (evt) {
    this.__reset(this.url)
  },

  __onMessage: function (evt) {
    if (this.callbacks.length) {
      this.callbacks.shift()(evt.data)
    }
  },

  __onError: function (evt) {
    console.log("Thrift WebSocket Error: " + evt.toString())
    this.socket.close()
  },

  /**
   * Sets the buffer to use when receiving server responses.
   * @param {string} buf - The buffer to receive server responses.
   */
  setRecvBuffer: function (buf) {
    this.recv_buf = buf
    this.recv_buf_sz = this.recv_buf.length
    this.wpos = this.recv_buf.length
    this.rpos = 0
  },

  /**
   * Returns true if the transport is open
   * @readonly
   * @returns {boolean}
   */
  isOpen: function () {
    return this.socket && this.socket.readyState == this.socket.OPEN
  },

  /**
   * Opens the transport connection
   */
  open: function () {
    // If OPEN/CONNECTING/CLOSING ignore additional opens
    if (this.socket && this.socket.readyState != this.socket.CLOSED) {
      return
    }
    // If there is no socket or the socket is closed:
    this.socket = new WebSocket(this.url)
    this.socket.onopen = this.__onOpen.bind(this)
    this.socket.onmessage = this.__onMessage.bind(this)
    this.socket.onerror = this.__onError.bind(this)
    this.socket.onclose = this.__onClose.bind(this)
  },

  /**
   * Closes the transport connection
   */
  close: function () {
    this.socket.close()
  },

  /**
   * Returns the specified number of characters from the response
   * buffer.
   * @param {number} len - The number of characters to return.
   * @returns {string} Characters sent by the server.
   */
  read: function (len) {
    var avail = this.wpos - this.rpos

    if (avail === 0) {
      return ""
    }

    var give = len

    if (avail < len) {
      give = avail
    }

    var ret = this.read_buf.substr(this.rpos, give)
    this.rpos += give

    // clear buf when complete?
    return ret
  },

  /**
   * Returns the entire response buffer.
   * @returns {string} Characters sent by the server.
   */
  readAll: function () {
    return this.recv_buf
  },

  /**
   * Sets the send buffer to buf.
   * @param {string} buf - The buffer to send.
   */
  write: function (buf) {
    this.send_buf = buf
  },

  /**
   * Returns the send buffer.
   * @readonly
   * @returns {string} The send buffer.
   */
  getSendBuffer: function () {
    return this.send_buf
  }

}

/**
* Initializes a Thrift JSON protocol instance.
* @constructor
* @param {Thrift.Transport} transport - The transport to serialize to/from.
* @classdesc Apache Thrift Protocols perform serialization which enables cross
* language RPC. The Protocol type is the JavaScript browser implementation
* of the Apache Thrift TJSONProtocol.
* @example
*     var protocol  = new Thrift.Protocol(transport);
*/
Thrift.TJSONProtocol = Thrift.Protocol = function (transport) {
  this.tstack = []
  this.tpos = []
  this.transport = transport
}

/**
* Thrift IDL type Id to string mapping.
* @readonly
* @see {@link Thrift.Type}
*/
Thrift.Protocol.Type = {}
Thrift.Protocol.Type[Thrift.Type.BOOL] = "\"tf\""
Thrift.Protocol.Type[Thrift.Type.BYTE] = "\"i8\""
Thrift.Protocol.Type[Thrift.Type.I16] = "\"i16\""
Thrift.Protocol.Type[Thrift.Type.I32] = "\"i32\""
Thrift.Protocol.Type[Thrift.Type.I64] = "\"i64\""
Thrift.Protocol.Type[Thrift.Type.DOUBLE] = "\"dbl\""
Thrift.Protocol.Type[Thrift.Type.STRUCT] = "\"rec\""
Thrift.Protocol.Type[Thrift.Type.STRING] = "\"str\""
Thrift.Protocol.Type[Thrift.Type.MAP] = "\"map\""
Thrift.Protocol.Type[Thrift.Type.LIST] = "\"lst\""
Thrift.Protocol.Type[Thrift.Type.SET] = "\"set\""

/**
* Thrift IDL type string to Id mapping.
* @readonly
* @see {@link Thrift.Type}
*/
Thrift.Protocol.RType = {}
Thrift.Protocol.RType.tf = Thrift.Type.BOOL
Thrift.Protocol.RType.i8 = Thrift.Type.BYTE
Thrift.Protocol.RType.i16 = Thrift.Type.I16
Thrift.Protocol.RType.i32 = Thrift.Type.I32
Thrift.Protocol.RType.i64 = Thrift.Type.I64
Thrift.Protocol.RType.dbl = Thrift.Type.DOUBLE
Thrift.Protocol.RType.rec = Thrift.Type.STRUCT
Thrift.Protocol.RType.str = Thrift.Type.STRING
Thrift.Protocol.RType.map = Thrift.Type.MAP
Thrift.Protocol.RType.lst = Thrift.Type.LIST
Thrift.Protocol.RType.set = Thrift.Type.SET

/**
* The TJSONProtocol version number.
* @readonly
* @const {number} Version
* @memberof Thrift.Protocol
*/
Thrift.Protocol.Version = 1

Thrift.Protocol.prototype = {
  /**
   * Returns the underlying transport.
   * @readonly
   * @returns {Thrift.Transport} The underlying transport.
   */
  getTransport: function () {
    return this.transport
  },

  /**
   * Serializes the beginning of a Thrift RPC message.
   * @param {string} name - The service method to call.
   * @param {Thrift.MessageType} messageType - The type of method call.
   * @param {number} seqid - The sequence number of this call (always 0 in Apache Thrift).
   */
  writeMessageBegin: function (name, messageType, seqid) {
    this.tstack = []
    this.tpos = []

    this.tstack.push([Thrift.Protocol.Version, "\"" +
          name + "\"", messageType, seqid])
  },

  /**
   * Serializes the end of a Thrift RPC message.
   */
  writeMessageEnd: function () {
    var obj = this.tstack.pop()

    this.wobj = this.tstack.pop()
    this.wobj.push(obj)

    this.wbuf = "[" + this.wobj.join(",") + "]"

    this.transport.write(this.wbuf)
  },

  /**
   * Serializes the beginning of a struct.
   * @param {string} name - The name of the struct.
   */
  writeStructBegin: function (name) {
    this.tpos.push(this.tstack.length)
    this.tstack.push({})
  },

  /**
   * Serializes the end of a struct.
   */
  writeStructEnd: function () {
    var p = this.tpos.pop()
    var struct = this.tstack[p]
    var str = "{"
    var first = true
    for (var key in struct) {
      if (first) {
        first = false
      } else {
        str += ","
      }

      str += key + ":" + struct[key]
    }

    str += "}"
    this.tstack[p] = str
  },

  /**
   * Serializes the beginning of a struct field.
   * @param {string} name - The name of the field.
   * @param {Thrift.Protocol.Type} fieldType - The data type of the field.
   * @param {number} fieldId - The field's unique identifier.
   */
  writeFieldBegin: function (name, fieldType, fieldId) {
    this.tpos.push(this.tstack.length)
    this.tstack.push({ "fieldId": "\"" +
          fieldId + "\"",
    "fieldType": Thrift.Protocol.Type[fieldType]
    })
  },

  /**
   * Serializes the end of a field.
   */
  writeFieldEnd: function () {
    var value = this.tstack.pop()
    var fieldInfo = this.tstack.pop()

    this.tstack[this.tstack.length - 1][fieldInfo.fieldId] = "{" +
          fieldInfo.fieldType + ":" + value + "}"
    this.tpos.pop()
  },

  /**
   * Serializes the end of the set of fields for a struct.
   */
  writeFieldStop: function () {
    // na
  },

  /**
   * Serializes the beginning of a map collection.
   * @param {Thrift.Type} keyType - The data type of the key.
   * @param {Thrift.Type} valType - The data type of the value.
   * @param {number} [size] - The number of elements in the map (ignored).
   */
  writeMapBegin: function (keyType, valType, size) {
    this.tpos.push(this.tstack.length)
    this.tstack.push([Thrift.Protocol.Type[keyType],
      Thrift.Protocol.Type[valType], 0])
  },

  /**
   * Serializes the end of a map.
   */
  writeMapEnd: function () {
    var p = this.tpos.pop()

    if (p == this.tstack.length) {
      return
    }

    if ((this.tstack.length - p - 1) % 2 !== 0) {
      this.tstack.push("")
    }

    var size = (this.tstack.length - p - 1) / 2

    this.tstack[p][this.tstack[p].length - 1] = size

    var map = "}"
    var first = true
    while (this.tstack.length > p + 1) {
      var v = this.tstack.pop()
      var k = this.tstack.pop()
      if (first) {
        first = false
      } else {
        map = "," + map
      }

      if (!isNaN(k)) { k = "\"" + k + "\"" } // json "keys" need to be strings
      map = k + ":" + v + map
    }
    map = "{" + map

    this.tstack[p].push(map)
    this.tstack[p] = "[" + this.tstack[p].join(",") + "]"
  },

  /**
   * Serializes the beginning of a list collection.
   * @param {Thrift.Type} elemType - The data type of the elements.
   * @param {number} size - The number of elements in the list.
   */
  writeListBegin: function (elemType, size) {
    this.tpos.push(this.tstack.length)
    this.tstack.push([Thrift.Protocol.Type[elemType], size])
  },

  /**
   * Serializes the end of a list.
   */
  writeListEnd: function () {
    var p = this.tpos.pop()

    while (this.tstack.length > p + 1) {
      var tmpVal = this.tstack[p + 1]
      this.tstack.splice(p + 1, 1)
      this.tstack[p].push(tmpVal)
    }

    this.tstack[p] = "[" + this.tstack[p].join(",") + "]"
  },

  /**
   * Serializes the beginning of a set collection.
   * @param {Thrift.Type} elemType - The data type of the elements.
   * @param {number} size - The number of elements in the list.
   */
  writeSetBegin: function (elemType, size) {
    this.tpos.push(this.tstack.length)
    this.tstack.push([Thrift.Protocol.Type[elemType], size])
  },

  /**
   * Serializes the end of a set.
   */
  writeSetEnd: function () {
    var p = this.tpos.pop()

    while (this.tstack.length > p + 1) {
      var tmpVal = this.tstack[p + 1]
      this.tstack.splice(p + 1, 1)
      this.tstack[p].push(tmpVal)
    }

    this.tstack[p] = "[" + this.tstack[p].join(",") + "]"
  },

  /** Serializes a boolean */
  writeBool: function (value) {
    this.tstack.push(value ? 1 : 0)
  },

  /** Serializes a number */
  writeByte: function (i8) {
    this.tstack.push(i8)
  },

  /** Serializes a number */
  writeI16: function (i16) {
    this.tstack.push(i16)
  },

  /** Serializes a number */
  writeI32: function (i32) {
    this.tstack.push(i32)
  },

  /** Serializes a number */
  writeI64: function (i64) {
    this.tstack.push(i64)
  },

  /** Serializes a number */
  writeDouble: function (dbl) {
    this.tstack.push(dbl)
  },

  /** Serializes a string */
  writeString: function (str) {
    // We do not encode uri components for wire transfer:
    if (str === null) {
      this.tstack.push(null)
    } else {
      // concat may be slower than building a byte buffer
      var escapedString = ""
      for (var i = 0; i < str.length; i++) {
        var ch = str.charAt(i) // a single double quote: "
        if (ch === "\"") {
          escapedString += "\\\"" // write out as: \"
        } else if (ch === "\\") { // a single backslash
          escapedString += "\\\\" // write out as double backslash
        } else if (ch === "\b") { // a single backspace: invisible
          escapedString += "\\b" // write out as: \b"
        } else if (ch === "\f") { // a single formfeed: invisible
          escapedString += "\\f" // write out as: \f"
        } else if (ch === "\n") { // a single newline: invisible
          escapedString += "\\n" // write out as: \n"
        } else if (ch === "\r") { // a single return: invisible
          escapedString += "\\r" // write out as: \r"
        } else if (ch === "\t") { // a single tab: invisible
          escapedString += "\\t" // write out as: \t"
        } else {
          escapedString += ch // Else it need not be escaped
        }
      }
      this.tstack.push("\"" + escapedString + "\"")
    }
  },

  /** Serializes a string */
  writeBinary: function (binary) {
    var str = ""
    if (typeof binary === "string") {
      str = binary
    } else if (binary instanceof Uint8Array) {
      var arr = binary
      for (var i = 0; i < arr.length; ++i) {
        str += String.fromCharCode(arr[i])
      }
    } else {
      throw new TypeError("writeBinary only accepts String or Uint8Array.")
    }
    this.tstack.push("\"" + btoa(str) + "\"")
  },

  /**
     @class
     @name AnonReadMessageBeginReturn
     @property {string} fname - The name of the service method.
     @property {Thrift.MessageType} mtype - The type of message call.
     @property {number} rseqid - The sequence number of the message (0 in Thrift RPC).
   */
  /**
   * Deserializes the beginning of a message.
   * @returns {AnonReadMessageBeginReturn}
   */
  readMessageBegin: function () {
    this.rstack = []
    this.rpos = []

    if (typeof JSON !== "undefined" && typeof JSON.parse === "function") {
      this.robj = JSON.parse(this.transport.readAll())
    } else if (typeof jQuery !== "undefined") {
      this.robj = jQuery.parseJSON(this.transport.readAll())
    } else {
      this.robj = eval(this.transport.readAll())
    }

    var r = {}
    var version = this.robj.shift()

    if (version != Thrift.Protocol.Version) {
      throw "Wrong thrift protocol version: " + version
    }

    r.fname = this.robj.shift()
    r.mtype = this.robj.shift()
    r.rseqid = this.robj.shift()

    // get to the main obj
    this.rstack.push(this.robj.shift())

    return r
  },

  /** Deserializes the end of a message. */
  readMessageEnd: function () {
  },

  /**
   * Deserializes the beginning of a struct.
   * @param {string} [name] - The name of the struct (ignored)
   * @returns {object} - An object with an empty string fname property
   */
  readStructBegin: function (name) {
    var r = {}
    r.fname = ""

    // incase this is an array of structs
    if (this.rstack[this.rstack.length - 1] instanceof Array) {
      this.rstack.push(this.rstack[this.rstack.length - 1].shift())
    }

    return r
  },

  /** Deserializes the end of a struct. */
  readStructEnd: function () {
    if (this.rstack[this.rstack.length - 2] instanceof Array) {
      this.rstack.pop()
    }
  },

  /**
     @class
     @name AnonReadFieldBeginReturn
     @property {string} fname - The name of the field (always '').
     @property {Thrift.Type} ftype - The data type of the field.
     @property {number} fid - The unique identifier of the field.
   */
  /**
   * Deserializes the beginning of a field.
   * @returns {AnonReadFieldBeginReturn}
   */
  readFieldBegin: function () {
    var r = {}

    var fid = -1
    var ftype = Thrift.Type.STOP

    // get a fieldId
    for (var f in (this.rstack[this.rstack.length - 1])) {
      if (f === null) {
        continue
      }

      fid = parseInt(f, 10)
      this.rpos.push(this.rstack.length)

      var field = this.rstack[this.rstack.length - 1][fid]

      // remove so we don't see it again
      delete this.rstack[this.rstack.length - 1][fid]

      this.rstack.push(field)

      break
    }

    if (fid != -1) {
      // should only be 1 of these but this is the only
      // way to match a key
      for (var i in (this.rstack[this.rstack.length - 1])) {
        if (Thrift.Protocol.RType[i] === null) {
          continue
        }

        ftype = Thrift.Protocol.RType[i]
        this.rstack[this.rstack.length - 1] =
                  this.rstack[this.rstack.length - 1][i]
      }
    }

    r.fname = ""
    r.ftype = ftype
    r.fid = fid

    return r
  },

  /** Deserializes the end of a field. */
  readFieldEnd: function () {
    var pos = this.rpos.pop()

    // get back to the right place in the stack
    while (this.rstack.length > pos) {
      this.rstack.pop()
    }
  },

  /**
     @class
     @name AnonReadMapBeginReturn
     @property {Thrift.Type} ktype - The data type of the key.
     @property {Thrift.Type} vtype - The data type of the value.
     @property {number} size - The number of elements in the map.
   */
  /**
   * Deserializes the beginning of a map.
   * @returns {AnonReadMapBeginReturn}
   */
  readMapBegin: function () {
    var map = this.rstack.pop()
    var first = map.shift()
    if (first instanceof Array) {
      this.rstack.push(map)
      map = first
      first = map.shift()
    }

    var r = {}
    r.ktype = Thrift.Protocol.RType[first]
    r.vtype = Thrift.Protocol.RType[map.shift()]
    r.size = map.shift()

    this.rpos.push(this.rstack.length)
    this.rstack.push(map.shift())

    return r
  },

  /** Deserializes the end of a map. */
  readMapEnd: function () {
    this.readFieldEnd()
  },

  /**
     @class
     @name AnonReadColBeginReturn
     @property {Thrift.Type} etype - The data type of the element.
     @property {number} size - The number of elements in the collection.
   */
  /**
   * Deserializes the beginning of a list.
   * @returns {AnonReadColBeginReturn}
   */
  readListBegin: function () {
    var list = this.rstack[this.rstack.length - 1]

    var r = {}
    r.etype = Thrift.Protocol.RType[list.shift()]
    r.size = list.shift()

    this.rpos.push(this.rstack.length)
    this.rstack.push(list.shift())

    return r
  },

  /** Deserializes the end of a list. */
  readListEnd: function () {
    this.readFieldEnd()
  },

  /**
   * Deserializes the beginning of a set.
   * @returns {AnonReadColBeginReturn}
   */
  readSetBegin: function (elemType, size) {
    return this.readListBegin(elemType, size)
  },

  /** Deserializes the end of a set. */
  readSetEnd: function () {
    return this.readListEnd()
  },

  /** Returns an object with a value property set to
   *  False unless the next number in the protocol buffer
   *  is 1, in which case the value property is True */
  readBool: function () {
    var r = this.readI32()

    if (r !== null && r.value == "1") {
      r.value = true
    } else {
      r.value = false
    }

    return r
  },

  /** Returns the an object with a value property set to the
      next value found in the protocol buffer */
  readByte: function () {
    return this.readI32()
  },

  /** Returns the an object with a value property set to the
      next value found in the protocol buffer */
  readI16: function () {
    return this.readI32()
  },

  /** Returns the an object with a value property set to the
      next value found in the protocol buffer */
  readI32: function (f) {
    if (f === undefined) {
      f = this.rstack[this.rstack.length - 1]
    }

    var r = {}

    if (f instanceof Array) {
      if (f.length === 0) {
        r.value = undefined
      } else {
        r.value = f.shift()
      }
    } else if (f instanceof Object) {
      for (var i in f) {
        if (i === null) {
          continue
        }
        this.rstack.push(f[i])
        delete f[i]

        r.value = i
        break
      }
    } else {
      r.value = f
      this.rstack.pop()
    }

    return r
  },

  /** Returns the an object with a value property set to the
      next value found in the protocol buffer */
  readI64: function () {
    return this.readI32()
  },

  /** Returns the an object with a value property set to the
      next value found in the protocol buffer */
  readDouble: function () {
    return this.readI32()
  },

  /** Returns the an object with a value property set to the
      next value found in the protocol buffer */
  readString: function () {
    var r = this.readI32()
    return r
  },

  /** Returns the an object with a value property set to the
      next value found in the protocol buffer */
  readBinary: function () {
    var r = this.readI32()
    r.value = atob(r.value)
    return r
  },

  /**
   * Method to arbitrarily skip over data */
  skip: function (type) {
    var ret, i
    switch (type) {
    case Thrift.Type.STOP:
      return null

    case Thrift.Type.BOOL:
      return this.readBool()

    case Thrift.Type.BYTE:
      return this.readByte()

    case Thrift.Type.I16:
      return this.readI16()

    case Thrift.Type.I32:
      return this.readI32()

    case Thrift.Type.I64:
      return this.readI64()

    case Thrift.Type.DOUBLE:
      return this.readDouble()

    case Thrift.Type.STRING:
      return this.readString()

    case Thrift.Type.STRUCT:
      this.readStructBegin()
      while (true) {
        ret = this.readFieldBegin()
        if (ret.ftype == Thrift.Type.STOP) {
          break
        }
        this.skip(ret.ftype)
        this.readFieldEnd()
      }
      this.readStructEnd()
      return null

    case Thrift.Type.MAP:
      ret = this.readMapBegin()
      for (i = 0; i < ret.size; i++) {
        if (i > 0) {
          if (this.rstack.length > this.rpos[this.rpos.length - 1] + 1) {
            this.rstack.pop()
          }
        }
        this.skip(ret.ktype)
        this.skip(ret.vtype)
      }
      this.readMapEnd()
      return null

    case Thrift.Type.SET:
      ret = this.readSetBegin()
      for (i = 0; i < ret.size; i++) {
        this.skip(ret.etype)
      }
      this.readSetEnd()
      return null

    case Thrift.Type.LIST:
      ret = this.readListBegin()
      for (i = 0; i < ret.size; i++) {
        this.skip(ret.etype)
      }
      this.readListEnd()
      return null
    }
  }
}

/**
* Initializes a MutilplexProtocol Implementation as a Wrapper for Thrift.Protocol
* @constructor
*/
Thrift.MultiplexProtocol = function (srvName, trans, strictRead, strictWrite) {
  Thrift.Protocol.call(this, trans, strictRead, strictWrite)
  this.serviceName = srvName
}
Thrift.inherits(Thrift.MultiplexProtocol, Thrift.Protocol, "multiplexProtocol")

/** Override writeMessageBegin method of prototype */
Thrift.MultiplexProtocol.prototype.writeMessageBegin = function (name, type, seqid) {
  if (type === Thrift.MessageType.CALL || type === Thrift.MessageType.ONEWAY) {
    Thrift.Protocol.prototype.writeMessageBegin.call(this, this.serviceName + ":" + name, type, seqid)
  } else {
    Thrift.Protocol.prototype.writeMessageBegin.call(this, name, type, seqid)
  }
}

Thrift.Multiplexer = function () {
  this.seqid = 0
}

/** Instantiates a multiplexed client for a specific service
* @constructor
* @param {String} serviceName - The transport to serialize to/from.
* @param {Thrift.ServiceClient} SCl - The Service Client Class
* @param {Thrift.Transport} transport - Thrift.Transport instance which provides remote host:port
* @example
*    var mp = new Thrift.Multiplexer();
*    var transport = new Thrift.Transport("http://localhost:9090/foo.thrift");
*    var protocol = new Thrift.Protocol(transport);
*    var client = mp.createClient('AuthService', AuthServiceClient, transport);
*/
Thrift.Multiplexer.prototype.createClient = function (serviceName, SCl, transport) {
  if (SCl.Client) {
    SCl = SCl.Client
  }
  var self = this
  SCl.prototype.new_seqid = function () {
    self.seqid += 1
    return self.seqid
  }
  var client = new SCl(new Thrift.MultiplexProtocol(serviceName, transport))

  return client
}

var copyList, copyMap

copyList = function (lst, types) {
  if (!lst) { return lst }

  var type

  if (types.shift === undefined) {
    type = types
  } else {
    type = types[0]
  }
  var Type = type

  var len = lst.length, result = [], i, val
  for (i = 0; i < len; i++) {
    val = lst[i]
    if (type === null) {
      result.push(val)
    } else if (type === copyMap || type === copyList) {
      result.push(type(val, types.slice(1)))
    } else {
      result.push(new Type(val))
    }
  }
  return result
}

copyMap = function (obj, types) {
  if (!obj) { return obj }

  var type

  if (types.shift === undefined) {
    type = types
  } else {
    type = types[0]
  }
  var Type = type

  var result = {}, val
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      val = obj[prop]
      if (type === null) {
        result[prop] = val
      } else if (type === copyMap || type === copyList) {
        result[prop] = type(val, types.slice(1))
      } else {
        result[prop] = new Type(val)
      }
    }
  }
  return result
}

Thrift.copyMap = copyMap
Thrift.copyList = copyList

module.exports = Thrift

},{}],20:[function(require,module,exports){
/* eslint-disable no-useless-escape */
var detector = {}

var NA_VERSION = "-1"
var win = window
var external = win.external
var userAgent = win.navigator.userAgent || ""
var appVersion = win.navigator.appVersion || ""
var vendor = win.navigator.vendor || ""

var reMsie = /\b(?:msie |ie |trident\/[0-9].*rv[ :])([0-9.]+)/
var reBlackberry10 = /\bbb10\b.+?\bversion\/([\d.]+)/
var reBlackberry67 = /\bblackberry\b.+\bversion\/([\d.]+)/
var reBlackberry45 = /\bblackberry\d+\/([\d.]+)/

function toString (object) {
  return Object.prototype.toString.call(object)
}

function isObject (object) {
  return toString(object) === "[object Object]"
}

function isFunction (object) {
  return toString(object) === "[object Function]"
}

function each (object, factory) {
  for (var i = 0, l = object.length; i < l; i++) {
    if (factory.call(object, object[i], i) === false) {
      break
    }
  }
}

// 解析使用 Trident 内核的浏览器的 `浏览器模式` 和 `文档模式` 信息。
// @param {String} ua, userAgent string.
// @return {Object}
function IEMode (ua) {
  if (!reMsie.test(ua)) {
    return null
  }

  var m,
    engineMode, engineVersion,
    browserMode, browserVersion

    // IE8 及其以上提供有 Trident 信息，
    // 默认的兼容模式，UA 中 Trident 版本不发生变化。
  if (ua.indexOf("trident/") !== -1) {
    m = /\btrident\/([0-9.]+)/.exec(ua)
    if (m && m.length >= 2) {
      // 真实引擎版本。
      engineVersion = m[1]
      var vVersion = m[1].split(".")
      vVersion[0] = parseInt(vVersion[0], 10) + 4
      browserVersion = vVersion.join(".")
    }
  }

  m = reMsie.exec(ua)
  browserMode = m[1]
  var vMode = m[1].split(".")
  if (typeof browserVersion === "undefined") {
    browserVersion = browserMode
  }
  vMode[0] = parseInt(vMode[0], 10) - 4
  engineMode = vMode.join(".")
  if (typeof engineVersion === "undefined") {
    engineVersion = engineMode
  }

  return {
    browserVersion: browserVersion,
    browserMode: browserMode,
    engineVersion: engineVersion,
    engineMode: engineMode,
    compatible: engineVersion !== engineMode
  }
}

// 针对同源的 TheWorld 和 360 的 external 对象进行检测。
// @param {String} key, 关键字，用于检测浏览器的安装路径中出现的关键字。
// @return {Undefined,Boolean,Object} 返回 undefined 或 false 表示检测未命中。
function checkTW360External (key) {
  if (!external) {
    return
  } // return undefined.
  try {
    // 360安装路径：
    // C:%5CPROGRA~1%5C360%5C360se3%5C360SE.exe
    var runpath = external.twGetRunPath.toLowerCase()
    // 360SE 3.x ~ 5.x support.
    // 暴露的 external.twGetVersion 和 external.twGetSecurityID 均为 undefined。
    // 因此只能用 try/catch 而无法使用特性判断。
    var security = external.twGetSecurityID(win)
    var version = external.twGetVersion(security)

    if (runpath && runpath.indexOf(key) === -1) {
      return false
    }
    if (version) {
      return {
        version: version
      }
    }
  } catch (ex) { /* */ }
}

// 硬件设备信息识别表达式。
// 使用数组可以按优先级排序。
var DEVICES = [
  ["nokia", function (ua) {
    // 不能将两个表达式合并，因为可能出现 "nokia; nokia 960"
    // 这种情况下会优先识别出 nokia/-1
    if (ua.indexOf("nokia ") !== -1) {
      return /\bnokia ([0-9]+)?/
    } else {
      return /\bnokia([a-z0-9]+)?/
    }
  }],
  // 三星有 Android 和 WP 设备。
  ["samsung", function (ua) {
    if (ua.indexOf("samsung") !== -1) {
      return /\bsamsung(?:[ \-](?:sgh|gt|sm))?-([a-z0-9]+)/
    } else {
      return /\b(?:sgh|sch|gt|sm)-([a-z0-9]+)/
    }
  }],
  ["wp", function (ua) {
    return ua.indexOf("windows phone ") !== -1 ||
            ua.indexOf("xblwp") !== -1 ||
            ua.indexOf("zunewp") !== -1 ||
            ua.indexOf("windows ce") !== -1
  }],
  ["pc", "windows"],
  ["ipad", "ipad"],
  // ipod 规则应置于 iphone 之前。
  ["ipod", "ipod"],
  ["iphone", /\biphone\b|\biph(\d)/],
  ["mac", "macintosh"],
  // 小米
  ["mi", /\bmi[ \-]?([a-z0-9 ]+(?= build|\)))/],
  // 红米
  ["hongmi", /\bhm[ \-]?([a-z0-9]+)/],
  ["aliyun", /\baliyunos\b(?:[\-](\d+))?/],
  ["meizu", function (ua) {
    return ua.indexOf("meizu") >= 0
      ? /\bmeizu[\/ ]([a-z0-9]+)\b/
      : /\bm([0-9cx]{1,4})\b/
  }],
  ["nexus", /\bnexus ([0-9s.]+)/],
  ["huawei", function (ua) {
    var reMediapad = /\bmediapad (.+?)(?= build\/huaweimediapad\b)/
    if (ua.indexOf("huawei-huawei") !== -1) {
      return /\bhuawei\-huawei\-([a-z0-9\-]+)/
    } else if (reMediapad.test(ua)) {
      return reMediapad
    } else {
      return /\bhuawei[ _\-]?([a-z0-9]+)/
    }
  }],
  ["lenovo", function (ua) {
    if (ua.indexOf("lenovo-lenovo") !== -1) {
      return /\blenovo\-lenovo[ \-]([a-z0-9]+)/
    } else {
      return /\blenovo[ \-]?([a-z0-9]+)/
    }
  }],
  // 中兴
  ["zte", function (ua) {
    if (/\bzte\-[tu]/.test(ua)) {
      return /\bzte-[tu][ _\-]?([a-su-z0-9\+]+)/
    } else {
      return /\bzte[ _\-]?([a-su-z0-9\+]+)/
    }
  }],
  // 步步高
  ["vivo", /\bvivo(?: ([a-z0-9]+))?/],
  ["htc", function (ua) {
    if (/\bhtc[a-z0-9 _\-]+(?= build\b)/.test(ua)) {
      return /\bhtc[ _\-]?([a-z0-9 ]+(?= build))/
    } else {
      return /\bhtc[ _\-]?([a-z0-9 ]+)/
    }
  }],
  ["oppo", /\boppo[_]([a-z0-9]+)/],
  ["konka", /\bkonka[_\-]([a-z0-9]+)/],
  ["sonyericsson", /\bmt([a-z0-9]+)/],
  ["coolpad", /\bcoolpad[_ ]?([a-z0-9]+)/],
  ["lg", /\blg[\-]([a-z0-9]+)/],
  ["android", /\bandroid\b|\badr\b/],
  ["blackberry", function (ua) {
    if (ua.indexOf("blackberry") >= 0) {
      return /\bblackberry\s?(\d+)/
    }
    return "bb10"
  }]
]

// 操作系统信息识别表达式
var OS = [
  ["wp", function (ua) {
    if (ua.indexOf("windows phone ") !== -1) {
      return /\bwindows phone (?:os )?([0-9.]+)/
    } else if (ua.indexOf("xblwp") !== -1) {
      return /\bxblwp([0-9.]+)/
    } else if (ua.indexOf("zunewp") !== -1) {
      return /\bzunewp([0-9.]+)/
    }
    return "windows phone"
  }],
  ["windows", /\bwindows nt ([0-9.]+)/],
  ["macosx", /\bmac os x ([0-9._]+)/],
  ["ios", function (ua) {
    if (/\bcpu(?: iphone)? os /.test(ua)) {
      return /\bcpu(?: iphone)? os ([0-9._]+)/
    } else if (ua.indexOf("iph os ") !== -1) {
      return /\biph os ([0-9_]+)/
    } else {
      return /\bios\b/
    }
  }],
  ["yunos", /\baliyunos ([0-9.]+)/],
  ["android", function (ua) {
    if (ua.indexOf("android") >= 0) {
      return /\bandroid[ \/-]?([0-9.x]+)?/
    } else if (ua.indexOf("adr") >= 0) {
      if (ua.indexOf("mqqbrowser") >= 0) {
        return /\badr[ ]\(linux; u; ([0-9.]+)?/
      } else {
        return /\badr(?:[ ]([0-9.]+))?/
      }
    }
    return "android"
    // return /\b(?:android|\badr)(?:[\/\- ](?:\(linux; u; )?)?([0-9.x]+)?/;
  }],
  ["chromeos", /\bcros i686 ([0-9.]+)/],
  ["linux", "linux"],
  ["windowsce", /\bwindows ce(?: ([0-9.]+))?/],
  ["symbian", /\bsymbian(?:os)?\/([0-9.]+)/],
  ["blackberry", function (ua) {
    var m = ua.match(reBlackberry10) ||
            ua.match(reBlackberry67) ||
            ua.match(reBlackberry45)
    return m ? {
      version: m[1]
    } : "blackberry"
  }]
]

// 浏览器引擎类型
var ENGINE = [
  ["edgehtml", /edge\/([0-9.]+)/],
  ["trident", reMsie],
  ["blink", function () {
    return "chrome" in win && "CSS" in win && /\bapplewebkit[\/]?([0-9.+]+)/
  }],
  ["webkit", /\bapplewebkit[\/]?([0-9.+]+)/],
  ["gecko", function (ua) {
    var match
    if ((match = ua.match(/\brv:([\d\w.]+).*\bgecko\/(\d+)/))) {
      return {
        version: match[1] + "." + match[2]
      }
    }
  }],
  ["presto", /\bpresto\/([0-9.]+)/],
  ["androidwebkit", /\bandroidwebkit\/([0-9.]+)/],
  ["coolpadwebkit", /\bcoolpadwebkit\/([0-9.]+)/],
  ["u2", /\bu2\/([0-9.]+)/],
  ["u3", /\bu3\/([0-9.]+)/]
]

// 浏览器类型
var BROWSER = [
  // Microsoft Edge Browser, Default browser in Windows 10.
  ["edge", /edge\/([0-9.]+)/],
  // Sogou.
  ["sogou", function (ua) {
    if (ua.indexOf("sogoumobilebrowser") >= 0) {
      return /sogoumobilebrowser\/([0-9.]+)/
    } else if (ua.indexOf("sogoumse") >= 0) {
      return true
    }
    return / se ([0-9.x]+)/
  }],
  // TheWorld (世界之窗)
  // 由于裙带关系，TheWorld API 与 360 高度重合。
  // 只能通过 UA 和程序安装路径中的应用程序名来区分。
  // TheWorld 的 UA 比 360 更靠谱，所有将 TheWorld 的规则放置到 360 之前。
  ["theworld", function () {
    var x = checkTW360External("theworld")
    if (typeof x !== "undefined") {
      return x
    }
    return "theworld"
  }],
  // 360SE, 360EE.
  ["360", function (ua) {
    var x = checkTW360External("360se")
    if (typeof x !== "undefined") {
      return x
    }
    if (ua.indexOf("360 aphone browser") !== -1) {
      return /\b360 aphone browser \(([^\)]+)\)/
    }
    return /\b360(?:se|ee|chrome|browser)\b/
  }],
  // Maxthon
  ["maxthon", function () {
    try {
      if (external && (external.mxVersion || external.max_version)) {
        return {
          version: external.mxVersion || external.max_version
        }
      }
    } catch (ex) { /* */ }
    return /\b(?:maxthon|mxbrowser)(?:[ \/]([0-9.]+))?/
  }],
  ["micromessenger", /\bmicromessenger\/([\d.]+)/],
  ["qq", /\bm?qqbrowser\/([0-9.]+)/],
  ["green", "greenbrowser"],
  ["tt", /\btencenttraveler ([0-9.]+)/],
  ["liebao", function (ua) {
    if (ua.indexOf("liebaofast") >= 0) {
      return /\bliebaofast\/([0-9.]+)/
    }
    if (ua.indexOf("lbbrowser") === -1) {
      return false
    }
    var version
    try {
      if (external && external.LiebaoGetVersion) {
        version = external.LiebaoGetVersion()
      }
    } catch (ex) { /* */ }
    return {
      version: version || NA_VERSION
    }
  }],
  ["tao", /\btaobrowser\/([0-9.]+)/],
  ["coolnovo", /\bcoolnovo\/([0-9.]+)/],
  ["saayaa", "saayaa"],
  // 有基于 Chromniun 的急速模式和基于 IE 的兼容模式。必须在 IE 的规则之前。
  ["baidu", /\b(?:ba?idubrowser|baiduhd)[ \/]([0-9.x]+)/],
  // 后面会做修复版本号，这里只要能识别是 IE 即可。
  ["ie", reMsie],
  ["mi", /\bmiuibrowser\/([0-9.]+)/],
  // Opera 15 之后开始使用 Chromniun 内核，需要放在 Chrome 的规则之前。
  ["opera", function (ua) {
    var reOperaOld = /\bopera.+version\/([0-9.ab]+)/
    var reOperaNew = /\bopr\/([0-9.]+)/
    return reOperaOld.test(ua) ? reOperaOld : reOperaNew
  }],
  ["oupeng", /\boupeng\/([0-9.]+)/],
  ["yandex", /yabrowser\/([0-9.]+)/],
  // 支付宝手机客户端
  ["ali-ap", function (ua) {
    if (ua.indexOf("aliapp") > 0) {
      return /\baliapp\(ap\/([0-9.]+)\)/
    } else {
      return /\balipayclient\/([0-9.]+)\b/
    }
  }],
  // 支付宝平板客户端
  ["ali-ap-pd", /\baliapp\(ap-pd\/([0-9.]+)\)/],
  // 支付宝商户客户端
  ["ali-am", /\baliapp\(am\/([0-9.]+)\)/],
  // 淘宝手机客户端
  ["ali-tb", /\baliapp\(tb\/([0-9.]+)\)/],
  // 淘宝平板客户端
  ["ali-tb-pd", /\baliapp\(tb-pd\/([0-9.]+)\)/],
  // 天猫手机客户端
  ["ali-tm", /\baliapp\(tm\/([0-9.]+)\)/],
  // 天猫平板客户端
  ["ali-tm-pd", /\baliapp\(tm-pd\/([0-9.]+)\)/],
  // UC 浏览器，可能会被识别为 Android 浏览器，规则需要前置。
  // UC 桌面版浏览器携带 Chrome 信息，需要放在 Chrome 之前。
  ["uc", function (ua) {
    if (ua.indexOf("ucbrowser/") >= 0) {
      return /\bucbrowser\/([0-9.]+)/
    } else if (ua.indexOf("ubrowser/") >= 0) {
      return /\bubrowser\/([0-9.]+)/
    } else if (/\buc\/[0-9]/.test(ua)) {
      return /\buc\/([0-9.]+)/
    } else if (ua.indexOf("ucweb") >= 0) {
      // `ucweb/2.0` is compony info.
      // `UCWEB8.7.2.214/145/800` is browser info.
      return /\bucweb([0-9.]+)?/
    } else {
      return /\b(?:ucbrowser|uc)\b/
    }
  }],
  ["chrome", / (?:chrome|crios|crmo)\/([0-9.]+)/],
  // Android 默认浏览器。该规则需要在 safari 之前。
  ["android", function (ua) {
    if (ua.indexOf("android") === -1) {
      return
    }
    return /\bversion\/([0-9.]+(?: beta)?)/
  }],
  ["blackberry", function (ua) {
    var m = ua.match(reBlackberry10) ||
            ua.match(reBlackberry67) ||
            ua.match(reBlackberry45)
    return m ? {
      version: m[1]
    } : "blackberry"
  }],
  ["safari", /\bversion\/([0-9.]+(?: beta)?)(?: mobile(?:\/[a-z0-9]+)?)? safari\//],
  // 如果不能被识别为 Safari，则猜测是 WebView。
  ["webview", /\bcpu(?: iphone)? os (?:[0-9._]+).+\bapplewebkit\b/],
  ["firefox", /\bfirefox\/([0-9.ab]+)/],
  ["nokia", /\bnokiabrowser\/([0-9.]+)/]
]

var na = {
  name: "na",
  version: NA_VERSION
}

// UserAgent Detector.
// @param {String} ua, userAgent.
// @param {Object} expression
// @return {Object}
//    返回 null 表示当前表达式未匹配成功。
function detect (name, expression, ua) {
  var expr = isFunction(expression) ? expression.call(null, ua) : expression
  if (!expr) {
    return null
  }
  var info = {
    name: name,
    version: NA_VERSION,
    codename: ""
  }
  var t = toString(expr)
  if (expr === true) {
    return info
  } else if (t === "[object String]") {
    if (ua.indexOf(expr) !== -1) {
      return info
    }
  } else if (isObject(expr)) { // Object
    if (expr.hasOwnProperty("version")) {
      info.version = expr.version
    }
    return info
  } else if (expr.exec) { // RegExp
    var m = expr.exec(ua)
    if (m) {
      if (m.length >= 2 && m[1]) {
        info.version = m[1].replace(/_/g, ".")
      } else {
        info.version = NA_VERSION
      }
      return info
    }
  }
}

// 初始化识别。
function init (ua, patterns, factory, detector) {
  var detected = na
  each(patterns, function (pattern) {
    var d = detect(pattern[0], pattern[1], ua)
    if (d) {
      detected = d
      return false
    }
  })
  factory.call(detector, detected.name, detected.version)
}

// 解析 UserAgent 字符串
// @param {String} ua, userAgent string.
// @return {Object}
var parse = function (ua) {
  ua = (ua || "").toLowerCase()
  var d = {}

  init(ua, DEVICES, function (name, version) {
    var v = parseFloat(version)
    d.device = {
      name: name,
      version: v,
      fullVersion: version
    }
    d.device[name] = v
  }, d)

  init(ua, OS, function (name, version) {
    var v = parseFloat(version)
    d.os = {
      name: name,
      version: v,
      fullVersion: version
    }
    d.os[name] = v
  }, d)

  var ieCore = IEMode(ua)

  init(ua, ENGINE, function (name, version) {
    var mode = version
    // IE 内核的浏览器，修复版本号及兼容模式。
    if (ieCore) {
      version = ieCore.engineVersion || ieCore.engineMode
      mode = ieCore.engineMode
    }
    var v = parseFloat(version)
    d.engine = {
      name: name,
      version: v,
      fullVersion: version,
      mode: parseFloat(mode),
      fullMode: mode,
      compatible: ieCore ? ieCore.compatible : false
    }
    d.engine[name] = v
  }, d)

  init(ua, BROWSER, function (name, version) {
    var mode = version
    // IE 内核的浏览器，修复浏览器版本及兼容模式。
    if (ieCore) {
      // 仅修改 IE 浏览器的版本，其他 IE 内核的版本不修改。
      if (name === "ie") {
        version = ieCore.browserVersion
      }
      mode = ieCore.browserMode
    }
    var v = parseFloat(version)
    d.browser = {
      name: name,
      version: v,
      fullVersion: version,
      mode: parseFloat(mode),
      fullMode: mode,
      compatible: ieCore ? ieCore.compatible : false
    }
    d.browser[name] = v
  }, d)

  return d
}

detector = parse(userAgent + " " + appVersion + " " + vendor)

module.exports = detector

},{}],21:[function(require,module,exports){
// Author: Awey
// email: chenwei1@rongcapital.cn
;
var __ajaxHacker = (function () {
  function isFunc (f) {
    return f && typeof f === "function"
  }

  function setReadOnlyPropsFromXhr (hajax, xhr) {
    var props = {
      UNSENT: 0,
      OPENED: 1,
      HEADERS__RECEIVED: 2,
      LOADING: 3,
      DONE: 4,
      readyState: null,
      status: 0,
      statusText: "",
      response: "",
      responseText: "",
      responseURL: "",
      responseXML: null
    }
    for (var key in props) {
      hajax[key] = props[key]
      if (xhr) {
        try {
          hajax[key] = xhr[key]
        } catch (e) {}
      }
    }
  }

  function addEventProps (xhr, isUpload) {
    xhr.onabort = null
    xhr.onerror = null
    xhr.onload = null
    xhr.onloadend = null
    xhr.onloadstart = null
    xhr.onprogress = null
    xhr.ontimeout = null
    if (!isUpload) xhr.onreadystatechange = null
    xhr.__events = {
      abort: [],
      error: [],
      load: [],
      loadend: [],
      loadstart: [],
      progress: [],
      timeout: [],
      readystatechange: []
    }
    if (!isUpload) xhr.__events.onreadystatechange = []
  }

  function initBaseEvent (_this) {
    for (var key in _this.__events) {
      _this.__events[key][0] = function () {
        setReadOnlyPropsFromXhr(_this, _this.__xhr)
      }
    }
  }

  function handleEvent (_this, type, config, isUpload) {
    var ardType = type.substring(2) // addEventListener/removeEventListener/dispatchEvent
    return function () {
      var __arguments = arguments
      var args = []
      var next = function () {
        // trigger ardType
        for (var i = 1; i < _this.__events[ardType].length; i++) {
          // if (isFunc(_this.__events[ardType][i])) _this.__events[ardType][i].apply(_this.__xhr, args)
          if (isFunc(_this.__events[ardType][i])) _this.__events[ardType][i].apply(_this, args)
        }
        // trigger onType
        if (isFunc(_this[type])) {
          // _this[type].apply(_this.__xhr, __arguments) // give xhr back when calling events
          _this[type].apply(_this, __arguments) // give xhr back when calling events
        }
      }
      // first trigger base event to change hajax status
      // _this.__events[ardType][0].apply(_this.__xhr, args)
      _this.__events[ardType][0].apply(_this, args)

      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i])
      }
      if (isFunc(config[type])) {
        args.push(next)
        // config[type].apply(_this.__xhr, args)
        config[type].apply(_this, args)
      } else {
        next()
      }
    }
  }

  function handleMethod (_this, type, args, next) {
    var _args = []
    for (var i = 0; i < args.length; i++) {
      _args.push(args[i])
    }
    _args.unshift(next)
    if (isFunc(_this.__config[type])) {
      // _this.__config[type].apply(_this.__xhr, _args)
      _this.__config[type].apply(_this, _args)
    } else {
      next()
    }
  }

  function Event () {}
  Event.prototype.addEventListener = function (type, listener, useCapture) {
    // this.__xhr.addEventListener(type, listener, useCapture)
    this.__events[type].push(listener)
  }
  Event.prototype.removeEventListener = function (type, listener, useCapture) {
    var evts = this.__events[type]
    for (var i = 0; i < evts.length; i++) {
      if (evts[i] !== listener) {
        evts.splice(i, 1)
      }
    }
  }
  Event.prototype.dispatchEvent = function (event) {
    this.__xhr.dispatchEvent(event)
  }

  function Hajax (xhr, config) {
    this.__config = config
    this.__xhr = xhr
    // props
    setReadOnlyPropsFromXhr(this)
    this.responseType = "" // r&w
    this.timeout = 0 // r&w
    this.withCredentials = false // r&w
    // events props
    addEventProps(this)
    initBaseEvent(this)
    // upload prop
    this.__upload = xhr.upload
    this.upload = new Event()
    this.upload.__xhr = this.__xhr
    addEventProps(this.upload, true)
    initBaseEvent(this.upload)
  }

  // methods
  Hajax.prototype = new Event()
  Hajax.prototype.open = function (method, url, async, user, password) {
    var _this = this
    handleMethod(_this, "beforeOpen", arguments, function () {
      _this.__xhr.open(method, url, async, user, password)
      setReadOnlyPropsFromXhr(_this, _this.__xhr)
    })
  }
  Hajax.prototype.send = function (body) {
    var that = this
    handleMethod(that, "beforeSend", arguments, function () {
      // set readable/writable props
      that.__xhr.responseType = that.__config.responseType || ""
      that.__xhr.timeout = that.__config.timeout || that.timeout
      that.__xhr.withCredentials = that.__config.withCredentials || that.withCredentials
      var key
      // set events
      for (key in that.__xhr) {
        if (/^on/g.test(key)) {
          that.__xhr[key] = handleEvent(that, key, that.__config || {})
        }
      }
      for (key in that.__upload) {
        if (/^on/g.test(key)) {
          that.__upload[key] = handleEvent(that.upload, key, that.__config.upload || {}, true)
        }
      }
      that.__xhr.send(body)
      setReadOnlyPropsFromXhr(that, that.__xhr)
    })
  }
  Hajax.prototype.abort = function () {
    var _this = this
    handleMethod(_this, "beforeAbord", arguments, function () {
      _this.__xhr.abort()
      setReadOnlyPropsFromXhr(_this, _this.__xhr)
    })
  }

  Hajax.prototype.setRequestHeader = function (name, value) {
    this.__xhr.setRequestHeader(name, value)
  }
  Hajax.prototype.getAllResponseHeaders = function () {
    this.__xhr.getAllResponseHeaders()
  }
  Hajax.prototype.overrideMimeType = function (mime) {
    this.__xhr.overrideMimeType(mime)
  }
  Hajax.prototype.getResponseHeader = function () {
    this.__xhr.getResponseHeader(name)
  }

  return function (config) {
    // XMLHttpRequest, ActiveXObject and XDomainRequest
    if (window.__XHRAlreadyModified) return false
    var XHRConstructor
    if (window.XMLHttpRequest) {
      XHRConstructor = window.XMLHttpRequest
      window.XMLHttpRequest = function (whatever) {
        return new Hajax(new XHRConstructor(), config || {})
      }
    }
    if (window.ActiveXObject) {
      XHRConstructor = window.ActiveXObject
      window.ActiveXObject = function (type) {
        if (type === "Microsoft.XMLHTTP") {
          return new Hajax(new XHRConstructor(), config || {})
        } else {
          return XHRConstructor(type)
        }
      }
    }
    if (window.XDomainRequest) {
      XHRConstructor = window.XDomainRequest
      window.XDomainRequest = function (whatever) {
        return new Hajax(new XHRConstructor(), config || {})
      }
    }
    window.__XHRAlreadyModified = true
  }
})()

module.exports = __ajaxHacker

},{}],22:[function(require,module,exports){
/*
 * @Author: jiangfeng
 * @Date: 2017-08-23 09:54:15
 * @Last Modified by: jiangfeng
 * @Last Modified time: 2017-08-23 09:54:55
 */

var xhr = require("./xhrWrap")

module.exports = xhr

},{"./xhrWrap":24}],23:[function(require,module,exports){
var config = require("../config")
var common = require("../common")
var consts = require("../consts")
var log = require("../log")
var Thrift = require("../thrift")
var kepler = require("../kepler")

/**
 * 发送XHR采集数据
 *
 * @param {any} xhr
 */
function send (xhr) {
  if (!xhr.ok) return
  log("send XHR data:")
  log(xhr)
  var transport = new Thrift.Transport("")
  var protocol = new Thrift.Protocol(transport)
  protocol.writeMessageBegin("TWebAgentAjax", Thrift.MessageType.CALL, 0)
  var entity = new kepler.TWebAgentAjax(xhr)
  var source = common.extend({}, xhr, common.info.properties())
  serialize(entity, source)
  entity.write(protocol)
  protocol.writeMessageEnd()
  var sendValue = transport.flush()
  var x = JSON.parse(sendValue)
  sendValue = JSON.stringify(x[x.length - 1])
  log(sendValue)
  var options = {
    url: config.apiHost,
    type: "POST",
    cors: true,
    data: sendValue,
    success: function (data) {
      log("事件发送返回消息错误")
    },
    error: function (xhr) {
      log(xhr.status)
      log(xhr.statusText)
    },
    complete: function () {
      log("事件发送完毕.")
    }
  }

  options.header = {}
  options.header[consts.kepler_message_type] = consts.WEB_AJAX
  options.header[consts.kepler_agent_token] = config.agentId
  options.header[consts.kepler_config_version] = config.LIB_VERSION

  common.ajax(options)
}

function sendBatch (xhrs) {
  log("send XHRS data:")
  log(xhrs)
  var transport = new Thrift.Transport("")
  var protocol = new Thrift.Protocol(transport)
  protocol.writeMessageBegin("TWebAgentAjaxBatch", Thrift.MessageType.CALL, 0)
  for (var i = 0, len = xhrs.length; i < len; i++) {
    var xhr = xhrs[i]
    var entity = new kepler.TWebAgentAjax(xhr)
    var source = common.extend({}, xhr, common.info.properties())
    serialize(entity, source)
    xhrs[i] = entity
  }
  var batch = {
    ajaxBatch: xhrs
  }
  var patch = new kepler.TWebAgentAjaxBatch(batch)
  patch.write(protocol)
  protocol.writeMessageEnd()
  var sendValue = transport.flush()
  var x = JSON.parse(sendValue)
  sendValue = JSON.stringify(x[x.length - 1])
  log(sendValue)
  var options = {
    url: config.apiHost,
    type: "POST",
    cors: true,
    data: sendValue,
    success: function (data) {
      log("事件发送返回消息错误")
    },
    error: function (xhr) {
      log(xhr.status)
      log(xhr.statusText)
    },
    complete: function () {
      log("事件发送完毕.")
    }
  }

  options.header = {}
  options.header[consts.kepler_message_type] = consts.WEB_AJAX_BATCH
  options.header[consts.kepler_agent_token] = config.agentId
  options.header[consts.kepler_config_version] = config.LIB_VERSION

  common.ajax(options)
}

function serialize (entity, obj) {
  entity.agentId = config.agentId
  entity.tierId = config.tierId
  entity.appId = config.appId
  entity.traceId = common.UUID()
  entity.urlDomain = document.domain || window.location.host
  entity.reportTime = new Date() * 1
  entity.loadedTime = obj.allTime || -1
  entity.browser = obj.browser
  entity.urlQuery = obj.page_url_path

  entity.backupProperties = {
    "os": obj.os,
    "os_version": obj.os_version,
    "device": obj.device,
    "device_version": obj.device_version,
    "browser_engine": obj.browser_engine,
    "page_title": obj.page_title,
    "page_h1": obj.page_h1,
    "page_referrer": obj.page_referrer,
    "page_url": obj.page_url,
    "page_url_path": obj.page_url_path,
    "lib": obj.lib,
    "lib_version": obj.lib_version,
    "browser_version": obj.browser_version,
    "startTime": obj.startTime,
    "endTime": obj.endTime,
    "status": obj.status || 0,
    "dataSize": obj.dataSize || 0
  }

  entity.backupQuota = {
    "screen_height": obj.screen_height,
    "screen_width": obj.screen_width
  }
}

module.exports = {
  send: send,
  sendBatch: sendBatch
}

},{"../common":1,"../config":2,"../consts":3,"../kepler":10,"../log":12,"../thrift":19}],24:[function(require,module,exports){
/*
 * @Author: jiangfeng
 * @Date: 2017-08-22 11:30:13
 * @Last Modified by: jiangfeng
 * @Last Modified time: 2017-10-17 14:28:59
 */

var config = require("../config")
var common = require("../common")
var log = require("../log")
var JSON = require("../json")
var eventEmitter = require("../eventEmitter").create()

var sender = require("./sender")
var singleEventName = "xhr-wrap"
eventEmitter.on(singleEventName, function () {
  var args = Array.prototype.splice.call(arguments, 0)
  var method = args[0]
  switch (method) {
  case "collect":
    collect(args[1])
    break
  case "send":
    send()
    break
  default:
    break
  }
})
var xhrs = []

function collect (performance) {
  if (performance.__apm_xhr__) return
  var tracingId = performance.tracingId
  var index
  for (index in xhrs) {
    if (xhrs[index] && xhrs[index].tracingId && xhrs[index].tracingId === tracingId) {
      xhrs[index] = common.extend(xhrs[index], performance)
      return
    }
  }
  log("collected a xhr :", performance)
  xhrs.push(performance)
}

/**
 * 获取返回体的数据大小
 *
 * @param {any} obj
 * @returns
 */
function getResponseSize (obj) {
  if (typeof obj === "string" && obj.length) return obj.length
  if (typeof obj !== "object") return void 0
  if (typeof ArrayBuffer !== "undefined" && obj instanceof ArrayBuffer && obj.byteLength) return obj.byteLength
  if (typeof Blob !== "undefined" && obj instanceof Blob && obj.size) return obj.size
  if (typeof FormData !== "undefined" && obj instanceof FormData) return void 0
  try {
    return JSON.stringify(obj).length
  } catch (b) {
    return void 0
  }
}

function parseXHRUrl (obj, url) {
  var parsedUrl = common.parseUrl(url)
  obj.host = parsedUrl.hostname + ":" + parsedUrl.port
  obj.pathname = parsedUrl.pathname
  obj.sameOrigin = parsedUrl.sameOrigin
}

/* function getXHRContentLength (xhr) {
  var len
  switch (xhr.contentType) {
  case "application/json":
    len = JSON.stringify(xhr.data)
    break
  }
} */

/* function onEnd (xhr) {
  var xhrParams = this.params
  var xhrMatrics = this.metrics
  if (!this.ended) {
    this.ended = true
    if (xhr.removeEventListener) {
      for (var e = 0; statusLength > e; e++) {
        xhr.removeEventListener(xhrEvents[e], this.listener, false)
      }
    }
    if (!xhrParams.aborted) {
      xhrMatrics.duration = (new Date()).getTime() - this.startTime
      if (xhr.readyState === 4) {
        xhrParams.status = xhr.status
        var resType = xhr.responseType
        var resBody = resType === "arraybuffer" || resType === "blob" || resType === "json" ? xhr.response : xhr.responseText
        var dataSize = getResponseSize(resBody)

        if (dataSize) {
          xhrMatrics.rxSize = dataSize
        }
      } else {
        xhrParams.status = 0
      }
      xhrMatrics.cbTime = this.cbTime
      if (xhrParams && xhrParams.pathname && xhrParams.pathname.indexOf("beacon/resources") < 0) {
        eventEmitter.addEventArgs("xhr", [xhrParams, xhrMatrics, this.startTime, this.creatType])
      }
    }
  }
} */
var wrapXHR = require("./ajaxHacker")
wrapXHR({
  beforeOpen: function (next, method, url, async, user, password) {
    this.performance = {
      __apm_xhr__: this.__apm_xhr__,
      method: method,
      async: async,
      user: user,
      password: password
    }
    parseXHRUrl(this.performance, url)
    eventEmitter.emit(singleEventName, ["collect", this.performance])
    // collect(this.performance)
    next()
  },
  beforeSend: function (next, body) {
    log("before send:")
    log(this)
    var tracingId = common.UUID()
    var startTime = new Date() * 1
    var contentLength = typeof body === "object" || body instanceof Array ? JSON.stringify(body).length
      : typeof body === "undefined" ? 0 : body.length
    if (config.openTracing) {
      this.setRequestHeader("type", "web-span")
      this.setRequestHeader("Kepler-TraceId", tracingId)
      this.setRequestHeader("Content-Length", contentLength)
    }
    this.performance.startTime = startTime
    this.performance.agentId = config.agentId
    this.performance.tracingId = tracingId
    this.performance.ok = false

    eventEmitter.emit(singleEventName, ["collect", this.performance])
    // collect(this.performance)
    next()
  },
  beforeAbord: function (next) {
    next()
  },
  onabord: function (e, next) {
    this.performance.status = "aborded"
    this.performance.endTime = new Date() * 1

    this.performance.ok = true

    eventEmitter.emit(singleEventName, ["collect", this.performance])
    // collect(this.performance)
    next()
  },
  onerror: function (e, next) {
    this.performance.status = "error"
    this.performance.endTime = new Date() * 1
    this.performance.ok = true
    eventEmitter.emit(singleEventName, ["collect", this.performance])
    // collect(this.performance)
    next()
  },
  onload: function (e, next) {
    next()
  },
  onloadend: function (e, next) {
    log("xhr-wrapper:onloaded", e)
    this.performance.type = "loadend"
    this.performance.statusCode = this.status
    this.performance.endTime = new Date() * 1
    this.performance.allTime = this.performance.endTime - this.performance.startTime
    this.performance.ok = true
    eventEmitter.emit(singleEventName, ["collect", this.performance])
    // collect(this.performance)
    next()
  },
  onloadstart: function (e, next) {
    next()
  },
  onprogress: function (e, next) {
    next()
  },
  ontimeout: function (e, next) {
    this.performance.type = "timeout"
    this.performance.statusCode = this.status
    this.performance.endTime = new Date() * 1
    this.performance.ok = true
    eventEmitter.emit(singleEventName, ["collect", this.performance])
    // collect(this.performance)
    next()
  },
  onreadystatechange: function (e) {
    this.performance.type = "readystatechanged"
    this.performance.endTime = new Date() * 1
    if (this.readyState === 4) {
      this.performance.status = this.status
      var resType = this.responseType
      var resBody = resType === "arraybuffer" || resType === "blob" || resType === "json" ? this.response : this.responseText
      var dataSize = getResponseSize(resBody) || 0

      if (dataSize) {
        this.performance.dataSize = dataSize
      }
      this.performance.ok = true
    } else {
      this.performance.status = 0
    }
    eventEmitter.emit(singleEventName, ["collect", this.performance])
    // collect(this.performance)
  },
  upload: {
    onprogress: function (e, next) {
      next()
    }
  }
})

/**
 * 批量发送AJAX数据
 * 判定XHR是否状态OK
 * 判断发送的数据是否已经尚未到了配置发送上限
 * 上述两个条件都满足，则可以发送
 */
function send () {
  if (xhrs && xhrs.length > 0) {
    var batch = []
    var len = xhrs.length
    while (len > 0 && batch.length < config.maxLimit) {
      var xhr = xhrs.shift()
      if (xhr.ok) {
        batch.push(xhr)
      } else {
        xhrs.push(xhr)
      }
      len--
    }
    if (batch.length > 0) {
      sender.sendBatch(batch)
    }
  }
}

setInterval(function () {
  eventEmitter.emit(singleEventName, ["send"])
}, config.transFrequency)

module.exports = eventEmitter

},{"../common":1,"../config":2,"../eventEmitter":6,"../json":9,"../log":12,"./ajaxHacker":21,"./sender":23}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9naXRsYWIvd2VicHAvbm9kZV9tb2R1bGVzLy4yLjAuMUBicm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvamlhbmdmZW5nL2RvY3MvZ2l0LXByb2plY3QvZ2l0bGFiL3dlYnBwL3NyYy9jb21tb24uanMiLCIvVXNlcnMvamlhbmdmZW5nL2RvY3MvZ2l0LXByb2plY3QvZ2l0bGFiL3dlYnBwL3NyYy9jb25maWcuanMiLCIvVXNlcnMvamlhbmdmZW5nL2RvY3MvZ2l0LXByb2plY3QvZ2l0bGFiL3dlYnBwL3NyYy9jb25zdHMuanMiLCIvVXNlcnMvamlhbmdmZW5nL2RvY3MvZ2l0LXByb2plY3QvZ2l0bGFiL3dlYnBwL3NyYy9kb20uanMiLCIvVXNlcnMvamlhbmdmZW5nL2RvY3MvZ2l0LXByb2plY3QvZ2l0bGFiL3dlYnBwL3NyYy9lcnJvci9pbmRleC5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9naXRsYWIvd2VicHAvc3JjL2V2ZW50RW1pdHRlci5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9naXRsYWIvd2VicHAvc3JjL2Zha2VfNTkyZmNhYzIuanMiLCIvVXNlcnMvamlhbmdmZW5nL2RvY3MvZ2l0LXByb2plY3QvZ2l0bGFiL3dlYnBwL3NyYy9nbG9iYWxDb250ZXh0LmpzIiwiL1VzZXJzL2ppYW5nZmVuZy9kb2NzL2dpdC1wcm9qZWN0L2dpdGxhYi93ZWJwcC9zcmMvanNvbi5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9naXRsYWIvd2VicHAvc3JjL2tlcGxlci5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9naXRsYWIvd2VicHAvc3JjL2xvY2tlci5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9naXRsYWIvd2VicHAvc3JjL2xvZy5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9naXRsYWIvd2VicHAvc3JjL21haW4uanMiLCIvVXNlcnMvamlhbmdmZW5nL2RvY3MvZ2l0LXByb2plY3QvZ2l0bGFiL3dlYnBwL3NyYy9wZXJmb3JtYW5jZS9pbmRleC5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9naXRsYWIvd2VicHAvc3JjL3BlcmZvcm1hbmNlL3BhZ2VMb2FkZXIuanMiLCIvVXNlcnMvamlhbmdmZW5nL2RvY3MvZ2l0LXByb2plY3QvZ2l0bGFiL3dlYnBwL3NyYy9wZXJmb3JtYW5jZS9wZXJmb3JtYW5jZS5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9naXRsYWIvd2VicHAvc3JjL3BlcmZvcm1hbmNlL3NlbmRlci5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9naXRsYWIvd2VicHAvc3JjL3N0b3JlLmpzIiwiL1VzZXJzL2ppYW5nZmVuZy9kb2NzL2dpdC1wcm9qZWN0L2dpdGxhYi93ZWJwcC9zcmMvdGhyaWZ0LmpzIiwiL1VzZXJzL2ppYW5nZmVuZy9kb2NzL2dpdC1wcm9qZWN0L2dpdGxhYi93ZWJwcC9zcmMvdWEuanMiLCIvVXNlcnMvamlhbmdmZW5nL2RvY3MvZ2l0LXByb2plY3QvZ2l0bGFiL3dlYnBwL3NyYy94aHIvYWpheEhhY2tlci5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9naXRsYWIvd2VicHAvc3JjL3hoci9pbmRleC5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9naXRsYWIvd2VicHAvc3JjL3hoci9zZW5kZXIuanMiLCIvVXNlcnMvamlhbmdmZW5nL2RvY3MvZ2l0LXByb2plY3QvZ2l0bGFiL3dlYnBwL3NyYy94aHIveGhyV3JhcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNXVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pnREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY29uZmlnID0gcmVxdWlyZShcIi4vY29uZmlnXCIpXG52YXIgSlNPTiA9IHJlcXVpcmUoXCIuL2pzb25cIilcbnZhciBkZXRlY3RvciA9IHJlcXVpcmUoXCIuL3VhXCIpXG5cbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlXG52YXIgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlXG52YXIgc2xpY2UgPSBBcnJheVByb3RvLnNsaWNlXG52YXIgdG9TdHJpbmcgPSBPYmpQcm90by50b1N0cmluZ1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHlcbnZhciBuYXZpZ2F0b3IgPSB3aW5kb3cubmF2aWdhdG9yXG52YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnRcbnZhciB1c2VyQWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50XG52YXIgTElCX1ZFUlNJT04gPSBjb25maWcuTElCX1ZFUlNJT05cbnZhciBuYXRpdmVGb3JFYWNoID0gQXJyYXlQcm90by5mb3JFYWNoXG52YXIgbmF0aXZlSW5kZXhPZiA9IEFycmF5UHJvdG8uaW5kZXhPZlxudmFyIG5hdGl2ZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5XG52YXIgZW1wdHlPYmogPSB7fVxudmFyIF8gPSB7fVxudmFyIGVhY2ggPSBfLmVhY2ggPSBmdW5jdGlvbiAob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICBpZiAob2JqID09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBpZiAobmF0aXZlRm9yRWFjaCAmJiBvYmouZm9yRWFjaCA9PT0gbmF0aXZlRm9yRWFjaCkge1xuICAgIG9iai5mb3JFYWNoKGl0ZXJhdG9yLCBjb250ZXh0KVxuICB9IGVsc2UgaWYgKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoaSBpbiBvYmogJiYgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpbaV0sIGksIG9iaikgPT09IGVtcHR5T2JqKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2tleV0sIGtleSwgb2JqKSA9PT0gZW1wdHlPYmopIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5fLmV4dGVuZCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgZWFjaChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgaWYgKHNvdXJjZVtwcm9wXSAhPT0gdm9pZCAwKSB7XG4gICAgICAgIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXVxuICAgICAgfVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIG9ialxufVxuXG4vLyDlpoLmnpzlt7Lnu4/mnInnmoTlsZ7mgKfkuI3opobnm5Ys5aaC5p6c5rKh5pyJ55qE5bGe5oCn5Yqg6L+b5p2lXG5fLmNvdmVyRXh0ZW5kID0gZnVuY3Rpb24gKG9iaikge1xuICBlYWNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlW3Byb3BdICE9PSB2b2lkIDAgJiYgb2JqW3Byb3BdID09PSB2b2lkIDApIHtcbiAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdXG4gICAgICB9XG4gICAgfVxuICB9KVxuICByZXR1cm4gb2JqXG59XG5cbl8uaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgQXJyYXldXCJcbn1cblxuXy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24gKGYpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gL15cXHMqXFxiZnVuY3Rpb25cXGIvLnRlc3QoZilcbiAgfSBjYXRjaCAoeCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbl8uaXNBcmd1bWVudHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiAhIShvYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmosIFwiY2FsbGVlXCIpKVxufVxuXG5fLnRvQXJyYXkgPSBmdW5jdGlvbiAoaXRlcmFibGUpIHtcbiAgaWYgKCFpdGVyYWJsZSkge1xuICAgIHJldHVybiBbXVxuICB9XG4gIGlmIChpdGVyYWJsZS50b0FycmF5KSB7XG4gICAgcmV0dXJuIGl0ZXJhYmxlLnRvQXJyYXkoKVxuICB9XG4gIGlmIChfLmlzQXJyYXkoaXRlcmFibGUpKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoaXRlcmFibGUpXG4gIH1cbiAgaWYgKF8uaXNBcmd1bWVudHMoaXRlcmFibGUpKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoaXRlcmFibGUpXG4gIH1cbiAgcmV0dXJuIF8udmFsdWVzKGl0ZXJhYmxlKVxufVxuXG5fLnZhbHVlcyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIHJlc3VsdHMgPSBbXVxuICBpZiAob2JqID09IG51bGwpIHtcbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG4gIGVhY2gob2JqLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXN1bHRzW3Jlc3VsdHMubGVuZ3RoXSA9IHZhbHVlXG4gIH0pXG4gIHJldHVybiByZXN1bHRzXG59XG5cbl8uaW5jbHVkZSA9IGZ1bmN0aW9uIChvYmosIHRhcmdldCkge1xuICB2YXIgZm91bmQgPSBmYWxzZVxuICBpZiAob2JqID09IG51bGwpIHtcbiAgICByZXR1cm4gZm91bmRcbiAgfVxuICBpZiAobmF0aXZlSW5kZXhPZiAmJiBvYmouaW5kZXhPZiA9PT0gbmF0aXZlSW5kZXhPZikge1xuICAgIHJldHVybiBvYmouaW5kZXhPZih0YXJnZXQpICE9PSAtMVxuICB9XG4gIGVhY2gob2JqLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAoZm91bmQgfHwgKGZvdW5kID0gKHZhbHVlID09PSB0YXJnZXQpKSkge1xuICAgICAgcmV0dXJuIGVtcHR5T2JqXG4gICAgfVxuICB9KVxuICByZXR1cm4gZm91bmRcbn1cblxuXy5pbmNsdWRlcyA9IGZ1bmN0aW9uIChzdHIsIG5lZWRsZSkge1xuICByZXR1cm4gc3RyLmluZGV4T2YobmVlZGxlKSAhPT0gLTFcbn1cblxuXy5hcnJheUZpbHRlciA9IGZ1bmN0aW9uIChhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xXG4gIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDBcbiAgdmFyIHJlc0luZGV4ID0gMFxuICB2YXIgcmVzdWx0ID0gW11cblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XVxuICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJlc3VsdFtyZXNJbmRleCsrXSA9IHZhbHVlXG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHRcbn1cblxuXy5pbmhlcml0ID0gZnVuY3Rpb24gKFN1YmNsYXNzLCBTdXBlckNsYXNzKSB7XG4gIFN1YmNsYXNzLnByb3RvdHlwZSA9IG5ldyBTdXBlckNsYXNzKClcbiAgU3ViY2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU3ViY2xhc3NcbiAgU3ViY2xhc3Muc3VwZXJjbGFzcyA9IFN1cGVyQ2xhc3MucHJvdG90eXBlXG4gIHJldHVybiBTdWJjbGFzc1xufVxuXG5fLmlzT2JqZWN0ID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgT2JqZWN0XVwiXG59XG5cbl8uaXNFbXB0eU9iamVjdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgaWYgKF8uaXNPYmplY3Qob2JqKSkge1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxudmFyIHJUcmltID0gL15cXHMrfFxccyskL1xuXy50cmltID0gXCJcIi50cmltID8gZnVuY3Rpb24gKHMpIHtcbiAgcmV0dXJuIHMudHJpbSgpXG59IDogZnVuY3Rpb24gKHMpIHtcbiAgcmV0dXJuIHMucmVwbGFjZShyVHJpbSlcbn1cblxuXy5pc1VuZGVmaW5lZCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwXG59XG5cbl8uaXNTdHJpbmcgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09IFwiW29iamVjdCBTdHJpbmddXCJcbn1cblxuXy5pc0RhdGUgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09IFwiW29iamVjdCBEYXRlXVwiXG59XG5cbl8uaXNCb29sZWFuID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgQm9vbGVhbl1cIlxufVxuXG5fLmlzTnVtYmVyID0gZnVuY3Rpb24gKG9iaikge1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby11c2VsZXNzLWVzY2FwZSAqL1xuICByZXR1cm4gKHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gXCJbb2JqZWN0IE51bWJlcl1cIiAmJiAvW1xcZFxcLl0rLy50ZXN0KFN0cmluZyhvYmopKSlcbn1cblxuXy5lbmNvZGVEYXRlcyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgXy5lYWNoKG9iaiwgZnVuY3Rpb24gKHYsIGspIHtcbiAgICBpZiAoXy5pc0RhdGUodikpIHtcbiAgICAgIG9ialtrXSA9IF8uZm9ybWF0RGF0ZSh2KVxuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdCh2KSkge1xuICAgICAgb2JqW2tdID0gXy5lbmNvZGVEYXRlcyh2KVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIG9ialxufVxuXG5fLmZvcm1hdERhdGUgPSBmdW5jdGlvbiAoZGF0ZSkge1xuICBmdW5jdGlvbiBwYWQgKG4pIHtcbiAgICByZXR1cm4gbiA8IDEwID8gXCIwXCIgKyBuIDogblxuICB9XG4gIHJldHVybiBbXG4gICAgZGF0ZS5nZXRGdWxsWWVhcigpLFxuICAgIFwiLVwiLFxuICAgIHBhZChkYXRlLmdldE1vbnRoKCkgKyAxKSxcbiAgICBcIi1cIixcbiAgICBwYWQoZGF0ZS5nZXREYXRlKCkpLFxuICAgIFwiVFwiLFxuICAgIHBhZChkYXRlLmdldEhvdXJzKCkpLFxuICAgIFwiOlwiLFxuICAgIHBhZChkYXRlLmdldE1pbnV0ZXMoKSksXG4gICAgXCI6XCIsXG4gICAgcGFkKGRhdGUuZ2V0U2Vjb25kcygpKSxcbiAgICBcIi5cIixcbiAgICBwYWQoZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSksXG4gICAgXCIrMDg6MDBcIlxuICBdLmpvaW4oXCJcIilcbn1cblxuXy5zZWFyY2hPYmpEYXRlID0gZnVuY3Rpb24gKG8pIHtcbiAgaWYgKF8uaXNPYmplY3QobykpIHtcbiAgICBfLmVhY2gobywgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KGEpKSB7XG4gICAgICAgIF8uc2VhcmNoT2JqRGF0ZShvW2JdKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKF8uaXNEYXRlKGEpKSB7XG4gICAgICAgICAgb1tiXSA9IF8uZm9ybWF0RGF0ZShhKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuXG5fLnV0ZjhFbmNvZGUgPSBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gIHN0cmluZyA9IChzdHJpbmcgKyBcIlwiKS5yZXBsYWNlKC9cXHJcXG4vZywgXCJcXG5cIikucmVwbGFjZSgvXFxyL2csIFwiXFxuXCIpXG5cbiAgdmFyIHV0ZnRleHQgPSBcIlwiLFxuICAgIHN0YXJ0LCBlbmRcbiAgdmFyIHN0cmluZ2wgPSAwLFxuICAgIG5cblxuICBzdGFydCA9IGVuZCA9IDBcbiAgc3RyaW5nbCA9IHN0cmluZy5sZW5ndGhcblxuICBmb3IgKG4gPSAwOyBuIDwgc3RyaW5nbDsgbisrKSB7XG4gICAgdmFyIGMxID0gc3RyaW5nLmNoYXJDb2RlQXQobilcbiAgICB2YXIgZW5jID0gbnVsbFxuXG4gICAgaWYgKGMxIDwgMTI4KSB7XG4gICAgICBlbmQrK1xuICAgIH0gZWxzZSBpZiAoKGMxID4gMTI3KSAmJiAoYzEgPCAyMDQ4KSkge1xuICAgICAgZW5jID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoYzEgPj4gNikgfCAxOTIsIChjMSAmIDYzKSB8IDEyOClcbiAgICB9IGVsc2Uge1xuICAgICAgZW5jID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoYzEgPj4gMTIpIHwgMjI0LCAoKGMxID4+IDYpICYgNjMpIHwgMTI4LCAoYzEgJiA2MykgfCAxMjgpXG4gICAgfVxuICAgIGlmIChlbmMgIT09IG51bGwpIHtcbiAgICAgIGlmIChlbmQgPiBzdGFydCkge1xuICAgICAgICB1dGZ0ZXh0ICs9IHN0cmluZy5zdWJzdHJpbmcoc3RhcnQsIGVuZClcbiAgICAgIH1cbiAgICAgIHV0ZnRleHQgKz0gZW5jXG4gICAgICBzdGFydCA9IGVuZCA9IG4gKyAxXG4gICAgfVxuICB9XG5cbiAgaWYgKGVuZCA+IHN0YXJ0KSB7XG4gICAgdXRmdGV4dCArPSBzdHJpbmcuc3Vic3RyaW5nKHN0YXJ0LCBzdHJpbmcubGVuZ3RoKVxuICB9XG5cbiAgcmV0dXJuIHV0ZnRleHRcbn1cblxuXy5kZXRlY3RvciA9IGRldGVjdG9yXG5cbl8uYmFzZTY0RW5jb2RlID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgdmFyIGI2NCA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz1cIlxuICB2YXIgbzEsIG8yLCBvMywgaDEsIGgyLCBoMywgaDQsIGJpdHMsIGkgPSAwLFxuICAgIGFjID0gMCxcbiAgICBlbmMgPSBcIlwiLFxuICAgIHRtcEFyciA9IFtdXG4gIGlmICghZGF0YSkge1xuICAgIHJldHVybiBkYXRhXG4gIH1cbiAgZGF0YSA9IF8udXRmOEVuY29kZShkYXRhKVxuICBkbyB7XG4gICAgbzEgPSBkYXRhLmNoYXJDb2RlQXQoaSsrKVxuICAgIG8yID0gZGF0YS5jaGFyQ29kZUF0KGkrKylcbiAgICBvMyA9IGRhdGEuY2hhckNvZGVBdChpKyspXG5cbiAgICBiaXRzID0gbzEgPDwgMTYgfCBvMiA8PCA4IHwgbzNcblxuICAgIGgxID0gYml0cyA+PiAxOCAmIDB4M2ZcbiAgICBoMiA9IGJpdHMgPj4gMTIgJiAweDNmXG4gICAgaDMgPSBiaXRzID4+IDYgJiAweDNmXG4gICAgaDQgPSBiaXRzICYgMHgzZlxuICAgIHRtcEFyclthYysrXSA9IGI2NC5jaGFyQXQoaDEpICsgYjY0LmNoYXJBdChoMikgKyBiNjQuY2hhckF0KGgzKSArIGI2NC5jaGFyQXQoaDQpXG4gIH0gd2hpbGUgKGkgPCBkYXRhLmxlbmd0aClcblxuICBlbmMgPSB0bXBBcnIuam9pbihcIlwiKVxuXG4gIHN3aXRjaCAoZGF0YS5sZW5ndGggJSAzKSB7XG4gIGNhc2UgMTpcbiAgICBlbmMgPSBlbmMuc2xpY2UoMCwgLTIpICsgXCI9PVwiXG4gICAgYnJlYWtcbiAgY2FzZSAyOlxuICAgIGVuYyA9IGVuYy5zbGljZSgwLCAtMSkgKyBcIj1cIlxuICAgIGJyZWFrXG4gIH1cblxuICByZXR1cm4gZW5jXG59XG5cbl8uVVVJRCA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciBUID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkID0gMSAqIG5ldyBEYXRlKCksXG4gICAgICBpID0gMFxuICAgIHdoaWxlIChkID09PSAxICogbmV3IERhdGUoKSkge1xuICAgICAgaSsrXG4gICAgfVxuICAgIHJldHVybiBkLnRvU3RyaW5nKDE2KSArIGkudG9TdHJpbmcoMTYpXG4gIH1cbiAgdmFyIFIgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMTYpLnJlcGxhY2UoXCIuXCIsIFwiXCIpXG4gIH1cbiAgdmFyIFVBID0gZnVuY3Rpb24gKG4pIHtcbiAgICB2YXIgdWEgPSB1c2VyQWdlbnQsXG4gICAgICBpLCBjaCwgYnVmZmVyID0gW10sXG4gICAgICByZXQgPSAwXG5cbiAgICBmdW5jdGlvbiB4b3IgKHJlc3VsdCwgYnl0ZUFycmF5KSB7XG4gICAgICB2YXIgaiwgdG1wID0gMFxuICAgICAgZm9yIChqID0gMDsgaiA8IGJ5dGVBcnJheS5sZW5ndGg7IGorKykge1xuICAgICAgICB0bXAgfD0gKGJ1ZmZlcltqXSA8PCBqICogOClcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQgXiB0bXBcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgdWEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoID0gdWEuY2hhckNvZGVBdChpKVxuICAgICAgYnVmZmVyLnVuc2hpZnQoY2ggJiAweEZGKVxuICAgICAgaWYgKGJ1ZmZlci5sZW5ndGggPj0gNCkge1xuICAgICAgICByZXQgPSB4b3IocmV0LCBidWZmZXIpXG4gICAgICAgIGJ1ZmZlciA9IFtdXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGJ1ZmZlci5sZW5ndGggPiAwKSB7XG4gICAgICByZXQgPSB4b3IocmV0LCBidWZmZXIpXG4gICAgfVxuXG4gICAgcmV0dXJuIHJldC50b1N0cmluZygxNilcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlID0gKHNjcmVlbi5oZWlnaHQgKiBzY3JlZW4ud2lkdGgpLnRvU3RyaW5nKDE2KVxuICAgIHJldHVybiAoVCgpICsgXCItXCIgKyBSKCkgKyBcIi1cIiArIFVBKCkgKyBcIi1cIiArIHNlICsgXCItXCIgKyBUKCkpXG4gIH1cbn0pKClcblxuXy5nZXRRdWVyeVBhcmFtID0gZnVuY3Rpb24gKHF1ZXJ5LCB1cmwsIHVuZGVjb2RlLCBpc0hhc2gpIHtcbiAgdmFyIHNlYXJjaCwgaW5kZXhcbiAgaWYgKCF1cmwgfHwgdHlwZW9mIHVybCAhPT0gXCJzdHJpbmdcIikge1xuICAgIHVybCA9IHdpbmRvdy5sb2NhdGlvbltpc0hhc2ggPyBcImhhc2hcIiA6IFwic2VhcmNoXCJdXG4gIH1cbiAgaW5kZXggPSB1cmwuaW5kZXhPZihpc0hhc2ggPyBcIiNcIiA6IFwiP1wiKVxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICBzZWFyY2ggPSBcIiZcIiArIHVybC5zbGljZShpbmRleCArIDEpXG5cbiAgcmV0dXJuIHNlYXJjaCAmJiBuZXcgUmVnRXhwKFwiJlwiICsgcXVlcnkgKyBcIj0oW14mI10qKVwiKS50ZXN0KHNlYXJjaClcbiAgICA/IHVuZGVjb2RlID8gUmVnRXhwLiQxIDogdW5lc2NhcGUoUmVnRXhwLiQxKVxuICAgIDogbnVsbFxufVxuXG5fLmNvbmNhdFF1ZXJ5UGFyYW0gPSBmdW5jdGlvbiAodXJsLCBwYXJhbUtleSwgcGFyYW1WYWx1ZSkge1xuICB2YXIgaGFzaCA9IFwiXCJcbiAgaWYgKHVybC5pbmRleE9mKFwiI1wiKSAhPT0gLTEpIHtcbiAgICBoYXNoID0gdXJsLnNwbGl0KFwiI1wiKVsxXVxuICAgIHVybCA9IHVybC5zcGxpdChcIiNcIilbMF1cbiAgfVxuICBpZiAocGFyYW1WYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtVmFsdWUgPT09IG51bGwpIHtcbiAgICBwYXJhbVZhbHVlID0gXCJcIlxuICB9XG4gIHZhciByZWdleFMgPSBcIltcXFxcPyZdXCIgKyBwYXJhbUtleSArIFwiPShbXiYjXSopXCIsXG4gICAgcmVnZXggPSBuZXcgUmVnRXhwKHJlZ2V4UyksXG4gICAgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKVxuICBpZiAocmVzdWx0cyA9PT0gbnVsbCB8fCAocmVzdWx0cyAmJiB0eXBlb2YgKHJlc3VsdHNbMV0pICE9PSBcInN0cmluZ1wiICYmIHJlc3VsdHNbMV0ubGVuZ3RoKSkge1xuICAgIGlmICh1cmwuaW5kZXhPZihcIj9cIikgIT09IC0xIHx8IHVybC5pbmRleE9mKFwiPVwiKSAhPT0gLTEpIHtcbiAgICAgIHVybCA9IHVybCArIFwiJlwiICsgcGFyYW1LZXkgKyBcIj1cIiArIHBhcmFtVmFsdWVcbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gdXJsICsgXCI/XCIgKyBwYXJhbUtleSArIFwiPVwiICsgcGFyYW1WYWx1ZVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB1cmwgPSB1cmwucmVwbGFjZShyZXN1bHRzWzBdLCByZXN1bHRzWzBdLnJlcGxhY2UocmVzdWx0c1sxXSwgcGFyYW1WYWx1ZSkpXG4gIH1cblxuICBpZiAoaGFzaCAhPT0gXCJcIikge1xuICAgIHVybCArPSBcIiNcIiArIGhhc2hcbiAgfVxuICByZXR1cm4gdXJsXG59XG5fLnBhcnNlVXJsID0gZnVuY3Rpb24gKHVybCkge1xuICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpXG4gIHZhciBsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvblxuICB2YXIgcGFyc2VkVXJsID0ge31cbiAgbGluay5ocmVmID0gdXJsXG4gIHBhcnNlZFVybC5wb3J0ID0gbGluay5wb3J0XG4gIHZhciBocmVmQXJyYXkgPSBsaW5rLmhyZWYuc3BsaXQoXCI6Ly9cIilcbiAgaWYgKCFwYXJzZWRVcmwucG9ydCAmJiBocmVmQXJyYXlbMV0pIHtcbiAgICBwYXJzZWRVcmwucG9ydCA9IGhyZWZBcnJheVsxXS5zcGxpdChcIi9cIilbMF0uc3BsaXQoXCI6XCIpWzFdXG4gIH1cbiAgaWYgKCEocGFyc2VkVXJsLnBvcnQgJiYgcGFyc2VkVXJsLnBvcnQgIT09IFwiMFwiKSkge1xuICAgIHBhcnNlZFVybC5wb3J0ID0gaHJlZkFycmF5WzBdID09PSBcImh0dHBzXCIgPyBcIjQ0M1wiIDogXCI4MFwiXG4gIH1cbiAgcGFyc2VkVXJsLmhvc3RuYW1lID0gbGluay5ob3N0bmFtZSB8fCBsb2NhdGlvbi5ob3N0bmFtZVxuICBwYXJzZWRVcmwucGF0aG5hbWUgPSBsaW5rLnBhdGhuYW1lXG4gIGlmIChwYXJzZWRVcmwucGF0aG5hbWUuY2hhckF0KDApICE9PSBcIi9cIikge1xuICAgIHBhcnNlZFVybC5wYXRobmFtZSA9IFwiL1wiICsgcGFyc2VkVXJsLnBhdGhuYW1lXG4gIH1cblxuICBwYXJzZWRVcmwuc2FtZU9yaWdpbiA9ICFsaW5rLmhvc3RuYW1lIHx8IGxpbmsuaG9zdG5hbWUgPT09IGRvY3VtZW50LmRvbWFpbiAmJiBsaW5rLnBvcnQgPT09IGxvY2F0aW9uLnBvcnQgJiYgbGluay5wcm90b2NvbCA9PT0gbG9jYXRpb24ucHJvdG9jb2xcbiAgcmV0dXJuIHBhcnNlZFVybFxufVxuXG5fLnhociA9IGZ1bmN0aW9uIChjb3JzKSB7XG4gIHZhciB4aHJcbiAgaWYgKGNvcnMpIHtcbiAgICB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHhociA9IFwid2l0aENyZWRlbnRpYWxzXCIgaW4geGhyID8geGhyIDogdHlwZW9mIFhEb21haW5SZXF1ZXN0ICE9PSBcInVuZGVmaW5lZFwiID8gbmV3IFhEb21haW5SZXF1ZXN0KCkgOiB4aHJcbiAgfVxuICBpZiAoWE1MSHR0cFJlcXVlc3QpIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gIGlmICh3aW5kb3cuQWN0aXZlWE9iamVjdCkge1xuICAgIHRyeSB7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuICAgICAgeGhyID0gbmV3IEFjdGl2ZVhPYmplY3QoXCJNc3htbDIuWE1MSFRUUFwiKVxuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuICAgICAgICB4aHIgPSBuZXcgQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxIVFRQXCIpXG4gICAgICB9IGNhdGNoIChleCkge31cbiAgICB9XG4gIH1cbiAgaWYgKCEoXCJzZXRSZXF1ZXN0SGVhZGVyXCIgaW4geGhyKSkge1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyID0gZnVuY3Rpb24gKCkge1xuXG4gICAgfVxuICB9XG4gIHhoci5fX2FwbV94aHJfXyA9IHRydWVcbiAgcmV0dXJuIHhoclxufVxuXy5hamF4ID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICBmdW5jdGlvbiBwYXJzZUpzb24gKHBhcmFtcykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShwYXJhbXMpXG4gICAgfSBjYXRjaCAodCkge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuICB9XG4gIHZhciB4aHIgPSBfLnhocihwYXJhbXMuY29ycylcblxuICBpZiAoIXBhcmFtcy50eXBlKSB7XG4gICAgcGFyYW1zLnR5cGUgPSBwYXJhbXMuZGF0YSA/IFwiUE9TVFwiIDogXCJHRVRcIlxuICB9XG5cbiAgcGFyYW1zID0gXy5leHRlbmQoe1xuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHt9LFxuICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgXy5sb2coeGhyLnN0YXR1cylcbiAgICAgIF8ubG9nKHhoci5yZWFkeVN0YXRlKVxuICAgICAgXy5sb2codGV4dFN0YXR1cylcbiAgICB9LFxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoeGhyKSB7fVxuICB9LCBwYXJhbXMpXG5cbiAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLW1peGVkLW9wZXJhdG9ycyAqL1xuICAgICAgaWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDAgfHwgeGhyLnN0YXR1cyA9PT0gMzA0KSB7XG4gICAgICAgIHBhcmFtcy5zdWNjZXNzKHBhcnNlSnNvbih4aHIucmVzcG9uc2VUZXh0KSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmFtcy5lcnJvcih4aHIpXG4gICAgICB9XG5cbiAgICAgIHBhcmFtcy5jb21wbGV0ZSh4aHIpXG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlICYmICh4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbClcbiAgICAgIHhoci5vbmxvYWQgJiYgKHhoci5vbmxvYWQgPSBudWxsKVxuICAgIH1cbiAgfVxuICB4aHIub3BlbihwYXJhbXMudHlwZSwgcGFyYW1zLnVybCwgcGFyYW1zLmFzeW5jID09PSB2b2lkIDAgPyAhMCA6IHBhcmFtcy5hc3luYylcbiAgLyogeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7ICovXG4gIGlmIChfLmlzT2JqZWN0KHBhcmFtcy5oZWFkZXIpKSB7XG4gICAgZm9yICh2YXIgaSBpbiBwYXJhbXMuaGVhZGVyKSB7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihpLCBwYXJhbXMuaGVhZGVyW2ldKVxuICAgIH1cbiAgfVxuICBpZiAocGFyYW1zLmRhdGEpIHtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlgtUmVxdWVzdGVkLVdpdGhcIiwgXCJYTUxIdHRwUmVxdWVzdFwiKVxuICAgIHBhcmFtcy5jb250ZW50VHlwZSA9PT0gXCJhcHBsaWNhdGlvbi9qc29uXCIgPyB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIikgOiB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKVxuICB9XG4gIHhoci5zZW5kKHBhcmFtcy5kYXRhIHx8IG51bGwpXG59XG5cbl8uaW5mbyA9IHtcbiAgc2VhcmNoRW5naW5lOiBmdW5jdGlvbiAocmVmZXJyZXIpIHtcbiAgICBpZiAocmVmZXJyZXIuc2VhcmNoKFwiaHR0cHM/Oi8vKC4qKWdvb2dsZS4oW14vP10qKVwiKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIFwiZ29vZ2xlXCJcbiAgICB9IGVsc2UgaWYgKHJlZmVycmVyLnNlYXJjaChcImh0dHBzPzovLyguKiliaW5nLmNvbVwiKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIFwiYmluZ1wiXG4gICAgfSBlbHNlIGlmIChyZWZlcnJlci5zZWFyY2goXCJodHRwcz86Ly8oLiopeWFob28uY29tXCIpID09PSAwKSB7XG4gICAgICByZXR1cm4gXCJ5YWhvb1wiXG4gICAgfSBlbHNlIGlmIChyZWZlcnJlci5zZWFyY2goXCJodHRwcz86Ly8oLiopZHVja2R1Y2tnby5jb21cIikgPT09IDApIHtcbiAgICAgIHJldHVybiBcImR1Y2tkdWNrZ29cIlxuICAgIH0gZWxzZSBpZiAocmVmZXJyZXIuc2VhcmNoKFwiaHR0cHM/Oi8vKC4qKXNvZ291LmNvbVwiKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIFwic29nb3VcIlxuICAgIH0gZWxzZSBpZiAocmVmZXJyZXIuc2VhcmNoKFwiaHR0cHM/Oi8vKC4qKXNvLmNvbVwiKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIFwiMzYwc29cIlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfSxcbiAgYnJvd3NlcjogZnVuY3Rpb24gKHVzZXJBZ2VudCwgdiwgb3BlcmEpIHtcbiAgICB2YXIgdmVuZG9yID0gdiB8fCBcIlwiIC8vIHZlbmRvciBpcyB1bmRlZmluZWQgZm9yIGF0IGxlYXN0IElFOVxuICAgIGlmIChvcGVyYSB8fCBfLmluY2x1ZGVzKHVzZXJBZ2VudCwgXCIgT1BSL1wiKSkge1xuICAgICAgaWYgKF8uaW5jbHVkZXModXNlckFnZW50LCBcIk1pbmlcIikpIHtcbiAgICAgICAgcmV0dXJuIFwiT3BlcmEgTWluaVwiXG4gICAgICB9XG4gICAgICByZXR1cm4gXCJPcGVyYVwiXG4gICAgfSBlbHNlIGlmICgvKEJsYWNrQmVycnl8UGxheUJvb2t8QkIxMCkvaS50ZXN0KHVzZXJBZ2VudCkpIHtcbiAgICAgIHJldHVybiBcIkJsYWNrQmVycnlcIlxuICAgIH0gZWxzZSBpZiAoXy5pbmNsdWRlcyh1c2VyQWdlbnQsIFwiSUVNb2JpbGVcIikgfHwgXy5pbmNsdWRlcyh1c2VyQWdlbnQsIFwiV1BEZXNrdG9wXCIpKSB7XG4gICAgICByZXR1cm4gXCJJbnRlcm5ldCBFeHBsb3JlciBNb2JpbGVcIlxuICAgIH0gZWxzZSBpZiAoXy5pbmNsdWRlcyh1c2VyQWdlbnQsIFwiRWRnZVwiKSkge1xuICAgICAgcmV0dXJuIFwiTWljcm9zb2Z0IEVkZ2VcIlxuICAgIH0gZWxzZSBpZiAoXy5pbmNsdWRlcyh1c2VyQWdlbnQsIFwiRkJJT1NcIikpIHtcbiAgICAgIHJldHVybiBcIkZhY2Vib29rIE1vYmlsZVwiXG4gICAgfSBlbHNlIGlmIChfLmluY2x1ZGVzKHVzZXJBZ2VudCwgXCJDaHJvbWVcIikpIHtcbiAgICAgIHJldHVybiBcIkNocm9tZVwiXG4gICAgfSBlbHNlIGlmIChfLmluY2x1ZGVzKHVzZXJBZ2VudCwgXCJDcmlPU1wiKSkge1xuICAgICAgcmV0dXJuIFwiQ2hyb21lIGlPU1wiXG4gICAgfSBlbHNlIGlmIChfLmluY2x1ZGVzKHZlbmRvciwgXCJBcHBsZVwiKSkge1xuICAgICAgaWYgKF8uaW5jbHVkZXModXNlckFnZW50LCBcIk1vYmlsZVwiKSkge1xuICAgICAgICByZXR1cm4gXCJNb2JpbGUgU2FmYXJpXCJcbiAgICAgIH1cbiAgICAgIHJldHVybiBcIlNhZmFyaVwiXG4gICAgfSBlbHNlIGlmIChfLmluY2x1ZGVzKHVzZXJBZ2VudCwgXCJBbmRyb2lkXCIpKSB7XG4gICAgICByZXR1cm4gXCJBbmRyb2lkIE1vYmlsZVwiXG4gICAgfSBlbHNlIGlmIChfLmluY2x1ZGVzKHVzZXJBZ2VudCwgXCJLb25xdWVyb3JcIikpIHtcbiAgICAgIHJldHVybiBcIktvbnF1ZXJvclwiXG4gICAgfSBlbHNlIGlmIChfLmluY2x1ZGVzKHVzZXJBZ2VudCwgXCJGaXJlZm94XCIpKSB7XG4gICAgICByZXR1cm4gXCJGaXJlZm94XCJcbiAgICB9IGVsc2UgaWYgKF8uaW5jbHVkZXModXNlckFnZW50LCBcIk1TSUVcIikgfHwgXy5pbmNsdWRlcyh1c2VyQWdlbnQsIFwiVHJpZGVudC9cIikpIHtcbiAgICAgIHJldHVybiBcIkludGVybmV0IEV4cGxvcmVyXCJcbiAgICB9IGVsc2UgaWYgKF8uaW5jbHVkZXModXNlckFnZW50LCBcIkdlY2tvXCIpKSB7XG4gICAgICByZXR1cm4gXCJNb3ppbGxhXCJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiXCJcbiAgICB9XG4gIH0sXG4gIGJyb3dzZXJWZXJzaW9uOiBmdW5jdGlvbiAodXNlckFnZW50LCB2ZW5kb3IsIG9wZXJhKSB7XG4gICAgdmFyIGJyb3dzZXIgPSBfLmluZm8uYnJvd3Nlcih1c2VyQWdlbnQsIHZlbmRvciwgb3BlcmEpXG4gICAgdmFyIHZlcnNpb25SZWdleHMgPSB7XG4gICAgICBcIkludGVybmV0IEV4cGxvcmVyIE1vYmlsZVwiOiAvcnY6KFxcZCsoXFwuXFxkKyk/KS8sXG4gICAgICBcIk1pY3Jvc29mdCBFZGdlXCI6IC9FZGdlXFwvKFxcZCsoXFwuXFxkKyk/KS8sXG4gICAgICBcIkNocm9tZVwiOiAvQ2hyb21lXFwvKFxcZCsoXFwuXFxkKyk/KS8sXG4gICAgICBcIkNocm9tZSBpT1NcIjogL0Nocm9tZVxcLyhcXGQrKFxcLlxcZCspPykvLFxuICAgICAgXCJTYWZhcmlcIjogL1ZlcnNpb25cXC8oXFxkKyhcXC5cXGQrKT8pLyxcbiAgICAgIFwiTW9iaWxlIFNhZmFyaVwiOiAvVmVyc2lvblxcLyhcXGQrKFxcLlxcZCspPykvLFxuICAgICAgXCJPcGVyYVwiOiAvKE9wZXJhfE9QUilcXC8oXFxkKyhcXC5cXGQrKT8pLyxcbiAgICAgIFwiRmlyZWZveFwiOiAvRmlyZWZveFxcLyhcXGQrKFxcLlxcZCspPykvLFxuICAgICAgXCJLb25xdWVyb3JcIjogL0tvbnF1ZXJvcjooXFxkKyhcXC5cXGQrKT8pLyxcbiAgICAgIFwiQmxhY2tCZXJyeVwiOiAvQmxhY2tCZXJyeSAoXFxkKyhcXC5cXGQrKT8pLyxcbiAgICAgIFwiQW5kcm9pZCBNb2JpbGVcIjogL2FuZHJvaWRcXHMoXFxkKyhcXC5cXGQrKT8pLyxcbiAgICAgIFwiSW50ZXJuZXQgRXhwbG9yZXJcIjogLyhydjp8TVNJRSApKFxcZCsoXFwuXFxkKyk/KS8sXG4gICAgICBcIk1vemlsbGFcIjogL3J2OihcXGQrKFxcLlxcZCspPykvXG4gICAgfVxuICAgIHZhciByZWdleCA9IHZlcnNpb25SZWdleHNbYnJvd3Nlcl1cbiAgICBpZiAocmVnZXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgdmFyIG1hdGNoZXMgPSB1c2VyQWdlbnQubWF0Y2gocmVnZXgpXG4gICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICByZXR1cm4gU3RyaW5nKHBhcnNlRmxvYXQobWF0Y2hlc1ttYXRjaGVzLmxlbmd0aCAtIDJdKSlcbiAgfSxcbiAgb3M6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSA9IHVzZXJBZ2VudFxuICAgIGlmICgvV2luZG93cy9pLnRlc3QoYSkpIHtcbiAgICAgIGlmICgvUGhvbmUvLnRlc3QoYSkpIHtcbiAgICAgICAgcmV0dXJuIFwiV2luZG93cyBNb2JpbGVcIlxuICAgICAgfVxuICAgICAgcmV0dXJuIFwiV2luZG93c1wiXG4gICAgfSBlbHNlIGlmICgvKGlQaG9uZXxpUGFkfGlQb2QpLy50ZXN0KGEpKSB7XG4gICAgICByZXR1cm4gXCJpT1NcIlxuICAgIH0gZWxzZSBpZiAoL0FuZHJvaWQvLnRlc3QoYSkpIHtcbiAgICAgIHJldHVybiBcIkFuZHJvaWRcIlxuICAgIH0gZWxzZSBpZiAoLyhCbGFja0JlcnJ5fFBsYXlCb29rfEJCMTApL2kudGVzdChhKSkge1xuICAgICAgcmV0dXJuIFwiQmxhY2tCZXJyeVwiXG4gICAgfSBlbHNlIGlmICgvTWFjL2kudGVzdChhKSkge1xuICAgICAgcmV0dXJuIFwiTWFjIE9TIFhcIlxuICAgIH0gZWxzZSBpZiAoL0xpbnV4Ly50ZXN0KGEpKSB7XG4gICAgICByZXR1cm4gXCJMaW51eFwiXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIlwiXG4gICAgfVxuICB9LFxuICBkZXZpY2U6IGZ1bmN0aW9uICh1c2VyQWdlbnQpIHtcbiAgICBpZiAoL2lQYWQvLnRlc3QodXNlckFnZW50KSkge1xuICAgICAgcmV0dXJuIFwiaVBhZFwiXG4gICAgfSBlbHNlIGlmICgvaVBvZC9pLnRlc3QodXNlckFnZW50KSkge1xuICAgICAgcmV0dXJuIFwiaVBvZFwiXG4gICAgfSBlbHNlIGlmICgvaVBob25lL2kudGVzdCh1c2VyQWdlbnQpKSB7XG4gICAgICByZXR1cm4gXCJpUGhvbmVcIlxuICAgIH0gZWxzZSBpZiAoLyhCbGFja0JlcnJ5fFBsYXlCb29rfEJCMTApL2kudGVzdCh1c2VyQWdlbnQpKSB7XG4gICAgICByZXR1cm4gXCJCbGFja0JlcnJ5XCJcbiAgICB9IGVsc2UgaWYgKC9XaW5kb3dzIFBob25lL2kudGVzdCh1c2VyQWdlbnQpKSB7XG4gICAgICByZXR1cm4gXCJXaW5kb3dzIFBob25lXCJcbiAgICB9IGVsc2UgaWYgKC9XaW5kb3dzL2kudGVzdCh1c2VyQWdlbnQpKSB7XG4gICAgICByZXR1cm4gXCJXaW5kb3dzXCJcbiAgICB9IGVsc2UgaWYgKC9NYWNpbnRvc2gvaS50ZXN0KHVzZXJBZ2VudCkpIHtcbiAgICAgIHJldHVybiBcIk1hY2ludG9zaFwiXG4gICAgfSBlbHNlIGlmICgvQW5kcm9pZC9pLnRlc3QodXNlckFnZW50KSkge1xuICAgICAgcmV0dXJuIFwiQW5kcm9pZFwiXG4gICAgfSBlbHNlIGlmICgvTGludXgvaS50ZXN0KHVzZXJBZ2VudCkpIHtcbiAgICAgIHJldHVybiBcIkxpbnV4XCJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiXCJcbiAgICB9XG4gIH0sXG4gIHJlZmVycmluZ0RvbWFpbjogZnVuY3Rpb24gKHJlZmVycmVyKSB7XG4gICAgdmFyIHNwbGl0ID0gcmVmZXJyZXIuc3BsaXQoXCIvXCIpXG4gICAgaWYgKHNwbGl0Lmxlbmd0aCA+PSAzKSB7XG4gICAgICByZXR1cm4gc3BsaXRbMl1cbiAgICB9XG4gICAgcmV0dXJuIFwiXCJcbiAgfSxcbiAgZ2V0QnJvd3NlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBicm93c2VyOiBkZXRlY3Rvci5icm93c2VyLm5hbWUsXG4gICAgICBicm93c2VyX3ZlcnNpb246IFN0cmluZyhkZXRlY3Rvci5icm93c2VyLnZlcnNpb24pXG4gICAgfVxuICB9LFxuICBnZXRXaW5kb3c6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgd2luV2lkdGgsIHdpbkhlaWdodFxuICAgIC8vIOiOt+WPlueql+WPo+WuveW6plxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCkgeyB3aW5XaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIH0gZWxzZSBpZiAoZG9jdW1lbnQuYm9keSAmJiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoKSB7IHdpbldpZHRoID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCB9XG4gICAgLy8g6I635Y+W56qX5Y+j6auY5bqmXG4gICAgaWYgKHdpbmRvdy5pbm5lckhlaWdodCkgeyB3aW5IZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgfSBlbHNlIGlmIChkb2N1bWVudC5ib2R5ICYmIGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0KSB7IHdpbkhlaWdodCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0IH1cbiAgICAvLyDpgJrov4fmt7HlhaUgRG9jdW1lbnQg5YaF6YOo5a+5IGJvZHkg6L+b6KGM5qOA5rWL77yM6I635Y+W56qX5Y+j5aSn5bCPXG4gICAgaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCkge1xuICAgICAgd2luSGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxuICAgICAgd2luV2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHdpbl93aWR0aDogd2luV2lkdGgsXG4gICAgICB3aW5faGVpZ2h0OiB3aW5IZWlnaHRcbiAgICB9XG4gIH0sXG4gIHByb3BlcnRpZXM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaDFzID0gZG9jdW1lbnQuYm9keSAmJiBkb2N1bWVudC5ib2R5LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaDFcIiksXG4gICAgICBwYWdlSDEgPSBcIlwiXG5cbiAgICBpZiAoaDFzICYmIGgxcy5sZW5ndGggJiYgaDFzLmxlbmd0aCA+IDApIHtcbiAgICAgIHBhZ2VIMSA9IGgxc1swXS5pbm5lclRleHQgfHwgaDFzLnRleHRDb250ZW50IHx8IFwiXCJcbiAgICB9XG4gICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB7XG4gICAgICBvczogZGV0ZWN0b3Iub3MubmFtZSxcbiAgICAgIG9zX3ZlcnNpb246IGRldGVjdG9yLm9zLmZ1bGxWZXJzaW9uLFxuICAgICAgZGV2aWNlOiBkZXRlY3Rvci5kZXZpY2UubmFtZSxcbiAgICAgIGRldmljZV92ZXJzaW9uOiBkZXRlY3Rvci5kZXZpY2UuZnVsbFZlcnNpb25cbiAgICB9LCB7XG4gICAgICBicm93c2VyX2VuZ2luZTogZGV0ZWN0b3IuZW5naW5lLm5hbWUsXG4gICAgICBzY3JlZW5faGVpZ2h0OiBzY3JlZW4uaGVpZ2h0LFxuICAgICAgc2NyZWVuX3dpZHRoOiBzY3JlZW4ud2lkdGgsXG4gICAgICBwYWdlX3RpdGxlOiBkb2N1bWVudC50aXRsZSxcbiAgICAgIHBhZ2VfaDE6IHBhZ2VIMSxcbiAgICAgIHBhZ2VfcmVmZXJyZXI6IGRvY3VtZW50LnJlZmVycmVyLFxuICAgICAgcGFnZV91cmw6IGxvY2F0aW9uLmhyZWYsXG4gICAgICBwYWdlX3VybF9wYXRoOiBsb2NhdGlvbi5wYXRobmFtZSxcbiAgICAgIGxpYjogXCJqc1wiLFxuICAgICAgbGliX3ZlcnNpb246IExJQl9WRVJTSU9OXG4gICAgfSwgXy5pbmZvLmdldEJyb3dzZXIoKSlcbiAgfSxcbiAgLy8g5L+d5a2Y5Li05pe255qE5LiA5Lqb5Y+Y6YeP77yM5Y+q6ZKI5a+55b2T5YmN6aG16Z2i5pyJ5pWIXG4gIGN1cnJlbnRQcm9wczoge30sXG4gIHJlZ2lzdGVyOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgXy5leHRlbmQoXy5pbmZvLmN1cnJlbnRQcm9wcywgb2JqKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX1xuIiwiLyoqXG4gKiBAYXV0aG9yIGppYW5nZmVuZ1xuICogQHN1bW1hcnkgU0RL5Z+656GA6YWN572uXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuICBMSUJfVkVSU0lPTjogXCIxLjAuMFwiLCAvLyBTREvniYjmnKxcbiAgTElCX0tFWTogXCJSWEFQTTIwMTcwOFwiLCAvLyDkuI5TREvlronoo4Xml7bnmoRLZXnlr7nlupRcbiAgbWF4TGltaXQ6IDEwLCAvLyDlj5HpgIHpmZDliLbvvIzlpJrkuo7lvZPliY3orr7nva7mnaHmlbDvvIzlsLHkvJrlj5HpgIHkuovku7ZcbiAgY3Jvc3NTdWJEb21haW46IHRydWUsIC8vIOaYr+WQpui3qOWfn1xuICBsb2FkVGltZTogbmV3IERhdGUoKSwgLy8gU0RL5Yqg6L295pe26Ze0XG4gIGFwaUhvc3Q6IFwiaHR0cDovLzE3Mi4xNi4xMi4xODc6ODA5OVwiLFxuICBvQXV0aDogZmFsc2UsXG4gIGFnZW50SWQ6IFwiMzVcIlxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHBhZ2VMb2FkZXJfbG9hZGVkOiBcInBhZ2VMb2FkZXJfbG9hZGVkXCIsXG4gIHBhZ2VMb2FkZXJfZG9tbG9hZGluZzogXCJwYWdlTG9hZGVyX2RvbWxvYWRpbmdcIixcbiAga2VwbGVyX21lc3NhZ2VfdHlwZTogXCJLZXBsZXItTWVzc2FnZS1UeXBlXCIsXG4gIGtlcGxlcl9hZ2VudF90b2tlbjogXCJLZXBsZXItQWdlbnQtVG9rZW5cIixcbiAga2VwbGVyX2NvbmZpZ192ZXJzaW9uOiBcIktlcGxlci1Db25maWctVmVyc2lvblwiLFxuICBXRUJfRVJST1I6IFwiV0VCX0VSUk9SXCIsXG4gIFdFQl9MT0FEX0JBVENIOiBcIldFQl9MT0FEX0JBVENIXCIsXG4gIFdFQl9BSkFYX0JBVENIOiBcIldFQl9BSkFYX0JBVENIXCJcbn1cbiIsInZhciBfID0gcmVxdWlyZShcIi4vY29tbW9uXCIpXG52YXIgSlNPTiA9IHJlcXVpcmUoXCIuL2pzb25cIilcblxudmFyIEhUTUwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHJMaW5rQnV0dG9uID0gL14oQXxCVVRUT04pJC9cbnZhciBkb20gPSB7XG4gIC8vIOWFg+e0oOazqOWGjOS6i+S7tlxuICAvLyBlbGVtIHtET01FbGVtZW50fVxuICAvLyBldmVudFR5cGUge1N0cmluZ31cbiAgLy8gZm4ge0Z1bmN0aW9ufVxuICAvLyByZXR1cm4ge3VuZGVmaW5lZH1cbiAgYWRkRXZlbnQ6IHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgPyBmdW5jdGlvbiAoZWxlbSwgZXZlbnRUeXBlLCBmbikge1xuICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgZm4sIHRydWUpXG4gICAgfVxuICAgIDogZnVuY3Rpb24gKGVsZW0sIGV2ZW50VHlwZSwgZm4pIHtcbiAgICAgIGVsZW0uYXR0YWNoRXZlbnQoXCJvblwiICsgZXZlbnRUeXBlLCBmbilcbiAgICB9LFxuXG4gIGlubmVyVGV4dDogXCJpbm5lclRleHRcIiBpbiBIVE1MXG4gICAgPyBmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgcmV0dXJuIGVsZW0uaW5uZXJUZXh0XG4gICAgfVxuICAgIDogZnVuY3Rpb24gKGVsZW0pIHtcbiAgICAgIHJldHVybiBlbGVtLnRleHRDb250ZW50XG4gICAgfSxcblxuICAvLyDku47kuIDkuKrlhYPntKDoh6rouqvlvIDlp4vvvIzlkJHkuIrmn6Xmib7kuIDkuKrljLnphY3mjIflrprmoIfnrb7nmoTlhYPntKBcbiAgLy8gZWxlbSB7RE9NRWxlbWVudH1cbiAgLy8gdGFnTmFtZSB7U3RyaW5nfVxuICAvLyByb290IHtET01FbGVtZW50fSDlj6/mjIflrprnmoTmoLnlhYPntKBcbiAgLy8gcmV0dXJuIHtET01FbGVtZW50fHVuZGVmaW5lZH1cbiAgaUFuY2VzdG9yVGFnOiBmdW5jdGlvbiAoZWxlbSwgdGFnTmFtZSwgcm9vdCkge1xuICAgIHRhZ05hbWUudGVzdCB8fCAodGFnTmFtZSA9IHRhZ05hbWUudG9VcHBlckNhc2UoKSlcbiAgICByb290IHx8IChyb290ID0gZG9jdW1lbnQpXG4gICAgZG8ge1xuICAgICAgaWYgKHRhZ05hbWUudGVzdCA/IHRhZ05hbWUudGVzdChlbGVtLnRhZ05hbWUpIDogZWxlbS50YWdOYW1lID09PSB0YWdOYW1lKSB7IHJldHVybiBlbGVtIH1cbiAgICB9IHdoaWxlIChlbGVtICE9PSByb290ICYmIChlbGVtID0gZWxlbS5wYXJlbnROb2RlKSlcbiAgfSxcblxuICAvLyDmjInpkq7nsbvlnotCb29sZWFu6KGoXG4gIEJVVFRPTl9UWVBFOiB7XG4gICAgYnV0dG9uOiAhMCxcbiAgICBpbWFnZTogITAsIC8vIOWbvuWDj+aMiemSrlxuICAgIHN1Ym1pdDogITAsXG4gICAgcmVzZXQ6ICEwXG4gIH0sXG5cbiAgLy8g6I635Y+W54K55Ye75LqL5Lu255qE6aKE572u5L+h5oGvXG4gIC8vIGVsZW0ge0RPTUV2ZW50fVxuICAvLyByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9XG4gIGdldENsaWNrUHJlc2V0OiBmdW5jdGlvbiAoZSkge1xuICAgIGUgfHwgKGUgPSB3aW5kb3cuZXZlbnQpXG4gICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudCxcbiAgICAgIHRhZ05hbWUgPSB0YXJnZXQudGFnTmFtZSxcbiAgICAgIGFUYXJnZXQsXG4gICAgICBwcmVzZXQsXG4gICAgICB0eXBlLFxuICAgICAgdGV4dCxcbiAgICAgIGhyZWYsXG4gICAgICBkb21QYXRoLFxuICAgICAgb2Zmc2V0LFxuICAgICAgZG9tU2l6ZVxuICAgIHN3aXRjaCAodGFnTmFtZSkge1xuICAgIGNhc2UgXCJJTlBVVFwiOlxuICAgICAgdHlwZSA9IHRhcmdldC50eXBlXG4gICAgICBpZiAoZG9tLkJVVFRPTl9UWVBFW3R5cGVdKSB7XG4gICAgICAgIGRvbVBhdGggPSB0aGlzLmdldERvbVNlbGVjdG9yKHRhcmdldClcbiAgICAgICAgZG9tU2l6ZSA9IHRoaXMuZ2V0RG9tU2l6ZSh0YXJnZXQpXG4gICAgICAgIG9mZnNldCA9IHRoaXMuZ2V0RG9tRXZlbnRPZmZzZXQoZSwgdGFyZ2V0KVxuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZG9tUGF0aDogZG9tUGF0aCxcbiAgICAgICAgICAgICAgZG9tU2l6ZTogZG9tU2l6ZSxcbiAgICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgMlxuICAgICAgICAgIClcbiAgICAgICAgKVxuXG4gICAgICAgIHByZXNldCA9IHtcbiAgICAgICAgICBldmVudDogXCJidG5fY2xpY2tcIixcbiAgICAgICAgICBjYXRlZ29yeTogXCJjbGlja1wiLFxuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIGJfZG9tX3BhdGg6IGRvbVBhdGgsIC8vIOiOt+WPlkRPTVNlbGVjdG9yXG4gICAgICAgICAgICBiX29mZnNldF94OiBvZmZzZXQub2Zmc2V0WCxcbiAgICAgICAgICAgIGJfb2Zmc2V0X3k6IG9mZnNldC5vZmZzZXRZLFxuICAgICAgICAgICAgYl9kb21fd2lkdGg6IGRvbVNpemUud2lkdGgsXG4gICAgICAgICAgICBiX2RvbV9oZWlnaHQ6IGRvbVNpemUuaGVpZ2h0LFxuICAgICAgICAgICAgYl9idG5fdHlwZTogdHlwZSwgLy8g57G75Z6LXG4gICAgICAgICAgICBiX2J0bl90ZXh0OiB0YXJnZXQudmFsdWUsIC8vIOaMiemSruaWh+Wtl1xuICAgICAgICAgICAgYl9idG5fbmFtZTogdGFyZ2V0LmdldEF0dHJpYnV0ZShcIm5hbWVcIikgfHwgXCJcIiwgLy8g5oyJ6ZKubmFtZVxuICAgICAgICAgICAgYl9idG5fdmFsdWU6IHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSB8fCBcIlwiIC8vIOaMiemSrnZhbHVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICBhVGFyZ2V0ID0gZG9tLmlBbmNlc3RvclRhZyh0YXJnZXQsIHJMaW5rQnV0dG9uKVxuICAgICAgaWYgKGFUYXJnZXQpIHtcbiAgICAgICAgZG9tUGF0aCA9IHRoaXMuZ2V0RG9tU2VsZWN0b3IoYVRhcmdldClcbiAgICAgICAgZG9tU2l6ZSA9IHRoaXMuZ2V0RG9tU2l6ZShhVGFyZ2V0KVxuICAgICAgICBvZmZzZXQgPSB0aGlzLmdldERvbUV2ZW50T2Zmc2V0KGUsIGFUYXJnZXQpXG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBkb21QYXRoOiBkb21QYXRoLFxuICAgICAgICAgICAgICBkb21TaXplOiBkb21TaXplLFxuICAgICAgICAgICAgICBvZmZzZXQ6IG9mZnNldFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAyXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICAgIHN3aXRjaCAoYVRhcmdldC50YWdOYW1lKSB7XG4gICAgICAgIGNhc2UgXCJCVVRUT05cIjpcbiAgICAgICAgICB0ZXh0ID0gXy50cmltKGRvbS5pbm5lclRleHQoYVRhcmdldCkpXG4gICAgICAgICAgcHJlc2V0ID0ge1xuICAgICAgICAgICAgZXZlbnQ6IFwiYnRuX2NsaWNrXCIsXG4gICAgICAgICAgICBjYXRlZ29yeTogXCJjbGlja1wiLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBiX2RvbV9wYXRoOiBkb21QYXRoLCAvLyDojrflj5ZET01TZWxlY3RvclxuICAgICAgICAgICAgICBiX29mZnNldF94OiBvZmZzZXQub2Zmc2V0WCxcbiAgICAgICAgICAgICAgYl9vZmZzZXRfeTogb2Zmc2V0Lm9mZnNldFksXG4gICAgICAgICAgICAgIGJfZG9tX3dpZHRoOiBkb21TaXplLndpZHRoLFxuICAgICAgICAgICAgICBiX2RvbV9oZWlnaHQ6IGRvbVNpemUuaGVpZ2h0LFxuICAgICAgICAgICAgICBiX2J0bl90eXBlOiBhVGFyZ2V0LnR5cGUsIC8vIOexu+Wei1xuICAgICAgICAgICAgICBiX2J0bl90ZXh0OiB0ZXh0LCAvLyDmjInpkq7mloflrZdcbiAgICAgICAgICAgICAgYl9idG5fbmFtZTogYVRhcmdldC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpIHx8IFwiXCIsIC8vIOaMiemSrm5hbWVcbiAgICAgICAgICAgICAgYl9idG5fdmFsdWU6IGFUYXJnZXQuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikgfHwgXCJcIiAvLyDmjInpkq52YWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIFwiQVwiOlxuICAgICAgICAgIHRleHQgPSBfLnRyaW0oZG9tLmlubmVyVGV4dChhVGFyZ2V0KSlcbiAgICAgICAgICBocmVmID0gYVRhcmdldC5ocmVmXG4gICAgICAgICAgcHJlc2V0ID0ge1xuICAgICAgICAgICAgZXZlbnQ6IFwibGlua19jbGlja1wiLFxuICAgICAgICAgICAgY2F0ZWdvcnk6IFwiY2xpY2tcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgYl9kb21fcGF0aDogZG9tUGF0aCwgLy8g6I635Y+WRE9NU2VsZWN0b3JcbiAgICAgICAgICAgICAgYl9vZmZzZXRfeDogb2Zmc2V0Lm9mZnNldFgsXG4gICAgICAgICAgICAgIGJfb2Zmc2V0X3k6IG9mZnNldC5vZmZzZXRZLFxuICAgICAgICAgICAgICBiX2RvbV93aWR0aDogZG9tU2l6ZS53aWR0aCxcbiAgICAgICAgICAgICAgYl9kb21faGVpZ2h0OiBkb21TaXplLmhlaWdodCxcbiAgICAgICAgICAgICAgYl9saW5rX3VybDogaHJlZiwgLy8g6ZO+5o6l5Zyw5Z2AXG4gICAgICAgICAgICAgIGJfbGlua190ZXh0OiB0ZXh0IC8vIOmTvuaOpeaWh+Wtl1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvbVBhdGggPSB0aGlzLmdldERvbVNlbGVjdG9yKHRhcmdldClcbiAgICAgICAgZG9tU2l6ZSA9IHRoaXMuZ2V0RG9tU2l6ZSh0YXJnZXQpXG4gICAgICAgIG9mZnNldCA9IHRoaXMuZ2V0RG9tRXZlbnRPZmZzZXQoZSwgdGFyZ2V0KVxuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZG9tUGF0aDogZG9tUGF0aCxcbiAgICAgICAgICAgICAgZG9tU2l6ZTogZG9tU2l6ZSxcbiAgICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgMlxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgICBwcmVzZXQgPSB7XG4gICAgICAgICAgZXZlbnQ6IFwiZWxlbWVudF9jbGlja1wiLFxuICAgICAgICAgIGNhdGVnb3J5OiBcImNsaWNrXCIsXG4gICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgYl9kb21fcGF0aDogZG9tUGF0aCwgLy8g6I635Y+WRE9NU2VsZWN0b3JcbiAgICAgICAgICAgIGJfb2Zmc2V0X3g6IG9mZnNldC5vZmZzZXRYLFxuICAgICAgICAgICAgYl9vZmZzZXRfeTogb2Zmc2V0Lm9mZnNldFksXG4gICAgICAgICAgICBiX2RvbV93aWR0aDogZG9tU2l6ZS53aWR0aCxcbiAgICAgICAgICAgIGJfZG9tX2hlaWdodDogZG9tU2l6ZS5oZWlnaHRcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8g6byg5qCH5Z2Q5qCHXG4gICAgaWYgKHByZXNldCkge1xuICAgICAgcHJlc2V0LnByb3BlcnRpZXMuYl9jbGllbnRYID0gZS5jbGllbnRYXG4gICAgICBwcmVzZXQucHJvcGVydGllcy5iX2NsaWVudFkgPSBlLmNsaWVudFlcbiAgICB9XG4gICAgcmV0dXJuIHByZXNldFxuICB9LFxuXG4gIC8vIOmhtemdouS9jee9ruWPiueql+WPo+Wkp+Wwj1xuICBnZXRQYWdlU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzY3JXLCBzY3JIXG4gICAgaWYgKHdpbmRvdy5pbm5lckhlaWdodCAmJiB3aW5kb3cuc2Nyb2xsTWF4WSkge1xuICAgICAgLy8gTW96aWxsYVxuICAgICAgc2NyVyA9IHdpbmRvdy5pbm5lcldpZHRoICsgd2luZG93LnNjcm9sbE1heFhcbiAgICAgIHNjckggPSB3aW5kb3cuaW5uZXJIZWlnaHQgKyB3aW5kb3cuc2Nyb2xsTWF4WVxuICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQgPiBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodCkge1xuICAgICAgLy8gYWxsIGJ1dCBJRSBNYWNcbiAgICAgIHNjclcgPSBkb2N1bWVudC5ib2R5LnNjcm9sbFdpZHRoXG4gICAgICBzY3JIID0gZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHRcbiAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIC8vIElFIE1hY1xuICAgICAgc2NyVyA9IGRvY3VtZW50LmJvZHkub2Zmc2V0V2lkdGhcbiAgICAgIHNjckggPSBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodFxuICAgIH1cbiAgICB2YXIgd2luVywgd2luSFxuXG4gICAgaWYgKHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgLy8gYWxsIGV4Y2VwdCBJRVxuICAgICAgd2luVyA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICB3aW5IID0gd2luZG93LmlubmVySGVpZ2h0XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gICAgKSB7XG4gICAgICAvLyBJRSA2IFN0cmljdCBNb2RlXG4gICAgICB3aW5XID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXG4gICAgICB3aW5IID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxuICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuYm9keSkge1xuICAgICAgLy8gb3RoZXJcbiAgICAgIHdpblcgPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoXG4gICAgICB3aW5IID0gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHRcbiAgICB9XG4gICAgLy8gZm9yIHNtYWxsIHBhZ2VzIHdpdGggdG90YWwgc2l6ZSBsZXNzXG4gICAgLy8gdGhlbiB0aGUgdmlld3BvcnRcbiAgICB2YXIgcGFnZVcgPSBzY3JXIDwgd2luVyA/IHdpblcgOiBzY3JXXG4gICAgdmFyIHBhZ2VIID0gc2NySCA8IHdpbkggPyB3aW5IIDogc2NySFxuICAgIHJldHVybiB7XG4gICAgICBQYWdlV2lkdGg6IHBhZ2VXLFxuICAgICAgUGFnZUhlaWdodDogcGFnZUgsXG4gICAgICBXaW5XaWR0aDogd2luVyxcbiAgICAgIFdpbkhlaWdodDogd2luSFxuICAgIH1cbiAgfSxcblxuICAvLyDmu5rliqjmnaHkvY3nva5cbiAgZ2V0UGFnZVNjcm9sbDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB4LCB5XG4gICAgaWYgKHdpbmRvdy5wYWdlWU9mZnNldCkge1xuICAgICAgLy8gYWxsIGV4Y2VwdCBJRVxuICAgICAgeSA9IHdpbmRvdy5wYWdlWU9mZnNldFxuICAgICAgeCA9IHdpbmRvdy5wYWdlWE9mZnNldFxuICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3ApIHtcbiAgICAgIC8vIElFIDYgU3RyaWN0XG4gICAgICB4ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnRcbiAgICAgIHkgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wXG4gICAgfSBlbHNlIGlmIChkb2N1bWVudC5ib2R5KSB7XG4gICAgICAvLyBhbGxcbiAgICAgIC8vIG90aGVyIElFXG4gICAgICB4ID0gZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0XG4gICAgICB5ID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3BcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgYl9zY3JvbGxYOiB4LFxuICAgICAgYl9zY3JvbGxZOiB5XG4gICAgfVxuICB9LFxuICAvKipcbiAgICog6I635Y+WRE9N6IqC54K555qEU2VsZWN0b3JcbiAgICovXG4gIGdldERvbVNlbGVjdG9yOiBmdW5jdGlvbiAoZG9tKSB7XG4gICAgdmFyIG5vZGVUeXBlID0gZG9tLm5vZGVOYW1lLnRvTG93ZXJDYXNlKClcbiAgICBpZiAobm9kZVR5cGUgPT09IFwiYm9keVwiIHx8IG5vZGVUeXBlID09PSBcImh0bWxcIikgcmV0dXJuIFwiYm9keVwiXG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyZW50ID0gZG9tLnBhcmVudE5vZGVcbiAgICAgIGlmIChkb20uZ2V0QXR0cmlidXRlKFwiaWRcIikpIHsgcmV0dXJuIHRoaXMuZ2V0RG9tU2VsZWN0b3IocGFyZW50KSArIFwiPiNcIiArIGRvbS5nZXRBdHRyaWJ1dGUoXCJpZFwiKSB9IGVsc2UgaWYgKChub2RlVHlwZSA9PT0gXCJpbnB1dFwiIHx8IG5vZGVUeXBlID09PSBcInNlbGVjdFwiIHx8IG5vZGVUeXBlID09PSBcInRleHRhcmVhXCIgfHwgbm9kZVR5cGUgPT09IFwiYnV0dG9uXCIpICYmIGRvbS5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5nZXREb21TZWxlY3RvcihwYXJlbnQpICsgXCI+XCIgKyBub2RlVHlwZSArIFwiOmlucHV0W25hbWU9J1wiICsgZG9tLmdldEF0dHJpYnV0ZShcIm5hbWVcIikgKyBcIiddXCIpXG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGUgPSBbXSwgZCA9IDA7IGQgPCBwYXJlbnQuY2hpbGRyZW4ubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgdmFyIGYgPSBwYXJlbnQuY2hpbGRyZW5bZF1cbiAgICAgICAgZi5ub2RlTmFtZSAmJiBmLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5vZGVUeXBlICYmIGUucHVzaChmKVxuICAgICAgfVxuICAgICAgZm9yIChkID0gMDsgZCA8IGUubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgaWYgKGVbZF0gPT09IGRvbSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdldERvbVNlbGVjdG9yKHBhcmVudCkgKyBcIj5cIiArIG5vZGVUeXBlICsgXCI6ZXEoXCIgKyBkICsgXCIpXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIOiOt+WPlkRPTeWFg+e0oOebuOWvueS6juWPr+aYr+aWh+aho+WMuuWfn+W3puS4iuinkueahOS9jee9rlxuICAgKi9cbiAgZ2V0RG9tT2Zmc2V0OiBmdW5jdGlvbiAoZG9tKSB7XG4gICAgdmFyIG9mZnNldCA9IHtcbiAgICAgIHRvcDogMCxcbiAgICAgIGxlZnQ6IDBcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBkb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0ICE9PSB0eXBlb2YgdW5kZWZpbmVkKSB7XG4gICAgICBvZmZzZXQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcbiAgICAgIGRvbSA9IGRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgb2Zmc2V0ID0ge1xuICAgICAgICB0b3A6IGRvbS50b3AgKyAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IG9mZnNldC5zY3JvbGxUb3ApIC0gKG9mZnNldC5jbGllbnRUb3AgfHwgMCksXG4gICAgICAgIGxlZnQ6IGRvbS5sZWZ0ICsgKHdpbmRvdy5wYWdlWE9mZnNldCB8fCBvZmZzZXQuc2Nyb2xsTGVmdCkgLSAob2Zmc2V0LmNsaWVudExlZnQgfHwgMClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb2Zmc2V0LnRvcCArPSBkb20ub2Zmc2V0VG9wXG4gICAgICBvZmZzZXQubGVmdCArPSBkb20ub2Zmc2V0TGVmdFxuICAgICAgaWYgKGRvbS5vZmZzZXRQYXJlbnQpIHtcbiAgICAgICAgZG9tID0gdGhpcy5nZXREb21PZmZzZXQoZG9tLm9mZnNldFBhcmVudClcbiAgICAgICAgb2Zmc2V0LnRvcCArPSBkb20udG9wXG4gICAgICAgIG9mZnNldC5sZWZ0ICs9IGRvbS5sZWZ0XG4gICAgICB9XG5cbiAgICAgIGlmIChvZmZzZXQudG9wIDwgMCkgb2Zmc2V0LnRvcCA9IDBcbiAgICAgIGlmIChvZmZzZXQubGVmdCA8IDApIG9mZnNldC5sZWZ0ID0gMFxuICAgICAgb2Zmc2V0LnRvcCA9IGlzTmFOKG9mZnNldC50b3ApID8gMCA6IHBhcnNlSW50KG9mZnNldC50b3AsIDEwKVxuICAgICAgb2Zmc2V0LmxlZnQgPSBpc05hTihvZmZzZXQubGVmdCkgPyAwIDogcGFyc2VJbnQob2Zmc2V0LmxlZnQsIDEwKVxuICAgIH1cbiAgICBvZmZzZXQudG9wID0gTWF0aC5yb3VuZChvZmZzZXQudG9wKVxuICAgIG9mZnNldC5sZWZ0ID0gTWF0aC5yb3VuZChvZmZzZXQubGVmdClcbiAgICByZXR1cm4gb2Zmc2V0XG4gIH0sXG4gIC8qKlxuICAgKiDojrflj5bkuovku7blj5HnlJ/ml7blnZDmoIfnm7jlr7nkuo7kuovku7bmupDnmoTnm7jlr7nkvY3nva5cbiAgICovXG4gIGdldERvbUV2ZW50T2Zmc2V0OiBmdW5jdGlvbiAoZSwgdGFyZ2V0KSB7XG4gICAgdmFyIG9mZnNldCA9IHt9XG4gICAgaWYgKGUub2Zmc2V0WCAmJiBlLm9mZnNldFkpIHtcbiAgICAgIG9mZnNldC5vZmZzZXRYID0gZS5vZmZzZXRYXG4gICAgICBvZmZzZXQub2Zmc2V0WSA9IGUub2Zmc2V0WVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYm94ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBvZmZzZXQub2Zmc2V0WCA9IGUuY2xpZW50WCAtIGJveC5sZWZ0XG4gICAgICBvZmZzZXQub2Zmc2V0WSA9IGUuY2xpZW50WSAtIGJveC50b3BcbiAgICB9XG4gICAgcmV0dXJuIG9mZnNldFxuICB9LFxuICAvKipcbiAgICog6I635Y+W5YWD57Sg5aSn5bCPXG4gICAqL1xuICBnZXREb21TaXplOiBmdW5jdGlvbiAoZG9tKSB7XG4gICAgdmFyIHNpemUgPSB7fVxuICAgIHNpemUud2lkdGggPSBkb20ub2Zmc2V0V2lkdGhcbiAgICBzaXplLmhlaWdodCA9IGRvbS5vZmZzZXRIZWlnaHRcbiAgICByZXR1cm4gc2l6ZVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG9tXG4iLCJ2YXIgY29tbW9uID0gcmVxdWlyZShcIi4uL2NvbW1vblwiKVxudmFyIGNvbnN0cyA9IHJlcXVpcmUoXCIuLi9jb25zdHNcIilcbnZhciBldmVudEVtaXR0ZXIgPSByZXF1aXJlKFwiLi4vZXZlbnRFbWl0dGVyXCIpXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4uL2NvbmZpZ1wiKVxudmFyIGxvZyA9IHJlcXVpcmUoXCIuLi9sb2dcIilcbnZhciB3aW5PbkVycm9yID0gd2luZG93Lm9uZXJyb3JcbnZhciBlcnJvcnMgPSBbXVxuXG5jb25zb2xlLmxvZyhjb25maWcpXG5cbi8qIHZhciBpID0gZmFsc2VcbnZhciBqID0gMCAqL1xuXG5mdW5jdGlvbiBJbm5lckVycm9yIChtc2csIHVybCwgbGluZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtc2cgfHwgXCJVbmNhdWdodCBlcnJvciB3aXRoIG5vIGFkZGl0aW9uYWwgaW5mb3JtYXRpb25cIlxuICB0aGlzLnNvdXJjZVVSTCA9IHVybFxuICB0aGlzLmxpbmUgPSBsaW5lXG59XG5cbmV2ZW50RW1pdHRlci5vbihcImVyclwiLCBmdW5jdGlvbiAoZXJyKSB7XG4gIGxvZyhcIj09PT3mjZXojrfliLDplJnor689PT09XCIpXG4gIGxvZyhhcmd1bWVudHMpXG4gIGVycm9ycy5wdXNoKGVycilcbn0pXG5cbnNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgdmFyIGRhdGEgPSBbXVxuICBpZiAoZXJyb3JzLmxlbmd0aCA+IGNvbmZpZy5tYXhMaW1pdCkge1xuICAgIGRhdGEgPSBlcnJvcnMuc3BsaWNlKDAsIGNvbmZpZy5tYXhMaW1pdClcbiAgfSBlbHNlIHtcbiAgICBkYXRhID0gZXJyb3JzLnNwbGljZSgwLCBlcnJvcnMubGVuZ3RoKVxuICB9XG4gIHZhciBvcHRpb25zID0ge1xuICAgIHVybDogY29uZmlnLmFwaUhvc3QsXG4gICAgdHlwZTogXCJnZXRcIixcbiAgICBjb3JzOiB0cnVlLFxuICAgIGRhdGE6IGRhdGEsXG4gICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIGxvZyhcIumUmeivr+S/oeaBr+W3suWPkemAgVwiKVxuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcbiAgICAgIGxvZyh4aHIuc3RhdHVzKVxuICAgICAgbG9nKHhoci5zdGF0dXNUZXh0KVxuICAgICAgLy8gZXJyb3JzLmNvbmNhdChkYXRhKVxuICAgIH0sXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxvZyhcIumUmeivr+S/oeaBr+WPkemAgeWujOavlS5cIilcbiAgICB9XG4gIH1cblxuICBvcHRpb25zLmhlYWRlciA9IHt9XG4gIG9wdGlvbnMuaGVhZGVyW2NvbnN0cy5rZXBsZXJfbWVzc2FnZV90eXBlXSA9IGNvbnN0cy53ZWJfZXJyb3JcbiAgb3B0aW9ucy5oZWFkZXJbY29uc3RzLmtlcGxlcl9hZ2VudF90b2tlbl0gPSBjb25maWcuYWdlbnRJZFxuICBvcHRpb25zLmhlYWRlcltjb25zdHMua2VwbGVyX2NvbmZpZ192ZXJzaW9uXSA9IGNvbmZpZy5MSUJfVkVSU0lPTlxuXG4gIC8vIGNvbW1vbi5hamF4KG9wdGlvbnMpXG59LCBjb25maWcudHJhbnNGcmVxdWVuY3kpXG5cbmZ1bmN0aW9uIG9uRXJyb3IgKG1zZywgdXJsLCBsaW5lLCBjb2wsIGVycm9yKSB7XG4gIHRyeSB7XG4gICAgZXZlbnRFbWl0dGVyLmVtaXQoXCJlcnJcIiwgW2Vycm9yIHx8IG5ldyBJbm5lckVycm9yKG1zZywgdXJsLCBsaW5lKV0pXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdHJ5IHtcbiAgICAgIGV2ZW50RW1pdHRlci5lbWl0KFwiaW5uZXJlcnJcIiwgW2Vycm9yLCAobmV3IERhdGUoKSkuZ2V0VGltZSgpLCB0cnVlXSlcbiAgICB9IGNhdGNoIChlcnJvcikge31cbiAgfVxuICByZXR1cm4gdHlwZW9mIHdpbk9uRXJyb3IgPT09IFwiZnVuY3Rpb25cIiA/IHdpbk9uRXJyb3IuYXBwbHkodGhpcywgY29tbW9uLnRvQXJyYXkoYXJndW1lbnRzKSkgOiBmYWxzZVxufVxuXG53aW5kb3cub25lcnJvciA9IG9uRXJyb3JcblxubW9kdWxlLmV4cG9ydHMgPSBldmVudEVtaXR0ZXJcbiIsInZhciBnbG9iYWxDb250ZXh0ID0gcmVxdWlyZShcIi4vZ2xvYmFsQ29udGV4dFwiKVxuXG52YXIgZGVmYXVsdENvbnRleHRLZXkgPSBcIl9fZGVmYXVsdF9jb250ZXh0X19cIlxuXG5mdW5jdGlvbiBldmVudEVtaXR0ZXIgKC8qIHNpbmdsZXRvbkVtaXQgKi8pIHtcbiAgdmFyIGV2ZW50cyA9IHt9XG4gIHZhciBldmVudEFyZ3MgPSB7fVxuICBmdW5jdGlvbiBpbml0T2JqZWN0ICgpIHtcbiAgICByZXR1cm4ge31cbiAgfVxuXG4gIGZ1bmN0aW9uIGVtaXQgKGV2ZW50TmFtZSwgcGFyYW1zLCBjb250ZXh0KSB7XG4gICAgLyogaWYgKHNpbmdsZXRvbkVtaXQpIHtcbiAgICAgIHNpbmdsZXRvbkVtaXQoZXZlbnROYW1lLCBwYXJhbXMsIGNvbnRleHQpXG4gICAgfSAqL1xuICAgIGlmICghY29udGV4dCkge1xuICAgICAgY29udGV4dCA9IHt9XG4gICAgfVxuXG4gICAgdmFyIGxpc3RlbmVycyA9IGdldExpc3RlbmVycyhldmVudE5hbWUpXG4gICAgdmFyIGxpc3RlbmVyc0xlbiA9IGxpc3RlbmVycy5sZW5ndGhcbiAgICB2YXIgayA9IHt9XG5cbiAgICB0cnkge1xuICAgICAgayA9IGdsb2JhbENvbnRleHQuc2V0T25jZShjb250ZXh0LCBkZWZhdWx0Q29udGV4dEtleSwgaW5pdE9iamVjdClcbiAgICB9IGNhdGNoIChlcnIpIHtcblxuICAgIH1cbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGxpc3RlbmVyc0xlbiA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICBsaXN0ZW5lcnNbaW5kZXhdLmFwcGx5KGssIHBhcmFtcylcbiAgICB9XG4gICAgcmV0dXJuIGtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0geypzdHJpbmd9IGV2ZW50TmFtZSDms6jlhozkuovku7ZcbiAgICogQHBhcmFtIHsqRnVuY3Rpb258QXJyYXkoRnVuY3Rpb24pfSBjYiDkuovku7blm57osIPlh73mlbBcbiAgICovXG4gIGZ1bmN0aW9uIG9uIChldmVudE5hbWUsIGNiKSB7XG4gICAgaWYgKCFjYikge1xuICAgICAgY2IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIH1cbiAgICBldmVudHNbZXZlbnROYW1lXSA9IGdldExpc3RlbmVycyhldmVudE5hbWUpLmNvbmNhdChjYilcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExpc3RlbmVycyAoZXZlbnROYW1lKSB7XG4gICAgcmV0dXJuIGV2ZW50c1tldmVudE5hbWVdIHx8IFtdXG4gIH1cblxuICAvKipcbiAqXG4gKiDkuovku7bmsaDkuK3lpoLmnpzmnInkuovku7bnm5HlkKzlmajvvIzliJnmiafooYxcbiAqIOS6i+S7tuaxoOS4reayoeacieeahOivne+8jOWImeWwhuS6i+S7tuWPguaVsOWBh+WmguWIsOW+heaJp+ihjOmYn+WIl+S4rVxuICpcbiAqIEBwYXJhbSB7YW55fSBldmVudE5hbWVcbiAqIEBwYXJhbSB7YW55fSBwYXJhbXNcbiAqIEBwYXJhbSB7YW55fSBjb250ZXh0XG4gKi9cbiAgZnVuY3Rpb24gYWRkRXZlbnRBcmdzIChldmVudE5hbWUsIHBhcmFtcywgY29udGV4dCkge1xuICAgIGlmIChnZXRMaXN0ZW5lcnMoZXZlbnROYW1lKS5sZW5ndGgpIHtcbiAgICAgIGVtaXQoZXZlbnROYW1lLCBwYXJhbXMsIGNvbnRleHQpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghZXZlbnRBcmdzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgZXZlbnRBcmdzW2V2ZW50TmFtZV0gPSBbXVxuICAgICAgfVxuICAgICAgZXZlbnRBcmdzW2V2ZW50TmFtZV0ucHVzaChwYXJhbXMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIOWwneivleazqOWGjOS6i+S7tuebkeWQrOWZqFxuICAgKiDlpoLmnpzlt7Lnu4/lrZjlnKjkuovku7bnm5HlkKzlmajkuobvvIzliJnpgIDlh7pcbiAgICog5aaC5p6c5LiN5a2Y5Zyo77yM5YiZ5rOo5YaM5q2k5LqL5Lu277yM5bm25riF56m66Zif5YiX5Lit55qE5b6F5aSE55CG5LqL5Lu25Y+C5pWwXG4gICAqIEBwYXJhbSB7YW55fSBldmVudE5hbWVcbiAgICogQHBhcmFtIHthbnl9IGNhbGxiYWNrXG4gICAqIEByZXR1cm5zXG4gICAqL1xuICBmdW5jdGlvbiBoYW5kbGVFdmVudEFyZ3MgKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICBpZiAoZ2V0TGlzdGVuZXJzKGV2ZW50TmFtZSkubGVuZ3RoKSByZXR1cm4gZmFsc2VcbiAgICBvbihldmVudE5hbWUsIGNhbGxiYWNrKVxuICAgIHZhciBxID0gZXZlbnRBcmdzW2V2ZW50TmFtZV1cbiAgICBpZiAocSkge1xuICAgICAgZm9yICh2YXIgaXRlbSA9IDA7IGl0ZW0gPCBxLmxlbmd0aDsgaXRlbSsrKSB7XG4gICAgICAgIGVtaXQoZXZlbnROYW1lLCBxW2l0ZW1dKVxuICAgICAgfVxuICAgICAgZGVsZXRlIGV2ZW50QXJnc1tldmVudE5hbWVdXG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGUgKCkge1xuICAgIHJldHVybiBldmVudEVtaXR0ZXIoZW1pdClcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgb246IG9uLFxuICAgIGVtaXQ6IGVtaXQsXG4gICAgY3JlYXRlOiBjcmVhdGUsXG4gICAgbGlzdGVuZXJzOiBnZXRMaXN0ZW5lcnMsXG4gICAgX2V2ZW50czogZXZlbnRzLFxuICAgIGFkZEV2ZW50QXJnczogYWRkRXZlbnRBcmdzLFxuICAgIGhhbmRsZVF1ZXVlOiBoYW5kbGVFdmVudEFyZ3NcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV2ZW50RW1pdHRlcigpXG4iLCIvKlxuICogQEF1dGhvcjogamlhbmdmZW5nXG4gKiBARGF0ZTogMjAxNy0wOC0yMyAxNjowNTowMVxuICogQExhc3QgTW9kaWZpZWQgYnk6IGppYW5nZmVuZ1xuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yOCAxNzozOTo0N1xuICovXG5cbnZhciByeEFwbSA9IHJlcXVpcmUoXCIuL21haW5cIilcbnZhciBjb25maWcgPSB7XG4gIG1heExpbWl0OiAxMCxcbiAgY3Jvc3NTdWJEb21haW46IHRydWUsXG4gIGxvYWRUaW1lOiB3aW5kb3cuJCRyeEFwbUZpcnN0Qnl0ZVRpbWUgfHwgMSAqIG5ldyBEYXRlKCksXG4gIHNob3dMb2c6IHRydWUsXG4gIG9wZW5UcmFjaW5nOiB0cnVlLFxuICB0cmFuc0ZyZXF1ZW5jeTogNWUzLFxuICBhcGlIb3N0OiBcImh0dHA6Ly8xMC4yMDAuMTAuMjI6ODA5OFwiLFxuICBhZ2VudElkOiBcInBFZGZhM00xXCIsXG4gIHRpZXJJZDogXCIxXCIsXG4gIGFwcElkOiBcIjFcIlxufVxuXG5jb25maWcgPSB7XG4gIG1heExpbWl0OiAxMCxcbiAgY3Jvc3NTdWJEb21haW46IHRydWUsXG4gIGxvYWRUaW1lOiB3aW5kb3cuJCRyeEFwbUZpcnN0Qnl0ZVRpbWUgfHwgMSAqIG5ldyBEYXRlKCksXG4gIHNob3dMb2c6IFwiPCQ9c2hvd0xvZyQ+XCIsXG4gIG9wZW5UcmFjaW5nOiBcIjwkPW9wZW5UcmFjaW5nJD5cIixcbiAgdHJhbnNGcmVxdWVuY3k6IFwiPCQ9dHJhbnNGcmVxdWVuY3kkPlwiLFxuICBhcGlIb3N0OiBcIjwkPWFwaUhvc3QkPlwiLFxuICBhZ2VudElkOiBcIjwkPWFnZW50SWQkPlwiLFxuICB0aWVySWQ6IFwiPCQ9dGllcklkJD5cIixcbiAgYXBwSWQ6IFwiPCQ9YXBwSWQkPlwiXG59XG5cbmNvbmZpZy5zaG93TG9nID0gISEwICsgXCJcIiA9PT0gY29uZmlnLnNob3dMb2dcbmNvbmZpZy5vcGVuVHJhY2luZyA9ICEhMCArIFwiXCIgPT09IGNvbmZpZy5vcGVuVHJhY2luZ1xuY29uZmlnLnRyYW5zRnJlcXVlbmN5ID0gK2NvbmZpZy50cmFuc0ZyZXF1ZW5jeVxuXG5yeEFwbS5pbml0KGNvbmZpZylcbiIsInZhciBfID0gcmVxdWlyZShcIi4vY29tbW9uXCIpXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4vY29uZmlnXCIpXG52YXIgc3RvcmUgPSByZXF1aXJlKFwiLi9zdG9yZVwiKVxudmFyIGxvY2tlciA9IHJlcXVpcmUoXCIuL2xvY2tlclwiKVxuZnVuY3Rpb24gR2V0Q3VycmVudEV2ZW50SUQgKCkge1xuICByZXR1cm4gc3RvcmUuZ2V0U2Vzc2lvbihcIkNVUlJFTlRfRVZFTlRfSURcIilcbn1cblxuZnVuY3Rpb24gU2V0Q3VycmVudEV2ZW50SUQgKGNpZCkge1xuICBzdG9yZS5zZXRTZXNzaW9uKFwiQ1VSUkVOVF9FVkVOVF9JRFwiLCBjaWQpXG59XG5cbnZhciBzdGF0ZSA9IHtcbn1cblxuLyoqXG4gICAqIOacrOWcsOS4iuS4i+aWh+eOr+Wig1xuICAgKiDojrflj5blvZPliY3lj5HpgIHlmajnmoTmjojmnYPnirbmgIFcbiAgICog6I635Y+W5b2T5YmN5Y+R6YCB5Zmo55qE5LqL5Lu25rGgXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xudmFyIGdsb2JhbENvbnRleHQgPSB7XG4gIGdldDogZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBrZXkgPyBzdGF0ZVtrZXldIDogc3RhdGVcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIHN0YXRlW2tleV0gPSB2YWx1ZVxuICB9LFxuICBwdXNoOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIHZhciBhID0gc3RhdGVba2V5XVxuICAgIGlmICghYSkge1xuICAgICAgYSA9IHN0YXRlW2tleV0gPSBbXVxuICAgIH1cbiAgICBhLnB1c2godmFsdWUpXG4gIH0sXG4gIHNldE9uY2U6IGZ1bmN0aW9uIChjb250ZXh0LCBwcm9wZXJ0eSwgZGVmYXVsdENhbGxiYWNrKSB7XG4gICAgdmFyIG9iakhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuICAgIGlmIChvYmpIYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbnRleHQsIHByb3BlcnR5KSkgcmV0dXJuIGNvbnRleHRbcHJvcGVydHldXG4gICAgdmFyIHByb3BlcnR5VmFsdWUgPSBkZWZhdWx0Q2FsbGJhY2soKVxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgT2JqZWN0LmtleXMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb250ZXh0LCBwcm9wZXJ0eSwge1xuICAgICAgICAgIHZhbHVlOiBwcm9wZXJ0eVZhbHVlLFxuICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlXG4gICAgICB9IGNhdGNoIChlcnIpIHtcblxuICAgICAgfVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29udGV4dFtwcm9wZXJ0eV0gPSBwcm9wZXJ0eVZhbHVlXG4gICAgfSBjYXRjaCAoZXJyKSB7fVxuICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlXG4gIH0sXG4gIGdldEV2ZW50UG9vbDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwb29sID0gXy5sb2NhbFN0b3JhZ2UucGFyc2UoY29uZmlnLkxJQl9LRVkgKyBcIkV2ZW50UG9vbFwiICsgY29uZmlnLmFnZW50SWQsIFtdKVxuICAgIHJldHVybiBwb29sXG4gIH0sXG4gIHNldEV2ZW50UG9vbDogZnVuY3Rpb24gKGV2ZW50UG9vbCkge1xuICAgIF8ubG9jYWxTdG9yYWdlLnNldChjb25maWcuTElCX0tFWSArIFwiRXZlbnRQb29sXCIgKyBjb25maWcuYWdlbnRJZCwgSlNPTi5zdHJpbmdpZnkoZXZlbnRQb29sKSlcbiAgfSxcbiAgLyoqXG4gICAgICog5LqL5Lu25YWl5rGgXG4gICAgICovXG4gIHB1c2hFdmVudDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgZXZlbnQuc2VuZGluZyA9IGZhbHNlXG4gICAgbG9ja2VyLmV4ZWMoZnVuY3Rpb24gKCkge1xuICAgICAgZXZlbnQuY2lkID0gXy5VVUlEKClcbiAgICAgIHZhciBjaWQgPSBHZXRDdXJyZW50RXZlbnRJRCgpXG4gICAgICBpZiAoY2lkKSB7XG4gICAgICAgIGV2ZW50LnBpZCA9IGNpZFxuICAgICAgfVxuXG4gICAgICBTZXRDdXJyZW50RXZlbnRJRChldmVudC5jaWQpXG5cbiAgICAgIHZhciBwb29sID0gdGhhdC5nZXRFdmVudFBvb2woKVxuICAgICAgcG9vbC5wdXNoKGV2ZW50KVxuICAgICAgdGhhdC5zZXRFdmVudFBvb2wocG9vbClcbiAgICB9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsQ29udGV4dFxuIiwiLyogZXNsaW50LWRpc2FibGUgKi9cbi8vIEpTT04gcG9seWZpbGxcbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gKHR5cGVvZiBKU09OID09PSBcIm9iamVjdFwiICYmIHRvU3RyaW5nLmNhbGwoSlNPTikgPT09IFwiW29iamVjdCBKU09OXVwiKSA/IEpTT05cbiAgICA6IChmdW5jdGlvbiAoSlNPTikge1xuICAgICAgICBcInVzZSBzdHJpY3RcIlxuXG4gICAgICAgIGZ1bmN0aW9uIGYgKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBlIDwgMTAgPyBcIjBcIiArIGUgOiBlXG4gICAgICAgIH1cblxuICAgICAgICAvLyBmdW5jdGlvbiB0aGlzX3ZhbHVlKCkge1xuICAgICAgICAvLyByZXR1cm4gdGhpcy52YWx1ZU9mKClcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGZ1bmN0aW9uIHF1b3RlIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gcnhfZXNjYXBhYmxlLmxhc3RJbmRleCA9IDAsIHJ4X2VzY2FwYWJsZS50ZXN0KGUpID8gXCJcXFwiXCIgKyBlLnJlcGxhY2UocnhfZXNjYXBhYmxlLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHZhciB0ID0gbWV0YVtlXVxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgdCA9PT0gXCJzdHJpbmdcIiA/IHQgOiBcIlxcXFx1XCIgKyAoXCIwMDAwXCIgKyBlLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNClcbiAgICAgICAgICAgIH0pICsgXCJcXFwiXCIgOiBcIlxcXCJcIiArIGUgKyBcIlxcXCJcIlxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb2JqZWN0VG9KU09OIChlKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHRvU3RyaW5nLmNhbGwoZSkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJbb2JqZWN0IERhdGVdXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzRmluaXRlKGUudmFsdWVPZigpKSA/IGUuZ2V0VVRDRnVsbFllYXIoKSArIFwiLVwiICsgZihlLmdldFVUQ01vbnRoKCkgKyAxKSArIFwiLVwiICsgZihlLmdldFVUQ0RhdGUoKSkgKyBcIlRcIiArIGYoZS5nZXRVVENIb3VycygpKSArIFwiOlwiICsgZihlLmdldFVUQ01pbnV0ZXMoKSkgKyBcIjpcIiArIGYoZS5nZXRVVENTZWNvbmRzKCkpICsgXCJaXCIgOiBudWxsXG4gICAgICAgICAgICBjYXNlIFwiW29iamVjdCBCb29sZWFuXVwiOlxuICAgICAgICAgICAgY2FzZSBcIltvYmplY3QgU3RyaW5nXVwiOlxuICAgICAgICAgICAgY2FzZSBcIltvYmplY3QgTnVtYmVyXVwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBlLnZhbHVlT2YoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHN0ciAoZSwgdCkge1xuICAgICAgICAgICAgdmFyIHIsIG4sIGksIG8sIHMsIGEgPSBnYXAsXG4gICAgICAgICAgICAgICAgdSA9IHRbZV1cbiAgICAgICAgICAgIHN3aXRjaCAodSAmJiB0eXBlb2YgdSA9PT0gXCJvYmplY3RcIiAmJiAodSA9IG9iamVjdFRvSlNPTih1KSksIHR5cGVvZiByZXAgPT09IFwiZnVuY3Rpb25cIiAmJiAodSA9IHJlcC5jYWxsKHQsIGUsIHUpKSwgdHlwZW9mIHUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVvdGUodSlcbiAgICAgICAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNGaW5pdGUodSkgPyBTdHJpbmcodSkgOiBcIm51bGxcIlxuICAgICAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgICAgIGNhc2UgXCJudWxsXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyh1KVxuICAgICAgICAgICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgICAgICAgICAgIGlmICghdSkgcmV0dXJuIFwibnVsbFwiXG4gICAgICAgICAgICAgICAgaWYgKGdhcCArPSBpbmRlbnQsIHMgPSBbXSwgdG9TdHJpbmcuY2FsbCh1KSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobyA9IHUubGVuZ3RoLCByID0gMDsgbyA+IHI7IHIgKz0gMSkgc1tyXSA9IHN0cihyLCB1KSB8fCBcIm51bGxcIlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaSA9IHMubGVuZ3RoID09PSAwID8gXCJbXVwiIDogZ2FwID8gXCJbXFxuXCIgKyBnYXAgKyBzLmpvaW4oXCIsXFxuXCIgKyBnYXApICsgXCJcXG5cIiArIGEgKyBcIl1cIiA6IFwiW1wiICsgcy5qb2luKFwiLFwiKSArIFwiXVwiLCBnYXAgPSBhLCBpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXAgJiYgdHlwZW9mIHJlcCA9PT0gXCJvYmplY3RcIikgeyBmb3IgKG8gPSByZXAubGVuZ3RoLCByID0gMDsgbyA+IHI7IHIgKz0gMSkgdHlwZW9mIHJlcFtyXSA9PT0gXCJzdHJpbmdcIiAmJiAobiA9IHJlcFtyXSwgaSA9IHN0cihuLCB1KSwgaSAmJiBzLnB1c2gocXVvdGUobikgKyAoZ2FwID8gXCI6IFwiIDogXCI6XCIpICsgaSkpIH0gZWxzZSB7IGZvciAobiBpbiB1KSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodSwgbikgJiYgKGkgPSBzdHIobiwgdSksIGkgJiYgcy5wdXNoKHF1b3RlKG4pICsgKGdhcCA/IFwiOiBcIiA6IFwiOlwiKSArIGkpKSB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGkgPSBzLmxlbmd0aCA9PT0gMCA/IFwie31cIiA6IGdhcCA/IFwie1xcblwiICsgZ2FwICsgcy5qb2luKFwiLFxcblwiICsgZ2FwKSArIFwiXFxuXCIgKyBhICsgXCJ9XCIgOiBcIntcIiArIHMuam9pbihcIixcIikgKyBcIn1cIiwgZ2FwID0gYSwgaVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciByeF9vbmUgPSAvXltcXF0sOnt9XFxzXSokLyxcbiAgICAgICAgICAgIHJ4X3R3byA9IC9cXFxcKD86W1wiXFxcXFxcL2JmbnJ0XXx1WzAtOWEtZkEtRl17NH0pL2csXG4gICAgICAgICAgICByeF90aHJlZSA9IC9cIlteXCJcXFxcXFxuXFxyXSpcInx0cnVlfGZhbHNlfG51bGx8LT9cXGQrKD86XFwuXFxkKik/KD86W2VFXVsrXFwtXT9cXGQrKT8vZyxcbiAgICAgICAgICAgIHJ4X2ZvdXIgPSAvKD86Xnw6fCwpKD86XFxzKlxcWykrL2csXG4gICAgICAgICAgICByeF9lc2NhcGFibGUgPSAvW1xcXFxcXFwiXFx1MDAwMC1cXHUwMDFmXFx1MDA3Zi1cXHUwMDlmXFx1MDBhZFxcdTA2MDAtXFx1MDYwNFxcdTA3MGZcXHUxN2I0XFx1MTdiNVxcdTIwMGMtXFx1MjAwZlxcdTIwMjgtXFx1MjAyZlxcdTIwNjAtXFx1MjA2ZlxcdWZlZmZcXHVmZmYwLVxcdWZmZmZdL2csXG4gICAgICAgICAgICByeF9kYW5nZXJvdXMgPSAvW1xcdTAwMDBcXHUwMGFkXFx1MDYwMC1cXHUwNjA0XFx1MDcwZlxcdTE3YjRcXHUxN2I1XFx1MjAwYy1cXHUyMDBmXFx1MjAyOC1cXHUyMDJmXFx1MjA2MC1cXHUyMDZmXFx1ZmVmZlxcdWZmZjAtXFx1ZmZmZl0vZ1xuICAgICAgICAvL1x0XHRcImZ1bmN0aW9uXCIgIT0gdHlwZW9mIERhdGUucHJvdG90eXBlLnRvSlNPTiAmJiAoRGF0ZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vXHRcdFx0cmV0dXJuIGlzRmluaXRlKHRoaXMudmFsdWVPZigpKSA/IHRoaXMuZ2V0VVRDRnVsbFllYXIoKSArIFwiLVwiICsgZih0aGlzLmdldFVUQ01vbnRoKCkgKyAxKSArIFwiLVwiICsgZih0aGlzLmdldFVUQ0RhdGUoKSkgKyBcIlRcIiArIGYodGhpcy5nZXRVVENIb3VycygpKSArIFwiOlwiICsgZih0aGlzLmdldFVUQ01pbnV0ZXMoKSkgKyBcIjpcIiArIGYodGhpcy5nZXRVVENTZWNvbmRzKCkpICsgXCJaXCIgOiBudWxsXG4gICAgICAgIC8vXHRcdH0sIEJvb2xlYW4ucHJvdG90eXBlLnRvSlNPTiA9IHRoaXNfdmFsdWUsIE51bWJlci5wcm90b3R5cGUudG9KU09OID0gdGhpc192YWx1ZSwgU3RyaW5nLnByb3RvdHlwZS50b0pTT04gPSB0aGlzX3ZhbHVlKTtcbiAgICAgICAgdmFyIGdhcCwgaW5kZW50LCBtZXRhLCByZXBcbiAgICAgICAgdHlwZW9mIEpTT04uc3RyaW5naWZ5ICE9PSBcImZ1bmN0aW9uXCIgJiYgKG1ldGEgPSB7XG4gICAgICAgICAgICBcIlxcYlwiOiBcIlxcXFxiXCIsXG4gICAgICAgICAgICBcIlx0XCI6IFwiXFxcXHRcIixcbiAgICAgICAgICAgIFwiXFxuXCI6IFwiXFxcXG5cIixcbiAgICAgICAgICAgIFwiXFxmXCI6IFwiXFxcXGZcIixcbiAgICAgICAgICAgIFwiXFxyXCI6IFwiXFxcXHJcIixcbiAgICAgICAgICAgIFwiXFxcIlwiOiBcIlxcXFxcXFwiXCIsXG4gICAgICAgICAgICBcIlxcXFxcIjogXCJcXFxcXFxcXFwiXG4gICAgICAgIH0sIEpTT04uc3RyaW5naWZ5ID0gZnVuY3Rpb24gKGUsIHQsIHIpIHtcbiAgICAgICAgICAgICAgICB2YXIgblxuICAgICAgICAgICAgICAgIGlmIChnYXAgPSBcIlwiLCBpbmRlbnQgPSBcIlwiLCB0eXBlb2YgciA9PT0gXCJudW1iZXJcIikgeyBmb3IgKG4gPSAwOyByID4gbjsgbiArPSAxKSBpbmRlbnQgKz0gXCIgXCIgfSBlbHNlIHR5cGVvZiByID09PSBcInN0cmluZ1wiICYmIChpbmRlbnQgPSByKVxuICAgICAgICAgICAgICAgIGlmIChyZXAgPSB0LCB0ICYmIHR5cGVvZiB0ICE9PSBcImZ1bmN0aW9uXCIgJiYgKHR5cGVvZiB0ICE9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB0Lmxlbmd0aCAhPT0gXCJudW1iZXJcIikpIHRocm93IG5ldyBFcnJvcihcIkpTT04uc3RyaW5naWZ5XCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cihcIlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiXCI6IGVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSksIHR5cGVvZiBKU09OLnBhcnNlICE9PSBcImZ1bmN0aW9uXCIgJiYgKEpTT04ucGFyc2UgPSBmdW5jdGlvbiAodGV4dCwgcmV2aXZlcikge1xuICAgICAgICAgICAgZnVuY3Rpb24gd2FsayAoZSwgdCkge1xuICAgICAgICAgICAgICAgIHZhciByLCBuLCBpID0gZVt0XVxuICAgICAgICAgICAgICAgIGlmIChpICYmIHR5cGVvZiBpID09PSBcIm9iamVjdFwiKSB7IGZvciAociBpbiBpKSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaSwgcikgJiYgKG4gPSB3YWxrKGksIHIpLCB2b2lkIDAgIT09IG4gPyBpW3JdID0gbiA6IGRlbGV0ZSBpW3JdKSB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldml2ZXIuY2FsbChlLCB0LCBpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGpcbiAgICAgICAgICAgIGlmICh0ZXh0ID0gU3RyaW5nKHRleHQpLCByeF9kYW5nZXJvdXMubGFzdEluZGV4ID0gMCwgcnhfZGFuZ2Vyb3VzLnRlc3QodGV4dCkgJiYgKHRleHQgPSB0ZXh0LnJlcGxhY2UocnhfZGFuZ2Vyb3VzLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIlxcXFx1XCIgKyAoXCIwMDAwXCIgKyBlLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNClcbiAgICAgICAgICAgIH0pKSwgcnhfb25lLnRlc3QodGV4dC5yZXBsYWNlKHJ4X3R3bywgXCJAXCIpLnJlcGxhY2UocnhfdGhyZWUsIFwiXVwiKS5yZXBsYWNlKHJ4X2ZvdXIsIFwiXCIpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBqID0gZXZhbChcIihcIiArIHRleHQgKyBcIilcIiksIHR5cGVvZiByZXZpdmVyID09PSBcImZ1bmN0aW9uXCIgPyB3YWxrKHtcbiAgICAgICAgICAgICAgICAgICAgXCJcIjogalxuICAgICAgICAgICAgICAgIH0sIFwiXCIpIDogalxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiSlNPTi5wYXJzZVwiKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gSlNPTlxuICAgIH0pKHt9KVxuIiwiLy9cbi8vIEF1dG9nZW5lcmF0ZWQgYnkgVGhyaWZ0IENvbXBpbGVyICgwLjEwLjApXG4vL1xuLy8gRE8gTk9UIEVESVQgVU5MRVNTIFlPVSBBUkUgU1VSRSBUSEFUIFlPVSBLTk9XIFdIQVQgWU9VIEFSRSBET0lOR1xuLy9cbnZhciBUaHJpZnQgPSByZXF1aXJlKFwiLi90aHJpZnRcIilcbi8vXG4vLyBBdXRvZ2VuZXJhdGVkIGJ5IFRocmlmdCBDb21waWxlciAoMC4xMC4wKVxuLy9cbi8vIERPIE5PVCBFRElUIFVOTEVTUyBZT1UgQVJFIFNVUkUgVEhBVCBZT1UgS05PVyBXSEFUIFlPVSBBUkUgRE9JTkdcbi8vXG5cbnZhciBUV2ViQWdlbnRMb2FkQmF0Y2ggPSBmdW5jdGlvbiAoYXJncykge1xuICB0aGlzLmxvYWRCYXRjaCA9IG51bGxcbiAgaWYgKGFyZ3MpIHtcbiAgICBpZiAoYXJncy5sb2FkQmF0Y2ggIT09IHVuZGVmaW5lZCAmJiBhcmdzLmxvYWRCYXRjaCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5sb2FkQmF0Y2ggPSBUaHJpZnQuY29weUxpc3QoYXJncy5sb2FkQmF0Y2gsIFtudWxsXSlcbiAgICB9XG4gIH1cbn1cblRXZWJBZ2VudExvYWRCYXRjaC5wcm90b3R5cGUgPSB7fVxuVFdlYkFnZW50TG9hZEJhdGNoLnByb3RvdHlwZS5yZWFkID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gIGlucHV0LnJlYWRTdHJ1Y3RCZWdpbigpXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgdmFyIHJldCA9IGlucHV0LnJlYWRGaWVsZEJlZ2luKClcbiAgICB2YXIgZm5hbWUgPSByZXQuZm5hbWVcbiAgICB2YXIgZnR5cGUgPSByZXQuZnR5cGVcbiAgICB2YXIgZmlkID0gcmV0LmZpZFxuICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5TVE9QKSB7XG4gICAgICBicmVha1xuICAgIH1cbiAgICBzd2l0Y2ggKGZpZCkge1xuICAgIGNhc2UgMTpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5MSVNUKSB7XG4gICAgICAgIHZhciBfc2l6ZTAgPSAwXG4gICAgICAgIHZhciBfcnRtcDM0XG4gICAgICAgIHRoaXMubG9hZEJhdGNoID0gW11cbiAgICAgICAgdmFyIF9ldHlwZTMgPSAwXG4gICAgICAgIF9ydG1wMzQgPSBpbnB1dC5yZWFkTGlzdEJlZ2luKClcbiAgICAgICAgX2V0eXBlMyA9IF9ydG1wMzQuZXR5cGVcbiAgICAgICAgX3NpemUwID0gX3J0bXAzNC5zaXplXG4gICAgICAgIGZvciAodmFyIF9pNSA9IDA7IF9pNSA8IF9zaXplMDsgKytfaTUpIHtcbiAgICAgICAgICB2YXIgZWxlbTYgPSBudWxsXG4gICAgICAgICAgZWxlbTYgPSBuZXcgVFdlYkFnZW50TG9hZCgpXG4gICAgICAgICAgZWxlbTYucmVhZChpbnB1dClcbiAgICAgICAgICB0aGlzLmxvYWRCYXRjaC5wdXNoKGVsZW02KVxuICAgICAgICB9XG4gICAgICAgIGlucHV0LnJlYWRMaXN0RW5kKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgMDpcbiAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgIH1cbiAgICBpbnB1dC5yZWFkRmllbGRFbmQoKVxuICB9XG4gIGlucHV0LnJlYWRTdHJ1Y3RFbmQoKVxufVxuXG5UV2ViQWdlbnRMb2FkQmF0Y2gucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKG91dHB1dCkge1xuICBvdXRwdXQud3JpdGVTdHJ1Y3RCZWdpbihcIlRXZWJBZ2VudExvYWRCYXRjaFwiKVxuICBpZiAodGhpcy5sb2FkQmF0Y2ggIT09IG51bGwgJiYgdGhpcy5sb2FkQmF0Y2ggIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJsb2FkQmF0Y2hcIiwgVGhyaWZ0LlR5cGUuTElTVCwgMSlcbiAgICBvdXRwdXQud3JpdGVMaXN0QmVnaW4oVGhyaWZ0LlR5cGUuU1RSVUNULCB0aGlzLmxvYWRCYXRjaC5sZW5ndGgpXG4gICAgZm9yICh2YXIgaXRlcjcgaW4gdGhpcy5sb2FkQmF0Y2gpIHtcbiAgICAgIGlmICh0aGlzLmxvYWRCYXRjaC5oYXNPd25Qcm9wZXJ0eShpdGVyNykpIHtcbiAgICAgICAgaXRlcjcgPSB0aGlzLmxvYWRCYXRjaFtpdGVyN11cbiAgICAgICAgaXRlcjcud3JpdGUob3V0cHV0KVxuICAgICAgfVxuICAgIH1cbiAgICBvdXRwdXQud3JpdGVMaXN0RW5kKClcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgb3V0cHV0LndyaXRlRmllbGRTdG9wKClcbiAgb3V0cHV0LndyaXRlU3RydWN0RW5kKClcbn1cblxudmFyIFRXZWJBZ2VudExvYWQgPSBmdW5jdGlvbiAoYXJncykge1xuICB0aGlzLmFnZW50SWQgPSBudWxsXG4gIHRoaXMudGllcklkID0gbnVsbFxuICB0aGlzLmFwcElkID0gbnVsbFxuICB0aGlzLnRyYWNlSWQgPSBudWxsXG4gIHRoaXMudXJsRG9tYWluID0gbnVsbFxuICB0aGlzLnVybFF1ZXJ5ID0gbnVsbFxuICB0aGlzLnJlcG9ydFRpbWUgPSBudWxsXG4gIHRoaXMuZmlyc3RTY3JlZW5UaW1lID0gbnVsbFxuICB0aGlzLndoaXRlU2NyZWVuVGltZSA9IG51bGxcbiAgdGhpcy5vcGVyYWJsZVRpbWUgPSBudWxsXG4gIHRoaXMucmVzb3VyY2VMb2FkZWRUaW1lID0gbnVsbFxuICB0aGlzLmxvYWRlZFRpbWUgPSBudWxsXG4gIHRoaXMuYnJvd3NlciA9IG51bGxcbiAgdGhpcy5iYWNrdXBQcm9wZXJ0aWVzID0gbnVsbFxuICB0aGlzLmJhY2t1cFF1b3RhID0gbnVsbFxuICBpZiAoYXJncykge1xuICAgIGlmIChhcmdzLmFnZW50SWQgIT09IHVuZGVmaW5lZCAmJiBhcmdzLmFnZW50SWQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYWdlbnRJZCA9IGFyZ3MuYWdlbnRJZFxuICAgIH1cbiAgICBpZiAoYXJncy50aWVySWQgIT09IHVuZGVmaW5lZCAmJiBhcmdzLnRpZXJJZCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy50aWVySWQgPSBhcmdzLnRpZXJJZFxuICAgIH1cbiAgICBpZiAoYXJncy5hcHBJZCAhPT0gdW5kZWZpbmVkICYmIGFyZ3MuYXBwSWQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYXBwSWQgPSBhcmdzLmFwcElkXG4gICAgfVxuICAgIGlmIChhcmdzLnRyYWNlSWQgIT09IHVuZGVmaW5lZCAmJiBhcmdzLnRyYWNlSWQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudHJhY2VJZCA9IGFyZ3MudHJhY2VJZFxuICAgIH1cbiAgICBpZiAoYXJncy51cmxEb21haW4gIT09IHVuZGVmaW5lZCAmJiBhcmdzLnVybERvbWFpbiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy51cmxEb21haW4gPSBhcmdzLnVybERvbWFpblxuICAgIH1cbiAgICBpZiAoYXJncy51cmxRdWVyeSAhPT0gdW5kZWZpbmVkICYmIGFyZ3MudXJsUXVlcnkgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudXJsUXVlcnkgPSBhcmdzLnVybFF1ZXJ5XG4gICAgfVxuICAgIGlmIChhcmdzLnJlcG9ydFRpbWUgIT09IHVuZGVmaW5lZCAmJiBhcmdzLnJlcG9ydFRpbWUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMucmVwb3J0VGltZSA9IGFyZ3MucmVwb3J0VGltZVxuICAgIH1cbiAgICBpZiAoYXJncy5maXJzdFNjcmVlblRpbWUgIT09IHVuZGVmaW5lZCAmJiBhcmdzLmZpcnN0U2NyZWVuVGltZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5maXJzdFNjcmVlblRpbWUgPSBhcmdzLmZpcnN0U2NyZWVuVGltZVxuICAgIH1cbiAgICBpZiAoYXJncy53aGl0ZVNjcmVlblRpbWUgIT09IHVuZGVmaW5lZCAmJiBhcmdzLndoaXRlU2NyZWVuVGltZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy53aGl0ZVNjcmVlblRpbWUgPSBhcmdzLndoaXRlU2NyZWVuVGltZVxuICAgIH1cbiAgICBpZiAoYXJncy5vcGVyYWJsZVRpbWUgIT09IHVuZGVmaW5lZCAmJiBhcmdzLm9wZXJhYmxlVGltZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5vcGVyYWJsZVRpbWUgPSBhcmdzLm9wZXJhYmxlVGltZVxuICAgIH1cbiAgICBpZiAoYXJncy5yZXNvdXJjZUxvYWRlZFRpbWUgIT09IHVuZGVmaW5lZCAmJiBhcmdzLnJlc291cmNlTG9hZGVkVGltZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5yZXNvdXJjZUxvYWRlZFRpbWUgPSBhcmdzLnJlc291cmNlTG9hZGVkVGltZVxuICAgIH1cbiAgICBpZiAoYXJncy5sb2FkZWRUaW1lICE9PSB1bmRlZmluZWQgJiYgYXJncy5sb2FkZWRUaW1lICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmxvYWRlZFRpbWUgPSBhcmdzLmxvYWRlZFRpbWVcbiAgICB9XG4gICAgaWYgKGFyZ3MuYnJvd3NlciAhPT0gdW5kZWZpbmVkICYmIGFyZ3MuYnJvd3NlciAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5icm93c2VyID0gYXJncy5icm93c2VyXG4gICAgfVxuICAgIGlmIChhcmdzLmJhY2t1cFByb3BlcnRpZXMgIT09IHVuZGVmaW5lZCAmJiBhcmdzLmJhY2t1cFByb3BlcnRpZXMgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYmFja3VwUHJvcGVydGllcyA9IFRocmlmdC5jb3B5TWFwKGFyZ3MuYmFja3VwUHJvcGVydGllcywgW251bGxdKVxuICAgIH1cbiAgICBpZiAoYXJncy5iYWNrdXBRdW90YSAhPT0gdW5kZWZpbmVkICYmIGFyZ3MuYmFja3VwUXVvdGEgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYmFja3VwUXVvdGEgPSBUaHJpZnQuY29weU1hcChhcmdzLmJhY2t1cFF1b3RhLCBbbnVsbF0pXG4gICAgfVxuICB9XG59XG5UV2ViQWdlbnRMb2FkLnByb3RvdHlwZSA9IHt9XG5UV2ViQWdlbnRMb2FkLnByb3RvdHlwZS5yZWFkID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gIGlucHV0LnJlYWRTdHJ1Y3RCZWdpbigpXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgdmFyIHJldCA9IGlucHV0LnJlYWRGaWVsZEJlZ2luKClcbiAgICB2YXIgZm5hbWUgPSByZXQuZm5hbWVcbiAgICB2YXIgZnR5cGUgPSByZXQuZnR5cGVcbiAgICB2YXIgZmlkID0gcmV0LmZpZFxuICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5TVE9QKSB7XG4gICAgICBicmVha1xuICAgIH1cbiAgICBzd2l0Y2ggKGZpZCkge1xuICAgIGNhc2UgMTpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5TVFJJTkcpIHtcbiAgICAgICAgdGhpcy5hZ2VudElkID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDI6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RSSU5HKSB7XG4gICAgICAgIHRoaXMudGllcklkID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDM6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RSSU5HKSB7XG4gICAgICAgIHRoaXMuYXBwSWQgPSBpbnB1dC5yZWFkU3RyaW5nKCkudmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgNDpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5TVFJJTkcpIHtcbiAgICAgICAgdGhpcy50cmFjZUlkID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDU6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RSSU5HKSB7XG4gICAgICAgIHRoaXMudXJsRG9tYWluID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDY6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RSSU5HKSB7XG4gICAgICAgIHRoaXMudXJsUXVlcnkgPSBpbnB1dC5yZWFkU3RyaW5nKCkudmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgNzpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5JNjQpIHtcbiAgICAgICAgdGhpcy5yZXBvcnRUaW1lID0gaW5wdXQucmVhZEk2NCgpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDg6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuSTY0KSB7XG4gICAgICAgIHRoaXMuZmlyc3RTY3JlZW5UaW1lID0gaW5wdXQucmVhZEk2NCgpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDk6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuSTY0KSB7XG4gICAgICAgIHRoaXMud2hpdGVTY3JlZW5UaW1lID0gaW5wdXQucmVhZEk2NCgpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDEwOlxuICAgICAgaWYgKGZ0eXBlID09IFRocmlmdC5UeXBlLkk2NCkge1xuICAgICAgICB0aGlzLm9wZXJhYmxlVGltZSA9IGlucHV0LnJlYWRJNjQoKS52YWx1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXQuc2tpcChmdHlwZSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAxMTpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5JNjQpIHtcbiAgICAgICAgdGhpcy5yZXNvdXJjZUxvYWRlZFRpbWUgPSBpbnB1dC5yZWFkSTY0KCkudmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgMTI6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuSTY0KSB7XG4gICAgICAgIHRoaXMubG9hZGVkVGltZSA9IGlucHV0LnJlYWRJNjQoKS52YWx1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXQuc2tpcChmdHlwZSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAxMzpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5TVFJJTkcpIHtcbiAgICAgICAgdGhpcy5icm93c2VyID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDE0OlxuICAgICAgaWYgKGZ0eXBlID09IFRocmlmdC5UeXBlLk1BUCkge1xuICAgICAgICB2YXIgX3NpemU4ID0gMFxuICAgICAgICB2YXIgX3J0bXAzMTJcbiAgICAgICAgdGhpcy5iYWNrdXBQcm9wZXJ0aWVzID0ge31cbiAgICAgICAgdmFyIF9rdHlwZTkgPSAwXG4gICAgICAgIHZhciBfdnR5cGUxMCA9IDBcbiAgICAgICAgX3J0bXAzMTIgPSBpbnB1dC5yZWFkTWFwQmVnaW4oKVxuICAgICAgICBfa3R5cGU5ID0gX3J0bXAzMTIua3R5cGVcbiAgICAgICAgX3Z0eXBlMTAgPSBfcnRtcDMxMi52dHlwZVxuICAgICAgICBfc2l6ZTggPSBfcnRtcDMxMi5zaXplXG4gICAgICAgIGZvciAodmFyIF9pMTMgPSAwOyBfaTEzIDwgX3NpemU4OyArK19pMTMpIHtcbiAgICAgICAgICBpZiAoX2kxMyA+IDApIHtcbiAgICAgICAgICAgIGlmIChpbnB1dC5yc3RhY2subGVuZ3RoID4gaW5wdXQucnBvc1tpbnB1dC5ycG9zLmxlbmd0aCAtIDFdICsgMSkge1xuICAgICAgICAgICAgICBpbnB1dC5yc3RhY2sucG9wKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGtleTE0ID0gbnVsbFxuICAgICAgICAgIHZhciB2YWwxNSA9IG51bGxcbiAgICAgICAgICBrZXkxNCA9IGlucHV0LnJlYWRTdHJpbmcoKS52YWx1ZVxuICAgICAgICAgIHZhbDE1ID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICAgICAgdGhpcy5iYWNrdXBQcm9wZXJ0aWVzW2tleTE0XSA9IHZhbDE1XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXQucmVhZE1hcEVuZCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDE1OlxuICAgICAgaWYgKGZ0eXBlID09IFRocmlmdC5UeXBlLk1BUCkge1xuICAgICAgICB2YXIgX3NpemUxNiA9IDBcbiAgICAgICAgdmFyIF9ydG1wMzIwXG4gICAgICAgIHRoaXMuYmFja3VwUXVvdGEgPSB7fVxuICAgICAgICB2YXIgX2t0eXBlMTcgPSAwXG4gICAgICAgIHZhciBfdnR5cGUxOCA9IDBcbiAgICAgICAgX3J0bXAzMjAgPSBpbnB1dC5yZWFkTWFwQmVnaW4oKVxuICAgICAgICBfa3R5cGUxNyA9IF9ydG1wMzIwLmt0eXBlXG4gICAgICAgIF92dHlwZTE4ID0gX3J0bXAzMjAudnR5cGVcbiAgICAgICAgX3NpemUxNiA9IF9ydG1wMzIwLnNpemVcbiAgICAgICAgZm9yICh2YXIgX2kyMSA9IDA7IF9pMjEgPCBfc2l6ZTE2OyArK19pMjEpIHtcbiAgICAgICAgICBpZiAoX2kyMSA+IDApIHtcbiAgICAgICAgICAgIGlmIChpbnB1dC5yc3RhY2subGVuZ3RoID4gaW5wdXQucnBvc1tpbnB1dC5ycG9zLmxlbmd0aCAtIDFdICsgMSkge1xuICAgICAgICAgICAgICBpbnB1dC5yc3RhY2sucG9wKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGtleTIyID0gbnVsbFxuICAgICAgICAgIHZhciB2YWwyMyA9IG51bGxcbiAgICAgICAgICBrZXkyMiA9IGlucHV0LnJlYWRTdHJpbmcoKS52YWx1ZVxuICAgICAgICAgIHZhbDIzID0gaW5wdXQucmVhZEk2NCgpLnZhbHVlXG4gICAgICAgICAgdGhpcy5iYWNrdXBRdW90YVtrZXkyMl0gPSB2YWwyM1xuICAgICAgICB9XG4gICAgICAgIGlucHV0LnJlYWRNYXBFbmQoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXQuc2tpcChmdHlwZSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgfVxuICAgIGlucHV0LnJlYWRGaWVsZEVuZCgpXG4gIH1cbiAgaW5wdXQucmVhZFN0cnVjdEVuZCgpXG59XG5cblRXZWJBZ2VudExvYWQucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKG91dHB1dCkge1xuICBvdXRwdXQud3JpdGVTdHJ1Y3RCZWdpbihcIlRXZWJBZ2VudExvYWRcIilcbiAgaWYgKHRoaXMuYWdlbnRJZCAhPT0gbnVsbCAmJiB0aGlzLmFnZW50SWQgIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJhZ2VudElkXCIsIFRocmlmdC5UeXBlLlNUUklORywgMSlcbiAgICBvdXRwdXQud3JpdGVTdHJpbmcodGhpcy5hZ2VudElkKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuICBpZiAodGhpcy50aWVySWQgIT09IG51bGwgJiYgdGhpcy50aWVySWQgIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJ0aWVySWRcIiwgVGhyaWZ0LlR5cGUuU1RSSU5HLCAyKVxuICAgIG91dHB1dC53cml0ZVN0cmluZyh0aGlzLnRpZXJJZClcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMuYXBwSWQgIT09IG51bGwgJiYgdGhpcy5hcHBJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0cHV0LndyaXRlRmllbGRCZWdpbihcImFwcElkXCIsIFRocmlmdC5UeXBlLlNUUklORywgMylcbiAgICBvdXRwdXQud3JpdGVTdHJpbmcodGhpcy5hcHBJZClcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMudHJhY2VJZCAhPT0gbnVsbCAmJiB0aGlzLnRyYWNlSWQgIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJ0cmFjZUlkXCIsIFRocmlmdC5UeXBlLlNUUklORywgNClcbiAgICBvdXRwdXQud3JpdGVTdHJpbmcodGhpcy50cmFjZUlkKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuICBpZiAodGhpcy51cmxEb21haW4gIT09IG51bGwgJiYgdGhpcy51cmxEb21haW4gIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJ1cmxEb21haW5cIiwgVGhyaWZ0LlR5cGUuU1RSSU5HLCA1KVxuICAgIG91dHB1dC53cml0ZVN0cmluZyh0aGlzLnVybERvbWFpbilcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMudXJsUXVlcnkgIT09IG51bGwgJiYgdGhpcy51cmxRdWVyeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0cHV0LndyaXRlRmllbGRCZWdpbihcInVybFF1ZXJ5XCIsIFRocmlmdC5UeXBlLlNUUklORywgNilcbiAgICBvdXRwdXQud3JpdGVTdHJpbmcodGhpcy51cmxRdWVyeSlcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMucmVwb3J0VGltZSAhPT0gbnVsbCAmJiB0aGlzLnJlcG9ydFRpbWUgIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJyZXBvcnRUaW1lXCIsIFRocmlmdC5UeXBlLkk2NCwgNylcbiAgICBvdXRwdXQud3JpdGVJNjQodGhpcy5yZXBvcnRUaW1lKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuICBpZiAodGhpcy5maXJzdFNjcmVlblRpbWUgIT09IG51bGwgJiYgdGhpcy5maXJzdFNjcmVlblRpbWUgIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJmaXJzdFNjcmVlblRpbWVcIiwgVGhyaWZ0LlR5cGUuSTY0LCA4KVxuICAgIG91dHB1dC53cml0ZUk2NCh0aGlzLmZpcnN0U2NyZWVuVGltZSlcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMud2hpdGVTY3JlZW5UaW1lICE9PSBudWxsICYmIHRoaXMud2hpdGVTY3JlZW5UaW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwid2hpdGVTY3JlZW5UaW1lXCIsIFRocmlmdC5UeXBlLkk2NCwgOSlcbiAgICBvdXRwdXQud3JpdGVJNjQodGhpcy53aGl0ZVNjcmVlblRpbWUpXG4gICAgb3V0cHV0LndyaXRlRmllbGRFbmQoKVxuICB9XG4gIGlmICh0aGlzLm9wZXJhYmxlVGltZSAhPT0gbnVsbCAmJiB0aGlzLm9wZXJhYmxlVGltZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0cHV0LndyaXRlRmllbGRCZWdpbihcIm9wZXJhYmxlVGltZVwiLCBUaHJpZnQuVHlwZS5JNjQsIDEwKVxuICAgIG91dHB1dC53cml0ZUk2NCh0aGlzLm9wZXJhYmxlVGltZSlcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMucmVzb3VyY2VMb2FkZWRUaW1lICE9PSBudWxsICYmIHRoaXMucmVzb3VyY2VMb2FkZWRUaW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwicmVzb3VyY2VMb2FkZWRUaW1lXCIsIFRocmlmdC5UeXBlLkk2NCwgMTEpXG4gICAgb3V0cHV0LndyaXRlSTY0KHRoaXMucmVzb3VyY2VMb2FkZWRUaW1lKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuICBpZiAodGhpcy5sb2FkZWRUaW1lICE9PSBudWxsICYmIHRoaXMubG9hZGVkVGltZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0cHV0LndyaXRlRmllbGRCZWdpbihcImxvYWRlZFRpbWVcIiwgVGhyaWZ0LlR5cGUuSTY0LCAxMilcbiAgICBvdXRwdXQud3JpdGVJNjQodGhpcy5sb2FkZWRUaW1lKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuICBpZiAodGhpcy5icm93c2VyICE9PSBudWxsICYmIHRoaXMuYnJvd3NlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0cHV0LndyaXRlRmllbGRCZWdpbihcImJyb3dzZXJcIiwgVGhyaWZ0LlR5cGUuU1RSSU5HLCAxMylcbiAgICBvdXRwdXQud3JpdGVTdHJpbmcodGhpcy5icm93c2VyKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuICBpZiAodGhpcy5iYWNrdXBQcm9wZXJ0aWVzICE9PSBudWxsICYmIHRoaXMuYmFja3VwUHJvcGVydGllcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0cHV0LndyaXRlRmllbGRCZWdpbihcImJhY2t1cFByb3BlcnRpZXNcIiwgVGhyaWZ0LlR5cGUuTUFQLCAxNClcbiAgICBvdXRwdXQud3JpdGVNYXBCZWdpbihUaHJpZnQuVHlwZS5TVFJJTkcsIFRocmlmdC5UeXBlLlNUUklORywgVGhyaWZ0Lm9iamVjdExlbmd0aCh0aGlzLmJhY2t1cFByb3BlcnRpZXMpKVxuICAgIGZvciAodmFyIGtpdGVyMjQgaW4gdGhpcy5iYWNrdXBQcm9wZXJ0aWVzKSB7XG4gICAgICBpZiAodGhpcy5iYWNrdXBQcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KGtpdGVyMjQpKSB7XG4gICAgICAgIHZhciB2aXRlcjI1ID0gdGhpcy5iYWNrdXBQcm9wZXJ0aWVzW2tpdGVyMjRdXG4gICAgICAgIG91dHB1dC53cml0ZVN0cmluZyhraXRlcjI0KVxuICAgICAgICBvdXRwdXQud3JpdGVTdHJpbmcodml0ZXIyNSlcbiAgICAgIH1cbiAgICB9XG4gICAgb3V0cHV0LndyaXRlTWFwRW5kKClcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMuYmFja3VwUXVvdGEgIT09IG51bGwgJiYgdGhpcy5iYWNrdXBRdW90YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0cHV0LndyaXRlRmllbGRCZWdpbihcImJhY2t1cFF1b3RhXCIsIFRocmlmdC5UeXBlLk1BUCwgMTUpXG4gICAgb3V0cHV0LndyaXRlTWFwQmVnaW4oVGhyaWZ0LlR5cGUuU1RSSU5HLCBUaHJpZnQuVHlwZS5JNjQsIFRocmlmdC5vYmplY3RMZW5ndGgodGhpcy5iYWNrdXBRdW90YSkpXG4gICAgZm9yICh2YXIga2l0ZXIyNiBpbiB0aGlzLmJhY2t1cFF1b3RhKSB7XG4gICAgICBpZiAodGhpcy5iYWNrdXBRdW90YS5oYXNPd25Qcm9wZXJ0eShraXRlcjI2KSkge1xuICAgICAgICB2YXIgdml0ZXIyNyA9IHRoaXMuYmFja3VwUXVvdGFba2l0ZXIyNl1cbiAgICAgICAgb3V0cHV0LndyaXRlU3RyaW5nKGtpdGVyMjYpXG4gICAgICAgIG91dHB1dC53cml0ZUk2NCh2aXRlcjI3KVxuICAgICAgfVxuICAgIH1cbiAgICBvdXRwdXQud3JpdGVNYXBFbmQoKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuICBvdXRwdXQud3JpdGVGaWVsZFN0b3AoKVxuICBvdXRwdXQud3JpdGVTdHJ1Y3RFbmQoKVxufVxuXG52YXIgVFdlYkFnZW50QWpheEJhdGNoID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgdGhpcy5hamF4QmF0Y2ggPSBudWxsXG4gIGlmIChhcmdzKSB7XG4gICAgaWYgKGFyZ3MuYWpheEJhdGNoICE9PSB1bmRlZmluZWQgJiYgYXJncy5hamF4QmF0Y2ggIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYWpheEJhdGNoID0gVGhyaWZ0LmNvcHlMaXN0KGFyZ3MuYWpheEJhdGNoLCBbbnVsbF0pXG4gICAgfVxuICB9XG59XG5UV2ViQWdlbnRBamF4QmF0Y2gucHJvdG90eXBlID0ge31cblRXZWJBZ2VudEFqYXhCYXRjaC5wcm90b3R5cGUucmVhZCA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICBpbnB1dC5yZWFkU3RydWN0QmVnaW4oKVxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHZhciByZXQgPSBpbnB1dC5yZWFkRmllbGRCZWdpbigpXG4gICAgdmFyIGZuYW1lID0gcmV0LmZuYW1lXG4gICAgdmFyIGZ0eXBlID0gcmV0LmZ0eXBlXG4gICAgdmFyIGZpZCA9IHJldC5maWRcbiAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RPUCkge1xuICAgICAgYnJlYWtcbiAgICB9XG4gICAgc3dpdGNoIChmaWQpIHtcbiAgICBjYXNlIDE6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuTElTVCkge1xuICAgICAgICB2YXIgX3NpemUyOCA9IDBcbiAgICAgICAgdmFyIF9ydG1wMzMyXG4gICAgICAgIHRoaXMuYWpheEJhdGNoID0gW11cbiAgICAgICAgdmFyIF9ldHlwZTMxID0gMFxuICAgICAgICBfcnRtcDMzMiA9IGlucHV0LnJlYWRMaXN0QmVnaW4oKVxuICAgICAgICBfZXR5cGUzMSA9IF9ydG1wMzMyLmV0eXBlXG4gICAgICAgIF9zaXplMjggPSBfcnRtcDMzMi5zaXplXG4gICAgICAgIGZvciAodmFyIF9pMzMgPSAwOyBfaTMzIDwgX3NpemUyODsgKytfaTMzKSB7XG4gICAgICAgICAgdmFyIGVsZW0zNCA9IG51bGxcbiAgICAgICAgICBlbGVtMzQgPSBuZXcgVFdlYkFnZW50QWpheCgpXG4gICAgICAgICAgZWxlbTM0LnJlYWQoaW5wdXQpXG4gICAgICAgICAgdGhpcy5hamF4QmF0Y2gucHVzaChlbGVtMzQpXG4gICAgICAgIH1cbiAgICAgICAgaW5wdXQucmVhZExpc3RFbmQoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXQuc2tpcChmdHlwZSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAwOlxuICAgICAgaW5wdXQuc2tpcChmdHlwZSlcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgfVxuICAgIGlucHV0LnJlYWRGaWVsZEVuZCgpXG4gIH1cbiAgaW5wdXQucmVhZFN0cnVjdEVuZCgpXG59XG5cblRXZWJBZ2VudEFqYXhCYXRjaC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAob3V0cHV0KSB7XG4gIG91dHB1dC53cml0ZVN0cnVjdEJlZ2luKFwiVFdlYkFnZW50QWpheEJhdGNoXCIpXG4gIGlmICh0aGlzLmFqYXhCYXRjaCAhPT0gbnVsbCAmJiB0aGlzLmFqYXhCYXRjaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0cHV0LndyaXRlRmllbGRCZWdpbihcImFqYXhCYXRjaFwiLCBUaHJpZnQuVHlwZS5MSVNULCAxKVxuICAgIG91dHB1dC53cml0ZUxpc3RCZWdpbihUaHJpZnQuVHlwZS5TVFJVQ1QsIHRoaXMuYWpheEJhdGNoLmxlbmd0aClcbiAgICBmb3IgKHZhciBpdGVyMzUgaW4gdGhpcy5hamF4QmF0Y2gpIHtcbiAgICAgIGlmICh0aGlzLmFqYXhCYXRjaC5oYXNPd25Qcm9wZXJ0eShpdGVyMzUpKSB7XG4gICAgICAgIGl0ZXIzNSA9IHRoaXMuYWpheEJhdGNoW2l0ZXIzNV1cbiAgICAgICAgaXRlcjM1LndyaXRlKG91dHB1dClcbiAgICAgIH1cbiAgICB9XG4gICAgb3V0cHV0LndyaXRlTGlzdEVuZCgpXG4gICAgb3V0cHV0LndyaXRlRmllbGRFbmQoKVxuICB9XG4gIG91dHB1dC53cml0ZUZpZWxkU3RvcCgpXG4gIG91dHB1dC53cml0ZVN0cnVjdEVuZCgpXG59XG5cbnZhciBUV2ViQWdlbnRBamF4ID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgdGhpcy5hZ2VudElkID0gbnVsbFxuICB0aGlzLnRpZXJJZCA9IG51bGxcbiAgdGhpcy5hcHBJZCA9IG51bGxcbiAgdGhpcy50cmFjZUlkID0gbnVsbFxuICB0aGlzLnVybERvbWFpbiA9IG51bGxcbiAgdGhpcy51cmxRdWVyeSA9IG51bGxcbiAgdGhpcy5yZXBvcnRUaW1lID0gbnVsbFxuICB0aGlzLmxvYWRlZFRpbWUgPSBudWxsXG4gIHRoaXMuYnJvd3NlciA9IG51bGxcbiAgdGhpcy5iYWNrdXBQcm9wZXJ0aWVzID0gbnVsbFxuICB0aGlzLmJhY2t1cFF1b3RhID0gbnVsbFxuICBpZiAoYXJncykge1xuICAgIGlmIChhcmdzLmFnZW50SWQgIT09IHVuZGVmaW5lZCAmJiBhcmdzLmFnZW50SWQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYWdlbnRJZCA9IGFyZ3MuYWdlbnRJZFxuICAgIH1cbiAgICBpZiAoYXJncy50aWVySWQgIT09IHVuZGVmaW5lZCAmJiBhcmdzLnRpZXJJZCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy50aWVySWQgPSBhcmdzLnRpZXJJZFxuICAgIH1cbiAgICBpZiAoYXJncy5hcHBJZCAhPT0gdW5kZWZpbmVkICYmIGFyZ3MuYXBwSWQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYXBwSWQgPSBhcmdzLmFwcElkXG4gICAgfVxuICAgIGlmIChhcmdzLnRyYWNlSWQgIT09IHVuZGVmaW5lZCAmJiBhcmdzLnRyYWNlSWQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudHJhY2VJZCA9IGFyZ3MudHJhY2VJZFxuICAgIH1cbiAgICBpZiAoYXJncy51cmxEb21haW4gIT09IHVuZGVmaW5lZCAmJiBhcmdzLnVybERvbWFpbiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy51cmxEb21haW4gPSBhcmdzLnVybERvbWFpblxuICAgIH1cbiAgICBpZiAoYXJncy51cmxRdWVyeSAhPT0gdW5kZWZpbmVkICYmIGFyZ3MudXJsUXVlcnkgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudXJsUXVlcnkgPSBhcmdzLnVybFF1ZXJ5XG4gICAgfVxuICAgIGlmIChhcmdzLnJlcG9ydFRpbWUgIT09IHVuZGVmaW5lZCAmJiBhcmdzLnJlcG9ydFRpbWUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMucmVwb3J0VGltZSA9IGFyZ3MucmVwb3J0VGltZVxuICAgIH1cbiAgICBpZiAoYXJncy5sb2FkZWRUaW1lICE9PSB1bmRlZmluZWQgJiYgYXJncy5sb2FkZWRUaW1lICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmxvYWRlZFRpbWUgPSBhcmdzLmxvYWRlZFRpbWVcbiAgICB9XG4gICAgaWYgKGFyZ3MuYnJvd3NlciAhPT0gdW5kZWZpbmVkICYmIGFyZ3MuYnJvd3NlciAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5icm93c2VyID0gYXJncy5icm93c2VyXG4gICAgfVxuICAgIGlmIChhcmdzLmJhY2t1cFByb3BlcnRpZXMgIT09IHVuZGVmaW5lZCAmJiBhcmdzLmJhY2t1cFByb3BlcnRpZXMgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYmFja3VwUHJvcGVydGllcyA9IFRocmlmdC5jb3B5TWFwKGFyZ3MuYmFja3VwUHJvcGVydGllcywgW251bGxdKVxuICAgIH1cbiAgICBpZiAoYXJncy5iYWNrdXBRdW90YSAhPT0gdW5kZWZpbmVkICYmIGFyZ3MuYmFja3VwUXVvdGEgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYmFja3VwUXVvdGEgPSBUaHJpZnQuY29weU1hcChhcmdzLmJhY2t1cFF1b3RhLCBbbnVsbF0pXG4gICAgfVxuICB9XG59XG5UV2ViQWdlbnRBamF4LnByb3RvdHlwZSA9IHt9XG5UV2ViQWdlbnRBamF4LnByb3RvdHlwZS5yZWFkID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gIGlucHV0LnJlYWRTdHJ1Y3RCZWdpbigpXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgdmFyIHJldCA9IGlucHV0LnJlYWRGaWVsZEJlZ2luKClcbiAgICB2YXIgZm5hbWUgPSByZXQuZm5hbWVcbiAgICB2YXIgZnR5cGUgPSByZXQuZnR5cGVcbiAgICB2YXIgZmlkID0gcmV0LmZpZFxuICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5TVE9QKSB7XG4gICAgICBicmVha1xuICAgIH1cbiAgICBzd2l0Y2ggKGZpZCkge1xuICAgIGNhc2UgMTpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5TVFJJTkcpIHtcbiAgICAgICAgdGhpcy5hZ2VudElkID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDI6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RSSU5HKSB7XG4gICAgICAgIHRoaXMudGllcklkID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDM6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RSSU5HKSB7XG4gICAgICAgIHRoaXMuYXBwSWQgPSBpbnB1dC5yZWFkU3RyaW5nKCkudmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgNDpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5TVFJJTkcpIHtcbiAgICAgICAgdGhpcy50cmFjZUlkID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDU6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RSSU5HKSB7XG4gICAgICAgIHRoaXMudXJsRG9tYWluID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDY6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RSSU5HKSB7XG4gICAgICAgIHRoaXMudXJsUXVlcnkgPSBpbnB1dC5yZWFkU3RyaW5nKCkudmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgNzpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5JNjQpIHtcbiAgICAgICAgdGhpcy5yZXBvcnRUaW1lID0gaW5wdXQucmVhZEk2NCgpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDg6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuSTY0KSB7XG4gICAgICAgIHRoaXMubG9hZGVkVGltZSA9IGlucHV0LnJlYWRJNjQoKS52YWx1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXQuc2tpcChmdHlwZSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSA5OlxuICAgICAgaWYgKGZ0eXBlID09IFRocmlmdC5UeXBlLlNUUklORykge1xuICAgICAgICB0aGlzLmJyb3dzZXIgPSBpbnB1dC5yZWFkU3RyaW5nKCkudmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgMTA6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuTUFQKSB7XG4gICAgICAgIHZhciBfc2l6ZTM2ID0gMFxuICAgICAgICB2YXIgX3J0bXAzNDBcbiAgICAgICAgdGhpcy5iYWNrdXBQcm9wZXJ0aWVzID0ge31cbiAgICAgICAgdmFyIF9rdHlwZTM3ID0gMFxuICAgICAgICB2YXIgX3Z0eXBlMzggPSAwXG4gICAgICAgIF9ydG1wMzQwID0gaW5wdXQucmVhZE1hcEJlZ2luKClcbiAgICAgICAgX2t0eXBlMzcgPSBfcnRtcDM0MC5rdHlwZVxuICAgICAgICBfdnR5cGUzOCA9IF9ydG1wMzQwLnZ0eXBlXG4gICAgICAgIF9zaXplMzYgPSBfcnRtcDM0MC5zaXplXG4gICAgICAgIGZvciAodmFyIF9pNDEgPSAwOyBfaTQxIDwgX3NpemUzNjsgKytfaTQxKSB7XG4gICAgICAgICAgaWYgKF9pNDEgPiAwKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQucnN0YWNrLmxlbmd0aCA+IGlucHV0LnJwb3NbaW5wdXQucnBvcy5sZW5ndGggLSAxXSArIDEpIHtcbiAgICAgICAgICAgICAgaW5wdXQucnN0YWNrLnBvcCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBrZXk0MiA9IG51bGxcbiAgICAgICAgICB2YXIgdmFsNDMgPSBudWxsXG4gICAgICAgICAga2V5NDIgPSBpbnB1dC5yZWFkU3RyaW5nKCkudmFsdWVcbiAgICAgICAgICB2YWw0MyA9IGlucHV0LnJlYWRTdHJpbmcoKS52YWx1ZVxuICAgICAgICAgIHRoaXMuYmFja3VwUHJvcGVydGllc1trZXk0Ml0gPSB2YWw0M1xuICAgICAgICB9XG4gICAgICAgIGlucHV0LnJlYWRNYXBFbmQoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXQuc2tpcChmdHlwZSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAxMTpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5NQVApIHtcbiAgICAgICAgdmFyIF9zaXplNDQgPSAwXG4gICAgICAgIHZhciBfcnRtcDM0OFxuICAgICAgICB0aGlzLmJhY2t1cFF1b3RhID0ge31cbiAgICAgICAgdmFyIF9rdHlwZTQ1ID0gMFxuICAgICAgICB2YXIgX3Z0eXBlNDYgPSAwXG4gICAgICAgIF9ydG1wMzQ4ID0gaW5wdXQucmVhZE1hcEJlZ2luKClcbiAgICAgICAgX2t0eXBlNDUgPSBfcnRtcDM0OC5rdHlwZVxuICAgICAgICBfdnR5cGU0NiA9IF9ydG1wMzQ4LnZ0eXBlXG4gICAgICAgIF9zaXplNDQgPSBfcnRtcDM0OC5zaXplXG4gICAgICAgIGZvciAodmFyIF9pNDkgPSAwOyBfaTQ5IDwgX3NpemU0NDsgKytfaTQ5KSB7XG4gICAgICAgICAgaWYgKF9pNDkgPiAwKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQucnN0YWNrLmxlbmd0aCA+IGlucHV0LnJwb3NbaW5wdXQucnBvcy5sZW5ndGggLSAxXSArIDEpIHtcbiAgICAgICAgICAgICAgaW5wdXQucnN0YWNrLnBvcCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBrZXk1MCA9IG51bGxcbiAgICAgICAgICB2YXIgdmFsNTEgPSBudWxsXG4gICAgICAgICAga2V5NTAgPSBpbnB1dC5yZWFkU3RyaW5nKCkudmFsdWVcbiAgICAgICAgICB2YWw1MSA9IGlucHV0LnJlYWRJNjQoKS52YWx1ZVxuICAgICAgICAgIHRoaXMuYmFja3VwUXVvdGFba2V5NTBdID0gdmFsNTFcbiAgICAgICAgfVxuICAgICAgICBpbnB1dC5yZWFkTWFwRW5kKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgIH1cbiAgICBpbnB1dC5yZWFkRmllbGRFbmQoKVxuICB9XG4gIGlucHV0LnJlYWRTdHJ1Y3RFbmQoKVxufVxuXG5UV2ViQWdlbnRBamF4LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChvdXRwdXQpIHtcbiAgb3V0cHV0LndyaXRlU3RydWN0QmVnaW4oXCJUV2ViQWdlbnRBamF4XCIpXG4gIGlmICh0aGlzLmFnZW50SWQgIT09IG51bGwgJiYgdGhpcy5hZ2VudElkICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwiYWdlbnRJZFwiLCBUaHJpZnQuVHlwZS5TVFJJTkcsIDEpXG4gICAgb3V0cHV0LndyaXRlU3RyaW5nKHRoaXMuYWdlbnRJZClcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMudGllcklkICE9PSBudWxsICYmIHRoaXMudGllcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwidGllcklkXCIsIFRocmlmdC5UeXBlLlNUUklORywgMilcbiAgICBvdXRwdXQud3JpdGVTdHJpbmcodGhpcy50aWVySWQpXG4gICAgb3V0cHV0LndyaXRlRmllbGRFbmQoKVxuICB9XG4gIGlmICh0aGlzLmFwcElkICE9PSBudWxsICYmIHRoaXMuYXBwSWQgIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJhcHBJZFwiLCBUaHJpZnQuVHlwZS5TVFJJTkcsIDMpXG4gICAgb3V0cHV0LndyaXRlU3RyaW5nKHRoaXMuYXBwSWQpXG4gICAgb3V0cHV0LndyaXRlRmllbGRFbmQoKVxuICB9XG4gIGlmICh0aGlzLnRyYWNlSWQgIT09IG51bGwgJiYgdGhpcy50cmFjZUlkICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwidHJhY2VJZFwiLCBUaHJpZnQuVHlwZS5TVFJJTkcsIDQpXG4gICAgb3V0cHV0LndyaXRlU3RyaW5nKHRoaXMudHJhY2VJZClcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMudXJsRG9tYWluICE9PSBudWxsICYmIHRoaXMudXJsRG9tYWluICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwidXJsRG9tYWluXCIsIFRocmlmdC5UeXBlLlNUUklORywgNSlcbiAgICBvdXRwdXQud3JpdGVTdHJpbmcodGhpcy51cmxEb21haW4pXG4gICAgb3V0cHV0LndyaXRlRmllbGRFbmQoKVxuICB9XG4gIGlmICh0aGlzLnVybFF1ZXJ5ICE9PSBudWxsICYmIHRoaXMudXJsUXVlcnkgIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJ1cmxRdWVyeVwiLCBUaHJpZnQuVHlwZS5TVFJJTkcsIDYpXG4gICAgb3V0cHV0LndyaXRlU3RyaW5nKHRoaXMudXJsUXVlcnkpXG4gICAgb3V0cHV0LndyaXRlRmllbGRFbmQoKVxuICB9XG4gIGlmICh0aGlzLnJlcG9ydFRpbWUgIT09IG51bGwgJiYgdGhpcy5yZXBvcnRUaW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwicmVwb3J0VGltZVwiLCBUaHJpZnQuVHlwZS5JNjQsIDcpXG4gICAgb3V0cHV0LndyaXRlSTY0KHRoaXMucmVwb3J0VGltZSlcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMubG9hZGVkVGltZSAhPT0gbnVsbCAmJiB0aGlzLmxvYWRlZFRpbWUgIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJsb2FkZWRUaW1lXCIsIFRocmlmdC5UeXBlLkk2NCwgOClcbiAgICBvdXRwdXQud3JpdGVJNjQodGhpcy5sb2FkZWRUaW1lKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuICBpZiAodGhpcy5icm93c2VyICE9PSBudWxsICYmIHRoaXMuYnJvd3NlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0cHV0LndyaXRlRmllbGRCZWdpbihcImJyb3dzZXJcIiwgVGhyaWZ0LlR5cGUuU1RSSU5HLCA5KVxuICAgIG91dHB1dC53cml0ZVN0cmluZyh0aGlzLmJyb3dzZXIpXG4gICAgb3V0cHV0LndyaXRlRmllbGRFbmQoKVxuICB9XG4gIGlmICh0aGlzLmJhY2t1cFByb3BlcnRpZXMgIT09IG51bGwgJiYgdGhpcy5iYWNrdXBQcm9wZXJ0aWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwiYmFja3VwUHJvcGVydGllc1wiLCBUaHJpZnQuVHlwZS5NQVAsIDEwKVxuICAgIG91dHB1dC53cml0ZU1hcEJlZ2luKFRocmlmdC5UeXBlLlNUUklORywgVGhyaWZ0LlR5cGUuU1RSSU5HLCBUaHJpZnQub2JqZWN0TGVuZ3RoKHRoaXMuYmFja3VwUHJvcGVydGllcykpXG4gICAgZm9yICh2YXIga2l0ZXI1MiBpbiB0aGlzLmJhY2t1cFByb3BlcnRpZXMpIHtcbiAgICAgIGlmICh0aGlzLmJhY2t1cFByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkoa2l0ZXI1MikpIHtcbiAgICAgICAgdmFyIHZpdGVyNTMgPSB0aGlzLmJhY2t1cFByb3BlcnRpZXNba2l0ZXI1Ml1cbiAgICAgICAgb3V0cHV0LndyaXRlU3RyaW5nKGtpdGVyNTIpXG4gICAgICAgIG91dHB1dC53cml0ZVN0cmluZyh2aXRlcjUzKVxuICAgICAgfVxuICAgIH1cbiAgICBvdXRwdXQud3JpdGVNYXBFbmQoKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuICBpZiAodGhpcy5iYWNrdXBRdW90YSAhPT0gbnVsbCAmJiB0aGlzLmJhY2t1cFF1b3RhICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwiYmFja3VwUXVvdGFcIiwgVGhyaWZ0LlR5cGUuTUFQLCAxMSlcbiAgICBvdXRwdXQud3JpdGVNYXBCZWdpbihUaHJpZnQuVHlwZS5TVFJJTkcsIFRocmlmdC5UeXBlLkk2NCwgVGhyaWZ0Lm9iamVjdExlbmd0aCh0aGlzLmJhY2t1cFF1b3RhKSlcbiAgICBmb3IgKHZhciBraXRlcjU0IGluIHRoaXMuYmFja3VwUXVvdGEpIHtcbiAgICAgIGlmICh0aGlzLmJhY2t1cFF1b3RhLmhhc093blByb3BlcnR5KGtpdGVyNTQpKSB7XG4gICAgICAgIHZhciB2aXRlcjU1ID0gdGhpcy5iYWNrdXBRdW90YVtraXRlcjU0XVxuICAgICAgICBvdXRwdXQud3JpdGVTdHJpbmcoa2l0ZXI1NClcbiAgICAgICAgb3V0cHV0LndyaXRlSTY0KHZpdGVyNTUpXG4gICAgICB9XG4gICAgfVxuICAgIG91dHB1dC53cml0ZU1hcEVuZCgpXG4gICAgb3V0cHV0LndyaXRlRmllbGRFbmQoKVxuICB9XG4gIG91dHB1dC53cml0ZUZpZWxkU3RvcCgpXG4gIG91dHB1dC53cml0ZVN0cnVjdEVuZCgpXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBUV2ViQWdlbnRMb2FkOiBUV2ViQWdlbnRMb2FkLFxuICBUV2ViQWdlbnRBamF4OiBUV2ViQWdlbnRBamF4LFxuICBUV2ViQWdlbnRMb2FkQmF0Y2g6IFRXZWJBZ2VudExvYWRCYXRjaCxcbiAgVFdlYkFnZW50QWpheEJhdGNoOiBUV2ViQWdlbnRBamF4QmF0Y2hcbn1cbiIsInZhciBsb2cgPSByZXF1aXJlKFwiLi9sb2dcIilcbnZhciBfbG9ja1RpbWVyID0gbnVsbFxudmFyIF9sb2NrU3RhdGUgPSBmYWxzZVxudmFyIGNicyA9IFtdXG52YXIgbG9ja2VyID0ge1xuICBleGVjOiBmdW5jdGlvbiAoY2IpIHtcbiAgICBjYnMucHVzaChjYilcbiAgICBpZiAoIV9sb2NrVGltZXIpIHtcbiAgICAgIF9sb2NrVGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChfbG9ja1N0YXRlIHx8IGNicy5sZW5ndGggPD0gMCkgcmV0dXJuXG4gICAgICAgIF9sb2NrU3RhdGUgPSB0cnVlXG4gICAgICAgIHZhciBjYWxsYmFjayA9IGNicy5zaGlmdCgpXG4gICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgbG9nKFwi6Zif5YiX5Ye95pWw5pWw6YeP77yaXCIgKyBjYnMubGVuZ3RoKVxuICAgICAgICBpZiAoY2JzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoX2xvY2tUaW1lcilcbiAgICAgICAgICBfbG9ja1RpbWVyID0gbnVsbFxuICAgICAgICB9XG4gICAgICAgIF9sb2NrU3RhdGUgPSBmYWxzZVxuICAgICAgfSwgMClcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsb2NrZXJcbiIsInZhciBjb25maWcgPSByZXF1aXJlKFwiLi9jb25maWdcIilcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIWNvbmZpZy5zaG93TG9nKSByZXR1cm5cbiAgaWYgKHR5cGVvZiBjb25zb2xlID09PSBcIm9iamVjdFwiICYmIGNvbnNvbGUubG9nKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cylcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHNbMF0pXG4gICAgfVxuICB9XG59XG4iLCJ2YXIgXyA9IHJlcXVpcmUoXCIuL2NvbW1vblwiKVxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL2NvbmZpZ1wiKVxuXG52YXIgcGVyZm9ybWFuY2UgPSByZXF1aXJlKFwiLi9wZXJmb3JtYW5jZVwiKVxudmFyIHJ4QXBtID0ge1xuICBjb25maWc6IGNvbmZpZ1xufVxucnhBcG0uaW5pdCA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgdmFyIHRoYXQgPSB0aGlzXG4gIGlmIChjb25maWcgJiYgIV8uaXNFbXB0eU9iamVjdChjb25maWcpKSB7XG4gICAgXy5leHRlbmQodGhhdC5jb25maWcsIGNvbmZpZylcbiAgfVxuICBpZiAod2luZG93LiQkcnhBcG1TZXR0aW5nKSB7XG4gICAgXy5leHRlbmQodGhhdC5jb25maWcsIHdpbmRvdy4kJHJ4QXBtU2V0dGluZylcbiAgfVxuICBwZXJmb3JtYW5jZSgpXG4gIHJlcXVpcmUoXCIuL2Vycm9yXCIpXG4gIHJlcXVpcmUoXCIuL3hoclwiKVxufVxubW9kdWxlLmV4cG9ydHMgPSByeEFwbVxuIiwiLypcbiAqIEBBdXRob3I6IGppYW5nZmVuZ1xuICogQERhdGU6IDIwMTctMDgtMjIgMTE6NTQ6NDdcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiBqaWFuZ2ZlbmdcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjggMjI6MzE6NTBcbiAqL1xudmFyIGV2ZW50RW1pdHRlciA9IHJlcXVpcmUoXCIuLi9ldmVudEVtaXR0ZXJcIilcbnZhciBjb21tb24gPSByZXF1aXJlKFwiLi4vY29tbW9uXCIpXG52YXIgY29uc3RzID0gcmVxdWlyZShcIi4uL2NvbnN0c1wiKVxudmFyIGxvZyA9IHJlcXVpcmUoXCIuLi9sb2dcIilcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnXCIpXG52YXIgcGFnZUxvYWRlciA9IHJlcXVpcmUoXCIuL3BhZ2VMb2FkZXJcIilcbnZhciBkb21Mb2FkaW5nID0gcGFnZUxvYWRlci5kb21Mb2FkaW5nKClcbnZhciBmaXJzdFNjcmVlblxudmFyIHBlcmZvcm1hbmNlID0gcmVxdWlyZShcIi4vcGVyZm9ybWFuY2VcIilcbnZhciBzZW5kZXIgPSByZXF1aXJlKFwiLi9zZW5kZXJcIilcblxudmFyIHdpbiA9IHdpbmRvd1xudmFyIGRvYyA9IHdpbi5kb2N1bWVudFxudmFyIHVybCA9IChcIlwiICsgbG9jYXRpb24pLnNwbGl0KFwiP1wiKVswXVxudmFyIGllID0gZmFsc2VcbnZhciBkb21Db250ZW50TG9hZGVkID0gZmFsc2VcbnZhciBzdHJBZGRFdmVudExpc3RlbmVyID0gXCJhZGRFdmVudExpc3RlbmVyXCJcbnZhciBzdHJBdHRhY2hFdmVudCA9IFwiYXR0YWNoRXZlbnRcIlxuXG52YXIgcGFnZUluZm8gPSB7XG4gIGZpcnN0Qnl0ZTogY29uZmlnLmxvYWRUaW1lIHx8IHdpbmRvdy4kJHJ4QXBtRmlyc3RCeXRlVGltZSB8fCBwYWdlTG9hZGVyLmdldEN1cnJlbnRUaW1lKCksXG4gIG9yaWdpbjogdXJsLFxuICBmZWF0dXJlczoge31cbn1cblxuLy8g6aG16Z2i5Yqg6L295a6M5q+V5ZCO5Y+R6YCB5oCn6IO95pWw5o2uXG5ldmVudEVtaXR0ZXIub24oY29uc3RzLnBhZ2VMb2FkZXJfbG9hZGVkLCBmdW5jdGlvbiAocGFnZUluZm8pIHtcbiAgdmFyIHBlcmZvcnMgPSBnZXRQZXJmb3JtYW5jZURhdGEoKVxuICBzZW5kZXIuc2VuZFBlcmZvcm1hbmNlcyhjb21tb24uZXh0ZW5kKHt9LCBwZXJmb3JzLCBjb21tb24uaW5mby5wcm9wZXJ0aWVzKCkpKVxufSlcblxuLyogZXZlbnRFbWl0dGVyLm9uKGNvbnN0cy5wYWdlTG9hZGVyX2RvbWxvYWRpbmcsIGZ1bmN0aW9uIChwYWdlSW5mbykge1xuICBldmVudEVtaXR0ZXIuYWRkRXZlbnRBcmdzKFwibWFya1wiLCBbXCJkb21Mb2FkaW5nXCIsIGRvbUxvYWRpbmcuZ2V0RG9tTG9hZGluZ1N0YXJ0VGltZSgpXSlcbn0pICovXG5cbi8qKlxuICog5qCH6K6w5paH5qGj5Yqg6L295a6M5q+V55qE5pe26Ze0XG4gKi9cbmZ1bmN0aW9uIG9uTG9hZGVkICgpIHtcbiAgLy8g5qCH6K6w55m95bGP5Yqg6L295pe26Ze0XG4gIC8vIOagh+iusOmmluWxj+WKoOi9veaXtumXtC0t5Lul6aaW5bGP5omA5pyJSU1H5qCH562+55qE5pyA5aSn5Yqg6L295pe26Ze05L2c5Li66aaW5bGP5Yqg6L295a6M5oiQ5pe26Ze0XG4gIC8vIOagh+iusOmhtemdouiusOi9veWujOaIkOeahOaXtumXtO+8jOeUqOadpeiuoeeul+mhtemdouWKoOi9veaXtumXtFxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBldmVudEVtaXR0ZXIuYWRkRXZlbnRBcmdzKFwibWFya1wiLCBbXCJkb21Mb2FkaW5nXCIsIGRvbUxvYWRpbmcuZ2V0RG9tTG9hZGluZ1N0YXJ0VGltZSgpXSlcbiAgICBpZiAoIWZpcnN0U2NyZWVuKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJmaXJzdFNjcmVlbiBub3QgZmluZFwiKVxuICAgIH1cbiAgICBldmVudEVtaXR0ZXIuYWRkRXZlbnRBcmdzKFwibWFya1wiLCBbXCJmaXJzdFNjcmVlblwiLCBmaXJzdFNjcmVlbi5nZXRGaXJzdFNjcmVlblRpbWUoKV0pXG4gICAgZXZlbnRFbWl0dGVyLmFkZEV2ZW50QXJncyhcIm1hcmtcIiwgW1wib25Mb2FkXCIsIHBhZ2VMb2FkZXIuZ2V0Q3VycmVudFRpbWUoKV0pXG4gICAgZXZlbnRFbWl0dGVyLmVtaXQoY29uc3RzLnBhZ2VMb2FkZXJfbG9hZGVkLCBbcGFnZUluZm9dKVxuICB9LCAwKVxufVxuXG5mdW5jdGlvbiBvblJlYWR5U3RhdGVDaGFuZ2VkQ29tcGxldGUgKCkge1xuICBpZiAoZG9tQ29udGVudExvYWRlZCB8fCBkb2MucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgb25Eb21Db250ZW50TG9hZGVkKClcbiAgfVxufVxuXG4vKipcbiAqIOagh+iusOW9k+WJjemhtemdoueahERPTeWKoOi9veWujOavleeahOaXtumXtO+8jOeUqOadpeiuoeeul+WPr+aTjeS9nOaXtumXtFxuICog5LmL5ZCO5byA5aeL6aaW5bGP6K6h566XXG4gKi9cbmZ1bmN0aW9uIG9uRG9tQ29udGVudExvYWRlZCAoKSB7XG4gIGV2ZW50RW1pdHRlci5hZGRFdmVudEFyZ3MoXCJtYXJrXCIsIFtcImRvbUNvbnRlbnRcIiwgcGFnZUxvYWRlci5nZXRDdXJyZW50VGltZSgpXSlcbiAgbG9nKFwib25Eb21Db250ZW50TG9hZGVkIGV4ZWN1dGVkLCB0aGUgZmlyc3RTY3JlZW4gb2JqZWN0OlwiKVxuICBmaXJzdFNjcmVlbiA9IHBhZ2VMb2FkZXIuZmlyc3RTY3JlZW4oKVxuICBsb2coZmlyc3RTY3JlZW4pXG59XG5cbi8qKlxuICog6I635Y+W5YWo6YOo55qE5oCn6IO95pWw5o2uXG4gKlxuICogQHJldHVybnMg6L+U5Zue5aSE55CG5ZCO55qE5oCn6IO95pWw5o2uSlNPTuWvueixoVxuICovXG5mdW5jdGlvbiBnZXRQZXJmb3JtYW5jZURhdGEgKCkge1xuICB2YXIgcGVyZm9ybWFuY2VzID0ge31cbiAgZXZlbnRFbWl0dGVyLmhhbmRsZVF1ZXVlKFwibWFya1wiLCBmdW5jdGlvbiAobWFyaywgdGltZSkge1xuICAgIGlmIChtYXJrICE9PSBcImZpcnN0Qnl0ZVwiKSB7XG4gICAgICBwZXJmb3JtYW5jZXNbbWFya10gPSB0aW1lIC0gcGFnZUluZm8uZmlyc3RCeXRlXG4gICAgfSBlbHNlIHtcbiAgICAgIHBlcmZvcm1hbmNlc1ttYXJrXSA9IHBhZ2VJbmZvLmZpcnN0Qnl0ZVxuICAgIH1cbiAgfSlcbiAgLy8g55m95bGP5pe26Ze0XG4gIHBlcmZvcm1hbmNlc1tcImRvbUxvYWRpbmdcIl0gPSBwZXJmb3JtYW5jZS5nZXRXcml0ZVNjcmVlblRpbWVTcGFuKCkgfHwgcGVyZm9ybWFuY2VzW1wiZG9tTG9hZGluZ1wiXVxuICAvLyDlj6/mk43kvZzml7bpl7TvvIhEb23liqDovb3lrozmiJDml7bpl7TvvIlcbiAgcGVyZm9ybWFuY2VzW1wiZG9tQ29udGVudFwiXSA9IHBlcmZvcm1hbmNlLmdldERvbVJlYWR5VGltZVNwYW4oKSB8fCBwZXJmb3JtYW5jZXNbXCJkb21Db250ZW50XCJdXG4gIC8vIOmmluWxj+aXtumXtFxuICBwZXJmb3JtYW5jZXNbXCJmaXJzdFNjcmVlblwiXSA9IHBlcmZvcm1hbmNlc1tcImZpcnN0U2NyZWVuXCJdIHx8IHBlcmZvcm1hbmNlc1tcImRvbUNvbnRlbnRcIl0gfHwgLTFcbiAgLy8g6aG16Z2i5Yqg6L295a6M5oiQ5pe26Ze0XG4gIHBlcmZvcm1hbmNlc1tcIm9uTG9hZFwiXSA9IHBlcmZvcm1hbmNlLmdldFBhZ2VSZWFkeVRpbWVTcGFuKCkgfHwgcGVyZm9ybWFuY2VzW1wib25Mb2FkXCJdXG4gIC8vIEROU+ino+aekOaXtumXtFxuICBwZXJmb3JtYW5jZXNbXCJkbnNcIl0gPSBwZXJmb3JtYW5jZS5nZXRETlNUaW1lU3BhbigpIHx8IC0xXG4gIC8vIFRDUOino+aekOaXtumXtFxuICBwZXJmb3JtYW5jZXNbXCJ0Y3BcIl0gPSBwZXJmb3JtYW5jZS5nZXRUQ1BUaW1lU3BhbigpIHx8IC0xXG4gIC8vIOmhtemdoui1hOa6kOaVsOmHj1xuICBwZXJmb3JtYW5jZXNbXCJyZXNvdXJjZUNvdW50XCJdID0gcGVyZm9ybWFuY2UuZ2V0UmVzb3VyY2VDb3VudCgpIHx8IC0xXG4gIHJldHVybiBwZXJmb3JtYW5jZXNcbn1cblxuLy8g5qCH6K6w6L+b5YWl6aG16Z2i55qE5pe26Ze0XG5mdW5jdGlvbiBtYXJrRmlyc3RCeXRlVGltZSAoKSB7XG4gIGV2ZW50RW1pdHRlci5hZGRFdmVudEFyZ3MoXCJtYXJrXCIsIFtcImZpcnN0Qnl0ZVwiLCBjb25maWcubG9hZFRpbWUgfHwgd2luZG93LiQkcnhBcG1GaXJzdEJ5dGVUaW1lIHx8IHBhZ2VMb2FkZXIuZ2V0Q3VycmVudFRpbWUoKV0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICBtYXJrRmlyc3RCeXRlVGltZSgpXG4gIGxvZyhkb2MucmVhZHlTdGF0ZSlcbiAgLy8gY29tcGxldGXnrYnlkIzkuo53aW5kb3cub25sb2FkXG4gIC8vIGludGVyYWN0aXZl562J5ZCM5LiORE9NQ29udGVudExvYWRlZFxuICB2YXIgZG9jU3RhdGUgPSBkb2N1bWVudC5yZWFkeVN0YXRlXG4gIGlmIChkb2NTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgb25Eb21Db250ZW50TG9hZGVkKClcbiAgICBvbkxvYWRlZCgpXG4gIH0gZWxzZSB7XG4gICAgLy8g5aaC5p6c6aG16Z2iRE9N5YWD57Sg5Yqg6L295a6M5oiQ77yM5YiZ5Ye65Y+RQ29udGVudExvYWRlZOS6i+S7tlxuICAgIGlmIChkb2NTdGF0ZSA9PT0gXCJpbnRlcmFjdGl2ZVwiKSB7XG4gICAgICBvbkRvbUNvbnRlbnRMb2FkZWQoKVxuICAgIH1cbiAgICBpZiAoZG9jW3N0ckFkZEV2ZW50TGlzdGVuZXJdKSB7XG4gICAgICBsb2coXCJjdXJyZW50IHJlYWR5U3RhdGUgXCIgKyBkb2MucmVhZHlTdGF0ZSArIFwiLCBleGVjIGRhdGVUaW1lIDpcIiArIG5ldyBEYXRlKCkgKiAxKVxuICAgICAgZG9jW3N0ckFkZEV2ZW50TGlzdGVuZXJdKFwiRE9NQ29udGVudExvYWRlZFwiLCBvbkRvbUNvbnRlbnRMb2FkZWQsIGZhbHNlKVxuICAgICAgd2luW3N0ckFkZEV2ZW50TGlzdGVuZXJdKFwibG9hZFwiLCBvbkxvYWRlZCwgZmFsc2UpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZyhcImllOmN1cnJlbnQgcmVhZHlTdGF0ZSBcIiArIGRvYy5yZWFkeVN0YXRlICsgXCIsIGV4ZWMgZGF0ZVRpbWUgOlwiICsgbmV3IERhdGUoKSAqIDEpXG4gICAgICBkb2Nbc3RyQXR0YWNoRXZlbnRdKFwib25yZWFkeXN0YXRlY2hhbmdlXCIsIG9uUmVhZHlTdGF0ZUNoYW5nZWRDb21wbGV0ZSlcbiAgICAgIHdpbltzdHJBdHRhY2hFdmVudF0oXCJvbmxvYWRcIiwgb25Mb2FkZWQpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGRvU2Nyb2xs5Yik5pataWU2LTjnmoRET03mmK/lkKbliqDovb3lrozmiJBcbiAgICogaWXnibnmnInnmoRkb1Njcm9sbOaWueazlVxuICAgKiDlvZPpobXpnaJET03mnKrliqDovb3lrozmiJDml7bvvIzosIPnlKhkb1Njcm9sbOaWueazleaXtu+8jOWwseS8muaKpemUmVxuICAgKiDlj43ov4fmnaXvvIzlj6ropoHkuIDnm7Tpl7TpmpTosIPnlKhkb1Njcm9sbOebtOWIsOS4jeaKpemUmVxuICAgKiDpgqPlsLHooajnpLrpobXpnaJET03liqDovb3lrozmr5XkuobjgIJcbiAgICovXG4gIHRyeSB7XG4gICAgaWUgPSB3aW5kb3cuZnJhbWVFbGVtZW50ID09IG51bGwgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG4gIH0gY2F0Y2ggKGVycikge1xuXG4gIH1cblxuICBmdW5jdGlvbiBpZUNvbnRlbnRMb2FkZWQgKCkge1xuICAgIGlmICghZG9tQ29udGVudExvYWRlZCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWUuZG9TY3JvbGwoXCJsZWZ0XCIpXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoaWVDb250ZW50TG9hZGVkLCA1MClcbiAgICAgIH1cbiAgICAgIGRvbUNvbnRlbnRMb2FkZWQgPSB0cnVlXG4gICAgICBvbkRvbUNvbnRlbnRMb2FkZWQoKVxuICAgIH1cbiAgfVxuXG4gIGlmIChpZSAmJiBpZS5kb1Njcm9sbCkge1xuICAgIGllQ29udGVudExvYWRlZCgpXG4gIH1cbn1cbiIsIi8qXG4gKiBAQXV0aG9yOiBqaWFuZ2ZlbmdcbiAqIEBEYXRlOiAyMDE3LTA4LTIyIDE1OjAyOjMyXG4gKiBATGFzdCBNb2RpZmllZCBieTogamlhbmdmZW5nXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE3LTA5LTIxIDE3OjMyOjU1XG4gKi9cblxudmFyIGRvbUhlbHBlciA9IHJlcXVpcmUoXCIuLi9kb21cIilcbnZhciB3aW4gPSB3aW5kb3dcbnZhciBkb2MgPSB3aW4uZG9jdW1lbnRcblxuLyoqXG4gKiDojrflj5blvZPliY3ml7bpl7TmiLNcbiAqXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBnZXRDdXJyZW50VGltZSAoKSB7XG4gIHJldHVybiBuZXcgRGF0ZSgpICogMVxufVxuXG4vKipcbiAqIOiOt+WPlummluWxj+aXtumXtFxuICpcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIGZpcnN0U2NyZWVuICgpIHtcbiAgdmFyIG9uSW1nTG9hZGVkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIGlmICh0aGF0LnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHRoYXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgb25JbWdMb2FkZWQsIGZhbHNlKVxuICAgIH1cbiAgICBmaXJzdFNjcmVlbkltZ3MucHVzaCh7XG4gICAgICBpbWc6IHRoaXMsXG4gICAgICB0aW1lOiBnZXRDdXJyZW50VGltZSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBpbWdzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbWdcIilcbiAgdmFyIGZpcnN0U2NyZWVuVGltZSA9IGdldEN1cnJlbnRUaW1lKClcbiAgdmFyIGZpcnN0U2NyZWVuSW1ncyA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaW1ncy5sZW5ndGg7IGkrKykge1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaW1nID0gaW1nc1tpXVxuICAgICAgaWYgKGltZy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICFpbWcuY29tcGxldGUgJiYgaW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIG9uSW1nTG9hZGVkLCBmYWxzZSlcbiAgICAgIH0gZWxzZSBpZiAoaW1nLmF0dGFjaEV2ZW50KSB7XG4gICAgICAgIGltZy5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKGltZy5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIpIHtcbiAgICAgICAgICAgIG9uSW1nTG9hZGVkLmNhbGwoaW1nLCBvbkltZ0xvYWRlZClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSkoKVxuICB9XG5cbiAgLyoqXG4gICAqIOiOt+WPlummluWxj+aXtumXtFxuICAgKlxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Rmlyc3RTY3JlZW5UaW1lICgpIHtcbiAgICB2YXIgc2ggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaXJzdFNjcmVlbkltZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gZmlyc3RTY3JlZW5JbWdzW2ldXG4gICAgICB2YXIgaW1nID0gaXRlbVtcImltZ1wiXVxuICAgICAgdmFyIHRpbWUgPSBpdGVtW1widGltZVwiXVxuICAgICAgdmFyIHRvcCA9IGRvbUhlbHBlci5nZXREb21PZmZzZXQoaW1nKS50b3BcbiAgICAgIGlmICh0b3AgPiAwICYmIHRvcCA8IHNoKSB7XG4gICAgICAgIGZpcnN0U2NyZWVuVGltZSA9IHRpbWUgPiBmaXJzdFNjcmVlblRpbWUgPyB0aW1lIDogZmlyc3RTY3JlZW5UaW1lXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaXJzdFNjcmVlblRpbWVcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0Rmlyc3RTY3JlZW5UaW1lOiBnZXRGaXJzdFNjcmVlblRpbWVcbiAgfVxufVxuXG4vKipcbiAqIOiOt+WPlumhtemdouW8gOWni+WKoOi9vURPTeeahOaXtumXtO+8jOWNs+WPr+S7peiOt+WPluWvueW6lOeahOmhtemdoueZveWxj+aXtumXtFxuICpcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIGRvbUxvYWRpbmcgKCkge1xuICAvKiBlc2xpbnQtZGlzYWJsZWQgbm8tbXVsdGktc3RyICovXG5cbiAgdmFyIGMgPSBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKVxuICBjLmlkID0gXCJyeC1cIiArIG5ldyBEYXRlKCkgKiAxXG4gIGMudGV4dCA9IFwid2luZG93LiQkcnhBcG1Eb21Mb2FkaW5nU3RhcnRUaW1lPW5ldyBEYXRlKCkgKiAxO1xcXG4gICAgICAgICAgICB2YXIgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdcIiArIGMuaWQgKyBcIicpOyBcXFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5yZW1vdmVDaGlsZChzKTtcIlxuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQoYylcblxuICBmdW5jdGlvbiBnZXREb21Mb2FkaW5nU3RhcnRUaW1lICgpIHtcbiAgICB2YXIgdGltZSA9IHdpbmRvdy4kJHJ4QXBtRG9tTG9hZGluZ1N0YXJ0VGltZVxuICAgIHRyeSB7XG4gICAgICBkZWxldGUgd2luZG93LiQkcnhBcG1Eb21Mb2FkaW5nU3RhcnRUaW1lXG4gICAgfSBjYXRjaCAoZXgpIHtcblxuICAgIH1cblxuICAgIHJldHVybiB0aW1lXG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXREb21Mb2FkaW5nU3RhcnRUaW1lOiBnZXREb21Mb2FkaW5nU3RhcnRUaW1lXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldEN1cnJlbnRUaW1lOiBnZXRDdXJyZW50VGltZSxcbiAgZG9tTG9hZGluZzogZG9tTG9hZGluZyxcbiAgZmlyc3RTY3JlZW46IGZpcnN0U2NyZWVuXG59XG4iLCIvKlxuICogQEF1dGhvcjogamlhbmdmZW5nXG4gKiBARGF0ZTogMjAxNy0wOC0yMiAxNTowMjo0MFxuICogQExhc3QgTW9kaWZpZWQgYnk6IGppYW5nZmVuZ1xuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOS0xOSAyMDowNTozN1xuICovXG5cbnZhciBoZWFkZXJMaW5rc1xudmFyIGhlYWRlclNjcmlwdHNcbnZhciByZXNvdXJjZXNcbnZhciB3aW4gPSB3aW5kb3dcbnZhciBkb2MgPSB3aW4uZG9jdW1lbnRcbnZhciB3aW5QZXJmb3JtYW5jZSA9IHdpbi5wZXJmb3JtYW5jZVxudmFyIGxpbmtzID0ge31cblxuLyoqXG4gKiDojrflj5bnmb3lsY/ml7bpl7RcbiAqXG4gKiBAcmV0dXJucyDov5Tlm57nmb3lsY/ml7bpl7Tlr7nosaHvvIzpmYTluKbkuoZIZWFkZXLpgqPnmoTmiYDmnInpnZnmgIHotYTmupDor7fmsYJcbiAqL1xuZnVuY3Rpb24gZ2V0V3JpdGVTY3JlZW5UaW1lU3BhbiAoKSB7XG4gIHZhciBpbmRleCA9IDBcbiAgdmFyIHJlc291cmNlTGVudGggPSAwXG4gIHZhciB3cml0ZVNjcmVlblRpbWUgPSAwXG4gIGlmICh3aW5QZXJmb3JtYW5jZSAmJiBkb2MucXVlcnlTZWxlY3RvckFsbCAmJiB3aW5QZXJmb3JtYW5jZS5nZXRFbnRyaWVzQnlUeXBlKSB7XG4gICAgd3JpdGVTY3JlZW5UaW1lID0gd2luUGVyZm9ybWFuY2UudGltaW5nLmRvbUxvYWRpbmdcbiAgICBoZWFkZXJMaW5rcyA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKFwiaGVhZD5saW5rXCIpXG4gICAgaGVhZGVyU2NyaXB0cyA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKFwiaGVhZD5zY3JpcHRcIilcbiAgICBmb3IgKHZhciBpdGVtIGluIGhlYWRlckxpbmtzKSB7XG4gICAgICBpZiAoaGVhZGVyTGlua3NbaXRlbV0uaHJlZiAhPT0gXCJcIiAmJiB2b2lkIDAgIT09IGhlYWRlckxpbmtzW2l0ZW1dLmhyZWYpIHtcbiAgICAgICAgbGlua3NbdW5lc2NhcGUoaGVhZGVyTGlua3NbaXRlbV0uaHJlZildID0gMVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGl0ZW0gaW4gaGVhZGVyU2NyaXB0cykge1xuICAgICAgaWYgKGhlYWRlclNjcmlwdHNbaXRlbV0uc3JjICE9PSBcIlwiICYmIHZvaWQgMCAhPT0gaGVhZGVyU2NyaXB0c1tpdGVtXS5zcmMgJiYgaGVhZGVyU2NyaXB0c1tpdGVtXS5hc3luYyAhPT0gMSkge1xuICAgICAgICBsaW5rc1t1bmVzY2FwZShoZWFkZXJTY3JpcHRzW2l0ZW1dLnNyYyldID0gMVxuICAgICAgfVxuICAgIH1cbiAgICByZXNvdXJjZUxlbnRoICs9IGhlYWRlckxpbmtzLmxlbmd0aFxuICAgIHJlc291cmNlTGVudGggKz0gaGVhZGVyU2NyaXB0cy5sZW5ndGhcbiAgICByZXNvdXJjZXMgPSB3aW5QZXJmb3JtYW5jZS5nZXRFbnRyaWVzQnlUeXBlKFwicmVzb3VyY2VcIilcbiAgICAvLyDkuLrku4DkuYjopoHnlKgyKnJlc291cmNlTGVuZ3Ro5ZGi77yfXG4gICAgaWYgKDIgKiByZXNvdXJjZUxlbnRoID4gcmVzb3VyY2VzLmxlbmd0aCkge1xuICAgICAgcmVzb3VyY2VMZW50aCA9IHJlc291cmNlcy5sZW5ndGhcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb3VyY2VMZW50aCArPSByZXNvdXJjZUxlbnRoXG4gICAgfVxuXG4gICAgZm9yIChpbmRleDsgcmVzb3VyY2VMZW50aCA+PSBpbmRleDsgaW5kZXgrKykge1xuICAgICAgaWYgKHJlc291cmNlc1tpbmRleF0gJiZcbiAgICAgICAgbGlua3NbdW5lc2NhcGUocmVzb3VyY2VzW2luZGV4XS5uYW1lKV0gPT09IDEgJiZcbiAgICAgICAgcmVzb3VyY2VzW2luZGV4XS5yZXNwb25zZUVuZCA+IDAgJiZcbiAgICAgICAgcmVzb3VyY2VzW2luZGV4XS5yZXNwb25zZUVuZCArIHdpblBlcmZvcm1hbmNlLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnQgPj0gd3JpdGVTY3JlZW5UaW1lKSB7XG4gICAgICAgIHdyaXRlU2NyZWVuVGltZSA9IHJlc291cmNlc1tpbmRleF0ucmVzcG9uc2VFbmQgKyB3aW5QZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0XG4gICAgICB9XG4gICAgfVxuXG4gICAgd3JpdGVTY3JlZW5UaW1lIC09IHdpblBlcmZvcm1hbmNlLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnRcbiAgICByZXR1cm4gcGFyc2VJbnQod3JpdGVTY3JlZW5UaW1lKVxuICAgIC8qIHJldHVybiB7XG4gICAgICBmZWVsVGltZTogcGFyc2VJbnQoZiksXG4gICAgICBoZWFkVXJsOiBsaW5rc1xuICAgIH0gKi9cbiAgfVxufVxuXG4vKipcbiAqIOiOt+WPluaAp+iDveaMh+agh+aVsOaNrlxuICpcbiAqL1xuZnVuY3Rpb24gZ2V0U3RhcnRUaW1lICgpIHtcbiAgcmV0dXJuIG51bGxcbn1cbi8qKlxuICog6I635Y+W6ZO+5o6l57G75Z6LXG4gKlxuICogQHJldHVybnMg6L+U5Zue5YC877yIYmx1ZXRvb3RoL2NlbGx1bGFyL2V0aGVybmV0L25vbmUvd2lmaS93aW1heC9vdGhlci91bmtub3du77yJXG4gKi9cbmZ1bmN0aW9uIGdldFN5c0Nvbm5lY3Rpb25UeXBlICgpIHtcbiAgcmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3IuY29ubmVjdGlvbiA/IHdpbmRvdy5uYXZpZ2F0b3IuY29ubmVjdGlvbi50eXBlICsgXCJcIiA6IFwiXCJcbn1cblxuLyoqXG4gKiDojrflj5ZETlPlr7vlnYDmiafooYznmoTml7bpl7TvvIzlj6rog73pgJrov4fmjIflrprmtY/op4jlmajnmoTnibnmgKfmlK/mjIFcbiAqXG4gKiBAcmV0dXJucyDlpoLmnpzniYjmnKzpq5jvvIzliJnov5Tlm57lr7nlupTnmoRETlPlr7vlnYDml7bpl7TvvIzlpoLmnpzniYjmnKzkvY7vvIzliJnov5Tlm551bmRlZmluZWRcbiAqL1xuZnVuY3Rpb24gZ2V0RE5TVGltZVNwYW4gKCkge1xuICBpZiAod2luZG93LnBlcmZvcm1hbmNlKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5wZXJmb3JtYW5jZS50aW1pbmcuZG9tYWluTG9va3VwRW5kIC0gd2luZG93LnBlcmZvcm1hbmNlLnRpbWluZy5kb21haW5Mb29rdXBTdGFydFxuICB9XG4gIHJldHVybiB2b2lkIDBcbn1cblxuLyoqXG4gKiDojrflj5ZUQ1DmiafooYzml7bpl7TvvIzlj6rog73pgJrov4fmjIflrprmtY/op4jlmajnmoTnibnmgKfmlK/mjIFcbiAqXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBnZXRUQ1BUaW1lU3BhbiAoKSB7XG4gIGlmICh3aW5kb3cucGVyZm9ybWFuY2UpIHtcbiAgICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlLnRpbWluZy5jb25uZWN0RW5kIC0gd2luZG93LnBlcmZvcm1hbmNlLnRpbWluZy5jb25uZWN0U3RhcnRcbiAgfVxuICByZXR1cm4gdm9pZCAwXG59XG5cbi8qKlxuICog6I635Y+WRG9t5Yqg6L295a6M5q+V55qE5pe26Ze077yM6auY54mI5pys55u05o6l6YCa6L+HZG9tQ29udGVudExvYWRlZEV2ZW50U3RhcnTkuI5uYXZpZ2F0aW9uU3RhcnTnmoTlt67lgLzov5vooYzorqHnrpdcbiAqXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBnZXREb21SZWFkeVRpbWVTcGFuICgpIHtcbiAgaWYgKHdpbmRvdy5wZXJmb3JtYW5jZSkge1xuICAgIHJldHVybiB3aW5kb3cucGVyZm9ybWFuY2UudGltaW5nLmRvbUNvbnRlbnRMb2FkZWRFdmVudFN0YXJ0IC0gd2luZG93LnBlcmZvcm1hbmNlLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnRcbiAgfVxuICByZXR1cm4gdm9pZCAwXG59XG5cbi8qKlxuICog6I635Y+W6aG16Z2i5Yqg6L295a6M5oiQ55qE5pe26Ze077yM6auY54mI5pys55u05o6l6YCa6L+HbG9hZEV2ZW50U3RhcnTkuI5uYXZpZ2F0aW9uU3RhcnTnmoTlt67lgLzlgZrorqHnrpdcbiAqXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBnZXRQYWdlUmVhZHlUaW1lU3BhbiAoKSB7XG4gIGlmICh3aW5kb3cucGVyZm9ybWFuY2UpIHtcbiAgICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlLnRpbWluZy5sb2FkRXZlbnRTdGFydCAtIHdpbmRvdy5wZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0XG4gIH1cbiAgcmV0dXJuIHZvaWQgMFxufVxuXG4vKipcbiAqIOiOt+WPlumdmeaAgei1hOa6kOaVsOmHj++8jOmrmOeJiOacrOebtOaOpemAmui/h2dldEVudHJpZXNCeVR5cGUoXCJyZXNvdXJjZVwiKeiOt+WPluaVsOmHj1xuICpcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIGdldFJlc291cmNlQ291bnQgKCkge1xuICBpZiAod2luZG93LnBlcmZvcm1hbmNlLmdldEVudHJpZXNCeVR5cGUgJiYgdHlwZW9mIHdpbmRvdy5wZXJmb3JtYW5jZS5nZXRFbnRyaWVzQnlUeXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlLmdldEVudHJpZXNCeVR5cGUoXCJyZXNvdXJjZVwiKS5sZW5ndGhcbiAgfVxuICByZXR1cm4gdm9pZCAwXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRXcml0ZVNjcmVlblRpbWVTcGFuOiBnZXRXcml0ZVNjcmVlblRpbWVTcGFuLFxuICBnZXRTdGFydFRpbWU6IGdldFN0YXJ0VGltZSxcbiAgZ2V0U3lzQ29ubmVjdGlvblR5cGU6IGdldFN5c0Nvbm5lY3Rpb25UeXBlLFxuICBnZXRETlNUaW1lU3BhbjogZ2V0RE5TVGltZVNwYW4sXG4gIGdldFRDUFRpbWVTcGFuOiBnZXRUQ1BUaW1lU3BhbixcbiAgZ2V0RG9tUmVhZHlUaW1lU3BhbjogZ2V0RG9tUmVhZHlUaW1lU3BhbixcbiAgZ2V0UGFnZVJlYWR5VGltZVNwYW46IGdldFBhZ2VSZWFkeVRpbWVTcGFuLFxuICBnZXRSZXNvdXJjZUNvdW50OiBnZXRSZXNvdXJjZUNvdW50XG59XG4iLCIvKlxuICogQEF1dGhvcjogamlhbmdmZW5nXG4gKiBARGF0ZTogMjAxNy0wOC0yMiAxNTowMjo1M1xuICogQExhc3QgTW9kaWZpZWQgYnk6IGppYW5nZmVuZ1xuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0xMC0xNyAxNDoyNDoxOFxuICovXG5cbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnXCIpXG52YXIgY29tbW9uID0gcmVxdWlyZShcIi4uL2NvbW1vblwiKVxudmFyIGNvbnN0cyA9IHJlcXVpcmUoXCIuLi9jb25zdHNcIilcbnZhciBsb2cgPSByZXF1aXJlKFwiLi4vbG9nXCIpXG52YXIgVGhyaWZ0ID0gcmVxdWlyZShcIi4uL3RocmlmdFwiKVxudmFyIGtlcGxlciA9IHJlcXVpcmUoXCIuLi9rZXBsZXJcIilcblxuZnVuY3Rpb24gc2VyaWFsaXplIChlbnRpdHksIG9iaikge1xuICBlbnRpdHkuYWdlbnRJZCA9IGNvbmZpZy5hZ2VudElkXG4gIGVudGl0eS50aWVySWQgPSBjb25maWcudGllcklkXG4gIGVudGl0eS5hcHBJZCA9IGNvbmZpZy5hcHBJZFxuICBlbnRpdHkudHJhY2VJZCA9IGNvbW1vbi5VVUlEKClcbiAgZW50aXR5LnVybERvbWFpbiA9IGRvY3VtZW50LmRvbWFpbiB8fCB3aW5kb3cubG9jYXRpb24uaG9zdFxuICBlbnRpdHkucmVwb3J0VGltZSA9IG5ldyBEYXRlKCkgKiAxXG4gIGVudGl0eS5maXJzdFNjcmVlblRpbWUgPSBvYmouZmlyc3RTY3JlZW5cbiAgZW50aXR5LndoaXRlU2NyZWVuVGltZSA9IG9iai5kb21Mb2FkaW5nXG4gIGVudGl0eS5vcGVyYWJsZVRpbWUgPSBvYmouZG9tQ29udGVudFxuICBlbnRpdHkucmVzb3VyY2VMb2FkZWRUaW1lID0gb2JqLm9uTG9hZFxuICBlbnRpdHkubG9hZGVkVGltZSA9IG9iai5vbkxvYWRcbiAgZW50aXR5LmJyb3dzZXIgPSBvYmouYnJvd3NlclxuICBlbnRpdHkudXJsUXVlcnkgPSBvYmoucGFnZV91cmxfcGF0aFxuXG4gIGVudGl0eS5iYWNrdXBQcm9wZXJ0aWVzID0ge1xuICAgIFwib3NcIjogb2JqLm9zLFxuICAgIFwib3NfdmVyc2lvblwiOiBvYmoub3NfdmVyc2lvbixcbiAgICBcImRldmljZVwiOiBvYmouZGV2aWNlLFxuICAgIFwiZGV2aWNlX3ZlcnNpb25cIjogb2JqLmRldmljZV92ZXJzaW9uLFxuICAgIFwiYnJvd3Nlcl9lbmdpbmVcIjogb2JqLmJyb3dzZXJfZW5naW5lLFxuICAgIFwicGFnZV90aXRsZVwiOiBvYmoucGFnZV90aXRsZSxcbiAgICBcInBhZ2VfaDFcIjogb2JqLnBhZ2VfaDEsXG4gICAgXCJwYWdlX3JlZmVycmVyXCI6IG9iai5wYWdlX3JlZmVycmVyLFxuICAgIFwicGFnZV91cmxcIjogb2JqLnBhZ2VfdXJsLFxuICAgIFwibGliXCI6IG9iai5saWIsXG4gICAgXCJsaWJfdmVyc2lvblwiOiBvYmoubGliX3ZlcnNpb24sXG4gICAgXCJicm93c2VyX3ZlcnNpb25cIjogb2JqLmJyb3dzZXJfdmVyc2lvblxuICB9XG5cbiAgZW50aXR5LmJhY2t1cFF1b3RhID0ge1xuICAgIFwiZG5zXCI6IG9iai5kbnMsXG4gICAgXCJ0Y3BcIjogb2JqLnRjcCxcbiAgICBcInNjcmVlbl9oZWlnaHRcIjogb2JqLnNjcmVlbl9oZWlnaHQsXG4gICAgXCJzY3JlZW5fd2lkdGhcIjogb2JqLnNjcmVlbl93aWR0aFxuICB9XG59XG5cbmZ1bmN0aW9uIHNlbmRQZXJmb3JtYW5jZXMgKHBlcmZvcm1hbmNlcykge1xuICBsb2coXCJwZXJmb3JtYW5jZSByZXNvdXJjZSBkYXRhOlwiKVxuICBsb2coSlNPTi5zdHJpbmdpZnkocGVyZm9ybWFuY2VzLCBudWxsLCAyKSlcbiAgdmFyIHRyYW5zcG9ydCA9IG5ldyBUaHJpZnQuVHJhbnNwb3J0KFwiXCIpXG4gIHZhciBwcm90b2NvbCA9IG5ldyBUaHJpZnQuUHJvdG9jb2wodHJhbnNwb3J0KVxuICB2YXIgZW50aXR5ID0gbmV3IGtlcGxlci5UV2ViQWdlbnRMb2FkKHBlcmZvcm1hbmNlcylcbiAgc2VyaWFsaXplKGVudGl0eSwgcGVyZm9ybWFuY2VzKVxuXG4gIHByb3RvY29sLndyaXRlTWVzc2FnZUJlZ2luKFwiVFdlYkFnZW50TG9hZEJhdGNoXCIsIFRocmlmdC5NZXNzYWdlVHlwZS5DQUxMLCAwKVxuICB2YXIgcGF0Y2ggPSBuZXcga2VwbGVyLlRXZWJBZ2VudExvYWRCYXRjaCh7XG4gICAgbG9hZEJhdGNoOiBbZW50aXR5XVxuICB9KVxuICAvLyBsb2coXCJwZXJmb3JtYW5jZSBqc29uIGRhdGE6XCIpXG4gIC8vIGxvZyhKU09OLnN0cmluZ2lmeShwYXRjaCwgbnVsbCwgMikpXG4gIHBhdGNoLndyaXRlKHByb3RvY29sKVxuICBwcm90b2NvbC53cml0ZU1lc3NhZ2VFbmQoKVxuICB2YXIgc2VuZFZhbHVlID0gdHJhbnNwb3J0LmZsdXNoKClcbiAgdmFyIHggPSBKU09OLnBhcnNlKHNlbmRWYWx1ZSlcbiAgc2VuZFZhbHVlID0gSlNPTi5zdHJpbmdpZnkoeFt4Lmxlbmd0aCAtIDFdKVxuICBsb2coXCJwZXJmb3JtYW5jZSB0aHJpZnQgZGF0YTpcIilcbiAgbG9nKHNlbmRWYWx1ZSlcbiAgdmFyIG9wdGlvbnMgPSB7XG4gICAgdXJsOiBjb25maWcuYXBpSG9zdCxcbiAgICB0eXBlOiBcInBvc3RcIixcbiAgICBjb3JzOiB0cnVlLFxuICAgIGRhdGE6IHNlbmRWYWx1ZSxcbiAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgbG9nKFwi5LqL5Lu25Y+R6YCB6L+U5Zue5raI5oGv6ZSZ6K+vXCIpXG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24gKHhocikge1xuICAgICAgbG9nKHhoci5zdGF0dXMpXG4gICAgICBsb2coeGhyLnN0YXR1c1RleHQpXG4gICAgfSxcbiAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgbG9nKFwi5LqL5Lu25Y+R6YCB5a6M5q+VLlwiKVxuICAgIH1cbiAgfVxuXG4gIG9wdGlvbnMuaGVhZGVyID0ge31cbiAgb3B0aW9ucy5oZWFkZXJbY29uc3RzLmtlcGxlcl9tZXNzYWdlX3R5cGVdID0gY29uc3RzLldFQl9MT0FEX0JBVENIXG4gIG9wdGlvbnMuaGVhZGVyW2NvbnN0cy5rZXBsZXJfYWdlbnRfdG9rZW5dID0gY29uZmlnLmFnZW50SWRcbiAgb3B0aW9ucy5oZWFkZXJbY29uc3RzLmtlcGxlcl9jb25maWdfdmVyc2lvbl0gPSBjb25maWcuTElCX1ZFUlNJT05cblxuICBjb21tb24uYWpheChvcHRpb25zKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2VuZFBlcmZvcm1hbmNlczogc2VuZFBlcmZvcm1hbmNlc1xufVxuIiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL2NvbmZpZ1wiKVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoXCIuL2NvbW1vblwiKVxudmFyIEpTT04gPSByZXF1aXJlKFwiLi9qc29uXCIpXG5cbnZhciBMSUJfS0VZID0gY29uZmlnLkxJQl9LRVlcbnZhciBzZXNzaW9uU3RhdGUgPSB7fVxudmFyIHNlc3Npb24gPSB7XG4gIGdldElkOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHNlc3Npb25TdGF0ZS5pZFxuICB9LFxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRzID0gY29tbW9uLmNvb2tpZS5nZXQoTElCX0tFWSArIFwic2Vzc2lvblwiKVxuICAgIHZhciBzdGF0ZSA9IG51bGxcbiAgICBpZiAoZHMgIT09IG51bGwgJiYgKHR5cGVvZiAoc3RhdGUgPSBKU09OLnBhcnNlKGRzKSkgPT09IFwib2JqZWN0XCIpKSB7XG4gICAgICBzZXNzaW9uU3RhdGUgPSBzdGF0ZVxuICAgIH1cbiAgfSxcbiAgZ2V0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHJldHVybiBuYW1lID8gc2Vzc2lvblN0YXRlW25hbWVdIDogc2Vzc2lvblN0YXRlXG4gIH0sXG4gIHNldDogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgc2Vzc2lvblN0YXRlW25hbWVdID0gdmFsdWVcbiAgICB0aGlzLnNhdmUoKVxuICB9LFxuICBzZXRPbmNlOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoIShuYW1lIGluIHNlc3Npb25TdGF0ZSkpIHtcbiAgICAgIHRoaXMuc2V0KG5hbWUsIHZhbHVlKVxuICAgIH1cbiAgfSxcbiAgY2hhbmdlOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICBzZXNzaW9uU3RhdGVbbmFtZV0gPSB2YWx1ZVxuICB9LFxuICBzYXZlOiBmdW5jdGlvbiAocHJvcHMpIHtcbiAgICBpZiAocHJvcHMpIHtcbiAgICAgIHNlc3Npb25TdGF0ZSA9IHByb3BzXG4gICAgfVxuICAgIGNvbW1vbi5jb29raWUuc2V0KExJQl9LRVkgKyBcInNlc3Npb25cIiwgSlNPTi5zdHJpbmdpZnkoc2Vzc2lvblN0YXRlKSwgMCwgY29uZmlnLmNyb3NzU3ViRG9tYWluKVxuICB9LFxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRzID0gY29tbW9uLmNvb2tpZS5nZXQoTElCX0tFWSArIFwianNzZGtcIilcbiAgICB2YXIgY3MgPSBjb21tb24uY29va2llLmdldChMSUJfS0VZICsgXCJqc3Nka2Nyb3NzXCIpXG4gICAgdmFyIGNyb3NzID0gbnVsbFxuICAgIGlmIChjb25maWcuY3Jvc3NTdWJEb21haW4pIHtcbiAgICAgIGNyb3NzID0gY3NcbiAgICAgIGlmIChkcyAhPT0gbnVsbCkge1xuICAgICAgICBjb21tb24ubG9nKFwi5Zyo5qC55Z+f5LiU5a2Q5Z+f5pyJ5YC877yM5Yig6Zmk5a2Q5Z+f55qEY29va2llXCIpXG4gICAgICAgIC8vIOWmguaenOaYr+agueWfn+eahO+8jOWIoOmZpOS7peWJjeiuvue9ruWcqOWtkOWfn+eahFxuICAgICAgICBjb21tb24uY29va2llLnJlbW92ZShMSUJfS0VZICsgXCJqc3Nka1wiLCBmYWxzZSlcbiAgICAgICAgY29tbW9uLmNvb2tpZS5yZW1vdmUoTElCX0tFWSArIFwianNzZGtcIiwgdHJ1ZSlcbiAgICAgIH1cbiAgICAgIGlmIChjcm9zcyA9PT0gbnVsbCAmJiBkcyAhPT0gbnVsbCkge1xuICAgICAgICBjb21tb24ubG9nKFwi5Zyo5qC55Z+f5LiU5qC55Z+f5rKh5YC877yM5a2Q5Z+f5pyJ5YC877yM5qC55Z+f77yd5a2Q5Z+f55qE5YC8XCIsIGRzKVxuICAgICAgICBjcm9zcyA9IGRzXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbW1vbi5sb2coXCLlnKjlrZDln59cIilcbiAgICAgIGNyb3NzID0gZHNcbiAgICB9XG4gICAgdGhpcy5pbml0U2Vzc2lvblN0YXRlKClcbiAgICBpZiAoY3Jvc3MgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudG9TdGF0ZShjcm9zcylcbiAgICAgIC8vIOWmguaenOaYr+agueWfn+S4lOagueWfn+ayoeWAvFxuICAgICAgaWYgKGNvbmZpZy5jcm9zc1N1YkRvbWFpbiAmJiBjcyA9PT0gbnVsbCkge1xuICAgICAgICBjb21tb24ubG9nKFwi5Zyo5qC55Z+f5LiU5qC55Z+f5rKh5YC877yM5L+d5a2Y5b2T5YmN5YC85YiwY29va2ll5LitXCIpXG4gICAgICAgIHRoaXMuc2F2ZSgpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbW1vbi5sb2coXCLmsqHmnInlgLzvvIxzZXTlgLxcIilcbiAgICAgIHRoaXMuc2V0KFwidW5pcXVlSWRcIiwgY29tbW9uLlVVSUQoKSlcbiAgICB9XG4gICAgLy8g55Sf5oiQ5pys5qyh5Zue6K+d55qEU2Vzc2lvbklEXG4gICAgdGhpcy5zZXRPbmNlKFwiaWRcIiwgY29tbW9uLlVVSUQoKSlcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldERldmljZUlkOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlLnVuaXF1ZUlkXG4gIH0sXG4gIGdldFNlc3Npb25JZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9zZXNzaW9uU3RhdGUuc2Vzc2lvbklkXG4gIH0sXG4gIGdldERvbWFpbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkb21haW4gPSB0aGlzLl9zdGF0ZS5kb21haW5cbiAgICBpZiAoIWRvbWFpbikge1xuICAgICAgZG9tYWluID0gZG9jdW1lbnQuZG9tYWluIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0XG4gICAgICB0aGlzLnNldE9uY2UoXCJkb21haW5cIiwgZG9tYWluKVxuICAgIH1cbiAgICByZXR1cm4gZG9tYWluXG4gIH0sXG4gIHRvU3RhdGU6IGZ1bmN0aW9uIChkcykge1xuICAgIHZhciBzdGF0ZSA9IG51bGxcbiAgICBpZiAoZHMgIT09IG51bGwgJiYgKHR5cGVvZiAoc3RhdGUgPSBKU09OLnBhcnNlKGRzKSkgPT09IFwib2JqZWN0XCIpKSB7XG4gICAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlXG4gICAgfVxuICB9LFxuICBpbml0U2Vzc2lvblN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRzID0gY29tbW9uLmNvb2tpZS5nZXQoTElCX0tFWSArIFwic2Vzc2lvblwiKVxuICAgIHZhciBzdGF0ZSA9IG51bGxcbiAgICBpZiAoZHMgIT09IG51bGwgJiYgKHR5cGVvZiAoc3RhdGUgPSBKU09OLnBhcnNlKGRzKSkgPT09IFwib2JqZWN0XCIpKSB7XG4gICAgICB0aGlzLl9zZXNzaW9uU3RhdGUgPSBzdGF0ZVxuICAgIH1cbiAgfSxcbiAgZ2V0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHJldHVybiBuYW1lID8gdGhpcy5fc3RhdGVbbmFtZV0gOiB0aGlzLl9zdGF0ZVxuICB9LFxuICBnZXRTZXNzaW9uOiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHJldHVybiBuYW1lID8gdGhpcy5fc2Vzc2lvblN0YXRlW25hbWVdIDogdGhpcy5fc2Vzc2lvblN0YXRlXG4gIH0sXG4gIHNldDogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgdGhpcy5fc3RhdGVbbmFtZV0gPSB2YWx1ZVxuICAgIHRoaXMuc2F2ZSgpXG4gIH0sXG4gIHNldE9uY2U6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgIGlmICghKG5hbWUgaW4gdGhpcy5fc3RhdGUpKSB7XG4gICAgICB0aGlzLnNldChuYW1lLCB2YWx1ZSlcbiAgICB9XG4gIH0sXG4gIHNldFNlc3Npb246IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgIHRoaXMuX3Nlc3Npb25TdGF0ZVtuYW1lXSA9IHZhbHVlXG4gICAgdGhpcy5zZXNzaW9uU2F2ZSgpXG4gIH0sXG4gIHNldFNlc3Npb25PbmNlOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoIShuYW1lIGluIHRoaXMuX3Nlc3Npb25TdGF0ZSkpIHtcbiAgICAgIHRoaXMuc2V0U2Vzc2lvbihuYW1lLCB2YWx1ZSlcbiAgICB9XG4gIH0sXG4gIC8vIOmSiOWvueW9k+WJjemhtemdouS/ruaUuVxuICBjaGFuZ2U6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgIHRoaXMuX3N0YXRlW25hbWVdID0gdmFsdWVcbiAgfSxcbiAgc2Vzc2lvbkNoYW5nZTogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgdGhpcy5fc2Vzc2lvblN0YXRlW25hbWVdID0gdmFsdWVcbiAgfSxcbiAgc2V0U2Vzc2lvblByb3BzOiBmdW5jdGlvbiAobmV3cCkge1xuICAgIHRoaXMuX3NldFNlc3Npb25Qcm9wcyhcInByb3BzXCIsIG5ld3ApXG4gIH0sXG4gIHNldFNlc3Npb25Qcm9wc09uY2U6IGZ1bmN0aW9uIChuZXdwKSB7XG4gICAgdGhpcy5fc2V0U2Vzc2lvblByb3BzT25jZShcInByb3BzXCIsIG5ld3ApXG4gIH0sXG4gIHNldFNlc3Npb25TdWJqZWN0OiBmdW5jdGlvbiAobmV3cCkge1xuICAgIHRoaXMuX3NldFNlc3Npb25Qcm9wcyhcInN1YmplY3RcIiwgbmV3cClcbiAgfSxcbiAgc2V0U2Vzc2lvblN1YmplY3RPbmNlOiBmdW5jdGlvbiAobmV3cCkge1xuICAgIHRoaXMuX3NldFNlc3Npb25Qcm9wc09uY2UoXCJzdWJqZWN0XCIsIG5ld3ApXG4gIH0sXG4gIGNsZWFyU2Vzc2lvblN1YmplY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9zZXNzaW9uU3RhdGUuc3ViamVjdCA9IHt9XG4gICAgdGhpcy5zZXNzaW9uU2F2ZSgpXG4gIH0sXG4gIHNldFNlc3Npb25PYmplY3Q6IGZ1bmN0aW9uIChuZXdwKSB7XG4gICAgdGhpcy5fc2V0U2Vzc2lvblByb3BzKFwib2JqZWN0XCIsIG5ld3ApXG4gIH0sXG4gIHNldFNlc3Npb25PYmplY3RPbmNlOiBmdW5jdGlvbiAobmV3cCkge1xuICAgIHRoaXMuX3NldFNlc3Npb25Qcm9wc09uY2UoXCJvYmplY3RcIiwgbmV3cClcbiAgfSxcbiAgY2xlYXJTZXNzaW9uT2JqZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fc2Vzc2lvblN0YXRlLm9iamVjdCA9IHt9XG4gICAgdGhpcy5zZXNzaW9uU2F2ZSgpXG4gIH0sXG4gIHNldFByb3BzOiBmdW5jdGlvbiAobmV3cCkge1xuICAgIHRoaXMuX3NldFByb3BzKFwicHJvcHNcIiwgbmV3cClcbiAgfSxcbiAgc2V0UHJvcHNPbmNlOiBmdW5jdGlvbiAobmV3cCkge1xuICAgIHRoaXMuX3NldFByb3BzT25jZShcInByb3BzXCIsIG5ld3ApXG4gIH0sXG4gIHNldFN1YmplY3Q6IGZ1bmN0aW9uIChuZXdwKSB7XG4gICAgdGhpcy5fc2V0UHJvcHMoXCJzdWJqZWN0XCIsIG5ld3ApXG4gIH0sXG4gIHNldFN1YmplY3RPbmNlOiBmdW5jdGlvbiAobmV3cCkge1xuICAgIHRoaXMuX3NldFByb3BzT25jZShcInN1YmplY3RcIiwgbmV3cClcbiAgfSxcbiAgY2xlYXJTdWJqZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fc3RhdGUuc3ViamVjdCA9IHt9XG4gICAgdGhpcy5zYXZlKClcbiAgfSxcbiAgc2V0T2JqZWN0OiBmdW5jdGlvbiAobmV3cCkge1xuICAgIHRoaXMuX3NldFByb3BzKFwic3ViamVjdFwiLCBuZXdwKVxuICB9LFxuICBzZXRPYmplY3RPbmNlOiBmdW5jdGlvbiAobmV3cCkge1xuICAgIHRoaXMuX3NldFByb3BzT25jZShcInN1YmplY3RcIiwgbmV3cClcbiAgfSxcbiAgY2xlYXJPYmplY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9zdGF0ZS5vYmplY3QgPSB7fVxuICAgIHRoaXMuc2F2ZSgpXG4gIH0sXG4gIF9zZXRQcm9wczogZnVuY3Rpb24gKG9iak5hbWUsIG5ld3ApIHtcbiAgICB2YXIgb2JqID0gdGhpcy5fc3RhdGVbb2JqTmFtZV0gfHwge31cbiAgICBjb21tb24uZXh0ZW5kKG9iaiwgbmV3cClcbiAgICB0aGlzLnNldChvYmpOYW1lLCBvYmopXG4gIH0sXG4gIF9zZXRQcm9wc09uY2U6IGZ1bmN0aW9uIChvYmpOYW1lLCBuZXdwKSB7XG4gICAgdmFyIG9iaiA9IHRoaXMuX3N0YXRlW29iak5hbWVdIHx8IHt9XG4gICAgY29tbW9uLmNvdmVyRXh0ZW5kKG9iaiwgbmV3cClcbiAgICB0aGlzLnNldChvYmpOYW1lLCBvYmopXG4gIH0sXG4gIF9zZXRTZXNzaW9uUHJvcHM6IGZ1bmN0aW9uIChvYmpOYW1lLCBuZXdwKSB7XG4gICAgdmFyIG9iaiA9IHRoaXMuX3Nlc3Npb25TdGF0ZVtvYmpOYW1lXSB8fCB7fVxuICAgIGNvbW1vbi5leHRlbmQob2JqLCBuZXdwKVxuICAgIHRoaXMuc2V0U2Vzc2lvbihvYmpOYW1lLCBvYmopXG4gIH0sXG4gIF9zZXRTZXNzaW9uUHJvcHNPbmNlOiBmdW5jdGlvbiAob2JqTmFtZSwgbmV3cCkge1xuICAgIHZhciBvYmogPSB0aGlzLl9zZXNzaW9uU3RhdGVbb2JqTmFtZV0gfHwge31cbiAgICBjb21tb24uY292ZXJFeHRlbmQob2JqLCBuZXdwKVxuICAgIHRoaXMuc2V0U2Vzc2lvbihvYmpOYW1lLCBvYmopXG4gIH0sXG4gIHNlc3Npb25TYXZlOiBmdW5jdGlvbiAocHJvcHMpIHtcbiAgICBpZiAocHJvcHMpIHtcbiAgICAgIHRoaXMuX3Nlc3Npb25TdGF0ZSA9IHByb3BzXG4gICAgfVxuICAgIGNvbW1vbi5jb29raWUuc2V0KExJQl9LRVkgKyBcInNlc3Npb25cIiwgSlNPTi5zdHJpbmdpZnkodGhpcy5fc2Vzc2lvblN0YXRlKSwgMCwgY29uZmlnLmNyb3NzU3ViRG9tYWluKVxuICB9LFxuICBzYXZlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGNvbmZpZy5jcm9zc1N1YkRvbWFpbikge1xuICAgICAgY29tbW9uLmNvb2tpZS5zZXQoTElCX0tFWSArIFwianNzZGtjcm9zc1wiLCBKU09OLnN0cmluZ2lmeSh0aGlzLl9zdGF0ZSksIHRoaXMuX3N0YXRlW1wiZXhwaXJlc1wiXSB8fCA3MzAsIHRydWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbW1vbi5jb29raWUuc2V0KExJQl9LRVkgKyBcImpzc2RrXCIsIEpTT04uc3RyaW5naWZ5KHRoaXMuX3N0YXRlKSwgdGhpcy5fc3RhdGVbXCJleHBpcmVzXCJdIHx8IDczMCwgZmFsc2UpXG4gICAgfVxuICB9LFxuICBfc2Vzc2lvblN0YXRlOiB7XG4gICAgcHJvcHM6IHt9LFxuICAgIHN1YmplY3Q6IHt9LFxuICAgIG9iamVjdDoge31cbiAgfSxcbiAgX3N0YXRlOiB7XG4gICAgcHJvcHM6IHt9LFxuICAgIHN1YmplY3Q6IHt9LFxuICAgIG9iamVjdDoge31cbiAgfSxcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkcyA9IGNvbW1vbi5jb29raWUuZ2V0KExJQl9LRVkgKyBcImpzc2RrXCIpXG4gICAgdmFyIGNzID0gY29tbW9uLmNvb2tpZS5nZXQoTElCX0tFWSArIFwianNzZGtjcm9zc1wiKVxuICAgIHZhciBjcm9zcyA9IG51bGxcbiAgICBpZiAoY29uZmlnLmNyb3NzU3ViRG9tYWluKSB7XG4gICAgICBjcm9zcyA9IGNzXG4gICAgICBpZiAoZHMgIT09IG51bGwpIHtcbiAgICAgICAgY29tbW9uLmxvZyhcIuWcqOagueWfn+S4lOWtkOWfn+acieWAvO+8jOWIoOmZpOWtkOWfn+eahGNvb2tpZVwiKVxuICAgICAgICAvLyDlpoLmnpzmmK/moLnln5/nmoTvvIzliKDpmaTku6XliY3orr7nva7lnKjlrZDln5/nmoRcbiAgICAgICAgY29tbW9uLmNvb2tpZS5yZW1vdmUoTElCX0tFWSArIFwianNzZGtcIiwgZmFsc2UpXG4gICAgICAgIGNvbW1vbi5jb29raWUucmVtb3ZlKExJQl9LRVkgKyBcImpzc2RrXCIsIHRydWUpXG4gICAgICB9XG4gICAgICBpZiAoY3Jvc3MgPT09IG51bGwgJiYgZHMgIT09IG51bGwpIHtcbiAgICAgICAgY29tbW9uLmxvZyhcIuWcqOagueWfn+S4lOagueWfn+ayoeWAvO+8jOWtkOWfn+acieWAvO+8jOagueWfn++8neWtkOWfn+eahOWAvFwiLCBkcylcbiAgICAgICAgY3Jvc3MgPSBkc1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb21tb24ubG9nKFwi5Zyo5a2Q5Z+fXCIpXG4gICAgICBjcm9zcyA9IGRzXG4gICAgfVxuICAgIHRoaXMuaW5pdFNlc3Npb25TdGF0ZSgpXG4gICAgaWYgKGNyb3NzICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnRvU3RhdGUoY3Jvc3MpXG4gICAgICAvLyDlpoLmnpzmmK/moLnln5/kuJTmoLnln5/msqHlgLxcbiAgICAgIGlmIChjb25maWcuY3Jvc3NTdWJEb21haW4gJiYgY3MgPT09IG51bGwpIHtcbiAgICAgICAgY29tbW9uLmxvZyhcIuWcqOagueWfn+S4lOagueWfn+ayoeWAvO+8jOS/neWtmOW9k+WJjeWAvOWIsGNvb2tpZeS4rVwiKVxuICAgICAgICB0aGlzLnNhdmUoKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb21tb24ubG9nKFwi5rKh5pyJ5YC877yMc2V05YC8XCIpXG4gICAgICB0aGlzLnNldChcInVuaXF1ZUlkXCIsIGNvbW1vbi5VVUlEKCkpXG4gICAgfVxuICAgIC8vIOeUn+aIkOacrOasoeWbnuivneeahFNlc3Npb25JRFxuICAgIHRoaXMuc2V0U2Vzc2lvbk9uY2UoXCJzZXNzaW9uSWRcIiwgY29tbW9uLlVVSUQoKSlcbiAgfVxufVxuIiwiLypcbiAqIExpY2Vuc2VkIHRvIHRoZSBBcGFjaGUgU29mdHdhcmUgRm91bmRhdGlvbiAoQVNGKSB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBTZWUgdGhlIE5PVElDRSBmaWxlXG4gKiBkaXN0cmlidXRlZCB3aXRoIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvblxuICogcmVnYXJkaW5nIGNvcHlyaWdodCBvd25lcnNoaXAuIFRoZSBBU0YgbGljZW5zZXMgdGhpcyBmaWxlXG4gKiB0byB5b3UgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlXG4gKiBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2VcbiAqIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoganNoaW50IGV2aWw6dHJ1ZSAqL1xuXG4vKipcbiAqIFRoZSBUaHJpZnQgbmFtZXNwYWNlIGhvdXNlcyB0aGUgQXBhY2hlIFRocmlmdCBKYXZhU2NyaXB0IGxpYnJhcnlcbiAqIGVsZW1lbnRzIHByb3ZpZGluZyBKYXZhU2NyaXB0IGJpbmRpbmdzIGZvciB0aGUgQXBhY2hlIFRocmlmdCBSUENcbiAqIHN5c3RlbS4gRW5kIHVzZXJzIHdpbGwgdHlwaWNhbGx5IG9ubHkgZGlyZWN0bHkgbWFrZSB1c2Ugb2YgdGhlXG4gKiBUcmFuc3BvcnQgKFRYSFJUcmFuc3BvcnQvVFdlYlNvY2tldFRyYW5zcG9ydCkgYW5kIFByb3RvY29sXG4gKiAoVEpTT05QUm90b2NvbC9UQmluYXJ5UHJvdG9jb2wpIGNvbnN0cnVjdG9ycy5cbiAqXG4gKiBPYmplY3QgbWV0aG9kcyBiZWdpbm5pbmcgd2l0aCBhIF9fIChlLmcuIF9fb25PcGVuKCkpIGFyZSBpbnRlcm5hbFxuICogYW5kIHNob3VsZCBub3QgYmUgY2FsbGVkIG91dHNpZGUgb2YgdGhlIG9iamVjdCdzIG93biBtZXRob2RzLlxuICpcbiAqIFRoaXMgbGlicmFyeSBjcmVhdGVzIG9uZSBnbG9iYWwgb2JqZWN0OiBUaHJpZnRcbiAqIENvZGUgaW4gdGhpcyBsaWJyYXJ5IG11c3QgbmV2ZXIgY3JlYXRlIGFkZGl0aW9uYWwgZ2xvYmFsIGlkZW50aWZpZXJzLFxuICogYWxsIGZlYXR1cmVzIG11c3QgYmUgc2NvcGVkIHdpdGhpbiB0aGUgVGhyaWZ0IG5hbWVzcGFjZS5cbiAqIEBuYW1lc3BhY2VcbiAqIEBleGFtcGxlXG4gKiAgICAgdmFyIHRyYW5zcG9ydCA9IG5ldyBUaHJpZnQuVHJhbnNwb3J0KCdodHRwOi8vbG9jYWxob3N0Ojg1ODUnKTtcbiAqICAgICB2YXIgcHJvdG9jb2wgID0gbmV3IFRocmlmdC5Qcm90b2NvbCh0cmFuc3BvcnQpO1xuICogICAgIHZhciBjbGllbnQgPSBuZXcgTXlUaHJpZnRTdmNDbGllbnQocHJvdG9jb2wpO1xuICogICAgIHZhciByZXN1bHQgPSBjbGllbnQuTXlNZXRob2QoKTtcbiAqL1xudmFyIFRocmlmdCA9IHtcbiAgLyoqXG4gICAqIFRocmlmdCBKYXZhU2NyaXB0IGxpYnJhcnkgdmVyc2lvbi5cbiAgICogQHJlYWRvbmx5XG4gICAqIEBjb25zdCB7c3RyaW5nfSBWZXJzaW9uXG4gICAqIEBtZW1iZXJvZiBUaHJpZnRcbiAgICovXG4gIFZlcnNpb246IFwiMS4wLjAtZGV2XCIsXG5cbiAgLyoqXG4gICAqIFRocmlmdCBJREwgdHlwZSBzdHJpbmcgdG8gSWQgbWFwcGluZy5cbiAgICogQHJlYWRvbmx5XG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSAgU1RPUCAgIC0gRW5kIG9mIGEgc2V0IG9mIGZpZWxkcy5cbiAgICogQHByb3BlcnR5IHtudW1iZXJ9ICBWT0lEICAgLSBObyB2YWx1ZSAob25seSBsZWdhbCBmb3IgcmV0dXJuIHR5cGVzKS5cbiAgICogQHByb3BlcnR5IHtudW1iZXJ9ICBCT09MICAgLSBUcnVlL0ZhbHNlIGludGVnZXIuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSAgQllURSAgIC0gU2lnbmVkIDggYml0IGludGVnZXIuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSAgSTA4ICAgIC0gU2lnbmVkIDggYml0IGludGVnZXIuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSAgRE9VQkxFIC0gNjQgYml0IElFRUUgODU0IGZsb2F0aW5nIHBvaW50LlxuICAgKiBAcHJvcGVydHkge251bWJlcn0gIEkxNiAgICAtIFNpZ25lZCAxNiBiaXQgaW50ZWdlci5cbiAgICogQHByb3BlcnR5IHtudW1iZXJ9ICBJMzIgICAgLSBTaWduZWQgMzIgYml0IGludGVnZXIuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSAgSTY0ICAgIC0gU2lnbmVkIDY0IGJpdCBpbnRlZ2VyLlxuICAgKiBAcHJvcGVydHkge251bWJlcn0gIFNUUklORyAtIEFycmF5IG9mIGJ5dGVzIHJlcHJlc2VudGluZyBhIHN0cmluZyBvZiBjaGFyYWN0ZXJzLlxuICAgKiBAcHJvcGVydHkge251bWJlcn0gIFVURjcgICAtIEFycmF5IG9mIGJ5dGVzIHJlcHJlc2VudGluZyBhIHN0cmluZyBvZiBVVEY3IGVuY29kZWQgY2hhcmFjdGVycy5cbiAgICogQHByb3BlcnR5IHtudW1iZXJ9ICBTVFJVQ1QgLSBBIG11bHRpZmllbGQgdHlwZS5cbiAgICogQHByb3BlcnR5IHtudW1iZXJ9ICBNQVAgICAgLSBBIGNvbGxlY3Rpb24gdHlwZSAobWFwL2Fzc29jaWF0aXZlLWFycmF5L2RpY3Rpb25hcnkpLlxuICAgKiBAcHJvcGVydHkge251bWJlcn0gIFNFVCAgICAtIEEgY29sbGVjdGlvbiB0eXBlICh1bm9yZGVyZWQgYW5kIHdpdGhvdXQgcmVwZWF0ZWQgdmFsdWVzKS5cbiAgICogQHByb3BlcnR5IHtudW1iZXJ9ICBMSVNUICAgLSBBIGNvbGxlY3Rpb24gdHlwZSAodW5vcmRlcmVkKS5cbiAgICogQHByb3BlcnR5IHtudW1iZXJ9ICBVVEY4ICAgLSBBcnJheSBvZiBieXRlcyByZXByZXNlbnRpbmcgYSBzdHJpbmcgb2YgVVRGOCBlbmNvZGVkIGNoYXJhY3RlcnMuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSAgVVRGMTYgIC0gQXJyYXkgb2YgYnl0ZXMgcmVwcmVzZW50aW5nIGEgc3RyaW5nIG9mIFVURjE2IGVuY29kZWQgY2hhcmFjdGVycy5cbiAgICovXG4gIFR5cGU6IHtcbiAgICBTVE9QOiAwLFxuICAgIFZPSUQ6IDEsXG4gICAgQk9PTDogMixcbiAgICBCWVRFOiAzLFxuICAgIEkwODogMyxcbiAgICBET1VCTEU6IDQsXG4gICAgSTE2OiA2LFxuICAgIEkzMjogOCxcbiAgICBJNjQ6IDEwLFxuICAgIFNUUklORzogMTEsXG4gICAgVVRGNzogMTEsXG4gICAgU1RSVUNUOiAxMixcbiAgICBNQVA6IDEzLFxuICAgIFNFVDogMTQsXG4gICAgTElTVDogMTUsXG4gICAgVVRGODogMTYsXG4gICAgVVRGMTY6IDE3XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRocmlmdCBSUEMgbWVzc2FnZSB0eXBlIHN0cmluZyB0byBJZCBtYXBwaW5nLlxuICAgKiBAcmVhZG9ubHlcbiAgICogQHByb3BlcnR5IHtudW1iZXJ9ICBDQUxMICAgICAgLSBSUEMgY2FsbCBzZW50IGZyb20gY2xpZW50IHRvIHNlcnZlci5cbiAgICogQHByb3BlcnR5IHtudW1iZXJ9ICBSRVBMWSAgICAgLSBSUEMgY2FsbCBub3JtYWwgcmVzcG9uc2UgZnJvbSBzZXJ2ZXIgdG8gY2xpZW50LlxuICAgKiBAcHJvcGVydHkge251bWJlcn0gIEVYQ0VQVElPTiAtIFJQQyBjYWxsIGV4Y2VwdGlvbiByZXNwb25zZSBmcm9tIHNlcnZlciB0byBjbGllbnQuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSAgT05FV0FZICAgIC0gT25ld2F5IFJQQyBjYWxsIGZyb20gY2xpZW50IHRvIHNlcnZlciB3aXRoIG5vIHJlc3BvbnNlLlxuICAgKi9cbiAgTWVzc2FnZVR5cGU6IHtcbiAgICBDQUxMOiAxLFxuICAgIFJFUExZOiAyLFxuICAgIEVYQ0VQVElPTjogMyxcbiAgICBPTkVXQVk6IDRcbiAgfSxcblxuICAvKipcbiAgICogVXRpbGl0eSBmdW5jdGlvbiByZXR1cm5pbmcgdGhlIGNvdW50IG9mIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLlxuICAgKiBAcGFyYW0ge29iamVjdH0gb2JqIC0gT2JqZWN0IHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IG51bWJlciBvZiBvYmplY3QncyBvd24gcHJvcGVydGllc1xuICAgKi9cbiAgb2JqZWN0TGVuZ3RoOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIGxlbmd0aCA9IDBcbiAgICBmb3IgKHZhciBrIGluIG9iaikge1xuICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICBsZW5ndGgrK1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGVuZ3RoXG4gIH0sXG5cbiAgLyoqXG4gICAqIFV0aWxpdHkgZnVuY3Rpb24gdG8gZXN0YWJsaXNoIHByb3RvdHlwZSBpbmhlcml0YW5jZS5cbiAgICogQHNlZSB7QGxpbmsgaHR0cDovL2phdmFzY3JpcHQuY3JvY2tmb3JkLmNvbS9wcm90b3R5cGFsLmh0bWx8UHJvdG90eXBhbCBJbmhlcml0YW5jZX1cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY29uc3RydWN0b3IgLSBDb250c3RydWN0b3IgZnVuY3Rpb24gdG8gc2V0IGFzIGRlcml2ZWQuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ29uc3RydWN0b3IgLSBDb250c3RydWN0b3IgZnVuY3Rpb24gdG8gc2V0IGFzIGJhc2UuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbbmFtZV0gLSBUeXBlIG5hbWUgdG8gc2V0IGFzIG5hbWUgcHJvcGVydHkgaW4gZGVyaXZlZCBwcm90b3R5cGUuXG4gICAqL1xuICBpbmhlcml0czogZnVuY3Rpb24gKGNvbnN0cnVjdG9yLCBzdXBlckNvbnN0cnVjdG9yLCBuYW1lKSB7XG4gICAgZnVuY3Rpb24gRiAoKSB7fVxuICAgIEYucHJvdG90eXBlID0gc3VwZXJDb25zdHJ1Y3Rvci5wcm90b3R5cGVcbiAgICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBuZXcgRigpXG4gICAgY29uc3RydWN0b3IucHJvdG90eXBlLm5hbWUgPSBuYW1lIHx8IFwiXCJcbiAgfVxufVxuXG4vKipcbiogSW5pdGlhbGl6ZXMgYSBUaHJpZnQgVEV4Y2VwdGlvbiBpbnN0YW5jZS5cbiogQGNvbnN0cnVjdG9yXG4qIEBhdWdtZW50cyBFcnJvclxuKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSAtIFRoZSBURXhjZXB0aW9uIG1lc3NhZ2UgKGRpc3RpbmN0IGZyb20gdGhlIEVycm9yIG1lc3NhZ2UpLlxuKiBAY2xhc3NkZXNjIFRFeGNlcHRpb24gaXMgdGhlIGJhc2UgY2xhc3MgZm9yIGFsbCBUaHJpZnQgZXhjZXB0aW9ucyB0eXBlcy5cbiovXG5UaHJpZnQuVEV4Y2VwdGlvbiA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2Vcbn1cblRocmlmdC5pbmhlcml0cyhUaHJpZnQuVEV4Y2VwdGlvbiwgRXJyb3IsIFwiVEV4Y2VwdGlvblwiKVxuXG4vKipcbiogUmV0dXJucyB0aGUgbWVzc2FnZSBzZXQgb24gdGhlIGV4Y2VwdGlvbi5cbiogQHJlYWRvbmx5XG4qIEByZXR1cm5zIHtzdHJpbmd9IGV4Y2VwdGlvbiBtZXNzYWdlXG4qL1xuVGhyaWZ0LlRFeGNlcHRpb24ucHJvdG90eXBlLmdldE1lc3NhZ2UgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLm1lc3NhZ2Vcbn1cblxuLyoqXG4qIFRocmlmdCBBcHBsaWNhdGlvbiBFeGNlcHRpb24gdHlwZSBzdHJpbmcgdG8gSWQgbWFwcGluZy5cbiogQHJlYWRvbmx5XG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSAgVU5LTk9XTiAgICAgICAgICAgICAgICAgLSBVbmtub3duL3VuZGVmaW5lZC5cbiogQHByb3BlcnR5IHtudW1iZXJ9ICBVTktOT1dOX01FVEhPRCAgICAgICAgICAtIENsaWVudCBhdHRlbXB0ZWQgdG8gY2FsbCBhIG1ldGhvZCB1bmtub3duIHRvIHRoZSBzZXJ2ZXIuXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSAgSU5WQUxJRF9NRVNTQUdFX1RZUEUgICAgLSBDbGllbnQgcGFzc2VkIGFuIHVua25vd24vdW5zdXBwb3J0ZWQgTWVzc2FnZVR5cGUuXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSAgV1JPTkdfTUVUSE9EX05BTUUgICAgICAgLSBVbnVzZWQuXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSAgQkFEX1NFUVVFTkNFX0lEICAgICAgICAgLSBVbnVzZWQgaW4gVGhyaWZ0IFJQQywgdXNlZCB0byBmbGFnIHByb3ByaWV0YXJ5IHNlcXVlbmNlIG51bWJlciBlcnJvcnMuXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSAgTUlTU0lOR19SRVNVTFQgICAgICAgICAgLSBSYWlzZWQgYnkgYSBzZXJ2ZXIgcHJvY2Vzc29yIGlmIGEgaGFuZGxlciBmYWlscyB0byBzdXBwbHkgdGhlIHJlcXVpcmVkIHJldHVybiByZXN1bHQuXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSAgSU5URVJOQUxfRVJST1IgICAgICAgICAgLSBTb21ldGhpbmcgYmFkIGhhcHBlbmVkLlxuKiBAcHJvcGVydHkge251bWJlcn0gIFBST1RPQ09MX0VSUk9SICAgICAgICAgIC0gVGhlIHByb3RvY29sIGxheWVyIGZhaWxlZCB0byBzZXJpYWxpemUgb3IgZGVzZXJpYWxpemUgZGF0YS5cbiogQHByb3BlcnR5IHtudW1iZXJ9ICBJTlZBTElEX1RSQU5TRk9STSAgICAgICAtIFVudXNlZC5cbiogQHByb3BlcnR5IHtudW1iZXJ9ICBJTlZBTElEX1BST1RPQ09MICAgICAgICAtIFRoZSBwcm90b2NvbCAob3IgdmVyc2lvbikgaXMgbm90IHN1cHBvcnRlZC5cbiogQHByb3BlcnR5IHtudW1iZXJ9ICBVTlNVUFBPUlRFRF9DTElFTlRfVFlQRSAtIFVudXNlZC5cbiovXG5UaHJpZnQuVEFwcGxpY2F0aW9uRXhjZXB0aW9uVHlwZSA9IHtcbiAgVU5LTk9XTjogMCxcbiAgVU5LTk9XTl9NRVRIT0Q6IDEsXG4gIElOVkFMSURfTUVTU0FHRV9UWVBFOiAyLFxuICBXUk9OR19NRVRIT0RfTkFNRTogMyxcbiAgQkFEX1NFUVVFTkNFX0lEOiA0LFxuICBNSVNTSU5HX1JFU1VMVDogNSxcbiAgSU5URVJOQUxfRVJST1I6IDYsXG4gIFBST1RPQ09MX0VSUk9SOiA3LFxuICBJTlZBTElEX1RSQU5TRk9STTogOCxcbiAgSU5WQUxJRF9QUk9UT0NPTDogOSxcbiAgVU5TVVBQT1JURURfQ0xJRU5UX1RZUEU6IDEwXG59XG5cbi8qKlxuKiBJbml0aWFsaXplcyBhIFRocmlmdCBUQXBwbGljYXRpb25FeGNlcHRpb24gaW5zdGFuY2UuXG4qIEBjb25zdHJ1Y3RvclxuKiBAYXVnbWVudHMgVGhyaWZ0LlRFeGNlcHRpb25cbiogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSBUaGUgVEFwcGxpY2F0aW9uRXhjZXB0aW9uIG1lc3NhZ2UgKGRpc3RpbmN0IGZyb20gdGhlIEVycm9yIG1lc3NhZ2UpLlxuKiBAcGFyYW0ge1RocmlmdC5UQXBwbGljYXRpb25FeGNlcHRpb25UeXBlfSBbY29kZV0gLSBUaGUgVEFwcGxpY2F0aW9uRXhjZXB0aW9uVHlwZSBjb2RlLlxuKiBAY2xhc3NkZXNjIFRBcHBsaWNhdGlvbkV4Y2VwdGlvbiBpcyB0aGUgZXhjZXB0aW9uIGNsYXNzIHVzZWQgdG8gcHJvcGFnYXRlIGV4Y2VwdGlvbnMgZnJvbSBhbiBSUEMgc2VydmVyIGJhY2sgdG8gYSBjYWxsaW5nIGNsaWVudC5cbiovXG5UaHJpZnQuVEFwcGxpY2F0aW9uRXhjZXB0aW9uID0gZnVuY3Rpb24gKG1lc3NhZ2UsIGNvZGUpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICB0aGlzLmNvZGUgPSB0eXBlb2YgY29kZSA9PT0gXCJudW1iZXJcIiA/IGNvZGUgOiAwXG59XG5UaHJpZnQuaW5oZXJpdHMoVGhyaWZ0LlRBcHBsaWNhdGlvbkV4Y2VwdGlvbiwgVGhyaWZ0LlRFeGNlcHRpb24sIFwiVEFwcGxpY2F0aW9uRXhjZXB0aW9uXCIpXG5cbi8qKlxuKiBSZWFkIGEgVEFwcGxpY2F0aW9uRXhjZXB0aW9uIGZyb20gdGhlIHN1cHBsaWVkIHByb3RvY29sLlxuKiBAcGFyYW0ge29iamVjdH0gaW5wdXQgLSBUaGUgaW5wdXQgcHJvdG9jb2wgdG8gcmVhZCBmcm9tLlxuKi9cblRocmlmdC5UQXBwbGljYXRpb25FeGNlcHRpb24ucHJvdG90eXBlLnJlYWQgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgd2hpbGUgKDEpIHtcbiAgICB2YXIgcmV0ID0gaW5wdXQucmVhZEZpZWxkQmVnaW4oKVxuXG4gICAgaWYgKHJldC5mdHlwZSA9PSBUaHJpZnQuVHlwZS5TVE9QKSB7XG4gICAgICBicmVha1xuICAgIH1cblxuICAgIHZhciBmaWQgPSByZXQuZmlkXG5cbiAgICBzd2l0Y2ggKGZpZCkge1xuICAgIGNhc2UgMTpcbiAgICAgIGlmIChyZXQuZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RSSU5HKSB7XG4gICAgICAgIHJldCA9IGlucHV0LnJlYWRTdHJpbmcoKVxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSByZXQudmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldCA9IGlucHV0LnNraXAocmV0LmZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDI6XG4gICAgICBpZiAocmV0LmZ0eXBlID09IFRocmlmdC5UeXBlLkkzMikge1xuICAgICAgICByZXQgPSBpbnB1dC5yZWFkSTMyKClcbiAgICAgICAgdGhpcy5jb2RlID0gcmV0LnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXQgPSBpbnB1dC5za2lwKHJldC5mdHlwZSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldCA9IGlucHV0LnNraXAocmV0LmZ0eXBlKVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBpbnB1dC5yZWFkRmllbGRFbmQoKVxuICB9XG5cbiAgaW5wdXQucmVhZFN0cnVjdEVuZCgpXG59XG5cbi8qKlxuKiBXaXRlIGEgVEFwcGxpY2F0aW9uRXhjZXB0aW9uIHRvIHRoZSBzdXBwbGllZCBwcm90b2NvbC5cbiogQHBhcmFtIHtvYmplY3R9IG91dHB1dCAtIFRoZSBvdXRwdXQgcHJvdG9jb2wgdG8gd3JpdGUgdG8uXG4qL1xuVGhyaWZ0LlRBcHBsaWNhdGlvbkV4Y2VwdGlvbi5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAob3V0cHV0KSB7XG4gIG91dHB1dC53cml0ZVN0cnVjdEJlZ2luKFwiVEFwcGxpY2F0aW9uRXhjZXB0aW9uXCIpXG5cbiAgaWYgKHRoaXMubWVzc2FnZSkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJtZXNzYWdlXCIsIFRocmlmdC5UeXBlLlNUUklORywgMSlcbiAgICBvdXRwdXQud3JpdGVTdHJpbmcodGhpcy5nZXRNZXNzYWdlKCkpXG4gICAgb3V0cHV0LndyaXRlRmllbGRFbmQoKVxuICB9XG5cbiAgaWYgKHRoaXMuY29kZSkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJ0eXBlXCIsIFRocmlmdC5UeXBlLkkzMiwgMilcbiAgICBvdXRwdXQud3JpdGVJMzIodGhpcy5jb2RlKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuXG4gIG91dHB1dC53cml0ZUZpZWxkU3RvcCgpXG4gIG91dHB1dC53cml0ZVN0cnVjdEVuZCgpXG59XG5cbi8qKlxuKiBSZXR1cm5zIHRoZSBhcHBsaWNhdGlvbiBleGNlcHRpb24gY29kZSBzZXQgb24gdGhlIGV4Y2VwdGlvbi5cbiogQHJlYWRvbmx5XG4qIEByZXR1cm5zIHtUaHJpZnQuVEFwcGxpY2F0aW9uRXhjZXB0aW9uVHlwZX0gZXhjZXB0aW9uIGNvZGVcbiovXG5UaHJpZnQuVEFwcGxpY2F0aW9uRXhjZXB0aW9uLnByb3RvdHlwZS5nZXRDb2RlID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5jb2RlXG59XG5cblRocmlmdC5UUHJvdG9jb2xFeGNlcHRpb25UeXBlID0ge1xuICBVTktOT1dOOiAwLFxuICBJTlZBTElEX0RBVEE6IDEsXG4gIE5FR0FUSVZFX1NJWkU6IDIsXG4gIFNJWkVfTElNSVQ6IDMsXG4gIEJBRF9WRVJTSU9OOiA0LFxuICBOT1RfSU1QTEVNRU5URUQ6IDUsXG4gIERFUFRIX0xJTUlUOiA2XG59XG5cblRocmlmdC5UUHJvdG9jb2xFeGNlcHRpb24gPSBmdW5jdGlvbiBUUHJvdG9jb2xFeGNlcHRpb24gKHR5cGUsIG1lc3NhZ2UpIHtcbiAgRXJyb3IuY2FsbCh0aGlzKVxuICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKVxuICB0aGlzLm5hbWUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWVcbiAgdGhpcy50eXBlID0gdHlwZVxuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlXG59XG5UaHJpZnQuaW5oZXJpdHMoVGhyaWZ0LlRQcm90b2NvbEV4Y2VwdGlvbiwgVGhyaWZ0LlRFeGNlcHRpb24sIFwiVFByb3RvY29sRXhjZXB0aW9uXCIpXG5cbi8qKlxuKiBDb25zdHJ1Y3RvciBGdW5jdGlvbiBmb3IgdGhlIFhIUiB0cmFuc3BvcnQuXG4qIElmIHlvdSBkbyBub3Qgc3BlY2lmeSBhIHVybCB0aGVuIHlvdSBtdXN0IGhhbmRsZSBYSFIgb3BlcmF0aW9ucyBvblxuKiB5b3VyIG93bi4gVGhpcyB0eXBlIGNhbiBhbHNvIGJlIGNvbnN0cnVjdGVkIHVzaW5nIHRoZSBUcmFuc3BvcnQgYWxpYXNcbiogZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkuXG4qIEBjb25zdHJ1Y3RvclxuKiBAcGFyYW0ge3N0cmluZ30gW3VybF0gLSBUaGUgVVJMIHRvIGNvbm5lY3QgdG8uXG4qIEBjbGFzc2Rlc2MgVGhlIEFwYWNoZSBUaHJpZnQgVHJhbnNwb3J0IGxheWVyIHBlcmZvcm1zIGJ5dGUgbGV2ZWwgSS9PXG4qIGJldHdlZW4gUlBDIGNsaWVudHMgYW5kIHNlcnZlcnMuIFRoZSBKYXZhU2NyaXB0IFRYSFJUcmFuc3BvcnQgb2JqZWN0XG4qIHVzZXMgSHR0cFtzXS9YSFIuIFRhcmdldCBzZXJ2ZXJzIG11c3QgaW1wbGVtZW50IHRoZSBodHRwW3NdIHRyYW5zcG9ydFxuKiAoc2VlOiBub2RlLmpzIGV4YW1wbGUgc2VydmVyX2h0dHAuanMpLlxuKiBAZXhhbXBsZVxuKiAgICAgdmFyIHRyYW5zcG9ydCA9IG5ldyBUaHJpZnQuVFhIUlRyYW5zcG9ydChcImh0dHA6Ly9sb2NhbGhvc3Q6ODU4NVwiKTtcbiovXG5UaHJpZnQuVHJhbnNwb3J0ID0gVGhyaWZ0LlRYSFJUcmFuc3BvcnQgPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gIHRoaXMudXJsID0gdXJsXG4gIHRoaXMud3BvcyA9IDBcbiAgdGhpcy5ycG9zID0gMFxuICB0aGlzLnVzZUNPUlMgPSAob3B0aW9ucyAmJiBvcHRpb25zLnVzZUNPUlMpXG4gIHRoaXMuY3VzdG9tSGVhZGVycyA9IG9wdGlvbnMgPyAob3B0aW9ucy5jdXN0b21IZWFkZXJzID8gb3B0aW9ucy5jdXN0b21IZWFkZXJzIDoge30pIDoge31cbiAgdGhpcy5zZW5kX2J1ZiA9IFwiXCJcbiAgdGhpcy5yZWN2X2J1ZiA9IFwiXCJcbn1cblxuVGhyaWZ0LlRYSFJUcmFuc3BvcnQucHJvdG90eXBlID0ge1xuICAvKipcbiAgICogR2V0cyB0aGUgYnJvd3NlciBzcGVjaWZpYyBYbWxIdHRwUmVxdWVzdCBPYmplY3QuXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IHRoZSBicm93c2VyIFhIUiBpbnRlcmZhY2Ugb2JqZWN0XG4gICAqL1xuICBnZXRYbWxIdHRwUmVxdWVzdE9iamVjdDogZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7IHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKSB9IGNhdGNoIChlMSkgeyB9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KFwiTXN4bWwyLlhNTEhUVFBcIikgfSBjYXRjaCAoZTIpIHsgfVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxIVFRQXCIpIH0gY2F0Y2ggKGUzKSB7IH1cblxuICAgIHRocm93IFwiWW91ciBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBYSFIuXCJcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgdGhlIGN1cnJlbnQgWFJIIHJlcXVlc3QgaWYgdGhlIHRyYW5zcG9ydCB3YXMgY3JlYXRlZCB3aXRoIGEgVVJMXG4gICAqIGFuZCB0aGUgYXN5bmMgcGFyYW1ldGVyIGlzIGZhbHNlLiBJZiB0aGUgdHJhbnNwb3J0IHdhcyBub3QgY3JlYXRlZCB3aXRoXG4gICAqIGEgVVJMLCBvciB0aGUgYXN5bmMgcGFyYW1ldGVyIGlzIFRydWUgYW5kIG5vIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBvclxuICAgKiB0aGUgVVJMIGlzIGFuIGVtcHR5IHN0cmluZywgdGhlIGN1cnJlbnQgc2VuZCBidWZmZXIgaXMgcmV0dXJuZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBhc3luYyAtIElmIHRydWUgdGhlIGN1cnJlbnQgc2VuZCBidWZmZXIgaXMgcmV0dXJuZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBjYWxsYmFjayAtIE9wdGlvbmFsIGFzeW5jIGNvbXBsZXRpb24gY2FsbGJhY2tcbiAgICogQHJldHVybnMge3VuZGVmaW5lZHxzdHJpbmd9IE5vdGhpbmcgb3IgdGhlIGN1cnJlbnQgc2VuZCBidWZmZXIuXG4gICAqIEB0aHJvd3Mge3N0cmluZ30gSWYgWEhSIGZhaWxzLlxuICAgKi9cbiAgZmx1c2g6IGZ1bmN0aW9uIChhc3luYywgY2FsbGJhY2spIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICBpZiAoKGFzeW5jICYmICFjYWxsYmFjaykgfHwgdGhpcy51cmwgPT09IHVuZGVmaW5lZCB8fCB0aGlzLnVybCA9PT0gXCJcIikge1xuICAgICAgcmV0dXJuIHRoaXMuc2VuZF9idWZcbiAgICB9XG5cbiAgICB2YXIgeHJlcSA9IHRoaXMuZ2V0WG1sSHR0cFJlcXVlc3RPYmplY3QoKVxuXG4gICAgaWYgKHhyZXEub3ZlcnJpZGVNaW1lVHlwZSkge1xuICAgICAgeHJlcS5vdmVycmlkZU1pbWVUeXBlKFwiYXBwbGljYXRpb24vdm5kLmFwYWNoZS50aHJpZnQuanNvbjsgY2hhcnNldD11dGYtOFwiKVxuICAgIH1cblxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgLy8gSWdub3JlIFhIUiBjYWxsYmFja3MgdW50aWwgdGhlIGRhdGEgYXJyaXZlcywgdGhlbiBjYWxsIHRoZVxuICAgICAgLy8gIGNsaWVudCdzIGNhbGxiYWNrXG4gICAgICB4cmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgY2xpZW50Q2FsbGJhY2sgPSBjYWxsYmFja1xuICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT0gNCAmJiB0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgIHNlbGYuc2V0UmVjdkJ1ZmZlcih0aGlzLnJlc3BvbnNlVGV4dClcbiAgICAgICAgICAgICAgICAgIGNsaWVudENhbGxiYWNrKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0oKSlcblxuICAgICAgLy8gZGV0ZWN0IG5ldDo6RVJSX0NPTk5FQ1RJT05fUkVGVVNFRCBhbmQgY2FsbCB0aGUgY2FsbGJhY2suXG4gICAgICB4cmVxLm9uZXJyb3IgPVxuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBjbGllbnRDYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIGNsaWVudENhbGxiYWNrKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0oKSlcbiAgICB9XG5cbiAgICB4cmVxLm9wZW4oXCJQT1NUXCIsIHRoaXMudXJsLCAhIWFzeW5jKVxuXG4gICAgLy8gYWRkIGN1c3RvbSBoZWFkZXJzXG4gICAgT2JqZWN0LmtleXMoc2VsZi5jdXN0b21IZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICB4cmVxLnNldFJlcXVlc3RIZWFkZXIocHJvcCwgc2VsZi5jdXN0b21IZWFkZXJzW3Byb3BdKVxuICAgIH0pXG5cbiAgICBpZiAoeHJlcS5zZXRSZXF1ZXN0SGVhZGVyKSB7XG4gICAgICB4cmVxLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi92bmQuYXBhY2hlLnRocmlmdC5qc29uOyBjaGFyc2V0PXV0Zi04XCIpXG4gICAgICB4cmVxLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi92bmQuYXBhY2hlLnRocmlmdC5qc29uOyBjaGFyc2V0PXV0Zi04XCIpXG4gICAgfVxuXG4gICAgeHJlcS5zZW5kKHRoaXMuc2VuZF9idWYpXG4gICAgaWYgKGFzeW5jICYmIGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoeHJlcS5yZWFkeVN0YXRlICE9IDQpIHtcbiAgICAgIHRocm93IFwiZW5jb3VudGVyZWQgYW4gdW5rbm93biBhamF4IHJlYWR5IHN0YXRlOiBcIiArIHhyZXEucmVhZHlTdGF0ZVxuICAgIH1cblxuICAgIGlmICh4cmVxLnN0YXR1cyAhPSAyMDApIHtcbiAgICAgIHRocm93IFwiZW5jb3VudGVyZWQgYSB1bmtub3duIHJlcXVlc3Qgc3RhdHVzOiBcIiArIHhyZXEuc3RhdHVzXG4gICAgfVxuXG4gICAgdGhpcy5yZWN2X2J1ZiA9IHhyZXEucmVzcG9uc2VUZXh0XG4gICAgdGhpcy5yZWN2X2J1Zl9zeiA9IHRoaXMucmVjdl9idWYubGVuZ3RoXG4gICAgdGhpcy53cG9zID0gdGhpcy5yZWN2X2J1Zi5sZW5ndGhcbiAgICB0aGlzLnJwb3MgPSAwXG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBqUXVlcnkgWEhSIG9iamVjdCB0byBiZSB1c2VkIGZvciBhIFRocmlmdCBzZXJ2ZXIgY2FsbC5cbiAgICogQHBhcmFtIHtvYmplY3R9IGNsaWVudCAtIFRoZSBUaHJpZnQgU2VydmljZSBjbGllbnQgb2JqZWN0IGdlbmVyYXRlZCBieSB0aGUgSURMIGNvbXBpbGVyLlxuICAgKiBAcGFyYW0ge29iamVjdH0gcG9zdERhdGEgLSBUaGUgbWVzc2FnZSB0byBzZW5kIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGFyZ3MgLSBUaGUgb3JpZ2luYWwgY2FsbCBhcmd1bWVudHMgd2l0aCB0aGUgc3VjY2VzcyBjYWxsIGJhY2sgYXQgdGhlIGVuZC5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gcmVjdl9tZXRob2QgLSBUaGUgVGhyaWZ0IFNlcnZpY2UgQ2xpZW50IHJlY2VpdmUgbWV0aG9kIGZvciB0aGUgY2FsbC5cbiAgICogQHJldHVybnMge29iamVjdH0gQSBuZXcgalF1ZXJ5IFhIUiBvYmplY3QuXG4gICAqIEB0aHJvd3Mge3N0cmluZ30gSWYgdGhlIGpRdWVyeSB2ZXJzaW9uIGlzIHByaW9yIHRvIDEuNSBvciBpZiBqUXVlcnkgaXMgbm90IGZvdW5kLlxuICAgKi9cbiAganFSZXF1ZXN0OiBmdW5jdGlvbiAoY2xpZW50LCBwb3N0RGF0YSwgYXJncywgcmVjdl9tZXRob2QpIHtcbiAgICBpZiAodHlwZW9mIGpRdWVyeSA9PT0gXCJ1bmRlZmluZWRcIiB8fFxuICAgICAgICAgIHR5cGVvZiBqUXVlcnkuRGVmZXJyZWQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRocm93IFwiVGhyaWZ0LmpzIHJlcXVpcmVzIGpRdWVyeSAxLjUrIHRvIHVzZSBhc3luY2hyb25vdXMgcmVxdWVzdHNcIlxuICAgIH1cblxuICAgIHZhciB0aHJpZnRUcmFuc3BvcnQgPSB0aGlzXG5cbiAgICB2YXIganFYSFIgPSBqUXVlcnkuYWpheCh7XG4gICAgICB1cmw6IHRoaXMudXJsLFxuICAgICAgZGF0YTogcG9zdERhdGEsXG4gICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL3ZuZC5hcGFjaGUudGhyaWZ0Lmpzb247IGNoYXJzZXQ9dXRmLThcIixcbiAgICAgIGRhdGFUeXBlOiBcInRleHQgdGhyaWZ0XCIsXG4gICAgICBjb252ZXJ0ZXJzOiB7XG4gICAgICAgIFwidGV4dCB0aHJpZnRcIjogZnVuY3Rpb24gKHJlc3BvbnNlRGF0YSkge1xuICAgICAgICAgIHRocmlmdFRyYW5zcG9ydC5zZXRSZWN2QnVmZmVyKHJlc3BvbnNlRGF0YSlcbiAgICAgICAgICB2YXIgdmFsdWUgPSByZWN2X21ldGhvZC5jYWxsKGNsaWVudClcbiAgICAgICAgICByZXR1cm4gdmFsdWVcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNvbnRleHQ6IGNsaWVudCxcbiAgICAgIHN1Y2Nlc3M6IGpRdWVyeS5tYWtlQXJyYXkoYXJncykucG9wKClcbiAgICB9KVxuXG4gICAgcmV0dXJuIGpxWEhSXG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGJ1ZmZlciB0byBwcm92aWRlIHRoZSBwcm90b2NvbCB3aGVuIGRlc2VyaWFsaXppbmcuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBidWYgLSBUaGUgYnVmZmVyIHRvIHN1cHBseSB0aGUgcHJvdG9jb2wuXG4gICAqL1xuICBzZXRSZWN2QnVmZmVyOiBmdW5jdGlvbiAoYnVmKSB7XG4gICAgdGhpcy5yZWN2X2J1ZiA9IGJ1ZlxuICAgIHRoaXMucmVjdl9idWZfc3ogPSB0aGlzLnJlY3ZfYnVmLmxlbmd0aFxuICAgIHRoaXMud3BvcyA9IHRoaXMucmVjdl9idWYubGVuZ3RoXG4gICAgdGhpcy5ycG9zID0gMFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHRyYW5zcG9ydCBpcyBvcGVuLCBYSFIgYWx3YXlzIHJldHVybnMgdHJ1ZS5cbiAgICogQHJlYWRvbmx5XG4gICAqIEByZXR1cm5zIHtib29sZWFufSBBbHdheXMgVHJ1ZS5cbiAgICovXG4gIGlzT3BlbjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0cnVlXG4gIH0sXG5cbiAgLyoqXG4gICAqIE9wZW5zIHRoZSB0cmFuc3BvcnQgY29ubmVjdGlvbiwgd2l0aCBYSFIgdGhpcyBpcyBhIG5vcC5cbiAgICovXG4gIG9wZW46IGZ1bmN0aW9uICgpIHt9LFxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIHRyYW5zcG9ydCBjb25uZWN0aW9uLCB3aXRoIFhIUiB0aGlzIGlzIGEgbm9wLlxuICAgKi9cbiAgY2xvc2U6IGZ1bmN0aW9uICgpIHt9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzcGVjaWZpZWQgbnVtYmVyIG9mIGNoYXJhY3RlcnMgZnJvbSB0aGUgcmVzcG9uc2VcbiAgICogYnVmZmVyLlxuICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gVGhlIG51bWJlciBvZiBjaGFyYWN0ZXJzIHRvIHJldHVybi5cbiAgICogQHJldHVybnMge3N0cmluZ30gQ2hhcmFjdGVycyBzZW50IGJ5IHRoZSBzZXJ2ZXIuXG4gICAqL1xuICByZWFkOiBmdW5jdGlvbiAobGVuKSB7XG4gICAgdmFyIGF2YWlsID0gdGhpcy53cG9zIC0gdGhpcy5ycG9zXG5cbiAgICBpZiAoYXZhaWwgPT09IDApIHtcbiAgICAgIHJldHVybiBcIlwiXG4gICAgfVxuXG4gICAgdmFyIGdpdmUgPSBsZW5cblxuICAgIGlmIChhdmFpbCA8IGxlbikge1xuICAgICAgZ2l2ZSA9IGF2YWlsXG4gICAgfVxuXG4gICAgdmFyIHJldCA9IHRoaXMucmVhZF9idWYuc3Vic3RyKHRoaXMucnBvcywgZ2l2ZSlcbiAgICB0aGlzLnJwb3MgKz0gZ2l2ZVxuXG4gICAgLy8gY2xlYXIgYnVmIHdoZW4gY29tcGxldGU/XG4gICAgcmV0dXJuIHJldFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBlbnRpcmUgcmVzcG9uc2UgYnVmZmVyLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBDaGFyYWN0ZXJzIHNlbnQgYnkgdGhlIHNlcnZlci5cbiAgICovXG4gIHJlYWRBbGw6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWN2X2J1ZlxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzZW5kIGJ1ZmZlciB0byBidWYuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBidWYgLSBUaGUgYnVmZmVyIHRvIHNlbmQuXG4gICAqL1xuICB3cml0ZTogZnVuY3Rpb24gKGJ1Zikge1xuICAgIHRoaXMuc2VuZF9idWYgPSBidWZcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc2VuZCBidWZmZXIuXG4gICAqIEByZWFkb25seVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgc2VuZCBidWZmZXIuXG4gICAqL1xuICBnZXRTZW5kQnVmZmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VuZF9idWZcbiAgfVxuXG59XG5cbi8qKlxuKiBDb25zdHJ1Y3RvciBGdW5jdGlvbiBmb3IgdGhlIFdlYlNvY2tldCB0cmFuc3BvcnQuXG4qIEBjb25zdHJ1Y3RvclxuKiBAcGFyYW0ge3N0cmluZ30gW3VybF0gLSBUaGUgVVJMIHRvIGNvbm5lY3QgdG8uXG4qIEBjbGFzc2Rlc2MgVGhlIEFwYWNoZSBUaHJpZnQgVHJhbnNwb3J0IGxheWVyIHBlcmZvcm1zIGJ5dGUgbGV2ZWwgSS9PXG4qIGJldHdlZW4gUlBDIGNsaWVudHMgYW5kIHNlcnZlcnMuIFRoZSBKYXZhU2NyaXB0IFRXZWJTb2NrZXRUcmFuc3BvcnQgb2JqZWN0XG4qIHVzZXMgdGhlIFdlYlNvY2tldCBwcm90b2NvbC4gVGFyZ2V0IHNlcnZlcnMgbXVzdCBpbXBsZW1lbnQgV2ViU29ja2V0LlxuKiAoc2VlOiBub2RlLmpzIGV4YW1wbGUgc2VydmVyX2h0dHAuanMpLlxuKiBAZXhhbXBsZVxuKiAgIHZhciB0cmFuc3BvcnQgPSBuZXcgVGhyaWZ0LlRXZWJTb2NrZXRUcmFuc3BvcnQoXCJodHRwOi8vbG9jYWxob3N0Ojg1ODVcIik7XG4qL1xuVGhyaWZ0LlRXZWJTb2NrZXRUcmFuc3BvcnQgPSBmdW5jdGlvbiAodXJsKSB7XG4gIHRoaXMuX19yZXNldCh1cmwpXG59XG5cblRocmlmdC5UV2ViU29ja2V0VHJhbnNwb3J0LnByb3RvdHlwZSA9IHtcbiAgX19yZXNldDogZnVuY3Rpb24gKHVybCkge1xuICAgIHRoaXMudXJsID0gdXJsIC8vIFdoZXJlIHRvIGNvbm5lY3RcbiAgICB0aGlzLnNvY2tldCA9IG51bGwgLy8gVGhlIHdlYiBzb2NrZXRcbiAgICB0aGlzLmNhbGxiYWNrcyA9IFtdIC8vIFBlbmRpbmcgY2FsbGJhY2tzXG4gICAgdGhpcy5zZW5kX3BlbmRpbmcgPSBbXSAvLyBCdWZmZXJzL0NhbGxiYWNrIHBhaXJzIHdhaXRpbmcgdG8gYmUgc2VudFxuICAgIHRoaXMuc2VuZF9idWYgPSBcIlwiIC8vIE91dGJvdW5kIGRhdGEsIGltbXV0YWJsZSB1bnRpbCBzZW50XG4gICAgdGhpcy5yZWN2X2J1ZiA9IFwiXCIgLy8gSW5ib3VuZCBkYXRhXG4gICAgdGhpcy5yYl93cG9zID0gMCAvLyBOZXR3b3JrIHdyaXRlIHBvc2l0aW9uIGluIHJlY2VpdmUgYnVmZmVyXG4gICAgdGhpcy5yYl9ycG9zID0gMCAvLyBDbGllbnQgcmVhZCBwb3NpdGlvbiBpbiByZWNlaXZlIGJ1ZmZlclxuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kcyB0aGUgY3VycmVudCBXUyByZXF1ZXN0IGFuZCByZWdpc3RlcnMgY2FsbGJhY2suIFRoZSBhc3luY1xuICAgKiBwYXJhbWV0ZXIgaXMgaWdub3JlZCAoV1MgZmx1c2ggaXMgYWx3YXlzIGFzeW5jKSBhbmQgdGhlIGNhbGxiYWNrXG4gICAqIGZ1bmN0aW9uIHBhcmFtZXRlciBpcyByZXF1aXJlZC5cbiAgICogQHBhcmFtIHtvYmplY3R9IGFzeW5jIC0gSWdub3JlZC5cbiAgICogQHBhcmFtIHtvYmplY3R9IGNhbGxiYWNrIC0gVGhlIGNsaWVudCBjb21wbGV0aW9uIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfHN0cmluZ30gTm90aGluZyAodW5kZWZpbmVkKVxuICAgKi9cbiAgZmx1c2g6IGZ1bmN0aW9uIChhc3luYywgY2FsbGJhY2spIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgLy8gU2VuZCBkYXRhIGFuZCByZWdpc3RlciBhIGNhbGxiYWNrIHRvIGludm9rZSB0aGUgY2xpZW50IGNhbGxiYWNrXG4gICAgICB0aGlzLnNvY2tldC5zZW5kKHRoaXMuc2VuZF9idWYpXG4gICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjbGllbnRDYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgc2VsZi5zZXRSZWN2QnVmZmVyKG1zZylcbiAgICAgICAgICBjbGllbnRDYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgIH0oKSkpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFF1ZXVlIHRoZSBzZW5kIHRvIGdvIG91dCBfX29uT3BlblxuICAgICAgdGhpcy5zZW5kX3BlbmRpbmcucHVzaCh7XG4gICAgICAgIGJ1ZjogdGhpcy5zZW5kX2J1ZixcbiAgICAgICAgY2I6IGNhbGxiYWNrXG4gICAgICB9KVxuICAgIH1cbiAgfSxcblxuICBfX29uT3BlbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIGlmICh0aGlzLnNlbmRfcGVuZGluZy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBJZiB0aGUgdXNlciBtYWRlIGNhbGxzIGJlZm9yZSB0aGUgY29ubmVjdGlvbiB3YXMgZnVsbHlcbiAgICAgIC8vIG9wZW4sIHNlbmQgdGhlbSBub3dcbiAgICAgIHRoaXMuc2VuZF9wZW5kaW5nLmZvckVhY2goZnVuY3Rpb24gKGVsZW0pIHtcbiAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChlbGVtLmJ1ZilcbiAgICAgICAgdGhpcy5jYWxsYmFja3MucHVzaCgoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBjbGllbnRDYWxsYmFjayA9IGVsZW0uY2JcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgc2VsZi5zZXRSZWN2QnVmZmVyKG1zZylcbiAgICAgICAgICAgIGNsaWVudENhbGxiYWNrKClcbiAgICAgICAgICB9XG4gICAgICAgIH0oKSkpXG4gICAgICB9KVxuICAgICAgdGhpcy5zZW5kX3BlbmRpbmcgPSBbXVxuICAgIH1cbiAgfSxcblxuICBfX29uQ2xvc2U6IGZ1bmN0aW9uIChldnQpIHtcbiAgICB0aGlzLl9fcmVzZXQodGhpcy51cmwpXG4gIH0sXG5cbiAgX19vbk1lc3NhZ2U6IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAodGhpcy5jYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICB0aGlzLmNhbGxiYWNrcy5zaGlmdCgpKGV2dC5kYXRhKVxuICAgIH1cbiAgfSxcblxuICBfX29uRXJyb3I6IGZ1bmN0aW9uIChldnQpIHtcbiAgICBjb25zb2xlLmxvZyhcIlRocmlmdCBXZWJTb2NrZXQgRXJyb3I6IFwiICsgZXZ0LnRvU3RyaW5nKCkpXG4gICAgdGhpcy5zb2NrZXQuY2xvc2UoKVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBidWZmZXIgdG8gdXNlIHdoZW4gcmVjZWl2aW5nIHNlcnZlciByZXNwb25zZXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBidWYgLSBUaGUgYnVmZmVyIHRvIHJlY2VpdmUgc2VydmVyIHJlc3BvbnNlcy5cbiAgICovXG4gIHNldFJlY3ZCdWZmZXI6IGZ1bmN0aW9uIChidWYpIHtcbiAgICB0aGlzLnJlY3ZfYnVmID0gYnVmXG4gICAgdGhpcy5yZWN2X2J1Zl9zeiA9IHRoaXMucmVjdl9idWYubGVuZ3RoXG4gICAgdGhpcy53cG9zID0gdGhpcy5yZWN2X2J1Zi5sZW5ndGhcbiAgICB0aGlzLnJwb3MgPSAwXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdHJhbnNwb3J0IGlzIG9wZW5cbiAgICogQHJlYWRvbmx5XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNPcGVuOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT0gdGhpcy5zb2NrZXQuT1BFTlxuICB9LFxuXG4gIC8qKlxuICAgKiBPcGVucyB0aGUgdHJhbnNwb3J0IGNvbm5lY3Rpb25cbiAgICovXG4gIG9wZW46IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBJZiBPUEVOL0NPTk5FQ1RJTkcvQ0xPU0lORyBpZ25vcmUgYWRkaXRpb25hbCBvcGVuc1xuICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlICE9IHRoaXMuc29ja2V0LkNMT1NFRCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIC8vIElmIHRoZXJlIGlzIG5vIHNvY2tldCBvciB0aGUgc29ja2V0IGlzIGNsb3NlZDpcbiAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQodGhpcy51cmwpXG4gICAgdGhpcy5zb2NrZXQub25vcGVuID0gdGhpcy5fX29uT3Blbi5iaW5kKHRoaXMpXG4gICAgdGhpcy5zb2NrZXQub25tZXNzYWdlID0gdGhpcy5fX29uTWVzc2FnZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5zb2NrZXQub25lcnJvciA9IHRoaXMuX19vbkVycm9yLmJpbmQodGhpcylcbiAgICB0aGlzLnNvY2tldC5vbmNsb3NlID0gdGhpcy5fX29uQ2xvc2UuYmluZCh0aGlzKVxuICB9LFxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIHRyYW5zcG9ydCBjb25uZWN0aW9uXG4gICAqL1xuICBjbG9zZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc29ja2V0LmNsb3NlKClcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3BlY2lmaWVkIG51bWJlciBvZiBjaGFyYWN0ZXJzIGZyb20gdGhlIHJlc3BvbnNlXG4gICAqIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIFRoZSBudW1iZXIgb2YgY2hhcmFjdGVycyB0byByZXR1cm4uXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IENoYXJhY3RlcnMgc2VudCBieSB0aGUgc2VydmVyLlxuICAgKi9cbiAgcmVhZDogZnVuY3Rpb24gKGxlbikge1xuICAgIHZhciBhdmFpbCA9IHRoaXMud3BvcyAtIHRoaXMucnBvc1xuXG4gICAgaWYgKGF2YWlsID09PSAwKSB7XG4gICAgICByZXR1cm4gXCJcIlxuICAgIH1cblxuICAgIHZhciBnaXZlID0gbGVuXG5cbiAgICBpZiAoYXZhaWwgPCBsZW4pIHtcbiAgICAgIGdpdmUgPSBhdmFpbFxuICAgIH1cblxuICAgIHZhciByZXQgPSB0aGlzLnJlYWRfYnVmLnN1YnN0cih0aGlzLnJwb3MsIGdpdmUpXG4gICAgdGhpcy5ycG9zICs9IGdpdmVcblxuICAgIC8vIGNsZWFyIGJ1ZiB3aGVuIGNvbXBsZXRlP1xuICAgIHJldHVybiByZXRcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZW50aXJlIHJlc3BvbnNlIGJ1ZmZlci5cbiAgICogQHJldHVybnMge3N0cmluZ30gQ2hhcmFjdGVycyBzZW50IGJ5IHRoZSBzZXJ2ZXIuXG4gICAqL1xuICByZWFkQWxsOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVjdl9idWZcbiAgfSxcblxuICAvKipcbiAgICogU2V0cyB0aGUgc2VuZCBidWZmZXIgdG8gYnVmLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYnVmIC0gVGhlIGJ1ZmZlciB0byBzZW5kLlxuICAgKi9cbiAgd3JpdGU6IGZ1bmN0aW9uIChidWYpIHtcbiAgICB0aGlzLnNlbmRfYnVmID0gYnVmXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNlbmQgYnVmZmVyLlxuICAgKiBAcmVhZG9ubHlcbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIHNlbmQgYnVmZmVyLlxuICAgKi9cbiAgZ2V0U2VuZEJ1ZmZlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnNlbmRfYnVmXG4gIH1cblxufVxuXG4vKipcbiogSW5pdGlhbGl6ZXMgYSBUaHJpZnQgSlNPTiBwcm90b2NvbCBpbnN0YW5jZS5cbiogQGNvbnN0cnVjdG9yXG4qIEBwYXJhbSB7VGhyaWZ0LlRyYW5zcG9ydH0gdHJhbnNwb3J0IC0gVGhlIHRyYW5zcG9ydCB0byBzZXJpYWxpemUgdG8vZnJvbS5cbiogQGNsYXNzZGVzYyBBcGFjaGUgVGhyaWZ0IFByb3RvY29scyBwZXJmb3JtIHNlcmlhbGl6YXRpb24gd2hpY2ggZW5hYmxlcyBjcm9zc1xuKiBsYW5ndWFnZSBSUEMuIFRoZSBQcm90b2NvbCB0eXBlIGlzIHRoZSBKYXZhU2NyaXB0IGJyb3dzZXIgaW1wbGVtZW50YXRpb25cbiogb2YgdGhlIEFwYWNoZSBUaHJpZnQgVEpTT05Qcm90b2NvbC5cbiogQGV4YW1wbGVcbiogICAgIHZhciBwcm90b2NvbCAgPSBuZXcgVGhyaWZ0LlByb3RvY29sKHRyYW5zcG9ydCk7XG4qL1xuVGhyaWZ0LlRKU09OUHJvdG9jb2wgPSBUaHJpZnQuUHJvdG9jb2wgPSBmdW5jdGlvbiAodHJhbnNwb3J0KSB7XG4gIHRoaXMudHN0YWNrID0gW11cbiAgdGhpcy50cG9zID0gW11cbiAgdGhpcy50cmFuc3BvcnQgPSB0cmFuc3BvcnRcbn1cblxuLyoqXG4qIFRocmlmdCBJREwgdHlwZSBJZCB0byBzdHJpbmcgbWFwcGluZy5cbiogQHJlYWRvbmx5XG4qIEBzZWUge0BsaW5rIFRocmlmdC5UeXBlfVxuKi9cblRocmlmdC5Qcm90b2NvbC5UeXBlID0ge31cblRocmlmdC5Qcm90b2NvbC5UeXBlW1RocmlmdC5UeXBlLkJPT0xdID0gXCJcXFwidGZcXFwiXCJcblRocmlmdC5Qcm90b2NvbC5UeXBlW1RocmlmdC5UeXBlLkJZVEVdID0gXCJcXFwiaThcXFwiXCJcblRocmlmdC5Qcm90b2NvbC5UeXBlW1RocmlmdC5UeXBlLkkxNl0gPSBcIlxcXCJpMTZcXFwiXCJcblRocmlmdC5Qcm90b2NvbC5UeXBlW1RocmlmdC5UeXBlLkkzMl0gPSBcIlxcXCJpMzJcXFwiXCJcblRocmlmdC5Qcm90b2NvbC5UeXBlW1RocmlmdC5UeXBlLkk2NF0gPSBcIlxcXCJpNjRcXFwiXCJcblRocmlmdC5Qcm90b2NvbC5UeXBlW1RocmlmdC5UeXBlLkRPVUJMRV0gPSBcIlxcXCJkYmxcXFwiXCJcblRocmlmdC5Qcm90b2NvbC5UeXBlW1RocmlmdC5UeXBlLlNUUlVDVF0gPSBcIlxcXCJyZWNcXFwiXCJcblRocmlmdC5Qcm90b2NvbC5UeXBlW1RocmlmdC5UeXBlLlNUUklOR10gPSBcIlxcXCJzdHJcXFwiXCJcblRocmlmdC5Qcm90b2NvbC5UeXBlW1RocmlmdC5UeXBlLk1BUF0gPSBcIlxcXCJtYXBcXFwiXCJcblRocmlmdC5Qcm90b2NvbC5UeXBlW1RocmlmdC5UeXBlLkxJU1RdID0gXCJcXFwibHN0XFxcIlwiXG5UaHJpZnQuUHJvdG9jb2wuVHlwZVtUaHJpZnQuVHlwZS5TRVRdID0gXCJcXFwic2V0XFxcIlwiXG5cbi8qKlxuKiBUaHJpZnQgSURMIHR5cGUgc3RyaW5nIHRvIElkIG1hcHBpbmcuXG4qIEByZWFkb25seVxuKiBAc2VlIHtAbGluayBUaHJpZnQuVHlwZX1cbiovXG5UaHJpZnQuUHJvdG9jb2wuUlR5cGUgPSB7fVxuVGhyaWZ0LlByb3RvY29sLlJUeXBlLnRmID0gVGhyaWZ0LlR5cGUuQk9PTFxuVGhyaWZ0LlByb3RvY29sLlJUeXBlLmk4ID0gVGhyaWZ0LlR5cGUuQllURVxuVGhyaWZ0LlByb3RvY29sLlJUeXBlLmkxNiA9IFRocmlmdC5UeXBlLkkxNlxuVGhyaWZ0LlByb3RvY29sLlJUeXBlLmkzMiA9IFRocmlmdC5UeXBlLkkzMlxuVGhyaWZ0LlByb3RvY29sLlJUeXBlLmk2NCA9IFRocmlmdC5UeXBlLkk2NFxuVGhyaWZ0LlByb3RvY29sLlJUeXBlLmRibCA9IFRocmlmdC5UeXBlLkRPVUJMRVxuVGhyaWZ0LlByb3RvY29sLlJUeXBlLnJlYyA9IFRocmlmdC5UeXBlLlNUUlVDVFxuVGhyaWZ0LlByb3RvY29sLlJUeXBlLnN0ciA9IFRocmlmdC5UeXBlLlNUUklOR1xuVGhyaWZ0LlByb3RvY29sLlJUeXBlLm1hcCA9IFRocmlmdC5UeXBlLk1BUFxuVGhyaWZ0LlByb3RvY29sLlJUeXBlLmxzdCA9IFRocmlmdC5UeXBlLkxJU1RcblRocmlmdC5Qcm90b2NvbC5SVHlwZS5zZXQgPSBUaHJpZnQuVHlwZS5TRVRcblxuLyoqXG4qIFRoZSBUSlNPTlByb3RvY29sIHZlcnNpb24gbnVtYmVyLlxuKiBAcmVhZG9ubHlcbiogQGNvbnN0IHtudW1iZXJ9IFZlcnNpb25cbiogQG1lbWJlcm9mIFRocmlmdC5Qcm90b2NvbFxuKi9cblRocmlmdC5Qcm90b2NvbC5WZXJzaW9uID0gMVxuXG5UaHJpZnQuUHJvdG9jb2wucHJvdG90eXBlID0ge1xuICAvKipcbiAgICogUmV0dXJucyB0aGUgdW5kZXJseWluZyB0cmFuc3BvcnQuXG4gICAqIEByZWFkb25seVxuICAgKiBAcmV0dXJucyB7VGhyaWZ0LlRyYW5zcG9ydH0gVGhlIHVuZGVybHlpbmcgdHJhbnNwb3J0LlxuICAgKi9cbiAgZ2V0VHJhbnNwb3J0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNwb3J0XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZXMgdGhlIGJlZ2lubmluZyBvZiBhIFRocmlmdCBSUEMgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgc2VydmljZSBtZXRob2QgdG8gY2FsbC5cbiAgICogQHBhcmFtIHtUaHJpZnQuTWVzc2FnZVR5cGV9IG1lc3NhZ2VUeXBlIC0gVGhlIHR5cGUgb2YgbWV0aG9kIGNhbGwuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXFpZCAtIFRoZSBzZXF1ZW5jZSBudW1iZXIgb2YgdGhpcyBjYWxsIChhbHdheXMgMCBpbiBBcGFjaGUgVGhyaWZ0KS5cbiAgICovXG4gIHdyaXRlTWVzc2FnZUJlZ2luOiBmdW5jdGlvbiAobmFtZSwgbWVzc2FnZVR5cGUsIHNlcWlkKSB7XG4gICAgdGhpcy50c3RhY2sgPSBbXVxuICAgIHRoaXMudHBvcyA9IFtdXG5cbiAgICB0aGlzLnRzdGFjay5wdXNoKFtUaHJpZnQuUHJvdG9jb2wuVmVyc2lvbiwgXCJcXFwiXCIgK1xuICAgICAgICAgIG5hbWUgKyBcIlxcXCJcIiwgbWVzc2FnZVR5cGUsIHNlcWlkXSlcbiAgfSxcblxuICAvKipcbiAgICogU2VyaWFsaXplcyB0aGUgZW5kIG9mIGEgVGhyaWZ0IFJQQyBtZXNzYWdlLlxuICAgKi9cbiAgd3JpdGVNZXNzYWdlRW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9iaiA9IHRoaXMudHN0YWNrLnBvcCgpXG5cbiAgICB0aGlzLndvYmogPSB0aGlzLnRzdGFjay5wb3AoKVxuICAgIHRoaXMud29iai5wdXNoKG9iailcblxuICAgIHRoaXMud2J1ZiA9IFwiW1wiICsgdGhpcy53b2JqLmpvaW4oXCIsXCIpICsgXCJdXCJcblxuICAgIHRoaXMudHJhbnNwb3J0LndyaXRlKHRoaXMud2J1ZilcbiAgfSxcblxuICAvKipcbiAgICogU2VyaWFsaXplcyB0aGUgYmVnaW5uaW5nIG9mIGEgc3RydWN0LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzdHJ1Y3QuXG4gICAqL1xuICB3cml0ZVN0cnVjdEJlZ2luOiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRoaXMudHBvcy5wdXNoKHRoaXMudHN0YWNrLmxlbmd0aClcbiAgICB0aGlzLnRzdGFjay5wdXNoKHt9KVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIHRoZSBlbmQgb2YgYSBzdHJ1Y3QuXG4gICAqL1xuICB3cml0ZVN0cnVjdEVuZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwID0gdGhpcy50cG9zLnBvcCgpXG4gICAgdmFyIHN0cnVjdCA9IHRoaXMudHN0YWNrW3BdXG4gICAgdmFyIHN0ciA9IFwie1wiXG4gICAgdmFyIGZpcnN0ID0gdHJ1ZVxuICAgIGZvciAodmFyIGtleSBpbiBzdHJ1Y3QpIHtcbiAgICAgIGlmIChmaXJzdCkge1xuICAgICAgICBmaXJzdCA9IGZhbHNlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgKz0gXCIsXCJcbiAgICAgIH1cblxuICAgICAgc3RyICs9IGtleSArIFwiOlwiICsgc3RydWN0W2tleV1cbiAgICB9XG5cbiAgICBzdHIgKz0gXCJ9XCJcbiAgICB0aGlzLnRzdGFja1twXSA9IHN0clxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIHRoZSBiZWdpbm5pbmcgb2YgYSBzdHJ1Y3QgZmllbGQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGZpZWxkLlxuICAgKiBAcGFyYW0ge1RocmlmdC5Qcm90b2NvbC5UeXBlfSBmaWVsZFR5cGUgLSBUaGUgZGF0YSB0eXBlIG9mIHRoZSBmaWVsZC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGZpZWxkSWQgLSBUaGUgZmllbGQncyB1bmlxdWUgaWRlbnRpZmllci5cbiAgICovXG4gIHdyaXRlRmllbGRCZWdpbjogZnVuY3Rpb24gKG5hbWUsIGZpZWxkVHlwZSwgZmllbGRJZCkge1xuICAgIHRoaXMudHBvcy5wdXNoKHRoaXMudHN0YWNrLmxlbmd0aClcbiAgICB0aGlzLnRzdGFjay5wdXNoKHsgXCJmaWVsZElkXCI6IFwiXFxcIlwiICtcbiAgICAgICAgICBmaWVsZElkICsgXCJcXFwiXCIsXG4gICAgXCJmaWVsZFR5cGVcIjogVGhyaWZ0LlByb3RvY29sLlR5cGVbZmllbGRUeXBlXVxuICAgIH0pXG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZXMgdGhlIGVuZCBvZiBhIGZpZWxkLlxuICAgKi9cbiAgd3JpdGVGaWVsZEVuZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IHRoaXMudHN0YWNrLnBvcCgpXG4gICAgdmFyIGZpZWxkSW5mbyA9IHRoaXMudHN0YWNrLnBvcCgpXG5cbiAgICB0aGlzLnRzdGFja1t0aGlzLnRzdGFjay5sZW5ndGggLSAxXVtmaWVsZEluZm8uZmllbGRJZF0gPSBcIntcIiArXG4gICAgICAgICAgZmllbGRJbmZvLmZpZWxkVHlwZSArIFwiOlwiICsgdmFsdWUgKyBcIn1cIlxuICAgIHRoaXMudHBvcy5wb3AoKVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIHRoZSBlbmQgb2YgdGhlIHNldCBvZiBmaWVsZHMgZm9yIGEgc3RydWN0LlxuICAgKi9cbiAgd3JpdGVGaWVsZFN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBuYVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIHRoZSBiZWdpbm5pbmcgb2YgYSBtYXAgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIHtUaHJpZnQuVHlwZX0ga2V5VHlwZSAtIFRoZSBkYXRhIHR5cGUgb2YgdGhlIGtleS5cbiAgICogQHBhcmFtIHtUaHJpZnQuVHlwZX0gdmFsVHlwZSAtIFRoZSBkYXRhIHR5cGUgb2YgdGhlIHZhbHVlLlxuICAgKiBAcGFyYW0ge251bWJlcn0gW3NpemVdIC0gVGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgbWFwIChpZ25vcmVkKS5cbiAgICovXG4gIHdyaXRlTWFwQmVnaW46IGZ1bmN0aW9uIChrZXlUeXBlLCB2YWxUeXBlLCBzaXplKSB7XG4gICAgdGhpcy50cG9zLnB1c2godGhpcy50c3RhY2subGVuZ3RoKVxuICAgIHRoaXMudHN0YWNrLnB1c2goW1RocmlmdC5Qcm90b2NvbC5UeXBlW2tleVR5cGVdLFxuICAgICAgVGhyaWZ0LlByb3RvY29sLlR5cGVbdmFsVHlwZV0sIDBdKVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIHRoZSBlbmQgb2YgYSBtYXAuXG4gICAqL1xuICB3cml0ZU1hcEVuZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwID0gdGhpcy50cG9zLnBvcCgpXG5cbiAgICBpZiAocCA9PSB0aGlzLnRzdGFjay5sZW5ndGgpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICgodGhpcy50c3RhY2subGVuZ3RoIC0gcCAtIDEpICUgMiAhPT0gMCkge1xuICAgICAgdGhpcy50c3RhY2sucHVzaChcIlwiKVxuICAgIH1cblxuICAgIHZhciBzaXplID0gKHRoaXMudHN0YWNrLmxlbmd0aCAtIHAgLSAxKSAvIDJcblxuICAgIHRoaXMudHN0YWNrW3BdW3RoaXMudHN0YWNrW3BdLmxlbmd0aCAtIDFdID0gc2l6ZVxuXG4gICAgdmFyIG1hcCA9IFwifVwiXG4gICAgdmFyIGZpcnN0ID0gdHJ1ZVxuICAgIHdoaWxlICh0aGlzLnRzdGFjay5sZW5ndGggPiBwICsgMSkge1xuICAgICAgdmFyIHYgPSB0aGlzLnRzdGFjay5wb3AoKVxuICAgICAgdmFyIGsgPSB0aGlzLnRzdGFjay5wb3AoKVxuICAgICAgaWYgKGZpcnN0KSB7XG4gICAgICAgIGZpcnN0ID0gZmFsc2VcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1hcCA9IFwiLFwiICsgbWFwXG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaykpIHsgayA9IFwiXFxcIlwiICsgayArIFwiXFxcIlwiIH0gLy8ganNvbiBcImtleXNcIiBuZWVkIHRvIGJlIHN0cmluZ3NcbiAgICAgIG1hcCA9IGsgKyBcIjpcIiArIHYgKyBtYXBcbiAgICB9XG4gICAgbWFwID0gXCJ7XCIgKyBtYXBcblxuICAgIHRoaXMudHN0YWNrW3BdLnB1c2gobWFwKVxuICAgIHRoaXMudHN0YWNrW3BdID0gXCJbXCIgKyB0aGlzLnRzdGFja1twXS5qb2luKFwiLFwiKSArIFwiXVwiXG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZXMgdGhlIGJlZ2lubmluZyBvZiBhIGxpc3QgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIHtUaHJpZnQuVHlwZX0gZWxlbVR5cGUgLSBUaGUgZGF0YSB0eXBlIG9mIHRoZSBlbGVtZW50cy5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHNpemUgLSBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSBsaXN0LlxuICAgKi9cbiAgd3JpdGVMaXN0QmVnaW46IGZ1bmN0aW9uIChlbGVtVHlwZSwgc2l6ZSkge1xuICAgIHRoaXMudHBvcy5wdXNoKHRoaXMudHN0YWNrLmxlbmd0aClcbiAgICB0aGlzLnRzdGFjay5wdXNoKFtUaHJpZnQuUHJvdG9jb2wuVHlwZVtlbGVtVHlwZV0sIHNpemVdKVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIHRoZSBlbmQgb2YgYSBsaXN0LlxuICAgKi9cbiAgd3JpdGVMaXN0RW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHAgPSB0aGlzLnRwb3MucG9wKClcblxuICAgIHdoaWxlICh0aGlzLnRzdGFjay5sZW5ndGggPiBwICsgMSkge1xuICAgICAgdmFyIHRtcFZhbCA9IHRoaXMudHN0YWNrW3AgKyAxXVxuICAgICAgdGhpcy50c3RhY2suc3BsaWNlKHAgKyAxLCAxKVxuICAgICAgdGhpcy50c3RhY2tbcF0ucHVzaCh0bXBWYWwpXG4gICAgfVxuXG4gICAgdGhpcy50c3RhY2tbcF0gPSBcIltcIiArIHRoaXMudHN0YWNrW3BdLmpvaW4oXCIsXCIpICsgXCJdXCJcbiAgfSxcblxuICAvKipcbiAgICogU2VyaWFsaXplcyB0aGUgYmVnaW5uaW5nIG9mIGEgc2V0IGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSB7VGhyaWZ0LlR5cGV9IGVsZW1UeXBlIC0gVGhlIGRhdGEgdHlwZSBvZiB0aGUgZWxlbWVudHMuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzaXplIC0gVGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgbGlzdC5cbiAgICovXG4gIHdyaXRlU2V0QmVnaW46IGZ1bmN0aW9uIChlbGVtVHlwZSwgc2l6ZSkge1xuICAgIHRoaXMudHBvcy5wdXNoKHRoaXMudHN0YWNrLmxlbmd0aClcbiAgICB0aGlzLnRzdGFjay5wdXNoKFtUaHJpZnQuUHJvdG9jb2wuVHlwZVtlbGVtVHlwZV0sIHNpemVdKVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIHRoZSBlbmQgb2YgYSBzZXQuXG4gICAqL1xuICB3cml0ZVNldEVuZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwID0gdGhpcy50cG9zLnBvcCgpXG5cbiAgICB3aGlsZSAodGhpcy50c3RhY2subGVuZ3RoID4gcCArIDEpIHtcbiAgICAgIHZhciB0bXBWYWwgPSB0aGlzLnRzdGFja1twICsgMV1cbiAgICAgIHRoaXMudHN0YWNrLnNwbGljZShwICsgMSwgMSlcbiAgICAgIHRoaXMudHN0YWNrW3BdLnB1c2godG1wVmFsKVxuICAgIH1cblxuICAgIHRoaXMudHN0YWNrW3BdID0gXCJbXCIgKyB0aGlzLnRzdGFja1twXS5qb2luKFwiLFwiKSArIFwiXVwiXG4gIH0sXG5cbiAgLyoqIFNlcmlhbGl6ZXMgYSBib29sZWFuICovXG4gIHdyaXRlQm9vbDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdGhpcy50c3RhY2sucHVzaCh2YWx1ZSA/IDEgOiAwKVxuICB9LFxuXG4gIC8qKiBTZXJpYWxpemVzIGEgbnVtYmVyICovXG4gIHdyaXRlQnl0ZTogZnVuY3Rpb24gKGk4KSB7XG4gICAgdGhpcy50c3RhY2sucHVzaChpOClcbiAgfSxcblxuICAvKiogU2VyaWFsaXplcyBhIG51bWJlciAqL1xuICB3cml0ZUkxNjogZnVuY3Rpb24gKGkxNikge1xuICAgIHRoaXMudHN0YWNrLnB1c2goaTE2KVxuICB9LFxuXG4gIC8qKiBTZXJpYWxpemVzIGEgbnVtYmVyICovXG4gIHdyaXRlSTMyOiBmdW5jdGlvbiAoaTMyKSB7XG4gICAgdGhpcy50c3RhY2sucHVzaChpMzIpXG4gIH0sXG5cbiAgLyoqIFNlcmlhbGl6ZXMgYSBudW1iZXIgKi9cbiAgd3JpdGVJNjQ6IGZ1bmN0aW9uIChpNjQpIHtcbiAgICB0aGlzLnRzdGFjay5wdXNoKGk2NClcbiAgfSxcblxuICAvKiogU2VyaWFsaXplcyBhIG51bWJlciAqL1xuICB3cml0ZURvdWJsZTogZnVuY3Rpb24gKGRibCkge1xuICAgIHRoaXMudHN0YWNrLnB1c2goZGJsKVxuICB9LFxuXG4gIC8qKiBTZXJpYWxpemVzIGEgc3RyaW5nICovXG4gIHdyaXRlU3RyaW5nOiBmdW5jdGlvbiAoc3RyKSB7XG4gICAgLy8gV2UgZG8gbm90IGVuY29kZSB1cmkgY29tcG9uZW50cyBmb3Igd2lyZSB0cmFuc2ZlcjpcbiAgICBpZiAoc3RyID09PSBudWxsKSB7XG4gICAgICB0aGlzLnRzdGFjay5wdXNoKG51bGwpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNvbmNhdCBtYXkgYmUgc2xvd2VyIHRoYW4gYnVpbGRpbmcgYSBieXRlIGJ1ZmZlclxuICAgICAgdmFyIGVzY2FwZWRTdHJpbmcgPSBcIlwiXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2ggPSBzdHIuY2hhckF0KGkpIC8vIGEgc2luZ2xlIGRvdWJsZSBxdW90ZTogXCJcbiAgICAgICAgaWYgKGNoID09PSBcIlxcXCJcIikge1xuICAgICAgICAgIGVzY2FwZWRTdHJpbmcgKz0gXCJcXFxcXFxcIlwiIC8vIHdyaXRlIG91dCBhczogXFxcIlxuICAgICAgICB9IGVsc2UgaWYgKGNoID09PSBcIlxcXFxcIikgeyAvLyBhIHNpbmdsZSBiYWNrc2xhc2hcbiAgICAgICAgICBlc2NhcGVkU3RyaW5nICs9IFwiXFxcXFxcXFxcIiAvLyB3cml0ZSBvdXQgYXMgZG91YmxlIGJhY2tzbGFzaFxuICAgICAgICB9IGVsc2UgaWYgKGNoID09PSBcIlxcYlwiKSB7IC8vIGEgc2luZ2xlIGJhY2tzcGFjZTogaW52aXNpYmxlXG4gICAgICAgICAgZXNjYXBlZFN0cmluZyArPSBcIlxcXFxiXCIgLy8gd3JpdGUgb3V0IGFzOiBcXGJcIlxuICAgICAgICB9IGVsc2UgaWYgKGNoID09PSBcIlxcZlwiKSB7IC8vIGEgc2luZ2xlIGZvcm1mZWVkOiBpbnZpc2libGVcbiAgICAgICAgICBlc2NhcGVkU3RyaW5nICs9IFwiXFxcXGZcIiAvLyB3cml0ZSBvdXQgYXM6IFxcZlwiXG4gICAgICAgIH0gZWxzZSBpZiAoY2ggPT09IFwiXFxuXCIpIHsgLy8gYSBzaW5nbGUgbmV3bGluZTogaW52aXNpYmxlXG4gICAgICAgICAgZXNjYXBlZFN0cmluZyArPSBcIlxcXFxuXCIgLy8gd3JpdGUgb3V0IGFzOiBcXG5cIlxuICAgICAgICB9IGVsc2UgaWYgKGNoID09PSBcIlxcclwiKSB7IC8vIGEgc2luZ2xlIHJldHVybjogaW52aXNpYmxlXG4gICAgICAgICAgZXNjYXBlZFN0cmluZyArPSBcIlxcXFxyXCIgLy8gd3JpdGUgb3V0IGFzOiBcXHJcIlxuICAgICAgICB9IGVsc2UgaWYgKGNoID09PSBcIlxcdFwiKSB7IC8vIGEgc2luZ2xlIHRhYjogaW52aXNpYmxlXG4gICAgICAgICAgZXNjYXBlZFN0cmluZyArPSBcIlxcXFx0XCIgLy8gd3JpdGUgb3V0IGFzOiBcXHRcIlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVzY2FwZWRTdHJpbmcgKz0gY2ggLy8gRWxzZSBpdCBuZWVkIG5vdCBiZSBlc2NhcGVkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMudHN0YWNrLnB1c2goXCJcXFwiXCIgKyBlc2NhcGVkU3RyaW5nICsgXCJcXFwiXCIpXG4gICAgfVxuICB9LFxuXG4gIC8qKiBTZXJpYWxpemVzIGEgc3RyaW5nICovXG4gIHdyaXRlQmluYXJ5OiBmdW5jdGlvbiAoYmluYXJ5KSB7XG4gICAgdmFyIHN0ciA9IFwiXCJcbiAgICBpZiAodHlwZW9mIGJpbmFyeSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgc3RyID0gYmluYXJ5XG4gICAgfSBlbHNlIGlmIChiaW5hcnkgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICB2YXIgYXJyID0gYmluYXJ5XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7ICsraSkge1xuICAgICAgICBzdHIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShhcnJbaV0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJ3cml0ZUJpbmFyeSBvbmx5IGFjY2VwdHMgU3RyaW5nIG9yIFVpbnQ4QXJyYXkuXCIpXG4gICAgfVxuICAgIHRoaXMudHN0YWNrLnB1c2goXCJcXFwiXCIgKyBidG9hKHN0cikgKyBcIlxcXCJcIilcbiAgfSxcblxuICAvKipcbiAgICAgQGNsYXNzXG4gICAgIEBuYW1lIEFub25SZWFkTWVzc2FnZUJlZ2luUmV0dXJuXG4gICAgIEBwcm9wZXJ0eSB7c3RyaW5nfSBmbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzZXJ2aWNlIG1ldGhvZC5cbiAgICAgQHByb3BlcnR5IHtUaHJpZnQuTWVzc2FnZVR5cGV9IG10eXBlIC0gVGhlIHR5cGUgb2YgbWVzc2FnZSBjYWxsLlxuICAgICBAcHJvcGVydHkge251bWJlcn0gcnNlcWlkIC0gVGhlIHNlcXVlbmNlIG51bWJlciBvZiB0aGUgbWVzc2FnZSAoMCBpbiBUaHJpZnQgUlBDKS5cbiAgICovXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZXMgdGhlIGJlZ2lubmluZyBvZiBhIG1lc3NhZ2UuXG4gICAqIEByZXR1cm5zIHtBbm9uUmVhZE1lc3NhZ2VCZWdpblJldHVybn1cbiAgICovXG4gIHJlYWRNZXNzYWdlQmVnaW46IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJzdGFjayA9IFtdXG4gICAgdGhpcy5ycG9zID0gW11cblxuICAgIGlmICh0eXBlb2YgSlNPTiAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgSlNPTi5wYXJzZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLnJvYmogPSBKU09OLnBhcnNlKHRoaXMudHJhbnNwb3J0LnJlYWRBbGwoKSlcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBqUXVlcnkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMucm9iaiA9IGpRdWVyeS5wYXJzZUpTT04odGhpcy50cmFuc3BvcnQucmVhZEFsbCgpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJvYmogPSBldmFsKHRoaXMudHJhbnNwb3J0LnJlYWRBbGwoKSlcbiAgICB9XG5cbiAgICB2YXIgciA9IHt9XG4gICAgdmFyIHZlcnNpb24gPSB0aGlzLnJvYmouc2hpZnQoKVxuXG4gICAgaWYgKHZlcnNpb24gIT0gVGhyaWZ0LlByb3RvY29sLlZlcnNpb24pIHtcbiAgICAgIHRocm93IFwiV3JvbmcgdGhyaWZ0IHByb3RvY29sIHZlcnNpb246IFwiICsgdmVyc2lvblxuICAgIH1cblxuICAgIHIuZm5hbWUgPSB0aGlzLnJvYmouc2hpZnQoKVxuICAgIHIubXR5cGUgPSB0aGlzLnJvYmouc2hpZnQoKVxuICAgIHIucnNlcWlkID0gdGhpcy5yb2JqLnNoaWZ0KClcblxuICAgIC8vIGdldCB0byB0aGUgbWFpbiBvYmpcbiAgICB0aGlzLnJzdGFjay5wdXNoKHRoaXMucm9iai5zaGlmdCgpKVxuXG4gICAgcmV0dXJuIHJcbiAgfSxcblxuICAvKiogRGVzZXJpYWxpemVzIHRoZSBlbmQgb2YgYSBtZXNzYWdlLiAqL1xuICByZWFkTWVzc2FnZUVuZDogZnVuY3Rpb24gKCkge1xuICB9LFxuXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZXMgdGhlIGJlZ2lubmluZyBvZiBhIHN0cnVjdC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtuYW1lXSAtIFRoZSBuYW1lIG9mIHRoZSBzdHJ1Y3QgKGlnbm9yZWQpXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IC0gQW4gb2JqZWN0IHdpdGggYW4gZW1wdHkgc3RyaW5nIGZuYW1lIHByb3BlcnR5XG4gICAqL1xuICByZWFkU3RydWN0QmVnaW46IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIHIgPSB7fVxuICAgIHIuZm5hbWUgPSBcIlwiXG5cbiAgICAvLyBpbmNhc2UgdGhpcyBpcyBhbiBhcnJheSBvZiBzdHJ1Y3RzXG4gICAgaWYgKHRoaXMucnN0YWNrW3RoaXMucnN0YWNrLmxlbmd0aCAtIDFdIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHRoaXMucnN0YWNrLnB1c2godGhpcy5yc3RhY2tbdGhpcy5yc3RhY2subGVuZ3RoIC0gMV0uc2hpZnQoKSlcbiAgICB9XG5cbiAgICByZXR1cm4gclxuICB9LFxuXG4gIC8qKiBEZXNlcmlhbGl6ZXMgdGhlIGVuZCBvZiBhIHN0cnVjdC4gKi9cbiAgcmVhZFN0cnVjdEVuZDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnJzdGFja1t0aGlzLnJzdGFjay5sZW5ndGggLSAyXSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICB0aGlzLnJzdGFjay5wb3AoKVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICAgQGNsYXNzXG4gICAgIEBuYW1lIEFub25SZWFkRmllbGRCZWdpblJldHVyblxuICAgICBAcHJvcGVydHkge3N0cmluZ30gZm5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZmllbGQgKGFsd2F5cyAnJykuXG4gICAgIEBwcm9wZXJ0eSB7VGhyaWZ0LlR5cGV9IGZ0eXBlIC0gVGhlIGRhdGEgdHlwZSBvZiB0aGUgZmllbGQuXG4gICAgIEBwcm9wZXJ0eSB7bnVtYmVyfSBmaWQgLSBUaGUgdW5pcXVlIGlkZW50aWZpZXIgb2YgdGhlIGZpZWxkLlxuICAgKi9cbiAgLyoqXG4gICAqIERlc2VyaWFsaXplcyB0aGUgYmVnaW5uaW5nIG9mIGEgZmllbGQuXG4gICAqIEByZXR1cm5zIHtBbm9uUmVhZEZpZWxkQmVnaW5SZXR1cm59XG4gICAqL1xuICByZWFkRmllbGRCZWdpbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciByID0ge31cblxuICAgIHZhciBmaWQgPSAtMVxuICAgIHZhciBmdHlwZSA9IFRocmlmdC5UeXBlLlNUT1BcblxuICAgIC8vIGdldCBhIGZpZWxkSWRcbiAgICBmb3IgKHZhciBmIGluICh0aGlzLnJzdGFja1t0aGlzLnJzdGFjay5sZW5ndGggLSAxXSkpIHtcbiAgICAgIGlmIChmID09PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIGZpZCA9IHBhcnNlSW50KGYsIDEwKVxuICAgICAgdGhpcy5ycG9zLnB1c2godGhpcy5yc3RhY2subGVuZ3RoKVxuXG4gICAgICB2YXIgZmllbGQgPSB0aGlzLnJzdGFja1t0aGlzLnJzdGFjay5sZW5ndGggLSAxXVtmaWRdXG5cbiAgICAgIC8vIHJlbW92ZSBzbyB3ZSBkb24ndCBzZWUgaXQgYWdhaW5cbiAgICAgIGRlbGV0ZSB0aGlzLnJzdGFja1t0aGlzLnJzdGFjay5sZW5ndGggLSAxXVtmaWRdXG5cbiAgICAgIHRoaXMucnN0YWNrLnB1c2goZmllbGQpXG5cbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgaWYgKGZpZCAhPSAtMSkge1xuICAgICAgLy8gc2hvdWxkIG9ubHkgYmUgMSBvZiB0aGVzZSBidXQgdGhpcyBpcyB0aGUgb25seVxuICAgICAgLy8gd2F5IHRvIG1hdGNoIGEga2V5XG4gICAgICBmb3IgKHZhciBpIGluICh0aGlzLnJzdGFja1t0aGlzLnJzdGFjay5sZW5ndGggLSAxXSkpIHtcbiAgICAgICAgaWYgKFRocmlmdC5Qcm90b2NvbC5SVHlwZVtpXSA9PT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBmdHlwZSA9IFRocmlmdC5Qcm90b2NvbC5SVHlwZVtpXVxuICAgICAgICB0aGlzLnJzdGFja1t0aGlzLnJzdGFjay5sZW5ndGggLSAxXSA9XG4gICAgICAgICAgICAgICAgICB0aGlzLnJzdGFja1t0aGlzLnJzdGFjay5sZW5ndGggLSAxXVtpXVxuICAgICAgfVxuICAgIH1cblxuICAgIHIuZm5hbWUgPSBcIlwiXG4gICAgci5mdHlwZSA9IGZ0eXBlXG4gICAgci5maWQgPSBmaWRcblxuICAgIHJldHVybiByXG4gIH0sXG5cbiAgLyoqIERlc2VyaWFsaXplcyB0aGUgZW5kIG9mIGEgZmllbGQuICovXG4gIHJlYWRGaWVsZEVuZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwb3MgPSB0aGlzLnJwb3MucG9wKClcblxuICAgIC8vIGdldCBiYWNrIHRvIHRoZSByaWdodCBwbGFjZSBpbiB0aGUgc3RhY2tcbiAgICB3aGlsZSAodGhpcy5yc3RhY2subGVuZ3RoID4gcG9zKSB7XG4gICAgICB0aGlzLnJzdGFjay5wb3AoKVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICAgQGNsYXNzXG4gICAgIEBuYW1lIEFub25SZWFkTWFwQmVnaW5SZXR1cm5cbiAgICAgQHByb3BlcnR5IHtUaHJpZnQuVHlwZX0ga3R5cGUgLSBUaGUgZGF0YSB0eXBlIG9mIHRoZSBrZXkuXG4gICAgIEBwcm9wZXJ0eSB7VGhyaWZ0LlR5cGV9IHZ0eXBlIC0gVGhlIGRhdGEgdHlwZSBvZiB0aGUgdmFsdWUuXG4gICAgIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaXplIC0gVGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgbWFwLlxuICAgKi9cbiAgLyoqXG4gICAqIERlc2VyaWFsaXplcyB0aGUgYmVnaW5uaW5nIG9mIGEgbWFwLlxuICAgKiBAcmV0dXJucyB7QW5vblJlYWRNYXBCZWdpblJldHVybn1cbiAgICovXG4gIHJlYWRNYXBCZWdpbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBtYXAgPSB0aGlzLnJzdGFjay5wb3AoKVxuICAgIHZhciBmaXJzdCA9IG1hcC5zaGlmdCgpXG4gICAgaWYgKGZpcnN0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHRoaXMucnN0YWNrLnB1c2gobWFwKVxuICAgICAgbWFwID0gZmlyc3RcbiAgICAgIGZpcnN0ID0gbWFwLnNoaWZ0KClcbiAgICB9XG5cbiAgICB2YXIgciA9IHt9XG4gICAgci5rdHlwZSA9IFRocmlmdC5Qcm90b2NvbC5SVHlwZVtmaXJzdF1cbiAgICByLnZ0eXBlID0gVGhyaWZ0LlByb3RvY29sLlJUeXBlW21hcC5zaGlmdCgpXVxuICAgIHIuc2l6ZSA9IG1hcC5zaGlmdCgpXG5cbiAgICB0aGlzLnJwb3MucHVzaCh0aGlzLnJzdGFjay5sZW5ndGgpXG4gICAgdGhpcy5yc3RhY2sucHVzaChtYXAuc2hpZnQoKSlcblxuICAgIHJldHVybiByXG4gIH0sXG5cbiAgLyoqIERlc2VyaWFsaXplcyB0aGUgZW5kIG9mIGEgbWFwLiAqL1xuICByZWFkTWFwRW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZWFkRmllbGRFbmQoKVxuICB9LFxuXG4gIC8qKlxuICAgICBAY2xhc3NcbiAgICAgQG5hbWUgQW5vblJlYWRDb2xCZWdpblJldHVyblxuICAgICBAcHJvcGVydHkge1RocmlmdC5UeXBlfSBldHlwZSAtIFRoZSBkYXRhIHR5cGUgb2YgdGhlIGVsZW1lbnQuXG4gICAgIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaXplIC0gVGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICovXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZXMgdGhlIGJlZ2lubmluZyBvZiBhIGxpc3QuXG4gICAqIEByZXR1cm5zIHtBbm9uUmVhZENvbEJlZ2luUmV0dXJufVxuICAgKi9cbiAgcmVhZExpc3RCZWdpbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBsaXN0ID0gdGhpcy5yc3RhY2tbdGhpcy5yc3RhY2subGVuZ3RoIC0gMV1cblxuICAgIHZhciByID0ge31cbiAgICByLmV0eXBlID0gVGhyaWZ0LlByb3RvY29sLlJUeXBlW2xpc3Quc2hpZnQoKV1cbiAgICByLnNpemUgPSBsaXN0LnNoaWZ0KClcblxuICAgIHRoaXMucnBvcy5wdXNoKHRoaXMucnN0YWNrLmxlbmd0aClcbiAgICB0aGlzLnJzdGFjay5wdXNoKGxpc3Quc2hpZnQoKSlcblxuICAgIHJldHVybiByXG4gIH0sXG5cbiAgLyoqIERlc2VyaWFsaXplcyB0aGUgZW5kIG9mIGEgbGlzdC4gKi9cbiAgcmVhZExpc3RFbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlYWRGaWVsZEVuZCgpXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlc2VyaWFsaXplcyB0aGUgYmVnaW5uaW5nIG9mIGEgc2V0LlxuICAgKiBAcmV0dXJucyB7QW5vblJlYWRDb2xCZWdpblJldHVybn1cbiAgICovXG4gIHJlYWRTZXRCZWdpbjogZnVuY3Rpb24gKGVsZW1UeXBlLCBzaXplKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZExpc3RCZWdpbihlbGVtVHlwZSwgc2l6ZSlcbiAgfSxcblxuICAvKiogRGVzZXJpYWxpemVzIHRoZSBlbmQgb2YgYSBzZXQuICovXG4gIHJlYWRTZXRFbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkTGlzdEVuZCgpXG4gIH0sXG5cbiAgLyoqIFJldHVybnMgYW4gb2JqZWN0IHdpdGggYSB2YWx1ZSBwcm9wZXJ0eSBzZXQgdG9cbiAgICogIEZhbHNlIHVubGVzcyB0aGUgbmV4dCBudW1iZXIgaW4gdGhlIHByb3RvY29sIGJ1ZmZlclxuICAgKiAgaXMgMSwgaW4gd2hpY2ggY2FzZSB0aGUgdmFsdWUgcHJvcGVydHkgaXMgVHJ1ZSAqL1xuICByZWFkQm9vbDogZnVuY3Rpb24gKCkge1xuICAgIHZhciByID0gdGhpcy5yZWFkSTMyKClcblxuICAgIGlmIChyICE9PSBudWxsICYmIHIudmFsdWUgPT0gXCIxXCIpIHtcbiAgICAgIHIudmFsdWUgPSB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIHIudmFsdWUgPSBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiByXG4gIH0sXG5cbiAgLyoqIFJldHVybnMgdGhlIGFuIG9iamVjdCB3aXRoIGEgdmFsdWUgcHJvcGVydHkgc2V0IHRvIHRoZVxuICAgICAgbmV4dCB2YWx1ZSBmb3VuZCBpbiB0aGUgcHJvdG9jb2wgYnVmZmVyICovXG4gIHJlYWRCeXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZEkzMigpXG4gIH0sXG5cbiAgLyoqIFJldHVybnMgdGhlIGFuIG9iamVjdCB3aXRoIGEgdmFsdWUgcHJvcGVydHkgc2V0IHRvIHRoZVxuICAgICAgbmV4dCB2YWx1ZSBmb3VuZCBpbiB0aGUgcHJvdG9jb2wgYnVmZmVyICovXG4gIHJlYWRJMTY6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkSTMyKClcbiAgfSxcblxuICAvKiogUmV0dXJucyB0aGUgYW4gb2JqZWN0IHdpdGggYSB2YWx1ZSBwcm9wZXJ0eSBzZXQgdG8gdGhlXG4gICAgICBuZXh0IHZhbHVlIGZvdW5kIGluIHRoZSBwcm90b2NvbCBidWZmZXIgKi9cbiAgcmVhZEkzMjogZnVuY3Rpb24gKGYpIHtcbiAgICBpZiAoZiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmID0gdGhpcy5yc3RhY2tbdGhpcy5yc3RhY2subGVuZ3RoIC0gMV1cbiAgICB9XG5cbiAgICB2YXIgciA9IHt9XG5cbiAgICBpZiAoZiBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBpZiAoZi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgci52YWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgci52YWx1ZSA9IGYuc2hpZnQoKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZiBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgZm9yICh2YXIgaSBpbiBmKSB7XG4gICAgICAgIGlmIChpID09PSBudWxsKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJzdGFjay5wdXNoKGZbaV0pXG4gICAgICAgIGRlbGV0ZSBmW2ldXG5cbiAgICAgICAgci52YWx1ZSA9IGlcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgci52YWx1ZSA9IGZcbiAgICAgIHRoaXMucnN0YWNrLnBvcCgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHJcbiAgfSxcblxuICAvKiogUmV0dXJucyB0aGUgYW4gb2JqZWN0IHdpdGggYSB2YWx1ZSBwcm9wZXJ0eSBzZXQgdG8gdGhlXG4gICAgICBuZXh0IHZhbHVlIGZvdW5kIGluIHRoZSBwcm90b2NvbCBidWZmZXIgKi9cbiAgcmVhZEk2NDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnJlYWRJMzIoKVxuICB9LFxuXG4gIC8qKiBSZXR1cm5zIHRoZSBhbiBvYmplY3Qgd2l0aCBhIHZhbHVlIHByb3BlcnR5IHNldCB0byB0aGVcbiAgICAgIG5leHQgdmFsdWUgZm91bmQgaW4gdGhlIHByb3RvY29sIGJ1ZmZlciAqL1xuICByZWFkRG91YmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZEkzMigpXG4gIH0sXG5cbiAgLyoqIFJldHVybnMgdGhlIGFuIG9iamVjdCB3aXRoIGEgdmFsdWUgcHJvcGVydHkgc2V0IHRvIHRoZVxuICAgICAgbmV4dCB2YWx1ZSBmb3VuZCBpbiB0aGUgcHJvdG9jb2wgYnVmZmVyICovXG4gIHJlYWRTdHJpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgciA9IHRoaXMucmVhZEkzMigpXG4gICAgcmV0dXJuIHJcbiAgfSxcblxuICAvKiogUmV0dXJucyB0aGUgYW4gb2JqZWN0IHdpdGggYSB2YWx1ZSBwcm9wZXJ0eSBzZXQgdG8gdGhlXG4gICAgICBuZXh0IHZhbHVlIGZvdW5kIGluIHRoZSBwcm90b2NvbCBidWZmZXIgKi9cbiAgcmVhZEJpbmFyeTogZnVuY3Rpb24gKCkge1xuICAgIHZhciByID0gdGhpcy5yZWFkSTMyKClcbiAgICByLnZhbHVlID0gYXRvYihyLnZhbHVlKVxuICAgIHJldHVybiByXG4gIH0sXG5cbiAgLyoqXG4gICAqIE1ldGhvZCB0byBhcmJpdHJhcmlseSBza2lwIG92ZXIgZGF0YSAqL1xuICBza2lwOiBmdW5jdGlvbiAodHlwZSkge1xuICAgIHZhciByZXQsIGlcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIFRocmlmdC5UeXBlLlNUT1A6XG4gICAgICByZXR1cm4gbnVsbFxuXG4gICAgY2FzZSBUaHJpZnQuVHlwZS5CT09MOlxuICAgICAgcmV0dXJuIHRoaXMucmVhZEJvb2woKVxuXG4gICAgY2FzZSBUaHJpZnQuVHlwZS5CWVRFOlxuICAgICAgcmV0dXJuIHRoaXMucmVhZEJ5dGUoKVxuXG4gICAgY2FzZSBUaHJpZnQuVHlwZS5JMTY6XG4gICAgICByZXR1cm4gdGhpcy5yZWFkSTE2KClcblxuICAgIGNhc2UgVGhyaWZ0LlR5cGUuSTMyOlxuICAgICAgcmV0dXJuIHRoaXMucmVhZEkzMigpXG5cbiAgICBjYXNlIFRocmlmdC5UeXBlLkk2NDpcbiAgICAgIHJldHVybiB0aGlzLnJlYWRJNjQoKVxuXG4gICAgY2FzZSBUaHJpZnQuVHlwZS5ET1VCTEU6XG4gICAgICByZXR1cm4gdGhpcy5yZWFkRG91YmxlKClcblxuICAgIGNhc2UgVGhyaWZ0LlR5cGUuU1RSSU5HOlxuICAgICAgcmV0dXJuIHRoaXMucmVhZFN0cmluZygpXG5cbiAgICBjYXNlIFRocmlmdC5UeXBlLlNUUlVDVDpcbiAgICAgIHRoaXMucmVhZFN0cnVjdEJlZ2luKClcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHJldCA9IHRoaXMucmVhZEZpZWxkQmVnaW4oKVxuICAgICAgICBpZiAocmV0LmZ0eXBlID09IFRocmlmdC5UeXBlLlNUT1ApIHtcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2tpcChyZXQuZnR5cGUpXG4gICAgICAgIHRoaXMucmVhZEZpZWxkRW5kKClcbiAgICAgIH1cbiAgICAgIHRoaXMucmVhZFN0cnVjdEVuZCgpXG4gICAgICByZXR1cm4gbnVsbFxuXG4gICAgY2FzZSBUaHJpZnQuVHlwZS5NQVA6XG4gICAgICByZXQgPSB0aGlzLnJlYWRNYXBCZWdpbigpXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcmV0LnNpemU7IGkrKykge1xuICAgICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgICBpZiAodGhpcy5yc3RhY2subGVuZ3RoID4gdGhpcy5ycG9zW3RoaXMucnBvcy5sZW5ndGggLSAxXSArIDEpIHtcbiAgICAgICAgICAgIHRoaXMucnN0YWNrLnBvcCgpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2tpcChyZXQua3R5cGUpXG4gICAgICAgIHRoaXMuc2tpcChyZXQudnR5cGUpXG4gICAgICB9XG4gICAgICB0aGlzLnJlYWRNYXBFbmQoKVxuICAgICAgcmV0dXJuIG51bGxcblxuICAgIGNhc2UgVGhyaWZ0LlR5cGUuU0VUOlxuICAgICAgcmV0ID0gdGhpcy5yZWFkU2V0QmVnaW4oKVxuICAgICAgZm9yIChpID0gMDsgaSA8IHJldC5zaXplOyBpKyspIHtcbiAgICAgICAgdGhpcy5za2lwKHJldC5ldHlwZSlcbiAgICAgIH1cbiAgICAgIHRoaXMucmVhZFNldEVuZCgpXG4gICAgICByZXR1cm4gbnVsbFxuXG4gICAgY2FzZSBUaHJpZnQuVHlwZS5MSVNUOlxuICAgICAgcmV0ID0gdGhpcy5yZWFkTGlzdEJlZ2luKClcbiAgICAgIGZvciAoaSA9IDA7IGkgPCByZXQuc2l6ZTsgaSsrKSB7XG4gICAgICAgIHRoaXMuc2tpcChyZXQuZXR5cGUpXG4gICAgICB9XG4gICAgICB0aGlzLnJlYWRMaXN0RW5kKClcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG59XG5cbi8qKlxuKiBJbml0aWFsaXplcyBhIE11dGlscGxleFByb3RvY29sIEltcGxlbWVudGF0aW9uIGFzIGEgV3JhcHBlciBmb3IgVGhyaWZ0LlByb3RvY29sXG4qIEBjb25zdHJ1Y3RvclxuKi9cblRocmlmdC5NdWx0aXBsZXhQcm90b2NvbCA9IGZ1bmN0aW9uIChzcnZOYW1lLCB0cmFucywgc3RyaWN0UmVhZCwgc3RyaWN0V3JpdGUpIHtcbiAgVGhyaWZ0LlByb3RvY29sLmNhbGwodGhpcywgdHJhbnMsIHN0cmljdFJlYWQsIHN0cmljdFdyaXRlKVxuICB0aGlzLnNlcnZpY2VOYW1lID0gc3J2TmFtZVxufVxuVGhyaWZ0LmluaGVyaXRzKFRocmlmdC5NdWx0aXBsZXhQcm90b2NvbCwgVGhyaWZ0LlByb3RvY29sLCBcIm11bHRpcGxleFByb3RvY29sXCIpXG5cbi8qKiBPdmVycmlkZSB3cml0ZU1lc3NhZ2VCZWdpbiBtZXRob2Qgb2YgcHJvdG90eXBlICovXG5UaHJpZnQuTXVsdGlwbGV4UHJvdG9jb2wucHJvdG90eXBlLndyaXRlTWVzc2FnZUJlZ2luID0gZnVuY3Rpb24gKG5hbWUsIHR5cGUsIHNlcWlkKSB7XG4gIGlmICh0eXBlID09PSBUaHJpZnQuTWVzc2FnZVR5cGUuQ0FMTCB8fCB0eXBlID09PSBUaHJpZnQuTWVzc2FnZVR5cGUuT05FV0FZKSB7XG4gICAgVGhyaWZ0LlByb3RvY29sLnByb3RvdHlwZS53cml0ZU1lc3NhZ2VCZWdpbi5jYWxsKHRoaXMsIHRoaXMuc2VydmljZU5hbWUgKyBcIjpcIiArIG5hbWUsIHR5cGUsIHNlcWlkKVxuICB9IGVsc2Uge1xuICAgIFRocmlmdC5Qcm90b2NvbC5wcm90b3R5cGUud3JpdGVNZXNzYWdlQmVnaW4uY2FsbCh0aGlzLCBuYW1lLCB0eXBlLCBzZXFpZClcbiAgfVxufVxuXG5UaHJpZnQuTXVsdGlwbGV4ZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuc2VxaWQgPSAwXG59XG5cbi8qKiBJbnN0YW50aWF0ZXMgYSBtdWx0aXBsZXhlZCBjbGllbnQgZm9yIGEgc3BlY2lmaWMgc2VydmljZVxuKiBAY29uc3RydWN0b3JcbiogQHBhcmFtIHtTdHJpbmd9IHNlcnZpY2VOYW1lIC0gVGhlIHRyYW5zcG9ydCB0byBzZXJpYWxpemUgdG8vZnJvbS5cbiogQHBhcmFtIHtUaHJpZnQuU2VydmljZUNsaWVudH0gU0NsIC0gVGhlIFNlcnZpY2UgQ2xpZW50IENsYXNzXG4qIEBwYXJhbSB7VGhyaWZ0LlRyYW5zcG9ydH0gdHJhbnNwb3J0IC0gVGhyaWZ0LlRyYW5zcG9ydCBpbnN0YW5jZSB3aGljaCBwcm92aWRlcyByZW1vdGUgaG9zdDpwb3J0XG4qIEBleGFtcGxlXG4qICAgIHZhciBtcCA9IG5ldyBUaHJpZnQuTXVsdGlwbGV4ZXIoKTtcbiogICAgdmFyIHRyYW5zcG9ydCA9IG5ldyBUaHJpZnQuVHJhbnNwb3J0KFwiaHR0cDovL2xvY2FsaG9zdDo5MDkwL2Zvby50aHJpZnRcIik7XG4qICAgIHZhciBwcm90b2NvbCA9IG5ldyBUaHJpZnQuUHJvdG9jb2wodHJhbnNwb3J0KTtcbiogICAgdmFyIGNsaWVudCA9IG1wLmNyZWF0ZUNsaWVudCgnQXV0aFNlcnZpY2UnLCBBdXRoU2VydmljZUNsaWVudCwgdHJhbnNwb3J0KTtcbiovXG5UaHJpZnQuTXVsdGlwbGV4ZXIucHJvdG90eXBlLmNyZWF0ZUNsaWVudCA9IGZ1bmN0aW9uIChzZXJ2aWNlTmFtZSwgU0NsLCB0cmFuc3BvcnQpIHtcbiAgaWYgKFNDbC5DbGllbnQpIHtcbiAgICBTQ2wgPSBTQ2wuQ2xpZW50XG4gIH1cbiAgdmFyIHNlbGYgPSB0aGlzXG4gIFNDbC5wcm90b3R5cGUubmV3X3NlcWlkID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuc2VxaWQgKz0gMVxuICAgIHJldHVybiBzZWxmLnNlcWlkXG4gIH1cbiAgdmFyIGNsaWVudCA9IG5ldyBTQ2wobmV3IFRocmlmdC5NdWx0aXBsZXhQcm90b2NvbChzZXJ2aWNlTmFtZSwgdHJhbnNwb3J0KSlcblxuICByZXR1cm4gY2xpZW50XG59XG5cbnZhciBjb3B5TGlzdCwgY29weU1hcFxuXG5jb3B5TGlzdCA9IGZ1bmN0aW9uIChsc3QsIHR5cGVzKSB7XG4gIGlmICghbHN0KSB7IHJldHVybiBsc3QgfVxuXG4gIHZhciB0eXBlXG5cbiAgaWYgKHR5cGVzLnNoaWZ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0eXBlID0gdHlwZXNcbiAgfSBlbHNlIHtcbiAgICB0eXBlID0gdHlwZXNbMF1cbiAgfVxuICB2YXIgVHlwZSA9IHR5cGVcblxuICB2YXIgbGVuID0gbHN0Lmxlbmd0aCwgcmVzdWx0ID0gW10sIGksIHZhbFxuICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YWwgPSBsc3RbaV1cbiAgICBpZiAodHlwZSA9PT0gbnVsbCkge1xuICAgICAgcmVzdWx0LnB1c2godmFsKVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gY29weU1hcCB8fCB0eXBlID09PSBjb3B5TGlzdCkge1xuICAgICAgcmVzdWx0LnB1c2godHlwZSh2YWwsIHR5cGVzLnNsaWNlKDEpKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnB1c2gobmV3IFR5cGUodmFsKSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5jb3B5TWFwID0gZnVuY3Rpb24gKG9iaiwgdHlwZXMpIHtcbiAgaWYgKCFvYmopIHsgcmV0dXJuIG9iaiB9XG5cbiAgdmFyIHR5cGVcblxuICBpZiAodHlwZXMuc2hpZnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHR5cGUgPSB0eXBlc1xuICB9IGVsc2Uge1xuICAgIHR5cGUgPSB0eXBlc1swXVxuICB9XG4gIHZhciBUeXBlID0gdHlwZVxuXG4gIHZhciByZXN1bHQgPSB7fSwgdmFsXG4gIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgdmFsID0gb2JqW3Byb3BdXG4gICAgICBpZiAodHlwZSA9PT0gbnVsbCkge1xuICAgICAgICByZXN1bHRbcHJvcF0gPSB2YWxcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gY29weU1hcCB8fCB0eXBlID09PSBjb3B5TGlzdCkge1xuICAgICAgICByZXN1bHRbcHJvcF0gPSB0eXBlKHZhbCwgdHlwZXMuc2xpY2UoMSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbcHJvcF0gPSBuZXcgVHlwZSh2YWwpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHRcbn1cblxuVGhyaWZ0LmNvcHlNYXAgPSBjb3B5TWFwXG5UaHJpZnQuY29weUxpc3QgPSBjb3B5TGlzdFxuXG5tb2R1bGUuZXhwb3J0cyA9IFRocmlmdFxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdXNlbGVzcy1lc2NhcGUgKi9cbnZhciBkZXRlY3RvciA9IHt9XG5cbnZhciBOQV9WRVJTSU9OID0gXCItMVwiXG52YXIgd2luID0gd2luZG93XG52YXIgZXh0ZXJuYWwgPSB3aW4uZXh0ZXJuYWxcbnZhciB1c2VyQWdlbnQgPSB3aW4ubmF2aWdhdG9yLnVzZXJBZ2VudCB8fCBcIlwiXG52YXIgYXBwVmVyc2lvbiA9IHdpbi5uYXZpZ2F0b3IuYXBwVmVyc2lvbiB8fCBcIlwiXG52YXIgdmVuZG9yID0gd2luLm5hdmlnYXRvci52ZW5kb3IgfHwgXCJcIlxuXG52YXIgcmVNc2llID0gL1xcYig/Om1zaWUgfGllIHx0cmlkZW50XFwvWzAtOV0uKnJ2WyA6XSkoWzAtOS5dKykvXG52YXIgcmVCbGFja2JlcnJ5MTAgPSAvXFxiYmIxMFxcYi4rP1xcYnZlcnNpb25cXC8oW1xcZC5dKykvXG52YXIgcmVCbGFja2JlcnJ5NjcgPSAvXFxiYmxhY2tiZXJyeVxcYi4rXFxidmVyc2lvblxcLyhbXFxkLl0rKS9cbnZhciByZUJsYWNrYmVycnk0NSA9IC9cXGJibGFja2JlcnJ5XFxkK1xcLyhbXFxkLl0rKS9cblxuZnVuY3Rpb24gdG9TdHJpbmcgKG9iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdClcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QgKG9iamVjdCkge1xuICByZXR1cm4gdG9TdHJpbmcob2JqZWN0KSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIlxufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uIChvYmplY3QpIHtcbiAgcmV0dXJuIHRvU3RyaW5nKG9iamVjdCkgPT09IFwiW29iamVjdCBGdW5jdGlvbl1cIlxufVxuXG5mdW5jdGlvbiBlYWNoIChvYmplY3QsIGZhY3RvcnkpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmplY3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKGZhY3RvcnkuY2FsbChvYmplY3QsIG9iamVjdFtpXSwgaSkgPT09IGZhbHNlKSB7XG4gICAgICBicmVha1xuICAgIH1cbiAgfVxufVxuXG4vLyDop6PmnpDkvb/nlKggVHJpZGVudCDlhoXmoLjnmoTmtY/op4jlmajnmoQgYOa1j+iniOWZqOaooeW8j2Ag5ZKMIGDmlofmoaPmqKHlvI9gIOS/oeaBr+OAglxuLy8gQHBhcmFtIHtTdHJpbmd9IHVhLCB1c2VyQWdlbnQgc3RyaW5nLlxuLy8gQHJldHVybiB7T2JqZWN0fVxuZnVuY3Rpb24gSUVNb2RlICh1YSkge1xuICBpZiAoIXJlTXNpZS50ZXN0KHVhKSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICB2YXIgbSxcbiAgICBlbmdpbmVNb2RlLCBlbmdpbmVWZXJzaW9uLFxuICAgIGJyb3dzZXJNb2RlLCBicm93c2VyVmVyc2lvblxuXG4gICAgLy8gSUU4IOWPiuWFtuS7peS4iuaPkOS+m+aciSBUcmlkZW50IOS/oeaBr++8jFxuICAgIC8vIOm7mOiupOeahOWFvOWuueaooeW8j++8jFVBIOS4rSBUcmlkZW50IOeJiOacrOS4jeWPkeeUn+WPmOWMluOAglxuICBpZiAodWEuaW5kZXhPZihcInRyaWRlbnQvXCIpICE9PSAtMSkge1xuICAgIG0gPSAvXFxidHJpZGVudFxcLyhbMC05Ll0rKS8uZXhlYyh1YSlcbiAgICBpZiAobSAmJiBtLmxlbmd0aCA+PSAyKSB7XG4gICAgICAvLyDnnJ/lrp7lvJXmk47niYjmnKzjgIJcbiAgICAgIGVuZ2luZVZlcnNpb24gPSBtWzFdXG4gICAgICB2YXIgdlZlcnNpb24gPSBtWzFdLnNwbGl0KFwiLlwiKVxuICAgICAgdlZlcnNpb25bMF0gPSBwYXJzZUludCh2VmVyc2lvblswXSwgMTApICsgNFxuICAgICAgYnJvd3NlclZlcnNpb24gPSB2VmVyc2lvbi5qb2luKFwiLlwiKVxuICAgIH1cbiAgfVxuXG4gIG0gPSByZU1zaWUuZXhlYyh1YSlcbiAgYnJvd3Nlck1vZGUgPSBtWzFdXG4gIHZhciB2TW9kZSA9IG1bMV0uc3BsaXQoXCIuXCIpXG4gIGlmICh0eXBlb2YgYnJvd3NlclZlcnNpb24gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBicm93c2VyVmVyc2lvbiA9IGJyb3dzZXJNb2RlXG4gIH1cbiAgdk1vZGVbMF0gPSBwYXJzZUludCh2TW9kZVswXSwgMTApIC0gNFxuICBlbmdpbmVNb2RlID0gdk1vZGUuam9pbihcIi5cIilcbiAgaWYgKHR5cGVvZiBlbmdpbmVWZXJzaW9uID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgZW5naW5lVmVyc2lvbiA9IGVuZ2luZU1vZGVcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgYnJvd3NlclZlcnNpb246IGJyb3dzZXJWZXJzaW9uLFxuICAgIGJyb3dzZXJNb2RlOiBicm93c2VyTW9kZSxcbiAgICBlbmdpbmVWZXJzaW9uOiBlbmdpbmVWZXJzaW9uLFxuICAgIGVuZ2luZU1vZGU6IGVuZ2luZU1vZGUsXG4gICAgY29tcGF0aWJsZTogZW5naW5lVmVyc2lvbiAhPT0gZW5naW5lTW9kZVxuICB9XG59XG5cbi8vIOmSiOWvueWQjOa6kOeahCBUaGVXb3JsZCDlkowgMzYwIOeahCBleHRlcm5hbCDlr7nosaHov5vooYzmo4DmtYvjgIJcbi8vIEBwYXJhbSB7U3RyaW5nfSBrZXksIOWFs+mUruWtl++8jOeUqOS6juajgOa1i+a1j+iniOWZqOeahOWuieijhei3r+W+hOS4reWHuueOsOeahOWFs+mUruWtl+OAglxuLy8gQHJldHVybiB7VW5kZWZpbmVkLEJvb2xlYW4sT2JqZWN0fSDov5Tlm54gdW5kZWZpbmVkIOaIliBmYWxzZSDooajnpLrmo4DmtYvmnKrlkb3kuK3jgIJcbmZ1bmN0aW9uIGNoZWNrVFczNjBFeHRlcm5hbCAoa2V5KSB7XG4gIGlmICghZXh0ZXJuYWwpIHtcbiAgICByZXR1cm5cbiAgfSAvLyByZXR1cm4gdW5kZWZpbmVkLlxuICB0cnkge1xuICAgIC8vIDM2MOWuieijhei3r+W+hO+8mlxuICAgIC8vIEM6JTVDUFJPR1JBfjElNUMzNjAlNUMzNjBzZTMlNUMzNjBTRS5leGVcbiAgICB2YXIgcnVucGF0aCA9IGV4dGVybmFsLnR3R2V0UnVuUGF0aC50b0xvd2VyQ2FzZSgpXG4gICAgLy8gMzYwU0UgMy54IH4gNS54IHN1cHBvcnQuXG4gICAgLy8g5pq06Zyy55qEIGV4dGVybmFsLnR3R2V0VmVyc2lvbiDlkowgZXh0ZXJuYWwudHdHZXRTZWN1cml0eUlEIOWdh+S4uiB1bmRlZmluZWTjgIJcbiAgICAvLyDlm6DmraTlj6rog73nlKggdHJ5L2NhdGNoIOiAjOaXoOazleS9v+eUqOeJueaAp+WIpOaWreOAglxuICAgIHZhciBzZWN1cml0eSA9IGV4dGVybmFsLnR3R2V0U2VjdXJpdHlJRCh3aW4pXG4gICAgdmFyIHZlcnNpb24gPSBleHRlcm5hbC50d0dldFZlcnNpb24oc2VjdXJpdHkpXG5cbiAgICBpZiAocnVucGF0aCAmJiBydW5wYXRoLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBpZiAodmVyc2lvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmVyc2lvbjogdmVyc2lvblxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXgpIHsgLyogKi8gfVxufVxuXG4vLyDnoazku7borr7lpIfkv6Hmga/or4bliKvooajovr7lvI/jgIJcbi8vIOS9v+eUqOaVsOe7hOWPr+S7peaMieS8mOWFiOe6p+aOkuW6j+OAglxudmFyIERFVklDRVMgPSBbXG4gIFtcIm5va2lhXCIsIGZ1bmN0aW9uICh1YSkge1xuICAgIC8vIOS4jeiDveWwhuS4pOS4quihqOi+vuW8j+WQiOW5tu+8jOWboOS4uuWPr+iDveWHuueOsCBcIm5va2lhOyBub2tpYSA5NjBcIlxuICAgIC8vIOi/meenjeaDheWGteS4i+S8muS8mOWFiOivhuWIq+WHuiBub2tpYS8tMVxuICAgIGlmICh1YS5pbmRleE9mKFwibm9raWEgXCIpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIC9cXGJub2tpYSAoWzAtOV0rKT8vXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAvXFxibm9raWEoW2EtejAtOV0rKT8vXG4gICAgfVxuICB9XSxcbiAgLy8g5LiJ5pif5pyJIEFuZHJvaWQg5ZKMIFdQIOiuvuWkh+OAglxuICBbXCJzYW1zdW5nXCIsIGZ1bmN0aW9uICh1YSkge1xuICAgIGlmICh1YS5pbmRleE9mKFwic2Ftc3VuZ1wiKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiAvXFxic2Ftc3VuZyg/OlsgXFwtXSg/OnNnaHxndHxzbSkpPy0oW2EtejAtOV0rKS9cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIC9cXGIoPzpzZ2h8c2NofGd0fHNtKS0oW2EtejAtOV0rKS9cbiAgICB9XG4gIH1dLFxuICBbXCJ3cFwiLCBmdW5jdGlvbiAodWEpIHtcbiAgICByZXR1cm4gdWEuaW5kZXhPZihcIndpbmRvd3MgcGhvbmUgXCIpICE9PSAtMSB8fFxuICAgICAgICAgICAgdWEuaW5kZXhPZihcInhibHdwXCIpICE9PSAtMSB8fFxuICAgICAgICAgICAgdWEuaW5kZXhPZihcInp1bmV3cFwiKSAhPT0gLTEgfHxcbiAgICAgICAgICAgIHVhLmluZGV4T2YoXCJ3aW5kb3dzIGNlXCIpICE9PSAtMVxuICB9XSxcbiAgW1wicGNcIiwgXCJ3aW5kb3dzXCJdLFxuICBbXCJpcGFkXCIsIFwiaXBhZFwiXSxcbiAgLy8gaXBvZCDop4TliJnlupTnva7kuo4gaXBob25lIOS5i+WJjeOAglxuICBbXCJpcG9kXCIsIFwiaXBvZFwiXSxcbiAgW1wiaXBob25lXCIsIC9cXGJpcGhvbmVcXGJ8XFxiaXBoKFxcZCkvXSxcbiAgW1wibWFjXCIsIFwibWFjaW50b3NoXCJdLFxuICAvLyDlsI/nsbNcbiAgW1wibWlcIiwgL1xcYm1pWyBcXC1dPyhbYS16MC05IF0rKD89IGJ1aWxkfFxcKSkpL10sXG4gIC8vIOe6ouexs1xuICBbXCJob25nbWlcIiwgL1xcYmhtWyBcXC1dPyhbYS16MC05XSspL10sXG4gIFtcImFsaXl1blwiLCAvXFxiYWxpeXVub3NcXGIoPzpbXFwtXShcXGQrKSk/L10sXG4gIFtcIm1laXp1XCIsIGZ1bmN0aW9uICh1YSkge1xuICAgIHJldHVybiB1YS5pbmRleE9mKFwibWVpenVcIikgPj0gMFxuICAgICAgPyAvXFxibWVpenVbXFwvIF0oW2EtejAtOV0rKVxcYi9cbiAgICAgIDogL1xcYm0oWzAtOWN4XXsxLDR9KVxcYi9cbiAgfV0sXG4gIFtcIm5leHVzXCIsIC9cXGJuZXh1cyAoWzAtOXMuXSspL10sXG4gIFtcImh1YXdlaVwiLCBmdW5jdGlvbiAodWEpIHtcbiAgICB2YXIgcmVNZWRpYXBhZCA9IC9cXGJtZWRpYXBhZCAoLis/KSg/PSBidWlsZFxcL2h1YXdlaW1lZGlhcGFkXFxiKS9cbiAgICBpZiAodWEuaW5kZXhPZihcImh1YXdlaS1odWF3ZWlcIikgIT09IC0xKSB7XG4gICAgICByZXR1cm4gL1xcYmh1YXdlaVxcLWh1YXdlaVxcLShbYS16MC05XFwtXSspL1xuICAgIH0gZWxzZSBpZiAocmVNZWRpYXBhZC50ZXN0KHVhKSkge1xuICAgICAgcmV0dXJuIHJlTWVkaWFwYWRcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIC9cXGJodWF3ZWlbIF9cXC1dPyhbYS16MC05XSspL1xuICAgIH1cbiAgfV0sXG4gIFtcImxlbm92b1wiLCBmdW5jdGlvbiAodWEpIHtcbiAgICBpZiAodWEuaW5kZXhPZihcImxlbm92by1sZW5vdm9cIikgIT09IC0xKSB7XG4gICAgICByZXR1cm4gL1xcYmxlbm92b1xcLWxlbm92b1sgXFwtXShbYS16MC05XSspL1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gL1xcYmxlbm92b1sgXFwtXT8oW2EtejAtOV0rKS9cbiAgICB9XG4gIH1dLFxuICAvLyDkuK3lhbRcbiAgW1wienRlXCIsIGZ1bmN0aW9uICh1YSkge1xuICAgIGlmICgvXFxienRlXFwtW3R1XS8udGVzdCh1YSkpIHtcbiAgICAgIHJldHVybiAvXFxienRlLVt0dV1bIF9cXC1dPyhbYS1zdS16MC05XFwrXSspL1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gL1xcYnp0ZVsgX1xcLV0/KFthLXN1LXowLTlcXCtdKykvXG4gICAgfVxuICB9XSxcbiAgLy8g5q2l5q2l6auYXG4gIFtcInZpdm9cIiwgL1xcYnZpdm8oPzogKFthLXowLTldKykpPy9dLFxuICBbXCJodGNcIiwgZnVuY3Rpb24gKHVhKSB7XG4gICAgaWYgKC9cXGJodGNbYS16MC05IF9cXC1dKyg/PSBidWlsZFxcYikvLnRlc3QodWEpKSB7XG4gICAgICByZXR1cm4gL1xcYmh0Y1sgX1xcLV0/KFthLXowLTkgXSsoPz0gYnVpbGQpKS9cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIC9cXGJodGNbIF9cXC1dPyhbYS16MC05IF0rKS9cbiAgICB9XG4gIH1dLFxuICBbXCJvcHBvXCIsIC9cXGJvcHBvW19dKFthLXowLTldKykvXSxcbiAgW1wia29ua2FcIiwgL1xcYmtvbmthW19cXC1dKFthLXowLTldKykvXSxcbiAgW1wic29ueWVyaWNzc29uXCIsIC9cXGJtdChbYS16MC05XSspL10sXG4gIFtcImNvb2xwYWRcIiwgL1xcYmNvb2xwYWRbXyBdPyhbYS16MC05XSspL10sXG4gIFtcImxnXCIsIC9cXGJsZ1tcXC1dKFthLXowLTldKykvXSxcbiAgW1wiYW5kcm9pZFwiLCAvXFxiYW5kcm9pZFxcYnxcXGJhZHJcXGIvXSxcbiAgW1wiYmxhY2tiZXJyeVwiLCBmdW5jdGlvbiAodWEpIHtcbiAgICBpZiAodWEuaW5kZXhPZihcImJsYWNrYmVycnlcIikgPj0gMCkge1xuICAgICAgcmV0dXJuIC9cXGJibGFja2JlcnJ5XFxzPyhcXGQrKS9cbiAgICB9XG4gICAgcmV0dXJuIFwiYmIxMFwiXG4gIH1dXG5dXG5cbi8vIOaTjeS9nOezu+e7n+S/oeaBr+ivhuWIq+ihqOi+vuW8j1xudmFyIE9TID0gW1xuICBbXCJ3cFwiLCBmdW5jdGlvbiAodWEpIHtcbiAgICBpZiAodWEuaW5kZXhPZihcIndpbmRvd3MgcGhvbmUgXCIpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIC9cXGJ3aW5kb3dzIHBob25lICg/Om9zICk/KFswLTkuXSspL1xuICAgIH0gZWxzZSBpZiAodWEuaW5kZXhPZihcInhibHdwXCIpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIC9cXGJ4Ymx3cChbMC05Ll0rKS9cbiAgICB9IGVsc2UgaWYgKHVhLmluZGV4T2YoXCJ6dW5ld3BcIikgIT09IC0xKSB7XG4gICAgICByZXR1cm4gL1xcYnp1bmV3cChbMC05Ll0rKS9cbiAgICB9XG4gICAgcmV0dXJuIFwid2luZG93cyBwaG9uZVwiXG4gIH1dLFxuICBbXCJ3aW5kb3dzXCIsIC9cXGJ3aW5kb3dzIG50IChbMC05Ll0rKS9dLFxuICBbXCJtYWNvc3hcIiwgL1xcYm1hYyBvcyB4IChbMC05Ll9dKykvXSxcbiAgW1wiaW9zXCIsIGZ1bmN0aW9uICh1YSkge1xuICAgIGlmICgvXFxiY3B1KD86IGlwaG9uZSk/IG9zIC8udGVzdCh1YSkpIHtcbiAgICAgIHJldHVybiAvXFxiY3B1KD86IGlwaG9uZSk/IG9zIChbMC05Ll9dKykvXG4gICAgfSBlbHNlIGlmICh1YS5pbmRleE9mKFwiaXBoIG9zIFwiKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiAvXFxiaXBoIG9zIChbMC05X10rKS9cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIC9cXGJpb3NcXGIvXG4gICAgfVxuICB9XSxcbiAgW1wieXVub3NcIiwgL1xcYmFsaXl1bm9zIChbMC05Ll0rKS9dLFxuICBbXCJhbmRyb2lkXCIsIGZ1bmN0aW9uICh1YSkge1xuICAgIGlmICh1YS5pbmRleE9mKFwiYW5kcm9pZFwiKSA+PSAwKSB7XG4gICAgICByZXR1cm4gL1xcYmFuZHJvaWRbIFxcLy1dPyhbMC05LnhdKyk/L1xuICAgIH0gZWxzZSBpZiAodWEuaW5kZXhPZihcImFkclwiKSA+PSAwKSB7XG4gICAgICBpZiAodWEuaW5kZXhPZihcIm1xcWJyb3dzZXJcIikgPj0gMCkge1xuICAgICAgICByZXR1cm4gL1xcYmFkclsgXVxcKGxpbnV4OyB1OyAoWzAtOS5dKyk/L1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIC9cXGJhZHIoPzpbIF0oWzAtOS5dKykpPy9cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFwiYW5kcm9pZFwiXG4gICAgLy8gcmV0dXJuIC9cXGIoPzphbmRyb2lkfFxcYmFkcikoPzpbXFwvXFwtIF0oPzpcXChsaW51eDsgdTsgKT8pPyhbMC05LnhdKyk/LztcbiAgfV0sXG4gIFtcImNocm9tZW9zXCIsIC9cXGJjcm9zIGk2ODYgKFswLTkuXSspL10sXG4gIFtcImxpbnV4XCIsIFwibGludXhcIl0sXG4gIFtcIndpbmRvd3NjZVwiLCAvXFxid2luZG93cyBjZSg/OiAoWzAtOS5dKykpPy9dLFxuICBbXCJzeW1iaWFuXCIsIC9cXGJzeW1iaWFuKD86b3MpP1xcLyhbMC05Ll0rKS9dLFxuICBbXCJibGFja2JlcnJ5XCIsIGZ1bmN0aW9uICh1YSkge1xuICAgIHZhciBtID0gdWEubWF0Y2gocmVCbGFja2JlcnJ5MTApIHx8XG4gICAgICAgICAgICB1YS5tYXRjaChyZUJsYWNrYmVycnk2NykgfHxcbiAgICAgICAgICAgIHVhLm1hdGNoKHJlQmxhY2tiZXJyeTQ1KVxuICAgIHJldHVybiBtID8ge1xuICAgICAgdmVyc2lvbjogbVsxXVxuICAgIH0gOiBcImJsYWNrYmVycnlcIlxuICB9XVxuXVxuXG4vLyDmtY/op4jlmajlvJXmk47nsbvlnotcbnZhciBFTkdJTkUgPSBbXG4gIFtcImVkZ2VodG1sXCIsIC9lZGdlXFwvKFswLTkuXSspL10sXG4gIFtcInRyaWRlbnRcIiwgcmVNc2llXSxcbiAgW1wiYmxpbmtcIiwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBcImNocm9tZVwiIGluIHdpbiAmJiBcIkNTU1wiIGluIHdpbiAmJiAvXFxiYXBwbGV3ZWJraXRbXFwvXT8oWzAtOS4rXSspL1xuICB9XSxcbiAgW1wid2Via2l0XCIsIC9cXGJhcHBsZXdlYmtpdFtcXC9dPyhbMC05LitdKykvXSxcbiAgW1wiZ2Vja29cIiwgZnVuY3Rpb24gKHVhKSB7XG4gICAgdmFyIG1hdGNoXG4gICAgaWYgKChtYXRjaCA9IHVhLm1hdGNoKC9cXGJydjooW1xcZFxcdy5dKykuKlxcYmdlY2tvXFwvKFxcZCspLykpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2ZXJzaW9uOiBtYXRjaFsxXSArIFwiLlwiICsgbWF0Y2hbMl1cbiAgICAgIH1cbiAgICB9XG4gIH1dLFxuICBbXCJwcmVzdG9cIiwgL1xcYnByZXN0b1xcLyhbMC05Ll0rKS9dLFxuICBbXCJhbmRyb2lkd2Via2l0XCIsIC9cXGJhbmRyb2lkd2Via2l0XFwvKFswLTkuXSspL10sXG4gIFtcImNvb2xwYWR3ZWJraXRcIiwgL1xcYmNvb2xwYWR3ZWJraXRcXC8oWzAtOS5dKykvXSxcbiAgW1widTJcIiwgL1xcYnUyXFwvKFswLTkuXSspL10sXG4gIFtcInUzXCIsIC9cXGJ1M1xcLyhbMC05Ll0rKS9dXG5dXG5cbi8vIOa1j+iniOWZqOexu+Wei1xudmFyIEJST1dTRVIgPSBbXG4gIC8vIE1pY3Jvc29mdCBFZGdlIEJyb3dzZXIsIERlZmF1bHQgYnJvd3NlciBpbiBXaW5kb3dzIDEwLlxuICBbXCJlZGdlXCIsIC9lZGdlXFwvKFswLTkuXSspL10sXG4gIC8vIFNvZ291LlxuICBbXCJzb2dvdVwiLCBmdW5jdGlvbiAodWEpIHtcbiAgICBpZiAodWEuaW5kZXhPZihcInNvZ291bW9iaWxlYnJvd3NlclwiKSA+PSAwKSB7XG4gICAgICByZXR1cm4gL3NvZ291bW9iaWxlYnJvd3NlclxcLyhbMC05Ll0rKS9cbiAgICB9IGVsc2UgaWYgKHVhLmluZGV4T2YoXCJzb2dvdW1zZVwiKSA+PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gLyBzZSAoWzAtOS54XSspL1xuICB9XSxcbiAgLy8gVGhlV29ybGQgKOS4lueVjOS5i+eqlylcbiAgLy8g55Sx5LqO6KOZ5bim5YWz57O777yMVGhlV29ybGQgQVBJIOS4jiAzNjAg6auY5bqm6YeN5ZCI44CCXG4gIC8vIOWPquiDvemAmui/hyBVQSDlkoznqIvluo/lronoo4Xot6/lvoTkuK3nmoTlupTnlKjnqIvluo/lkI3mnaXljLrliIbjgIJcbiAgLy8gVGhlV29ybGQg55qEIFVBIOavlCAzNjAg5pu06Z2g6LCx77yM5omA5pyJ5bCGIFRoZVdvcmxkIOeahOinhOWImeaUvue9ruWIsCAzNjAg5LmL5YmN44CCXG4gIFtcInRoZXdvcmxkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgeCA9IGNoZWNrVFczNjBFeHRlcm5hbChcInRoZXdvcmxkXCIpXG4gICAgaWYgKHR5cGVvZiB4ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4geFxuICAgIH1cbiAgICByZXR1cm4gXCJ0aGV3b3JsZFwiXG4gIH1dLFxuICAvLyAzNjBTRSwgMzYwRUUuXG4gIFtcIjM2MFwiLCBmdW5jdGlvbiAodWEpIHtcbiAgICB2YXIgeCA9IGNoZWNrVFczNjBFeHRlcm5hbChcIjM2MHNlXCIpXG4gICAgaWYgKHR5cGVvZiB4ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4geFxuICAgIH1cbiAgICBpZiAodWEuaW5kZXhPZihcIjM2MCBhcGhvbmUgYnJvd3NlclwiKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiAvXFxiMzYwIGFwaG9uZSBicm93c2VyIFxcKChbXlxcKV0rKVxcKS9cbiAgICB9XG4gICAgcmV0dXJuIC9cXGIzNjAoPzpzZXxlZXxjaHJvbWV8YnJvd3NlcilcXGIvXG4gIH1dLFxuICAvLyBNYXh0aG9uXG4gIFtcIm1heHRob25cIiwgZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoZXh0ZXJuYWwgJiYgKGV4dGVybmFsLm14VmVyc2lvbiB8fCBleHRlcm5hbC5tYXhfdmVyc2lvbikpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB2ZXJzaW9uOiBleHRlcm5hbC5teFZlcnNpb24gfHwgZXh0ZXJuYWwubWF4X3ZlcnNpb25cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGV4KSB7IC8qICovIH1cbiAgICByZXR1cm4gL1xcYig/Om1heHRob258bXhicm93c2VyKSg/OlsgXFwvXShbMC05Ll0rKSk/L1xuICB9XSxcbiAgW1wibWljcm9tZXNzZW5nZXJcIiwgL1xcYm1pY3JvbWVzc2VuZ2VyXFwvKFtcXGQuXSspL10sXG4gIFtcInFxXCIsIC9cXGJtP3FxYnJvd3NlclxcLyhbMC05Ll0rKS9dLFxuICBbXCJncmVlblwiLCBcImdyZWVuYnJvd3NlclwiXSxcbiAgW1widHRcIiwgL1xcYnRlbmNlbnR0cmF2ZWxlciAoWzAtOS5dKykvXSxcbiAgW1wibGllYmFvXCIsIGZ1bmN0aW9uICh1YSkge1xuICAgIGlmICh1YS5pbmRleE9mKFwibGllYmFvZmFzdFwiKSA+PSAwKSB7XG4gICAgICByZXR1cm4gL1xcYmxpZWJhb2Zhc3RcXC8oWzAtOS5dKykvXG4gICAgfVxuICAgIGlmICh1YS5pbmRleE9mKFwibGJicm93c2VyXCIpID09PSAtMSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHZhciB2ZXJzaW9uXG4gICAgdHJ5IHtcbiAgICAgIGlmIChleHRlcm5hbCAmJiBleHRlcm5hbC5MaWViYW9HZXRWZXJzaW9uKSB7XG4gICAgICAgIHZlcnNpb24gPSBleHRlcm5hbC5MaWViYW9HZXRWZXJzaW9uKClcbiAgICAgIH1cbiAgICB9IGNhdGNoIChleCkgeyAvKiAqLyB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHZlcnNpb246IHZlcnNpb24gfHwgTkFfVkVSU0lPTlxuICAgIH1cbiAgfV0sXG4gIFtcInRhb1wiLCAvXFxidGFvYnJvd3NlclxcLyhbMC05Ll0rKS9dLFxuICBbXCJjb29sbm92b1wiLCAvXFxiY29vbG5vdm9cXC8oWzAtOS5dKykvXSxcbiAgW1wic2FheWFhXCIsIFwic2FheWFhXCJdLFxuICAvLyDmnInln7rkuo4gQ2hyb21uaXVuIOeahOaApemAn+aooeW8j+WSjOWfuuS6jiBJRSDnmoTlhbzlrrnmqKHlvI/jgILlv4XpobvlnKggSUUg55qE6KeE5YiZ5LmL5YmN44CCXG4gIFtcImJhaWR1XCIsIC9cXGIoPzpiYT9pZHVicm93c2VyfGJhaWR1aGQpWyBcXC9dKFswLTkueF0rKS9dLFxuICAvLyDlkI7pnaLkvJrlgZrkv67lpI3niYjmnKzlj7fvvIzov5nph4zlj6ropoHog73or4bliKvmmK8gSUUg5Y2z5Y+v44CCXG4gIFtcImllXCIsIHJlTXNpZV0sXG4gIFtcIm1pXCIsIC9cXGJtaXVpYnJvd3NlclxcLyhbMC05Ll0rKS9dLFxuICAvLyBPcGVyYSAxNSDkuYvlkI7lvIDlp4vkvb/nlKggQ2hyb21uaXVuIOWGheaguO+8jOmcgOimgeaUvuWcqCBDaHJvbWUg55qE6KeE5YiZ5LmL5YmN44CCXG4gIFtcIm9wZXJhXCIsIGZ1bmN0aW9uICh1YSkge1xuICAgIHZhciByZU9wZXJhT2xkID0gL1xcYm9wZXJhLit2ZXJzaW9uXFwvKFswLTkuYWJdKykvXG4gICAgdmFyIHJlT3BlcmFOZXcgPSAvXFxib3ByXFwvKFswLTkuXSspL1xuICAgIHJldHVybiByZU9wZXJhT2xkLnRlc3QodWEpID8gcmVPcGVyYU9sZCA6IHJlT3BlcmFOZXdcbiAgfV0sXG4gIFtcIm91cGVuZ1wiLCAvXFxib3VwZW5nXFwvKFswLTkuXSspL10sXG4gIFtcInlhbmRleFwiLCAveWFicm93c2VyXFwvKFswLTkuXSspL10sXG4gIC8vIOaUr+S7mOWuneaJi+acuuWuouaIt+err1xuICBbXCJhbGktYXBcIiwgZnVuY3Rpb24gKHVhKSB7XG4gICAgaWYgKHVhLmluZGV4T2YoXCJhbGlhcHBcIikgPiAwKSB7XG4gICAgICByZXR1cm4gL1xcYmFsaWFwcFxcKGFwXFwvKFswLTkuXSspXFwpL1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gL1xcYmFsaXBheWNsaWVudFxcLyhbMC05Ll0rKVxcYi9cbiAgICB9XG4gIH1dLFxuICAvLyDmlK/ku5jlrp3lubPmnb/lrqLmiLfnq69cbiAgW1wiYWxpLWFwLXBkXCIsIC9cXGJhbGlhcHBcXChhcC1wZFxcLyhbMC05Ll0rKVxcKS9dLFxuICAvLyDmlK/ku5jlrp3llYbmiLflrqLmiLfnq69cbiAgW1wiYWxpLWFtXCIsIC9cXGJhbGlhcHBcXChhbVxcLyhbMC05Ll0rKVxcKS9dLFxuICAvLyDmt5jlrp3miYvmnLrlrqLmiLfnq69cbiAgW1wiYWxpLXRiXCIsIC9cXGJhbGlhcHBcXCh0YlxcLyhbMC05Ll0rKVxcKS9dLFxuICAvLyDmt5jlrp3lubPmnb/lrqLmiLfnq69cbiAgW1wiYWxpLXRiLXBkXCIsIC9cXGJhbGlhcHBcXCh0Yi1wZFxcLyhbMC05Ll0rKVxcKS9dLFxuICAvLyDlpKnnjKvmiYvmnLrlrqLmiLfnq69cbiAgW1wiYWxpLXRtXCIsIC9cXGJhbGlhcHBcXCh0bVxcLyhbMC05Ll0rKVxcKS9dLFxuICAvLyDlpKnnjKvlubPmnb/lrqLmiLfnq69cbiAgW1wiYWxpLXRtLXBkXCIsIC9cXGJhbGlhcHBcXCh0bS1wZFxcLyhbMC05Ll0rKVxcKS9dLFxuICAvLyBVQyDmtY/op4jlmajvvIzlj6/og73kvJrooqvor4bliKvkuLogQW5kcm9pZCDmtY/op4jlmajvvIzop4TliJnpnIDopoHliY3nva7jgIJcbiAgLy8gVUMg5qGM6Z2i54mI5rWP6KeI5Zmo5pC65bimIENocm9tZSDkv6Hmga/vvIzpnIDopoHmlL7lnKggQ2hyb21lIOS5i+WJjeOAglxuICBbXCJ1Y1wiLCBmdW5jdGlvbiAodWEpIHtcbiAgICBpZiAodWEuaW5kZXhPZihcInVjYnJvd3Nlci9cIikgPj0gMCkge1xuICAgICAgcmV0dXJuIC9cXGJ1Y2Jyb3dzZXJcXC8oWzAtOS5dKykvXG4gICAgfSBlbHNlIGlmICh1YS5pbmRleE9mKFwidWJyb3dzZXIvXCIpID49IDApIHtcbiAgICAgIHJldHVybiAvXFxidWJyb3dzZXJcXC8oWzAtOS5dKykvXG4gICAgfSBlbHNlIGlmICgvXFxidWNcXC9bMC05XS8udGVzdCh1YSkpIHtcbiAgICAgIHJldHVybiAvXFxidWNcXC8oWzAtOS5dKykvXG4gICAgfSBlbHNlIGlmICh1YS5pbmRleE9mKFwidWN3ZWJcIikgPj0gMCkge1xuICAgICAgLy8gYHVjd2ViLzIuMGAgaXMgY29tcG9ueSBpbmZvLlxuICAgICAgLy8gYFVDV0VCOC43LjIuMjE0LzE0NS84MDBgIGlzIGJyb3dzZXIgaW5mby5cbiAgICAgIHJldHVybiAvXFxidWN3ZWIoWzAtOS5dKyk/L1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gL1xcYig/OnVjYnJvd3Nlcnx1YylcXGIvXG4gICAgfVxuICB9XSxcbiAgW1wiY2hyb21lXCIsIC8gKD86Y2hyb21lfGNyaW9zfGNybW8pXFwvKFswLTkuXSspL10sXG4gIC8vIEFuZHJvaWQg6buY6K6k5rWP6KeI5Zmo44CC6K+l6KeE5YiZ6ZyA6KaB5ZyoIHNhZmFyaSDkuYvliY3jgIJcbiAgW1wiYW5kcm9pZFwiLCBmdW5jdGlvbiAodWEpIHtcbiAgICBpZiAodWEuaW5kZXhPZihcImFuZHJvaWRcIikgPT09IC0xKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgcmV0dXJuIC9cXGJ2ZXJzaW9uXFwvKFswLTkuXSsoPzogYmV0YSk/KS9cbiAgfV0sXG4gIFtcImJsYWNrYmVycnlcIiwgZnVuY3Rpb24gKHVhKSB7XG4gICAgdmFyIG0gPSB1YS5tYXRjaChyZUJsYWNrYmVycnkxMCkgfHxcbiAgICAgICAgICAgIHVhLm1hdGNoKHJlQmxhY2tiZXJyeTY3KSB8fFxuICAgICAgICAgICAgdWEubWF0Y2gocmVCbGFja2JlcnJ5NDUpXG4gICAgcmV0dXJuIG0gPyB7XG4gICAgICB2ZXJzaW9uOiBtWzFdXG4gICAgfSA6IFwiYmxhY2tiZXJyeVwiXG4gIH1dLFxuICBbXCJzYWZhcmlcIiwgL1xcYnZlcnNpb25cXC8oWzAtOS5dKyg/OiBiZXRhKT8pKD86IG1vYmlsZSg/OlxcL1thLXowLTldKyk/KT8gc2FmYXJpXFwvL10sXG4gIC8vIOWmguaenOS4jeiDveiiq+ivhuWIq+S4uiBTYWZhcmnvvIzliJnnjJzmtYvmmK8gV2ViVmlld+OAglxuICBbXCJ3ZWJ2aWV3XCIsIC9cXGJjcHUoPzogaXBob25lKT8gb3MgKD86WzAtOS5fXSspLitcXGJhcHBsZXdlYmtpdFxcYi9dLFxuICBbXCJmaXJlZm94XCIsIC9cXGJmaXJlZm94XFwvKFswLTkuYWJdKykvXSxcbiAgW1wibm9raWFcIiwgL1xcYm5va2lhYnJvd3NlclxcLyhbMC05Ll0rKS9dXG5dXG5cbnZhciBuYSA9IHtcbiAgbmFtZTogXCJuYVwiLFxuICB2ZXJzaW9uOiBOQV9WRVJTSU9OXG59XG5cbi8vIFVzZXJBZ2VudCBEZXRlY3Rvci5cbi8vIEBwYXJhbSB7U3RyaW5nfSB1YSwgdXNlckFnZW50LlxuLy8gQHBhcmFtIHtPYmplY3R9IGV4cHJlc3Npb25cbi8vIEByZXR1cm4ge09iamVjdH1cbi8vICAgIOi/lOWbniBudWxsIOihqOekuuW9k+WJjeihqOi+vuW8j+acquWMuemFjeaIkOWKn+OAglxuZnVuY3Rpb24gZGV0ZWN0IChuYW1lLCBleHByZXNzaW9uLCB1YSkge1xuICB2YXIgZXhwciA9IGlzRnVuY3Rpb24oZXhwcmVzc2lvbikgPyBleHByZXNzaW9uLmNhbGwobnVsbCwgdWEpIDogZXhwcmVzc2lvblxuICBpZiAoIWV4cHIpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIHZhciBpbmZvID0ge1xuICAgIG5hbWU6IG5hbWUsXG4gICAgdmVyc2lvbjogTkFfVkVSU0lPTixcbiAgICBjb2RlbmFtZTogXCJcIlxuICB9XG4gIHZhciB0ID0gdG9TdHJpbmcoZXhwcilcbiAgaWYgKGV4cHIgPT09IHRydWUpIHtcbiAgICByZXR1cm4gaW5mb1xuICB9IGVsc2UgaWYgKHQgPT09IFwiW29iamVjdCBTdHJpbmddXCIpIHtcbiAgICBpZiAodWEuaW5kZXhPZihleHByKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiBpbmZvXG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGV4cHIpKSB7IC8vIE9iamVjdFxuICAgIGlmIChleHByLmhhc093blByb3BlcnR5KFwidmVyc2lvblwiKSkge1xuICAgICAgaW5mby52ZXJzaW9uID0gZXhwci52ZXJzaW9uXG4gICAgfVxuICAgIHJldHVybiBpbmZvXG4gIH0gZWxzZSBpZiAoZXhwci5leGVjKSB7IC8vIFJlZ0V4cFxuICAgIHZhciBtID0gZXhwci5leGVjKHVhKVxuICAgIGlmIChtKSB7XG4gICAgICBpZiAobS5sZW5ndGggPj0gMiAmJiBtWzFdKSB7XG4gICAgICAgIGluZm8udmVyc2lvbiA9IG1bMV0ucmVwbGFjZSgvXy9nLCBcIi5cIilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZm8udmVyc2lvbiA9IE5BX1ZFUlNJT05cbiAgICAgIH1cbiAgICAgIHJldHVybiBpbmZvXG4gICAgfVxuICB9XG59XG5cbi8vIOWIneWni+WMluivhuWIq+OAglxuZnVuY3Rpb24gaW5pdCAodWEsIHBhdHRlcm5zLCBmYWN0b3J5LCBkZXRlY3Rvcikge1xuICB2YXIgZGV0ZWN0ZWQgPSBuYVxuICBlYWNoKHBhdHRlcm5zLCBmdW5jdGlvbiAocGF0dGVybikge1xuICAgIHZhciBkID0gZGV0ZWN0KHBhdHRlcm5bMF0sIHBhdHRlcm5bMV0sIHVhKVxuICAgIGlmIChkKSB7XG4gICAgICBkZXRlY3RlZCA9IGRcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfSlcbiAgZmFjdG9yeS5jYWxsKGRldGVjdG9yLCBkZXRlY3RlZC5uYW1lLCBkZXRlY3RlZC52ZXJzaW9uKVxufVxuXG4vLyDop6PmnpAgVXNlckFnZW50IOWtl+espuS4slxuLy8gQHBhcmFtIHtTdHJpbmd9IHVhLCB1c2VyQWdlbnQgc3RyaW5nLlxuLy8gQHJldHVybiB7T2JqZWN0fVxudmFyIHBhcnNlID0gZnVuY3Rpb24gKHVhKSB7XG4gIHVhID0gKHVhIHx8IFwiXCIpLnRvTG93ZXJDYXNlKClcbiAgdmFyIGQgPSB7fVxuXG4gIGluaXQodWEsIERFVklDRVMsIGZ1bmN0aW9uIChuYW1lLCB2ZXJzaW9uKSB7XG4gICAgdmFyIHYgPSBwYXJzZUZsb2F0KHZlcnNpb24pXG4gICAgZC5kZXZpY2UgPSB7XG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgdmVyc2lvbjogdixcbiAgICAgIGZ1bGxWZXJzaW9uOiB2ZXJzaW9uXG4gICAgfVxuICAgIGQuZGV2aWNlW25hbWVdID0gdlxuICB9LCBkKVxuXG4gIGluaXQodWEsIE9TLCBmdW5jdGlvbiAobmFtZSwgdmVyc2lvbikge1xuICAgIHZhciB2ID0gcGFyc2VGbG9hdCh2ZXJzaW9uKVxuICAgIGQub3MgPSB7XG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgdmVyc2lvbjogdixcbiAgICAgIGZ1bGxWZXJzaW9uOiB2ZXJzaW9uXG4gICAgfVxuICAgIGQub3NbbmFtZV0gPSB2XG4gIH0sIGQpXG5cbiAgdmFyIGllQ29yZSA9IElFTW9kZSh1YSlcblxuICBpbml0KHVhLCBFTkdJTkUsIGZ1bmN0aW9uIChuYW1lLCB2ZXJzaW9uKSB7XG4gICAgdmFyIG1vZGUgPSB2ZXJzaW9uXG4gICAgLy8gSUUg5YaF5qC455qE5rWP6KeI5Zmo77yM5L+u5aSN54mI5pys5Y+35Y+K5YW85a655qih5byP44CCXG4gICAgaWYgKGllQ29yZSkge1xuICAgICAgdmVyc2lvbiA9IGllQ29yZS5lbmdpbmVWZXJzaW9uIHx8IGllQ29yZS5lbmdpbmVNb2RlXG4gICAgICBtb2RlID0gaWVDb3JlLmVuZ2luZU1vZGVcbiAgICB9XG4gICAgdmFyIHYgPSBwYXJzZUZsb2F0KHZlcnNpb24pXG4gICAgZC5lbmdpbmUgPSB7XG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgdmVyc2lvbjogdixcbiAgICAgIGZ1bGxWZXJzaW9uOiB2ZXJzaW9uLFxuICAgICAgbW9kZTogcGFyc2VGbG9hdChtb2RlKSxcbiAgICAgIGZ1bGxNb2RlOiBtb2RlLFxuICAgICAgY29tcGF0aWJsZTogaWVDb3JlID8gaWVDb3JlLmNvbXBhdGlibGUgOiBmYWxzZVxuICAgIH1cbiAgICBkLmVuZ2luZVtuYW1lXSA9IHZcbiAgfSwgZClcblxuICBpbml0KHVhLCBCUk9XU0VSLCBmdW5jdGlvbiAobmFtZSwgdmVyc2lvbikge1xuICAgIHZhciBtb2RlID0gdmVyc2lvblxuICAgIC8vIElFIOWGheaguOeahOa1j+iniOWZqO+8jOS/ruWkjea1j+iniOWZqOeJiOacrOWPiuWFvOWuueaooeW8j+OAglxuICAgIGlmIChpZUNvcmUpIHtcbiAgICAgIC8vIOS7heS/ruaUuSBJRSDmtY/op4jlmajnmoTniYjmnKzvvIzlhbbku5YgSUUg5YaF5qC455qE54mI5pys5LiN5L+u5pS544CCXG4gICAgICBpZiAobmFtZSA9PT0gXCJpZVwiKSB7XG4gICAgICAgIHZlcnNpb24gPSBpZUNvcmUuYnJvd3NlclZlcnNpb25cbiAgICAgIH1cbiAgICAgIG1vZGUgPSBpZUNvcmUuYnJvd3Nlck1vZGVcbiAgICB9XG4gICAgdmFyIHYgPSBwYXJzZUZsb2F0KHZlcnNpb24pXG4gICAgZC5icm93c2VyID0ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHZlcnNpb246IHYsXG4gICAgICBmdWxsVmVyc2lvbjogdmVyc2lvbixcbiAgICAgIG1vZGU6IHBhcnNlRmxvYXQobW9kZSksXG4gICAgICBmdWxsTW9kZTogbW9kZSxcbiAgICAgIGNvbXBhdGlibGU6IGllQ29yZSA/IGllQ29yZS5jb21wYXRpYmxlIDogZmFsc2VcbiAgICB9XG4gICAgZC5icm93c2VyW25hbWVdID0gdlxuICB9LCBkKVxuXG4gIHJldHVybiBkXG59XG5cbmRldGVjdG9yID0gcGFyc2UodXNlckFnZW50ICsgXCIgXCIgKyBhcHBWZXJzaW9uICsgXCIgXCIgKyB2ZW5kb3IpXG5cbm1vZHVsZS5leHBvcnRzID0gZGV0ZWN0b3JcbiIsIi8vIEF1dGhvcjogQXdleVxuLy8gZW1haWw6IGNoZW53ZWkxQHJvbmdjYXBpdGFsLmNuXG47XG52YXIgX19hamF4SGFja2VyID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gaXNGdW5jIChmKSB7XG4gICAgcmV0dXJuIGYgJiYgdHlwZW9mIGYgPT09IFwiZnVuY3Rpb25cIlxuICB9XG5cbiAgZnVuY3Rpb24gc2V0UmVhZE9ubHlQcm9wc0Zyb21YaHIgKGhhamF4LCB4aHIpIHtcbiAgICB2YXIgcHJvcHMgPSB7XG4gICAgICBVTlNFTlQ6IDAsXG4gICAgICBPUEVORUQ6IDEsXG4gICAgICBIRUFERVJTX19SRUNFSVZFRDogMixcbiAgICAgIExPQURJTkc6IDMsXG4gICAgICBET05FOiA0LFxuICAgICAgcmVhZHlTdGF0ZTogbnVsbCxcbiAgICAgIHN0YXR1czogMCxcbiAgICAgIHN0YXR1c1RleHQ6IFwiXCIsXG4gICAgICByZXNwb25zZTogXCJcIixcbiAgICAgIHJlc3BvbnNlVGV4dDogXCJcIixcbiAgICAgIHJlc3BvbnNlVVJMOiBcIlwiLFxuICAgICAgcmVzcG9uc2VYTUw6IG51bGxcbiAgICB9XG4gICAgZm9yICh2YXIga2V5IGluIHByb3BzKSB7XG4gICAgICBoYWpheFtrZXldID0gcHJvcHNba2V5XVxuICAgICAgaWYgKHhocikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGhhamF4W2tleV0gPSB4aHJba2V5XVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZEV2ZW50UHJvcHMgKHhociwgaXNVcGxvYWQpIHtcbiAgICB4aHIub25hYm9ydCA9IG51bGxcbiAgICB4aHIub25lcnJvciA9IG51bGxcbiAgICB4aHIub25sb2FkID0gbnVsbFxuICAgIHhoci5vbmxvYWRlbmQgPSBudWxsXG4gICAgeGhyLm9ubG9hZHN0YXJ0ID0gbnVsbFxuICAgIHhoci5vbnByb2dyZXNzID0gbnVsbFxuICAgIHhoci5vbnRpbWVvdXQgPSBudWxsXG4gICAgaWYgKCFpc1VwbG9hZCkgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGxcbiAgICB4aHIuX19ldmVudHMgPSB7XG4gICAgICBhYm9ydDogW10sXG4gICAgICBlcnJvcjogW10sXG4gICAgICBsb2FkOiBbXSxcbiAgICAgIGxvYWRlbmQ6IFtdLFxuICAgICAgbG9hZHN0YXJ0OiBbXSxcbiAgICAgIHByb2dyZXNzOiBbXSxcbiAgICAgIHRpbWVvdXQ6IFtdLFxuICAgICAgcmVhZHlzdGF0ZWNoYW5nZTogW11cbiAgICB9XG4gICAgaWYgKCFpc1VwbG9hZCkgeGhyLl9fZXZlbnRzLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IFtdXG4gIH1cblxuICBmdW5jdGlvbiBpbml0QmFzZUV2ZW50IChfdGhpcykge1xuICAgIGZvciAodmFyIGtleSBpbiBfdGhpcy5fX2V2ZW50cykge1xuICAgICAgX3RoaXMuX19ldmVudHNba2V5XVswXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2V0UmVhZE9ubHlQcm9wc0Zyb21YaHIoX3RoaXMsIF90aGlzLl9feGhyKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUV2ZW50IChfdGhpcywgdHlwZSwgY29uZmlnLCBpc1VwbG9hZCkge1xuICAgIHZhciBhcmRUeXBlID0gdHlwZS5zdWJzdHJpbmcoMikgLy8gYWRkRXZlbnRMaXN0ZW5lci9yZW1vdmVFdmVudExpc3RlbmVyL2Rpc3BhdGNoRXZlbnRcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF9fYXJndW1lbnRzID0gYXJndW1lbnRzXG4gICAgICB2YXIgYXJncyA9IFtdXG4gICAgICB2YXIgbmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdHJpZ2dlciBhcmRUeXBlXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgX3RoaXMuX19ldmVudHNbYXJkVHlwZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAvLyBpZiAoaXNGdW5jKF90aGlzLl9fZXZlbnRzW2FyZFR5cGVdW2ldKSkgX3RoaXMuX19ldmVudHNbYXJkVHlwZV1baV0uYXBwbHkoX3RoaXMuX194aHIsIGFyZ3MpXG4gICAgICAgICAgaWYgKGlzRnVuYyhfdGhpcy5fX2V2ZW50c1thcmRUeXBlXVtpXSkpIF90aGlzLl9fZXZlbnRzW2FyZFR5cGVdW2ldLmFwcGx5KF90aGlzLCBhcmdzKVxuICAgICAgICB9XG4gICAgICAgIC8vIHRyaWdnZXIgb25UeXBlXG4gICAgICAgIGlmIChpc0Z1bmMoX3RoaXNbdHlwZV0pKSB7XG4gICAgICAgICAgLy8gX3RoaXNbdHlwZV0uYXBwbHkoX3RoaXMuX194aHIsIF9fYXJndW1lbnRzKSAvLyBnaXZlIHhociBiYWNrIHdoZW4gY2FsbGluZyBldmVudHNcbiAgICAgICAgICBfdGhpc1t0eXBlXS5hcHBseShfdGhpcywgX19hcmd1bWVudHMpIC8vIGdpdmUgeGhyIGJhY2sgd2hlbiBjYWxsaW5nIGV2ZW50c1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBmaXJzdCB0cmlnZ2VyIGJhc2UgZXZlbnQgdG8gY2hhbmdlIGhhamF4IHN0YXR1c1xuICAgICAgLy8gX3RoaXMuX19ldmVudHNbYXJkVHlwZV1bMF0uYXBwbHkoX3RoaXMuX194aHIsIGFyZ3MpXG4gICAgICBfdGhpcy5fX2V2ZW50c1thcmRUeXBlXVswXS5hcHBseShfdGhpcywgYXJncylcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSlcbiAgICAgIH1cbiAgICAgIGlmIChpc0Z1bmMoY29uZmlnW3R5cGVdKSkge1xuICAgICAgICBhcmdzLnB1c2gobmV4dClcbiAgICAgICAgLy8gY29uZmlnW3R5cGVdLmFwcGx5KF90aGlzLl9feGhyLCBhcmdzKVxuICAgICAgICBjb25maWdbdHlwZV0uYXBwbHkoX3RoaXMsIGFyZ3MpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0KClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVNZXRob2QgKF90aGlzLCB0eXBlLCBhcmdzLCBuZXh0KSB7XG4gICAgdmFyIF9hcmdzID0gW11cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIF9hcmdzLnB1c2goYXJnc1tpXSlcbiAgICB9XG4gICAgX2FyZ3MudW5zaGlmdChuZXh0KVxuICAgIGlmIChpc0Z1bmMoX3RoaXMuX19jb25maWdbdHlwZV0pKSB7XG4gICAgICAvLyBfdGhpcy5fX2NvbmZpZ1t0eXBlXS5hcHBseShfdGhpcy5fX3hociwgX2FyZ3MpXG4gICAgICBfdGhpcy5fX2NvbmZpZ1t0eXBlXS5hcHBseShfdGhpcywgX2FyZ3MpXG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHQoKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIEV2ZW50ICgpIHt9XG4gIEV2ZW50LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKSB7XG4gICAgLy8gdGhpcy5fX3hoci5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKVxuICAgIHRoaXMuX19ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcilcbiAgfVxuICBFdmVudC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uICh0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSkge1xuICAgIHZhciBldnRzID0gdGhpcy5fX2V2ZW50c1t0eXBlXVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGV2dHNbaV0gIT09IGxpc3RlbmVyKSB7XG4gICAgICAgIGV2dHMuc3BsaWNlKGksIDEpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIEV2ZW50LnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdGhpcy5fX3hoci5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICB9XG5cbiAgZnVuY3Rpb24gSGFqYXggKHhociwgY29uZmlnKSB7XG4gICAgdGhpcy5fX2NvbmZpZyA9IGNvbmZpZ1xuICAgIHRoaXMuX194aHIgPSB4aHJcbiAgICAvLyBwcm9wc1xuICAgIHNldFJlYWRPbmx5UHJvcHNGcm9tWGhyKHRoaXMpXG4gICAgdGhpcy5yZXNwb25zZVR5cGUgPSBcIlwiIC8vIHImd1xuICAgIHRoaXMudGltZW91dCA9IDAgLy8gciZ3XG4gICAgdGhpcy53aXRoQ3JlZGVudGlhbHMgPSBmYWxzZSAvLyByJndcbiAgICAvLyBldmVudHMgcHJvcHNcbiAgICBhZGRFdmVudFByb3BzKHRoaXMpXG4gICAgaW5pdEJhc2VFdmVudCh0aGlzKVxuICAgIC8vIHVwbG9hZCBwcm9wXG4gICAgdGhpcy5fX3VwbG9hZCA9IHhoci51cGxvYWRcbiAgICB0aGlzLnVwbG9hZCA9IG5ldyBFdmVudCgpXG4gICAgdGhpcy51cGxvYWQuX194aHIgPSB0aGlzLl9feGhyXG4gICAgYWRkRXZlbnRQcm9wcyh0aGlzLnVwbG9hZCwgdHJ1ZSlcbiAgICBpbml0QmFzZUV2ZW50KHRoaXMudXBsb2FkKVxuICB9XG5cbiAgLy8gbWV0aG9kc1xuICBIYWpheC5wcm90b3R5cGUgPSBuZXcgRXZlbnQoKVxuICBIYWpheC5wcm90b3R5cGUub3BlbiA9IGZ1bmN0aW9uIChtZXRob2QsIHVybCwgYXN5bmMsIHVzZXIsIHBhc3N3b3JkKSB7XG4gICAgdmFyIF90aGlzID0gdGhpc1xuICAgIGhhbmRsZU1ldGhvZChfdGhpcywgXCJiZWZvcmVPcGVuXCIsIGFyZ3VtZW50cywgZnVuY3Rpb24gKCkge1xuICAgICAgX3RoaXMuX194aHIub3BlbihtZXRob2QsIHVybCwgYXN5bmMsIHVzZXIsIHBhc3N3b3JkKVxuICAgICAgc2V0UmVhZE9ubHlQcm9wc0Zyb21YaHIoX3RoaXMsIF90aGlzLl9feGhyKVxuICAgIH0pXG4gIH1cbiAgSGFqYXgucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbiAoYm9keSkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIGhhbmRsZU1ldGhvZCh0aGF0LCBcImJlZm9yZVNlbmRcIiwgYXJndW1lbnRzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBzZXQgcmVhZGFibGUvd3JpdGFibGUgcHJvcHNcbiAgICAgIHRoYXQuX194aHIucmVzcG9uc2VUeXBlID0gdGhhdC5fX2NvbmZpZy5yZXNwb25zZVR5cGUgfHwgXCJcIlxuICAgICAgdGhhdC5fX3hoci50aW1lb3V0ID0gdGhhdC5fX2NvbmZpZy50aW1lb3V0IHx8IHRoYXQudGltZW91dFxuICAgICAgdGhhdC5fX3hoci53aXRoQ3JlZGVudGlhbHMgPSB0aGF0Ll9fY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCB0aGF0LndpdGhDcmVkZW50aWFsc1xuICAgICAgdmFyIGtleVxuICAgICAgLy8gc2V0IGV2ZW50c1xuICAgICAgZm9yIChrZXkgaW4gdGhhdC5fX3hocikge1xuICAgICAgICBpZiAoL15vbi9nLnRlc3Qoa2V5KSkge1xuICAgICAgICAgIHRoYXQuX194aHJba2V5XSA9IGhhbmRsZUV2ZW50KHRoYXQsIGtleSwgdGhhdC5fX2NvbmZpZyB8fCB7fSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChrZXkgaW4gdGhhdC5fX3VwbG9hZCkge1xuICAgICAgICBpZiAoL15vbi9nLnRlc3Qoa2V5KSkge1xuICAgICAgICAgIHRoYXQuX191cGxvYWRba2V5XSA9IGhhbmRsZUV2ZW50KHRoYXQudXBsb2FkLCBrZXksIHRoYXQuX19jb25maWcudXBsb2FkIHx8IHt9LCB0cnVlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGF0Ll9feGhyLnNlbmQoYm9keSlcbiAgICAgIHNldFJlYWRPbmx5UHJvcHNGcm9tWGhyKHRoYXQsIHRoYXQuX194aHIpXG4gICAgfSlcbiAgfVxuICBIYWpheC5wcm90b3R5cGUuYWJvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpc1xuICAgIGhhbmRsZU1ldGhvZChfdGhpcywgXCJiZWZvcmVBYm9yZFwiLCBhcmd1bWVudHMsIGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzLl9feGhyLmFib3J0KClcbiAgICAgIHNldFJlYWRPbmx5UHJvcHNGcm9tWGhyKF90aGlzLCBfdGhpcy5fX3hocilcbiAgICB9KVxuICB9XG5cbiAgSGFqYXgucHJvdG90eXBlLnNldFJlcXVlc3RIZWFkZXIgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLl9feGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpXG4gIH1cbiAgSGFqYXgucHJvdG90eXBlLmdldEFsbFJlc3BvbnNlSGVhZGVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9feGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpXG4gIH1cbiAgSGFqYXgucHJvdG90eXBlLm92ZXJyaWRlTWltZVR5cGUgPSBmdW5jdGlvbiAobWltZSkge1xuICAgIHRoaXMuX194aHIub3ZlcnJpZGVNaW1lVHlwZShtaW1lKVxuICB9XG4gIEhhamF4LnByb3RvdHlwZS5nZXRSZXNwb25zZUhlYWRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9feGhyLmdldFJlc3BvbnNlSGVhZGVyKG5hbWUpXG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgIC8vIFhNTEh0dHBSZXF1ZXN0LCBBY3RpdmVYT2JqZWN0IGFuZCBYRG9tYWluUmVxdWVzdFxuICAgIGlmICh3aW5kb3cuX19YSFJBbHJlYWR5TW9kaWZpZWQpIHJldHVybiBmYWxzZVxuICAgIHZhciBYSFJDb25zdHJ1Y3RvclxuICAgIGlmICh3aW5kb3cuWE1MSHR0cFJlcXVlc3QpIHtcbiAgICAgIFhIUkNvbnN0cnVjdG9yID0gd2luZG93LlhNTEh0dHBSZXF1ZXN0XG4gICAgICB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgPSBmdW5jdGlvbiAod2hhdGV2ZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBIYWpheChuZXcgWEhSQ29uc3RydWN0b3IoKSwgY29uZmlnIHx8IHt9KVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAod2luZG93LkFjdGl2ZVhPYmplY3QpIHtcbiAgICAgIFhIUkNvbnN0cnVjdG9yID0gd2luZG93LkFjdGl2ZVhPYmplY3RcbiAgICAgIHdpbmRvdy5BY3RpdmVYT2JqZWN0ID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiTWljcm9zb2Z0LlhNTEhUVFBcIikge1xuICAgICAgICAgIHJldHVybiBuZXcgSGFqYXgobmV3IFhIUkNvbnN0cnVjdG9yKCksIGNvbmZpZyB8fCB7fSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gWEhSQ29uc3RydWN0b3IodHlwZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAod2luZG93LlhEb21haW5SZXF1ZXN0KSB7XG4gICAgICBYSFJDb25zdHJ1Y3RvciA9IHdpbmRvdy5YRG9tYWluUmVxdWVzdFxuICAgICAgd2luZG93LlhEb21haW5SZXF1ZXN0ID0gZnVuY3Rpb24gKHdoYXRldmVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgSGFqYXgobmV3IFhIUkNvbnN0cnVjdG9yKCksIGNvbmZpZyB8fCB7fSlcbiAgICAgIH1cbiAgICB9XG4gICAgd2luZG93Ll9fWEhSQWxyZWFkeU1vZGlmaWVkID0gdHJ1ZVxuICB9XG59KSgpXG5cbm1vZHVsZS5leHBvcnRzID0gX19hamF4SGFja2VyXG4iLCIvKlxuICogQEF1dGhvcjogamlhbmdmZW5nXG4gKiBARGF0ZTogMjAxNy0wOC0yMyAwOTo1NDoxNVxuICogQExhc3QgTW9kaWZpZWQgYnk6IGppYW5nZmVuZ1xuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yMyAwOTo1NDo1NVxuICovXG5cbnZhciB4aHIgPSByZXF1aXJlKFwiLi94aHJXcmFwXCIpXG5cbm1vZHVsZS5leHBvcnRzID0geGhyXG4iLCJ2YXIgY29uZmlnID0gcmVxdWlyZShcIi4uL2NvbmZpZ1wiKVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoXCIuLi9jb21tb25cIilcbnZhciBjb25zdHMgPSByZXF1aXJlKFwiLi4vY29uc3RzXCIpXG52YXIgbG9nID0gcmVxdWlyZShcIi4uL2xvZ1wiKVxudmFyIFRocmlmdCA9IHJlcXVpcmUoXCIuLi90aHJpZnRcIilcbnZhciBrZXBsZXIgPSByZXF1aXJlKFwiLi4va2VwbGVyXCIpXG5cbi8qKlxuICog5Y+R6YCBWEhS6YeH6ZuG5pWw5o2uXG4gKlxuICogQHBhcmFtIHthbnl9IHhoclxuICovXG5mdW5jdGlvbiBzZW5kICh4aHIpIHtcbiAgaWYgKCF4aHIub2spIHJldHVyblxuICBsb2coXCJzZW5kIFhIUiBkYXRhOlwiKVxuICBsb2coeGhyKVxuICB2YXIgdHJhbnNwb3J0ID0gbmV3IFRocmlmdC5UcmFuc3BvcnQoXCJcIilcbiAgdmFyIHByb3RvY29sID0gbmV3IFRocmlmdC5Qcm90b2NvbCh0cmFuc3BvcnQpXG4gIHByb3RvY29sLndyaXRlTWVzc2FnZUJlZ2luKFwiVFdlYkFnZW50QWpheFwiLCBUaHJpZnQuTWVzc2FnZVR5cGUuQ0FMTCwgMClcbiAgdmFyIGVudGl0eSA9IG5ldyBrZXBsZXIuVFdlYkFnZW50QWpheCh4aHIpXG4gIHZhciBzb3VyY2UgPSBjb21tb24uZXh0ZW5kKHt9LCB4aHIsIGNvbW1vbi5pbmZvLnByb3BlcnRpZXMoKSlcbiAgc2VyaWFsaXplKGVudGl0eSwgc291cmNlKVxuICBlbnRpdHkud3JpdGUocHJvdG9jb2wpXG4gIHByb3RvY29sLndyaXRlTWVzc2FnZUVuZCgpXG4gIHZhciBzZW5kVmFsdWUgPSB0cmFuc3BvcnQuZmx1c2goKVxuICB2YXIgeCA9IEpTT04ucGFyc2Uoc2VuZFZhbHVlKVxuICBzZW5kVmFsdWUgPSBKU09OLnN0cmluZ2lmeSh4W3gubGVuZ3RoIC0gMV0pXG4gIGxvZyhzZW5kVmFsdWUpXG4gIHZhciBvcHRpb25zID0ge1xuICAgIHVybDogY29uZmlnLmFwaUhvc3QsXG4gICAgdHlwZTogXCJQT1NUXCIsXG4gICAgY29yczogdHJ1ZSxcbiAgICBkYXRhOiBzZW5kVmFsdWUsXG4gICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIGxvZyhcIuS6i+S7tuWPkemAgei/lOWbnua2iOaBr+mUmeivr1wiKVxuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcbiAgICAgIGxvZyh4aHIuc3RhdHVzKVxuICAgICAgbG9nKHhoci5zdGF0dXNUZXh0KVxuICAgIH0sXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxvZyhcIuS6i+S7tuWPkemAgeWujOavlS5cIilcbiAgICB9XG4gIH1cblxuICBvcHRpb25zLmhlYWRlciA9IHt9XG4gIG9wdGlvbnMuaGVhZGVyW2NvbnN0cy5rZXBsZXJfbWVzc2FnZV90eXBlXSA9IGNvbnN0cy5XRUJfQUpBWFxuICBvcHRpb25zLmhlYWRlcltjb25zdHMua2VwbGVyX2FnZW50X3Rva2VuXSA9IGNvbmZpZy5hZ2VudElkXG4gIG9wdGlvbnMuaGVhZGVyW2NvbnN0cy5rZXBsZXJfY29uZmlnX3ZlcnNpb25dID0gY29uZmlnLkxJQl9WRVJTSU9OXG5cbiAgY29tbW9uLmFqYXgob3B0aW9ucylcbn1cblxuZnVuY3Rpb24gc2VuZEJhdGNoICh4aHJzKSB7XG4gIGxvZyhcInNlbmQgWEhSUyBkYXRhOlwiKVxuICBsb2coeGhycylcbiAgdmFyIHRyYW5zcG9ydCA9IG5ldyBUaHJpZnQuVHJhbnNwb3J0KFwiXCIpXG4gIHZhciBwcm90b2NvbCA9IG5ldyBUaHJpZnQuUHJvdG9jb2wodHJhbnNwb3J0KVxuICBwcm90b2NvbC53cml0ZU1lc3NhZ2VCZWdpbihcIlRXZWJBZ2VudEFqYXhCYXRjaFwiLCBUaHJpZnQuTWVzc2FnZVR5cGUuQ0FMTCwgMClcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHhocnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIgeGhyID0geGhyc1tpXVxuICAgIHZhciBlbnRpdHkgPSBuZXcga2VwbGVyLlRXZWJBZ2VudEFqYXgoeGhyKVxuICAgIHZhciBzb3VyY2UgPSBjb21tb24uZXh0ZW5kKHt9LCB4aHIsIGNvbW1vbi5pbmZvLnByb3BlcnRpZXMoKSlcbiAgICBzZXJpYWxpemUoZW50aXR5LCBzb3VyY2UpXG4gICAgeGhyc1tpXSA9IGVudGl0eVxuICB9XG4gIHZhciBiYXRjaCA9IHtcbiAgICBhamF4QmF0Y2g6IHhocnNcbiAgfVxuICB2YXIgcGF0Y2ggPSBuZXcga2VwbGVyLlRXZWJBZ2VudEFqYXhCYXRjaChiYXRjaClcbiAgcGF0Y2gud3JpdGUocHJvdG9jb2wpXG4gIHByb3RvY29sLndyaXRlTWVzc2FnZUVuZCgpXG4gIHZhciBzZW5kVmFsdWUgPSB0cmFuc3BvcnQuZmx1c2goKVxuICB2YXIgeCA9IEpTT04ucGFyc2Uoc2VuZFZhbHVlKVxuICBzZW5kVmFsdWUgPSBKU09OLnN0cmluZ2lmeSh4W3gubGVuZ3RoIC0gMV0pXG4gIGxvZyhzZW5kVmFsdWUpXG4gIHZhciBvcHRpb25zID0ge1xuICAgIHVybDogY29uZmlnLmFwaUhvc3QsXG4gICAgdHlwZTogXCJQT1NUXCIsXG4gICAgY29yczogdHJ1ZSxcbiAgICBkYXRhOiBzZW5kVmFsdWUsXG4gICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIGxvZyhcIuS6i+S7tuWPkemAgei/lOWbnua2iOaBr+mUmeivr1wiKVxuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcbiAgICAgIGxvZyh4aHIuc3RhdHVzKVxuICAgICAgbG9nKHhoci5zdGF0dXNUZXh0KVxuICAgIH0sXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxvZyhcIuS6i+S7tuWPkemAgeWujOavlS5cIilcbiAgICB9XG4gIH1cblxuICBvcHRpb25zLmhlYWRlciA9IHt9XG4gIG9wdGlvbnMuaGVhZGVyW2NvbnN0cy5rZXBsZXJfbWVzc2FnZV90eXBlXSA9IGNvbnN0cy5XRUJfQUpBWF9CQVRDSFxuICBvcHRpb25zLmhlYWRlcltjb25zdHMua2VwbGVyX2FnZW50X3Rva2VuXSA9IGNvbmZpZy5hZ2VudElkXG4gIG9wdGlvbnMuaGVhZGVyW2NvbnN0cy5rZXBsZXJfY29uZmlnX3ZlcnNpb25dID0gY29uZmlnLkxJQl9WRVJTSU9OXG5cbiAgY29tbW9uLmFqYXgob3B0aW9ucylcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplIChlbnRpdHksIG9iaikge1xuICBlbnRpdHkuYWdlbnRJZCA9IGNvbmZpZy5hZ2VudElkXG4gIGVudGl0eS50aWVySWQgPSBjb25maWcudGllcklkXG4gIGVudGl0eS5hcHBJZCA9IGNvbmZpZy5hcHBJZFxuICBlbnRpdHkudHJhY2VJZCA9IGNvbW1vbi5VVUlEKClcbiAgZW50aXR5LnVybERvbWFpbiA9IGRvY3VtZW50LmRvbWFpbiB8fCB3aW5kb3cubG9jYXRpb24uaG9zdFxuICBlbnRpdHkucmVwb3J0VGltZSA9IG5ldyBEYXRlKCkgKiAxXG4gIGVudGl0eS5sb2FkZWRUaW1lID0gb2JqLmFsbFRpbWUgfHwgLTFcbiAgZW50aXR5LmJyb3dzZXIgPSBvYmouYnJvd3NlclxuICBlbnRpdHkudXJsUXVlcnkgPSBvYmoucGFnZV91cmxfcGF0aFxuXG4gIGVudGl0eS5iYWNrdXBQcm9wZXJ0aWVzID0ge1xuICAgIFwib3NcIjogb2JqLm9zLFxuICAgIFwib3NfdmVyc2lvblwiOiBvYmoub3NfdmVyc2lvbixcbiAgICBcImRldmljZVwiOiBvYmouZGV2aWNlLFxuICAgIFwiZGV2aWNlX3ZlcnNpb25cIjogb2JqLmRldmljZV92ZXJzaW9uLFxuICAgIFwiYnJvd3Nlcl9lbmdpbmVcIjogb2JqLmJyb3dzZXJfZW5naW5lLFxuICAgIFwicGFnZV90aXRsZVwiOiBvYmoucGFnZV90aXRsZSxcbiAgICBcInBhZ2VfaDFcIjogb2JqLnBhZ2VfaDEsXG4gICAgXCJwYWdlX3JlZmVycmVyXCI6IG9iai5wYWdlX3JlZmVycmVyLFxuICAgIFwicGFnZV91cmxcIjogb2JqLnBhZ2VfdXJsLFxuICAgIFwicGFnZV91cmxfcGF0aFwiOiBvYmoucGFnZV91cmxfcGF0aCxcbiAgICBcImxpYlwiOiBvYmoubGliLFxuICAgIFwibGliX3ZlcnNpb25cIjogb2JqLmxpYl92ZXJzaW9uLFxuICAgIFwiYnJvd3Nlcl92ZXJzaW9uXCI6IG9iai5icm93c2VyX3ZlcnNpb24sXG4gICAgXCJzdGFydFRpbWVcIjogb2JqLnN0YXJ0VGltZSxcbiAgICBcImVuZFRpbWVcIjogb2JqLmVuZFRpbWUsXG4gICAgXCJzdGF0dXNcIjogb2JqLnN0YXR1cyB8fCAwLFxuICAgIFwiZGF0YVNpemVcIjogb2JqLmRhdGFTaXplIHx8IDBcbiAgfVxuXG4gIGVudGl0eS5iYWNrdXBRdW90YSA9IHtcbiAgICBcInNjcmVlbl9oZWlnaHRcIjogb2JqLnNjcmVlbl9oZWlnaHQsXG4gICAgXCJzY3JlZW5fd2lkdGhcIjogb2JqLnNjcmVlbl93aWR0aFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZW5kOiBzZW5kLFxuICBzZW5kQmF0Y2g6IHNlbmRCYXRjaFxufVxuIiwiLypcbiAqIEBBdXRob3I6IGppYW5nZmVuZ1xuICogQERhdGU6IDIwMTctMDgtMjIgMTE6MzA6MTNcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiBqaWFuZ2ZlbmdcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMTAtMTcgMTQ6Mjg6NTlcbiAqL1xuXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4uL2NvbmZpZ1wiKVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoXCIuLi9jb21tb25cIilcbnZhciBsb2cgPSByZXF1aXJlKFwiLi4vbG9nXCIpXG52YXIgSlNPTiA9IHJlcXVpcmUoXCIuLi9qc29uXCIpXG52YXIgZXZlbnRFbWl0dGVyID0gcmVxdWlyZShcIi4uL2V2ZW50RW1pdHRlclwiKS5jcmVhdGUoKVxuXG52YXIgc2VuZGVyID0gcmVxdWlyZShcIi4vc2VuZGVyXCIpXG52YXIgc2luZ2xlRXZlbnROYW1lID0gXCJ4aHItd3JhcFwiXG5ldmVudEVtaXR0ZXIub24oc2luZ2xlRXZlbnROYW1lLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNwbGljZS5jYWxsKGFyZ3VtZW50cywgMClcbiAgdmFyIG1ldGhvZCA9IGFyZ3NbMF1cbiAgc3dpdGNoIChtZXRob2QpIHtcbiAgY2FzZSBcImNvbGxlY3RcIjpcbiAgICBjb2xsZWN0KGFyZ3NbMV0pXG4gICAgYnJlYWtcbiAgY2FzZSBcInNlbmRcIjpcbiAgICBzZW5kKClcbiAgICBicmVha1xuICBkZWZhdWx0OlxuICAgIGJyZWFrXG4gIH1cbn0pXG52YXIgeGhycyA9IFtdXG5cbmZ1bmN0aW9uIGNvbGxlY3QgKHBlcmZvcm1hbmNlKSB7XG4gIGlmIChwZXJmb3JtYW5jZS5fX2FwbV94aHJfXykgcmV0dXJuXG4gIHZhciB0cmFjaW5nSWQgPSBwZXJmb3JtYW5jZS50cmFjaW5nSWRcbiAgdmFyIGluZGV4XG4gIGZvciAoaW5kZXggaW4geGhycykge1xuICAgIGlmICh4aHJzW2luZGV4XSAmJiB4aHJzW2luZGV4XS50cmFjaW5nSWQgJiYgeGhyc1tpbmRleF0udHJhY2luZ0lkID09PSB0cmFjaW5nSWQpIHtcbiAgICAgIHhocnNbaW5kZXhdID0gY29tbW9uLmV4dGVuZCh4aHJzW2luZGV4XSwgcGVyZm9ybWFuY2UpXG4gICAgICByZXR1cm5cbiAgICB9XG4gIH1cbiAgbG9nKFwiY29sbGVjdGVkIGEgeGhyIDpcIiwgcGVyZm9ybWFuY2UpXG4gIHhocnMucHVzaChwZXJmb3JtYW5jZSlcbn1cblxuLyoqXG4gKiDojrflj5bov5Tlm57kvZPnmoTmlbDmja7lpKflsI9cbiAqXG4gKiBAcGFyYW0ge2FueX0gb2JqXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBnZXRSZXNwb25zZVNpemUgKG9iaikge1xuICBpZiAodHlwZW9mIG9iaiA9PT0gXCJzdHJpbmdcIiAmJiBvYmoubGVuZ3RoKSByZXR1cm4gb2JqLmxlbmd0aFxuICBpZiAodHlwZW9mIG9iaiAhPT0gXCJvYmplY3RcIikgcmV0dXJuIHZvaWQgMFxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSBcInVuZGVmaW5lZFwiICYmIG9iaiBpbnN0YW5jZW9mIEFycmF5QnVmZmVyICYmIG9iai5ieXRlTGVuZ3RoKSByZXR1cm4gb2JqLmJ5dGVMZW5ndGhcbiAgaWYgKHR5cGVvZiBCbG9iICE9PSBcInVuZGVmaW5lZFwiICYmIG9iaiBpbnN0YW5jZW9mIEJsb2IgJiYgb2JqLnNpemUpIHJldHVybiBvYmouc2l6ZVxuICBpZiAodHlwZW9mIEZvcm1EYXRhICE9PSBcInVuZGVmaW5lZFwiICYmIG9iaiBpbnN0YW5jZW9mIEZvcm1EYXRhKSByZXR1cm4gdm9pZCAwXG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaikubGVuZ3RoXG4gIH0gY2F0Y2ggKGIpIHtcbiAgICByZXR1cm4gdm9pZCAwXG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VYSFJVcmwgKG9iaiwgdXJsKSB7XG4gIHZhciBwYXJzZWRVcmwgPSBjb21tb24ucGFyc2VVcmwodXJsKVxuICBvYmouaG9zdCA9IHBhcnNlZFVybC5ob3N0bmFtZSArIFwiOlwiICsgcGFyc2VkVXJsLnBvcnRcbiAgb2JqLnBhdGhuYW1lID0gcGFyc2VkVXJsLnBhdGhuYW1lXG4gIG9iai5zYW1lT3JpZ2luID0gcGFyc2VkVXJsLnNhbWVPcmlnaW5cbn1cblxuLyogZnVuY3Rpb24gZ2V0WEhSQ29udGVudExlbmd0aCAoeGhyKSB7XG4gIHZhciBsZW5cbiAgc3dpdGNoICh4aHIuY29udGVudFR5cGUpIHtcbiAgY2FzZSBcImFwcGxpY2F0aW9uL2pzb25cIjpcbiAgICBsZW4gPSBKU09OLnN0cmluZ2lmeSh4aHIuZGF0YSlcbiAgICBicmVha1xuICB9XG59ICovXG5cbi8qIGZ1bmN0aW9uIG9uRW5kICh4aHIpIHtcbiAgdmFyIHhoclBhcmFtcyA9IHRoaXMucGFyYW1zXG4gIHZhciB4aHJNYXRyaWNzID0gdGhpcy5tZXRyaWNzXG4gIGlmICghdGhpcy5lbmRlZCkge1xuICAgIHRoaXMuZW5kZWQgPSB0cnVlXG4gICAgaWYgKHhoci5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICBmb3IgKHZhciBlID0gMDsgc3RhdHVzTGVuZ3RoID4gZTsgZSsrKSB7XG4gICAgICAgIHhoci5yZW1vdmVFdmVudExpc3RlbmVyKHhockV2ZW50c1tlXSwgdGhpcy5saXN0ZW5lciwgZmFsc2UpXG4gICAgICB9XG4gICAgfVxuICAgIGlmICgheGhyUGFyYW1zLmFib3J0ZWQpIHtcbiAgICAgIHhock1hdHJpY3MuZHVyYXRpb24gPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpIC0gdGhpcy5zdGFydFRpbWVcbiAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICB4aHJQYXJhbXMuc3RhdHVzID0geGhyLnN0YXR1c1xuICAgICAgICB2YXIgcmVzVHlwZSA9IHhoci5yZXNwb25zZVR5cGVcbiAgICAgICAgdmFyIHJlc0JvZHkgPSByZXNUeXBlID09PSBcImFycmF5YnVmZmVyXCIgfHwgcmVzVHlwZSA9PT0gXCJibG9iXCIgfHwgcmVzVHlwZSA9PT0gXCJqc29uXCIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0XG4gICAgICAgIHZhciBkYXRhU2l6ZSA9IGdldFJlc3BvbnNlU2l6ZShyZXNCb2R5KVxuXG4gICAgICAgIGlmIChkYXRhU2l6ZSkge1xuICAgICAgICAgIHhock1hdHJpY3MucnhTaXplID0gZGF0YVNpemVcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeGhyUGFyYW1zLnN0YXR1cyA9IDBcbiAgICAgIH1cbiAgICAgIHhock1hdHJpY3MuY2JUaW1lID0gdGhpcy5jYlRpbWVcbiAgICAgIGlmICh4aHJQYXJhbXMgJiYgeGhyUGFyYW1zLnBhdGhuYW1lICYmIHhoclBhcmFtcy5wYXRobmFtZS5pbmRleE9mKFwiYmVhY29uL3Jlc291cmNlc1wiKSA8IDApIHtcbiAgICAgICAgZXZlbnRFbWl0dGVyLmFkZEV2ZW50QXJncyhcInhoclwiLCBbeGhyUGFyYW1zLCB4aHJNYXRyaWNzLCB0aGlzLnN0YXJ0VGltZSwgdGhpcy5jcmVhdFR5cGVdKVxuICAgICAgfVxuICAgIH1cbiAgfVxufSAqL1xudmFyIHdyYXBYSFIgPSByZXF1aXJlKFwiLi9hamF4SGFja2VyXCIpXG53cmFwWEhSKHtcbiAgYmVmb3JlT3BlbjogZnVuY3Rpb24gKG5leHQsIG1ldGhvZCwgdXJsLCBhc3luYywgdXNlciwgcGFzc3dvcmQpIHtcbiAgICB0aGlzLnBlcmZvcm1hbmNlID0ge1xuICAgICAgX19hcG1feGhyX186IHRoaXMuX19hcG1feGhyX18sXG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIGFzeW5jOiBhc3luYyxcbiAgICAgIHVzZXI6IHVzZXIsXG4gICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICB9XG4gICAgcGFyc2VYSFJVcmwodGhpcy5wZXJmb3JtYW5jZSwgdXJsKVxuICAgIGV2ZW50RW1pdHRlci5lbWl0KHNpbmdsZUV2ZW50TmFtZSwgW1wiY29sbGVjdFwiLCB0aGlzLnBlcmZvcm1hbmNlXSlcbiAgICAvLyBjb2xsZWN0KHRoaXMucGVyZm9ybWFuY2UpXG4gICAgbmV4dCgpXG4gIH0sXG4gIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uIChuZXh0LCBib2R5KSB7XG4gICAgbG9nKFwiYmVmb3JlIHNlbmQ6XCIpXG4gICAgbG9nKHRoaXMpXG4gICAgdmFyIHRyYWNpbmdJZCA9IGNvbW1vbi5VVUlEKClcbiAgICB2YXIgc3RhcnRUaW1lID0gbmV3IERhdGUoKSAqIDFcbiAgICB2YXIgY29udGVudExlbmd0aCA9IHR5cGVvZiBib2R5ID09PSBcIm9iamVjdFwiIHx8IGJvZHkgaW5zdGFuY2VvZiBBcnJheSA/IEpTT04uc3RyaW5naWZ5KGJvZHkpLmxlbmd0aFxuICAgICAgOiB0eXBlb2YgYm9keSA9PT0gXCJ1bmRlZmluZWRcIiA/IDAgOiBib2R5Lmxlbmd0aFxuICAgIGlmIChjb25maWcub3BlblRyYWNpbmcpIHtcbiAgICAgIHRoaXMuc2V0UmVxdWVzdEhlYWRlcihcInR5cGVcIiwgXCJ3ZWItc3BhblwiKVxuICAgICAgdGhpcy5zZXRSZXF1ZXN0SGVhZGVyKFwiS2VwbGVyLVRyYWNlSWRcIiwgdHJhY2luZ0lkKVxuICAgICAgdGhpcy5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1MZW5ndGhcIiwgY29udGVudExlbmd0aClcbiAgICB9XG4gICAgdGhpcy5wZXJmb3JtYW5jZS5zdGFydFRpbWUgPSBzdGFydFRpbWVcbiAgICB0aGlzLnBlcmZvcm1hbmNlLmFnZW50SWQgPSBjb25maWcuYWdlbnRJZFxuICAgIHRoaXMucGVyZm9ybWFuY2UudHJhY2luZ0lkID0gdHJhY2luZ0lkXG4gICAgdGhpcy5wZXJmb3JtYW5jZS5vayA9IGZhbHNlXG5cbiAgICBldmVudEVtaXR0ZXIuZW1pdChzaW5nbGVFdmVudE5hbWUsIFtcImNvbGxlY3RcIiwgdGhpcy5wZXJmb3JtYW5jZV0pXG4gICAgLy8gY29sbGVjdCh0aGlzLnBlcmZvcm1hbmNlKVxuICAgIG5leHQoKVxuICB9LFxuICBiZWZvcmVBYm9yZDogZnVuY3Rpb24gKG5leHQpIHtcbiAgICBuZXh0KClcbiAgfSxcbiAgb25hYm9yZDogZnVuY3Rpb24gKGUsIG5leHQpIHtcbiAgICB0aGlzLnBlcmZvcm1hbmNlLnN0YXR1cyA9IFwiYWJvcmRlZFwiXG4gICAgdGhpcy5wZXJmb3JtYW5jZS5lbmRUaW1lID0gbmV3IERhdGUoKSAqIDFcblxuICAgIHRoaXMucGVyZm9ybWFuY2Uub2sgPSB0cnVlXG5cbiAgICBldmVudEVtaXR0ZXIuZW1pdChzaW5nbGVFdmVudE5hbWUsIFtcImNvbGxlY3RcIiwgdGhpcy5wZXJmb3JtYW5jZV0pXG4gICAgLy8gY29sbGVjdCh0aGlzLnBlcmZvcm1hbmNlKVxuICAgIG5leHQoKVxuICB9LFxuICBvbmVycm9yOiBmdW5jdGlvbiAoZSwgbmV4dCkge1xuICAgIHRoaXMucGVyZm9ybWFuY2Uuc3RhdHVzID0gXCJlcnJvclwiXG4gICAgdGhpcy5wZXJmb3JtYW5jZS5lbmRUaW1lID0gbmV3IERhdGUoKSAqIDFcbiAgICB0aGlzLnBlcmZvcm1hbmNlLm9rID0gdHJ1ZVxuICAgIGV2ZW50RW1pdHRlci5lbWl0KHNpbmdsZUV2ZW50TmFtZSwgW1wiY29sbGVjdFwiLCB0aGlzLnBlcmZvcm1hbmNlXSlcbiAgICAvLyBjb2xsZWN0KHRoaXMucGVyZm9ybWFuY2UpXG4gICAgbmV4dCgpXG4gIH0sXG4gIG9ubG9hZDogZnVuY3Rpb24gKGUsIG5leHQpIHtcbiAgICBuZXh0KClcbiAgfSxcbiAgb25sb2FkZW5kOiBmdW5jdGlvbiAoZSwgbmV4dCkge1xuICAgIGxvZyhcInhoci13cmFwcGVyOm9ubG9hZGVkXCIsIGUpXG4gICAgdGhpcy5wZXJmb3JtYW5jZS50eXBlID0gXCJsb2FkZW5kXCJcbiAgICB0aGlzLnBlcmZvcm1hbmNlLnN0YXR1c0NvZGUgPSB0aGlzLnN0YXR1c1xuICAgIHRoaXMucGVyZm9ybWFuY2UuZW5kVGltZSA9IG5ldyBEYXRlKCkgKiAxXG4gICAgdGhpcy5wZXJmb3JtYW5jZS5hbGxUaW1lID0gdGhpcy5wZXJmb3JtYW5jZS5lbmRUaW1lIC0gdGhpcy5wZXJmb3JtYW5jZS5zdGFydFRpbWVcbiAgICB0aGlzLnBlcmZvcm1hbmNlLm9rID0gdHJ1ZVxuICAgIGV2ZW50RW1pdHRlci5lbWl0KHNpbmdsZUV2ZW50TmFtZSwgW1wiY29sbGVjdFwiLCB0aGlzLnBlcmZvcm1hbmNlXSlcbiAgICAvLyBjb2xsZWN0KHRoaXMucGVyZm9ybWFuY2UpXG4gICAgbmV4dCgpXG4gIH0sXG4gIG9ubG9hZHN0YXJ0OiBmdW5jdGlvbiAoZSwgbmV4dCkge1xuICAgIG5leHQoKVxuICB9LFxuICBvbnByb2dyZXNzOiBmdW5jdGlvbiAoZSwgbmV4dCkge1xuICAgIG5leHQoKVxuICB9LFxuICBvbnRpbWVvdXQ6IGZ1bmN0aW9uIChlLCBuZXh0KSB7XG4gICAgdGhpcy5wZXJmb3JtYW5jZS50eXBlID0gXCJ0aW1lb3V0XCJcbiAgICB0aGlzLnBlcmZvcm1hbmNlLnN0YXR1c0NvZGUgPSB0aGlzLnN0YXR1c1xuICAgIHRoaXMucGVyZm9ybWFuY2UuZW5kVGltZSA9IG5ldyBEYXRlKCkgKiAxXG4gICAgdGhpcy5wZXJmb3JtYW5jZS5vayA9IHRydWVcbiAgICBldmVudEVtaXR0ZXIuZW1pdChzaW5nbGVFdmVudE5hbWUsIFtcImNvbGxlY3RcIiwgdGhpcy5wZXJmb3JtYW5jZV0pXG4gICAgLy8gY29sbGVjdCh0aGlzLnBlcmZvcm1hbmNlKVxuICAgIG5leHQoKVxuICB9LFxuICBvbnJlYWR5c3RhdGVjaGFuZ2U6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5wZXJmb3JtYW5jZS50eXBlID0gXCJyZWFkeXN0YXRlY2hhbmdlZFwiXG4gICAgdGhpcy5wZXJmb3JtYW5jZS5lbmRUaW1lID0gbmV3IERhdGUoKSAqIDFcbiAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICB0aGlzLnBlcmZvcm1hbmNlLnN0YXR1cyA9IHRoaXMuc3RhdHVzXG4gICAgICB2YXIgcmVzVHlwZSA9IHRoaXMucmVzcG9uc2VUeXBlXG4gICAgICB2YXIgcmVzQm9keSA9IHJlc1R5cGUgPT09IFwiYXJyYXlidWZmZXJcIiB8fCByZXNUeXBlID09PSBcImJsb2JcIiB8fCByZXNUeXBlID09PSBcImpzb25cIiA/IHRoaXMucmVzcG9uc2UgOiB0aGlzLnJlc3BvbnNlVGV4dFxuICAgICAgdmFyIGRhdGFTaXplID0gZ2V0UmVzcG9uc2VTaXplKHJlc0JvZHkpIHx8IDBcblxuICAgICAgaWYgKGRhdGFTaXplKSB7XG4gICAgICAgIHRoaXMucGVyZm9ybWFuY2UuZGF0YVNpemUgPSBkYXRhU2l6ZVxuICAgICAgfVxuICAgICAgdGhpcy5wZXJmb3JtYW5jZS5vayA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wZXJmb3JtYW5jZS5zdGF0dXMgPSAwXG4gICAgfVxuICAgIGV2ZW50RW1pdHRlci5lbWl0KHNpbmdsZUV2ZW50TmFtZSwgW1wiY29sbGVjdFwiLCB0aGlzLnBlcmZvcm1hbmNlXSlcbiAgICAvLyBjb2xsZWN0KHRoaXMucGVyZm9ybWFuY2UpXG4gIH0sXG4gIHVwbG9hZDoge1xuICAgIG9ucHJvZ3Jlc3M6IGZ1bmN0aW9uIChlLCBuZXh0KSB7XG4gICAgICBuZXh0KClcbiAgICB9XG4gIH1cbn0pXG5cbi8qKlxuICog5om56YeP5Y+R6YCBQUpBWOaVsOaNrlxuICog5Yik5a6aWEhS5piv5ZCm54q25oCBT0tcbiAqIOWIpOaWreWPkemAgeeahOaVsOaNruaYr+WQpuW3sue7j+WwmuacquWIsOS6humFjee9ruWPkemAgeS4iumZkFxuICog5LiK6L+w5Lik5Liq5p2h5Lu26YO95ruh6Laz77yM5YiZ5Y+v5Lul5Y+R6YCBXG4gKi9cbmZ1bmN0aW9uIHNlbmQgKCkge1xuICBpZiAoeGhycyAmJiB4aHJzLmxlbmd0aCA+IDApIHtcbiAgICB2YXIgYmF0Y2ggPSBbXVxuICAgIHZhciBsZW4gPSB4aHJzLmxlbmd0aFxuICAgIHdoaWxlIChsZW4gPiAwICYmIGJhdGNoLmxlbmd0aCA8IGNvbmZpZy5tYXhMaW1pdCkge1xuICAgICAgdmFyIHhociA9IHhocnMuc2hpZnQoKVxuICAgICAgaWYgKHhoci5vaykge1xuICAgICAgICBiYXRjaC5wdXNoKHhocilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHhocnMucHVzaCh4aHIpXG4gICAgICB9XG4gICAgICBsZW4tLVxuICAgIH1cbiAgICBpZiAoYmF0Y2gubGVuZ3RoID4gMCkge1xuICAgICAgc2VuZGVyLnNlbmRCYXRjaChiYXRjaClcbiAgICB9XG4gIH1cbn1cblxuc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICBldmVudEVtaXR0ZXIuZW1pdChzaW5nbGVFdmVudE5hbWUsIFtcInNlbmRcIl0pXG59LCBjb25maWcudHJhbnNGcmVxdWVuY3kpXG5cbm1vZHVsZS5leHBvcnRzID0gZXZlbnRFbWl0dGVyXG4iXX0=
