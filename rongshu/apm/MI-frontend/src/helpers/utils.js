/**
 * Created by liuxiaofan on 2017/9/26.
 */

exports.uuid = () => {
  let i, random
  let uuid = ''
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-'
    }
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16)
  }
  return uuid
}

exports.on = (element, event, handler) => {
  if (element && event && handler) {
    document.addEventListener ? element.addEventListener(event, handler, false) : element.attachEvent('on' + event, handler)
  }
}

exports.off = (element, event, handler) => {
  if (element && event) {
    document.removeEventListener ? element.removeEventListener(event, handler, false) : element.detachEvent('on' + event, handler)
  }
}

exports.toDecimal = function (srcNumber, n = 3, isPad) {
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

  return dstStrNumber
}
/**
 * 补零
 * @param num
 * @returns {string}
 */
exports.pad = function (num) {
  return new Array(2 - ('' + num).length + 1).join(0) + num
}

exports.isEmptyString = function (str) {
  return str === '' || /^\s+$/g.test(str)
}

exports.isEmptyArray = function (arr) {
  return !arr || !(arr instanceof Array) || !arr.length
}

exports.getEchartsTheme = function () {
  return {
    color: [
      '#c23531',
      '#2f4554',
      '#61a0a8',
      '#d48265',
      '#91c7ae',
      '#749f83',
      '#ca8622',
      '#bda29a',
      '#6e7074',
      '#546570',
      '#c4ccd3'
    ]
  }
}
/**
 * 格式化日期
 * @param val 时间戳（例如：1477363297）
 * @param type 1：完整显示，2：不显示年,3:不显示分秒
 */
exports.formatDate = function (val, type = 1) {
  let result = ''
  let date = new Date(parseInt(val))
  let year = date.getFullYear()
  let month = exports.pad(date.getMonth() + 1)
  let day = exports.pad(date.getDate())
  let housrs = exports.pad(date.getHours())
  let minutes = exports.pad(date.getMinutes())
  let seconds = exports.pad(date.getSeconds())
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
}
