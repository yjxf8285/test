<style lang="scss" scoped>
  .chart-map, .chart {
    height: 100%;
  }
</style>
<template>
  <div class="chart-map">
    <chart-container :title="title" :isLoading="loading" :is-empty="!(data && data.length)" :is-big="true"  :isAutoHeight="isAutoHeight">
      <div class="chart" ref="chart"></div>
    </chart-container>
  </div>
</template>
<script>
  // import echarts from 'echarts'
  // import { isEmpty } from 'lodash'
  // import echarts from 'echarts/lib/echarts'
  // import 'echarts/lib/chart/map'
  // import 'echarts/lib/component/tooltip'
  // import 'echarts/lib/component/title'
  // import 'echarts/lib/component/legend'
  // import 'echarts/lib/component/toolbox'
  // import 'echarts/lib/component/visualMap'

  import china from './helpers/china.js'
  import chartMixin from './helpers/chart-mixin'
  import chartContainer from './helpers/chart-container'

  export default {
    name: 'chart-pie',
    mixins: [chartMixin],
    components: { chartContainer },
    mounted () {
      this.chart = echarts.init(this.$refs.chart)
      this.renderChart()
    },
    data () {
      return {
        chart: null,
        localOptions: {
            title: {
                text: this.title
            },
            tooltip: {
                trigger: 'item',
                confine: true
            },
            visualMap: {
                type: 'piecewise',
                min: 0,
                max: this.max,
                calculable: true
                
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    dataView: {readOnly: false},
                    restore: {},
                    saveAsImage: {}
                }
            },
            series: [
                {
                    name: this.name,
                    type: 'map',
                    mapType: 'china',
                    roam: false,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    data: this.data
                }
            ]
        }
      }
    },
    props: {
      title: {
        required: true
      },
      name: {
        required: true
      },
      max:{
        required: true
      },
      data: {
        type: Array,
        required: true
      },
      loading: false,
      options: Object,
      isAutoHeight: false
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
        if (v) this.chart.showLoading({color: '#cccccc', text: ' '})
        else this.chart.hideLoading()
      }
    },
    methods: {
      renderChart () {
        this.chart.resize()
        let self = this
        if (_.isEmpty(this.data)) return;//统一风格，数据空的时候不要渲染

        self.chart.setOption(Object.assign({
          color: self.chartColors
        }, self.localOptions, options))
      }
    }
  }
</script>