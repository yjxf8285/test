<style lang="scss" scope>
.instances {
  font-size: 18px;
}

.adsFlowMapTextShadow {
  stroke: #FFFFFF;
  stroke-width: 4px;
  stroke-opacity: .8;
  fill: #FFFFFF;
  fill-opacity: 1;
}

.pie-summary {
  font-size: 10px;
}
</style>

<template>
  <g class="node" ref="g" v-bind:class="data.domId" v-on:mouseenter="onEnterNode" v-on:mouseleave="onLeaveNode">
  </g>
</template>

<script>
// TODO 1. npm install d3 为什么没有layout属性
//      2. 去掉这里面的svg元素，新建topo.vue
// const d3 = require('d3')
export default {
  name: 'topo-node',

  data() {
    return {
      // $开头的表示dom
      $node: null,
      // 弧形生成器
      arc: null,
      // 饼布局管理器
      pie: null,
      offsetX: 0,
      offsetY: 0
    }
  },

  props: {
    colors: {
      default: function() {
        return {
          'normal': '#a9d86e',
          'slow': '#86cae4',
          'very_slow': '#fcb322',
          'error': '#f58210',
          'warning': '#86cae4',
          'normality': '#86cae4',
          'intolerance': '#f58210',
          'healthy': '#a9d86e',
          'crossApp': '#8b97a3'
        }
      }
    },
    attachmentRadius: {
      default: 15
    },
    attachmentColor: {
      default: '#338cff'
    },
    attachmentTextOffset: {
      default: function() {
        return { x: 2, y: 3 }
      }
    },
    attachmentSummary: {
      default: function() {
        return {
          show: true,
          formatter: function() {

          },
          position: 'left'
        }
      }
    },
    radius: {
      default: 35
    },
    scale: {
      default: 1
    },
    innerRadius: {
      default: 22
    },
    bigFont: {
      default: function() {
        return {
          color: '#3e3d39',
          size: 14
        }
      }
    },
    smallFont: {
      default: function() {
        return {
          color: '#3e3d39',
          size: 12
        }
      }
    },
    data: {
      default: function() {
        return {}
      }
    },
    spaceCircleColor: {
      default: 'white'
    },
    update: 0
  },

  watch: {
    update(v) {
      if (this.data.hide) {
        return
      }
      this.destroy()
      this.render()
    },
    scale(v) {
      this.scaleChange(v)
    }
  },

  methods: {
    render() {
      if (this.data.hide) {
        return
      }
      this.createNode()
      this.renderNode()
    },

    destroy() {
      if (this.$node) {
        $(this.$node[0][0]).children().remove()
      }
      this.$node = null
      this.arc = null
      this.pie = null
    },

    createNode() {
      if (!this.$node) {
        // this.$node = d3.select('g.node.'+this.data.domId)
        this.$node = d3.select(this.$refs.g)
          .attr('transform', 'translate(' + (this.radius + this.data.x) + ',' + (this.radius + this.data.y) + ')')
      }
    },

    renderNode() {
      if (this.data.symbol) {
        this.renderImg()
      } else {
        this.renderPie()
        if (!this.data.crossApp) {
          this.renderAttachment()
        }
      }
    },

    renderPie() {
      let pie = this.getPie()
      let arc = this.getArc()

      // 画节点
      if (this.data.crossApp) {
        this.data.status = [{ value: 1, name: 'crossApp' }]
      }
      let node = this.$node.selectAll('path.arc')
        .data(pie(this.data.status))
      let colors = this.colors

      node.enter()
        .append('path')
        .attr('class', 'arc node-core')
        .attr('fill', function(d, i) {
          return colors[d.data.name]
        })
      node.transition()
        .attrTween('d', function(d) {
          let currentArc = this.__current__
          if (!currentArc) {
            currentArc = {
              startAngle: 0,
              endAngle: 0
            }
          }
          let interpolate = d3.interpolate(currentArc, d)
          this.__current__ = interpolate(1)
          return function(t) {
            return arc(interpolate(t))
          }
        })

      // 画空心圆

      this.$node.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', this.innerRadius)
        .attr('fill', this.spaceCircleColor)

      // 实例数
      if (!this.data.crossApp) {
        this.$node.append('text')
          .attr('class', 'instances')
          .attr('text-anchor', 'middle')
          .attr('y', 5)
          .text((this.data.activeInstances ? this.data.activeInstances : 0) + '/' + (this.data.instances ? this.data.instances : 0))
      }

      // 画文本
      this.$node.append('text')
        .attr('class', 'pie-name')
        .attr('y', this.radius + 15)
        .attr('fill', this.smallFont.color)
        .style('text-anchor', 'middle')
        .text(this.data.showName)
      // 纠正文本位置
      // let textLength = text[0][0].getComputedTextLength()
      // text.attr('x', -textLength/2)

      if (!this.data.crossApp) {
        this.renderSummary(this.$node, this.radius)
      }
    },

    renderImg() {
      // 绘制图片节点
      let width = this.radius * 2 * (2 / 3)
      this.$node.append('image')
        .attr('class', 'node-core')
        .attr('width', width)
        .attr('height', width)
        .attr('xlink:href', this.resolveImgUrl(this.data.symbol))

      // 绘制图片文字
      this.$node.append('text')
        .attr('class', 'pie-name')
        .attr('y', width + 10)
        .attr('fill', this.smallFont.color)
        .style('text-anchor', 'middle')
        .attr('transform', 'translate(' + (width / 2) + ')')
        .text(this.data.showName)

      // 纠正文本位置
      // let textLength = text[0][0].getComputedTextLength()
      // console.info(11111,width/2)
      // console.info(22222,textLength/2)
      // console.info(33333,width/2-textLength/2)
      // text.attr('x', width/2-textLength/2)

      this.renderSummary(this.$node, width, width * 1 / 3)
    },

    renderSummary($node, x, y) {
      if (this.attachmentSummary.show) {
        let texts = this.attachmentSummary.formatter(this.data)
        if (texts instanceof Array && texts.length > 0) {
          // 画文本
          let textCtl = $node.append('text')
            .attr('class', 'pie-summary')
            .attr('x', x)
            // .attr('y', y)
            .attr('fill', this.smallFont.color)

          texts.forEach(text => {
            textCtl.append('tspan')
              .attr('x', x + 10)
              .attr('class', 'adsFlowMapTextShadow')
              .attr('dy', 13)
              .text(text)
            textCtl.append('tspan')
              .attr('x', x + 10)
              // .attr('dy', 13)
              .text(text)
          })
          var height = texts.length * 13
          if (y) {
            textCtl.attr('y', y)
          } else {
            textCtl.attr('y', -height / 2)
          }
        }
      }
    },

    // TODO 可以增加悬浮效果
    renderAttachment() {
      // 画小圈
      let cx = -this.radius
      let cy = this.radius - this.attachmentRadius
      this.$node.append('circle')
        .attr('class', 'attachement')
        .attr('fill', this.attachmentColor)
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', this.attachmentRadius)
      // 画文字
      this.$node.append('text')
        .attr('class', 'attachement-text')
        .attr('fill', 'white')
        .attr('x', cx - this.attachmentRadius + 2)
        .attr('y', cy + 3)
        .text(this.data.serverName)
    },

    getArc() {
      if (this.arc) return this.arc
      this.arc = d3.svg.arc()
        .outerRadius(this.radius)
        .innerRadius(this.innerRadius)

      return this.arc
    },

    getPie() {
      if (this.pie) return this.pie
      this.pie = d3.layout.pie()
        .value(function(d) {
          return d.value
        })
      return this.pie
    },

    resolveImgUrl(url) {
      var index = url.indexOf('image://')
      if (index >= 0) {
        return url.substr(index + 8)
      }
      return url
    },

    addEvent() {
      var self = this
      // 拖拽事件
      this.$node.call(
        d3.behavior.drag().on('drag', function() {
          // TODO 个别浏览器下导致的不能下钻的临时解决方案，
          if (d3.event.sourceEvent.offsetX === self.offsetX && d3.event.sourceEvent.offsetY === self.offsetY) {
            return
          }
          if (!self.dragFlag) {
            setTimeout(function() {
              self.dragFlag = true
            }, 200)
          }
          d3.select(this)
            .attr('transform', function(d) {
              return 'translate(' + (d3.event.x) + ', ' + (d3.event.y) + ')'
            })
          self.data.x = d3.event.x
          self.data.y = d3.event.y
          // 告知父节点位置发生变化
          self.$emit('onNodeMove', self.data)
        })
          .on('dragstart', function(e) {
            self.offsetX = d3.event.sourceEvent.offsetX
            self.offsetY = d3.event.sourceEvent.offsetY
            d3.event.sourceEvent.stopPropagation()
            self.$emit('onMouseDown', self.data, d3.event.sourceEvent)
          }).on('dragend', function() {
            self.offsetX = 0
            self.offsetY = 0
            self.$emit('onMouseUp', self.data, d3.event.sourceEvent, self.dragFlag)
            self.dragFlag = false
            // self.$emit('onMouseUp', self.data)
          })
      )
    },
    parseTransform(transform) {
      transform = transform.substr(10)
      transform = transform.substr(0, transform.length - 1)
      var result = transform.split(',')
      if (!result || result.length !== 2) {
        result = transform.split(' ')
      }
      result[0] = parseFloat(result[0])
      result[1] = parseFloat(result[1])
      return result
    },

    scaleChange(scale) {

    },

    onEnterNode(e) {
      this.$emit('onEnterNode', this.data, e)
    },
    onLeaveNode(e) {
      this.$emit('onLeaveNode', this.data, e)
    }
  },

  mounted() {
    if (this.data.hide) {
      return
    }
    this.render()
    this.addEvent()
  }
}
</script>
