const Runtime = require('../runtime/index')
const SessionStore = Runtime.SessionStore
const config = Runtime.App.AppConfig.app
const crypto = require('crypto')

module.exports = {
  /**
   *
   *
   * @param {any} startIndex 页码
   * @param {any} pageSize 行
   * @param {any} startTime 开始时间
   * @param {any} endTime 结束时间
   * @param {any} timeInterval 时间间隔
   * @param {any} systemId 系统ID
   * @param {any} tieId TieID
   * @param {any} monitorId 监听ID
   * @returns
   */
  getAlarmTraceListAsync({
    startIndex,
    pageSize,
    startTime,
    endTime,
    timeInterval,
    systemId,
    tieId,
    monitorId
  }) {
    let url = '/alarmmanage/alarm/trace/list'
    let httpClient = new Runtime.App.HttpClient({
      httpHost: config.alarmRemoteHost,
      urlPath: url,
      formData: {
        'startIndex': startIndex || 0,
        'pageSize': pageSize || 10,
        'startTime': startTime || '',
        'endTime': endTime || '',
        'timeInterval': timeInterval || '',
        'systemId': systemId || '',
        'tieId': tieId || '',
        'monitorId': monitorId || ''
      }
    })
    return httpClient
      .post()
  }
}
