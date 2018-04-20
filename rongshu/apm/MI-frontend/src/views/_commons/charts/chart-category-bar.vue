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
    name: 'chart-category-bar',
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
      markPoint: Array, // 需要标记的x轴
      loading: false,
      options: Object,
      isAutoHeight: false
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
      }
    },
    methods: {
      renderChart () {
        let vm = this
        vm.chart.resize()
        if (!vm.isDataEmpty) {
          let data = vm.data
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
              formatter: '响应时间: {b0}ms<br>请求数: {c0}'
            },
            xAxis: [
              {
                type: 'category',
                data: data.map(e => e.x + '')
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: ''
              }
            ],
            series: [
              {
                name: vm.title,
                type: 'bar',
                data: data.map(e => e.y + ''),
                markPoint: {
                  data: vm.markPoint.map(e => ({coord: [e, data[e].y]}))
                }
              }
            ]
          })
          option.yAxis[0].name = vm.data.unit || ''
          vm.chart.setOption(Object.assign({}, option, vm.options))
        }
      }
    }
  }
</script>
