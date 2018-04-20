<style lang="scss" scoped>
  .line {
    width: 50%;
    height: 100%;
  }
</style>
<template>
  <div class="line">
    <echarts
      :tooltip="tooltip"
      :legend="legend"
      :series="series"
      :loading="loading"
    />
  </div>
</template>
<script>
import Echarts from './echarts'
export default {
  name: 'epie',
  components: { Echarts },
  props: {
    data: {
      type: Object,
      required: true
    },
    legendOffsetX: {
      default: 'right'
    },
    center: {
      default: () => {
        return ['40%', '50%']
      }
    },
    loading: Boolean
  },
  computed: {
    legend () {
      return {
        orient: 'vertical',
        x: this.legendOffsetX,
        y: 'middle',
        data: this.data.points.map(m => m.name),
        formatter: function (name) {
          return name
        }
      }
    },
    tooltip () {
      return {
        trigger: 'item',
        confine: true,
        formatter: '{b}: {c} ({d}%)'
      }
    },
    series () {
      return [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          center: this.center,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: this.data.points
        }
      ]
    }
  }
}
</script>
