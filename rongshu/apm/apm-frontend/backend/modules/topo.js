const Runtime = require('../runtime/index')
const config = Runtime.App.AppConfig.app

let topo = {
  iconSize: 50,
  hmargin: 400,
  vmargin: 200,
  hpadding: 100,
  vpadding: 200,
  startX: 0,
  startY: 0,
  userList: [],
  serviceList: [],
  dbList: [],
  rpcList: [],
  mqList: [],
  /**
   * @returns
   */
  getTopoDataAsync(opts) {
    let url = '/agent/sys/topology'
    let httpClient = new Runtime.App.HttpClient({
      httpHost: config.host,
      urlPath: url,
      formData: {
        'systemId': opts.systemId,
        'interval': opts.interval
      }
    })
    return httpClient.post()
  },

  getTopoData(opts) {
    return this.getTopoDataAsync(opts)
      .then(result => {
        topo.fixData(result.data)
        return result
      })
  },

  // 获取去仪表盘拓扑的java接口
  getDashBoardTopoDataAsync(opts) {
    let url = '/server/v2/application/dashboard/topology-graph'
    let httpClient = new Runtime.App.HttpClient({
      httpHost: config.host,
      urlPath: url,
      formData: {
        condition: opts

      }
    })
    return httpClient.post()
  },
  // 获取去仪表盘拓扑的方法
  getDashBoardTopoData(opts) {
    return this.getDashBoardTopoDataAsync(opts)
      .then(result => {
        topo.fixData(result.data)
        return result
      })
  },
  // 获取事务2级拓扑的java接口
  getTransSecondTopoDataAsync(opts) {
    let url = '/server/v2/transaction/second-topology'
    let httpClient = new Runtime.App.HttpClient({
      httpHost: config.host,
      urlPath: url,
      formData: {
        condition: opts

      }
    })
    return httpClient.post()
  },
  // 获取事务2级拓扑的方法
  getTransSecondTopoData(opts) {
    return this.getTransSecondTopoDataAsync(opts)
      .then(result => {
        topo.fixData(result.data)
        return result
      })
  },

  fixData: function(result) {
    this.userList = []
    this.serviceList = []
    this.dbList = []
    this.rpcList = []
    this.mqList = []
    if (!result || !result.nodes) {
      result = {}
      result.nodes = []
      result.links = []
      return
    }
    this.mergeRemote(result)
    this.mergeUser(result)
    for (let i = 0; i < result.nodes.length; i++) {
      let node = result.nodes[i]
      switch (node.type) {
        case 'USER':
          this.userList.push(node)
          node.symbol = 'image://static/images/user.png'
          node.group = node.type
          break
        case 'SERVER':
          this.serviceList.push(node)
          node.symbol = 'image://static/images/java.png'
          node.group = node.type
          node.symbol = ''
          node.isServer = true
          node.serverName = 'Java'
          node.status = []
          node.innerRadius = 23
          let apdex = node.apdex ? node.apdex : 0
          let apdex2 = node.apdex2 ? node.apdex2 : 0
          let apdex3 = node.apdex3 ? node.apdex3 : 0
          let total = apdex + apdex2 + apdex3
          if (total === 0) {
            node.status.push({value: 1, name: 'normal'})
          } else {
            node.status.push({value: (apdex / total), name: 'normal'})
            node.status.push({value: (apdex2 / total), name: 'warning'})
            node.status.push({value: (apdex3 / total), name: 'error'})
          }
          break
        case 'DATABASE':
          this.dbList.push(node)
          // 显示samllType,弹框显示name,因此这里需要更改原name值
          node.name2 = node.name
          node.name = node.smallType + '\n' + node.id
          node.symbol = 'image://static/images/mysql.png'
          node.group = node.type
          break
        case 'NOSQL':
          this.dbList.push(node)
          node.name2 = node.name
          node.name = node.smallType + '\n' + node.id
          node.symbol = 'image://static/images/nosql.png'
          node.group = node.type
          break
        case 'HTTP':
          // rpc和http放同一处，因此只需要一个列表即可
          this.rpcList.push(node)
          node.symbol = 'image://static/images/http.png'
          node.group = 'RPC'
          break
        case 'RPC':
          this.rpcList.push(node)
          node.symbol = 'image://static/images/rpc.png'
          node.group = node.type
          break
        case 'MQ':
          this.mqList.push(node)
          node.symbol = 'image://static/images/mq.png'
          node.group = node.type
          break
      }
      if (!node.showName) { node.showName = node.name }
    }

    for (let i = 0; i < result.links.length; i++) {
      let link = result.links[i]
      let node = this.findNodeById(result, link.source)
      let label = link.count + 'cpm, ' + link.times + 'ms'
      link.source = this.findNodeIndexById(result, link.source)
      link.target = this.findNodeIndexById(result, link.target)
      if (link.source === link.target) {
        let arr = node.symbol.split('.')
        node.name = node.name + '\r\n(' + label + ')'
        if (arr.length === 2) {
          node.symbol = arr[0] + '_loop.' + arr[1]
        }
      }
      if (link.source === undefined || link.target === undefined || link.source === link.target) {
        result.links.splice(i, 1)
        i--
        continue
      }
      link.label = label.replace('cpm', 'rpm')
      link.id = 'link' + i
      link.source = result.nodes[link.source]
      link.target = result.nodes[link.target]
      // 线位置改变监听变量
      link.change = 0
      // 线上播放箭头动画监听变量
      link.play = false
      link.dragFlag = false
    }
    // this.locate(result)

    this.createDomId()
  },

  mergeRemote(result) {
    var nodes = result.nodes
    var links = result.links
    var map = {}
    for (let i = 0; i < nodes.length; i++) {
      var node = nodes[i]
      switch (node.type) {
        case 'RPC':
        case 'HTTP':
          var tiers = []
          var tiersName = []
          for (var j = 0; j < links.length; j++) {
            var link = links[j]
            if (link.target === node.id) {
              tiers.push(link.source)
              let n = this.findNodeById(result, link.source)
              tiersName.push(n.name)
            }
          }
          node.tierArr = tiers
          node.tierNameArr = tiersName
          node.tiers = tiers.join(',')
          node.tierType = node.type
          if (!node.tiers) {
            continue
          }
          if (!map[node.tierType + node.tiers]) {
            map[node.tierType + node.tiers] = []
            map[node.tierType + node.tiers].push(node)
          } else {
            map[node.tierType + node.tiers].push(node)
            map[node.tierType + node.tiers][0].showName = 'remote(' + map[node.tierType + node.tiers].length * node.tierArr.length + ')'
            if (!map[node.tierType + node.tiers][0].list) {
              map[node.tierType + node.tiers][0].list = []
              // map[node.tierType + node.tiers][0].list.push(this.deepCopy(map[node.tierType + node.tiers][0]))
              this.packageNode(this.deepCopy(map[node.tierType + node.tiers][0]), links, map)
            }
            this.packageNode(node, links, map)
            // for(var k=0; k<links.length; k++){
            //   if(links[k].source==node.id || links[k].target == node.id){
            //     links.splice(k, 1)
            //     k--
            //   }
            // }
            nodes.splice(i, 1)
            i--
          }
          break
      }
    }
  },

  packageNode(node, links, map, flag) {
    for (let l = 0; l < node.tierArr.length; l++) {
      let tierId = node.tierArr[l]
      let n = this.deepCopy(node)
      n.tiers = tierId
      // n.elapsedTime = '111ms'
      n.tiersName = node.tierNameArr[l]
      for (var k = 0; k < links.length; k++) {
        if (links[k].source === tierId && links[k].target === n.id) {
          n.elapsedTime = links[k].elapsedTime
          break
        }
      }
      map[node.tierType + node.tiers][0].list.push(n)
    }
  },

  deepCopy(data) {
    var type = this.getType(data)
    var obj
    if (type === 'array') {
      obj = []
    } else if (type === 'object') {
      obj = {}
    } else {
           // 不再具有下一层次
      return data
    }
    if (type === 'array') {
      for (var i = 0, len = data.length; i < len; i++) {
        obj.push(this.deepCopy(data[i]))
      }
    } else if (type === 'object') {
      for (var key in data) {
        obj[key] = this.deepCopy(data[key])
      }
    }
    return obj
  },

  getType(obj) {
    var toString = Object.prototype.toString
    var map = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object'
    }
    // if (obj instanceof Element) {
    //   return 'element'
    // }
    return map[toString.call(obj)]
  },

  mergeUser(result) {
    var userIndexArr = []
    var firstUserFlg = true
    var userIndex = 0
    for (let i = 0; i < result.nodes.length; i++) {
      let node = result.nodes[i]
      if (node.type === 'USER') {
        // 如果是第一个用户节点，则保留数据
        if (firstUserFlg) {
          firstUserFlg = false
          userIndex = node.id
          continue
        }
        userIndexArr.push(node.id)
        // 注意这里一定不能删除多余的用户节点，因为link中的source、target是根据node下标进行定位的，删除后，会导致部分link找不到对应的node，出现严重BUG
        // result.nodes.splice(i, 1)
        node.hide = true

        // i--
      }
    }
    // 将link的source中用户节点进行更新
    for (let i = 0; i < result.links.length; i++) {
      let link = result.links[i]
      for (let j = 0; j < userIndexArr.length; j++) {
        if (link.source === userIndexArr[j]) {
          link.source = userIndex
          break
        }
      }
    }
  },

  createDomId() {
    var nodes = []
    if (this.userList.length > 0) { nodes.push(this.userList) }
    if (this.serviceList.length > 0) { nodes.push(this.serviceList) }
    if (this.rpcList.length > 0) {
      nodes.push(this.rpcList)
    }
    if (this.mqList.length > 0) {
      nodes.push(this.mqList)
    }
    if (this.dbList.length > 0) {
      nodes.push(this.dbList)
    }
    nodes.forEach(function(row, i) {
      row.forEach(function(item, j) {
        item.domId = 'node_' + (i < 10 ? '0' + i : i) + '_' + (j < 10 ? '0' + j : j) + '_' + parseInt((Math.random().toFixed(8) * 100000000))
      })
    })
  },

  locate() {
    this.locateUser()
    this.locateService()
    this.locateDB()
    this.locateRPC()
    this.locateMQ()
  },

  locateUser() {
    var startX = this.startX
    this.userList.forEach(function(element, i) {
      element.x = startX
      element.y = i * (this.vpadding + this.iconSize)
    }, this)
  },

  locateService() {
    var startX = this.startX + this.hmargin
    this.serviceList.forEach(function(element, i) {
      element.x = startX + (i % 2) * (this.hpadding + this.iconSize)
      element.y = i * (this.vpadding + this.iconSize)
    }, this)
  },

  locateDB() {
    var startX = this.startX + 2 * this.hmargin + this.serviceList.length * (this.hpadding + this.iconSize)
    this.dbList.forEach(function(element, i) {
      element.x = startX
      element.y = i * (this.vpadding + this.iconSize)
    }, this)
  },

  locateRPC() {
    var maxIndex = this.serviceList.length
    var startY = this.vmargin + maxIndex * this.iconSize + (maxIndex - 1) * this.vpadding
    this.rpcList.forEach(function(element, i) {
      element.x = i * (this.hpadding + this.iconSize) + this.hpadding
      element.y = startY
    }, this)
  },

  locateMQ() {
    var startY = -this.vmargin / 2 - this.iconSize - this.vpadding
    this.mqList.forEach(function(element, i) {
      element.x = i * (this.hpadding + this.iconSize) + this.hpadding
      element.y = startY
    }, this)
  },

  findNodeIndexById(result, id) {
    // TODO 要下面的
    // return id
    for (var i = 0; i < result.nodes.length; i++) {
      var node = result.nodes[i]
      if (node.id === id) {
        return i
      }
    }
  },

  findNodeById(result, id) {
    // TODO 要下面的
    // return result.nodes[id]
    for (var i = 0; i < result.nodes.length; i++) {
      var node = result.nodes[i]
      if (node.id === id) {
        return node
      }
    }
  }
}

module.exports = topo
