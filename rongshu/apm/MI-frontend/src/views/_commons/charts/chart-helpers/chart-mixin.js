
export default {
  created: function () {
    window.addEventListener('resize', this.resize)
  },
  destroyed () {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    resize () {
      if (this.chart) this.chart.resize()
    }
  }
}
