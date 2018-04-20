  import util from '_util'

  const intervals = {
  	'30m': 1000 * 60,
  	'1h': 1000 * 60 * 2,
  	'6h': 1000 * 60 * 15,
  	'12h': 1000 * 60 * 30,
  	'1d': 1000 * 60 * 60,
  	'3d': 1000 * 60 * 60 * 3,
  	'7d': 1000 * 60 * 60 * 6,
  	'14d': 1000 * 60 * 60 * 12,
  	'1m': 1000 * 60 * 60 * 24
  }

  /**
   * 对数组进行补数处理
   * @param {*DateTime} startTime 开始时间
   * @param {*DateTime} endTime 结束时间
   * @param {*Array} body 要补数据的数组
   * @param {*Int} count 要补充到的数据量 
   */
  let complementList = (interval, startTime, endTime, body) => {
  	let list = body.list
  	if (list.length >= 30)
  		return
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
  					startTime: util.formatDate(nextTime / 1000, 5),
  					endTime: util.formatDate((nextTime + interval) / 1000, 5)
  				}
  			}
  		} else {
  			current = {
  				x: nextTime,
  				y: 0,
  				startTime: util.formatDate(nextTime / 1000, 5),
  				endTime: util.formatDate((nextTime + interval) / 1000, 5)
  			}
  		}
  		prev = current
  		newList.push(current)
  	}
  	body.list = newList
  }
  export default {
  	methods: {
  		dataComplement(interval, startTime, endTime, data) {
  			data.forEach((list, index) => {
  				complementList(interval, startTime, endTime, list)
  			})
  			return data
  		}
  	}
  }