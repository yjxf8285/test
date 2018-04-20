
import d3 from '_d3'
import Part from '../part'
import TopoUtil from '../../util/topo-util'

class Link extends Part {
  constructor (root, data, option) {
    super(root, data, option)
    if (!root || !data) return
    this.root = root
    this.data = data
    this.option = option || {}
    this.init()
  }

  init () {
    this.source = this.data.source
    this.target = this.data.target
    if (!this.source || !this.target || this.source.hide || this.target.hide) return
    this.type = this.data.type || TopoUtil.LINK_TYPE_LINE
    this.needDash = this.data.needDash
    this.arrowLength = TopoUtil.LINK_ARROW_LENGTH
    this.arrowHeight = 4
    this.arrowMargin = 50
    this.playTime = 3000
    // 线的起点
    this.csource = {x: 0, y: 0}
    // 线的终点
    this.ctarget = {x: 0, y: 0}
    // 贝塞尔的控制点
    this.cbezer = {x: 0, y: 0}
    this.hasArrow = this.option.arrow || true
    this.arrowAnimation = this.option.arrowAnimation || true
    this.startArrowData = ''
    this.endArrowData = ''
    this.playArrowData = ''
    this.stopArrowData = ''
  }

  render () {
    if (!this.container) {
      this.container = this.root.append('g').attr('class', 'link')
    }
    this.renderBody()
  }

  update () {
    this.render()
  }

  renderBody () {
    this.csource = this.getCircleCenter(this.source)
    this.ctarget = this.getCircleCenter(this.target)
    if (!this.csource || !this.ctarget) return
    this.drawLine()
    this.drawText()
    if (this.hasArrow) {
      this.drawArrow()
    }
  }

  drawLine () {
    // TODO 下面这段计算线的两端坐标公式需要优化
    let sangle = this.calAngle(this.csource, this.ctarget)
    let tangle = sangle + Math.PI
    // 若节点是圆环，则需要计算新的点，不能使用圆点划线，而应该从直线与圆的交点处划线， 该点的计算公式使用极坐标公式来计算
    if (this.source.nodeType === TopoUtil.CIRCLE_TYPE) {
      this.csource.x += this.source.radius * Math.cos(sangle)
      this.csource.y += this.source.radius * Math.sin(sangle)
    } else {
      this.csource.x += this.source.radius / 2 * Math.cos(sangle)
      this.csource.y += this.source.radius / 2 * Math.sin(sangle)
    }
    if (this.target.nodeType === TopoUtil.CIRCLE_TYPE) {
      this.ctarget.x += this.target.radius * Math.cos(tangle)
      this.ctarget.y += this.target.radius * Math.sin(tangle)
    } else {
      this.ctarget.x += this.target.radius / 2 * Math.cos(tangle)
      this.ctarget.y += this.target.radius / 2 * Math.sin(tangle)
    }
    // 绘制贝塞尔曲线
    if (this.type === TopoUtil.LINK_TYPE_BEZER) {
      let space = this.getNodeSpace()
      this.cbezer.x = this.data.bezerStatus === 1
        ? (this.csource.x + this.ctarget.x) / 2
        : this.csource.x - space * this.source.radius
      this.cbezer.y = this.data.bezerStatus === 1
        ? this.csource.y - space * this.target.radius
        : (this.csource.y + this.ctarget.y) / 2
      if (this.container.select('path.bezer').empty()) {
        this.container.append('path')
          .attr(
            'd',
            'M' +
              this.csource.x +
              ',' +
              this.csource.y +
              ' Q' +
              this.cbezer.x +
              ',' +
              this.cbezer.y +
              ' ' +
              this.ctarget.x +
              ',' +
              this.ctarget.y
          )
          .attr('class', 'bezer')
      } else {
        this.container.select('path')
          .attr(
            'd',
            'M' +
              this.csource.x +
              ',' +
              this.csource.y +
              ' Q' +
              this.cbezer.x +
              ',' +
              this.cbezer.y +
              ' ' +
              this.ctarget.x +
              ',' +
              this.ctarget.y
          )
      }

    // 绘制普通直线
    } else {
      if (!this.container.select('line').empty()) {
        this.container.select('line')
          .attr('x1', this.csource.x)
          .attr('y1', this.csource.y)
          .attr('x2', this.ctarget.x)
          .attr('y2', this.ctarget.y)
      } else {
        this.container.append('line')
          .attr('x1', this.csource.x)
          .attr('y1', this.csource.y)
          .attr('x2', this.ctarget.x)
          .attr('y2', this.ctarget.y)
        // 移动时需要删除节点对应的bezer
        let bezer = this.container.select('path.bezer')
        if (!bezer.empty()) {
          bezer.remove()
        }
      }
    }

    if (this.data.needDash) {
      this.container.classed('dash', true)
    }
  }

