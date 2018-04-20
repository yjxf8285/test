<style lang="scss" scope>
.link line {
  stroke: #2693ff;
  stroke-width: 1;
}
.link.dash line {
  stroke-dasharray: 3;
}
.link line:hover {
  stroke-width: 2;
}
.hide {
  display: none;
}

.link path.arrow.playArrow {
  display: none;
}
.link path.bezer {
  fill: none;
  stroke: #2693ff;
  stroke-width: 1;
}
.link.dash path.bezer {
  stroke-dasharray: 3;
}
.link path.bezer:hover {
  stroke-width: 2;
}
.link path.arrow {
  fill: #2693ff;
}
.link .line-text {
  font-size: 10px;
  font-weight: "normal";
  font-style: "-apple-system,Microsoft Yahei,system-ui,BlinkMacSystemFont,Open Sans,Hiragino Sans GB,sans-serif";
  color: "#000";
}
.adsFlowMapTextShadow {
  stroke: #ffffff;
  stroke-width: 4px;
  stroke-opacity: 0.8;
  fill: #ffffff;
  fill-opacity: 1;
  font-size: 10px;
}
.real {
  text-anchor: middle;
  font-size: 10px;
}
</style>

<template>
    <g class="link" ref="g" v-bind:class="data.id"></g>
</template>

