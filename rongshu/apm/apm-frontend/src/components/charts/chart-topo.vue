<style lang="scss" scoped>
.chart-topo,
.chart {
  height: 100%;
}
</style>
<template>
  <div class="chart-topo">
    <chart-container
      :title="title"
      :isLoading="loading"
      :is-empty="!data || !data.nodes || !data.nodes.length"
      :isBig="true"
      :isAutoHeight="isAutoHeight">
      <div class="chart" ref="chart"></div>
    </chart-container>
  </div>
</template>
<script>
// import { isEmpty } from 'lodash'
// import echarts from 'echarts/lib/echarts'
// import 'echarts/lib/chart/graph'
// import 'echarts/lib/component/tooltip'
// import 'echarts/lib/component/title'
// import 'echarts/lib/component/legend'

import chartMixin from './helpers/chart-mixin'
import chartContainer from './helpers/chart-container'

export default {
  name: 'chart-topo',
  mixins: [chartMixin],
  components: { chartContainer },
  mounted() {
    this.chart = echarts.init(this.$refs.chart)
    this.renderChart()
  },
  data() {
    let that = this
    return {
      chart: null,
      localOptions: {
        tooltip: {
          show: this.tooltip,
          confine: true,
          showDelay: 0.4,
          hideDelay: 0.4,
          transitionDuration: 0,
          position: function(point, params, dom, rect) {
            if (params.dataType === 'node') {
              return [rect.x + 50, rect.y + 50]
            }
          },
          formatter: function(param) {
            let index = param.dataIndex
            if (!that.data) return ''
            let nodes = that.data.nodes
            if (param.dataType === 'node') {
              if (nodes[index].type === 'DATABASE') {
                let result =
                  '<div class="title">' +
                  (nodes[index].type === 'DATABASE'
                    ? nodes[index].name2
                    : nodes[index].name) +
                  '</div>'
                result +=
                  '<div>吞吐量：' +
                  (!nodes[index].concurrent && nodes[index].concurrent !== 0
                    ? '--'
                    : nodes[index].concurrent) +
                  '</div>'
                result +=
                  '<div>平均响应时间：' +
                  (!nodes[index].times && nodes[index].times !== 0
                    ? '--'
                    : nodes[index].times) +
                  '</div>'
                return result
              } else {
                let result =
                  '<div class="title">' +
                  (nodes[index].type === 'DATABASE'
                    ? nodes[index].name2
                    : nodes[index].name) +
                  '</div>'
                result +=
                  '<div>吞吐量：' +
                  (!nodes[index].concurrent && nodes[index].concurrent !== 0
                    ? '--'
                    : nodes[index].concurrent) +
                  '</div>'
                result +=
                  '<div>平均响应时间：' +
                  (!nodes[index].times && nodes[index].times !== 0
                    ? '--'
                    : nodes[index].times) +
                  '</div>'
                result +=
                  '<div>错误率：' +
                  (!nodes[index].error && nodes[index].error !== 0
                    ? '--'
                    : nodes[index].error + '%') +
                  '</div>'
                result +=
                  '<div>Apdex：' +
                  (!nodes[index].apdex && nodes[index].apdex !== 0
                    ? '--'
                    : nodes[index].apdex) +
                  '</div>'
                result +=
                  '<div>实例数：' +
                  (!nodes[index].instances && nodes[index].instances !== 0
                    ? '--'
                    : nodes[index].instances) +
                  '</div>'
                return result
              }
            } else if (param.dataType === 'edge') {
              return '<div>' + that.data.links[index].label + '</div>'
            }
          }
        },
        // animation: true,
        animationDurationUpdate: 500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            // layout: 'force',
            force: {
              repulsion: 1000,
              gravity: 0.1,
              edgeLength: [100, 200],
              layoutAnimation: false
            },
            symbolSize: this.iconSize,
            roam: this.draggable,
            label: {
              normal: {
                show: true,
                position: 'bottom'
              }
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [1, 6],
            edgeLabel: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 12,
                  fontWeight: 'normal',
                  fontStyle:
                    '-apple-system,Microsoft Yahei,system-ui,BlinkMacSystemFont,Open Sans,Hiragino Sans GB,sans-serif',
                  color: '#000'
                },
                formatter: function(param) {
                  return that.data.links[param.dataIndex].label
                }
              }
            },
            nodes: [],
            links: [],
            lineStyle: {
              normal: {
                opacity: 0.9,
                width: 1,
                curveness: 0
              },
              emphasis: {
                width: 2
                // shadowBlur: 5
              }
            },
            itemStyle: {
              normal: {
                color: '#000'
              }
            }
          }
        ]
      }
    }
  },
  props: {
    data: {
      required: true
    },
    title: {
      required: true
    },
    iconSize: {
      type: Number,
      default: 50
    },
    loading: false,
    options: Object,
    isAutoHeight: false,
    draggable: true,
    tooltip: {
      default: true
    },
    resized: {
      default: 5
    }
  },
  watch: {
    title(v) {
      this.renderChart()
    },
    data: {
      deep: true,
      handler(v) {
        this.renderChart()
      }
    },
    loading(v) {
      if (v) this.chart.showLoading({ color: '#cccccc', text: ' ' })
      else this.chart.hideLoading()
    },
    resized(v) {
      this.chart.resize()
    }
  },
  methods: {
    renderChart() {
      if (!this.data) return
      let that = this
      let nodes = this.createNodes()
      let links = this.createLinks()
      this.localOptions.series[0].nodes = nodes
      this.localOptions.series[0].links = links
      if (_.isEmpty(this.data.nodes)) return // 统一风格，数据空的时候不要渲染
      that.chart.setOption(
        Object.assign(
          {
            color: that.chartColors
          },
          that.localOptions,
          that.options
        ),
        false
      )
      this.chart.resize()
    },
    createNodes() {
      return this.data.nodes.map(e => {
        return e
      })
    },

    createLinks() {
      let links = this.data.links.map(e => {
        return e
      })
      return links
    }
  }
}
</script>