  drawText () {
    // 画文本
    let text = this.container.select('text.line-text')
    let bgspan = this.container.select('text.line-text .adsFlowMapTextShadow')
    let realspan = this.container.select('text.line-text .real')
    if (text.empty()) {
      text = this.container.append('text').attr('class', 'line-text')
      bgspan = text.append('tspan')
        .attr('class', 'adsFlowMapTextShadow')
        .style('text-anchor', 'middle')
        .text(this.data.label)
      realspan = text.append('tspan')
        .attr('class', 'real')
        .text(this.data.label)
    }
    let centerX = (this.csource.x + this.ctarget.x) / 2
    let centerY = (this.csource.y + this.ctarget.y) / 2
    if (this.type === TopoUtil.LINK_TYPE_BEZER) {
      let bezerPoint = TopoUtil.getBeZerPoint(
        this.csource,
        this.ctarget,
        { x: this.cbezer.x, y: this.cbezer.y },
        0.5
      )
      if (text) {
        text.attr('x', bezerPoint.x).attr('y', bezerPoint.y)
        bgspan.attr('x', bezerPoint.x).attr('y', bezerPoint.y)
        realspan.attr('x', bezerPoint.x).attr('y', bezerPoint.y)
      }
    } else {
      if (text) {
        text.attr('x', centerX).attr('y', centerY + 3)
        bgspan.attr('x', centerX).attr('y', centerY + 3)
        realspan.attr('x', centerX).attr('y', centerY + 3)
      }
    }
  }

  drawArrow () {
    if (this.type === TopoUtil.LINK_TYPE_BEZER) {
      this.drawBezerArrow(this.csource, this.ctarget, {
        x: this.cbezer.x,
        y: this.cbezer.y
      })
    } else {
      this.drawLineArrow(this.csource, this.ctarget)
    }
  }

  drawBezerArrow (p1, p2, c) {
    var bezerLength = TopoUtil.getBeZerLength(p1, p2, c)
    var startArrowP1 = TopoUtil.getBeZerPoint(
      p1,
      p2,
      c,
      this.arrowMargin / bezerLength
    )
    var startArrowTail = TopoUtil.getBeZerPoint(
      p1,
      p2,
      c,
      (this.arrowMargin - this.arrowLength) / bezerLength
    )
    var k1 = TopoUtil.getlinek(startArrowTail, startArrowP1)
    var startArrowP2 = TopoUtil.getPointByLine(
      -1 / k1,
      this.arrowHeight,
      startArrowTail,
      1
    )
    var startArrowP3 = TopoUtil.getPointByLine(
      -1 / k1,
      this.arrowHeight,
      startArrowTail,
      -1
    )
    var endArrowP1 = TopoUtil.getBeZerPoint(
      p1,
      p2,
      c,
      (bezerLength - this.arrowMargin + this.arrowLength) / bezerLength
    )
    var endArrowTail = TopoUtil.getBeZerPoint(
      p1,
      p2,
      c,
      (bezerLength - this.arrowMargin) / bezerLength
    )
    var k2 = TopoUtil.getlinek(endArrowTail, endArrowP1)
    var endArrowP2 = TopoUtil.getPointByLine(
      -1 / k2,
      this.arrowHeight,
      endArrowTail,
      1
    )
    var endArrowP3 = TopoUtil.getPointByLine(
      -1 / k2,
      this.arrowHeight,
      endArrowTail,
      -1
    )
    this.playArrowP1 = TopoUtil.getBeZerPoint(
      p1,
      p2,
      c,
      this.arrowLength / bezerLength
    )
    var playArrowTail = p1
    this.playArrowP2 = TopoUtil.getPointByLine(
      -1 / k1,
      this.arrowHeight,
      playArrowTail,
      1
    )
    this.playArrowP3 = TopoUtil.getPointByLine(
      -1 / k1,
      this.arrowHeight,
      playArrowTail,
      -1
    )
    this.createArrow(startArrowP1, startArrowP2, startArrowP3, 'startArrow')
    this.createArrow(endArrowP1, endArrowP2, endArrowP3, 'endArrow')
    this.createArrow(
      this.playArrowP1,
      this.playArrowP2,
      this.playArrowP3,
      'playArrow'
    )
  }

