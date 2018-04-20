let Runtime = require('../runtime')
let log = Runtime.App.Log.helper
let esClient = Runtime.ESClient.getInstance()

module.exports.ping = () => {
  esClient.ping({
    requestTimeout: 30000
  }, error => {
    if (error) {
      log.error('elasticsearch cluster is down!')
    } else {
      log.info('everything is fine.')
    }
  })
}

module.exports.search = query => {
  esClient.search(query)
  .then(body => {
    log.info('query result :')
    log.info(body)
    return body
  })
  .catch(err => {
    log.error(err)
  })
}
