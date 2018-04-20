import Node from './node'

class ImgNode extends Node {
  constructor (root, data, options) {
    super(root, data, options)
    this.init()
  }

  init () {
    super.init()
    this.img = this.data.img || ''
    this.width = 0
  }

  renderBody () {
    console.log('render img')
    // 绘制图片节点
    this.width = this.radius * 2 * (2 / 3)
    this.container.append('image')
      .attr('class', 'node-core')
      .attr('width', this.width)
      .attr('height', this.width)
      .attr('xlink:href', this.img)
    // 绘制name
    this.container.append('text')
      .attr('class', 'pie-name')
      .attr('y', this.width + 10)
      .attr('fill', this.smallFont.color)
      .style('text-anchor', 'middle')
      .attr('transform', 'translate(' + (this.width / 2) + ')')
      .text(this.name)
    this.linkX = this.x + this.radius
    this.linkY = this.y + this.radius
    this.data.linkX = this.linkX
    this.data.linkY = this.linkY
    this.data.width = this.width
  }
}

export default ImgNode