  drawLineArrow (p1, p2) {
    var k,
      startArrowP1,
      startArrowTail,
      startArrowP2,
      startArrowP3,
      endArrowP1,
      endArrowTail,
      endArrowP2,
      endArrowP3,
      playArrowTail,
      stopArrowP1,
      stopArrowTail,
      stopArrowP2,
      stopArrowP3
    if (p1.x === p2.x) {
      startArrowP1 = {
        x: p1.x,
        y: p1.y < p2.y ? p1.y + this.arrowMargin : p1.y - this.arrowMargin
      }
      startArrowTail = {
        x: p1.x,
        y:
            p1.y < p2.y
              ? p1.y + this.arrowMargin - this.arrowLength
              : p1.y - this.arrowMargin + this.arrowLength
      }
      startArrowP2 = { x: p1.x + this.arrowHeight, y: startArrowTail.y }
      startArrowP3 = { x: p1.x - this.arrowHeight, y: startArrowTail.y }
      endArrowTail = {
        x: p1.x,
        y: p1.y < p2.y ? p2.y - this.arrowMargin : p2.y + this.arrowMargin
      }
      endArrowP1 = {
        x: p1.x,
        y: p1.y < p2.y
          ? p2.y - this.arrowMargin + this.arrowLength
          : p2.y + this.arrowMargin - this.arrowLength
      }
      endArrowP2 = { x: p1.x + this.arrowHeight, y: endArrowTail.y }
      endArrowP3 = { x: p1.x - this.arrowHeight, y: endArrowTail.y }
      this.playArrowP1 = {
        x: p1.x,
        y: p1.y < p2.y ? p1.y + this.arrowLength : p1.y - this.arrowLength
      }
      playArrowTail = { x: p1.x, y: p1.y }
      this.playArrowP2 = { x: p1.x + this.arrowHeight, y: playArrowTail.y }
      this.playArrowP3 = { x: p1.x - this.arrowHeight, y: playArrowTail.y }
      stopArrowP1 = { x: p2.x, y: p2.y }
      stopArrowTail = {
        x: p2.x,
        y: p1.y < p2.y ? p2.y - this.arrowLength : p2.y + this.arrowLength
      }
      stopArrowP2 = { x: p2.x + this.arrowHeight, y: stopArrowTail.y }
      stopArrowP3 = { x: p2.x - this.arrowHeight, y: stopArrowTail.y }
    } else if (p1.y === p2.y) {
      startArrowP1 = {
        x: p1.x < p2.x ? p1.x + this.arrowMargin : p1.x - this.arrowMargin,
        y: p1.y
      }
      startArrowTail = {
        x: p1.x < p2.x
          ? p1.x + this.arrowMargin - this.arrowLength
          : p1.x - this.arrowMargin + this.arrowLength,
        y: p1.y
      }
      startArrowP2 = { x: startArrowTail.x, y: p1.y + this.arrowHeight }
      startArrowP3 = { x: startArrowTail.x, y: p1.y - this.arrowHeight }
      endArrowP1 = {
        x: p1.x < p2.x
          ? p2.x - this.arrowMargin + this.arrowLength
          : p2.x + this.arrowMargin - this.arrowLength,
        y: p2.y
      }
      endArrowTail = {
        x: p1.x < p2.x ? p2.x - this.arrowMargin : p2.x + this.arrowMargin,
        y: p2.y
      }
      endArrowP2 = { x: endArrowTail.x, y: p2.y + this.arrowHeight }
      endArrowP3 = { x: endArrowTail.x, y: p2.y - this.arrowHeight }
      this.playArrowP1 = {
        x: p1.x < p2.x ? p1.x + this.arrowLength : p1.x - this.arrowLength,
        y: p1.y
      }
      playArrowTail = { x: p1.x, y: p1.y }
      this.playArrowP2 = { x: playArrowTail.x, y: p1.y + this.arrowHeight }
      this.playArrowP3 = { x: playArrowTail.x, y: p1.y - this.arrowHeight }
      stopArrowP1 = { x: p2.x, y: p2.y }
      stopArrowTail = {
        x: p1.x < p2.x ? p2.x - this.arrowLength : p2.x + this.arrowLength,
        y: p2.y
      }
      stopArrowP2 = { x: stopArrowTail.x, y: p2.y + this.arrowHeight }
      stopArrowP3 = { x: stopArrowTail.x, y: p2.y - this.arrowHeight }
    } else {
      k = TopoUtil.getlinek(p1, p2)
      startArrowP1 = TopoUtil.getPointByLine(
        k,
        this.arrowMargin,
        p1,
        p1.x < p2.x ? 1 : -1
      )
      startArrowTail = TopoUtil.getPointByLine(
        k,
        this.arrowMargin - this.arrowLength,
        p1,
        p1.x < p2.x ? 1 : -1
      )
      startArrowP2 = TopoUtil.getPointByLine(
        -1 / k,
        this.arrowHeight,
        startArrowTail,
        1
      )
      startArrowP3 = TopoUtil.getPointByLine(
        -1 / k,
        this.arrowHeight,
        startArrowTail,
        -1
      )
      endArrowP1 = TopoUtil.getPointByLine(
        k,
        -this.arrowMargin + this.arrowLength,
        p2,
        p1.x < p2.x ? 1 : -1
      )
      endArrowTail = TopoUtil.getPointByLine(
        k,
        -this.arrowMargin,
        p2,
        p1.x < p2.x ? 1 : -1
      )
      endArrowP2 = TopoUtil.getPointByLine(
        -1 / k,
        this.arrowHeight,
        endArrowTail,
        1
      )
      endArrowP3 = TopoUtil.getPointByLine(
        -1 / k,
        this.arrowHeight,
        endArrowTail,
        -1
      )
      this.playArrowP1 = TopoUtil.getPointByLine(
        k,
        this.arrowLength,
        p1,
        p1.x < p2.x ? 1 : -1
      )
      playArrowTail = { x: p1.x, y: p1.y }
      this.playArrowP2 = TopoUtil.getPointByLine(
        -1 / k,
        this.arrowHeight,
        playArrowTail,
        1
      )
      this.playArrowP3 = TopoUtil.getPointByLine(
        -1 / k,
        this.arrowHeight,
        playArrowTail,
        -1
      )
      stopArrowP1 = { x: p2.x, y: p2.y }
      stopArrowTail = TopoUtil.getPointByLine(
        k,
        this.arrowLength,
        p2,
        p1.x < p2.x ? -1 : 1
      )
      stopArrowP2 = TopoUtil.getPointByLine(
        -1 / k,
        this.arrowHeight,
        stopArrowTail,
        1
      )
      stopArrowP3 = TopoUtil.getPointByLine(
        -1 / k,
        this.arrowHeight,
        stopArrowTail,
        -1
      )
    }
    this.createArrow(startArrowP1, startArrowP2, startArrowP3, 'startArrow')
    this.createArrow(endArrowP1, endArrowP2, endArrowP3, 'endArrow')
    this.createArrow(
      this.playArrowP1,
      this.playArrowP2,
      this.playArrowP3,
      'playArrow'
    )
    this.stopArrowData = this.getArrowData(
      stopArrowP1,
      stopArrowP2,
      stopArrowP3
    )
  }

