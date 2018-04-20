import d3 from '_d3'
import Node from './node'
import TopoUtil from '../../util/topo-util'

class CircleNode extends Node {
  constructor (root, data, option) {
    super(root, data, option)
    this.init()
  }

  init () {
    super.init()
    this.circleColor = this.data.circleColor || TopoUtil.CIRCLE_COLOR.HEALTHY
    this.spaceCircleColor = 'white'
    this.circleType = this.data.circleType
    this.attachmentRadius = this.option.attachmentRadius || TopoUtil.NODE_ATTACHMENT_RADIUS
    this.attachmentColor = this.option.attachmentColor || TopoUtil.NODE_ATTACHMENT_COLOR
  }

  renderBody () {
    console.log('render circle')
    let pie = this.getPie() // 饼形布局
    let arc = this.getArc() // 弧形生成器, 这里之所以使用弧形生成器来绘制节点而非两个叠加的圆形，考虑到空心圆是不属于节点的部分，但是从后面的需求来看，弧形生成器显得完全无用，这里完全可以用两个圆形叠加来实现绘制节点
    // if (this.data.crossApp) {
    //   this.data.status = [{ value: 1, name: 'crossApp' }]
    // }
    // 设置饼形，并有几块组成
    let node = this.container.selectAll('path.arc')
      .data(pie(this.data.status))
    // 为饼设置颜色，这里只因为只可能存在一个饼，因此只设置一个颜色即可，若需要为每个饼设置一个不同的颜色，则使用注释的代码
    node.enter()
      .append('path')
      .attr('class', 'arc node-core')
      .attr('fill', this.circleColor)
      // .attr('fill', function(d, i) {
      //   return colors[d.data.name]
      // })
    // 利用弧形生成器绘制环
    node.transition()
      .attrTween('d', function (d) {
        let currentArc = this.__current__
        if (!currentArc) {
          currentArc = {
            startAngle: 0,
            endAngle: 0
          }
        }
        let interpolate = d3.interpolate(currentArc, d)
        this.__current__ = interpolate(1)
        return function (t) {
          return arc(interpolate(t))
        }
      })
    // 绘制一个空心圆
    this.container.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.innerRadius)
      .attr('fill', this.spaceCircleColor)
    // 绘制圆心内容
    if (this.circleText) {
      this.container.append('text')
        .attr('class', 'instances')
        .attr('text-anchor', 'middle')
        .attr('y', 5)
        .text(this.circleText)
        // .text((this.data.activeInstances ? this.data.activeInstances : 0) + '/' + (this.data.instances ? this.data.instances : 0))
    }
    // 绘制节点名称
    this.container.append('text')
      .attr('class', 'pie-name')
      .attr('y', this.radius + 15)
      .attr('fill', this.smallFont.color)
      .style('text-anchor', 'middle')
      .text(this.name)
    // 绘制attachment
    if (this.attachmentSummary.show) {
      let texts = this.attachmentSummary.formatter(this.data)
      if (texts instanceof Array && texts.length > 0) {
        // 画文本
        let textCtl = this.container.append('text')
          .attr('class', 'pie-summary')
          .attr('x', this.radius)
          .attr('fill', this.smallFont.color)
        texts.forEach(text => {
          textCtl.append('tspan')
            .attr('x', this.radius + 10)
            .attr('class', 'adsFlowMapTextShadow')
            .attr('dy', 13)
            .text(text)
          textCtl.append('tspan')
            .attr('x', this.radius + 10)
            .text(text)
        })
        var height = texts.length * 13
        textCtl.attr('y', -height / 2)
      }
    }
    // 绘制环类型
    if (this.circleType) {
      // 画小圈
      let cx = -this.radius
      let cy = this.radius - this.attachmentRadius
      this.container.append('circle')
        .attr('class', 'attachement')
        .attr('fill', this.attachmentColor)
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', this.attachmentRadius)
      // 画文字
      this.container.append('text')
        .attr('class', 'attachement-text')
        .attr('fill', 'white')
        .attr('x', cx - this.attachmentRadius + 2)
        .attr('y', cy + 3)
        .text(this.circleType)
    }
    this.linkX = this.x + this.radius
    this.linkY = this.y + this.radius
    this.data.linkX = this.linkX
    this.data.linkY = this.linkY
  }

  getPie () {
    if (this.pie) return this.pie
    this.pie = d3.layout.pie()
      .value(function (d) {
        return d.value
      })
    return this.pie
  }

  getArc () {
    if (this.arc) return this.arc
    this.arc = d3.svg.arc()
      .outerRadius(this.radius)
      .innerRadius(this.innerRadius)
    return this.arc
  }
}

export default CircleNode
