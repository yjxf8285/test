<style lang="scss" scoped>
  .line {
    width: 100%;
    height: 100%;
  }
</style>
<template>
  <div class="line">
    <echarts
      :tooltip="tooltip"
      :legend="legend"
      :xAxis="direction === 'vertical' ? xAxis : yAxis"
      :yAxis="direction === 'vertical' ? yAxis : xAxis"
      :series="series"
      :loading="loading"
    />
  </div>
</template>
<script>
import Echarts from './echarts'
import utils from '_utils'
export default {
  name: 'eline',
  components: { Echarts },
  props: {
    direction: {
      type: String,
      default: 'vertical' // vertical, horizontal
    },
    type: {
      type: String,
      default: 'time' // time, catrgory
    },
    data: {
      type: Array,
      required: true
    },
    loading: Boolean
  },
  data () {
    return {}
  },
  computed: {
    legend () {
      if (this.series.length < 2) return { show: false }
      return {
        type: 'scroll',
        bottom: '0'
      }
    },
    tooltip () {
      let vm = this
      return {
        trigger: 'axis',
        confine: true,
        formatter (params) {
          let title = vm.type === 'time'
            ? utils.formatTimestamp(params[0].axisValueLabel)
            : params[0].axisValueLabel
          if (params.length > 1) { // 多条线，仅显示每条线的y轴
            return `${title}<br>` + params.map(p => {
              return `
                ${p.seriesName}: ${p.data[1]} ${vm.data[p.seriesIndex].unit || ''}<br>
              `
            }).join('')
          } else { // 单条线，则显示值及more中的信息
            let more = params[0].data.slice(2)
            return `${title}<br>` + more.map(m => {
              m = JSON.parse(m)
              return `${m.key}: ${m.value}<br>`
            }).join('')
          }
        }
      }
    },
    xAxis () {
      let vm = this
      return [{
        // 不管type为time还是category，最终都需要使用category进行渲染，因为非类目图不支持堆叠
        type: 'category',
        // 区别在于当type为time时需要格式化label
        axisLabel: {
          formatter: function (value, index) {
            if (vm.type === 'time') {
              return utils.formatTimestamp(value).replace(' ', '\n')
            } else return value
          }
        },
        boundaryGap: vm.type !== 'time' || vm.series.find(e => e.type === 'bar')
      }]
    },
    yAxis () {
      let res = []
      for (let e of this.data) {
        if (
          res.length < 2 &&
          e.axisName &&
          res.indexOf(e.axisName) === -1
        ) {
          res.push(e.axisName)
        }
      }
      if (res.length) {
        return res.map(name => ({
          type: 'value',
          name
        }))
      } else {
        return [{
          type: 'value'
        }]
      }
    },
    series () {
      return this.data.map(e => ({
        type: e.type || 'line',
        name: e.name,
        stack: e.stack || null,
        areaStyle: e.area ? {} : null,
        yAxisIndex: this.yAxis.findIndex(y => y.name === e.axisName) !== -1 ? this.yAxis.findIndex(y => y.name === e.axisName) : 0,
        data: [...e.points.map(p => [p.x, p.y].concat(p.more ? Object.keys(p.more).map(k => `{"key":"${k}","value":"${p.more[k]}"}`) : []))],
        smooth: true,
        sampling: 'average',
        barMaxWidth: '30px'
      }))
    }
  }
}
</script>