  playArrowAnimation () {
    var playArrow = this.createArrow(
      this.playArrowP1,
      this.playArrowP2,
      this.playArrowP3,
      'playArrow'
    )
    var self = this
    this.hideArrow()
    this.container.select('path.playArrow').style('display', 'block')
    if (this.type === TopoUtil.LINK_TYPE_BEZER) {
      this.arr = []
      var cell = self.playTime / 1000 * 60
      for (var i = 0; i < cell; i++) {
        var points = self.getBezerArrowPoint(
          self.csource,
          self.ctarget,
          { x: self.cbezer.x, y: self.cbezer.y },
          i / cell
        )
        this.arr.push(self.getArrowData(points[0], points[1], points[2]))
      }
      playArrow
        .transition()
        .duration(this.playTime)
        .ease('linear')
        .each('end', function () {
          playArrow.attr('d', self.playArrowData)
          self.playArrowAnimation()
        })
        .attrTween('d', function () {
          return self.dTween()
        })
    } else {
      playArrow
        .transition()
        .duration(this.playTime)
        .ease('linear')
        .each('end', function () {
          playArrow.attr('d', self.playArrowData)
          self.playArrowAnimation()
        })
        .attr('d', this.stopArrowData)
    }
  }

  stopArrowAnimation () {
    let playArrow = this.container.select('.playArrow')
    playArrow.transition().remove()
    playArrow.style('display', 'none')
    this.showArrow()
    this.createArrow(
      this.playArrowP1,
      this.playArrowP2,
      this.playArrowP3,
      'playArrow'
    )
  }

  dTween () {
    var interpolate = d3.scale
      .quantize()
      .domain([0, 1])
      .range(this.arr)
    return function (t) {
      return interpolate(t)
    }
  }

