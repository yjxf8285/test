<style lang="scss" scoped>
.topn-bar,
.chart {
  height: 100%;
}
</style>
<template>
  <div class="topn-bar">
    <chart-container :title="title" :isLoading="loading" :isEmpty="noData" :isBig="false"  :isAutoHeight="isAutoHeight">
      <div class="chart" ref="chart"></div>
    </chart-container>
  </div>
</template>

<script>
import util from '_util'
import chartMixin from './helpers/chart-mixin'
import chartContainer from './helpers/chart-container'

export default {
  name: 'tn-bar',
  mixins: [chartMixin],
  components: { chartContainer },
  props: {
    loading: false,
    queryData: {},
    data: {
      type: Array,
      required: true
    },
    title: {
      required: true
    },
    options: Object,
    link: {
      required: true
    },
    isAutoHeight: false,
    from: String
  },
  data() {
    return {
      chart: null,
      noData: true,
      cid: 'cm',
      formatNamesMap: {}
    }
  },
  mounted() {
    this.initCharts()
    this.setChart()
  },
  watch: {
    data: {
      deep: true,
      handler(v) {
        this.setChart()
      }
    },
    loading(v) {
      if (v) {
        this.chart.showLoading({ color: '#cccccc', text: ' ' })
      } else {
        this.chart.hideLoading()
      }
    }
  },
  methods: {
    initCharts() {
      let vm = this
      vm.chart = echarts.init(vm.$refs.chart)
      vm.chart.on('click', function(params) {
        vm.$router.push({
          name: vm.link,
          query: Object.assign(
            {},
            vm.$route.query,
            {
              queryStr: vm.formatNamesMap[params.dataIndex].name
            },
            vm.queryData
          )
        })
      })
    },
    setChart() {
      let vm = this
      let data = vm.data
      let nameArr = []
      let maxArr = []
      let minArr = []
      let avgArr = []
      let countArr = []
      let formatNameArr = []
      let maxLength = 60

      if (_.isEmpty(data)) {
        vm.noData = true
      } else {
        vm.noData = false
        data.map((m, i) => {
          let formatName = m.name
            .replace(/[\n\r]/g, ' ')
            .replace(/\s+/g, ' ')
            .substring(0, maxLength)
          formatName =
            m.name.length >= maxLength ? formatName + '...' : formatName
          nameArr.push(m.name)
          formatNameArr.push(formatName)
          vm.formatNamesMap[data.length - i - 1] = m
          maxArr.push(m.max)
          minArr.push(m.min)
          avgArr.push(m.avg)
          countArr.push(m.count)
        })

        for (let i = 0; i < 5; i++) {
          // formatNameArr[i] || (formatNameArr[i] = 'bbb' + i)
          // avgArr[i] || (avgArr[i] = i * 100)
          // nameArr[i] || (nameArr[i] = 'aaa' + i)
          // maxArr[i] || (maxArr[i] = i * i)
          // minArr[i] || (minArr[i] = i / 2)
          // countArr[i] || (countArr[i] = i)
          // avgArr.push(0.5)
          // formatNameArr.shift('gggggggg')
          // avgArr[i] = avgArr[i] * 10
        }
        // for (let i = 0; i < avgArr.length; i++) {
        // avgArr[i] = avgArr[i] < 1 ? 1 : avgArr[i]
        // }
        let option = {
          color: ['#aed5f2'],
          //            title: {
          //              'text': vm.title,
          //            },
          // legend: {
          // data: nameArr,
          // },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                opacity: 0
              }
            },
            confine: true,
            formatter: function(params, ticket, callback) {
              let formatStr = ''
              params.map(m => {
                let curItem = vm.formatNamesMap[m.dataIndex]
                if (curItem) {
                  let max = curItem.max
                  let min = curItem.min
                  let avg = curItem.avg
                  let count = curItem.count
                  let maxStr = max
                    ? window.$$apm.locale['max'] + ': ' + max + 'ms<br/>'
                    : ''
                  let minStr = min
                    ? window.$$apm.locale['min'] + ': ' + min + 'ms<br/>'
                    : ''
                  let avgStr = avg
                    ? window.$$apm.locale['avg'] +
                      ': ' +
                      util.toDecimal(avg, 3) +
                      'ms<br/>'
                    : ''
                  let countStr = count
                    ? window.$$apm.locale['count'] + ': ' + count + '<br/>'
                    : ''
                  formatStr += maxStr + minStr + avgStr + countStr
                }
              })
              return formatStr
            }
          },
          // grid: {
          //   left: '50',
          //   right: '50',
          //   bottom: '0',
          //    top:'0',
          //   // containLabel: true
          // },
          xAxis: {
            show: true,
            type: 'log',
            name: '',
            axisLabel: {
              show: false
            }
            // min: Math.min(...avgArr) < 1 ? 0.1 : null
            // boundaryGap: [0, 0.01]
          },
          yAxis: {
            show: true,
            type: 'category',
            data: formatNameArr.reverse(),
            axisLabel: {
              show: false
            }
            // splitArea: {
            //   show: true
            // }
          },
          series: [
            {
              name: '平均',
              type: 'bar',
              barMaxWidth:
                formatNameArr.length <= 5
                  ? formatNameArr.length * 20 + '%'
                  : '100%',
              barMinHeight: 15,
              barCategoryGap: '30%',
              itemStyle: {
                // emphasis:{
                //   shadowColor: 'rgba(0, 0, 0, 0.3)',
                //   shadowBlur: 10,
                // }
              },
              label: {
                normal: {
                  show: true,
                  textStyle: {
                    color: '#333'
                  },
                  position: 'insideLeft',
                  formatter: function(params, ticket, callback) {
                    return params.name
                  },
                  offset: [0, -2]
                }
              },
              data: avgArr.reverse()
            }
          ]
        }
        let finalOption = Object.assign(option, this.options)
        this.chart.setOption(Object.assign({}, finalOption), true)
      }
    }
  }
}
</script>

