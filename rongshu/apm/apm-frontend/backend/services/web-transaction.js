let modules = require('../modules')

module.exports = {
  '/webTransaction/tps': modules.common.avgMinuteCount,
  '/webTransaction/top': function(request, response, responseData) {
    responseData.data.map(m => {
      m.avg = modules.common.toDecimal(m.avg)
    })
  },
  '/dataBase/top': function(request, response, responseData) {
    responseData.data.map(m => {
      m.avg = modules.common.toDecimal(m.avg)
    })
  },
  '/dataBase/tps': modules.common.avgMinuteCount,
  '/dataBase/tpsFromSQL': modules.common.avgMinuteCount
}