  // 计算二次贝塞尔曲线上某一处点处的三角坐标
  getBezerArrowPoint (p1, p2, c, t) {
    let bezerLength = TopoUtil.getBeZerLength(p1, p2, c)
    let startArrowP1 = TopoUtil.getBeZerPoint(
      p1,
      p2,
      c,
      (t * bezerLength + this.arrowLength) / bezerLength
    )
    let startArrowTail = TopoUtil.getBeZerPoint(p1, p2, c, t)
    let k1 = TopoUtil.getlinek(startArrowTail, startArrowP1)
    let startArrowP2 = TopoUtil.getPointByLine(
      -1 / k1,
      this.arrowHeight,
      startArrowTail,
      1
    )
    let startArrowP3 = TopoUtil.getPointByLine(
      -1 / k1,
      this.arrowHeight,
      startArrowTail,
      -1
    )
    return [startArrowP1, startArrowP2, startArrowP3]
  }

  hideArrow () {
    this.container.select('path.startArrow').style('display', 'none')
    this.container.select('path.endArrow').style('display', 'none')
    // $('path.startArrow', this.$link[0][0]).hide()
    // $('path.endArrow', this.$link[0][0]).hide()
  }

  showArrow () {
    this.container.select('path.startArrow').style('display', 'block')
    this.container.select('path.endArrow').style('display', 'block')
    // $('path.startArrow', this.$link[0][0]).show()
    // $('path.endArrow', this.$link[0][0]).show()
  }

  /**
   * 生成箭头
   * @param {箭头的三个点} p1
   * @param {箭头的三个点} p2
   * @param {箭头的三个点} p3
   * @param {} type
   */
  createArrow (p1, p2, p3, type) {
    let arrow = this.container.select('path.arrow.' + type)
    if (arrow.empty()) {
      arrow = this.container.append('path').attr('class', 'arrow ' + type)
    }
    this[type + 'Data'] = this.getArrowData(p1, p2, p3)
    arrow.attr('d', this[type + 'Data'])
    return arrow
  }

  /**
   * 获取生成三角箭头所需要的数据
   * @param {*} p1
   * @param {*} p2
   * @param {*} p3
   */
  getArrowData (p1, p2, p3) {
    return (
      'M' +
      p1.x +
      ' ' +
      p1.y +
      ' L' +
      p2.x +
      ' ' +
      p2.y +
      ' L' +
      p3.x +
      ' ' +
      p3.y +
      ' Z'
    )
  }

  getNodeSpace () {
    var scol = this.source.col
    var srow = this.source.row
    var tcol = this.target.col
    var trow = this.target.row
    if (scol === tcol && srow + 1 !== trow && srow - 1 !== trow) {
      return Math.abs(trow - srow)
    } else if (srow === trow && scol + 1 !== tcol && scol - 1 !== tcol) {
      return Math.abs(tcol - scol)
    } else {
      return 0
    }
  }

  getCircleCenter (node) {
    // var node = d3.select('g.node.' + obj.domId)
    // if (!node || node.empty() || !node.attr('transform')) {
    //   return
    // }
    // let offset = this.getOffsetByTransform(node.attr('transform'))
    // if (!obj.symbol) {
    //   return offset
    // } else {
    //   let width = node.select('.node-core').attr('width')
    //   offset.x += width / 2
    //   offset.y += width / 2
    //   return offset
    // }
    if (!node) return
    return {
      x: (TopoUtil.IMG_TYPE === node.nodeType ? node.linkX + node.width / 2 : node.linkX),
      y: (TopoUtil.IMG_TYPE === node.nodeType ? node.linkY + node.width / 2 : node.linkY)
    }
  }

  getOffsetByTransform (transform) {
    let index = transform.indexOf('translate')
    let substr = transform.substr(index + 9)
    let index1 = substr.indexOf('(')
    let index2 = substr.indexOf(')')
    substr = substr.substr(index1 + 1, index2 - index1 - 1)
    let result = substr.split(',')
    // 为了兼容IE，IE浏览器的translate(x, y)  x和y 之间用的空格而不是逗号
    if (result.length !== 2) {
      result = substr.split(' ')
    }
    return { x: parseInt(result[0]), y: parseInt(result[1]) }
  }

  calAngle () {
    let angle = Math.atan((this.ctarget.y - this.csource.y) / (this.ctarget.x - this.csource.x))
    angle = this.csource.x > this.ctarget.x ? Math.PI + angle : angle
    return angle
  }
}

export default Link
