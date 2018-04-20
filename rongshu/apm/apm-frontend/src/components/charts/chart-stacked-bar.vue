<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
.chart-legends {
  text-align: center;
  li {
    display: inline-block;
    padding-left: 5px;
    padding-bottom: 5px;
    position: relative;
    cursor: pointer;

    i {
      float: left;
      width: 20px;
      line-height: 16px;
      height: 16px;
      border-radius: 5px;
      &.selected {
        background-color: #ccc !important;
      }
    }
    span {
      display: inline-block;
      margin-left: 4px;
      line-height: 18px;
    }
  }
}
</style>
<template>
  <div class="chart-stacked-bar">
    <chart-container
      :height="height"
      :show-header="showHeader"
      :show-border="showBorder"
      :title="title"
      :isLoading="loading"
      :is-empty="!(data && data.length)"
      :isAutoHeight="isAutoHeight">
      <div class="chart" ref="chart"></div>
    </chart-container>
    <ul class="chart-legends">
      <li
        v-for="(legend,index) in legends"
        :key="index">
        <a href="javascript:void(0);" @click="selectLegend(legend, index)">
        <i
          :class="{selected: !selectedLegends[legend.name]}"
          :style="{backgroundColor: legend.color}"></i>
        <span>{{legend.name}}</span>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
import chartMixin from './helpers/chart-mixin'
import chartContainer from './helpers/chart-container'

export default {
  name: 'chart-stacked-bar',
  mixins: [chartMixin],
  components: { chartContainer },
  data() {
    return {
      chart: null,
      localOptions: {
        title: {
          text: this.title
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: 20,
          top: 40
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%',
          confine: true
        },
        legend: {
          bottom: 0,
          data: []
        },
        calculable: true,
        xAxis: [
          {
            type: 'value'
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        series: []
      },
      legends: [],
      selectedLegends: {}
    }
  },
  props: {
    title: String,
    height: {
      required: false,
      default: 200
    },
    showHeader: {
      required: false,
      default: true
    },
    showBorder: {
      required: false,
      default: true
    },
    yAxisCategoryText: {
      required: true,
      default: '耗时'
    },
    stackText: {
      required: false,
      default: 'time'
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
  mounted() {
    let that = this
    that.chart = echarts.init(that.$refs.chart)
    that.renderChart()
    that.chart.on('legendselectchanged', function(args) {
      that.selectedLegends = args.selected
    })
  },
  methods: {
    renderChart() {
      this.localOptions.series = []
      this.localOptions.legend.data = []
      this.legends = []
      this.selectedLegends = {}
      if (_.isEmpty(this.data)) {
        return // 统一风格，数据空的时候不要渲染
      }
      /* let item = {
        name: '组件描述1',
        value: 100
      } */

      // let legendData = []
      this.localOptions.yAxis[0].data = [this.yAxisCategoryText]

      let allLength = 0
      // let limit = 120
      this.data.forEach(item => {
        allLength += item.name.length
        this.localOptions.series.push({
          name: item.name,
          type: 'bar',
          stack: this.stackText,
          itemStyle: {
            normal: { label: { show: false, position: 'insideRight' } }
          },
          data: [item.value]
        })
        this.localOptions.legend.data.push(item.name)
      })
      this.localOptions.legend.show = false
      this.localOptions.legend.formatter =
        allLength > 200
          ? function(name) {
            return echarts.format.truncateText(
                name,
                80,
                '12px Microsoft Yahei',
                '…'
              )
          }
          : null
      this.localOptions.legend.tooltip = {
        show: allLength > 200
      }
      this.localOptions.legend.top = 'bottom'

      this.chart.setOption(
        Object.assign(
          {
            color: this.chartColors
          },
          this.localOptions,
          this.options
        ),
        true
      )
      let options = this.chart.getOption()
      let colors = options.color
      this.legends = options.series.map((serie, index) => {
        this.selectedLegends[serie.name] = true
        return {
          color: colors[index],
          name: serie.name
        }
      })
      this.$nextTick(() => {
        this.chart.resize()
      })
    },
    selectLegend(legend, index) {
      this.chart.dispatchAction({
        type: 'legendToggleSelect',
        name: legend.name
      })
    }
  }
}
</script>
