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
 * @Last Modified time: 2018-03-01 14:28:28
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
  disabled: false,
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

config.showLog = !!1 + "" === config.showLog
config.openTracing = !!1 + "" === config.openTracing
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
 * @Last Modified time: 2018-03-01 16:34:40
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
  // 白屏时间 -- whiteScreenTime
  performances["domLoading"] = performance.getWriteScreenTimeSpan() || performances["domLoading"]
  // 可操作时间（Dom加载完成时间）-- operableTime
  performances["domContent"] = performance.getDomReadyTimeSpan() || performances["domContent"]
  // 首屏时间 -- firstScreenTime
  performances["firstScreen"] = performances["firstScreen"] || performances["domContent"] || -1
  // 页面加载完成时间 -- resourceLoadedTime
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
 * @Last Modified time: 2018-03-01 16:44:47
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
 * @Last Modified time: 2018-03-01 16:49:34
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
  // var index = 0
  // var resourceLenth = 0
  var writeScreenTime = 0
  if (winPerformance && doc.querySelectorAll && winPerformance.getEntriesByType) {
    writeScreenTime = winPerformance.timing.domLoading
    // headerLinks = doc.querySelectorAll("head>link")
    // headerScripts = doc.querySelectorAll("head>script")
    // for (var item in headerLinks) {
    //   if (headerLinks[item].href !== "" && void 0 !== headerLinks[item].href) {
    //     links[unescape(headerLinks[item].href)] = 1
    //   }
    // }
    // for (item in headerScripts) {
    //   if (headerScripts[item].src !== "" && void 0 !== headerScripts[item].src && headerScripts[item].async !== 1) {
    //     links[unescape(headerScripts[item].src)] = 1
    //   }
    // }
    // resourceLenth += headerLinks.length
    // resourceLenth += headerScripts.length
    // resources = winPerformance.getEntriesByType("resource")
    // // 为什么要用2*resourceLength呢？
    // if (2 * resourceLenth > resources.length) {
    //   resourceLenth = resources.length
    // } else {
    //   resourceLenth += resourceLenth
    // }

    // for (index; resourceLenth >= index; index++) {
    //   if (resources[index] &&
    //     links[unescape(resources[index].name)] === 1 &&
    //     resources[index].responseEnd > 0 &&
    //     resources[index].responseEnd + winPerformance.timing.navigationStart >= writeScreenTime) {
    //     writeScreenTime = resources[index].responseEnd + winPerformance.timing.navigationStart
    //   }
    // }

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
 * @Last Modified time: 2018-02-28 21:20:22
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
      log("性能数据已发送")
    },
    error: function (xhr) {
      log("性能数据发送失败")
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
  if (!config.disabled) {
    common.ajax(options)
  }
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
  if (!config.disabled) {
    common.ajax(options)
  }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9nb2dzL3dlYmFwcC9ub2RlX21vZHVsZXMvLjIuMC4xQGJyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9nb2dzL3dlYmFwcC9zcmMvY29tbW9uLmpzIiwiL1VzZXJzL2ppYW5nZmVuZy9kb2NzL2dpdC1wcm9qZWN0L2dvZ3Mvd2ViYXBwL3NyYy9jb25maWcuanMiLCIvVXNlcnMvamlhbmdmZW5nL2RvY3MvZ2l0LXByb2plY3QvZ29ncy93ZWJhcHAvc3JjL2NvbnN0cy5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9nb2dzL3dlYmFwcC9zcmMvZG9tLmpzIiwiL1VzZXJzL2ppYW5nZmVuZy9kb2NzL2dpdC1wcm9qZWN0L2dvZ3Mvd2ViYXBwL3NyYy9lcnJvci9pbmRleC5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9nb2dzL3dlYmFwcC9zcmMvZXZlbnRFbWl0dGVyLmpzIiwiL1VzZXJzL2ppYW5nZmVuZy9kb2NzL2dpdC1wcm9qZWN0L2dvZ3Mvd2ViYXBwL3NyYy9mYWtlX2FmNzkwYjNmLmpzIiwiL1VzZXJzL2ppYW5nZmVuZy9kb2NzL2dpdC1wcm9qZWN0L2dvZ3Mvd2ViYXBwL3NyYy9nbG9iYWxDb250ZXh0LmpzIiwiL1VzZXJzL2ppYW5nZmVuZy9kb2NzL2dpdC1wcm9qZWN0L2dvZ3Mvd2ViYXBwL3NyYy9qc29uLmpzIiwiL1VzZXJzL2ppYW5nZmVuZy9kb2NzL2dpdC1wcm9qZWN0L2dvZ3Mvd2ViYXBwL3NyYy9rZXBsZXIuanMiLCIvVXNlcnMvamlhbmdmZW5nL2RvY3MvZ2l0LXByb2plY3QvZ29ncy93ZWJhcHAvc3JjL2xvY2tlci5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9nb2dzL3dlYmFwcC9zcmMvbG9nLmpzIiwiL1VzZXJzL2ppYW5nZmVuZy9kb2NzL2dpdC1wcm9qZWN0L2dvZ3Mvd2ViYXBwL3NyYy9tYWluLmpzIiwiL1VzZXJzL2ppYW5nZmVuZy9kb2NzL2dpdC1wcm9qZWN0L2dvZ3Mvd2ViYXBwL3NyYy9wZXJmb3JtYW5jZS9pbmRleC5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9nb2dzL3dlYmFwcC9zcmMvcGVyZm9ybWFuY2UvcGFnZUxvYWRlci5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9nb2dzL3dlYmFwcC9zcmMvcGVyZm9ybWFuY2UvcGVyZm9ybWFuY2UuanMiLCIvVXNlcnMvamlhbmdmZW5nL2RvY3MvZ2l0LXByb2plY3QvZ29ncy93ZWJhcHAvc3JjL3BlcmZvcm1hbmNlL3NlbmRlci5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9nb2dzL3dlYmFwcC9zcmMvc3RvcmUuanMiLCIvVXNlcnMvamlhbmdmZW5nL2RvY3MvZ2l0LXByb2plY3QvZ29ncy93ZWJhcHAvc3JjL3RocmlmdC5qcyIsIi9Vc2Vycy9qaWFuZ2ZlbmcvZG9jcy9naXQtcHJvamVjdC9nb2dzL3dlYmFwcC9zcmMvdWEuanMiLCIvVXNlcnMvamlhbmdmZW5nL2RvY3MvZ2l0LXByb2plY3QvZ29ncy93ZWJhcHAvc3JjL3hoci9hamF4SGFja2VyLmpzIiwiL1VzZXJzL2ppYW5nZmVuZy9kb2NzL2dpdC1wcm9qZWN0L2dvZ3Mvd2ViYXBwL3NyYy94aHIvaW5kZXguanMiLCIvVXNlcnMvamlhbmdmZW5nL2RvY3MvZ2l0LXByb2plY3QvZ29ncy93ZWJhcHAvc3JjL3hoci9zZW5kZXIuanMiLCIvVXNlcnMvamlhbmdmZW5nL2RvY3MvZ2l0LXByb2plY3QvZ29ncy93ZWJhcHAvc3JjL3hoci94aHJXcmFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzV1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDamdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL2NvbmZpZ1wiKVxudmFyIEpTT04gPSByZXF1aXJlKFwiLi9qc29uXCIpXG52YXIgZGV0ZWN0b3IgPSByZXF1aXJlKFwiLi91YVwiKVxuXG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZVxudmFyIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZVxudmFyIHNsaWNlID0gQXJyYXlQcm90by5zbGljZVxudmFyIHRvU3RyaW5nID0gT2JqUHJvdG8udG9TdHJpbmdcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9ialByb3RvLmhhc093blByb3BlcnR5XG52YXIgbmF2aWdhdG9yID0gd2luZG93Lm5hdmlnYXRvclxudmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50XG52YXIgdXNlckFnZW50ID0gbmF2aWdhdG9yLnVzZXJBZ2VudFxudmFyIExJQl9WRVJTSU9OID0gY29uZmlnLkxJQl9WRVJTSU9OXG52YXIgbmF0aXZlRm9yRWFjaCA9IEFycmF5UHJvdG8uZm9yRWFjaFxudmFyIG5hdGl2ZUluZGV4T2YgPSBBcnJheVByb3RvLmluZGV4T2ZcbnZhciBuYXRpdmVJc0FycmF5ID0gQXJyYXkuaXNBcnJheVxudmFyIGVtcHR5T2JqID0ge31cbnZhciBfID0ge31cbnZhciBlYWNoID0gXy5lYWNoID0gZnVuY3Rpb24gKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgaWYgKG5hdGl2ZUZvckVhY2ggJiYgb2JqLmZvckVhY2ggPT09IG5hdGl2ZUZvckVhY2gpIHtcbiAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dClcbiAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKGkgaW4gb2JqICYmIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopID09PSBlbXB0eU9iaikge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtrZXldLCBrZXksIG9iaikgPT09IGVtcHR5T2JqKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuXy5leHRlbmQgPSBmdW5jdGlvbiAob2JqKSB7XG4gIGVhY2goc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2VbcHJvcF0gIT09IHZvaWQgMCkge1xuICAgICAgICBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF1cbiAgICAgIH1cbiAgICB9XG4gIH0pXG4gIHJldHVybiBvYmpcbn1cblxuLy8g5aaC5p6c5bey57uP5pyJ55qE5bGe5oCn5LiN6KaG55uWLOWmguaenOayoeacieeahOWxnuaAp+WKoOi/m+adpVxuXy5jb3ZlckV4dGVuZCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgZWFjaChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgaWYgKHNvdXJjZVtwcm9wXSAhPT0gdm9pZCAwICYmIG9ialtwcm9wXSA9PT0gdm9pZCAwKSB7XG4gICAgICAgIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXVxuICAgICAgfVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIG9ialxufVxuXG5fLmlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiXG59XG5cbl8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uIChmKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIC9eXFxzKlxcYmZ1bmN0aW9uXFxiLy50ZXN0KGYpXG4gIH0gY2F0Y2ggKHgpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5fLmlzQXJndW1lbnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gISEob2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBcImNhbGxlZVwiKSlcbn1cblxuXy50b0FycmF5ID0gZnVuY3Rpb24gKGl0ZXJhYmxlKSB7XG4gIGlmICghaXRlcmFibGUpIHtcbiAgICByZXR1cm4gW11cbiAgfVxuICBpZiAoaXRlcmFibGUudG9BcnJheSkge1xuICAgIHJldHVybiBpdGVyYWJsZS50b0FycmF5KClcbiAgfVxuICBpZiAoXy5pc0FycmF5KGl0ZXJhYmxlKSkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGl0ZXJhYmxlKVxuICB9XG4gIGlmIChfLmlzQXJndW1lbnRzKGl0ZXJhYmxlKSkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGl0ZXJhYmxlKVxuICB9XG4gIHJldHVybiBfLnZhbHVlcyhpdGVyYWJsZSlcbn1cblxuXy52YWx1ZXMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciByZXN1bHRzID0gW11cbiAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHJlc3VsdHNcbiAgfVxuICBlYWNoKG9iaiwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmVzdWx0c1tyZXN1bHRzLmxlbmd0aF0gPSB2YWx1ZVxuICB9KVxuICByZXR1cm4gcmVzdWx0c1xufVxuXG5fLmluY2x1ZGUgPSBmdW5jdGlvbiAob2JqLCB0YXJnZXQpIHtcbiAgdmFyIGZvdW5kID0gZmFsc2VcbiAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZvdW5kXG4gIH1cbiAgaWYgKG5hdGl2ZUluZGV4T2YgJiYgb2JqLmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHtcbiAgICByZXR1cm4gb2JqLmluZGV4T2YodGFyZ2V0KSAhPT0gLTFcbiAgfVxuICBlYWNoKG9iaiwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKGZvdW5kIHx8IChmb3VuZCA9ICh2YWx1ZSA9PT0gdGFyZ2V0KSkpIHtcbiAgICAgIHJldHVybiBlbXB0eU9ialxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIGZvdW5kXG59XG5cbl8uaW5jbHVkZXMgPSBmdW5jdGlvbiAoc3RyLCBuZWVkbGUpIHtcbiAgcmV0dXJuIHN0ci5pbmRleE9mKG5lZWRsZSkgIT09IC0xXG59XG5cbl8uYXJyYXlGaWx0ZXIgPSBmdW5jdGlvbiAoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMVxuICB2YXIgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwXG4gIHZhciByZXNJbmRleCA9IDBcbiAgdmFyIHJlc3VsdCA9IFtdXG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF1cbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXN1bHRbcmVzSW5kZXgrK10gPSB2YWx1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0XG59XG5cbl8uaW5oZXJpdCA9IGZ1bmN0aW9uIChTdWJjbGFzcywgU3VwZXJDbGFzcykge1xuICBTdWJjbGFzcy5wcm90b3R5cGUgPSBuZXcgU3VwZXJDbGFzcygpXG4gIFN1YmNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFN1YmNsYXNzXG4gIFN1YmNsYXNzLnN1cGVyY2xhc3MgPSBTdXBlckNsYXNzLnByb3RvdHlwZVxuICByZXR1cm4gU3ViY2xhc3Ncbn1cblxuXy5pc09iamVjdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIlxufVxuXG5fLmlzRW1wdHlPYmplY3QgPSBmdW5jdGlvbiAob2JqKSB7XG4gIGlmIChfLmlzT2JqZWN0KG9iaikpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbnZhciByVHJpbSA9IC9eXFxzK3xcXHMrJC9cbl8udHJpbSA9IFwiXCIudHJpbSA/IGZ1bmN0aW9uIChzKSB7XG4gIHJldHVybiBzLnRyaW0oKVxufSA6IGZ1bmN0aW9uIChzKSB7XG4gIHJldHVybiBzLnJlcGxhY2UoclRyaW0pXG59XG5cbl8uaXNVbmRlZmluZWQgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogPT09IHZvaWQgMFxufVxuXG5fLmlzU3RyaW5nID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgU3RyaW5nXVwiXG59XG5cbl8uaXNEYXRlID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgRGF0ZV1cIlxufVxuXG5fLmlzQm9vbGVhbiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gXCJbb2JqZWN0IEJvb2xlYW5dXCJcbn1cblxuXy5pc051bWJlciA9IGZ1bmN0aW9uIChvYmopIHtcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tdXNlbGVzcy1lc2NhcGUgKi9cbiAgcmV0dXJuICh0b1N0cmluZy5jYWxsKG9iaikgPT09IFwiW29iamVjdCBOdW1iZXJdXCIgJiYgL1tcXGRcXC5dKy8udGVzdChTdHJpbmcob2JqKSkpXG59XG5cbl8uZW5jb2RlRGF0ZXMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIF8uZWFjaChvYmosIGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgaWYgKF8uaXNEYXRlKHYpKSB7XG4gICAgICBvYmpba10gPSBfLmZvcm1hdERhdGUodilcbiAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QodikpIHtcbiAgICAgIG9ialtrXSA9IF8uZW5jb2RlRGF0ZXModilcbiAgICB9XG4gIH0pXG4gIHJldHVybiBvYmpcbn1cblxuXy5mb3JtYXREYXRlID0gZnVuY3Rpb24gKGRhdGUpIHtcbiAgZnVuY3Rpb24gcGFkIChuKSB7XG4gICAgcmV0dXJuIG4gPCAxMCA/IFwiMFwiICsgbiA6IG5cbiAgfVxuICByZXR1cm4gW1xuICAgIGRhdGUuZ2V0RnVsbFllYXIoKSxcbiAgICBcIi1cIixcbiAgICBwYWQoZGF0ZS5nZXRNb250aCgpICsgMSksXG4gICAgXCItXCIsXG4gICAgcGFkKGRhdGUuZ2V0RGF0ZSgpKSxcbiAgICBcIlRcIixcbiAgICBwYWQoZGF0ZS5nZXRIb3VycygpKSxcbiAgICBcIjpcIixcbiAgICBwYWQoZGF0ZS5nZXRNaW51dGVzKCkpLFxuICAgIFwiOlwiLFxuICAgIHBhZChkYXRlLmdldFNlY29uZHMoKSksXG4gICAgXCIuXCIsXG4gICAgcGFkKGRhdGUuZ2V0TWlsbGlzZWNvbmRzKCkpLFxuICAgIFwiKzA4OjAwXCJcbiAgXS5qb2luKFwiXCIpXG59XG5cbl8uc2VhcmNoT2JqRGF0ZSA9IGZ1bmN0aW9uIChvKSB7XG4gIGlmIChfLmlzT2JqZWN0KG8pKSB7XG4gICAgXy5lYWNoKG8sIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChhKSkge1xuICAgICAgICBfLnNlYXJjaE9iakRhdGUob1tiXSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChfLmlzRGF0ZShhKSkge1xuICAgICAgICAgIG9bYl0gPSBfLmZvcm1hdERhdGUoYSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cblxuXy51dGY4RW5jb2RlID0gZnVuY3Rpb24gKHN0cmluZykge1xuICBzdHJpbmcgPSAoc3RyaW5nICsgXCJcIikucmVwbGFjZSgvXFxyXFxuL2csIFwiXFxuXCIpLnJlcGxhY2UoL1xcci9nLCBcIlxcblwiKVxuXG4gIHZhciB1dGZ0ZXh0ID0gXCJcIixcbiAgICBzdGFydCwgZW5kXG4gIHZhciBzdHJpbmdsID0gMCxcbiAgICBuXG5cbiAgc3RhcnQgPSBlbmQgPSAwXG4gIHN0cmluZ2wgPSBzdHJpbmcubGVuZ3RoXG5cbiAgZm9yIChuID0gMDsgbiA8IHN0cmluZ2w7IG4rKykge1xuICAgIHZhciBjMSA9IHN0cmluZy5jaGFyQ29kZUF0KG4pXG4gICAgdmFyIGVuYyA9IG51bGxcblxuICAgIGlmIChjMSA8IDEyOCkge1xuICAgICAgZW5kKytcbiAgICB9IGVsc2UgaWYgKChjMSA+IDEyNykgJiYgKGMxIDwgMjA0OCkpIHtcbiAgICAgIGVuYyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGMxID4+IDYpIHwgMTkyLCAoYzEgJiA2MykgfCAxMjgpXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuYyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGMxID4+IDEyKSB8IDIyNCwgKChjMSA+PiA2KSAmIDYzKSB8IDEyOCwgKGMxICYgNjMpIHwgMTI4KVxuICAgIH1cbiAgICBpZiAoZW5jICE9PSBudWxsKSB7XG4gICAgICBpZiAoZW5kID4gc3RhcnQpIHtcbiAgICAgICAgdXRmdGV4dCArPSBzdHJpbmcuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gICAgICB9XG4gICAgICB1dGZ0ZXh0ICs9IGVuY1xuICAgICAgc3RhcnQgPSBlbmQgPSBuICsgMVxuICAgIH1cbiAgfVxuXG4gIGlmIChlbmQgPiBzdGFydCkge1xuICAgIHV0ZnRleHQgKz0gc3RyaW5nLnN1YnN0cmluZyhzdGFydCwgc3RyaW5nLmxlbmd0aClcbiAgfVxuXG4gIHJldHVybiB1dGZ0ZXh0XG59XG5cbl8uZGV0ZWN0b3IgPSBkZXRlY3RvclxuXG5fLmJhc2U2NEVuY29kZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gIHZhciBiNjQgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89XCJcbiAgdmFyIG8xLCBvMiwgbzMsIGgxLCBoMiwgaDMsIGg0LCBiaXRzLCBpID0gMCxcbiAgICBhYyA9IDAsXG4gICAgZW5jID0gXCJcIixcbiAgICB0bXBBcnIgPSBbXVxuICBpZiAoIWRhdGEpIHtcbiAgICByZXR1cm4gZGF0YVxuICB9XG4gIGRhdGEgPSBfLnV0ZjhFbmNvZGUoZGF0YSlcbiAgZG8ge1xuICAgIG8xID0gZGF0YS5jaGFyQ29kZUF0KGkrKylcbiAgICBvMiA9IGRhdGEuY2hhckNvZGVBdChpKyspXG4gICAgbzMgPSBkYXRhLmNoYXJDb2RlQXQoaSsrKVxuXG4gICAgYml0cyA9IG8xIDw8IDE2IHwgbzIgPDwgOCB8IG8zXG5cbiAgICBoMSA9IGJpdHMgPj4gMTggJiAweDNmXG4gICAgaDIgPSBiaXRzID4+IDEyICYgMHgzZlxuICAgIGgzID0gYml0cyA+PiA2ICYgMHgzZlxuICAgIGg0ID0gYml0cyAmIDB4M2ZcbiAgICB0bXBBcnJbYWMrK10gPSBiNjQuY2hhckF0KGgxKSArIGI2NC5jaGFyQXQoaDIpICsgYjY0LmNoYXJBdChoMykgKyBiNjQuY2hhckF0KGg0KVxuICB9IHdoaWxlIChpIDwgZGF0YS5sZW5ndGgpXG5cbiAgZW5jID0gdG1wQXJyLmpvaW4oXCJcIilcblxuICBzd2l0Y2ggKGRhdGEubGVuZ3RoICUgMykge1xuICBjYXNlIDE6XG4gICAgZW5jID0gZW5jLnNsaWNlKDAsIC0yKSArIFwiPT1cIlxuICAgIGJyZWFrXG4gIGNhc2UgMjpcbiAgICBlbmMgPSBlbmMuc2xpY2UoMCwgLTEpICsgXCI9XCJcbiAgICBicmVha1xuICB9XG5cbiAgcmV0dXJuIGVuY1xufVxuXG5fLlVVSUQgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgVCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZCA9IDEgKiBuZXcgRGF0ZSgpLFxuICAgICAgaSA9IDBcbiAgICB3aGlsZSAoZCA9PT0gMSAqIG5ldyBEYXRlKCkpIHtcbiAgICAgIGkrK1xuICAgIH1cbiAgICByZXR1cm4gZC50b1N0cmluZygxNikgKyBpLnRvU3RyaW5nKDE2KVxuICB9XG4gIHZhciBSID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDE2KS5yZXBsYWNlKFwiLlwiLCBcIlwiKVxuICB9XG4gIHZhciBVQSA9IGZ1bmN0aW9uIChuKSB7XG4gICAgdmFyIHVhID0gdXNlckFnZW50LFxuICAgICAgaSwgY2gsIGJ1ZmZlciA9IFtdLFxuICAgICAgcmV0ID0gMFxuXG4gICAgZnVuY3Rpb24geG9yIChyZXN1bHQsIGJ5dGVBcnJheSkge1xuICAgICAgdmFyIGosIHRtcCA9IDBcbiAgICAgIGZvciAoaiA9IDA7IGogPCBieXRlQXJyYXkubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgdG1wIHw9IChidWZmZXJbal0gPDwgaiAqIDgpXG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0IF4gdG1wXG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IHVhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaCA9IHVhLmNoYXJDb2RlQXQoaSlcbiAgICAgIGJ1ZmZlci51bnNoaWZ0KGNoICYgMHhGRilcbiAgICAgIGlmIChidWZmZXIubGVuZ3RoID49IDQpIHtcbiAgICAgICAgcmV0ID0geG9yKHJldCwgYnVmZmVyKVxuICAgICAgICBidWZmZXIgPSBbXVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChidWZmZXIubGVuZ3RoID4gMCkge1xuICAgICAgcmV0ID0geG9yKHJldCwgYnVmZmVyKVxuICAgIH1cblxuICAgIHJldHVybiByZXQudG9TdHJpbmcoMTYpXG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZSA9IChzY3JlZW4uaGVpZ2h0ICogc2NyZWVuLndpZHRoKS50b1N0cmluZygxNilcbiAgICByZXR1cm4gKFQoKSArIFwiLVwiICsgUigpICsgXCItXCIgKyBVQSgpICsgXCItXCIgKyBzZSArIFwiLVwiICsgVCgpKVxuICB9XG59KSgpXG5cbl8uZ2V0UXVlcnlQYXJhbSA9IGZ1bmN0aW9uIChxdWVyeSwgdXJsLCB1bmRlY29kZSwgaXNIYXNoKSB7XG4gIHZhciBzZWFyY2gsIGluZGV4XG4gIGlmICghdXJsIHx8IHR5cGVvZiB1cmwgIT09IFwic3RyaW5nXCIpIHtcbiAgICB1cmwgPSB3aW5kb3cubG9jYXRpb25baXNIYXNoID8gXCJoYXNoXCIgOiBcInNlYXJjaFwiXVxuICB9XG4gIGluZGV4ID0gdXJsLmluZGV4T2YoaXNIYXNoID8gXCIjXCIgOiBcIj9cIilcbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgc2VhcmNoID0gXCImXCIgKyB1cmwuc2xpY2UoaW5kZXggKyAxKVxuXG4gIHJldHVybiBzZWFyY2ggJiYgbmV3IFJlZ0V4cChcIiZcIiArIHF1ZXJ5ICsgXCI9KFteJiNdKilcIikudGVzdChzZWFyY2gpXG4gICAgPyB1bmRlY29kZSA/IFJlZ0V4cC4kMSA6IHVuZXNjYXBlKFJlZ0V4cC4kMSlcbiAgICA6IG51bGxcbn1cblxuXy5jb25jYXRRdWVyeVBhcmFtID0gZnVuY3Rpb24gKHVybCwgcGFyYW1LZXksIHBhcmFtVmFsdWUpIHtcbiAgdmFyIGhhc2ggPSBcIlwiXG4gIGlmICh1cmwuaW5kZXhPZihcIiNcIikgIT09IC0xKSB7XG4gICAgaGFzaCA9IHVybC5zcGxpdChcIiNcIilbMV1cbiAgICB1cmwgPSB1cmwuc3BsaXQoXCIjXCIpWzBdXG4gIH1cbiAgaWYgKHBhcmFtVmFsdWUgPT09IHVuZGVmaW5lZCB8fCBwYXJhbVZhbHVlID09PSBudWxsKSB7XG4gICAgcGFyYW1WYWx1ZSA9IFwiXCJcbiAgfVxuICB2YXIgcmVnZXhTID0gXCJbXFxcXD8mXVwiICsgcGFyYW1LZXkgKyBcIj0oW14mI10qKVwiLFxuICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleFMpLFxuICAgIHJlc3VsdHMgPSByZWdleC5leGVjKHVybClcbiAgaWYgKHJlc3VsdHMgPT09IG51bGwgfHwgKHJlc3VsdHMgJiYgdHlwZW9mIChyZXN1bHRzWzFdKSAhPT0gXCJzdHJpbmdcIiAmJiByZXN1bHRzWzFdLmxlbmd0aCkpIHtcbiAgICBpZiAodXJsLmluZGV4T2YoXCI/XCIpICE9PSAtMSB8fCB1cmwuaW5kZXhPZihcIj1cIikgIT09IC0xKSB7XG4gICAgICB1cmwgPSB1cmwgKyBcIiZcIiArIHBhcmFtS2V5ICsgXCI9XCIgKyBwYXJhbVZhbHVlXG4gICAgfSBlbHNlIHtcbiAgICAgIHVybCA9IHVybCArIFwiP1wiICsgcGFyYW1LZXkgKyBcIj1cIiArIHBhcmFtVmFsdWVcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdXJsID0gdXJsLnJlcGxhY2UocmVzdWx0c1swXSwgcmVzdWx0c1swXS5yZXBsYWNlKHJlc3VsdHNbMV0sIHBhcmFtVmFsdWUpKVxuICB9XG5cbiAgaWYgKGhhc2ggIT09IFwiXCIpIHtcbiAgICB1cmwgKz0gXCIjXCIgKyBoYXNoXG4gIH1cbiAgcmV0dXJuIHVybFxufVxuXy5wYXJzZVVybCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKVxuICB2YXIgbG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb25cbiAgdmFyIHBhcnNlZFVybCA9IHt9XG4gIGxpbmsuaHJlZiA9IHVybFxuICBwYXJzZWRVcmwucG9ydCA9IGxpbmsucG9ydFxuICB2YXIgaHJlZkFycmF5ID0gbGluay5ocmVmLnNwbGl0KFwiOi8vXCIpXG4gIGlmICghcGFyc2VkVXJsLnBvcnQgJiYgaHJlZkFycmF5WzFdKSB7XG4gICAgcGFyc2VkVXJsLnBvcnQgPSBocmVmQXJyYXlbMV0uc3BsaXQoXCIvXCIpWzBdLnNwbGl0KFwiOlwiKVsxXVxuICB9XG4gIGlmICghKHBhcnNlZFVybC5wb3J0ICYmIHBhcnNlZFVybC5wb3J0ICE9PSBcIjBcIikpIHtcbiAgICBwYXJzZWRVcmwucG9ydCA9IGhyZWZBcnJheVswXSA9PT0gXCJodHRwc1wiID8gXCI0NDNcIiA6IFwiODBcIlxuICB9XG4gIHBhcnNlZFVybC5ob3N0bmFtZSA9IGxpbmsuaG9zdG5hbWUgfHwgbG9jYXRpb24uaG9zdG5hbWVcbiAgcGFyc2VkVXJsLnBhdGhuYW1lID0gbGluay5wYXRobmFtZVxuICBpZiAocGFyc2VkVXJsLnBhdGhuYW1lLmNoYXJBdCgwKSAhPT0gXCIvXCIpIHtcbiAgICBwYXJzZWRVcmwucGF0aG5hbWUgPSBcIi9cIiArIHBhcnNlZFVybC5wYXRobmFtZVxuICB9XG5cbiAgcGFyc2VkVXJsLnNhbWVPcmlnaW4gPSAhbGluay5ob3N0bmFtZSB8fCBsaW5rLmhvc3RuYW1lID09PSBkb2N1bWVudC5kb21haW4gJiYgbGluay5wb3J0ID09PSBsb2NhdGlvbi5wb3J0ICYmIGxpbmsucHJvdG9jb2wgPT09IGxvY2F0aW9uLnByb3RvY29sXG4gIHJldHVybiBwYXJzZWRVcmxcbn1cblxuXy54aHIgPSBmdW5jdGlvbiAoY29ycykge1xuICB2YXIgeGhyXG4gIGlmIChjb3JzKSB7XG4gICAgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICB4aHIgPSBcIndpdGhDcmVkZW50aWFsc1wiIGluIHhociA/IHhociA6IHR5cGVvZiBYRG9tYWluUmVxdWVzdCAhPT0gXCJ1bmRlZmluZWRcIiA/IG5ldyBYRG9tYWluUmVxdWVzdCgpIDogeGhyXG4gIH1cbiAgaWYgKFhNTEh0dHBSZXF1ZXN0KSB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICBpZiAod2luZG93LkFjdGl2ZVhPYmplY3QpIHtcbiAgICB0cnkge1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cbiAgICAgIHhociA9IG5ldyBBY3RpdmVYT2JqZWN0KFwiTXN4bWwyLlhNTEhUVFBcIilcbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cbiAgICAgICAgeGhyID0gbmV3IEFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MSFRUUFwiKVxuICAgICAgfSBjYXRjaCAoZXgpIHt9XG4gICAgfVxuICB9XG4gIGlmICghKFwic2V0UmVxdWVzdEhlYWRlclwiIGluIHhocikpIHtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciA9IGZ1bmN0aW9uICgpIHtcblxuICAgIH1cbiAgfVxuICB4aHIuX19hcG1feGhyX18gPSB0cnVlXG4gIHJldHVybiB4aHJcbn1cbl8uYWpheCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgZnVuY3Rpb24gcGFyc2VKc29uIChwYXJhbXMpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UocGFyYW1zKVxuICAgIH0gY2F0Y2ggKHQpIHtcbiAgICAgIHJldHVybiB7fVxuICAgIH1cbiAgfVxuICB2YXIgeGhyID0gXy54aHIocGFyYW1zLmNvcnMpXG5cbiAgaWYgKCFwYXJhbXMudHlwZSkge1xuICAgIHBhcmFtcy50eXBlID0gcGFyYW1zLmRhdGEgPyBcIlBPU1RcIiA6IFwiR0VUXCJcbiAgfVxuXG4gIHBhcmFtcyA9IF8uZXh0ZW5kKHtcbiAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7fSxcbiAgICBlcnJvcjogZnVuY3Rpb24gKHhociwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgIF8ubG9nKHhoci5zdGF0dXMpXG4gICAgICBfLmxvZyh4aHIucmVhZHlTdGF0ZSlcbiAgICAgIF8ubG9nKHRleHRTdGF0dXMpXG4gICAgfSxcbiAgICBjb21wbGV0ZTogZnVuY3Rpb24gKHhocikge31cbiAgfSwgcGFyYW1zKVxuXG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1taXhlZC1vcGVyYXRvcnMgKi9cbiAgICAgIGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwIHx8IHhoci5zdGF0dXMgPT09IDMwNCkge1xuICAgICAgICBwYXJhbXMuc3VjY2VzcyhwYXJzZUpzb24oeGhyLnJlc3BvbnNlVGV4dCkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJhbXMuZXJyb3IoeGhyKVxuICAgICAgfVxuXG4gICAgICBwYXJhbXMuY29tcGxldGUoeGhyKVxuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSAmJiAoeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGwpXG4gICAgICB4aHIub25sb2FkICYmICh4aHIub25sb2FkID0gbnVsbClcbiAgICB9XG4gIH1cbiAgeGhyLm9wZW4ocGFyYW1zLnR5cGUsIHBhcmFtcy51cmwsIHBhcmFtcy5hc3luYyA9PT0gdm9pZCAwID8gITAgOiBwYXJhbXMuYXN5bmMpXG4gIC8qIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlOyAqL1xuICBpZiAoXy5pc09iamVjdChwYXJhbXMuaGVhZGVyKSkge1xuICAgIGZvciAodmFyIGkgaW4gcGFyYW1zLmhlYWRlcikge1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaSwgcGFyYW1zLmhlYWRlcltpXSlcbiAgICB9XG4gIH1cbiAgaWYgKHBhcmFtcy5kYXRhKSB7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJYLVJlcXVlc3RlZC1XaXRoXCIsIFwiWE1MSHR0cFJlcXVlc3RcIilcbiAgICBwYXJhbXMuY29udGVudFR5cGUgPT09IFwiYXBwbGljYXRpb24vanNvblwiID8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04XCIpIDogeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIilcbiAgfVxuICB4aHIuc2VuZChwYXJhbXMuZGF0YSB8fCBudWxsKVxufVxuXG5fLmluZm8gPSB7XG4gIHNlYXJjaEVuZ2luZTogZnVuY3Rpb24gKHJlZmVycmVyKSB7XG4gICAgaWYgKHJlZmVycmVyLnNlYXJjaChcImh0dHBzPzovLyguKilnb29nbGUuKFteLz9dKilcIikgPT09IDApIHtcbiAgICAgIHJldHVybiBcImdvb2dsZVwiXG4gICAgfSBlbHNlIGlmIChyZWZlcnJlci5zZWFyY2goXCJodHRwcz86Ly8oLiopYmluZy5jb21cIikgPT09IDApIHtcbiAgICAgIHJldHVybiBcImJpbmdcIlxuICAgIH0gZWxzZSBpZiAocmVmZXJyZXIuc2VhcmNoKFwiaHR0cHM/Oi8vKC4qKXlhaG9vLmNvbVwiKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIFwieWFob29cIlxuICAgIH0gZWxzZSBpZiAocmVmZXJyZXIuc2VhcmNoKFwiaHR0cHM/Oi8vKC4qKWR1Y2tkdWNrZ28uY29tXCIpID09PSAwKSB7XG4gICAgICByZXR1cm4gXCJkdWNrZHVja2dvXCJcbiAgICB9IGVsc2UgaWYgKHJlZmVycmVyLnNlYXJjaChcImh0dHBzPzovLyguKilzb2dvdS5jb21cIikgPT09IDApIHtcbiAgICAgIHJldHVybiBcInNvZ291XCJcbiAgICB9IGVsc2UgaWYgKHJlZmVycmVyLnNlYXJjaChcImh0dHBzPzovLyguKilzby5jb21cIikgPT09IDApIHtcbiAgICAgIHJldHVybiBcIjM2MHNvXCJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH0sXG4gIGJyb3dzZXI6IGZ1bmN0aW9uICh1c2VyQWdlbnQsIHYsIG9wZXJhKSB7XG4gICAgdmFyIHZlbmRvciA9IHYgfHwgXCJcIiAvLyB2ZW5kb3IgaXMgdW5kZWZpbmVkIGZvciBhdCBsZWFzdCBJRTlcbiAgICBpZiAob3BlcmEgfHwgXy5pbmNsdWRlcyh1c2VyQWdlbnQsIFwiIE9QUi9cIikpIHtcbiAgICAgIGlmIChfLmluY2x1ZGVzKHVzZXJBZ2VudCwgXCJNaW5pXCIpKSB7XG4gICAgICAgIHJldHVybiBcIk9wZXJhIE1pbmlcIlxuICAgICAgfVxuICAgICAgcmV0dXJuIFwiT3BlcmFcIlxuICAgIH0gZWxzZSBpZiAoLyhCbGFja0JlcnJ5fFBsYXlCb29rfEJCMTApL2kudGVzdCh1c2VyQWdlbnQpKSB7XG4gICAgICByZXR1cm4gXCJCbGFja0JlcnJ5XCJcbiAgICB9IGVsc2UgaWYgKF8uaW5jbHVkZXModXNlckFnZW50LCBcIklFTW9iaWxlXCIpIHx8IF8uaW5jbHVkZXModXNlckFnZW50LCBcIldQRGVza3RvcFwiKSkge1xuICAgICAgcmV0dXJuIFwiSW50ZXJuZXQgRXhwbG9yZXIgTW9iaWxlXCJcbiAgICB9IGVsc2UgaWYgKF8uaW5jbHVkZXModXNlckFnZW50LCBcIkVkZ2VcIikpIHtcbiAgICAgIHJldHVybiBcIk1pY3Jvc29mdCBFZGdlXCJcbiAgICB9IGVsc2UgaWYgKF8uaW5jbHVkZXModXNlckFnZW50LCBcIkZCSU9TXCIpKSB7XG4gICAgICByZXR1cm4gXCJGYWNlYm9vayBNb2JpbGVcIlxuICAgIH0gZWxzZSBpZiAoXy5pbmNsdWRlcyh1c2VyQWdlbnQsIFwiQ2hyb21lXCIpKSB7XG4gICAgICByZXR1cm4gXCJDaHJvbWVcIlxuICAgIH0gZWxzZSBpZiAoXy5pbmNsdWRlcyh1c2VyQWdlbnQsIFwiQ3JpT1NcIikpIHtcbiAgICAgIHJldHVybiBcIkNocm9tZSBpT1NcIlxuICAgIH0gZWxzZSBpZiAoXy5pbmNsdWRlcyh2ZW5kb3IsIFwiQXBwbGVcIikpIHtcbiAgICAgIGlmIChfLmluY2x1ZGVzKHVzZXJBZ2VudCwgXCJNb2JpbGVcIikpIHtcbiAgICAgICAgcmV0dXJuIFwiTW9iaWxlIFNhZmFyaVwiXG4gICAgICB9XG4gICAgICByZXR1cm4gXCJTYWZhcmlcIlxuICAgIH0gZWxzZSBpZiAoXy5pbmNsdWRlcyh1c2VyQWdlbnQsIFwiQW5kcm9pZFwiKSkge1xuICAgICAgcmV0dXJuIFwiQW5kcm9pZCBNb2JpbGVcIlxuICAgIH0gZWxzZSBpZiAoXy5pbmNsdWRlcyh1c2VyQWdlbnQsIFwiS29ucXVlcm9yXCIpKSB7XG4gICAgICByZXR1cm4gXCJLb25xdWVyb3JcIlxuICAgIH0gZWxzZSBpZiAoXy5pbmNsdWRlcyh1c2VyQWdlbnQsIFwiRmlyZWZveFwiKSkge1xuICAgICAgcmV0dXJuIFwiRmlyZWZveFwiXG4gICAgfSBlbHNlIGlmIChfLmluY2x1ZGVzKHVzZXJBZ2VudCwgXCJNU0lFXCIpIHx8IF8uaW5jbHVkZXModXNlckFnZW50LCBcIlRyaWRlbnQvXCIpKSB7XG4gICAgICByZXR1cm4gXCJJbnRlcm5ldCBFeHBsb3JlclwiXG4gICAgfSBlbHNlIGlmIChfLmluY2x1ZGVzKHVzZXJBZ2VudCwgXCJHZWNrb1wiKSkge1xuICAgICAgcmV0dXJuIFwiTW96aWxsYVwiXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIlwiXG4gICAgfVxuICB9LFxuICBicm93c2VyVmVyc2lvbjogZnVuY3Rpb24gKHVzZXJBZ2VudCwgdmVuZG9yLCBvcGVyYSkge1xuICAgIHZhciBicm93c2VyID0gXy5pbmZvLmJyb3dzZXIodXNlckFnZW50LCB2ZW5kb3IsIG9wZXJhKVxuICAgIHZhciB2ZXJzaW9uUmVnZXhzID0ge1xuICAgICAgXCJJbnRlcm5ldCBFeHBsb3JlciBNb2JpbGVcIjogL3J2OihcXGQrKFxcLlxcZCspPykvLFxuICAgICAgXCJNaWNyb3NvZnQgRWRnZVwiOiAvRWRnZVxcLyhcXGQrKFxcLlxcZCspPykvLFxuICAgICAgXCJDaHJvbWVcIjogL0Nocm9tZVxcLyhcXGQrKFxcLlxcZCspPykvLFxuICAgICAgXCJDaHJvbWUgaU9TXCI6IC9DaHJvbWVcXC8oXFxkKyhcXC5cXGQrKT8pLyxcbiAgICAgIFwiU2FmYXJpXCI6IC9WZXJzaW9uXFwvKFxcZCsoXFwuXFxkKyk/KS8sXG4gICAgICBcIk1vYmlsZSBTYWZhcmlcIjogL1ZlcnNpb25cXC8oXFxkKyhcXC5cXGQrKT8pLyxcbiAgICAgIFwiT3BlcmFcIjogLyhPcGVyYXxPUFIpXFwvKFxcZCsoXFwuXFxkKyk/KS8sXG4gICAgICBcIkZpcmVmb3hcIjogL0ZpcmVmb3hcXC8oXFxkKyhcXC5cXGQrKT8pLyxcbiAgICAgIFwiS29ucXVlcm9yXCI6IC9Lb25xdWVyb3I6KFxcZCsoXFwuXFxkKyk/KS8sXG4gICAgICBcIkJsYWNrQmVycnlcIjogL0JsYWNrQmVycnkgKFxcZCsoXFwuXFxkKyk/KS8sXG4gICAgICBcIkFuZHJvaWQgTW9iaWxlXCI6IC9hbmRyb2lkXFxzKFxcZCsoXFwuXFxkKyk/KS8sXG4gICAgICBcIkludGVybmV0IEV4cGxvcmVyXCI6IC8ocnY6fE1TSUUgKShcXGQrKFxcLlxcZCspPykvLFxuICAgICAgXCJNb3ppbGxhXCI6IC9ydjooXFxkKyhcXC5cXGQrKT8pL1xuICAgIH1cbiAgICB2YXIgcmVnZXggPSB2ZXJzaW9uUmVnZXhzW2Jyb3dzZXJdXG4gICAgaWYgKHJlZ2V4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIHZhciBtYXRjaGVzID0gdXNlckFnZW50Lm1hdGNoKHJlZ2V4KVxuICAgIGlmICghbWF0Y2hlcykge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgcmV0dXJuIFN0cmluZyhwYXJzZUZsb2F0KG1hdGNoZXNbbWF0Y2hlcy5sZW5ndGggLSAyXSkpXG4gIH0sXG4gIG9zOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGEgPSB1c2VyQWdlbnRcbiAgICBpZiAoL1dpbmRvd3MvaS50ZXN0KGEpKSB7XG4gICAgICBpZiAoL1Bob25lLy50ZXN0KGEpKSB7XG4gICAgICAgIHJldHVybiBcIldpbmRvd3MgTW9iaWxlXCJcbiAgICAgIH1cbiAgICAgIHJldHVybiBcIldpbmRvd3NcIlxuICAgIH0gZWxzZSBpZiAoLyhpUGhvbmV8aVBhZHxpUG9kKS8udGVzdChhKSkge1xuICAgICAgcmV0dXJuIFwiaU9TXCJcbiAgICB9IGVsc2UgaWYgKC9BbmRyb2lkLy50ZXN0KGEpKSB7XG4gICAgICByZXR1cm4gXCJBbmRyb2lkXCJcbiAgICB9IGVsc2UgaWYgKC8oQmxhY2tCZXJyeXxQbGF5Qm9va3xCQjEwKS9pLnRlc3QoYSkpIHtcbiAgICAgIHJldHVybiBcIkJsYWNrQmVycnlcIlxuICAgIH0gZWxzZSBpZiAoL01hYy9pLnRlc3QoYSkpIHtcbiAgICAgIHJldHVybiBcIk1hYyBPUyBYXCJcbiAgICB9IGVsc2UgaWYgKC9MaW51eC8udGVzdChhKSkge1xuICAgICAgcmV0dXJuIFwiTGludXhcIlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJcIlxuICAgIH1cbiAgfSxcbiAgZGV2aWNlOiBmdW5jdGlvbiAodXNlckFnZW50KSB7XG4gICAgaWYgKC9pUGFkLy50ZXN0KHVzZXJBZ2VudCkpIHtcbiAgICAgIHJldHVybiBcImlQYWRcIlxuICAgIH0gZWxzZSBpZiAoL2lQb2QvaS50ZXN0KHVzZXJBZ2VudCkpIHtcbiAgICAgIHJldHVybiBcImlQb2RcIlxuICAgIH0gZWxzZSBpZiAoL2lQaG9uZS9pLnRlc3QodXNlckFnZW50KSkge1xuICAgICAgcmV0dXJuIFwiaVBob25lXCJcbiAgICB9IGVsc2UgaWYgKC8oQmxhY2tCZXJyeXxQbGF5Qm9va3xCQjEwKS9pLnRlc3QodXNlckFnZW50KSkge1xuICAgICAgcmV0dXJuIFwiQmxhY2tCZXJyeVwiXG4gICAgfSBlbHNlIGlmICgvV2luZG93cyBQaG9uZS9pLnRlc3QodXNlckFnZW50KSkge1xuICAgICAgcmV0dXJuIFwiV2luZG93cyBQaG9uZVwiXG4gICAgfSBlbHNlIGlmICgvV2luZG93cy9pLnRlc3QodXNlckFnZW50KSkge1xuICAgICAgcmV0dXJuIFwiV2luZG93c1wiXG4gICAgfSBlbHNlIGlmICgvTWFjaW50b3NoL2kudGVzdCh1c2VyQWdlbnQpKSB7XG4gICAgICByZXR1cm4gXCJNYWNpbnRvc2hcIlxuICAgIH0gZWxzZSBpZiAoL0FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCkpIHtcbiAgICAgIHJldHVybiBcIkFuZHJvaWRcIlxuICAgIH0gZWxzZSBpZiAoL0xpbnV4L2kudGVzdCh1c2VyQWdlbnQpKSB7XG4gICAgICByZXR1cm4gXCJMaW51eFwiXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIlwiXG4gICAgfVxuICB9LFxuICByZWZlcnJpbmdEb21haW46IGZ1bmN0aW9uIChyZWZlcnJlcikge1xuICAgIHZhciBzcGxpdCA9IHJlZmVycmVyLnNwbGl0KFwiL1wiKVxuICAgIGlmIChzcGxpdC5sZW5ndGggPj0gMykge1xuICAgICAgcmV0dXJuIHNwbGl0WzJdXG4gICAgfVxuICAgIHJldHVybiBcIlwiXG4gIH0sXG4gIGdldEJyb3dzZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYnJvd3NlcjogZGV0ZWN0b3IuYnJvd3Nlci5uYW1lLFxuICAgICAgYnJvd3Nlcl92ZXJzaW9uOiBTdHJpbmcoZGV0ZWN0b3IuYnJvd3Nlci52ZXJzaW9uKVxuICAgIH1cbiAgfSxcbiAgZ2V0V2luZG93OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHdpbldpZHRoLCB3aW5IZWlnaHRcbiAgICAvLyDojrflj5bnqpflj6Plrr3luqZcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGgpIHsgd2luV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCB9IGVsc2UgaWYgKGRvY3VtZW50LmJvZHkgJiYgZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCkgeyB3aW5XaWR0aCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggfVxuICAgIC8vIOiOt+WPlueql+WPo+mrmOW6plxuICAgIGlmICh3aW5kb3cuaW5uZXJIZWlnaHQpIHsgd2luSGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0IH0gZWxzZSBpZiAoZG9jdW1lbnQuYm9keSAmJiBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCkgeyB3aW5IZWlnaHQgPSBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCB9XG4gICAgLy8g6YCa6L+H5rex5YWlIERvY3VtZW50IOWGhemDqOWvuSBib2R5IOi/m+ihjOajgOa1i++8jOiOt+WPlueql+WPo+Wkp+Wwj1xuICAgIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpIHtcbiAgICAgIHdpbkhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcbiAgICAgIHdpbldpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB3aW5fd2lkdGg6IHdpbldpZHRoLFxuICAgICAgd2luX2hlaWdodDogd2luSGVpZ2h0XG4gICAgfVxuICB9LFxuICBwcm9wZXJ0aWVzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGgxcyA9IGRvY3VtZW50LmJvZHkgJiYgZG9jdW1lbnQuYm9keS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImgxXCIpLFxuICAgICAgcGFnZUgxID0gXCJcIlxuXG4gICAgaWYgKGgxcyAmJiBoMXMubGVuZ3RoICYmIGgxcy5sZW5ndGggPiAwKSB7XG4gICAgICBwYWdlSDEgPSBoMXNbMF0uaW5uZXJUZXh0IHx8IGgxcy50ZXh0Q29udGVudCB8fCBcIlwiXG4gICAgfVxuICAgIHJldHVybiBfLmV4dGVuZCh7fSwge1xuICAgICAgb3M6IGRldGVjdG9yLm9zLm5hbWUsXG4gICAgICBvc192ZXJzaW9uOiBkZXRlY3Rvci5vcy5mdWxsVmVyc2lvbixcbiAgICAgIGRldmljZTogZGV0ZWN0b3IuZGV2aWNlLm5hbWUsXG4gICAgICBkZXZpY2VfdmVyc2lvbjogZGV0ZWN0b3IuZGV2aWNlLmZ1bGxWZXJzaW9uXG4gICAgfSwge1xuICAgICAgYnJvd3Nlcl9lbmdpbmU6IGRldGVjdG9yLmVuZ2luZS5uYW1lLFxuICAgICAgc2NyZWVuX2hlaWdodDogc2NyZWVuLmhlaWdodCxcbiAgICAgIHNjcmVlbl93aWR0aDogc2NyZWVuLndpZHRoLFxuICAgICAgcGFnZV90aXRsZTogZG9jdW1lbnQudGl0bGUsXG4gICAgICBwYWdlX2gxOiBwYWdlSDEsXG4gICAgICBwYWdlX3JlZmVycmVyOiBkb2N1bWVudC5yZWZlcnJlcixcbiAgICAgIHBhZ2VfdXJsOiBsb2NhdGlvbi5ocmVmLFxuICAgICAgcGFnZV91cmxfcGF0aDogbG9jYXRpb24ucGF0aG5hbWUsXG4gICAgICBsaWI6IFwianNcIixcbiAgICAgIGxpYl92ZXJzaW9uOiBMSUJfVkVSU0lPTlxuICAgIH0sIF8uaW5mby5nZXRCcm93c2VyKCkpXG4gIH0sXG4gIC8vIOS/neWtmOS4tOaXtueahOS4gOS6m+WPmOmHj++8jOWPqumSiOWvueW9k+WJjemhtemdouacieaViFxuICBjdXJyZW50UHJvcHM6IHt9LFxuICByZWdpc3RlcjogZnVuY3Rpb24gKG9iaikge1xuICAgIF8uZXh0ZW5kKF8uaW5mby5jdXJyZW50UHJvcHMsIG9iailcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9cbiIsIi8qKlxuICogQGF1dGhvciBqaWFuZ2ZlbmdcbiAqIEBzdW1tYXJ5IFNES+WfuuehgOmFjee9rlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTElCX1ZFUlNJT046IFwiMS4wLjBcIiwgLy8gU0RL54mI5pysXG4gIExJQl9LRVk6IFwiUlhBUE0yMDE3MDhcIiwgLy8g5LiOU0RL5a6J6KOF5pe255qES2V55a+55bqUXG4gIG1heExpbWl0OiAxMCwgLy8g5Y+R6YCB6ZmQ5Yi277yM5aSa5LqO5b2T5YmN6K6+572u5p2h5pWw77yM5bCx5Lya5Y+R6YCB5LqL5Lu2XG4gIGNyb3NzU3ViRG9tYWluOiB0cnVlLCAvLyDmmK/lkKbot6jln59cbiAgbG9hZFRpbWU6IG5ldyBEYXRlKCksIC8vIFNES+WKoOi9veaXtumXtFxuICBhcGlIb3N0OiBcImh0dHA6Ly8xNzIuMTYuMTIuMTg3OjgwOTlcIixcbiAgb0F1dGg6IGZhbHNlLFxuICBhZ2VudElkOiBcIjM1XCJcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBwYWdlTG9hZGVyX2xvYWRlZDogXCJwYWdlTG9hZGVyX2xvYWRlZFwiLFxuICBwYWdlTG9hZGVyX2RvbWxvYWRpbmc6IFwicGFnZUxvYWRlcl9kb21sb2FkaW5nXCIsXG4gIGtlcGxlcl9tZXNzYWdlX3R5cGU6IFwiS2VwbGVyLU1lc3NhZ2UtVHlwZVwiLFxuICBrZXBsZXJfYWdlbnRfdG9rZW46IFwiS2VwbGVyLUFnZW50LVRva2VuXCIsXG4gIGtlcGxlcl9jb25maWdfdmVyc2lvbjogXCJLZXBsZXItQ29uZmlnLVZlcnNpb25cIixcbiAgV0VCX0VSUk9SOiBcIldFQl9FUlJPUlwiLFxuICBXRUJfTE9BRF9CQVRDSDogXCJXRUJfTE9BRF9CQVRDSFwiLFxuICBXRUJfQUpBWF9CQVRDSDogXCJXRUJfQUpBWF9CQVRDSFwiXG59XG4iLCJ2YXIgXyA9IHJlcXVpcmUoXCIuL2NvbW1vblwiKVxudmFyIEpTT04gPSByZXF1aXJlKFwiLi9qc29uXCIpXG5cbnZhciBIVE1MID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCByTGlua0J1dHRvbiA9IC9eKEF8QlVUVE9OKSQvXG52YXIgZG9tID0ge1xuICAvLyDlhYPntKDms6jlhozkuovku7ZcbiAgLy8gZWxlbSB7RE9NRWxlbWVudH1cbiAgLy8gZXZlbnRUeXBlIHtTdHJpbmd9XG4gIC8vIGZuIHtGdW5jdGlvbn1cbiAgLy8gcmV0dXJuIHt1bmRlZmluZWR9XG4gIGFkZEV2ZW50OiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgID8gZnVuY3Rpb24gKGVsZW0sIGV2ZW50VHlwZSwgZm4pIHtcbiAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGZuLCB0cnVlKVxuICAgIH1cbiAgICA6IGZ1bmN0aW9uIChlbGVtLCBldmVudFR5cGUsIGZuKSB7XG4gICAgICBlbGVtLmF0dGFjaEV2ZW50KFwib25cIiArIGV2ZW50VHlwZSwgZm4pXG4gICAgfSxcblxuICBpbm5lclRleHQ6IFwiaW5uZXJUZXh0XCIgaW4gSFRNTFxuICAgID8gZnVuY3Rpb24gKGVsZW0pIHtcbiAgICAgIHJldHVybiBlbGVtLmlubmVyVGV4dFxuICAgIH1cbiAgICA6IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICByZXR1cm4gZWxlbS50ZXh0Q29udGVudFxuICAgIH0sXG5cbiAgLy8g5LuO5LiA5Liq5YWD57Sg6Ieq6Lqr5byA5aeL77yM5ZCR5LiK5p+l5om+5LiA5Liq5Yy56YWN5oyH5a6a5qCH562+55qE5YWD57SgXG4gIC8vIGVsZW0ge0RPTUVsZW1lbnR9XG4gIC8vIHRhZ05hbWUge1N0cmluZ31cbiAgLy8gcm9vdCB7RE9NRWxlbWVudH0g5Y+v5oyH5a6a55qE5qC55YWD57SgXG4gIC8vIHJldHVybiB7RE9NRWxlbWVudHx1bmRlZmluZWR9XG4gIGlBbmNlc3RvclRhZzogZnVuY3Rpb24gKGVsZW0sIHRhZ05hbWUsIHJvb3QpIHtcbiAgICB0YWdOYW1lLnRlc3QgfHwgKHRhZ05hbWUgPSB0YWdOYW1lLnRvVXBwZXJDYXNlKCkpXG4gICAgcm9vdCB8fCAocm9vdCA9IGRvY3VtZW50KVxuICAgIGRvIHtcbiAgICAgIGlmICh0YWdOYW1lLnRlc3QgPyB0YWdOYW1lLnRlc3QoZWxlbS50YWdOYW1lKSA6IGVsZW0udGFnTmFtZSA9PT0gdGFnTmFtZSkgeyByZXR1cm4gZWxlbSB9XG4gICAgfSB3aGlsZSAoZWxlbSAhPT0gcm9vdCAmJiAoZWxlbSA9IGVsZW0ucGFyZW50Tm9kZSkpXG4gIH0sXG5cbiAgLy8g5oyJ6ZKu57G75Z6LQm9vbGVhbuihqFxuICBCVVRUT05fVFlQRToge1xuICAgIGJ1dHRvbjogITAsXG4gICAgaW1hZ2U6ICEwLCAvLyDlm77lg4/mjInpkq5cbiAgICBzdWJtaXQ6ICEwLFxuICAgIHJlc2V0OiAhMFxuICB9LFxuXG4gIC8vIOiOt+WPlueCueWHu+S6i+S7tueahOmihOe9ruS/oeaBr1xuICAvLyBlbGVtIHtET01FdmVudH1cbiAgLy8gcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfVxuICBnZXRDbGlja1ByZXNldDogZnVuY3Rpb24gKGUpIHtcbiAgICBlIHx8IChlID0gd2luZG93LmV2ZW50KVxuICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnQsXG4gICAgICB0YWdOYW1lID0gdGFyZ2V0LnRhZ05hbWUsXG4gICAgICBhVGFyZ2V0LFxuICAgICAgcHJlc2V0LFxuICAgICAgdHlwZSxcbiAgICAgIHRleHQsXG4gICAgICBocmVmLFxuICAgICAgZG9tUGF0aCxcbiAgICAgIG9mZnNldCxcbiAgICAgIGRvbVNpemVcbiAgICBzd2l0Y2ggKHRhZ05hbWUpIHtcbiAgICBjYXNlIFwiSU5QVVRcIjpcbiAgICAgIHR5cGUgPSB0YXJnZXQudHlwZVxuICAgICAgaWYgKGRvbS5CVVRUT05fVFlQRVt0eXBlXSkge1xuICAgICAgICBkb21QYXRoID0gdGhpcy5nZXREb21TZWxlY3Rvcih0YXJnZXQpXG4gICAgICAgIGRvbVNpemUgPSB0aGlzLmdldERvbVNpemUodGFyZ2V0KVxuICAgICAgICBvZmZzZXQgPSB0aGlzLmdldERvbUV2ZW50T2Zmc2V0KGUsIHRhcmdldClcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGRvbVBhdGg6IGRvbVBhdGgsXG4gICAgICAgICAgICAgIGRvbVNpemU6IGRvbVNpemUsXG4gICAgICAgICAgICAgIG9mZnNldDogb2Zmc2V0XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIDJcbiAgICAgICAgICApXG4gICAgICAgIClcblxuICAgICAgICBwcmVzZXQgPSB7XG4gICAgICAgICAgZXZlbnQ6IFwiYnRuX2NsaWNrXCIsXG4gICAgICAgICAgY2F0ZWdvcnk6IFwiY2xpY2tcIixcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBiX2RvbV9wYXRoOiBkb21QYXRoLCAvLyDojrflj5ZET01TZWxlY3RvclxuICAgICAgICAgICAgYl9vZmZzZXRfeDogb2Zmc2V0Lm9mZnNldFgsXG4gICAgICAgICAgICBiX29mZnNldF95OiBvZmZzZXQub2Zmc2V0WSxcbiAgICAgICAgICAgIGJfZG9tX3dpZHRoOiBkb21TaXplLndpZHRoLFxuICAgICAgICAgICAgYl9kb21faGVpZ2h0OiBkb21TaXplLmhlaWdodCxcbiAgICAgICAgICAgIGJfYnRuX3R5cGU6IHR5cGUsIC8vIOexu+Wei1xuICAgICAgICAgICAgYl9idG5fdGV4dDogdGFyZ2V0LnZhbHVlLCAvLyDmjInpkq7mloflrZdcbiAgICAgICAgICAgIGJfYnRuX25hbWU6IHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpIHx8IFwiXCIsIC8vIOaMiemSrm5hbWVcbiAgICAgICAgICAgIGJfYnRuX3ZhbHVlOiB0YXJnZXQuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikgfHwgXCJcIiAvLyDmjInpkq52YWx1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgYVRhcmdldCA9IGRvbS5pQW5jZXN0b3JUYWcodGFyZ2V0LCByTGlua0J1dHRvbilcbiAgICAgIGlmIChhVGFyZ2V0KSB7XG4gICAgICAgIGRvbVBhdGggPSB0aGlzLmdldERvbVNlbGVjdG9yKGFUYXJnZXQpXG4gICAgICAgIGRvbVNpemUgPSB0aGlzLmdldERvbVNpemUoYVRhcmdldClcbiAgICAgICAgb2Zmc2V0ID0gdGhpcy5nZXREb21FdmVudE9mZnNldChlLCBhVGFyZ2V0KVxuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZG9tUGF0aDogZG9tUGF0aCxcbiAgICAgICAgICAgICAgZG9tU2l6ZTogZG9tU2l6ZSxcbiAgICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgMlxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgICBzd2l0Y2ggKGFUYXJnZXQudGFnTmFtZSkge1xuICAgICAgICBjYXNlIFwiQlVUVE9OXCI6XG4gICAgICAgICAgdGV4dCA9IF8udHJpbShkb20uaW5uZXJUZXh0KGFUYXJnZXQpKVxuICAgICAgICAgIHByZXNldCA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBcImJ0bl9jbGlja1wiLFxuICAgICAgICAgICAgY2F0ZWdvcnk6IFwiY2xpY2tcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgYl9kb21fcGF0aDogZG9tUGF0aCwgLy8g6I635Y+WRE9NU2VsZWN0b3JcbiAgICAgICAgICAgICAgYl9vZmZzZXRfeDogb2Zmc2V0Lm9mZnNldFgsXG4gICAgICAgICAgICAgIGJfb2Zmc2V0X3k6IG9mZnNldC5vZmZzZXRZLFxuICAgICAgICAgICAgICBiX2RvbV93aWR0aDogZG9tU2l6ZS53aWR0aCxcbiAgICAgICAgICAgICAgYl9kb21faGVpZ2h0OiBkb21TaXplLmhlaWdodCxcbiAgICAgICAgICAgICAgYl9idG5fdHlwZTogYVRhcmdldC50eXBlLCAvLyDnsbvlnotcbiAgICAgICAgICAgICAgYl9idG5fdGV4dDogdGV4dCwgLy8g5oyJ6ZKu5paH5a2XXG4gICAgICAgICAgICAgIGJfYnRuX25hbWU6IGFUYXJnZXQuZ2V0QXR0cmlidXRlKFwibmFtZVwiKSB8fCBcIlwiLCAvLyDmjInpkq5uYW1lXG4gICAgICAgICAgICAgIGJfYnRuX3ZhbHVlOiBhVGFyZ2V0LmdldEF0dHJpYnV0ZShcInZhbHVlXCIpIHx8IFwiXCIgLy8g5oyJ6ZKudmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSBcIkFcIjpcbiAgICAgICAgICB0ZXh0ID0gXy50cmltKGRvbS5pbm5lclRleHQoYVRhcmdldCkpXG4gICAgICAgICAgaHJlZiA9IGFUYXJnZXQuaHJlZlxuICAgICAgICAgIHByZXNldCA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBcImxpbmtfY2xpY2tcIixcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcImNsaWNrXCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGJfZG9tX3BhdGg6IGRvbVBhdGgsIC8vIOiOt+WPlkRPTVNlbGVjdG9yXG4gICAgICAgICAgICAgIGJfb2Zmc2V0X3g6IG9mZnNldC5vZmZzZXRYLFxuICAgICAgICAgICAgICBiX29mZnNldF95OiBvZmZzZXQub2Zmc2V0WSxcbiAgICAgICAgICAgICAgYl9kb21fd2lkdGg6IGRvbVNpemUud2lkdGgsXG4gICAgICAgICAgICAgIGJfZG9tX2hlaWdodDogZG9tU2l6ZS5oZWlnaHQsXG4gICAgICAgICAgICAgIGJfbGlua191cmw6IGhyZWYsIC8vIOmTvuaOpeWcsOWdgFxuICAgICAgICAgICAgICBiX2xpbmtfdGV4dDogdGV4dCAvLyDpk77mjqXmloflrZdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb21QYXRoID0gdGhpcy5nZXREb21TZWxlY3Rvcih0YXJnZXQpXG4gICAgICAgIGRvbVNpemUgPSB0aGlzLmdldERvbVNpemUodGFyZ2V0KVxuICAgICAgICBvZmZzZXQgPSB0aGlzLmdldERvbUV2ZW50T2Zmc2V0KGUsIHRhcmdldClcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGRvbVBhdGg6IGRvbVBhdGgsXG4gICAgICAgICAgICAgIGRvbVNpemU6IGRvbVNpemUsXG4gICAgICAgICAgICAgIG9mZnNldDogb2Zmc2V0XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIDJcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICAgcHJlc2V0ID0ge1xuICAgICAgICAgIGV2ZW50OiBcImVsZW1lbnRfY2xpY2tcIixcbiAgICAgICAgICBjYXRlZ29yeTogXCJjbGlja1wiLFxuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIGJfZG9tX3BhdGg6IGRvbVBhdGgsIC8vIOiOt+WPlkRPTVNlbGVjdG9yXG4gICAgICAgICAgICBiX29mZnNldF94OiBvZmZzZXQub2Zmc2V0WCxcbiAgICAgICAgICAgIGJfb2Zmc2V0X3k6IG9mZnNldC5vZmZzZXRZLFxuICAgICAgICAgICAgYl9kb21fd2lkdGg6IGRvbVNpemUud2lkdGgsXG4gICAgICAgICAgICBiX2RvbV9oZWlnaHQ6IGRvbVNpemUuaGVpZ2h0XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIOm8oOagh+WdkOagh1xuICAgIGlmIChwcmVzZXQpIHtcbiAgICAgIHByZXNldC5wcm9wZXJ0aWVzLmJfY2xpZW50WCA9IGUuY2xpZW50WFxuICAgICAgcHJlc2V0LnByb3BlcnRpZXMuYl9jbGllbnRZID0gZS5jbGllbnRZXG4gICAgfVxuICAgIHJldHVybiBwcmVzZXRcbiAgfSxcblxuICAvLyDpobXpnaLkvY3nva7lj4rnqpflj6PlpKflsI9cbiAgZ2V0UGFnZVNpemU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2NyVywgc2NySFxuICAgIGlmICh3aW5kb3cuaW5uZXJIZWlnaHQgJiYgd2luZG93LnNjcm9sbE1heFkpIHtcbiAgICAgIC8vIE1vemlsbGFcbiAgICAgIHNjclcgPSB3aW5kb3cuaW5uZXJXaWR0aCArIHdpbmRvdy5zY3JvbGxNYXhYXG4gICAgICBzY3JIID0gd2luZG93LmlubmVySGVpZ2h0ICsgd2luZG93LnNjcm9sbE1heFlcbiAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0ID4gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQpIHtcbiAgICAgIC8vIGFsbCBidXQgSUUgTWFjXG4gICAgICBzY3JXID0gZG9jdW1lbnQuYm9keS5zY3JvbGxXaWR0aFxuICAgICAgc2NySCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0XG4gICAgfSBlbHNlIGlmIChkb2N1bWVudC5ib2R5KSB7XG4gICAgICAvLyBJRSBNYWNcbiAgICAgIHNjclcgPSBkb2N1bWVudC5ib2R5Lm9mZnNldFdpZHRoXG4gICAgICBzY3JIID0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHRcbiAgICB9XG4gICAgdmFyIHdpblcsIHdpbkhcblxuICAgIGlmICh3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIC8vIGFsbCBleGNlcHQgSUVcbiAgICAgIHdpblcgPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgICAgd2luSCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgIH0gZWxzZSBpZiAoXG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxuICAgICkge1xuICAgICAgLy8gSUUgNiBTdHJpY3QgTW9kZVxuICAgICAgd2luVyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxuICAgICAgd2luSCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcbiAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIC8vIG90aGVyXG4gICAgICB3aW5XID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aFxuICAgICAgd2luSCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0XG4gICAgfVxuICAgIC8vIGZvciBzbWFsbCBwYWdlcyB3aXRoIHRvdGFsIHNpemUgbGVzc1xuICAgIC8vIHRoZW4gdGhlIHZpZXdwb3J0XG4gICAgdmFyIHBhZ2VXID0gc2NyVyA8IHdpblcgPyB3aW5XIDogc2NyV1xuICAgIHZhciBwYWdlSCA9IHNjckggPCB3aW5IID8gd2luSCA6IHNjckhcbiAgICByZXR1cm4ge1xuICAgICAgUGFnZVdpZHRoOiBwYWdlVyxcbiAgICAgIFBhZ2VIZWlnaHQ6IHBhZ2VILFxuICAgICAgV2luV2lkdGg6IHdpblcsXG4gICAgICBXaW5IZWlnaHQ6IHdpbkhcbiAgICB9XG4gIH0sXG5cbiAgLy8g5rua5Yqo5p2h5L2N572uXG4gIGdldFBhZ2VTY3JvbGw6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgeCwgeVxuICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQpIHtcbiAgICAgIC8vIGFsbCBleGNlcHQgSUVcbiAgICAgIHkgPSB3aW5kb3cucGFnZVlPZmZzZXRcbiAgICAgIHggPSB3aW5kb3cucGFnZVhPZmZzZXRcbiAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wKSB7XG4gICAgICAvLyBJRSA2IFN0cmljdFxuICAgICAgeCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0XG4gICAgICB5ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcFxuICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuYm9keSkge1xuICAgICAgLy8gYWxsXG4gICAgICAvLyBvdGhlciBJRVxuICAgICAgeCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdFxuICAgICAgeSA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGJfc2Nyb2xsWDogeCxcbiAgICAgIGJfc2Nyb2xsWTogeVxuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIOiOt+WPlkRPTeiKgueCueeahFNlbGVjdG9yXG4gICAqL1xuICBnZXREb21TZWxlY3RvcjogZnVuY3Rpb24gKGRvbSkge1xuICAgIHZhciBub2RlVHlwZSA9IGRvbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKG5vZGVUeXBlID09PSBcImJvZHlcIiB8fCBub2RlVHlwZSA9PT0gXCJodG1sXCIpIHJldHVybiBcImJvZHlcIlxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmVudCA9IGRvbS5wYXJlbnROb2RlXG4gICAgICBpZiAoZG9tLmdldEF0dHJpYnV0ZShcImlkXCIpKSB7IHJldHVybiB0aGlzLmdldERvbVNlbGVjdG9yKHBhcmVudCkgKyBcIj4jXCIgKyBkb20uZ2V0QXR0cmlidXRlKFwiaWRcIikgfSBlbHNlIGlmICgobm9kZVR5cGUgPT09IFwiaW5wdXRcIiB8fCBub2RlVHlwZSA9PT0gXCJzZWxlY3RcIiB8fCBub2RlVHlwZSA9PT0gXCJ0ZXh0YXJlYVwiIHx8IG5vZGVUeXBlID09PSBcImJ1dHRvblwiKSAmJiBkb20uZ2V0QXR0cmlidXRlKFwibmFtZVwiKSkge1xuICAgICAgICByZXR1cm4gKHRoaXMuZ2V0RG9tU2VsZWN0b3IocGFyZW50KSArIFwiPlwiICsgbm9kZVR5cGUgKyBcIjppbnB1dFtuYW1lPSdcIiArIGRvbS5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpICsgXCInXVwiKVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBlID0gW10sIGQgPSAwOyBkIDwgcGFyZW50LmNoaWxkcmVuLmxlbmd0aDsgZCsrKSB7XG4gICAgICAgIHZhciBmID0gcGFyZW50LmNoaWxkcmVuW2RdXG4gICAgICAgIGYubm9kZU5hbWUgJiYgZi5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBub2RlVHlwZSAmJiBlLnB1c2goZilcbiAgICAgIH1cbiAgICAgIGZvciAoZCA9IDA7IGQgPCBlLmxlbmd0aDsgZCsrKSB7XG4gICAgICAgIGlmIChlW2RdID09PSBkb20pIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXREb21TZWxlY3RvcihwYXJlbnQpICsgXCI+XCIgKyBub2RlVHlwZSArIFwiOmVxKFwiICsgZCArIFwiKVwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiDojrflj5ZET03lhYPntKDnm7jlr7nkuo7lj6/mmK/mlofmoaPljLrln5/lt6bkuIrop5LnmoTkvY3nva5cbiAgICovXG4gIGdldERvbU9mZnNldDogZnVuY3Rpb24gKGRvbSkge1xuICAgIHZhciBvZmZzZXQgPSB7XG4gICAgICB0b3A6IDAsXG4gICAgICBsZWZ0OiAwXG4gICAgfVxuICAgIGlmICh0eXBlb2YgZG9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCAhPT0gdHlwZW9mIHVuZGVmaW5lZCkge1xuICAgICAgb2Zmc2V0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG4gICAgICBkb20gPSBkb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIG9mZnNldCA9IHtcbiAgICAgICAgdG9wOiBkb20udG9wICsgKHdpbmRvdy5wYWdlWU9mZnNldCB8fCBvZmZzZXQuc2Nyb2xsVG9wKSAtIChvZmZzZXQuY2xpZW50VG9wIHx8IDApLFxuICAgICAgICBsZWZ0OiBkb20ubGVmdCArICh3aW5kb3cucGFnZVhPZmZzZXQgfHwgb2Zmc2V0LnNjcm9sbExlZnQpIC0gKG9mZnNldC5jbGllbnRMZWZ0IHx8IDApXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9mZnNldC50b3AgKz0gZG9tLm9mZnNldFRvcFxuICAgICAgb2Zmc2V0LmxlZnQgKz0gZG9tLm9mZnNldExlZnRcbiAgICAgIGlmIChkb20ub2Zmc2V0UGFyZW50KSB7XG4gICAgICAgIGRvbSA9IHRoaXMuZ2V0RG9tT2Zmc2V0KGRvbS5vZmZzZXRQYXJlbnQpXG4gICAgICAgIG9mZnNldC50b3AgKz0gZG9tLnRvcFxuICAgICAgICBvZmZzZXQubGVmdCArPSBkb20ubGVmdFxuICAgICAgfVxuXG4gICAgICBpZiAob2Zmc2V0LnRvcCA8IDApIG9mZnNldC50b3AgPSAwXG4gICAgICBpZiAob2Zmc2V0LmxlZnQgPCAwKSBvZmZzZXQubGVmdCA9IDBcbiAgICAgIG9mZnNldC50b3AgPSBpc05hTihvZmZzZXQudG9wKSA/IDAgOiBwYXJzZUludChvZmZzZXQudG9wLCAxMClcbiAgICAgIG9mZnNldC5sZWZ0ID0gaXNOYU4ob2Zmc2V0LmxlZnQpID8gMCA6IHBhcnNlSW50KG9mZnNldC5sZWZ0LCAxMClcbiAgICB9XG4gICAgb2Zmc2V0LnRvcCA9IE1hdGgucm91bmQob2Zmc2V0LnRvcClcbiAgICBvZmZzZXQubGVmdCA9IE1hdGgucm91bmQob2Zmc2V0LmxlZnQpXG4gICAgcmV0dXJuIG9mZnNldFxuICB9LFxuICAvKipcbiAgICog6I635Y+W5LqL5Lu25Y+R55Sf5pe25Z2Q5qCH55u45a+55LqO5LqL5Lu25rqQ55qE55u45a+55L2N572uXG4gICAqL1xuICBnZXREb21FdmVudE9mZnNldDogZnVuY3Rpb24gKGUsIHRhcmdldCkge1xuICAgIHZhciBvZmZzZXQgPSB7fVxuICAgIGlmIChlLm9mZnNldFggJiYgZS5vZmZzZXRZKSB7XG4gICAgICBvZmZzZXQub2Zmc2V0WCA9IGUub2Zmc2V0WFxuICAgICAgb2Zmc2V0Lm9mZnNldFkgPSBlLm9mZnNldFlcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJveCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgb2Zmc2V0Lm9mZnNldFggPSBlLmNsaWVudFggLSBib3gubGVmdFxuICAgICAgb2Zmc2V0Lm9mZnNldFkgPSBlLmNsaWVudFkgLSBib3gudG9wXG4gICAgfVxuICAgIHJldHVybiBvZmZzZXRcbiAgfSxcbiAgLyoqXG4gICAqIOiOt+WPluWFg+e0oOWkp+Wwj1xuICAgKi9cbiAgZ2V0RG9tU2l6ZTogZnVuY3Rpb24gKGRvbSkge1xuICAgIHZhciBzaXplID0ge31cbiAgICBzaXplLndpZHRoID0gZG9tLm9mZnNldFdpZHRoXG4gICAgc2l6ZS5oZWlnaHQgPSBkb20ub2Zmc2V0SGVpZ2h0XG4gICAgcmV0dXJuIHNpemVcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvbVxuIiwidmFyIGNvbW1vbiA9IHJlcXVpcmUoXCIuLi9jb21tb25cIilcbnZhciBjb25zdHMgPSByZXF1aXJlKFwiLi4vY29uc3RzXCIpXG52YXIgZXZlbnRFbWl0dGVyID0gcmVxdWlyZShcIi4uL2V2ZW50RW1pdHRlclwiKVxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuLi9jb25maWdcIilcbnZhciBsb2cgPSByZXF1aXJlKFwiLi4vbG9nXCIpXG52YXIgd2luT25FcnJvciA9IHdpbmRvdy5vbmVycm9yXG52YXIgZXJyb3JzID0gW11cblxuY29uc29sZS5sb2coY29uZmlnKVxuXG4vKiB2YXIgaSA9IGZhbHNlXG52YXIgaiA9IDAgKi9cblxuZnVuY3Rpb24gSW5uZXJFcnJvciAobXNnLCB1cmwsIGxpbmUpIHtcbiAgdGhpcy5tZXNzYWdlID0gbXNnIHx8IFwiVW5jYXVnaHQgZXJyb3Igd2l0aCBubyBhZGRpdGlvbmFsIGluZm9ybWF0aW9uXCJcbiAgdGhpcy5zb3VyY2VVUkwgPSB1cmxcbiAgdGhpcy5saW5lID0gbGluZVxufVxuXG5ldmVudEVtaXR0ZXIub24oXCJlcnJcIiwgZnVuY3Rpb24gKGVycikge1xuICBsb2coXCI9PT095o2V6I635Yiw6ZSZ6K+vPT09PVwiKVxuICBsb2coYXJndW1lbnRzKVxuICBlcnJvcnMucHVzaChlcnIpXG59KVxuXG5zZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gIHZhciBkYXRhID0gW11cbiAgaWYgKGVycm9ycy5sZW5ndGggPiBjb25maWcubWF4TGltaXQpIHtcbiAgICBkYXRhID0gZXJyb3JzLnNwbGljZSgwLCBjb25maWcubWF4TGltaXQpXG4gIH0gZWxzZSB7XG4gICAgZGF0YSA9IGVycm9ycy5zcGxpY2UoMCwgZXJyb3JzLmxlbmd0aClcbiAgfVxuICB2YXIgb3B0aW9ucyA9IHtcbiAgICB1cmw6IGNvbmZpZy5hcGlIb3N0LFxuICAgIHR5cGU6IFwiZ2V0XCIsXG4gICAgY29yczogdHJ1ZSxcbiAgICBkYXRhOiBkYXRhLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBsb2coXCLplJnor6/kv6Hmga/lt7Llj5HpgIFcIilcbiAgICB9LFxuICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XG4gICAgICBsb2coeGhyLnN0YXR1cylcbiAgICAgIGxvZyh4aHIuc3RhdHVzVGV4dClcbiAgICAgIC8vIGVycm9ycy5jb25jYXQoZGF0YSlcbiAgICB9LFxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBsb2coXCLplJnor6/kv6Hmga/lj5HpgIHlrozmr5UuXCIpXG4gICAgfVxuICB9XG5cbiAgb3B0aW9ucy5oZWFkZXIgPSB7fVxuICBvcHRpb25zLmhlYWRlcltjb25zdHMua2VwbGVyX21lc3NhZ2VfdHlwZV0gPSBjb25zdHMud2ViX2Vycm9yXG4gIG9wdGlvbnMuaGVhZGVyW2NvbnN0cy5rZXBsZXJfYWdlbnRfdG9rZW5dID0gY29uZmlnLmFnZW50SWRcbiAgb3B0aW9ucy5oZWFkZXJbY29uc3RzLmtlcGxlcl9jb25maWdfdmVyc2lvbl0gPSBjb25maWcuTElCX1ZFUlNJT05cblxuICAvLyBjb21tb24uYWpheChvcHRpb25zKVxufSwgY29uZmlnLnRyYW5zRnJlcXVlbmN5KVxuXG5mdW5jdGlvbiBvbkVycm9yIChtc2csIHVybCwgbGluZSwgY29sLCBlcnJvcikge1xuICB0cnkge1xuICAgIGV2ZW50RW1pdHRlci5lbWl0KFwiZXJyXCIsIFtlcnJvciB8fCBuZXcgSW5uZXJFcnJvcihtc2csIHVybCwgbGluZSldKVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHRyeSB7XG4gICAgICBldmVudEVtaXR0ZXIuZW1pdChcImlubmVyZXJyXCIsIFtlcnJvciwgKG5ldyBEYXRlKCkpLmdldFRpbWUoKSwgdHJ1ZV0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHt9XG4gIH1cbiAgcmV0dXJuIHR5cGVvZiB3aW5PbkVycm9yID09PSBcImZ1bmN0aW9uXCIgPyB3aW5PbkVycm9yLmFwcGx5KHRoaXMsIGNvbW1vbi50b0FycmF5KGFyZ3VtZW50cykpIDogZmFsc2Vcbn1cblxud2luZG93Lm9uZXJyb3IgPSBvbkVycm9yXG5cbm1vZHVsZS5leHBvcnRzID0gZXZlbnRFbWl0dGVyXG4iLCJ2YXIgZ2xvYmFsQ29udGV4dCA9IHJlcXVpcmUoXCIuL2dsb2JhbENvbnRleHRcIilcblxudmFyIGRlZmF1bHRDb250ZXh0S2V5ID0gXCJfX2RlZmF1bHRfY29udGV4dF9fXCJcblxuZnVuY3Rpb24gZXZlbnRFbWl0dGVyICgvKiBzaW5nbGV0b25FbWl0ICovKSB7XG4gIHZhciBldmVudHMgPSB7fVxuICB2YXIgZXZlbnRBcmdzID0ge31cbiAgZnVuY3Rpb24gaW5pdE9iamVjdCAoKSB7XG4gICAgcmV0dXJuIHt9XG4gIH1cblxuICBmdW5jdGlvbiBlbWl0IChldmVudE5hbWUsIHBhcmFtcywgY29udGV4dCkge1xuICAgIC8qIGlmIChzaW5nbGV0b25FbWl0KSB7XG4gICAgICBzaW5nbGV0b25FbWl0KGV2ZW50TmFtZSwgcGFyYW1zLCBjb250ZXh0KVxuICAgIH0gKi9cbiAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQgPSB7fVxuICAgIH1cblxuICAgIHZhciBsaXN0ZW5lcnMgPSBnZXRMaXN0ZW5lcnMoZXZlbnROYW1lKVxuICAgIHZhciBsaXN0ZW5lcnNMZW4gPSBsaXN0ZW5lcnMubGVuZ3RoXG4gICAgdmFyIGsgPSB7fVxuXG4gICAgdHJ5IHtcbiAgICAgIGsgPSBnbG9iYWxDb250ZXh0LnNldE9uY2UoY29udGV4dCwgZGVmYXVsdENvbnRleHRLZXksIGluaXRPYmplY3QpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG5cbiAgICB9XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBsaXN0ZW5lcnNMZW4gPiBpbmRleDsgaW5kZXgrKykge1xuICAgICAgbGlzdGVuZXJzW2luZGV4XS5hcHBseShrLCBwYXJhbXMpXG4gICAgfVxuICAgIHJldHVybiBrXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHsqc3RyaW5nfSBldmVudE5hbWUg5rOo5YaM5LqL5Lu2XG4gICAqIEBwYXJhbSB7KkZ1bmN0aW9ufEFycmF5KEZ1bmN0aW9uKX0gY2Ig5LqL5Lu25Zue6LCD5Ye95pWwXG4gICAqL1xuICBmdW5jdGlvbiBvbiAoZXZlbnROYW1lLCBjYikge1xuICAgIGlmICghY2IpIHtcbiAgICAgIGNiID0gZnVuY3Rpb24gKCkge31cbiAgICB9XG4gICAgZXZlbnRzW2V2ZW50TmFtZV0gPSBnZXRMaXN0ZW5lcnMoZXZlbnROYW1lKS5jb25jYXQoY2IpXG4gIH1cblxuICBmdW5jdGlvbiBnZXRMaXN0ZW5lcnMgKGV2ZW50TmFtZSkge1xuICAgIHJldHVybiBldmVudHNbZXZlbnROYW1lXSB8fCBbXVxuICB9XG5cbiAgLyoqXG4gKlxuICog5LqL5Lu25rGg5Lit5aaC5p6c5pyJ5LqL5Lu255uR5ZCs5Zmo77yM5YiZ5omn6KGMXG4gKiDkuovku7bmsaDkuK3msqHmnInnmoTor53vvIzliJnlsIbkuovku7blj4LmlbDlgYflpoLliLDlvoXmiafooYzpmJ/liJfkuK1cbiAqXG4gKiBAcGFyYW0ge2FueX0gZXZlbnROYW1lXG4gKiBAcGFyYW0ge2FueX0gcGFyYW1zXG4gKiBAcGFyYW0ge2FueX0gY29udGV4dFxuICovXG4gIGZ1bmN0aW9uIGFkZEV2ZW50QXJncyAoZXZlbnROYW1lLCBwYXJhbXMsIGNvbnRleHQpIHtcbiAgICBpZiAoZ2V0TGlzdGVuZXJzKGV2ZW50TmFtZSkubGVuZ3RoKSB7XG4gICAgICBlbWl0KGV2ZW50TmFtZSwgcGFyYW1zLCBjb250ZXh0KVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWV2ZW50QXJnc1tldmVudE5hbWVdKSB7XG4gICAgICAgIGV2ZW50QXJnc1tldmVudE5hbWVdID0gW11cbiAgICAgIH1cbiAgICAgIGV2ZW50QXJnc1tldmVudE5hbWVdLnB1c2gocGFyYW1zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiDlsJ3or5Xms6jlhozkuovku7bnm5HlkKzlmahcbiAgICog5aaC5p6c5bey57uP5a2Y5Zyo5LqL5Lu255uR5ZCs5Zmo5LqG77yM5YiZ6YCA5Ye6XG4gICAqIOWmguaenOS4jeWtmOWcqO+8jOWImeazqOWGjOatpOS6i+S7tu+8jOW5tua4heepuumYn+WIl+S4reeahOW+heWkhOeQhuS6i+S7tuWPguaVsFxuICAgKiBAcGFyYW0ge2FueX0gZXZlbnROYW1lXG4gICAqIEBwYXJhbSB7YW55fSBjYWxsYmFja1xuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgZnVuY3Rpb24gaGFuZGxlRXZlbnRBcmdzIChldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKGdldExpc3RlbmVycyhldmVudE5hbWUpLmxlbmd0aCkgcmV0dXJuIGZhbHNlXG4gICAgb24oZXZlbnROYW1lLCBjYWxsYmFjaylcbiAgICB2YXIgcSA9IGV2ZW50QXJnc1tldmVudE5hbWVdXG4gICAgaWYgKHEpIHtcbiAgICAgIGZvciAodmFyIGl0ZW0gPSAwOyBpdGVtIDwgcS5sZW5ndGg7IGl0ZW0rKykge1xuICAgICAgICBlbWl0KGV2ZW50TmFtZSwgcVtpdGVtXSlcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSBldmVudEFyZ3NbZXZlbnROYW1lXVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlICgpIHtcbiAgICByZXR1cm4gZXZlbnRFbWl0dGVyKGVtaXQpXG4gIH1cblxuICByZXR1cm4ge1xuICAgIG9uOiBvbixcbiAgICBlbWl0OiBlbWl0LFxuICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgIGxpc3RlbmVyczogZ2V0TGlzdGVuZXJzLFxuICAgIF9ldmVudHM6IGV2ZW50cyxcbiAgICBhZGRFdmVudEFyZ3M6IGFkZEV2ZW50QXJncyxcbiAgICBoYW5kbGVRdWV1ZTogaGFuZGxlRXZlbnRBcmdzXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBldmVudEVtaXR0ZXIoKVxuIiwiLypcbiAqIEBBdXRob3I6IGppYW5nZmVuZ1xuICogQERhdGU6IDIwMTctMDgtMjMgMTY6MDU6MDFcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiBqaWFuZ2ZlbmdcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTgtMDMtMDEgMTQ6Mjg6MjhcbiAqL1xuXG52YXIgcnhBcG0gPSByZXF1aXJlKFwiLi9tYWluXCIpXG52YXIgY29uZmlnID0ge1xuICBtYXhMaW1pdDogMTAsXG4gIGNyb3NzU3ViRG9tYWluOiB0cnVlLFxuICBsb2FkVGltZTogd2luZG93LiQkcnhBcG1GaXJzdEJ5dGVUaW1lIHx8IDEgKiBuZXcgRGF0ZSgpLFxuICBzaG93TG9nOiB0cnVlLFxuICBvcGVuVHJhY2luZzogdHJ1ZSxcbiAgdHJhbnNGcmVxdWVuY3k6IDVlMyxcbiAgYXBpSG9zdDogXCJodHRwOi8vMTAuMjAwLjEwLjIyOjgwOThcIixcbiAgYWdlbnRJZDogXCJwRWRmYTNNMVwiLFxuICB0aWVySWQ6IFwiMVwiLFxuICBhcHBJZDogXCIxXCJcbn1cblxuY29uZmlnID0ge1xuICBkaXNhYmxlZDogZmFsc2UsXG4gIG1heExpbWl0OiAxMCxcbiAgY3Jvc3NTdWJEb21haW46IHRydWUsXG4gIGxvYWRUaW1lOiB3aW5kb3cuJCRyeEFwbUZpcnN0Qnl0ZVRpbWUgfHwgMSAqIG5ldyBEYXRlKCksXG4gIHNob3dMb2c6IFwiPCQ9c2hvd0xvZyQ+XCIsXG4gIG9wZW5UcmFjaW5nOiBcIjwkPW9wZW5UcmFjaW5nJD5cIixcbiAgdHJhbnNGcmVxdWVuY3k6IFwiPCQ9dHJhbnNGcmVxdWVuY3kkPlwiLFxuICBhcGlIb3N0OiBcIjwkPWFwaUhvc3QkPlwiLFxuICBhZ2VudElkOiBcIjwkPWFnZW50SWQkPlwiLFxuICB0aWVySWQ6IFwiPCQ9dGllcklkJD5cIixcbiAgYXBwSWQ6IFwiPCQ9YXBwSWQkPlwiXG59XG5cbmNvbmZpZy5zaG93TG9nID0gISExICsgXCJcIiA9PT0gY29uZmlnLnNob3dMb2dcbmNvbmZpZy5vcGVuVHJhY2luZyA9ICEhMSArIFwiXCIgPT09IGNvbmZpZy5vcGVuVHJhY2luZ1xuY29uZmlnLnRyYW5zRnJlcXVlbmN5ID0gK2NvbmZpZy50cmFuc0ZyZXF1ZW5jeVxuXG5yeEFwbS5pbml0KGNvbmZpZylcbiIsInZhciBfID0gcmVxdWlyZShcIi4vY29tbW9uXCIpXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4vY29uZmlnXCIpXG52YXIgc3RvcmUgPSByZXF1aXJlKFwiLi9zdG9yZVwiKVxudmFyIGxvY2tlciA9IHJlcXVpcmUoXCIuL2xvY2tlclwiKVxuZnVuY3Rpb24gR2V0Q3VycmVudEV2ZW50SUQgKCkge1xuICByZXR1cm4gc3RvcmUuZ2V0U2Vzc2lvbihcIkNVUlJFTlRfRVZFTlRfSURcIilcbn1cblxuZnVuY3Rpb24gU2V0Q3VycmVudEV2ZW50SUQgKGNpZCkge1xuICBzdG9yZS5zZXRTZXNzaW9uKFwiQ1VSUkVOVF9FVkVOVF9JRFwiLCBjaWQpXG59XG5cbnZhciBzdGF0ZSA9IHtcbn1cblxuLyoqXG4gICAqIOacrOWcsOS4iuS4i+aWh+eOr+Wig1xuICAgKiDojrflj5blvZPliY3lj5HpgIHlmajnmoTmjojmnYPnirbmgIFcbiAgICog6I635Y+W5b2T5YmN5Y+R6YCB5Zmo55qE5LqL5Lu25rGgXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xudmFyIGdsb2JhbENvbnRleHQgPSB7XG4gIGdldDogZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBrZXkgPyBzdGF0ZVtrZXldIDogc3RhdGVcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIHN0YXRlW2tleV0gPSB2YWx1ZVxuICB9LFxuICBwdXNoOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIHZhciBhID0gc3RhdGVba2V5XVxuICAgIGlmICghYSkge1xuICAgICAgYSA9IHN0YXRlW2tleV0gPSBbXVxuICAgIH1cbiAgICBhLnB1c2godmFsdWUpXG4gIH0sXG4gIHNldE9uY2U6IGZ1bmN0aW9uIChjb250ZXh0LCBwcm9wZXJ0eSwgZGVmYXVsdENhbGxiYWNrKSB7XG4gICAgdmFyIG9iakhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuICAgIGlmIChvYmpIYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbnRleHQsIHByb3BlcnR5KSkgcmV0dXJuIGNvbnRleHRbcHJvcGVydHldXG4gICAgdmFyIHByb3BlcnR5VmFsdWUgPSBkZWZhdWx0Q2FsbGJhY2soKVxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgT2JqZWN0LmtleXMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb250ZXh0LCBwcm9wZXJ0eSwge1xuICAgICAgICAgIHZhbHVlOiBwcm9wZXJ0eVZhbHVlLFxuICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlXG4gICAgICB9IGNhdGNoIChlcnIpIHtcblxuICAgICAgfVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29udGV4dFtwcm9wZXJ0eV0gPSBwcm9wZXJ0eVZhbHVlXG4gICAgfSBjYXRjaCAoZXJyKSB7fVxuICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlXG4gIH0sXG4gIGdldEV2ZW50UG9vbDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwb29sID0gXy5sb2NhbFN0b3JhZ2UucGFyc2UoY29uZmlnLkxJQl9LRVkgKyBcIkV2ZW50UG9vbFwiICsgY29uZmlnLmFnZW50SWQsIFtdKVxuICAgIHJldHVybiBwb29sXG4gIH0sXG4gIHNldEV2ZW50UG9vbDogZnVuY3Rpb24gKGV2ZW50UG9vbCkge1xuICAgIF8ubG9jYWxTdG9yYWdlLnNldChjb25maWcuTElCX0tFWSArIFwiRXZlbnRQb29sXCIgKyBjb25maWcuYWdlbnRJZCwgSlNPTi5zdHJpbmdpZnkoZXZlbnRQb29sKSlcbiAgfSxcbiAgLyoqXG4gICAgICog5LqL5Lu25YWl5rGgXG4gICAgICovXG4gIHB1c2hFdmVudDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgZXZlbnQuc2VuZGluZyA9IGZhbHNlXG4gICAgbG9ja2VyLmV4ZWMoZnVuY3Rpb24gKCkge1xuICAgICAgZXZlbnQuY2lkID0gXy5VVUlEKClcbiAgICAgIHZhciBjaWQgPSBHZXRDdXJyZW50RXZlbnRJRCgpXG4gICAgICBpZiAoY2lkKSB7XG4gICAgICAgIGV2ZW50LnBpZCA9IGNpZFxuICAgICAgfVxuXG4gICAgICBTZXRDdXJyZW50RXZlbnRJRChldmVudC5jaWQpXG5cbiAgICAgIHZhciBwb29sID0gdGhhdC5nZXRFdmVudFBvb2woKVxuICAgICAgcG9vbC5wdXNoKGV2ZW50KVxuICAgICAgdGhhdC5zZXRFdmVudFBvb2wocG9vbClcbiAgICB9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsQ29udGV4dFxuIiwiLyogZXNsaW50LWRpc2FibGUgKi9cbi8vIEpTT04gcG9seWZpbGxcbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gKHR5cGVvZiBKU09OID09PSBcIm9iamVjdFwiICYmIHRvU3RyaW5nLmNhbGwoSlNPTikgPT09IFwiW29iamVjdCBKU09OXVwiKSA/IEpTT05cbiAgICA6IChmdW5jdGlvbiAoSlNPTikge1xuICAgICAgICBcInVzZSBzdHJpY3RcIlxuXG4gICAgICAgIGZ1bmN0aW9uIGYgKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBlIDwgMTAgPyBcIjBcIiArIGUgOiBlXG4gICAgICAgIH1cblxuICAgICAgICAvLyBmdW5jdGlvbiB0aGlzX3ZhbHVlKCkge1xuICAgICAgICAvLyByZXR1cm4gdGhpcy52YWx1ZU9mKClcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGZ1bmN0aW9uIHF1b3RlIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gcnhfZXNjYXBhYmxlLmxhc3RJbmRleCA9IDAsIHJ4X2VzY2FwYWJsZS50ZXN0KGUpID8gXCJcXFwiXCIgKyBlLnJlcGxhY2UocnhfZXNjYXBhYmxlLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHZhciB0ID0gbWV0YVtlXVxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgdCA9PT0gXCJzdHJpbmdcIiA/IHQgOiBcIlxcXFx1XCIgKyAoXCIwMDAwXCIgKyBlLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNClcbiAgICAgICAgICAgIH0pICsgXCJcXFwiXCIgOiBcIlxcXCJcIiArIGUgKyBcIlxcXCJcIlxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb2JqZWN0VG9KU09OIChlKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHRvU3RyaW5nLmNhbGwoZSkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJbb2JqZWN0IERhdGVdXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzRmluaXRlKGUudmFsdWVPZigpKSA/IGUuZ2V0VVRDRnVsbFllYXIoKSArIFwiLVwiICsgZihlLmdldFVUQ01vbnRoKCkgKyAxKSArIFwiLVwiICsgZihlLmdldFVUQ0RhdGUoKSkgKyBcIlRcIiArIGYoZS5nZXRVVENIb3VycygpKSArIFwiOlwiICsgZihlLmdldFVUQ01pbnV0ZXMoKSkgKyBcIjpcIiArIGYoZS5nZXRVVENTZWNvbmRzKCkpICsgXCJaXCIgOiBudWxsXG4gICAgICAgICAgICBjYXNlIFwiW29iamVjdCBCb29sZWFuXVwiOlxuICAgICAgICAgICAgY2FzZSBcIltvYmplY3QgU3RyaW5nXVwiOlxuICAgICAgICAgICAgY2FzZSBcIltvYmplY3QgTnVtYmVyXVwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBlLnZhbHVlT2YoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHN0ciAoZSwgdCkge1xuICAgICAgICAgICAgdmFyIHIsIG4sIGksIG8sIHMsIGEgPSBnYXAsXG4gICAgICAgICAgICAgICAgdSA9IHRbZV1cbiAgICAgICAgICAgIHN3aXRjaCAodSAmJiB0eXBlb2YgdSA9PT0gXCJvYmplY3RcIiAmJiAodSA9IG9iamVjdFRvSlNPTih1KSksIHR5cGVvZiByZXAgPT09IFwiZnVuY3Rpb25cIiAmJiAodSA9IHJlcC5jYWxsKHQsIGUsIHUpKSwgdHlwZW9mIHUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVvdGUodSlcbiAgICAgICAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNGaW5pdGUodSkgPyBTdHJpbmcodSkgOiBcIm51bGxcIlxuICAgICAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgICAgIGNhc2UgXCJudWxsXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyh1KVxuICAgICAgICAgICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgICAgICAgICAgIGlmICghdSkgcmV0dXJuIFwibnVsbFwiXG4gICAgICAgICAgICAgICAgaWYgKGdhcCArPSBpbmRlbnQsIHMgPSBbXSwgdG9TdHJpbmcuY2FsbCh1KSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobyA9IHUubGVuZ3RoLCByID0gMDsgbyA+IHI7IHIgKz0gMSkgc1tyXSA9IHN0cihyLCB1KSB8fCBcIm51bGxcIlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaSA9IHMubGVuZ3RoID09PSAwID8gXCJbXVwiIDogZ2FwID8gXCJbXFxuXCIgKyBnYXAgKyBzLmpvaW4oXCIsXFxuXCIgKyBnYXApICsgXCJcXG5cIiArIGEgKyBcIl1cIiA6IFwiW1wiICsgcy5qb2luKFwiLFwiKSArIFwiXVwiLCBnYXAgPSBhLCBpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXAgJiYgdHlwZW9mIHJlcCA9PT0gXCJvYmplY3RcIikgeyBmb3IgKG8gPSByZXAubGVuZ3RoLCByID0gMDsgbyA+IHI7IHIgKz0gMSkgdHlwZW9mIHJlcFtyXSA9PT0gXCJzdHJpbmdcIiAmJiAobiA9IHJlcFtyXSwgaSA9IHN0cihuLCB1KSwgaSAmJiBzLnB1c2gocXVvdGUobikgKyAoZ2FwID8gXCI6IFwiIDogXCI6XCIpICsgaSkpIH0gZWxzZSB7IGZvciAobiBpbiB1KSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodSwgbikgJiYgKGkgPSBzdHIobiwgdSksIGkgJiYgcy5wdXNoKHF1b3RlKG4pICsgKGdhcCA/IFwiOiBcIiA6IFwiOlwiKSArIGkpKSB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGkgPSBzLmxlbmd0aCA9PT0gMCA/IFwie31cIiA6IGdhcCA/IFwie1xcblwiICsgZ2FwICsgcy5qb2luKFwiLFxcblwiICsgZ2FwKSArIFwiXFxuXCIgKyBhICsgXCJ9XCIgOiBcIntcIiArIHMuam9pbihcIixcIikgKyBcIn1cIiwgZ2FwID0gYSwgaVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciByeF9vbmUgPSAvXltcXF0sOnt9XFxzXSokLyxcbiAgICAgICAgICAgIHJ4X3R3byA9IC9cXFxcKD86W1wiXFxcXFxcL2JmbnJ0XXx1WzAtOWEtZkEtRl17NH0pL2csXG4gICAgICAgICAgICByeF90aHJlZSA9IC9cIlteXCJcXFxcXFxuXFxyXSpcInx0cnVlfGZhbHNlfG51bGx8LT9cXGQrKD86XFwuXFxkKik/KD86W2VFXVsrXFwtXT9cXGQrKT8vZyxcbiAgICAgICAgICAgIHJ4X2ZvdXIgPSAvKD86Xnw6fCwpKD86XFxzKlxcWykrL2csXG4gICAgICAgICAgICByeF9lc2NhcGFibGUgPSAvW1xcXFxcXFwiXFx1MDAwMC1cXHUwMDFmXFx1MDA3Zi1cXHUwMDlmXFx1MDBhZFxcdTA2MDAtXFx1MDYwNFxcdTA3MGZcXHUxN2I0XFx1MTdiNVxcdTIwMGMtXFx1MjAwZlxcdTIwMjgtXFx1MjAyZlxcdTIwNjAtXFx1MjA2ZlxcdWZlZmZcXHVmZmYwLVxcdWZmZmZdL2csXG4gICAgICAgICAgICByeF9kYW5nZXJvdXMgPSAvW1xcdTAwMDBcXHUwMGFkXFx1MDYwMC1cXHUwNjA0XFx1MDcwZlxcdTE3YjRcXHUxN2I1XFx1MjAwYy1cXHUyMDBmXFx1MjAyOC1cXHUyMDJmXFx1MjA2MC1cXHUyMDZmXFx1ZmVmZlxcdWZmZjAtXFx1ZmZmZl0vZ1xuICAgICAgICAvL1x0XHRcImZ1bmN0aW9uXCIgIT0gdHlwZW9mIERhdGUucHJvdG90eXBlLnRvSlNPTiAmJiAoRGF0ZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vXHRcdFx0cmV0dXJuIGlzRmluaXRlKHRoaXMudmFsdWVPZigpKSA/IHRoaXMuZ2V0VVRDRnVsbFllYXIoKSArIFwiLVwiICsgZih0aGlzLmdldFVUQ01vbnRoKCkgKyAxKSArIFwiLVwiICsgZih0aGlzLmdldFVUQ0RhdGUoKSkgKyBcIlRcIiArIGYodGhpcy5nZXRVVENIb3VycygpKSArIFwiOlwiICsgZih0aGlzLmdldFVUQ01pbnV0ZXMoKSkgKyBcIjpcIiArIGYodGhpcy5nZXRVVENTZWNvbmRzKCkpICsgXCJaXCIgOiBudWxsXG4gICAgICAgIC8vXHRcdH0sIEJvb2xlYW4ucHJvdG90eXBlLnRvSlNPTiA9IHRoaXNfdmFsdWUsIE51bWJlci5wcm90b3R5cGUudG9KU09OID0gdGhpc192YWx1ZSwgU3RyaW5nLnByb3RvdHlwZS50b0pTT04gPSB0aGlzX3ZhbHVlKTtcbiAgICAgICAgdmFyIGdhcCwgaW5kZW50LCBtZXRhLCByZXBcbiAgICAgICAgdHlwZW9mIEpTT04uc3RyaW5naWZ5ICE9PSBcImZ1bmN0aW9uXCIgJiYgKG1ldGEgPSB7XG4gICAgICAgICAgICBcIlxcYlwiOiBcIlxcXFxiXCIsXG4gICAgICAgICAgICBcIlx0XCI6IFwiXFxcXHRcIixcbiAgICAgICAgICAgIFwiXFxuXCI6IFwiXFxcXG5cIixcbiAgICAgICAgICAgIFwiXFxmXCI6IFwiXFxcXGZcIixcbiAgICAgICAgICAgIFwiXFxyXCI6IFwiXFxcXHJcIixcbiAgICAgICAgICAgIFwiXFxcIlwiOiBcIlxcXFxcXFwiXCIsXG4gICAgICAgICAgICBcIlxcXFxcIjogXCJcXFxcXFxcXFwiXG4gICAgICAgIH0sIEpTT04uc3RyaW5naWZ5ID0gZnVuY3Rpb24gKGUsIHQsIHIpIHtcbiAgICAgICAgICAgICAgICB2YXIgblxuICAgICAgICAgICAgICAgIGlmIChnYXAgPSBcIlwiLCBpbmRlbnQgPSBcIlwiLCB0eXBlb2YgciA9PT0gXCJudW1iZXJcIikgeyBmb3IgKG4gPSAwOyByID4gbjsgbiArPSAxKSBpbmRlbnQgKz0gXCIgXCIgfSBlbHNlIHR5cGVvZiByID09PSBcInN0cmluZ1wiICYmIChpbmRlbnQgPSByKVxuICAgICAgICAgICAgICAgIGlmIChyZXAgPSB0LCB0ICYmIHR5cGVvZiB0ICE9PSBcImZ1bmN0aW9uXCIgJiYgKHR5cGVvZiB0ICE9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB0Lmxlbmd0aCAhPT0gXCJudW1iZXJcIikpIHRocm93IG5ldyBFcnJvcihcIkpTT04uc3RyaW5naWZ5XCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cihcIlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiXCI6IGVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSksIHR5cGVvZiBKU09OLnBhcnNlICE9PSBcImZ1bmN0aW9uXCIgJiYgKEpTT04ucGFyc2UgPSBmdW5jdGlvbiAodGV4dCwgcmV2aXZlcikge1xuICAgICAgICAgICAgZnVuY3Rpb24gd2FsayAoZSwgdCkge1xuICAgICAgICAgICAgICAgIHZhciByLCBuLCBpID0gZVt0XVxuICAgICAgICAgICAgICAgIGlmIChpICYmIHR5cGVvZiBpID09PSBcIm9iamVjdFwiKSB7IGZvciAociBpbiBpKSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaSwgcikgJiYgKG4gPSB3YWxrKGksIHIpLCB2b2lkIDAgIT09IG4gPyBpW3JdID0gbiA6IGRlbGV0ZSBpW3JdKSB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldml2ZXIuY2FsbChlLCB0LCBpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGpcbiAgICAgICAgICAgIGlmICh0ZXh0ID0gU3RyaW5nKHRleHQpLCByeF9kYW5nZXJvdXMubGFzdEluZGV4ID0gMCwgcnhfZGFuZ2Vyb3VzLnRlc3QodGV4dCkgJiYgKHRleHQgPSB0ZXh0LnJlcGxhY2UocnhfZGFuZ2Vyb3VzLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIlxcXFx1XCIgKyAoXCIwMDAwXCIgKyBlLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNClcbiAgICAgICAgICAgIH0pKSwgcnhfb25lLnRlc3QodGV4dC5yZXBsYWNlKHJ4X3R3bywgXCJAXCIpLnJlcGxhY2UocnhfdGhyZWUsIFwiXVwiKS5yZXBsYWNlKHJ4X2ZvdXIsIFwiXCIpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBqID0gZXZhbChcIihcIiArIHRleHQgKyBcIilcIiksIHR5cGVvZiByZXZpdmVyID09PSBcImZ1bmN0aW9uXCIgPyB3YWxrKHtcbiAgICAgICAgICAgICAgICAgICAgXCJcIjogalxuICAgICAgICAgICAgICAgIH0sIFwiXCIpIDogalxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiSlNPTi5wYXJzZVwiKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gSlNPTlxuICAgIH0pKHt9KVxuIiwiLy9cbi8vIEF1dG9nZW5lcmF0ZWQgYnkgVGhyaWZ0IENvbXBpbGVyICgwLjEwLjApXG4vL1xuLy8gRE8gTk9UIEVESVQgVU5MRVNTIFlPVSBBUkUgU1VSRSBUSEFUIFlPVSBLTk9XIFdIQVQgWU9VIEFSRSBET0lOR1xuLy9cbnZhciBUaHJpZnQgPSByZXF1aXJlKFwiLi90aHJpZnRcIilcbi8vXG4vLyBBdXRvZ2VuZXJhdGVkIGJ5IFRocmlmdCBDb21waWxlciAoMC4xMC4wKVxuLy9cbi8vIERPIE5PVCBFRElUIFVOTEVTUyBZT1UgQVJFIFNVUkUgVEhBVCBZT1UgS05PVyBXSEFUIFlPVSBBUkUgRE9JTkdcbi8vXG5cbnZhciBUV2ViQWdlbnRMb2FkQmF0Y2ggPSBmdW5jdGlvbiAoYXJncykge1xuICB0aGlzLmxvYWRCYXRjaCA9IG51bGxcbiAgaWYgKGFyZ3MpIHtcbiAgICBpZiAoYXJncy5sb2FkQmF0Y2ggIT09IHVuZGVmaW5lZCAmJiBhcmdzLmxvYWRCYXRjaCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5sb2FkQmF0Y2ggPSBUaHJpZnQuY29weUxpc3QoYXJncy5sb2FkQmF0Y2gsIFtudWxsXSlcbiAgICB9XG4gIH1cbn1cblRXZWJBZ2VudExvYWRCYXRjaC5wcm90b3R5cGUgPSB7fVxuVFdlYkFnZW50TG9hZEJhdGNoLnByb3RvdHlwZS5yZWFkID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gIGlucHV0LnJlYWRTdHJ1Y3RCZWdpbigpXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgdmFyIHJldCA9IGlucHV0LnJlYWRGaWVsZEJlZ2luKClcbiAgICB2YXIgZm5hbWUgPSByZXQuZm5hbWVcbiAgICB2YXIgZnR5cGUgPSByZXQuZnR5cGVcbiAgICB2YXIgZmlkID0gcmV0LmZpZFxuICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5TVE9QKSB7XG4gICAgICBicmVha1xuICAgIH1cbiAgICBzd2l0Y2ggKGZpZCkge1xuICAgIGNhc2UgMTpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5MSVNUKSB7XG4gICAgICAgIHZhciBfc2l6ZTAgPSAwXG4gICAgICAgIHZhciBfcnRtcDM0XG4gICAgICAgIHRoaXMubG9hZEJhdGNoID0gW11cbiAgICAgICAgdmFyIF9ldHlwZTMgPSAwXG4gICAgICAgIF9ydG1wMzQgPSBpbnB1dC5yZWFkTGlzdEJlZ2luKClcbiAgICAgICAgX2V0eXBlMyA9IF9ydG1wMzQuZXR5cGVcbiAgICAgICAgX3NpemUwID0gX3J0bXAzNC5zaXplXG4gICAgICAgIGZvciAodmFyIF9pNSA9IDA7IF9pNSA8IF9zaXplMDsgKytfaTUpIHtcbiAgICAgICAgICB2YXIgZWxlbTYgPSBudWxsXG4gICAgICAgICAgZWxlbTYgPSBuZXcgVFdlYkFnZW50TG9hZCgpXG4gICAgICAgICAgZWxlbTYucmVhZChpbnB1dClcbiAgICAgICAgICB0aGlzLmxvYWRCYXRjaC5wdXNoKGVsZW02KVxuICAgICAgICB9XG4gICAgICAgIGlucHV0LnJlYWRMaXN0RW5kKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgMDpcbiAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgIH1cbiAgICBpbnB1dC5yZWFkRmllbGRFbmQoKVxuICB9XG4gIGlucHV0LnJlYWRTdHJ1Y3RFbmQoKVxufVxuXG5UV2ViQWdlbnRMb2FkQmF0Y2gucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKG91dHB1dCkge1xuICBvdXRwdXQud3JpdGVTdHJ1Y3RCZWdpbihcIlRXZWJBZ2VudExvYWRCYXRjaFwiKVxuICBpZiAodGhpcy5sb2FkQmF0Y2ggIT09IG51bGwgJiYgdGhpcy5sb2FkQmF0Y2ggIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJsb2FkQmF0Y2hcIiwgVGhyaWZ0LlR5cGUuTElTVCwgMSlcbiAgICBvdXRwdXQud3JpdGVMaXN0QmVnaW4oVGhyaWZ0LlR5cGUuU1RSVUNULCB0aGlzLmxvYWRCYXRjaC5sZW5ndGgpXG4gICAgZm9yICh2YXIgaXRlcjcgaW4gdGhpcy5sb2FkQmF0Y2gpIHtcbiAgICAgIGlmICh0aGlzLmxvYWRCYXRjaC5oYXNPd25Qcm9wZXJ0eShpdGVyNykpIHtcbiAgICAgICAgaXRlcjcgPSB0aGlzLmxvYWRCYXRjaFtpdGVyN11cbiAgICAgICAgaXRlcjcud3JpdGUob3V0cHV0KVxuICAgICAgfVxuICAgIH1cbiAgICBvdXRwdXQud3JpdGVMaXN0RW5kKClcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgb3V0cHV0LndyaXRlRmllbGRTdG9wKClcbiAgb3V0cHV0LndyaXRlU3RydWN0RW5kKClcbn1cblxudmFyIFRXZWJBZ2VudExvYWQgPSBmdW5jdGlvbiAoYXJncykge1xuICB0aGlzLmFnZW50SWQgPSBudWxsXG4gIHRoaXMudGllcklkID0gbnVsbFxuICB0aGlzLmFwcElkID0gbnVsbFxuICB0aGlzLnRyYWNlSWQgPSBudWxsXG4gIHRoaXMudXJsRG9tYWluID0gbnVsbFxuICB0aGlzLnVybFF1ZXJ5ID0gbnVsbFxuICB0aGlzLnJlcG9ydFRpbWUgPSBudWxsXG4gIHRoaXMuZmlyc3RTY3JlZW5UaW1lID0gbnVsbFxuICB0aGlzLndoaXRlU2NyZWVuVGltZSA9IG51bGxcbiAgdGhpcy5vcGVyYWJsZVRpbWUgPSBudWxsXG4gIHRoaXMucmVzb3VyY2VMb2FkZWRUaW1lID0gbnVsbFxuICB0aGlzLmxvYWRlZFRpbWUgPSBudWxsXG4gIHRoaXMuYnJvd3NlciA9IG51bGxcbiAgdGhpcy5iYWNrdXBQcm9wZXJ0aWVzID0gbnVsbFxuICB0aGlzLmJhY2t1cFF1b3RhID0gbnVsbFxuICBpZiAoYXJncykge1xuICAgIGlmIChhcmdzLmFnZW50SWQgIT09IHVuZGVmaW5lZCAmJiBhcmdzLmFnZW50SWQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYWdlbnRJZCA9IGFyZ3MuYWdlbnRJZFxuICAgIH1cbiAgICBpZiAoYXJncy50aWVySWQgIT09IHVuZGVmaW5lZCAmJiBhcmdzLnRpZXJJZCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy50aWVySWQgPSBhcmdzLnRpZXJJZFxuICAgIH1cbiAgICBpZiAoYXJncy5hcHBJZCAhPT0gdW5kZWZpbmVkICYmIGFyZ3MuYXBwSWQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYXBwSWQgPSBhcmdzLmFwcElkXG4gICAgfVxuICAgIGlmIChhcmdzLnRyYWNlSWQgIT09IHVuZGVmaW5lZCAmJiBhcmdzLnRyYWNlSWQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudHJhY2VJZCA9IGFyZ3MudHJhY2VJZFxuICAgIH1cbiAgICBpZiAoYXJncy51cmxEb21haW4gIT09IHVuZGVmaW5lZCAmJiBhcmdzLnVybERvbWFpbiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy51cmxEb21haW4gPSBhcmdzLnVybERvbWFpblxuICAgIH1cbiAgICBpZiAoYXJncy51cmxRdWVyeSAhPT0gdW5kZWZpbmVkICYmIGFyZ3MudXJsUXVlcnkgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudXJsUXVlcnkgPSBhcmdzLnVybFF1ZXJ5XG4gICAgfVxuICAgIGlmIChhcmdzLnJlcG9ydFRpbWUgIT09IHVuZGVmaW5lZCAmJiBhcmdzLnJlcG9ydFRpbWUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMucmVwb3J0VGltZSA9IGFyZ3MucmVwb3J0VGltZVxuICAgIH1cbiAgICBpZiAoYXJncy5maXJzdFNjcmVlblRpbWUgIT09IHVuZGVmaW5lZCAmJiBhcmdzLmZpcnN0U2NyZWVuVGltZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5maXJzdFNjcmVlblRpbWUgPSBhcmdzLmZpcnN0U2NyZWVuVGltZVxuICAgIH1cbiAgICBpZiAoYXJncy53aGl0ZVNjcmVlblRpbWUgIT09IHVuZGVmaW5lZCAmJiBhcmdzLndoaXRlU2NyZWVuVGltZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy53aGl0ZVNjcmVlblRpbWUgPSBhcmdzLndoaXRlU2NyZWVuVGltZVxuICAgIH1cbiAgICBpZiAoYXJncy5vcGVyYWJsZVRpbWUgIT09IHVuZGVmaW5lZCAmJiBhcmdzLm9wZXJhYmxlVGltZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5vcGVyYWJsZVRpbWUgPSBhcmdzLm9wZXJhYmxlVGltZVxuICAgIH1cbiAgICBpZiAoYXJncy5yZXNvdXJjZUxvYWRlZFRpbWUgIT09IHVuZGVmaW5lZCAmJiBhcmdzLnJlc291cmNlTG9hZGVkVGltZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5yZXNvdXJjZUxvYWRlZFRpbWUgPSBhcmdzLnJlc291cmNlTG9hZGVkVGltZVxuICAgIH1cbiAgICBpZiAoYXJncy5sb2FkZWRUaW1lICE9PSB1bmRlZmluZWQgJiYgYXJncy5sb2FkZWRUaW1lICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmxvYWRlZFRpbWUgPSBhcmdzLmxvYWRlZFRpbWVcbiAgICB9XG4gICAgaWYgKGFyZ3MuYnJvd3NlciAhPT0gdW5kZWZpbmVkICYmIGFyZ3MuYnJvd3NlciAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5icm93c2VyID0gYXJncy5icm93c2VyXG4gICAgfVxuICAgIGlmIChhcmdzLmJhY2t1cFByb3BlcnRpZXMgIT09IHVuZGVmaW5lZCAmJiBhcmdzLmJhY2t1cFByb3BlcnRpZXMgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYmFja3VwUHJvcGVydGllcyA9IFRocmlmdC5jb3B5TWFwKGFyZ3MuYmFja3VwUHJvcGVydGllcywgW251bGxdKVxuICAgIH1cbiAgICBpZiAoYXJncy5iYWNrdXBRdW90YSAhPT0gdW5kZWZpbmVkICYmIGFyZ3MuYmFja3VwUXVvdGEgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYmFja3VwUXVvdGEgPSBUaHJpZnQuY29weU1hcChhcmdzLmJhY2t1cFF1b3RhLCBbbnVsbF0pXG4gICAgfVxuICB9XG59XG5UV2ViQWdlbnRMb2FkLnByb3RvdHlwZSA9IHt9XG5UV2ViQWdlbnRMb2FkLnByb3RvdHlwZS5yZWFkID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gIGlucHV0LnJlYWRTdHJ1Y3RCZWdpbigpXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgdmFyIHJldCA9IGlucHV0LnJlYWRGaWVsZEJlZ2luKClcbiAgICB2YXIgZm5hbWUgPSByZXQuZm5hbWVcbiAgICB2YXIgZnR5cGUgPSByZXQuZnR5cGVcbiAgICB2YXIgZmlkID0gcmV0LmZpZFxuICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5TVE9QKSB7XG4gICAgICBicmVha1xuICAgIH1cbiAgICBzd2l0Y2ggKGZpZCkge1xuICAgIGNhc2UgMTpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5TVFJJTkcpIHtcbiAgICAgICAgdGhpcy5hZ2VudElkID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDI6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RSSU5HKSB7XG4gICAgICAgIHRoaXMudGllcklkID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDM6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RSSU5HKSB7XG4gICAgICAgIHRoaXMuYXBwSWQgPSBpbnB1dC5yZWFkU3RyaW5nKCkudmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgNDpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5TVFJJTkcpIHtcbiAgICAgICAgdGhpcy50cmFjZUlkID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDU6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RSSU5HKSB7XG4gICAgICAgIHRoaXMudXJsRG9tYWluID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDY6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RSSU5HKSB7XG4gICAgICAgIHRoaXMudXJsUXVlcnkgPSBpbnB1dC5yZWFkU3RyaW5nKCkudmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgNzpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5JNjQpIHtcbiAgICAgICAgdGhpcy5yZXBvcnRUaW1lID0gaW5wdXQucmVhZEk2NCgpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDg6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuSTY0KSB7XG4gICAgICAgIHRoaXMuZmlyc3RTY3JlZW5UaW1lID0gaW5wdXQucmVhZEk2NCgpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDk6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuSTY0KSB7XG4gICAgICAgIHRoaXMud2hpdGVTY3JlZW5UaW1lID0gaW5wdXQucmVhZEk2NCgpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDEwOlxuICAgICAgaWYgKGZ0eXBlID09IFRocmlmdC5UeXBlLkk2NCkge1xuICAgICAgICB0aGlzLm9wZXJhYmxlVGltZSA9IGlucHV0LnJlYWRJNjQoKS52YWx1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXQuc2tpcChmdHlwZSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAxMTpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5JNjQpIHtcbiAgICAgICAgdGhpcy5yZXNvdXJjZUxvYWRlZFRpbWUgPSBpbnB1dC5yZWFkSTY0KCkudmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgMTI6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuSTY0KSB7XG4gICAgICAgIHRoaXMubG9hZGVkVGltZSA9IGlucHV0LnJlYWRJNjQoKS52YWx1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXQuc2tpcChmdHlwZSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAxMzpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5TVFJJTkcpIHtcbiAgICAgICAgdGhpcy5icm93c2VyID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDE0OlxuICAgICAgaWYgKGZ0eXBlID09IFRocmlmdC5UeXBlLk1BUCkge1xuICAgICAgICB2YXIgX3NpemU4ID0gMFxuICAgICAgICB2YXIgX3J0bXAzMTJcbiAgICAgICAgdGhpcy5iYWNrdXBQcm9wZXJ0aWVzID0ge31cbiAgICAgICAgdmFyIF9rdHlwZTkgPSAwXG4gICAgICAgIHZhciBfdnR5cGUxMCA9IDBcbiAgICAgICAgX3J0bXAzMTIgPSBpbnB1dC5yZWFkTWFwQmVnaW4oKVxuICAgICAgICBfa3R5cGU5ID0gX3J0bXAzMTIua3R5cGVcbiAgICAgICAgX3Z0eXBlMTAgPSBfcnRtcDMxMi52dHlwZVxuICAgICAgICBfc2l6ZTggPSBfcnRtcDMxMi5zaXplXG4gICAgICAgIGZvciAodmFyIF9pMTMgPSAwOyBfaTEzIDwgX3NpemU4OyArK19pMTMpIHtcbiAgICAgICAgICBpZiAoX2kxMyA+IDApIHtcbiAgICAgICAgICAgIGlmIChpbnB1dC5yc3RhY2subGVuZ3RoID4gaW5wdXQucnBvc1tpbnB1dC5ycG9zLmxlbmd0aCAtIDFdICsgMSkge1xuICAgICAgICAgICAgICBpbnB1dC5yc3RhY2sucG9wKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGtleTE0ID0gbnVsbFxuICAgICAgICAgIHZhciB2YWwxNSA9IG51bGxcbiAgICAgICAgICBrZXkxNCA9IGlucHV0LnJlYWRTdHJpbmcoKS52YWx1ZVxuICAgICAgICAgIHZhbDE1ID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICAgICAgdGhpcy5iYWNrdXBQcm9wZXJ0aWVzW2tleTE0XSA9IHZhbDE1XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXQucmVhZE1hcEVuZCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDE1OlxuICAgICAgaWYgKGZ0eXBlID09IFRocmlmdC5UeXBlLk1BUCkge1xuICAgICAgICB2YXIgX3NpemUxNiA9IDBcbiAgICAgICAgdmFyIF9ydG1wMzIwXG4gICAgICAgIHRoaXMuYmFja3VwUXVvdGEgPSB7fVxuICAgICAgICB2YXIgX2t0eXBlMTcgPSAwXG4gICAgICAgIHZhciBfdnR5cGUxOCA9IDBcbiAgICAgICAgX3J0bXAzMjAgPSBpbnB1dC5yZWFkTWFwQmVnaW4oKVxuICAgICAgICBfa3R5cGUxNyA9IF9ydG1wMzIwLmt0eXBlXG4gICAgICAgIF92dHlwZTE4ID0gX3J0bXAzMjAudnR5cGVcbiAgICAgICAgX3NpemUxNiA9IF9ydG1wMzIwLnNpemVcbiAgICAgICAgZm9yICh2YXIgX2kyMSA9IDA7IF9pMjEgPCBfc2l6ZTE2OyArK19pMjEpIHtcbiAgICAgICAgICBpZiAoX2kyMSA+IDApIHtcbiAgICAgICAgICAgIGlmIChpbnB1dC5yc3RhY2subGVuZ3RoID4gaW5wdXQucnBvc1tpbnB1dC5ycG9zLmxlbmd0aCAtIDFdICsgMSkge1xuICAgICAgICAgICAgICBpbnB1dC5yc3RhY2sucG9wKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGtleTIyID0gbnVsbFxuICAgICAgICAgIHZhciB2YWwyMyA9IG51bGxcbiAgICAgICAgICBrZXkyMiA9IGlucHV0LnJlYWRTdHJpbmcoKS52YWx1ZVxuICAgICAgICAgIHZhbDIzID0gaW5wdXQucmVhZEk2NCgpLnZhbHVlXG4gICAgICAgICAgdGhpcy5iYWNrdXBRdW90YVtrZXkyMl0gPSB2YWwyM1xuICAgICAgICB9XG4gICAgICAgIGlucHV0LnJlYWRNYXBFbmQoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXQuc2tpcChmdHlwZSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgfVxuICAgIGlucHV0LnJlYWRGaWVsZEVuZCgpXG4gIH1cbiAgaW5wdXQucmVhZFN0cnVjdEVuZCgpXG59XG5cblRXZWJBZ2VudExvYWQucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKG91dHB1dCkge1xuICBvdXRwdXQud3JpdGVTdHJ1Y3RCZWdpbihcIlRXZWJBZ2VudExvYWRcIilcbiAgaWYgKHRoaXMuYWdlbnRJZCAhPT0gbnVsbCAmJiB0aGlzLmFnZW50SWQgIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJhZ2VudElkXCIsIFRocmlmdC5UeXBlLlNUUklORywgMSlcbiAgICBvdXRwdXQud3JpdGVTdHJpbmcodGhpcy5hZ2VudElkKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuICBpZiAodGhpcy50aWVySWQgIT09IG51bGwgJiYgdGhpcy50aWVySWQgIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJ0aWVySWRcIiwgVGhyaWZ0LlR5cGUuU1RSSU5HLCAyKVxuICAgIG91dHB1dC53cml0ZVN0cmluZyh0aGlzLnRpZXJJZClcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMuYXBwSWQgIT09IG51bGwgJiYgdGhpcy5hcHBJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0cHV0LndyaXRlRmllbGRCZWdpbihcImFwcElkXCIsIFRocmlmdC5UeXBlLlNUUklORywgMylcbiAgICBvdXRwdXQud3JpdGVTdHJpbmcodGhpcy5hcHBJZClcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMudHJhY2VJZCAhPT0gbnVsbCAmJiB0aGlzLnRyYWNlSWQgIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJ0cmFjZUlkXCIsIFRocmlmdC5UeXBlLlNUUklORywgNClcbiAgICBvdXRwdXQud3JpdGVTdHJpbmcodGhpcy50cmFjZUlkKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuICBpZiAodGhpcy51cmxEb21haW4gIT09IG51bGwgJiYgdGhpcy51cmxEb21haW4gIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJ1cmxEb21haW5cIiwgVGhyaWZ0LlR5cGUuU1RSSU5HLCA1KVxuICAgIG91dHB1dC53cml0ZVN0cmluZyh0aGlzLnVybERvbWFpbilcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMudXJsUXVlcnkgIT09IG51bGwgJiYgdGhpcy51cmxRdWVyeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0cHV0LndyaXRlRmllbGRCZWdpbihcInVybFF1ZXJ5XCIsIFRocmlmdC5UeXBlLlNUUklORywgNilcbiAgICBvdXRwdXQud3JpdGVTdHJpbmcodGhpcy51cmxRdWVyeSlcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMucmVwb3J0VGltZSAhPT0gbnVsbCAmJiB0aGlzLnJlcG9ydFRpbWUgIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJyZXBvcnRUaW1lXCIsIFRocmlmdC5UeXBlLkk2NCwgNylcbiAgICBvdXRwdXQud3JpdGVJNjQodGhpcy5yZXBvcnRUaW1lKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuICBpZiAodGhpcy5maXJzdFNjcmVlblRpbWUgIT09IG51bGwgJiYgdGhpcy5maXJzdFNjcmVlblRpbWUgIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJmaXJzdFNjcmVlblRpbWVcIiwgVGhyaWZ0LlR5cGUuSTY0LCA4KVxuICAgIG91dHB1dC53cml0ZUk2NCh0aGlzLmZpcnN0U2NyZWVuVGltZSlcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMud2hpdGVTY3JlZW5UaW1lICE9PSBudWxsICYmIHRoaXMud2hpdGVTY3JlZW5UaW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwid2hpdGVTY3JlZW5UaW1lXCIsIFRocmlmdC5UeXBlLkk2NCwgOSlcbiAgICBvdXRwdXQud3JpdGVJNjQodGhpcy53aGl0ZVNjcmVlblRpbWUpXG4gICAgb3V0cHV0LndyaXRlRmllbGRFbmQoKVxuICB9XG4gIGlmICh0aGlzLm9wZXJhYmxlVGltZSAhPT0gbnVsbCAmJiB0aGlzLm9wZXJhYmxlVGltZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0cHV0LndyaXRlRmllbGRCZWdpbihcIm9wZXJhYmxlVGltZVwiLCBUaHJpZnQuVHlwZS5JNjQsIDEwKVxuICAgIG91dHB1dC53cml0ZUk2NCh0aGlzLm9wZXJhYmxlVGltZSlcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMucmVzb3VyY2VMb2FkZWRUaW1lICE9PSBudWxsICYmIHRoaXMucmVzb3VyY2VMb2FkZWRUaW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwicmVzb3VyY2VMb2FkZWRUaW1lXCIsIFRocmlmdC5UeXBlLkk2NCwgMTEpXG4gICAgb3V0cHV0LndyaXRlSTY0KHRoaXMucmVzb3VyY2VMb2FkZWRUaW1lKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuICBpZiAodGhpcy5sb2FkZWRUaW1lICE9PSBudWxsICYmIHRoaXMubG9hZGVkVGltZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0cHV0LndyaXRlRmllbGRCZWdpbihcImxvYWRlZFRpbWVcIiwgVGhyaWZ0LlR5cGUuSTY0LCAxMilcbiAgICBvdXRwdXQud3JpdGVJNjQodGhpcy5sb2FkZWRUaW1lKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuICBpZiAodGhpcy5icm93c2VyICE9PSBudWxsICYmIHRoaXMuYnJvd3NlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0cHV0LndyaXRlRmllbGRCZWdpbihcImJyb3dzZXJcIiwgVGhyaWZ0LlR5cGUuU1RSSU5HLCAxMylcbiAgICBvdXRwdXQud3JpdGVTdHJpbmcodGhpcy5icm93c2VyKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuICBpZiAodGhpcy5iYWNrdXBQcm9wZXJ0aWVzICE9PSBudWxsICYmIHRoaXMuYmFja3VwUHJvcGVydGllcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0cHV0LndyaXRlRmllbGRCZWdpbihcImJhY2t1cFByb3BlcnRpZXNcIiwgVGhyaWZ0LlR5cGUuTUFQLCAxNClcbiAgICBvdXRwdXQud3JpdGVNYXBCZWdpbihUaHJpZnQuVHlwZS5TVFJJTkcsIFRocmlmdC5UeXBlLlNUUklORywgVGhyaWZ0Lm9iamVjdExlbmd0aCh0aGlzLmJhY2t1cFByb3BlcnRpZXMpKVxuICAgIGZvciAodmFyIGtpdGVyMjQgaW4gdGhpcy5iYWNrdXBQcm9wZXJ0aWVzKSB7XG4gICAgICBpZiAodGhpcy5iYWNrdXBQcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KGtpdGVyMjQpKSB7XG4gICAgICAgIHZhciB2aXRlcjI1ID0gdGhpcy5iYWNrdXBQcm9wZXJ0aWVzW2tpdGVyMjRdXG4gICAgICAgIG91dHB1dC53cml0ZVN0cmluZyhraXRlcjI0KVxuICAgICAgICBvdXRwdXQud3JpdGVTdHJpbmcodml0ZXIyNSlcbiAgICAgIH1cbiAgICB9XG4gICAgb3V0cHV0LndyaXRlTWFwRW5kKClcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMuYmFja3VwUXVvdGEgIT09IG51bGwgJiYgdGhpcy5iYWNrdXBRdW90YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0cHV0LndyaXRlRmllbGRCZWdpbihcImJhY2t1cFF1b3RhXCIsIFRocmlmdC5UeXBlLk1BUCwgMTUpXG4gICAgb3V0cHV0LndyaXRlTWFwQmVnaW4oVGhyaWZ0LlR5cGUuU1RSSU5HLCBUaHJpZnQuVHlwZS5JNjQsIFRocmlmdC5vYmplY3RMZW5ndGgodGhpcy5iYWNrdXBRdW90YSkpXG4gICAgZm9yICh2YXIga2l0ZXIyNiBpbiB0aGlzLmJhY2t1cFF1b3RhKSB7XG4gICAgICBpZiAodGhpcy5iYWNrdXBRdW90YS5oYXNPd25Qcm9wZXJ0eShraXRlcjI2KSkge1xuICAgICAgICB2YXIgdml0ZXIyNyA9IHRoaXMuYmFja3VwUXVvdGFba2l0ZXIyNl1cbiAgICAgICAgb3V0cHV0LndyaXRlU3RyaW5nKGtpdGVyMjYpXG4gICAgICAgIG91dHB1dC53cml0ZUk2NCh2aXRlcjI3KVxuICAgICAgfVxuICAgIH1cbiAgICBvdXRwdXQud3JpdGVNYXBFbmQoKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuICBvdXRwdXQud3JpdGVGaWVsZFN0b3AoKVxuICBvdXRwdXQud3JpdGVTdHJ1Y3RFbmQoKVxufVxuXG52YXIgVFdlYkFnZW50QWpheEJhdGNoID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgdGhpcy5hamF4QmF0Y2ggPSBudWxsXG4gIGlmIChhcmdzKSB7XG4gICAgaWYgKGFyZ3MuYWpheEJhdGNoICE9PSB1bmRlZmluZWQgJiYgYXJncy5hamF4QmF0Y2ggIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYWpheEJhdGNoID0gVGhyaWZ0LmNvcHlMaXN0KGFyZ3MuYWpheEJhdGNoLCBbbnVsbF0pXG4gICAgfVxuICB9XG59XG5UV2ViQWdlbnRBamF4QmF0Y2gucHJvdG90eXBlID0ge31cblRXZWJBZ2VudEFqYXhCYXRjaC5wcm90b3R5cGUucmVhZCA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICBpbnB1dC5yZWFkU3RydWN0QmVnaW4oKVxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHZhciByZXQgPSBpbnB1dC5yZWFkRmllbGRCZWdpbigpXG4gICAgdmFyIGZuYW1lID0gcmV0LmZuYW1lXG4gICAgdmFyIGZ0eXBlID0gcmV0LmZ0eXBlXG4gICAgdmFyIGZpZCA9IHJldC5maWRcbiAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RPUCkge1xuICAgICAgYnJlYWtcbiAgICB9XG4gICAgc3dpdGNoIChmaWQpIHtcbiAgICBjYXNlIDE6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuTElTVCkge1xuICAgICAgICB2YXIgX3NpemUyOCA9IDBcbiAgICAgICAgdmFyIF9ydG1wMzMyXG4gICAgICAgIHRoaXMuYWpheEJhdGNoID0gW11cbiAgICAgICAgdmFyIF9ldHlwZTMxID0gMFxuICAgICAgICBfcnRtcDMzMiA9IGlucHV0LnJlYWRMaXN0QmVnaW4oKVxuICAgICAgICBfZXR5cGUzMSA9IF9ydG1wMzMyLmV0eXBlXG4gICAgICAgIF9zaXplMjggPSBfcnRtcDMzMi5zaXplXG4gICAgICAgIGZvciAodmFyIF9pMzMgPSAwOyBfaTMzIDwgX3NpemUyODsgKytfaTMzKSB7XG4gICAgICAgICAgdmFyIGVsZW0zNCA9IG51bGxcbiAgICAgICAgICBlbGVtMzQgPSBuZXcgVFdlYkFnZW50QWpheCgpXG4gICAgICAgICAgZWxlbTM0LnJlYWQoaW5wdXQpXG4gICAgICAgICAgdGhpcy5hamF4QmF0Y2gucHVzaChlbGVtMzQpXG4gICAgICAgIH1cbiAgICAgICAgaW5wdXQucmVhZExpc3RFbmQoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXQuc2tpcChmdHlwZSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAwOlxuICAgICAgaW5wdXQuc2tpcChmdHlwZSlcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgfVxuICAgIGlucHV0LnJlYWRGaWVsZEVuZCgpXG4gIH1cbiAgaW5wdXQucmVhZFN0cnVjdEVuZCgpXG59XG5cblRXZWJBZ2VudEFqYXhCYXRjaC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAob3V0cHV0KSB7XG4gIG91dHB1dC53cml0ZVN0cnVjdEJlZ2luKFwiVFdlYkFnZW50QWpheEJhdGNoXCIpXG4gIGlmICh0aGlzLmFqYXhCYXRjaCAhPT0gbnVsbCAmJiB0aGlzLmFqYXhCYXRjaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0cHV0LndyaXRlRmllbGRCZWdpbihcImFqYXhCYXRjaFwiLCBUaHJpZnQuVHlwZS5MSVNULCAxKVxuICAgIG91dHB1dC53cml0ZUxpc3RCZWdpbihUaHJpZnQuVHlwZS5TVFJVQ1QsIHRoaXMuYWpheEJhdGNoLmxlbmd0aClcbiAgICBmb3IgKHZhciBpdGVyMzUgaW4gdGhpcy5hamF4QmF0Y2gpIHtcbiAgICAgIGlmICh0aGlzLmFqYXhCYXRjaC5oYXNPd25Qcm9wZXJ0eShpdGVyMzUpKSB7XG4gICAgICAgIGl0ZXIzNSA9IHRoaXMuYWpheEJhdGNoW2l0ZXIzNV1cbiAgICAgICAgaXRlcjM1LndyaXRlKG91dHB1dClcbiAgICAgIH1cbiAgICB9XG4gICAgb3V0cHV0LndyaXRlTGlzdEVuZCgpXG4gICAgb3V0cHV0LndyaXRlRmllbGRFbmQoKVxuICB9XG4gIG91dHB1dC53cml0ZUZpZWxkU3RvcCgpXG4gIG91dHB1dC53cml0ZVN0cnVjdEVuZCgpXG59XG5cbnZhciBUV2ViQWdlbnRBamF4ID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgdGhpcy5hZ2VudElkID0gbnVsbFxuICB0aGlzLnRpZXJJZCA9IG51bGxcbiAgdGhpcy5hcHBJZCA9IG51bGxcbiAgdGhpcy50cmFjZUlkID0gbnVsbFxuICB0aGlzLnVybERvbWFpbiA9IG51bGxcbiAgdGhpcy51cmxRdWVyeSA9IG51bGxcbiAgdGhpcy5yZXBvcnRUaW1lID0gbnVsbFxuICB0aGlzLmxvYWRlZFRpbWUgPSBudWxsXG4gIHRoaXMuYnJvd3NlciA9IG51bGxcbiAgdGhpcy5iYWNrdXBQcm9wZXJ0aWVzID0gbnVsbFxuICB0aGlzLmJhY2t1cFF1b3RhID0gbnVsbFxuICBpZiAoYXJncykge1xuICAgIGlmIChhcmdzLmFnZW50SWQgIT09IHVuZGVmaW5lZCAmJiBhcmdzLmFnZW50SWQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYWdlbnRJZCA9IGFyZ3MuYWdlbnRJZFxuICAgIH1cbiAgICBpZiAoYXJncy50aWVySWQgIT09IHVuZGVmaW5lZCAmJiBhcmdzLnRpZXJJZCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy50aWVySWQgPSBhcmdzLnRpZXJJZFxuICAgIH1cbiAgICBpZiAoYXJncy5hcHBJZCAhPT0gdW5kZWZpbmVkICYmIGFyZ3MuYXBwSWQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYXBwSWQgPSBhcmdzLmFwcElkXG4gICAgfVxuICAgIGlmIChhcmdzLnRyYWNlSWQgIT09IHVuZGVmaW5lZCAmJiBhcmdzLnRyYWNlSWQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudHJhY2VJZCA9IGFyZ3MudHJhY2VJZFxuICAgIH1cbiAgICBpZiAoYXJncy51cmxEb21haW4gIT09IHVuZGVmaW5lZCAmJiBhcmdzLnVybERvbWFpbiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy51cmxEb21haW4gPSBhcmdzLnVybERvbWFpblxuICAgIH1cbiAgICBpZiAoYXJncy51cmxRdWVyeSAhPT0gdW5kZWZpbmVkICYmIGFyZ3MudXJsUXVlcnkgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudXJsUXVlcnkgPSBhcmdzLnVybFF1ZXJ5XG4gICAgfVxuICAgIGlmIChhcmdzLnJlcG9ydFRpbWUgIT09IHVuZGVmaW5lZCAmJiBhcmdzLnJlcG9ydFRpbWUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMucmVwb3J0VGltZSA9IGFyZ3MucmVwb3J0VGltZVxuICAgIH1cbiAgICBpZiAoYXJncy5sb2FkZWRUaW1lICE9PSB1bmRlZmluZWQgJiYgYXJncy5sb2FkZWRUaW1lICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmxvYWRlZFRpbWUgPSBhcmdzLmxvYWRlZFRpbWVcbiAgICB9XG4gICAgaWYgKGFyZ3MuYnJvd3NlciAhPT0gdW5kZWZpbmVkICYmIGFyZ3MuYnJvd3NlciAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5icm93c2VyID0gYXJncy5icm93c2VyXG4gICAgfVxuICAgIGlmIChhcmdzLmJhY2t1cFByb3BlcnRpZXMgIT09IHVuZGVmaW5lZCAmJiBhcmdzLmJhY2t1cFByb3BlcnRpZXMgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYmFja3VwUHJvcGVydGllcyA9IFRocmlmdC5jb3B5TWFwKGFyZ3MuYmFja3VwUHJvcGVydGllcywgW251bGxdKVxuICAgIH1cbiAgICBpZiAoYXJncy5iYWNrdXBRdW90YSAhPT0gdW5kZWZpbmVkICYmIGFyZ3MuYmFja3VwUXVvdGEgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYmFja3VwUXVvdGEgPSBUaHJpZnQuY29weU1hcChhcmdzLmJhY2t1cFF1b3RhLCBbbnVsbF0pXG4gICAgfVxuICB9XG59XG5UV2ViQWdlbnRBamF4LnByb3RvdHlwZSA9IHt9XG5UV2ViQWdlbnRBamF4LnByb3RvdHlwZS5yZWFkID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gIGlucHV0LnJlYWRTdHJ1Y3RCZWdpbigpXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgdmFyIHJldCA9IGlucHV0LnJlYWRGaWVsZEJlZ2luKClcbiAgICB2YXIgZm5hbWUgPSByZXQuZm5hbWVcbiAgICB2YXIgZnR5cGUgPSByZXQuZnR5cGVcbiAgICB2YXIgZmlkID0gcmV0LmZpZFxuICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5TVE9QKSB7XG4gICAgICBicmVha1xuICAgIH1cbiAgICBzd2l0Y2ggKGZpZCkge1xuICAgIGNhc2UgMTpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5TVFJJTkcpIHtcbiAgICAgICAgdGhpcy5hZ2VudElkID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDI6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RSSU5HKSB7XG4gICAgICAgIHRoaXMudGllcklkID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDM6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RSSU5HKSB7XG4gICAgICAgIHRoaXMuYXBwSWQgPSBpbnB1dC5yZWFkU3RyaW5nKCkudmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgNDpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5TVFJJTkcpIHtcbiAgICAgICAgdGhpcy50cmFjZUlkID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDU6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RSSU5HKSB7XG4gICAgICAgIHRoaXMudXJsRG9tYWluID0gaW5wdXQucmVhZFN0cmluZygpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDY6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RSSU5HKSB7XG4gICAgICAgIHRoaXMudXJsUXVlcnkgPSBpbnB1dC5yZWFkU3RyaW5nKCkudmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgNzpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5JNjQpIHtcbiAgICAgICAgdGhpcy5yZXBvcnRUaW1lID0gaW5wdXQucmVhZEk2NCgpLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDg6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuSTY0KSB7XG4gICAgICAgIHRoaXMubG9hZGVkVGltZSA9IGlucHV0LnJlYWRJNjQoKS52YWx1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXQuc2tpcChmdHlwZSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSA5OlxuICAgICAgaWYgKGZ0eXBlID09IFRocmlmdC5UeXBlLlNUUklORykge1xuICAgICAgICB0aGlzLmJyb3dzZXIgPSBpbnB1dC5yZWFkU3RyaW5nKCkudmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgMTA6XG4gICAgICBpZiAoZnR5cGUgPT0gVGhyaWZ0LlR5cGUuTUFQKSB7XG4gICAgICAgIHZhciBfc2l6ZTM2ID0gMFxuICAgICAgICB2YXIgX3J0bXAzNDBcbiAgICAgICAgdGhpcy5iYWNrdXBQcm9wZXJ0aWVzID0ge31cbiAgICAgICAgdmFyIF9rdHlwZTM3ID0gMFxuICAgICAgICB2YXIgX3Z0eXBlMzggPSAwXG4gICAgICAgIF9ydG1wMzQwID0gaW5wdXQucmVhZE1hcEJlZ2luKClcbiAgICAgICAgX2t0eXBlMzcgPSBfcnRtcDM0MC5rdHlwZVxuICAgICAgICBfdnR5cGUzOCA9IF9ydG1wMzQwLnZ0eXBlXG4gICAgICAgIF9zaXplMzYgPSBfcnRtcDM0MC5zaXplXG4gICAgICAgIGZvciAodmFyIF9pNDEgPSAwOyBfaTQxIDwgX3NpemUzNjsgKytfaTQxKSB7XG4gICAgICAgICAgaWYgKF9pNDEgPiAwKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQucnN0YWNrLmxlbmd0aCA+IGlucHV0LnJwb3NbaW5wdXQucnBvcy5sZW5ndGggLSAxXSArIDEpIHtcbiAgICAgICAgICAgICAgaW5wdXQucnN0YWNrLnBvcCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBrZXk0MiA9IG51bGxcbiAgICAgICAgICB2YXIgdmFsNDMgPSBudWxsXG4gICAgICAgICAga2V5NDIgPSBpbnB1dC5yZWFkU3RyaW5nKCkudmFsdWVcbiAgICAgICAgICB2YWw0MyA9IGlucHV0LnJlYWRTdHJpbmcoKS52YWx1ZVxuICAgICAgICAgIHRoaXMuYmFja3VwUHJvcGVydGllc1trZXk0Ml0gPSB2YWw0M1xuICAgICAgICB9XG4gICAgICAgIGlucHV0LnJlYWRNYXBFbmQoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXQuc2tpcChmdHlwZSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAxMTpcbiAgICAgIGlmIChmdHlwZSA9PSBUaHJpZnQuVHlwZS5NQVApIHtcbiAgICAgICAgdmFyIF9zaXplNDQgPSAwXG4gICAgICAgIHZhciBfcnRtcDM0OFxuICAgICAgICB0aGlzLmJhY2t1cFF1b3RhID0ge31cbiAgICAgICAgdmFyIF9rdHlwZTQ1ID0gMFxuICAgICAgICB2YXIgX3Z0eXBlNDYgPSAwXG4gICAgICAgIF9ydG1wMzQ4ID0gaW5wdXQucmVhZE1hcEJlZ2luKClcbiAgICAgICAgX2t0eXBlNDUgPSBfcnRtcDM0OC5rdHlwZVxuICAgICAgICBfdnR5cGU0NiA9IF9ydG1wMzQ4LnZ0eXBlXG4gICAgICAgIF9zaXplNDQgPSBfcnRtcDM0OC5zaXplXG4gICAgICAgIGZvciAodmFyIF9pNDkgPSAwOyBfaTQ5IDwgX3NpemU0NDsgKytfaTQ5KSB7XG4gICAgICAgICAgaWYgKF9pNDkgPiAwKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQucnN0YWNrLmxlbmd0aCA+IGlucHV0LnJwb3NbaW5wdXQucnBvcy5sZW5ndGggLSAxXSArIDEpIHtcbiAgICAgICAgICAgICAgaW5wdXQucnN0YWNrLnBvcCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBrZXk1MCA9IG51bGxcbiAgICAgICAgICB2YXIgdmFsNTEgPSBudWxsXG4gICAgICAgICAga2V5NTAgPSBpbnB1dC5yZWFkU3RyaW5nKCkudmFsdWVcbiAgICAgICAgICB2YWw1MSA9IGlucHV0LnJlYWRJNjQoKS52YWx1ZVxuICAgICAgICAgIHRoaXMuYmFja3VwUXVvdGFba2V5NTBdID0gdmFsNTFcbiAgICAgICAgfVxuICAgICAgICBpbnB1dC5yZWFkTWFwRW5kKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0LnNraXAoZnR5cGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICBpbnB1dC5za2lwKGZ0eXBlKVxuICAgIH1cbiAgICBpbnB1dC5yZWFkRmllbGRFbmQoKVxuICB9XG4gIGlucHV0LnJlYWRTdHJ1Y3RFbmQoKVxufVxuXG5UV2ViQWdlbnRBamF4LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChvdXRwdXQpIHtcbiAgb3V0cHV0LndyaXRlU3RydWN0QmVnaW4oXCJUV2ViQWdlbnRBamF4XCIpXG4gIGlmICh0aGlzLmFnZW50SWQgIT09IG51bGwgJiYgdGhpcy5hZ2VudElkICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwiYWdlbnRJZFwiLCBUaHJpZnQuVHlwZS5TVFJJTkcsIDEpXG4gICAgb3V0cHV0LndyaXRlU3RyaW5nKHRoaXMuYWdlbnRJZClcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMudGllcklkICE9PSBudWxsICYmIHRoaXMudGllcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwidGllcklkXCIsIFRocmlmdC5UeXBlLlNUUklORywgMilcbiAgICBvdXRwdXQud3JpdGVTdHJpbmcodGhpcy50aWVySWQpXG4gICAgb3V0cHV0LndyaXRlRmllbGRFbmQoKVxuICB9XG4gIGlmICh0aGlzLmFwcElkICE9PSBudWxsICYmIHRoaXMuYXBwSWQgIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJhcHBJZFwiLCBUaHJpZnQuVHlwZS5TVFJJTkcsIDMpXG4gICAgb3V0cHV0LndyaXRlU3RyaW5nKHRoaXMuYXBwSWQpXG4gICAgb3V0cHV0LndyaXRlRmllbGRFbmQoKVxuICB9XG4gIGlmICh0aGlzLnRyYWNlSWQgIT09IG51bGwgJiYgdGhpcy50cmFjZUlkICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwidHJhY2VJZFwiLCBUaHJpZnQuVHlwZS5TVFJJTkcsIDQpXG4gICAgb3V0cHV0LndyaXRlU3RyaW5nKHRoaXMudHJhY2VJZClcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMudXJsRG9tYWluICE9PSBudWxsICYmIHRoaXMudXJsRG9tYWluICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwidXJsRG9tYWluXCIsIFRocmlmdC5UeXBlLlNUUklORywgNSlcbiAgICBvdXRwdXQud3JpdGVTdHJpbmcodGhpcy51cmxEb21haW4pXG4gICAgb3V0cHV0LndyaXRlRmllbGRFbmQoKVxuICB9XG4gIGlmICh0aGlzLnVybFF1ZXJ5ICE9PSBudWxsICYmIHRoaXMudXJsUXVlcnkgIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJ1cmxRdWVyeVwiLCBUaHJpZnQuVHlwZS5TVFJJTkcsIDYpXG4gICAgb3V0cHV0LndyaXRlU3RyaW5nKHRoaXMudXJsUXVlcnkpXG4gICAgb3V0cHV0LndyaXRlRmllbGRFbmQoKVxuICB9XG4gIGlmICh0aGlzLnJlcG9ydFRpbWUgIT09IG51bGwgJiYgdGhpcy5yZXBvcnRUaW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwicmVwb3J0VGltZVwiLCBUaHJpZnQuVHlwZS5JNjQsIDcpXG4gICAgb3V0cHV0LndyaXRlSTY0KHRoaXMucmVwb3J0VGltZSlcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cbiAgaWYgKHRoaXMubG9hZGVkVGltZSAhPT0gbnVsbCAmJiB0aGlzLmxvYWRlZFRpbWUgIT09IHVuZGVmaW5lZCkge1xuICAgIG91dHB1dC53cml0ZUZpZWxkQmVnaW4oXCJsb2FkZWRUaW1lXCIsIFRocmlmdC5UeXBlLkk2NCwgOClcbiAgICBvdXRwdXQud3JpdGVJNjQodGhpcy5sb2FkZWRUaW1lKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuICBpZiAodGhpcy5icm93c2VyICE9PSBudWxsICYmIHRoaXMuYnJvd3NlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb3V0cHV0LndyaXRlRmllbGRCZWdpbihcImJyb3dzZXJcIiwgVGhyaWZ0LlR5cGUuU1RSSU5HLCA5KVxuICAgIG91dHB1dC53cml0ZVN0cmluZyh0aGlzLmJyb3dzZXIpXG4gICAgb3V0cHV0LndyaXRlRmllbGRFbmQoKVxuICB9XG4gIGlmICh0aGlzLmJhY2t1cFByb3BlcnRpZXMgIT09IG51bGwgJiYgdGhpcy5iYWNrdXBQcm9wZXJ0aWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwiYmFja3VwUHJvcGVydGllc1wiLCBUaHJpZnQuVHlwZS5NQVAsIDEwKVxuICAgIG91dHB1dC53cml0ZU1hcEJlZ2luKFRocmlmdC5UeXBlLlNUUklORywgVGhyaWZ0LlR5cGUuU1RSSU5HLCBUaHJpZnQub2JqZWN0TGVuZ3RoKHRoaXMuYmFja3VwUHJvcGVydGllcykpXG4gICAgZm9yICh2YXIga2l0ZXI1MiBpbiB0aGlzLmJhY2t1cFByb3BlcnRpZXMpIHtcbiAgICAgIGlmICh0aGlzLmJhY2t1cFByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkoa2l0ZXI1MikpIHtcbiAgICAgICAgdmFyIHZpdGVyNTMgPSB0aGlzLmJhY2t1cFByb3BlcnRpZXNba2l0ZXI1Ml1cbiAgICAgICAgb3V0cHV0LndyaXRlU3RyaW5nKGtpdGVyNTIpXG4gICAgICAgIG91dHB1dC53cml0ZVN0cmluZyh2aXRlcjUzKVxuICAgICAgfVxuICAgIH1cbiAgICBvdXRwdXQud3JpdGVNYXBFbmQoKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuICBpZiAodGhpcy5iYWNrdXBRdW90YSAhPT0gbnVsbCAmJiB0aGlzLmJhY2t1cFF1b3RhICE9PSB1bmRlZmluZWQpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwiYmFja3VwUXVvdGFcIiwgVGhyaWZ0LlR5cGUuTUFQLCAxMSlcbiAgICBvdXRwdXQud3JpdGVNYXBCZWdpbihUaHJpZnQuVHlwZS5TVFJJTkcsIFRocmlmdC5UeXBlLkk2NCwgVGhyaWZ0Lm9iamVjdExlbmd0aCh0aGlzLmJhY2t1cFF1b3RhKSlcbiAgICBmb3IgKHZhciBraXRlcjU0IGluIHRoaXMuYmFja3VwUXVvdGEpIHtcbiAgICAgIGlmICh0aGlzLmJhY2t1cFF1b3RhLmhhc093blByb3BlcnR5KGtpdGVyNTQpKSB7XG4gICAgICAgIHZhciB2aXRlcjU1ID0gdGhpcy5iYWNrdXBRdW90YVtraXRlcjU0XVxuICAgICAgICBvdXRwdXQud3JpdGVTdHJpbmcoa2l0ZXI1NClcbiAgICAgICAgb3V0cHV0LndyaXRlSTY0KHZpdGVyNTUpXG4gICAgICB9XG4gICAgfVxuICAgIG91dHB1dC53cml0ZU1hcEVuZCgpXG4gICAgb3V0cHV0LndyaXRlRmllbGRFbmQoKVxuICB9XG4gIG91dHB1dC53cml0ZUZpZWxkU3RvcCgpXG4gIG91dHB1dC53cml0ZVN0cnVjdEVuZCgpXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBUV2ViQWdlbnRMb2FkOiBUV2ViQWdlbnRMb2FkLFxuICBUV2ViQWdlbnRBamF4OiBUV2ViQWdlbnRBamF4LFxuICBUV2ViQWdlbnRMb2FkQmF0Y2g6IFRXZWJBZ2VudExvYWRCYXRjaCxcbiAgVFdlYkFnZW50QWpheEJhdGNoOiBUV2ViQWdlbnRBamF4QmF0Y2hcbn1cbiIsInZhciBsb2cgPSByZXF1aXJlKFwiLi9sb2dcIilcbnZhciBfbG9ja1RpbWVyID0gbnVsbFxudmFyIF9sb2NrU3RhdGUgPSBmYWxzZVxudmFyIGNicyA9IFtdXG52YXIgbG9ja2VyID0ge1xuICBleGVjOiBmdW5jdGlvbiAoY2IpIHtcbiAgICBjYnMucHVzaChjYilcbiAgICBpZiAoIV9sb2NrVGltZXIpIHtcbiAgICAgIF9sb2NrVGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChfbG9ja1N0YXRlIHx8IGNicy5sZW5ndGggPD0gMCkgcmV0dXJuXG4gICAgICAgIF9sb2NrU3RhdGUgPSB0cnVlXG4gICAgICAgIHZhciBjYWxsYmFjayA9IGNicy5zaGlmdCgpXG4gICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgbG9nKFwi6Zif5YiX5Ye95pWw5pWw6YeP77yaXCIgKyBjYnMubGVuZ3RoKVxuICAgICAgICBpZiAoY2JzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoX2xvY2tUaW1lcilcbiAgICAgICAgICBfbG9ja1RpbWVyID0gbnVsbFxuICAgICAgICB9XG4gICAgICAgIF9sb2NrU3RhdGUgPSBmYWxzZVxuICAgICAgfSwgMClcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsb2NrZXJcbiIsInZhciBjb25maWcgPSByZXF1aXJlKFwiLi9jb25maWdcIilcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIWNvbmZpZy5zaG93TG9nKSByZXR1cm5cbiAgaWYgKHR5cGVvZiBjb25zb2xlID09PSBcIm9iamVjdFwiICYmIGNvbnNvbGUubG9nKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cylcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHNbMF0pXG4gICAgfVxuICB9XG59XG4iLCJ2YXIgXyA9IHJlcXVpcmUoXCIuL2NvbW1vblwiKVxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL2NvbmZpZ1wiKVxuXG52YXIgcGVyZm9ybWFuY2UgPSByZXF1aXJlKFwiLi9wZXJmb3JtYW5jZVwiKVxudmFyIHJ4QXBtID0ge1xuICBjb25maWc6IGNvbmZpZ1xufVxucnhBcG0uaW5pdCA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgdmFyIHRoYXQgPSB0aGlzXG4gIGlmIChjb25maWcgJiYgIV8uaXNFbXB0eU9iamVjdChjb25maWcpKSB7XG4gICAgXy5leHRlbmQodGhhdC5jb25maWcsIGNvbmZpZylcbiAgfVxuICBpZiAod2luZG93LiQkcnhBcG1TZXR0aW5nKSB7XG4gICAgXy5leHRlbmQodGhhdC5jb25maWcsIHdpbmRvdy4kJHJ4QXBtU2V0dGluZylcbiAgfVxuICBwZXJmb3JtYW5jZSgpXG4gIHJlcXVpcmUoXCIuL2Vycm9yXCIpXG4gIHJlcXVpcmUoXCIuL3hoclwiKVxufVxubW9kdWxlLmV4cG9ydHMgPSByeEFwbVxuIiwiLypcbiAqIEBBdXRob3I6IGppYW5nZmVuZ1xuICogQERhdGU6IDIwMTctMDgtMjIgMTE6NTQ6NDdcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiBqaWFuZ2ZlbmdcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTgtMDMtMDEgMTY6MzQ6NDBcbiAqL1xudmFyIGV2ZW50RW1pdHRlciA9IHJlcXVpcmUoXCIuLi9ldmVudEVtaXR0ZXJcIilcbnZhciBjb21tb24gPSByZXF1aXJlKFwiLi4vY29tbW9uXCIpXG52YXIgY29uc3RzID0gcmVxdWlyZShcIi4uL2NvbnN0c1wiKVxudmFyIGxvZyA9IHJlcXVpcmUoXCIuLi9sb2dcIilcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnXCIpXG52YXIgcGFnZUxvYWRlciA9IHJlcXVpcmUoXCIuL3BhZ2VMb2FkZXJcIilcbnZhciBkb21Mb2FkaW5nID0gcGFnZUxvYWRlci5kb21Mb2FkaW5nKClcbnZhciBmaXJzdFNjcmVlblxudmFyIHBlcmZvcm1hbmNlID0gcmVxdWlyZShcIi4vcGVyZm9ybWFuY2VcIilcbnZhciBzZW5kZXIgPSByZXF1aXJlKFwiLi9zZW5kZXJcIilcblxudmFyIHdpbiA9IHdpbmRvd1xudmFyIGRvYyA9IHdpbi5kb2N1bWVudFxudmFyIHVybCA9IChcIlwiICsgbG9jYXRpb24pLnNwbGl0KFwiP1wiKVswXVxudmFyIGllID0gZmFsc2VcbnZhciBkb21Db250ZW50TG9hZGVkID0gZmFsc2VcbnZhciBzdHJBZGRFdmVudExpc3RlbmVyID0gXCJhZGRFdmVudExpc3RlbmVyXCJcbnZhciBzdHJBdHRhY2hFdmVudCA9IFwiYXR0YWNoRXZlbnRcIlxuXG52YXIgcGFnZUluZm8gPSB7XG4gIGZpcnN0Qnl0ZTogY29uZmlnLmxvYWRUaW1lIHx8IHdpbmRvdy4kJHJ4QXBtRmlyc3RCeXRlVGltZSB8fCBwYWdlTG9hZGVyLmdldEN1cnJlbnRUaW1lKCksXG4gIG9yaWdpbjogdXJsLFxuICBmZWF0dXJlczoge31cbn1cblxuLy8g6aG16Z2i5Yqg6L295a6M5q+V5ZCO5Y+R6YCB5oCn6IO95pWw5o2uXG5ldmVudEVtaXR0ZXIub24oY29uc3RzLnBhZ2VMb2FkZXJfbG9hZGVkLCBmdW5jdGlvbiAocGFnZUluZm8pIHtcbiAgdmFyIHBlcmZvcnMgPSBnZXRQZXJmb3JtYW5jZURhdGEoKVxuICBzZW5kZXIuc2VuZFBlcmZvcm1hbmNlcyhjb21tb24uZXh0ZW5kKHt9LCBwZXJmb3JzLCBjb21tb24uaW5mby5wcm9wZXJ0aWVzKCkpKVxufSlcblxuLyogZXZlbnRFbWl0dGVyLm9uKGNvbnN0cy5wYWdlTG9hZGVyX2RvbWxvYWRpbmcsIGZ1bmN0aW9uIChwYWdlSW5mbykge1xuICBldmVudEVtaXR0ZXIuYWRkRXZlbnRBcmdzKFwibWFya1wiLCBbXCJkb21Mb2FkaW5nXCIsIGRvbUxvYWRpbmcuZ2V0RG9tTG9hZGluZ1N0YXJ0VGltZSgpXSlcbn0pICovXG5cbi8qKlxuICog5qCH6K6w5paH5qGj5Yqg6L295a6M5q+V55qE5pe26Ze0XG4gKi9cbmZ1bmN0aW9uIG9uTG9hZGVkICgpIHtcbiAgLy8g5qCH6K6w55m95bGP5Yqg6L295pe26Ze0XG4gIC8vIOagh+iusOmmluWxj+WKoOi9veaXtumXtC0t5Lul6aaW5bGP5omA5pyJSU1H5qCH562+55qE5pyA5aSn5Yqg6L295pe26Ze05L2c5Li66aaW5bGP5Yqg6L295a6M5oiQ5pe26Ze0XG4gIC8vIOagh+iusOmhtemdouiusOi9veWujOaIkOeahOaXtumXtO+8jOeUqOadpeiuoeeul+mhtemdouWKoOi9veaXtumXtFxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBldmVudEVtaXR0ZXIuYWRkRXZlbnRBcmdzKFwibWFya1wiLCBbXCJkb21Mb2FkaW5nXCIsIGRvbUxvYWRpbmcuZ2V0RG9tTG9hZGluZ1N0YXJ0VGltZSgpXSlcbiAgICBpZiAoIWZpcnN0U2NyZWVuKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJmaXJzdFNjcmVlbiBub3QgZmluZFwiKVxuICAgIH1cbiAgICBldmVudEVtaXR0ZXIuYWRkRXZlbnRBcmdzKFwibWFya1wiLCBbXCJmaXJzdFNjcmVlblwiLCBmaXJzdFNjcmVlbi5nZXRGaXJzdFNjcmVlblRpbWUoKV0pXG4gICAgZXZlbnRFbWl0dGVyLmFkZEV2ZW50QXJncyhcIm1hcmtcIiwgW1wib25Mb2FkXCIsIHBhZ2VMb2FkZXIuZ2V0Q3VycmVudFRpbWUoKV0pXG4gICAgZXZlbnRFbWl0dGVyLmVtaXQoY29uc3RzLnBhZ2VMb2FkZXJfbG9hZGVkLCBbcGFnZUluZm9dKVxuICB9LCAwKVxufVxuXG5mdW5jdGlvbiBvblJlYWR5U3RhdGVDaGFuZ2VkQ29tcGxldGUgKCkge1xuICBpZiAoZG9tQ29udGVudExvYWRlZCB8fCBkb2MucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgb25Eb21Db250ZW50TG9hZGVkKClcbiAgfVxufVxuXG4vKipcbiAqIOagh+iusOW9k+WJjemhtemdoueahERPTeWKoOi9veWujOavleeahOaXtumXtO+8jOeUqOadpeiuoeeul+WPr+aTjeS9nOaXtumXtFxuICog5LmL5ZCO5byA5aeL6aaW5bGP6K6h566XXG4gKi9cbmZ1bmN0aW9uIG9uRG9tQ29udGVudExvYWRlZCAoKSB7XG4gIGV2ZW50RW1pdHRlci5hZGRFdmVudEFyZ3MoXCJtYXJrXCIsIFtcImRvbUNvbnRlbnRcIiwgcGFnZUxvYWRlci5nZXRDdXJyZW50VGltZSgpXSlcbiAgbG9nKFwib25Eb21Db250ZW50TG9hZGVkIGV4ZWN1dGVkLCB0aGUgZmlyc3RTY3JlZW4gb2JqZWN0OlwiKVxuICBmaXJzdFNjcmVlbiA9IHBhZ2VMb2FkZXIuZmlyc3RTY3JlZW4oKVxuICBsb2coZmlyc3RTY3JlZW4pXG59XG5cbi8qKlxuICog6I635Y+W5YWo6YOo55qE5oCn6IO95pWw5o2uXG4gKlxuICogQHJldHVybnMg6L+U5Zue5aSE55CG5ZCO55qE5oCn6IO95pWw5o2uSlNPTuWvueixoVxuICovXG5mdW5jdGlvbiBnZXRQZXJmb3JtYW5jZURhdGEgKCkge1xuICB2YXIgcGVyZm9ybWFuY2VzID0ge31cbiAgZXZlbnRFbWl0dGVyLmhhbmRsZVF1ZXVlKFwibWFya1wiLCBmdW5jdGlvbiAobWFyaywgdGltZSkge1xuICAgIGlmIChtYXJrICE9PSBcImZpcnN0Qnl0ZVwiKSB7XG4gICAgICBwZXJmb3JtYW5jZXNbbWFya10gPSB0aW1lIC0gcGFnZUluZm8uZmlyc3RCeXRlXG4gICAgfSBlbHNlIHtcbiAgICAgIHBlcmZvcm1hbmNlc1ttYXJrXSA9IHBhZ2VJbmZvLmZpcnN0Qnl0ZVxuICAgIH1cbiAgfSlcbiAgLy8g55m95bGP5pe26Ze0IC0tIHdoaXRlU2NyZWVuVGltZVxuICBwZXJmb3JtYW5jZXNbXCJkb21Mb2FkaW5nXCJdID0gcGVyZm9ybWFuY2UuZ2V0V3JpdGVTY3JlZW5UaW1lU3BhbigpIHx8IHBlcmZvcm1hbmNlc1tcImRvbUxvYWRpbmdcIl1cbiAgLy8g5Y+v5pON5L2c5pe26Ze077yIRG9t5Yqg6L295a6M5oiQ5pe26Ze077yJLS0gb3BlcmFibGVUaW1lXG4gIHBlcmZvcm1hbmNlc1tcImRvbUNvbnRlbnRcIl0gPSBwZXJmb3JtYW5jZS5nZXREb21SZWFkeVRpbWVTcGFuKCkgfHwgcGVyZm9ybWFuY2VzW1wiZG9tQ29udGVudFwiXVxuICAvLyDpppblsY/ml7bpl7QgLS0gZmlyc3RTY3JlZW5UaW1lXG4gIHBlcmZvcm1hbmNlc1tcImZpcnN0U2NyZWVuXCJdID0gcGVyZm9ybWFuY2VzW1wiZmlyc3RTY3JlZW5cIl0gfHwgcGVyZm9ybWFuY2VzW1wiZG9tQ29udGVudFwiXSB8fCAtMVxuICAvLyDpobXpnaLliqDovb3lrozmiJDml7bpl7QgLS0gcmVzb3VyY2VMb2FkZWRUaW1lXG4gIHBlcmZvcm1hbmNlc1tcIm9uTG9hZFwiXSA9IHBlcmZvcm1hbmNlLmdldFBhZ2VSZWFkeVRpbWVTcGFuKCkgfHwgcGVyZm9ybWFuY2VzW1wib25Mb2FkXCJdXG4gIC8vIEROU+ino+aekOaXtumXtFxuICBwZXJmb3JtYW5jZXNbXCJkbnNcIl0gPSBwZXJmb3JtYW5jZS5nZXRETlNUaW1lU3BhbigpIHx8IC0xXG4gIC8vIFRDUOino+aekOaXtumXtFxuICBwZXJmb3JtYW5jZXNbXCJ0Y3BcIl0gPSBwZXJmb3JtYW5jZS5nZXRUQ1BUaW1lU3BhbigpIHx8IC0xXG4gIC8vIOmhtemdoui1hOa6kOaVsOmHj1xuICBwZXJmb3JtYW5jZXNbXCJyZXNvdXJjZUNvdW50XCJdID0gcGVyZm9ybWFuY2UuZ2V0UmVzb3VyY2VDb3VudCgpIHx8IC0xXG4gIHJldHVybiBwZXJmb3JtYW5jZXNcbn1cblxuLy8g5qCH6K6w6L+b5YWl6aG16Z2i55qE5pe26Ze0XG5mdW5jdGlvbiBtYXJrRmlyc3RCeXRlVGltZSAoKSB7XG4gIGV2ZW50RW1pdHRlci5hZGRFdmVudEFyZ3MoXCJtYXJrXCIsIFtcImZpcnN0Qnl0ZVwiLCBjb25maWcubG9hZFRpbWUgfHwgd2luZG93LiQkcnhBcG1GaXJzdEJ5dGVUaW1lIHx8IHBhZ2VMb2FkZXIuZ2V0Q3VycmVudFRpbWUoKV0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICBtYXJrRmlyc3RCeXRlVGltZSgpXG4gIGxvZyhkb2MucmVhZHlTdGF0ZSlcbiAgLy8gY29tcGxldGXnrYnlkIzkuo53aW5kb3cub25sb2FkXG4gIC8vIGludGVyYWN0aXZl562J5ZCM5LiORE9NQ29udGVudExvYWRlZFxuICB2YXIgZG9jU3RhdGUgPSBkb2N1bWVudC5yZWFkeVN0YXRlXG4gIGlmIChkb2NTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgb25Eb21Db250ZW50TG9hZGVkKClcbiAgICBvbkxvYWRlZCgpXG4gIH0gZWxzZSB7XG4gICAgLy8g5aaC5p6c6aG16Z2iRE9N5YWD57Sg5Yqg6L295a6M5oiQ77yM5YiZ5Ye65Y+RQ29udGVudExvYWRlZOS6i+S7tlxuICAgIGlmIChkb2NTdGF0ZSA9PT0gXCJpbnRlcmFjdGl2ZVwiKSB7XG4gICAgICBvbkRvbUNvbnRlbnRMb2FkZWQoKVxuICAgIH1cbiAgICBpZiAoZG9jW3N0ckFkZEV2ZW50TGlzdGVuZXJdKSB7XG4gICAgICBsb2coXCJjdXJyZW50IHJlYWR5U3RhdGUgXCIgKyBkb2MucmVhZHlTdGF0ZSArIFwiLCBleGVjIGRhdGVUaW1lIDpcIiArIG5ldyBEYXRlKCkgKiAxKVxuICAgICAgZG9jW3N0ckFkZEV2ZW50TGlzdGVuZXJdKFwiRE9NQ29udGVudExvYWRlZFwiLCBvbkRvbUNvbnRlbnRMb2FkZWQsIGZhbHNlKVxuICAgICAgd2luW3N0ckFkZEV2ZW50TGlzdGVuZXJdKFwibG9hZFwiLCBvbkxvYWRlZCwgZmFsc2UpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZyhcImllOmN1cnJlbnQgcmVhZHlTdGF0ZSBcIiArIGRvYy5yZWFkeVN0YXRlICsgXCIsIGV4ZWMgZGF0ZVRpbWUgOlwiICsgbmV3IERhdGUoKSAqIDEpXG4gICAgICBkb2Nbc3RyQXR0YWNoRXZlbnRdKFwib25yZWFkeXN0YXRlY2hhbmdlXCIsIG9uUmVhZHlTdGF0ZUNoYW5nZWRDb21wbGV0ZSlcbiAgICAgIHdpbltzdHJBdHRhY2hFdmVudF0oXCJvbmxvYWRcIiwgb25Mb2FkZWQpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGRvU2Nyb2xs5Yik5pataWU2LTjnmoRET03mmK/lkKbliqDovb3lrozmiJBcbiAgICogaWXnibnmnInnmoRkb1Njcm9sbOaWueazlVxuICAgKiDlvZPpobXpnaJET03mnKrliqDovb3lrozmiJDml7bvvIzosIPnlKhkb1Njcm9sbOaWueazleaXtu+8jOWwseS8muaKpemUmVxuICAgKiDlj43ov4fmnaXvvIzlj6ropoHkuIDnm7Tpl7TpmpTosIPnlKhkb1Njcm9sbOebtOWIsOS4jeaKpemUmVxuICAgKiDpgqPlsLHooajnpLrpobXpnaJET03liqDovb3lrozmr5XkuobjgIJcbiAgICovXG4gIHRyeSB7XG4gICAgaWUgPSB3aW5kb3cuZnJhbWVFbGVtZW50ID09IG51bGwgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG4gIH0gY2F0Y2ggKGVycikge1xuXG4gIH1cblxuICBmdW5jdGlvbiBpZUNvbnRlbnRMb2FkZWQgKCkge1xuICAgIGlmICghZG9tQ29udGVudExvYWRlZCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWUuZG9TY3JvbGwoXCJsZWZ0XCIpXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoaWVDb250ZW50TG9hZGVkLCA1MClcbiAgICAgIH1cbiAgICAgIGRvbUNvbnRlbnRMb2FkZWQgPSB0cnVlXG4gICAgICBvbkRvbUNvbnRlbnRMb2FkZWQoKVxuICAgIH1cbiAgfVxuXG4gIGlmIChpZSAmJiBpZS5kb1Njcm9sbCkge1xuICAgIGllQ29udGVudExvYWRlZCgpXG4gIH1cbn1cbiIsIi8qXG4gKiBAQXV0aG9yOiBqaWFuZ2ZlbmdcbiAqIEBEYXRlOiAyMDE3LTA4LTIyIDE1OjAyOjMyXG4gKiBATGFzdCBNb2RpZmllZCBieTogamlhbmdmZW5nXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE4LTAzLTAxIDE2OjQ0OjQ3XG4gKi9cblxudmFyIGRvbUhlbHBlciA9IHJlcXVpcmUoXCIuLi9kb21cIilcbnZhciB3aW4gPSB3aW5kb3dcbnZhciBkb2MgPSB3aW4uZG9jdW1lbnRcblxuLyoqXG4gKiDojrflj5blvZPliY3ml7bpl7TmiLNcbiAqXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBnZXRDdXJyZW50VGltZSAoKSB7XG4gIHJldHVybiBuZXcgRGF0ZSgpICogMVxufVxuXG4vKipcbiAqIOiOt+WPlummluWxj+aXtumXtFxuICpcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIGZpcnN0U2NyZWVuICgpIHtcbiAgdmFyIG9uSW1nTG9hZGVkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIGlmICh0aGF0LnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHRoYXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgb25JbWdMb2FkZWQsIGZhbHNlKVxuICAgIH1cbiAgICBmaXJzdFNjcmVlbkltZ3MucHVzaCh7XG4gICAgICBpbWc6IHRoaXMsXG4gICAgICB0aW1lOiBnZXRDdXJyZW50VGltZSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBpbWdzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbWdcIilcbiAgdmFyIGZpcnN0U2NyZWVuVGltZSA9IGdldEN1cnJlbnRUaW1lKClcbiAgdmFyIGZpcnN0U2NyZWVuSW1ncyA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaW1ncy5sZW5ndGg7IGkrKykge1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaW1nID0gaW1nc1tpXVxuICAgICAgaWYgKGltZy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICFpbWcuY29tcGxldGUgJiYgaW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIG9uSW1nTG9hZGVkLCBmYWxzZSlcbiAgICAgIH0gZWxzZSBpZiAoaW1nLmF0dGFjaEV2ZW50KSB7XG4gICAgICAgIGltZy5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKGltZy5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIpIHtcbiAgICAgICAgICAgIG9uSW1nTG9hZGVkLmNhbGwoaW1nLCBvbkltZ0xvYWRlZClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSkoKVxuICB9XG5cbiAgLyoqXG4gICAqIOiOt+WPlummluWxj+aXtumXtFxuICAgKlxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Rmlyc3RTY3JlZW5UaW1lICgpIHtcbiAgICB2YXIgc2ggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaXJzdFNjcmVlbkltZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gZmlyc3RTY3JlZW5JbWdzW2ldXG4gICAgICB2YXIgaW1nID0gaXRlbVtcImltZ1wiXVxuICAgICAgdmFyIHRpbWUgPSBpdGVtW1widGltZVwiXVxuICAgICAgdmFyIHRvcCA9IGRvbUhlbHBlci5nZXREb21PZmZzZXQoaW1nKS50b3BcbiAgICAgIGlmICh0b3AgPiAwICYmIHRvcCA8IHNoKSB7XG4gICAgICAgIGZpcnN0U2NyZWVuVGltZSA9IHRpbWUgPiBmaXJzdFNjcmVlblRpbWUgPyB0aW1lIDogZmlyc3RTY3JlZW5UaW1lXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaXJzdFNjcmVlblRpbWVcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0Rmlyc3RTY3JlZW5UaW1lOiBnZXRGaXJzdFNjcmVlblRpbWVcbiAgfVxufVxuXG4vKipcbiAqIOiOt+WPlumhtemdouW8gOWni+WKoOi9vURPTeeahOaXtumXtO+8jOWNs+WPr+S7peiOt+WPluWvueW6lOeahOmhtemdoueZveWxj+aXtumXtFxuICpcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIGRvbUxvYWRpbmcgKCkge1xuICAvKiBlc2xpbnQtZGlzYWJsZWQgbm8tbXVsdGktc3RyICovXG5cbiAgdmFyIGMgPSBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKVxuICBjLmlkID0gXCJyeC1cIiArIG5ldyBEYXRlKCkgKiAxXG4gIGMudGV4dCA9IFwid2luZG93LiQkcnhBcG1Eb21Mb2FkaW5nU3RhcnRUaW1lPW5ldyBEYXRlKCkgKiAxO1xcXG4gICAgICAgICAgICB2YXIgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdcIiArIGMuaWQgKyBcIicpOyBcXFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5yZW1vdmVDaGlsZChzKTtcIlxuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQoYylcblxuICBmdW5jdGlvbiBnZXREb21Mb2FkaW5nU3RhcnRUaW1lICgpIHtcbiAgICB2YXIgdGltZSA9IHdpbmRvdy4kJHJ4QXBtRG9tTG9hZGluZ1N0YXJ0VGltZVxuICAgIHRyeSB7XG4gICAgICBkZWxldGUgd2luZG93LiQkcnhBcG1Eb21Mb2FkaW5nU3RhcnRUaW1lXG4gICAgfSBjYXRjaCAoZXgpIHtcblxuICAgIH1cblxuICAgIHJldHVybiB0aW1lXG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXREb21Mb2FkaW5nU3RhcnRUaW1lOiBnZXREb21Mb2FkaW5nU3RhcnRUaW1lXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldEN1cnJlbnRUaW1lOiBnZXRDdXJyZW50VGltZSxcbiAgZG9tTG9hZGluZzogZG9tTG9hZGluZyxcbiAgZmlyc3RTY3JlZW46IGZpcnN0U2NyZWVuXG59XG4iLCIvKlxuICogQEF1dGhvcjogamlhbmdmZW5nXG4gKiBARGF0ZTogMjAxNy0wOC0yMiAxNTowMjo0MFxuICogQExhc3QgTW9kaWZpZWQgYnk6IGppYW5nZmVuZ1xuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxOC0wMy0wMSAxNjo0OTozNFxuICovXG5cbnZhciBoZWFkZXJMaW5rc1xudmFyIGhlYWRlclNjcmlwdHNcbnZhciByZXNvdXJjZXNcbnZhciB3aW4gPSB3aW5kb3dcbnZhciBkb2MgPSB3aW4uZG9jdW1lbnRcbnZhciB3aW5QZXJmb3JtYW5jZSA9IHdpbi5wZXJmb3JtYW5jZVxudmFyIGxpbmtzID0ge31cblxuLyoqXG4gKiDojrflj5bnmb3lsY/ml7bpl7RcbiAqXG4gKiBAcmV0dXJucyDov5Tlm57nmb3lsY/ml7bpl7Tlr7nosaHvvIzpmYTluKbkuoZIZWFkZXLpgqPnmoTmiYDmnInpnZnmgIHotYTmupDor7fmsYJcbiAqL1xuZnVuY3Rpb24gZ2V0V3JpdGVTY3JlZW5UaW1lU3BhbiAoKSB7XG4gIC8vIHZhciBpbmRleCA9IDBcbiAgLy8gdmFyIHJlc291cmNlTGVudGggPSAwXG4gIHZhciB3cml0ZVNjcmVlblRpbWUgPSAwXG4gIGlmICh3aW5QZXJmb3JtYW5jZSAmJiBkb2MucXVlcnlTZWxlY3RvckFsbCAmJiB3aW5QZXJmb3JtYW5jZS5nZXRFbnRyaWVzQnlUeXBlKSB7XG4gICAgd3JpdGVTY3JlZW5UaW1lID0gd2luUGVyZm9ybWFuY2UudGltaW5nLmRvbUxvYWRpbmdcbiAgICAvLyBoZWFkZXJMaW5rcyA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKFwiaGVhZD5saW5rXCIpXG4gICAgLy8gaGVhZGVyU2NyaXB0cyA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKFwiaGVhZD5zY3JpcHRcIilcbiAgICAvLyBmb3IgKHZhciBpdGVtIGluIGhlYWRlckxpbmtzKSB7XG4gICAgLy8gICBpZiAoaGVhZGVyTGlua3NbaXRlbV0uaHJlZiAhPT0gXCJcIiAmJiB2b2lkIDAgIT09IGhlYWRlckxpbmtzW2l0ZW1dLmhyZWYpIHtcbiAgICAvLyAgICAgbGlua3NbdW5lc2NhcGUoaGVhZGVyTGlua3NbaXRlbV0uaHJlZildID0gMVxuICAgIC8vICAgfVxuICAgIC8vIH1cbiAgICAvLyBmb3IgKGl0ZW0gaW4gaGVhZGVyU2NyaXB0cykge1xuICAgIC8vICAgaWYgKGhlYWRlclNjcmlwdHNbaXRlbV0uc3JjICE9PSBcIlwiICYmIHZvaWQgMCAhPT0gaGVhZGVyU2NyaXB0c1tpdGVtXS5zcmMgJiYgaGVhZGVyU2NyaXB0c1tpdGVtXS5hc3luYyAhPT0gMSkge1xuICAgIC8vICAgICBsaW5rc1t1bmVzY2FwZShoZWFkZXJTY3JpcHRzW2l0ZW1dLnNyYyldID0gMVxuICAgIC8vICAgfVxuICAgIC8vIH1cbiAgICAvLyByZXNvdXJjZUxlbnRoICs9IGhlYWRlckxpbmtzLmxlbmd0aFxuICAgIC8vIHJlc291cmNlTGVudGggKz0gaGVhZGVyU2NyaXB0cy5sZW5ndGhcbiAgICAvLyByZXNvdXJjZXMgPSB3aW5QZXJmb3JtYW5jZS5nZXRFbnRyaWVzQnlUeXBlKFwicmVzb3VyY2VcIilcbiAgICAvLyAvLyDkuLrku4DkuYjopoHnlKgyKnJlc291cmNlTGVuZ3Ro5ZGi77yfXG4gICAgLy8gaWYgKDIgKiByZXNvdXJjZUxlbnRoID4gcmVzb3VyY2VzLmxlbmd0aCkge1xuICAgIC8vICAgcmVzb3VyY2VMZW50aCA9IHJlc291cmNlcy5sZW5ndGhcbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgcmVzb3VyY2VMZW50aCArPSByZXNvdXJjZUxlbnRoXG4gICAgLy8gfVxuXG4gICAgLy8gZm9yIChpbmRleDsgcmVzb3VyY2VMZW50aCA+PSBpbmRleDsgaW5kZXgrKykge1xuICAgIC8vICAgaWYgKHJlc291cmNlc1tpbmRleF0gJiZcbiAgICAvLyAgICAgbGlua3NbdW5lc2NhcGUocmVzb3VyY2VzW2luZGV4XS5uYW1lKV0gPT09IDEgJiZcbiAgICAvLyAgICAgcmVzb3VyY2VzW2luZGV4XS5yZXNwb25zZUVuZCA+IDAgJiZcbiAgICAvLyAgICAgcmVzb3VyY2VzW2luZGV4XS5yZXNwb25zZUVuZCArIHdpblBlcmZvcm1hbmNlLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnQgPj0gd3JpdGVTY3JlZW5UaW1lKSB7XG4gICAgLy8gICAgIHdyaXRlU2NyZWVuVGltZSA9IHJlc291cmNlc1tpbmRleF0ucmVzcG9uc2VFbmQgKyB3aW5QZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0XG4gICAgLy8gICB9XG4gICAgLy8gfVxuXG4gICAgd3JpdGVTY3JlZW5UaW1lIC09IHdpblBlcmZvcm1hbmNlLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnRcbiAgICByZXR1cm4gcGFyc2VJbnQod3JpdGVTY3JlZW5UaW1lKVxuICAgIC8qIHJldHVybiB7XG4gICAgICBmZWVsVGltZTogcGFyc2VJbnQoZiksXG4gICAgICBoZWFkVXJsOiBsaW5rc1xuICAgIH0gKi9cbiAgfVxufVxuXG4vKipcbiAqIOiOt+WPluaAp+iDveaMh+agh+aVsOaNrlxuICpcbiAqL1xuZnVuY3Rpb24gZ2V0U3RhcnRUaW1lICgpIHtcbiAgcmV0dXJuIG51bGxcbn1cbi8qKlxuICog6I635Y+W6ZO+5o6l57G75Z6LXG4gKlxuICogQHJldHVybnMg6L+U5Zue5YC877yIYmx1ZXRvb3RoL2NlbGx1bGFyL2V0aGVybmV0L25vbmUvd2lmaS93aW1heC9vdGhlci91bmtub3du77yJXG4gKi9cbmZ1bmN0aW9uIGdldFN5c0Nvbm5lY3Rpb25UeXBlICgpIHtcbiAgcmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3IuY29ubmVjdGlvbiA/IHdpbmRvdy5uYXZpZ2F0b3IuY29ubmVjdGlvbi50eXBlICsgXCJcIiA6IFwiXCJcbn1cblxuLyoqXG4gKiDojrflj5ZETlPlr7vlnYDmiafooYznmoTml7bpl7TvvIzlj6rog73pgJrov4fmjIflrprmtY/op4jlmajnmoTnibnmgKfmlK/mjIFcbiAqXG4gKiBAcmV0dXJucyDlpoLmnpzniYjmnKzpq5jvvIzliJnov5Tlm57lr7nlupTnmoRETlPlr7vlnYDml7bpl7TvvIzlpoLmnpzniYjmnKzkvY7vvIzliJnov5Tlm551bmRlZmluZWRcbiAqL1xuZnVuY3Rpb24gZ2V0RE5TVGltZVNwYW4gKCkge1xuICBpZiAod2luZG93LnBlcmZvcm1hbmNlKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5wZXJmb3JtYW5jZS50aW1pbmcuZG9tYWluTG9va3VwRW5kIC0gd2luZG93LnBlcmZvcm1hbmNlLnRpbWluZy5kb21haW5Mb29rdXBTdGFydFxuICB9XG4gIHJldHVybiB2b2lkIDBcbn1cblxuLyoqXG4gKiDojrflj5ZUQ1DmiafooYzml7bpl7TvvIzlj6rog73pgJrov4fmjIflrprmtY/op4jlmajnmoTnibnmgKfmlK/mjIFcbiAqXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBnZXRUQ1BUaW1lU3BhbiAoKSB7XG4gIGlmICh3aW5kb3cucGVyZm9ybWFuY2UpIHtcbiAgICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlLnRpbWluZy5jb25uZWN0RW5kIC0gd2luZG93LnBlcmZvcm1hbmNlLnRpbWluZy5jb25uZWN0U3RhcnRcbiAgfVxuICByZXR1cm4gdm9pZCAwXG59XG5cbi8qKlxuICog6I635Y+WRG9t5Yqg6L295a6M5q+V55qE5pe26Ze077yM6auY54mI5pys55u05o6l6YCa6L+HZG9tQ29udGVudExvYWRlZEV2ZW50U3RhcnTkuI5uYXZpZ2F0aW9uU3RhcnTnmoTlt67lgLzov5vooYzorqHnrpdcbiAqXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBnZXREb21SZWFkeVRpbWVTcGFuICgpIHtcbiAgaWYgKHdpbmRvdy5wZXJmb3JtYW5jZSkge1xuICAgIHJldHVybiB3aW5kb3cucGVyZm9ybWFuY2UudGltaW5nLmRvbUNvbnRlbnRMb2FkZWRFdmVudFN0YXJ0IC0gd2luZG93LnBlcmZvcm1hbmNlLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnRcbiAgfVxuICByZXR1cm4gdm9pZCAwXG59XG5cbi8qKlxuICog6I635Y+W6aG16Z2i5Yqg6L295a6M5oiQ55qE5pe26Ze077yM6auY54mI5pys55u05o6l6YCa6L+HbG9hZEV2ZW50U3RhcnTkuI5uYXZpZ2F0aW9uU3RhcnTnmoTlt67lgLzlgZrorqHnrpdcbiAqXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBnZXRQYWdlUmVhZHlUaW1lU3BhbiAoKSB7XG4gIGlmICh3aW5kb3cucGVyZm9ybWFuY2UpIHtcbiAgICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlLnRpbWluZy5sb2FkRXZlbnRTdGFydCAtIHdpbmRvdy5wZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0XG4gIH1cbiAgcmV0dXJuIHZvaWQgMFxufVxuXG4vKipcbiAqIOiOt+WPlumdmeaAgei1hOa6kOaVsOmHj++8jOmrmOeJiOacrOebtOaOpemAmui/h2dldEVudHJpZXNCeVR5cGUoXCJyZXNvdXJjZVwiKeiOt+WPluaVsOmHj1xuICpcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIGdldFJlc291cmNlQ291bnQgKCkge1xuICBpZiAod2luZG93LnBlcmZvcm1hbmNlLmdldEVudHJpZXNCeVR5cGUgJiYgdHlwZW9mIHdpbmRvdy5wZXJmb3JtYW5jZS5nZXRFbnRyaWVzQnlUeXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlLmdldEVudHJpZXNCeVR5cGUoXCJyZXNvdXJjZVwiKS5sZW5ndGhcbiAgfVxuICByZXR1cm4gdm9pZCAwXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRXcml0ZVNjcmVlblRpbWVTcGFuOiBnZXRXcml0ZVNjcmVlblRpbWVTcGFuLFxuICBnZXRTdGFydFRpbWU6IGdldFN0YXJ0VGltZSxcbiAgZ2V0U3lzQ29ubmVjdGlvblR5cGU6IGdldFN5c0Nvbm5lY3Rpb25UeXBlLFxuICBnZXRETlNUaW1lU3BhbjogZ2V0RE5TVGltZVNwYW4sXG4gIGdldFRDUFRpbWVTcGFuOiBnZXRUQ1BUaW1lU3BhbixcbiAgZ2V0RG9tUmVhZHlUaW1lU3BhbjogZ2V0RG9tUmVhZHlUaW1lU3BhbixcbiAgZ2V0UGFnZVJlYWR5VGltZVNwYW46IGdldFBhZ2VSZWFkeVRpbWVTcGFuLFxuICBnZXRSZXNvdXJjZUNvdW50OiBnZXRSZXNvdXJjZUNvdW50XG59XG4iLCIvKlxuICogQEF1dGhvcjogamlhbmdmZW5nXG4gKiBARGF0ZTogMjAxNy0wOC0yMiAxNTowMjo1M1xuICogQExhc3QgTW9kaWZpZWQgYnk6IGppYW5nZmVuZ1xuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxOC0wMi0yOCAyMToyMDoyMlxuICovXG5cbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnXCIpXG52YXIgY29tbW9uID0gcmVxdWlyZShcIi4uL2NvbW1vblwiKVxudmFyIGNvbnN0cyA9IHJlcXVpcmUoXCIuLi9jb25zdHNcIilcbnZhciBsb2cgPSByZXF1aXJlKFwiLi4vbG9nXCIpXG52YXIgVGhyaWZ0ID0gcmVxdWlyZShcIi4uL3RocmlmdFwiKVxudmFyIGtlcGxlciA9IHJlcXVpcmUoXCIuLi9rZXBsZXJcIilcblxuZnVuY3Rpb24gc2VyaWFsaXplIChlbnRpdHksIG9iaikge1xuICBlbnRpdHkuYWdlbnRJZCA9IGNvbmZpZy5hZ2VudElkXG4gIGVudGl0eS50aWVySWQgPSBjb25maWcudGllcklkXG4gIGVudGl0eS5hcHBJZCA9IGNvbmZpZy5hcHBJZFxuICBlbnRpdHkudHJhY2VJZCA9IGNvbW1vbi5VVUlEKClcbiAgZW50aXR5LnVybERvbWFpbiA9IGRvY3VtZW50LmRvbWFpbiB8fCB3aW5kb3cubG9jYXRpb24uaG9zdFxuICBlbnRpdHkucmVwb3J0VGltZSA9IG5ldyBEYXRlKCkgKiAxXG4gIGVudGl0eS5maXJzdFNjcmVlblRpbWUgPSBvYmouZmlyc3RTY3JlZW5cbiAgZW50aXR5LndoaXRlU2NyZWVuVGltZSA9IG9iai5kb21Mb2FkaW5nXG4gIGVudGl0eS5vcGVyYWJsZVRpbWUgPSBvYmouZG9tQ29udGVudFxuICBlbnRpdHkucmVzb3VyY2VMb2FkZWRUaW1lID0gb2JqLm9uTG9hZFxuICBlbnRpdHkubG9hZGVkVGltZSA9IG9iai5vbkxvYWRcbiAgZW50aXR5LmJyb3dzZXIgPSBvYmouYnJvd3NlclxuICBlbnRpdHkudXJsUXVlcnkgPSBvYmoucGFnZV91cmxfcGF0aFxuXG4gIGVudGl0eS5iYWNrdXBQcm9wZXJ0aWVzID0ge1xuICAgIFwib3NcIjogb2JqLm9zLFxuICAgIFwib3NfdmVyc2lvblwiOiBvYmoub3NfdmVyc2lvbixcbiAgICBcImRldmljZVwiOiBvYmouZGV2aWNlLFxuICAgIFwiZGV2aWNlX3ZlcnNpb25cIjogb2JqLmRldmljZV92ZXJzaW9uLFxuICAgIFwiYnJvd3Nlcl9lbmdpbmVcIjogb2JqLmJyb3dzZXJfZW5naW5lLFxuICAgIFwicGFnZV90aXRsZVwiOiBvYmoucGFnZV90aXRsZSxcbiAgICBcInBhZ2VfaDFcIjogb2JqLnBhZ2VfaDEsXG4gICAgXCJwYWdlX3JlZmVycmVyXCI6IG9iai5wYWdlX3JlZmVycmVyLFxuICAgIFwicGFnZV91cmxcIjogb2JqLnBhZ2VfdXJsLFxuICAgIFwibGliXCI6IG9iai5saWIsXG4gICAgXCJsaWJfdmVyc2lvblwiOiBvYmoubGliX3ZlcnNpb24sXG4gICAgXCJicm93c2VyX3ZlcnNpb25cIjogb2JqLmJyb3dzZXJfdmVyc2lvblxuICB9XG5cbiAgZW50aXR5LmJhY2t1cFF1b3RhID0ge1xuICAgIFwiZG5zXCI6IG9iai5kbnMsXG4gICAgXCJ0Y3BcIjogb2JqLnRjcCxcbiAgICBcInNjcmVlbl9oZWlnaHRcIjogb2JqLnNjcmVlbl9oZWlnaHQsXG4gICAgXCJzY3JlZW5fd2lkdGhcIjogb2JqLnNjcmVlbl93aWR0aFxuICB9XG59XG5cbmZ1bmN0aW9uIHNlbmRQZXJmb3JtYW5jZXMgKHBlcmZvcm1hbmNlcykge1xuICBsb2coXCJwZXJmb3JtYW5jZSByZXNvdXJjZSBkYXRhOlwiKVxuICBsb2coSlNPTi5zdHJpbmdpZnkocGVyZm9ybWFuY2VzLCBudWxsLCAyKSlcbiAgdmFyIHRyYW5zcG9ydCA9IG5ldyBUaHJpZnQuVHJhbnNwb3J0KFwiXCIpXG4gIHZhciBwcm90b2NvbCA9IG5ldyBUaHJpZnQuUHJvdG9jb2wodHJhbnNwb3J0KVxuICB2YXIgZW50aXR5ID0gbmV3IGtlcGxlci5UV2ViQWdlbnRMb2FkKHBlcmZvcm1hbmNlcylcbiAgc2VyaWFsaXplKGVudGl0eSwgcGVyZm9ybWFuY2VzKVxuXG4gIHByb3RvY29sLndyaXRlTWVzc2FnZUJlZ2luKFwiVFdlYkFnZW50TG9hZEJhdGNoXCIsIFRocmlmdC5NZXNzYWdlVHlwZS5DQUxMLCAwKVxuICB2YXIgcGF0Y2ggPSBuZXcga2VwbGVyLlRXZWJBZ2VudExvYWRCYXRjaCh7XG4gICAgbG9hZEJhdGNoOiBbZW50aXR5XVxuICB9KVxuICAvLyBsb2coXCJwZXJmb3JtYW5jZSBqc29uIGRhdGE6XCIpXG4gIC8vIGxvZyhKU09OLnN0cmluZ2lmeShwYXRjaCwgbnVsbCwgMikpXG4gIHBhdGNoLndyaXRlKHByb3RvY29sKVxuICBwcm90b2NvbC53cml0ZU1lc3NhZ2VFbmQoKVxuICB2YXIgc2VuZFZhbHVlID0gdHJhbnNwb3J0LmZsdXNoKClcbiAgdmFyIHggPSBKU09OLnBhcnNlKHNlbmRWYWx1ZSlcbiAgc2VuZFZhbHVlID0gSlNPTi5zdHJpbmdpZnkoeFt4Lmxlbmd0aCAtIDFdKVxuICBsb2coXCJwZXJmb3JtYW5jZSB0aHJpZnQgZGF0YTpcIilcbiAgbG9nKHNlbmRWYWx1ZSlcbiAgdmFyIG9wdGlvbnMgPSB7XG4gICAgdXJsOiBjb25maWcuYXBpSG9zdCxcbiAgICB0eXBlOiBcInBvc3RcIixcbiAgICBjb3JzOiB0cnVlLFxuICAgIGRhdGE6IHNlbmRWYWx1ZSxcbiAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgbG9nKFwi5oCn6IO95pWw5o2u5bey5Y+R6YCBXCIpXG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24gKHhocikge1xuICAgICAgbG9nKFwi5oCn6IO95pWw5o2u5Y+R6YCB5aSx6LSlXCIpXG4gICAgICBsb2coeGhyLnN0YXR1cylcbiAgICAgIGxvZyh4aHIuc3RhdHVzVGV4dClcbiAgICB9LFxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBsb2coXCLkuovku7blj5HpgIHlrozmr5UuXCIpXG4gICAgfVxuICB9XG5cbiAgb3B0aW9ucy5oZWFkZXIgPSB7fVxuICBvcHRpb25zLmhlYWRlcltjb25zdHMua2VwbGVyX21lc3NhZ2VfdHlwZV0gPSBjb25zdHMuV0VCX0xPQURfQkFUQ0hcbiAgb3B0aW9ucy5oZWFkZXJbY29uc3RzLmtlcGxlcl9hZ2VudF90b2tlbl0gPSBjb25maWcuYWdlbnRJZFxuICBvcHRpb25zLmhlYWRlcltjb25zdHMua2VwbGVyX2NvbmZpZ192ZXJzaW9uXSA9IGNvbmZpZy5MSUJfVkVSU0lPTlxuICBpZiAoIWNvbmZpZy5kaXNhYmxlZCkge1xuICAgIGNvbW1vbi5hamF4KG9wdGlvbnMpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNlbmRQZXJmb3JtYW5jZXM6IHNlbmRQZXJmb3JtYW5jZXNcbn1cbiIsInZhciBjb25maWcgPSByZXF1aXJlKFwiLi9jb25maWdcIilcbnZhciBjb21tb24gPSByZXF1aXJlKFwiLi9jb21tb25cIilcbnZhciBKU09OID0gcmVxdWlyZShcIi4vanNvblwiKVxuXG52YXIgTElCX0tFWSA9IGNvbmZpZy5MSUJfS0VZXG52YXIgc2Vzc2lvblN0YXRlID0ge31cbnZhciBzZXNzaW9uID0ge1xuICBnZXRJZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBzZXNzaW9uU3RhdGUuaWRcbiAgfSxcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkcyA9IGNvbW1vbi5jb29raWUuZ2V0KExJQl9LRVkgKyBcInNlc3Npb25cIilcbiAgICB2YXIgc3RhdGUgPSBudWxsXG4gICAgaWYgKGRzICE9PSBudWxsICYmICh0eXBlb2YgKHN0YXRlID0gSlNPTi5wYXJzZShkcykpID09PSBcIm9iamVjdFwiKSkge1xuICAgICAgc2Vzc2lvblN0YXRlID0gc3RhdGVcbiAgICB9XG4gIH0sXG4gIGdldDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICByZXR1cm4gbmFtZSA/IHNlc3Npb25TdGF0ZVtuYW1lXSA6IHNlc3Npb25TdGF0ZVxuICB9LFxuICBzZXQ6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgIHNlc3Npb25TdGF0ZVtuYW1lXSA9IHZhbHVlXG4gICAgdGhpcy5zYXZlKClcbiAgfSxcbiAgc2V0T25jZTogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKCEobmFtZSBpbiBzZXNzaW9uU3RhdGUpKSB7XG4gICAgICB0aGlzLnNldChuYW1lLCB2YWx1ZSlcbiAgICB9XG4gIH0sXG4gIGNoYW5nZTogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgc2Vzc2lvblN0YXRlW25hbWVdID0gdmFsdWVcbiAgfSxcbiAgc2F2ZTogZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgaWYgKHByb3BzKSB7XG4gICAgICBzZXNzaW9uU3RhdGUgPSBwcm9wc1xuICAgIH1cbiAgICBjb21tb24uY29va2llLnNldChMSUJfS0VZICsgXCJzZXNzaW9uXCIsIEpTT04uc3RyaW5naWZ5KHNlc3Npb25TdGF0ZSksIDAsIGNvbmZpZy5jcm9zc1N1YkRvbWFpbilcbiAgfSxcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkcyA9IGNvbW1vbi5jb29raWUuZ2V0KExJQl9LRVkgKyBcImpzc2RrXCIpXG4gICAgdmFyIGNzID0gY29tbW9uLmNvb2tpZS5nZXQoTElCX0tFWSArIFwianNzZGtjcm9zc1wiKVxuICAgIHZhciBjcm9zcyA9IG51bGxcbiAgICBpZiAoY29uZmlnLmNyb3NzU3ViRG9tYWluKSB7XG4gICAgICBjcm9zcyA9IGNzXG4gICAgICBpZiAoZHMgIT09IG51bGwpIHtcbiAgICAgICAgY29tbW9uLmxvZyhcIuWcqOagueWfn+S4lOWtkOWfn+acieWAvO+8jOWIoOmZpOWtkOWfn+eahGNvb2tpZVwiKVxuICAgICAgICAvLyDlpoLmnpzmmK/moLnln5/nmoTvvIzliKDpmaTku6XliY3orr7nva7lnKjlrZDln5/nmoRcbiAgICAgICAgY29tbW9uLmNvb2tpZS5yZW1vdmUoTElCX0tFWSArIFwianNzZGtcIiwgZmFsc2UpXG4gICAgICAgIGNvbW1vbi5jb29raWUucmVtb3ZlKExJQl9LRVkgKyBcImpzc2RrXCIsIHRydWUpXG4gICAgICB9XG4gICAgICBpZiAoY3Jvc3MgPT09IG51bGwgJiYgZHMgIT09IG51bGwpIHtcbiAgICAgICAgY29tbW9uLmxvZyhcIuWcqOagueWfn+S4lOagueWfn+ayoeWAvO+8jOWtkOWfn+acieWAvO+8jOagueWfn++8neWtkOWfn+eahOWAvFwiLCBkcylcbiAgICAgICAgY3Jvc3MgPSBkc1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb21tb24ubG9nKFwi5Zyo5a2Q5Z+fXCIpXG4gICAgICBjcm9zcyA9IGRzXG4gICAgfVxuICAgIHRoaXMuaW5pdFNlc3Npb25TdGF0ZSgpXG4gICAgaWYgKGNyb3NzICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnRvU3RhdGUoY3Jvc3MpXG4gICAgICAvLyDlpoLmnpzmmK/moLnln5/kuJTmoLnln5/msqHlgLxcbiAgICAgIGlmIChjb25maWcuY3Jvc3NTdWJEb21haW4gJiYgY3MgPT09IG51bGwpIHtcbiAgICAgICAgY29tbW9uLmxvZyhcIuWcqOagueWfn+S4lOagueWfn+ayoeWAvO+8jOS/neWtmOW9k+WJjeWAvOWIsGNvb2tpZeS4rVwiKVxuICAgICAgICB0aGlzLnNhdmUoKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb21tb24ubG9nKFwi5rKh5pyJ5YC877yMc2V05YC8XCIpXG4gICAgICB0aGlzLnNldChcInVuaXF1ZUlkXCIsIGNvbW1vbi5VVUlEKCkpXG4gICAgfVxuICAgIC8vIOeUn+aIkOacrOasoeWbnuivneeahFNlc3Npb25JRFxuICAgIHRoaXMuc2V0T25jZShcImlkXCIsIGNvbW1vbi5VVUlEKCkpXG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXREZXZpY2VJZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZS51bmlxdWVJZFxuICB9LFxuICBnZXRTZXNzaW9uSWQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2Vzc2lvblN0YXRlLnNlc3Npb25JZFxuICB9LFxuICBnZXREb21haW46IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZG9tYWluID0gdGhpcy5fc3RhdGUuZG9tYWluXG4gICAgaWYgKCFkb21haW4pIHtcbiAgICAgIGRvbWFpbiA9IGRvY3VtZW50LmRvbWFpbiB8fCB3aW5kb3cubG9jYXRpb24uaG9zdFxuICAgICAgdGhpcy5zZXRPbmNlKFwiZG9tYWluXCIsIGRvbWFpbilcbiAgICB9XG4gICAgcmV0dXJuIGRvbWFpblxuICB9LFxuICB0b1N0YXRlOiBmdW5jdGlvbiAoZHMpIHtcbiAgICB2YXIgc3RhdGUgPSBudWxsXG4gICAgaWYgKGRzICE9PSBudWxsICYmICh0eXBlb2YgKHN0YXRlID0gSlNPTi5wYXJzZShkcykpID09PSBcIm9iamVjdFwiKSkge1xuICAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZVxuICAgIH1cbiAgfSxcbiAgaW5pdFNlc3Npb25TdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkcyA9IGNvbW1vbi5jb29raWUuZ2V0KExJQl9LRVkgKyBcInNlc3Npb25cIilcbiAgICB2YXIgc3RhdGUgPSBudWxsXG4gICAgaWYgKGRzICE9PSBudWxsICYmICh0eXBlb2YgKHN0YXRlID0gSlNPTi5wYXJzZShkcykpID09PSBcIm9iamVjdFwiKSkge1xuICAgICAgdGhpcy5fc2Vzc2lvblN0YXRlID0gc3RhdGVcbiAgICB9XG4gIH0sXG4gIGdldDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICByZXR1cm4gbmFtZSA/IHRoaXMuX3N0YXRlW25hbWVdIDogdGhpcy5fc3RhdGVcbiAgfSxcbiAgZ2V0U2Vzc2lvbjogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICByZXR1cm4gbmFtZSA/IHRoaXMuX3Nlc3Npb25TdGF0ZVtuYW1lXSA6IHRoaXMuX3Nlc3Npb25TdGF0ZVxuICB9LFxuICBzZXQ6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgIHRoaXMuX3N0YXRlW25hbWVdID0gdmFsdWVcbiAgICB0aGlzLnNhdmUoKVxuICB9LFxuICBzZXRPbmNlOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoIShuYW1lIGluIHRoaXMuX3N0YXRlKSkge1xuICAgICAgdGhpcy5zZXQobmFtZSwgdmFsdWUpXG4gICAgfVxuICB9LFxuICBzZXRTZXNzaW9uOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLl9zZXNzaW9uU3RhdGVbbmFtZV0gPSB2YWx1ZVxuICAgIHRoaXMuc2Vzc2lvblNhdmUoKVxuICB9LFxuICBzZXRTZXNzaW9uT25jZTogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKCEobmFtZSBpbiB0aGlzLl9zZXNzaW9uU3RhdGUpKSB7XG4gICAgICB0aGlzLnNldFNlc3Npb24obmFtZSwgdmFsdWUpXG4gICAgfVxuICB9LFxuICAvLyDpkojlr7nlvZPliY3pobXpnaLkv67mlLlcbiAgY2hhbmdlOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLl9zdGF0ZVtuYW1lXSA9IHZhbHVlXG4gIH0sXG4gIHNlc3Npb25DaGFuZ2U6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgIHRoaXMuX3Nlc3Npb25TdGF0ZVtuYW1lXSA9IHZhbHVlXG4gIH0sXG4gIHNldFNlc3Npb25Qcm9wczogZnVuY3Rpb24gKG5ld3ApIHtcbiAgICB0aGlzLl9zZXRTZXNzaW9uUHJvcHMoXCJwcm9wc1wiLCBuZXdwKVxuICB9LFxuICBzZXRTZXNzaW9uUHJvcHNPbmNlOiBmdW5jdGlvbiAobmV3cCkge1xuICAgIHRoaXMuX3NldFNlc3Npb25Qcm9wc09uY2UoXCJwcm9wc1wiLCBuZXdwKVxuICB9LFxuICBzZXRTZXNzaW9uU3ViamVjdDogZnVuY3Rpb24gKG5ld3ApIHtcbiAgICB0aGlzLl9zZXRTZXNzaW9uUHJvcHMoXCJzdWJqZWN0XCIsIG5ld3ApXG4gIH0sXG4gIHNldFNlc3Npb25TdWJqZWN0T25jZTogZnVuY3Rpb24gKG5ld3ApIHtcbiAgICB0aGlzLl9zZXRTZXNzaW9uUHJvcHNPbmNlKFwic3ViamVjdFwiLCBuZXdwKVxuICB9LFxuICBjbGVhclNlc3Npb25TdWJqZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fc2Vzc2lvblN0YXRlLnN1YmplY3QgPSB7fVxuICAgIHRoaXMuc2Vzc2lvblNhdmUoKVxuICB9LFxuICBzZXRTZXNzaW9uT2JqZWN0OiBmdW5jdGlvbiAobmV3cCkge1xuICAgIHRoaXMuX3NldFNlc3Npb25Qcm9wcyhcIm9iamVjdFwiLCBuZXdwKVxuICB9LFxuICBzZXRTZXNzaW9uT2JqZWN0T25jZTogZnVuY3Rpb24gKG5ld3ApIHtcbiAgICB0aGlzLl9zZXRTZXNzaW9uUHJvcHNPbmNlKFwib2JqZWN0XCIsIG5ld3ApXG4gIH0sXG4gIGNsZWFyU2Vzc2lvbk9iamVjdDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX3Nlc3Npb25TdGF0ZS5vYmplY3QgPSB7fVxuICAgIHRoaXMuc2Vzc2lvblNhdmUoKVxuICB9LFxuICBzZXRQcm9wczogZnVuY3Rpb24gKG5ld3ApIHtcbiAgICB0aGlzLl9zZXRQcm9wcyhcInByb3BzXCIsIG5ld3ApXG4gIH0sXG4gIHNldFByb3BzT25jZTogZnVuY3Rpb24gKG5ld3ApIHtcbiAgICB0aGlzLl9zZXRQcm9wc09uY2UoXCJwcm9wc1wiLCBuZXdwKVxuICB9LFxuICBzZXRTdWJqZWN0OiBmdW5jdGlvbiAobmV3cCkge1xuICAgIHRoaXMuX3NldFByb3BzKFwic3ViamVjdFwiLCBuZXdwKVxuICB9LFxuICBzZXRTdWJqZWN0T25jZTogZnVuY3Rpb24gKG5ld3ApIHtcbiAgICB0aGlzLl9zZXRQcm9wc09uY2UoXCJzdWJqZWN0XCIsIG5ld3ApXG4gIH0sXG4gIGNsZWFyU3ViamVjdDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX3N0YXRlLnN1YmplY3QgPSB7fVxuICAgIHRoaXMuc2F2ZSgpXG4gIH0sXG4gIHNldE9iamVjdDogZnVuY3Rpb24gKG5ld3ApIHtcbiAgICB0aGlzLl9zZXRQcm9wcyhcInN1YmplY3RcIiwgbmV3cClcbiAgfSxcbiAgc2V0T2JqZWN0T25jZTogZnVuY3Rpb24gKG5ld3ApIHtcbiAgICB0aGlzLl9zZXRQcm9wc09uY2UoXCJzdWJqZWN0XCIsIG5ld3ApXG4gIH0sXG4gIGNsZWFyT2JqZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fc3RhdGUub2JqZWN0ID0ge31cbiAgICB0aGlzLnNhdmUoKVxuICB9LFxuICBfc2V0UHJvcHM6IGZ1bmN0aW9uIChvYmpOYW1lLCBuZXdwKSB7XG4gICAgdmFyIG9iaiA9IHRoaXMuX3N0YXRlW29iak5hbWVdIHx8IHt9XG4gICAgY29tbW9uLmV4dGVuZChvYmosIG5ld3ApXG4gICAgdGhpcy5zZXQob2JqTmFtZSwgb2JqKVxuICB9LFxuICBfc2V0UHJvcHNPbmNlOiBmdW5jdGlvbiAob2JqTmFtZSwgbmV3cCkge1xuICAgIHZhciBvYmogPSB0aGlzLl9zdGF0ZVtvYmpOYW1lXSB8fCB7fVxuICAgIGNvbW1vbi5jb3ZlckV4dGVuZChvYmosIG5ld3ApXG4gICAgdGhpcy5zZXQob2JqTmFtZSwgb2JqKVxuICB9LFxuICBfc2V0U2Vzc2lvblByb3BzOiBmdW5jdGlvbiAob2JqTmFtZSwgbmV3cCkge1xuICAgIHZhciBvYmogPSB0aGlzLl9zZXNzaW9uU3RhdGVbb2JqTmFtZV0gfHwge31cbiAgICBjb21tb24uZXh0ZW5kKG9iaiwgbmV3cClcbiAgICB0aGlzLnNldFNlc3Npb24ob2JqTmFtZSwgb2JqKVxuICB9LFxuICBfc2V0U2Vzc2lvblByb3BzT25jZTogZnVuY3Rpb24gKG9iak5hbWUsIG5ld3ApIHtcbiAgICB2YXIgb2JqID0gdGhpcy5fc2Vzc2lvblN0YXRlW29iak5hbWVdIHx8IHt9XG4gICAgY29tbW9uLmNvdmVyRXh0ZW5kKG9iaiwgbmV3cClcbiAgICB0aGlzLnNldFNlc3Npb24ob2JqTmFtZSwgb2JqKVxuICB9LFxuICBzZXNzaW9uU2F2ZTogZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgaWYgKHByb3BzKSB7XG4gICAgICB0aGlzLl9zZXNzaW9uU3RhdGUgPSBwcm9wc1xuICAgIH1cbiAgICBjb21tb24uY29va2llLnNldChMSUJfS0VZICsgXCJzZXNzaW9uXCIsIEpTT04uc3RyaW5naWZ5KHRoaXMuX3Nlc3Npb25TdGF0ZSksIDAsIGNvbmZpZy5jcm9zc1N1YkRvbWFpbilcbiAgfSxcbiAgc2F2ZTogZnVuY3Rpb24gKCkge1xuICAgIGlmIChjb25maWcuY3Jvc3NTdWJEb21haW4pIHtcbiAgICAgIGNvbW1vbi5jb29raWUuc2V0KExJQl9LRVkgKyBcImpzc2RrY3Jvc3NcIiwgSlNPTi5zdHJpbmdpZnkodGhpcy5fc3RhdGUpLCB0aGlzLl9zdGF0ZVtcImV4cGlyZXNcIl0gfHwgNzMwLCB0cnVlKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb21tb24uY29va2llLnNldChMSUJfS0VZICsgXCJqc3Nka1wiLCBKU09OLnN0cmluZ2lmeSh0aGlzLl9zdGF0ZSksIHRoaXMuX3N0YXRlW1wiZXhwaXJlc1wiXSB8fCA3MzAsIGZhbHNlKVxuICAgIH1cbiAgfSxcbiAgX3Nlc3Npb25TdGF0ZToge1xuICAgIHByb3BzOiB7fSxcbiAgICBzdWJqZWN0OiB7fSxcbiAgICBvYmplY3Q6IHt9XG4gIH0sXG4gIF9zdGF0ZToge1xuICAgIHByb3BzOiB7fSxcbiAgICBzdWJqZWN0OiB7fSxcbiAgICBvYmplY3Q6IHt9XG4gIH0sXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZHMgPSBjb21tb24uY29va2llLmdldChMSUJfS0VZICsgXCJqc3Nka1wiKVxuICAgIHZhciBjcyA9IGNvbW1vbi5jb29raWUuZ2V0KExJQl9LRVkgKyBcImpzc2RrY3Jvc3NcIilcbiAgICB2YXIgY3Jvc3MgPSBudWxsXG4gICAgaWYgKGNvbmZpZy5jcm9zc1N1YkRvbWFpbikge1xuICAgICAgY3Jvc3MgPSBjc1xuICAgICAgaWYgKGRzICE9PSBudWxsKSB7XG4gICAgICAgIGNvbW1vbi5sb2coXCLlnKjmoLnln5/kuJTlrZDln5/mnInlgLzvvIzliKDpmaTlrZDln5/nmoRjb29raWVcIilcbiAgICAgICAgLy8g5aaC5p6c5piv5qC55Z+f55qE77yM5Yig6Zmk5Lul5YmN6K6+572u5Zyo5a2Q5Z+f55qEXG4gICAgICAgIGNvbW1vbi5jb29raWUucmVtb3ZlKExJQl9LRVkgKyBcImpzc2RrXCIsIGZhbHNlKVxuICAgICAgICBjb21tb24uY29va2llLnJlbW92ZShMSUJfS0VZICsgXCJqc3Nka1wiLCB0cnVlKVxuICAgICAgfVxuICAgICAgaWYgKGNyb3NzID09PSBudWxsICYmIGRzICE9PSBudWxsKSB7XG4gICAgICAgIGNvbW1vbi5sb2coXCLlnKjmoLnln5/kuJTmoLnln5/msqHlgLzvvIzlrZDln5/mnInlgLzvvIzmoLnln5/vvJ3lrZDln5/nmoTlgLxcIiwgZHMpXG4gICAgICAgIGNyb3NzID0gZHNcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29tbW9uLmxvZyhcIuWcqOWtkOWfn1wiKVxuICAgICAgY3Jvc3MgPSBkc1xuICAgIH1cbiAgICB0aGlzLmluaXRTZXNzaW9uU3RhdGUoKVxuICAgIGlmIChjcm9zcyAhPT0gbnVsbCkge1xuICAgICAgdGhpcy50b1N0YXRlKGNyb3NzKVxuICAgICAgLy8g5aaC5p6c5piv5qC55Z+f5LiU5qC55Z+f5rKh5YC8XG4gICAgICBpZiAoY29uZmlnLmNyb3NzU3ViRG9tYWluICYmIGNzID09PSBudWxsKSB7XG4gICAgICAgIGNvbW1vbi5sb2coXCLlnKjmoLnln5/kuJTmoLnln5/msqHlgLzvvIzkv53lrZjlvZPliY3lgLzliLBjb29raWXkuK1cIilcbiAgICAgICAgdGhpcy5zYXZlKClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29tbW9uLmxvZyhcIuayoeacieWAvO+8jHNldOWAvFwiKVxuICAgICAgdGhpcy5zZXQoXCJ1bmlxdWVJZFwiLCBjb21tb24uVVVJRCgpKVxuICAgIH1cbiAgICAvLyDnlJ/miJDmnKzmrKHlm57or53nmoRTZXNzaW9uSURcbiAgICB0aGlzLnNldFNlc3Npb25PbmNlKFwic2Vzc2lvbklkXCIsIGNvbW1vbi5VVUlEKCkpXG4gIH1cbn1cbiIsIi8qXG4gKiBMaWNlbnNlZCB0byB0aGUgQXBhY2hlIFNvZnR3YXJlIEZvdW5kYXRpb24gKEFTRikgdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZVxuICogZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb25cbiAqIHJlZ2FyZGluZyBjb3B5cmlnaHQgb3duZXJzaGlwLiBUaGUgQVNGIGxpY2Vuc2VzIHRoaXMgZmlsZVxuICogdG8geW91IHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZVxuICogXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlXG4gKiB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qIGpzaGludCBldmlsOnRydWUgKi9cblxuLyoqXG4gKiBUaGUgVGhyaWZ0IG5hbWVzcGFjZSBob3VzZXMgdGhlIEFwYWNoZSBUaHJpZnQgSmF2YVNjcmlwdCBsaWJyYXJ5XG4gKiBlbGVtZW50cyBwcm92aWRpbmcgSmF2YVNjcmlwdCBiaW5kaW5ncyBmb3IgdGhlIEFwYWNoZSBUaHJpZnQgUlBDXG4gKiBzeXN0ZW0uIEVuZCB1c2VycyB3aWxsIHR5cGljYWxseSBvbmx5IGRpcmVjdGx5IG1ha2UgdXNlIG9mIHRoZVxuICogVHJhbnNwb3J0IChUWEhSVHJhbnNwb3J0L1RXZWJTb2NrZXRUcmFuc3BvcnQpIGFuZCBQcm90b2NvbFxuICogKFRKU09OUFJvdG9jb2wvVEJpbmFyeVByb3RvY29sKSBjb25zdHJ1Y3RvcnMuXG4gKlxuICogT2JqZWN0IG1ldGhvZHMgYmVnaW5uaW5nIHdpdGggYSBfXyAoZS5nLiBfX29uT3BlbigpKSBhcmUgaW50ZXJuYWxcbiAqIGFuZCBzaG91bGQgbm90IGJlIGNhbGxlZCBvdXRzaWRlIG9mIHRoZSBvYmplY3QncyBvd24gbWV0aG9kcy5cbiAqXG4gKiBUaGlzIGxpYnJhcnkgY3JlYXRlcyBvbmUgZ2xvYmFsIG9iamVjdDogVGhyaWZ0XG4gKiBDb2RlIGluIHRoaXMgbGlicmFyeSBtdXN0IG5ldmVyIGNyZWF0ZSBhZGRpdGlvbmFsIGdsb2JhbCBpZGVudGlmaWVycyxcbiAqIGFsbCBmZWF0dXJlcyBtdXN0IGJlIHNjb3BlZCB3aXRoaW4gdGhlIFRocmlmdCBuYW1lc3BhY2UuXG4gKiBAbmFtZXNwYWNlXG4gKiBAZXhhbXBsZVxuICogICAgIHZhciB0cmFuc3BvcnQgPSBuZXcgVGhyaWZ0LlRyYW5zcG9ydCgnaHR0cDovL2xvY2FsaG9zdDo4NTg1Jyk7XG4gKiAgICAgdmFyIHByb3RvY29sICA9IG5ldyBUaHJpZnQuUHJvdG9jb2wodHJhbnNwb3J0KTtcbiAqICAgICB2YXIgY2xpZW50ID0gbmV3IE15VGhyaWZ0U3ZjQ2xpZW50KHByb3RvY29sKTtcbiAqICAgICB2YXIgcmVzdWx0ID0gY2xpZW50Lk15TWV0aG9kKCk7XG4gKi9cbnZhciBUaHJpZnQgPSB7XG4gIC8qKlxuICAgKiBUaHJpZnQgSmF2YVNjcmlwdCBsaWJyYXJ5IHZlcnNpb24uXG4gICAqIEByZWFkb25seVxuICAgKiBAY29uc3Qge3N0cmluZ30gVmVyc2lvblxuICAgKiBAbWVtYmVyb2YgVGhyaWZ0XG4gICAqL1xuICBWZXJzaW9uOiBcIjEuMC4wLWRldlwiLFxuXG4gIC8qKlxuICAgKiBUaHJpZnQgSURMIHR5cGUgc3RyaW5nIHRvIElkIG1hcHBpbmcuXG4gICAqIEByZWFkb25seVxuICAgKiBAcHJvcGVydHkge251bWJlcn0gIFNUT1AgICAtIEVuZCBvZiBhIHNldCBvZiBmaWVsZHMuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSAgVk9JRCAgIC0gTm8gdmFsdWUgKG9ubHkgbGVnYWwgZm9yIHJldHVybiB0eXBlcykuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSAgQk9PTCAgIC0gVHJ1ZS9GYWxzZSBpbnRlZ2VyLlxuICAgKiBAcHJvcGVydHkge251bWJlcn0gIEJZVEUgICAtIFNpZ25lZCA4IGJpdCBpbnRlZ2VyLlxuICAgKiBAcHJvcGVydHkge251bWJlcn0gIEkwOCAgICAtIFNpZ25lZCA4IGJpdCBpbnRlZ2VyLlxuICAgKiBAcHJvcGVydHkge251bWJlcn0gIERPVUJMRSAtIDY0IGJpdCBJRUVFIDg1NCBmbG9hdGluZyBwb2ludC5cbiAgICogQHByb3BlcnR5IHtudW1iZXJ9ICBJMTYgICAgLSBTaWduZWQgMTYgYml0IGludGVnZXIuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSAgSTMyICAgIC0gU2lnbmVkIDMyIGJpdCBpbnRlZ2VyLlxuICAgKiBAcHJvcGVydHkge251bWJlcn0gIEk2NCAgICAtIFNpZ25lZCA2NCBiaXQgaW50ZWdlci5cbiAgICogQHByb3BlcnR5IHtudW1iZXJ9ICBTVFJJTkcgLSBBcnJheSBvZiBieXRlcyByZXByZXNlbnRpbmcgYSBzdHJpbmcgb2YgY2hhcmFjdGVycy5cbiAgICogQHByb3BlcnR5IHtudW1iZXJ9ICBVVEY3ICAgLSBBcnJheSBvZiBieXRlcyByZXByZXNlbnRpbmcgYSBzdHJpbmcgb2YgVVRGNyBlbmNvZGVkIGNoYXJhY3RlcnMuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSAgU1RSVUNUIC0gQSBtdWx0aWZpZWxkIHR5cGUuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSAgTUFQICAgIC0gQSBjb2xsZWN0aW9uIHR5cGUgKG1hcC9hc3NvY2lhdGl2ZS1hcnJheS9kaWN0aW9uYXJ5KS5cbiAgICogQHByb3BlcnR5IHtudW1iZXJ9ICBTRVQgICAgLSBBIGNvbGxlY3Rpb24gdHlwZSAodW5vcmRlcmVkIGFuZCB3aXRob3V0IHJlcGVhdGVkIHZhbHVlcykuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSAgTElTVCAgIC0gQSBjb2xsZWN0aW9uIHR5cGUgKHVub3JkZXJlZCkuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSAgVVRGOCAgIC0gQXJyYXkgb2YgYnl0ZXMgcmVwcmVzZW50aW5nIGEgc3RyaW5nIG9mIFVURjggZW5jb2RlZCBjaGFyYWN0ZXJzLlxuICAgKiBAcHJvcGVydHkge251bWJlcn0gIFVURjE2ICAtIEFycmF5IG9mIGJ5dGVzIHJlcHJlc2VudGluZyBhIHN0cmluZyBvZiBVVEYxNiBlbmNvZGVkIGNoYXJhY3RlcnMuXG4gICAqL1xuICBUeXBlOiB7XG4gICAgU1RPUDogMCxcbiAgICBWT0lEOiAxLFxuICAgIEJPT0w6IDIsXG4gICAgQllURTogMyxcbiAgICBJMDg6IDMsXG4gICAgRE9VQkxFOiA0LFxuICAgIEkxNjogNixcbiAgICBJMzI6IDgsXG4gICAgSTY0OiAxMCxcbiAgICBTVFJJTkc6IDExLFxuICAgIFVURjc6IDExLFxuICAgIFNUUlVDVDogMTIsXG4gICAgTUFQOiAxMyxcbiAgICBTRVQ6IDE0LFxuICAgIExJU1Q6IDE1LFxuICAgIFVURjg6IDE2LFxuICAgIFVURjE2OiAxN1xuICB9LFxuXG4gIC8qKlxuICAgKiBUaHJpZnQgUlBDIG1lc3NhZ2UgdHlwZSBzdHJpbmcgdG8gSWQgbWFwcGluZy5cbiAgICogQHJlYWRvbmx5XG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSAgQ0FMTCAgICAgIC0gUlBDIGNhbGwgc2VudCBmcm9tIGNsaWVudCB0byBzZXJ2ZXIuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSAgUkVQTFkgICAgIC0gUlBDIGNhbGwgbm9ybWFsIHJlc3BvbnNlIGZyb20gc2VydmVyIHRvIGNsaWVudC5cbiAgICogQHByb3BlcnR5IHtudW1iZXJ9ICBFWENFUFRJT04gLSBSUEMgY2FsbCBleGNlcHRpb24gcmVzcG9uc2UgZnJvbSBzZXJ2ZXIgdG8gY2xpZW50LlxuICAgKiBAcHJvcGVydHkge251bWJlcn0gIE9ORVdBWSAgICAtIE9uZXdheSBSUEMgY2FsbCBmcm9tIGNsaWVudCB0byBzZXJ2ZXIgd2l0aCBubyByZXNwb25zZS5cbiAgICovXG4gIE1lc3NhZ2VUeXBlOiB7XG4gICAgQ0FMTDogMSxcbiAgICBSRVBMWTogMixcbiAgICBFWENFUFRJT046IDMsXG4gICAgT05FV0FZOiA0XG4gIH0sXG5cbiAgLyoqXG4gICAqIFV0aWxpdHkgZnVuY3Rpb24gcmV0dXJuaW5nIHRoZSBjb3VudCBvZiBhbiBvYmplY3QncyBvd24gcHJvcGVydGllcy5cbiAgICogQHBhcmFtIHtvYmplY3R9IG9iaiAtIE9iamVjdCB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBudW1iZXIgb2Ygb2JqZWN0J3Mgb3duIHByb3BlcnRpZXNcbiAgICovXG4gIG9iamVjdExlbmd0aDogZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciBsZW5ndGggPSAwXG4gICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgbGVuZ3RoKytcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxlbmd0aFxuICB9LFxuXG4gIC8qKlxuICAgKiBVdGlsaXR5IGZ1bmN0aW9uIHRvIGVzdGFibGlzaCBwcm90b3R5cGUgaW5oZXJpdGFuY2UuXG4gICAqIEBzZWUge0BsaW5rIGh0dHA6Ly9qYXZhc2NyaXB0LmNyb2NrZm9yZC5jb20vcHJvdG90eXBhbC5odG1sfFByb3RvdHlwYWwgSW5oZXJpdGFuY2V9XG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbnN0cnVjdG9yIC0gQ29udHN0cnVjdG9yIGZ1bmN0aW9uIHRvIHNldCBhcyBkZXJpdmVkLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckNvbnN0cnVjdG9yIC0gQ29udHN0cnVjdG9yIGZ1bmN0aW9uIHRvIHNldCBhcyBiYXNlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW25hbWVdIC0gVHlwZSBuYW1lIHRvIHNldCBhcyBuYW1lIHByb3BlcnR5IGluIGRlcml2ZWQgcHJvdG90eXBlLlxuICAgKi9cbiAgaW5oZXJpdHM6IGZ1bmN0aW9uIChjb25zdHJ1Y3Rvciwgc3VwZXJDb25zdHJ1Y3RvciwgbmFtZSkge1xuICAgIGZ1bmN0aW9uIEYgKCkge31cbiAgICBGLnByb3RvdHlwZSA9IHN1cGVyQ29uc3RydWN0b3IucHJvdG90eXBlXG4gICAgY29uc3RydWN0b3IucHJvdG90eXBlID0gbmV3IEYoKVxuICAgIGNvbnN0cnVjdG9yLnByb3RvdHlwZS5uYW1lID0gbmFtZSB8fCBcIlwiXG4gIH1cbn1cblxuLyoqXG4qIEluaXRpYWxpemVzIGEgVGhyaWZ0IFRFeGNlcHRpb24gaW5zdGFuY2UuXG4qIEBjb25zdHJ1Y3RvclxuKiBAYXVnbWVudHMgRXJyb3JcbiogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSBUaGUgVEV4Y2VwdGlvbiBtZXNzYWdlIChkaXN0aW5jdCBmcm9tIHRoZSBFcnJvciBtZXNzYWdlKS5cbiogQGNsYXNzZGVzYyBURXhjZXB0aW9uIGlzIHRoZSBiYXNlIGNsYXNzIGZvciBhbGwgVGhyaWZ0IGV4Y2VwdGlvbnMgdHlwZXMuXG4qL1xuVGhyaWZ0LlRFeGNlcHRpb24gPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlXG59XG5UaHJpZnQuaW5oZXJpdHMoVGhyaWZ0LlRFeGNlcHRpb24sIEVycm9yLCBcIlRFeGNlcHRpb25cIilcblxuLyoqXG4qIFJldHVybnMgdGhlIG1lc3NhZ2Ugc2V0IG9uIHRoZSBleGNlcHRpb24uXG4qIEByZWFkb25seVxuKiBAcmV0dXJucyB7c3RyaW5nfSBleGNlcHRpb24gbWVzc2FnZVxuKi9cblRocmlmdC5URXhjZXB0aW9uLnByb3RvdHlwZS5nZXRNZXNzYWdlID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5tZXNzYWdlXG59XG5cbi8qKlxuKiBUaHJpZnQgQXBwbGljYXRpb24gRXhjZXB0aW9uIHR5cGUgc3RyaW5nIHRvIElkIG1hcHBpbmcuXG4qIEByZWFkb25seVxuKiBAcHJvcGVydHkge251bWJlcn0gIFVOS05PV04gICAgICAgICAgICAgICAgIC0gVW5rbm93bi91bmRlZmluZWQuXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSAgVU5LTk9XTl9NRVRIT0QgICAgICAgICAgLSBDbGllbnQgYXR0ZW1wdGVkIHRvIGNhbGwgYSBtZXRob2QgdW5rbm93biB0byB0aGUgc2VydmVyLlxuKiBAcHJvcGVydHkge251bWJlcn0gIElOVkFMSURfTUVTU0FHRV9UWVBFICAgIC0gQ2xpZW50IHBhc3NlZCBhbiB1bmtub3duL3Vuc3VwcG9ydGVkIE1lc3NhZ2VUeXBlLlxuKiBAcHJvcGVydHkge251bWJlcn0gIFdST05HX01FVEhPRF9OQU1FICAgICAgIC0gVW51c2VkLlxuKiBAcHJvcGVydHkge251bWJlcn0gIEJBRF9TRVFVRU5DRV9JRCAgICAgICAgIC0gVW51c2VkIGluIFRocmlmdCBSUEMsIHVzZWQgdG8gZmxhZyBwcm9wcmlldGFyeSBzZXF1ZW5jZSBudW1iZXIgZXJyb3JzLlxuKiBAcHJvcGVydHkge251bWJlcn0gIE1JU1NJTkdfUkVTVUxUICAgICAgICAgIC0gUmFpc2VkIGJ5IGEgc2VydmVyIHByb2Nlc3NvciBpZiBhIGhhbmRsZXIgZmFpbHMgdG8gc3VwcGx5IHRoZSByZXF1aXJlZCByZXR1cm4gcmVzdWx0LlxuKiBAcHJvcGVydHkge251bWJlcn0gIElOVEVSTkFMX0VSUk9SICAgICAgICAgIC0gU29tZXRoaW5nIGJhZCBoYXBwZW5lZC5cbiogQHByb3BlcnR5IHtudW1iZXJ9ICBQUk9UT0NPTF9FUlJPUiAgICAgICAgICAtIFRoZSBwcm90b2NvbCBsYXllciBmYWlsZWQgdG8gc2VyaWFsaXplIG9yIGRlc2VyaWFsaXplIGRhdGEuXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSAgSU5WQUxJRF9UUkFOU0ZPUk0gICAgICAgLSBVbnVzZWQuXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSAgSU5WQUxJRF9QUk9UT0NPTCAgICAgICAgLSBUaGUgcHJvdG9jb2wgKG9yIHZlcnNpb24pIGlzIG5vdCBzdXBwb3J0ZWQuXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSAgVU5TVVBQT1JURURfQ0xJRU5UX1RZUEUgLSBVbnVzZWQuXG4qL1xuVGhyaWZ0LlRBcHBsaWNhdGlvbkV4Y2VwdGlvblR5cGUgPSB7XG4gIFVOS05PV046IDAsXG4gIFVOS05PV05fTUVUSE9EOiAxLFxuICBJTlZBTElEX01FU1NBR0VfVFlQRTogMixcbiAgV1JPTkdfTUVUSE9EX05BTUU6IDMsXG4gIEJBRF9TRVFVRU5DRV9JRDogNCxcbiAgTUlTU0lOR19SRVNVTFQ6IDUsXG4gIElOVEVSTkFMX0VSUk9SOiA2LFxuICBQUk9UT0NPTF9FUlJPUjogNyxcbiAgSU5WQUxJRF9UUkFOU0ZPUk06IDgsXG4gIElOVkFMSURfUFJPVE9DT0w6IDksXG4gIFVOU1VQUE9SVEVEX0NMSUVOVF9UWVBFOiAxMFxufVxuXG4vKipcbiogSW5pdGlhbGl6ZXMgYSBUaHJpZnQgVEFwcGxpY2F0aW9uRXhjZXB0aW9uIGluc3RhbmNlLlxuKiBAY29uc3RydWN0b3JcbiogQGF1Z21lbnRzIFRocmlmdC5URXhjZXB0aW9uXG4qIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gVGhlIFRBcHBsaWNhdGlvbkV4Y2VwdGlvbiBtZXNzYWdlIChkaXN0aW5jdCBmcm9tIHRoZSBFcnJvciBtZXNzYWdlKS5cbiogQHBhcmFtIHtUaHJpZnQuVEFwcGxpY2F0aW9uRXhjZXB0aW9uVHlwZX0gW2NvZGVdIC0gVGhlIFRBcHBsaWNhdGlvbkV4Y2VwdGlvblR5cGUgY29kZS5cbiogQGNsYXNzZGVzYyBUQXBwbGljYXRpb25FeGNlcHRpb24gaXMgdGhlIGV4Y2VwdGlvbiBjbGFzcyB1c2VkIHRvIHByb3BhZ2F0ZSBleGNlcHRpb25zIGZyb20gYW4gUlBDIHNlcnZlciBiYWNrIHRvIGEgY2FsbGluZyBjbGllbnQuXG4qL1xuVGhyaWZ0LlRBcHBsaWNhdGlvbkV4Y2VwdGlvbiA9IGZ1bmN0aW9uIChtZXNzYWdlLCBjb2RlKSB7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2VcbiAgdGhpcy5jb2RlID0gdHlwZW9mIGNvZGUgPT09IFwibnVtYmVyXCIgPyBjb2RlIDogMFxufVxuVGhyaWZ0LmluaGVyaXRzKFRocmlmdC5UQXBwbGljYXRpb25FeGNlcHRpb24sIFRocmlmdC5URXhjZXB0aW9uLCBcIlRBcHBsaWNhdGlvbkV4Y2VwdGlvblwiKVxuXG4vKipcbiogUmVhZCBhIFRBcHBsaWNhdGlvbkV4Y2VwdGlvbiBmcm9tIHRoZSBzdXBwbGllZCBwcm90b2NvbC5cbiogQHBhcmFtIHtvYmplY3R9IGlucHV0IC0gVGhlIGlucHV0IHByb3RvY29sIHRvIHJlYWQgZnJvbS5cbiovXG5UaHJpZnQuVEFwcGxpY2F0aW9uRXhjZXB0aW9uLnByb3RvdHlwZS5yZWFkID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gIHdoaWxlICgxKSB7XG4gICAgdmFyIHJldCA9IGlucHV0LnJlYWRGaWVsZEJlZ2luKClcblxuICAgIGlmIChyZXQuZnR5cGUgPT0gVGhyaWZ0LlR5cGUuU1RPUCkge1xuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICB2YXIgZmlkID0gcmV0LmZpZFxuXG4gICAgc3dpdGNoIChmaWQpIHtcbiAgICBjYXNlIDE6XG4gICAgICBpZiAocmV0LmZ0eXBlID09IFRocmlmdC5UeXBlLlNUUklORykge1xuICAgICAgICByZXQgPSBpbnB1dC5yZWFkU3RyaW5nKClcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gcmV0LnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXQgPSBpbnB1dC5za2lwKHJldC5mdHlwZSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAyOlxuICAgICAgaWYgKHJldC5mdHlwZSA9PSBUaHJpZnQuVHlwZS5JMzIpIHtcbiAgICAgICAgcmV0ID0gaW5wdXQucmVhZEkzMigpXG4gICAgICAgIHRoaXMuY29kZSA9IHJldC52YWx1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0ID0gaW5wdXQuc2tpcChyZXQuZnR5cGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXQgPSBpbnB1dC5za2lwKHJldC5mdHlwZSlcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgaW5wdXQucmVhZEZpZWxkRW5kKClcbiAgfVxuXG4gIGlucHV0LnJlYWRTdHJ1Y3RFbmQoKVxufVxuXG4vKipcbiogV2l0ZSBhIFRBcHBsaWNhdGlvbkV4Y2VwdGlvbiB0byB0aGUgc3VwcGxpZWQgcHJvdG9jb2wuXG4qIEBwYXJhbSB7b2JqZWN0fSBvdXRwdXQgLSBUaGUgb3V0cHV0IHByb3RvY29sIHRvIHdyaXRlIHRvLlxuKi9cblRocmlmdC5UQXBwbGljYXRpb25FeGNlcHRpb24ucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKG91dHB1dCkge1xuICBvdXRwdXQud3JpdGVTdHJ1Y3RCZWdpbihcIlRBcHBsaWNhdGlvbkV4Y2VwdGlvblwiKVxuXG4gIGlmICh0aGlzLm1lc3NhZ2UpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwibWVzc2FnZVwiLCBUaHJpZnQuVHlwZS5TVFJJTkcsIDEpXG4gICAgb3V0cHV0LndyaXRlU3RyaW5nKHRoaXMuZ2V0TWVzc2FnZSgpKVxuICAgIG91dHB1dC53cml0ZUZpZWxkRW5kKClcbiAgfVxuXG4gIGlmICh0aGlzLmNvZGUpIHtcbiAgICBvdXRwdXQud3JpdGVGaWVsZEJlZ2luKFwidHlwZVwiLCBUaHJpZnQuVHlwZS5JMzIsIDIpXG4gICAgb3V0cHV0LndyaXRlSTMyKHRoaXMuY29kZSlcbiAgICBvdXRwdXQud3JpdGVGaWVsZEVuZCgpXG4gIH1cblxuICBvdXRwdXQud3JpdGVGaWVsZFN0b3AoKVxuICBvdXRwdXQud3JpdGVTdHJ1Y3RFbmQoKVxufVxuXG4vKipcbiogUmV0dXJucyB0aGUgYXBwbGljYXRpb24gZXhjZXB0aW9uIGNvZGUgc2V0IG9uIHRoZSBleGNlcHRpb24uXG4qIEByZWFkb25seVxuKiBAcmV0dXJucyB7VGhyaWZ0LlRBcHBsaWNhdGlvbkV4Y2VwdGlvblR5cGV9IGV4Y2VwdGlvbiBjb2RlXG4qL1xuVGhyaWZ0LlRBcHBsaWNhdGlvbkV4Y2VwdGlvbi5wcm90b3R5cGUuZ2V0Q29kZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuY29kZVxufVxuXG5UaHJpZnQuVFByb3RvY29sRXhjZXB0aW9uVHlwZSA9IHtcbiAgVU5LTk9XTjogMCxcbiAgSU5WQUxJRF9EQVRBOiAxLFxuICBORUdBVElWRV9TSVpFOiAyLFxuICBTSVpFX0xJTUlUOiAzLFxuICBCQURfVkVSU0lPTjogNCxcbiAgTk9UX0lNUExFTUVOVEVEOiA1LFxuICBERVBUSF9MSU1JVDogNlxufVxuXG5UaHJpZnQuVFByb3RvY29sRXhjZXB0aW9uID0gZnVuY3Rpb24gVFByb3RvY29sRXhjZXB0aW9uICh0eXBlLCBtZXNzYWdlKSB7XG4gIEVycm9yLmNhbGwodGhpcylcbiAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3RvcilcbiAgdGhpcy5uYW1lID0gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lXG4gIHRoaXMudHlwZSA9IHR5cGVcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxufVxuVGhyaWZ0LmluaGVyaXRzKFRocmlmdC5UUHJvdG9jb2xFeGNlcHRpb24sIFRocmlmdC5URXhjZXB0aW9uLCBcIlRQcm90b2NvbEV4Y2VwdGlvblwiKVxuXG4vKipcbiogQ29uc3RydWN0b3IgRnVuY3Rpb24gZm9yIHRoZSBYSFIgdHJhbnNwb3J0LlxuKiBJZiB5b3UgZG8gbm90IHNwZWNpZnkgYSB1cmwgdGhlbiB5b3UgbXVzdCBoYW5kbGUgWEhSIG9wZXJhdGlvbnMgb25cbiogeW91ciBvd24uIFRoaXMgdHlwZSBjYW4gYWxzbyBiZSBjb25zdHJ1Y3RlZCB1c2luZyB0aGUgVHJhbnNwb3J0IGFsaWFzXG4qIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LlxuKiBAY29uc3RydWN0b3JcbiogQHBhcmFtIHtzdHJpbmd9IFt1cmxdIC0gVGhlIFVSTCB0byBjb25uZWN0IHRvLlxuKiBAY2xhc3NkZXNjIFRoZSBBcGFjaGUgVGhyaWZ0IFRyYW5zcG9ydCBsYXllciBwZXJmb3JtcyBieXRlIGxldmVsIEkvT1xuKiBiZXR3ZWVuIFJQQyBjbGllbnRzIGFuZCBzZXJ2ZXJzLiBUaGUgSmF2YVNjcmlwdCBUWEhSVHJhbnNwb3J0IG9iamVjdFxuKiB1c2VzIEh0dHBbc10vWEhSLiBUYXJnZXQgc2VydmVycyBtdXN0IGltcGxlbWVudCB0aGUgaHR0cFtzXSB0cmFuc3BvcnRcbiogKHNlZTogbm9kZS5qcyBleGFtcGxlIHNlcnZlcl9odHRwLmpzKS5cbiogQGV4YW1wbGVcbiogICAgIHZhciB0cmFuc3BvcnQgPSBuZXcgVGhyaWZ0LlRYSFJUcmFuc3BvcnQoXCJodHRwOi8vbG9jYWxob3N0Ojg1ODVcIik7XG4qL1xuVGhyaWZ0LlRyYW5zcG9ydCA9IFRocmlmdC5UWEhSVHJhbnNwb3J0ID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICB0aGlzLnVybCA9IHVybFxuICB0aGlzLndwb3MgPSAwXG4gIHRoaXMucnBvcyA9IDBcbiAgdGhpcy51c2VDT1JTID0gKG9wdGlvbnMgJiYgb3B0aW9ucy51c2VDT1JTKVxuICB0aGlzLmN1c3RvbUhlYWRlcnMgPSBvcHRpb25zID8gKG9wdGlvbnMuY3VzdG9tSGVhZGVycyA/IG9wdGlvbnMuY3VzdG9tSGVhZGVycyA6IHt9KSA6IHt9XG4gIHRoaXMuc2VuZF9idWYgPSBcIlwiXG4gIHRoaXMucmVjdl9idWYgPSBcIlwiXG59XG5cblRocmlmdC5UWEhSVHJhbnNwb3J0LnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gICAqIEdldHMgdGhlIGJyb3dzZXIgc3BlY2lmaWMgWG1sSHR0cFJlcXVlc3QgT2JqZWN0LlxuICAgKiBAcmV0dXJucyB7b2JqZWN0fSB0aGUgYnJvd3NlciBYSFIgaW50ZXJmYWNlIG9iamVjdFxuICAgKi9cbiAgZ2V0WG1sSHR0cFJlcXVlc3RPYmplY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICB0cnkgeyByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgfSBjYXRjaCAoZTEpIHsgfVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdChcIk1zeG1sMi5YTUxIVFRQXCIpIH0gY2F0Y2ggKGUyKSB7IH1cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MSFRUUFwiKSB9IGNhdGNoIChlMykgeyB9XG5cbiAgICB0aHJvdyBcIllvdXIgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgWEhSLlwiXG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmRzIHRoZSBjdXJyZW50IFhSSCByZXF1ZXN0IGlmIHRoZSB0cmFuc3BvcnQgd2FzIGNyZWF0ZWQgd2l0aCBhIFVSTFxuICAgKiBhbmQgdGhlIGFzeW5jIHBhcmFtZXRlciBpcyBmYWxzZS4gSWYgdGhlIHRyYW5zcG9ydCB3YXMgbm90IGNyZWF0ZWQgd2l0aFxuICAgKiBhIFVSTCwgb3IgdGhlIGFzeW5jIHBhcmFtZXRlciBpcyBUcnVlIGFuZCBubyBjYWxsYmFjayBpcyBwcm92aWRlZCwgb3JcbiAgICogdGhlIFVSTCBpcyBhbiBlbXB0eSBzdHJpbmcsIHRoZSBjdXJyZW50IHNlbmQgYnVmZmVyIGlzIHJldHVybmVkLlxuICAgKiBAcGFyYW0ge29iamVjdH0gYXN5bmMgLSBJZiB0cnVlIHRoZSBjdXJyZW50IHNlbmQgYnVmZmVyIGlzIHJldHVybmVkLlxuICAgKiBAcGFyYW0ge29iamVjdH0gY2FsbGJhY2sgLSBPcHRpb25hbCBhc3luYyBjb21wbGV0aW9uIGNhbGxiYWNrXG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWR8c3RyaW5nfSBOb3RoaW5nIG9yIHRoZSBjdXJyZW50IHNlbmQgYnVmZmVyLlxuICAgKiBAdGhyb3dzIHtzdHJpbmd9IElmIFhIUiBmYWlscy5cbiAgICovXG4gIGZsdXNoOiBmdW5jdGlvbiAoYXN5bmMsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgaWYgKChhc3luYyAmJiAhY2FsbGJhY2spIHx8IHRoaXMudXJsID09PSB1bmRlZmluZWQgfHwgdGhpcy51cmwgPT09IFwiXCIpIHtcbiAgICAgIHJldHVybiB0aGlzLnNlbmRfYnVmXG4gICAgfVxuXG4gICAgdmFyIHhyZXEgPSB0aGlzLmdldFhtbEh0dHBSZXF1ZXN0T2JqZWN0KClcblxuICAgIGlmICh4cmVxLm92ZXJyaWRlTWltZVR5cGUpIHtcbiAgICAgIHhyZXEub3ZlcnJpZGVNaW1lVHlwZShcImFwcGxpY2F0aW9uL3ZuZC5hcGFjaGUudGhyaWZ0Lmpzb247IGNoYXJzZXQ9dXRmLThcIilcbiAgICB9XG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIC8vIElnbm9yZSBYSFIgY2FsbGJhY2tzIHVudGlsIHRoZSBkYXRhIGFycml2ZXMsIHRoZW4gY2FsbCB0aGVcbiAgICAgIC8vICBjbGllbnQncyBjYWxsYmFja1xuICAgICAgeHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPVxuICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIGNsaWVudENhbGxiYWNrID0gY2FsbGJhY2tcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09IDQgJiYgdGhpcy5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICBzZWxmLnNldFJlY3ZCdWZmZXIodGhpcy5yZXNwb25zZVRleHQpXG4gICAgICAgICAgICAgICAgICBjbGllbnRDYWxsYmFjaygpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KCkpXG5cbiAgICAgIC8vIGRldGVjdCBuZXQ6OkVSUl9DT05ORUNUSU9OX1JFRlVTRUQgYW5kIGNhbGwgdGhlIGNhbGxiYWNrLlxuICAgICAgeHJlcS5vbmVycm9yID1cbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2xpZW50Q2FsbGJhY2sgPSBjYWxsYmFja1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICBjbGllbnRDYWxsYmFjaygpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KCkpXG4gICAgfVxuXG4gICAgeHJlcS5vcGVuKFwiUE9TVFwiLCB0aGlzLnVybCwgISFhc3luYylcblxuICAgIC8vIGFkZCBjdXN0b20gaGVhZGVyc1xuICAgIE9iamVjdC5rZXlzKHNlbGYuY3VzdG9tSGVhZGVycykuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgICAgeHJlcS5zZXRSZXF1ZXN0SGVhZGVyKHByb3AsIHNlbGYuY3VzdG9tSGVhZGVyc1twcm9wXSlcbiAgICB9KVxuXG4gICAgaWYgKHhyZXEuc2V0UmVxdWVzdEhlYWRlcikge1xuICAgICAgeHJlcS5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIFwiYXBwbGljYXRpb24vdm5kLmFwYWNoZS50aHJpZnQuanNvbjsgY2hhcnNldD11dGYtOFwiKVxuICAgICAgeHJlcS5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vdm5kLmFwYWNoZS50aHJpZnQuanNvbjsgY2hhcnNldD11dGYtOFwiKVxuICAgIH1cblxuICAgIHhyZXEuc2VuZCh0aGlzLnNlbmRfYnVmKVxuICAgIGlmIChhc3luYyAmJiBjYWxsYmFjaykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHhyZXEucmVhZHlTdGF0ZSAhPSA0KSB7XG4gICAgICB0aHJvdyBcImVuY291bnRlcmVkIGFuIHVua25vd24gYWpheCByZWFkeSBzdGF0ZTogXCIgKyB4cmVxLnJlYWR5U3RhdGVcbiAgICB9XG5cbiAgICBpZiAoeHJlcS5zdGF0dXMgIT0gMjAwKSB7XG4gICAgICB0aHJvdyBcImVuY291bnRlcmVkIGEgdW5rbm93biByZXF1ZXN0IHN0YXR1czogXCIgKyB4cmVxLnN0YXR1c1xuICAgIH1cblxuICAgIHRoaXMucmVjdl9idWYgPSB4cmVxLnJlc3BvbnNlVGV4dFxuICAgIHRoaXMucmVjdl9idWZfc3ogPSB0aGlzLnJlY3ZfYnVmLmxlbmd0aFxuICAgIHRoaXMud3BvcyA9IHRoaXMucmVjdl9idWYubGVuZ3RoXG4gICAgdGhpcy5ycG9zID0gMFxuICB9LFxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgalF1ZXJ5IFhIUiBvYmplY3QgdG8gYmUgdXNlZCBmb3IgYSBUaHJpZnQgc2VydmVyIGNhbGwuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBjbGllbnQgLSBUaGUgVGhyaWZ0IFNlcnZpY2UgY2xpZW50IG9iamVjdCBnZW5lcmF0ZWQgYnkgdGhlIElETCBjb21waWxlci5cbiAgICogQHBhcmFtIHtvYmplY3R9IHBvc3REYXRhIC0gVGhlIG1lc3NhZ2UgdG8gc2VuZCB0byB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBhcmdzIC0gVGhlIG9yaWdpbmFsIGNhbGwgYXJndW1lbnRzIHdpdGggdGhlIHN1Y2Nlc3MgY2FsbCBiYWNrIGF0IHRoZSBlbmQuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IHJlY3ZfbWV0aG9kIC0gVGhlIFRocmlmdCBTZXJ2aWNlIENsaWVudCByZWNlaXZlIG1ldGhvZCBmb3IgdGhlIGNhbGwuXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IEEgbmV3IGpRdWVyeSBYSFIgb2JqZWN0LlxuICAgKiBAdGhyb3dzIHtzdHJpbmd9IElmIHRoZSBqUXVlcnkgdmVyc2lvbiBpcyBwcmlvciB0byAxLjUgb3IgaWYgalF1ZXJ5IGlzIG5vdCBmb3VuZC5cbiAgICovXG4gIGpxUmVxdWVzdDogZnVuY3Rpb24gKGNsaWVudCwgcG9zdERhdGEsIGFyZ3MsIHJlY3ZfbWV0aG9kKSB7XG4gICAgaWYgKHR5cGVvZiBqUXVlcnkgPT09IFwidW5kZWZpbmVkXCIgfHxcbiAgICAgICAgICB0eXBlb2YgalF1ZXJ5LkRlZmVycmVkID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aHJvdyBcIlRocmlmdC5qcyByZXF1aXJlcyBqUXVlcnkgMS41KyB0byB1c2UgYXN5bmNocm9ub3VzIHJlcXVlc3RzXCJcbiAgICB9XG5cbiAgICB2YXIgdGhyaWZ0VHJhbnNwb3J0ID0gdGhpc1xuXG4gICAgdmFyIGpxWEhSID0galF1ZXJ5LmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLnVybCxcbiAgICAgIGRhdGE6IHBvc3REYXRhLFxuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi92bmQuYXBhY2hlLnRocmlmdC5qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICBkYXRhVHlwZTogXCJ0ZXh0IHRocmlmdFwiLFxuICAgICAgY29udmVydGVyczoge1xuICAgICAgICBcInRleHQgdGhyaWZ0XCI6IGZ1bmN0aW9uIChyZXNwb25zZURhdGEpIHtcbiAgICAgICAgICB0aHJpZnRUcmFuc3BvcnQuc2V0UmVjdkJ1ZmZlcihyZXNwb25zZURhdGEpXG4gICAgICAgICAgdmFyIHZhbHVlID0gcmVjdl9tZXRob2QuY2FsbChjbGllbnQpXG4gICAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjb250ZXh0OiBjbGllbnQsXG4gICAgICBzdWNjZXNzOiBqUXVlcnkubWFrZUFycmF5KGFyZ3MpLnBvcCgpXG4gICAgfSlcblxuICAgIHJldHVybiBqcVhIUlxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBidWZmZXIgdG8gcHJvdmlkZSB0aGUgcHJvdG9jb2wgd2hlbiBkZXNlcmlhbGl6aW5nLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYnVmIC0gVGhlIGJ1ZmZlciB0byBzdXBwbHkgdGhlIHByb3RvY29sLlxuICAgKi9cbiAgc2V0UmVjdkJ1ZmZlcjogZnVuY3Rpb24gKGJ1Zikge1xuICAgIHRoaXMucmVjdl9idWYgPSBidWZcbiAgICB0aGlzLnJlY3ZfYnVmX3N6ID0gdGhpcy5yZWN2X2J1Zi5sZW5ndGhcbiAgICB0aGlzLndwb3MgPSB0aGlzLnJlY3ZfYnVmLmxlbmd0aFxuICAgIHRoaXMucnBvcyA9IDBcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB0cmFuc3BvcnQgaXMgb3BlbiwgWEhSIGFsd2F5cyByZXR1cm5zIHRydWUuXG4gICAqIEByZWFkb25seVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gQWx3YXlzIFRydWUuXG4gICAqL1xuICBpc09wZW46IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9LFxuXG4gIC8qKlxuICAgKiBPcGVucyB0aGUgdHJhbnNwb3J0IGNvbm5lY3Rpb24sIHdpdGggWEhSIHRoaXMgaXMgYSBub3AuXG4gICAqL1xuICBvcGVuOiBmdW5jdGlvbiAoKSB7fSxcblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSB0cmFuc3BvcnQgY29ubmVjdGlvbiwgd2l0aCBYSFIgdGhpcyBpcyBhIG5vcC5cbiAgICovXG4gIGNsb3NlOiBmdW5jdGlvbiAoKSB7fSxcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3BlY2lmaWVkIG51bWJlciBvZiBjaGFyYWN0ZXJzIGZyb20gdGhlIHJlc3BvbnNlXG4gICAqIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIFRoZSBudW1iZXIgb2YgY2hhcmFjdGVycyB0byByZXR1cm4uXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IENoYXJhY3RlcnMgc2VudCBieSB0aGUgc2VydmVyLlxuICAgKi9cbiAgcmVhZDogZnVuY3Rpb24gKGxlbikge1xuICAgIHZhciBhdmFpbCA9IHRoaXMud3BvcyAtIHRoaXMucnBvc1xuXG4gICAgaWYgKGF2YWlsID09PSAwKSB7XG4gICAgICByZXR1cm4gXCJcIlxuICAgIH1cblxuICAgIHZhciBnaXZlID0gbGVuXG5cbiAgICBpZiAoYXZhaWwgPCBsZW4pIHtcbiAgICAgIGdpdmUgPSBhdmFpbFxuICAgIH1cblxuICAgIHZhciByZXQgPSB0aGlzLnJlYWRfYnVmLnN1YnN0cih0aGlzLnJwb3MsIGdpdmUpXG4gICAgdGhpcy5ycG9zICs9IGdpdmVcblxuICAgIC8vIGNsZWFyIGJ1ZiB3aGVuIGNvbXBsZXRlP1xuICAgIHJldHVybiByZXRcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZW50aXJlIHJlc3BvbnNlIGJ1ZmZlci5cbiAgICogQHJldHVybnMge3N0cmluZ30gQ2hhcmFjdGVycyBzZW50IGJ5IHRoZSBzZXJ2ZXIuXG4gICAqL1xuICByZWFkQWxsOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVjdl9idWZcbiAgfSxcblxuICAvKipcbiAgICogU2V0cyB0aGUgc2VuZCBidWZmZXIgdG8gYnVmLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYnVmIC0gVGhlIGJ1ZmZlciB0byBzZW5kLlxuICAgKi9cbiAgd3JpdGU6IGZ1bmN0aW9uIChidWYpIHtcbiAgICB0aGlzLnNlbmRfYnVmID0gYnVmXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNlbmQgYnVmZmVyLlxuICAgKiBAcmVhZG9ubHlcbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIHNlbmQgYnVmZmVyLlxuICAgKi9cbiAgZ2V0U2VuZEJ1ZmZlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnNlbmRfYnVmXG4gIH1cblxufVxuXG4vKipcbiogQ29uc3RydWN0b3IgRnVuY3Rpb24gZm9yIHRoZSBXZWJTb2NrZXQgdHJhbnNwb3J0LlxuKiBAY29uc3RydWN0b3JcbiogQHBhcmFtIHtzdHJpbmd9IFt1cmxdIC0gVGhlIFVSTCB0byBjb25uZWN0IHRvLlxuKiBAY2xhc3NkZXNjIFRoZSBBcGFjaGUgVGhyaWZ0IFRyYW5zcG9ydCBsYXllciBwZXJmb3JtcyBieXRlIGxldmVsIEkvT1xuKiBiZXR3ZWVuIFJQQyBjbGllbnRzIGFuZCBzZXJ2ZXJzLiBUaGUgSmF2YVNjcmlwdCBUV2ViU29ja2V0VHJhbnNwb3J0IG9iamVjdFxuKiB1c2VzIHRoZSBXZWJTb2NrZXQgcHJvdG9jb2wuIFRhcmdldCBzZXJ2ZXJzIG11c3QgaW1wbGVtZW50IFdlYlNvY2tldC5cbiogKHNlZTogbm9kZS5qcyBleGFtcGxlIHNlcnZlcl9odHRwLmpzKS5cbiogQGV4YW1wbGVcbiogICB2YXIgdHJhbnNwb3J0ID0gbmV3IFRocmlmdC5UV2ViU29ja2V0VHJhbnNwb3J0KFwiaHR0cDovL2xvY2FsaG9zdDo4NTg1XCIpO1xuKi9cblRocmlmdC5UV2ViU29ja2V0VHJhbnNwb3J0ID0gZnVuY3Rpb24gKHVybCkge1xuICB0aGlzLl9fcmVzZXQodXJsKVxufVxuXG5UaHJpZnQuVFdlYlNvY2tldFRyYW5zcG9ydC5wcm90b3R5cGUgPSB7XG4gIF9fcmVzZXQ6IGZ1bmN0aW9uICh1cmwpIHtcbiAgICB0aGlzLnVybCA9IHVybCAvLyBXaGVyZSB0byBjb25uZWN0XG4gICAgdGhpcy5zb2NrZXQgPSBudWxsIC8vIFRoZSB3ZWIgc29ja2V0XG4gICAgdGhpcy5jYWxsYmFja3MgPSBbXSAvLyBQZW5kaW5nIGNhbGxiYWNrc1xuICAgIHRoaXMuc2VuZF9wZW5kaW5nID0gW10gLy8gQnVmZmVycy9DYWxsYmFjayBwYWlycyB3YWl0aW5nIHRvIGJlIHNlbnRcbiAgICB0aGlzLnNlbmRfYnVmID0gXCJcIiAvLyBPdXRib3VuZCBkYXRhLCBpbW11dGFibGUgdW50aWwgc2VudFxuICAgIHRoaXMucmVjdl9idWYgPSBcIlwiIC8vIEluYm91bmQgZGF0YVxuICAgIHRoaXMucmJfd3BvcyA9IDAgLy8gTmV0d29yayB3cml0ZSBwb3NpdGlvbiBpbiByZWNlaXZlIGJ1ZmZlclxuICAgIHRoaXMucmJfcnBvcyA9IDAgLy8gQ2xpZW50IHJlYWQgcG9zaXRpb24gaW4gcmVjZWl2ZSBidWZmZXJcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgdGhlIGN1cnJlbnQgV1MgcmVxdWVzdCBhbmQgcmVnaXN0ZXJzIGNhbGxiYWNrLiBUaGUgYXN5bmNcbiAgICogcGFyYW1ldGVyIGlzIGlnbm9yZWQgKFdTIGZsdXNoIGlzIGFsd2F5cyBhc3luYykgYW5kIHRoZSBjYWxsYmFja1xuICAgKiBmdW5jdGlvbiBwYXJhbWV0ZXIgaXMgcmVxdWlyZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBhc3luYyAtIElnbm9yZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBjYWxsYmFjayAtIFRoZSBjbGllbnQgY29tcGxldGlvbiBjYWxsYmFjay5cbiAgICogQHJldHVybnMge3VuZGVmaW5lZHxzdHJpbmd9IE5vdGhpbmcgKHVuZGVmaW5lZClcbiAgICovXG4gIGZsdXNoOiBmdW5jdGlvbiAoYXN5bmMsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgaWYgKHRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIC8vIFNlbmQgZGF0YSBhbmQgcmVnaXN0ZXIgYSBjYWxsYmFjayB0byBpbnZva2UgdGhlIGNsaWVudCBjYWxsYmFja1xuICAgICAgdGhpcy5zb2NrZXQuc2VuZCh0aGlzLnNlbmRfYnVmKVxuICAgICAgdGhpcy5jYWxsYmFja3MucHVzaCgoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2xpZW50Q2FsbGJhY2sgPSBjYWxsYmFja1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgIHNlbGYuc2V0UmVjdkJ1ZmZlcihtc2cpXG4gICAgICAgICAgY2xpZW50Q2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICB9KCkpKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBRdWV1ZSB0aGUgc2VuZCB0byBnbyBvdXQgX19vbk9wZW5cbiAgICAgIHRoaXMuc2VuZF9wZW5kaW5nLnB1c2goe1xuICAgICAgICBidWY6IHRoaXMuc2VuZF9idWYsXG4gICAgICAgIGNiOiBjYWxsYmFja1xuICAgICAgfSlcbiAgICB9XG4gIH0sXG5cbiAgX19vbk9wZW46IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICBpZiAodGhpcy5zZW5kX3BlbmRpbmcubGVuZ3RoID4gMCkge1xuICAgICAgLy8gSWYgdGhlIHVzZXIgbWFkZSBjYWxscyBiZWZvcmUgdGhlIGNvbm5lY3Rpb24gd2FzIGZ1bGx5XG4gICAgICAvLyBvcGVuLCBzZW5kIHRoZW0gbm93XG4gICAgICB0aGlzLnNlbmRfcGVuZGluZy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIHRoaXMuc29ja2V0LnNlbmQoZWxlbS5idWYpXG4gICAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgY2xpZW50Q2FsbGJhY2sgPSBlbGVtLmNiXG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgIHNlbGYuc2V0UmVjdkJ1ZmZlcihtc2cpXG4gICAgICAgICAgICBjbGllbnRDYWxsYmFjaygpXG4gICAgICAgICAgfVxuICAgICAgICB9KCkpKVxuICAgICAgfSlcbiAgICAgIHRoaXMuc2VuZF9wZW5kaW5nID0gW11cbiAgICB9XG4gIH0sXG5cbiAgX19vbkNsb3NlOiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdGhpcy5fX3Jlc2V0KHRoaXMudXJsKVxuICB9LFxuXG4gIF9fb25NZXNzYWdlOiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKHRoaXMuY2FsbGJhY2tzLmxlbmd0aCkge1xuICAgICAgdGhpcy5jYWxsYmFja3Muc2hpZnQoKShldnQuZGF0YSlcbiAgICB9XG4gIH0sXG5cbiAgX19vbkVycm9yOiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgY29uc29sZS5sb2coXCJUaHJpZnQgV2ViU29ja2V0IEVycm9yOiBcIiArIGV2dC50b1N0cmluZygpKVxuICAgIHRoaXMuc29ja2V0LmNsb3NlKClcbiAgfSxcblxuICAvKipcbiAgICogU2V0cyB0aGUgYnVmZmVyIHRvIHVzZSB3aGVuIHJlY2VpdmluZyBzZXJ2ZXIgcmVzcG9uc2VzLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYnVmIC0gVGhlIGJ1ZmZlciB0byByZWNlaXZlIHNlcnZlciByZXNwb25zZXMuXG4gICAqL1xuICBzZXRSZWN2QnVmZmVyOiBmdW5jdGlvbiAoYnVmKSB7XG4gICAgdGhpcy5yZWN2X2J1ZiA9IGJ1ZlxuICAgIHRoaXMucmVjdl9idWZfc3ogPSB0aGlzLnJlY3ZfYnVmLmxlbmd0aFxuICAgIHRoaXMud3BvcyA9IHRoaXMucmVjdl9idWYubGVuZ3RoXG4gICAgdGhpcy5ycG9zID0gMFxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHRyYW5zcG9ydCBpcyBvcGVuXG4gICAqIEByZWFkb25seVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzT3BlbjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09IHRoaXMuc29ja2V0Lk9QRU5cbiAgfSxcblxuICAvKipcbiAgICogT3BlbnMgdGhlIHRyYW5zcG9ydCBjb25uZWN0aW9uXG4gICAqL1xuICBvcGVuOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gSWYgT1BFTi9DT05ORUNUSU5HL0NMT1NJTkcgaWdub3JlIGFkZGl0aW9uYWwgb3BlbnNcbiAgICBpZiAodGhpcy5zb2NrZXQgJiYgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSAhPSB0aGlzLnNvY2tldC5DTE9TRUQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICAvLyBJZiB0aGVyZSBpcyBubyBzb2NrZXQgb3IgdGhlIHNvY2tldCBpcyBjbG9zZWQ6XG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KHRoaXMudXJsKVxuICAgIHRoaXMuc29ja2V0Lm9ub3BlbiA9IHRoaXMuX19vbk9wZW4uYmluZCh0aGlzKVxuICAgIHRoaXMuc29ja2V0Lm9ubWVzc2FnZSA9IHRoaXMuX19vbk1lc3NhZ2UuYmluZCh0aGlzKVxuICAgIHRoaXMuc29ja2V0Lm9uZXJyb3IgPSB0aGlzLl9fb25FcnJvci5iaW5kKHRoaXMpXG4gICAgdGhpcy5zb2NrZXQub25jbG9zZSA9IHRoaXMuX19vbkNsb3NlLmJpbmQodGhpcylcbiAgfSxcblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSB0cmFuc3BvcnQgY29ubmVjdGlvblxuICAgKi9cbiAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNvY2tldC5jbG9zZSgpXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgY2hhcmFjdGVycyBmcm9tIHRoZSByZXNwb25zZVxuICAgKiBidWZmZXIuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBUaGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgdG8gcmV0dXJuLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBDaGFyYWN0ZXJzIHNlbnQgYnkgdGhlIHNlcnZlci5cbiAgICovXG4gIHJlYWQ6IGZ1bmN0aW9uIChsZW4pIHtcbiAgICB2YXIgYXZhaWwgPSB0aGlzLndwb3MgLSB0aGlzLnJwb3NcblxuICAgIGlmIChhdmFpbCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFwiXCJcbiAgICB9XG5cbiAgICB2YXIgZ2l2ZSA9IGxlblxuXG4gICAgaWYgKGF2YWlsIDwgbGVuKSB7XG4gICAgICBnaXZlID0gYXZhaWxcbiAgICB9XG5cbiAgICB2YXIgcmV0ID0gdGhpcy5yZWFkX2J1Zi5zdWJzdHIodGhpcy5ycG9zLCBnaXZlKVxuICAgIHRoaXMucnBvcyArPSBnaXZlXG5cbiAgICAvLyBjbGVhciBidWYgd2hlbiBjb21wbGV0ZT9cbiAgICByZXR1cm4gcmV0XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGVudGlyZSByZXNwb25zZSBidWZmZXIuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IENoYXJhY3RlcnMgc2VudCBieSB0aGUgc2VydmVyLlxuICAgKi9cbiAgcmVhZEFsbDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnJlY3ZfYnVmXG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHNlbmQgYnVmZmVyIHRvIGJ1Zi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGJ1ZiAtIFRoZSBidWZmZXIgdG8gc2VuZC5cbiAgICovXG4gIHdyaXRlOiBmdW5jdGlvbiAoYnVmKSB7XG4gICAgdGhpcy5zZW5kX2J1ZiA9IGJ1ZlxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzZW5kIGJ1ZmZlci5cbiAgICogQHJlYWRvbmx5XG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBzZW5kIGJ1ZmZlci5cbiAgICovXG4gIGdldFNlbmRCdWZmZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zZW5kX2J1ZlxuICB9XG5cbn1cblxuLyoqXG4qIEluaXRpYWxpemVzIGEgVGhyaWZ0IEpTT04gcHJvdG9jb2wgaW5zdGFuY2UuXG4qIEBjb25zdHJ1Y3RvclxuKiBAcGFyYW0ge1RocmlmdC5UcmFuc3BvcnR9IHRyYW5zcG9ydCAtIFRoZSB0cmFuc3BvcnQgdG8gc2VyaWFsaXplIHRvL2Zyb20uXG4qIEBjbGFzc2Rlc2MgQXBhY2hlIFRocmlmdCBQcm90b2NvbHMgcGVyZm9ybSBzZXJpYWxpemF0aW9uIHdoaWNoIGVuYWJsZXMgY3Jvc3NcbiogbGFuZ3VhZ2UgUlBDLiBUaGUgUHJvdG9jb2wgdHlwZSBpcyB0aGUgSmF2YVNjcmlwdCBicm93c2VyIGltcGxlbWVudGF0aW9uXG4qIG9mIHRoZSBBcGFjaGUgVGhyaWZ0IFRKU09OUHJvdG9jb2wuXG4qIEBleGFtcGxlXG4qICAgICB2YXIgcHJvdG9jb2wgID0gbmV3IFRocmlmdC5Qcm90b2NvbCh0cmFuc3BvcnQpO1xuKi9cblRocmlmdC5USlNPTlByb3RvY29sID0gVGhyaWZ0LlByb3RvY29sID0gZnVuY3Rpb24gKHRyYW5zcG9ydCkge1xuICB0aGlzLnRzdGFjayA9IFtdXG4gIHRoaXMudHBvcyA9IFtdXG4gIHRoaXMudHJhbnNwb3J0ID0gdHJhbnNwb3J0XG59XG5cbi8qKlxuKiBUaHJpZnQgSURMIHR5cGUgSWQgdG8gc3RyaW5nIG1hcHBpbmcuXG4qIEByZWFkb25seVxuKiBAc2VlIHtAbGluayBUaHJpZnQuVHlwZX1cbiovXG5UaHJpZnQuUHJvdG9jb2wuVHlwZSA9IHt9XG5UaHJpZnQuUHJvdG9jb2wuVHlwZVtUaHJpZnQuVHlwZS5CT09MXSA9IFwiXFxcInRmXFxcIlwiXG5UaHJpZnQuUHJvdG9jb2wuVHlwZVtUaHJpZnQuVHlwZS5CWVRFXSA9IFwiXFxcImk4XFxcIlwiXG5UaHJpZnQuUHJvdG9jb2wuVHlwZVtUaHJpZnQuVHlwZS5JMTZdID0gXCJcXFwiaTE2XFxcIlwiXG5UaHJpZnQuUHJvdG9jb2wuVHlwZVtUaHJpZnQuVHlwZS5JMzJdID0gXCJcXFwiaTMyXFxcIlwiXG5UaHJpZnQuUHJvdG9jb2wuVHlwZVtUaHJpZnQuVHlwZS5JNjRdID0gXCJcXFwiaTY0XFxcIlwiXG5UaHJpZnQuUHJvdG9jb2wuVHlwZVtUaHJpZnQuVHlwZS5ET1VCTEVdID0gXCJcXFwiZGJsXFxcIlwiXG5UaHJpZnQuUHJvdG9jb2wuVHlwZVtUaHJpZnQuVHlwZS5TVFJVQ1RdID0gXCJcXFwicmVjXFxcIlwiXG5UaHJpZnQuUHJvdG9jb2wuVHlwZVtUaHJpZnQuVHlwZS5TVFJJTkddID0gXCJcXFwic3RyXFxcIlwiXG5UaHJpZnQuUHJvdG9jb2wuVHlwZVtUaHJpZnQuVHlwZS5NQVBdID0gXCJcXFwibWFwXFxcIlwiXG5UaHJpZnQuUHJvdG9jb2wuVHlwZVtUaHJpZnQuVHlwZS5MSVNUXSA9IFwiXFxcImxzdFxcXCJcIlxuVGhyaWZ0LlByb3RvY29sLlR5cGVbVGhyaWZ0LlR5cGUuU0VUXSA9IFwiXFxcInNldFxcXCJcIlxuXG4vKipcbiogVGhyaWZ0IElETCB0eXBlIHN0cmluZyB0byBJZCBtYXBwaW5nLlxuKiBAcmVhZG9ubHlcbiogQHNlZSB7QGxpbmsgVGhyaWZ0LlR5cGV9XG4qL1xuVGhyaWZ0LlByb3RvY29sLlJUeXBlID0ge31cblRocmlmdC5Qcm90b2NvbC5SVHlwZS50ZiA9IFRocmlmdC5UeXBlLkJPT0xcblRocmlmdC5Qcm90b2NvbC5SVHlwZS5pOCA9IFRocmlmdC5UeXBlLkJZVEVcblRocmlmdC5Qcm90b2NvbC5SVHlwZS5pMTYgPSBUaHJpZnQuVHlwZS5JMTZcblRocmlmdC5Qcm90b2NvbC5SVHlwZS5pMzIgPSBUaHJpZnQuVHlwZS5JMzJcblRocmlmdC5Qcm90b2NvbC5SVHlwZS5pNjQgPSBUaHJpZnQuVHlwZS5JNjRcblRocmlmdC5Qcm90b2NvbC5SVHlwZS5kYmwgPSBUaHJpZnQuVHlwZS5ET1VCTEVcblRocmlmdC5Qcm90b2NvbC5SVHlwZS5yZWMgPSBUaHJpZnQuVHlwZS5TVFJVQ1RcblRocmlmdC5Qcm90b2NvbC5SVHlwZS5zdHIgPSBUaHJpZnQuVHlwZS5TVFJJTkdcblRocmlmdC5Qcm90b2NvbC5SVHlwZS5tYXAgPSBUaHJpZnQuVHlwZS5NQVBcblRocmlmdC5Qcm90b2NvbC5SVHlwZS5sc3QgPSBUaHJpZnQuVHlwZS5MSVNUXG5UaHJpZnQuUHJvdG9jb2wuUlR5cGUuc2V0ID0gVGhyaWZ0LlR5cGUuU0VUXG5cbi8qKlxuKiBUaGUgVEpTT05Qcm90b2NvbCB2ZXJzaW9uIG51bWJlci5cbiogQHJlYWRvbmx5XG4qIEBjb25zdCB7bnVtYmVyfSBWZXJzaW9uXG4qIEBtZW1iZXJvZiBUaHJpZnQuUHJvdG9jb2xcbiovXG5UaHJpZnQuUHJvdG9jb2wuVmVyc2lvbiA9IDFcblxuVGhyaWZ0LlByb3RvY29sLnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHVuZGVybHlpbmcgdHJhbnNwb3J0LlxuICAgKiBAcmVhZG9ubHlcbiAgICogQHJldHVybnMge1RocmlmdC5UcmFuc3BvcnR9IFRoZSB1bmRlcmx5aW5nIHRyYW5zcG9ydC5cbiAgICovXG4gIGdldFRyYW5zcG9ydDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydFxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIHRoZSBiZWdpbm5pbmcgb2YgYSBUaHJpZnQgUlBDIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIHNlcnZpY2UgbWV0aG9kIHRvIGNhbGwuXG4gICAqIEBwYXJhbSB7VGhyaWZ0Lk1lc3NhZ2VUeXBlfSBtZXNzYWdlVHlwZSAtIFRoZSB0eXBlIG9mIG1ldGhvZCBjYWxsLlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxaWQgLSBUaGUgc2VxdWVuY2UgbnVtYmVyIG9mIHRoaXMgY2FsbCAoYWx3YXlzIDAgaW4gQXBhY2hlIFRocmlmdCkuXG4gICAqL1xuICB3cml0ZU1lc3NhZ2VCZWdpbjogZnVuY3Rpb24gKG5hbWUsIG1lc3NhZ2VUeXBlLCBzZXFpZCkge1xuICAgIHRoaXMudHN0YWNrID0gW11cbiAgICB0aGlzLnRwb3MgPSBbXVxuXG4gICAgdGhpcy50c3RhY2sucHVzaChbVGhyaWZ0LlByb3RvY29sLlZlcnNpb24sIFwiXFxcIlwiICtcbiAgICAgICAgICBuYW1lICsgXCJcXFwiXCIsIG1lc3NhZ2VUeXBlLCBzZXFpZF0pXG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZXMgdGhlIGVuZCBvZiBhIFRocmlmdCBSUEMgbWVzc2FnZS5cbiAgICovXG4gIHdyaXRlTWVzc2FnZUVuZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBvYmogPSB0aGlzLnRzdGFjay5wb3AoKVxuXG4gICAgdGhpcy53b2JqID0gdGhpcy50c3RhY2sucG9wKClcbiAgICB0aGlzLndvYmoucHVzaChvYmopXG5cbiAgICB0aGlzLndidWYgPSBcIltcIiArIHRoaXMud29iai5qb2luKFwiLFwiKSArIFwiXVwiXG5cbiAgICB0aGlzLnRyYW5zcG9ydC53cml0ZSh0aGlzLndidWYpXG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZXMgdGhlIGJlZ2lubmluZyBvZiBhIHN0cnVjdC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc3RydWN0LlxuICAgKi9cbiAgd3JpdGVTdHJ1Y3RCZWdpbjogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aGlzLnRwb3MucHVzaCh0aGlzLnRzdGFjay5sZW5ndGgpXG4gICAgdGhpcy50c3RhY2sucHVzaCh7fSlcbiAgfSxcblxuICAvKipcbiAgICogU2VyaWFsaXplcyB0aGUgZW5kIG9mIGEgc3RydWN0LlxuICAgKi9cbiAgd3JpdGVTdHJ1Y3RFbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcCA9IHRoaXMudHBvcy5wb3AoKVxuICAgIHZhciBzdHJ1Y3QgPSB0aGlzLnRzdGFja1twXVxuICAgIHZhciBzdHIgPSBcIntcIlxuICAgIHZhciBmaXJzdCA9IHRydWVcbiAgICBmb3IgKHZhciBrZXkgaW4gc3RydWN0KSB7XG4gICAgICBpZiAoZmlyc3QpIHtcbiAgICAgICAgZmlyc3QgPSBmYWxzZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyICs9IFwiLFwiXG4gICAgICB9XG5cbiAgICAgIHN0ciArPSBrZXkgKyBcIjpcIiArIHN0cnVjdFtrZXldXG4gICAgfVxuXG4gICAgc3RyICs9IFwifVwiXG4gICAgdGhpcy50c3RhY2tbcF0gPSBzdHJcbiAgfSxcblxuICAvKipcbiAgICogU2VyaWFsaXplcyB0aGUgYmVnaW5uaW5nIG9mIGEgc3RydWN0IGZpZWxkLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBmaWVsZC5cbiAgICogQHBhcmFtIHtUaHJpZnQuUHJvdG9jb2wuVHlwZX0gZmllbGRUeXBlIC0gVGhlIGRhdGEgdHlwZSBvZiB0aGUgZmllbGQuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBmaWVsZElkIC0gVGhlIGZpZWxkJ3MgdW5pcXVlIGlkZW50aWZpZXIuXG4gICAqL1xuICB3cml0ZUZpZWxkQmVnaW46IGZ1bmN0aW9uIChuYW1lLCBmaWVsZFR5cGUsIGZpZWxkSWQpIHtcbiAgICB0aGlzLnRwb3MucHVzaCh0aGlzLnRzdGFjay5sZW5ndGgpXG4gICAgdGhpcy50c3RhY2sucHVzaCh7IFwiZmllbGRJZFwiOiBcIlxcXCJcIiArXG4gICAgICAgICAgZmllbGRJZCArIFwiXFxcIlwiLFxuICAgIFwiZmllbGRUeXBlXCI6IFRocmlmdC5Qcm90b2NvbC5UeXBlW2ZpZWxkVHlwZV1cbiAgICB9KVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIHRoZSBlbmQgb2YgYSBmaWVsZC5cbiAgICovXG4gIHdyaXRlRmllbGRFbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLnRzdGFjay5wb3AoKVxuICAgIHZhciBmaWVsZEluZm8gPSB0aGlzLnRzdGFjay5wb3AoKVxuXG4gICAgdGhpcy50c3RhY2tbdGhpcy50c3RhY2subGVuZ3RoIC0gMV1bZmllbGRJbmZvLmZpZWxkSWRdID0gXCJ7XCIgK1xuICAgICAgICAgIGZpZWxkSW5mby5maWVsZFR5cGUgKyBcIjpcIiArIHZhbHVlICsgXCJ9XCJcbiAgICB0aGlzLnRwb3MucG9wKClcbiAgfSxcblxuICAvKipcbiAgICogU2VyaWFsaXplcyB0aGUgZW5kIG9mIHRoZSBzZXQgb2YgZmllbGRzIGZvciBhIHN0cnVjdC5cbiAgICovXG4gIHdyaXRlRmllbGRTdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gbmFcbiAgfSxcblxuICAvKipcbiAgICogU2VyaWFsaXplcyB0aGUgYmVnaW5uaW5nIG9mIGEgbWFwIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSB7VGhyaWZ0LlR5cGV9IGtleVR5cGUgLSBUaGUgZGF0YSB0eXBlIG9mIHRoZSBrZXkuXG4gICAqIEBwYXJhbSB7VGhyaWZ0LlR5cGV9IHZhbFR5cGUgLSBUaGUgZGF0YSB0eXBlIG9mIHRoZSB2YWx1ZS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IFtzaXplXSAtIFRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIG1hcCAoaWdub3JlZCkuXG4gICAqL1xuICB3cml0ZU1hcEJlZ2luOiBmdW5jdGlvbiAoa2V5VHlwZSwgdmFsVHlwZSwgc2l6ZSkge1xuICAgIHRoaXMudHBvcy5wdXNoKHRoaXMudHN0YWNrLmxlbmd0aClcbiAgICB0aGlzLnRzdGFjay5wdXNoKFtUaHJpZnQuUHJvdG9jb2wuVHlwZVtrZXlUeXBlXSxcbiAgICAgIFRocmlmdC5Qcm90b2NvbC5UeXBlW3ZhbFR5cGVdLCAwXSlcbiAgfSxcblxuICAvKipcbiAgICogU2VyaWFsaXplcyB0aGUgZW5kIG9mIGEgbWFwLlxuICAgKi9cbiAgd3JpdGVNYXBFbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcCA9IHRoaXMudHBvcy5wb3AoKVxuXG4gICAgaWYgKHAgPT0gdGhpcy50c3RhY2subGVuZ3RoKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoKHRoaXMudHN0YWNrLmxlbmd0aCAtIHAgLSAxKSAlIDIgIT09IDApIHtcbiAgICAgIHRoaXMudHN0YWNrLnB1c2goXCJcIilcbiAgICB9XG5cbiAgICB2YXIgc2l6ZSA9ICh0aGlzLnRzdGFjay5sZW5ndGggLSBwIC0gMSkgLyAyXG5cbiAgICB0aGlzLnRzdGFja1twXVt0aGlzLnRzdGFja1twXS5sZW5ndGggLSAxXSA9IHNpemVcblxuICAgIHZhciBtYXAgPSBcIn1cIlxuICAgIHZhciBmaXJzdCA9IHRydWVcbiAgICB3aGlsZSAodGhpcy50c3RhY2subGVuZ3RoID4gcCArIDEpIHtcbiAgICAgIHZhciB2ID0gdGhpcy50c3RhY2sucG9wKClcbiAgICAgIHZhciBrID0gdGhpcy50c3RhY2sucG9wKClcbiAgICAgIGlmIChmaXJzdCkge1xuICAgICAgICBmaXJzdCA9IGZhbHNlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXAgPSBcIixcIiArIG1hcFxuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGspKSB7IGsgPSBcIlxcXCJcIiArIGsgKyBcIlxcXCJcIiB9IC8vIGpzb24gXCJrZXlzXCIgbmVlZCB0byBiZSBzdHJpbmdzXG4gICAgICBtYXAgPSBrICsgXCI6XCIgKyB2ICsgbWFwXG4gICAgfVxuICAgIG1hcCA9IFwie1wiICsgbWFwXG5cbiAgICB0aGlzLnRzdGFja1twXS5wdXNoKG1hcClcbiAgICB0aGlzLnRzdGFja1twXSA9IFwiW1wiICsgdGhpcy50c3RhY2tbcF0uam9pbihcIixcIikgKyBcIl1cIlxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIHRoZSBiZWdpbm5pbmcgb2YgYSBsaXN0IGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSB7VGhyaWZ0LlR5cGV9IGVsZW1UeXBlIC0gVGhlIGRhdGEgdHlwZSBvZiB0aGUgZWxlbWVudHMuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzaXplIC0gVGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgbGlzdC5cbiAgICovXG4gIHdyaXRlTGlzdEJlZ2luOiBmdW5jdGlvbiAoZWxlbVR5cGUsIHNpemUpIHtcbiAgICB0aGlzLnRwb3MucHVzaCh0aGlzLnRzdGFjay5sZW5ndGgpXG4gICAgdGhpcy50c3RhY2sucHVzaChbVGhyaWZ0LlByb3RvY29sLlR5cGVbZWxlbVR5cGVdLCBzaXplXSlcbiAgfSxcblxuICAvKipcbiAgICogU2VyaWFsaXplcyB0aGUgZW5kIG9mIGEgbGlzdC5cbiAgICovXG4gIHdyaXRlTGlzdEVuZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwID0gdGhpcy50cG9zLnBvcCgpXG5cbiAgICB3aGlsZSAodGhpcy50c3RhY2subGVuZ3RoID4gcCArIDEpIHtcbiAgICAgIHZhciB0bXBWYWwgPSB0aGlzLnRzdGFja1twICsgMV1cbiAgICAgIHRoaXMudHN0YWNrLnNwbGljZShwICsgMSwgMSlcbiAgICAgIHRoaXMudHN0YWNrW3BdLnB1c2godG1wVmFsKVxuICAgIH1cblxuICAgIHRoaXMudHN0YWNrW3BdID0gXCJbXCIgKyB0aGlzLnRzdGFja1twXS5qb2luKFwiLFwiKSArIFwiXVwiXG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZXMgdGhlIGJlZ2lubmluZyBvZiBhIHNldCBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0ge1RocmlmdC5UeXBlfSBlbGVtVHlwZSAtIFRoZSBkYXRhIHR5cGUgb2YgdGhlIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2l6ZSAtIFRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIGxpc3QuXG4gICAqL1xuICB3cml0ZVNldEJlZ2luOiBmdW5jdGlvbiAoZWxlbVR5cGUsIHNpemUpIHtcbiAgICB0aGlzLnRwb3MucHVzaCh0aGlzLnRzdGFjay5sZW5ndGgpXG4gICAgdGhpcy50c3RhY2sucHVzaChbVGhyaWZ0LlByb3RvY29sLlR5cGVbZWxlbVR5cGVdLCBzaXplXSlcbiAgfSxcblxuICAvKipcbiAgICogU2VyaWFsaXplcyB0aGUgZW5kIG9mIGEgc2V0LlxuICAgKi9cbiAgd3JpdGVTZXRFbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcCA9IHRoaXMudHBvcy5wb3AoKVxuXG4gICAgd2hpbGUgKHRoaXMudHN0YWNrLmxlbmd0aCA+IHAgKyAxKSB7XG4gICAgICB2YXIgdG1wVmFsID0gdGhpcy50c3RhY2tbcCArIDFdXG4gICAgICB0aGlzLnRzdGFjay5zcGxpY2UocCArIDEsIDEpXG4gICAgICB0aGlzLnRzdGFja1twXS5wdXNoKHRtcFZhbClcbiAgICB9XG5cbiAgICB0aGlzLnRzdGFja1twXSA9IFwiW1wiICsgdGhpcy50c3RhY2tbcF0uam9pbihcIixcIikgKyBcIl1cIlxuICB9LFxuXG4gIC8qKiBTZXJpYWxpemVzIGEgYm9vbGVhbiAqL1xuICB3cml0ZUJvb2w6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMudHN0YWNrLnB1c2godmFsdWUgPyAxIDogMClcbiAgfSxcblxuICAvKiogU2VyaWFsaXplcyBhIG51bWJlciAqL1xuICB3cml0ZUJ5dGU6IGZ1bmN0aW9uIChpOCkge1xuICAgIHRoaXMudHN0YWNrLnB1c2goaTgpXG4gIH0sXG5cbiAgLyoqIFNlcmlhbGl6ZXMgYSBudW1iZXIgKi9cbiAgd3JpdGVJMTY6IGZ1bmN0aW9uIChpMTYpIHtcbiAgICB0aGlzLnRzdGFjay5wdXNoKGkxNilcbiAgfSxcblxuICAvKiogU2VyaWFsaXplcyBhIG51bWJlciAqL1xuICB3cml0ZUkzMjogZnVuY3Rpb24gKGkzMikge1xuICAgIHRoaXMudHN0YWNrLnB1c2goaTMyKVxuICB9LFxuXG4gIC8qKiBTZXJpYWxpemVzIGEgbnVtYmVyICovXG4gIHdyaXRlSTY0OiBmdW5jdGlvbiAoaTY0KSB7XG4gICAgdGhpcy50c3RhY2sucHVzaChpNjQpXG4gIH0sXG5cbiAgLyoqIFNlcmlhbGl6ZXMgYSBudW1iZXIgKi9cbiAgd3JpdGVEb3VibGU6IGZ1bmN0aW9uIChkYmwpIHtcbiAgICB0aGlzLnRzdGFjay5wdXNoKGRibClcbiAgfSxcblxuICAvKiogU2VyaWFsaXplcyBhIHN0cmluZyAqL1xuICB3cml0ZVN0cmluZzogZnVuY3Rpb24gKHN0cikge1xuICAgIC8vIFdlIGRvIG5vdCBlbmNvZGUgdXJpIGNvbXBvbmVudHMgZm9yIHdpcmUgdHJhbnNmZXI6XG4gICAgaWYgKHN0ciA9PT0gbnVsbCkge1xuICAgICAgdGhpcy50c3RhY2sucHVzaChudWxsKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjb25jYXQgbWF5IGJlIHNsb3dlciB0aGFuIGJ1aWxkaW5nIGEgYnl0ZSBidWZmZXJcbiAgICAgIHZhciBlc2NhcGVkU3RyaW5nID0gXCJcIlxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoID0gc3RyLmNoYXJBdChpKSAvLyBhIHNpbmdsZSBkb3VibGUgcXVvdGU6IFwiXG4gICAgICAgIGlmIChjaCA9PT0gXCJcXFwiXCIpIHtcbiAgICAgICAgICBlc2NhcGVkU3RyaW5nICs9IFwiXFxcXFxcXCJcIiAvLyB3cml0ZSBvdXQgYXM6IFxcXCJcbiAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gXCJcXFxcXCIpIHsgLy8gYSBzaW5nbGUgYmFja3NsYXNoXG4gICAgICAgICAgZXNjYXBlZFN0cmluZyArPSBcIlxcXFxcXFxcXCIgLy8gd3JpdGUgb3V0IGFzIGRvdWJsZSBiYWNrc2xhc2hcbiAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gXCJcXGJcIikgeyAvLyBhIHNpbmdsZSBiYWNrc3BhY2U6IGludmlzaWJsZVxuICAgICAgICAgIGVzY2FwZWRTdHJpbmcgKz0gXCJcXFxcYlwiIC8vIHdyaXRlIG91dCBhczogXFxiXCJcbiAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gXCJcXGZcIikgeyAvLyBhIHNpbmdsZSBmb3JtZmVlZDogaW52aXNpYmxlXG4gICAgICAgICAgZXNjYXBlZFN0cmluZyArPSBcIlxcXFxmXCIgLy8gd3JpdGUgb3V0IGFzOiBcXGZcIlxuICAgICAgICB9IGVsc2UgaWYgKGNoID09PSBcIlxcblwiKSB7IC8vIGEgc2luZ2xlIG5ld2xpbmU6IGludmlzaWJsZVxuICAgICAgICAgIGVzY2FwZWRTdHJpbmcgKz0gXCJcXFxcblwiIC8vIHdyaXRlIG91dCBhczogXFxuXCJcbiAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gXCJcXHJcIikgeyAvLyBhIHNpbmdsZSByZXR1cm46IGludmlzaWJsZVxuICAgICAgICAgIGVzY2FwZWRTdHJpbmcgKz0gXCJcXFxcclwiIC8vIHdyaXRlIG91dCBhczogXFxyXCJcbiAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gXCJcXHRcIikgeyAvLyBhIHNpbmdsZSB0YWI6IGludmlzaWJsZVxuICAgICAgICAgIGVzY2FwZWRTdHJpbmcgKz0gXCJcXFxcdFwiIC8vIHdyaXRlIG91dCBhczogXFx0XCJcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlc2NhcGVkU3RyaW5nICs9IGNoIC8vIEVsc2UgaXQgbmVlZCBub3QgYmUgZXNjYXBlZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnRzdGFjay5wdXNoKFwiXFxcIlwiICsgZXNjYXBlZFN0cmluZyArIFwiXFxcIlwiKVxuICAgIH1cbiAgfSxcblxuICAvKiogU2VyaWFsaXplcyBhIHN0cmluZyAqL1xuICB3cml0ZUJpbmFyeTogZnVuY3Rpb24gKGJpbmFyeSkge1xuICAgIHZhciBzdHIgPSBcIlwiXG4gICAgaWYgKHR5cGVvZiBiaW5hcnkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHN0ciA9IGJpbmFyeVxuICAgIH0gZWxzZSBpZiAoYmluYXJ5IGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgICAgdmFyIGFyciA9IGJpbmFyeVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYXJyW2ldKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwid3JpdGVCaW5hcnkgb25seSBhY2NlcHRzIFN0cmluZyBvciBVaW50OEFycmF5LlwiKVxuICAgIH1cbiAgICB0aGlzLnRzdGFjay5wdXNoKFwiXFxcIlwiICsgYnRvYShzdHIpICsgXCJcXFwiXCIpXG4gIH0sXG5cbiAgLyoqXG4gICAgIEBjbGFzc1xuICAgICBAbmFtZSBBbm9uUmVhZE1lc3NhZ2VCZWdpblJldHVyblxuICAgICBAcHJvcGVydHkge3N0cmluZ30gZm5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc2VydmljZSBtZXRob2QuXG4gICAgIEBwcm9wZXJ0eSB7VGhyaWZ0Lk1lc3NhZ2VUeXBlfSBtdHlwZSAtIFRoZSB0eXBlIG9mIG1lc3NhZ2UgY2FsbC5cbiAgICAgQHByb3BlcnR5IHtudW1iZXJ9IHJzZXFpZCAtIFRoZSBzZXF1ZW5jZSBudW1iZXIgb2YgdGhlIG1lc3NhZ2UgKDAgaW4gVGhyaWZ0IFJQQykuXG4gICAqL1xuICAvKipcbiAgICogRGVzZXJpYWxpemVzIHRoZSBiZWdpbm5pbmcgb2YgYSBtZXNzYWdlLlxuICAgKiBAcmV0dXJucyB7QW5vblJlYWRNZXNzYWdlQmVnaW5SZXR1cm59XG4gICAqL1xuICByZWFkTWVzc2FnZUJlZ2luOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yc3RhY2sgPSBbXVxuICAgIHRoaXMucnBvcyA9IFtdXG5cbiAgICBpZiAodHlwZW9mIEpTT04gIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIEpTT04ucGFyc2UgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5yb2JqID0gSlNPTi5wYXJzZSh0aGlzLnRyYW5zcG9ydC5yZWFkQWxsKCkpXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgalF1ZXJ5ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aGlzLnJvYmogPSBqUXVlcnkucGFyc2VKU09OKHRoaXMudHJhbnNwb3J0LnJlYWRBbGwoKSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yb2JqID0gZXZhbCh0aGlzLnRyYW5zcG9ydC5yZWFkQWxsKCkpXG4gICAgfVxuXG4gICAgdmFyIHIgPSB7fVxuICAgIHZhciB2ZXJzaW9uID0gdGhpcy5yb2JqLnNoaWZ0KClcblxuICAgIGlmICh2ZXJzaW9uICE9IFRocmlmdC5Qcm90b2NvbC5WZXJzaW9uKSB7XG4gICAgICB0aHJvdyBcIldyb25nIHRocmlmdCBwcm90b2NvbCB2ZXJzaW9uOiBcIiArIHZlcnNpb25cbiAgICB9XG5cbiAgICByLmZuYW1lID0gdGhpcy5yb2JqLnNoaWZ0KClcbiAgICByLm10eXBlID0gdGhpcy5yb2JqLnNoaWZ0KClcbiAgICByLnJzZXFpZCA9IHRoaXMucm9iai5zaGlmdCgpXG5cbiAgICAvLyBnZXQgdG8gdGhlIG1haW4gb2JqXG4gICAgdGhpcy5yc3RhY2sucHVzaCh0aGlzLnJvYmouc2hpZnQoKSlcblxuICAgIHJldHVybiByXG4gIH0sXG5cbiAgLyoqIERlc2VyaWFsaXplcyB0aGUgZW5kIG9mIGEgbWVzc2FnZS4gKi9cbiAgcmVhZE1lc3NhZ2VFbmQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcblxuICAvKipcbiAgICogRGVzZXJpYWxpemVzIHRoZSBiZWdpbm5pbmcgb2YgYSBzdHJ1Y3QuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbbmFtZV0gLSBUaGUgbmFtZSBvZiB0aGUgc3RydWN0IChpZ25vcmVkKVxuICAgKiBAcmV0dXJucyB7b2JqZWN0fSAtIEFuIG9iamVjdCB3aXRoIGFuIGVtcHR5IHN0cmluZyBmbmFtZSBwcm9wZXJ0eVxuICAgKi9cbiAgcmVhZFN0cnVjdEJlZ2luOiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciByID0ge31cbiAgICByLmZuYW1lID0gXCJcIlxuXG4gICAgLy8gaW5jYXNlIHRoaXMgaXMgYW4gYXJyYXkgb2Ygc3RydWN0c1xuICAgIGlmICh0aGlzLnJzdGFja1t0aGlzLnJzdGFjay5sZW5ndGggLSAxXSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICB0aGlzLnJzdGFjay5wdXNoKHRoaXMucnN0YWNrW3RoaXMucnN0YWNrLmxlbmd0aCAtIDFdLnNoaWZ0KCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHJcbiAgfSxcblxuICAvKiogRGVzZXJpYWxpemVzIHRoZSBlbmQgb2YgYSBzdHJ1Y3QuICovXG4gIHJlYWRTdHJ1Y3RFbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5yc3RhY2tbdGhpcy5yc3RhY2subGVuZ3RoIC0gMl0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgdGhpcy5yc3RhY2sucG9wKClcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAgIEBjbGFzc1xuICAgICBAbmFtZSBBbm9uUmVhZEZpZWxkQmVnaW5SZXR1cm5cbiAgICAgQHByb3BlcnR5IHtzdHJpbmd9IGZuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGZpZWxkIChhbHdheXMgJycpLlxuICAgICBAcHJvcGVydHkge1RocmlmdC5UeXBlfSBmdHlwZSAtIFRoZSBkYXRhIHR5cGUgb2YgdGhlIGZpZWxkLlxuICAgICBAcHJvcGVydHkge251bWJlcn0gZmlkIC0gVGhlIHVuaXF1ZSBpZGVudGlmaWVyIG9mIHRoZSBmaWVsZC5cbiAgICovXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZXMgdGhlIGJlZ2lubmluZyBvZiBhIGZpZWxkLlxuICAgKiBAcmV0dXJucyB7QW5vblJlYWRGaWVsZEJlZ2luUmV0dXJufVxuICAgKi9cbiAgcmVhZEZpZWxkQmVnaW46IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgciA9IHt9XG5cbiAgICB2YXIgZmlkID0gLTFcbiAgICB2YXIgZnR5cGUgPSBUaHJpZnQuVHlwZS5TVE9QXG5cbiAgICAvLyBnZXQgYSBmaWVsZElkXG4gICAgZm9yICh2YXIgZiBpbiAodGhpcy5yc3RhY2tbdGhpcy5yc3RhY2subGVuZ3RoIC0gMV0pKSB7XG4gICAgICBpZiAoZiA9PT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBmaWQgPSBwYXJzZUludChmLCAxMClcbiAgICAgIHRoaXMucnBvcy5wdXNoKHRoaXMucnN0YWNrLmxlbmd0aClcblxuICAgICAgdmFyIGZpZWxkID0gdGhpcy5yc3RhY2tbdGhpcy5yc3RhY2subGVuZ3RoIC0gMV1bZmlkXVxuXG4gICAgICAvLyByZW1vdmUgc28gd2UgZG9uJ3Qgc2VlIGl0IGFnYWluXG4gICAgICBkZWxldGUgdGhpcy5yc3RhY2tbdGhpcy5yc3RhY2subGVuZ3RoIC0gMV1bZmlkXVxuXG4gICAgICB0aGlzLnJzdGFjay5wdXNoKGZpZWxkKVxuXG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGlmIChmaWQgIT0gLTEpIHtcbiAgICAgIC8vIHNob3VsZCBvbmx5IGJlIDEgb2YgdGhlc2UgYnV0IHRoaXMgaXMgdGhlIG9ubHlcbiAgICAgIC8vIHdheSB0byBtYXRjaCBhIGtleVxuICAgICAgZm9yICh2YXIgaSBpbiAodGhpcy5yc3RhY2tbdGhpcy5yc3RhY2subGVuZ3RoIC0gMV0pKSB7XG4gICAgICAgIGlmIChUaHJpZnQuUHJvdG9jb2wuUlR5cGVbaV0gPT09IG51bGwpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgZnR5cGUgPSBUaHJpZnQuUHJvdG9jb2wuUlR5cGVbaV1cbiAgICAgICAgdGhpcy5yc3RhY2tbdGhpcy5yc3RhY2subGVuZ3RoIC0gMV0gPVxuICAgICAgICAgICAgICAgICAgdGhpcy5yc3RhY2tbdGhpcy5yc3RhY2subGVuZ3RoIC0gMV1baV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByLmZuYW1lID0gXCJcIlxuICAgIHIuZnR5cGUgPSBmdHlwZVxuICAgIHIuZmlkID0gZmlkXG5cbiAgICByZXR1cm4gclxuICB9LFxuXG4gIC8qKiBEZXNlcmlhbGl6ZXMgdGhlIGVuZCBvZiBhIGZpZWxkLiAqL1xuICByZWFkRmllbGRFbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcG9zID0gdGhpcy5ycG9zLnBvcCgpXG5cbiAgICAvLyBnZXQgYmFjayB0byB0aGUgcmlnaHQgcGxhY2UgaW4gdGhlIHN0YWNrXG4gICAgd2hpbGUgKHRoaXMucnN0YWNrLmxlbmd0aCA+IHBvcykge1xuICAgICAgdGhpcy5yc3RhY2sucG9wKClcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAgIEBjbGFzc1xuICAgICBAbmFtZSBBbm9uUmVhZE1hcEJlZ2luUmV0dXJuXG4gICAgIEBwcm9wZXJ0eSB7VGhyaWZ0LlR5cGV9IGt0eXBlIC0gVGhlIGRhdGEgdHlwZSBvZiB0aGUga2V5LlxuICAgICBAcHJvcGVydHkge1RocmlmdC5UeXBlfSB2dHlwZSAtIFRoZSBkYXRhIHR5cGUgb2YgdGhlIHZhbHVlLlxuICAgICBAcHJvcGVydHkge251bWJlcn0gc2l6ZSAtIFRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIG1hcC5cbiAgICovXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZXMgdGhlIGJlZ2lubmluZyBvZiBhIG1hcC5cbiAgICogQHJldHVybnMge0Fub25SZWFkTWFwQmVnaW5SZXR1cm59XG4gICAqL1xuICByZWFkTWFwQmVnaW46IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWFwID0gdGhpcy5yc3RhY2sucG9wKClcbiAgICB2YXIgZmlyc3QgPSBtYXAuc2hpZnQoKVxuICAgIGlmIChmaXJzdCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICB0aGlzLnJzdGFjay5wdXNoKG1hcClcbiAgICAgIG1hcCA9IGZpcnN0XG4gICAgICBmaXJzdCA9IG1hcC5zaGlmdCgpXG4gICAgfVxuXG4gICAgdmFyIHIgPSB7fVxuICAgIHIua3R5cGUgPSBUaHJpZnQuUHJvdG9jb2wuUlR5cGVbZmlyc3RdXG4gICAgci52dHlwZSA9IFRocmlmdC5Qcm90b2NvbC5SVHlwZVttYXAuc2hpZnQoKV1cbiAgICByLnNpemUgPSBtYXAuc2hpZnQoKVxuXG4gICAgdGhpcy5ycG9zLnB1c2godGhpcy5yc3RhY2subGVuZ3RoKVxuICAgIHRoaXMucnN0YWNrLnB1c2gobWFwLnNoaWZ0KCkpXG5cbiAgICByZXR1cm4gclxuICB9LFxuXG4gIC8qKiBEZXNlcmlhbGl6ZXMgdGhlIGVuZCBvZiBhIG1hcC4gKi9cbiAgcmVhZE1hcEVuZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVhZEZpZWxkRW5kKClcbiAgfSxcblxuICAvKipcbiAgICAgQGNsYXNzXG4gICAgIEBuYW1lIEFub25SZWFkQ29sQmVnaW5SZXR1cm5cbiAgICAgQHByb3BlcnR5IHtUaHJpZnQuVHlwZX0gZXR5cGUgLSBUaGUgZGF0YSB0eXBlIG9mIHRoZSBlbGVtZW50LlxuICAgICBAcHJvcGVydHkge251bWJlcn0gc2l6ZSAtIFRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIGNvbGxlY3Rpb24uXG4gICAqL1xuICAvKipcbiAgICogRGVzZXJpYWxpemVzIHRoZSBiZWdpbm5pbmcgb2YgYSBsaXN0LlxuICAgKiBAcmV0dXJucyB7QW5vblJlYWRDb2xCZWdpblJldHVybn1cbiAgICovXG4gIHJlYWRMaXN0QmVnaW46IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbGlzdCA9IHRoaXMucnN0YWNrW3RoaXMucnN0YWNrLmxlbmd0aCAtIDFdXG5cbiAgICB2YXIgciA9IHt9XG4gICAgci5ldHlwZSA9IFRocmlmdC5Qcm90b2NvbC5SVHlwZVtsaXN0LnNoaWZ0KCldXG4gICAgci5zaXplID0gbGlzdC5zaGlmdCgpXG5cbiAgICB0aGlzLnJwb3MucHVzaCh0aGlzLnJzdGFjay5sZW5ndGgpXG4gICAgdGhpcy5yc3RhY2sucHVzaChsaXN0LnNoaWZ0KCkpXG5cbiAgICByZXR1cm4gclxuICB9LFxuXG4gIC8qKiBEZXNlcmlhbGl6ZXMgdGhlIGVuZCBvZiBhIGxpc3QuICovXG4gIHJlYWRMaXN0RW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZWFkRmllbGRFbmQoKVxuICB9LFxuXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZXMgdGhlIGJlZ2lubmluZyBvZiBhIHNldC5cbiAgICogQHJldHVybnMge0Fub25SZWFkQ29sQmVnaW5SZXR1cm59XG4gICAqL1xuICByZWFkU2V0QmVnaW46IGZ1bmN0aW9uIChlbGVtVHlwZSwgc2l6ZSkge1xuICAgIHJldHVybiB0aGlzLnJlYWRMaXN0QmVnaW4oZWxlbVR5cGUsIHNpemUpXG4gIH0sXG5cbiAgLyoqIERlc2VyaWFsaXplcyB0aGUgZW5kIG9mIGEgc2V0LiAqL1xuICByZWFkU2V0RW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZExpc3RFbmQoKVxuICB9LFxuXG4gIC8qKiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGEgdmFsdWUgcHJvcGVydHkgc2V0IHRvXG4gICAqICBGYWxzZSB1bmxlc3MgdGhlIG5leHQgbnVtYmVyIGluIHRoZSBwcm90b2NvbCBidWZmZXJcbiAgICogIGlzIDEsIGluIHdoaWNoIGNhc2UgdGhlIHZhbHVlIHByb3BlcnR5IGlzIFRydWUgKi9cbiAgcmVhZEJvb2w6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgciA9IHRoaXMucmVhZEkzMigpXG5cbiAgICBpZiAociAhPT0gbnVsbCAmJiByLnZhbHVlID09IFwiMVwiKSB7XG4gICAgICByLnZhbHVlID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICByLnZhbHVlID0gZmFsc2VcbiAgICB9XG5cbiAgICByZXR1cm4gclxuICB9LFxuXG4gIC8qKiBSZXR1cm5zIHRoZSBhbiBvYmplY3Qgd2l0aCBhIHZhbHVlIHByb3BlcnR5IHNldCB0byB0aGVcbiAgICAgIG5leHQgdmFsdWUgZm91bmQgaW4gdGhlIHByb3RvY29sIGJ1ZmZlciAqL1xuICByZWFkQnl0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnJlYWRJMzIoKVxuICB9LFxuXG4gIC8qKiBSZXR1cm5zIHRoZSBhbiBvYmplY3Qgd2l0aCBhIHZhbHVlIHByb3BlcnR5IHNldCB0byB0aGVcbiAgICAgIG5leHQgdmFsdWUgZm91bmQgaW4gdGhlIHByb3RvY29sIGJ1ZmZlciAqL1xuICByZWFkSTE2OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZEkzMigpXG4gIH0sXG5cbiAgLyoqIFJldHVybnMgdGhlIGFuIG9iamVjdCB3aXRoIGEgdmFsdWUgcHJvcGVydHkgc2V0IHRvIHRoZVxuICAgICAgbmV4dCB2YWx1ZSBmb3VuZCBpbiB0aGUgcHJvdG9jb2wgYnVmZmVyICovXG4gIHJlYWRJMzI6IGZ1bmN0aW9uIChmKSB7XG4gICAgaWYgKGYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZiA9IHRoaXMucnN0YWNrW3RoaXMucnN0YWNrLmxlbmd0aCAtIDFdXG4gICAgfVxuXG4gICAgdmFyIHIgPSB7fVxuXG4gICAgaWYgKGYgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgaWYgKGYubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHIudmFsdWUgPSB1bmRlZmluZWRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHIudmFsdWUgPSBmLnNoaWZ0KClcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGYgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgIGZvciAodmFyIGkgaW4gZikge1xuICAgICAgICBpZiAoaSA9PT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yc3RhY2sucHVzaChmW2ldKVxuICAgICAgICBkZWxldGUgZltpXVxuXG4gICAgICAgIHIudmFsdWUgPSBpXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHIudmFsdWUgPSBmXG4gICAgICB0aGlzLnJzdGFjay5wb3AoKVxuICAgIH1cblxuICAgIHJldHVybiByXG4gIH0sXG5cbiAgLyoqIFJldHVybnMgdGhlIGFuIG9iamVjdCB3aXRoIGEgdmFsdWUgcHJvcGVydHkgc2V0IHRvIHRoZVxuICAgICAgbmV4dCB2YWx1ZSBmb3VuZCBpbiB0aGUgcHJvdG9jb2wgYnVmZmVyICovXG4gIHJlYWRJNjQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkSTMyKClcbiAgfSxcblxuICAvKiogUmV0dXJucyB0aGUgYW4gb2JqZWN0IHdpdGggYSB2YWx1ZSBwcm9wZXJ0eSBzZXQgdG8gdGhlXG4gICAgICBuZXh0IHZhbHVlIGZvdW5kIGluIHRoZSBwcm90b2NvbCBidWZmZXIgKi9cbiAgcmVhZERvdWJsZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnJlYWRJMzIoKVxuICB9LFxuXG4gIC8qKiBSZXR1cm5zIHRoZSBhbiBvYmplY3Qgd2l0aCBhIHZhbHVlIHByb3BlcnR5IHNldCB0byB0aGVcbiAgICAgIG5leHQgdmFsdWUgZm91bmQgaW4gdGhlIHByb3RvY29sIGJ1ZmZlciAqL1xuICByZWFkU3RyaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHIgPSB0aGlzLnJlYWRJMzIoKVxuICAgIHJldHVybiByXG4gIH0sXG5cbiAgLyoqIFJldHVybnMgdGhlIGFuIG9iamVjdCB3aXRoIGEgdmFsdWUgcHJvcGVydHkgc2V0IHRvIHRoZVxuICAgICAgbmV4dCB2YWx1ZSBmb3VuZCBpbiB0aGUgcHJvdG9jb2wgYnVmZmVyICovXG4gIHJlYWRCaW5hcnk6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgciA9IHRoaXMucmVhZEkzMigpXG4gICAgci52YWx1ZSA9IGF0b2Ioci52YWx1ZSlcbiAgICByZXR1cm4gclxuICB9LFxuXG4gIC8qKlxuICAgKiBNZXRob2QgdG8gYXJiaXRyYXJpbHkgc2tpcCBvdmVyIGRhdGEgKi9cbiAgc2tpcDogZnVuY3Rpb24gKHR5cGUpIHtcbiAgICB2YXIgcmV0LCBpXG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBUaHJpZnQuVHlwZS5TVE9QOlxuICAgICAgcmV0dXJuIG51bGxcblxuICAgIGNhc2UgVGhyaWZ0LlR5cGUuQk9PTDpcbiAgICAgIHJldHVybiB0aGlzLnJlYWRCb29sKClcblxuICAgIGNhc2UgVGhyaWZ0LlR5cGUuQllURTpcbiAgICAgIHJldHVybiB0aGlzLnJlYWRCeXRlKClcblxuICAgIGNhc2UgVGhyaWZ0LlR5cGUuSTE2OlxuICAgICAgcmV0dXJuIHRoaXMucmVhZEkxNigpXG5cbiAgICBjYXNlIFRocmlmdC5UeXBlLkkzMjpcbiAgICAgIHJldHVybiB0aGlzLnJlYWRJMzIoKVxuXG4gICAgY2FzZSBUaHJpZnQuVHlwZS5JNjQ6XG4gICAgICByZXR1cm4gdGhpcy5yZWFkSTY0KClcblxuICAgIGNhc2UgVGhyaWZ0LlR5cGUuRE9VQkxFOlxuICAgICAgcmV0dXJuIHRoaXMucmVhZERvdWJsZSgpXG5cbiAgICBjYXNlIFRocmlmdC5UeXBlLlNUUklORzpcbiAgICAgIHJldHVybiB0aGlzLnJlYWRTdHJpbmcoKVxuXG4gICAgY2FzZSBUaHJpZnQuVHlwZS5TVFJVQ1Q6XG4gICAgICB0aGlzLnJlYWRTdHJ1Y3RCZWdpbigpXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICByZXQgPSB0aGlzLnJlYWRGaWVsZEJlZ2luKClcbiAgICAgICAgaWYgKHJldC5mdHlwZSA9PSBUaHJpZnQuVHlwZS5TVE9QKSB7XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNraXAocmV0LmZ0eXBlKVxuICAgICAgICB0aGlzLnJlYWRGaWVsZEVuZCgpXG4gICAgICB9XG4gICAgICB0aGlzLnJlYWRTdHJ1Y3RFbmQoKVxuICAgICAgcmV0dXJuIG51bGxcblxuICAgIGNhc2UgVGhyaWZ0LlR5cGUuTUFQOlxuICAgICAgcmV0ID0gdGhpcy5yZWFkTWFwQmVnaW4oKVxuICAgICAgZm9yIChpID0gMDsgaSA8IHJldC5zaXplOyBpKyspIHtcbiAgICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgICAgaWYgKHRoaXMucnN0YWNrLmxlbmd0aCA+IHRoaXMucnBvc1t0aGlzLnJwb3MubGVuZ3RoIC0gMV0gKyAxKSB7XG4gICAgICAgICAgICB0aGlzLnJzdGFjay5wb3AoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNraXAocmV0Lmt0eXBlKVxuICAgICAgICB0aGlzLnNraXAocmV0LnZ0eXBlKVxuICAgICAgfVxuICAgICAgdGhpcy5yZWFkTWFwRW5kKClcbiAgICAgIHJldHVybiBudWxsXG5cbiAgICBjYXNlIFRocmlmdC5UeXBlLlNFVDpcbiAgICAgIHJldCA9IHRoaXMucmVhZFNldEJlZ2luKClcbiAgICAgIGZvciAoaSA9IDA7IGkgPCByZXQuc2l6ZTsgaSsrKSB7XG4gICAgICAgIHRoaXMuc2tpcChyZXQuZXR5cGUpXG4gICAgICB9XG4gICAgICB0aGlzLnJlYWRTZXRFbmQoKVxuICAgICAgcmV0dXJuIG51bGxcblxuICAgIGNhc2UgVGhyaWZ0LlR5cGUuTElTVDpcbiAgICAgIHJldCA9IHRoaXMucmVhZExpc3RCZWdpbigpXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcmV0LnNpemU7IGkrKykge1xuICAgICAgICB0aGlzLnNraXAocmV0LmV0eXBlKVxuICAgICAgfVxuICAgICAgdGhpcy5yZWFkTGlzdEVuZCgpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxufVxuXG4vKipcbiogSW5pdGlhbGl6ZXMgYSBNdXRpbHBsZXhQcm90b2NvbCBJbXBsZW1lbnRhdGlvbiBhcyBhIFdyYXBwZXIgZm9yIFRocmlmdC5Qcm90b2NvbFxuKiBAY29uc3RydWN0b3JcbiovXG5UaHJpZnQuTXVsdGlwbGV4UHJvdG9jb2wgPSBmdW5jdGlvbiAoc3J2TmFtZSwgdHJhbnMsIHN0cmljdFJlYWQsIHN0cmljdFdyaXRlKSB7XG4gIFRocmlmdC5Qcm90b2NvbC5jYWxsKHRoaXMsIHRyYW5zLCBzdHJpY3RSZWFkLCBzdHJpY3RXcml0ZSlcbiAgdGhpcy5zZXJ2aWNlTmFtZSA9IHNydk5hbWVcbn1cblRocmlmdC5pbmhlcml0cyhUaHJpZnQuTXVsdGlwbGV4UHJvdG9jb2wsIFRocmlmdC5Qcm90b2NvbCwgXCJtdWx0aXBsZXhQcm90b2NvbFwiKVxuXG4vKiogT3ZlcnJpZGUgd3JpdGVNZXNzYWdlQmVnaW4gbWV0aG9kIG9mIHByb3RvdHlwZSAqL1xuVGhyaWZ0Lk11bHRpcGxleFByb3RvY29sLnByb3RvdHlwZS53cml0ZU1lc3NhZ2VCZWdpbiA9IGZ1bmN0aW9uIChuYW1lLCB0eXBlLCBzZXFpZCkge1xuICBpZiAodHlwZSA9PT0gVGhyaWZ0Lk1lc3NhZ2VUeXBlLkNBTEwgfHwgdHlwZSA9PT0gVGhyaWZ0Lk1lc3NhZ2VUeXBlLk9ORVdBWSkge1xuICAgIFRocmlmdC5Qcm90b2NvbC5wcm90b3R5cGUud3JpdGVNZXNzYWdlQmVnaW4uY2FsbCh0aGlzLCB0aGlzLnNlcnZpY2VOYW1lICsgXCI6XCIgKyBuYW1lLCB0eXBlLCBzZXFpZClcbiAgfSBlbHNlIHtcbiAgICBUaHJpZnQuUHJvdG9jb2wucHJvdG90eXBlLndyaXRlTWVzc2FnZUJlZ2luLmNhbGwodGhpcywgbmFtZSwgdHlwZSwgc2VxaWQpXG4gIH1cbn1cblxuVGhyaWZ0Lk11bHRpcGxleGVyID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnNlcWlkID0gMFxufVxuXG4vKiogSW5zdGFudGlhdGVzIGEgbXVsdGlwbGV4ZWQgY2xpZW50IGZvciBhIHNwZWNpZmljIHNlcnZpY2VcbiogQGNvbnN0cnVjdG9yXG4qIEBwYXJhbSB7U3RyaW5nfSBzZXJ2aWNlTmFtZSAtIFRoZSB0cmFuc3BvcnQgdG8gc2VyaWFsaXplIHRvL2Zyb20uXG4qIEBwYXJhbSB7VGhyaWZ0LlNlcnZpY2VDbGllbnR9IFNDbCAtIFRoZSBTZXJ2aWNlIENsaWVudCBDbGFzc1xuKiBAcGFyYW0ge1RocmlmdC5UcmFuc3BvcnR9IHRyYW5zcG9ydCAtIFRocmlmdC5UcmFuc3BvcnQgaW5zdGFuY2Ugd2hpY2ggcHJvdmlkZXMgcmVtb3RlIGhvc3Q6cG9ydFxuKiBAZXhhbXBsZVxuKiAgICB2YXIgbXAgPSBuZXcgVGhyaWZ0Lk11bHRpcGxleGVyKCk7XG4qICAgIHZhciB0cmFuc3BvcnQgPSBuZXcgVGhyaWZ0LlRyYW5zcG9ydChcImh0dHA6Ly9sb2NhbGhvc3Q6OTA5MC9mb28udGhyaWZ0XCIpO1xuKiAgICB2YXIgcHJvdG9jb2wgPSBuZXcgVGhyaWZ0LlByb3RvY29sKHRyYW5zcG9ydCk7XG4qICAgIHZhciBjbGllbnQgPSBtcC5jcmVhdGVDbGllbnQoJ0F1dGhTZXJ2aWNlJywgQXV0aFNlcnZpY2VDbGllbnQsIHRyYW5zcG9ydCk7XG4qL1xuVGhyaWZ0Lk11bHRpcGxleGVyLnByb3RvdHlwZS5jcmVhdGVDbGllbnQgPSBmdW5jdGlvbiAoc2VydmljZU5hbWUsIFNDbCwgdHJhbnNwb3J0KSB7XG4gIGlmIChTQ2wuQ2xpZW50KSB7XG4gICAgU0NsID0gU0NsLkNsaWVudFxuICB9XG4gIHZhciBzZWxmID0gdGhpc1xuICBTQ2wucHJvdG90eXBlLm5ld19zZXFpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLnNlcWlkICs9IDFcbiAgICByZXR1cm4gc2VsZi5zZXFpZFxuICB9XG4gIHZhciBjbGllbnQgPSBuZXcgU0NsKG5ldyBUaHJpZnQuTXVsdGlwbGV4UHJvdG9jb2woc2VydmljZU5hbWUsIHRyYW5zcG9ydCkpXG5cbiAgcmV0dXJuIGNsaWVudFxufVxuXG52YXIgY29weUxpc3QsIGNvcHlNYXBcblxuY29weUxpc3QgPSBmdW5jdGlvbiAobHN0LCB0eXBlcykge1xuICBpZiAoIWxzdCkgeyByZXR1cm4gbHN0IH1cblxuICB2YXIgdHlwZVxuXG4gIGlmICh0eXBlcy5zaGlmdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdHlwZSA9IHR5cGVzXG4gIH0gZWxzZSB7XG4gICAgdHlwZSA9IHR5cGVzWzBdXG4gIH1cbiAgdmFyIFR5cGUgPSB0eXBlXG5cbiAgdmFyIGxlbiA9IGxzdC5sZW5ndGgsIHJlc3VsdCA9IFtdLCBpLCB2YWxcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFsID0gbHN0W2ldXG4gICAgaWYgKHR5cGUgPT09IG51bGwpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHZhbClcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IGNvcHlNYXAgfHwgdHlwZSA9PT0gY29weUxpc3QpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHR5cGUodmFsLCB0eXBlcy5zbGljZSgxKSkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5wdXNoKG5ldyBUeXBlKHZhbCkpXG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHRcbn1cblxuY29weU1hcCA9IGZ1bmN0aW9uIChvYmosIHR5cGVzKSB7XG4gIGlmICghb2JqKSB7IHJldHVybiBvYmogfVxuXG4gIHZhciB0eXBlXG5cbiAgaWYgKHR5cGVzLnNoaWZ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0eXBlID0gdHlwZXNcbiAgfSBlbHNlIHtcbiAgICB0eXBlID0gdHlwZXNbMF1cbiAgfVxuICB2YXIgVHlwZSA9IHR5cGVcblxuICB2YXIgcmVzdWx0ID0ge30sIHZhbFxuICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgIHZhbCA9IG9ialtwcm9wXVxuICAgICAgaWYgKHR5cGUgPT09IG51bGwpIHtcbiAgICAgICAgcmVzdWx0W3Byb3BdID0gdmFsXG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IGNvcHlNYXAgfHwgdHlwZSA9PT0gY29weUxpc3QpIHtcbiAgICAgICAgcmVzdWx0W3Byb3BdID0gdHlwZSh2YWwsIHR5cGVzLnNsaWNlKDEpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W3Byb3BdID0gbmV3IFR5cGUodmFsKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0XG59XG5cblRocmlmdC5jb3B5TWFwID0gY29weU1hcFxuVGhyaWZ0LmNvcHlMaXN0ID0gY29weUxpc3RcblxubW9kdWxlLmV4cG9ydHMgPSBUaHJpZnRcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVzZWxlc3MtZXNjYXBlICovXG52YXIgZGV0ZWN0b3IgPSB7fVxuXG52YXIgTkFfVkVSU0lPTiA9IFwiLTFcIlxudmFyIHdpbiA9IHdpbmRvd1xudmFyIGV4dGVybmFsID0gd2luLmV4dGVybmFsXG52YXIgdXNlckFnZW50ID0gd2luLm5hdmlnYXRvci51c2VyQWdlbnQgfHwgXCJcIlxudmFyIGFwcFZlcnNpb24gPSB3aW4ubmF2aWdhdG9yLmFwcFZlcnNpb24gfHwgXCJcIlxudmFyIHZlbmRvciA9IHdpbi5uYXZpZ2F0b3IudmVuZG9yIHx8IFwiXCJcblxudmFyIHJlTXNpZSA9IC9cXGIoPzptc2llIHxpZSB8dHJpZGVudFxcL1swLTldLipydlsgOl0pKFswLTkuXSspL1xudmFyIHJlQmxhY2tiZXJyeTEwID0gL1xcYmJiMTBcXGIuKz9cXGJ2ZXJzaW9uXFwvKFtcXGQuXSspL1xudmFyIHJlQmxhY2tiZXJyeTY3ID0gL1xcYmJsYWNrYmVycnlcXGIuK1xcYnZlcnNpb25cXC8oW1xcZC5dKykvXG52YXIgcmVCbGFja2JlcnJ5NDUgPSAvXFxiYmxhY2tiZXJyeVxcZCtcXC8oW1xcZC5dKykvXG5cbmZ1bmN0aW9uIHRvU3RyaW5nIChvYmplY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpXG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0IChvYmplY3QpIHtcbiAgcmV0dXJuIHRvU3RyaW5nKG9iamVjdCkgPT09IFwiW29iamVjdCBPYmplY3RdXCJcbn1cblxuZnVuY3Rpb24gaXNGdW5jdGlvbiAob2JqZWN0KSB7XG4gIHJldHVybiB0b1N0cmluZyhvYmplY3QpID09PSBcIltvYmplY3QgRnVuY3Rpb25dXCJcbn1cblxuZnVuY3Rpb24gZWFjaCAob2JqZWN0LCBmYWN0b3J5KSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gb2JqZWN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGlmIChmYWN0b3J5LmNhbGwob2JqZWN0LCBvYmplY3RbaV0sIGkpID09PSBmYWxzZSkge1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbn1cblxuLy8g6Kej5p6Q5L2/55SoIFRyaWRlbnQg5YaF5qC455qE5rWP6KeI5Zmo55qEIGDmtY/op4jlmajmqKHlvI9gIOWSjCBg5paH5qGj5qih5byPYCDkv6Hmga/jgIJcbi8vIEBwYXJhbSB7U3RyaW5nfSB1YSwgdXNlckFnZW50IHN0cmluZy5cbi8vIEByZXR1cm4ge09iamVjdH1cbmZ1bmN0aW9uIElFTW9kZSAodWEpIHtcbiAgaWYgKCFyZU1zaWUudGVzdCh1YSkpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgdmFyIG0sXG4gICAgZW5naW5lTW9kZSwgZW5naW5lVmVyc2lvbixcbiAgICBicm93c2VyTW9kZSwgYnJvd3NlclZlcnNpb25cblxuICAgIC8vIElFOCDlj4rlhbbku6XkuIrmj5DkvpvmnIkgVHJpZGVudCDkv6Hmga/vvIxcbiAgICAvLyDpu5jorqTnmoTlhbzlrrnmqKHlvI/vvIxVQSDkuK0gVHJpZGVudCDniYjmnKzkuI3lj5HnlJ/lj5jljJbjgIJcbiAgaWYgKHVhLmluZGV4T2YoXCJ0cmlkZW50L1wiKSAhPT0gLTEpIHtcbiAgICBtID0gL1xcYnRyaWRlbnRcXC8oWzAtOS5dKykvLmV4ZWModWEpXG4gICAgaWYgKG0gJiYgbS5sZW5ndGggPj0gMikge1xuICAgICAgLy8g55yf5a6e5byV5pOO54mI5pys44CCXG4gICAgICBlbmdpbmVWZXJzaW9uID0gbVsxXVxuICAgICAgdmFyIHZWZXJzaW9uID0gbVsxXS5zcGxpdChcIi5cIilcbiAgICAgIHZWZXJzaW9uWzBdID0gcGFyc2VJbnQodlZlcnNpb25bMF0sIDEwKSArIDRcbiAgICAgIGJyb3dzZXJWZXJzaW9uID0gdlZlcnNpb24uam9pbihcIi5cIilcbiAgICB9XG4gIH1cblxuICBtID0gcmVNc2llLmV4ZWModWEpXG4gIGJyb3dzZXJNb2RlID0gbVsxXVxuICB2YXIgdk1vZGUgPSBtWzFdLnNwbGl0KFwiLlwiKVxuICBpZiAodHlwZW9mIGJyb3dzZXJWZXJzaW9uID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgYnJvd3NlclZlcnNpb24gPSBicm93c2VyTW9kZVxuICB9XG4gIHZNb2RlWzBdID0gcGFyc2VJbnQodk1vZGVbMF0sIDEwKSAtIDRcbiAgZW5naW5lTW9kZSA9IHZNb2RlLmpvaW4oXCIuXCIpXG4gIGlmICh0eXBlb2YgZW5naW5lVmVyc2lvbiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGVuZ2luZVZlcnNpb24gPSBlbmdpbmVNb2RlXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGJyb3dzZXJWZXJzaW9uOiBicm93c2VyVmVyc2lvbixcbiAgICBicm93c2VyTW9kZTogYnJvd3Nlck1vZGUsXG4gICAgZW5naW5lVmVyc2lvbjogZW5naW5lVmVyc2lvbixcbiAgICBlbmdpbmVNb2RlOiBlbmdpbmVNb2RlLFxuICAgIGNvbXBhdGlibGU6IGVuZ2luZVZlcnNpb24gIT09IGVuZ2luZU1vZGVcbiAgfVxufVxuXG4vLyDpkojlr7nlkIzmupDnmoQgVGhlV29ybGQg5ZKMIDM2MCDnmoQgZXh0ZXJuYWwg5a+56LGh6L+b6KGM5qOA5rWL44CCXG4vLyBAcGFyYW0ge1N0cmluZ30ga2V5LCDlhbPplK7lrZfvvIznlKjkuo7mo4DmtYvmtY/op4jlmajnmoTlronoo4Xot6/lvoTkuK3lh7rnjrDnmoTlhbPplK7lrZfjgIJcbi8vIEByZXR1cm4ge1VuZGVmaW5lZCxCb29sZWFuLE9iamVjdH0g6L+U5ZueIHVuZGVmaW5lZCDmiJYgZmFsc2Ug6KGo56S65qOA5rWL5pyq5ZG95Lit44CCXG5mdW5jdGlvbiBjaGVja1RXMzYwRXh0ZXJuYWwgKGtleSkge1xuICBpZiAoIWV4dGVybmFsKSB7XG4gICAgcmV0dXJuXG4gIH0gLy8gcmV0dXJuIHVuZGVmaW5lZC5cbiAgdHJ5IHtcbiAgICAvLyAzNjDlronoo4Xot6/lvoTvvJpcbiAgICAvLyBDOiU1Q1BST0dSQX4xJTVDMzYwJTVDMzYwc2UzJTVDMzYwU0UuZXhlXG4gICAgdmFyIHJ1bnBhdGggPSBleHRlcm5hbC50d0dldFJ1blBhdGgudG9Mb3dlckNhc2UoKVxuICAgIC8vIDM2MFNFIDMueCB+IDUueCBzdXBwb3J0LlxuICAgIC8vIOaatOmcsueahCBleHRlcm5hbC50d0dldFZlcnNpb24g5ZKMIGV4dGVybmFsLnR3R2V0U2VjdXJpdHlJRCDlnYfkuLogdW5kZWZpbmVk44CCXG4gICAgLy8g5Zug5q2k5Y+q6IO955SoIHRyeS9jYXRjaCDogIzml6Dms5Xkvb/nlKjnibnmgKfliKTmlq3jgIJcbiAgICB2YXIgc2VjdXJpdHkgPSBleHRlcm5hbC50d0dldFNlY3VyaXR5SUQod2luKVxuICAgIHZhciB2ZXJzaW9uID0gZXh0ZXJuYWwudHdHZXRWZXJzaW9uKHNlY3VyaXR5KVxuXG4gICAgaWYgKHJ1bnBhdGggJiYgcnVucGF0aC5pbmRleE9mKGtleSkgPT09IC0xKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgaWYgKHZlcnNpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZlcnNpb246IHZlcnNpb25cbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGV4KSB7IC8qICovIH1cbn1cblxuLy8g56Gs5Lu26K6+5aSH5L+h5oGv6K+G5Yir6KGo6L6+5byP44CCXG4vLyDkvb/nlKjmlbDnu4Tlj6/ku6XmjInkvJjlhYjnuqfmjpLluo/jgIJcbnZhciBERVZJQ0VTID0gW1xuICBbXCJub2tpYVwiLCBmdW5jdGlvbiAodWEpIHtcbiAgICAvLyDkuI3og73lsIbkuKTkuKrooajovr7lvI/lkIjlubbvvIzlm6DkuLrlj6/og73lh7rnjrAgXCJub2tpYTsgbm9raWEgOTYwXCJcbiAgICAvLyDov5nnp43mg4XlhrXkuIvkvJrkvJjlhYjor4bliKvlh7ogbm9raWEvLTFcbiAgICBpZiAodWEuaW5kZXhPZihcIm5va2lhIFwiKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiAvXFxibm9raWEgKFswLTldKyk/L1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gL1xcYm5va2lhKFthLXowLTldKyk/L1xuICAgIH1cbiAgfV0sXG4gIC8vIOS4ieaYn+aciSBBbmRyb2lkIOWSjCBXUCDorr7lpIfjgIJcbiAgW1wic2Ftc3VuZ1wiLCBmdW5jdGlvbiAodWEpIHtcbiAgICBpZiAodWEuaW5kZXhPZihcInNhbXN1bmdcIikgIT09IC0xKSB7XG4gICAgICByZXR1cm4gL1xcYnNhbXN1bmcoPzpbIFxcLV0oPzpzZ2h8Z3R8c20pKT8tKFthLXowLTldKykvXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAvXFxiKD86c2dofHNjaHxndHxzbSktKFthLXowLTldKykvXG4gICAgfVxuICB9XSxcbiAgW1wid3BcIiwgZnVuY3Rpb24gKHVhKSB7XG4gICAgcmV0dXJuIHVhLmluZGV4T2YoXCJ3aW5kb3dzIHBob25lIFwiKSAhPT0gLTEgfHxcbiAgICAgICAgICAgIHVhLmluZGV4T2YoXCJ4Ymx3cFwiKSAhPT0gLTEgfHxcbiAgICAgICAgICAgIHVhLmluZGV4T2YoXCJ6dW5ld3BcIikgIT09IC0xIHx8XG4gICAgICAgICAgICB1YS5pbmRleE9mKFwid2luZG93cyBjZVwiKSAhPT0gLTFcbiAgfV0sXG4gIFtcInBjXCIsIFwid2luZG93c1wiXSxcbiAgW1wiaXBhZFwiLCBcImlwYWRcIl0sXG4gIC8vIGlwb2Qg6KeE5YiZ5bqU572u5LqOIGlwaG9uZSDkuYvliY3jgIJcbiAgW1wiaXBvZFwiLCBcImlwb2RcIl0sXG4gIFtcImlwaG9uZVwiLCAvXFxiaXBob25lXFxifFxcYmlwaChcXGQpL10sXG4gIFtcIm1hY1wiLCBcIm1hY2ludG9zaFwiXSxcbiAgLy8g5bCP57GzXG4gIFtcIm1pXCIsIC9cXGJtaVsgXFwtXT8oW2EtejAtOSBdKyg/PSBidWlsZHxcXCkpKS9dLFxuICAvLyDnuqLnsbNcbiAgW1wiaG9uZ21pXCIsIC9cXGJobVsgXFwtXT8oW2EtejAtOV0rKS9dLFxuICBbXCJhbGl5dW5cIiwgL1xcYmFsaXl1bm9zXFxiKD86W1xcLV0oXFxkKykpPy9dLFxuICBbXCJtZWl6dVwiLCBmdW5jdGlvbiAodWEpIHtcbiAgICByZXR1cm4gdWEuaW5kZXhPZihcIm1laXp1XCIpID49IDBcbiAgICAgID8gL1xcYm1laXp1W1xcLyBdKFthLXowLTldKylcXGIvXG4gICAgICA6IC9cXGJtKFswLTljeF17MSw0fSlcXGIvXG4gIH1dLFxuICBbXCJuZXh1c1wiLCAvXFxibmV4dXMgKFswLTlzLl0rKS9dLFxuICBbXCJodWF3ZWlcIiwgZnVuY3Rpb24gKHVhKSB7XG4gICAgdmFyIHJlTWVkaWFwYWQgPSAvXFxibWVkaWFwYWQgKC4rPykoPz0gYnVpbGRcXC9odWF3ZWltZWRpYXBhZFxcYikvXG4gICAgaWYgKHVhLmluZGV4T2YoXCJodWF3ZWktaHVhd2VpXCIpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIC9cXGJodWF3ZWlcXC1odWF3ZWlcXC0oW2EtejAtOVxcLV0rKS9cbiAgICB9IGVsc2UgaWYgKHJlTWVkaWFwYWQudGVzdCh1YSkpIHtcbiAgICAgIHJldHVybiByZU1lZGlhcGFkXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAvXFxiaHVhd2VpWyBfXFwtXT8oW2EtejAtOV0rKS9cbiAgICB9XG4gIH1dLFxuICBbXCJsZW5vdm9cIiwgZnVuY3Rpb24gKHVhKSB7XG4gICAgaWYgKHVhLmluZGV4T2YoXCJsZW5vdm8tbGVub3ZvXCIpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIC9cXGJsZW5vdm9cXC1sZW5vdm9bIFxcLV0oW2EtejAtOV0rKS9cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIC9cXGJsZW5vdm9bIFxcLV0/KFthLXowLTldKykvXG4gICAgfVxuICB9XSxcbiAgLy8g5Lit5YW0XG4gIFtcInp0ZVwiLCBmdW5jdGlvbiAodWEpIHtcbiAgICBpZiAoL1xcYnp0ZVxcLVt0dV0vLnRlc3QodWEpKSB7XG4gICAgICByZXR1cm4gL1xcYnp0ZS1bdHVdWyBfXFwtXT8oW2Etc3UtejAtOVxcK10rKS9cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIC9cXGJ6dGVbIF9cXC1dPyhbYS1zdS16MC05XFwrXSspL1xuICAgIH1cbiAgfV0sXG4gIC8vIOatpeatpemrmFxuICBbXCJ2aXZvXCIsIC9cXGJ2aXZvKD86IChbYS16MC05XSspKT8vXSxcbiAgW1wiaHRjXCIsIGZ1bmN0aW9uICh1YSkge1xuICAgIGlmICgvXFxiaHRjW2EtejAtOSBfXFwtXSsoPz0gYnVpbGRcXGIpLy50ZXN0KHVhKSkge1xuICAgICAgcmV0dXJuIC9cXGJodGNbIF9cXC1dPyhbYS16MC05IF0rKD89IGJ1aWxkKSkvXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAvXFxiaHRjWyBfXFwtXT8oW2EtejAtOSBdKykvXG4gICAgfVxuICB9XSxcbiAgW1wib3Bwb1wiLCAvXFxib3Bwb1tfXShbYS16MC05XSspL10sXG4gIFtcImtvbmthXCIsIC9cXGJrb25rYVtfXFwtXShbYS16MC05XSspL10sXG4gIFtcInNvbnllcmljc3NvblwiLCAvXFxibXQoW2EtejAtOV0rKS9dLFxuICBbXCJjb29scGFkXCIsIC9cXGJjb29scGFkW18gXT8oW2EtejAtOV0rKS9dLFxuICBbXCJsZ1wiLCAvXFxibGdbXFwtXShbYS16MC05XSspL10sXG4gIFtcImFuZHJvaWRcIiwgL1xcYmFuZHJvaWRcXGJ8XFxiYWRyXFxiL10sXG4gIFtcImJsYWNrYmVycnlcIiwgZnVuY3Rpb24gKHVhKSB7XG4gICAgaWYgKHVhLmluZGV4T2YoXCJibGFja2JlcnJ5XCIpID49IDApIHtcbiAgICAgIHJldHVybiAvXFxiYmxhY2tiZXJyeVxccz8oXFxkKykvXG4gICAgfVxuICAgIHJldHVybiBcImJiMTBcIlxuICB9XVxuXVxuXG4vLyDmk43kvZzns7vnu5/kv6Hmga/or4bliKvooajovr7lvI9cbnZhciBPUyA9IFtcbiAgW1wid3BcIiwgZnVuY3Rpb24gKHVhKSB7XG4gICAgaWYgKHVhLmluZGV4T2YoXCJ3aW5kb3dzIHBob25lIFwiKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiAvXFxid2luZG93cyBwaG9uZSAoPzpvcyApPyhbMC05Ll0rKS9cbiAgICB9IGVsc2UgaWYgKHVhLmluZGV4T2YoXCJ4Ymx3cFwiKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiAvXFxieGJsd3AoWzAtOS5dKykvXG4gICAgfSBlbHNlIGlmICh1YS5pbmRleE9mKFwienVuZXdwXCIpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIC9cXGJ6dW5ld3AoWzAtOS5dKykvXG4gICAgfVxuICAgIHJldHVybiBcIndpbmRvd3MgcGhvbmVcIlxuICB9XSxcbiAgW1wid2luZG93c1wiLCAvXFxid2luZG93cyBudCAoWzAtOS5dKykvXSxcbiAgW1wibWFjb3N4XCIsIC9cXGJtYWMgb3MgeCAoWzAtOS5fXSspL10sXG4gIFtcImlvc1wiLCBmdW5jdGlvbiAodWEpIHtcbiAgICBpZiAoL1xcYmNwdSg/OiBpcGhvbmUpPyBvcyAvLnRlc3QodWEpKSB7XG4gICAgICByZXR1cm4gL1xcYmNwdSg/OiBpcGhvbmUpPyBvcyAoWzAtOS5fXSspL1xuICAgIH0gZWxzZSBpZiAodWEuaW5kZXhPZihcImlwaCBvcyBcIikgIT09IC0xKSB7XG4gICAgICByZXR1cm4gL1xcYmlwaCBvcyAoWzAtOV9dKykvXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAvXFxiaW9zXFxiL1xuICAgIH1cbiAgfV0sXG4gIFtcInl1bm9zXCIsIC9cXGJhbGl5dW5vcyAoWzAtOS5dKykvXSxcbiAgW1wiYW5kcm9pZFwiLCBmdW5jdGlvbiAodWEpIHtcbiAgICBpZiAodWEuaW5kZXhPZihcImFuZHJvaWRcIikgPj0gMCkge1xuICAgICAgcmV0dXJuIC9cXGJhbmRyb2lkWyBcXC8tXT8oWzAtOS54XSspPy9cbiAgICB9IGVsc2UgaWYgKHVhLmluZGV4T2YoXCJhZHJcIikgPj0gMCkge1xuICAgICAgaWYgKHVhLmluZGV4T2YoXCJtcXFicm93c2VyXCIpID49IDApIHtcbiAgICAgICAgcmV0dXJuIC9cXGJhZHJbIF1cXChsaW51eDsgdTsgKFswLTkuXSspPy9cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAvXFxiYWRyKD86WyBdKFswLTkuXSspKT8vXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBcImFuZHJvaWRcIlxuICAgIC8vIHJldHVybiAvXFxiKD86YW5kcm9pZHxcXGJhZHIpKD86W1xcL1xcLSBdKD86XFwobGludXg7IHU7ICk/KT8oWzAtOS54XSspPy87XG4gIH1dLFxuICBbXCJjaHJvbWVvc1wiLCAvXFxiY3JvcyBpNjg2IChbMC05Ll0rKS9dLFxuICBbXCJsaW51eFwiLCBcImxpbnV4XCJdLFxuICBbXCJ3aW5kb3dzY2VcIiwgL1xcYndpbmRvd3MgY2UoPzogKFswLTkuXSspKT8vXSxcbiAgW1wic3ltYmlhblwiLCAvXFxic3ltYmlhbig/Om9zKT9cXC8oWzAtOS5dKykvXSxcbiAgW1wiYmxhY2tiZXJyeVwiLCBmdW5jdGlvbiAodWEpIHtcbiAgICB2YXIgbSA9IHVhLm1hdGNoKHJlQmxhY2tiZXJyeTEwKSB8fFxuICAgICAgICAgICAgdWEubWF0Y2gocmVCbGFja2JlcnJ5NjcpIHx8XG4gICAgICAgICAgICB1YS5tYXRjaChyZUJsYWNrYmVycnk0NSlcbiAgICByZXR1cm4gbSA/IHtcbiAgICAgIHZlcnNpb246IG1bMV1cbiAgICB9IDogXCJibGFja2JlcnJ5XCJcbiAgfV1cbl1cblxuLy8g5rWP6KeI5Zmo5byV5pOO57G75Z6LXG52YXIgRU5HSU5FID0gW1xuICBbXCJlZGdlaHRtbFwiLCAvZWRnZVxcLyhbMC05Ll0rKS9dLFxuICBbXCJ0cmlkZW50XCIsIHJlTXNpZV0sXG4gIFtcImJsaW5rXCIsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gXCJjaHJvbWVcIiBpbiB3aW4gJiYgXCJDU1NcIiBpbiB3aW4gJiYgL1xcYmFwcGxld2Via2l0W1xcL10/KFswLTkuK10rKS9cbiAgfV0sXG4gIFtcIndlYmtpdFwiLCAvXFxiYXBwbGV3ZWJraXRbXFwvXT8oWzAtOS4rXSspL10sXG4gIFtcImdlY2tvXCIsIGZ1bmN0aW9uICh1YSkge1xuICAgIHZhciBtYXRjaFxuICAgIGlmICgobWF0Y2ggPSB1YS5tYXRjaCgvXFxicnY6KFtcXGRcXHcuXSspLipcXGJnZWNrb1xcLyhcXGQrKS8pKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmVyc2lvbjogbWF0Y2hbMV0gKyBcIi5cIiArIG1hdGNoWzJdXG4gICAgICB9XG4gICAgfVxuICB9XSxcbiAgW1wicHJlc3RvXCIsIC9cXGJwcmVzdG9cXC8oWzAtOS5dKykvXSxcbiAgW1wiYW5kcm9pZHdlYmtpdFwiLCAvXFxiYW5kcm9pZHdlYmtpdFxcLyhbMC05Ll0rKS9dLFxuICBbXCJjb29scGFkd2Via2l0XCIsIC9cXGJjb29scGFkd2Via2l0XFwvKFswLTkuXSspL10sXG4gIFtcInUyXCIsIC9cXGJ1MlxcLyhbMC05Ll0rKS9dLFxuICBbXCJ1M1wiLCAvXFxidTNcXC8oWzAtOS5dKykvXVxuXVxuXG4vLyDmtY/op4jlmajnsbvlnotcbnZhciBCUk9XU0VSID0gW1xuICAvLyBNaWNyb3NvZnQgRWRnZSBCcm93c2VyLCBEZWZhdWx0IGJyb3dzZXIgaW4gV2luZG93cyAxMC5cbiAgW1wiZWRnZVwiLCAvZWRnZVxcLyhbMC05Ll0rKS9dLFxuICAvLyBTb2dvdS5cbiAgW1wic29nb3VcIiwgZnVuY3Rpb24gKHVhKSB7XG4gICAgaWYgKHVhLmluZGV4T2YoXCJzb2dvdW1vYmlsZWJyb3dzZXJcIikgPj0gMCkge1xuICAgICAgcmV0dXJuIC9zb2dvdW1vYmlsZWJyb3dzZXJcXC8oWzAtOS5dKykvXG4gICAgfSBlbHNlIGlmICh1YS5pbmRleE9mKFwic29nb3Vtc2VcIikgPj0gMCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIC8gc2UgKFswLTkueF0rKS9cbiAgfV0sXG4gIC8vIFRoZVdvcmxkICjkuJbnlYzkuYvnqpcpXG4gIC8vIOeUseS6juijmeW4puWFs+ezu++8jFRoZVdvcmxkIEFQSSDkuI4gMzYwIOmrmOW6pumHjeWQiOOAglxuICAvLyDlj6rog73pgJrov4cgVUEg5ZKM56iL5bqP5a6J6KOF6Lev5b6E5Lit55qE5bqU55So56iL5bqP5ZCN5p2l5Yy65YiG44CCXG4gIC8vIFRoZVdvcmxkIOeahCBVQSDmr5QgMzYwIOabtOmdoOiwse+8jOaJgOacieWwhiBUaGVXb3JsZCDnmoTop4TliJnmlL7nva7liLAgMzYwIOS5i+WJjeOAglxuICBbXCJ0aGV3b3JsZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHggPSBjaGVja1RXMzYwRXh0ZXJuYWwoXCJ0aGV3b3JsZFwiKVxuICAgIGlmICh0eXBlb2YgeCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuIHhcbiAgICB9XG4gICAgcmV0dXJuIFwidGhld29ybGRcIlxuICB9XSxcbiAgLy8gMzYwU0UsIDM2MEVFLlxuICBbXCIzNjBcIiwgZnVuY3Rpb24gKHVhKSB7XG4gICAgdmFyIHggPSBjaGVja1RXMzYwRXh0ZXJuYWwoXCIzNjBzZVwiKVxuICAgIGlmICh0eXBlb2YgeCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuIHhcbiAgICB9XG4gICAgaWYgKHVhLmluZGV4T2YoXCIzNjAgYXBob25lIGJyb3dzZXJcIikgIT09IC0xKSB7XG4gICAgICByZXR1cm4gL1xcYjM2MCBhcGhvbmUgYnJvd3NlciBcXCgoW15cXCldKylcXCkvXG4gICAgfVxuICAgIHJldHVybiAvXFxiMzYwKD86c2V8ZWV8Y2hyb21lfGJyb3dzZXIpXFxiL1xuICB9XSxcbiAgLy8gTWF4dGhvblxuICBbXCJtYXh0aG9uXCIsIGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKGV4dGVybmFsICYmIChleHRlcm5hbC5teFZlcnNpb24gfHwgZXh0ZXJuYWwubWF4X3ZlcnNpb24pKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmVyc2lvbjogZXh0ZXJuYWwubXhWZXJzaW9uIHx8IGV4dGVybmFsLm1heF92ZXJzaW9uXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChleCkgeyAvKiAqLyB9XG4gICAgcmV0dXJuIC9cXGIoPzptYXh0aG9ufG14YnJvd3NlcikoPzpbIFxcL10oWzAtOS5dKykpPy9cbiAgfV0sXG4gIFtcIm1pY3JvbWVzc2VuZ2VyXCIsIC9cXGJtaWNyb21lc3NlbmdlclxcLyhbXFxkLl0rKS9dLFxuICBbXCJxcVwiLCAvXFxibT9xcWJyb3dzZXJcXC8oWzAtOS5dKykvXSxcbiAgW1wiZ3JlZW5cIiwgXCJncmVlbmJyb3dzZXJcIl0sXG4gIFtcInR0XCIsIC9cXGJ0ZW5jZW50dHJhdmVsZXIgKFswLTkuXSspL10sXG4gIFtcImxpZWJhb1wiLCBmdW5jdGlvbiAodWEpIHtcbiAgICBpZiAodWEuaW5kZXhPZihcImxpZWJhb2Zhc3RcIikgPj0gMCkge1xuICAgICAgcmV0dXJuIC9cXGJsaWViYW9mYXN0XFwvKFswLTkuXSspL1xuICAgIH1cbiAgICBpZiAodWEuaW5kZXhPZihcImxiYnJvd3NlclwiKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICB2YXIgdmVyc2lvblxuICAgIHRyeSB7XG4gICAgICBpZiAoZXh0ZXJuYWwgJiYgZXh0ZXJuYWwuTGllYmFvR2V0VmVyc2lvbikge1xuICAgICAgICB2ZXJzaW9uID0gZXh0ZXJuYWwuTGllYmFvR2V0VmVyc2lvbigpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXgpIHsgLyogKi8gfVxuICAgIHJldHVybiB7XG4gICAgICB2ZXJzaW9uOiB2ZXJzaW9uIHx8IE5BX1ZFUlNJT05cbiAgICB9XG4gIH1dLFxuICBbXCJ0YW9cIiwgL1xcYnRhb2Jyb3dzZXJcXC8oWzAtOS5dKykvXSxcbiAgW1wiY29vbG5vdm9cIiwgL1xcYmNvb2xub3ZvXFwvKFswLTkuXSspL10sXG4gIFtcInNhYXlhYVwiLCBcInNhYXlhYVwiXSxcbiAgLy8g5pyJ5Z+65LqOIENocm9tbml1biDnmoTmgKXpgJ/mqKHlvI/lkozln7rkuo4gSUUg55qE5YW85a655qih5byP44CC5b+F6aG75ZyoIElFIOeahOinhOWImeS5i+WJjeOAglxuICBbXCJiYWlkdVwiLCAvXFxiKD86YmE/aWR1YnJvd3NlcnxiYWlkdWhkKVsgXFwvXShbMC05LnhdKykvXSxcbiAgLy8g5ZCO6Z2i5Lya5YGa5L+u5aSN54mI5pys5Y+377yM6L+Z6YeM5Y+q6KaB6IO96K+G5Yir5pivIElFIOWNs+WPr+OAglxuICBbXCJpZVwiLCByZU1zaWVdLFxuICBbXCJtaVwiLCAvXFxibWl1aWJyb3dzZXJcXC8oWzAtOS5dKykvXSxcbiAgLy8gT3BlcmEgMTUg5LmL5ZCO5byA5aeL5L2/55SoIENocm9tbml1biDlhoXmoLjvvIzpnIDopoHmlL7lnKggQ2hyb21lIOeahOinhOWImeS5i+WJjeOAglxuICBbXCJvcGVyYVwiLCBmdW5jdGlvbiAodWEpIHtcbiAgICB2YXIgcmVPcGVyYU9sZCA9IC9cXGJvcGVyYS4rdmVyc2lvblxcLyhbMC05LmFiXSspL1xuICAgIHZhciByZU9wZXJhTmV3ID0gL1xcYm9wclxcLyhbMC05Ll0rKS9cbiAgICByZXR1cm4gcmVPcGVyYU9sZC50ZXN0KHVhKSA/IHJlT3BlcmFPbGQgOiByZU9wZXJhTmV3XG4gIH1dLFxuICBbXCJvdXBlbmdcIiwgL1xcYm91cGVuZ1xcLyhbMC05Ll0rKS9dLFxuICBbXCJ5YW5kZXhcIiwgL3lhYnJvd3NlclxcLyhbMC05Ll0rKS9dLFxuICAvLyDmlK/ku5jlrp3miYvmnLrlrqLmiLfnq69cbiAgW1wiYWxpLWFwXCIsIGZ1bmN0aW9uICh1YSkge1xuICAgIGlmICh1YS5pbmRleE9mKFwiYWxpYXBwXCIpID4gMCkge1xuICAgICAgcmV0dXJuIC9cXGJhbGlhcHBcXChhcFxcLyhbMC05Ll0rKVxcKS9cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIC9cXGJhbGlwYXljbGllbnRcXC8oWzAtOS5dKylcXGIvXG4gICAgfVxuICB9XSxcbiAgLy8g5pSv5LuY5a6d5bmz5p2/5a6i5oi356uvXG4gIFtcImFsaS1hcC1wZFwiLCAvXFxiYWxpYXBwXFwoYXAtcGRcXC8oWzAtOS5dKylcXCkvXSxcbiAgLy8g5pSv5LuY5a6d5ZWG5oi35a6i5oi356uvXG4gIFtcImFsaS1hbVwiLCAvXFxiYWxpYXBwXFwoYW1cXC8oWzAtOS5dKylcXCkvXSxcbiAgLy8g5reY5a6d5omL5py65a6i5oi356uvXG4gIFtcImFsaS10YlwiLCAvXFxiYWxpYXBwXFwodGJcXC8oWzAtOS5dKylcXCkvXSxcbiAgLy8g5reY5a6d5bmz5p2/5a6i5oi356uvXG4gIFtcImFsaS10Yi1wZFwiLCAvXFxiYWxpYXBwXFwodGItcGRcXC8oWzAtOS5dKylcXCkvXSxcbiAgLy8g5aSp54yr5omL5py65a6i5oi356uvXG4gIFtcImFsaS10bVwiLCAvXFxiYWxpYXBwXFwodG1cXC8oWzAtOS5dKylcXCkvXSxcbiAgLy8g5aSp54yr5bmz5p2/5a6i5oi356uvXG4gIFtcImFsaS10bS1wZFwiLCAvXFxiYWxpYXBwXFwodG0tcGRcXC8oWzAtOS5dKylcXCkvXSxcbiAgLy8gVUMg5rWP6KeI5Zmo77yM5Y+v6IO95Lya6KKr6K+G5Yir5Li6IEFuZHJvaWQg5rWP6KeI5Zmo77yM6KeE5YiZ6ZyA6KaB5YmN572u44CCXG4gIC8vIFVDIOahjOmdoueJiOa1j+iniOWZqOaQuuW4piBDaHJvbWUg5L+h5oGv77yM6ZyA6KaB5pS+5ZyoIENocm9tZSDkuYvliY3jgIJcbiAgW1widWNcIiwgZnVuY3Rpb24gKHVhKSB7XG4gICAgaWYgKHVhLmluZGV4T2YoXCJ1Y2Jyb3dzZXIvXCIpID49IDApIHtcbiAgICAgIHJldHVybiAvXFxidWNicm93c2VyXFwvKFswLTkuXSspL1xuICAgIH0gZWxzZSBpZiAodWEuaW5kZXhPZihcInVicm93c2VyL1wiKSA+PSAwKSB7XG4gICAgICByZXR1cm4gL1xcYnVicm93c2VyXFwvKFswLTkuXSspL1xuICAgIH0gZWxzZSBpZiAoL1xcYnVjXFwvWzAtOV0vLnRlc3QodWEpKSB7XG4gICAgICByZXR1cm4gL1xcYnVjXFwvKFswLTkuXSspL1xuICAgIH0gZWxzZSBpZiAodWEuaW5kZXhPZihcInVjd2ViXCIpID49IDApIHtcbiAgICAgIC8vIGB1Y3dlYi8yLjBgIGlzIGNvbXBvbnkgaW5mby5cbiAgICAgIC8vIGBVQ1dFQjguNy4yLjIxNC8xNDUvODAwYCBpcyBicm93c2VyIGluZm8uXG4gICAgICByZXR1cm4gL1xcYnVjd2ViKFswLTkuXSspPy9cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIC9cXGIoPzp1Y2Jyb3dzZXJ8dWMpXFxiL1xuICAgIH1cbiAgfV0sXG4gIFtcImNocm9tZVwiLCAvICg/OmNocm9tZXxjcmlvc3xjcm1vKVxcLyhbMC05Ll0rKS9dLFxuICAvLyBBbmRyb2lkIOm7mOiupOa1j+iniOWZqOOAguivpeinhOWImemcgOimgeWcqCBzYWZhcmkg5LmL5YmN44CCXG4gIFtcImFuZHJvaWRcIiwgZnVuY3Rpb24gKHVhKSB7XG4gICAgaWYgKHVhLmluZGV4T2YoXCJhbmRyb2lkXCIpID09PSAtMSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHJldHVybiAvXFxidmVyc2lvblxcLyhbMC05Ll0rKD86IGJldGEpPykvXG4gIH1dLFxuICBbXCJibGFja2JlcnJ5XCIsIGZ1bmN0aW9uICh1YSkge1xuICAgIHZhciBtID0gdWEubWF0Y2gocmVCbGFja2JlcnJ5MTApIHx8XG4gICAgICAgICAgICB1YS5tYXRjaChyZUJsYWNrYmVycnk2NykgfHxcbiAgICAgICAgICAgIHVhLm1hdGNoKHJlQmxhY2tiZXJyeTQ1KVxuICAgIHJldHVybiBtID8ge1xuICAgICAgdmVyc2lvbjogbVsxXVxuICAgIH0gOiBcImJsYWNrYmVycnlcIlxuICB9XSxcbiAgW1wic2FmYXJpXCIsIC9cXGJ2ZXJzaW9uXFwvKFswLTkuXSsoPzogYmV0YSk/KSg/OiBtb2JpbGUoPzpcXC9bYS16MC05XSspPyk/IHNhZmFyaVxcLy9dLFxuICAvLyDlpoLmnpzkuI3og73ooqvor4bliKvkuLogU2FmYXJp77yM5YiZ54yc5rWL5pivIFdlYlZpZXfjgIJcbiAgW1wid2Vidmlld1wiLCAvXFxiY3B1KD86IGlwaG9uZSk/IG9zICg/OlswLTkuX10rKS4rXFxiYXBwbGV3ZWJraXRcXGIvXSxcbiAgW1wiZmlyZWZveFwiLCAvXFxiZmlyZWZveFxcLyhbMC05LmFiXSspL10sXG4gIFtcIm5va2lhXCIsIC9cXGJub2tpYWJyb3dzZXJcXC8oWzAtOS5dKykvXVxuXVxuXG52YXIgbmEgPSB7XG4gIG5hbWU6IFwibmFcIixcbiAgdmVyc2lvbjogTkFfVkVSU0lPTlxufVxuXG4vLyBVc2VyQWdlbnQgRGV0ZWN0b3IuXG4vLyBAcGFyYW0ge1N0cmluZ30gdWEsIHVzZXJBZ2VudC5cbi8vIEBwYXJhbSB7T2JqZWN0fSBleHByZXNzaW9uXG4vLyBAcmV0dXJuIHtPYmplY3R9XG4vLyAgICDov5Tlm54gbnVsbCDooajnpLrlvZPliY3ooajovr7lvI/mnKrljLnphY3miJDlip/jgIJcbmZ1bmN0aW9uIGRldGVjdCAobmFtZSwgZXhwcmVzc2lvbiwgdWEpIHtcbiAgdmFyIGV4cHIgPSBpc0Z1bmN0aW9uKGV4cHJlc3Npb24pID8gZXhwcmVzc2lvbi5jYWxsKG51bGwsIHVhKSA6IGV4cHJlc3Npb25cbiAgaWYgKCFleHByKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICB2YXIgaW5mbyA9IHtcbiAgICBuYW1lOiBuYW1lLFxuICAgIHZlcnNpb246IE5BX1ZFUlNJT04sXG4gICAgY29kZW5hbWU6IFwiXCJcbiAgfVxuICB2YXIgdCA9IHRvU3RyaW5nKGV4cHIpXG4gIGlmIChleHByID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGluZm9cbiAgfSBlbHNlIGlmICh0ID09PSBcIltvYmplY3QgU3RyaW5nXVwiKSB7XG4gICAgaWYgKHVhLmluZGV4T2YoZXhwcikgIT09IC0xKSB7XG4gICAgICByZXR1cm4gaW5mb1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChleHByKSkgeyAvLyBPYmplY3RcbiAgICBpZiAoZXhwci5oYXNPd25Qcm9wZXJ0eShcInZlcnNpb25cIikpIHtcbiAgICAgIGluZm8udmVyc2lvbiA9IGV4cHIudmVyc2lvblxuICAgIH1cbiAgICByZXR1cm4gaW5mb1xuICB9IGVsc2UgaWYgKGV4cHIuZXhlYykgeyAvLyBSZWdFeHBcbiAgICB2YXIgbSA9IGV4cHIuZXhlYyh1YSlcbiAgICBpZiAobSkge1xuICAgICAgaWYgKG0ubGVuZ3RoID49IDIgJiYgbVsxXSkge1xuICAgICAgICBpbmZvLnZlcnNpb24gPSBtWzFdLnJlcGxhY2UoL18vZywgXCIuXCIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmZvLnZlcnNpb24gPSBOQV9WRVJTSU9OXG4gICAgICB9XG4gICAgICByZXR1cm4gaW5mb1xuICAgIH1cbiAgfVxufVxuXG4vLyDliJ3lp4vljJbor4bliKvjgIJcbmZ1bmN0aW9uIGluaXQgKHVhLCBwYXR0ZXJucywgZmFjdG9yeSwgZGV0ZWN0b3IpIHtcbiAgdmFyIGRldGVjdGVkID0gbmFcbiAgZWFjaChwYXR0ZXJucywgZnVuY3Rpb24gKHBhdHRlcm4pIHtcbiAgICB2YXIgZCA9IGRldGVjdChwYXR0ZXJuWzBdLCBwYXR0ZXJuWzFdLCB1YSlcbiAgICBpZiAoZCkge1xuICAgICAgZGV0ZWN0ZWQgPSBkXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH0pXG4gIGZhY3RvcnkuY2FsbChkZXRlY3RvciwgZGV0ZWN0ZWQubmFtZSwgZGV0ZWN0ZWQudmVyc2lvbilcbn1cblxuLy8g6Kej5p6QIFVzZXJBZ2VudCDlrZfnrKbkuLJcbi8vIEBwYXJhbSB7U3RyaW5nfSB1YSwgdXNlckFnZW50IHN0cmluZy5cbi8vIEByZXR1cm4ge09iamVjdH1cbnZhciBwYXJzZSA9IGZ1bmN0aW9uICh1YSkge1xuICB1YSA9ICh1YSB8fCBcIlwiKS50b0xvd2VyQ2FzZSgpXG4gIHZhciBkID0ge31cblxuICBpbml0KHVhLCBERVZJQ0VTLCBmdW5jdGlvbiAobmFtZSwgdmVyc2lvbikge1xuICAgIHZhciB2ID0gcGFyc2VGbG9hdCh2ZXJzaW9uKVxuICAgIGQuZGV2aWNlID0ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHZlcnNpb246IHYsXG4gICAgICBmdWxsVmVyc2lvbjogdmVyc2lvblxuICAgIH1cbiAgICBkLmRldmljZVtuYW1lXSA9IHZcbiAgfSwgZClcblxuICBpbml0KHVhLCBPUywgZnVuY3Rpb24gKG5hbWUsIHZlcnNpb24pIHtcbiAgICB2YXIgdiA9IHBhcnNlRmxvYXQodmVyc2lvbilcbiAgICBkLm9zID0ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHZlcnNpb246IHYsXG4gICAgICBmdWxsVmVyc2lvbjogdmVyc2lvblxuICAgIH1cbiAgICBkLm9zW25hbWVdID0gdlxuICB9LCBkKVxuXG4gIHZhciBpZUNvcmUgPSBJRU1vZGUodWEpXG5cbiAgaW5pdCh1YSwgRU5HSU5FLCBmdW5jdGlvbiAobmFtZSwgdmVyc2lvbikge1xuICAgIHZhciBtb2RlID0gdmVyc2lvblxuICAgIC8vIElFIOWGheaguOeahOa1j+iniOWZqO+8jOS/ruWkjeeJiOacrOWPt+WPiuWFvOWuueaooeW8j+OAglxuICAgIGlmIChpZUNvcmUpIHtcbiAgICAgIHZlcnNpb24gPSBpZUNvcmUuZW5naW5lVmVyc2lvbiB8fCBpZUNvcmUuZW5naW5lTW9kZVxuICAgICAgbW9kZSA9IGllQ29yZS5lbmdpbmVNb2RlXG4gICAgfVxuICAgIHZhciB2ID0gcGFyc2VGbG9hdCh2ZXJzaW9uKVxuICAgIGQuZW5naW5lID0ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHZlcnNpb246IHYsXG4gICAgICBmdWxsVmVyc2lvbjogdmVyc2lvbixcbiAgICAgIG1vZGU6IHBhcnNlRmxvYXQobW9kZSksXG4gICAgICBmdWxsTW9kZTogbW9kZSxcbiAgICAgIGNvbXBhdGlibGU6IGllQ29yZSA/IGllQ29yZS5jb21wYXRpYmxlIDogZmFsc2VcbiAgICB9XG4gICAgZC5lbmdpbmVbbmFtZV0gPSB2XG4gIH0sIGQpXG5cbiAgaW5pdCh1YSwgQlJPV1NFUiwgZnVuY3Rpb24gKG5hbWUsIHZlcnNpb24pIHtcbiAgICB2YXIgbW9kZSA9IHZlcnNpb25cbiAgICAvLyBJRSDlhoXmoLjnmoTmtY/op4jlmajvvIzkv67lpI3mtY/op4jlmajniYjmnKzlj4rlhbzlrrnmqKHlvI/jgIJcbiAgICBpZiAoaWVDb3JlKSB7XG4gICAgICAvLyDku4Xkv67mlLkgSUUg5rWP6KeI5Zmo55qE54mI5pys77yM5YW25LuWIElFIOWGheaguOeahOeJiOacrOS4jeS/ruaUueOAglxuICAgICAgaWYgKG5hbWUgPT09IFwiaWVcIikge1xuICAgICAgICB2ZXJzaW9uID0gaWVDb3JlLmJyb3dzZXJWZXJzaW9uXG4gICAgICB9XG4gICAgICBtb2RlID0gaWVDb3JlLmJyb3dzZXJNb2RlXG4gICAgfVxuICAgIHZhciB2ID0gcGFyc2VGbG9hdCh2ZXJzaW9uKVxuICAgIGQuYnJvd3NlciA9IHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICB2ZXJzaW9uOiB2LFxuICAgICAgZnVsbFZlcnNpb246IHZlcnNpb24sXG4gICAgICBtb2RlOiBwYXJzZUZsb2F0KG1vZGUpLFxuICAgICAgZnVsbE1vZGU6IG1vZGUsXG4gICAgICBjb21wYXRpYmxlOiBpZUNvcmUgPyBpZUNvcmUuY29tcGF0aWJsZSA6IGZhbHNlXG4gICAgfVxuICAgIGQuYnJvd3NlcltuYW1lXSA9IHZcbiAgfSwgZClcblxuICByZXR1cm4gZFxufVxuXG5kZXRlY3RvciA9IHBhcnNlKHVzZXJBZ2VudCArIFwiIFwiICsgYXBwVmVyc2lvbiArIFwiIFwiICsgdmVuZG9yKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRldGVjdG9yXG4iLCIvLyBBdXRob3I6IEF3ZXlcbi8vIGVtYWlsOiBjaGVud2VpMUByb25nY2FwaXRhbC5jblxuO1xudmFyIF9fYWpheEhhY2tlciA9IChmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGlzRnVuYyAoZikge1xuICAgIHJldHVybiBmICYmIHR5cGVvZiBmID09PSBcImZ1bmN0aW9uXCJcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFJlYWRPbmx5UHJvcHNGcm9tWGhyIChoYWpheCwgeGhyKSB7XG4gICAgdmFyIHByb3BzID0ge1xuICAgICAgVU5TRU5UOiAwLFxuICAgICAgT1BFTkVEOiAxLFxuICAgICAgSEVBREVSU19fUkVDRUlWRUQ6IDIsXG4gICAgICBMT0FESU5HOiAzLFxuICAgICAgRE9ORTogNCxcbiAgICAgIHJlYWR5U3RhdGU6IG51bGwsXG4gICAgICBzdGF0dXM6IDAsXG4gICAgICBzdGF0dXNUZXh0OiBcIlwiLFxuICAgICAgcmVzcG9uc2U6IFwiXCIsXG4gICAgICByZXNwb25zZVRleHQ6IFwiXCIsXG4gICAgICByZXNwb25zZVVSTDogXCJcIixcbiAgICAgIHJlc3BvbnNlWE1MOiBudWxsXG4gICAgfVxuICAgIGZvciAodmFyIGtleSBpbiBwcm9wcykge1xuICAgICAgaGFqYXhba2V5XSA9IHByb3BzW2tleV1cbiAgICAgIGlmICh4aHIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBoYWpheFtrZXldID0geGhyW2tleV1cbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhZGRFdmVudFByb3BzICh4aHIsIGlzVXBsb2FkKSB7XG4gICAgeGhyLm9uYWJvcnQgPSBudWxsXG4gICAgeGhyLm9uZXJyb3IgPSBudWxsXG4gICAgeGhyLm9ubG9hZCA9IG51bGxcbiAgICB4aHIub25sb2FkZW5kID0gbnVsbFxuICAgIHhoci5vbmxvYWRzdGFydCA9IG51bGxcbiAgICB4aHIub25wcm9ncmVzcyA9IG51bGxcbiAgICB4aHIub250aW1lb3V0ID0gbnVsbFxuICAgIGlmICghaXNVcGxvYWQpIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsXG4gICAgeGhyLl9fZXZlbnRzID0ge1xuICAgICAgYWJvcnQ6IFtdLFxuICAgICAgZXJyb3I6IFtdLFxuICAgICAgbG9hZDogW10sXG4gICAgICBsb2FkZW5kOiBbXSxcbiAgICAgIGxvYWRzdGFydDogW10sXG4gICAgICBwcm9ncmVzczogW10sXG4gICAgICB0aW1lb3V0OiBbXSxcbiAgICAgIHJlYWR5c3RhdGVjaGFuZ2U6IFtdXG4gICAgfVxuICAgIGlmICghaXNVcGxvYWQpIHhoci5fX2V2ZW50cy5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBbXVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdEJhc2VFdmVudCAoX3RoaXMpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gX3RoaXMuX19ldmVudHMpIHtcbiAgICAgIF90aGlzLl9fZXZlbnRzW2tleV1bMF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNldFJlYWRPbmx5UHJvcHNGcm9tWGhyKF90aGlzLCBfdGhpcy5fX3hocilcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVFdmVudCAoX3RoaXMsIHR5cGUsIGNvbmZpZywgaXNVcGxvYWQpIHtcbiAgICB2YXIgYXJkVHlwZSA9IHR5cGUuc3Vic3RyaW5nKDIpIC8vIGFkZEV2ZW50TGlzdGVuZXIvcmVtb3ZlRXZlbnRMaXN0ZW5lci9kaXNwYXRjaEV2ZW50XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfX2FyZ3VtZW50cyA9IGFyZ3VtZW50c1xuICAgICAgdmFyIGFyZ3MgPSBbXVxuICAgICAgdmFyIG5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHRyaWdnZXIgYXJkVHlwZVxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IF90aGlzLl9fZXZlbnRzW2FyZFR5cGVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgLy8gaWYgKGlzRnVuYyhfdGhpcy5fX2V2ZW50c1thcmRUeXBlXVtpXSkpIF90aGlzLl9fZXZlbnRzW2FyZFR5cGVdW2ldLmFwcGx5KF90aGlzLl9feGhyLCBhcmdzKVxuICAgICAgICAgIGlmIChpc0Z1bmMoX3RoaXMuX19ldmVudHNbYXJkVHlwZV1baV0pKSBfdGhpcy5fX2V2ZW50c1thcmRUeXBlXVtpXS5hcHBseShfdGhpcywgYXJncylcbiAgICAgICAgfVxuICAgICAgICAvLyB0cmlnZ2VyIG9uVHlwZVxuICAgICAgICBpZiAoaXNGdW5jKF90aGlzW3R5cGVdKSkge1xuICAgICAgICAgIC8vIF90aGlzW3R5cGVdLmFwcGx5KF90aGlzLl9feGhyLCBfX2FyZ3VtZW50cykgLy8gZ2l2ZSB4aHIgYmFjayB3aGVuIGNhbGxpbmcgZXZlbnRzXG4gICAgICAgICAgX3RoaXNbdHlwZV0uYXBwbHkoX3RoaXMsIF9fYXJndW1lbnRzKSAvLyBnaXZlIHhociBiYWNrIHdoZW4gY2FsbGluZyBldmVudHNcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gZmlyc3QgdHJpZ2dlciBiYXNlIGV2ZW50IHRvIGNoYW5nZSBoYWpheCBzdGF0dXNcbiAgICAgIC8vIF90aGlzLl9fZXZlbnRzW2FyZFR5cGVdWzBdLmFwcGx5KF90aGlzLl9feGhyLCBhcmdzKVxuICAgICAgX3RoaXMuX19ldmVudHNbYXJkVHlwZV1bMF0uYXBwbHkoX3RoaXMsIGFyZ3MpXG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pXG4gICAgICB9XG4gICAgICBpZiAoaXNGdW5jKGNvbmZpZ1t0eXBlXSkpIHtcbiAgICAgICAgYXJncy5wdXNoKG5leHQpXG4gICAgICAgIC8vIGNvbmZpZ1t0eXBlXS5hcHBseShfdGhpcy5fX3hociwgYXJncylcbiAgICAgICAgY29uZmlnW3R5cGVdLmFwcGx5KF90aGlzLCBhcmdzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dCgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlTWV0aG9kIChfdGhpcywgdHlwZSwgYXJncywgbmV4dCkge1xuICAgIHZhciBfYXJncyA9IFtdXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBfYXJncy5wdXNoKGFyZ3NbaV0pXG4gICAgfVxuICAgIF9hcmdzLnVuc2hpZnQobmV4dClcbiAgICBpZiAoaXNGdW5jKF90aGlzLl9fY29uZmlnW3R5cGVdKSkge1xuICAgICAgLy8gX3RoaXMuX19jb25maWdbdHlwZV0uYXBwbHkoX3RoaXMuX194aHIsIF9hcmdzKVxuICAgICAgX3RoaXMuX19jb25maWdbdHlwZV0uYXBwbHkoX3RoaXMsIF9hcmdzKVxuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0KClcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBFdmVudCAoKSB7fVxuICBFdmVudC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uICh0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSkge1xuICAgIC8vIHRoaXMuX194aHIuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSlcbiAgICB0aGlzLl9fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpXG4gIH1cbiAgRXZlbnQucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAodHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpIHtcbiAgICB2YXIgZXZ0cyA9IHRoaXMuX19ldmVudHNbdHlwZV1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV2dHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChldnRzW2ldICE9PSBsaXN0ZW5lcikge1xuICAgICAgICBldnRzLnNwbGljZShpLCAxKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBFdmVudC5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHRoaXMuX194aHIuZGlzcGF0Y2hFdmVudChldmVudClcbiAgfVxuXG4gIGZ1bmN0aW9uIEhhamF4ICh4aHIsIGNvbmZpZykge1xuICAgIHRoaXMuX19jb25maWcgPSBjb25maWdcbiAgICB0aGlzLl9feGhyID0geGhyXG4gICAgLy8gcHJvcHNcbiAgICBzZXRSZWFkT25seVByb3BzRnJvbVhocih0aGlzKVxuICAgIHRoaXMucmVzcG9uc2VUeXBlID0gXCJcIiAvLyByJndcbiAgICB0aGlzLnRpbWVvdXQgPSAwIC8vIHImd1xuICAgIHRoaXMud2l0aENyZWRlbnRpYWxzID0gZmFsc2UgLy8gciZ3XG4gICAgLy8gZXZlbnRzIHByb3BzXG4gICAgYWRkRXZlbnRQcm9wcyh0aGlzKVxuICAgIGluaXRCYXNlRXZlbnQodGhpcylcbiAgICAvLyB1cGxvYWQgcHJvcFxuICAgIHRoaXMuX191cGxvYWQgPSB4aHIudXBsb2FkXG4gICAgdGhpcy51cGxvYWQgPSBuZXcgRXZlbnQoKVxuICAgIHRoaXMudXBsb2FkLl9feGhyID0gdGhpcy5fX3hoclxuICAgIGFkZEV2ZW50UHJvcHModGhpcy51cGxvYWQsIHRydWUpXG4gICAgaW5pdEJhc2VFdmVudCh0aGlzLnVwbG9hZClcbiAgfVxuXG4gIC8vIG1ldGhvZHNcbiAgSGFqYXgucHJvdG90eXBlID0gbmV3IEV2ZW50KClcbiAgSGFqYXgucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbiAobWV0aG9kLCB1cmwsIGFzeW5jLCB1c2VyLCBwYXNzd29yZCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXNcbiAgICBoYW5kbGVNZXRob2QoX3RoaXMsIFwiYmVmb3JlT3BlblwiLCBhcmd1bWVudHMsIGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzLl9feGhyLm9wZW4obWV0aG9kLCB1cmwsIGFzeW5jLCB1c2VyLCBwYXNzd29yZClcbiAgICAgIHNldFJlYWRPbmx5UHJvcHNGcm9tWGhyKF90aGlzLCBfdGhpcy5fX3hocilcbiAgICB9KVxuICB9XG4gIEhhamF4LnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24gKGJvZHkpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICBoYW5kbGVNZXRob2QodGhhdCwgXCJiZWZvcmVTZW5kXCIsIGFyZ3VtZW50cywgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gc2V0IHJlYWRhYmxlL3dyaXRhYmxlIHByb3BzXG4gICAgICB0aGF0Ll9feGhyLnJlc3BvbnNlVHlwZSA9IHRoYXQuX19jb25maWcucmVzcG9uc2VUeXBlIHx8IFwiXCJcbiAgICAgIHRoYXQuX194aHIudGltZW91dCA9IHRoYXQuX19jb25maWcudGltZW91dCB8fCB0aGF0LnRpbWVvdXRcbiAgICAgIHRoYXQuX194aHIud2l0aENyZWRlbnRpYWxzID0gdGhhdC5fX2NvbmZpZy53aXRoQ3JlZGVudGlhbHMgfHwgdGhhdC53aXRoQ3JlZGVudGlhbHNcbiAgICAgIHZhciBrZXlcbiAgICAgIC8vIHNldCBldmVudHNcbiAgICAgIGZvciAoa2V5IGluIHRoYXQuX194aHIpIHtcbiAgICAgICAgaWYgKC9eb24vZy50ZXN0KGtleSkpIHtcbiAgICAgICAgICB0aGF0Ll9feGhyW2tleV0gPSBoYW5kbGVFdmVudCh0aGF0LCBrZXksIHRoYXQuX19jb25maWcgfHwge30pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoa2V5IGluIHRoYXQuX191cGxvYWQpIHtcbiAgICAgICAgaWYgKC9eb24vZy50ZXN0KGtleSkpIHtcbiAgICAgICAgICB0aGF0Ll9fdXBsb2FkW2tleV0gPSBoYW5kbGVFdmVudCh0aGF0LnVwbG9hZCwga2V5LCB0aGF0Ll9fY29uZmlnLnVwbG9hZCB8fCB7fSwgdHJ1ZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhhdC5fX3hoci5zZW5kKGJvZHkpXG4gICAgICBzZXRSZWFkT25seVByb3BzRnJvbVhocih0aGF0LCB0aGF0Ll9feGhyKVxuICAgIH0pXG4gIH1cbiAgSGFqYXgucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXNcbiAgICBoYW5kbGVNZXRob2QoX3RoaXMsIFwiYmVmb3JlQWJvcmRcIiwgYXJndW1lbnRzLCBmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy5fX3hoci5hYm9ydCgpXG4gICAgICBzZXRSZWFkT25seVByb3BzRnJvbVhocihfdGhpcywgX3RoaXMuX194aHIpXG4gICAgfSlcbiAgfVxuXG4gIEhhamF4LnByb3RvdHlwZS5zZXRSZXF1ZXN0SGVhZGVyID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgdGhpcy5fX3hoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICB9XG4gIEhhamF4LnByb3RvdHlwZS5nZXRBbGxSZXNwb25zZUhlYWRlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fX3hoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKVxuICB9XG4gIEhhamF4LnByb3RvdHlwZS5vdmVycmlkZU1pbWVUeXBlID0gZnVuY3Rpb24gKG1pbWUpIHtcbiAgICB0aGlzLl9feGhyLm92ZXJyaWRlTWltZVR5cGUobWltZSlcbiAgfVxuICBIYWpheC5wcm90b3R5cGUuZ2V0UmVzcG9uc2VIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fX3hoci5nZXRSZXNwb25zZUhlYWRlcihuYW1lKVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAvLyBYTUxIdHRwUmVxdWVzdCwgQWN0aXZlWE9iamVjdCBhbmQgWERvbWFpblJlcXVlc3RcbiAgICBpZiAod2luZG93Ll9fWEhSQWxyZWFkeU1vZGlmaWVkKSByZXR1cm4gZmFsc2VcbiAgICB2YXIgWEhSQ29uc3RydWN0b3JcbiAgICBpZiAod2luZG93LlhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgICBYSFJDb25zdHJ1Y3RvciA9IHdpbmRvdy5YTUxIdHRwUmVxdWVzdFxuICAgICAgd2luZG93LlhNTEh0dHBSZXF1ZXN0ID0gZnVuY3Rpb24gKHdoYXRldmVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgSGFqYXgobmV3IFhIUkNvbnN0cnVjdG9yKCksIGNvbmZpZyB8fCB7fSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHdpbmRvdy5BY3RpdmVYT2JqZWN0KSB7XG4gICAgICBYSFJDb25zdHJ1Y3RvciA9IHdpbmRvdy5BY3RpdmVYT2JqZWN0XG4gICAgICB3aW5kb3cuQWN0aXZlWE9iamVjdCA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgIGlmICh0eXBlID09PSBcIk1pY3Jvc29mdC5YTUxIVFRQXCIpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IEhhamF4KG5ldyBYSFJDb25zdHJ1Y3RvcigpLCBjb25maWcgfHwge30pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFhIUkNvbnN0cnVjdG9yKHR5cGUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHdpbmRvdy5YRG9tYWluUmVxdWVzdCkge1xuICAgICAgWEhSQ29uc3RydWN0b3IgPSB3aW5kb3cuWERvbWFpblJlcXVlc3RcbiAgICAgIHdpbmRvdy5YRG9tYWluUmVxdWVzdCA9IGZ1bmN0aW9uICh3aGF0ZXZlcikge1xuICAgICAgICByZXR1cm4gbmV3IEhhamF4KG5ldyBYSFJDb25zdHJ1Y3RvcigpLCBjb25maWcgfHwge30pXG4gICAgICB9XG4gICAgfVxuICAgIHdpbmRvdy5fX1hIUkFscmVhZHlNb2RpZmllZCA9IHRydWVcbiAgfVxufSkoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9fYWpheEhhY2tlclxuIiwiLypcbiAqIEBBdXRob3I6IGppYW5nZmVuZ1xuICogQERhdGU6IDIwMTctMDgtMjMgMDk6NTQ6MTVcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiBqaWFuZ2ZlbmdcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjMgMDk6NTQ6NTVcbiAqL1xuXG52YXIgeGhyID0gcmVxdWlyZShcIi4veGhyV3JhcFwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHhoclxuIiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuLi9jb25maWdcIilcbnZhciBjb21tb24gPSByZXF1aXJlKFwiLi4vY29tbW9uXCIpXG52YXIgY29uc3RzID0gcmVxdWlyZShcIi4uL2NvbnN0c1wiKVxudmFyIGxvZyA9IHJlcXVpcmUoXCIuLi9sb2dcIilcbnZhciBUaHJpZnQgPSByZXF1aXJlKFwiLi4vdGhyaWZ0XCIpXG52YXIga2VwbGVyID0gcmVxdWlyZShcIi4uL2tlcGxlclwiKVxuXG4vKipcbiAqIOWPkemAgVhIUumHh+mbhuaVsOaNrlxuICpcbiAqIEBwYXJhbSB7YW55fSB4aHJcbiAqL1xuZnVuY3Rpb24gc2VuZCAoeGhyKSB7XG4gIGlmICgheGhyLm9rKSByZXR1cm5cbiAgbG9nKFwic2VuZCBYSFIgZGF0YTpcIilcbiAgbG9nKHhocilcbiAgdmFyIHRyYW5zcG9ydCA9IG5ldyBUaHJpZnQuVHJhbnNwb3J0KFwiXCIpXG4gIHZhciBwcm90b2NvbCA9IG5ldyBUaHJpZnQuUHJvdG9jb2wodHJhbnNwb3J0KVxuICBwcm90b2NvbC53cml0ZU1lc3NhZ2VCZWdpbihcIlRXZWJBZ2VudEFqYXhcIiwgVGhyaWZ0Lk1lc3NhZ2VUeXBlLkNBTEwsIDApXG4gIHZhciBlbnRpdHkgPSBuZXcga2VwbGVyLlRXZWJBZ2VudEFqYXgoeGhyKVxuICB2YXIgc291cmNlID0gY29tbW9uLmV4dGVuZCh7fSwgeGhyLCBjb21tb24uaW5mby5wcm9wZXJ0aWVzKCkpXG4gIHNlcmlhbGl6ZShlbnRpdHksIHNvdXJjZSlcbiAgZW50aXR5LndyaXRlKHByb3RvY29sKVxuICBwcm90b2NvbC53cml0ZU1lc3NhZ2VFbmQoKVxuICB2YXIgc2VuZFZhbHVlID0gdHJhbnNwb3J0LmZsdXNoKClcbiAgdmFyIHggPSBKU09OLnBhcnNlKHNlbmRWYWx1ZSlcbiAgc2VuZFZhbHVlID0gSlNPTi5zdHJpbmdpZnkoeFt4Lmxlbmd0aCAtIDFdKVxuICBsb2coc2VuZFZhbHVlKVxuICB2YXIgb3B0aW9ucyA9IHtcbiAgICB1cmw6IGNvbmZpZy5hcGlIb3N0LFxuICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgIGNvcnM6IHRydWUsXG4gICAgZGF0YTogc2VuZFZhbHVlLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBsb2coXCLkuovku7blj5HpgIHov5Tlm57mtojmga/plJnor69cIilcbiAgICB9LFxuICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XG4gICAgICBsb2coeGhyLnN0YXR1cylcbiAgICAgIGxvZyh4aHIuc3RhdHVzVGV4dClcbiAgICB9LFxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBsb2coXCLkuovku7blj5HpgIHlrozmr5UuXCIpXG4gICAgfVxuICB9XG5cbiAgb3B0aW9ucy5oZWFkZXIgPSB7fVxuICBvcHRpb25zLmhlYWRlcltjb25zdHMua2VwbGVyX21lc3NhZ2VfdHlwZV0gPSBjb25zdHMuV0VCX0FKQVhcbiAgb3B0aW9ucy5oZWFkZXJbY29uc3RzLmtlcGxlcl9hZ2VudF90b2tlbl0gPSBjb25maWcuYWdlbnRJZFxuICBvcHRpb25zLmhlYWRlcltjb25zdHMua2VwbGVyX2NvbmZpZ192ZXJzaW9uXSA9IGNvbmZpZy5MSUJfVkVSU0lPTlxuXG4gIGNvbW1vbi5hamF4KG9wdGlvbnMpXG59XG5cbmZ1bmN0aW9uIHNlbmRCYXRjaCAoeGhycykge1xuICBsb2coXCJzZW5kIFhIUlMgZGF0YTpcIilcbiAgbG9nKHhocnMpXG4gIHZhciB0cmFuc3BvcnQgPSBuZXcgVGhyaWZ0LlRyYW5zcG9ydChcIlwiKVxuICB2YXIgcHJvdG9jb2wgPSBuZXcgVGhyaWZ0LlByb3RvY29sKHRyYW5zcG9ydClcbiAgcHJvdG9jb2wud3JpdGVNZXNzYWdlQmVnaW4oXCJUV2ViQWdlbnRBamF4QmF0Y2hcIiwgVGhyaWZ0Lk1lc3NhZ2VUeXBlLkNBTEwsIDApXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSB4aHJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIHhociA9IHhocnNbaV1cbiAgICB2YXIgZW50aXR5ID0gbmV3IGtlcGxlci5UV2ViQWdlbnRBamF4KHhocilcbiAgICB2YXIgc291cmNlID0gY29tbW9uLmV4dGVuZCh7fSwgeGhyLCBjb21tb24uaW5mby5wcm9wZXJ0aWVzKCkpXG4gICAgc2VyaWFsaXplKGVudGl0eSwgc291cmNlKVxuICAgIHhocnNbaV0gPSBlbnRpdHlcbiAgfVxuICB2YXIgYmF0Y2ggPSB7XG4gICAgYWpheEJhdGNoOiB4aHJzXG4gIH1cbiAgdmFyIHBhdGNoID0gbmV3IGtlcGxlci5UV2ViQWdlbnRBamF4QmF0Y2goYmF0Y2gpXG4gIHBhdGNoLndyaXRlKHByb3RvY29sKVxuICBwcm90b2NvbC53cml0ZU1lc3NhZ2VFbmQoKVxuICB2YXIgc2VuZFZhbHVlID0gdHJhbnNwb3J0LmZsdXNoKClcbiAgdmFyIHggPSBKU09OLnBhcnNlKHNlbmRWYWx1ZSlcbiAgc2VuZFZhbHVlID0gSlNPTi5zdHJpbmdpZnkoeFt4Lmxlbmd0aCAtIDFdKVxuICBsb2coc2VuZFZhbHVlKVxuICB2YXIgb3B0aW9ucyA9IHtcbiAgICB1cmw6IGNvbmZpZy5hcGlIb3N0LFxuICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgIGNvcnM6IHRydWUsXG4gICAgZGF0YTogc2VuZFZhbHVlLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBsb2coXCLkuovku7blj5HpgIHov5Tlm57mtojmga/plJnor69cIilcbiAgICB9LFxuICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XG4gICAgICBsb2coeGhyLnN0YXR1cylcbiAgICAgIGxvZyh4aHIuc3RhdHVzVGV4dClcbiAgICB9LFxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBsb2coXCLkuovku7blj5HpgIHlrozmr5UuXCIpXG4gICAgfVxuICB9XG5cbiAgb3B0aW9ucy5oZWFkZXIgPSB7fVxuICBvcHRpb25zLmhlYWRlcltjb25zdHMua2VwbGVyX21lc3NhZ2VfdHlwZV0gPSBjb25zdHMuV0VCX0FKQVhfQkFUQ0hcbiAgb3B0aW9ucy5oZWFkZXJbY29uc3RzLmtlcGxlcl9hZ2VudF90b2tlbl0gPSBjb25maWcuYWdlbnRJZFxuICBvcHRpb25zLmhlYWRlcltjb25zdHMua2VwbGVyX2NvbmZpZ192ZXJzaW9uXSA9IGNvbmZpZy5MSUJfVkVSU0lPTlxuICBpZiAoIWNvbmZpZy5kaXNhYmxlZCkge1xuICAgIGNvbW1vbi5hamF4KG9wdGlvbnMpXG4gIH1cbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplIChlbnRpdHksIG9iaikge1xuICBlbnRpdHkuYWdlbnRJZCA9IGNvbmZpZy5hZ2VudElkXG4gIGVudGl0eS50aWVySWQgPSBjb25maWcudGllcklkXG4gIGVudGl0eS5hcHBJZCA9IGNvbmZpZy5hcHBJZFxuICBlbnRpdHkudHJhY2VJZCA9IGNvbW1vbi5VVUlEKClcbiAgZW50aXR5LnVybERvbWFpbiA9IGRvY3VtZW50LmRvbWFpbiB8fCB3aW5kb3cubG9jYXRpb24uaG9zdFxuICBlbnRpdHkucmVwb3J0VGltZSA9IG5ldyBEYXRlKCkgKiAxXG4gIGVudGl0eS5sb2FkZWRUaW1lID0gb2JqLmFsbFRpbWUgfHwgLTFcbiAgZW50aXR5LmJyb3dzZXIgPSBvYmouYnJvd3NlclxuICBlbnRpdHkudXJsUXVlcnkgPSBvYmoucGFnZV91cmxfcGF0aFxuXG4gIGVudGl0eS5iYWNrdXBQcm9wZXJ0aWVzID0ge1xuICAgIFwib3NcIjogb2JqLm9zLFxuICAgIFwib3NfdmVyc2lvblwiOiBvYmoub3NfdmVyc2lvbixcbiAgICBcImRldmljZVwiOiBvYmouZGV2aWNlLFxuICAgIFwiZGV2aWNlX3ZlcnNpb25cIjogb2JqLmRldmljZV92ZXJzaW9uLFxuICAgIFwiYnJvd3Nlcl9lbmdpbmVcIjogb2JqLmJyb3dzZXJfZW5naW5lLFxuICAgIFwicGFnZV90aXRsZVwiOiBvYmoucGFnZV90aXRsZSxcbiAgICBcInBhZ2VfaDFcIjogb2JqLnBhZ2VfaDEsXG4gICAgXCJwYWdlX3JlZmVycmVyXCI6IG9iai5wYWdlX3JlZmVycmVyLFxuICAgIFwicGFnZV91cmxcIjogb2JqLnBhZ2VfdXJsLFxuICAgIFwicGFnZV91cmxfcGF0aFwiOiBvYmoucGFnZV91cmxfcGF0aCxcbiAgICBcImxpYlwiOiBvYmoubGliLFxuICAgIFwibGliX3ZlcnNpb25cIjogb2JqLmxpYl92ZXJzaW9uLFxuICAgIFwiYnJvd3Nlcl92ZXJzaW9uXCI6IG9iai5icm93c2VyX3ZlcnNpb24sXG4gICAgXCJzdGFydFRpbWVcIjogb2JqLnN0YXJ0VGltZSxcbiAgICBcImVuZFRpbWVcIjogb2JqLmVuZFRpbWUsXG4gICAgXCJzdGF0dXNcIjogb2JqLnN0YXR1cyB8fCAwLFxuICAgIFwiZGF0YVNpemVcIjogb2JqLmRhdGFTaXplIHx8IDBcbiAgfVxuXG4gIGVudGl0eS5iYWNrdXBRdW90YSA9IHtcbiAgICBcInNjcmVlbl9oZWlnaHRcIjogb2JqLnNjcmVlbl9oZWlnaHQsXG4gICAgXCJzY3JlZW5fd2lkdGhcIjogb2JqLnNjcmVlbl93aWR0aFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZW5kOiBzZW5kLFxuICBzZW5kQmF0Y2g6IHNlbmRCYXRjaFxufVxuIiwiLypcbiAqIEBBdXRob3I6IGppYW5nZmVuZ1xuICogQERhdGU6IDIwMTctMDgtMjIgMTE6MzA6MTNcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiBqaWFuZ2ZlbmdcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMTAtMTcgMTQ6Mjg6NTlcbiAqL1xuXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4uL2NvbmZpZ1wiKVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoXCIuLi9jb21tb25cIilcbnZhciBsb2cgPSByZXF1aXJlKFwiLi4vbG9nXCIpXG52YXIgSlNPTiA9IHJlcXVpcmUoXCIuLi9qc29uXCIpXG52YXIgZXZlbnRFbWl0dGVyID0gcmVxdWlyZShcIi4uL2V2ZW50RW1pdHRlclwiKS5jcmVhdGUoKVxuXG52YXIgc2VuZGVyID0gcmVxdWlyZShcIi4vc2VuZGVyXCIpXG52YXIgc2luZ2xlRXZlbnROYW1lID0gXCJ4aHItd3JhcFwiXG5ldmVudEVtaXR0ZXIub24oc2luZ2xlRXZlbnROYW1lLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNwbGljZS5jYWxsKGFyZ3VtZW50cywgMClcbiAgdmFyIG1ldGhvZCA9IGFyZ3NbMF1cbiAgc3dpdGNoIChtZXRob2QpIHtcbiAgY2FzZSBcImNvbGxlY3RcIjpcbiAgICBjb2xsZWN0KGFyZ3NbMV0pXG4gICAgYnJlYWtcbiAgY2FzZSBcInNlbmRcIjpcbiAgICBzZW5kKClcbiAgICBicmVha1xuICBkZWZhdWx0OlxuICAgIGJyZWFrXG4gIH1cbn0pXG52YXIgeGhycyA9IFtdXG5cbmZ1bmN0aW9uIGNvbGxlY3QgKHBlcmZvcm1hbmNlKSB7XG4gIGlmIChwZXJmb3JtYW5jZS5fX2FwbV94aHJfXykgcmV0dXJuXG4gIHZhciB0cmFjaW5nSWQgPSBwZXJmb3JtYW5jZS50cmFjaW5nSWRcbiAgdmFyIGluZGV4XG4gIGZvciAoaW5kZXggaW4geGhycykge1xuICAgIGlmICh4aHJzW2luZGV4XSAmJiB4aHJzW2luZGV4XS50cmFjaW5nSWQgJiYgeGhyc1tpbmRleF0udHJhY2luZ0lkID09PSB0cmFjaW5nSWQpIHtcbiAgICAgIHhocnNbaW5kZXhdID0gY29tbW9uLmV4dGVuZCh4aHJzW2luZGV4XSwgcGVyZm9ybWFuY2UpXG4gICAgICByZXR1cm5cbiAgICB9XG4gIH1cbiAgbG9nKFwiY29sbGVjdGVkIGEgeGhyIDpcIiwgcGVyZm9ybWFuY2UpXG4gIHhocnMucHVzaChwZXJmb3JtYW5jZSlcbn1cblxuLyoqXG4gKiDojrflj5bov5Tlm57kvZPnmoTmlbDmja7lpKflsI9cbiAqXG4gKiBAcGFyYW0ge2FueX0gb2JqXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBnZXRSZXNwb25zZVNpemUgKG9iaikge1xuICBpZiAodHlwZW9mIG9iaiA9PT0gXCJzdHJpbmdcIiAmJiBvYmoubGVuZ3RoKSByZXR1cm4gb2JqLmxlbmd0aFxuICBpZiAodHlwZW9mIG9iaiAhPT0gXCJvYmplY3RcIikgcmV0dXJuIHZvaWQgMFxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSBcInVuZGVmaW5lZFwiICYmIG9iaiBpbnN0YW5jZW9mIEFycmF5QnVmZmVyICYmIG9iai5ieXRlTGVuZ3RoKSByZXR1cm4gb2JqLmJ5dGVMZW5ndGhcbiAgaWYgKHR5cGVvZiBCbG9iICE9PSBcInVuZGVmaW5lZFwiICYmIG9iaiBpbnN0YW5jZW9mIEJsb2IgJiYgb2JqLnNpemUpIHJldHVybiBvYmouc2l6ZVxuICBpZiAodHlwZW9mIEZvcm1EYXRhICE9PSBcInVuZGVmaW5lZFwiICYmIG9iaiBpbnN0YW5jZW9mIEZvcm1EYXRhKSByZXR1cm4gdm9pZCAwXG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaikubGVuZ3RoXG4gIH0gY2F0Y2ggKGIpIHtcbiAgICByZXR1cm4gdm9pZCAwXG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VYSFJVcmwgKG9iaiwgdXJsKSB7XG4gIHZhciBwYXJzZWRVcmwgPSBjb21tb24ucGFyc2VVcmwodXJsKVxuICBvYmouaG9zdCA9IHBhcnNlZFVybC5ob3N0bmFtZSArIFwiOlwiICsgcGFyc2VkVXJsLnBvcnRcbiAgb2JqLnBhdGhuYW1lID0gcGFyc2VkVXJsLnBhdGhuYW1lXG4gIG9iai5zYW1lT3JpZ2luID0gcGFyc2VkVXJsLnNhbWVPcmlnaW5cbn1cblxuLyogZnVuY3Rpb24gZ2V0WEhSQ29udGVudExlbmd0aCAoeGhyKSB7XG4gIHZhciBsZW5cbiAgc3dpdGNoICh4aHIuY29udGVudFR5cGUpIHtcbiAgY2FzZSBcImFwcGxpY2F0aW9uL2pzb25cIjpcbiAgICBsZW4gPSBKU09OLnN0cmluZ2lmeSh4aHIuZGF0YSlcbiAgICBicmVha1xuICB9XG59ICovXG5cbi8qIGZ1bmN0aW9uIG9uRW5kICh4aHIpIHtcbiAgdmFyIHhoclBhcmFtcyA9IHRoaXMucGFyYW1zXG4gIHZhciB4aHJNYXRyaWNzID0gdGhpcy5tZXRyaWNzXG4gIGlmICghdGhpcy5lbmRlZCkge1xuICAgIHRoaXMuZW5kZWQgPSB0cnVlXG4gICAgaWYgKHhoci5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICBmb3IgKHZhciBlID0gMDsgc3RhdHVzTGVuZ3RoID4gZTsgZSsrKSB7XG4gICAgICAgIHhoci5yZW1vdmVFdmVudExpc3RlbmVyKHhockV2ZW50c1tlXSwgdGhpcy5saXN0ZW5lciwgZmFsc2UpXG4gICAgICB9XG4gICAgfVxuICAgIGlmICgheGhyUGFyYW1zLmFib3J0ZWQpIHtcbiAgICAgIHhock1hdHJpY3MuZHVyYXRpb24gPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpIC0gdGhpcy5zdGFydFRpbWVcbiAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICB4aHJQYXJhbXMuc3RhdHVzID0geGhyLnN0YXR1c1xuICAgICAgICB2YXIgcmVzVHlwZSA9IHhoci5yZXNwb25zZVR5cGVcbiAgICAgICAgdmFyIHJlc0JvZHkgPSByZXNUeXBlID09PSBcImFycmF5YnVmZmVyXCIgfHwgcmVzVHlwZSA9PT0gXCJibG9iXCIgfHwgcmVzVHlwZSA9PT0gXCJqc29uXCIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0XG4gICAgICAgIHZhciBkYXRhU2l6ZSA9IGdldFJlc3BvbnNlU2l6ZShyZXNCb2R5KVxuXG4gICAgICAgIGlmIChkYXRhU2l6ZSkge1xuICAgICAgICAgIHhock1hdHJpY3MucnhTaXplID0gZGF0YVNpemVcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeGhyUGFyYW1zLnN0YXR1cyA9IDBcbiAgICAgIH1cbiAgICAgIHhock1hdHJpY3MuY2JUaW1lID0gdGhpcy5jYlRpbWVcbiAgICAgIGlmICh4aHJQYXJhbXMgJiYgeGhyUGFyYW1zLnBhdGhuYW1lICYmIHhoclBhcmFtcy5wYXRobmFtZS5pbmRleE9mKFwiYmVhY29uL3Jlc291cmNlc1wiKSA8IDApIHtcbiAgICAgICAgZXZlbnRFbWl0dGVyLmFkZEV2ZW50QXJncyhcInhoclwiLCBbeGhyUGFyYW1zLCB4aHJNYXRyaWNzLCB0aGlzLnN0YXJ0VGltZSwgdGhpcy5jcmVhdFR5cGVdKVxuICAgICAgfVxuICAgIH1cbiAgfVxufSAqL1xudmFyIHdyYXBYSFIgPSByZXF1aXJlKFwiLi9hamF4SGFja2VyXCIpXG53cmFwWEhSKHtcbiAgYmVmb3JlT3BlbjogZnVuY3Rpb24gKG5leHQsIG1ldGhvZCwgdXJsLCBhc3luYywgdXNlciwgcGFzc3dvcmQpIHtcbiAgICB0aGlzLnBlcmZvcm1hbmNlID0ge1xuICAgICAgX19hcG1feGhyX186IHRoaXMuX19hcG1feGhyX18sXG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIGFzeW5jOiBhc3luYyxcbiAgICAgIHVzZXI6IHVzZXIsXG4gICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICB9XG4gICAgcGFyc2VYSFJVcmwodGhpcy5wZXJmb3JtYW5jZSwgdXJsKVxuICAgIGV2ZW50RW1pdHRlci5lbWl0KHNpbmdsZUV2ZW50TmFtZSwgW1wiY29sbGVjdFwiLCB0aGlzLnBlcmZvcm1hbmNlXSlcbiAgICAvLyBjb2xsZWN0KHRoaXMucGVyZm9ybWFuY2UpXG4gICAgbmV4dCgpXG4gIH0sXG4gIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uIChuZXh0LCBib2R5KSB7XG4gICAgbG9nKFwiYmVmb3JlIHNlbmQ6XCIpXG4gICAgbG9nKHRoaXMpXG4gICAgdmFyIHRyYWNpbmdJZCA9IGNvbW1vbi5VVUlEKClcbiAgICB2YXIgc3RhcnRUaW1lID0gbmV3IERhdGUoKSAqIDFcbiAgICB2YXIgY29udGVudExlbmd0aCA9IHR5cGVvZiBib2R5ID09PSBcIm9iamVjdFwiIHx8IGJvZHkgaW5zdGFuY2VvZiBBcnJheSA/IEpTT04uc3RyaW5naWZ5KGJvZHkpLmxlbmd0aFxuICAgICAgOiB0eXBlb2YgYm9keSA9PT0gXCJ1bmRlZmluZWRcIiA/IDAgOiBib2R5Lmxlbmd0aFxuICAgIGlmIChjb25maWcub3BlblRyYWNpbmcpIHtcbiAgICAgIHRoaXMuc2V0UmVxdWVzdEhlYWRlcihcInR5cGVcIiwgXCJ3ZWItc3BhblwiKVxuICAgICAgdGhpcy5zZXRSZXF1ZXN0SGVhZGVyKFwiS2VwbGVyLVRyYWNlSWRcIiwgdHJhY2luZ0lkKVxuICAgICAgdGhpcy5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1MZW5ndGhcIiwgY29udGVudExlbmd0aClcbiAgICB9XG4gICAgdGhpcy5wZXJmb3JtYW5jZS5zdGFydFRpbWUgPSBzdGFydFRpbWVcbiAgICB0aGlzLnBlcmZvcm1hbmNlLmFnZW50SWQgPSBjb25maWcuYWdlbnRJZFxuICAgIHRoaXMucGVyZm9ybWFuY2UudHJhY2luZ0lkID0gdHJhY2luZ0lkXG4gICAgdGhpcy5wZXJmb3JtYW5jZS5vayA9IGZhbHNlXG5cbiAgICBldmVudEVtaXR0ZXIuZW1pdChzaW5nbGVFdmVudE5hbWUsIFtcImNvbGxlY3RcIiwgdGhpcy5wZXJmb3JtYW5jZV0pXG4gICAgLy8gY29sbGVjdCh0aGlzLnBlcmZvcm1hbmNlKVxuICAgIG5leHQoKVxuICB9LFxuICBiZWZvcmVBYm9yZDogZnVuY3Rpb24gKG5leHQpIHtcbiAgICBuZXh0KClcbiAgfSxcbiAgb25hYm9yZDogZnVuY3Rpb24gKGUsIG5leHQpIHtcbiAgICB0aGlzLnBlcmZvcm1hbmNlLnN0YXR1cyA9IFwiYWJvcmRlZFwiXG4gICAgdGhpcy5wZXJmb3JtYW5jZS5lbmRUaW1lID0gbmV3IERhdGUoKSAqIDFcblxuICAgIHRoaXMucGVyZm9ybWFuY2Uub2sgPSB0cnVlXG5cbiAgICBldmVudEVtaXR0ZXIuZW1pdChzaW5nbGVFdmVudE5hbWUsIFtcImNvbGxlY3RcIiwgdGhpcy5wZXJmb3JtYW5jZV0pXG4gICAgLy8gY29sbGVjdCh0aGlzLnBlcmZvcm1hbmNlKVxuICAgIG5leHQoKVxuICB9LFxuICBvbmVycm9yOiBmdW5jdGlvbiAoZSwgbmV4dCkge1xuICAgIHRoaXMucGVyZm9ybWFuY2Uuc3RhdHVzID0gXCJlcnJvclwiXG4gICAgdGhpcy5wZXJmb3JtYW5jZS5lbmRUaW1lID0gbmV3IERhdGUoKSAqIDFcbiAgICB0aGlzLnBlcmZvcm1hbmNlLm9rID0gdHJ1ZVxuICAgIGV2ZW50RW1pdHRlci5lbWl0KHNpbmdsZUV2ZW50TmFtZSwgW1wiY29sbGVjdFwiLCB0aGlzLnBlcmZvcm1hbmNlXSlcbiAgICAvLyBjb2xsZWN0KHRoaXMucGVyZm9ybWFuY2UpXG4gICAgbmV4dCgpXG4gIH0sXG4gIG9ubG9hZDogZnVuY3Rpb24gKGUsIG5leHQpIHtcbiAgICBuZXh0KClcbiAgfSxcbiAgb25sb2FkZW5kOiBmdW5jdGlvbiAoZSwgbmV4dCkge1xuICAgIGxvZyhcInhoci13cmFwcGVyOm9ubG9hZGVkXCIsIGUpXG4gICAgdGhpcy5wZXJmb3JtYW5jZS50eXBlID0gXCJsb2FkZW5kXCJcbiAgICB0aGlzLnBlcmZvcm1hbmNlLnN0YXR1c0NvZGUgPSB0aGlzLnN0YXR1c1xuICAgIHRoaXMucGVyZm9ybWFuY2UuZW5kVGltZSA9IG5ldyBEYXRlKCkgKiAxXG4gICAgdGhpcy5wZXJmb3JtYW5jZS5hbGxUaW1lID0gdGhpcy5wZXJmb3JtYW5jZS5lbmRUaW1lIC0gdGhpcy5wZXJmb3JtYW5jZS5zdGFydFRpbWVcbiAgICB0aGlzLnBlcmZvcm1hbmNlLm9rID0gdHJ1ZVxuICAgIGV2ZW50RW1pdHRlci5lbWl0KHNpbmdsZUV2ZW50TmFtZSwgW1wiY29sbGVjdFwiLCB0aGlzLnBlcmZvcm1hbmNlXSlcbiAgICAvLyBjb2xsZWN0KHRoaXMucGVyZm9ybWFuY2UpXG4gICAgbmV4dCgpXG4gIH0sXG4gIG9ubG9hZHN0YXJ0OiBmdW5jdGlvbiAoZSwgbmV4dCkge1xuICAgIG5leHQoKVxuICB9LFxuICBvbnByb2dyZXNzOiBmdW5jdGlvbiAoZSwgbmV4dCkge1xuICAgIG5leHQoKVxuICB9LFxuICBvbnRpbWVvdXQ6IGZ1bmN0aW9uIChlLCBuZXh0KSB7XG4gICAgdGhpcy5wZXJmb3JtYW5jZS50eXBlID0gXCJ0aW1lb3V0XCJcbiAgICB0aGlzLnBlcmZvcm1hbmNlLnN0YXR1c0NvZGUgPSB0aGlzLnN0YXR1c1xuICAgIHRoaXMucGVyZm9ybWFuY2UuZW5kVGltZSA9IG5ldyBEYXRlKCkgKiAxXG4gICAgdGhpcy5wZXJmb3JtYW5jZS5vayA9IHRydWVcbiAgICBldmVudEVtaXR0ZXIuZW1pdChzaW5nbGVFdmVudE5hbWUsIFtcImNvbGxlY3RcIiwgdGhpcy5wZXJmb3JtYW5jZV0pXG4gICAgLy8gY29sbGVjdCh0aGlzLnBlcmZvcm1hbmNlKVxuICAgIG5leHQoKVxuICB9LFxuICBvbnJlYWR5c3RhdGVjaGFuZ2U6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5wZXJmb3JtYW5jZS50eXBlID0gXCJyZWFkeXN0YXRlY2hhbmdlZFwiXG4gICAgdGhpcy5wZXJmb3JtYW5jZS5lbmRUaW1lID0gbmV3IERhdGUoKSAqIDFcbiAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICB0aGlzLnBlcmZvcm1hbmNlLnN0YXR1cyA9IHRoaXMuc3RhdHVzXG4gICAgICB2YXIgcmVzVHlwZSA9IHRoaXMucmVzcG9uc2VUeXBlXG4gICAgICB2YXIgcmVzQm9keSA9IHJlc1R5cGUgPT09IFwiYXJyYXlidWZmZXJcIiB8fCByZXNUeXBlID09PSBcImJsb2JcIiB8fCByZXNUeXBlID09PSBcImpzb25cIiA/IHRoaXMucmVzcG9uc2UgOiB0aGlzLnJlc3BvbnNlVGV4dFxuICAgICAgdmFyIGRhdGFTaXplID0gZ2V0UmVzcG9uc2VTaXplKHJlc0JvZHkpIHx8IDBcblxuICAgICAgaWYgKGRhdGFTaXplKSB7XG4gICAgICAgIHRoaXMucGVyZm9ybWFuY2UuZGF0YVNpemUgPSBkYXRhU2l6ZVxuICAgICAgfVxuICAgICAgdGhpcy5wZXJmb3JtYW5jZS5vayA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wZXJmb3JtYW5jZS5zdGF0dXMgPSAwXG4gICAgfVxuICAgIGV2ZW50RW1pdHRlci5lbWl0KHNpbmdsZUV2ZW50TmFtZSwgW1wiY29sbGVjdFwiLCB0aGlzLnBlcmZvcm1hbmNlXSlcbiAgICAvLyBjb2xsZWN0KHRoaXMucGVyZm9ybWFuY2UpXG4gIH0sXG4gIHVwbG9hZDoge1xuICAgIG9ucHJvZ3Jlc3M6IGZ1bmN0aW9uIChlLCBuZXh0KSB7XG4gICAgICBuZXh0KClcbiAgICB9XG4gIH1cbn0pXG5cbi8qKlxuICog5om56YeP5Y+R6YCBQUpBWOaVsOaNrlxuICog5Yik5a6aWEhS5piv5ZCm54q25oCBT0tcbiAqIOWIpOaWreWPkemAgeeahOaVsOaNruaYr+WQpuW3sue7j+WwmuacquWIsOS6humFjee9ruWPkemAgeS4iumZkFxuICog5LiK6L+w5Lik5Liq5p2h5Lu26YO95ruh6Laz77yM5YiZ5Y+v5Lul5Y+R6YCBXG4gKi9cbmZ1bmN0aW9uIHNlbmQgKCkge1xuICBpZiAoeGhycyAmJiB4aHJzLmxlbmd0aCA+IDApIHtcbiAgICB2YXIgYmF0Y2ggPSBbXVxuICAgIHZhciBsZW4gPSB4aHJzLmxlbmd0aFxuICAgIHdoaWxlIChsZW4gPiAwICYmIGJhdGNoLmxlbmd0aCA8IGNvbmZpZy5tYXhMaW1pdCkge1xuICAgICAgdmFyIHhociA9IHhocnMuc2hpZnQoKVxuICAgICAgaWYgKHhoci5vaykge1xuICAgICAgICBiYXRjaC5wdXNoKHhocilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHhocnMucHVzaCh4aHIpXG4gICAgICB9XG4gICAgICBsZW4tLVxuICAgIH1cbiAgICBpZiAoYmF0Y2gubGVuZ3RoID4gMCkge1xuICAgICAgc2VuZGVyLnNlbmRCYXRjaChiYXRjaClcbiAgICB9XG4gIH1cbn1cblxuc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICBldmVudEVtaXR0ZXIuZW1pdChzaW5nbGVFdmVudE5hbWUsIFtcInNlbmRcIl0pXG59LCBjb25maWcudHJhbnNGcmVxdWVuY3kpXG5cbm1vZHVsZS5leHBvcnRzID0gZXZlbnRFbWl0dGVyXG4iXX0=
