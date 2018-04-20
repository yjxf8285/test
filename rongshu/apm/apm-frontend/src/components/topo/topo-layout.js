
var TopoLayout = function() {
  this.root = null
  this.data = {}
  this.nodes = null
  this.links = null
  this.col = 0
  this.row = 0
  this.hspace = 250
  this.vspace = 50
  this.type = ''
  this.cell = {
    width: 100,
    height: 100
  }
  this.offsetWidth = 0
  this.offsetHeight = 0
  this.rootWidth = 0
  this.rootHeight = 0
  this.map = {}
}

TopoLayout.prototype.init = function() {
  this.row = 0
  this.col = 0
  this.hspace = 250
  this.vspace = 50
  this.type = ''
  this.cell = {
    width: 100,
    height: 100
  }
  this.offsetWidth = 0
  this.offsetHeight = 0
  this.rootWidth = this.root.offsetWidth
  this.rootHeight = this.root.offsetHeight
}

TopoLayout.prototype.layout = function(root, data, type) {
  if (!root) return
  this.root = root
  this.data = data
  this.nodes = data.nodes
  this.links = data.links
  this.type = type || 'grid'
  this.init()
  this.parseNodes()
  this.adjust()
  this.calNodesLocation()
  this.calScale()
}

TopoLayout.prototype.parseNodes = function() {
  if (!this.root || !this.nodes) return
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

TopoLayout.prototype.calNodesLocation = function() {
  if (!this.root || !this.nodes) return
  for (var i = 0; i < this.nodes.length; i++) {
    var item = this.nodes[i]
    var grid = this.getGrid(item)
    item.x = grid[0] * (this.hspace + this.cell.width)
    item.y = grid[1] * (this.vspace + this.cell.height) + (item.innerRadius ? item.innerRadius : 0)
  }
}

TopoLayout.prototype.calScale = function() {
  var scale = 1
  while (true) {
    var width = this.rootWidth - (this.col * this.cell.width + (this.col - 1) * this.hspace) * scale
    var height = this.rootHeight - (this.row * this.cell.height + (this.row - 1) * this.vspace) * scale
    if (width >= 0 && height >= 0) {
      break
    }
    scale = 0.87
    break
            // scale -= 0.03
            // if(scale <= 0.35){
            //     scale = 0.35
            //     break
            // }
  }
  this.data.scale = scale
}

TopoLayout.prototype.adjust = function() {
  this.offsetWidth = this.rootWidth - this.col * this.cell.width - (this.col - 1) * this.hspace
  this.offsetHeight = this.rootHeight - this.row * this.cell.height - (this.row - 1) * this.vspace
  this.offsetWidth = this.offsetWidth < 0 ? 0 : this.offsetWidth / 3
  this.offsetHeight = this.offsetHeight < 0 ? 0 : this.offsetHeight / 2
  this.data.offsetLeft = this.offsetWidth
  this.data.offsetTop = this.offsetHeight
}

TopoLayout.prototype.getGrid = function(node) {
  var row = parseInt(node.domId.substr(5, 2))
  var col = parseInt(node.domId.substr(8, 2))
  return [row, col]
}

export default TopoLayout
