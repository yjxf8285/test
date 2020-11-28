export default {
  data() {
    return {
      openProduction: {
        prepaidInsurance: false,
        insuranceRate: ''
      },
      disabled: true
    }
  },
  methods: {
    writable() {
      this.disabled = !this.openProduction.prepaidInsurance
    }
  }
}
