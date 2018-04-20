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