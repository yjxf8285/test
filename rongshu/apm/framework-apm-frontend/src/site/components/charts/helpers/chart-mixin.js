
export default {
  data () {
    return {
      loadingInstance: null
    }
  },
  created: function () {
    window.addEventListener('resize', this.resize)
  },
  destroyed () {
    window.removeEventListener('resize', this.resize)
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
    }
  }
}
