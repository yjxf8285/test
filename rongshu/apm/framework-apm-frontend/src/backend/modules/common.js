module.exports = app => {
  return {
    formatObjectDecimal: require('./common/format-object-decimal'),
    AppTypeEnum: {
      // 通用类型
      COMMON: '0',
      // Java类型
      JAVA: '1',
      // Tuxedo类型
      TUXEDO: '2',
      // Browser探针
      BROWSER: '3',
      // PHP类型
      PHP: '4'
    },
    /**
   * Byte转换为MB数据
   * @param {any} request 请求
   * @param {any} response 返回
   * @param {any} responseData 返回对象
   */
    biteToMb (request, response, responseData) {
      if (responseData.unit && responseData.unit === 'b' && responseData.data && Array.isArray(responseData.data)) {
        responseData.data.forEach((item, index) => {
          item.list.forEach((listItem) => {
            listItem.y = Math.round(listItem.y / 1024 / 1024 * 1000) / 1000
          })
        })
        responseData.unit = 'MB'
      }
    },
    /**
   * 保留n位小数
   * @param srcNumber
   * @param n
   * @param isPad
   * @returns {*}
   */
    toDecimal (srcNumber, n = 3, isPad) {
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
    },
    /**
   * 补零
   * @param num
   * @returns {string}
   */
    pad (num) {
      return new Array(2 - ('' + num).length + 1).join(0) + num
    }
  }
}
