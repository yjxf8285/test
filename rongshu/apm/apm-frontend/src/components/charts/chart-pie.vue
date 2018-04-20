<style lang="scss" scoped>
.chart-pie,
.chart {
  height: 100%;
}
</style>
<template>
  <div class="chart-pie">
    <chart-container :title="title" :isLoading="loading" :is-empty="!(data && data.length)"  :isAutoHeight="isAutoHeight">
      <div class="chart" ref="chart"></div>
    </chart-container>
  </div>
</template>
<script>
import chartMixin from './helpers/chart-mixin'
import chartContainer from './helpers/chart-container'

export default {
  name: 'chart-pie',
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
        title: {
          text: this.title
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
          confine: true
        },
        // legend: {
        //     orient: 'vertical',
        //     left: 'left',
        //     data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
        // },
        series: [
          {
            name: this.name,
            type: 'pie',
            center: ['50%', '55%'],
            data: this.data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
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
    data: {
      type: Array,
      required: true
    },
    loading: false,
    options: Object,
    isAutoHeight: false
  },
  watch: {
    title(v) {
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
    }
  },
  methods: {
    renderChart() {
      this.chart.resize()
      if (_.isEmpty(this.data)) return // 统一风格，数据空的时候不要渲染
      this.chart.setOption(
        Object.assign(
          {
            color: this.chartColors
          },
          this.localOptions,
          this.options
        )
      )
    }
  }
}
</script>
