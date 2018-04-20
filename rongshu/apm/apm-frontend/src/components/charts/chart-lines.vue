<style lang="scss" scoped>
.chart-lines,
.chart {
  height: 100%;
  /*display: flex;*/
  /*align-items: center;*/
  /*justify-content: center;*/
}
</style>
<template>
  <div class="chart-lines">
    <chart-container  :title="title" :isLoading="loading" :isEmpty="isDataEmpty" :isAutoHeight="isAutoHeight">
      <div class="chart" ref="chart">
        <i class="el-icon-loading"></i>
      </div>
    </chart-container>
  </div>
</template>
<script>
// import echarts from 'echarts/lib/echarts'
// import 'echarts/lib/chart/line'
// import 'echarts/lib/component/tooltip'
// import 'echarts/lib/component/title'
// import 'echarts/lib/component/legend'
import util from '_util'
import chartMixin from './helpers/chart-mixin'
import chartContainer from './helpers/chart-container'

export default {
  name: 'chart-lines',
  mixins: [chartMixin],
  components: { chartContainer },
  mounted() {
    this.chart = echarts.init(this.$refs.chart)
    //       this.renderChart()
  },
  data() {
    return {
      chart: null,
      localOptions: {
        tooltip: {
          trigger: 'item',
          //            transitionDuration: 0,
          //            confine: true,
          //            axisPointer: {
          //              type: 'cross'
          //            },
          // left: 'right',
          formatter: function(params) {
            let res = ''
            let data = params.data
            res +=
              window.$$apm.locale['value'] +
              ': ' +
              util.toDecimal(data[1]) +
              '<br>'
            res += window.$$apm.locale['startTime'] + ': ' + data[2] + '<br>'
            res += window.$$apm.locale['endTime'] + ': ' + data[3] + '<br>'
            if (data[4]) {
              for (let key in data[4]) {
                res +=
                  (window.$$apm.locale[key] ? window.$$apm.locale[key] : key) +
                  ': ' +
                  data[4][key] +
                  '<br>'
              }
            }
            return res
          }
        },
        grid: {
          containLabel: true
        },
        xAxis: {
          type: 'time',
          // splitNumber: 20
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          name: ''
        }
      },
      isDataEmpty: false
    }
  },
  props: {
    title: {
      reqiured: true
    },
    data: {
      type: Object,
      required: true
    },
    loading: false,
    options: Object,
    isAutoHeight: false,
    resized: 0
  },

  watch: {
    title(v) {
      console.info(this.title)
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
    checkData() {
      let cData = this.data
      if (_.isEmpty(cData)) {
        this.isDataEmpty = true
        return
      }
      if (_.isEmpty(cData.data)) {
        this.isDataEmpty = true
        return
      }
      let emptyList = cData.data.every(m => {
        return _.isEmpty(m.list)
      })
      if (emptyList) {
        this.isDataEmpty = true
        return
      }
      this.isDataEmpty = false
    },
    renderChart() {
      this.checkData()
      if (!this.isDataEmpty) {
        let data = this.data.data
        let allLength = 0
        // let limit = 120
        data.forEach(e => {
          allLength += e.name.length
          e.name = e.name.replace(/[\n\r]/g, ' ').replace(/\s+/g, ' ')
        })
        let option = Object.assign({}, this.localOptions, {
          series: data.map((e, i) => {
            e.list = e.list || []
            return {
              type: 'line',
              name: e.name,
              smooth: true,
              sampling: 'average',
              hoverAnimation: true,
              areaStyle: {
                normal: {}
              },
              data: e.list.map(item => {
                return [
                  item.x,
                  item.y,
                  item.startTime,
                  item.endTime,
                  item.info
                ]
              })
            }
          })
        })
        if (!(data.length === 1 && data[0].name === 'None')) {
          option.legend = {
            data: data.map((e, i) => {
              return e.name
            }),
            formatter:
              allLength > 60
                ? function(name) {
                  return echarts.format.truncateText(
                      name,
                      80,
                      '12px Microsoft Yahei',
                      '…'
                    )
                }
                : null,
            tooltip: {
              show: allLength > 60
            },
            top: 'bottom'
          }
        }
        option.yAxis.name = this.data.unit || ''
        this.chart.setOption(
          Object.assign(
            {
              color: this.chartColors
            },
            option,
            this.options
          ),
          true
        )
        this.$nextTick(function() {
          this.chart.resize()
        })
      }
    }
  }
}
</script>
