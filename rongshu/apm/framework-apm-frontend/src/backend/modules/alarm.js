const utils = require('apm-frontend-framework').Utils
module.exports = app => {
  return {
  /**
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
    getAlarmTraceListAsync ({startIndex, pageSize, startTime, endTime, timeInterval, systemId, tieId, monitorId}) {
      return utils.httpClient.post({
        host: app.config.alarmRemoteHost,
        url: '/alarmmanage/alarm/trace/list',
        body: {
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
    }
  }
}
