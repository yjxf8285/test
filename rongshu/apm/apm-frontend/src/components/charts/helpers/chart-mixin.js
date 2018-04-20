export default {
  data() {
    return {
      lazyLoaded: false,
      chartColors: [
        '#a8d96f',
        '#85cae6',
        '#fab421',
        '#f38211',
        '#49a778',
        '#e66a3e',
        '#9d6858',
        '#83bc1c',
        '#4d6e83',
        '#bac1c8'
      ]
    }
  },
  props: {
    lazy: {
      type: Boolean
    }
  },
  created: function() {
    $(window).on('resize', this.change)
  },
  mounted() {
    if (this.lazy) {
      this.$nextTick(() => {
        this.$root.eventBus.addLazyloadComponent(this)
      })
    }
  },
  destroyed() {
    $(window).off('resize', this.change)
  },
  methods: {
    change() {
      if (this.chart) {
        // if(this.renderChart){
        //   this.renderChart()
        // }
        this.chart.resize()
      }
    },
    lazyLoad() {
      if (this.chart && this.lazy && !this.lazyLoaded) {
        this.$emit('lazy-load')
        this.lazyLoaded = true
      }
    }
  }
}
