
import d3 from '_d3'
import LayoutManager from '../layout/layout-manager'
import PartFactory from './part-factory'
import TopoUtil from '../util/topo-util'
import DataSet from '../data/dataset'

class Topo {
  constructor (root, data, option) {
    this.root = root
    this.option = Object.assign(this.option || {}, option)
    // if (!root || !data || !data.nodes) return
    // let ds = new DataSet(data)
    // this.init(root, ds.getTopoData(), option)
    // this.setLayout()
    // this.render()
    // this.addEvent()
  }

  init (root, data, option) {
    if (!root || !data || !data.nodes) return
    // 拓扑节点
    this.nodes = []
    // 拓扑线列表
    this.links = []
    this.option = {

    }
    this.root = root
    this.data = data || this.data
    this.option = Object.assign(this.option || {}, option)
    this.rootWidth = root.offsetWidth
    this.rootHeight = root.offsetHeight
    this.svg = null
    this.container = null
    this.scale = this.data.scale || 1
    this.layout = this.option.layout || 'grid'
    this.topo_z = null // 拓扑缩放行为对象
  }

  render () {
    // 生成svg
    if (!this.svg) {
      this.svg = d3.select(this.root).append('svg')
        .attr('class', 'topo-svg')
    }
    if (!this.container) {
      this.container = this.svg.append('g').attr('class', 'topo-container')
        .attr('transform', 'translate(' +
                    this.translate +
                    ') scale(' + [this.scale, this.scale] + ')')
    }
    if (!this.data.nodes || !this.data.nodes.length) return
    // 渲染节点
    this.nodesContainer = this.container.append('g').attr('class', 'topo-nodes')
    this.data.nodes.forEach((item, i) => {
      let node = PartFactory.createPart(this.nodesContainer, item, this.option.node)
      node.render()
      this.nodes.push(node)
    })
    // 渲染link
    this.linksContainer = this.container.insert('g', '.topo-nodes').attr('class', 'topo-links')
    this.data.links.forEach((item, i) => {
      if (item.source && item.target) {
        item.source = this.getNodeById(item.source.id)
        item.target = this.getNodeById(item.target.id)
        let link = PartFactory.createPart(this.linksContainer, item, this.option.link)
        link.render()
        this.links.push(link)
      }
    })
  }

  update (data) {
    this.destroy()
    let ds = new DataSet(data)
    this.init(this.root, ds.getTopoData(), this.option)
    this.setLayout()
    this.render()
    this.addEvent()
  }

  destroy () {
    this.root.innerHTML = ''
    if (this.nodes) {
      this.nodes.forEach((node, i) => {
        node.off('drag', this.onNodeDrag, this)
        node.off('down', this.onNodeDown, this)
        node.off('mouseenter', this.onEnterNode, this)
        node.off('mouseleave', this.onLeaveNode, this)
      })
    }
  }

  getNodeById (id) {
    let result = null
    this.nodes.forEach((item, i) => {
      if (item.data.id === id) {
        result = item.data
      }
    })
    return result
  }

  setLayout () {
    LayoutManager.setLayout(this.layout, this.data, this.rootWidth, this.rootHeight)
    this.translate = [this.data.offsetLeft || 0, this.data.offsetTop || 0]
  }

  addEvent () {
    var self = this
    this.nodes.forEach((node, i) => {
      node.on('drag', this.onNodeDrag, this)
      node.on('down', this.onNodeDown, this)
      node.on('mouseenter', this.onEnterNode, this)
      node.on('mouseleave', this.onLeaveNode, this)
    })
    // 平移及缩放事件
    this.topo_z = d3.behavior.zoom().scaleExtent(self.scaleRange).on('zoom', function () {
      self.zoom()
    })
    this.topo_z.translate(this.translate)
    // 设置禁止双击放大
    this.svg.call(this.topo_z).on('dblclick.zoom', null)
    this.dispatch = d3.dispatch('mousewheel')
    this.dispatch.on('mousewheel', this.zoom)
    // TODO fullScreen一定要在外面去做, 不要把它放在拓扑里面
    // window.addEventListener('resize', function() {
    //   if (self.fullstatus) {
    //     self.fullScreen()
    //   }
    // })
  }

