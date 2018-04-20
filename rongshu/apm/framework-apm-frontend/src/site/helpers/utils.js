export default {
  toTimestamp (dateTime) {
    let startTime = new Date(dateTime.startDate + ' ' + dateTime.startTime).getTime()
    let endTime = new Date(dateTime.endDate + ' ' + dateTime.endTime).getTime()
    return {
      startTime: startTime,
      endTime: endTime
    }
  },
  formatTimestamp (timestamp) {
    var date = new Date(timestamp)
    return `${
      (date.getFullYear()).toString().padStart(2, '0')
    }-${
      (date.getMonth() + 1).toString().padStart(2, '0')
    }-${
      (date.getDate()).toString().padStart(2, '0')
    } ${
      (date.getHours()).toString().padStart(2, '0')
    }:${
      (date.getMinutes()).toString().padStart(2, '0')
    }:${
      (date.getSeconds()).toString().padStart(2, '0')
    }`
  }
}
