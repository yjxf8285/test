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
      //        required: true
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
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        barMaxWidth: 25,
        legend: {
          bottom: '10',
          data: []
        },
        grid: {
          top: 30,
          left: 80,
          right: 70
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            data: []
          }
        ]
      }
    },
    renderChart() {
      if (!this.chart) this.chart = echarts.init(this.$refs.chart)
      let l = this.optionData.xAxis[0].data.length
      this.chart.resize()
      this.optionData.series.forEach(m => {
        for (let n in m.data) {
          if (m.data[n] === 'NaN') m.data[n] = 0
        }
      })
      let o = util.extend({}, this.defOption, this.optionData)
      this.chart.setOption(o, true)
      if (l === 0) this.chart.clear()
    }
  }
}
</script>