  // fullScreen(e) {
  //   var width = $('body').width()
  //   var height = $('body').height()
  //   this.root.clientWidth = width
  //   this.root.clientHeight = height
  //   if (this.root.className.indexOf('full') < 0) {
  //     this.root.className += 'full'
  //   }
  //   // $(this.$refs.topo).width(width)
  //   // $(this.$refs.topo).height(height)
  //   // $(this.$refs.topo).addClass('full')
  //   $(this.$refs.fullscreen).hide()
  //   $(this.$refs.restore).show()
  //   this.fullstatus = true
  // }

  zoom (s, manual) {
    var scale = s || d3.event.scale
    var self = this
    // 0.88为默认放大一次的倍率 显示文字
    if (scale > 0.88) {
      setTimeout(function () {
        self.container.selectAll('.line-text').style('display', 'block')
        self.container.selectAll('.pie-summary').style('display', 'block')
        self.container.selectAll('.attachement-text').style('display', 'block')
        self.container.selectAll('.attachement').style('display', 'block')
      }, 100)
    } else {
      setTimeout(function () {
        self.container.selectAll('.line-text').style('display', 'none')
        self.container.selectAll('.pie-summary').style('display', 'none')
        self.container.selectAll('.attachement-text').style('display', 'none')
        self.container.selectAll('.attachement').style('display', 'none')
      }, 100)
    }

    if (scale > 0.68) {
      setTimeout(function () {
        self.container.selectAll('.pie-name').style('display', 'block')
      }, 100)
    } else {
      setTimeout(function () {
        self.container.selectAll('.pie-name').style('display', 'none')
      }, 100)
    }

    var transform = d3.transform(this.container.attr('transform'))
    // 表示平移操作, 若平移，则需要纪录当天平移的坐标
    if (this.scale === scale && !s) {
      this.translate = [transform.translate[0], transform.translate[1]]
    }
    // this.tooltip.show = false
    // 若移动slider进行的缩放，需要计算中心点的位置进行偏移
    if (!d3.event && manual) {
      self.container.attr('transform', 'scale(' + [scale, scale] + ')')
      var eleRect = self.container.getBoundingClientRect()
      var translate = [(this.translate[0] + (this.data.scale - scale) * (eleRect.width / 2) / scale), (this.translate[1] + (this.data.scale - scale) * (eleRect.height / 2) / scale)]
      self.container.attr('transform', 'translate(' +
                    translate +
                    ') scale(' + [scale, scale] + ')')
      this.topo_z.translate(translate)
    } else {
      self.container.attr('transform', 'translate(' +
                    (d3.event ? d3.event.translate : transform.translate) +
                    ') scale(' + [scale, scale] + ')')
      this.topo_z.translate(d3.event ? d3.event.translate : transform.translate)
    }
    this.scale = scale
    this.topo_z.scale(this.scale)
    // 计算sliderTop值
    // this.computeSliderTop()
  }

  onNodeDrag (node) {
    this.getLinksByNode(node).forEach((link, i) => {
      link.stopArrowAnimation()
      link.type = TopoUtil.LINK_TYPE_LINE
      link.update()
    })
  }

  onEnterNode (node) {
    this.getLinksByNode(node).forEach((link, i) => {
      link.playArrowAnimation()
    })
  }

  onLeaveNode (node) {
    this.getLinksByNode(node).forEach((link, i) => {
      link.stopArrowAnimation()
    })
  }

  onNodeDown (node) {

  }

  getLinksByNode (node) {
    let list = []
    this.links.forEach((link, i) => {
      if (link.source.id === node.id || link.target.id === node.id) {
        list.push(link)
      }
    })
    return list
  }

  setOption (option) {
    this.option = Object.assign(this.option, option)
  }
}

export default Topo
