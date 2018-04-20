let formatObjectDecimal = (function() {
  function isFloat(n) {
    return ~~n !== n
  }

  function formaObjectProperty(obj, prop, value) {
    value = value || obj[prop]
    let propType = Object.prototype.toString.call(value)
    switch (propType) {
      case '[object Number]':
        formatNumber(obj, prop, value)
        break
      case '[object Array]':
        formatArray(obj, prop, value)
        break
      case '[object Object]':
        formatObject(obj[prop])
        break
        /* case '[object String]':
        case '[object Null]':
        case '[object Undefined]': */
      default:
        break
    }
  }

  function formatNumber(obj, prop, value) {
    value = value || obj[prop]
    if (isFloat(value)) {
      obj[prop] = Math.round(value * 100) / 100
    }
  }

  function formatArray(obj, prop, value) {
    value = value || obj[prop]
    obj[prop].forEach((item, index) => {
      let propType = Object.prototype.toString.call(item)
      switch (propType) {
        case '[object Number]':
          formatNumber(obj[prop], index, item)
          break
        case '[object Array]':
          formatArray(obj[prop], index, item)
          break
        case '[object Object]':
          formatObject(obj[prop][index])
          break
        default:
          break
      }
    })
  }

  function formatObject(obj) {
    Object.keys(obj).forEach(item => {
      formaObjectProperty(obj, item)
    })
  }
  return formatObject
})()

module.exports = formatObjectDecimal
