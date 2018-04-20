<style lang="scss" scoped>
.chart-mix-line-bar,
.chart {
  height: 100%;
}
</style>
<template>
  <div class="chart-mix-line-bar">
    <chart-container
      :show-header="showHeader"
      :title="title"
      :isLoading="loading"
      :is-empty="!(data && data.length)">
      <div class="chart" ref="chart"></div>
    </chart-container>
  </div>
</template>
<script>
import chartMixin from './helpers/chart-mixin'
import chartContainer from './helpers/chart-container'

export default {
  name: 'chart-mix-line-bar',
  mixins: [chartMixin],
  components: { chartContainer },
  mounted() {
    this.chart = echarts.init(this.$refs.chart)
    this.renderChart()
  },
  data() {
    return {
      chart: null,
      localOptions: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          confine: true
        },
        xAxis: [
          {
            type: 'time',
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          },
          {
            type: 'value'
          }
        ]
      }
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
    options: {
      type: Object
    },
    loading: false,
    showHeader: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  watch: {
    data: {
      deep: true,
      handler(v) {
        this.renderChart()
      }
    },
    loading(v) {
      if (v) this.chart.showLoading({ color: '#cccccc', text: ' ' })
      else this.chart.hideLoading()
    }
  },
  methods: {
    renderChart() {
      let option = Object.assign({}, this.localOptions, this.options)
      if (_.isEmpty(this.data)) return // 统一风格，数据空的时候不要渲染
      this.chart.setOption(
        Object.assign(
          {
            color: this.chartColors
          },
          option
        )
      )
      this.$nextTick(() => {
        this.chart.resize()
      })
    }
  }
}
</script>
