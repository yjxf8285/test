<style lang="scss" scoped>
.chart {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<template>
  <div class="chart" ref="chart">
    <i class="el-icon-loading"></i>
  </div>
</template>

<script>
import util from '_util'
import chartMixin from './helpers/chart-mixin'
export default {
  mixins: [chartMixin],
  props: {
    optionData: {
      type: Object,
      default: {}
      // required: true
    }
  },
  data() {
    return {
      defOption: {}
    }
  },
  computed: {
    noData() {
      return Object.keys(this.optionData).length <= 0
    }
  },
  watch: {
    optionData: {
      deep: true,
      handler(v) {
        this.resetDefData()
        this.renderChart()
      }
    }
  },
  mounted() {},
  methods: {
    resetDefData() {
      this.defOption = {
        color: this.chartColors,
        legend: {
          orient: 'vertical',
          x: '200',
          y: 'middle',
          data: [],
          formatter: function(name) {
            return name
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '容忍度',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['40%', '50%'],
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: []
          }
        ]
      }
    },
    renderChart() {
      if (!this.chart) this.chart = echarts.init(this.$refs.chart)
      this.chart.resize()
      let o = util.extend({}, this.defOption, this.optionData)
      this.chart.setOption(o, true)
      let l = o.series[0].data.length
      if (l === 0) this.chart.clear()
    }
  }
}
</script>

