import TopoUtil from '../util/topo-util'

/**
 * 封装处理拓扑的数据
 */
class DataSet {
  constructor (data) {
    this.data = data
    this.transfor()
  }

  transfor () {
    this.data.option = {
      node: {

      }
    }
    if (this.data.nodes) {
      this.dealNodeData()
    }
    if (this.data.links) {
      this.dealLinkData()
    }
  }

  dealNodeData () {
    this.data.nodes.forEach((item, i) => {
      // 节点类型
      item.nodeType = item.symbol ? TopoUtil.IMG_TYPE : TopoUtil.CIRCLE_TYPE
      // 环类型，
      item.circleType = item.serverName
      // 节点右面统计信息
      item.attachmentSummary = {}
      if (item.type === 'USER') {
        item.attachmentSummary.show = true
        item.attachmentSummary.formatter = function (node) {
          let summary = []
          if (node.elapsedTime) {
            summary.push(`${node.elapsedTime} ms(100%)`)
          }
          if (node.error) {
            summary.push(`${node.error} errors`)
          }
          return summary
        }
      } else if (item.type === 'SERVER') {
        item.attachmentSummary.show = true
        item.attachmentSummary.formatter = function (node) {
          let summary = []
          if (node.elapsedTime) {
            summary.push(parseFloat(node.elapsedTime).toFixed(2) + ' ms')
          }
          let callCount = node.rpm
          summary.push(`${callCount} rpm`)
          if (node.epm) {
            summary.push(`${node.epm} epm`)
          }
          return summary
        }
      }
      // 节点环颜色
      if (item.health) {
        item.circleColor = TopoUtil.CIRCLE_COLOR[item.health]
      }
      // 处理图片URL
      if (item.symbol) {
        item.img = this.resolveImgUrl(item.symbol)
      }
      // 活跃实例数设置
      item.circleText = (item.activeInstances ? item.activeInstances : 0) + '/' + (item.instances ? item.instances : 0)
      // 处理跨app调用
      if (item.crossApp) {
        // 跨app环的颜色特殊设定
        item.circleColor = TopoUtil.CIRCLE_COLOR['crossApp']
        item.circleText = null
      }
    })
  }

  dealLinkData () {
    this.data.links.forEach((item, i) => {
      if (item.source && item.target) {
        // 设置线类型
        item.nodeType = TopoUtil.LINK_TYPE
        // 设置线型 采用格子布局 且 在同一条线 且 不相邻的点需要画贝塞尔曲线
        var status = this.isSameLineNotSide(item)
        item.type = status === 0 ? TopoUtil.LINK_TYPE_LINE : TopoUtil.LINK_TYPE_BEZER

        item.bezerStatus = status
        // MQ节点的线需要用虚线
        item.needDash = (item.source.type === 'MQ' || item.target.type === 'MQ')
      }
    })
  }

  // getNodeById(id) {
  //   this.data.nodes.forEach((item, i) => {
  //     if (item.id === id) {
  //       return item
  //     }
  //   })
  // }

  // 在同一条线且不相邻的点返回true 若同一行返回1， 若同一列则返回2
  isSameLineNotSide (link) {
    var scol = link.source.col
    var srow = link.source.row
    var tcol = link.target.col
    var trow = link.target.row
    if (scol === tcol && srow + 1 !== trow && srow - 1 !== trow) {
      return 2
    } else if (srow === trow && scol + 1 !== tcol && scol - 1 !== tcol) {
      return 1
    } else {
      return 0
    }
  }

  resolveImgUrl (url) {
    var index = url.indexOf('image://')
    if (index >= 0) {
      return url.substr(index + 8)
    }
    return url
  }

  getTopoData () {
    return this.data
  }
}

export default DataSet
