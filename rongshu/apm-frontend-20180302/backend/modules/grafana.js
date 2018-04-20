const Runtime = require('../runtime/index')
const config = Runtime.App.AppConfig.app
const topo = require('./topo')

function convertTimeserieData(dataFromApi) {
  let res = []
  if (dataFromApi && dataFromApi.data) {
    res = dataFromApi.data
    if (res && res.length) {
      return res.map(serie => {
        return {
          target: serie.name === 'None' ? '' : serie.name,
          datapoints: serie.list.map(point => {
            return [point.y, point.x]
          })
        }
      })
    }
  }
  return res
}
function getTimeserieClient(opts, url) {
  return new Runtime.App.HttpClient({
    httpHost: config.host,
    urlPath: url,
    formData: {
      'systemId': opts.systemId,
      'interval': opts.interval,
      'size': 5
    }
  })
}

let grafana = {
/**
 * @returns
 */
  getTopoData(opts) {
    return topo.getTopoData(opts)
                .then(result => {
                  let links = result.data.links
                  let nodes = result.data.nodes
                  let columns = [{'text': 'nodes', type: 'string'},
                                  {'text': 'links', type: 'string'}]
                  let rows = [nodes, links]
                  let data = [{type: 'table', 'columns': columns, 'rows': rows}]
                  nodes.forEach(function(item, i) {
                    item.symbol = item.symbol.replace('static', 'public/static')
                  }, this)
                  result = data
                  return result
                })
  },

  getWebTop5(opts) {
    return getTimeserieClient(opts, '/webTransaction/topLineChart').post().then(result => {
      return convertTimeserieData(result)
    })
  },
  getWebTransactionTps(opts) {
    return getTimeserieClient(opts, '/webTransaction/tps').post().then(result => {
      return convertTimeserieData(result)
    })
  },
  getWebTransactionAvgResponseTime(opts) {
    return getTimeserieClient(opts, '/webTransaction/avgResponseTime').post().then(result => {
      return convertTimeserieData(result)
    })
  },
  getDatabaseTop5(opts) {
    return getTimeserieClient(opts, '/dataBase/topLineChart').post().then(result => {
      return convertTimeserieData(result)
    })
  },
  getDatabaseTps(opts) {
    return getTimeserieClient(opts, '/dataBase/tps').post().then(result => {
      return convertTimeserieData(result)
    })
  },
  getDatabaseAvgResponseTime(opts) {
    return getTimeserieClient(opts, '/dataBase/avgResponseTime').post().then(result => {
      return convertTimeserieData(result)
    })
  },
  getErrorRateCount(opts) {
    return getTimeserieClient(opts, '/errorRate/count').post().then(result => {
      return convertTimeserieData(result)
    })
  }
}

module.exports = grafana
