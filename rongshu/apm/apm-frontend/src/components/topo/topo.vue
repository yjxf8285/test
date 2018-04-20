<style lang="scss" scoped>
@keyframes down {
    0% {
        transform: translateY(0px);
    }
    20% {
        transform: translateY(-2px);
    }
    50% {
        transform: translateY(2px);
    }
    75% {
        transform: translateY(1px);
    }
    100% {
        transform: translateY(0px);
    }
}

.topo.full {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: white;
}

.topo {
    width: 100%;
    height: 100%;
    position: relative;
    moz-user-select: -moz-none;
    -moz-user-select: none;
    -o-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.topo svg {
    width: 100%;
    height: 100%;
}

.topo svg g.node:hover {
    cursor: pointer;
}

.tooltip {
    position: absolute;
    float: left;
    left: -100000px;
    top: -100000;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 1px 1px 1px 1px #ccc;
    line-height: 22px;
    padding: 5px 10px;

    i {
        font-size: 18px;
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 2px;
        border-bottom: 2px solid #ccc;
        box-sizing: border-box;
    }
    &.show {
        i {
            animation: down 0.5s ease-in;
            animation-delay: .5s;
            animation-iteration-count: 2;
        }
    }
}

.fade-enter-active {
    transition: all 0.5s ease;
}

.fade-leave-active {
    transition: all 0s ease;
}

.fade-enter,
.fade-leave-active {
    opacity: 0;
}

.topo .slider {
    width: 10px;
    height: 200px;
    position: absolute;
    top: 50px;
    left: 15px;
    background: #f5f5f5;
    border: 1px solid #d7d7d7;
    border-radius: 12px;
    display: none;
}

.topo .slider .slider-thumb {
    width: 12px;
    height: 12px;
    border-radius: 12px;
    background: #9aa3b2;
    margin-left: -2px;
    margin-top: 1px;
    box-shadow: 2px 2px 2px 2px rgba(255, 255, 255, 0.8);
    cursor: pointer;
}

.topo .toolbar {
    position: absolute;
    top: 10px;
    right: 10px;
}

.topo .toolbar img {
    cursor: pointer;
}

.topo .toolbar .restore {
    display: none;
}
</style>

<template>
    <div class="topo" ref="topo">
        <svg class="topo-svg" ref="topo-svg">
            <g class="topo-container" ref="topo-container">
                <topo-node v-if="data.nodes" v-for="node in data.nodes" :key="node.domId" @onNodeMove="onNodeMove" @onEnterNode.capture="onEnterNode" @onLeaveNode.capture="onLeaveNode" @onMouseDown="onMouseDown" @onMouseUp="onMouseUp" :data="node" :radius="radius" :innerRadius="innerRadius" :attachmentRadius="attachmentRadius" :attachmentSummary="attachmentSummary" :update="updateNode" :scale="scale">
                </topo-node>
    
                <topo-link v-if="data.links" v-for="link in data.links" :key="link.id" @onLinkFinished="onLinkFinished" :data="link" :change="link.change" :showTextFlag="lineTextFlag" :bezerFlag="bezerFlag" :play="link.play" :dragFlag="link.dragFlag" :update="updateLink" :radius="radius" :scale="scale">
                </topo-link>
            </g>
        </svg>
        <transition name="fade">
            <div v-show="tooltip.show" class="tooltip" :class="{show: tooltip.show}" ref="tooltip" :style="{
                                    left: tooltip.left + 'px',
                                    top: tooltip.top + 'px'
                                  }">
                <i class="icon ion-android-arrow-down theme-font-color-primary" style="font-size: 20px;"></i>点击下钻
            </div>
        </transition>
    
        <div class="slider" ref="slider">
            <div class="slider-thumb" ref="slider-thumb" v-on:mousedown="onSliderDown"></div>
        </div>
    
        <div class="toolbar" ref="toolbar">
            <img v-if="fullbtnDisplay" class="fullscreen" ref="fullscreen" src="/static/images/maximize_gray.svg" v-on:click="fullScreen" />
            <img class="restore" ref="restore" src="/static/images/minimize_gray.svg" v-on:click="restore" />
        </div>

        <el-dialog width="60%" title="节点详情" :modal-append-to-body='modal' :visible.sync="nodeDetailVisible">
          <el-table :data="tierList" class="list-table"  style="width: 100%;" max-height="400" :default-sort = "{prop: 'elapsedTime', order: 'descending'}">
            <el-table-column prop="tiersName" label="调用者Tier">
            </el-table-column>
            <el-table-column prop="name" label="远程调用" sortable>
            </el-table-column>
            <el-table-column prop="elapsedTime" label="平均响应时间(ms)" sortable>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="closeDialog">确定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import TopoNode from '_topo/topo-node'
