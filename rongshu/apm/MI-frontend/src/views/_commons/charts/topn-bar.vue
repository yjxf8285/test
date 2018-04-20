<style lang="scss" scoped>
  .topn-bar, .chart {
    height: 100%;
  }
</style>
<template>
  <div class="topn-bar">
    <chart-container class="chart-container" :title="title" :isLoading="loading" :isEmpty="isDataEmpty" :isBig="false"  :isAutoHeight="isAutoHeight">
      <div class="chart" ref="chart"></div>
    </chart-container>
  </div>
</template>

<script>
  import utils from '../../../helpers/utils'
  import chartMixin from './chart-helpers/chart-mixin'
  import chartContainer from './chart-helpers/chart-container'

  export default {
    name: 'topn-bar',
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
    props: {
      loading: false,
      queryData: {},
      data: {
        type: Object,
        required: true
      },
      title: {
        required: true
      },
      options: Object,
      isAutoHeight: false,
      from: String
    },
    data () {
      return {
        chart: null,
        noData: true,
        cid: 'cm',
        formatNamesMap: {}
      }
    },
    computed: {
      isDataEmpty () {
        return utils.isEmptyArray(this.data.list)
      }
    },
    watch: {
      data: {
        deep: true,
        handler (v) {
          this.renderChart()
        }
      },
      loading (v) {
        if (v) {
          this.chart.showLoading({color: '#1c86e2', text: ' '})
        } else {
          this.chart.hideLoading()
        }
      }
    },
    methods: {
      renderChart () {
        let vm = this
        let data = JSON.parse(JSON.stringify(vm.data))
        vm.chart.resize()
        if (!vm.isDataEmpty) {
          let options = {
            xAxis: [
              {
                type: 'log'
              }
            ],
            yAxis: [
              {
                type: 'category',
                data: data.list.sort((a, b) => a.value - b.value).map(e => e.name),
                axisLabel: {
                  rotate: -45
                },
                showMinLabel: true
              }
            ],
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
                // return utils.formatDate(params[0].data[0]) + '<br>' +
                // (params.map(param => {
                //   return param.seriesName + ':' + param.data[1] + '<br>'
                // }).join(''))
                return params.map(param => {
                  let more = vm.data.list[param.dataIndex].more
                  let res = param.name + ': ' + param.value + '<br>'
                  for (let key in more) {
                    res += key + ': ' + more[key] // TODO: name 翻译
                  }
                  return res
                })
              }
            },
            series: [{
              type: 'bar',
              data: data.list.map(e => {
                return {
                  value: e.value,
                  name: e.name
                }
              }).sort((a, b) => a.value - b.value)
            }]
          }
          // vm.chart.setOption(Object.assign({}, options, vm.options))
          vm.chart.setOption(options)
        }
      }
    }
  }
</script>

