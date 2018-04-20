<style lang="scss" scoped>
  .echarts {
    width: 100%;
    height: 100%;
  }
</style>
<template>
  <div class="echarts"></div>
</template>
<script>
import echarts from '_echarts'

// 设置charts主题walden
import walden from '../echarts/walden'
echarts.registerTheme('walden', walden)

export default {
  name: 'echarts',
  props: {
    series: Array,
    xAxis: Array,
    yAxis: Array,
    tooltip: Object,
    legend: Object,
    loading: Boolean
  },
  data () {
    return {
      chart: null,
      loadingInstance: null
    }
  },
  watch: {
    loading (v) {
      if (v && !this.loadingInstance) {
        this.loadingInstance = this.$loading({
          target: this.$el
        })
      } else {
        if (this.loadingInstance) {
          this.loadingInstance.close()
          this.loadingInstance = null
        }
      }
    },
    series: {
      deep: true,
      handler (v) {
        this.render()
      }
    },
    xAxis: {
      deep: true,
      handler () {
        this.render()
      }
    },
    yAxis: {
      deep: true,
      handler () {
        this.render()
      }
    },
    tooltip: {
      deep: true,
      handler () {
        this.render()
      }
    },
    legend: {
      deep: true,
      handler () {
        this.render()
      }
    }
  },
  methods: {
    resize () {
      if (this.chart) this.throttling(this.chart.resize)
    },
    throttling (callback) {
      let vm = this
      let setClock = () => {
        vm.clock = setTimeout(function () {
          callback()
          clearTimeout(vm.clock)
          vm.clock = null
        }, 200)
      }
      if (!vm.clock) {
        setClock()
      } else {
        clearTimeout(vm.clock)
        setClock()
      }
    },
    resolveOption () {
      return {
        series: this.series,
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        tooltip: this.tooltip,
        legend: this.legend
      }
    },
    render () {
      this.chart.setOption(this.resolveOption(), true)
      this.resize()
    }
  },
  created () {
    window.addEventListener('resize', this.resize)
  },
  mounted () {
    this.chart = echarts.init(this.$el, 'walden')
    this.render()
  },
  destroyed () {
    window.removeEventListener('resize', this.resize)
    this.chart.clear()
    this.chart.dispose()
  }
}
</script>
