<style lang="scss" scoped>
  .chart-line-bar, .chart {
    height: 100%;
  }
</style>
<template>
  <div class="chart-line-bar">
    <chart-container :title="title" :isLoading="loading" :isEmpty="isDataEmpty" :isAutoHeight="isAutoHeight">
      <div class="chart" ref="chart"></div>
    </chart-container>
  </div>
</template>
<script>
  // import echarts from 'echarts/lib/echarts'
  // import 'echarts/lib/chart/line'
  // import 'echarts/lib/component/tooltip'
  // import 'echarts/lib/component/title'
  // import 'echarts/lib/component/legend'
  import utils from '../../../helpers/utils'
  import chartMixin from './chart-helpers/chart-mixin'
  import chartContainer from './chart-helpers/chart-container'

  export default {
    name: 'chart-line-bar',
    mixins: [chartMixin],
    components: {chartContainer},
    mounted () {
      this.chart = window.echarts.init(this.$refs.chart, 'adminUi', { renderer: 'svg' })
      this.$nextTick(this.renderChart)
    },
    beforeDestroy () {
      this.chart.clear()
      this.chart.dispose()
      this.chart = null
    },
    data () {
      return {
        chart: null
      }
    },
    props: {
      title: {
        reqiured: true
      },
      data: {
        type: Array,
        required: true
      },
      type: {
        type: String,
        default: 'line'
      },
      structureMap: {
        type: Object,
        default () { return {} }
        // default: {
        //   'seriesName': {
        //     type: 'bar',
        //     stack: true,
        //     text: '系列名称'
        //   }
        // }
      },
      loading: false,
      options: Object,
      isAutoHeight: false,
      resized: 0
    },
    computed: {
      isDataEmpty () {
        return utils.isEmptyArray(this.data)
      }
    },
    watch: {
      title (v) {
        this.renderChart()
      },
      data: {
        deep: true,
        handler (v) {
          this.renderChart()
        }
      },
      loading (v) {
        if (v) this.chart.showLoading({color: '#1c86e2', text: ' '})
        else this.chart.hideLoading()
      },
      resized (v) {
        this.chart.resize()
      }
    },
    methods: {
      renderChart () {
        let vm = this
        vm.chart.resize()
        if (!vm.isDataEmpty) {
          let data = vm.data
          let allLength = 0
          // let limit = 120
          if (data.length > 1) {
            data.forEach(e => {
              allLength += e.name.length
              e.name = e.name.replace(/[\n\r]/g, ' ').replace(/\s+/g, ' ')
            })
          }
          let option = Object.assign({}, {
            tooltip: {
              trigger: 'axis',
              transitionDuration: 0,
              confine: true,
              axisPointer: {
                type: 'line',
                crossStyle: {
                  color: '#d8dde6'
                },
                lineStyle: {
                  color: '#d8dde6'
                }
              },
              // left: 'right',
              formatter: function (params) {
                return (params.length > 1 ? `<span style="font-size:12px;">${vm.title}</span><br>` : '') +
                `<span style="font-size:12px;">${utils.formatDate(params[0].data[0])}</span><br>` +
                (params.map(param => {
                  return `<span style="font-size:12px;">${param.name || vm.title + ': '} ${param.data[1]}</span>`
                }).join(''))
              }
            },
            xAxis: [
              (this.type === 'bar' || Object.values(this.structureMap).map(e => e.type).indexOf('bar') !== -1) ? {
                type: 'time',
                min: function (value) {
                  return value.min - 500000
                },
                max: function (value) {
                  return value.max + 500000
                }
              } : {
                type: 'time',
                axisLabel: {
                  interval: 1000
                },
                splitNumber: 8
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: ''
              }
            ]
          }, {
            // title: {
            //   text: vm.title
            // },
            series: data.map((e, i) => {
              e.list = e.list || []
              return {
                type: vm.structureMap[e.name] ? (vm.structureMap[e.name].type || 'line') : (vm.type || 'line'),
                stack: vm.structureMap[e.name] && vm.structureMap[e.name].stack || null,
                name: vm.structureMap[e.name] ? (vm.structureMap[e.name].text || e.name) : e.name,
                smooth: true,
                markPoint: vm.structureMap[e.name] && vm.structureMap[e.name].markPoint ? {
                  symbol: 'pin'
                } : null,
                // areaStyle: {normal: {}},
                data: e.list.map(item => {
                  return [
                    item.x,
                    item.y
                  ]
                })
              }
            })
          })
          if (data.length > 1 && data[0].name) {
            option.legend = {
              data: data.map((e, i) => {
                return vm.structureMap[e.name] ? (vm.structureMap[e.name].text || e.name) : e.name
              }),
              formatter: allLength > 60 ? function (name) {
                return window.echarts.format.truncateText(name, 80, '12px Microsoft Yahei', '…')
              } : null,
              tooltip: {
                show: allLength > 60
              },
              top: 'bottom'
            }
          }
          option.yAxis[0].name = vm.data.unit || ''
          vm.chart.setOption(Object.assign({}, option, vm.options))
        }
      }
    }
  }
</script>
