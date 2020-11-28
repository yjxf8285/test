import checkTotal from '../common-check-total/common-check-total.vue'
export default {
  data() {
    return {
      chargebackQuery: {
        merchantNumber: '',
        merchantForShort: '',
        tradeCardNumber: '',
        originalTradeMoney1: '',
        originalTradeMoney2: '',
        tradeTime: '',
        startDate: '',
        resultOptions: ''
      },
      resultOptions: [
        {
          label: '商户已调账',
          value: '01'
        },
        {
          label: '扣服务商分润',
          value: '11'
        }
      ]
    }
  },
  methods: {
    open() {
      this.$notify({
        title: '查看合计',
        dangerouslyUseHTMLString: true,
        message: '采购总数量：<span style="color:rgba(64,157,255,1)">2108351</span>。实际到货总数量：<span style="color:rgba(64,157,255,1)">2065838</span>。',
        offset: 100,
        //   duration: 0
      });
    }
  },
  components: {
    checkTotal
  }
}
