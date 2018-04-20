let moment = require('moment')

/**
 * 对数组进行补数处理
 * @param {*DateTime} startTime 开始时间
 * @param {*DateTime} endTime 结束时间
 * @param {*Array} body 要补数据的数组
 * @param {*Int} count 要补充到的数据量
 */
let complementList = (startTime, endTime, body, count) => {
  let list = body.list
  if (list.length >= 30) {
    return
  }
  let newList = []
  let timeSpan = endTime - startTime
  let interval = Math.floor(timeSpan / count)
  let current = null
  let prev = list[0]
  let currentTime = 0
  let nextTime = 0
  for (let i = 0; i < count; i++) {
    // 如果存在
    current = list.slice(0, 1)[0]
    if (current) {
      currentTime = current.x
      nextTime = startTime + interval * (i + 1)
      if (currentTime >= prev.x && currentTime < nextTime) {
        list.splice(0, 1)
      } else {
        current = {
          x: nextTime,
          y: 0,
          startTime: moment(nextTime).format('YYYY-MM-DD HH:mm'),
          endTime: moment(nextTime + interval).format('YYYY-MM-DD HH:mm')
        }
      }
    } else {
      current = {
        x: nextTime,
        y: 0,
        startTime: moment(nextTime).format('YYYY-MM-DD HH:mm'),
        endTime: moment(nextTime + interval).format('YYYY-MM-DD HH:mm')
      }
    }
    prev = current
    newList.push(current)
  }
  body.list = newList
}

let errorRate = {
  top(request, response, responseData) {
    responseData.data.forEach((e, i) => {
      e.max = 0
      e.min = 0
      e.avg = e.count
    })
  },
  count(request, response, responseData) {
    let startTime = responseData.startTime
    let endTime = responseData.endTime
    responseData.data.forEach((list, index) => {
      complementList(startTime, endTime, list, 30)
    })
    responseData.node = true
  }
}

module.exports = {
  '/errorRate/top': errorRate.top
  /* ,
  '/errorRate/countFromError': errorRate.count */
}
