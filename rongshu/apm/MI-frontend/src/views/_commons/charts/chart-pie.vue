<style lang="scss" scoped>
  .chart-pie, .chart {
    height: 100%;
  }
</style>
<template>
  <div class="chart-pie">
    <chart-container :title="title" :isLoading="loading" :is-empty="isDataEmpty"  :isAutoHeight="isAutoHeight">
      <div class="chart" ref="chart"></div>
    </chart-container>
  </div>
</template>
<script>
  import utils from '../../../helpers/utils'
  import chartMixin from './chart-helpers/chart-mixin'
  import chartContainer from './chart-helpers/chart-container'

  export default {
    name: 'chart-pie',
    mixins: [chartMixin],
    components: { chartContainer },
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
        chart: null,
        localOptions: {
          // title: {
          //   text: this.title
          // },
          tooltip: {
            trigger: 'item',
            // formatter: '{a} <br/>{b} : {c} ({d}%)',
            formatter: '{b} : {c} ({d}%)',
            confine: true
          },
          labelLine: {
            normal: {
              show: false
            }
          }
        }
      }
    },
    props: {
      title: String,
      name: String,
      data: {
        type: Object,
        required: true
      },
      loading: false,
      options: Object,
      isAutoHeight: false
    },
    computed: {
      isDataEmpty () {
        return utils.isEmptyArray(this.data.list)
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
        this.chart.resize()
        if (!this.isDataEmpty) {
          this.chart.setOption(Object.assign({}, this.localOptions, {
            legend: {
              orient: 'vertical',
              x: 'right',
              y: 'bottom',
              data: this.data.list.map(e => e.name)
            },
            series: [
              {
                name: this.title,
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    show: true
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: this.data.list
              }
            ]
          }, this.options))
        }
      }
    }
  }
</script>
