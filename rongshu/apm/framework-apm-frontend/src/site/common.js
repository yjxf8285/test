const storeKeys = {
  selectedApplication: 'selected-application',
  selectedTimeRange: 'selected-timerange',
  selectedOriginTimeRange: 'selected-origin-timerange',
  applicationList: 'application-list'
}

let common = {
  storeKeys,
  storeEvents: (storeKeys => {
    let events = {}
    for (let key in storeKeys) {
      if (storeKeys.hasOwnProperty(key)) {
        events[key + 'Changed'] = storeKeys[key] + '-change'
      }
    }
    return events
  })(storeKeys),
  /**
   * 时间序列的线图数据转换
   * @param {* Array} data 后端API返回的数据集
   * @param {* Object | Function} options 需要覆盖的选项
   */
  lineChartDataFormatter (data, options) {
    return data.map(item => {
      let merge = {}
      if (Object.prototype.toString.call(options) === '[object Object]') {
        merge = options
      } else if (
        Object.prototype.toString.call(options) === '[object Function]'
      ) {
        merge = options(item)
      }
      return Object.assign(
        {
          name: item.name,
          unit: '',
          stack: '',
          points: item.list || []
        },
        merge
      )
    })
  }
}
export default common
