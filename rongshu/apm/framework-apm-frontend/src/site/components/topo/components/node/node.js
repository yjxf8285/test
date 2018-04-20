
import d3 from '_d3'
import Part from '../part'
import TopoUtil from '../../util/topo-util'

class Node extends Part {
  constructor (root, data, option) {
    super(root, data, option)
    console.log()
  }

  init () {
    this.radius = this.option.radius || TopoUtil.NODE_RADIUS
    this.innerRadius = this.option.innerRadius || TopoUtil.NODE_INNER_RADIUS
    this.row = this.data.row
    this.col = this.data.col
    this.smallFont = Object.assign({
      color: '#3e3d39',
      size: 12
    }, this.option.smallFont)
    this.bigFont = Object.assign({
      color: '#3e3d39',
      size: 14
    }, this.option.bigFont)
    this.attachmentSummary = Object.assign({
      show: false,
      formatter: function (d) {
        return d
      },
      position: 'right'
    }, this.data.attachmentSummary)
    // 做拖动节点计算
    this.offsetX = 0
    this.offsetY = 0
    this.dragFlag = false
    this.packageData()
  }

  packageData () {
    this.data.radius = this.radius
    this.data.innerRadius = this.innerRadius
  }

  render () {
    if (!this.id || !this.name || this.hide) return
    if (!this.container) {
      // this.x = this.radius + this.x
      // this.y = this.radius + this.y
      this.container = this.root.append('g').attr('class', 'node ' + this.data.domId)
        .attr('transform', 'translate(' + (this.radius + this.x) + ',' + (this.radius + this.y) + ')')
    }
    this.renderBody()
    this.addEvent()
  }

  renderBody () {
    console.log("i am all node parent, i can't exec!")
  }

  addEvent () {
    var self = this
    // 鼠标拖拽事件
    this.container.call(
      d3.behavior.drag().on('drag', function () {
        // TODO 个别浏览器下导致的不能下钻的临时解决方案，
        if (d3.event.sourceEvent.offsetX === self.offsetX && d3.event.sourceEvent.offsetY === self.offsetY) {
          return
        }
        if (!self.dragFlag) {
          setTimeout(function () {
            self.dragFlag = true
          }, 200)
        }
        d3.select(this)
          .attr('transform', function (d) {
            return 'translate(' + (d3.event.x) + ', ' + (d3.event.y) + ')'
          })
        self.data.linkX = d3.event.x
        self.data.linkY = d3.event.y
        // 告知父节点位置发生变化
        self.emit('drag', self)
      })
        .on('dragstart', function (e) {
          self.offsetX = d3.event.sourceEvent.offsetX
          self.offsetY = d3.event.sourceEvent.offsetY
          d3.event.sourceEvent.stopPropagation()
          self.emit('down', self)
        }).on('dragend', function () {
          self.offsetX = 0
          self.offsetY = 0
          self.emit('up', self.data, d3.event.sourceEvent, self.dragFlag)
          self.dragFlag = false
        // self.$emit('onMouseUp', self.data)
        })
    )
    // 鼠标进入事件
    this.container.on('mouseenter', function () {
      self.emit('mouseenter', self)
    })
    // 鼠标离开事件
    this.container.on('mouseleave', function () {
      self.emit('mouseleave', self)
    })
  }
}

export default Node
