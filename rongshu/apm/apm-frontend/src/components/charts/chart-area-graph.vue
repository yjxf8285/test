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
  name: 'chart-area-graph',
  mixins: [chartMixin],

  props: {
    optionData: {
      type: Object,
      //        required: true,
      default: {}
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
  methods: {
    resetDefData() {
      this.defOption = {
        noDataLoadingOption: {
          text: '暂无数据',
          effect: 'bubble',
          effectOption: {
            effect: {
              n: 0
            }
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        // 径向渐变，前三个参数分别是圆心 x, y 和半径，取值同线性渐变
        color: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.5,
          colorStops: [
            {
              offset: 0,
              color: 'red' // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'blue' // 100% 处的颜色
            }
          ],
          globalCoord: false // 缺省为 false
        },
        grid: {
          top: '10',
          left: '10',
          right: '15',
          bottom: '8',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: '',
            type: 'line',
            smooth: true,
            //              symbol: "none",
            sampling: 'average',
            hoverAnimation: true,
            itemStyle: {
              normal: {
                color: this.chartColors[0]
              }
            },
            areaStyle: {
              normal: {
                //                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //                    offset: 0,
                //                    color: "#2b8dd1"
                //                  }, {
                //                    offset: 1,
                //                    color: "#2bb6ff"
                //                  }])
              }
            },

            data: []
          }
        ]
      }
    },
    renderChart() {
      if (!this.chart) this.chart = echarts.init(this.$refs.chart)
      if (this.noData) {
        this.chart.clear()
      } else {
        this.chart.resize()
        let o = util.extend(this.defOption, this.optionData)
        this.chart.setOption(o, true)
      }
    }
  }
}
</script>