<script>
export default {
  name: 'node-link',

  data() {
    return {
      $link: null,
      // source点到target点的角度
      sangle: 0,
      // target点到source点的角度
      tangle: 0,
      length: 0,
      arrowLength: 8,
      arrowHeight: 4,
      arrowMargin: 50,
      startArrowData: '',
      endArrowData: '',
      playArrowData: '',
      stopArrowData: '',
      playArrowP1: '',
      playArrowP2: '',
      playArrowP3: '',
      playTime: 3000
    }
  },

  props: {
    data: {
      default: function() {
        return {}
      }
    },
    change: 0,
    // layout: '',
    showTextFlag: true,
    play: false,
    dragFlag: false,
    radius: {
      default: 35
    },
    innerRadius: 23,
    attachmentRadius: 15,
    update: 0
  },

  watch: {
    update(v) {
      this.destroy()
      this.rerender()
    },
    change(v) {
      this.rerender()
    },
    play(v) {
      if (this.dragFlag) {
        this.stopArrowAnimation()
        return
      }
      if (v) {
        this.playArrowAnimation()
      } else {
        this.stopArrowAnimation()
      }
    },
    dragFlag(v) {
      if (v) {
        this.stopArrowAnimation()
      }
    }
  },

  methods: {
    render() {
      this.renderLink()
    },

    rerender() {
      // this.destroy()
      this.render()
    },

    destroy() {
      if (this.$link) {
        $(this.$link[0][0])
          .children()
          .remove()
      }
      this.$link = null
      this.sangle = 0
      this.tangle = 0
      this.length = 0
    },

    renderLink() {
      // 生成link g节点
      let link = this.data
      if (!this.$link) {
        this.$link = d3.select(this.$refs.g)
      }
      // 画线
      this.csource = this.getCircleCenter(link.source)
      this.ctarget = this.getCircleCenter(link.target)
      if (
        !this.csource ||
        this.csource.hide ||
        !this.ctarget ||
        this.ctarget.hide
      ) {
        return
      }
      this.sangle = this.calAngle(this.csource, this.ctarget)
      this.tangle = this.sangle + Math.PI
      // 若节点是圆环，则需要计算新的点，不能使用圆点划线，而应该从直线与圆的交点处划线， 该点的计算公式使用极坐标公式来计算
      if (!link.source.symbol) {
        this.csource.x += this.radius * Math.cos(this.sangle)
        this.csource.y += this.radius * Math.sin(this.sangle)
      } else {
        this.csource.x += this.radius / 2 * Math.cos(this.sangle)
        this.csource.y += this.radius / 2 * Math.sin(this.sangle)
      }
      if (!link.target.symbol) {
        this.ctarget.x += this.radius * Math.cos(this.tangle)
        this.ctarget.y += this.radius * Math.sin(this.tangle)
      } else {
        this.ctarget.x += this.radius / 2 * Math.cos(this.tangle)
        this.ctarget.y += this.radius / 2 * Math.sin(this.tangle)
      }
      var bezerStatus = this.needBezer()
      var space = this.getNodeSpace()
      this.bezerX =
        bezerStatus === 1
          ? (this.csource.x + this.ctarget.x) / 2
          : this.csource.x - space * this.radius
      this.bezerY =
        bezerStatus === 1
          ? this.csource.y - space * this.radius
          : (this.csource.y + this.ctarget.y) / 2
      if (bezerStatus && !this.data.notNeedBezerFlag) {
        if (this.$link.select('path.bezer').empty()) {
          this.$link
            .append('path')
            .attr(
              'd',
              'M' +
                this.csource.x +
                ',' +
                this.csource.y +
                ' Q' +
                this.bezerX +
                ',' +
                this.bezerY +
                ' ' +
                this.ctarget.x +
                ',' +
                this.ctarget.y
            )
            .attr('class', 'bezer')
        } else {
          // this.$link.select('path')
          //     .attr('d', 'M'+csource.x+','+csource.y+' Q'+ bezerX +','+ bezerY +' '+ctarget.x+','+ctarget.y)
          //     .attr('class', 'bezer')
          $(this.$link.select('path.bezer')[0][0]).remove()
        }
      } else {
        if (!this.$link.select('line').empty()) {
          this.$link
            .select('line')
            .attr('x1', this.csource.x)
            .attr('y1', this.csource.y)
            .attr('x2', this.ctarget.x)
            .attr('y2', this.ctarget.y)
        } else {
          this.$link
            .append('line')
            .attr('x1', this.csource.x)
            .attr('y1', this.csource.y)
            .attr('x2', this.ctarget.x)
            .attr('y2', this.ctarget.y)
        }
        // 移动时需要删除节点对应的bezer
        let bezer = this.$link.select('path.bezer')
        if (!bezer.empty()) {
          $(bezer[0][0]).remove()
        }
      }
      if (link.source.type === 'MQ' || link.target.type === 'MQ') {
        this.$link.classed('dash', true)
      }

      // 画三角形
      if (bezerStatus && !this.data.notNeedBezerFlag) {
        this.drawBezerArrow(this.csource, this.ctarget, {
          x: this.bezerX,
          y: this.bezerY
        })
      } else {
        this.drawLineArrow(this.csource, this.ctarget)
      }

      // 画文本
      let text = this.$link.select('text.line-text')
      let bgspan = this.$link.select('text.line-text .adsFlowMapTextShadow')
      let realspan = this.$link.select('text.line-text .real')
      if (text.empty()) {
        text = this.$link.append('text').attr('class', 'line-text')
        bgspan = text
          .append('tspan')
          .attr('class', 'adsFlowMapTextShadow')
          .style('text-anchor', 'middle')
          .text(this.data.label)
        realspan = text
          .append('tspan')
          .attr('class', 'real')
          .text(this.data.label)
        // .text(this.data.label)
      } else {
        // text[0][0].innerHTML = ''
      }
      // 纠正文本位置
      let centerX = (this.csource.x + this.ctarget.x) / 2
      let centerY = (this.csource.y + this.ctarget.y) / 2
      // let text = null
      // let textLength = text[0][0].getComputedTextLength()
      if (bezerStatus && !this.data.notNeedBezerFlag) {
        // let text = this.$link.append('text')
        //     .attr('class', 'line-text')
        //     .text(this.data.label)
        // let textLength = text[0][0].getComputedTextLength()
        let bezerPoint = this.getBeZerPoint(
          this.csource,
          this.ctarget,
          { x: this.bezerX, y: this.bezerY },
          0.5
        )
        //
        if (text) {
          text.attr('x', bezerPoint.x).attr('y', bezerPoint.y)
          bgspan.attr('x', bezerPoint.x).attr('y', bezerPoint.y)
          realspan.attr('x', bezerPoint.x).attr('y', bezerPoint.y)
        }
        // .attr('transform', 'rotate('+ -this.--**180/Math.PI + ' ' + bezerPoint.x + ' ' + bezerPoint.y +')')
      } else {
        // text = this.$link.append('text')
        //     .attr('class', 'line-text')
        //     .text(this.data.label)
        // let textLength = text[0][0].getComputedTextLength()
        if (text) {
          text.attr('x', centerX).attr('y', centerY + 3)
          bgspan.attr('x', centerX).attr('y', centerY + 3)
          realspan.attr('x', centerX).attr('y', centerY + 3)
        }

        // .attr('transform', 'rotate('+ this.sangle*180/Math.PI + ' ' + centerX + ' ' + centerY +')')

        if (this.csource.x > this.ctarget.x) {
          // text.attr('transform', 'rotate('+ (this.sangle*180/Math.PI-180) + ' ' + centerX + ' ' + centerY +')')
        }
      }
      if (!this.showTextFlag) {
        text && text.classed('hide', true)
      } else {
        text && text.classed('hide', false)
      }
    },

    // 画直线上的箭头
    drawLineArrow(p1, p2) {
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
          y:
            p1.y < p2.y
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
          x:
            p1.x < p2.x
              ? p1.x + this.arrowMargin - this.arrowLength
              : p1.x - this.arrowMargin + this.arrowLength,
          y: p1.y
        }
        startArrowP2 = { x: startArrowTail.x, y: p1.y + this.arrowHeight }
        startArrowP3 = { x: startArrowTail.x, y: p1.y - this.arrowHeight }
        endArrowP1 = {
          x:
            p1.x < p2.x
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
        k = this.getlinek(p1, p2)
        startArrowP1 = this.getPointByLine(
          k,
          this.arrowMargin,
          p1,
          p1.x < p2.x ? 1 : -1
        )
        // var startArrowP1 = {'x': Math.cos(this.sangle)*this.arrowMargin+p1.x, 'y': Math.sin(this.sangle)*this.arrowMargin+p1.y}
        startArrowTail = this.getPointByLine(
          k,
          this.arrowMargin - this.arrowLength,
          p1,
          p1.x < p2.x ? 1 : -1
        )
        startArrowP2 = this.getPointByLine(
          -1 / k,
          this.arrowHeight,
          startArrowTail,
          1
        )
        startArrowP3 = this.getPointByLine(
          -1 / k,
          this.arrowHeight,
          startArrowTail,
          -1
        )
        endArrowP1 = this.getPointByLine(
          k,
          -this.arrowMargin + this.arrowLength,
          p2,
          p1.x < p2.x ? 1 : -1
        )
        endArrowTail = this.getPointByLine(
          k,
          -this.arrowMargin,
          p2,
          p1.x < p2.x ? 1 : -1
        )
        endArrowP2 = this.getPointByLine(
          -1 / k,
          this.arrowHeight,
          endArrowTail,
          1
        )
        endArrowP3 = this.getPointByLine(
          -1 / k,
          this.arrowHeight,
          endArrowTail,
          -1
        )
        this.playArrowP1 = this.getPointByLine(
          k,
          this.arrowLength,
          p1,
          p1.x < p2.x ? 1 : -1
        )
        playArrowTail = { x: p1.x, y: p1.y }
        this.playArrowP2 = this.getPointByLine(
          -1 / k,
          this.arrowHeight,
          playArrowTail,
          1
        )
        this.playArrowP3 = this.getPointByLine(
          -1 / k,
          this.arrowHeight,
          playArrowTail,
          -1
        )
        stopArrowP1 = { x: p2.x, y: p2.y }
        stopArrowTail = this.getPointByLine(
          k,
          this.arrowLength,
          p2,
          p1.x < p2.x ? -1 : 1
        )
        stopArrowP2 = this.getPointByLine(
          -1 / k,
          this.arrowHeight,
          stopArrowTail,
          1
        )
        stopArrowP3 = this.getPointByLine(
          -1 / k,
          this.arrowHeight,
          stopArrowTail,
          -1
        )
        // stopArrowTail = {'x': p1.x, 'y': p}
      }

      this.createArrow(startArrowP1, startArrowP2, startArrowP3, 'startArrow')
      this.createArrow(endArrowP1, endArrowP2, endArrowP3, 'endArrow')
      this.createArrow(
        this.playArrowP1,
        this.playArrowP2,
        this.playArrowP3,
        'playArrow'
      )
      // this.createArrow(stopArrowP1, stopArrowP2, stopArrowP3, 'stopArrow')
      this.stopArrowData = this.getArrowData(
        stopArrowP1,
        stopArrowP2,
        stopArrowP3
      )
    },

    // 画贝塞尔曲线上的箭头
    drawBezerArrow(p1, p2, c) {
      var bezerLength = this.getBeZerLength(p1, p2, c)
      var startArrowP1 = this.getBeZerPoint(
        p1,
        p2,
        c,
        this.arrowMargin / bezerLength
      )
      var startArrowTail = this.getBeZerPoint(
        p1,
        p2,
        c,
        (this.arrowMargin - this.arrowLength) / bezerLength
      )
      var k1 = this.getlinek(startArrowTail, startArrowP1)
      var startArrowP2 = this.getPointByLine(
        -1 / k1,
        this.arrowHeight,
        startArrowTail,
        1
      )
      var startArrowP3 = this.getPointByLine(
        -1 / k1,
        this.arrowHeight,
        startArrowTail,
        -1
      )
      var endArrowP1 = this.getBeZerPoint(
        p1,
        p2,
        c,
        (bezerLength - this.arrowMargin + this.arrowLength) / bezerLength
      )
      var endArrowTail = this.getBeZerPoint(
        p1,
        p2,
        c,
        (bezerLength - this.arrowMargin) / bezerLength
      )
      var k2 = this.getlinek(endArrowTail, endArrowP1)
      var endArrowP2 = this.getPointByLine(
        -1 / k2,
        this.arrowHeight,
        endArrowTail,
        1
      )
      var endArrowP3 = this.getPointByLine(
        -1 / k2,
        this.arrowHeight,
        endArrowTail,
        -1
      )
      this.playArrowP1 = this.getBeZerPoint(
        p1,
        p2,
        c,
        this.arrowLength / bezerLength
      )
      var playArrowTail = p1
      this.playArrowP2 = this.getPointByLine(
        -1 / k1,
        this.arrowHeight,
        playArrowTail,
        1
      )
      this.playArrowP3 = this.getPointByLine(
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
    },

    getBezerArrowPoint(p1, p2, c, t) {
      var bezerLength = this.getBeZerLength(p1, p2, c)
      var startArrowP1 = this.getBeZerPoint(
        p1,
        p2,
        c,
        (t * bezerLength + this.arrowLength) / bezerLength
      )
      var startArrowTail = this.getBeZerPoint(p1, p2, c, t)
      var k1 = this.getlinek(startArrowTail, startArrowP1)
      var startArrowP2 = this.getPointByLine(
        -1 / k1,
        this.arrowHeight,
        startArrowTail,
        1
      )
      var startArrowP3 = this.getPointByLine(
        -1 / k1,
        this.arrowHeight,
        startArrowTail,
        -1
      )
      return [startArrowP1, startArrowP2, startArrowP3]
    },

    createArrow(p1, p2, p3, type) {
      let arrow = this.$link.select('path.arrow.' + type)
      if (arrow.empty()) {
        arrow = this.$link.append('path').attr('class', 'arrow ' + type)
      }
      this[type + 'Data'] = this.getArrowData(p1, p2, p3)
      arrow.attr('d', this[type + 'Data'])
      return arrow
    },

    getArrowData(p1, p2, p3) {
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
    },

    // 求直接斜率 start：起点  end: 终点
    getlinek(start, end) {
      if (end.x === start.x) return false
      return (end.y - start.y) / (end.x - start.x)
    },

    // 求直线上一点坐标 k:直线斜率，point:已知点， length: 未知点距已知点距离， direction: 正向/负向 这种点可以求出两个，因此需要传递方向，默认为正向1，负向为-1
    getPointByLine(k, length, point, direction) {
      if (k === false) {
        return { x: point.x, y: point.y - direction * length }
      }
      var x = point.x + direction * (length / Math.sqrt(Math.pow(k, 2) + 1))
      var y =
        point.y + direction * (k * length / Math.sqrt(Math.pow(k, 2) + 1))
      return { x: x, y: y }
    },

    // 获取贝塞尔曲线上某一点坐标
    getBeZerPoint(csource, ctarget, bezer, t) {
      // 根据公式 B(t)=(1 - t)^2 P0 + 2 t (1 - t) P1 + t^2 P2 进行计算
      var x =
        Math.pow(1 - t, 2) * csource.x +
        2 * t * (1 - t) * bezer.x +
        Math.pow(t, 2) * ctarget.x
      var y =
        Math.pow(1 - t, 2) * csource.y +
        2 * t * (1 - t) * bezer.y +
        Math.pow(t, 2) * ctarget.y
      return { x: x, y: y }
    },

    // 获取贝塞尔曲线的长度
    getBeZerLength(csource, ctarget, bezer) {
      // 首先根据公式a = P0 -2*P1 + P2  b = 2*P1 - 2P0  求出a,b两点
      var ax = csource.x - 2 * bezer.x + ctarget.x
      var ay = csource.y - 2 * bezer.y + ctarget.y
      var bx = 2 * bezer.x - 2 * csource.x
      var by = 2 * bezer.y - 2 * csource.y
      // 然后根据公式求出ABC三个常数  A = 4 * (ax^2 + by^2)  B = 4 * (ax* by + ay* by)  C = bx^2 + by^2
      var A = 4 * (ax * ax + ay * ay)
      var B = 4 * (ax * bx + ay * by)
      var C = bx * bx + by * by
      // 最后利用一个起级复杂公式求得贝塞尔曲线的长度公式
      var t = 1

      var len =
        1 /
        (8 * Math.pow(A, 3 / 2)) *
        (2 *
          Math.sqrt(A) *
          (2 * A * t * Math.sqrt(A * t * t + B * t + C) +
            B * (Math.sqrt(A * t * t + B * t + C) - Math.sqrt(C))) +
          (B * B - 4 * A * C) *
            (Math.log(B + 2 * Math.sqrt(A * C)) -
              Math.log(
                B +
                  2 * A * t +
                  2 * Math.sqrt(A) * Math.sqrt(A * t * t + B * t + C)
              )))
      return len
    },

    needBezer() {
      // 采用格子布局 且 在同一条线 且 不相邻的点需要画贝塞尔曲线
      var status = this.isSameLineNotSide()
      if (status) {
        return status
      }
      return 0
    },

    getNodeSpace() {
      var scol = parseInt(this.data.source.domId.substr(5, 2))
      var srow = parseInt(this.data.source.domId.substr(8, 2))
      var tcol = parseInt(this.data.target.domId.substr(5, 2))
      var trow = parseInt(this.data.target.domId.substr(8, 2))
      if (scol === tcol && srow + 1 !== trow && srow - 1 !== trow) {
        return Math.abs(trow - srow)
      } else if (srow === trow && scol + 1 !== tcol && scol - 1 !== tcol) {
        return Math.abs(tcol - scol)
      } else {
        return 0
      }
    },

    // 在同一条线且不相邻的点返回true 同一行返回1， 同一列返回2
    isSameLineNotSide() {
      var scol = parseInt(this.data.source.domId.substr(5, 2))
      var srow = parseInt(this.data.source.domId.substr(8, 2))
      var tcol = parseInt(this.data.target.domId.substr(5, 2))
      var trow = parseInt(this.data.target.domId.substr(8, 2))
      if (scol === tcol && srow + 1 !== trow && srow - 1 !== trow) {
        return 2
      } else if (srow === trow && scol + 1 !== tcol && scol - 1 !== tcol) {
        return 1
      } else {
        return 0
      }
    },

    calAngle(csource, ctarget) {
      var angle = Math.atan((ctarget.y - csource.y) / (ctarget.x - csource.x))
      angle = csource.x > ctarget.x ? Math.PI + angle : angle
      return angle
    },

    getCircleCenter(obj) {
      var node = d3.select('g.node.' + obj.domId)
      if (!node || !node.attr('transform')) {
        return
      }
      let offset = this.getOffsetByTransform(node.attr('transform'))
      if (!obj.symbol) {
        return offset
      } else {
        let width = node.select('.node-core').attr('width')
        offset.x += width / 2
        offset.y += width / 2
        return offset
      }
    },

    getOffsetByTransform(transform) {
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
    },

    showText() {
      $('.line-text', this.$link[0][0]).show()
    },

    hideText() {
      $('.line-text', this.$link[0][0]).hide()
    },

    playArrowAnimation() {
      var playArrow = this.createArrow(
        this.playArrowP1,
        this.playArrowP2,
        this.playArrowP3,
        'playArrow'
      )
      var self = this
      this.hideArrow()
      $('path.playArrow', this.$link[0][0]).show()

      if (this.needBezer() && !this.data.notNeedBezerFlag) {
        this.arr = []
        var cell = self.playTime / 1000 * 60
        for (var i = 0; i < cell; i++) {
          var points = self.getBezerArrowPoint(
            self.csource,
            self.ctarget,
            { x: self.bezerX, y: self.bezerY },
            i / cell
          )
          this.arr.push(self.getArrowData(points[0], points[1], points[2]))
        }
        playArrow
          .transition()
          .duration(this.playTime)
          .ease('linear')
          .each('end', function() {
            playArrow.attr('d', self.playArrowData)
            self.playArrowAnimation()
          })
          .attrTween('d', this.dTween)
      } else {
        playArrow
          .transition()
          .duration(this.playTime)
          .ease('linear')
          .each('end', function() {
            playArrow.attr('d', self.playArrowData)
            self.playArrowAnimation()
          })
          .attr('d', this.stopArrowData)
      }
    },

    dTween() {
      var interpolate = d3.scale
        .quantize()
        .domain([0, 1])
        .range(this.arr)
      return function(t) {
        // <-D
        return interpolate(t)
      }
    },

    stopArrowAnimation() {
      var playArrow = this.$link.select('.playArrow')
      this.showArrow()
      playArrow.transition().remove()
      this.createArrow(
        this.playArrowP1,
        this.playArrowP2,
        this.playArrowP3,
        'playArrow'
      )
      $(playArrow[0][0]).hide()
    },

    hideArrow() {
      $('path.startArrow', this.$link[0][0]).hide()
      $('path.endArrow', this.$link[0][0]).hide()
    },

    showArrow() {
      $('path.startArrow', this.$link[0][0]).show()
      $('path.endArrow', this.$link[0][0]).show()
    }
  },

  created() {},

  mounted() {
    this.render()
    this.$emit('onLinkFinished', this.data)
  },

  updated() {}
}
</script>