import TopoLink from '_topo/topo-link'
import {
  Button,
  Table,
  Tag,
  TableColumn,
  Input,
  Form,
  FormItem,
  Dialog,
  Pagination,
  Breadcrumb,
  BreadcrumbItem,
  Switch,
  Tooltip,
  Checkbox
} from 'element-ui'
export default {
  name: 'topo',
  components: {
    TopoNode,
    TopoLink,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-input': Input,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-dialog': Dialog,
    'el-pagination': Pagination,
    'el-breadcrumb': Breadcrumb,
    'el-breadcrumb-item': BreadcrumbItem,
    'el-switch': Switch,
    'el-tooltip': Tooltip,
    'el-tag': Tag,
    'el-checkbox': Checkbox
  },
  data() {
    return {
      lineTextFlag: true,
      bezerFlag: true,
      linkFinishedNum: 0,
      scale: this.data.scale || 1,
      translate: [0, 0],
      scaleScales: null,
      pixelScales: null,
      maxMargin: 0,
      sliderTop: 1,
      scaleRange: [0.35, 3],
      topo_z: null,
      updateNode: 0,
      updateLink: 0,
      tooltip: {
        show: false,
        left: 0,
        top: 0,
        delay: 0
      },
      nodeDetailVisible: false,
      modal: false,
      tierList: []
    }
  },

  props: {
    data: {
      default: function() {
        return {}
      }
    },
    radius: {
      default: 35
    },
    innerRadius: 23,
    attachmentRadius: 15,
        // layout: '',
    update: 0,
    attachmentSummary: {
      show: true,
      formatter: function(node) { },
      position: 'left'
    },
    fullbtnDisplay: {
      default: true
    },
    setFullScreen: {
      default: false
    }
  },

  watch: {
    data(v) {
      if (v.scale) {
        if (this.scaleRange[0] < v.scale) {
          this.scaleRange[0] = v.scale
        }
        this.scale = v.scale
      }
      if (v.offsetLeft || v.offsetTop) {
        this.translate[0] = v.offsetLeft ? v.offsetLeft : 0
        this.translate[1] = v.offsetTop ? v.offsetTop : 0
        d3.select(this.$refs['topo-container']).attr('transform', 'translate(' +
                    this.translate +
                    ') scale(' + [this.scale, this.scale] + ')')
        this.topo_z.translate(this.translate)
      }
    },
    update(v) {
      this.updateNode = v
      this.updateLink = v
      this.zoom(this.scale)
            // this.resetContainer()
    },
    scale(v) {
      this.zoom(v)
    },
    sliderTop(v) {
      this.setSliderTop(v)
    },
    setFullScreen(v) {
      if (v) {
        this.fullScreen()
      }
      this.$emit('onFullScreenChange', v)
    }
  },

  methods: {

    resetContainer() {
      d3.select(this.$refs['topo-container']).attr('transform', 'translate(0, 0) scale(1)')
    },

    render() {
      var self = this
      var sliderHeight = $(self.$refs.slider).height()
            // console.log(self.$refs.slider)
            // console.log(sliderHeight)
      var sliderThumbHeight = $(self.$refs['slider-thumb']).height()
      this.maxMargin = sliderHeight - sliderThumbHeight
      var y1 = self.scaleRange[1]
      var y2 = self.scaleRange[0]
      var x1 = 1
      var x2 = this.maxMargin
      this.scaleScales = self.getScaleRelation(x1, x2, y1, y2)
      this.pixelScales = self.getScaleRelation(y1, y2, x1, x2)
      this.computeSliderTop()

      $(this.$refs.fullscreen).hover(function() {
        $(this).attr('src', '/static/images/maximize_blue.svg')
      }, function() {
        $(this).attr('src', '/static/images/maximize_gray.svg')
      })
            // var self = this
            // var topoHeight = $(this.$refs.topo).height()
            // var sliderMargin = parseInt($(self.$refs.slider).css('top'))
            // var height = topoHeight - 2*sliderMargin
            // $(self.$refs.slider).height(height <= 10 ? 10 : height)
    },

    adjustLink() {
      let $svg = $(this.$refs['topo-container'])
      $('g.link', this.$refs['topo-svg']).each(function(i, ele) {
        $(ele).remove()
        $svg.prepend(ele)
      })
    },

    addEvent() {
      var self = this
            // 平移及缩放事件
      this.topo_z = d3.behavior.zoom().scaleExtent(self.scaleRange).on('zoom', this.zoom)
            // 设置禁止双击放大
      d3.select(self.$refs['topo-svg']).call(this.topo_z).on('dblclick.zoom', null)
      this.dispatch = d3.dispatch('mousewheel')
      this.dispatch.on('mousewheel', this.zoom)
      window.addEventListener('resize', function() {
        if (self.fullstatus) {
          self.fullScreen()
        }
      })
    },

    zoom(s, manual) {
      var scale = s || d3.event.scale
            // var scale = d3.event ? d3.event.scale :  this.scale
      var self = this
            // 0.88为默认放大一次的倍率 显示文字
      if (scale > 0.88) {
        this.lineTextFlag = true
        setTimeout(function() {
          $('.line-text', self.$refs['topo-svg']).show()
          $('.pie-summary', self.$refs['topo-svg']).show()
          $('.attachement-text', self.$refs['topo-svg']).show()
          $('.attachement', self.$refs['topo-svg']).show()
        }, 100)
      } else {
        setTimeout(function() {
          $('.line-text', self.$refs['topo-svg']).hide()
          $('.pie-summary', self.$refs['topo-svg']).hide()
          $('.attachement-text', self.$refs['topo-svg']).hide()
          $('.attachement', self.$refs['topo-svg']).hide()
        }, 100)
        this.lineTextFlag = false
      }

      if (scale > 0.68) {
        setTimeout(function() {
          $('.pie-name', self.$refs['topo-svg']).show()
        }, 100)
      } else {
        setTimeout(function() {
          $('.pie-name', self.$refs['topo-svg']).hide()
        }, 100)
      }

      var transform = d3.transform(d3.select(self.$refs['topo-container']).attr('transform'))
            // 表示平移操作, 若平移，则需要纪录当天平移的坐标
      if (this.scale === scale && !s) {
        this.translate = [transform.translate[0], transform.translate[1]]
      }

            // if(node.drillDown && new Date()* 1 - this.tooltip.delay > 100) {
      this.tooltip.show = false
            //   this.tooltip.delay = new Date() * 1
            // }
            // 若移动slider进行的缩放，需要计算中心点的位置进行偏移
      if (!d3.event && manual) {
        d3.select(self.$refs['topo-container']).attr('transform', 'scale(' + [scale, scale] + ')')
        var eleRect = self.$refs['topo-container'].getBoundingClientRect()
        var translate = [(this.translate[0] + (this.data.scale - scale) * (eleRect.width / 2) / scale), (this.translate[1] + (this.data.scale - scale) * (eleRect.height / 2) / scale)]
        d3.select(self.$refs['topo-container']).attr('transform', 'translate(' +
                    translate +
                    ') scale(' + [scale, scale] + ')')
        this.topo_z.translate(translate)
      } else {
        d3.select(self.$refs['topo-container']).attr('transform', 'translate(' +
                    (d3.event ? d3.event.translate : transform.translate) +
                    ') scale(' + [scale, scale] + ')')
        this.topo_z.translate(d3.event ? d3.event.translate : transform.translate)
      }
      this.scale = scale
      this.topo_z.scale(this.scale)
            // 计算sliderTop值
      this.computeSliderTop()
    },

    setSliderTop(top) {
      $(this.$refs['slider-thumb']).css('margin-top', top + 'px')
    },

    computeSliderTop() {
      this.sliderTop = this.pixelScales[0] * this.scale + this.pixelScales[1]
      this.sliderTop = this.sliderTop < 1 ? 1 : this.sliderTop
      this.sliderTop = this.sliderTop > this.maxMargin ? this.maxMargin : this.sliderTop
    },

    computeScale() {
      return this.scaleScales[0] * this.sliderTop + this.scaleScales[1]
    },

    onNodeMove(node, e) {
      if (!this.data.links) return
      if (node.drillDown && new Date() * 1 - this.tooltip.delay > 100) {
        this.tooltip.show = false
        this.tooltip.delay = new Date() * 1
      }
      var links = this.getLinksByNode(node)
      links.forEach(function(link, i) {
        link.change++
        link.notNeedBezerFlag = true
      })
      this.$emit('onNodeMove', node, e)
    },

    onMouseDown(node, e) {
      if (!this.data.links) return
      var links = this.getLinksByNode(node)
      links.forEach(function(link, i) {
        link.dragFlag = true
      })
      this.$emit('onMouseDownNode', node, e)
    },

    onMouseUp(node, e, dragFlag) {
      if (!this.data.links) return
      var links = this.getLinksByNode(node)
      links.forEach(function(link, i) {
        link.dragFlag = false
      })
            // 拖动的时候不需要向外发送事件，只有点击节点的时候才发
      if (!dragFlag) { this.$emit('onMouseUpNode', node, e) }
      if (!dragFlag && node.list && node.list.length > 1) {
        this.tierList = node.list
        this.nodeDetailVisible = true
      }
    },

    onLinkFinished(link, e) {
      this.linkFinishedNum++
      if (this.linkFinishedNum === this.data.links.length) {
        this.adjustLink()
        this.linkFinishedNum = 0
      }
      this.$emit('onLinkFinished', link, e)
    },

    closeDialog() {
      this.nodeDetailVisible = false
    },

    onEnterNode(node, e) {
      e = e || window.event
      if (!this.data.links) return
      let rect = e.target.getBoundingClientRect()
      let offset = $(this.$refs['topo-svg']).offset()
    //   let offsetX = 0, offsetY = 0
            // let result = this.parseTransform(d3.select('svg g.topo-container').attr("transform"))
            // if (result && result.length == 2) {
            //     offsetX = result[0]
            //     offsetY = result[1]
            // }
      if (node.drillDown) {
        this.tooltip.left = rect.left - offset.left + rect.width / 20 * this.scale// + rect.width/4
        this.tooltip.top = rect.top - offset.top - $(this.$refs.tooltip).height() - 10// - rect.height/2
                //   this.tooltip.left = node.x + rect.width / 2 - 50 + offsetX
                //   this.tooltip.top = node.y - 50 + offsetY
        this.tooltip.show = true
        this.tooltip.delay = new Date() * 1
      }
      var links = this.getLinksByNode(node)
      links.forEach(function(link, i) {
        link.play = true
      })
      this.$emit('onEnterNode', node, e)
    },
    parseTransform(transform) {
      if (!transform) return
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
    onLeaveNode(node, e) {
      if (!this.data.links) return
      if (node.drillDown && new Date() * 1 - this.tooltip.delay > 100) {
        this.tooltip.show = false
        this.tooltip.delay = new Date() * 1
      }
      var links = this.getLinksByNode(node)
      links.forEach(function(link, i) {
        link.play = false
      })
      this.$emit('onLeaveNode', node, e)
    },

    onSliderDown(e) {
      var self = this
      var startY = e.clientY
    //   var $sliderThumb = $(self.$refs['slider-thumb'])
      document.onmousemove = function(ev) {
        var offsetY = ev.clientY - startY
        // var top = parseInt($sliderThumb.css('margin-top'))
        self.sliderTop += offsetY
        self.sliderTop = self.sliderTop < 1 ? 1 : self.sliderTop
        self.sliderTop = self.sliderTop > self.maxMargin ? self.maxMargin : self.sliderTop
                // $sliderThumb.css('margin-top', self.sliderTop + 'px')
                // 根据y = ax + b 计算出 y值，y就是实际要缩放的比率
        var scale = self.computeScale()
        startY = ev.clientY
        if (self.dispatch) {
          self.dispatch.mousewheel(scale, true)
        }
      }
      document.onmouseup = function() {
        document.onmousemove = null
        document.onmouseup = null
      }
    },

    fullScreen(e) {
      var width = $('body').width()
      var height = $('body').height()
      $(this.$refs.topo).width(width)
      $(this.$refs.topo).height(height)
      $(this.$refs.topo).addClass('full')
      $(this.$refs.fullscreen).hide()
      $(this.$refs.restore).show()
      this.fullstatus = true
    },

    restore(e) {
      $(this.$refs.topo).width('100%')
      $(this.$refs.topo).height('100%')
      $(this.$refs.topo).removeClass('full')
      $(e.target).hide()
      $(this.$refs.fullscreen).show()
      this.$emit('onFullScreenChange', false)
      this.fullstatus = false
    },

    getScaleRelation(x1, x2, y1, y2) {
            // 根据二元一次方程 y = ax + b 计算出坐标和缩放的比例关系, 返回[a,b]
      var a = (y2 - y1) / (x2 - x1)
      var b = y1 - x1 * (y2 - y1) / (x2 - x1)
      return [a, b]
    },

    getLinksByNode(node) {
      var list = []
      for (var i = 0; i < this.data.links.length; i++) {
        var link = this.data.links[i]
        if ((link.source.domId === node.domId) || (link.target.domId === node.domId)) {
          list.push(link)
        }
      }
      return list
    }
  },

  created() {
        // this.render()

  },

  mounted() {
    this.render()
    this.addEvent()
  },

  updated() {
    var self = this
    var topoHeight = this.$refs.topo.clientHeight
    var sliderMargin = parseInt($(self.$refs.slider).css('top'))
    var height = topoHeight - 2 * sliderMargin
    if (topoHeight <= 0) {
      return
    }
    if (topoHeight < 2 * sliderMargin + $(self.$refs.slider).height()) {
      $(self.$refs.slider).height(height)
      this.render()
    }
    $(self.$refs.slider).show()
  }
}
</script>
