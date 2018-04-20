
/**
 * 网格布局
 * TODO 这个算法也需要优化
 */
class GridLayout {
  constructor (width, height, data) {
    this.rootWidth = width
    this.rootHeight = height
    this.data = data
    this.init()
    this.parseNodes()
    this.adjust()
    this.calNodesLocation()
    this.calScale()
  }

  init () {
    // TODO 这里其实用不到nodes和links，可以用数组项代替，只作占位计算坐标用而已
    this.nodes = this.data.nodes
    this.links = this.data.links
    this.row = 0
    this.col = 0
    this.hspace = 250 // 节点水平间隔
    this.vspace = 80 // 节点垂直间隔
    this.cell = {
      width: 100,
      height: 100
    }
    this.offsetWidth = 0
    this.offsetHeight = 0
  }

  parseNodes () {
    if (this.rootWidth <= 0 || this.rootHeight <= 0 || !this.nodes) return
    var map = {}
    for (var i = 0; i < this.nodes.length; i++) {
      var item = this.nodes[i]
      if (!map[item.group]) {
        this.col++
        map[item.group] = 0
      }
      map[item.group] = map[item.group] + 1
      if (this.row < map[item.group]) { this.row = map[item.group] }
    }
    this.map = map
  }

  adjust () {
    this.offsetWidth = this.rootWidth - this.col * this.cell.width - (this.col - 1) * this.hspace
    this.offsetHeight = this.rootHeight - this.row * this.cell.height - (this.row - 1) * this.vspace
    this.offsetWidth = this.offsetWidth < 0 ? 0 : this.offsetWidth / 3
    this.offsetHeight = this.offsetHeight < 0 ? 0 : this.offsetHeight / 2
    this.data.offsetLeft = this.offsetWidth
    this.data.offsetTop = this.offsetHeight
  }

  calNodesLocation () {
    for (var i = 0; i < this.nodes.length; i++) {
      var item = this.nodes[i]
      var grid = this.getGrid(item)
      item.x = grid[0] * (this.hspace + this.cell.width)
      item.y = grid[1] * (this.vspace + this.cell.height) + (item.innerRadius ? item.innerRadius : 0)
    }
  }

  getGrid (node) {
    // TODO 这种计算方式明显需要重构
    var row = parseInt(node.domId.substr(5, 2))
    var col = parseInt(node.domId.substr(8, 2))
    return [row, col]
  }

  calScale () {
    var scale = 1
    while (true) {
      var width = this.rootWidth - (this.col * this.cell.width + (this.col - 1) * this.hspace) * scale
      var height = this.rootHeight - (this.row * this.cell.height + (this.row - 1) * this.vspace) * scale
      if (width >= 0 && height >= 0) {
        break
      }
      scale = 0.87
      break
    }
    this.data.scale = scale
  }
}

export default GridLayout
