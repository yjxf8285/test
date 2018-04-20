import DeepAssign from 'deep-assign'
import validator from '../backend/runtime/App/validator'
const util = {
  extend: DeepAssign,
  Validator: validator,
  ieVersion() {
    let userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
    let isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
    let isEdge = userAgent.indexOf('Edge') > -1 && !isIE // 判断是否IE的Edge浏览器
    let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
    if (isIE) {
      let reIE = new RegExp('MSIE (\\d+\\.\\d+);')
      reIE.test(userAgent)
      let fIEVersion = parseFloat(RegExp['$1'])
      if (fIEVersion === 7) {
        return 7
      } else if (fIEVersion === 8) {
        return 8
      } else if (fIEVersion === 9) {
        return 9
      } else if (fIEVersion === 10) {
        return 10
      } else {
        return 6// IE版本<=7
      }
    } else if (isEdge) {
      return 'edge'// edge
    } else if (isIE11) {
      return 11 // IE11
    } else {
      return -1// 不是ie浏览器
    }
  },
  handleHealthy(v) {
    switch (v) {
      case 'NORMAL':
        return {
          IconClass: 'icon-health-normality',
          Status: 'normality',
          Title: '一般'
        }
      case 'INTOLERANCE':
        return {
          IconClass: 'icon-health-intolerance',
          Status: 'intolerance',
          Title: '不容忍'
        }
      case 'HEALTHY':
        return {
          IconClass: 'icon-health-healthy',
          Status: 'healthy',
          Title: '健康'
        }
    }
  },
  handleTransType(transType) {
    switch (transType) {
      case 'SLOW':
        return {
          IconClass: 'icon-health-slow',
          Status: 'slow',
          Title: '缓慢'
        }
      case 'VERY_SLOW':
        return {
          IconClass: 'icon-health-very-slow',
          Status: 'very_slow',
          Title: '非常慢'
        }
      case 'ERROR':
        return {
          IconClass: 'icon-health-error',
          Status: 'error',
          Title: '错误'
        }
      case 'NORMAL':
      default:
        return {
          IconClass: 'icon-health-normal',
          Status: 'normal',
          Title: '正常'
        }
    }
  },
  /**
   * 数组求和
   * @param arr
   * @returns {*}
   */
  titleCount: function(arr) {
    /* eslint-disable no-new-func  */
    return (new Function('return ' + arr.join('+')))()
  },
  /**
   * 数组转换为百分比
   */
  toPercentageP(arr) {
    return arr.map(m => {
      if (m === 0) {
        return 0
      } else {
        let per = m / this.titleCount(arr) * 100
        return isNaN(per) ? 0 : this.toDecimal(per)
      }
    })
  },
  /**
   * 时间区间转颗粒度
   * @param interval (30m 1h 7d)
   * return ms
   * 规则 http://wiki.dataengine.com/pages/viewpage.action?pageId=15014245
   */
  intervalToGranularity(interval) {
    let resMs = 0
    // let intervalMs = this.stringToMs(interval)
    let intervalMs = interval // 直接传毫秒进来，不用转了
    // let t = intervalMs / 60000

    let rules = [
      {
        start: '1m',
        end: '60m',
        granularity: '1m'
      },
      {
        start: '60m',
        end: '2h',
        granularity: '2m'
      },
      {
        start: '2h',
        end: '5h',
        granularity: '5m'
      },
      {
        start: '5h',
        end: '10h',
        granularity: '10m'
      },
      {
        start: '10h',
        end: '15h',
        granularity: '15m'
      },
      {
        start: '15h',
        end: '30h',
        granularity: '30m'
      },
      {
        start: '30h',
        end: '60h',
        granularity: '1h'
      },
      {
        start: '60h',
        end: '120h',
        granularity: '2h'
      },
      {
        start: '120h',
        end: '180h',
        granularity: '3h'
      },
      {
        start: '180h',
        end: '240h',
        granularity: '4h'
      },
      {
        start: '240h',
        end: '360h',
        granularity: '6h'
      },
      {
        start: '360h',
        end: '600h',
        granularity: '10h'
      },
      {
        start: '600h',
        end: '720h',
        granularity: '12h'
      }
    ]
    rules.forEach(m => {
      if (this.stringToMs(m.start) < intervalMs && intervalMs <= this.stringToMs(m.end)) {
        resMs = this.stringToMs(m.granularity)
      }
    })
    return resMs
  },
  /**
   * 时间字符串转毫秒
   * @param timeString (1M,12h)
   * @returns timestamp
   */
  stringToMs(timeString) {
    let numExp = /\d+/g
    let unitExp = /[a-zA-Z]+/g
    let num = timeString.match(numExp)[0]
    let timeType = timeString.match(unitExp)[0]
    let enumeration = {
      m: 60000,
      h: 3600000,
      d: 86400000,
      w: 604800000,
      M: 2592000000
    }
    let res = num * enumeration[timeType]
    return res
  },
  /**
   * interval 转开始和结束时间
   * @param beforeTime
   * @returns {{startTime: number, endTime: number}}
   */
  createTimeSection(beforeTime) {
    let bt = this.stringToMs(beforeTime)
    let ct = new Date().getTime()
    // let date = new Date()
    // let year = date.getFullYear()
    // let mon = date.getMonth() + 1
    // let da = date.getDate()
    // let day = date.getDay()
    // let h = date.getHours()
    // let m = date.getMinutes()
    // let s = date.getSeconds()
    // let ms = date.getMilliseconds()
    return {
      startTime: ct - bt,
      endTime: ct
    }
  },
  /**
   * 格式化endTime 根据结束时间和当前时间的比较减去对于的分钟再取整
   * @param endTime
   * @returns {number}
   */
  cutEndTime(endTime) {
    return endTime
    // let nowDate = new Date().getTime()
    // let res = 0
    // let diff = (nowDate - endTime) / 60000
    // let mNum = 0
    // if (diff >= 0) {
    //   mNum = 180000
    // }
    // if (diff >= 1) {
    //   mNum = 120000
    // }
    // if (diff >= 2) {
    //   mNum = 60000
    // }
    // if (diff >= 3) {
    //   mNum = 0
    // }
    // res = endTime - mNum
    // let unixTimestamp = new Date(res)
    // let s = unixTimestamp.getSeconds()
    // let ms = unixTimestamp.getMilliseconds()
    // res = res - s * 1000 - ms // 再减秒和毫秒
    // return res
  },
  /**
   * 数据分页
   * @param page
   * @param size
   * @param oData
   */
  pagingData(page, size, oData) {
    let res = []
    let start = page * size
    let end = start + size
    oData.map((m, i) => {
      if (start <= i && i < end) res.push(m)
    })
    return res
  },
  interval(fn, time = 60000) {
    return setInterval(() => {
      fn()
    }, time)
  },
  uuid() {
    let i, random
    let uuid = ''
    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-'
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
        .toString(16)
    }
    return uuid
  },
  getChartColors() {
    return ['#5bd4c7', '#62a9ed', '#8bc34a', '#fabb3d', '#c090ec', '#67c2ef', '#fcdd5f', '#fd7979', '#7381ce']
  },
  // 绿桔红三色
  getGORColors() {
    return ['#5bd4c7', '#FFCC99', '#FF1F1F']
  },
  /**
   * 保留n位小数
   * @param srcNumber
   * @param n
   * @param isPad
   * @returns {*}
   */
  toDecimal(srcNumber, n = 2, isPad) {
    let dstNumber = parseFloat(srcNumber)
    if (isNaN(dstNumber)) {
      return srcNumber
    }
    if (dstNumber >= 0) {
      dstNumber = parseInt(dstNumber * Math.pow(10, n) + 0.5) / Math.pow(10, n)
    } else {
      let tmpDstNumber = -dstNumber
      dstNumber = parseInt(tmpDstNumber * Math.pow(10, n) + 0.5) / Math.pow(10, n)
    }
    let dstStrNumber = dstNumber.toString()
    let dotIndex = dstStrNumber.indexOf('.')
    // 是否补0
    if (isPad) {
      if (dotIndex < 0) {
        dotIndex = dstStrNumber.length
        dstStrNumber += '.'
      }
      while (dstStrNumber.length <= dotIndex + n) {
        dstStrNumber += '0'
      }
    }
    return Number(dstStrNumber)
  },
  /**
   * 补零
   * @param num
   * @returns {string}
   */
  pad(num) {
    return new Array(2 - ('' + num).length + 1).join(0) + num
  },
  /**
   * 格式化日期
   * @param val 时间戳 接受单位为毫秒
   * @param type 1：完整显示，2：不显示年,3:不显示分秒
   */
  formatDate(val, type = 1) {
    let result = ''
    let timestamp = val
    let d = new Date()
    d.setTime(timestamp)
    let year = d.getFullYear()
    let month = this.pad(d.getMonth() + 1)
    let day = this.pad(d.getDate())
    let housrs = this.pad(d.getHours())
    let minutes = this.pad(d.getMinutes())
    let seconds = this.pad(d.getSeconds())
    switch (type) {
      case 1:
        result = year + '-' + month + '-' + day + ' ' + housrs + ':' + minutes + ':' + seconds
        break
      case 2:
        result = month + '-' + day + ' ' + housrs + ':' + minutes
        break
      case 3:
        result = year + '-' + month + '-' + day
        break
      case 4:
        result = minutes + ':' + seconds
        break
      case 5:
        result = year + '-' + month + '-' + day + ' ' + housrs + ':' + minutes
        break
      default:
        result = year + '-' + month + '-' + day + ' ' + housrs + ':' + minutes + ':' + seconds
        break
    }
    return result
  },
  /**
   * 获得地址栏传递参数
   * @returns {}
   * demo.html?cid=1&aa=2
   */
  getLocationParams: function(href) {
    href = href || location.href
    let params = {}
    let query
    if (href.indexOf('?') !== -1) {
      query = href.slice(href.indexOf('?') + 1)
      if (query.length > 0) {
        params = {}
        query = query.split('&')
        query.map(function(param) {
          let tempParam = param.split('=')
          params[tempParam[0]] = decodeURI(param.substring(param.indexOf('=') + 1, param.length))
        })
      }
    }
    return params
  }
}
export default util
