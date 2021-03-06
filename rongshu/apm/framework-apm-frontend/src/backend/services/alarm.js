
module.exports = app => {
  return {
    '/api/alarm/trace/list': {
      method: 'post',
      validate: [{
        field: 'startIndex',
        options: {
          required: true,
          missingMessage: 'startIndex参数丢失'
        }
      }, {
        field: 'pageSize',
        options: {
          required: true,
          missingMessage: 'pageSize参数丢失'
        }
      }, {
        field: 'startTime',
        options: {
          required: false
        }
      }, {
        field: 'timeInterval',
        options: {
          required: false
        }
      }, {
        field: 'systemId',
        options: {
          required: false
        }
      }, {
        field: 'tieId',
        options: {
          required: false
        }
      }, {
        field: 'monitorId',
        options: {
          required: false
        }
      }],
      request: function (req, res, callback) {
        let actionResult = {
          success: false,
          code: -1,
          msg: 'error'
        }
        app.modules.alarm.getAlarmTraceListAsync(req.body)
          .then(result => {
            callback(result || {
              success: false,
              msg: '请求失败！'
            })
          })
          .catch(ex => {
            actionResult.success = false
            actionResult.code = -1
            actionResult.msg = ex
            console.error(ex)
            callback(actionResult)
          })
      }
    }
  }
}
